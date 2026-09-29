package org.example.retail_inventory_managment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    private String email;

    private String phoneNo;

    private String paymentTerms;

    private Integer leadTimeDays;

    private BigDecimal rating;

    @OneToMany(mappedBy = "supplier")
    private List<SupplierProduct> products = new ArrayList<>();
}
