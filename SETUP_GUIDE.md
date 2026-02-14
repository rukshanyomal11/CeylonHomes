# 🏠 CeylonHomes - Setup Guide

Complete step-by-step guide to set up and run the CeylonHomes platform locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 17 or higher**
  - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)
  - Verify: `java -version`

- **Node.js 18 or higher** and npm
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node -v` and `npm -v`

- **MySQL 8.0 or higher**
  - Download from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
  - Alternative: Install XAMPP or WAMP

- **Maven** (or use included Maven wrapper)
  - Download from [maven.apache.org](https://maven.apache.org/download.cgi)
  - Verify: `mvn -v`

- **Git**
  - Download from [git-scm.com](https://git-scm.com/downloads)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CeylonHomes.git
cd CeylonHomes
```

### 2. Database Setup

**Option A: Using MySQL Command Line**

```bash
mysql -u root -p
```

```sql
CREATE DATABASE ceylonhomes;
exit;
```

**Option B: Using XAMPP/WAMP**
- Start MySQL service
- Open phpMyAdmin
- Create database named `ceylonhomes`

### 3. Configure Environment Variables

Create a `.env` file in the project root by copying the example:

```bash
cp .env.example .env
```

Edit `.env` and update the following:

```env
# Update with your MySQL password
DB_PASS=your_mysql_password

# Change JWT secret in production
JWT_SECRET=your_strong_random_secret_key_here

# Configure admin account (created on first run)
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-strong-admin-password
```

### 4. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

**Install Dependencies:**

```bash
mvn clean install
```

**Run the Backend:**

Using Maven:
```bash
mvn spring-boot:run
```

Or using Maven wrapper (Windows):
```bash
.\mvnw.cmd spring-boot:run
```

Or using Maven wrapper (Linux/Mac):
```bash
./mvnw spring-boot:run
```

The backend will start at: `http://localhost:8080`

**Verify Backend is Running:**

Open your browser and navigate to: `http://localhost:8080/api/health` (if health endpoint exists)

### 5. Frontend Setup

Open a **new terminal** and navigate to the frontend directory:

```bash
cd frontend
```

**Install Dependencies:**

```bash
npm install
```

**Run the Frontend:**

```bash
npm run dev
```

The frontend will start at: `http://localhost:5173`

### 6. Access the Application

Open your browser and go to: **http://localhost:5173**

**Admin Credentials (from `.env`):**
- Email: value of `ADMIN_EMAIL`
- Password: value of `ADMIN_PASSWORD`

## 🔧 Configuration Details

### Backend Configuration (application.yml)

The backend uses environment variables with fallback defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_URL` | `jdbc:mysql://localhost:3306/ceylonhomes` | MySQL connection URL |
| `DB_USER` | `root` | MySQL username |
| `DB_PASS` | (required) | MySQL password |
| `JWT_SECRET` | (auto-generated) | Secret key for JWT tokens |
| `UPLOAD_DIR` | `uploads` | Directory for uploaded files |
| `ADMIN_EMAIL` | (required) | Admin account email |
| `ADMIN_PASSWORD` | (required) | Admin account password |
| `ADMIN_PHONE` | (required) | Admin account phone |

### Frontend Configuration

The frontend automatically connects to `http://localhost:8080/api` by default.

To change the API URL, create `frontend/.env`:

```env
VITE_API_BASE_URL=http://your-backend-url:8080/api
```

## 📁 Project Structure

