package com.alten.shop.controller;

import com.alten.shop.dto.CartItemRequest;
import com.alten.shop.dto.CartItemResponse;
import com.alten.shop.model.User;
import com.alten.shop.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping
    public ResponseEntity<CartItemResponse> addToCart(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cartService.addToCart(user, request));
    }

    @PatchMapping("/{productId}")
    public ResponseEntity<CartItemResponse> updateCartItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        CartItemResponse response = cartService.updateCartItem(user, productId, quantity);
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId) {
        cartService.removeFromCart(user, productId);
        return ResponseEntity.noContent().build();
    }
}
