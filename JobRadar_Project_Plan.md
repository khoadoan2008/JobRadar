# 🚀 Kế Hoạch Dự Án: JobRadar - Hệ Sinh Thái Tuyển Dụng & Cảnh Báo Việc Làm IT

## 1. Tổng Quan Dự Án (Project Overview)
- **Tên dự án (dự kiến):** JobRadar

- **Mô tả:** Hệ thống tự động thu thập (crawl) tin tuyển dụng IT từ nhiều nguồn khác nhau, tập trung về một nền tảng. Hỗ trợ ứng viên tạo profile, tìm kiếm việc làm, và nhận cảnh báo (job alert) tự động qua Email khi có công việc phù hợp.

- **Mục tiêu:** Xây dựng một dự án thực tế (production-ready) với kiến trúc Microservices để đưa vào CV ứng tuyển vị trí Java Backend Developer (Junior).

---

## 2. Tech Stack (Công nghệ sử dụng)
*   **Frontend:** ReactJS (Vite)

*   **Backend:** Java Spring Boot, Spring Cloud Gateway

*   **Database:** PostgreSQL (Dữ liệu chính), Redis (Caching, Session & chống rate limit)

*   **Message Broker:** RabbitMQ (Xử lý hàng đợi gửi Email bất đồng bộ)

*   **Web Scraping:** JSoup, FlareSolverr (Dịch vụ vượt tường lửa chống Bot)

*   **Real-time:** WebSocket (Spring STOMP)

*   **AI Integration:** LLM API (Gemini/OpenAI) cho tính năng đọc hiểu CV.

*   **DevOps:** Docker (đóng gói ứng dụng, chạy FlareSolverr), GitHub Actions (CI/CD)

---

## 3. Phạm Vi Dự Án (Project Scope) - Giai Đoạn 1 (MVP)

### Phân hệ 1: Candidate Portal (Dành cho Ứng viên)
*   **Authentication & SSO Login:** Đăng ký/Đăng nhập bằng Email và Đăng nhập một chạm (Google/GitHub qua OAuth2).

*   **Online Profile & CV Builder:** Nhập thông tin tạo CV Web hoặc xuất file PDF.

*   **Smart Job Recommendation:** Gợi ý việc làm tự động dựa trên mức độ phù hợp của kỹ năng.

*   **Application Tracker:** Giao diện Kanban board theo dõi trạng thái ứng tuyển.

*   **Advanced Job Alert:** Đăng ký nhận thông báo việc làm tự động qua Email.

### Phân hệ 2: Company Review (Mô hình Glassdoor)
*   **Anonymous Review:** Đánh giá môi trường, lương, OT ẩn danh.

*   **Rating System:** Chấm điểm tổng quan theo tiêu chí (1-5 sao).

*   **Salary Insights:** Thống kê mức lương trung bình theo vị trí.

### Phân hệ 3: Employer Portal (Dành cho Nhà Tuyển Dụng)
*   **Company Dashboard:** Đăng ký và xác thực tài khoản doanh nghiệp.

*   **Direct Job Posting:** Đăng tin tuyển dụng trực tiếp lên hệ thống.

*   **CV Management:** Nhận hồ sơ và thay đổi trạng thái (Duyệt, Phỏng vấn, Từ chối).

### Phân hệ 4: Admin & Data Management (Dành cho Quản trị viên)
*   **Crawler Manager Dashboard:** Quản lý, theo dõi tình trạng các luồng cào dữ liệu.

*   **Skill Dictionary:** Chuẩn hóa hệ thống từ khóa (gộp `ReactJS`, `React.js` thành `React`).

---

## 4. Phân Tích Chuyên Sâu: Chức Năng Auto Crawler
*Đây là "linh hồn" của hệ thống, đòi hỏi giải quyết bài toán phức tạp:*

### 🎯 Chiến Lược Crawl Dữ Liệu Thực Tế:
*   **VietnamWorks (Dễ nhất - Đề xuất làm trước):** Sử dụng Next.js. Dữ liệu được nhúng dưới dạng JSON chuẩn trong thẻ `<script id="__NEXT_DATA__">`. **Giải pháp:** Dùng JSoup lấy mã HTML, tìm thẻ script này, trích xuất text và dùng thư viện `Jackson` để map trực tiếp thành object `JobDTO`. Dữ liệu cực kỳ sạch.

*   **TopCV (Trung bình):** Sử dụng Server-Side Rendering (PHP/Laravel). Dữ liệu nằm trực tiếp trong HTML (class `job-list`). **Giải pháp:** Dùng JSoup tải HTML, dùng CSS Selector bóc tách thông tin. Không bị Cloudflare chặn gắt gao.

*   **ITviec (Khó nhất - Trùm cuối):** Có hệ thống chống Bot rất mạnh là **Cloudflare Turnstile**. **Giải pháp:** Sử dụng công cụ **FlareSolverr** chạy độc lập qua Docker. Spring Boot sẽ gọi qua FlareSolverr. FlareSolverr tự mở Headless Chrome, vượt tường lửa Cloudflare và trả lại mã HTML sạch sẽ cho Spring Boot xử lý tiếp bằng JSoup.

### 🛠️ Kế Hoạch Quản Lý & Bảo Trì (Maintenance):
Quá trình Scraping bản chất là một trò chơi "Mèo vờn chuột", do đó kiến trúc code cần đảm bảo tính linh hoạt cực cao:

1.  **Vấn đề thay đổi giao diện (HTML thay đổi):** 

    *   **Giải pháp:** Áp dụng **Strategy Pattern**. Xây dựng interface chung `JobCrawler` với các class triển khai riêng biệt (`TopCVCrawler`, `VietnamWorksCrawler`). Khi một trang bị lỗi cấu trúc, toàn hệ thống vẫn hoạt động bình thường. 

    *   Không hard-code các biến CSS Selector trong code Java, mà lưu chúng vào Database (bảng `Crawler_Config`) hoặc file cấu hình `application.yml`. Khi web nguồn đổi giao diện, chỉ cần sửa Config thay vì phải sửa code và build lại toàn bộ server.

2.  **Vấn đề Cloudflare nâng cấp thuật toán chặn Bot:**

    *   **Giải pháp:** Việc tách phần vượt tường lửa ra một service ngoài như **FlareSolverr** là chìa khóa. Khi FlareSolverr lỗi thời và bị chặn, ta chỉ cần gõ lệnh cập nhật Docker Image mới nhất của nó: `docker pull flaresolverr/flaresolverr:latest`. Code backend Java giữ nguyên 100%.

---

## 5. Kiến Trúc Microservices Dự Kiến
*   **API Gateway:** Cổng vào duy nhất điều hướng request, validate token.

*   **Auth & User Service:** Quản lý tài khoản, phân quyền, SSO OAuth2.

*   **Job & Search Service:** Lưu trữ dữ liệu công việc (PostgreSQL), cung cấp API tìm kiếm (Redis Cache).

*   **Crawler & Notification Service:** Chạy ngầm cào dữ liệu mới và đẩy Message vào RabbitMQ để gửi Email đi.

---

## 6. Giai Đoạn 2 (Phase 2 - Tính Năng Nâng Cao Mở Rộng)
1.  **AI Resume Parsing:** Tích hợp LLM API tự động bóc tách thông tin từ file PDF CV của ứng viên.

2.  **Real-time Notifications:** Sử dụng WebSocket để bắn thông báo tức thì (chuông báo đỏ) khi trạng thái hồ sơ thay đổi.

---
