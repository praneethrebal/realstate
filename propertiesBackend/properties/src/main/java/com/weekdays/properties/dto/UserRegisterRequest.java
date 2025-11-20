package com.weekdays.properties.dto;

import com.weekdays.properties.enums.PlanType;
import com.weekdays.properties.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegisterRequest {

	 // ---------- Required fields ----------
    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Confirm Password is required")
    private String confirmPassword;

    @NotBlank(message = "Role is required")
    private Role role; // directly use enum

    // ---------- Optional common fields ----------
    private String category;
    private String description;
    private String location;

    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experience; // matches entity

    private String referralCode;
    private String deals;

    // ---------- Optional role-specific fields ----------
    private PlanType planType; // MARKETER / PROFESSIONAL roles
    private Double price;      // PROFESSIONAL only

    // Company-specific
    private String companyName;
    private String address;
    private String logoUrl;
    private String wallpaperUrl;
    private Integer totalProjects;
    private Integer ongoingProjects;
    private Integer completedProjects;
    private String selectedDuration;

    // Metadata (optional input, can be set internally)
    private String profileImageName;
    private String profileImagePath;
    private String profileImageType;
    private String companyLogoName;
    private String companyLogoPath;
    private String companyLogoType;
    private String companyWallpaperName;
    private String companyWallpaperPath;
    private String companyWallpaperType;




}
