package com.example.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private String status;
    private double amount;
    private LocalDateTime orderTime;
    private List<OrderItemDTO> items;
}
