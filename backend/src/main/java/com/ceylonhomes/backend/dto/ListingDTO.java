package com.ceylonhomes.backend.dto;

import com.ceylonhomes.backend.enums.ListingStatus;
import com.ceylonhomes.backend.enums.PropertyType;
import com.ceylonhomes.backend.enums.RentOrSale;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListingDTO {
    
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private String ownerPhone;
    private String title;
    private String description;
    private RentOrSale rentOrSale;
    private PropertyType propertyType;
    private BigDecimal price;
    private String district;
    private String city;
    private String address;
    private Integer bedrooms;
    private Integer bathrooms;
    private String size;
    private String contactPhone;
    private String contactWhatsapp;
    private LocalDate availabilityStart;
    private LocalDate availabilityEnd;
    private ListingStatus status;
    private String rejectionReason;
    private LocalDateTime closedAt;
    private List<String> photoUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
