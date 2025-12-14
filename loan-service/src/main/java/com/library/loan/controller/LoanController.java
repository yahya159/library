package com.library.loan.controller;

import com.library.loan.dto.LoanWithBookDTO;
import com.library.loan.entity.Loan;
import com.library.loan.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<LoanWithBookDTO> getLoanById(@PathVariable Long id) {
        return loanService.getLoanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/active")
    public List<LoanWithBookDTO> getActiveLoans() {
        return loanService.getActiveLoans();
    }

    @PostMapping
    public ResponseEntity<Loan> createLoan(@Valid @RequestBody Loan loan) {
        Loan createdLoan = loanService.createLoan(loan);
        if (createdLoan == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(createdLoan);
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<Loan> returnBook(@PathVariable Long id) {
        return loanService.returnBook(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/borrower/{borrowerName}")
    public List<Loan> getLoansByBorrower(@PathVariable String borrowerName) {
        return loanService.getLoansByBorrower(borrowerName);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long id) {
        if (loanService.deleteLoan(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
