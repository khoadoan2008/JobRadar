package com.jobradar.auth.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RateLimitingFilterIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void rateLimiting_ShouldBlock_After5Requests() throws Exception {
        // Chúng ta sẽ giả lập gọi API đăng nhập 6 lần liên tiếp.
        // Cấu hình trong RateLimitingFilter là 5 requests/phút.
        // Lần thứ 6 phải bị chặn và trả về HTTP 429 (TOO MANY REQUESTS).

        String loginJson = """
                {
                    "email": "test@example.com",
                    "password": "password"
                }
                """;

        // 5 lần gọi đầu tiên (có thể thành công 200 hoặc lỗi 401 do sai credentials, nhưng không bị chặn bởi Rate Limiter)
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(loginJson)
                            .header("X-Forwarded-For", "192.168.1.1")) // Fake IP
                    // Không kiểm tra status vì có thể là 401, chỉ cần không phải là 429
                    .andExpect(result -> {
                        int status = result.getResponse().getStatus();
                        assert status != 429 : "Không nên bị chặn ở 5 request đầu tiên";
                    });
        }

        // Lần gọi thứ 6 phải bị chặn -> HTTP 429
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson)
                        .header("X-Forwarded-For", "192.168.1.1"))
                .andExpect(status().isTooManyRequests());
    }
}
