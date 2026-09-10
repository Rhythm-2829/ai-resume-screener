package com.rhythm.resumescreener.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.rhythm.resumescreener.repository.UserRepository;
import com.rhythm.resumescreener.util.JwtUtil;
import com.rhythm.resumescreener.dto.AuthRequest;
import com.rhythm.resumescreener.dto.AuthResponse;
import com.rhythm.resumescreener.model.User;

import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(AuthRequest request){
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHashed(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        String token = jwtUtil.generateToken(request.getEmail());
        return new AuthResponse(token);
    }
    public AuthResponse login(AuthRequest request){
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHashed())) {
            throw new RuntimeException("Invalid password");
        }
        String token = jwtUtil.generateToken(request.getEmail());
        return new AuthResponse(token);
    }
}
