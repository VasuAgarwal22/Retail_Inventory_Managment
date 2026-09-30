package org.example.retail_inventory_managment.service.Implementation;

import lombok.RequiredArgsConstructor;
import org.example.retail_inventory_managment.dto.requestDTO.CategoryRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.CategoryResponse;
import org.example.retail_inventory_managment.entity.Category;
import org.example.retail_inventory_managment.repository.CategoryRepository;
import org.example.retail_inventory_managment.service.Interfaces.CategoryInterface;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService implements CategoryInterface {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {

        Category category = convertToEntity(request);

        Category savedCategory = categoryRepository.save(category);

        return convertToResponse(savedCategory);
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found with this id"));

        return convertToResponse(category);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {

        return categoryRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public CategoryResponse updateCategory(
            Long id,
            CategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found with this id"));

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        Category updatedCategory = categoryRepository.save(category);

        return convertToResponse(updatedCategory);
    }

    @Override
    public void deactivateCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found with this id"));

        category.setActive(false);

        categoryRepository.save(category);
    }

    private Category convertToEntity(CategoryRequest request) {

        return Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .active(true)
                .build();
    }

    private CategoryResponse convertToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .active(category.isActive())
                .build();
    }
}