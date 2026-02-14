package com.ceylonhomes.backend.service;

import com.ceylonhomes.backend.dto.ListingDTO;
import com.ceylonhomes.backend.dto.ListingRequest;
import com.ceylonhomes.backend.entity.Listing;
import com.ceylonhomes.backend.entity.ListingPhoto;
import com.ceylonhomes.backend.entity.User;
import com.ceylonhomes.backend.enums.ListingStatus;
import com.ceylonhomes.backend.enums.PropertyType;
import com.ceylonhomes.backend.enums.RentOrSale;
import com.ceylonhomes.backend.repository.ListingPhotoRepository;
import com.ceylonhomes.backend.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final ListingPhotoRepository listingPhotoRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public ListingDTO createListing(ListingRequest request, User owner) {
        Listing listing = new Listing();
        listing.setOwner(owner);
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setRentOrSale(request.getRentOrSale());
        listing.setPropertyType(request.getPropertyType());
        listing.setPrice(request.getPrice());
        listing.setDistrict(request.getDistrict());
        listing.setCity(request.getCity());
        listing.setAddress(request.getAddress());
        listing.setBedrooms(request.getBedrooms());
        listing.setBathrooms(request.getBathrooms());
        listing.setSize(request.getSize());
        listing.setContactPhone(request.getContactPhone());
        listing.setContactWhatsapp(request.getContactWhatsapp());
        listing.setAvailabilityStart(request.getAvailabilityStart());
        listing.setAvailabilityEnd(request.getAvailabilityEnd());
        listing.setStatus(ListingStatus.PENDING);

        Listing savedListing = listingRepository.save(listing);
        return convertToDTO(savedListing);
    }

    @Transactional
    public ListingDTO updateListing(Long listingId, ListingRequest request, User owner) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        // Check ownership
        if (!listing.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You are not authorized to edit this listing");
        }

        // Check if status is not ARCHIVED
        if (listing.getStatus() == ListingStatus.ARCHIVED) {
            throw new RuntimeException("Cannot edit archived listing");
        }

        // If listing was APPROVED and being edited, set back to PENDING
        if (listing.getStatus() == ListingStatus.APPROVED) {
            listing.setStatus(ListingStatus.PENDING);
        }

        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setRentOrSale(request.getRentOrSale());
        listing.setPropertyType(request.getPropertyType());
        listing.setPrice(request.getPrice());
        listing.setDistrict(request.getDistrict());
        listing.setCity(request.getCity());
        listing.setAddress(request.getAddress());
        listing.setBedrooms(request.getBedrooms());
        listing.setBathrooms(request.getBathrooms());
        listing.setSize(request.getSize());
        listing.setContactPhone(request.getContactPhone());
        listing.setContactWhatsapp(request.getContactWhatsapp());
        listing.setAvailabilityStart(request.getAvailabilityStart());
        listing.setAvailabilityEnd(request.getAvailabilityEnd());

        Listing updatedListing = listingRepository.save(listing);
        return convertToDTO(updatedListing);
    }

    @Transactional
    public void uploadPhotos(Long listingId, List<MultipartFile> files, User owner) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You are not authorized to upload photos for this listing");
        }

        int currentMaxOrder = listing.getPhotos().stream()
                .mapToInt(ListingPhoto::getSortOrder)
                .max()
                .orElse(-1);

        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String url = fileStorageService.storeFile(file);

            ListingPhoto photo = new ListingPhoto();
            photo.setListing(listing);
            photo.setUrl(url);
            photo.setSortOrder(currentMaxOrder + i + 1);
            listingPhotoRepository.save(photo);
        }
    }

    @Transactional
    public void deletePhoto(Long photoId, User owner) {
        ListingPhoto photo = listingPhotoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        if (!photo.getListing().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You are not authorized to delete this photo");
        }

        fileStorageService.deleteFile(photo.getUrl());
        listingPhotoRepository.delete(photo);
    }

    @Transactional
    public void markAsSold(Long listingId, User owner) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You are not authorized to modify this listing");
        }

        listing.setStatus(ListingStatus.SOLD);
        listing.setClosedAt(LocalDateTime.now());
        listingRepository.save(listing);
    }

    @Transactional
    public void markAsRented(Long listingId, User owner) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You are not authorized to modify this listing");
        }

        listing.setStatus(ListingStatus.RENTED);
        listing.setClosedAt(LocalDateTime.now());
        listingRepository.save(listing);
    }

    @Transactional
    public void archiveListing(Long listingId, User owner) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You are not authorized to archive this listing");
        }

        listing.setStatus(ListingStatus.ARCHIVED);
        listingRepository.save(listing);
    }

    public List<ListingDTO> getSellerListings(Long ownerId) {
        List<Listing> listings = listingRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
        return listings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ListingDTO getListingById(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        return convertToDTO(listing);
    }

    public Page<ListingDTO> searchListings(
            String district,
            String city,
            RentOrSale rentOrSale,
            PropertyType propertyType,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer bedrooms,
            Integer bathrooms,
            Pageable pageable
    ) {
        Page<Listing> listings = listingRepository.searchListings(
                district, city, rentOrSale, propertyType,
                minPrice, maxPrice, bedrooms, bathrooms, pageable
        );
        return listings.map(this::convertToDTO);
    }

    public Page<ListingDTO> getLatestApprovedListings(Pageable pageable) {
        Page<Listing> listings = listingRepository.findByStatus(ListingStatus.APPROVED, pageable);
        return listings.map(this::convertToDTO);
    }

    // Admin methods
    public long countByStatus(ListingStatus status) {
        return listingRepository.countByStatus(status);
    }

    public Page<ListingDTO> getListingsByStatus(ListingStatus status, Pageable pageable) {
        Page<Listing> listings = listingRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        return listings.map(this::convertToDTO);
    }

    public Page<ListingDTO> getAllListings(Pageable pageable) {
        Page<Listing> listings = listingRepository.findAll(pageable);
        return listings.map(this::convertToDTO);
    }

    public Page<ListingDTO> getAdminListings(String status, String title, String owner, Pageable pageable) {
        ListingStatus listingStatus = null;
        if (status != null && !status.isBlank()) {
            listingStatus = ListingStatus.valueOf(status.toUpperCase());
        }
        String titleFilter = (title != null && !title.isBlank()) ? title.trim() : null;
        String ownerFilter = (owner != null && !owner.isBlank()) ? owner.trim() : null;

        Page<Listing> listings = listingRepository.adminSearch(listingStatus, titleFilter, ownerFilter, pageable);
        return listings.map(this::convertToDTO);
    }

    private ListingDTO convertToDTO(Listing listing) {
        ListingDTO dto = new ListingDTO();
        dto.setId(listing.getId());
        dto.setOwnerId(listing.getOwner().getId());
        dto.setOwnerName(listing.getOwner().getName());
        dto.setOwnerEmail(listing.getOwner().getEmail());
        dto.setOwnerPhone(listing.getOwner().getPhone());
        dto.setTitle(listing.getTitle());
        dto.setDescription(listing.getDescription());
        dto.setRentOrSale(listing.getRentOrSale());
        dto.setPropertyType(listing.getPropertyType());
        dto.setPrice(listing.getPrice());
        dto.setDistrict(listing.getDistrict());
        dto.setCity(listing.getCity());
        dto.setAddress(listing.getAddress());
        dto.setBedrooms(listing.getBedrooms());
        dto.setBathrooms(listing.getBathrooms());
        dto.setSize(listing.getSize());
        dto.setContactPhone(listing.getContactPhone());
        dto.setContactWhatsapp(listing.getContactWhatsapp());
        dto.setAvailabilityStart(listing.getAvailabilityStart());
        dto.setAvailabilityEnd(listing.getAvailabilityEnd());
        dto.setStatus(listing.getStatus());
        dto.setRejectionReason(listing.getRejectionReason());
        dto.setClosedAt(listing.getClosedAt());
        dto.setCreatedAt(listing.getCreatedAt());
        dto.setUpdatedAt(listing.getUpdatedAt());

        List<String> photoUrls = listing.getPhotos().stream()
                .sorted((p1, p2) -> p1.getSortOrder().compareTo(p2.getSortOrder()))
                .map(photo -> {
                    String url = photo.getUrl();
                    // If URL doesn't start with http, prepend backend server URL
                    if (url != null && !url.startsWith("http")) {
                        return "http://localhost:8080" + url;
                    }
                    return url;
                })
                .collect(Collectors.toList());
        dto.setPhotoUrls(photoUrls);

        return dto;
    }
}
