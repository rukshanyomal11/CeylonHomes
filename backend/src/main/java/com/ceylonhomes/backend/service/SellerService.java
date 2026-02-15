package com.ceylonhomes.backend.service;

import com.ceylonhomes.backend.dto.*;
import com.ceylonhomes.backend.entity.Inquiry;
import com.ceylonhomes.backend.entity.Listing;
import com.ceylonhomes.backend.entity.ListingPhoto;
import com.ceylonhomes.backend.entity.User;
import com.ceylonhomes.backend.enums.ListingStatus;
import com.ceylonhomes.backend.repository.InquiryRepository;
import com.ceylonhomes.backend.repository.ListingPhotoRepository;
import com.ceylonhomes.backend.repository.ListingRepository;
import com.ceylonhomes.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerService {

    private final ListingRepository listingRepository;
    private final ListingPhotoRepository listingPhotoRepository;
    private final InquiryRepository inquiryRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final EmailService emailService;

    private static final String UPLOAD_DIR = "uploads/listings/";

    @Transactional(readOnly = true)
    public List<ListingDTO> getSellerListings(String email, ListingStatus status) {
        User seller = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Seller not found"));

        List<Listing> listings;
        if (status != null) {
            listings = listingRepository.findByOwnerIdOrderByCreatedAtDesc(seller.getId())
                .stream()
                .filter(l -> l.getStatus() == status)
                .collect(Collectors.toList());
        } else {
            listings = listingRepository.findByOwnerIdOrderByCreatedAtDesc(seller.getId());
        }

        return listings.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ListingDTO> getSellerListingsPaginated(String email, ListingStatus status, int page, int size) {
        User seller = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Seller not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<Listing> listingPage;
        if (status != null) {
            listingPage = listingRepository.findByStatus(status, pageable);
            // Filter by owner
            listingPage = listingPage.map(l -> l.getOwner().getId().equals(seller.getId()) ? l : null);
        } else {
            // Get all seller's listings - we need to implement this method in repository
            List<Listing> allListings = listingRepository.findByOwnerIdOrderByCreatedAtDesc(seller.getId());
            // For now, return all as we don't have paginated method for owner
            listingPage = listingRepository.findAll(pageable)
                .map(l -> l.getOwner().getId().equals(seller.getId()) ? l : null);
        }

        return listingPage.map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public ListingSummaryDTO getSellerListingSummary(String email) {
        User seller = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Seller not found"));

        List<Listing> allListings = listingRepository.findByOwnerIdOrderByCreatedAtDesc(seller.getId());

        long pending = allListings.stream().filter(l -> l.getStatus() == ListingStatus.PENDING).count();
        long approved = allListings.stream().filter(l -> l.getStatus() == ListingStatus.APPROVED).count();
        long rejected = allListings.stream().filter(l -> l.getStatus() == ListingStatus.REJECTED).count();
        long sold = allListings.stream().filter(l -> l.getStatus() == ListingStatus.SOLD).count();
        long rented = allListings.stream().filter(l -> l.getStatus() == ListingStatus.RENTED).count();
        long archived = allListings.stream().filter(l -> l.getStatus() == ListingStatus.ARCHIVED).count();

        return new ListingSummaryDTO(pending, approved, rejected, sold, rented, archived);
    }

    @Transactional
    public ListingDTO createListing(String email, ListingCreateRequest request, List<MultipartFile> photos) throws IOException {
        User seller = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Seller not found"));

        Listing listing = new Listing();
        listing.setOwner(seller);
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

        // Save photos
        if (photos != null && !photos.isEmpty()) {
            saveListingPhotos(savedListing, photos);
        }

        emailService.sendNewListingNotification(savedListing);

        return convertToDTO(savedListing);
    }

    @Transactional
    public ListingDTO updateListing(String email, Long listingId, ListingUpdateRequest request, List<MultipartFile> newPhotos) throws IOException {
        Listing listing = listingRepository.findById(listingId)
            .orElseThrow(() -> new RuntimeException("Listing not found"));

        // Verify ownership
        if (!listing.getOwner().getEmail().equals(email)) {
            throw new AccessDeniedException("You can only update your own listings");
        }

        ListingStatus oldStatus = listing.getStatus();

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

        // If listing was APPROVED and seller edits it, set back to PENDING
        if (oldStatus == ListingStatus.APPROVED) {
            listing.setStatus(ListingStatus.PENDING);
        }

        Listing updatedListing = listingRepository.save(listing);

        emailService.sendListingUpdatedNotification(updatedListing);

        // Add new photos if provided
        if (newPhotos != null && !newPhotos.isEmpty()) {
            saveListingPhotos(updatedListing, newPhotos);
        }

        return convertToDTO(updatedListing);
    }

    @Transactional
    public void markAsSold(String email, Long listingId) {
        Listing listing = listingRepository.findById(listingId)
            .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getOwner().getEmail().equals(email)) {
            throw new AccessDeniedException("You can only mark your own listings as sold");
        }

        if (listing.getStatus() != ListingStatus.APPROVED) {
            throw new IllegalStateException("Only approved listings can be marked as sold");
        }

        listing.setStatus(ListingStatus.SOLD);
        listing.setClosedAt(LocalDateTime.now());
        listingRepository.save(listing);
    }

    @Transactional
    public void markAsRented(String email, Long listingId) {
        Listing listing = listingRepository.findById(listingId)
            .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getOwner().getEmail().equals(email)) {
            throw new AccessDeniedException("You can only mark your own listings as rented");
        }

        if (listing.getStatus() != ListingStatus.APPROVED) {
            throw new IllegalStateException("Only approved listings can be marked as rented");
        }

        listing.setStatus(ListingStatus.RENTED);
        listing.setClosedAt(LocalDateTime.now());
        listingRepository.save(listing);
    }

    @Transactional
    public void archiveListing(String email, Long listingId) {
        Listing listing = listingRepository.findById(listingId)
            .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getOwner().getEmail().equals(email)) {
            throw new AccessDeniedException("You can only archive your own listings");
        }

        listing.setStatus(ListingStatus.ARCHIVED);
        listingRepository.save(listing);
    }

    @Transactional
    public void deleteListing(String email, Long listingId) throws IOException {
        Listing listing = listingRepository.findById(listingId)
            .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getOwner().getEmail().equals(email)) {
            throw new AccessDeniedException("You can only delete your own listings");
        }

        // Delete all photos from filesystem
        for (ListingPhoto photo : listing.getPhotos()) {
            fileStorageService.deleteFile(photo.getUrl());
        }

        // Delete the listing (this will cascade delete photos and inquiries)
        listingRepository.delete(listing);
    }

    @Transactional
    public void deleteListingPhoto(String email, Long photoId) throws IOException {
        ListingPhoto photo = listingPhotoRepository.findById(photoId)
            .orElseThrow(() -> new RuntimeException("Photo not found"));

        Listing listing = photo.getListing();
        if (!listing.getOwner().getEmail().equals(email)) {
            throw new AccessDeniedException("You can only delete photos from your own listings");
        }

        // Delete file from filesystem
        Path filePath = Paths.get(photo.getUrl());
        Files.deleteIfExists(filePath);

        listingPhotoRepository.delete(photo);
    }

    @Transactional(readOnly = true)
    public List<SellerInquiryDTO> getSellerInquiries(String email) {
        User seller = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Seller not found"));

        List<Inquiry> inquiries = inquiryRepository.findByListingOwnerIdOrderByCreatedAtDesc(seller.getId());

        return inquiries.stream()
            .map(this::convertInquiryToDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SellerInquiryDTO> getRecentInquiries(String email, int limit) {
        List<SellerInquiryDTO> allInquiries = getSellerInquiries(email);
        return allInquiries.stream()
            .limit(limit)
            .collect(Collectors.toList());
    }

    // Helper methods
    private void saveListingPhotos(Listing listing, List<MultipartFile> photos) throws IOException {
        int sortOrder = 0;
        for (MultipartFile photo : photos) {
            if (!photo.isEmpty()) {
                // Use FileStorageService to store the file
                String photoUrl = fileStorageService.storeFile(photo);

                ListingPhoto listingPhoto = new ListingPhoto();
                listingPhoto.setListing(listing);
                listingPhoto.setUrl(photoUrl);
                listingPhoto.setSortOrder(sortOrder++);
                listingPhotoRepository.save(listingPhoto);
            }
        }
    }

    private ListingDTO convertToDTO(Listing listing) {
        ListingDTO dto = new ListingDTO();
        dto.setId(listing.getId());
        dto.setOwnerId(listing.getOwner().getId());
        dto.setOwnerName(listing.getOwner().getName());
        dto.setOwnerEmail(listing.getOwner().getEmail());
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

    private SellerInquiryDTO convertInquiryToDTO(Inquiry inquiry) {
        SellerInquiryDTO dto = new SellerInquiryDTO();
        dto.setId(inquiry.getId());
        dto.setListingId(inquiry.getListing().getId());
        dto.setListingTitle(inquiry.getListing().getTitle());
        dto.setBuyerName(inquiry.getBuyer().getName());
        dto.setBuyerEmail(inquiry.getBuyer().getEmail());
        dto.setBuyerPhone(inquiry.getBuyer().getPhone());
        dto.setMessage(inquiry.getMessage());
        dto.setCreatedAt(inquiry.getCreatedAt());
        return dto;
    }
}
