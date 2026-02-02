package com.ceylonhomes.backend.repository;

import com.ceylonhomes.backend.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByEmailAndCodeAndUsedFalseAndExpiryTimeAfter(
        String email, 
        String code, 
        LocalDateTime currentTime
    );
    
    void deleteByExpiryTimeBefore(LocalDateTime currentTime);
}
