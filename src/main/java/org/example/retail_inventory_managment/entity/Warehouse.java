package org.example.retail_inventory_managment.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.retail_inventory_managment.enums.WarehouseType;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "warehouses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique = true)
    private String code;

    private String name;

    @Enumerated(EnumType.ORDINAL)
    private WarehouseType type;

    @Embedded
    private Address address;

    @Column(nullable = false)
    private boolean active = true;

}
