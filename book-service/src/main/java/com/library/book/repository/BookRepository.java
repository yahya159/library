package com.library.book.repository;

import com.library.book.entity.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends CrudRepository<Book, Long> {
    @Query("SELECT b FROM Book b WHERE b.author.id = ?1")
    List<Book> findByAuthorId(Long authorId);
    
    @Query("SELECT DISTINCT b FROM Book b LEFT JOIN FETCH b.author")
    List<Book> findAllWithAuthor();
    
    @EntityGraph("Book.withAuthor")
    Optional<Book> findById(Long id);
}
