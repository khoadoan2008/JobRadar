# 🚀 Kế Hoạch Dự Án: JobRadar - Hệ Sinh Thái Tuyển Dụng & Cảnh Báo Việc Làm Đa Ngành Real-time

## 1. Tổng Quan Dự Án (Project Overview)
- **Tên dự án (dự kiến):** JobRadar

- **Mô tả:** Hệ thống tự động thu thập (crawl) tin tuyển dụng từ nhiều nguồn khác nhau (đa ngành nghề: IT, văn phòng, lao động phổ thông, thực tập), tập trung về một nền tảng duy nhất. Hỗ trợ ứng viên tạo profile, tìm kiếm việc làm tối ưu theo kỹ năng/từ khóa, và nhận cảnh báo (job alert) tự động qua Email khi có công việc phù hợp.

- **Mục tiêu:** Xây dựng một dự án thực tế (production-ready) với kiến trúc Microservices để nâng cao kỹ năng lập trình Java Backend Developer (tiến tới level Junior/Middle) và làm sản phẩm nổi bật trong CV ứng tuyển.

---

## 2. Tech Stack (Công nghệ sử dụng)
*   **Frontend:** ReactJS (Vite, Tailwind CSS, Axios)

*   **Backend:** Java Spring Boot, Spring Cloud Gateway

*   **Database:** PostgreSQL (Dữ liệu chính), Redis (Caching, Session & chống rate limit)

*   **Message Broker:** RabbitMQ (Xử lý hàng đợi gửi Email bất đồng bộ, truyền tải event giữa các service)

*   **Web Scraping & API Integration:** JSoup, FlareSolverr (Dịch vụ vượt tường lửa chống Bot Cloudflare), Jackson ObjectMapper

*   **Real-time:** WebSocket (Spring STOMP)

*   **AI Integration:** LLM API (Gemini/OpenAI) cho tính năng đọc hiểu CV và phân tích độ tương thích công việc.

*   **DevOps:** Docker & Docker Compose (đóng gói ứng dụng, chạy hạ tầng Postgres, Redis, RabbitMQ, FlareSolverr), GitHub Actions (CI/CD)

---

## 3. Phạm Vi Dự Án (Project Scope) - Giai Đoạn 1 (MVP)

### Phân hệ 1: Candidate Portal (Dành cho Ứng viên)
*   **Authentication & SSO Login:** Đăng ký/Đăng nhập bằng Email và Đăng nhập một chạm qua OAuth2:
    *   **Google:** Đảm bảo tính phổ thông vì bất kỳ ứng viên nào cũng có tài khoản Gmail.
    *   **LinkedIn & GitHub:** Phục vụ đối tượng nhân sự văn phòng chất lượng cao và Tech Talents / Developers.

*   **Online Profile & CV Builder:** Nhập thông tin tạo CV Web hoặc xuất file PDF.

*   **Smart Job Recommendation:** Gợi ý việc làm tự động dựa trên mức độ phù hợp của kỹ năng hoặc từ khóa mong muốn (sử dụng hệ thống **Skill Dictionary phân cấp 3 tầng** để gợi ý chính xác theo chuyên môn).

*   **Application Tracker:** Giao diện Kanban board theo dõi trạng thái ứng tuyển (Đã nộp, Phỏng vấn, Nhận offer, Từ chối).

*   **Advanced Job Alert:** Đăng ký nhận thông báo việc làm tự động qua Email theo từ khóa và địa điểm.

### Phân hệ 2: Company Review (Đánh giá doanh nghiệp)
*   **Anonymous Review:** Đánh giá môi trường, lương, OT ẩn danh để giúp người tìm việc né các công ty red flag.

*   **Rating System:** Chấm điểm tổng quan theo các tiêu chí (1-5 sao).

*   **Salary Insights:** Thống kê mức lương trung bình theo vị trí ngành nghề.

### Phân hệ 3: Employer Portal (Dành cho Nhà Tuyển Dụng)
*   **Company Dashboard:** Đăng ký và xác thực tài khoản doanh nghiệp.

*   **Direct Job Posting:** Đăng tin tuyển dụng trực tiếp lên hệ thống JobRadar.

