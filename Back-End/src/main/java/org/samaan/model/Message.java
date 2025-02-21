package org.samaan.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "messages") // Specifies this is a MongoDB document
public class Message {

    @Id
    private String id; // Unique identifier for MongoDB

    private String senderId;  // ID of sender
    private String receiverId; // ID of receiver
    private String content;
    private LocalDateTime timestamp;

    // Constructor for sending messages
    public Message(String senderId, String receiverId, String content) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = LocalDateTime.now();
    }
}
