package com.lawlink.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String name;
    private String phone;
    private String location;
    private String profileImage;

    // Lawyer-specific
    private String bio;
    private String firm;
    private String address;
    private String[] skills;
    private Boolean available;
}
