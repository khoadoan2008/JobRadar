package com.jobradar.crawler.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FlareSolverrService {

    @Value("${services.flaresolverr.url}")
    private String flaresolverrUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Gửi yêu cầu tới dịch vụ FlareSolverr để bypass Cloudflare và lấy mã nguồn HTML của trang web.
     *
     * @param targetUrl Đường dẫn URL cần cào dữ liệu
     * @return Chuỗi HTML sạch đã được render xong, hoặc null nếu có lỗi
     */
    public String fetchHtml(String targetUrl) {
        log.info("🌐 Đang gửi yêu cầu bypass Cloudflare qua FlareSolverr tới URL: {}", targetUrl);
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("cmd", "request.get");
            requestBody.put("url", targetUrl);
            requestBody.put("maxTimeout", 60000);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            // Gửi request POST tới FlareSolverr
            String responseStr = restTemplate.postForObject(flaresolverrUrl, entity, String.class);
            if (responseStr == null) {
                log.error("❌ Không nhận được phản hồi từ FlareSolverr!");
                return null;
            }

            JsonNode rootNode = objectMapper.readTree(responseStr);
            String status = rootNode.path("status").asText("");

            if ("ok".equalsIgnoreCase(status)) {
                String html = rootNode.path("solution").path("response").asText("");
                log.info("✅ FlareSolverr đã giải quyết thử thách Cloudflare thành công!");
                return html;
            } else {
                log.error("❌ FlareSolverr trả về trạng thái thất bại: {}", status);
                return null;
            }
        } catch (Exception e) {
            log.error("❌ Lỗi khi giao tiếp với dịch vụ FlareSolverr: {}", e.getMessage());
            return null;
        }
    }
}
