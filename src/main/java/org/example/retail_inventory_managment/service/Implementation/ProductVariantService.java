package org.example.retail_inventory_managment.service.Implementation;

import lombok.RequiredArgsConstructor;
import org.example.retail_inventory_managment.dto.requestDTO.ProductVariantRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.ProductVariantResponse;
import org.example.retail_inventory_managment.entity.Product;
import org.example.retail_inventory_managment.entity.ProductVariant;
import org.example.retail_inventory_managment.repository.ProductRepository;
import org.example.retail_inventory_managment.repository.ProductVariantRepository;
import org.example.retail_inventory_managment.service.Interfaces.ProductVariantInterface;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductVariantService implements ProductVariantInterface {

    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;


    @Override
    public ProductVariantResponse createVariant(ProductVariantRequest request) {
        Product product = productRepository.findById(request.getProductId().getId()).orElseThrow(()-> new RuntimeException("Product not found"));
        if(!product.isActive()){
            throw new RuntimeException("Cannot create variant for inactive product");
        }
        ProductVariant variant = convertToEntity(request);
        ProductVariant savedVariant = productVariantRepository.save(variant);
        return convertToResponse(savedVariant);
    }

    @Override
    public ProductVariantResponse getVariantById(Long id) {
        ProductVariant productVariant = productVariantRepository
                .findById(id)
                .orElseThrow(
                        ()-> new RuntimeException("Product variant not found with this id ")
                );
        return convertToResponse(productVariant);
    }

    @Override
    public List<ProductVariantResponse> getAllVariants() {
       return  productVariantRepository
               .findAll()
               .stream()
               .map(this::convertToResponse)
               .toList();
    }

    @Override
    public ProductVariantResponse updateVariant(Long id, ProductVariantRequest request) {
       ProductVariant productVariant = productVariantRepository
               .findById(id)
               .orElseThrow(
                       ()-> new RuntimeException("Product with this id do not exist")
               );
       Product product = productRepository.findById(request.getProductId().getId()).orElseThrow(()-> new RuntimeException("Product not found"));
       if(!product.isActive()){
           throw  new RuntimeException("Cannot assign variant to inactive product");
       }
       productVariant.setName(request.getName());
       productVariant.setPrice(request.getPrice());
       productVariant.setDescription(request.getDescription());
       productVariant.setSku(request.getSku());
       productVariant.setProduct(request.getProductId());
       productVariantRepository.save(productVariant);
       return convertToResponse(productVariant);
    }

    @Override
    public void deactivateVariant(Long id) {
        ProductVariant productVariant = productVariantRepository.findById(id).orElseThrow(()-> new RuntimeException("Product with this id do not exist"));
        productVariant.setActive(false);
        productVariantRepository.save(productVariant);
    }

    private ProductVariant convertToEntity(ProductVariantRequest request){
        return ProductVariant.builder()
                .sku(request.getSku())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .product(request.getProductId())
                .build();
    }

    private ProductVariantResponse convertToResponse(ProductVariant variant){
        return ProductVariantResponse.builder()
                .id(variant.getId())
                .sku(variant.getSku())
                .name(variant.getName())
                .price(variant.getPrice())
                .active(true)
                .productId(variant.getProduct().getId())
                .build();
    }
    @Override
    public List<ProductVariantResponse> getVariantsByProductId(Long productId) {
        return productVariantRepository
                .findByProductId(productId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

}
