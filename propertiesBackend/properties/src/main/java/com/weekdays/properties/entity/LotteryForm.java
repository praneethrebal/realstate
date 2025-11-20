package com.weekdays.properties.entity;



import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class LotteryForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   
    @ElementCollection
    @CollectionTable(name = "lottery_images", joinColumns = @JoinColumn(name = "lottery_id"))
    @Column(name = "image_path")
    private List<String> imagePaths;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    private String phoneNumber;

    private String altNumber;
    private String address;
    @Column(columnDefinition = "TEXT")
    private String adressURL;
    private String ownerName;
    private String description;
    private double ticketPrice;
    private int totalTickets;
    private int avaliableTickets;
    private String property_value;
    private boolean active = true;
    private LocalDate drawDate;

    @Column(nullable = false, updatable = false)
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();
}
