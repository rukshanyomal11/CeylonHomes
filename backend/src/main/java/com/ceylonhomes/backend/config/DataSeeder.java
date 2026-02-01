package com.ceylonhomes.backend.config;

import com.ceylonhomes.backend.entity.User;
import com.ceylonhomes.backend.enums.UserRole;
import com.ceylonhomes.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.name}")
    private String adminName;

    @Value("${admin.phone}")
    private String adminPhone;

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin already exists
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setName(adminName);
                admin.setPhoneNumber(adminPhone);
                admin.setRole(UserRole.ADMIN);
                userRepository.save(admin);
                
                System.out.println("✅ Admin user created successfully!");
                System.out.println("📧 Email: " + adminEmail);
                System.out.println("🔑 Password: " + adminPassword);
            } else {
                System.out.println("ℹ️ Admin user already exists with email: " + adminEmail);
            }
        };
    }
}
