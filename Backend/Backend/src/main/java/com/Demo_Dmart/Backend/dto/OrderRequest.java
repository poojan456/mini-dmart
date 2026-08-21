package com.Demo_Dmart.Backend.dto;

import java.util.List;

public class OrderRequest {
    private List<OrderItemRequest> items;
    private String deliveryType; // HOME_DELIVERY or STORE_PICKUP
    private String shippingAddress; // If HOME_DELIVERY

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
    public String getDeliveryType() { return deliveryType; }
    public void setDeliveryType(String deliveryType) { this.deliveryType = deliveryType; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
}
