package org.example.retail_inventory_managment.service.Implementation;

import lombok.RequiredArgsConstructor;
import org.example.retail_inventory_managment.dto.requestDTO.WarehouseRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.WarehouseResponse;
import org.example.retail_inventory_managment.entity.Warehouse;
import org.example.retail_inventory_managment.repository.WarehouseRepository;
import org.example.retail_inventory_managment.service.Interfaces.WarehouseInterface;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WarehouseService implements WarehouseInterface {

    private final WarehouseRepository warehouseRepository;

    @Override
    public WarehouseResponse createWarehouse(WarehouseRequest request) {

        Warehouse warehouse = convertToEntity(request);

        Warehouse savedWarehouse = warehouseRepository.save(warehouse);

        return convertToResponse(savedWarehouse);
    }

    @Override
    public WarehouseResponse getWarehouseById(Long id) {

        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Warehouse not found with this id"));

        return convertToResponse(warehouse);
    }

    @Override
    public List<WarehouseResponse> getAllWarehouses() {

        return warehouseRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public WarehouseResponse updateWarehouse(
            Long id,
            WarehouseRequest request) {

        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Warehouse not found with this id"));

        warehouse.setCode(request.getCode());
        warehouse.setName(request.getName());
        warehouse.setType(request.getType());
        warehouse.setAddress(request.getAddress());

        Warehouse updatedWarehouse = warehouseRepository.save(warehouse);

        return convertToResponse(updatedWarehouse);
    }

    @Override
    public void deactivateWarehouse(Long id) {

        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Warehouse not found with this id"));

        warehouse.setActive(false);

        warehouseRepository.save(warehouse);
    }

    private Warehouse convertToEntity(WarehouseRequest request) {

        return Warehouse.builder()
                .code(request.getCode())
                .name(request.getName())
                .type(request.getType())
                .address(request.getAddress())
                .active(true)
                .build();
    }

    private WarehouseResponse convertToResponse(Warehouse warehouse) {

        return WarehouseResponse.builder()
                .id(warehouse.getId())
                .code(warehouse.getCode())
                .name(warehouse.getName())
                .type(warehouse.getType())
                .address(warehouse.getAddress())
                .active(warehouse.isActive())
                .build();
    }
}