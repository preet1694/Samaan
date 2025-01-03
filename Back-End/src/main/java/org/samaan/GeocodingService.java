package org.samaan;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@SuppressWarnings("ALL")
@Service
public class GeocodingService {
    private final RestTemplate restTemplate = new RestTemplate();
    public List<String> getSuggestions(String query) {

        String apiKey = "45cd452c08ed438e99edcfba859306aa"; // Replace with your OpenCage API key
        String url = "https://api.opencagedata.com/geocode/v1/json?q=" + query + "&key=" + apiKey + "&countrycode=in"+"&limit=5";


        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        Map body = response.getBody();

        if (body == null || !body.containsKey("results")) {
            return List.of();
        }

        var results = (List<Map>) body.get("results");

        return results.stream()
                .map(result -> (String) result.get("formatted"))        // Get the formatted address
                .collect(Collectors.toList());
    }

    public LatLng getCoordinates(String address) {

        String apiKey = "API_KEY";                 // Replace with your actual OpenCage API key
        String url = "https://api.opencagedata.com/geocode/v1/json?q=" + address + "&key=" + apiKey;

        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        Map body = response.getBody();

        if (body == null || !body.containsKey("results")) {
            return null;
        }

        var results = (List<Map>) body.get("results");
        if (results.isEmpty()) {
            return null;
        }

        Map geometry = (Map) results.get(0).get("geometry");

        double lat = (Double) geometry.get("lat");
        double lng = (Double) geometry.get("lng");

        return new LatLng(lat, lng);
    }
}