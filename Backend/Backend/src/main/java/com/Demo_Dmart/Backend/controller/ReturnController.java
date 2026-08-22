package com.Demo_Dmart.Backend.controller;

import com.Demo_Dmart.Backend.dto.ReturnRequestDto;
import com.Demo_Dmart.Backend.model.ReturnRequest;
import com.Demo_Dmart.Backend.service.ReturnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/returns")
public class ReturnController {

    @Autowired
    private ReturnService returnService;

    // Customer: Submit a return request for a specific order
    @PostMapping("/{orderId}")
    public ResponseEntity<ReturnRequest> requestReturn(
            @PathVariable Long orderId, 
            @RequestBody ReturnRequestDto dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(returnService.createReturnRequest(auth.getName(), orderId, dto));
    }

    // Customer: View their own return requests
    @GetMapping("/my-returns")
    public ResponseEntity<List<ReturnRequest>> getMyReturns() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(returnService.getMyReturnRequests(auth.getName()));
    }

    // Admin: View all return requests in the system
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReturnRequest>> getAllReturns() {
        return ResponseEntity.ok(returnService.getAllReturnRequests());
    }

    // Admin: Approve/Reject return requests
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReturnRequest> updateReturnStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(returnService.updateReturnStatus(id, status));
    }
}
