package com.ceylonhomes.backend.controller;

import com.ceylonhomes.backend.dto.InquiryDTO;
import com.ceylonhomes.backend.dto.InquiryRequest;
import com.ceylonhomes.backend.entity.User;
import com.ceylonhomes.backend.service.InquiryService;
import com.ceylonhomes.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;
    private final UserService userService;

    @PostMapping("/listing/{listingId}")
    public ResponseEntity<InquiryDTO> createInquiry(
            @PathVariable Long listingId,
            @Valid @RequestBody InquiryRequest request,
            Authentication authentication) {
        User buyer = userService.getUserByEmail(authentication.getName());
        InquiryDTO inquiry = inquiryService.createInquiry(listingId, request.getMessage(), buyer);
        return ResponseEntity.ok(inquiry);
    }

    @GetMapping("/seller")
    public ResponseEntity<List<InquiryDTO>> getSellerInquiries(Authentication authentication) {
        User seller = userService.getUserByEmail(authentication.getName());
        List<InquiryDTO> inquiries = inquiryService.getSellerInquiries(seller.getId());
        return ResponseEntity.ok(inquiries);
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<List<InquiryDTO>> getListingInquiries(
            @PathVariable Long listingId,
            Authentication authentication) {
        User owner = userService.getUserByEmail(authentication.getName());
        List<InquiryDTO> inquiries = inquiryService.getListingInquiries(listingId, owner);
        return ResponseEntity.ok(inquiries);
    }
}
