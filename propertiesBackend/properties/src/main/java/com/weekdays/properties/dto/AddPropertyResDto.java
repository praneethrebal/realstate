package com.weekdays.properties.dto;

import lombok.Data;

@Data
public class AddPropertyResDto {
    private long id;
    private String selectProperty;

    public AddPropertyResDto(long id, String selectProperty) {
        this.id = id;
        this.selectProperty = selectProperty;
    }
}
