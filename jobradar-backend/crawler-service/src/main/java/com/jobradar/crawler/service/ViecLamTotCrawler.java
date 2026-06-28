package com.jobradar.crawler.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.jobradar.crawler.client.JobClient;
import com.jobradar.crawler.dto.JobRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ViecLamTotCrawler implements JobCrawler {

    private final JobClient jobClient;
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void crawl() {
        log.info("🚀 Bắt đầu cào dữ liệu từ Việc Làm Tốt (Chợ Tốt)...");
        // Gọi API gateway của Chợ Tốt trực tiếp như ChoTotCrawler cũ (cg=13000 là danh mục việc làm chung)
        String url = "https://gateway.chotot.com/v1/public/ad-listing?cg=13000&limit=50";
        
        try {
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            if (response != null && response.has("ads")) {
                JsonNode ads = response.get("ads");
                int successCount = 0;
                
                for (JsonNode ad : ads) {
                    try {
                        String title = ad.path("subject").asText();
                        String companyName = ad.path("company_name").asText();
                        if (companyName == null || companyName.trim().isEmpty() || "null".equals(companyName)) {
                            companyName = ad.path("account_name").asText("Nhà tuyển dụng Chợ Tốt");
                        }
                        
                        // Chuẩn hóa địa chỉ: area_name (Quận/Huyện) + region_name (Tỉnh/Thành phố)
                        String area = ad.path("area_name").asText("");
                        String region = ad.path("region_name").asText("");
                        String location = (area.isEmpty() ? "" : area + ", ") + (region.isEmpty() ? "Việt Nam" : region);
                        
                        String salary = ad.path("price_string").asText("Thỏa thuận");
                        String description = ad.path("body").asText("");
                        
                        // Tự động dựng link tin đăng dựa trên list_id nếu API không trả về share_url
                        String jobUrl = ad.path("share_url").asText("");
                        if (jobUrl.trim().isEmpty() || "null".equals(jobUrl)) {
                            long listId = ad.path("list_id").asLong(0);
                            if (listId > 0) {
                                jobUrl = "https://www.vieclamtot.com/viec-lam/" + listId + ".htm";
                            }
                        }
                        
                        String companyLogo = ad.path("company_logo").asText(null);
                        if ("null".equals(companyLogo)) {
                            companyLogo = null;
                        }

                        // Phân tích loại hình công việc (Full-time / Part-time / Internship)
                        String jobType = "Full-time";
                        String textForAnalysis = (title + " " + description).toLowerCase();
                        if (textForAnalysis.contains("bán thời gian") || textForAnalysis.contains("parttime") 
                                || textForAnalysis.contains("part-time") || textForAnalysis.contains("cộng tác viên") 
                                || textForAnalysis.contains("ctv")) {
                            jobType = "Part-time";
                        } else if (textForAnalysis.contains("thực tập") || textForAnalysis.contains("intern")) {
                            jobType = "Internship";
                        }

                        // Phân tích kỹ năng đa ngành tự động từ tiêu đề và mô tả
                        String skills = extractSkills(title, description);
                        
                        JobRequest jobRequest = JobRequest.builder()
                                .title(title)
                                .companyName(companyName)
                                .companyLogo(companyLogo)
                                .location(location)
                                .salary(salary)
                                .jobType(jobType)
                                .description(description)
                                .requirements("Ứng viên vui lòng xem mô tả chi tiết tại link gốc Chợ Tốt.")
                                .skills(skills)
                                .jobUrl(jobUrl)
                                .provider("CHOTOT") // Đặt provider là CHOTOT tương tự như crawler cũ để đồng bộ hệ thống
                                .build();
                        
                        jobClient.createJob(jobRequest);
                        successCount++;
                        
                    } catch (Exception e) {
                        log.error("Lỗi khi xử lý một tin đăng của Việc Làm Tốt: {}", e.getMessage());
                    }
                }
                log.info("✅ Hoàn thành cào Việc Làm Tốt. Đã gửi thành công {}/{} công việc sang Job Service.", successCount, ads.size());
            }
        } catch (Exception e) {
            log.error("Lỗi kết nối hoặc parse dữ liệu từ Việc Làm Tốt API: {}", e.getMessage());
        }
    }

    @Override
    public String getProviderName() {
        return "VIECLAMTOT"; // Trả về VIECLAMTOT để khớp với request của client
    }

    /**
     * Tự động phân tích và trích xuất các từ khóa kỹ năng của ĐA NGÀNH NGHỀ từ tiêu đề và mô tả công việc.
     */
    private String extractSkills(String title, String description) {
        String text = (title + " " + description).toLowerCase();
        List<String> skills = new ArrayList<>();

        // 1. Kế toán / Tài chính / Hành chính văn phòng
        if (text.contains("excel") || text.contains("word") || text.contains("văn phòng") || text.contains("tin học")) {
            skills.add("Tin học văn phòng");
        }
        if (text.contains("kế toán") || text.contains("misa") || text.contains("thuế") || text.contains("hóa đơn") || text.contains("chứng từ")) {
            skills.add("Kế toán / Thuế");
        }
        if (text.contains("hành chính") || text.contains("nhân sự") || text.contains("tuyển dụng") || text.contains("lễ tân")) {
            skills.add("Hành chính / Nhân sự");
        }

        // 2. Bán hàng / CSKH / Sales
        if (text.contains("bán hàng") || text.contains("sales") || text.contains("tư vấn") || text.contains("cskh") || text.contains("chăm sóc khách hàng") || text.contains("telesale")) {
            skills.add("Bán hàng & CSKH");
        }
        if (text.contains("giao tiếp") || text.contains("thuyết phục") || text.contains("đàm phán")) {
            skills.add("Kỹ năng giao tiếp");
        }

        // 3. Marketing / Quảng cáo
        if (text.contains("marketing") || text.contains("quảng cáo") || text.contains(" chạy ads ") || text.contains("facebook ads") || text.contains("google ads")) {
            skills.add("Digital Marketing");
        }
        if (text.contains("seo") || text.contains("content") || text.contains("sáng tạo nội dung") || text.contains("viết bài")) {
            skills.add("Content & SEO");
        }

        // 4. Thiết kế / Design / Mỹ thuật
        if (text.contains("photoshop") || text.contains("illustrator") || text.contains("thiết kế đồ họa") || text.contains("figma") || text.contains("canva") || text.contains("premiere")) {
            skills.add("Thiết kế đồ họa / Video");
        }
        if (text.contains("autocad") || text.contains("solidworks") || text.contains("bản vẽ") || text.contains("3d")) {
            skills.add("Thiết kế kỹ thuật CAD/3D");
        }

        // 5. Lái xe / Vận tải / Shipper
        if (text.contains("lái xe") || text.contains("tài xế") || text.contains("bằng b2") || text.contains("bằng c") || text.contains("phụ xe")) {
            skills.add("Lái xe / Vận tải");
        }
        if (text.contains("giao hàng") || text.contains("shipper") || text.contains("vận chuyển") || text.contains("giao nhận")) {
            skills.add("Giao nhận hàng hóa");
        }

        // 6. Kỹ thuật / Cơ khí / Điện / Sửa chữa
        if (text.contains("cơ khí") || text.contains("hàn") || text.contains("tiện") || text.contains("lắp ráp") || text.contains("chế tạo")) {
            skills.add("Kỹ thuật cơ khí");
        }
        if (text.contains("điện ") || text.contains("điện lạnh") || text.contains("điện tử") || text.contains("sửa chữa") || text.contains("bảo trì")) {
            skills.add("Kỹ thuật điện/điện tử");
        }

        // 7. Ngoại ngữ
        if (text.contains("tiếng anh") || text.contains("english") || text.contains("toeic") || text.contains("ielts")) {
            skills.add("Tiếng Anh");
        }
        if (text.contains("tiếng trung") || text.contains("tiếng hoa") || text.contains("hsk")) {
            skills.add("Tiếng Trung");
        }
        if (text.contains("tiếng nhật") || text.contains("n3") || text.contains("n2")) {
            skills.add("Tiếng Nhật");
        }

        // 8. CNTT / Lập trình (IT)
        if (text.contains("java") || text.contains("python") || text.contains("react") || text.contains("javascript") || text.contains("php") || text.contains("c#") || text.contains(".net") || text.contains("tester") || text.contains("developer")) {
            skills.add("Công nghệ thông tin");
        }

        if (skills.isEmpty()) {
            return "Kỹ năng phổ thông / Phổ thông";
        }
        return String.join(", ", skills);
    }
}
