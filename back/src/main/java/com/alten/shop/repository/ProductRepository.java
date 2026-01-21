package com.alten.shop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alten.shop.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
  Optional<Product> findByCode(String code);
}
