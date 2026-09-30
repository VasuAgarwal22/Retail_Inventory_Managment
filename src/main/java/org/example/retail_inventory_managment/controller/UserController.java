package org.example.retail_inventory_managment.controller;

import lombok.RequiredArgsConstructor;
import org.example.retail_inventory_managment.dto.requestDTO.LoginRequest;
import org.example.retail_inventory_managment.dto.requestDTO.RegisterRequest;
import org.example.retail_inventory_managment.dto.requestDTO.UserUpdateRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.LoginResponse;
import org.example.retail_inventory_managment.dto.resposneDTO.UserResponse;
import org.example.retail_inventory_managment.service.Implementation.UserServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request){
        userService.register(request);
        return ResponseEntity.ok("USER REGISTERED SUCCESSFULLY");
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest){
        
        return ResponseEntity.ok(userService.login(loginRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id){

        return ResponseEntity.ok(userService.getUserById(id));

    }

    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<String> updatePassword(@PathVariable Long id, @RequestBody UserUpdateRequest request){
        userService.updateUserPassword(id,request);
        return ResponseEntity.ok("PASSWORD CHANGED SUCCESSFULLY");
    }

    @PutMapping("/deactivate/{id}")
    public ResponseEntity<String> deactivate(@PathVariable Long id){
        userService.deactivateUser(id);
        return ResponseEntity.ok("USER DEACTIVATED SUCCESSFULLY");
    }

}
