package com.dungeonscribe.service;


import com.dungeonscribe.entity.User;
import com.dungeonscribe.repository.UserRepository;
import com.dungeonscribe.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String register(String email, String username, String password){
        //Check if email is unique
        if(userRepository.findByEmail(email).isPresent()){
            throw new RuntimeException(("Email already registered"));
        }

        //Build and save new User
        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password)); // Hashes password

        userRepository.save(user);

        return jwtService.generateToken(email);
    }

    public String login(String email, String password){
        //Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        //Check that the password matches the hashed pass
        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new RuntimeException("Invalid password");
        }

        return jwtService.generateToken(email);
    }

    public User getCurrentUser(){
        return (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }
}
