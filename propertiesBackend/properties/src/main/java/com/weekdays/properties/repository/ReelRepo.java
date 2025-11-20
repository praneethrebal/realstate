package com.weekdays.properties.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weekdays.properties.entity.Reels;

public interface ReelRepo extends JpaRepository<Reels, Long> {

	List<Reels> findByUserId(Long userId);

}
