package com.weekdays.properties.Excepations;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;



import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
class ErrorRes
{
	private String apiPath;
	private HttpStatus status;
	private String msg;
	private LocalDateTime time;
	
}

@ControllerAdvice
public class GlobalExcepations {
	
	@ExceptionHandler(EmptyListExcepation.class)
	public ResponseEntity<ErrorRes> handleEmptyListExcepation(EmptyListExcepation ex,WebRequest req){
		ErrorRes err=new ErrorRes();
		err.setApiPath(req.getDescription(false));
		err.setStatus(HttpStatus.NO_CONTENT);
		err.setMsg(ex.getMessage());
		err.setTime(LocalDateTime.now());
		return new ResponseEntity<>(err,HttpStatus.OK);
	
		
	}
	
	@ExceptionHandler(ImageNotFoundException.class)
	public ResponseEntity<ErrorRes> handleImageNotFoundException(ImageNotFoundException ex,WebRequest req)
	{
		ErrorRes err= new ErrorRes();
		err.setApiPath(req.getDescription(false));
		err.setStatus(HttpStatus.NOT_FOUND);
		err.setMsg(ex.getMessage());
		err.setTime(LocalDateTime.now());
		return new ResponseEntity(err,HttpStatus.OK);
		
	}

}