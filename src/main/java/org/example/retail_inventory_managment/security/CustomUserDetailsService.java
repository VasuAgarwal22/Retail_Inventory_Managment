package org.example.retail_inventory_managment.security;
import org.example.retail_inventory_managment.entity.Role;
import org.example.retail_inventory_managment.entity.User;
import org.example.retail_inventory_managment.enums.RoleName;
import org.example.retail_inventory_managment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));

        String[] role = user.getRoles()
                .stream()
                .map(Role::getRoleName)
                .toArray(String[]::new);

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(role)
                .build();
    }
}
