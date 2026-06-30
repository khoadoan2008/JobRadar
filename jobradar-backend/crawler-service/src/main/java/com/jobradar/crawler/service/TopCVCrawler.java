package com.jobradar.crawler.service;

import com.jobradar.crawler.client.JobClient;
import com.jobradar.crawler.dto.JobRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class TopCVCrawler implements JobCrawler {

    private final JobClient jobClient;
    private final FlareSolverrService flareSolverrService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void crawl() {
        log.info("🚀 Bắt đầu cào dữ liệu từ TopCV (Mục tiêu: ít nhất 50 tin mới)...");
        Set<String> processedUrls = new HashSet<>();
        int successCount = 0;
        int page = 1;
        int maxPages = 10; // Giới hạn tối đa cào 10 trang để lấy đủ 50 tin mới nhất

        while (successCount < 50 && page <= maxPages) {
            String url = "https://www.topcv.vn/tim-viec-lam-moi-nhat?page=" + page;
            log.info("🔍 Đang cào TopCV trang {} từ URL: {}", page, url);
            
            try {
                // Sử dụng FlareSolverrService để vượt Cloudflare lấy mã HTML sạch đã render
                String htmlContent = flareSolverrService.fetchHtml(url);
                if (htmlContent == null || htmlContent.trim().isEmpty()) {
                    log.error("❌ Không lấy được HTML từ TopCV trang {}!", page);
                    break;
                }

                Document doc = Jsoup.parse(htmlContent);

                // TÌM KIẾM THÔNG MINH (SMART PARSER):
                // 1. Quét tất cả thẻ <a> trỏ tới link việc làm chi tiết
                Elements allLinks = doc.select("a[href*=/viec-lam/]");
                List<Element> jobTitleLinks = new ArrayList<>();
                for (Element link : allLinks) {
                    String href = link.attr("href").trim();
                    // Loại trừ link tìm kiếm hoặc link danh mục
                    if (href.contains("/tim-viec-lam") || href.contains("-c") || href.endsWith("/viec-lam") || href.endsWith("/viec-lam/")) {
                        continue;
                    }
                    // Link job thực tế của TopCV thường dài và có cấu trúc ID cụ thể
                    if (href.contains(".html") || href.contains("-jv") || href.split("/").length >= 5) {
                        jobTitleLinks.add(link);
                    }
                }

                if (jobTitleLinks.isEmpty()) {
                    log.warn("⚠️ Không tìm thấy link tuyển dụng nào trên TopCV trang {} bằng Smart Parser! Thử quét qua selector thông thường...", page);
                    // Dự phòng quét qua thẻ a chứa class title
                    Elements backupElements = doc.select(".title a, .job-title a, a.title-link, h3.title a");
                    for (Element el : backupElements) {
                        if (el.attr("href").contains("/viec-lam/")) {
                            jobTitleLinks.add(el);
                        }
                    }
                }

                if (jobTitleLinks.isEmpty()) {
                    log.info("ℹ️ Không còn tin tuyển dụng nào được tìm thấy trên trang {}, kết thúc tiến trình.", page);
                    break;
                }

                log.info("🔍 Tìm thấy {} tin tuyển dụng tiềm năng trên trang {}.", jobTitleLinks.size(), page);
                int pageSuccessCount = 0;

                for (Element titleLink : jobTitleLinks) {
                    if (successCount >= 50) {
                        break;
                    }
                    try {
                        // Trích xuất Tiêu đề và Link công việc
                        String title = cleanText(titleLink.text());
                        String jobUrl = titleLink.attr("href").trim();

                        if (title.isEmpty() || jobUrl.isEmpty() || "null".equalsIgnoreCase(jobUrl)) {
                            continue;
                        }

                        // Chuẩn hóa đường dẫn URL
                        if (!jobUrl.startsWith("http")) {
                            jobUrl = "https://www.topcv.vn" + (jobUrl.startsWith("/") ? "" : "/") + jobUrl;
                        }
                        jobUrl = jobUrl.replace(" ", "%20");

                        // Tránh cào trùng lặp
                        if (processedUrls.contains(jobUrl)) {
                            continue;
                        }
                        processedUrls.add(jobUrl);

                        // 2. Tìm khối card bao ngoài của job này bằng cách đi ngược lên parent
                        Element card = null;
                        Element temp = titleLink;
                        for (int i = 0; i < 10; i++) {
                            if (temp == null) break;
                            String className = temp.className().toLowerCase();
                            if (className.contains("job") || className.contains("item") || className.contains("box") 
                                    || className.contains("card") || className.contains("wrapper")) {
                                card = temp;
                                if (temp.parent() != null && (temp.parent().tagName().equals("body") 
                                        || temp.parent().tagName().equals("html") || temp.parent().id().equals("app") 
                                        || temp.parent().className().contains("container"))) {
                                    break;
                                }
                            }
                            temp = temp.parent();
                        }
                        if (card == null) {
                            card = titleLink.parent();
                        }

                        // 3. Trích xuất tên Công ty từ card
                        Element companyEl = card.selectFirst("a[href*=/cong-ty/], .company a, .company-name, a.company, .company-name a");
                        String companyName = companyEl != null ? cleanText(companyEl.text()) : "Công ty ẩn danh";
                        if (companyName.isEmpty() || "null".equalsIgnoreCase(companyName)) {
                            companyName = "Công ty ẩn danh";
                        }

                        // 4. Trích xuất Logo công ty từ card
                        Element logoEl = card.selectFirst("img[src*=logo], img[src*=avatar], .avatar img, .company-logo img, .logo img, img");
                        String companyLogo = null;
                        if (logoEl != null) {
                            companyLogo = logoEl.hasAttr("data-src") ? logoEl.attr("data-src").trim() : logoEl.attr("src").trim();
                        }
                        if (companyLogo != null && (companyLogo.isEmpty() || "null".equalsIgnoreCase(companyLogo) || companyLogo.contains("data:image"))) {
                            companyLogo = null;
                        }

                        // 5. Trích xuất địa điểm làm việc từ card
                        String location = "Việt Nam";
                        Element locationEl = card.selectFirst(".address, .info-meta .address, .location, [class*=address], [class*=location]");
                        if (locationEl != null) {
                            location = cleanText(locationEl.text());
                        } else {
                            for (Element el : card.getAllElements()) {
                                String ownText = el.ownText();
                                if (ownText.contains("Hà Nội") || ownText.contains("Hồ Chí Minh") || ownText.contains("TP.HCM") 
                                        || ownText.contains("Đà Nẵng") || ownText.contains("Bình Dương") || ownText.contains("Đồng Nai")) {
                                    location = ownText.trim();
                                    break;
                                }
                            }
                        }

                        // 6. Trích xuất Lương từ card
                        String salary = "Thỏa thuận";
                        Element salaryEl = card.selectFirst(".title-salary, .salary, .info-meta .salary, [class*=salary], .salary-value");
                        if (salaryEl != null) {
                            salary = cleanText(salaryEl.text());
                        } else {
                            for (Element el : card.getAllElements()) {
                                String ownText = el.ownText().toLowerCase();
                                if (ownText.contains("triệu") || ownText.contains("usd") || ownText.contains("thỏa thuận") 
                                        || ownText.contains("đến") || ownText.contains("tới")) {
                                    salary = el.text().trim();
                                    break;
                                }
                            }
                        }

                        // 6. Định nghĩa loại hình công việc
                        String jobType = "Full-time";
                        String textForAnalysis = (title + " " + companyName).toLowerCase();
                        if (textForAnalysis.contains("bán thời gian") || textForAnalysis.contains("parttime") 
                                || textForAnalysis.contains("part-time") || textForAnalysis.contains("cộng tác viên") 
                                || textForAnalysis.contains("ctv")) {
                            jobType = "Part-time";
                        } else if (textForAnalysis.contains("thực tập") || textForAnalysis.contains("intern")) {
                            jobType = "Internship";
                        }

                        // 7. Trích xuất kỹ năng
                        String skills = extractSkills(title, companyName);

                        // Tạo đối tượng gửi sang Job Service
                        JobRequest jobRequest = JobRequest.builder()
                                .title(title)
                                .companyName(companyName)
                                .companyLogo(companyLogo)
                                .location(location)
                                .salary(salary)
                                .jobType(jobType)
                                .description("Chi tiết tin tuyển dụng vui lòng xem tại link gốc TopCV.")
                                .requirements("Ứng viên vui lòng xem mô tả chi tiết tại link gốc TopCV.")
                                .skills(skills)
                                .jobUrl(jobUrl)
                                .provider("TOPCV")
                                .build();

                        // Gửi thông tin sang Job Service
                        try {
                            restTemplate.postForObject("http://localhost:8083/api/v1/jobs", jobRequest, JobRequest.class);
                            successCount++;
                            pageSuccessCount++;
                        } catch (org.springframework.web.client.HttpStatusCodeException hse) {
                            if (hse.getStatusCode().value() == 409) {
                                log.info("ℹ️ Tin tuyển dụng đã tồn tại (Trùng lặp), bỏ qua: {}", jobUrl);
                            } else {
                                log.error("❌ Lỗi HTTP từ Job Service tại trang {}: {} - {}", page, hse.getStatusCode(), hse.getResponseBodyAsString());
                            }
                        } catch (Exception fe) {
                            log.error("❌ Lỗi khi gửi RestTemplate cho TopCV trên trang {}: {}", page, fe.getMessage());
                        }
                    } catch (Exception e) {
                        log.error("❌ Lỗi khi xử lý một tin đăng của TopCV trên trang {}: {}", page, e.getMessage());
                    }
                }

                log.info("📝 Trang {}: Cào thành công và gửi {}/{} công việc.", page, pageSuccessCount, jobTitleLinks.size());
                
                // Nghỉ 1.5 giây giữa các trang để chống chặn (Responsible Scraping)
                if (successCount < 50 && page < maxPages) {
                    try {
                        Thread.sleep(1500);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                }
                
                page++;
            } catch (Exception e) {
                log.error("❌ Lỗi kết nối hoặc parse dữ liệu từ TopCV tại trang {}: {}. Sẽ thử cào trang tiếp theo...", page, e.getMessage());
                page++;
            }
        }

        log.info("✅ Hoàn thành tiến trình cào TopCV. Tổng cộng đã gửi thành công {} công việc sang Job Service.", successCount);
    }

    @Override
    public String getProviderName() {
        return "TOPCV";
    }

    /**
     * Làm sạch ký tự điều khiển để tránh lỗi JSON.
     */
    private String cleanText(String text) {
        if (text == null) return "";
        return text.replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F]", "").trim();
    }

    /**
     * Phân tích kỹ năng tự động dựa trên tiêu đề.
     */
    private String extractSkills(String title, String description) {
        String text = (title + " " + description).toLowerCase();
        List<String> skills = new ArrayList<>();

        // Kế toán / Văn phòng
        if (text.contains("excel") || text.contains("word") || text.contains("văn phòng") || text.contains("tin học")) {
            skills.add("Tin học văn phòng");
        }
        if (text.contains("kế toán") || text.contains("misa") || text.contains("thuế") || text.contains("chứng từ")) {
            skills.add("Kế toán / Thuế");
        }
        if (text.contains("hành chính") || text.contains("nhân sự") || text.contains("tuyển dụng")) {
            skills.add("Hành chính / Nhân sự");
        }

        // Sales / CSKH
        if (text.contains("bán hàng") || text.contains("sales") || text.contains("tư vấn") || text.contains("cskh") || text.contains("chăm sóc khách hàng") || text.contains("telesale")) {
            skills.add("Bán hàng & CSKH");
        }
        if (text.contains("giao tiếp") || text.contains("đàm phán")) {
            skills.add("Kỹ năng giao tiếp");
        }

        // Marketing
        if (text.contains("marketing") || text.contains("quảng cáo") || text.contains("facebook ads") || text.contains("google ads")) {
            skills.add("Digital Marketing");
        }
        if (text.contains("seo") || text.contains("content") || text.contains("viết bài")) {
            skills.add("Content & SEO");
        }

        // Thiết kế
        if (text.contains("photoshop") || text.contains("illustrator") || text.contains("thiết kế đồ họa") || text.contains("figma") || text.contains("canva")) {
            skills.add("Thiết kế đồ họa / Video");
        }

        // IT
        if (text.contains("java") || text.contains("python") || text.contains("react") || text.contains("javascript") || text.contains("php") || text.contains("c#") || text.contains(".net") || text.contains("tester") || text.contains("developer") || text.contains("node")) {
            skills.add("Công nghệ thông tin");
        }

        if (skills.isEmpty()) {
            return "Kỹ năng phổ thông / Phổ thông";
        }
        return String.join(", ", skills);
    }
}
