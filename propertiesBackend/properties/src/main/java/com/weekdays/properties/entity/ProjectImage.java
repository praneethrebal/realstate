package com.weekdays.properties.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ProjectImage {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String fileType;
    private String filePath; // You can store it in filesystem and save the path here

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonBackReference
    private ProjectEntity project;

    // Getters & Setters
}

