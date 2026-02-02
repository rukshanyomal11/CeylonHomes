package com.ceylonhomes.backend.service;

import com.ceylonhomes.backend.dto.*;
import com.ceylonhomes.backend.entity.PasswordResetToken;
import com.ceylonhomes.backend.entity.User;
import com.ceylonhomes.backend.enums.Role;
import com.ceylonhomes.backend.repository.PasswordResetTokenRepository;
import com.ceylonhomes.backend.repository.UserRepository;
import com.ceylonhomes.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final EmailService emailService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Check if phone exists
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already exists");
        }

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.SELLER); // Default role for registration
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(
                savedUser.getEmail(),
                savedUser.getId(),
                savedUser.getRole().name()
        );

        // Create user DTO
        UserDTO userDTO = new UserDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getRole()
        );

        return new AuthResponse(token, userDTO);
    }

    public AuthResponse login(LoginRequest request) {
        // Check if user exists first
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email not registered"));

        // Authenticate user - this will throw if password is wrong
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            throw new RuntimeException("Wrong password");
        }

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(
                user.getEmail(),
                user.getId(),
                user.getRole().name()
        );

        // Create user DTO
        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole()
        );

        return new AuthResponse(token, userDTO);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public void sendPasswordResetCode(ForgotPasswordRequest request) {
        // Check if user exists
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No account found with this email address"));

        // Generate 6-digit code
        String code = generateSixDigitCode();

        // Save token with 10 minutes expiry
        PasswordResetToken token = PasswordResetToken.builder()
                .email(request.getEmail())
                .code(code)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .used(false)
                .build();

        resetTokenRepository.save(token);

        // Send email
        try {
            emailService.sendVerificationCode(request.getEmail(), code, user.getName());
        } catch (Exception e) {
            // If email fails, delete the token and throw error
            resetTokenRepository.delete(token);
            throw new RuntimeException("Failed to send email. Please check your email configuration.");
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        // Verify code
        PasswordResetToken token = resetTokenRepository
                .findByEmailAndCodeAndUsedFalseAndExpiryTimeAfter(
                        request.getEmail(),
                        request.getCode(),
                        LocalDateTime.now()
                )
                .orElseThrow(() -> new RuntimeException("Invalid or expired verification code"));

        // Get user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Mark token as used
        token.setUsed(true);
        resetTokenRepository.save(token);
    }

    private String generateSixDigitCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
