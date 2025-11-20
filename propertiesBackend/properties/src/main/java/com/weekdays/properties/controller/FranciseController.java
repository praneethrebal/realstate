package com.weekdays.properties.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.weekdays.properties.entity.AddPropertyModel;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.entity.VerifiedProperties;
import com.weekdays.properties.repository.UserRepository;
import com.weekdays.properties.repository.VerifyPropertyRepo;
import com.weekdays.properties.service.AddPropertyService;
import com.weekdays.properties.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class FranciseController {


	private final AddPropertyService addPropertyService;
	
	 @GetMapping("fAssignedProp")
	    public ResponseEntity<List<AddPropertyModel>> getAssignedPropertys()
	    {
		 List<AddPropertyModel> ass=addPropertyService.getAssignedPropertys();
	    	
	    	return ResponseEntity.status(HttpStatus.OK).body(ass);
	    }
	 
	 @PostMapping("verifyProperty/{propId}")
	 public ResponseEntity<String> verifyProperty(@PathVariable Long propId)
	 {
		 addPropertyService.makePropertyVerifyed(propId);
		 return ResponseEntity.status(HttpStatus.OK).body("Property Verified");
	 }
	 
	 @GetMapping("verifiedProp")
	 public List<VerifiedProperties> verifiedProperties()
	 {
		 List<VerifiedProperties> v=addPropertyService.verifyPropertys();
		 return v;
		
	 }
	 @GetMapping("pendingProp")
	 public ResponseEntity<List<AddPropertyModel>> pendingProp(){
		 List<AddPropertyModel> p=addPropertyService.pendingProperties();
		 return ResponseEntity.status(HttpStatus.OK).body(p);
	 }
	 

}
