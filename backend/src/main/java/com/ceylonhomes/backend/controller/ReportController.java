package com.ceylonhomes.backend.controller;

import com.ceylonhomes.backend.dto.ReportDTO;
import com.ceylonhomes.backend.dto.ReportRequest;
import com.ceylonhomes.backend.entity.User;
import com.ceylonhomes.backend.service.ReportService;
import com.ceylonhomes.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final UserService userService;

    @PostMapping("/listing/{listingId}")
    public ResponseEntity<ReportDTO> createReport(
            @PathVariable Long listingId,
            @Valid @RequestBody ReportRequest request,
            Authentication authentication) {
        User reporter = userService.getUserByEmail(authentication.getName());
        ReportDTO report = reportService.createReport(
                listingId,
                request.getReason(),
                request.getDetails(),
                reporter
        );
        return ResponseEntity.ok(report);
    }
}
