# Contributing to CeylonHomes

Thank you for your interest in contributing to CeylonHomes! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on GitHub with:

- **Clear title** describing the issue
- **Steps to reproduce** the bug
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, browser, Java version, Node version)

### Suggesting Features

Feature suggestions are welcome! Please:

- Check if the feature already exists or has been requested
- Clearly describe the feature and its benefits
- Provide examples of how it would be used
- Consider how it fits with existing functionality

### Code Contributions

1. **Fork the repository**
   ```bash
   git fork https://github.com/yourusername/CeylonHomes.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments where necessary
   - Update documentation

4. **Test your changes**
   ```bash
   # Backend tests
   cd backend
   mvn test

   # Frontend tests
   cd frontend
   npm test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: Add new feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes clearly

## 📝 Commit Message Guidelines

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: Add email notification for new inquiries
fix: Resolve delete button authentication error
docs: Update setup guide with MySQL configuration
```

## 💻 Code Style Guidelines

### Backend (Java)

- Follow Java naming conventions (camelCase for variables/methods, PascalCase for classes)
- Use meaningful variable and method names
- Add JavaDoc comments for public methods
- Keep methods focused and concise
- Use proper exception handling
- Follow Spring Boot best practices

Example:
```java
/**
 * Approves a pending listing and sends notification to seller
 * @param listingId ID of the listing to approve
 * @param adminId ID of the admin approving the listing
 * @return Updated listing DTO
 * @throws ResourceNotFoundException if listing not found
 */
public ListingDTO approveListing(Long listingId, Long adminId) {
    // Implementation
}
```

### Frontend (React)

- Use functional components with hooks
- Follow React naming conventions
- Use descriptive component and variable names
- Keep components small and focused
- Use Tailwind CSS classes (avoid inline styles)
- Add PropTypes or TypeScript types
- Handle loading and error states

Example:
```jsx
const ListingCard = ({ listing, onView }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Component content */}
    </div>
  );
};
```

## 🧪 Testing Guidelines

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good code coverage
- Test edge cases and error scenarios

### Backend Testing
```java
@Test
public void testApproveListing_Success() {
    // Arrange
    // Act
    // Assert
}
```

### Frontend Testing
```javascript
describe('ListingCard', () => {
  it('should render listing details correctly', () => {
    // Test implementation
  });
});
```

## 📁 Project Structure Guidelines

### Adding New Backend Files

- **Controllers:** `backend/src/main/java/com/ceylonhomes/backend/controller/`
- **Services:** `backend/src/main/java/com/ceylonhomes/backend/service/`
- **Entities:** `backend/src/main/java/com/ceylonhomes/backend/entity/`
- **DTOs:** `backend/src/main/java/com/ceylonhomes/backend/dto/`
- **Repositories:** `backend/src/main/java/com/ceylonhomes/backend/repository/`

### Adding New Frontend Files

- **Pages:** `frontend/src/pages/`
- **Components:** `frontend/src/components/`
- **Services:** `frontend/src/services/`
- **API calls:** `frontend/src/api/`

## 🔍 Code Review Process

All pull requests will be reviewed for:

- Code quality and readability
- Adherence to project conventions
- Test coverage
- Documentation updates
- Performance implications
- Security considerations

## 🚀 Development Workflow

1. **Setup development environment** (see SETUP_GUIDE.md)
2. **Create issue** describing what you'll work on
3. **Create feature branch** from `main`
4. **Develop and test** your changes locally
5. **Commit changes** with clear messages
6. **Push to your fork**
7. **Submit pull request** with description
8. **Address review feedback** if needed
9. **Celebrate!** 🎉 Once merged

## 🐛 Debugging Tips

### Backend Debugging
- Use Spring Boot DevTools for hot reload
- Enable SQL logging: `spring.jpa.show-sql=true`
- Use breakpoints in your IDE
- Check application logs

### Frontend Debugging
- Use React DevTools browser extension
- Check browser console for errors
- Use Network tab to inspect API calls
- Add console.log statements strategically

## 📚 Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [JWT Best Practices](https://jwt.io/introduction)

## ❓ Questions?

If you have questions about contributing:

- Check existing issues and discussions
- Create a new discussion on GitHub
- Reach out to maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

Thank you for contributing to CeylonHomes! 🏠❤️
