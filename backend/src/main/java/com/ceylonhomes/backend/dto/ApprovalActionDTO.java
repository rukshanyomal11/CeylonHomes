package com.ceylonhomes.backend.dto;

import com.ceylonhomes.backend.enums.ApprovalActionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalActionDTO {
    
    private Long id;
    private Long listingId;
    private String listingTitle;
    private Long adminId;
    private String adminName;
    private ApprovalActionType action;
    private String note;
    private LocalDateTime createdAt;
}
