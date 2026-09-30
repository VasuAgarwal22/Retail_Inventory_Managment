package org.example.retail_inventory_managment.service.Implementation;

import lombok.RequiredArgsConstructor;
import org.example.retail_inventory_managment.dto.requestDTO.SupplierProductRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.SupplierProductResponse;
import org.example.retail_inventory_managment.entity.Product;
import org.example.retail_inventory_managment.entity.Supplier;
import org.example.retail_inventory_managment.entity.SupplierProduct;
import org.example.retail_inventory_managment.repository.ProductRepository;
import org.example.retail_inventory_managment.repository.SupplierProductRepository;
import org.example.retail_inventory_managment.repository.SupplierRepository;
import org.example.retail_inventory_managment.service.Interfaces.SupplierProductInterface;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierProductService
        implements SupplierProductInterface {

    private final SupplierProductRepository supplierProductRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;

    @Override
    public SupplierProductResponse createSupplierProduct(
            SupplierProductRequest request) {

        Supplier supplier = supplierRepository.findById(
                        request.getSupplierId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Supplier not found with this id"
                        ));

        Product product = productRepository.findById(
                        request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with this id"
                        ));

        if (supplierProductRepository
                .existsBySupplierIdAndProductId(
                        request.getSupplierId(),
                        request.getProductId())) {

            throw new RuntimeException(
                    "This supplier is already associated with this product"
            );
        }

        if (request.getUnitCost() == null ||
                request.getUnitCost().signum() < 0) {

            throw new RuntimeException(
                    "Unit cost cannot be negative"
            );
        }

        if (request.getMoq() == null ||
                request.getMoq() <= 0) {

            throw new RuntimeException(
                    "MOQ must be greater than zero"
            );
        }

        SupplierProduct supplierProduct =
                SupplierProduct.builder()
                        .supplier(supplier)
                        .product(product)
                        .unitCost(request.getUnitCost())
                        .moq(request.getMoq())
                        .build();

        SupplierProduct savedSupplierProduct =
                supplierProductRepository.save(supplierProduct);

        return convertToResponse(savedSupplierProduct);
    }

    @Override
    public SupplierProductResponse getSupplierProductById(
            Long id) {

        SupplierProduct supplierProduct =
                supplierProductRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Supplier product not found with this id"
                                ));

        return convertToResponse(supplierProduct);
    }

    @Override
    public List<SupplierProductResponse> getAllSupplierProducts() {

        return supplierProductRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<SupplierProductResponse>
    getSupplierProductsBySupplierId(Long supplierId) {

        if (!supplierRepository.existsById(supplierId)) {
            throw new RuntimeException(
                    "Supplier not found with this id"
            );
        }

        return supplierProductRepository
                .findBySupplierId(supplierId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<SupplierProductResponse>
    getSupplierProductsByProductId(Long productId) {

        if (!productRepository.existsById(productId)) {
            throw new RuntimeException(
                    "Product not found with this id"
            );
        }

        return supplierProductRepository
                .findByProductId(productId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public SupplierProductResponse updateSupplierProduct(
            Long id,
            SupplierProductRequest request) {

        SupplierProduct supplierProduct =
                supplierProductRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Supplier product not found with this id"
                                ));

        Supplier supplier = supplierRepository.findById(
                        request.getSupplierId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Supplier not found with this id"
                        ));

        Product product = productRepository.findById(
                        request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with this id"
                        ));

        if (request.getUnitCost() == null ||
                request.getUnitCost().signum() < 0) {

            throw new RuntimeException(
                    "Unit cost cannot be negative"
            );
        }

        if (request.getMoq() == null ||
                request.getMoq() <= 0) {

            throw new RuntimeException(
                    "MOQ must be greater than zero"
            );
        }

        if (!supplierProduct.getSupplier().getId()
                .equals(request.getSupplierId())
                || !supplierProduct.getProduct().getId()
                .equals(request.getProductId())) {

            if (supplierProductRepository
                    .existsBySupplierIdAndProductId(
                            request.getSupplierId(),
                            request.getProductId())) {

                throw new RuntimeException(
                        "This supplier is already associated with this product"
                );
            }
        }

        supplierProduct.setSupplier(supplier);
        supplierProduct.setProduct(product);
        supplierProduct.setUnitCost(request.getUnitCost());
        supplierProduct.setMoq(request.getMoq());

        SupplierProduct updatedSupplierProduct =
                supplierProductRepository.save(supplierProduct);

        return convertToResponse(updatedSupplierProduct);
    }

    @Override
    public void deleteSupplierProduct(Long id) {

        SupplierProduct supplierProduct =
                supplierProductRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Supplier product not found with this id"
                                ));

        supplierProductRepository.delete(supplierProduct);
    }

    private SupplierProductResponse convertToResponse(
            SupplierProduct supplierProduct) {

        return SupplierProductResponse.builder()
                .id(supplierProduct.getId())
                .supplierId(
                        supplierProduct.getSupplier().getId()
                )
                .productId(
                        supplierProduct.getProduct().getId()
                )
                .unitCost(supplierProduct.getUnitCost())
                .moq(supplierProduct.getMoq())
                .build();
    }
}