package com.weekdays.properties.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class ProjectEntity {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String projectName;
    private String typeOfProject;   // e.g., Plots, Flats, Villas
    private String projectLocation;
    @Column(columnDefinition = "TEXT")
    private String locationUrl;
    private int numberOfUnits;
    private String availableUnits;
    private String availableFacings;
    private String availableSizes;
    private String reraApproved;    // Yes / No
    private List<String> amenities;
    
    @Column(length = 2000)
    private String highlights;

    private String typeOfApproval;  // e.g., HMDA, DTCP
    private double totalProjectArea;
    private String contactInfo;
    private String pricing;

    // Relationships
    @ManyToOne
    private User user;
    @OneToMany
    (mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ProjectImage> images;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ProjectBrochure> brochures;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ProjectVideo> videos;

}
