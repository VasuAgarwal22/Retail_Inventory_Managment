package org.example.retail_inventory_managment.dto.resposneDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponse {

    private Long id;

    private Long productId;

    private Long warehouseId;

    private Integer quantityOnHand;

    private Integer quantityReserved;

    private Integer quantityIncoming;

    private LocalDateTime lastCountedAt;

    private Long version;
}