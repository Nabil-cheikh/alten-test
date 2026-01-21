// com/alten/shop/dto/WishlistItemRequest.java
package com.alten.shop.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WishlistItemRequest {
    @NotNull
    private Long productId;
}
