package org.example.retail_inventory_managment.service.Interfaces;

import org.example.retail_inventory_managment.dto.requestDTO.SupplierRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.SupplierResponse;

import java.util.List;

public interface SupplierInterface {
    
    SupplierResponse createSupplier(SupplierRequest request);
    SupplierResponse getSupplierById(Long id);
    List<SupplierResponse> getAllSuppliers();
    SupplierResponse updateSupplier(Long id, SupplierRequest request);
    void deleteSupplier(Long id);

}