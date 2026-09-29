package org.example.retail_inventory_managment.dto.requestDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequest {


    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNo;

}
