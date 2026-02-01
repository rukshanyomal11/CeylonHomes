package com.ceylonhomes.backend.dto;

import com.ceylonhomes.backend.enums.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportDTO {
    
    private Long id;
    private Long listingId;
    private String listingTitle;
    private Long reporterId;
    private String reporterName;
    private String reporterEmail;
    private String reason;
    private String details;
    private ReportStatus status;
    private LocalDateTime createdAt;
}
