package com.Demo_Dmart.Backend.repository;

import com.Demo_Dmart.Backend.model.ReturnRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {
    List<ReturnRequest> findByOrderId(Long orderId);
}
