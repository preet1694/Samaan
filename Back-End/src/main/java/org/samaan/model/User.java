package org.samaan.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String role;
    private String phoneNumber;
    private boolean isVerified;
    private String profileImage;
    private String createdAt;
    private String updatedAt;

    public String getName() {
        return username;
    }
}