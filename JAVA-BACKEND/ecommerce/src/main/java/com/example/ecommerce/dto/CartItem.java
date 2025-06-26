package com.example.ecommerce.dto;

import lombok.Data;

@Data
public class CartItem {
    private Long productId;
    private int quantity;

    public CartItem() {}

    public CartItem(Long productId, int quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }
}

