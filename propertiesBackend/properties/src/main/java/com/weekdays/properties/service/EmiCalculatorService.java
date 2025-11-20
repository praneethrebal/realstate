package com.weekdays.properties.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.weekdays.properties.entity.EmiCalculatorModel;
import com.weekdays.properties.repository.EmiCalculatorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmiCalculatorService {
	
	@Autowired
	private EmiCalculatorRepository emiCalculatorRepository;
	
	public EmiCalculatorModel createEmiCalculator(EmiCalculatorModel emi) {
		return emiCalculatorRepository.save(emi);
	}
	
	public double emiAmount(double totalAmount , double rateOfinterest,Long month) {
		double emi=totalAmount*rateOfinterest/100*month;
		
		return emi;
	}

}

