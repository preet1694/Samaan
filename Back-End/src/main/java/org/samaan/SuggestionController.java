package org.samaan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/suggestions")
public class SuggestionController {

    @Autowired
    private GeocodingService geocodingService;

    @GetMapping
    public ResponseEntity<List<String>> getSuggestions(@RequestParam String query) {
        List<String> suggestions = geocodingService.getSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }
}
