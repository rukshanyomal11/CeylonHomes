package com.ceylonhomes.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApprovalRequest {

    @NotBlank(message = "Action is required (APPROVE or REJECT)")
    private String action; // APPROVE or REJECT

    private String note;
}
