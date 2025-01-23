package com.example.samaan.repositories;

import com.example.samaan.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email); // Custom query method to find user by email
}
