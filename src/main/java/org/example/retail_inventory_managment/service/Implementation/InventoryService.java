package org.example.retail_inventory_managment.service.Implementation;

import lombok.RequiredArgsConstructor;
import org.example.retail_inventory_managment.dto.requestDTO.InventoryRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.InventoryResponse;
import org.example.retail_inventory_managment.entity.Inventory;
import org.example.retail_inventory_managment.entity.Product;
import org.example.retail_inventory_managment.entity.Warehouse;
import org.example.retail_inventory_managment.repository.InventoryRepository;
import org.example.retail_inventory_managment.repository.ProductRepository;
import org.example.retail_inventory_managment.repository.WarehouseRepository;
import org.example.retail_inventory_managment.service.Interfaces.InventoryInterface;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService implements InventoryInterface {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    @Override
    public InventoryResponse createInventory(InventoryRequest request) {

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found with this id"));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() ->
                        new RuntimeException("Warehouse not found with this id"));

        if (inventoryRepository
                .findByProductIdAndWarehouseId(
                        request.getProductId(),
                        request.getWarehouseId()
                ).isPresent()) {

            throw new RuntimeException(
                    "Inventory already exists for this product and warehouse"
            );
        }

        Inventory inventory = Inventory.builder()
                .product(product)
                .warehouse(warehouse)
                .quantityOnHand(
                        request.getQuantityOnHand() != null
                                ? request.getQuantityOnHand()
                                : 0
                )
                .quantityReserved(
                        request.getQuantityReserved() != null
                                ? request.getQuantityReserved()
                                : 0
                )
                .quantityIncoming(
                        request.getQuantityIncoming() != null
                                ? request.getQuantityIncoming()
                                : 0
                )
                .lastCountedAt(LocalDateTime.now())
                .build();

        Inventory savedInventory = inventoryRepository.save(inventory);

        return convertToResponse(savedInventory);
    }

    @Override
    public InventoryResponse getInventoryById(Long id) {

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Inventory not found with this id"));

        return convertToResponse(inventory);
    }

    @Override
    public List<InventoryResponse> getAllInventory() {

        return inventoryRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<InventoryResponse> getInventoryByProductId(Long productId) {

        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found with this id");
        }

        return inventoryRepository.findByProductId(productId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<InventoryResponse> getInventoryByWarehouseId(Long warehouseId) {

        if (!warehouseRepository.existsById(warehouseId)) {
            throw new RuntimeException("Warehouse not found with this id");
        }

        return inventoryRepository.findByWarehouseId(warehouseId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public InventoryResponse updateInventory(
            Long id,
            InventoryRequest request) {

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Inventory not found with this id"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found with this id"));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() ->
                        new RuntimeException("Warehouse not found with this id"));

        inventory.setProduct(product);
        inventory.setWarehouse(warehouse);
        inventory.setQuantityOnHand(request.getQuantityOnHand());
        inventory.setQuantityReserved(request.getQuantityReserved());
        inventory.setQuantityIncoming(request.getQuantityIncoming());
        inventory.setLastCountedAt(LocalDateTime.now());

        Inventory updatedInventory = inventoryRepository.save(inventory);

        return convertToResponse(updatedInventory);
    }

    @Override
    public void deleteInventory(Long id) {

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Inventory not found with this id"));

        inventoryRepository.delete(inventory);
    }

    private InventoryResponse convertToResponse(Inventory inventory) {

        return InventoryResponse.builder()
                .id(inventory.getId())
                .productId(inventory.getProduct().getId())
                .warehouseId(inventory.getWarehouse().getId())
                .quantityOnHand(inventory.getQuantityOnHand())
                .quantityReserved(inventory.getQuantityReserved())
                .quantityIncoming(inventory.getQuantityIncoming())
                .lastCountedAt(inventory.getLastCountedAt())
                .version(inventory.getVersion())
                .build();
    }
}