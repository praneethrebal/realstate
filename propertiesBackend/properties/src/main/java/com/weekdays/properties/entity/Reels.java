package com.weekdays.properties.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Reels {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private String title;
	private String descripation;
	private String reelPath;
	private String reelName;
	private String reelType;
	@ManyToOne
	private User user;
	private LocalDate date=LocalDate.now();
	private LocalTime time=LocalTime.now();
	private int likesCount;
	private String Commoment;
	

}
