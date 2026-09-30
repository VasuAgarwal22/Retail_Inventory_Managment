package org.example.retail_inventory_managment.service.Interfaces;

import org.example.retail_inventory_managment.dto.requestDTO.CategoryRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.CategoryResponse;

import java.util.List;

public interface CategoryInterface{

    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse getCategoryById(Long id);
    List<CategoryResponse> getAllCategories();
    CategoryResponse updateCategory(Long id, CategoryRequest request);
    void deactivateCategory(Long id);
}
