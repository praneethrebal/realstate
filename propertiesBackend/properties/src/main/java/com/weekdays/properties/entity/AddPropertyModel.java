package com.weekdays.properties.entity;


import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.weekdays.properties.enums.Looking;
import com.weekdays.properties.enums.SelectProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Transient;
import lombok.Data;

@Entity
@Data
public class AddPropertyModel {

	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)

    private long id;

    private String   projectName;
    private double   extent;
    
    private String   facing;
    private String   roadSize;
    private String units;
    private String   dimensions;
    private int      numberOfFloors;
    private int      numberOfBHK;
    private double   builtUpArea;
    private double   openArea;
    private double   rentalIncome;
    private int      floorNo;
    private String   communityType;
    private double   carpetArea;
    private String   landType;
    private String   soilType;
    private boolean  roadFacing;
    private String   waterSource;
    private String   unitType;
    private String   zone;
    private String   developmentType;
    private double   expectedAdvance;
    private String   ratio;
    private String   disputeDetails;
    private boolean  lookingToSell;
    private String   problemDetails;
    private double   actualPrice;
    private double   salePrice;
    private double price;
   
    @Enumerated(EnumType.STRING)
    private Looking look;
    @Enumerated(EnumType.STRING)
    private SelectProperty selectProperty;

   
    private boolean       reraApproved;
    private String        approvalType;
    @ElementCollection
    @CollectionTable(name = "property_amenities")
    @Column(name = "amenity")
    private List<String> amenities;
    private String        highlights;
    private Long propertyId;
   
    private boolean is_notSold=false;
    private boolean is_verified;
//    private boolean is_Lottry=false;
    @ManyToOne
    private User verifiedBy;
    
    
    private String   location;
    @Column(columnDefinition = "TEXT")
    private String locationUrl;
    private boolean is_verifiedproperty=false;
    @OneToOne
    @JsonBackReference
    private VerifiedProperties propertyverifiedBy;
    

	
	@ManyToOne
	private User user;
	
	@OneToMany(mappedBy = "addPropertyModel", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private List<ImageEntity> photos = new ArrayList<>();


	@OneToMany(mappedBy = "addPropertyModel", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private List<VideoEmtity> videos = new ArrayList<>();

	@OneToMany(mappedBy = "addPropertyModel", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private List<DocumentEntity> documents = new ArrayList<>();

	
	
}
