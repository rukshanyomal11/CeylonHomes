package com.ceylonhomes.backend.service;

import com.ceylonhomes.backend.dto.InquiryDTO;
import com.ceylonhomes.backend.entity.Inquiry;
import com.ceylonhomes.backend.entity.Listing;
import com.ceylonhomes.backend.entity.User;
import com.ceylonhomes.backend.repository.InquiryRepository;
import com.ceylonhomes.backend.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final ListingRepository listingRepository;

    @Transactional
    public InquiryDTO createInquiry(Long listingId, String message, User buyer) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        Inquiry inquiry = new Inquiry();
        inquiry.setListing(listing);
        inquiry.setBuyer(buyer);
        inquiry.setMessage(message);

        Inquiry savedInquiry = inquiryRepository.save(inquiry);
        return convertToDTO(savedInquiry);
    }

    public List<InquiryDTO> getSellerInquiries(Long sellerId) {
        List<Inquiry> inquiries = inquiryRepository.findByListingOwnerIdOrderByCreatedAtDesc(sellerId);
        return inquiries.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InquiryDTO> getListingInquiries(Long listingId, User owner) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You are not authorized to view inquiries for this listing");
        }

        List<Inquiry> inquiries = inquiryRepository.findByListingIdOrderByCreatedAtDesc(listingId);
        return inquiries.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private InquiryDTO convertToDTO(Inquiry inquiry) {
        InquiryDTO dto = new InquiryDTO();
        dto.setId(inquiry.getId());
        dto.setListingId(inquiry.getListing().getId());
        dto.setListingTitle(inquiry.getListing().getTitle());
        dto.setBuyerId(inquiry.getBuyer().getId());
        dto.setBuyerName(inquiry.getBuyer().getName());
        dto.setBuyerEmail(inquiry.getBuyer().getEmail());
        dto.setBuyerPhone(inquiry.getBuyer().getPhone());
        dto.setMessage(inquiry.getMessage());
        dto.setCreatedAt(inquiry.getCreatedAt());
        return dto;
    }
}
