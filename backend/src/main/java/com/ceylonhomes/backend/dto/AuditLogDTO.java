package com.ceylonhomes.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDTO {
    private Long id;
    private Long listingId;
    private String listingTitle;
    private String action;
    private String adminName;
    private String note;
    private LocalDateTime createdAt;
}
