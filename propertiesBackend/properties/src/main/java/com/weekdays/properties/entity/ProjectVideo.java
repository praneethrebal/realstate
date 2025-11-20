package com.weekdays.properties.entity;



import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ProjectVideo {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String fileType;
    private String filePath;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonBackReference
    private ProjectEntity project;
    // Getters & Setters
}
