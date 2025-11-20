package com.weekdays.properties.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;
@Entity
@Data
public class ContactUsForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String name;
    private String number;
    private String email;
    private String address;
    

    @ManyToOne
    private User fromUser;
    @ManyToOne
    private User toUser;

}
