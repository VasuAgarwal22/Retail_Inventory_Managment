package org.example.retail_inventory_managment.dto.resposneDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantResponse {

    private Long id;
    private String sku;
    private String name;
    private BigDecimal price;
    private boolean active;
    private Long productId;


}
