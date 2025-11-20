package com.weekdays.properties.entity;


import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data

public class LoanApplicationFormModel {
	
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	
	private Long id;
	
	

	private String fullName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String toMail;
    private String streetAddress;
    private String unit;   // optional
    private String city;
    private String state;
    private String zipCode;

    private double loanAmount;
    private String loanPurpose;
    private LocalDate dateOfApplication;

    private String employmentStatus;   // Employed, Self-Employed, Unemployed, Retired
    private boolean representedByRealtor;
    private String creditScoreRange;

    private boolean termsAgreed;

    @ManyToOne
   	private User user;
    
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getStreetAddress() {
		return streetAddress;
	}

	public void setStreetAddress(String streetAddress) {
		this.streetAddress = streetAddress;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getZipCode() {
		return zipCode;
	}

	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}

	public double getLoanAmount() {
		return loanAmount;
	}

	public void setLoanAmount(double loanAmount) {
		this.loanAmount = loanAmount;
	}

	public String getLoanPurpose() {
		return loanPurpose;
	}

	public void setLoanPurpose(String loanPurpose) {
		this.loanPurpose = loanPurpose;
	}

	public LocalDate getDateOfApplication() {
		return dateOfApplication;
	}

	public void setDateOfApplication(LocalDate dateOfApplication) {
		this.dateOfApplication = dateOfApplication;
	}

	public String getEmploymentStatus() {
		return employmentStatus;
	}

	public void setEmploymentStatus(String employmentStatus) {
		this.employmentStatus = employmentStatus;
	}

	public boolean isRepresentedByRealtor() {
		return representedByRealtor;
	}

	public void setRepresentedByRealtor(boolean representedByRealtor) {
		this.representedByRealtor = representedByRealtor;
	}

	public String getCreditScoreRange() {
		return creditScoreRange;
	}

	public void setCreditScoreRange(String creditScoreRange) {
		this.creditScoreRange = creditScoreRange;
	}

	public boolean isTermsAgreed() {
		return termsAgreed;
	}

	public void setTermsAgreed(boolean termsAgreed) {
		this.termsAgreed = termsAgreed;
	}
	  
}
