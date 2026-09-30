package org.example.retail_inventory_managment.controller;

import lombok.RequiredArgsConstructor;
import org.example.retail_inventory_managment.dto.requestDTO.ProductRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.ProductResponse;
import org.example.retail_inventory_managment.service.Implementation.ProductIntService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class ProductController {
    private final ProductIntService productIntService;

    @PostMapping("/create_Product")
        public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest request){
            return ResponseEntity.ok( productIntService.createProduct(request));
        }

        @GetMapping("/get/{id}")
        public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id){
            return ResponseEntity.ok(productIntService.getProductById(id));
        }

        @GetMapping("/getAll")
        public ResponseEntity<List<ProductResponse>> getAll(){
            return ResponseEntity.ok(productIntService.getAllProducts());
        }

        @PutMapping("/update/{id}")
        public ResponseEntity<ProductResponse> update(@PathVariable Long id, @RequestBody ProductRequest request){
            return ResponseEntity.ok(productIntService.updateProduct(id,request));
        }

        @PatchMapping("/{id}/deactivate_pro")
        public ResponseEntity<String> deactivate(@PathVariable Long id){
            productIntService.deactivateProduct(id);
            return ResponseEntity.ok("PRODUCT DEACTIVATED SUCCESSFULLY");
        }

}
