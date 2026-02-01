package com.ceylonhomes.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReportRequest {

    @NotBlank(message = "Reason is required")
    @Size(max = 120, message = "Reason must not exceed 120 characters")
    private String reason;

    private String details;
}
