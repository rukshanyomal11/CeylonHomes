package com.ceylonhomes.backend.controller;

import com.ceylonhomes.backend.dto.*;
import com.ceylonhomes.backend.entity.User;
import com.ceylonhomes.backend.enums.ListingStatus;
import com.ceylonhomes.backend.service.AdminService;
import com.ceylonhomes.backend.service.ReportService;
import com.ceylonhomes.backend.service.UserService;
import com.ceylonhomes.backend.service.ListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ReportService reportService;
    private final UserService userService;
    private final ListingService listingService;

    // Statistics Overview
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getAdminStats() {
        AdminStatsDTO stats = new AdminStatsDTO(
            listingService.countByStatus(ListingStatus.PENDING),
            listingService.countByStatus(ListingStatus.APPROVED),
            listingService.countByStatus(ListingStatus.REJECTED),
            listingService.countByStatus(ListingStatus.SUSPENDED),
            reportService.countOpenReports()
        );
        return ResponseEntity.ok(stats);
    }

    // Listings Management
    @GetMapping("/listings")
    public ResponseEntity<Page<ListingDTO>> getListings(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ListingDTO> listings;
        
        if (status != null && !status.isEmpty()) {
            ListingStatus listingStatus = ListingStatus.valueOf(status.toUpperCase());
            listings = listingService.getListingsByStatus(listingStatus, pageable);
        } else {
            listings = listingService.getAllListings(pageable);
        }
        
        return ResponseEntity.ok(listings);
    }

    @PostMapping("/listings/{id}/approve")
    public ResponseEntity<Map<String, String>> approveListing(
            @PathVariable Long id,
            @Valid @RequestBody ApprovalRequest request,
            Authentication authentication) {
        User admin = userService.getUserByEmail(authentication.getName());
        adminService.approveListing(id, admin, request.getNote());
        return ResponseEntity.ok(Map.of("message", "Listing approved successfully"));
    }

    @PostMapping("/listings/{id}/reject")
    public ResponseEntity<Map<String, String>> rejectListing(
            @PathVariable Long id,
            @Valid @RequestBody ApprovalRequest request,
            Authentication authentication) {
        User admin = userService.getUserByEmail(authentication.getName());
        adminService.rejectListing(id, admin, request.getNote());
        return ResponseEntity.ok(Map.of("message", "Listing rejected successfully"));
    }

    @PostMapping("/listings/{id}/suspend")
    public ResponseEntity<Map<String, String>> suspendListing(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication) {
        User admin = userService.getUserByEmail(authentication.getName());
        String reason = body != null ? body.get("reason") : null;
        adminService.suspendListing(id, admin, reason);
        return ResponseEntity.ok(Map.of("message", "Listing suspended successfully"));
    }

    @PostMapping("/listings/{id}/unsuspend")
    public ResponseEntity<Map<String, String>> unsuspendListing(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication) {
        User admin = userService.getUserByEmail(authentication.getName());
        String note = body != null ? body.get("note") : null;
        adminService.unsuspendListing(id, admin, note);
        return ResponseEntity.ok(Map.of("message", "Listing unsuspended successfully"));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportDTO>> getAllReports() {
        List<ReportDTO> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/open")
    public ResponseEntity<List<ReportDTO>> getOpenReports() {
        List<ReportDTO> reports = reportService.getOpenReports();
        return ResponseEntity.ok(reports);
    }

    @PatchMapping("/reports/{id}/reviewed")
    public ResponseEntity<Map<String, String>> markReportAsReviewed(@PathVariable Long id) {
        reportService.markAsReviewed(id);
        return ResponseEntity.ok(Map.of("message", "Report marked as reviewed"));
    }

    @PatchMapping("/reports/{id}/closed")
    public ResponseEntity<Map<String, String>> markReportAsClosed(@PathVariable Long id) {
        reportService.markAsClosed(id);
        return ResponseEntity.ok(Map.of("message", "Report closed successfully"));
    }

    @GetMapping("/approval-actions")
    public ResponseEntity<List<ApprovalActionDTO>> getApprovalHistory() {
        List<ApprovalActionDTO> actions = adminService.getApprovalHistory();
        return ResponseEntity.ok(actions);
    }

    @GetMapping("/approval-actions/listing/{listingId}")
    public ResponseEntity<List<ApprovalActionDTO>> getListingApprovalHistory(@PathVariable Long listingId) {
        List<ApprovalActionDTO> actions = adminService.getListingApprovalHistory(listingId);
        return ResponseEntity.ok(actions);
    }
}
