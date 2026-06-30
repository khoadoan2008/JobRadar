package com.jobradar.auth.service;

import com.jobradar.auth.dto.AuthResponse;
import com.jobradar.auth.dto.LoginRequest;
import com.jobradar.auth.dto.RegisterRequest;
import com.jobradar.auth.dto.UserProfileResponse;
import com.jobradar.auth.entity.CandidateProfile;
import com.jobradar.auth.entity.Role;
import com.jobradar.auth.entity.User;
import com.jobradar.auth.repository.CandidateProfileRepository;
import com.jobradar.auth.repository.RoleRepository;
import com.jobradar.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    // Spring sẽ tự động inject (tiêm) các Repository này vào nhờ @RequiredArgsConstructor
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CandidateProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; // Thêm JwtService để sinh Token thật
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        // 1. Kiểm tra email tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new com.jobradar.auth.exception.DuplicateResourceException("Email đã được sử dụng!");
        }

        // 2. Tạo đối tượng User mới
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Đã mã hóa bằng BCrypt
        user.setActive(true);

        // 3. Lấy Role "ROLE_CANDIDATE" và gán cho User
        Role candidateRole = roleRepository.findByName("ROLE_CANDIDATE")
                .orElseThrow(() -> new com.jobradar.auth.exception.ResourceNotFoundException("Không tìm thấy quyền ROLE_CANDIDATE trong Database"));
        Set<Role> roles = new HashSet<>();
        roles.add(candidateRole);
        user.setRoles(roles);

        // 4. Tạo đối tượng CandidateProfile
        CandidateProfile profile = new CandidateProfile();
        profile.setFullName(request.getFullName());
        profile.setUser(user); // Móc nối Profile với User

        // 5. Set Profile vào User và lưu xuống DB
        user.setCandidateProfile(profile);
        
        // Gọi lệnh save: Nhờ cấu hình CascadeType.ALL bên Entity User,
        // nó sẽ tự động lưu cả User và CandidateProfile xuống 2 bảng cùng lúc.
        User savedUser = userRepository.save(user);

        // --- Bắt đầu Test Webhook Gửi Email ---
        // Tạm thời sinh mã Token giả lập (UUID) để test Webhook
        String dummyToken = java.util.UUID.randomUUID().toString();
        emailService.sendVerificationEmail(savedUser.getEmail(), dummyToken);
        // -------------------------------------

        // 6. Tạo JWT Token thật từ email của user
        String jwtToken = jwtService.generateToken(user.getEmail());
        String refreshToken = refreshTokenService.createRefreshToken(savedUser.getId()).getToken();

        // 7. Trả về Response thành công
        return new AuthResponse("Đăng ký thành công", jwtToken, refreshToken, savedUser.getId());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // 1. Tìm User theo email   
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new com.jobradar.auth.exception.UnauthorizedException("Sai email hoặc mật khẩu!"));

        // 2. So sánh mật khẩu
        // matches(mật_khẩu_gõ_vào, mật_khẩu_đã_mã_hóa_trong_DB)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new com.jobradar.auth.exception.UnauthorizedException("Sai email hoặc mật khẩu!");
        }

        // 3. Nếu thành công, tạo JWT Token thật
        String jwtToken = jwtService.generateToken(user.getEmail());
        String refreshToken = refreshTokenService.createRefreshToken(user.getId()).getToken();

        // 4. Trả về thông tin và Token
        return new AuthResponse("Đăng nhập thành công", jwtToken, refreshToken, user.getId());
    }

    @Override
    public UserProfileResponse getMyProfile() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        // Nếu chưa đăng nhập (Spring Security trả về anonymousUser dưới dạng String)
        if (principal instanceof String && "anonymousUser".equals(principal)) {
            throw new com.jobradar.auth.exception.UnauthorizedException("Người dùng chưa được xác thực hoặc Token không hợp lệ!");
        }

        User userPrincipal = (User) principal;
        
        // Truy vấn lại từ DB để gắn vào Session hiện tại, tránh lỗi LazyInitializationException
        User currentUser = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new com.jobradar.auth.exception.ResourceNotFoundException("Không tìm thấy tài khoản trong hệ thống"));

        String roles = currentUser.getRoles().stream()
                .map(Role::getName)
                .reduce((a, b) -> a + ", " + b)
                .orElse("");

        // Cập nhật tên: Nếu là user đăng nhập qua MXH chưa tạo profile thì để tạm là "Thành viên mới" thay vì "Admin"
        String fullName = "Thành viên mới";
        String phone = null;
        String avatarUrl = null;
        String skills = null;
        
        if (currentUser.getCandidateProfile() != null) {
            fullName = currentUser.getCandidateProfile().getFullName();
            phone = currentUser.getCandidateProfile().getPhone();
            avatarUrl = currentUser.getCandidateProfile().getAvatarUrl();
            skills = currentUser.getCandidateProfile().getSkills();
        }

        return new UserProfileResponse(
                currentUser.getId(),
                currentUser.getEmail(),
                fullName,
                roles,
                phone,
                avatarUrl,
                skills
        );
    }

    @Override
    public AuthResponse refreshToken(com.jobradar.auth.dto.TokenRefreshRequest request) {
        return refreshTokenService.findByToken(request.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(com.jobradar.auth.entity.RefreshToken::getUser)
                .map(user -> {
                    String token = jwtService.generateToken(user.getEmail());
                    return new AuthResponse("Làm mới token thành công", token, request.getRefreshToken(), user.getId());
                })
                .orElseThrow(() -> new com.jobradar.auth.exception.TokenRefreshException(request.getRefreshToken(),
                        "Refresh token is not in database!"));
    }

    @Override
    public void logout(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            refreshTokenService.deleteByUserId(user.getId());
        });
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void updateSkills(String email, String skills) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new com.jobradar.auth.exception.ResourceNotFoundException("Không tìm thấy tài khoản"));
        
        CandidateProfile profile = user.getCandidateProfile();
        if (profile == null) {
            profile = new CandidateProfile();
            profile.setUser(user);
            user.setCandidateProfile(profile);
        }
        profile.setSkills(skills);
        profileRepository.save(profile);
    }
}
