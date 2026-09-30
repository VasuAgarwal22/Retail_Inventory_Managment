package org.example.retail_inventory_managment.service.Interfaces;

import org.example.retail_inventory_managment.dto.requestDTO.ProductVariantRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.ProductVariantResponse;
import org.example.retail_inventory_managment.entity.ProductVariant;

import java.util.List;

public interface ProductVariantInterface {
    ProductVariantResponse createVariant(ProductVariantRequest request);
    ProductVariantResponse getVariantById(Long id);
    List<ProductVariantResponse> getAllVariants();
    ProductVariantResponse updateVariant(Long id,ProductVariantRequest request);
    void deactivateVariant(Long id);
    List<ProductVariantResponse> getVariantsByProductId(Long productId);
}
