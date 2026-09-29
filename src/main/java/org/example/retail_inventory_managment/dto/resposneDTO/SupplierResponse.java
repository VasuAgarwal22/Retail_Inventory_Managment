package org.example.retail_inventory_managment.dto.resposneDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierResponse {

    private Long id;
    private String code;
    private String name;
    private String email;
    private String phoneNo;
    private String paymentTerms;
    private Integer leadTimeDays;
    private BigDecimal rating;

}
