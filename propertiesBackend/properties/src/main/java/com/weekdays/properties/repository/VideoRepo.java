package com.weekdays.properties.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weekdays.properties.entity.VideoEmtity;

public interface VideoRepo extends JpaRepository<VideoEmtity, Long>{

}