*   **CV Management:** Nhận hồ sơ ứng tuyển từ ứng viên và cập nhật trạng thái hồ sơ (Duyệt, Phỏng vấn, Từ chối).

### Phân hệ 4: Admin & Data Management (Dành cho Quản trị viên)
*   **Crawler Manager Dashboard:** Quản lý, theo dõi tình trạng hoạt động và log của các luồng cào dữ liệu.

*   **Keyword & Skill Dictionary:** Chuẩn hóa hệ thống từ khóa tìm kiếm (ví dụ: gộp `ReactJS`, `React.js` thành `React`; gộp `Sales Executive`, `Nhân viên bán hàng` thành `Nhân viên kinh doanh`) và xây dựng mối quan hệ phân cấp giữa các nhóm kỹ năng phục vụ cho bộ lọc tìm kiếm nâng cao.

---

## 4. Phân Tích Chuyên Sâu: Chiến Lược Auto Crawler Đa Nguồn
*Đây là phần xử lý logic phức tạp nhất của dự án, thu thập tin tuyển dụng đa ngành:*

### 🎯 Chiến Lược Crawl Dữ Liệu Thực Tế:

1.  **Việc Làm Tốt (Dễ nhất - Đa ngành & Lao động phổ thông):**
    *   **Đặc điểm:** Sử dụng Client-Side Rendering (CSR). Dữ liệu được tải động từ một API Gateway công khai.
    *   **Giải pháp:** Gọi trực tiếp HTTP GET đến endpoint API của Việc Làm Tốt (`https://gateway.chotot.com/v1/public/ad-listing?cg=13000`), phân trang qua offset `o`, nhận payload JSON sạch và dùng thư viện `Jackson` map trực tiếp thành thực thể `Job`. Dữ liệu đa ngành này cực kỳ phong phú và không cần bộ lọc từ khóa cụ thể.

2.  **VietnamWorks (Dễ - Đa ngành & Văn phòng):**
    *   **Đặc điểm:** Sử dụng Next.js. Dữ liệu trang được nhúng dưới dạng JSON chuẩn trong thẻ `<script id="__NEXT_DATA__">`.
    *   **Giải pháp:** Dùng JSoup tải mã HTML, tìm thẻ script có ID này, trích xuất text JSON và map thẳng sang `JobDTO` bằng Jackson. Không cần parse DOM phức tạp.

3.  **TopCV & Việc Làm 24h (Trung bình - Đa ngành):**
    *   **Đặc điểm:** Sử dụng Server-Side Rendering (SSR). Dữ liệu nằm trực tiếp trong cấu trúc HTML của trang.
    *   **Giải pháp:** Dùng JSoup kết nối, thiết lập `User-Agent` giả lập trình duyệt và sử dụng CSS Selector để bóc tách thông tin công việc đa ngành.

4.  **CareerViet (Trung bình - Việc làm chất lượng cao đa ngành):**
    *   **Đặc điểm:** HTML quy chuẩn nhưng có cơ chế phát hiện tần suất gọi bot.
    *   **Giải pháp:** Dùng JSoup parse HTML kết hợp cơ chế **Delay** (nghỉ ngơi giữa các request) và xoay tua User-Agent để tránh bị block IP.

5.  **Tích hợp thêm các nguồn đa ngành khác (Ví dụ: ViecLam24h):**
    *   **Đặc điểm:** Các trang tuyển dụng đa ngành lớn thường có các lớp bảo mật trung bình.
    *   **Giải pháp:** Sử dụng kết hợp JSoup và các giải pháp chống chặn bot (như xoay tua IP hoặc FlareSolverr qua Docker nếu trang sử dụng Cloudflare) để cào dữ liệu đa ngành sạch sẽ.

### 🛠️ Kế Hoạch Quản Lý & Bảo Trì (Maintenance):
Quá trình Scraping bản chất là một trò chơi "Mèo vờn chuột", do đó kiến trúc code cần đảm bảo tính linh hoạt cực cao:

