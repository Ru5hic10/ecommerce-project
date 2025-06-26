package com.example.ecommerce.service;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order saveOrder(String email, List<String> productNames, double amount) {
        Order order = new Order();
        order.setEmail(email);
        order.setProductNames(productNames);
        order.setAmount(amount);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus("PAID");

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByEmail(email);
    }
}
