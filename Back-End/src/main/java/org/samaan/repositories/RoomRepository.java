package org.samaan.repositories;


import org.samaan.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room, String>{
    Room findByRoomId(String roomId);
}
