package com.alten.shop.service;

import com.alten.shop.dto.CartItemRequest;
import com.alten.shop.dto.CartItemResponse;
import com.alten.shop.model.CartItem;
import com.alten.shop.model.Product;
import com.alten.shop.model.User;
import com.alten.shop.repository.CartItemRepository;
import com.alten.shop.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public List<CartItemResponse> getCart(User user) {
        return cartItemRepository.findByUser(user).stream()
                .map(item -> new CartItemResponse(item.getId(), item.getProduct(), item.getQuantity()))
                .toList();
    }

    public CartItemResponse addToCart(User user, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        CartItem cartItem = cartItemRepository.findByUserAndProductId(user, request.getProductId())
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + request.getQuantity());
                    return existing;
                })
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setUser(user);
                    newItem.setProduct(product);
                    newItem.setQuantity(request.getQuantity());
                    return newItem;
                });

        CartItem saved = cartItemRepository.save(cartItem);
        return new CartItemResponse(saved.getId(), saved.getProduct(), saved.getQuantity());
    }

    public CartItemResponse updateCartItem(User user, Long productId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findByUserAndProductId(user, productId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        cartItem.setQuantity(quantity);
        CartItem saved = cartItemRepository.save(cartItem);
        return new CartItemResponse(saved.getId(), saved.getProduct(), saved.getQuantity());
    }

    public void removeFromCart(User user, Long productId) {
        cartItemRepository.deleteByUserAndProductId(user, productId);
    }
}
