package org.example.retail_inventory_managment.service.Implementation;

import lombok.RequiredArgsConstructor;
import org.example.retail_inventory_managment.dto.requestDTO.SupplierRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.SupplierResponse;
import org.example.retail_inventory_managment.entity.Supplier;
import org.example.retail_inventory_managment.repository.SupplierRepository;
import org.example.retail_inventory_managment.service.Interfaces.SupplierInterface;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService implements SupplierInterface {

    private final SupplierRepository supplierRepository;

    @Override
    public SupplierResponse createSupplier(SupplierRequest request) {

        if (supplierRepository.existsByCode(request.getCode())) {
            throw new RuntimeException(
                    "Supplier already exists with this code"
            );
        }

        if (request.getEmail() != null &&
                supplierRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "Supplier already exists with this email"
            );
        }

        Supplier supplier = Supplier.builder()
                .code(request.getCode())
                .name(request.getName())
                .email(request.getEmail())
                .phoneNo(request.getPhoneNo())
                .paymentTerms(request.getPaymentTerms())
                .leadTimeDays(request.getLeadTimeDays())
                .rating(request.getRating())
                .build();

        Supplier savedSupplier = supplierRepository.save(supplier);

        return convertToResponse(savedSupplier);
    }

    @Override
    public SupplierResponse getSupplierById(Long id) {

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Supplier not found with this id"
                        ));

        return convertToResponse(supplier);
    }

    @Override
    public List<SupplierResponse> getAllSuppliers() {

        return supplierRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public SupplierResponse updateSupplier(
            Long id,
            SupplierRequest request) {

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Supplier not found with this id"
                        ));

        if (!supplier.getCode().equals(request.getCode())
                && supplierRepository.existsByCode(request.getCode())) {

            throw new RuntimeException(
                    "Supplier already exists with this code"
            );
        }

        if (request.getEmail() != null
                && !request.getEmail().equals(supplier.getEmail())
                && supplierRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "Supplier already exists with this email"
            );
        }

        supplier.setCode(request.getCode());
        supplier.setName(request.getName());
        supplier.setEmail(request.getEmail());
        supplier.setPhoneNo(request.getPhoneNo());
        supplier.setPaymentTerms(request.getPaymentTerms());
        supplier.setLeadTimeDays(request.getLeadTimeDays());
        supplier.setRating(request.getRating());

        Supplier updatedSupplier =
                supplierRepository.save(supplier);

        return convertToResponse(updatedSupplier);
    }

    @Override
    public void deleteSupplier(Long id) {

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Supplier not found with this id"
                        ));

        supplierRepository.delete(supplier);
    }

    private SupplierResponse convertToResponse(Supplier supplier) {

        return SupplierResponse.builder()
                .id(supplier.getId())
                .code(supplier.getCode())
                .name(supplier.getName())
                .email(supplier.getEmail())
                .phoneNo(supplier.getPhoneNo())
                .paymentTerms(supplier.getPaymentTerms())
                .leadTimeDays(supplier.getLeadTimeDays())
                .rating(supplier.getRating())
                .build();
    }
}