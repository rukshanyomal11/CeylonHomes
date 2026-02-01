package com.ceylonhomes.backend.dto;

import com.ceylonhomes.backend.enums.PropertyType;
import com.ceylonhomes.backend.enums.RentOrSale;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListingUpdateRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Rent or Sale is required")
    private RentOrSale rentOrSale;

    @NotNull(message = "Property type is required")
    private PropertyType propertyType;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotBlank(message = "District is required")
    @Size(max = 80, message = "District must not exceed 80 characters")
    private String district;

    @NotBlank(message = "City is required")
    @Size(max = 80, message = "City must not exceed 80 characters")
    private String city;

    @NotBlank(message = "Address is required")
    private String address;

    @Min(value = 0, message = "Bedrooms cannot be negative")
    private Integer bedrooms = 0;

    @Min(value = 0, message = "Bathrooms cannot be negative")
    private Integer bathrooms = 0;

    @Size(max = 50, message = "Size must not exceed 50 characters")
    private String size;

    @NotBlank(message = "Contact phone is required")
    @Size(max = 30, message = "Contact phone must not exceed 30 characters")
    private String contactPhone;

    @Size(max = 30, message = "Contact WhatsApp must not exceed 30 characters")
    private String contactWhatsapp;

    private LocalDate availabilityStart;

    private LocalDate availabilityEnd;
}
