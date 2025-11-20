package com.weekdays.properties.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weekdays.properties.entity.ProjectEntity;
import com.weekdays.properties.enums.PlanType;

public interface ProjectRepo extends JpaRepository<ProjectEntity, Long>{

	List<ProjectEntity> findByUser_PlanType(PlanType planType);

	List<ProjectEntity> findByUser_Id(Long userId);

}
