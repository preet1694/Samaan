package org.samaan.controllers;

import org.samaan.model.Message;
import org.samaan.services.ChatService;
import org.samaan.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Save message and notify carrier
    @MessageMapping("/sendMessage")
    public void sendMessage(Message chatMessage) {
        chatService.saveMessage(chatMessage);

        // Notify the carrier in real-time
        messagingTemplate.convertAndSend("/topic/notifications/" + chatMessage.getCarrierEmail(), "New message from " + chatMessage.getSenderEmail());

        // Send email notification to the carrier
        notificationService.sendEmailNotification(chatMessage.getCarrierEmail(), "New message received", "You have a new message from " + chatMessage.getSenderEmail());
    }

    // Fetch chat history
    @GetMapping("/history/{roomId}")
    public List<Message> getChatHistory(@PathVariable String roomId) {
        return chatService.getChatHistory(roomId);
    }
}
