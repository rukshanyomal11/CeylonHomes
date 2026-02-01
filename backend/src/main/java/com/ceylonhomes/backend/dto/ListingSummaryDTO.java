package com.ceylonhomes.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListingSummaryDTO {
    private Long pending;
    private Long approved;
    private Long rejected;
    private Long sold;
    private Long rented;
    private Long archived;
}
