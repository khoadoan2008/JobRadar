package com.jobradar.auth.service;

import com.jobradar.auth.dto.AuthResponse;
import com.jobradar.auth.dto.LoginRequest;
import com.jobradar.auth.dto.RegisterRequest;
import com.jobradar.auth.dto.UserProfileResponse;
import com.jobradar.auth.dto.TokenRefreshRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserProfileResponse getMyProfile();
    AuthResponse refreshToken(TokenRefreshRequest request);
    void logout(String email);
}
