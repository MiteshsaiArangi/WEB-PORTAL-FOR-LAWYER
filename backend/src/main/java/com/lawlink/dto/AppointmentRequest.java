package com.lawlink.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AppointmentRequest {

    @NotBlank(message = "Lawyer ID is required")
    private String lawyerId;

    @NotBlank(message = "Date is required")
    private String date;

    @NotBlank(message = "Time slot is required")
    private String timeSlot;

    private String caseType;
    private String description;
}
