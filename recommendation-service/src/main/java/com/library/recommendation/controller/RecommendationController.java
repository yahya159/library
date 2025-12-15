package com.library.recommendation.controller;

import com.library.recommendation.dto.BookDTO;
import com.library.recommendation.service.RecommendationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationController.class);
    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ResponseEntity<List<BookDTO>> getRecommendations(@RequestParam(value = "count", defaultValue = "5") int count) {
        try {
            List<BookDTO> recommendations = recommendationService.getRandomRecommendations(count);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            logger.error("Error in getRecommendations", e);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }

    @GetMapping("/author/{authorName}")
    public ResponseEntity<List<BookDTO>> getRecommendationsByAuthor(@PathVariable("authorName") String authorName) {
        try {
            List<BookDTO> recommendations = recommendationService.getRecommendationsByAuthor(authorName);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            logger.error("Error in getRecommendationsByAuthor", e);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<List<BookDTO>> getRecentPublications() {
        try {
            List<BookDTO> recommendations = recommendationService.getRecentPublications();
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            logger.error("Error in getRecentPublications", e);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }
}
