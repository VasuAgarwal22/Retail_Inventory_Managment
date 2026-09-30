package org.example.retail_inventory_managment.service.Implementation;

import lombok.RequiredArgsConstructor;
import org.example.retail_inventory_managment.dto.requestDTO.ProductRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.ProductResponse;
import org.example.retail_inventory_managment.dto.resposneDTO.ProductVariantResponse;
import org.example.retail_inventory_managment.entity.Category;
import org.example.retail_inventory_managment.entity.Product;
import org.example.retail_inventory_managment.entity.ProductVariant;
import org.example.retail_inventory_managment.repository.CategoryRepository;
import org.example.retail_inventory_managment.repository.ProductRepository;
import org.example.retail_inventory_managment.service.Interfaces.ProductInt;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductIntService implements ProductInt {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        Product product = convertToEntity(request);
        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);

    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id).orElseThrow(()-> new RuntimeException("No Product exist for this id "));
        return convertToResponse(product);

    }

    @Override
    public List<ProductResponse> getAllProducts() {
       return productRepository
               .findAll()
               .stream()
               .map(this::convertToResponse).
               toList();
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id).orElseThrow(()-> new RuntimeException("No product find with this id"));
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(()-> new RuntimeException("Category not found"));

        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBasePrice(request.getBasePrice());
        product.setCategory(category);
        Product updatedProduct = productRepository.save(product);
        return convertToResponse(updatedProduct);

    }

    @Override
    public void deactivateProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(()-> new RuntimeException("No product found"));
        product.setActive(false);
        productRepository.save(product);
    }


    private Product convertToEntity(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(()-> new RuntimeException("No category exist"));
        return Product.builder()
                .sku(request.getSku())
                .name(request.getName())
                .description(request.getDescription())
                .basePrice(request.getBasePrice())
                .active(true)
                .category(category)
                .build();
    }
//    Entity to response
    private ProductResponse convertToResponse(Product product){

        return ProductResponse.builder()
                .id(product.getId())
                .sku(product.getSku())
                .name(product.getName())
                .description(product.getDescription())
                .basePrice(product.getBasePrice())
                .active(product.isActive())
                .category(product.getCategory())
                .variant(product.getVariants().stream().map(this::convertToVariantResponse).toList()).build();


    }



    private ProductVariant convertToVariantEntity(ProductVariantResponse response){
        return ProductVariant.builder().build();
    }

    private ProductVariantResponse convertToVariantResponse(ProductVariant productVariant){
        return ProductVariantResponse.builder().build();
    }

}
