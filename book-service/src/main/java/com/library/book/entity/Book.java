package com.library.book.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "books")
@NamedEntityGraph(
    name = "Book.withAuthor",
    attributeNodes = @NamedAttributeNode("author")
)
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
    @Column(nullable = false)
    private String title;

    @Column(unique = true)
    private String isbn;

    private Integer publicationYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    @JsonIgnore
    private Author author;

    @Transient
    private Long authorId;

    @Transient
    private String authorName;

    public Book() {}

    public Book(String title, String isbn, Integer publicationYear) {
        this.title = title;
        this.isbn = isbn;
        this.publicationYear = publicationYear;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public Integer getPublicationYear() { return publicationYear; }
    public void setPublicationYear(Integer publicationYear) { this.publicationYear = publicationYear; }

    public Author getAuthor() { return author; }
    public void setAuthor(Author author) { 
        this.author = author;
        if (author != null) {
            this.authorId = author.getId();
            this.authorName = author.getName();
        }
    }
    
    @PostLoad
    private void populateTransientFields() {
        if (author != null) {
            this.authorId = author.getId();
            this.authorName = author.getName();
        }
    }

    public Long getAuthorId() {
        if (author != null && author.getId() != null) {
            return author.getId();
        }
        return authorId;
    }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public String getAuthorName() {
        if (author != null && author.getName() != null) {
            return author.getName();
        }
        return authorName;
    }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
}
