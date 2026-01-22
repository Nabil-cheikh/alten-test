package com.alten.shop.controller;

import com.alten.shop.dto.CreateProductRequest;
import com.alten.shop.model.Product;
import com.alten.shop.model.User;
import com.alten.shop.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    private void checkAdminAccess(User user) {
      if (user == null || !"admin@admin.com".equals(user.getEmail())) {
        throw new RuntimeException("Access denied. Admin only.");
      }
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
      return ResponseEntity.ok(productService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
      return ResponseEntity.ok(productService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateProductRequest request) {
      checkAdminAccess(user);
      Product product = new Product();
      product.setCode(request.getCode() != null ? request.getCode() : "PROD-" + System.currentTimeMillis());
      product.setName(request.getName());
      product.setDescription(request.getDescription());
      product.setImage(request.getImage());
      product.setCategory(request.getCategory());
      product.setPrice(request.getPrice());
      product.setQuantity(request.getQuantity() != null ? request.getQuantity() : 0);
      product.setInternalReference(request.getInternalReference());
      product.setShellId(request.getShellId());
      if (request.getInventoryStatus() != null) {
          product.setInventoryStatus(Product.InventoryStatus.valueOf(request.getInventoryStatus()));
      }
      product.setRating(request.getRating());
      Product created = productService.create(product);
      return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
          @AuthenticationPrincipal User user,
          @PathVariable Long id,
          @RequestBody Product product) {
      checkAdminAccess(user);
      return ResponseEntity.ok(productService.update(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
          @AuthenticationPrincipal User user,
          @PathVariable Long id) {
      checkAdminAccess(user);
      productService.delete(id);
      return ResponseEntity.noContent().build();
    }
}
