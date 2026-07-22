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
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientController {

    private final UserRepository userRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final AppointmentRepository appointmentRepository;
    private final CaseRepository caseRepository;
    private final MessageRepository messageRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        DashboardResponse dash = new DashboardResponse();
        dash.setTotalAppointments(appointmentRepository.findByClientId(userId).size());
        dash.setPendingAppointments(appointmentRepository.findByClientIdAndStatus(userId, "PENDING").size());
        dash.setActiveCases(caseRepository.findByClientIdAndStatus(userId, "ACTIVE").size());
        dash.setUnreadMessages(messageRepository.countByReceiverIdAndReadFalse(userId));
        return ResponseEntity.ok(dash);
    }

    @GetMapping("/lawyers")
    public ResponseEntity<List<LawyerProfile>> getLawyers(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String search) {

        List<LawyerProfile> lawyers;
        if (search != null && !search.trim().isEmpty()) {
            lawyers = lawyerProfileRepository.searchByNameOrSpecialization(search.trim());
        } else if (specialization != null && !specialization.trim().isEmpty()) {
            lawyers = lawyerProfileRepository.findByVerifiedAndSpecialization(true, specialization.trim());
        } else if (city != null && !city.trim().isEmpty()) {
            lawyers = lawyerProfileRepository.findByVerifiedAndCity(true, city.trim());
        } else if (state != null && !state.trim().isEmpty()) {
            lawyers = lawyerProfileRepository.findByVerifiedAndState(true, state.trim());
        } else {
            lawyers = lawyerProfileRepository.findByVerifiedAndAvailableTrue(true);
        }
        return ResponseEntity.ok(lawyers);
    }

    @GetMapping("/lawyers/{id}")
    public ResponseEntity<?> getLawyerDetail(@PathVariable String id) {
        return lawyerProfileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAppointments(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(appointmentRepository.findByClientId(userId));
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(Authentication auth, @Valid @RequestBody AppointmentRequest request) {
        String userId = (String) auth.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow();

        LawyerProfile lawyer = lawyerProfileRepository.findById(request.getLawyerId())
                .orElseThrow(() -> new RuntimeException("Lawyer not found"));

        Appointment apt = new Appointment();
        apt.setClientId(userId);
        apt.setClientName(user.getName());
        apt.setLawyerId(lawyer.getUserId());
        apt.setLawyerName(lawyer.getName());
        apt.setDate(request.getDate());
        apt.setTimeSlot(request.getTimeSlot());
        apt.setCaseType(request.getCaseType());
        apt.setDescription(request.getDescription());
        apt.setStatus("PENDING");

        appointmentRepository.save(apt);
        return ResponseEntity.ok(apt);
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
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(caseRepository.findByClientId(userId));
    }

    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessages(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(messageRepository.findBySenderIdOrReceiverIdOrderByCreatedAtDesc(userId, userId));
    }

    @PostMapping("/messages")
    public ResponseEntity<?> sendMessage(Authentication auth, @Valid @RequestBody MessageRequest request) {
        String userId = (String) auth.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow();

        Message msg = new Message();
        msg.setSenderId(userId);
        msg.setSenderName(user.getName());
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
        String userId = (String) auth.getPrincipal();
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok((Object) Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "phone", user.getPhone() != null ? user.getPhone() : "",
                        "location", user.getLocation() != null ? user.getLocation() : "",
                        "role", user.getRole()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication auth, @RequestBody ProfileUpdateRequest request) {
        String userId = (String) auth.getPrincipal();
        return userRepository.findById(userId).map(user -> {
            if (request.getName() != null) user.setName(request.getName());
            if (request.getPhone() != null) user.setPhone(request.getPhone());
            if (request.getLocation() != null) user.setLocation(request.getLocation());
            if (request.getProfileImage() != null) user.setProfileImage(request.getProfileImage());
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            return ResponseEntity.ok((Object) Map.of("success", true, "message", "Profile updated"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
