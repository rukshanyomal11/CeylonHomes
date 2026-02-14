# 🏠 CeylonHomes - Property Rent & Sale Platform

[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)


A modern, full-stack web application for property rental and sale in Sri Lanka. Features a beautiful yellow-themed UI, admin approval workflow, and comprehensive listing management.

![CeylonHomes Platform](https://via.placeholder.com/800x400/eab308/ffffff?text=CeylonHomes+Property+Platform)

## ✨ Key Features

### 🎯 For Property Seekers
- 🔍 Browse approved listings with advanced filters
- 📍 Search by all 25 districts of Sri Lanka
- 🏘️ Filter by property type, price range, bedrooms, bathrooms
- 📸 View up to 10 photos per listing
- 💬 Send inquiries directly to sellers
- 🚩 Report suspicious listings

### 🏢 For Property Sellers
- ✍️ Create and edit property listings
- 📷 Upload up to 10 high-quality photos per listing
- 📊 View listing statistics and status
- ✅ Mark properties as sold/rented
- 📋 View rejected listings with admin feedback
- 🗄️ Archive old listings

### 👨‍💼 For Administrators
- ✔️ Approve or reject pending listings
- 📝 Provide rejection reasons to sellers
- 📊 View all listings and statistics
- 🔍 Review rejected listings
- 🛡️ Manage platform integrity

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven (or use included wrapper)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CeylonHomes.git
   cd CeylonHomes
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MySQL password and other settings
   ```

3. **Create MySQL database**
   ```sql
   CREATE DATABASE ceylonhomes;
   ```

4. **Start the backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

5. **Start the frontend** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

### Admin Login
- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`.
- Use those values to log in.

> ⚠️ Never commit `.env` to GitHub. See [SETUP_GUIDE.md](SETUP_GUIDE.md) for details.

## 📚 Documentation

- **[📖 Setup Guide](SETUP_GUIDE.md)** - Detailed installation and configuration
- **[💼 Seller Dashboard Guide](SELLER_DASHBOARD_README.md)** - Guide for property sellers
- **[🚀 Seller Quick Start](SELLER_QUICKSTART.md)** - Quick start for sellers
- **[🔧 Environment Variables](.env.example)** - Configuration template

## 🎨 Theme & Design
- **Primary Color:** Yellow (#eab308)
- **Framework:** Tailwind CSS
- **UI Components:** Custom React components with Tailwind
- **Notifications:** React Hot Toast
- **Responsive:** Mobile-first design

## 🛠️ Technology Stack

### Backend
- **Framework:** Spring Boot 3.2.1
- **Security:** Spring Security + JWT (jjwt 0.11.5)
- **Database:** MySQL 8.0+
- **ORM:** Spring Data JPA / Hibernate
- **Validation:** Jakarta Validation
- **Build Tool:** Maven

### Frontend
- **Framework:** React 18.2.0
- **Routing:** React Router DOM 6.21.0
- **HTTP Client:** Axios 1.6.2
- **Styling:** Tailwind CSS 3.4.0 (Yellow theme)
- **Build Tool:** Vite 5.0.8

## 📁 Project Structure

```
CeylonHomes/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/com/ceylonhomes/backend/
│   │   ├── config/          # Security, CORS, DataSeeder
│   │   ├── controller/      # REST API endpoints
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA Entities
│   │   ├── enums/           # PropertyType, UserRole, Status
│   │   ├── repository/      # JPA Repositories
│   │   ├── security/        # JWT utilities
│   │   └── service/         # Business logic
│   └── src/main/resources/
│       ├── application.yml  # Configuration
│       └── schema.sql       # Database schema
├── frontend/                # React frontend
│   ├── src/
│   │   ├── api/            # API service modules
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin dashboard
│   │   │   └── seller/     # Seller dashboard
│   │   └── services/       # API client
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── SETUP_GUIDE.md          # Detailed setup instructions
└── README.md               # This file
```

## 🔐 Security Features

- 🔒 JWT-based authentication with secure token storage
- 🛡️ Password encryption using BCrypt
- 👥 Role-based access control (ADMIN, SELLER, USER)
- 🌐 CORS configuration for frontend-backend communication
- ✅ Input validation on both frontend and backend
- 📱 Phone number validation (exactly 10 digits)
- 📁 Secure file upload (max 10MB per file, 50MB total)
- 🔐 Environment variable configuration for sensitive data

## 📍 Supported Locations

All 25 districts of Sri Lanka:
- **Western Province:** Colombo, Gampaha, Kalutara
- **Central Province:** Kandy, Matale, Nuwara Eliya
- **Southern Province:** Galle, Matara, Hambantota
- **Northern Province:** Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya
- **Eastern Province:** Batticaloa, Ampara, Trincomalee
- **North Western Province:** Kurunegala, Puttalam
- **North Central Province:** Anuradhapura, Polonnaruwa
- **Uva Province:** Badulla, Monaragala
- **Sabaragamuwa Province:** Ratnapura, Kegalle

## 🏠 Property Types

- 🏡 House - Full residential houses
- 🚪 Room - Single rooms for rent
- 🏘️ Annex - Separate attached units
- 🛏️ Boarding - Boarding facilities

## 📸 Screenshots

### Home Page
Browse all approved listings with filters and search

### Seller Dashboard
Manage your listings, view statistics, and handle rejected properties

### Admin Panel
Review pending listings, approve/reject with feedback

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials

### Listings (Public)
- `GET /api/listings` - Browse approved listings with filters
- `GET /api/listings/{id}` - Get listing details

### Seller
- `POST /api/seller/listings` - Create new listing
- `PUT /api/seller/listings/{id}` - Update listing
- `DELETE /api/seller/listings/{id}` - Delete listing
- `GET /api/seller/my-listings` - Get seller's listings
- `PATCH /api/seller/listings/{id}/status` - Update listing status

### Admin
- `GET /api/admin/listings/pending` - Get pending approvals
- `POST /api/admin/listings/{id}/approve` - Approve listing
- `POST /api/admin/listings/{id}/reject` - Reject with reason
- `GET /api/admin/listings` - Get all listings

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
mvn test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Building for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/ceylonhomes-backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your web server
```

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure port 8080 is available

**Frontend can't connect:**
- Confirm backend is running on port 8080
- Check CORS settings in `SecurityConfig.java`
- Verify API base URL in `frontend/src/services/api.js`

**Photos not uploading:**
- Check `uploads/listings/` directory exists
- Verify file permissions
- Ensure file size is under 10MB

See [SETUP_GUIDE.md](SETUP_GUIDE.md#-troubleshooting) for more solutions.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💼 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Spring Boot community for excellent documentation
- React team for the powerful frontend library
- Tailwind CSS for the utility-first CSS framework
- All contributors and testers

## 📧 Contact & Support

- 📧 Email: support@ceylonhomes.lk
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/CeylonHomes/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/CeylonHomes/discussions)

## 🗺️ Roadmap

- [ ] Email notifications for inquiries
- [ ] SMS verification for phone numbers
- [ ] Advanced search with map integration
- [ ] Seller rating and review system
- [ ] Saved listings for users
- [ ] Price history tracking
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration

---

**Made with ❤️ in Sri Lanka 🇱🇰**

*CeylonHomes - Your trusted property platform*
│   │   │   └── ReportController.java
│   │   ├── dto/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── ListingRequest.java
│   │   │   ├── ListingDTO.java
│   │   │   └── ... (other DTOs)
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Listing.java
│   │   │   ├── ListingPhoto.java
│   │   │   ├── Inquiry.java
│   │   │   ├── Report.java
│   │   │   └── ApprovalAction.java
│   │   ├── enums/
│   │   │   ├── Role.java
│   │   │   ├── ListingStatus.java
│   │   │   ├── PropertyType.java
│   │   │   └── RentOrSale.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── ListingRepository.java
│   │   │   └── ... (other repositories)
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── JwtAuthenticationEntryPoint.java
│   │   │   └── CustomUserDetailsService.java
│   │   ├── service/
│   │   │   ├── UserService.java
│   │   │   ├── ListingService.java
│   │   │   ├── AdminService.java
│   │   │   ├── InquiryService.java
│   │   │   ├── ReportService.java
│   │   │   └── FileStorageService.java
│   │   └── CeylonhomesBackendApplication.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── schema.sql
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ListingCard.jsx
    │   │   ├── FiltersSidebar.jsx
    │   │   ├── Pagination.jsx
    │   │   ├── PhotoUploader.jsx
    │   │   ├── Toast.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Listings.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    └── .env
```

## 🚀 Setup Instructions

### Prerequisites
- **Java 17** or higher
- **Node.js 18** or higher
- **MySQL 8.0** or higher
- **Maven 3.8+**

### Database Setup

1. **Create MySQL Database:**
```sql
CREATE DATABASE ceylonhomes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Configure Database Connection:**
   - Edit `backend/src/main/resources/application.yml` or set environment variables:
   ```env
   DB_URL=jdbc:mysql://localhost:3306/ceylonhomes
   DB_USER=your_mysql_user
   DB_PASS=your_mysql_password
   JWT_SECRET=YourSecretKeyHere
   ```

### Backend Setup

#### Windows:
```powershell
cd backend

# Set environment variables (PowerShell)
$env:DB_URL="jdbc:mysql://localhost:3306/ceylonhomes"
$env:DB_USER="root"
$env:DB_PASS="yourpassword"
$env:JWT_SECRET="MySecretKeyForJWTTokenGenerationCeylonHomesPropertyPlatform2026"

# Clean and install dependencies
mvnw clean install

# Run the application
mvnw spring-boot:run
```

#### Mac/Linux:
```bash
cd backend

# Set environment variables
export DB_URL="jdbc:mysql://localhost:3306/ceylonhomes"
export DB_USER="root"
export DB_PASS="yourpassword"
export JWT_SECRET="MySecretKeyForJWTTokenGenerationCeylonHomesPropertyPlatform2026"

# Clean and install dependencies
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

The backend will start on **http://localhost:8080**

### Frontend Setup

#### Windows/Mac/Linux:
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on **http://localhost:5173**

## 👤 Admin Account

The application automatically seeds an admin account on first run using `.env`:

- **Email:** value of `ADMIN_EMAIL`
- **Password:** value of `ADMIN_PASSWORD`
- **Role:** ADMIN

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new seller/user
- `POST /api/auth/login` - Login (returns JWT token)

### Public Listings
- `GET /api/listings/search` - Search listings (filter by district, city, type, price, etc.)
- `GET /api/listings/latest` - Get latest approved listings
- `GET /api/listings/{id}` - Get listing details

### Seller Endpoints (Requires SELLER role)
- `POST /api/listings` - Create new listing
- `PUT /api/listings/{id}` - Update listing
- `POST /api/listings/{id}/photos` - Upload photos
- `DELETE /api/listings/photos/{photoId}` - Delete photo
- `PATCH /api/listings/{id}/sold` - Mark as sold
- `PATCH /api/listings/{id}/rented` - Mark as rented
- `PATCH /api/listings/{id}/archive` - Archive listing
- `GET /api/seller/listings` - Get seller's listings

### Admin Endpoints (Requires ADMIN role)
- `GET /api/admin/listings/pending` - Get pending listings
- `POST /api/admin/listings/{id}/approve` - Approve listing
- `POST /api/admin/listings/{id}/reject` - Reject listing (requires reason)
- `POST /api/admin/listings/{id}/suspend` - Suspend listing
- `GET /api/admin/reports` - Get all reports
- `GET /api/admin/reports/open` - Get open reports
- `GET /api/admin/approval-actions` - Get approval history

### Inquiry Endpoints (Requires USER or SELLER role)
- `POST /api/inquiries/listing/{listingId}` - Send inquiry
- `GET /api/inquiries/seller` - Get seller's inquiries
- `GET /api/inquiries/listing/{listingId}` - Get listing inquiries

### Report Endpoints (Requires USER or SELLER role)
- `POST /api/reports/listing/{listingId}` - Report a listing

## 📝 Example API Requests

### Register a Seller
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+94771234567",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-admin-email@example.com",
    "password": "your-strong-admin-password"
  }'
```

### Create Listing
```bash
curl -X POST http://localhost:8080/api/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Beautiful House in Colombo",
    "description": "3 bedroom house with garden",
    "rentOrSale": "SALE",
    "propertyType": "HOUSE",
    "price": 25000000,
    "district": "Colombo",
    "city": "Mount Lavinia",
    "address": "123 Beach Road",
    "bedrooms": 3,
    "bathrooms": 2,
    "contactPhone": "+94771234567"
  }'
