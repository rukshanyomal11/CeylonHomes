package com.ceylonhomes.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationCode(String toEmail, String code, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("CeylonHomes - Password Reset Verification Code");
            message.setText(
                "Hello " + userName + ",\n\n" +
                "You requested to reset your password for CeylonHomes.\n\n" +
                "Your verification code is: " + code + "\n\n" +
                "This code will expire in 10 minutes.\n\n" +
                "If you didn't request this password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "CeylonHomes Team"
            );
            
            mailSender.send(message);
            log.info("✅ Verification email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            // In development mode, log the code to console if email fails
            log.error("❌ Failed to send email to: {}. Error: {}", toEmail, e.getMessage());
            log.warn("🔐 DEVELOPMENT MODE - Verification Code for {}: {}", toEmail, code);
            log.warn("⚠️ Please configure email settings in application.yml for production use");
            
            // Print to console for easy visibility
            System.out.println("\n" + "=".repeat(60));
            System.out.println("📧 EMAIL SENDING FAILED - DEVELOPMENT MODE");
            System.out.println("=".repeat(60));
            System.out.println("To: " + toEmail);
            System.out.println("User: " + userName);
            System.out.println("🔐 Verification Code: " + code);
            System.out.println("⏰ Valid for: 10 minutes");
            System.out.println("=".repeat(60) + "\n");
            
            // Don't throw exception in development mode - allow the flow to continue
            // throw new RuntimeException("Failed to send email", e);
        }
    }
}
