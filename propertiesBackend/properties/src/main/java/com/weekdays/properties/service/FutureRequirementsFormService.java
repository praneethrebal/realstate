package com.weekdays.properties.service;

import com.weekdays.properties.entity.FutureRequirementsFormModel;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.repository.FutureRequirementsFormRepository;
import com.weekdays.properties.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FutureRequirementsFormService {

	private final UserRepository userRepo; 
	@Autowired
	private FutureRequirementsFormRepository futureRequirementsFormRepository;
	
	public FutureRequirementsFormModel createFutureRequirementsFormModel(FutureRequirementsFormModel request) {
		String username=SecurityContextHolder.getContext().getAuthentication().getName();
		User user=userRepo.findByUsername(username).orElseThrow(()->new RuntimeException("user not found"));
		request.setUser(user);
		return futureRequirementsFormRepository.save(request);
	}
	
	public List<FutureRequirementsFormModel> getAllFutureRequirementsForms(){
		return futureRequirementsFormRepository.findAll();
	}
	
	public FutureRequirementsFormModel getAllFutureRequirementsFormsById(Long id) {
		return futureRequirementsFormRepository.findById(id)
				.orElseThrow(()->new RuntimeException("Future Requirements Form Not Found By Id:"+ id));
	}
}