package com.ceylonhomes.backend.repository;

import com.ceylonhomes.backend.entity.ApprovalAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalActionRepository extends JpaRepository<ApprovalAction, Long> {
    
    List<ApprovalAction> findByListingIdOrderByCreatedAtDesc(Long listingId);
    
    List<ApprovalAction> findAllByOrderByCreatedAtDesc();

    Page<ApprovalAction> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
