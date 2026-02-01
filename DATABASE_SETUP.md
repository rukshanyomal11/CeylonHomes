# 🗄️ Database Setup Guide

Complete guide to setting up the MySQL database for CeylonHomes.

## 📋 Quick Setup

### Option 1: Automatic Setup (Recommended)

Spring Boot will automatically create the database and tables when you first run the application.

**Steps:**
1. Make sure MySQL is running
2. Create the database:
   ```sql
   CREATE DATABASE ceylonhomes;
   ```
3. Update `.env` with your MySQL password
4. Run the Spring Boot application - tables will be created automatically!

### Option 2: Manual Setup with SQL Script

If you prefer to set up the database manually:

**Using MySQL Command Line:**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE ceylonhomes;

# Use the database
USE ceylonhomes;

# Run the schema script
source /path/to/database_schema.sql
```

**Using phpMyAdmin:**
1. Open phpMyAdmin
2. Click "New" to create database
3. Name it `ceylonhomes`
4. Click "Import" tab
5. Choose `database_schema.sql` file
6. Click "Go"

**Using MySQL Workbench:**
1. Open MySQL Workbench
2. File → Run SQL Script
3. Select `database_schema.sql`
4. Choose `ceylonhomes` database
5. Click "Run"

## 📊 Database Schema

### Tables Overview

```
ceylonhomes
├── users                  # User accounts (ADMIN, SELLER, USER)
├── listings              # Property listings
├── listing_photos        # Photos for each listing
├── inquiries            # User inquiries about properties
├── reports              # Reported listings
└── approval_actions     # Admin approval/rejection audit log
```

### Table Details

#### **users** - User Accounts
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(100) | Full name |
| email | VARCHAR(150) | Email (unique) |
| phone_number | VARCHAR(30) | Phone (unique, 10 digits) |
| password | VARCHAR(255) | BCrypt encrypted password |
| role | ENUM | ADMIN, SELLER, or USER |
| created_at | DATETIME | Account creation time |
| updated_at | DATETIME | Last update time |

#### **listings** - Property Listings
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| owner_id | BIGINT | Foreign key to users |
| title | VARCHAR(150) | Listing title |
| description | TEXT | Full description |
| rent_or_sale | ENUM | RENT or SALE |
| property_type | ENUM | HOUSE, ROOM, ANNEX, BOARDING |
| price | DECIMAL(12,2) | Price in LKR |
| district | VARCHAR(100) | One of 25 Sri Lankan districts |
| city | VARCHAR(100) | City name |
| address | VARCHAR(255) | Full address |
| bedrooms | INT | Number of bedrooms |
| bathrooms | INT | Number of bathrooms |
| size_sqft | VARCHAR(50) | Property size |
| contact_phone | VARCHAR(30) | Contact number |
| contact_whatsapp | VARCHAR(30) | WhatsApp number |
| status | ENUM | PENDING, APPROVED, REJECTED, SOLD, RENTED, ARCHIVED |
| rejection_reason | VARCHAR(500) | Admin's rejection reason |
| created_at | DATETIME | Creation time |
| updated_at | DATETIME | Last update time |

#### **listing_photos** - Property Photos
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| listing_id | BIGINT | Foreign key to listings |
| photo_url | VARCHAR(500) | Photo file path |
| display_order | INT | Sort order (0-9) |
| created_at | DATETIME | Upload time |

**Note:** Maximum 10 photos per listing

#### **inquiries** - User Inquiries
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| listing_id | BIGINT | Foreign key to listings |
| user_id | BIGINT | Foreign key to users |
| message | TEXT | Inquiry message |
| created_at | DATETIME | Message time |

#### **reports** - Reported Listings
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| listing_id | BIGINT | Foreign key to listings |
| reporter_id | BIGINT | Foreign key to users |
| reason | VARCHAR(255) | Report reason |
| details | TEXT | Additional details |
| status | ENUM | PENDING, REVIEWED, RESOLVED |
| created_at | DATETIME | Report time |
| updated_at | DATETIME | Last update time |

#### **approval_actions** - Admin Actions Audit
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| listing_id | BIGINT | Foreign key to listings |
| admin_id | BIGINT | Foreign key to users (admin) |
| action | ENUM | APPROVED or REJECTED |
| reason | VARCHAR(500) | Approval/rejection reason |
| created_at | DATETIME | Action time |

## 🔐 Default Admin User

The admin user is automatically created on first application startup using values from `.env`:

**Default Credentials (from .env):**
- Email: `admin@ceylonhomes.lk`
- Password: `Admin@123`
- Phone: `+94771234567`

⚠️ **IMPORTANT:** Change these in your `.env` file before deploying to production!

## 🗺️ Supported Districts

All 25 districts of Sri Lanka:
- Colombo, Gampaha, Kalutara
- Kandy, Matale, Nuwara Eliya
- Galle, Matara, Hambantota
- Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya
- Batticaloa, Ampara, Trincomalee
- Kurunegala, Puttalam
- Anuradhapura, Polonnaruwa
- Badulla, Monaragala
- Ratnapura, Kegalle

## 📈 Database Views (Optional)

The schema includes helpful views for reporting:

### **v_active_listings**
Shows all active listings with owner information and counts:
```sql
SELECT * FROM v_active_listings WHERE district = 'Colombo';
```

### **v_listings_by_district**
Summary statistics by district and property type:
```sql
SELECT * FROM v_listings_by_district ORDER BY listing_count DESC;
```

## 🔧 Stored Procedures (Optional)

### **sp_user_listing_stats(user_id)**
Get statistics for a specific user:
```sql
CALL sp_user_listing_stats(1);
```

Returns:
- Total listings
- Pending count
- Approved count
- Rejected count
- Closed (sold/rented) count
- Archived count

## 🔍 Useful Queries

### Get all pending listings for admin approval:
```sql
SELECT l.*, u.name as owner_name, u.email as owner_email
FROM listings l
JOIN users u ON l.owner_id = u.id
WHERE l.status = 'PENDING'
ORDER BY l.created_at DESC;
```

### Get listings by district with photo counts:
```sql
SELECT 
    l.district,
    l.property_type,
    COUNT(l.id) as total_listings,
    AVG(p.photo_count) as avg_photos
