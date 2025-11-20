package com.weekdays.properties.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.weekdays.properties.entity.AddPropertyModel;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.enums.SelectProperty;

public interface AddPropertyRepo extends JpaRepository<AddPropertyModel, Long> {

	List<AddPropertyModel>  findBySelectProperty(SelectProperty propName);
	
	@Query("SELECT a FROM AddPropertyModel a " +
		       "WHERE (:location IS NULL OR a.location = :location) " +
		       "AND (:property IS NULL OR a.selectProperty = :property)")
		List<AddPropertyModel> searchByLocationAndProperty(
		        @Param("location") String location,
		        @Param("property") SelectProperty property);

	List<AddPropertyModel> findByUser(User user);

	List<AddPropertyModel> findByUserId(Long userId);

	
	@Query("select p from AddPropertyModel p where lower(p.location) = :location")
	List<AddPropertyModel> findAssignedProperty(String location);



}
