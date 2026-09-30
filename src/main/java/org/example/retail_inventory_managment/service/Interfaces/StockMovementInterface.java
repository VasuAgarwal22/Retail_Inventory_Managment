package org.example.retail_inventory_managment.service.Interfaces;

import org.example.retail_inventory_managment.dto.requestDTO.StockMovementRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.StockMovementResponse;

import java.util.List;

public interface StockMovementInterface {

    StockMovementResponse createMovement(
            StockMovementRequest request
    );

    StockMovementResponse getMovementById(Long id);

    List<StockMovementResponse> getAllMovements();

    List<StockMovementResponse> getMovementsByProductId(
            Long productId
    );

    List<StockMovementResponse> getMovementsByWarehouseId(
            Long warehouseId
    );
}