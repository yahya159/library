package com.library.loan.service;

import com.library.loan.client.BookClient;
import com.library.loan.dto.BookDTO;
import com.library.loan.dto.LoanWithBookDTO;
import com.library.loan.entity.Loan;
import com.library.loan.repository.LoanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class LoanService {

    private static final Logger log = LoggerFactory.getLogger(LoanService.class);

    private final LoanRepository loanRepository;
    private final BookClient bookClient;

    public LoanService(LoanRepository loanRepository, BookClient bookClient) {
        this.loanRepository = loanRepository;
        this.bookClient = bookClient;
    }

    @Transactional(readOnly = true)
    public List<LoanWithBookDTO> getAllLoans() {
        log.debug("Fetching all loans");
        return loanRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<LoanWithBookDTO> getLoanById(Long id) {
        log.debug("Fetching loan with id: {}", id);
        return loanRepository.findById(id).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<LoanWithBookDTO> getActiveLoans() {
        log.debug("Fetching active loans");
        return loanRepository.findByReturnedFalse().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Loan createLoan(Loan loan) {
        log.info("Creating loan for book {} by {}", loan.getBookId(), loan.getBorrowerName());
        
        try {
            BookDTO book = bookClient.getBookById(loan.getBookId());
            if (book == null) {
                log.warn("Book with id {} not found", loan.getBookId());
                return null;
            }
        } catch (Exception e) {
            log.error("Error verifying book {}: {}", loan.getBookId(), e.getMessage());
            return null;
        }
        
        loan.setLoanDate(LocalDate.now());
        loan.setReturned(false);
        Loan savedLoan = loanRepository.save(loan);
        log.info("Loan created with id: {}", savedLoan.getId());
        return savedLoan;
    }

    public Optional<Loan> returnBook(Long id) {
        return loanRepository.findById(id)
                .map(loan -> {
                    loan.setReturned(true);
                    loan.setReturnDate(LocalDate.now());
                    return loanRepository.save(loan);
                });
    }

    public boolean deleteLoan(Long id) {
        return loanRepository.findById(id)
                .map(loan -> {
                    loanRepository.delete(loan);
                    return true;
                })
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public List<Loan> getLoansByBorrower(String borrowerName) {
        return loanRepository.findByBorrowerName(borrowerName);
    }

    private LoanWithBookDTO convertToDTO(Loan loan) {
        BookDTO book = null;
        try {
            book = bookClient.getBookById(loan.getBookId());
        } catch (Exception e) {
            log.warn("Could not fetch book {} for loan {}: {}", loan.getBookId(), loan.getId(), e.getMessage());
        }
        return new LoanWithBookDTO(loan, book);
    }
}
