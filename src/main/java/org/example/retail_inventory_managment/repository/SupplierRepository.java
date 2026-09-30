package org.example.retail_inventory_managment.repository;

import org.example.retail_inventory_managment.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    Optional<Supplier> findByCode(String code);

    boolean existsByCode(String code);

    boolean existsByEmail(String email);
}