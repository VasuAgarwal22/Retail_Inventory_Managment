package org.example.retail_inventory_managment.dto.resposneDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StorageLocationResponse {

    private Long id;
    private String zone;
    private String aisle;
    private String rack;
    private String bin;
    private Long warehouseId;


}
