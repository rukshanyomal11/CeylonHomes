package com.ceylonhomes.backend.repository;

import com.ceylonhomes.backend.entity.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    
    // Find all inquiries for a listing
    List<Inquiry> findByListingIdOrderByCreatedAtDesc(Long listingId);
    
    // Find all inquiries for listings owned by a specific seller
    List<Inquiry> findByListingOwnerIdOrderByCreatedAtDesc(Long ownerId);
}
