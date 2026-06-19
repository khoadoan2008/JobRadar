package com.jobradar.auth.security;

import com.jobradar.auth.entity.AuthProvider;
import com.jobradar.auth.entity.Role;
import com.jobradar.auth.entity.User;
import com.jobradar.auth.repository.RoleRepository;
import com.jobradar.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomOAuth2UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private CustomOAuth2UserService customOAuth2UserService;

    private OAuth2UserRequest mockRequest;
    private OAuth2User mockOAuth2User;

    @BeforeEach
    void setUp() {
        ClientRegistration clientRegistration = ClientRegistration.withRegistrationId("google")
                .clientId("test-client")
                .clientSecret("test-secret")
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://www.googleapis.com/oauth2/v4/token")
                .clientName("Google")
                .build();

        mockRequest = new OAuth2UserRequest(clientRegistration, mock(org.springframework.security.oauth2.core.OAuth2AccessToken.class));

        Map<String, Object> attributes = new HashMap<>();
        attributes.put("sub", "12345");
        attributes.put("name", "Test Google User");
        attributes.put("email", "testgoogle@gmail.com");

        mockOAuth2User = new DefaultOAuth2User(
                Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("USER")),
                attributes,
                "email"
        );
    }

    @Test
    void processOAuth2User_NewUser_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        Role mockRole = new Role();
        mockRole.setId(1);
        mockRole.setName("ROLE_CANDIDATE");
        when(roleRepository.findByName("ROLE_CANDIDATE")).thenReturn(Optional.of(mockRole));

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setEmail("testgoogle@gmail.com");
        savedUser.setProvider(AuthProvider.GOOGLE);
        savedUser.setRoles(Collections.singleton(mockRole));
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        OAuth2User result = customOAuth2UserService.processOAuth2User(mockRequest, mockOAuth2User);

        assertNotNull(result);
        assertTrue(result instanceof CustomUserDetails);
        CustomUserDetails userDetails = (CustomUserDetails) result;
        assertEquals("testgoogle@gmail.com", userDetails.getUsername());
        assertEquals("testgoogle@gmail.com", userDetails.getAttributes().get("email"));
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void processOAuth2User_ExistingUserSameProvider_Success() {
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setEmail("testgoogle@gmail.com");
        existingUser.setProvider(AuthProvider.GOOGLE);
        
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        OAuth2User result = customOAuth2UserService.processOAuth2User(mockRequest, mockOAuth2User);

        assertNotNull(result);
        verify(roleRepository, never()).findByName(anyString());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void processOAuth2User_ExistingUserDifferentProvider_UpdatesProvider() {
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setEmail("testgoogle@gmail.com");
        existingUser.setProvider(AuthProvider.LOCAL); // was LOCAL
        
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OAuth2User result = customOAuth2UserService.processOAuth2User(mockRequest, mockOAuth2User);

        assertNotNull(result);
        CustomUserDetails userDetails = (CustomUserDetails) result;
        assertEquals(AuthProvider.GOOGLE, userDetails.getUser().getProvider()); // updated to GOOGLE
        verify(userRepository, times(1)).save(any(User.class));
    }
}
