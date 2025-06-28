package com.example.ecommerce.util;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Base64;

@Component
public class JwtUtil {

    private Key key;

    @PostConstruct
    public void init() {
        Dotenv dotenv = Dotenv.load(); // ✅ Load .env file
        String secret = dotenv.get("JWT_SECRET"); // ✅ Read JWT_SECRET from .env
        System.out.println("Loaded JWT_SECRET: " + secret);
        if (secret == null || secret.isEmpty()) {
            throw new RuntimeException("JWT_SECRET is missing in .env");
        }
        byte[] decodedKey = Base64.getDecoder().decode(secret);
        this.key = Keys.hmacShaKeyFor(decodedKey);
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }


    public String validateTokenAndGetEmail(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            return null; // token is invalid
        }
    }

}