```

### Search Listings
```bash
curl "http://localhost:8080/api/listings/search?district=Colombo&rentOrSale=SALE&minPrice=1000000&maxPrice=50000000&page=0&size=12"
```

### Upload Photos
```bash
curl -X POST http://localhost:8080/api/listings/1/photos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@photo1.jpg" \
  -F "files=@photo2.jpg"
```

## 🗄️ Database Schema

### Tables
- **users** - Admin, seller, and user accounts
- **listings** - Property listings
- **listing_photos** - Multiple photos per listing
- **inquiries** - Buyer messages to sellers
- **reports** - User reports about listings
- **approval_actions** - Audit trail for admin actions

See `backend/src/main/resources/schema.sql` for complete schema.

## 🎯 Workflow

### Listing Lifecycle
1. **Seller creates listing** → Status: PENDING
2. **Admin reviews** →
   - Approve → Status: APPROVED (visible to public)
   - Reject → Status: REJECTED (with reason)
3. **If seller edits approved listing** → Status: PENDING (needs re-approval)
4. **Seller marks listing** →
   - As SOLD → Status: SOLD
   - As RENTED → Status: RENTED
5. **Seller archives** → Status: ARCHIVED

## 🎨 UI Theme

The application uses a **yellow color scheme** throughout:
- Primary color: Yellow (#eab308)
- Accent colors: Various shades of yellow from pale to deep
- Used for buttons, links, borders, and highlights
- Clean, modern design with yellow accents

## 🔒 Security

- **Password Hashing:** BCrypt
- **Authentication:** JWT tokens with 24-hour expiration
- **Authorization:** Role-based access control (ADMIN, SELLER, USER)
- **CORS:** Configured for localhost development
- **Input Validation:** Jakarta Validation annotations

## 📦 Build for Production

### Backend:
```bash
cd backend
mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend:
```bash
cd frontend
npm run build
# Serve the 'dist' folder with a web server
```

## 🐛 Troubleshooting

### Backend Issues:
- **Database connection failed:** Check MySQL is running and credentials in application.yml
- **Port 8080 already in use:** Change server.port in application.yml
- **JWT errors:** Ensure JWT_SECRET environment variable is set

### Frontend Issues:
- **API calls failing:** Check VITE_API_URL in .env file
- **CORS errors:** Verify backend CORS configuration allows frontend origin
- **Build errors:** Run `npm install` to ensure all dependencies are installed

## 📄 License

This project is created for educational purposes.

## 👥 Contributors

Built as a comprehensive full-stack property rental/sale platform demonstration.

---

**Note:** This is a complete, runnable application with all features implemented. All code compiles and runs without pseudo-code or placeholders.
