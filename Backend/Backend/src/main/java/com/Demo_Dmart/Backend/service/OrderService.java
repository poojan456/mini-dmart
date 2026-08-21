package com.Demo_Dmart.Backend.service;

import com.Demo_Dmart.Backend.dto.OrderItemRequest;
import com.Demo_Dmart.Backend.dto.OrderRequest;
import com.Demo_Dmart.Backend.model.*;
import com.Demo_Dmart.Backend.repository.OrderItemRepository;
import com.Demo_Dmart.Backend.repository.OrderRepository;
import com.Demo_Dmart.Backend.repository.ProductRepository;
import com.Demo_Dmart.Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Order createOrder(String userEmail, OrderRequest orderRequest) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        
        try {
            order.setDeliveryType(DeliveryType.valueOf(orderRequest.getDeliveryType().toUpperCase()));
        } catch (IllegalArgumentException | NullPointerException e) {
            order.setDeliveryType(DeliveryType.STORE_PICKUP);
        }
        
        Order savedOrder = orderRepository.save(order);
        
        double totalAmount = 0.0;
        
        for (OrderItemRequest itemReq : orderRequest.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
                    
            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }
            
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());
            
            orderItemRepository.save(orderItem);
            
            totalAmount += (product.getPrice() * itemReq.getQuantity());
        }
        
        savedOrder.setTotalAmount(totalAmount);
        return orderRepository.save(savedOrder);
    }

    public List<Order> getOrdersByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserId(user.getId());
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(Long orderId, String statusName) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(OrderStatus.valueOf(statusName.toUpperCase()));
        return orderRepository.save(order);
    }
}
