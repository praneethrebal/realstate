package com.weekdays.properties.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class FranchiseFormModel {
     
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	
	private Long id;
	

	private String name;
    private String email;
    private String contact;
    private String preferredLocation;
    private String businessExperience;
    private String reasonToStartFranchise;
    private String radious;
    
    @ManyToOne
   	private User user;
    
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
	}
	public String getPreferredLocation() {
		return preferredLocation;
	}
	public void setPreferredLocation(String preferredLocation) {
		this.preferredLocation = preferredLocation;
	}
	public String getBusinessExperience() {
		return businessExperience;
	}
	public void setBusinessExperience(String businessExperience) {
		this.businessExperience = businessExperience;
	}
	public String getReasonToStartFranchise() {
		return reasonToStartFranchise;
	}
	public void setReasonToStartFranchise(String reasonToStartFranchise) {
		this.reasonToStartFranchise = reasonToStartFranchise;
	}
}