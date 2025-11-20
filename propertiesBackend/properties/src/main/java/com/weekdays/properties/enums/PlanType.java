package com.weekdays.properties.enums;

public enum PlanType {
	


		    MARKETER_EXPORT(7999),
		    MARKETER_EXPORT_PRO(14999),
		    PROFESSIONAL_SINGLE(4999),
		    COMPANY_NORMAL(14999),
		    COMPANY_PRO(19999);

		    private final double price;

		    PlanType(double price) {
		        this.price = price;
		    }

		    public double getPrice() {
		        return price;
		    }




}
