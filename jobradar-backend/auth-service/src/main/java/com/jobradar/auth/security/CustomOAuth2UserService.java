package com.jobradar.auth.security;

import com.jobradar.auth.entity.AuthProvider;
import com.jobradar.auth.entity.Role;
import com.jobradar.auth.entity.User;
import com.jobradar.auth.repository.RoleRepository;
import com.jobradar.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    protected OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());

        if (oAuth2UserInfo.getEmail() == null || oAuth2UserInfo.getEmail().isEmpty()) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (!user.getProvider().name().equalsIgnoreCase(registrationId)) {
                // Đã đăng ký với provider khác (vd: LOCAL) nhưng giờ đăng nhập bằng Google
                // Ta có thể update provider hoặc ném ngoại lệ tùy logic. Ở đây ta cập nhật (Link account).
                user.setProvider(AuthProvider.valueOf(registrationId.toUpperCase()));
                user.setProviderId(oAuth2UserInfo.getId());
                user = userRepository.save(user);
            } else {
                user = updateExistingUser(user, oAuth2UserInfo);
            }
        } else {
            user = registerNewUser(userRequest, oAuth2UserInfo);
        }

        return new CustomUserDetails(user, oAuth2User.getAttributes());
    }

    private User registerNewUser(OAuth2UserRequest userRequest, OAuth2UserInfo oAuth2UserInfo) {
        User user = new User();
        user.setEmail(oAuth2UserInfo.getEmail());
        // User đăng nhập qua mạng xã hội không có password cục bộ
        user.setPassword(null);
        user.setProvider(AuthProvider.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase()));
        user.setProviderId(oAuth2UserInfo.getId());
        user.setActive(true);

        Role userRole = roleRepository.findByName("ROLE_CANDIDATE")
                .orElseThrow(() -> new com.jobradar.auth.exception.ResourceNotFoundException("Error: Role CANDIDATE is not found."));
        user.setRoles(Collections.singleton(userRole));

        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        // Cập nhật thông tin nếu cần (ví dụ tên, avatar)
        return userRepository.save(existingUser);
    }
}
