package com.weekdays.properties.dto;

public class AuthResponse {

    private String token;
    private String username;
    private String role; // single role, not Set

    // Default constructor
    public AuthResponse() {}

    // All-args constructor
    public AuthResponse(String token, String username, String role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }

    // Getters & Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
