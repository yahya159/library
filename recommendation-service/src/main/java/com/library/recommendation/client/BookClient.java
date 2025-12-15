package com.library.recommendation.client;

import com.library.recommendation.dto.BookDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "book-service", url = "${BOOK_SERVICE_URL:http://localhost:8081}")
public interface BookClient {

    @GetMapping("/api/books")
    List<BookDTO> getAllBooks();
}
