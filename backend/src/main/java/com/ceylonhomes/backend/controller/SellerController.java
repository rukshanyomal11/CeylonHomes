package com.ceylonhomes.backend.controller;

import com.ceylonhomes.backend.dto.*;
import com.ceylonhomes.backend.enums.ListingStatus;
import com.ceylonhomes.backend.service.SellerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
public class SellerController {

    private final SellerService sellerService;

    @GetMapping("/listings")
    public ResponseEntity<List<ListingDTO>> getMyListings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) ListingStatus status) {
        
        List<ListingDTO> listings = sellerService.getSellerListings(userDetails.getUsername(), status);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/listings/summary")
    public ResponseEntity<ListingSummaryDTO> getListingSummary(@AuthenticationPrincipal UserDetails userDetails) {
        ListingSummaryDTO summary = sellerService.getSellerListingSummary(userDetails.getUsername());
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/listings/{id}")
    public ResponseEntity<ListingDTO> getListing(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        
        List<ListingDTO> listings = sellerService.getSellerListings(userDetails.getUsername(), null);
        ListingDTO listing = listings.stream()
            .filter(l -> l.getId().equals(id))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Listing not found or you don't have access"));
        
        return ResponseEntity.ok(listing);
    }

    @PostMapping(value = "/listings", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListingDTO> createListing(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @ModelAttribute ListingCreateRequest request,
            @RequestParam(value = "photos", required = false) List<MultipartFile> photos) throws IOException {
        
        ListingDTO createdListing = sellerService.createListing(userDetails.getUsername(), request, photos);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdListing);
    }

    @PutMapping(value = "/listings/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListingDTO> updateListing(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @ModelAttribute ListingUpdateRequest request,
            @RequestParam(value = "photos", required = false) List<MultipartFile> photos) throws IOException {
        
        ListingDTO updatedListing = sellerService.updateListing(userDetails.getUsername(), id, request, photos);
        return ResponseEntity.ok(updatedListing);
    }

    @PostMapping("/listings/{id}/mark-sold")
    public ResponseEntity<Void> markAsSold(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        
        sellerService.markAsSold(userDetails.getUsername(), id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/listings/{id}/mark-rented")
    public ResponseEntity<Void> markAsRented(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        
        sellerService.markAsRented(userDetails.getUsername(), id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/listings/{id}/archive")
    public ResponseEntity<Void> archiveListing(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        
        sellerService.archiveListing(userDetails.getUsername(), id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/listings/{id}")
    public ResponseEntity<Void> deleteListing(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) throws IOException {
        
        sellerService.deleteListing(userDetails.getUsername(), id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/listings/photos/{photoId}")
    public ResponseEntity<Void> deletePhoto(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long photoId) throws IOException {
        
        sellerService.deleteListingPhoto(userDetails.getUsername(), photoId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/inquiries")
    public ResponseEntity<List<SellerInquiryDTO>> getMyInquiries(@AuthenticationPrincipal UserDetails userDetails) {
        List<SellerInquiryDTO> inquiries = sellerService.getSellerInquiries(userDetails.getUsername());
        return ResponseEntity.ok(inquiries);
    }

    @GetMapping("/inquiries/recent")
    public ResponseEntity<List<SellerInquiryDTO>> getRecentInquiries(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "5") int limit) {
        
        List<SellerInquiryDTO> inquiries = sellerService.getRecentInquiries(userDetails.getUsername(), limit);
        return ResponseEntity.ok(inquiries);
    }
}
