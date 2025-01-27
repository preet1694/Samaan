// File: backend/src/main/java/com/example/deliveryapp/repository/ChatRepository.java
package org.samaan.repositories;

import org.samaan.model.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;

//import java.lang.ScopedValue;
import java.util.List;
import java.util.Optional;

public interface ChatRepository extends MongoRepository<Chat, String> {
    List<Chat> findByParticipantsContaining(String userId);

    Chat save(Chat chat);

    Optional<Chat> findById(String chatId);
}