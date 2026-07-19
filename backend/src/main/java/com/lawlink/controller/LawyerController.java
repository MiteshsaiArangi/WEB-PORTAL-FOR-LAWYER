package com.lawlink.controller;

import com.lawlink.dto.*;
import com.lawlink.model.*;
import com.lawlink.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lawyer")
@RequiredArgsConstructor
public class LawyerController {

    private final UserRepository userRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final AppointmentRepository appointmentRepository;
    private final CaseRepository caseRepository;
    private final MessageRepository messageRepository;

    private String getUserId(Authentication auth) {
        return (String) auth.getPrincipal();
    }

    private LawyerProfile getProfile(String userId) {
        return lawyerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Lawyer profile not found"));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(Authentication auth) {
        String userId = getUserId(auth);
        DashboardResponse dash = new DashboardResponse();
        dash.setTotalAppointments(appointmentRepository.findByLawyerId(userId).size());
        dash.setPendingAppointments(appointmentRepository.findByLawyerIdAndStatus(userId, "PENDING").size());
        dash.setActiveCases(caseRepository.findByLawyerIdAndStatus(userId, "ACTIVE").size());
        dash.setUnreadMessages(messageRepository.countByReceiverIdAndReadFalse(userId));
        return ResponseEntity.ok(dash);
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAppointments(Authentication auth) {
        String userId = getUserId(auth);
        return ResponseEntity.ok(appointmentRepository.findByLawyerId(userId));
    }

    @PutMapping("/appointments/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable String id, @RequestBody StatusUpdateRequest request) {
        return appointmentRepository.findById(id).map(apt -> {
            apt.setStatus(request.getStatus());
            apt.setUpdatedAt(LocalDateTime.now());
            appointmentRepository.save(apt);
            return ResponseEntity.ok((Object) apt);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cases")
    public ResponseEntity<List<Case>> getCases(Authentication auth) {
        String userId = getUserId(auth);
        return ResponseEntity.ok(caseRepository.findByLawyerId(userId));
    }

    @PostMapping("/cases")
    public ResponseEntity<?> createCase(Authentication auth, @Valid @RequestBody CaseRequest request) {
        String userId = getUserId(auth);
        LawyerProfile profile = getProfile(userId);

        Case c = new Case();
        c.setLawyerId(userId);
        c.setLawyerName(profile.getName());
        c.setTitle(request.getTitle());
        c.setDescription(request.getDescription());
        c.setCaseType(request.getCaseType());
        c.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        caseRepository.save(c);
        return ResponseEntity.ok(c);
    }

    @PutMapping("/cases/{id}")
    public ResponseEntity<?> updateCase(@PathVariable String id, @RequestBody StatusUpdateRequest request) {
        return caseRepository.findById(id).map(c -> {
            c.setStatus(request.getStatus());
            c.setUpdatedAt(LocalDateTime.now());
            caseRepository.save(c);
            return ResponseEntity.ok((Object) c);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessages(Authentication auth) {
        String userId = getUserId(auth);
        return ResponseEntity.ok(messageRepository.findBySenderIdOrReceiverIdOrderByCreatedAtDesc(userId, userId));
    }

    @PostMapping("/messages")
    public ResponseEntity<?> sendMessage(Authentication auth, @Valid @RequestBody MessageRequest request) {
        String userId = getUserId(auth);
        LawyerProfile profile = getProfile(userId);

        Message msg = new Message();
        msg.setSenderId(userId);
        msg.setSenderName(profile.getName());
        msg.setReceiverId(request.getReceiverId());
        msg.setReceiverName(request.getReceiverName());
        msg.setContent(request.getContent());

        messageRepository.save(msg);
        return ResponseEntity.ok(msg);
    }

    @PutMapping("/messages/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        return messageRepository.findById(id).map(msg -> {
            msg.setRead(true);
            messageRepository.save(msg);
            return ResponseEntity.ok((Object) msg);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        String userId = getUserId(auth);
        return lawyerProfileRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication auth, @RequestBody ProfileUpdateRequest request) {
        String userId = getUserId(auth);
        return lawyerProfileRepository.findByUserId(userId).map(profile -> {
            if (request.getName() != null) profile.setName(request.getName());
            if (request.getPhone() != null) profile.setPhone(request.getPhone());
            if (request.getBio() != null) profile.setBio(request.getBio());
            if (request.getFirm() != null) profile.setFirm(request.getFirm());
            if (request.getAddress() != null) profile.setAddress(request.getAddress());
            if (request.getSkills() != null) profile.setSkills(java.util.List.of(request.getSkills()));
            if (request.getAvailable() != null) profile.setAvailable(request.getAvailable());
            profile.setUpdatedAt(LocalDateTime.now());
            lawyerProfileRepository.save(profile);
            return ResponseEntity.ok((Object) Map.of("success", true, "message", "Profile updated"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
