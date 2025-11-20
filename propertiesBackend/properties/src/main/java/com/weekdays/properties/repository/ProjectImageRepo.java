package com.weekdays.properties.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weekdays.properties.entity.ProjectImage;

public interface ProjectImageRepo extends JpaRepository<ProjectImage,Long>
{

}
