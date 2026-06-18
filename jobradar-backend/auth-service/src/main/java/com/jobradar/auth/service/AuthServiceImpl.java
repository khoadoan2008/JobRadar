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

    @Override
    public AuthResponse register(RegisterRequest request) {
        // 1. Kiểm tra email tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // 2. Tạo đối tượng User mới
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Đã mã hóa bằng BCrypt
        user.setActive(true);

        // 3. Lấy Role "ROLE_CANDIDATE" và gán cho User
        Role candidateRole = roleRepository.findByName("ROLE_CANDIDATE")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyền ROLE_CANDIDATE trong Database"));
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

        // 6. Tạo JWT Token thật từ email của user
        String jwtToken = jwtService.generateToken(user.getEmail());

        // 7. Trả về Response thành công
        return new AuthResponse("Đăng ký thành công", jwtToken, savedUser.getId());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // 1. Tìm User theo email   
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Sai email hoặc mật khẩu!"));

        // 2. So sánh mật khẩu
        // matches(mật_khẩu_gõ_vào, mật_khẩu_đã_mã_hóa_trong_DB)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Sai email hoặc mật khẩu!");
        }

        // 3. Nếu thành công, tạo JWT Token thật
        String jwtToken = jwtService.generateToken(user.getEmail());

        // 4. Trả về thông tin và Token
        return new AuthResponse("Đăng nhập thành công", jwtToken, user.getId());
    }

    @Override
    public UserProfileResponse getMyProfile() {
        // Do JwtAuthenticationFilter đã nạp User vào Context, ta có thể lấy ra dễ dàng
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String roles = currentUser.getRoles().stream()
                .map(Role::getName)
                .reduce((a, b) -> a + ", " + b)
                .orElse("");

        String fullName = currentUser.getCandidateProfile() != null 
                ? currentUser.getCandidateProfile().getFullName() 
                : "Admin";

        return new UserProfileResponse(
                currentUser.getId(),
                currentUser.getEmail(),
                fullName,
                roles
        );
    }
}
