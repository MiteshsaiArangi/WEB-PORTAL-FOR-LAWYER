package com.lawlink.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CaseRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String lawyerId;

    private String description;
    private String caseType;
    private String status;
}
