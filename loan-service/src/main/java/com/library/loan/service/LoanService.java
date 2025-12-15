package com.library.loan.service;

import com.library.loan.client.BookClient;
import com.library.loan.dto.BookDTO;
import com.library.loan.dto.LoanWithBookDTO;
import com.library.loan.entity.Loan;
import com.library.loan.repository.LoanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class LoanService {

    private final LoanRepository loanRepository;
    private final BookClient bookClient;

    public LoanService(LoanRepository loanRepository, BookClient bookClient) {
        this.loanRepository = loanRepository;
        this.bookClient = bookClient;
    }

    @Transactional(readOnly = true)
    public List<LoanWithBookDTO> getAllLoans() {
        return loanRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<LoanWithBookDTO> getLoanById(Long id) {
        return loanRepository.findById(id).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<LoanWithBookDTO> getActiveLoans() {
        return loanRepository.findByReturnedFalse().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Loan createLoan(Loan loan) {
        try {
            BookDTO book = bookClient.getBookById(loan.getBookId());
            if (book == null) {
                return null;
            }
        } catch (feign.FeignException.NotFound e) {
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify book: " + e.getMessage(), e);
        }
        
        loan.setLoanDate(LocalDate.now());
        loan.setDueDate(loan.getLoanDate().plusDays(14));
        loan.setReturned(false);
        return loanRepository.save(loan);
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
        }
        return new LoanWithBookDTO(loan, book);
    }
}
