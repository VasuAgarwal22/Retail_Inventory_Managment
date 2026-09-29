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
public class SupplierProductRequest {

    private Long supplierId;
    private Long productId;
    private BigDecimal unitCost;
    private Integer moq;

}
