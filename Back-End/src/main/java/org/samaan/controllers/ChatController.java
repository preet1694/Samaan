package org.samaan.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import org.samaan.model.Message;
import org.samaan.services.ChatService;
import org.samaan.services.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private NotificationService notificationService;

    // ✅ Save Message to Database
    @PostMapping("/save")
    public ResponseEntity<List<Message>> saveMessage(@RequestBody Message message) {
        chatService.saveMessage(message);
//        notificationService.sendEmailNotification(
//                message.getCarrierEmail(),
//                "New Chat Message",
//                "You have a new message from " + message.getSenderEmail()
//        );
            List<Message> messages = chatService.getChatHistory(message.getRoomId());
            return ResponseEntity.ok(messages);
    }

    // ✅ Get Chat History
    @GetMapping("/history")
    public List<Message> getChatHistory(@RequestParam String roomId) {
        return chatService.getChatHistory(roomId);
    }

    // ✅ WebSocket Message Handling
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/chat/{roomId}")
    public Message sendMessage(@Payload Message message) {
        chatService.saveMessage(message);
        return message;
    }
}
