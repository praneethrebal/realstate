package com.weekdays.properties.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data

public class PackersAndMoversFormModel {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	
	private Long id;
	
	

	private String customerName;
    private String number;
    private String alternateNumber;
    private String typeOfService;
    private String fromLocation;
    private String toLocation;
    private String fromFloor;
    private String toFloor;
    private int    noOfMenPower;
    private String typeOfVehicle;
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
	public String getFromLocation() {
		return fromLocation;
	}
	public void setFromLocation(String fromLocation) {
		this.fromLocation = fromLocation;
	}
	public String getToLocation() {
		return toLocation;
	}
	public void setToLocation(String toLocation) {
		this.toLocation = toLocation;
	}
	public String getFromFloor() {
		return fromFloor;
	}
	public void setFromFloor(String fromFloor) {
		this.fromFloor = fromFloor;
	}
	public String getToFloor() {
		return toFloor;
	}
	public void setToFloor(String toFloor) {
		this.toFloor = toFloor;
	}
	public int getNoOfMenPower() {
		return noOfMenPower;
	}
	public void setNoOfMenPower(int noOfMenPower) {
		this.noOfMenPower = noOfMenPower;
	}
	public String getTypeOfVehicle() {
		return typeOfVehicle;
	}
	public void setTypeOfVehicle(String typeOfVehicle) {
		this.typeOfVehicle = typeOfVehicle;
	}
	public String getAdditionalInfo() {
		return additionalInfo;
	}
	public void setAdditionalInfo(String additionalInfo) {
		this.additionalInfo = additionalInfo;
	}

}
