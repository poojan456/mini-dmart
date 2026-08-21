package com.Demo_Dmart.Backend.service;

import com.Demo_Dmart.Backend.dto.ReturnRequestDto;
import com.Demo_Dmart.Backend.model.Order;
import com.Demo_Dmart.Backend.model.ReturnRequest;
import com.Demo_Dmart.Backend.model.ReturnStatus;
import com.Demo_Dmart.Backend.repository.OrderRepository;
import com.Demo_Dmart.Backend.repository.ReturnRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReturnService {

    @Autowired
    private ReturnRequestRepository returnRequestRepository;

    @Autowired
    private OrderRepository orderRepository;

    public ReturnRequest createReturnRequest(String userEmail, Long orderId, ReturnRequestDto dto) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not authorized to return this order");
        }

        ReturnRequest returnReq = new ReturnRequest();
        returnReq.setOrder(order);
        returnReq.setReason(dto.getReason());
        
        return returnRequestRepository.save(returnReq);
    }

    public List<ReturnRequest> getMyReturnRequests(String userEmail) {
        // Find all orders for the user, then get the return requests
        // For simplicity in this assessment, we can just fetch all and filter, or add a custom query
        // Here we just use Java Streams for speed of implementation since it's a small app
        return returnRequestRepository.findAll().stream()
                .filter(r -> r.getOrder().getUser().getEmail().equals(userEmail))
                .toList();
    }

    public List<ReturnRequest> getAllReturnRequests() {
        return returnRequestRepository.findAll();
    }

    public ReturnRequest updateReturnStatus(Long returnId, String statusName) {
        ReturnRequest returnReq = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new RuntimeException("Return Request not found"));
        
        returnReq.setStatus(ReturnStatus.valueOf(statusName.toUpperCase()));
        return returnRequestRepository.save(returnReq);
    }
}
