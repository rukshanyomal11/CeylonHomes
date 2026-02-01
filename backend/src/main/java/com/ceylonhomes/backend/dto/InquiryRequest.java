package com.ceylonhomes.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InquiryRequest {

    @NotBlank(message = "Message is required")
    private String message;
}
