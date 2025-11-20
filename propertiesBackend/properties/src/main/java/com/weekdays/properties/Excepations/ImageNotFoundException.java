package com.weekdays.properties.Excepations;

public class ImageNotFoundException extends RuntimeException {
	public ImageNotFoundException(String msg)
	{
		super(msg);
	}

}