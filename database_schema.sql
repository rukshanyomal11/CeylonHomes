-- =====================================================
-- CeylonHomes Database Schema
-- MySQL 8.0+ Database Setup Script
-- =====================================================
-- 
-- USAGE:
-- 1. Create database: CREATE DATABASE ceylonhomes;
-- 2. Run this script: mysql -u root -p ceylonhomes < schema.sql
-- 3. Or use phpMyAdmin to import this file
--
-- NOTE: Spring Boot JPA will auto-create tables if ddl-auto=update
--       This script is optional for manual database setup
-- =====================================================

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS ceylonhomes
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ceylonhomes;

-- =====================================================
-- Users Table
-- =====================================================
-- Stores all user accounts: ADMIN, SELLER, and regular USER
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone_number VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'SELLER', 'USER') NOT NULL DEFAULT 'USER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_phone (phone_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User accounts for admin, sellers, and regular users';

-- =====================================================
-- Listings Table
-- =====================================================
-- Property listings for rent or sale
CREATE TABLE IF NOT EXISTS listings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    rent_or_sale ENUM('RENT', 'SALE') NOT NULL,
    property_type ENUM('HOUSE', 'ROOM', 'ANNEX', 'BOARDING') NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    bedrooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    size_sqft VARCHAR(50) NULL,
    contact_phone VARCHAR(30) NOT NULL,
    contact_whatsapp VARCHAR(30) NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'SOLD', 'RENTED', 'ARCHIVED') NOT NULL DEFAULT 'PENDING',
    rejection_reason VARCHAR(500) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_owner (owner_id),
    INDEX idx_district (district),
    INDEX idx_city (city),
    INDEX idx_rent_or_sale (rent_or_sale),
    INDEX idx_property_type (property_type),
    INDEX idx_price (price),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Property listings with approval workflow';

-- =====================================================
-- Listing Photos Table
-- =====================================================
-- Multiple photos per listing (up to 10)
CREATE TABLE IF NOT EXISTS listing_photos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    listing_id BIGINT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    INDEX idx_listing (listing_id),
    INDEX idx_order (listing_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Photos for property listings';

-- =====================================================
-- Inquiries Table
-- =====================================================
-- Messages from potential buyers/renters to sellers
CREATE TABLE IF NOT EXISTS inquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    listing_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_listing (listing_id),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User inquiries about properties';

-- =====================================================
-- Reports Table
-- =====================================================
-- User-reported suspicious/fraudulent listings
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    listing_id BIGINT NOT NULL,
    reporter_id BIGINT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    details TEXT NULL,
    status ENUM('PENDING', 'REVIEWED', 'RESOLVED') DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_listing (listing_id),
    INDEX idx_reporter (reporter_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Reports about fraudulent or inappropriate listings';

-- =====================================================
-- Approval Actions Table
-- =====================================================
-- Audit trail for admin approval/rejection actions
CREATE TABLE IF NOT EXISTS approval_actions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    listing_id BIGINT NOT NULL,
    admin_id BIGINT NOT NULL,
    action ENUM('APPROVED', 'REJECTED') NOT NULL,
    reason VARCHAR(500) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_listing (listing_id),
    INDEX idx_admin (admin_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Audit log of admin approval/rejection actions';

-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================
-- Uncomment to insert sample admin user
-- Password: <your-admin-password> (BCrypt encoded)
/*
INSERT INTO users (name, email, phone_number, password, role) VALUES 
('Admin User', 'your-admin-email@example.com', '+10000000000', '$2a$10$example.hash.here', 'ADMIN')
ON DUPLICATE KEY UPDATE email=email;
*/

-- =====================================================
-- Views for Reporting (Optional)
-- =====================================================

-- Active listings with owner info
CREATE OR REPLACE VIEW v_active_listings AS
SELECT 
    l.id,
    l.title,
    l.property_type,
    l.rent_or_sale,
    l.price,
    l.district,
    l.city,
    l.status,
    u.name AS owner_name,
    u.email AS owner_email,
    u.phone_number AS owner_phone,
    (SELECT COUNT(*) FROM listing_photos WHERE listing_id = l.id) AS photo_count,
    (SELECT COUNT(*) FROM inquiries WHERE listing_id = l.id) AS inquiry_count,
    l.created_at
FROM listings l
JOIN users u ON l.owner_id = u.id
WHERE l.status IN ('APPROVED', 'PENDING');

-- Listings by district summary
CREATE OR REPLACE VIEW v_listings_by_district AS
SELECT 
    district,
    property_type,
    rent_or_sale,
    COUNT(*) AS listing_count,
    AVG(price) AS avg_price,
    MIN(price) AS min_price,
    MAX(price) AS max_price
FROM listings
WHERE status = 'APPROVED'
GROUP BY district, property_type, rent_or_sale
ORDER BY district, property_type;

-- =====================================================
-- Stored Procedures (Optional)
-- =====================================================

DELIMITER $$

-- Get user's listing statistics
CREATE PROCEDURE IF NOT EXISTS sp_user_listing_stats(IN user_id_param BIGINT)
BEGIN
    SELECT 
        COUNT(*) AS total_listings,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) AS approved,
        SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) AS rejected,
        SUM(CASE WHEN status IN ('SOLD', 'RENTED') THEN 1 ELSE 0 END) AS closed,
        SUM(CASE WHEN status = 'ARCHIVED' THEN 1 ELSE 0 END) AS archived
    FROM listings
    WHERE owner_id = user_id_param;
END$$

DELIMITER ;

-- =====================================================
-- Indexes for Performance (if not created above)
-- =====================================================
-- Already included in table definitions above

-- =====================================================
-- Database Setup Complete!
-- =====================================================
-- Next Steps:
-- 1. Start Spring Boot application (it will use this database)
-- 2. Admin user will be auto-created on first startup
-- 3. Access application at http://localhost:8080
-- =====================================================
