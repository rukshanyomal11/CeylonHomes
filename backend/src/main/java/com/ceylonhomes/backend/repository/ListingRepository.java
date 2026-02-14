package com.ceylonhomes.backend.repository;

import com.ceylonhomes.backend.entity.Listing;
import com.ceylonhomes.backend.enums.ListingStatus;
import com.ceylonhomes.backend.enums.PropertyType;
import com.ceylonhomes.backend.enums.RentOrSale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {
    
    // Find listings by owner
    List<Listing> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    
    // Find listings by status
    Page<Listing> findByStatusOrderByCreatedAtDesc(ListingStatus status, Pageable pageable);

    // Admin search with optional filters
    @Query("SELECT l FROM Listing l WHERE " +
           "(:status IS NULL OR l.status = :status) " +
           "AND (:title IS NULL OR LOWER(l.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
           "AND (:owner IS NULL OR LOWER(l.owner.name) LIKE LOWER(CONCAT('%', :owner, '%')) " +
           "OR LOWER(l.owner.email) LIKE LOWER(CONCAT('%', :owner, '%')))")
    Page<Listing> adminSearch(
        @Param("status") ListingStatus status,
        @Param("title") String title,
        @Param("owner") String owner,
        Pageable pageable
    );
    
    // Count by status
    long countByStatus(ListingStatus status);
    
    // Public search - only APPROVED listings
    @Query("SELECT l FROM Listing l WHERE l.status = 'APPROVED' " +
           "AND (:district IS NULL OR l.district = :district) " +
           "AND (:city IS NULL OR l.city = :city) " +
           "AND (:rentOrSale IS NULL OR l.rentOrSale = :rentOrSale) " +
           "AND (:propertyType IS NULL OR l.propertyType = :propertyType) " +
           "AND (:minPrice IS NULL OR l.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR l.price <= :maxPrice) " +
           "AND (:bedrooms IS NULL OR l.bedrooms >= :bedrooms) " +
           "AND (:bathrooms IS NULL OR l.bathrooms >= :bathrooms)")
    Page<Listing> searchListings(
        @Param("district") String district,
        @Param("city") String city,
        @Param("rentOrSale") RentOrSale rentOrSale,
        @Param("propertyType") PropertyType propertyType,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("bedrooms") Integer bedrooms,
        @Param("bathrooms") Integer bathrooms,
        Pageable pageable
    );
    
    // Latest approved listings
    Page<Listing> findByStatus(ListingStatus status, Pageable pageable);
}
