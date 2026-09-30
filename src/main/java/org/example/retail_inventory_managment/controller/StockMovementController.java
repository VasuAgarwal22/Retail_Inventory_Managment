package org.example.retail_inventory_managment.controller;

import lombok.RequiredArgsConstructor;
import org.example.retail_inventory_managment.dto.requestDTO.StockMovementRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.StockMovementResponse;
import org.example.retail_inventory_managment.service.Implementation.StockMovementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-movements")
@RequiredArgsConstructor
public class StockMovementController {

    private final StockMovementService stockMovementService;

    @PostMapping
    public ResponseEntity<StockMovementResponse> createMovement(@RequestBody StockMovementRequest request) {
        return ResponseEntity.ok(stockMovementService.createMovement(request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<StockMovementResponse> getMovementById(@PathVariable Long id) {
        return ResponseEntity.ok(stockMovementService.getMovementById(id));

    }

    @GetMapping
    public ResponseEntity<List<StockMovementResponse>> getAllMovements() {
        return ResponseEntity.ok(stockMovementService.getAllMovements());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<StockMovementResponse>> getMovementsByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(stockMovementService.getMovementsByProductId(productId));
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<StockMovementResponse>> getMovementsByWarehouseId(@PathVariable Long warehouseId) {
        return ResponseEntity.ok(stockMovementService.getMovementsByWarehouseId(warehouseId));

    }
}