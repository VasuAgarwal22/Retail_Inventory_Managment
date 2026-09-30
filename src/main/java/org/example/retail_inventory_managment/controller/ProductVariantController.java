package org.example.retail_inventory_managment.controller;

import lombok.RequiredArgsConstructor;
import org.example.retail_inventory_managment.dto.requestDTO.ProductVariantRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.ProductVariantResponse;
import org.example.retail_inventory_managment.service.Implementation.ProductVariantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-variants")
@RequiredArgsConstructor
public class ProductVariantController {

    private final ProductVariantService productVariantService;

    @PostMapping()
    public ResponseEntity<ProductVariantResponse> createVariant(@RequestBody ProductVariantRequest request){
        return ResponseEntity.ok(productVariantService.createVariant(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductVariantResponse> getVariantById(@PathVariable Long id){
        return ResponseEntity.ok(productVariantService.getVariantById(id));
    }

    @GetMapping()
    public ResponseEntity<List<ProductVariantResponse>> getAll(){
       return ResponseEntity.ok(productVariantService.getAllVariants());

    }
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductVariantResponse>> getVariantsByProduct(@PathVariable Long productId){
        return ResponseEntity.ok(productVariantService.getVariantsByProductId(productId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductVariantResponse> update(@PathVariable Long id,@RequestBody ProductVariantRequest request){
        return ResponseEntity.ok(productVariantService.updateVariant(id,request));
    }

    @PatchMapping("/{id}/deactivateVariant")
    public ResponseEntity<String> deactivateVariant(@PathVariable Long id){
        productVariantService.deactivateVariant(id);
        return ResponseEntity.ok("PRODUCT VARIANT HAS BEEN DEACTIVATED SUCCESSFULLY");
    }


}
