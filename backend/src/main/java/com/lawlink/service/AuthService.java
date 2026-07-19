package com.lawlink.service;

import com.lawlink.dto.AuthRequest;
import com.lawlink.dto.AuthResponse;
import com.lawlink.dto.SignupRequest;
import com.lawlink.model.LawyerProfile;
import com.lawlink.model.User;
import com.lawlink.repository.LawyerProfileRepository;
import com.lawlink.repository.UserRepository;
import com.lawlink.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setLocation(request.getLocation());
        user.setRole(request.getRole() != null ? request.getRole() : "CLIENT");
        if (request.getProfileImage() != null) user.setProfileImage(request.getProfileImage());

        userRepository.save(user);

        if ("LAWYER".equals(user.getRole()) && request.getBarNumber() != null) {
            LawyerProfile profile = new LawyerProfile();
            profile.setUserId(user.getId());
            profile.setName(user.getName());
            profile.setEmail(user.getEmail());
            profile.setPhone(user.getPhone());
            profile.setBarNumber(request.getBarNumber());
            profile.setSpecialization(request.getSpecialization());
            profile.setExperience(request.getExperience() != null ? request.getExperience() : 0);
            profile.setFirm(request.getFirm());
            profile.setAddress(request.getAddress());
            profile.setBio(request.getBio());
            profile.setEducation(request.getEducation());
            profile.setSkills(request.getSkills() != null ? java.util.List.of(request.getSkills()) : new ArrayList<>());
            if (request.getProfileImage() != null) profile.setProfileImage(request.getProfileImage());
            lawyerProfileRepository.save(profile);
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if ("LAWYER".equals(user.getRole()) && request.getBarNumber() != null) {
            LawyerProfile profile = lawyerProfileRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Lawyer profile not found"));
            if (!profile.getBarNumber().equals(request.getBarNumber())) {
                throw new RuntimeException("Invalid bar registration number");
            }
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
