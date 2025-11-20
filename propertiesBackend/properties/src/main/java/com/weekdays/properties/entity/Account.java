package com.weekdays.properties.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String profession;
    private String loginId;
    private String phone;
    private String accountType;
}
