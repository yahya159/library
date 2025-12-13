package com.library.loan.repository;

import com.library.loan.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByBorrowerName(String borrowerName);
    List<Loan> findByReturnedFalse();
    List<Loan> findByBookId(Long bookId);
}
