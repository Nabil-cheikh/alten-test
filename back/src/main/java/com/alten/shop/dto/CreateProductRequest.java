package com.alten.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateProductRequest {

    private String code;

    @NotBlank
    private String name;

    private String description;

    private String image;

    private String category;

    @NotNull
    @Positive
    private Double price;

    private Integer quantity;

    private String internalReference;

    private Long shellId;

    private String inventoryStatus;

    private Integer rating;
}
