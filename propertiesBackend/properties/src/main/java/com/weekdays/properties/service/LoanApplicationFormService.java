package com.weekdays.properties.service;

import com.weekdays.properties.entity.LoanApplicationFormModel;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.repository.LoanApplicationFormRepository;
import com.weekdays.properties.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanApplicationFormService {
	
	
	private final UserRepository userRepo;
	@Autowired
	private LoanApplicationFormRepository loanApplicationFormRepository;
	
	public LoanApplicationFormModel createLoanApplicationForm(LoanApplicationFormModel request) {
		String username=SecurityContextHolder.getContext().getAuthentication().getName();
		User user=userRepo.findByUsername(username).orElseThrow(()->new RuntimeException("user not found"));
		request.setUser(user);
		return loanApplicationFormRepository.save(request);
	}
	
	public List<LoanApplicationFormModel> getAllLoanApplicationForm(){
		return loanApplicationFormRepository.findAll();
	}
	
	public LoanApplicationFormModel getAllLoanApplicationFormById(Long id) {
		return loanApplicationFormRepository.findById(id)
				.orElseThrow(()->new RuntimeException("Loan Application form not Found By Id:" +id));
	}
	
	

}