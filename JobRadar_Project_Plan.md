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

3.  **Protected Routes & Multi-page Auth Guard (ReactJS):** Xây dựng component `ProtectedRoute` dùng chung (Reusable Route Guard) để bao bọc bảo vệ tất cả các trang nội bộ (như Dashboard, CV Builder, Kanban Board, Employer Portal...), tự động chặn truy cập và chuyển hướng về `/login` nếu không tìm thấy Access Token trong `localStorage`.


---

## 7. Kế Hoạch Triển Khai: Email Service & Xác Thực
*Ghi chú: Giải pháp sử dụng Google Apps Script làm Webhook để gửi email, tích hợp qua OpenFeign.*

### 7.1. Setup Infrastructure (Hạ tầng Email)
1.  **Google Apps Script:** Tạo script mới tại `script.google.com` và Deploy as Web App để lấy Webhook URL.
2.  **Tích hợp OpenFeign:** Tạo `GoogleEmailClient.java` (trong `auth-service`) để gọi HTTP POST đến Webhook URL thay cho RestTemplate.
3.  **Tạo DTO:** `EmailRequest.java` (gồm các trường: to, subject, body, isHtml).
4.  **Cấu hình:** Thêm biến môi trường `webhook.email.url` vào `application.properties`.

### 7.2. Email Verification & Security (Flow Xác Thực)
1.  **Cập nhật User Entity:** Thêm trường `emailVerified` (Boolean).
2.  **Tạo Token Entities:** Tạo `EmailVerificationToken` và `PasswordResetToken` (chứa các thông tin: token, user_id, expiryDate).
3.  **Bổ sung API Endpoints:**
    *   `POST /api/v1/auth/forgot-password`: Nhập email, tạo reset token và gửi link qua email.
    *   `POST /api/v1/auth/reset-password`: Xác nhận token và đổi mật khẩu mới.
    *   `GET /api/v1/auth/verify-email?token=xxx`: Click từ email để cập nhật `emailVerified = true`.
4.  **Cập nhật Logic Core:**
    *   **Register:** Đăng ký thành công -> Tạo token -> Gửi email xác thực.
    *   **Login:** Phải kiểm tra `emailVerified == true` trước khi cho phép đăng nhập và cấp JWT.

### 7.3. Cảnh Báo Việc Làm - Job Alert (Thuộc Phase 3 / Job Service)
*Lưu ý Kiến trúc: Theo chuẩn Microservices, phần này sẽ được tách ra khỏi Auth Service và đặt ở Job Service hoặc Notification Service.*
1.  **Entity Mới:** `JobAlertSubscription` (chứa user_id, keywords, location).
2.  **API CRUD:** Cho phép người dùng đăng ký, sửa, xóa từ khóa nhận thông báo.
3.  **RabbitMQ & Crawler Integration:** 
    *   Khi Crawler gom được việc làm mới -> Đẩy thông báo (Event) vào RabbitMQ.
    *   Worker đọc Event -> Kiểm tra (Match) với các `JobAlertSubscription` -> Gửi Email hàng loạt bằng Webhook.

---

## 8. Tầm Nhìn Kiến Trúc V2 & Cân Nhắc Kỹ Thuật (Architecture Gaps)
*Ghi chú: Đây là bản thiết kế lý tưởng (Best Practices) để tối ưu hóa hệ thống. Chúng ta sẽ làm bản MVP (Phase 1) cho chạy được trước, sau đó refactor dần theo hướng này để có tư duy System Design tốt nhất cho phỏng vấn.*

### 8.1. Phân định Ranh giới Service (Service Boundary: Auth vs User)
*   **Vấn đề:** Hiện tại `Auth Service` đang gánh cả `User` và `CandidateProfile`. Khi mở rộng có thêm `CompanyProfile`, `AdminProfile` thì service này sẽ phình to.
*   **Giải pháp (V2):** Tách thành 2 service độc lập:
    *   `Auth Service`: Chỉ lo Đăng nhập, Đăng ký, Cấp phát Token, OAuth2.  
    *   `User Service`: Quản lý toàn bộ Profile thông tin chi tiết (Ứng viên, Công ty, Admin).

### 8.2. Kế hoạch tách Notification Service (Email System)
*   **Tình trạng hiện tại (Phase 1):** Tích hợp cứng logic gửi Email vào trong `auth-service` để phục vụ nhanh luồng đăng ký. Dùng Google Apps Script làm Webhook.
*   **Dấu hiệu CẦN TÁCH (Khi nào nên làm?):**
    1. Khi bắt đầu phát triển tính năng **Job Alert (Cảnh báo việc làm)** ở `job-service`. Chức năng này đòi hỏi gửi mail hàng loạt, nếu gọi chéo sang `auth-service` sẽ làm sập server đăng nhập.
    2. Khi hệ thống bị "nghẽn cổ chai" (Bottleneck): Nút đăng ký xoay vòng quá 3 giây do chờ HTTP request từ Google phản hồi.
