# 🔐 How to Change Admin Email & Password

Simple step-by-step guide to change your admin login credentials.

## 📝 Method 1: Using .env File (Easiest - Recommended)

### Step 1: Open .env File
Open the file: `CeylonHomes/.env`

### Step 2: Change Admin Credentials
Find these lines and change the values:

```env
# Change these to your preferred admin credentials
ADMIN_EMAIL=admin@ceylonhomes.lk        ← Change this
ADMIN_PASSWORD=Admin@123                ← Change this
ADMIN_NAME=Admin User                   ← Change this
ADMIN_PHONE=+94771234567               ← Change this
```

### Step 3: Example - Change to Your Details
```env
ADMIN_EMAIL=rukshan@gmail.com
ADMIN_PASSWORD=MySecurePass123!
ADMIN_NAME=Rukshan Silva
ADMIN_PHONE=+94771234567
```

### Step 4: Delete Old Admin User from Database

**Option A: Using MySQL Command Line**
```sql
-- Login to MySQL
mysql -u root -p

-- Use the database
USE ceylonhomes;

-- Delete old admin user
DELETE FROM users WHERE role = 'ADMIN';

-- Check it's deleted
SELECT * FROM users WHERE role = 'ADMIN';

-- Exit
exit;
```

**Option B: Using phpMyAdmin**
1. Open phpMyAdmin
2. Click on `ceylonhomes` database
3. Click on `users` table
4. Find the row where `role` = `ADMIN`
5. Click "Delete" button
6. Confirm deletion

### Step 5: Restart Backend
```bash
cd backend
mvn spring-boot:run
```

### Step 6: Login with New Credentials
Go to: http://localhost:5173/login

Use your new email and password!

---

## 📝 Method 2: Direct Database Update (Advanced)

If you want to keep the same admin user but just change the password:

### Step 1: Generate New Password Hash

Run this Java code or use an online BCrypt generator:
```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHasher {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "YourNewPassword123!";
        String hashedPassword = encoder.encode(rawPassword);
        System.out.println(hashedPassword);
    }
}
```

Or use online tool: https://bcrypt-generator.com/
- Enter your new password
- Rounds: 10
- Copy the generated hash

### Step 2: Update Database Directly

```sql
USE ceylonhomes;

-- Update admin email and password
UPDATE users 
SET 
  email = 'your-new-email@gmail.com',
  password = '$2a$10$YOUR_BCRYPT_HASH_HERE',
  name = 'Your Name',
  phone_number = '+94771234567'
WHERE role = 'ADMIN';

-- Verify the change
SELECT email, name, role FROM users WHERE role = 'ADMIN';
```

### Step 3: Login with New Credentials

---

## ⚠️ Important Security Notes

### 1. Strong Password Requirements
Your password should have:
- ✅ At least 8 characters
- ✅ Mix of uppercase and lowercase letters
- ✅ At least one number
- ✅ At least one special character (!@#$%^&*)

**Good Examples:**
- `MySecure@Pass123`
- `Admin#2026Strong`
- `Rukshan!Password99`

**Bad Examples:**
- `admin123` (too simple)
- `password` (too common)
- `12345678` (only numbers)

### 2. Never Share Credentials
- ❌ Don't show password on login page
- ❌ Don't commit .env file to GitHub
- ❌ Don't share password in screenshots
- ✅ Store safely in password manager

### 3. Change Default Password in Production
The default password `Admin@123` should be changed before deploying to production!

---

## 🔄 Complete Example Walkthrough

Let's say you want to change admin to your personal email:

### Your New Details:
- Email: `rukshan@gmail.com`
- Password: `MySecure@2026`
- Name: `Rukshan Perera`
- Phone: `+94771234567`

### Step-by-Step:

**1. Open .env file**
```bash
notepad .env
# or use VS Code
code .env
```

**2. Update these lines:**
```env
ADMIN_EMAIL=rukshan@gmail.com
ADMIN_PASSWORD=MySecure@2026
ADMIN_NAME=Rukshan Perera
ADMIN_PHONE=+94771234567
```

**3. Save the file (Ctrl+S)**

**4. Open MySQL and delete old admin:**
```sql
mysql -u root -p
USE ceylonhomes;
DELETE FROM users WHERE role = 'ADMIN';
exit;
```

**5. Restart backend:**
```bash
cd backend
mvn spring-boot:run
```

**6. Wait for this message in console:**
```
✅ Admin user created successfully!
📧 Email: rukshan@gmail.com
🔑 Password: MySecure@2026
```

**7. Login at http://localhost:5173/login**
- Email: `rukshan@gmail.com`
- Password: `MySecure@2026`

**8. Done! ✅**

---

## 🐛 Troubleshooting

### Problem: "Admin user already exists"
**Solution:** Delete the old admin from database first
```sql
DELETE FROM users WHERE role = 'ADMIN';
```

### Problem: "Wrong password" when logging in
**Solution:** 
1. Check .env file has correct password
2. Make sure you restarted backend after changing .env
3. Make sure you deleted old admin from database

### Problem: Changes not taking effect
**Solution:**
1. Make sure you saved .env file
2. Restart backend completely (stop and start again)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try incognito/private window

### Problem: Can't find .env file
**Solution:**
1. It's in the root folder: `CeylonHomes/.env`
2. If it doesn't exist, copy from `.env.example`:
   ```bash
   copy .env.example .env
   ```
3. Then edit the new .env file

---

## 📁 File Locations

```
CeylonHomes/
├── .env                          ← Edit this file to change admin credentials
├── .env.example                  ← Don't edit (template only)
└── backend/
    └── src/main/resources/
        ├── application.yml       ← Don't edit (uses .env variables)
        └── application.yml.example
```

---

## 🎯 Quick Reference

| What to Change | Where | File |
|----------------|-------|------|
| Admin Email | `ADMIN_EMAIL=your@email.com` | `.env` |
| Admin Password | `ADMIN_PASSWORD=YourPass123!` | `.env` |
| Admin Name | `ADMIN_NAME=Your Name` | `.env` |
| Admin Phone | `ADMIN_PHONE=+94771234567` | `.env` |

**Remember:** After changing .env, always:
1. Delete old admin from database
2. Restart backend
3. Login with new credentials

---

## ✅ Best Practices

1. **Use Strong Passwords**
   - Minimum 8 characters
   - Mix of letters, numbers, symbols

2. **Unique Email**
   - Use your real email for password reset
   - Don't use fake emails

3. **Keep .env Secure**
   - Never commit to GitHub
   - Already in .gitignore
   - Don't share with others

4. **Regular Updates**
   - Change password every 3-6 months
   - Update if compromised

---

Need help? Check the main SETUP_GUIDE.md or create an issue on GitHub!
