package com.library.recommendation.service;

import com.library.recommendation.client.BookClient;
import com.library.recommendation.dto.BookDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);
    private final BookClient bookClient;

    public RecommendationService(BookClient bookClient) {
        this.bookClient = bookClient;
    }

    public List<BookDTO> getRandomRecommendations(int count) {
        try {
            List<BookDTO> allBooks = bookClient.getAllBooks();
            if (allBooks == null || allBooks.isEmpty()) {
                logger.warn("No books available for recommendations");
                return Collections.emptyList();
            }
            
            Collections.shuffle(allBooks);
            return allBooks.stream()
                    .limit(count)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching random recommendations", e);
            return Collections.emptyList();
        }
    }

    public List<BookDTO> getRecommendationsByAuthor(String authorName) {
        try {
            List<BookDTO> allBooks = bookClient.getAllBooks();
            if (allBooks == null) {
                logger.warn("No books returned from book service");
                return Collections.emptyList();
            }
            return allBooks.stream()
                    .filter(book -> book.getAuthorName() != null 
                            && book.getAuthorName().toLowerCase().contains(authorName.toLowerCase()))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching recommendations by author: " + authorName, e);
            return Collections.emptyList();
        }
    }

    /**
     * Get recent publications (last 10 years)
     * @return list of recent books
     */
    public List<BookDTO> getRecentPublications() {
        int currentYear = java.time.Year.now().getValue();
        try {
            List<BookDTO> allBooks = bookClient.getAllBooks();
            if (allBooks == null) {
                logger.warn("No books returned from book service");
                return Collections.emptyList();
            }
            return allBooks.stream()
                    .filter(book -> book.getPublicationYear() != null 
                            && book.getPublicationYear() >= currentYear - 10)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching recent publications", e);
            return Collections.emptyList();
        }
    }
}