*   **Lộ trình thực hiện tách Service (Phase 2):**
    *   **Bước 1:** Khởi tạo Spring Boot module `notification-service`.
    *   **Bước 2:** Setup RabbitMQ bằng Docker. Khai báo Exchange và Queue (ví dụ: `email_verification_queue`, `job_alert_queue`).
    *   **Bước 3:** Ở `auth-service`, gỡ bỏ hoàn toàn OpenFeign gọi Google. Thay vào đó, sau khi đăng ký thành công, bắn một Event (dạng JSON) vào `email_verification_queue`.
    *   **Bước 4:** Ở `notification-service`, viết một @RabbitListener để hứng Event, xử lý logic lấy data và gọi API gửi Email.
    *   **Bước 5 (Nâng cấp Pro):** Thay Google Webhook bằng **SendGrid / AWS SES** cho Prod và dùng **MailHog** cho môi trường Local.
    *   **Bước 6 (Priority Queue & Template Engine):** Thiết lập 2 Queue riêng biệt: `email.priority` (cho xác thực/reset pass, cần gửi ngay) và `email.bulk` (cho job alert, gửi từ từ). Tích hợp **Thymeleaf/FreeMarker** vào `notification-service` để render giao diện email. `auth-service` lúc này chỉ cần gửi data thô: `template="verify-email", params={token, url}` thay vì gửi cả cục HTML.
    *   **Bước 7 (Observability & Reliability):** Tích hợp Prometheus/Grafana để đo lường Metrics (`email.sent`, `email.failed`, `queue.lag`). Xây dựng cơ chế **DLQ (Dead Letter Queue) + Retry Policy** với Exponential Backoff (thử lại sau 1m, 5m, 15m, 1h). Mở Endpoint Health Check (`/actuator/health`) cho Docker/Kubernetes.

### 8.3. Tối ưu Thuật toán Job Alert
*   **Vấn đề:** Khi Crawler bắt được 1 Job mới, nếu Worker đi quét toàn bộ `JobAlertSubscription` để match từ khóa thì độ phức tạp là `O(N*M)`, cực kỳ chậm và tốn tài nguyên server.
*   **Giải pháp (V2):** Xây dựng **Inverted Index** (lập chỉ mục ngược: keyword -> list user_ids) hoặc đồng bộ dữ liệu sang **Elasticsearch** để truy vấn siêu tốc.

### 8.4. Giao tiếp giữa các Service (Inter-Service Communication)
*   **Vấn đề:** Mới chỉ là ý tưởng gọi nội bộ cơ bản. Chưa có cơ chế quản lý lỗi khi 1 service lăn đùng ra chết.
*   **Giải pháp (V2):**
    *   Sử dụng **Service Discovery (Eureka/Consul)** để tự động nhận diện địa chỉ IP các service.
    *   Sử dụng **Circuit Breaker (Resilience4j)** để ngắt kết nối tránh sập dây chuyền (Cascading Failure).
    *   Gateway validate JWT cần cơ chế đồng bộ key (Shared Secret hoặc JWKS endpoint) từ Auth Service.

### 8.5. Tính nhất quán Dữ liệu Phân tán (Data Consistency)
*   **Vấn đề:** Khi Company tạo một Job (ở Job Service), cần xác thực Company đó có tồn tại hay không (thuộc Auth/User Service). Nếu 1 giao dịch bị lỗi giữa chừng ở 1 service thì sao?
*   **Giải pháp (V2):** Áp dụng **Saga Pattern** hoặc Eventual Consistency thông qua RabbitMQ để đảm bảo giao dịch phân tán thành công trọn vẹn hoặc tự động rollback lại các hành động (Compensating Transaction).

### 8.6. Kiến Trúc Microservices Đề Xuất (V2)
```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Gateway   │────▶│ Auth Service │     │ User Service │
│ (Port 8080) │     │ (Port 8081) │     │ (Port 8082) │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Job Service │◀───▶│ Crawler Svc │     │Notification │
│ (Port 8083) │     │ (Port 8084) │     │  Service    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
  PostgreSQL          Redis/RabbitMQ        Email/WS
   (Jobs)              (Queue/Cache)         (Webhook)
```
