package com.alten.shop.service;

import com.alten.shop.model.Product;
import com.alten.shop.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
    }

    public Product create(Product product) {
        return productRepository.save(product);
    }

    public Product update(Long id, Product productDetails) {
        Product product = findById(id);

        if (productDetails.getCode() != null) product.setCode(productDetails.getCode());
        if (productDetails.getName() != null) product.setName(productDetails.getName());
        if (productDetails.getDescription() != null) product.setDescription(productDetails.getDescription());
        if (productDetails.getImage() != null) product.setImage(productDetails.getImage());
        if (productDetails.getCategory() != null) product.setCategory(productDetails.getCategory());
        if (productDetails.getPrice() != null) product.setPrice(productDetails.getPrice());
        if (productDetails.getQuantity() != null) product.setQuantity(productDetails.getQuantity());
        if (productDetails.getInternalReference() != null) product.setInternalReference(productDetails.getInternalReference());
        if (productDetails.getShellId() != null) product.setShellId(productDetails.getShellId());
        if (productDetails.getInventoryStatus() != null) product.setInventoryStatus(productDetails.getInventoryStatus());
        if (productDetails.getRating() != null) product.setRating(productDetails.getRating());

        return productRepository.save(product);
    }


    public void delete(Long id) {
        Product product = findById(id);
        productRepository.delete(product);
    }
}
