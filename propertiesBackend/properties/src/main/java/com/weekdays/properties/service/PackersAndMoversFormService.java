package com.weekdays.properties.service;

import com.weekdays.properties.entity.PackersAndMoversFormModel;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.repository.PackersAndMoversFormRepository;
import com.weekdays.properties.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PackersAndMoversFormService {
    
	private final UserRepository userRepo;
	@Autowired
	private PackersAndMoversFormRepository packersAndMoversFormRepository;
	
	public PackersAndMoversFormModel CreatePackersAndMoversFormModel(PackersAndMoversFormModel request) {
		
		String username=SecurityContextHolder.getContext().getAuthentication().getName();
		User user=userRepo.findByUsername(username).orElseThrow(()->new RuntimeException("user not found"));
		request.setUser(user);
		return packersAndMoversFormRepository.save(request);
	}
	
	public List<PackersAndMoversFormModel> getPackersAndMoversFormModel(){
		return packersAndMoversFormRepository.findAll();
	}
	
	public PackersAndMoversFormModel getPackersAndMoversFormModelById(Long id) {
		return packersAndMoversFormRepository.findById(id)
				.orElseThrow(()-> new RuntimeException("PackersAndMovers Not Found By Id:" +id));
	} 
}