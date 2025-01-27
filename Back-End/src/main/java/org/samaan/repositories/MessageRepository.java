package org.samaan.repositories;

import org.samaan.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByChatIdOrderByTimestampAsc(String chatId);
    List<Message> findByChatIdAndIsReadFalseAndSenderIdNot(String chatId, String userId);
}