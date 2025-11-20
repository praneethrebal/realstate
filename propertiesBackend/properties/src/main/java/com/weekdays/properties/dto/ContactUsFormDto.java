package com.weekdays.properties.dto;

import com.weekdays.properties.entity.User;

import lombok.Data;

@Data
public class ContactUsFormDto {
	
	private long toUser;
	private long id;
	
	private String name;
    private String number;
    private String email;
    private String address;
    
	

}