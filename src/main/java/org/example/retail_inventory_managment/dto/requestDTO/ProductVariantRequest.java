package org.example.retail_inventory_managment.dto.requestDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.retail_inventory_managment.entity.Category;
import org.example.retail_inventory_managment.entity.Product;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantRequest {

    private String sku;
    private String name;
    private String description;
    private BigDecimal price;
    private Product productId;

}
