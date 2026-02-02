package com.ceylonhomes.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationCode(String toEmail, String code, String userName) {
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
    }
}
