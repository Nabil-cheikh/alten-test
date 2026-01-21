package com.alten.shop.dto;

import com.alten.shop.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private Product product;
    private Integer quantity;
}
