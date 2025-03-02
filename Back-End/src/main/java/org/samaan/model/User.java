package org.samaan.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
@Data
@Document(collection = "users") // Make sure this matches your MongoDB collection
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String role;
    private List<String> roomIds;


    public void setCreatedAt(String string) {
    }

    public void setUpdatedAt(String string) {
    }
}