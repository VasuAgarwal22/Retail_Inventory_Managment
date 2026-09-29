package org.example.retail_inventory_managment.dto.resposneDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.retail_inventory_managment.enums.MovementType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovementResponse {

    private Long id;
    private Long productId;
    private Long warehouseId;
    private MovementType movementType;
    private Integer quantity;
    private Integer balanceAfter;
    private String referenceType;
    private Long referenceId;
    private String reason;

}
