package com.weekdays.properties.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.weekdays.properties.entity.AddPropertyModel;
import com.weekdays.properties.entity.SaveEntity;
import com.weekdays.properties.entity.User;

public interface SaveRepo extends JpaRepository<SaveEntity, Long> {
	
	 @Query("select s from SaveEntity s where s.user.username=:username")
	    List<SaveEntity> findByUser(String username);
	    SaveEntity findByUserAndProperty(User user, AddPropertyModel property);


}
