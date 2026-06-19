package com.jobradar.auth.service;

import com.jobradar.auth.dto.AuthResponse;
import com.jobradar.auth.dto.LoginRequest;
import com.jobradar.auth.dto.RegisterRequest;
import com.jobradar.auth.entity.Role;
import com.jobradar.auth.entity.User;
import com.jobradar.auth.exception.DuplicateResourceException;
import com.jobradar.auth.exception.UnauthorizedException;
import com.jobradar.auth.repository.CandidateProfileRepository;
import com.jobradar.auth.repository.RoleRepository;
import com.jobradar.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private CandidateProfileRepository profileRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User mockUser;
    private Role mockRole;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("test@test.com", "password", "Test User");
        loginRequest = new LoginRequest("test@test.com", "password");

        mockRole = new Role();
        mockRole.setId(1);
        mockRole.setName("ROLE_CANDIDATE");

        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@test.com");
        mockUser.setPassword("encodedPassword");
    }

    @Test
    void register_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(roleRepository.findByName(anyString())).thenReturn(Optional.of(mockRole));
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(jwtService.generateToken(anyString())).thenReturn("dummyJwtToken");

        com.jobradar.auth.entity.RefreshToken mockRefreshToken = new com.jobradar.auth.entity.RefreshToken();
        mockRefreshToken.setToken("dummyRefreshToken");
        when(refreshTokenService.createRefreshToken(anyLong())).thenReturn(mockRefreshToken);

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("Đăng ký thành công", response.getMessage());
        assertEquals("dummyJwtToken", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_EmailAlreadyExists_ThrowsException() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtService.generateToken(anyString())).thenReturn("dummyJwtToken");

        com.jobradar.auth.entity.RefreshToken mockRefreshToken = new com.jobradar.auth.entity.RefreshToken();
        mockRefreshToken.setToken("dummyRefreshToken");
        when(refreshTokenService.createRefreshToken(anyLong())).thenReturn(mockRefreshToken);

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("Đăng nhập thành công", response.getMessage());
        assertEquals("dummyJwtToken", response.getToken());
    }

    @Test
    void login_InvalidEmail_ThrowsException() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));
    }

    @Test
    void login_InvalidPassword_ThrowsException() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));
    }
}
