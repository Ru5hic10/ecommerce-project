package com.example.ecommerce.service;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.dto.OrderItemDTO;
import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.OrderItem;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Order saveOrderWithItems(String email, List<Map<String, Object>> products, double amount) {
        Order order = new Order();
        order.setEmail(email);
        order.setAmount(amount);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus("PAID");

        List<OrderItem> orderItems = new ArrayList<>();

        for (Map<String, Object> productData : products) {
            Long productId = Long.parseLong(productData.get("productId").toString());
            int quantity = Integer.parseInt(productData.get("quantity").toString());

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setOrder(order);

            orderItems.add(item);
        }

        order.setItems(orderItems);
        return orderRepository.save(order);
    }


     public List<OrderDTO> getOrdersByEmailAsDTO(String email) {
        List<Order> orders = orderRepository.findByEmail(email);

        return orders.stream().map(order -> {
            List<OrderItemDTO> items = order.getItems().stream().map(item ->
                    new OrderItemDTO(
                            item.getProduct().getName(),
                            item.getProduct().getImageUrl(),
                            item.getProduct().getPrice(),
                            item.getQuantity()
                    )
            ).toList();

            return new OrderDTO(
                    order.getId(),
                    order.getStatus(),
                    order.getAmount(),
                    order.getOrderTime(),
                    items
            );
        }).toList();
    }

}
