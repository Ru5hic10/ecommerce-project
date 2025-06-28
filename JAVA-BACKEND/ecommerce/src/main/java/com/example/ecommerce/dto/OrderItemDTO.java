package com.example.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderItemDTO {
    private String productName;
    private String imageUrl;
    private double price;
    private int quantity;
}