FROM listings l
LEFT JOIN (
    SELECT listing_id, COUNT(*) as photo_count
    FROM listing_photos
    GROUP BY listing_id
) p ON l.id = p.listing_id
WHERE l.status = 'APPROVED'
GROUP BY l.district, l.property_type;
```

### Get seller's listing performance:
```sql
SELECT 
    u.name,
    COUNT(l.id) as total_listings,
    SUM(CASE WHEN l.status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
    SUM(CASE WHEN l.status = 'REJECTED' THEN 1 ELSE 0 END) as rejected,
    AVG(l.price) as avg_price
FROM users u
LEFT JOIN listings l ON u.id = l.owner_id
WHERE u.role = 'SELLER'
GROUP BY u.id, u.name;
```

## 🔄 Database Migrations

Spring Boot JPA handles schema updates automatically with `ddl-auto: update`.

**What this means:**
- New tables are created automatically
- New columns are added automatically
- Existing data is preserved
- ⚠️ Columns are NOT deleted automatically (safe)

**For production:**
Consider using a migration tool like:
- Flyway
- Liquibase

## 🧪 Testing the Database

### Verify tables were created:
```sql
SHOW TABLES;
```

### Check table structure:
```sql
DESCRIBE users;
DESCRIBE listings;
DESCRIBE listing_photos;
```

### Count records:
```sql
SELECT 
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM listings) as listings,
    (SELECT COUNT(*) FROM listing_photos) as photos,
    (SELECT COUNT(*) FROM inquiries) as inquiries;
```

## 🐛 Troubleshooting

### "Access denied for user"
- Check MySQL username and password in `.env`
- Ensure MySQL user has proper permissions:
  ```sql
  GRANT ALL PRIVILEGES ON ceylonhomes.* TO 'root'@'localhost';
  FLUSH PRIVILEGES;
  ```

### "Unknown database 'ceylonhomes'"
- Create the database:
  ```sql
  CREATE DATABASE ceylonhomes;
  ```

### "Table doesn't exist"
- Verify `ddl-auto: update` in application.yml
- Or run the database_schema.sql script manually

### Foreign key constraint fails
- Ensure parent records exist before inserting child records
- Check cascade delete settings

## 📚 Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Spring Data JPA Guide](https://spring.io/guides/gs/accessing-data-jpa/)
- [Hibernate Documentation](https://hibernate.org/orm/documentation/)

---

**Database setup complete! 🎉**
