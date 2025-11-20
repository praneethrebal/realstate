package com.weekdays.properties.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weekdays.properties.entity.LoanApplicationFormModel;

public interface LoanApplicationFormRepository extends JpaRepository<LoanApplicationFormModel, Long>{

}
