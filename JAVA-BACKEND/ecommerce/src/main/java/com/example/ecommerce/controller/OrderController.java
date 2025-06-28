package com.example.ecommerce.controller;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.dto.OrderItemDTO;
import com.example.ecommerce.model.Order;
import com.example.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody Map<String, Object> payload, Principal principal) {
        String email = principal.getName();

        List<Map<String, Object>> products = (List<Map<String, Object>>) payload.get("products");
        double amount = Double.parseDouble(payload.get("amount").toString());

        return ResponseEntity.ok(orderService.saveOrderWithItems(email, products, amount));
    }


    @GetMapping
    public ResponseEntity<List<OrderDTO>> getMyOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<OrderDTO> orderDTOs = orderService.getOrdersByEmailAsDTO(email);
        return ResponseEntity.ok(orderDTOs);
    }


}
