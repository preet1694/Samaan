package com.example.samaan.repositories;

import com.example.samaan.models.TravelDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
//@CrossOrigin(origins = "http://localhost:5173")
public interface TravelDetailsRepository extends MongoRepository<TravelDetails, String> {
    //List<TravelDetails> findBySourceAndDestination(String source, String destination);
    List<TravelDetails> findBySourceAndDestinationAndDate(String source, String destination, String date);
}
