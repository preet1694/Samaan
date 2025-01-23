package com.example.samaan.controllers;

import com.example.samaan.models.TravelDetails;
import com.example.samaan.models.SearchRequest;
import com.example.samaan.repositories.TravelDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/carrier")
public class TravelController {

    @Autowired
    private TravelDetailsRepository travelDetailsRepository;

    // Endpoint to search carriers
    @PostMapping("/search")
    public ResponseEntity<List<TravelDetails>> searchCarriers(@RequestBody SearchRequest searchRequest) {
        List<TravelDetails> carriers = travelDetailsRepository.findBySourceAndDestinationAndDate(
                searchRequest.getSource(),
                searchRequest.getDestination(),
                searchRequest.getDate()
        );

        if (carriers.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }

        return ResponseEntity.ok(carriers);
    }
}
