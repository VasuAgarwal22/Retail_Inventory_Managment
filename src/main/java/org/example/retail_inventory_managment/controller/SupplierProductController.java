package org.example.retail_inventory_managment.controller;

import lombok.RequiredArgsConstructor;
import org.example.retail_inventory_managment.dto.requestDTO.SupplierProductRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.SupplierProductResponse;
import org.example.retail_inventory_managment.service.Implementation.SupplierProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplier-products")
@RequiredArgsConstructor
public class SupplierProductController {

    private final SupplierProductService supplierProductService;

    @PostMapping
    public ResponseEntity<SupplierProductResponse> createSupplierProduct(@RequestBody SupplierProductRequest request) {
        return ResponseEntity.ok(supplierProductService.createSupplierProduct(request));

    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierProductResponse> getSupplierProductById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierProductService.getSupplierProductById(id));

    }

    @GetMapping
    public ResponseEntity<List<SupplierProductResponse>> getAllSupplierProducts() {
        return ResponseEntity.ok(supplierProductService.getAllSupplierProducts());

    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<SupplierProductResponse>> getSupplierProductsBySupplierId(@PathVariable Long supplierId) {
        return ResponseEntity.ok(supplierProductService.getSupplierProductsBySupplierId(supplierId));

    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<SupplierProductResponse>> getSupplierProductsByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(supplierProductService.getSupplierProductsByProductId(productId));

    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierProductResponse> updateSupplierProduct(@PathVariable Long id, @RequestBody SupplierProductRequest request) {
        return ResponseEntity.ok(supplierProductService.updateSupplierProduct(id, request));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSupplierProduct(@PathVariable Long id) {
        supplierProductService.deleteSupplierProduct(id);
        return ResponseEntity.ok("SUPPLIER PRODUCT HAS BEEN DELETED SUCCESSFULLY");

    }
}