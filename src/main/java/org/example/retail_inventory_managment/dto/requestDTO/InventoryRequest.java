package org.example.retail_inventory_managment.dto.requestDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryRequest {

    private Long productId;

    private Long warehouseId;

    private Integer quantityOnHand;

    private Integer quantityReserved;

    private Integer quantityIncoming;
}