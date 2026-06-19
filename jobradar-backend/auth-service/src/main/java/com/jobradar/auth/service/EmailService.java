package com.jobradar.auth.service;

import com.jobradar.auth.dto.EmailRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    // Tiêm (Inject) cái Webhook Client vào để sử dụng
    private final GoogleEmailClient emailClient;

    public void sendVerificationEmail(String toEmail, String token) {
        // Đường link dẫn về phía Frontend (ReactJS) kèm theo mã token xác thực
        String verificationUrl = "http://localhost:5173/verify-email?token=" + token;
        
        // Soạn nội dung HTML cho Email
        String body = "<h3>Chào mừng đến với JobRadar!</h3>"
                + "<p>Vui lòng click vào link bên dưới để xác thực tài khoản của bạn:</p>"
                + "<a href=\"" + verificationUrl + "\" style=\"display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;\">Xác thực tài khoản</a>"
                + "<p><br>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>";

        // Đóng gói thành EmailRequest
        EmailRequest request = EmailRequest.builder()
                .to(toEmail)
                .subject("Xác thực tài khoản JobRadar")
                .body(body)
                .isHtml(true)
                .build();

        try {
            log.info("Đang gửi email xác thực đến: {}", toEmail);
            // Kích hoạt OpenFeign để bắn API đi
            emailClient.sendEmail(request);
            log.info("Đã gửi email thành công!");
        } catch (Exception e) {
            log.error("Lỗi khi gửi email đến {}: {}", toEmail, e.getMessage());
        }
    }
}
