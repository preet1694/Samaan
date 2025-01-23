package com.example.samaan.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "carrier_data")
//@CrossOrigin(origins = "http://localhost:5173")
public class TravelDetails {
    @Id
    private String id;

    private String carrierId;    // ID of the carrier user
    private String carrierName;  // Name of the carrier
    private String source;       // Source location
    private String destination;  // Destination location
    private String startLandmark; // Starting landmark
    private String endLandmark;   // Ending landmark
    private String date;         // Travel date
    private String vehicle;      // Vehicle type
    private double capacity;     // Capacity in kg

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCarrierId() {
        return carrierId;
    }

    public void setCarrierId(String carrierId) {
        this.carrierId = carrierId;
    }

    public String getCarrierName() {
        return carrierName;
    }

    public void setCarrierName(String carrierName) {
        this.carrierName = carrierName;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getStartLandmark() {
        return startLandmark;
    }

    public void setStartLandmark(String startLandmark) {
        this.startLandmark = startLandmark;
    }

    public String getEndLandmark() {
        return endLandmark;
    }

    public void setEndLandmark(String endLandmark) {
        this.endLandmark = endLandmark;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getVehicle() {
        return vehicle;
    }

    public void setVehicle(String vehicle) {
        this.vehicle = vehicle;
    }

    public double getCapacity() {
        return capacity;
    }

    public void setCapacity(double capacity) {
        this.capacity = capacity;
    }
}