```
CeylonHomes/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/ceylonhomes/backend/
│   │   │   │       ├── config/          # Security, CORS, DataSeeder
│   │   │   │       ├── controller/      # REST API endpoints
│   │   │   │       ├── dto/             # Data Transfer Objects
│   │   │   │       ├── entity/          # JPA Entities
│   │   │   │       ├── enums/           # PropertyType, UserRole, etc.
│   │   │   │       ├── repository/      # JPA Repositories
│   │   │   │       ├── security/        # JWT utilities
│   │   │   │       └── service/         # Business logic
│   │   │   └── resources/
│   │   │       ├── application.yml      # Configuration
│   │   │       └── schema.sql           # Database schema
│   │   └── test/                        # Unit tests
│   ├── uploads/                         # Uploaded listing photos
│   └── pom.xml                          # Maven dependencies
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── api/                         # API service modules
│   │   ├── components/                  # Reusable components
│   │   ├── context/                     # React Context (Auth)
│   │   ├── pages/                       # Page components
│   │   │   ├── admin/                   # Admin dashboard pages
│   │   │   └── seller/                  # Seller dashboard pages
│   │   ├── services/                    # API client
│   │   ├── App.jsx                      # Main app component
│   │   └── main.jsx                     # Entry point
│   ├── index.html
│   ├── package.json                     # npm dependencies
│   ├── tailwind.config.js               # Tailwind CSS config
│   └── vite.config.js                   # Vite configuration
│
├── .env.example             # Environment variables template
├── README.md                # Project overview
└── SETUP_GUIDE.md          # This file
```

## 🎯 Features Overview

### User Roles

1. **ADMIN**
   - Approve/reject property listings
   - View all listings and manage reports
   - Access approval history and audit logs
   - Manage rejected listings

2. **SELLER**
   - Create and edit property listings
   - Upload up to 10 photos per listing
   - Mark properties as sold/rented
   - View rejected listings with reasons
   - Archive old listings

3. **USER** (General Public)
   - Browse approved property listings
   - Filter by district, city, property type, price range
   - View property details with photo gallery
   - Send inquiries to sellers

### Property Types
- House
- Room
- Annex
- Boarding

### All 25 Districts of Sri Lanka
Colombo, Gampaha, Kalutara, Kandy, Matale, Nuwara Eliya, Galle, Matara, Hambantota, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Batticaloa, Ampara, Trincomalee, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Badulla, Monaragala, Ratnapura, Kegalle

## 🔒 Security Features

- JWT-based authentication
- Password encryption with BCrypt
- Role-based access control (RBAC)
- CORS configuration for frontend-backend communication
- Input validation on both frontend and backend
- Phone number validation (exactly 10 digits)
- Secure file upload with size limits (10MB per file, 50MB total)

## 🐛 Troubleshooting

### Backend Issues

**Port 8080 already in use:**
```bash
# Find process using port 8080 (Windows)
netstat -ano | findstr :8080
taskkill /PID <process_id> /F

# Find process using port 8080 (Linux/Mac)
lsof -i :8080
kill -9 <process_id>
```

**Database connection error:**
- Verify MySQL is running
- Check credentials in `.env` file
- Ensure `ceylonhomes` database exists
- Check MySQL port (default: 3306)

**Maven build fails:**
```bash
# Clean and rebuild
mvn clean install -U
```

### Frontend Issues

**npm install fails:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Port 5173 already in use:**
- Vite will automatically try the next available port
- Or manually specify: `npm run dev -- --port 3000`

**API connection error:**
- Verify backend is running on port 8080
- Check browser console for CORS errors
- Ensure `api/api.js` has correct base URL

### Common Issues

**Photos not uploading:**
- Check `uploads/listings/` directory exists and is writable
- Verify file size is under 10MB
- Ensure total upload size is under 50MB

**Admin login not working:**
- Wait for backend to fully start (DataSeeder runs on startup)
- Check backend console logs for admin account creation
- Verify credentials match `.env` file

**Listings not appearing after approval:**
- Check browser console for errors
- Verify listing status in database
- Clear browser cache and refresh

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
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
# Serve the 'dist' folder with a static server
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Contact: support@ceylonhomes.lk

## 🎨 Design

The application features a yellow-themed UI (#eab308) with:
- Responsive design for mobile and desktop
- Tailwind CSS for styling
- React Hot Toast for notifications
- Clean and intuitive user interface

---

**Happy Property Hunting! 🏡**
