package com.ceylonhomes.backend.service;

import com.ceylonhomes.backend.dto.ApprovalActionDTO;
import com.ceylonhomes.backend.dto.ListingDTO;
import com.ceylonhomes.backend.entity.ApprovalAction;
import com.ceylonhomes.backend.entity.Listing;
import com.ceylonhomes.backend.entity.User;
import com.ceylonhomes.backend.enums.ApprovalActionType;
import com.ceylonhomes.backend.enums.ListingStatus;
import com.ceylonhomes.backend.repository.ApprovalActionRepository;
import com.ceylonhomes.backend.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ListingRepository listingRepository;
    private final ApprovalActionRepository approvalActionRepository;
    private final ListingService listingService;

    public Page<ListingDTO> getPendingListings(Pageable pageable) {
        Page<Listing> listings = listingRepository.findByStatusOrderByCreatedAtDesc(ListingStatus.PENDING, pageable);
        return listings.map(listing -> listingService.getListingById(listing.getId()));
    }

    @Transactional
    public void approveListing(Long listingId, User admin, String note) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        listing.setStatus(ListingStatus.APPROVED);
        listing.setRejectionReason(null);
        listingRepository.save(listing);

        // Record approval action
        ApprovalAction action = new ApprovalAction();
        action.setListing(listing);
        action.setAdmin(admin);
        action.setAction(ApprovalActionType.APPROVED);
        action.setNote(note);
        approvalActionRepository.save(action);
    }

    @Transactional
    public void rejectListing(Long listingId, User admin, String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new RuntimeException("Rejection reason is required");
        }

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        listing.setStatus(ListingStatus.REJECTED);
        listing.setRejectionReason(reason);
        listingRepository.save(listing);

        // Record rejection action
        ApprovalAction action = new ApprovalAction();
        action.setListing(listing);
        action.setAdmin(admin);
        action.setAction(ApprovalActionType.REJECTED);
        action.setNote(reason);
        approvalActionRepository.save(action);
    }

    @Transactional
    public void suspendListing(Long listingId, User admin, String reason) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        listing.setStatus(ListingStatus.SUSPENDED);
        listing.setRejectionReason(reason);
        listingRepository.save(listing);

        // Record suspension action
        ApprovalAction action = new ApprovalAction();
        action.setListing(listing);
        action.setAdmin(admin);
        action.setAction(ApprovalActionType.SUSPENDED);
        action.setNote(reason);
        approvalActionRepository.save(action);
    }

    @Transactional
    public void unsuspendListing(Long listingId, User admin, String note) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        listing.setStatus(ListingStatus.APPROVED);
        listing.setRejectionReason(null);
        listingRepository.save(listing);

        // Record unsuspension action
        ApprovalAction action = new ApprovalAction();
        action.setListing(listing);
        action.setAdmin(admin);
        action.setAction(ApprovalActionType.UNSUSPENDED);
        action.setNote(note);
        approvalActionRepository.save(action);
    }

    public Page<ApprovalActionDTO> getApprovalHistory(Pageable pageable) {
        return approvalActionRepository
                .findAllByOrderByCreatedAtDesc(pageable)
                .map(this::convertToDTO);
    }

    public List<ApprovalActionDTO> getListingApprovalHistory(Long listingId) {
        List<ApprovalAction> actions = approvalActionRepository.findByListingIdOrderByCreatedAtDesc(listingId);
        return actions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ApprovalActionDTO convertToDTO(ApprovalAction action) {
        ApprovalActionDTO dto = new ApprovalActionDTO();
        dto.setId(action.getId());
        dto.setListingId(action.getListing().getId());
        dto.setListingTitle(action.getListing().getTitle());
        dto.setAdminId(action.getAdmin().getId());
        dto.setAdminName(action.getAdmin().getName());
        dto.setAction(action.getAction());
        dto.setNote(action.getNote());
        dto.setCreatedAt(action.getCreatedAt());
        return dto;
    }
}
