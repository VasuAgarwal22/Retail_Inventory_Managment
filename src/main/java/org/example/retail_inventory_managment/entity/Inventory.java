package org.example.retail_inventory_managment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items",uniqueConstraints = {@UniqueConstraint(columnNames = {"product_id","warehouse_id"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id",nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "warehouse_id",nullable = false)
    private Warehouse warehouse;

    @ManyToOne
    @JoinColumn(name = "storage_location_id",nullable = false)
    private StorageLocation storageLocation;

    private Integer quantityOnHand = 0;
    private Integer quantityReserved =0;
    private Integer quantityIncoming = 0;
    private LocalDateTime lastCountedAt;

    @Version
    private Long version;

}
