package org.example.retail_inventory_managment.repository;

import org.example.retail_inventory_managment.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends JpaRepository<Permission,Long> {

}
