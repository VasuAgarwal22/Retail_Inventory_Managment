package org.example.retail_inventory_managment.dto.resposneDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponse {

    private Long id;
    private Long productId;
    private String productName;
    private Long warehouseId;
    private String warehouseName;
    private Long storageLocationId;
    private Integer quantityOnHand;
    private Integer quantityIncoming;
    private Integer availableQuantity;


}
