package org.samaan.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String chatId;
    private String senderId;
    private String content;
    private LocalDateTime timestamp;
    private boolean isRead;
}