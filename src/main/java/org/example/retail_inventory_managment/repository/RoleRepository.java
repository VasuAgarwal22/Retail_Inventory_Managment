package org.example.retail_inventory_managment.repository;

import org.example.retail_inventory_managment.entity.Role;
import org.example.retail_inventory_managment.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role,Long> {
    Optional<Role> findByRoleName(RoleName roleName);

}
