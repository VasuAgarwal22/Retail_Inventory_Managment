package org.example.retail_inventory_managment.repository;

import org.example.retail_inventory_managment.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockMovementRepository
        extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findByProductId(Long productId);

    List<StockMovement> findByWarehouseId(Long warehouseId);

    List<StockMovement> findByProductIdAndWarehouseId(
            Long productId,
            Long warehouseId
    );
}