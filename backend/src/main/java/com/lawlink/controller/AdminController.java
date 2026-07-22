package com.lawlink.controller;

import com.lawlink.model.LawyerProfile;
import com.lawlink.model.User;
import com.lawlink.repository.LawyerProfileRepository;
import com.lawlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final LawyerProfileRepository lawyerProfileRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        long totalLawyers = lawyerProfileRepository.count();
        long verifiedLawyers = lawyerProfileRepository.findByVerifiedAndAvailableTrue(true).size();
        long pendingLawyers = lawyerProfileRepository.findByVerificationStatus("PENDING").size();
        long totalUsers = userRepository.count();
        return ResponseEntity.ok(Map.of(
                "totalLawyers", totalLawyers,
                "verifiedLawyers", verifiedLawyers,
                "pendingLawyers", pendingLawyers,
                "totalUsers", totalUsers
        ));
    }

    @GetMapping("/pending-lawyers")
    public ResponseEntity<List<LawyerProfile>> getPendingLawyers() {
        return ResponseEntity.ok(lawyerProfileRepository.findByVerificationStatus("PENDING"));
    }

    @GetMapping("/verified-lawyers")
    public ResponseEntity<List<LawyerProfile>> getVerifiedLawyers() {
        return ResponseEntity.ok(lawyerProfileRepository.findByVerifiedAndAvailableTrue(true));
    }

    @GetMapping("/rejected-lawyers")
    public ResponseEntity<List<LawyerProfile>> getRejectedLawyers() {
        return ResponseEntity.ok(lawyerProfileRepository.findByVerificationStatus("REJECTED"));
    }

    @PutMapping("/verify-lawyer/{id}")
    public ResponseEntity<?> verifyLawyer(@PathVariable String id, @RequestBody Map<String, String> body) {
        return lawyerProfileRepository.findById(id).map(profile -> {
            String action = body.getOrDefault("action", "approve");
            if ("approve".equals(action)) {
                profile.setVerified(true);
                profile.setVerificationStatus("VERIFIED");
            } else {
                profile.setVerified(false);
                profile.setVerificationStatus("REJECTED");
            }
            profile.setUpdatedAt(LocalDateTime.now());
            lawyerProfileRepository.save(profile);
            return ResponseEntity.ok(Map.of("success", true, "message",
                    "approve".equals(action) ? "Lawyer verified successfully" : "Lawyer rejected"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/lawyers/{id}")
    public ResponseEntity<?> getLawyerDetail(@PathVariable String id) {
        return lawyerProfileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
