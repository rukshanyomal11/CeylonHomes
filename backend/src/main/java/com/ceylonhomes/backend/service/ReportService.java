package com.ceylonhomes.backend.service;

import com.ceylonhomes.backend.dto.ReportDTO;
import com.ceylonhomes.backend.entity.Listing;
import com.ceylonhomes.backend.entity.Report;
import com.ceylonhomes.backend.entity.User;
import com.ceylonhomes.backend.enums.ReportStatus;
import com.ceylonhomes.backend.repository.ListingRepository;
import com.ceylonhomes.backend.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final ListingRepository listingRepository;

    @Transactional
    public ReportDTO createReport(Long listingId, String reason, String details, User reporter) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        Report report = new Report();
        report.setListing(listing);
        report.setReporter(reporter);
        report.setReason(reason);
        report.setDetails(details);
        report.setStatus(ReportStatus.OPEN);

        Report savedReport = reportRepository.save(report);
        return convertToDTO(savedReport);
    }

    public List<ReportDTO> getOpenReports() {
        List<Report> reports = reportRepository.findByStatusOrderByCreatedAtDesc(ReportStatus.OPEN);
        return reports.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ReportDTO> getAllReports() {
        List<Report> reports = reportRepository.findAll();
        return reports.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsReviewed(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(ReportStatus.REVIEWED);
        reportRepository.save(report);
    }

    @Transactional
    public void markAsClosed(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(ReportStatus.CLOSED);
        reportRepository.save(report);
    }

    public long countOpenReports() {
        return reportRepository.countByStatus(ReportStatus.OPEN);
    }

    private ReportDTO convertToDTO(Report report) {
        ReportDTO dto = new ReportDTO();
        dto.setId(report.getId());
        dto.setListingId(report.getListing().getId());
        dto.setListingTitle(report.getListing().getTitle());
        dto.setReporterId(report.getReporter().getId());
        dto.setReporterName(report.getReporter().getName());
        dto.setReporterEmail(report.getReporter().getEmail());
        dto.setReason(report.getReason());
        dto.setDetails(report.getDetails());
        dto.setStatus(report.getStatus());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }
}
