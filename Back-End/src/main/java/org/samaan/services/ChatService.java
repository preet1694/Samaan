package org.samaan.services;

import org.samaan.model.Message;
import org.samaan.repositories.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    public void saveMessage(Message message) {
        chatRepository.save(message);
    }

    public List<Message> getChatHistory(String roomId) {
        return chatRepository.findByRoomId(roomId);
    }
}
