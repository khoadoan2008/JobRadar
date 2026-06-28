package com.jobradar.crawler.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobradar.crawler.client.JobClient;
import com.jobradar.crawler.dto.JobRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class VietnamWorksCrawler implements JobCrawler {

    private final JobClient jobClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void crawl() {
        log.info("🚀 Bắt đầu cào dữ liệu từ VietnamWorks...");
        String url = "https://www.vietnamworks.com/tim-viec-lam/tat-ca-viec-lam";
        
        try {
            // Tải HTML với cấu hình User-Agent giả lập trình duyệt thực tế
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .referrer("https://www.google.com")
                    .timeout(15000)
                    .get();

            // Tìm script __NEXT_DATA__
            Element nextDataScript = doc.select("script#__NEXT_DATA__").first();
            if (nextDataScript == null) {
                log.error("❌ Không tìm thấy thẻ script#__NEXT_DATA__ trên trang VietnamWorks!");
                return;
            }

            // Parse JSON từ script tag
            String jsonText = nextDataScript.data();
            JsonNode rootNode = objectMapper.readTree(jsonText);
            
            // Lấy jobsData từ: props -> pageProps -> jobsData
            JsonNode jobsData = rootNode.path("props").path("pageProps").path("jobsData");
            if (jobsData.isMissingNode() || !jobsData.isContainerNode()) {
                log.error("❌ Không tìm thấy trường jobsData hoặc cấu trúc JSON của VietnamWorks đã thay đổi!");
                return;
            }

            // Danh sách các danh mục tin đăng cần quét
            String[] categories = {"urgentJobs", "featuredJobs", "partTimeJobs", "highSalaryJobs", "headhunterJobs", "bestJobs"};
            Set<String> processedUrls = new HashSet<>();
            int successCount = 0;
            int totalParsed = 0;

            for (String category : categories) {
                JsonNode jobsList = jobsData.path(category);
                if (jobsList.isArray() && jobsList.size() > 0) {
                    log.info("🔍 Đang xử lý nhóm công việc '{}' của VietnamWorks (Số lượng: {})...", category, jobsList.size());
                    
                    for (JsonNode jobNode : jobsList) {
                        totalParsed++;
                        try {
                            String title = jobNode.path("title").asText("");
                            String jobUrl = jobNode.path("url").asText("");

                            // Kiểm tra các trường dữ liệu bắt buộc
                            if (title.isEmpty() || jobUrl.isEmpty() || "null".equals(jobUrl)) {
                                continue;
                            }

                            // Chuẩn hóa jobUrl (VietnamWorks thường trả về link relative hoặc absolute)
                            if (!jobUrl.startsWith("http")) {
                                jobUrl = "https://www.vietnamworks.com" + (jobUrl.startsWith("/") ? "" : "/") + jobUrl;
                            }

                            // Tránh cào trùng lặp
                            if (processedUrls.contains(jobUrl)) {
                                continue;
                            }
                            processedUrls.add(jobUrl);

                            String companyName = jobNode.path("company").asText("Công ty ẩn danh");
                            String companyLogo = jobNode.path("logo").asText(null);
                            if ("null".equals(companyLogo)) {
                                companyLogo = null;
                            }

                            // Xử lý thông tin địa điểm làm việc
                            String location = jobNode.path("address").asText("");
                            if (location.isEmpty() || "null".equals(location)) {
                                JsonNode locationsList = jobNode.path("workingLocations");
                                if (locationsList.isArray() && locationsList.size() > 0) {
                                    location = locationsList.get(0).path("address").asText("Việt Nam");
                                } else {
                                    location = "Việt Nam";
                                }
                            }

                            String salary = jobNode.path("salary").asText("Thỏa thuận");
                            String description = jobNode.path("jobDescription").asText("");
                            String requirements = jobNode.path("jobRequirement").asText("");

                            // Phân loại loại hình công việc (Job Type)
                            String jobType = "Full-time";
                            if ("partTimeJobs".equals(category)) {
                                jobType = "Part-time";
                            } else {
                                String textForAnalysis = (title + " " + description).toLowerCase();
                                if (textForAnalysis.contains("bán thời gian") || textForAnalysis.contains("parttime") 
                                        || textForAnalysis.contains("part-time") || textForAnalysis.contains("cộng tác viên") 
                                        || textForAnalysis.contains("ctv")) {
                                    jobType = "Part-time";
                                } else if (textForAnalysis.contains("thực tập") || textForAnalysis.contains("intern")) {
                                    jobType = "Internship";
                                }
                            }

                            // Trích xuất kỹ năng đa ngành dựa vào tiêu đề và mô tả
                            String skills = extractSkills(title, description + " " + requirements);

                            JobRequest jobRequest = JobRequest.builder()
                                    .title(title)
                                    .companyName(companyName)
                                    .companyLogo(companyLogo)
                                    .location(location)
                                    .salary(salary)
                                    .jobType(jobType)
                                    .description(description)
                                    .requirements(requirements.isEmpty() ? "Ứng viên vui lòng xem mô tả chi tiết tại link gốc VietnamWorks." : requirements)
                                    .skills(skills)
                                    .jobUrl(jobUrl)
                                    .provider("VIETNAMWORKS") // Đặt nhà cung cấp là VIETNAMWORKS
                                    .build();

                            // Gửi dữ liệu qua Feign Client sang Job Service
                            try {
                                jobClient.createJob(jobRequest);
                                successCount++;
                                if (successCount >= 50) {
                                    break;
                                }
                            } catch (Exception fe) {
                                log.error("❌ Lỗi kết nối đến Job Service: {}", fe.getMessage());
                            }

                        } catch (Exception e) {
                            log.error("❌ Lỗi khi xử lý một tin đăng của VietnamWorks: {}", e.getMessage());
                        }
                        if (successCount >= 50) {
                            break;
                        }
                    }
                    if (successCount >= 50) {
                        break;
                    }
                }
            }

            log.info("✅ Hoàn thành cào VietnamWorks. Đã gửi thành công {}/{} công việc sang Job Service.", successCount, totalParsed);

        } catch (Exception e) {
            log.error("❌ Lỗi kết nối hoặc parse dữ liệu từ VietnamWorks: {}", e.getMessage());
        }
    }

    @Override
    public String getProviderName() {
        return "VIETNAMWORKS";
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
