package org.example.retail_inventory_managment.service.Implementation;

import org.example.retail_inventory_managment.dto.requestDTO.LoginRequest;
import org.example.retail_inventory_managment.dto.requestDTO.RegisterRequest;
import org.example.retail_inventory_managment.dto.requestDTO.UserUpdateRequest;
import org.example.retail_inventory_managment.dto.resposneDTO.LoginResponse;
import org.example.retail_inventory_managment.dto.resposneDTO.UserResponse;
import org.example.retail_inventory_managment.entity.Role;
import org.example.retail_inventory_managment.entity.User;
import org.example.retail_inventory_managment.repository.UserRepository;
import org.example.retail_inventory_managment.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.example.retail_inventory_managment.service.Interfaces.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public void register(RegisterRequest register){
        if(userRepository.existsByEmail(register.getEmail())){
            throw new RuntimeException("User with this email already exists");
        }
        User user = convertToEntity(register);
        userRepository.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest login) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(login.getEmail(),login.getPassword()));
        String token = jwtService.generateToken(login.getEmail());
        return new LoginResponse(token);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository
                .findById(id)
                .orElseThrow(
                        ()-> new RuntimeException("User not found")
                );
        return convertToResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return   userRepository
                .findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public void updateUserPassword(Long id, UserUpdateRequest user) {
        User user1 = userRepository
                .findById(id)
                .orElseThrow(
                        ()-> new RuntimeException("User not found")
                );
        user1.setPassword(passwordEncoder.encode(user1.getPassword()));
        userRepository.save(user1);
    }

    @Override
    public void deactivateUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("Not found"));
        user.setActive(false);
        userRepository.save(user);
    }

    private UserResponse convertToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNo(user.getPhoneNo())
                .active(user.isActive())
                .roles(user.getRoles().stream().map(Role::getRoleName).collect(Collectors.toSet()))
                .build();
    }

    private User convertToEntity(RegisterRequest request){
        return User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNo(request.getPhoneNo())
                .build();
    }
}