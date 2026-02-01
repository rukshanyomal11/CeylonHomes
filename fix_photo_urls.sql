-- Fix photo URLs to include /listings/ subdirectory
-- Run this SQL script in your MySQL database

UPDATE listing_photos 
SET url = CONCAT('/uploads/listings/', SUBSTRING_INDEX(url, '/', -1))
WHERE url LIKE '/uploads/%' 
  AND url NOT LIKE '/uploads/listings/%';

-- Verify the update
SELECT id, url FROM listing_photos;
