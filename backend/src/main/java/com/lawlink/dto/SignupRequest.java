package com.lawlink.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String phone;
    private String location;
    private String role; // CLIENT or LAWYER

    // Lawyer-specific fields
    private String barNumber;
    private String specialization;
    private Integer experience;
    private String firm;
    private String address;
    private String city;
    private String state;
    private String bio;
    private String education;
    private String[] skills;
    private String profileImage;
}
