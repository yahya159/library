package com.library.loan.controller;

import com.library.loan.dto.LoanWithBookDTO;
import com.library.loan.entity.Loan;
import com.library.loan.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping
    public List<LoanWithBookDTO> getAllLoans() {
        return loanService.getAllLoans();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanWithBookDTO> getLoanById(@PathVariable("id") Long id) {
        return loanService.getLoanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/active")
    public List<LoanWithBookDTO> getActiveLoans() {
        return loanService.getActiveLoans();
    }

    @PostMapping
    public ResponseEntity<?> createLoan(@Valid @RequestBody Loan loan) {
        try {
            Loan createdLoan = loanService.createLoan(loan);
            if (createdLoan == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Book not found");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            return ResponseEntity.ok(createdLoan);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<Loan> returnBook(@PathVariable("id") Long id) {
        return loanService.returnBook(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/borrower/{borrowerName}")
    public List<Loan> getLoansByBorrower(@PathVariable("borrowerName") String borrowerName) {
        return loanService.getLoansByBorrower(borrowerName);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable("id") Long id) {
        if (loanService.deleteLoan(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
