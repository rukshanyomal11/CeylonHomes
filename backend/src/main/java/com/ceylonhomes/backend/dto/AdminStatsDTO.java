package com.ceylonhomes.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDTO {
    private long pendingCount;
    private long approvedCount;
    private long rejectedCount;
    private long suspendedCount;
    private long openReportsCount;
}
