package com.weekdays.properties.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.weekdays.properties.entity.AddPropertyModel;
import com.weekdays.properties.entity.SaveEntity;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.repository.AddPropertyRepo;
import com.weekdays.properties.repository.SaveRepo;
import com.weekdays.properties.repository.UserRepository;

@Service
public class SaveService {
    @Autowired
    private SaveRepo saveRepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddPropertyRepo addPropertyRepo;


    public SaveEntity save(long propertyId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        AddPropertyModel property = addPropertyRepo.findById(propertyId).orElseThrow();

        // Check if already saved
        SaveEntity existing = saveRepo.findByUserAndProperty(user, property);

        if (existing != null) {
            // already saved → unsave (delete)
            saveRepo.delete(existing);
            return null; // frontend can interpret null as "unsaved"
        }

        // not saved → create new
        SaveEntity saved = new SaveEntity();
        saved.setUser(user);
        saved.setProperty(property);
        return saveRepo.save(saved);
    }

    /**
     * Unsaves (removes) a saved property for the current user.
     */
    public void unsave(Long propertyId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        AddPropertyModel property = addPropertyRepo.findById(propertyId).orElseThrow();

        SaveEntity existing = saveRepo.findByUserAndProperty(user, property);
        if (existing != null) {
            saveRepo.delete(existing);
        }
    }




    public List<SaveEntity> findAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return saveRepo.findByUser(username);
    }


}
