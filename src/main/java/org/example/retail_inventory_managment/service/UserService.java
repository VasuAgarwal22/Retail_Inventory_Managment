package org.example.retail_inventory_managment.service;

import org.example.retail_inventory_managment.dto.requestDTO.LoginRequest;
import org.example.retail_inventory_managment.dto.requestDTO.RegisterRequest;
import org.example.retail_inventory_managment.dto.requestDTO.UserUpdateRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.LoginResponse;
import org.example.retail_inventory_managment.dto.resposneDTO.UserResponse;
import org.example.retail_inventory_managment.entity.User;

import java.util.List;

public interface UserService {
    void register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
//    User addUser(User user);
    UserResponse getUserById(Long id);
    List<UserResponse> getAllUsers();
    void updateUserPassword(Long id, UserUpdateRequest user);
    void deactivateUser(Long id);

}
