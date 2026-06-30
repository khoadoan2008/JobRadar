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

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody com.jobradar.auth.dto.TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Lấy thông tin user hiện tại từ SecurityContext
        org.springframework.security.core.userdetails.UserDetails userDetails = 
            (org.springframework.security.core.userdetails.UserDetails) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        authService.logout(userDetails.getUsername());
        
        return ResponseEntity.ok(java.util.Map.of("message", "Đăng xuất thành công"));
    }

    @PutMapping("/skills")
    public ResponseEntity<Void> updateSkills(@RequestBody java.util.Map<String, String> requestBody) {
        org.springframework.security.core.Authentication auth = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        authService.updateSkills(auth.getName(), requestBody.get("skills"));
        return ResponseEntity.ok().build();
    }
}
