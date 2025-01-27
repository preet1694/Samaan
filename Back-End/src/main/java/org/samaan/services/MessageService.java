// File: backend/src/main/java/com/example/deliveryapp/service/MessageService.java
package org.samaan.services;

import org.samaan.model.Chat;
import org.samaan.model.Message;
import org.samaan.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatService chatService;

    public Message sendMessage(String chatId, String senderId, String content) {
        Message message = new Message();
        message.setChatId(chatId);
        message.setSenderId(senderId);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        message.setRead(false);

        Message savedMessage = messageRepository.save(message);

        // Update the chat's last update time
        Chat chat = chatService.getChat(chatId);
        if (chat != null) {
            chatService.updateChat(chat);
        }

        return savedMessage;
    }

    public List<Message> getChatMessages(String chatId) {
        return messageRepository.findByChatIdOrderByTimestampAsc(chatId);
    }

    public List<Message> getUnreadMessages(String chatId, String userId) {
        return messageRepository.findByChatIdAndIsReadFalseAndSenderIdNot(chatId, userId);
    }

    public void markMessagesAsRead(List<Message> messages) {
        for (Message message : messages) {
            message.setRead(true);
        }
        messageRepository.saveAll(messages);
    }
}