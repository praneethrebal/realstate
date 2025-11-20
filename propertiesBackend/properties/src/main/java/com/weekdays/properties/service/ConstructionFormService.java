package com.weekdays.properties.service;

import com.weekdays.properties.entity.ConstructionFormModel;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.repository.ConstructionFormRepository;
import com.weekdays.properties.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;


@RequiredArgsConstructor
@Service
public class ConstructionFormService {
	private final UserRepository userRepo;
	@Autowired
private  ConstructionFormRepository constructionFormRepository;

public ConstructionFormModel createConstructionFormModel(ConstructionFormModel request) {
	String username=SecurityContextHolder.getContext().getAuthentication().getName();
	User user=userRepo.findByUsername(username).orElseThrow(()->new RuntimeException("user not found"));
	request.setUser(user);
	return constructionFormRepository.save(request);
}

public List<ConstructionFormModel>getAllConstructionForms(){
	return constructionFormRepository.findAll();
}

public ConstructionFormModel getconstructionFormById(Long id) {
	return constructionFormRepository.findById(id)
			.orElseThrow(()->new RuntimeException("Construction form not found with id:" +id));
	
}

}