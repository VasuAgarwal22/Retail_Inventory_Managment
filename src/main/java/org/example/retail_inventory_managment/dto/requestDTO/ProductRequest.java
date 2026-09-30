package org.example.retail_inventory_managment.dto.requestDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    private String sku;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private Long categoryId;
    private Long brandId;

 }
