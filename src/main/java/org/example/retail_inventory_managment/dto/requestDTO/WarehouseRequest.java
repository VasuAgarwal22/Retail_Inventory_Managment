package org.example.retail_inventory_managment.dto.requestDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.retail_inventory_managment.entity.Address;
import org.example.retail_inventory_managment.enums.WarehouseType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseRequest {

    private String code;

    @NotBlank
    private String name;

    @NotBlank
    private WarehouseType type;

    @NotNull
    private Address address;

}
