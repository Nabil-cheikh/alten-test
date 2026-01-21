package com.alten.shop.service;

import com.alten.shop.dto.WishlistItemRequest;
import com.alten.shop.model.Product;
import com.alten.shop.model.User;
import com.alten.shop.model.WishlistItem;
import com.alten.shop.repository.ProductRepository;
import com.alten.shop.repository.WishlistItemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;

    public List<Product> getWishlist(User user) {
        return wishlistItemRepository.findByUser(user).stream()
                .map(WishlistItem::getProduct)
                .toList();
    }

    public Product addToWishlist(User user, WishlistItemRequest request) {
        if (wishlistItemRepository.existsByUserAndProductId(user, request.getProductId())) {
            throw new RuntimeException("Product already in wishlist");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);
        wishlistItemRepository.save(item);

        return product;
    }

    public void removeFromWishlist(User user, Long productId) {
        wishlistItemRepository.deleteByUserAndProductId(user, productId);
    }
}
