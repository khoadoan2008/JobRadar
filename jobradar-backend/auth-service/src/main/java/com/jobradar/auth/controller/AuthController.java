package com.jobradar.auth.controller;

import com.jobradar.auth.dto.AuthResponse;
import com.jobradar.auth.dto.LoginRequest;
import com.jobradar.auth.dto.RegisterRequest;
import com.jobradar.auth.dto.UserProfileResponse;
import com.jobradar.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    // Đây chính là sợi dây liên kết giữa Controller và Service
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // Lễ tân (Controller) nhận request từ khách, đưa xuống cho Đầu bếp (Service) xử lý
        AuthResponse response = authService.register(request);
        
        // Trả kết quả kèm theo mã HTTP Status là 200 (OK)
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // API cần được bảo vệ, bắt buộc phải có Token JWT mới gọi được
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile() {
        return ResponseEntity.ok(authService.getMyProfile());
    }
}
