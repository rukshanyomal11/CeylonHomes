package com.ceylonhomes.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InquiryDTO {
    
    private Long id;
    private Long listingId;
    private String listingTitle;
    private Long buyerId;
    private String buyerName;
    private String buyerEmail;
    private String buyerPhone;
    private String message;
    private LocalDateTime createdAt;
}
