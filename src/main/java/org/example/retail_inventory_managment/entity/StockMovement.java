package org.example.retail_inventory_managment.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.retail_inventory_managment.enums.MovementType;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id",nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "warehouse_id",nullable = false)
    private Warehouse warehouse;

    private MovementType movementType;

    private Integer quantity;
    private Integer balanceAfter;
    private String referenceType;
    private Long referenceId;
    private String reason;

    @ManyToOne
    @JoinColumn(name = "performed_by")
    private User performedBy;

    @Column(nullable = false)
    private LocalDateTime occurredAt;
}
