package com.weekdays.properties.dto;

import com.weekdays.properties.entity.AddPropertyModel;
import com.weekdays.properties.entity.User;

import lombok.Data;

@Data
public class ProfileDto {
	
	private long uploads;
	private long soldout;
	private long pending;
	private User user;

}
