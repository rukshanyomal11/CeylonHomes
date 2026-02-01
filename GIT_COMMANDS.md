# 🚀 Git Commands Quick Reference for CeylonHomes

## Initial Setup (First Time Only)

### 1. Initialize Git Repository
```bash
cd C:\Users\Rukshan\Desktop\CeylonHomes
git init
```

### 2. Add Remote Repository
```bash
# Replace 'yourusername' with your GitHub username
git remote add origin https://github.com/yourusername/CeylonHomes.git
```

### 3. Configure Git (if not done globally)
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Pushing to GitHub

### First Push (Initial Upload)
```bash
# Add all files to staging
git add .

# Commit with message
git commit -m "Initial commit: CeylonHomes property platform"

# Push to GitHub (first time)
git branch -M main
git push -u origin main
```

### Subsequent Pushes (After Making Changes)
```bash
# Check what files changed
git status

# Add all changed files
git add .

# Or add specific files
git add backend/src/main/java/com/ceylonhomes/backend/entity/Listing.java
git add frontend/src/pages/seller/CreateListing.jsx

# Commit with descriptive message
git commit -m "feat: Add district dropdown and phone validation"

# Push to GitHub
git push
```

## Common Git Commands

### Check Status
```bash
git status                    # See which files changed
git log --oneline            # See commit history
git diff                     # See changes in files
```

### Branching
```bash
# Create new branch for feature
git checkout -b feature/new-feature-name

# Switch between branches
git checkout main
git checkout feature/new-feature-name

# List all branches
git branch -a

# Delete branch
git branch -d feature/old-feature
```

### Undoing Changes
```bash
# Discard changes in working directory
git checkout -- filename.java

# Unstage file (remove from git add)
git reset HEAD filename.java

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Pulling Updates
```bash
# Get latest changes from GitHub
git pull origin main

# Fetch without merging
git fetch origin
```

## 📝 Commit Message Examples

Good commit messages:
```bash
git commit -m "feat: Add rejected listings view for sellers"
git commit -m "fix: Resolve delete button authentication error"
git commit -m "docs: Update setup guide with environment variables"
git commit -m "style: Format code with prettier"
git commit -m "refactor: Improve listing service performance"
```

## 🔒 Before Pushing - Checklist

- [ ] Remove sensitive data (passwords, API keys)
- [ ] Verify `.env` file is in `.gitignore`
- [ ] Test that application runs correctly
- [ ] Update README if needed
- [ ] All tests passing
- [ ] No debug code or console.logs

## 📤 Complete Push Workflow

```bash
# 1. Check current status
git status

# 2. Add files
git add .

# 3. Commit with message
git commit -m "feat: Your feature description"

# 4. Push to GitHub
git push

# If it's your first push:
git push -u origin main
```

## 🔍 Checking Your Repository

After pushing, visit:
```
https://github.com/yourusername/CeylonHomes
```

You should see:
- ✅ All your files
- ✅ README.md displayed on main page
- ✅ Commit history
- ✅ Branch information

## 🚨 Troubleshooting

### Push Rejected (Remote has changes you don't have)
```bash
git pull origin main
# Resolve any conflicts
git push
```

### Large Files Error
```bash
# Check file sizes
git ls-files --others --exclude-standard | xargs du -h

# Remove large files from tracking
git rm --cached path/to/large/file
echo "path/to/large/file" >> .gitignore
git commit -m "Remove large file from tracking"
```

### Authentication Error
```bash
# Use Personal Access Token instead of password
# Generate token: GitHub Settings → Developer settings → Personal access tokens
# Use token as password when prompted
```

### Files Not Ignoring
```bash
# If .gitignore not working (files already tracked)
git rm -r --cached .
git add .
git commit -m "Fix .gitignore"
```

## 🔗 Quick Links

- **GitHub Repository:** https://github.com/yourusername/CeylonHomes
- **Issues:** https://github.com/yourusername/CeylonHomes/issues
- **Pull Requests:** https://github.com/yourusername/CeylonHomes/pulls

## 📚 Learn More

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

**Pro Tip:** Commit often with meaningful messages. It's easier to understand project history and roll back if needed!
