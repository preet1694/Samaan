package com.example.samaan.controllers;

import com.example.samaan.models.TravelDetails;
import com.example.samaan.repositories.TravelDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/travel")
@CrossOrigin(origins = "http://localhost:5173")
public class TravelDetailsController {

    @Autowired
    private TravelDetailsRepository travelDetailsRepository;

    @PostMapping("/submit")
    public ResponseEntity<String> submitTravelDetails(@RequestBody TravelDetails travelDetails) {
        travelDetailsRepository.save(travelDetails);
        return ResponseEntity.ok("Travel details saved successfully.");
    }

    @GetMapping("/search")
    public ResponseEntity<List<TravelDetails>> searchTravelDetails(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String date) {
        List<TravelDetails> results = travelDetailsRepository.findBySourceAndDestinationAndDate(source, destination, date);

        if (results.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 status if no results are found
        }

        return ResponseEntity.ok(results);
    }
}

