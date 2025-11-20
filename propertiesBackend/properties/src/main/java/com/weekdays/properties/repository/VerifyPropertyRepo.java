package com.weekdays.properties.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.weekdays.properties.entity.User;
import com.weekdays.properties.entity.VerifiedProperties;

public interface VerifyPropertyRepo extends JpaRepository<VerifiedProperties, Long>{

	@Query("select v from VerifiedProperties v where v.user=:u")
	List<VerifiedProperties> getVerifiedPropertys(User u);

}
