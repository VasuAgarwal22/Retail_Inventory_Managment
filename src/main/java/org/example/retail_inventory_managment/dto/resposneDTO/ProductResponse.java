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
public class ProductResponse {

    private Long id;
    private String sku;

    private String name;
    private String description;

    private BigDecimal basePrice;
    private boolean active;

    private Long categoryId;
    private String categoryName;

    private Long brandId;
    private String brandName;

}
