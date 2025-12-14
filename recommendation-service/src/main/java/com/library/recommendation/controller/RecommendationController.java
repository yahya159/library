package com.library.recommendation.controller;

import com.library.recommendation.dto.BookDTO;
import com.library.recommendation.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public List<BookDTO> getRecommendations(@RequestParam(defaultValue = "5") int count) {
        return recommendationService.getRandomRecommendations(count);
    }

    @GetMapping("/author/{authorName}")
    public List<BookDTO> getRecommendationsByAuthor(@PathVariable String authorName) {
        return recommendationService.getRecommendationsByAuthor(authorName);
    }

    @GetMapping("/recent")
    public List<BookDTO> getRecentPublications() {
        return recommendationService.getRecentPublications();
    }
}
