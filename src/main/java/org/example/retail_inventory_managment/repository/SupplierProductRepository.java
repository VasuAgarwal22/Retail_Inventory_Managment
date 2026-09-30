package org.example.retail_inventory_managment.repository;

import org.example.retail_inventory_managment.entity.SupplierProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierProductRepository
        extends JpaRepository<SupplierProduct, Long> {

    Optional<SupplierProduct> findBySupplierIdAndProductId(
            Long supplierId,
            Long productId
    );

    List<SupplierProduct> findBySupplierId(Long supplierId);

    List<SupplierProduct> findByProductId(Long productId);

    boolean existsBySupplierIdAndProductId(
            Long supplierId,
            Long productId
    );
}