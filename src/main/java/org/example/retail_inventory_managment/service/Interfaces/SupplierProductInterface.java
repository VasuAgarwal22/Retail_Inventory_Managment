package org.example.retail_inventory_managment.service.Interfaces;

import org.example.retail_inventory_managment.dto.requestDTO.SupplierProductRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.SupplierProductResponse;

import java.util.List;

public interface SupplierProductInterface {

    SupplierProductResponse createSupplierProduct(SupplierProductRequest request);
    SupplierProductResponse getSupplierProductById(Long id);
    List<SupplierProductResponse> getAllSupplierProducts();
    List<SupplierProductResponse> getSupplierProductsBySupplierId(Long supplierId);
    List<SupplierProductResponse> getSupplierProductsByProductId(Long productId);
    SupplierProductResponse updateSupplierProduct(Long id, SupplierProductRequest request);
    void deleteSupplierProduct(Long id);
    
}