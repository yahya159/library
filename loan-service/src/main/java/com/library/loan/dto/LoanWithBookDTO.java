package com.library.loan.dto;

import com.library.loan.entity.Loan;
import java.time.LocalDate;

public class LoanWithBookDTO {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String borrowerName;
    private LocalDate loanDate;
    private LocalDate returnDate;
    private boolean returned;

    public LoanWithBookDTO() {}

    public LoanWithBookDTO(Loan loan, BookDTO book) {
        this.id = loan.getId();
        this.bookId = loan.getBookId();
        this.bookTitle = book != null ? book.getTitle() : "Unknown";
        this.borrowerName = loan.getBorrowerName();
        this.loanDate = loan.getLoanDate();
        this.returnDate = loan.getReturnDate();
        this.returned = loan.isReturned();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }

    public String getBorrowerName() { return borrowerName; }
    public void setBorrowerName(String borrowerName) { this.borrowerName = borrowerName; }

    public LocalDate getLoanDate() { return loanDate; }
    public void setLoanDate(LocalDate loanDate) { this.loanDate = loanDate; }

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

    public boolean isReturned() { return returned; }
    public void setReturned(boolean returned) { this.returned = returned; }
}
