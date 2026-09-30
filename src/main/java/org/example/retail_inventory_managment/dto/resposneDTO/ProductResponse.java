package org.example.retail_inventory_managment.dto.resposneDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.retail_inventory_managment.entity.Brand;
import org.example.retail_inventory_managment.entity.Category;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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

    private Category category;

    private Brand brand;

    private List<ProductVariantResponse> variant;


}
