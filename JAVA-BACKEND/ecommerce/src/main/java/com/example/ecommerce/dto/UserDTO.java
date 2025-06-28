package com.example.ecommerce.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private String email;
    private List<String> roles;

    public UserDTO(String email, List<String> roles) {
        this.email = email;
        this.roles = roles;
    }

    // Getters and Setters
}
