package com.lawlink.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "lawyer_profiles")
public class LawyerProfile {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private String name;
    private String email;
    private String phone;

    @Indexed(unique = true)
    private String barNumber;

    private String specialization;
    private int experience;
    private String firm;
    private String address;
    private String city;
    private String state;
    private String bio;
    private String education;
    private String profileImage;

    private List<String> skills = new ArrayList<>();

    private boolean available = true;
    private boolean verified = false;
    private String verificationStatus = "PENDING";
    private double rating = 0.0;
    private int casesHandled = 0;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
