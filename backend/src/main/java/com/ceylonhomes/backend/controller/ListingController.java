package com.ceylonhomes.backend.controller;

import com.ceylonhomes.backend.dto.ListingDTO;
import com.ceylonhomes.backend.dto.ListingRequest;
import com.ceylonhomes.backend.entity.User;
import com.ceylonhomes.backend.enums.PropertyType;
import com.ceylonhomes.backend.enums.RentOrSale;
import com.ceylonhomes.backend.service.ListingService;
import com.ceylonhomes.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ListingDTO> createListing(
            @Valid @RequestBody ListingRequest request,
            Authentication authentication) {
        User owner = userService.getUserByEmail(authentication.getName());
        ListingDTO listing = listingService.createListing(request, owner);
        return ResponseEntity.ok(listing);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingDTO> updateListing(
            @PathVariable Long id,
            @Valid @RequestBody ListingRequest request,
            Authentication authentication) {
        User owner = userService.getUserByEmail(authentication.getName());
        ListingDTO listing = listingService.updateListing(id, request, owner);
        return ResponseEntity.ok(listing);
    }

    @PostMapping("/{id}/photos")
    public ResponseEntity<Map<String, String>> uploadPhotos(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files,
            Authentication authentication) {
        User owner = userService.getUserByEmail(authentication.getName());
        listingService.uploadPhotos(id, files, owner);
        return ResponseEntity.ok(Map.of("message", "Photos uploaded successfully"));
    }

    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<Map<String, String>> deletePhoto(
            @PathVariable Long photoId,
            Authentication authentication) {
        User owner = userService.getUserByEmail(authentication.getName());
        listingService.deletePhoto(photoId, owner);
        return ResponseEntity.ok(Map.of("message", "Photo deleted successfully"));
    }

    @PatchMapping("/{id}/sold")
    public ResponseEntity<Map<String, String>> markAsSold(
            @PathVariable Long id,
            Authentication authentication) {
        User owner = userService.getUserByEmail(authentication.getName());
        listingService.markAsSold(id, owner);
        return ResponseEntity.ok(Map.of("message", "Listing marked as sold"));
    }

    @PatchMapping("/{id}/rented")
    public ResponseEntity<Map<String, String>> markAsRented(
            @PathVariable Long id,
            Authentication authentication) {
        User owner = userService.getUserByEmail(authentication.getName());
        listingService.markAsRented(id, owner);
        return ResponseEntity.ok(Map.of("message", "Listing marked as rented"));
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<Map<String, String>> archiveListing(
            @PathVariable Long id,
            Authentication authentication) {
        User owner = userService.getUserByEmail(authentication.getName());
        listingService.archiveListing(id, owner);
        return ResponseEntity.ok(Map.of("message", "Listing archived successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingDTO> getListingById(@PathVariable Long id) {
        ListingDTO listing = listingService.getListingById(id);
        return ResponseEntity.ok(listing);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ListingDTO>> searchListings(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) RentOrSale rentOrSale,
            @RequestParam(required = false) PropertyType propertyType,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) Integer bathrooms,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<ListingDTO> listings = listingService.searchListings(
                district, city, rentOrSale, propertyType,
                minPrice, maxPrice, bedrooms, bathrooms, pageable
        );
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/latest")
    public ResponseEntity<Page<ListingDTO>> getLatestListings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ListingDTO> listings = listingService.getLatestApprovedListings(pageable);
        return ResponseEntity.ok(listings);
    }
}
