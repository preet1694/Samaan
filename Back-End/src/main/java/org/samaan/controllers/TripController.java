package org.samaan.controllers;

import org.samaan.model.Trip;
import org.samaan.services.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/trips")  // Base path for all trip-related APIs
public class TripController {

    @Autowired
    private TripService tripService;

    @PostMapping("/add")  // URL: http://localhost:8080/api/trips/add
    public ResponseEntity<Trip> addTrip(@Valid @RequestBody Trip trip) {
        Trip savedTrip = tripService.saveTrip(trip);
        return ResponseEntity.ok(savedTrip);
    }

    @GetMapping("/all")  // URL: http://localhost:8080/api/trips/all
    public ResponseEntity<List<Trip>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }
}
