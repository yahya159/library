package com.library.book.service;

import com.library.book.entity.Book;
import com.library.book.repository.AuthorRepository;
import com.library.book.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    public BookService(BookRepository bookRepository, AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
    }

    @Transactional(readOnly = true)
    public List<Book> getAllBooks() {
        return bookRepository.findAllWithAuthor();
    }

    @Transactional(readOnly = true)
    public Optional<Book> getBookById(Long id) {
        Optional<Book> result = bookRepository.findById(id);
        result.ifPresent(book -> {
            if (book.getAuthor() != null) {
                book.setAuthorId(book.getAuthor().getId());
                book.setAuthorName(book.getAuthor().getName());
            }
        });
        return result;
    }

    public Book createBook(Book book) {
        if (book.getAuthorId() != null) {
            return authorRepository.findById(book.getAuthorId())
                    .map(author -> {
                        book.setAuthor(author);
                        return bookRepository.save(book);
                    })
                    .orElse(null);
        }
        return bookRepository.save(book);
    }

    public Optional<Book> updateBook(Long id, Book bookDetails) {
        return bookRepository.findById(id)
                .map(book -> {
                    book.setTitle(bookDetails.getTitle());
                    book.setIsbn(bookDetails.getIsbn());
                    book.setPublicationYear(bookDetails.getPublicationYear());
                    if (bookDetails.getAuthorId() != null) {
                        authorRepository.findById(bookDetails.getAuthorId())
                                .ifPresent(book::setAuthor);
                    }
                    return bookRepository.save(book);
                });
    }

    public boolean deleteBook(Long id) {
        return bookRepository.findById(id)
                .map(book -> {
                    bookRepository.delete(book);
                    return true;
                })
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public List<Book> getBooksByAuthor(Long authorId) {
        return bookRepository.findByAuthorId(authorId);
    }
}
