package org.example.retail_inventory_managment.repository;

import org.example.retail_inventory_managment.entity.SupplierProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierProductRepository extends JpaRepository<SupplierProduct,Long> {

}
