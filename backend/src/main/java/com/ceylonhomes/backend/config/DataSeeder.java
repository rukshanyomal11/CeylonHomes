package com.ceylonhomes.backend.config;

import com.ceylonhomes.backend.entity.User;
import com.ceylonhomes.backend.enums.Role;
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
            if (adminEmail == null || adminEmail.isBlank()
                    || adminPassword == null || adminPassword.isBlank()
                    || adminPhone == null || adminPhone.isBlank()) {
                System.out.println("WARNING: Admin credentials are not set. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_PHONE to seed the admin account.");
                return;
            }
            // Check if admin already exists by email OR phone
            boolean adminExistsByEmail = userRepository.findByEmail(adminEmail).isPresent();
            boolean adminExistsByPhone = userRepository.findByPhone(adminPhone).isPresent();
            
            if (!adminExistsByEmail && !adminExistsByPhone) {
                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setPasswordHash(passwordEncoder.encode(adminPassword));
                admin.setName(adminName);
                admin.setPhone(adminPhone);
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                
                System.out.println("✅ Admin user created successfully!");
                System.out.println("📧 Email: " + adminEmail);
            } else {
                System.out.println("ℹ️ Admin user already exists");
                if (adminExistsByEmail) {
                    System.out.println("📧 Email: " + adminEmail + " is already registered");
                }
                if (adminExistsByPhone) {
                    System.out.println("📱 Phone: " + adminPhone + " is already registered");
                }
            }
        };
    }
}
