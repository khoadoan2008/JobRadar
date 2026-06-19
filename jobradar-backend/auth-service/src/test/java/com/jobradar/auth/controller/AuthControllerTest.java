package com.jobradar.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobradar.auth.dto.AuthResponse;
import com.jobradar.auth.dto.LoginRequest;
import com.jobradar.auth.dto.RegisterRequest;
import com.jobradar.auth.exception.DuplicateResourceException;
import com.jobradar.auth.exception.UnauthorizedException;
import com.jobradar.auth.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class, excludeAutoConfiguration = {
        org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
        org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration.class,
        org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration.class,
        org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration.class
})
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private com.jobradar.auth.config.JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @MockBean
    private com.jobradar.auth.security.CustomOAuth2UserService customOAuth2UserService;

    @MockBean
    private com.jobradar.auth.security.OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @MockBean
    private com.jobradar.auth.service.JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("test@test.com", "password", "Test User");
        loginRequest = new LoginRequest("test@test.com", "password");
    }

    @Test
    void register_Success() throws Exception {
        AuthResponse mockResponse = new AuthResponse("Đăng ký thành công", "mockJwtToken", 1L);
        Mockito.when(authService.register(any(RegisterRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Đăng ký thành công"))
                .andExpect(jsonPath("$.token").value("mockJwtToken"));
    }

    @Test
    void register_EmailExists_Returns409() throws Exception {
        Mockito.when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new DuplicateResourceException("Email đã được sử dụng!"));

        // Since we are mocking AuthService, and GlobalExceptionHandler is not loaded by default in some @WebMvcTest configs if not scanned
        // Wait, GlobalExceptionHandler is in exception package. If it's not scanned, we need to import it or rely on Spring context.
        // Usually, Spring Boot @WebMvcTest scans @ControllerAdvice inside the project.
        
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email đã được sử dụng!"));
    }

    @Test
    void login_Success() throws Exception {
        AuthResponse mockResponse = new AuthResponse("Đăng nhập thành công", "mockJwtToken", 1L);
        Mockito.when(authService.login(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Đăng nhập thành công"))
                .andExpect(jsonPath("$.token").value("mockJwtToken"));
    }

    @Test
    void login_InvalidCredentials_Returns401() throws Exception {
        Mockito.when(authService.login(any(LoginRequest.class)))
                .thenThrow(new UnauthorizedException("Sai email hoặc mật khẩu!"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Sai email hoặc mật khẩu!"));
    }
}
