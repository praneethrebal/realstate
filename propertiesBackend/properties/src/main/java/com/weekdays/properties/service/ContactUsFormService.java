package com.weekdays.properties.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.weekdays.properties.dto.ContactUsFormDto;
import com.weekdays.properties.entity.ConstructionFormModel;
import com.weekdays.properties.entity.ContactUsForm;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.repository.ContactUsFormRepository;
import com.weekdays.properties.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContactUsFormService {

    private final UserRepository userRepo;
    private final ContactUsFormRepository contactUsFormRepository;

    public ContactUsForm createContactUsForm(ContactUsFormDto request) {
    	ContactUsForm form=new ContactUsForm();
    	String name =SecurityContextHolder.getContext().getAuthentication().getName();
    	User u=userRepo.findByUsername(name).orElseThrow();
    	User form1=userRepo.findById(request.getToUser()).orElseThrow();

       form.setFromUser(u);
       form.setToUser(form1);
       form.setName(request.getName());
       form.setNumber(request.getNumber());
       form.setEmail(request.getEmail());
       form.setAddress(request.getAddress());
        
        return contactUsFormRepository.save(form);
    }


}