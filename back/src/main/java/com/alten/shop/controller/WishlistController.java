package com.alten.shop.controller;

import com.alten.shop.dto.WishlistItemRequest;
import com.alten.shop.model.Product;
import com.alten.shop.model.User;
import com.alten.shop.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<Product>> getWishlist(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(wishlistService.getWishlist(user));
    }

    @PostMapping
    public ResponseEntity<Product> addToWishlist(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody WishlistItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(wishlistService.addToWishlist(user, request));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId) {
        wishlistService.removeFromWishlist(user, productId);
        return ResponseEntity.noContent().build();
    }
}
