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
public class SupplierProductResponse {

    private Long id;

    private Long supplierId;

    private Long productId;

    private BigDecimal unitCost;

    private Integer moq;
}