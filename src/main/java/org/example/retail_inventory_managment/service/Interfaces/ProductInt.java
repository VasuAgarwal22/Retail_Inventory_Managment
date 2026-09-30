package org.example.retail_inventory_managment.service.Interfaces;

import org.example.retail_inventory_managment.dto.requestDTO.ProductRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.ProductResponse;

import java.util.List;

public interface ProductInt {

    ProductResponse createProduct(ProductRequest request);
    ProductResponse getProductById(Long id);
    List<ProductResponse> getAllProducts();
    ProductResponse updateProduct(Long id,ProductRequest request);
    void deactivateProduct(Long id);

}
