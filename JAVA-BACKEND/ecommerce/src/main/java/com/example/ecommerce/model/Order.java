package com.example.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private double amount;

    private LocalDateTime orderTime;

    @ElementCollection
    private List<String> productNames;

    private String status; // "PAID"
}
