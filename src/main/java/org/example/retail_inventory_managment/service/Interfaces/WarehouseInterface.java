package org.example.retail_inventory_managment.service.Interfaces;

import org.example.retail_inventory_managment.dto.requestDTO.WarehouseRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.WarehouseResponse;

import java.util.List;

public interface WarehouseInterface {
    WarehouseResponse createWarehouse(WarehouseRequest request);
    WarehouseResponse getWarehouseById(Long id);
    List<WarehouseResponse> getAllWarehouses();
    WarehouseResponse updateWarehouse(Long id, WarehouseRequest request);
    void deactivateWarehouse(Long id);
}