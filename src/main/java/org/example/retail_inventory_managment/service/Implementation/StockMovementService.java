package org.example.retail_inventory_managment.service.Implementation;

import lombok.RequiredArgsConstructor;
import org.example.retail_inventory_managment.dto.requestDTO.StockMovementRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.StockMovementResponse;
import org.example.retail_inventory_managment.entity.Inventory;
import org.example.retail_inventory_managment.entity.Product;
import org.example.retail_inventory_managment.entity.StockMovement;
import org.example.retail_inventory_managment.entity.User;
import org.example.retail_inventory_managment.entity.Warehouse;
import org.example.retail_inventory_managment.enums.MovementType;
import org.example.retail_inventory_managment.repository.InventoryRepository;
import org.example.retail_inventory_managment.repository.ProductRepository;
import org.example.retail_inventory_managment.repository.StockMovementRepository;
import org.example.retail_inventory_managment.repository.UserRepository;
import org.example.retail_inventory_managment.repository.WarehouseRepository;
import org.example.retail_inventory_managment.service.Interfaces.StockMovementInterface;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StockMovementService implements StockMovementInterface {

    private final StockMovementRepository stockMovementRepository;
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public StockMovementResponse createMovement(
            StockMovementRequest request) {

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found with this id"));

        Warehouse warehouse = warehouseRepository.findById(
                        request.getWarehouseId())
                .orElseThrow(() ->
                        new RuntimeException("Warehouse not found with this id"));

        User user = userRepository.findById(request.getPerformedBy())
                .orElseThrow(() ->
                        new RuntimeException("User not found with this id"));

        if (request.getQuantity() == null ||
                request.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than zero"
            );
        }

        if (request.getMovementType() == null) {
            throw new RuntimeException(
                    "Movement type is required"
            );
        }

        Inventory inventory = inventoryRepository
                .findByProductIdAndWarehouseId(
                        request.getProductId(),
                        request.getWarehouseId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Inventory not found for this product and warehouse"
                        ));

        int currentBalance = inventory.getQuantityOnHand();

        int newBalance = calculateNewBalance(
                currentBalance,
                request.getMovementType(),
                request.getQuantity()
        );

        if (newBalance < 0) {
            throw new RuntimeException(
                    "Insufficient stock available"
            );
        }

        inventory.setQuantityOnHand(newBalance);
        inventory.setLastCountedAt(LocalDateTime.now());

        inventoryRepository.save(inventory);

        StockMovement movement = StockMovement.builder()
                .product(product)
                .warehouse(warehouse)
                .movementType(request.getMovementType())
                .quantity(request.getQuantity())
                .balanceAfter(newBalance)
                .referenceType(request.getReferenceType())
                .referenceId(request.getReferenceId())
                .reason(request.getReason())
                .performedBy(user)
                .occurredAt(LocalDateTime.now())
                .build();

        StockMovement savedMovement =
                stockMovementRepository.save(movement);

        return convertToResponse(savedMovement);
    }

    @Override
    public StockMovementResponse getMovementById(Long id) {

        StockMovement movement = stockMovementRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Stock movement not found with this id"
                        ));

        return convertToResponse(movement);
    }

    @Override
    public List<StockMovementResponse> getAllMovements() {

        return stockMovementRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<StockMovementResponse> getMovementsByProductId(
            Long productId) {

        if (!productRepository.existsById(productId)) {
            throw new RuntimeException(
                    "Product not found with this id"
            );
        }

        return stockMovementRepository
                .findByProductId(productId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<StockMovementResponse> getMovementsByWarehouseId(
            Long warehouseId) {

        if (!warehouseRepository.existsById(warehouseId)) {
            throw new RuntimeException(
                    "Warehouse not found with this id"
            );
        }

        return stockMovementRepository
                .findByWarehouseId(warehouseId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private int calculateNewBalance(
            int currentBalance,
            MovementType movementType,
            int quantity) {

        return switch (movementType) {

            case INBOUND,
                 TRANSFER_IN,
                 RETURN ->
                    currentBalance + quantity;

            case OUTBOUND,
                 TRANSFER_OUT,
                 DAMAGE ->
                    currentBalance - quantity;

            case ADJUSTMENT,
                 COUNT_CORRECTION ->
                    quantity;
        };
    }

    private StockMovementResponse convertToResponse(
            StockMovement movement) {

        return StockMovementResponse.builder()
                .id(movement.getId())
                .productId(movement.getProduct().getId())
                .warehouseId(movement.getWarehouse().getId())
                .movementType(movement.getMovementType())
                .quantity(movement.getQuantity())
                .balanceAfter(movement.getBalanceAfter())
                .referenceType(movement.getReferenceType())
                .referenceId(movement.getReferenceId())
                .reason(movement.getReason())
                .performedBy(
                        movement.getPerformedBy() != null
                                ? movement.getPerformedBy().getId()
                                : null
                )
                .occurredAt(movement.getOccurredAt())
                .build();
    }
}