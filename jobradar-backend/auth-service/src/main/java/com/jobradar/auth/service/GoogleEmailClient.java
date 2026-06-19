package com.jobradar.auth.service;

import com.jobradar.auth.dto.EmailRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// Báo cho Spring Boot biết đây là một HTTP Client tự động. 
// Nó sẽ đọc đường dẫn từ biến webhook.email.url trong file cấu hình.
@FeignClient(name = "googleEmailClient", url = "${webhook.email.url}")
public interface GoogleEmailClient {
    
    // Gửi phương thức POST kèm theo nội dung Email dạng JSON (RequestBody)
    @PostMapping
    String sendEmail(@RequestBody EmailRequest emailRequest);
}
