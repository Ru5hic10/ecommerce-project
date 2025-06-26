package com.example.ecommerce.controller;

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
        List<String> productNames = (List<String>) payload.get("products");
        double amount = Double.parseDouble(payload.get("amount").toString());

        return ResponseEntity.ok(orderService.saveOrder(email, productNames, amount));
    }

    @GetMapping
    public ResponseEntity<?> getMyOrders() {
        // Get the authenticated user's email from the security context
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Fetch orders from DB
        List<Order> orders = orderService.getOrdersByEmail(email);

        return ResponseEntity.ok(orders);
    }
    @GetMapping("/user")
    public ResponseEntity<List<Order>> getUserOrders(Principal principal) {
        String email = principal.getName();
        return ResponseEntity.ok(orderService.getOrdersByEmail(email));
    }
}
