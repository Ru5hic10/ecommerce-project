package com.example.ecommerce.dto;

import com.example.ecommerce.model.User;
import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private UserDTO user;

    public LoginResponse() {}

    public LoginResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }

}

