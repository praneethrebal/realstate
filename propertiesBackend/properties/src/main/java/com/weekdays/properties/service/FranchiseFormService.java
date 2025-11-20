package com.weekdays.properties.service;

import com.weekdays.properties.entity.FranchiseFormModel;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.repository.FranchiseFormRepository;
import com.weekdays.properties.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FranchiseFormService {


    private final UserRepository userRepo;
    @Autowired
    private FranchiseFormRepository franchiseFormRepository;

    public FranchiseFormModel CreateFranchiseFormModel(FranchiseFormModel request) {

        String username=SecurityContextHolder.getContext().getAuthentication().getName();
        User user=userRepo.findByUsername(username).orElseThrow(()->new RuntimeException("user not found"));
        request.setUser(user);
        return franchiseFormRepository.save(request);
    }


    public List<User>getAllFranchiseForms(){
        return franchiseFormRepository.findAllUsers();
    }

    public FranchiseFormModel getAllFranchiseFromsById(Long id) {
        return franchiseFormRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Franchise Form not found by Id:" +id));
    }


    public List<User> getAllFranchiseUsers() {
        return franchiseFormRepository.findAllUsersWhoSubmittedForms();
    }



}