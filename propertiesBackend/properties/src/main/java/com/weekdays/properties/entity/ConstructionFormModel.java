package com.weekdays.properties.entity;



import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class ConstructionFormModel {
   @Id
   @GeneratedValue(strategy= GenerationType.IDENTITY)
       
     private Long id;  
	

	private String customerName;
    private String number;
    private String alternateNumber;
    private String typeOfService;
    private String location;
    private String additionalInfo;
    
    @ManyToOne
   	private User user;
	public Long getId() {
	return id;
}
   public void setId(Long id) {
	this.id = id;
   }
   public String getCustomerName() {
	return customerName;
   }
   public void setCustomerName(String customerName) {
	this.customerName = customerName;
   }
   public String getNumber() {
	return number;
   }
   public void setNumber(String number) {
	this.number = number;
   }
   public String getAlternateNumber() {
	return alternateNumber;
   }
   public void setAlternateNumber(String alternateNumber) {
	this.alternateNumber = alternateNumber;
   }
   public String getTypeOfService() {
	return typeOfService;
   }
   public void setTypeOfService(String typeOfService) {
	this.typeOfService = typeOfService;
   }
   public String getLocation() {
	return location;
   }
   public void setLocation(String location) {
	this.location = location;
   }
   public String getAdditionalInfo() {
	return additionalInfo;
   }
   public void setAdditionalInfo(String additionalInfo) {
	this.additionalInfo = additionalInfo;
   }
}