1.  **Vấn đề thay đổi giao diện (HTML thay đổi):** 
    *   **Giải pháp:** Áp dụng **Strategy Pattern**. Xây dựng interface chung `JobCrawler` với các class triển khai riêng biệt (`ViecLamTotCrawler`, `TopCVCrawler`, `VietnamWorksCrawler`). Khi một trang bị lỗi cấu trúc, toàn hệ thống vẫn hoạt động bình thường. 
    *   Các cấu hình CSS Selector hoặc API URL không được hard-code mà lưu vào Database (bảng `crawler_config`) hoặc file cấu hình `application.yml`. Khi web nguồn đổi giao diện, chỉ cần sửa cấu hình trong DB/YML thay vì phải sửa code và build lại toàn bộ server.

2.  **Tránh trùng lặp dữ liệu (Deduplication):**
    *   **Giải pháp:** Tạo mã Hash duy nhất (ví dụ: MD5 hoặc SHA-256) dựa trên URL gốc của bài đăng (`job_url`). Trước khi lưu job mới, kiểm tra hash này trong DB/Redis. Nếu trùng thì bỏ qua hoặc cập nhật ngày sửa đổi.

---

## 5. Kiến Trúc Microservices Dự Kiến
*   **API Gateway (Port 8080):** Cổng vào duy nhất điều hướng request, validate token JWT, quản lý CORS tập trung.

*   **Auth & User Service (Port 8081):** Quản lý tài khoản, phân quyền, SSO OAuth2, cấp phát JWT và quản lý Profile người dùng.

*   **Job & Search Service (Port 8083):** Lưu trữ dữ liệu công việc (PostgreSQL), cung cấp API tìm kiếm, phân trang và đồng bộ cache.

*   **Crawler Service (Port 8084):** Chạy ngầm cào dữ liệu từ các nguồn định kỳ, đẩy dữ liệu thô vào hàng đợi Message Broker.

*   **Notification Service (Port 8085):** Lắng nghe hàng đợi RabbitMQ để gửi Email xác thực hoặc gửi Job Alert hàng loạt.

---

## 6. Giai Đoạn 2 (Phase 2 - Tính Năng Nâng Cao Mở Rộng)
1.  **AI Resume Parsing:** Tích hợp LLM API tự động bóc tách thông tin (kinh nghiệm, kỹ năng, học vấn) từ file PDF CV của ứng viên đa ngành.

2.  **Real-time Notifications:** Sử dụng WebSocket để bắn thông báo tức thì (chuông báo đỏ) khi trạng thái hồ sơ thay đổi hoặc có nhà tuyển dụng xem CV.

3.  **Protected Routes & Multi-page Auth Guard (ReactJS):** Xây dựng component `ProtectedRoute` dùng chung để bảo vệ các trang nội bộ (Dashboard, CV Builder, Kanban Board...).

---

## 7. Kế Hoạch Triển Khai: Email Service & Xác Thực

### 7.1. Setup Infrastructure (Hạ tầng Email)
1.  **Google Apps Script:** Tạo script mới tại `script.google.com` và Deploy as Web App để lấy Webhook URL gửi email miễn phí.
2.  **Tích hợp OpenFeign:** Tạo `GoogleEmailClient.java` (trong `auth-service` hoặc `notification-service`) để gọi HTTP POST đến Webhook URL.
3.  **Tạo DTO:** `EmailRequest.java` (gồm các trường: to, subject, body, isHtml).

### 7.2. Email Verification & Security (Flow Xác Thực)
1.  **Cập nhật User Entity:** Thêm trường `emailVerified` (Boolean).
2.  **Tạo Token Entities:** Tạo `EmailVerificationToken` và `PasswordResetToken` (token, user_id, expiryDate).
3.  **Bổ sung API Endpoints:**
    *   `POST /api/v1/auth/forgot-password`: Tạo reset token và gửi link đổi mật khẩu qua email.
    *   `POST /api/v1/auth/reset-password`: Xác nhận token và đổi mật khẩu mới.
    *   `GET /api/v1/auth/verify-email?token=xxx`: Xác thực tài khoản.

