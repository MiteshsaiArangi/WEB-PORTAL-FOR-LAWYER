package com.lawlink.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "appointments")
public class Appointment {

    @Id
    private String id;

    private String clientId;
    private String clientName;
    private String lawyerId;
    private String lawyerName;

    private String date;
    private String timeSlot;
    private String caseType;
    private String description;

    private String status;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
