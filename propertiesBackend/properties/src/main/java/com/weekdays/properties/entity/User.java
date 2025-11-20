package com.weekdays.properties.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.weekdays.properties.enums.PlanType;
import com.weekdays.properties.enums.Role;
import com.weekdays.properties.enums.companySubscripationType;
import com.weekdays.properties.enums.marketingSubscripationType;

@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email"),
                @UniqueConstraint(columnNames = "phone")
        })
@Data
public class User {
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    // 🔐 Common fields
	    private String username; 
	    private String email;
	    private String password;
	    private String phone;

	    private String category;
	    @Enumerated(EnumType.STRING)
	    private Role role;

	    @Enumerated(EnumType.STRING)
	    private PlanType planType;

	    // 🧾 Common optional fields
	    private String description;
	    private String location;
	    private Integer experience;
	    private String referralCode;
	    private String my_referralCode;
	    private String deals;

//	    private String profilePictureUrl;
	    //image fields
	    private String profileImageName;
	    private String profileImagePath;
	    private String profileImageType;
	    private String companyLogoName;
	    private String companyLogoPath;
	    private String companyLogoType;
	    private String companyWallpaperName;
	    private String companyWallpaperPath;
	    private String companyWallpaperType;

	    private String companyName;
	    private String address;
	    private String logoUrl;
	    private long click=0;
	    private long leads=0;

	    private Integer totalProjects;
	    private Integer ongoingProjects;
	    private Integer completedProjects;
	    private String contactNumber;
	    private int selectedDuration; 
	    private LocalDateTime createdAt;
	    private LocalDateTime updatedAt;
	    private LocalDate companySubscriptionStartDate;
	    private LocalDate companySubscriptionEndDate;
	    private LocalDate marketerSubscriptionStartDate;
	    private LocalDate marketerSubscriptionEndDate;
	    
}
