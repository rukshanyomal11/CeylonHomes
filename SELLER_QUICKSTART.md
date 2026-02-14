# Seller Dashboard - Quick Start Guide

## How to Access the Seller Dashboard

### Step 1: Start the Backend
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
Backend will run on `http://localhost:8080`

### Step 2: Start the Frontend
```powershell
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5174` (or similar)

### Step 3: Create a Seller Account

#### Option 1: Register via UI
1. Go to `http://localhost:5174/register`
2. Fill in the form:
   - Name: Your Name
   - Email: seller@test.com
   - Password: Seller@123
   - Phone: +94771234567
   - Role: **Select "SELLER"**
3. Click "Register"

#### Option 2: Create via API
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Seller",
    "email": "seller@test.com",
    "password": "Seller@123",
    "phone": "+94771234567",
    "role": "SELLER"
  }'
```

### Step 4: Login as Seller
1. Go to `http://localhost:5174/login`
2. Enter:
   - Email: `seller@test.com`
   - Password: `Seller@123`
3. Click "Login"
4. You'll be automatically redirected to `http://localhost:5174/seller`

## Dashboard Navigation

Once logged in, you'll see the sidebar with:

### 📊 Overview
- View statistics of your listings by status
- See recent 5 inquiries from buyers

### 🏠 My Listings
- View all your property listings
- Filter by status or search by title
- Actions:
  - **View**: See public listing page
  - **Edit**: Modify listing details
  - **Mark Sold**: For approved SALE listings
  - **Mark Rented**: For approved RENT listings
  - **Archive**: Remove from active listings

### ➕ Create Listing
- Fill in property details:
  - Basic: Title, Description
  - Type: Rent/Sale, Property Type (House/Apartment/Condo/Land/Commercial)
  - Pricing: Price in Rs.
  - Location: District, City, Address
  - Details: Bedrooms, Bathrooms, Size
  - Contact: Phone, WhatsApp
  - Availability: Start/End dates
- Upload multiple photos
- Submit → Status will be **PENDING** (admin must approve)

### 💬 Inquiries
- View all inquiries from potential buyers
- See buyer contact information
- Click listing title to view the property

## Important Notes

### Listing Status Flow
```
PENDING → (admin approves) → APPROVED → (seller marks) → SOLD/RENTED
   ↑                             ↓
   └──────── (seller edits) ─────┘
```

### Key Rules
1. **New listings**: Start with status PENDING
2. **Editing approved listings**: Status changes back to PENDING (requires re-approval)
3. **Marking sold/rented**: Only available for APPROVED listings
4. **Archive**: Available anytime, removes from active listings
5. **Ownership**: You can only manage your own listings

### Photo Upload
- Supported formats: JPG, PNG, GIF
- Multiple photos allowed
- Preview before submit
- Can remove photos before saving

## Testing the Dashboard

### 1. Create Your First Listing
1. Click "Create Listing" in sidebar
2. Enter details:
   ```
   Title: Beautiful 3BR House in Colombo
   Description: Spacious house with modern amenities
   Type: For Sale
   Property Type: House
   Price: 15000000
   District: Colombo
   City: Mount Lavinia
   Address: 123 Main Street
   Bedrooms: 3
   Bathrooms: 2
   Contact Phone: +94771234567
   ```
3. Upload 2-3 photos
4. Click "Create Listing"
5. ✅ Success! Status: PENDING

### 2. Check Overview
1. Click "Overview" in sidebar
2. See:
   - Pending: 1
   - Other counts: 0
   - Recent inquiries: (empty for now)

### 3. View Your Listings
1. Click "My Listings"
2. See your newly created listing in the table
3. Try the filters:
   - Select "Pending" from status dropdown
   - Search by title

### 4. Edit the Listing
1. Click "Edit" on your listing
2. Change the price to 14500000
3. Click "Update Listing"
4. ✅ Status remains PENDING

### 5. Admin Approval (Required)
**Note**: To mark as sold/rented, an admin must first approve your listing.
- Admin login: use `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`
- Admin dashboard: `/admin` (if implemented)
- Admin approves → Status becomes APPROVED

### 6. Mark as Sold (After Approval)
1. Go to "My Listings"
2. Find an APPROVED listing with rentOrSale=SALE
3. Click "Sold"
4. Confirm in dialog
5. ✅ Status changes to SOLD

## Troubleshooting

### Issue: Can't see "Mark Sold" button
**Solution**: 
- Button only appears if:
  - Status = APPROVED
  - rentOrSale = SALE
- Contact admin to approve your listing first

### Issue: Can't see "Mark Rented" button
**Solution**:
- Button only appears if:
  - Status = APPROVED
  - rentOrSale = RENT

### Issue: Backend errors
**Check**:
1. Backend is running on port 8080
2. Database is running (MySQL)
3. Database credentials correct (root/APYRK)

### Issue: Frontend not loading
**Check**:
1. Frontend is running (`npm run dev`)
2. `.env` file exists with `VITE_API_BASE_URL=http://localhost:8080/api`
3. Browser console for errors

### Issue: Login redirects to home instead of /seller
**Solution**:
- Make sure you registered with role="SELLER"
- Check JWT token has correct role

## What's Next?

### For Full Functionality:
1. **Admin Dashboard**: Ask admin to approve your listings
2. **Public Listings**: View your approved listings on public pages
3. **User Inquiries**: Buyers can send inquiries about your listings
4. **Notifications**: Get notified when listing approved/rejected

### Features Coming Soon:
- [ ] Email notifications
- [ ] Listing analytics
- [ ] Bulk operations
- [ ] Export listings to CSV
- [ ] Advanced search filters
- [ ] Photo reordering
- [ ] Virtual tours

## Support

If you encounter issues:
1. Check browser console (F12)
2. Check backend logs
3. Verify database connection
4. Ensure correct role assignment
5. Check CORS configuration

## Happy Selling! 🏡✨
