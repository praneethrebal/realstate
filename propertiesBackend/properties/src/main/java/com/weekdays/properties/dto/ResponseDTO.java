package com.weekdays.properties.dto;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data  // generates getters/setters
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDTO {
    private int status;      // use int instead of HttpStatus
    private String msg;

    public ResponseDTO(HttpStatus status, String msg) {
        this.status = status.value();  // store numeric HTTP code
        this.msg = msg;
    }
}
