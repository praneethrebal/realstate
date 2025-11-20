package com.weekdays.properties.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Lottery {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
    @ManyToOne
    @JoinColumn(name = "lottery_form_id", referencedColumnName = "id") // ✅ FIXED
    private LotteryForm lotteryForm;
	@ManyToOne
	private User user;
	private String transcation_id;
	private String screenShotPath;
	private Long amount;
	private String name;
	private String mobileNumber;
	private String altNumber;
	private String toMail;
	private String postalAddressCode;
	private String State;
	private String Distict;
	private String areaAndCity;
	private LocalDate date;
	private LocalTime time;
    private String ticketNo;
    private String winner;
    @Column(columnDefinition = "BOOLEAN")
    private boolean isVerified=false;
}
