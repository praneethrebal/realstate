package com.weekdays.properties.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.weekdays.properties.entity.ImageEntity;

@Repository
public interface ImageRepo extends JpaRepository<ImageEntity, Long> {

}
