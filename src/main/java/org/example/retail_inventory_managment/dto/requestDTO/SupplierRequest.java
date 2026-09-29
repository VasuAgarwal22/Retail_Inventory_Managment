package org.example.retail_inventory_managment.dto.requestDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class SupplierRequest {

    private String code;
    private String name;
    private String email;
    private String paymentTerms;
    private Integer leadTimeDays;

}
