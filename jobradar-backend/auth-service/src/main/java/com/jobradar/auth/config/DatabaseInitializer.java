package com.jobradar.auth.config;

import com.jobradar.auth.entity.Role;
import com.jobradar.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Class này sẽ tự động chạy một lần duy nhất mỗi khi bạn bật app Spring Boot.
 * Chuyên dùng để chèn các dữ liệu khởi tạo (seed data) ban đầu cho hệ thống.
 */
@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Tự động gỡ bỏ ràng buộc NOT NULL của cột password dưới Database
        try {
            jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN password DROP NOT NULL");
            System.out.println("✅ Đã tự động gỡ bỏ ràng buộc NOT NULL cho cột password!");
        } catch (Exception e) {
            System.out.println("ℹ️ Bỏ qua gỡ bỏ ràng buộc password: " + e.getMessage());
        }

        // Kiểm tra xem trong bảng 'roles' đã có dữ liệu nào chưa
        if (roleRepository.count() == 0) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");

            Role candidateRole = new Role();
            candidateRole.setName("ROLE_CANDIDATE");

            Role employerRole = new Role();
            employerRole.setName("ROLE_EMPLOYER");

            // Lưu cả 3 quyền vào DB cùng một lúc
            roleRepository.saveAll(List.of(adminRole, candidateRole, employerRole));

            System.out.println("✅ Đã khởi tạo thành công dữ liệu Role mẫu vào Database!");
        } else {
            System.out.println("ℹ️ Database đã có sẵn dữ liệu Role, bỏ qua bước khởi tạo.");
        }
    }
}
