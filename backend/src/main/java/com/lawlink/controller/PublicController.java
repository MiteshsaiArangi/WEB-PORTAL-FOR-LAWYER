package com.lawlink.controller;

import com.lawlink.dto.ContactRequest;
import com.lawlink.model.LawyerProfile;
import com.lawlink.repository.LawyerProfileRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final LawyerProfileRepository lawyerProfileRepository;

    @GetMapping("/lawyers")
    public ResponseEntity<List<LawyerProfile>> getLawyers(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String search) {
        List<LawyerProfile> lawyers;
        if (search != null && !search.isBlank()) {
            lawyers = lawyerProfileRepository.searchByNameOrSpecialization(search);
        } else if (specialization != null && !specialization.isBlank()) {
            lawyers = lawyerProfileRepository.findBySpecialization(specialization);
        } else {
            lawyers = lawyerProfileRepository.findByAvailableTrue();
        }
        return ResponseEntity.ok(lawyers);
    }

    @GetMapping("/lawyers/{id}")
    public ResponseEntity<?> getLawyerDetail(@PathVariable String id) {
        return lawyerProfileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/contact")
    public ResponseEntity<?> submitContact(@Valid @RequestBody ContactRequest request) {
        log.info("Contact form submission from {} ({})", request.getName(), request.getEmail());
        return ResponseEntity.ok(Map.of("success", true, "message", "Thank you for your message. We will get back to you soon."));
    }
}