### 7.3. Cảnh Báo Việc Làm - Job Alert (Notification Service)
1.  **Entity Mới:** `JobAlertSubscription` (chứa user_id, keywords, location).
2.  **API CRUD:** Cho phép người dùng đăng ký, sửa, xóa các từ khóa nhận thông báo công việc mong muốn.
3.  **RabbitMQ & Crawler Integration:** 
    *   Khi Crawler gom được việc làm mới -> Đẩy thông báo (Event) vào RabbitMQ.
    *   Worker đọc Event -> Kiểm tra (Match) từ khóa với các `JobAlertSubscription` -> Gửi Email hàng loạt bằng Webhook.

---

## 8. Tầm Nhìn Kiến Trúc V2 & Cân Nhắc Kỹ Thuật (Architecture Gaps)

### 8.1. Phân định Ranh giới Service (Service Boundary)
*   **Vấn đề:** Hiện tại `Auth Service` đang gánh cả `User` và `CandidateProfile`. Khi mở rộng đa ngành có thêm nhiều loại Profile khác nhau thì service này sẽ phình to.
*   **Giải pháp (V2):** Tách thành `Auth Service` (chỉ lo bảo mật, token) và `User Service` (quản lý Profile ứng viên, nhà tuyển dụng, admin).

### 8.2. Kế hoạch tách độc lập Notification Service (Email System)
*   Sử dụng RabbitMQ với 2 Queue riêng biệt: `email.priority` (cho xác thực/reset pass, gửi ngay) và `email.bulk` (cho job alert, gửi bất đồng bộ theo lô).
*   Tích hợp **Thymeleaf** để render giao diện email động dựa trên các template HTML được định nghĩa sẵn.
*   Thiết lập cơ chế **DLQ (Dead Letter Queue) + Retry Policy** với Exponential Backoff để xử lý việc gửi email thất bại một cách tin cậy.

### 8.3. Tối ưu Thuật toán Matching và Job Alert cho tệp dữ liệu lớn
*   **Vấn đề:** Khi số lượng job cào được lên tới hàng trăm ngàn tin và số người dùng đăng ký alert lớn, việc so khớp từ khóa bằng SQL `LIKE` sẽ làm sập Database.
*   **Giải pháp (V2):** Đồng bộ dữ liệu Job sang **Elasticsearch** để tận dụng khả năng Full-text Search và lọc từ khóa siêu tốc.

### 8.4. Tính nhất quán Dữ liệu Phân tán (Data Consistency)
*   Áp dụng **Saga Pattern** hoặc Eventual Consistency thông qua RabbitMQ để đảm bảo các giao dịch liên quan đến nhiều service (ví dụ: tạo profile ứng viên mới đồng thời kích hoạt đăng ký alert mặc định) được thực hiện trọn vẹn hoặc tự động rollback.

### 8.5. Thiết Kế và Chuẩn Hóa Hệ Thống Skill Dictionary Phân Cấp (Skill Taxonomy)
*   **Vấn đề:** Việc lưu kỹ năng dạng chuỗi thô (text) hoặc mảng string đơn giản trong Profile/Job sẽ dẫn đến sai lệch dữ liệu (do người dùng nhập tự do hoặc crawler cào từ nhiều nguồn khác nhau) và không thể phân nhóm chuyên môn để gợi ý việc làm thông minh.
*   **Giải pháp (V2 - Giai đoạn làm Search & Matching):**
    *   **Cấu trúc dữ liệu 3 tầng:** `Categories` (Ngành lớn) -> `Specialties` (Mảng chuyên môn) -> `Skills` (Kỹ năng cụ thể).
    *   **Chuẩn hóa Database 3NF:** Tách `skills` thành các bảng độc lập và thiết lập quan hệ Nhiều-Nhiều (Many-to-Many) thông qua các bảng trung gian (`CANDIDATE_SKILLS`, `JOB_SKILLS`, `SPECIALTY_SKILLS`).
    *   **Bí danh & Chuẩn hóa (Alias Standardizer):** Thiết lập bảng phụ `SKILL_ALIASES` để tự động map các biến thể từ khóa (ví dụ: `reactjs`, `React.js`, `react js`) về một Skill ID duy nhất khi Crawler cào tin về hoặc khi ứng viên upload CV.

