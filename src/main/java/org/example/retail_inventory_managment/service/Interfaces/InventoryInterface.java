package org.example.retail_inventory_managment.service.Interfaces;

import org.example.retail_inventory_managment.dto.requestDTO.InventoryRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.InventoryResponse;

import java.util.List;

public interface InventoryInterface {
    
    InventoryResponse createInventory(InventoryRequest request);
    InventoryResponse getInventoryById(Long id);
    List<InventoryResponse> getAllInventory();
    List<InventoryResponse> getInventoryByProductId(Long productId);
    List<InventoryResponse> getInventoryByWarehouseId(Long warehouseId);
    InventoryResponse updateInventory(Long id, InventoryRequest request);
    void deleteInventory(Long id);

}