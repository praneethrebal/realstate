package com.weekdays.properties.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.weekdays.properties.entity.DocumentEntity;

@Repository
public interface DocumentRepo extends JpaRepository<DocumentEntity, Long>{

}
