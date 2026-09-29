package org.example.retail_inventory_managment.dto.requestDTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StorageLocationRequest {

    private String zone;
    private String aisle;
    private String rack;
    private String bin;

    @NotNull
    private Long warehouseId;



}
