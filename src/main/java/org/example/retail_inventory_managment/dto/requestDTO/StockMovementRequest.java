package org.example.retail_inventory_managment.dto.requestDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.retail_inventory_managment.enums.MovementType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovementRequest {

    private Long productId;

    private Long warehouseId;

    private MovementType movementType;

    private Integer quantity;

    private String referenceType;

    private Long referenceId;

    private String reason;

    private Long performedBy;
}