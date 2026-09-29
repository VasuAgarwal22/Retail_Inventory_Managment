package org.example.retail_inventory_managment.repository;

import lombok.extern.java.Log;
import org.example.retail_inventory_managment.entity.StorageLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StorageLocationRepository extends JpaRepository<StorageLocation, Long> {

}
