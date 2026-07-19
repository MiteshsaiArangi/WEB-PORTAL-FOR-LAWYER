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
@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    private String senderId;
    private String senderName;
    private String receiverId;
    private String receiverName;

    private String content;
    private boolean read = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
