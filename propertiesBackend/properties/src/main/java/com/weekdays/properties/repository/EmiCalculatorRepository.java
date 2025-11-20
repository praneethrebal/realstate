package com.weekdays.properties.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weekdays.properties.entity.EmiCalculatorModel;

public interface EmiCalculatorRepository extends JpaRepository<EmiCalculatorModel, Long> {

}
