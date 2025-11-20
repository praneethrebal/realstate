package com.weekdays.properties.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.weekdays.properties.entity.Lottery;
import com.weekdays.properties.entity.LotteryForm;
import com.weekdays.properties.repository.LotterFormRepo;
import com.weekdays.properties.repository.LotteryRepo;
import com.weekdays.properties.service.AddPropertyService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@AllArgsConstructor
public class AdminController {

    private final LotterFormRepo lotterFormRepo;
	private final AddPropertyService addPropertyService;
	private final LotteryRepo lotteryRepo;
	@Autowired
	private JavaMailSender mailSender;


	 @PostMapping("/createLottry")
     public ResponseEntity<String> createLottry(
    		  @ModelAttribute LotteryForm lotteryForm,
              @RequestParam("images") List<MultipartFile> images,
              @RequestParam(value="username" ,required = false) String userId
    		 ) throws Exception
     {
    	 addPropertyService.createLottry(lotteryForm,images,userId);
    	 return ResponseEntity.status(HttpStatus.OK).body("Added Sucessfully");
    	 
     }
	 
	 
	 @PostMapping("path")
	 public String postMethodName(@RequestBody String entity) {
	 	//TODO: process POST request
	 	
	 	return entity;
	 }
	 
	 @GetMapping("getAllLotteryPayments")
	 public ResponseEntity<List<Lottery>> getAllLotteryPayments(){
		 List<Lottery> l=lotteryRepo.findAll();
		 return ResponseEntity.status(HttpStatus.OK).body(l);
		 
	 }
	 @PutMapping("makeVerifed/{id}/{transtationId}")
	 public void makeVerified(@PathVariable long id,@PathVariable String transtationId)
	 {
		 Lottery l=lotteryRepo.findById(id).orElseThrow();
		 if(l.getTranscation_id().equals(transtationId))
		 {
			 l.setVerified(true);
			 sendSimpleMail(l.getToMail(), l.getName(), l.getTicketNo());
			 
		 }
		 lotteryRepo.save(l);
		 
		 
	 }
	 
	  public void sendSimpleMail(String to,String name,String num)
      {
     	 SimpleMailMessage message = new SimpleMailMessage();
     	 message.setTo(to);
     	 message.setSubject(name);
     	 message.setFrom("weekdaysproperties@gmail.com");
     	 message.setText("Thank you for Purchasing ticket,your verfication is done, Plese check Ticket No "+num+" ");
     	 mailSender.send(message);

      }
	 

}
