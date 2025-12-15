package com.library.loan.client;

import com.library.loan.dto.BookDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "book-service", url = "${BOOK_SERVICE_URL:http://localhost:8081}")
public interface BookClient {

    @GetMapping("/api/books")
    List<BookDTO> getAllBooks();

    @GetMapping("/api/books/{id}")
    BookDTO getBookById(@PathVariable("id") Long id);
}
