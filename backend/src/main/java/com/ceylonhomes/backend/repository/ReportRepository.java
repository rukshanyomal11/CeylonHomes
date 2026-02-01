package com.ceylonhomes.backend.repository;

import com.ceylonhomes.backend.entity.Report;
import com.ceylonhomes.backend.enums.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByStatusOrderByCreatedAtDesc(ReportStatus status);
    
    long countByStatus(ReportStatus status);
    
    List<Report> findByListingIdOrderByCreatedAtDesc(Long listingId);
}
