package com.lawlink.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MessageRequest {

    @NotBlank(message = "Receiver ID is required")
    private String receiverId;

    @NotBlank(message = "Receiver name is required")
    private String receiverName;

    @NotBlank(message = "Message content is required")
    private String content;
}
