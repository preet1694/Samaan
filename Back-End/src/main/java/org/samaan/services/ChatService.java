// File: backend/src/main/java/com/example/deliveryapp/service/ChatService.java
package org.samaan.services;

import org.samaan.model.Chat;
import org.samaan.repositories.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    public Chat createChat(List<String> participants) {
        Chat chat = new Chat();
        chat.setParticipants(participants);
        chat.setCreatedAt(LocalDateTime.now());
        chat.setUpdatedAt(LocalDateTime.now());
        return chatRepository.save(chat);
    }

    public Chat getChat(String chatId) {
        return chatRepository.findById(chatId).orElse(null);
    }

    public List<Chat> getUserChats(String userId) {
        return chatRepository.findByParticipantsContaining(userId);
    }

    public Chat updateChat(Chat chat) {
        chat.setUpdatedAt(LocalDateTime.now());
        return chatRepository.save(chat);
    }
}