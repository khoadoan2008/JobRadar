# 📚 Sổ Tay Kiến Thức & Lộ Trình Học Tập: JobRadar

Tài liệu này đóng vai trò là "kim chỉ nam" định hướng việc học công nghệ mới trong dự án. Bạn hãy dùng file này như một **nhật ký code (DevLog)**, liên tục ghi chú lại những gì mới học được hoặc cách sửa một con bug khó để sau này làm tư liệu viết vào CV và trả lời phỏng vấn nhé!

---

# Phần 1: Lộ Trình Học Tập (Cuốn Chiếu Theo Tiến Độ)
*Chiến lược: Không học nhồi nhét. Code đến Phase nào, học công nghệ của Phase đó.*

### Chặng 1: Nền tảng Lưu trữ (Khi bắt đầu với Auth Service)
**1. PostgreSQL**

*   **Nhiệm vụ:** Chuyển đổi tư duy từ SQL Server sang PostgreSQL.

*   **Trọng tâm cần học:** 

    *   Cách sử dụng các công cụ quản lý như pgAdmin hoặc DBeaver.

    *   Điểm sáng CV: Tìm hiểu cách sử dụng kiểu dữ liệu `JSONB` trong Postgre để lưu cấu hình linh hoạt (ví dụ: lưu CSS Selector của Crawler) mà không cần tạo quá nhiều bảng.

### Chặng 2: Công cụ thu thập dữ liệu (Khi code Crawler Service)
**2. JSoup & HTML Parsing**

*   **Nhiệm vụ:** Cào dữ liệu từ TopCV, VietnamWorks.

*   **Trọng tâm cần học:** Cú pháp **CSS Selector** (cách móc lấy dữ liệu từ thẻ `div.class-name` hoặc `a[href]`).

*   **Thực hành:** Đừng ghép vào Spring Boot vội, hãy viết một hàm `main` Java nhỏ chạy thử việc cào tiêu đề báo VnExpress trước cho quen tay.

### Chặng 3: Tối ưu Hiệu năng & Bất đồng bộ (Khi hoàn thiện Job Service & Alert)
**3. Redis (In-memory Caching)**

*   **Nhiệm vụ:** Tăng tốc độ load danh sách Job trên trang chủ, giảm tải cho Database.

*   **Trọng tâm cần học:** Cấu hình Redis vào Spring Boot. Cú pháp và ý nghĩa của các annotation `@Cacheable`, `@CachePut`, `@CacheEvict`.

**4. RabbitMQ (Message Broker)**

*   **Nhiệm vụ:** Xử lý hệ thống gửi Email cảnh báo việc làm tự động.

*   **Trọng tâm cần học:** Hiểu rõ luồng đi của dữ liệu: `Producer` (Người gửi) -> `Exchange` -> `Queue` (Hàng đợi) -> `Consumer` (Người nhận và xử lý). Hiểu lý do tại sao phải dùng hàng đợi để xử lý bất đồng bộ.

### Chặng 4: DevOps & Triển khai (Thực hành xuyên suốt)
**5. Docker & Docker Compose**

*   **Nhiệm vụ:** Thiết lập môi trường chạy code "1-click".

*   **Trọng tâm cần học:** 

    *   Biết cách viết `Dockerfile` để đóng gói app Spring Boot thành Image.

    *   Biết cách viết `docker-compose.yml` để khởi chạy đồng loạt PostgreSQL, Redis, RabbitMQ và FlareSolverr trên máy tính cá nhân.

### Chặng 5: Kiến trúc Microservices (Giai đoạn ghép nối cuối cùng)
**6. Spring Cloud Gateway & OpenFeign**

*   **Nhiệm vụ:** Nối các Service rời rạc lại thành 1 hệ thống thống nhất.

*   **Trọng tâm cần học:** 

    *   Gateway: Đóng vai trò làm "cổng bảo vệ" (Kiểm tra token) và Routing (Điều hướng request từ `/api/auth` về cổng của Auth Service).

    *   OpenFeign: Cách để Service A (ví dụ Job) có thể lấy dữ liệu từ Service B (ví dụ Auth) qua giao thức HTTP nội bộ.

---

# Phần 2: Sổ Tay Ghi Chú Kiến Thức (Take Notes)
*(💡 Hướng dẫn: Đừng chỉ copy code, hãy dùng format dưới đây để ghi lại tư duy giải quyết vấn đề của bạn. Khi phỏng vấn, nhà tuyển dụng rất thích hỏi "Em từng gặp khó khăn gì và cách em giải quyết ra sao?")*
<!--### 📝 Ngày .../.../202... - Chủ đề: [Tên công nghệ hoặc Tính năng]

*   **Khái niệm mới học được (Hiểu theo ý mình):**

    *   *Ghi chú ngắn gọn...*

*   **Đoạn code / Cấu hình tâm đắc:**
    ```java
    // Paste những đoạn code hay, config khó tìm vào đây
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Mô tả lỗi:* Chạy Spring Boot báo lỗi Connection Refused ở cổng 5432...

    *   *Cách giải quyết:* Do cấu hình sai username/password trong file application.yml...

    *   *Link tham khảo (StackOverflow, Blogs):* https://...

---
-->
<!--### 📝 Ngày .../.../202... - Chủ đề: 

*   **Khái niệm mới học được:**

    *   ...

*   **Đoạn code / Cấu hình tâm đắc:**
    ```yml
    
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Mô tả lỗi:* ...

    *   *Cách giải quyết:* ...
    -->


### 📝 Ngày 09/06/2026 - Chủ đề: Setup cấu hình Docker Compose
*   **Khái niệm mới học được:**

    * DOCKER: được sinh ra trên nền tảng linux, dùng để thay thế cho việc phải chạy máy ảo, gom ứng dụng và các thư viện vào 1 môi trường cách ly(Container). Windows tạo 1 Linux thu nhỏ gọi là WSL 

    * FILE docker-compose.yml: khai báo mọi thứ vào file này và chỉ cần gõ  docker-compose up -d , toàn bộ hệ thống sẽ tự động tải và khởi chạy ngầm.

*   **Đoạn code / Cấu hình tâm đắc:**
    ```yml
     postgres:
        image: postgres:15-alpine # Dùng phiên bản alpine siêu nhẹ, tiết kiệm RAM
        container_name: jobradar_postgres
        environment:
          POSTGRES_USER: postgres       # Username mặc định
          POSTGRES_PASSWORD: root       # Password đăng nhập
          POSTGRES_DB: jobradar_db      # Tên Database tự động tạo khi chạy lần đầu
        ports:

          - "5432:5432"                 # Ánh xạ Cổng của máy tính (Windows) vào cổng của Docker
        volumes:

          - postgres_data:/var/lib/postgresql/data # QUAN TRỌNG: Lưu dữ liệu ra ổ cứng thật, tắt Docker không bị mất data.
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Mô tả lỗi:* WSL old

    *   *Cách giải quyết:* down WSL mới bằng wsl --update --web install và nhớ cấp quền admin
### 📝 Ngày 10/06/2026 - Chủ đề: Thiết kế database PostgreSQL
*   **Khái niệm mới học được (Hiểu theo ý mình):**

    *   *BIGINT: id tự tăng giá trị *

    *   *VARCHAR: có thể tự hiểu tiếng việt và anh, không cần khai báo NVARCHAR

*   **Đoạn code / Cấu hình tâm đắc:**
    ```java
    // Paste những đoạn code hay, config khó tìm vào đây
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Mô tả lỗi:* Chạy Spring Boot báo lỗi Connection Refused ở cổng 5432...

    *   *Cách giải quyết:* Do cấu hình sai username/password trong file application.yml...

    *   *Link tham khảo (StackOverflow, Blogs):* https://...

---

### 📝 Ngày 12/06/2026 - Chủ đề: Cấu hình JWT (JSON Web Token) cho Auth Service

*   **Khái niệm mới học được (Hiểu theo ý mình):**

    *   **JWT là gì:** Một cơ chế tạo "thẻ thông hành" gồm 3 phần (Header, Payload, Signature). Server không cần lưu token vào database (giảm tải), chỉ cần dùng Secret Key để kiểm tra chữ ký xem token có hợp lệ không.
    *   **Bảo mật:** Không bao giờ lưu password vào Payload vì thông tin này có thể dễ dàng giải mã trên mạng. Chỉ lưu email hoặc ID.

*   **Đoạn code / Cấu hình tâm đắc:**
    ```java
    public String generateToken(Map<String, Object> extraClaims, String username) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(username) // Lưu email người dùng vào phần Payload của Token
                .setIssuedAt(new Date(System.currentTimeMillis())) // Thời gian tạo
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration)) // Thời gian hết hạn
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Ký bằng mã bảo mật
                .compact();
    }
    ```

    *   *Mô tả lỗi:* ...

    *   *Cách giải quyết:* ...

    *   *Link tham khảo (StackOverflow, Blogs):* ...

---

### 📝 Ngày 12/06/2026 - Chủ đề: Spring Security & "Cú lừa" 403 Forbidden

*   **Khái niệm mới học được (Hiểu theo ý mình):**

    *   **Cơ chế báo lỗi của Spring Boot:** Khi code xảy ra lỗi (ví dụ 500 Internal Server Error do sập DB, NullPointer...), Spring Boot tự động chuyển hướng (forward) request đến đường dẫn ngầm là `/error` để tạo ra câu báo lỗi trả về cho màn hình/Postman.
    *   **Tại sao lại bị 403 Forbidden?** Vì cài Spring Security mà quên mở cửa cho `/error`. Khi lỗi 500 xảy ra -> Spring văng ra `/error` -> Spring Security thấy endpoint này chưa đăng ký `permitAll()` -> Đập ngay cái khiên chặn lại và báo 403 (Cấm truy cập). Kết quả là ta bị "mù", không biết lỗi thực sự ở bên trong là gì.

*   **Đoạn code / Cấu hình tâm đắc:**
    ```java
    // File: SecurityConfig.java
    .authorizeHttpRequests(auth -> auth
        // Bắt buộc phải thêm "/error" vào permitAll để không bị ghi đè mã lỗi
        .requestMatchers("/api/v1/auth/**", "/error").permitAll() 
        .anyRequest().authenticated()
    )
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Mô tả lỗi:* Test API đăng ký bằng Postman nhưng bị văng mã 403 Forbidden dù đã cho phép `/api/v1/auth/register`.
    *   *Cách giải quyết:* Thêm `"/error"` vào trong `.requestMatchers(...)` của SecurityConfig. Sau khi khởi động lại, Postman đã nhả ra đúng mã lỗi 500 và chỉ rõ dòng code bị sai để fix.

---

### 📝 Ngày 12/06/2026 - Chủ đề: Bảo mật Config (Environment Variables)

*   **Khái niệm mới học được (Hiểu theo ý mình):**

    *   **Nợ kỹ thuật (Technical Debt):** Hardcode chuỗi bí mật (Secret Key) vào code Java là tối kỵ vì lộ mã nguồn là lộ chìa khóa.
    *   **Cú pháp `${ENV:default}`:** Sử dụng cú pháp `${JWT_SECRET_KEY:chuoi_mac_dinh}` trong file `application.properties`. Khi chạy trên IDE thì Spring lấy chuỗi mặc định, khi đưa lên Docker (Production) thì ưu tiên đọc từ biến môi trường.

*   **Đoạn code / Cấu hình tâm đắc:**
    *   *TODO - Nhớ làm cái này khi Deploy Auth Service lên Docker:*
    ```yml
    # Sẽ thêm đoạn này vào docker-compose.yml sau này:
      auth-service:
        # ... image, ports ...
        environment:
          - JWT_SECRET_KEY=Mot_Chuoi_Sieu_Bao_Mat_Danh_Rieng_Cho_Production
          - JWT_EXPIRATION=3600000
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Mô tả lỗi:* ...

    *   *Cách giải quyết:* ...

    *   *Link tham khảo (StackOverflow, Blogs):* ...

---

### 📝 Ngày 12/06/2026 - Chủ đề: Luồng hoạt động của Spring Security & JWT (Cực kỳ quan trọng)

*   **Khái niệm mới học được (Hiểu theo ý mình):**

    Để hiểu toàn bộ những file code vừa viết, hãy tưởng tượng hệ thống API của bạn là một **Tòa nhà văn phòng cao cấp**, và Spring Security là **Hệ thống an ninh**.

    **1. `UserDetails` và `CustomUserDetailsService` (Căn cước công dân & Cục dữ liệu)**
    *   Mình phải cho class `User` *implements* `UserDetails`. Việc này giống như in thông tin User thành một tấm **"Căn cước theo mẫu chuẩn"** mà mấy ông bảo vệ (Spring Security) có thể đọc hiểu được.
    *   `CustomUserDetailsService` đóng vai trò là cơ quan tra cứu. Giao cho nó cái Email, nó sẽ lặn xuống Database lùng sục và móc tấm Căn cước đó lên trả cho bảo vệ.

    **2. `JwtAuthenticationFilter` (Chốt bảo vệ soát vé)**
    *   Mọi yêu cầu (Request) đi vào tòa nhà đều bị ông bảo vệ này chặn lại. 
    *   Ổng sẽ nhìn lên trán khách (tức là cái `Header: Authorization` trong HTTP). Nếu thấy có chữ `Bearer ...` (Tấm vé JWT), ổng sẽ lấy máy ra soi (gọi hàm `isTokenValid`).

    **3. `SecurityContextHolder` (Bảng tên dán trước ngực)**
    *   Nếu vé hợp lệ, ông bảo vệ không chỉ cho qua, mà còn phát cho khách một cái "Bảng tên" và ghim chặt vào người khách. Hành động này chính là đoạn code `SecurityContextHolder.getContext().setAuthentication(authToken)`.
    *   **Ma thuật ở đây là:** Nhờ cái bảng tên này, khi khách vào tới các phòng ban bên trong (ví dụ hàm `getMyProfile()`), nhân viên bên trong không cần hỏi khách là ai nữa, cứ chọc thẳng vào `SecurityContextHolder` để coi bảng tên là biết sạch sành sanh họ tên, quyền hạn! Cực kỳ tiện lợi.

    **4. `SessionCreationPolicy.STATELESS` (Não cá vàng)**
    *   Cấu hình này ép Tòa nhà phải mắc chứng "Não cá vàng"(STATELESS). Tức là 5 phút trước bạn vừa quét vé vào, bạn quay ra đi vệ sinh, lúc quay lại tòa nhà đã... quên mất bạn là ai. Bạn **bắt buộc phải quét vé lại** thì mới được vào. 
    *   Ưu điểm: Server không phải tốn RAM để nhớ ai đang online, rất dễ mở rộng (Scale) hệ thống.

*   **Đoạn code / Cấu hình tâm đắc:**
    ```java
    // Cách để "bốc" ông User đang đăng nhập ra ở bất kỳ đâu trong dự án:
    User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    System.out.println("Xin chào, " + currentUser.getEmail());
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Mô tả lỗi:* ...

    *   *Cách giải quyết:* ...

    *   *Link tham khảo (StackOverflow, Blogs):* ...

---

### 📝 Ngày 19/06/2026 - Chủ đề: Khởi tạo API Gateway & Chuyển giao "quyền lực" (CORS, JWT)

*   **Khái niệm mới học được (Hiểu theo ý mình):**

    *   **Spring Cloud Gateway (Người bảo vệ cổng chính):** Thay vì Frontend (ReactJS) phải nhớ và gọi đến từng service (phòng ban) riêng lẻ qua nhiều cổng khác nhau (8081, 8082...), nó chỉ cần nói chuyện duy nhất với Gateway (cổng 8080). Gateway sẽ làm nhiệm vụ điều hướng (Routing) request tới đúng đích.
    
    *   **Global CORS (Quản lý CORS tập trung):** Việc chuyển cấu hình CORS từ `auth-service` lên Gateway giúp làm sạch code. Trình duyệt gửi preflight request hỏi Gateway, Gateway cho phép, sau đó đẩy request vào trong. Các service bên trong (như `auth-service`, `job-service`) từ nay không cần bận tâm về cấu hình CORS nữa.
    
    *   **Xác thực JWT tại Gateway (Centralized Security):** Kiểm tra "vé thông hành" ngay từ vòng gửi xe. Thay vì mỗi service phải tự cắt cử người ra kiểm tra chữ ký JWT, `AuthenticationFilter` của Gateway sẽ chặn mọi request. Nếu vé lậu, trả về `401 Unauthorized`. Nếu vé thật, Gateway sẽ móc `username` ra, gắn vào header (`X-Auth-User`) rồi mới cho đi tiếp. Điều này giúp các microservices bên trong cực kỳ nhẹ nhàng và không lặp lại code bảo mật.

*   **Đoạn code / Cấu hình tâm đắc:**
    ```properties
    # Cấu hình "Người gác cổng" kiểm tra và điều hướng
    spring.cloud.gateway.routes[0].id=auth-service
    spring.cloud.gateway.routes[0].uri=http://localhost:8081
    spring.cloud.gateway.routes[0].predicates[0]=Path=/api/v1/auth/**
    
    # Gắn Filter kiểm soát vé vào route
    spring.cloud.gateway.routes[0].filters[0]=AuthenticationFilter
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Kinh nghiệm xương máu:* Khi chuyển CORS lên Gateway, PHẢI xóa triệt để đoạn cấu hình CORS cũ (`.cors()`) ở trong `SecurityConfig` của `auth-service`. Nếu cả Gateway và Service đều xử lý CORS, trình duyệt sẽ bị "bối rối" vì nhận được nhiều header cho phép trùng lặp, dẫn tới lỗi ngớ ngẩn không gọi được API.

---

### 📝 Ngày 24/06/2026 - Chủ đề: Khắc phục lỗi OAuth2 (API Gateway & Database Constraints)

*   **Khái niệm mới học được (Hiểu theo ý mình):**
    *   **OAuth2 Redirect & Port Mismatch:** Trong kiến trúc Microservices, mọi request từ client nên đi qua API Gateway (cổng 8080) thay vì gọi trực tiếp microservice (như auth-service chạy cổng 8081). Phải cấu hình định tuyến cho cả các đường dẫn `/oauth2/**` và `/login/oauth2/code/**` trên Gateway.
    *   **Ràng buộc Database với OAuth2 User:** Tài khoản đăng nhập qua mạng xã hội (Google, Github) sẽ không có mật khẩu. Do đó cột `password` trong bảng `users` bắt buộc phải cho phép giá trị `null` (`nullable = true`).
    *   **Giới hạn của Hibernate ddl-auto=update:** Thay đổi `@Column(nullable = true)` trong code Java **không** tự động xóa bỏ ràng buộc `NOT NULL` cũ dưới PostgreSQL. Phải gỡ bỏ thủ công hoặc chạy lệnh SQL khi khởi chạy.

*   **Đoạn code / Cấu hình tâm đắc:**
    ```java
    // Cách giải phóng ràng buộc NOT NULL của Database tự động tại thời điểm khởi động App bằng JdbcTemplate
    try {
        jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN password DROP NOT NULL");
        System.out.println("✅ Đã tự động gỡ bỏ ràng buộc NOT NULL cho cột password!");
    } catch (Exception e) {
        System.out.println("ℹ️ Bỏ qua gỡ bỏ ràng buộc password: " + e.getMessage());
    }
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**
    *   *Mô tả lỗi:* Đăng nhập Google trả về mã lỗi 404 hoặc chuyển hướng đến `/login?error`. Xem log của `auth-service` thấy báo lỗi `ERROR: null value in column "password" of relation "users" violates not-null constraint`.
    *   *Cách giải quyết:* 
        1. Cấu hình thêm các route định tuyến cho `/oauth2/**` và `/login/oauth2/code/**` trên API Gateway và đưa chúng vào danh sách loại trừ (Public API) trong `RouteValidator`.
        2. Chèn đoạn code tự động thực thi SQL `ALTER TABLE users ALTER COLUMN password DROP NOT NULL` bằng `JdbcTemplate` tại class `DatabaseInitializer` của `auth-service` để tự động dọn dẹp cấu hình cột trong Database mà không làm mất dữ liệu hiện có.

---

### 📝 Ngày 24/06/2026 - Chủ đề: Sửa lỗi CORS & Lỗi 500 tại API lấy thông tin người dùng (/me)

*   **Khái niệm mới học được (Hiểu theo ý mình):**
    *   **Tầm quan trọng của Cổng giao tiếp chung:** Trong Microservices, Frontend không được phép gọi trực tiếp các service bên trong (như cổng 8081). Mọi cuộc gọi HTTP phải gửi qua API Gateway (cổng 8080) để Gateway xử lý phân tán CORS, nếu không sẽ bị trình duyệt chặn (lỗi CORS policy).
    *   **Lỗi `LazyInitializationException`:** Hibernate session kết nối DB thường bị đóng ngay sau khi dữ liệu chính được tải xong. Truy cập dữ liệu liên kết dạng Lazy-loading (như `getCandidateProfile()`) sau đó sẽ ném lỗi 500 nếu không nạp lại thực thể trong một phiên làm việc hiện tại.
    *   **Phòng ngừa lỗi ép kiểu (`ClassCastException`):** Spring Security lưu trữ người dùng ẩn danh dưới dạng chuỗi `"anonymousUser"` thay vì Object `User`. Cần kiểm tra kiểu dữ liệu (`instanceof`) trước khi ép kiểu để tránh sập app (lỗi 500).

*   **Đoạn code / Cấu hình tâm đắc:**
    ```java
    // Cách xử lý lấy thông tin người dùng phòng thủ lỗi (Defensive Programming) trong AuthServiceImpl
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (principal instanceof String && "anonymousUser".equals(principal)) {
        throw new UnauthorizedException("Chưa xác thực hoặc Token không hợp lệ!");
    }
    User userPrincipal = (User) principal;
    // Nạp lại User bằng findById để gắn thực thể vào Hibernate Session hoạt động
    User currentUser = userRepository.findById(userPrincipal.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Tài khoản không tồn tại"));
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**
    *   *Mô tả lỗi:* 
        1. Gọi API lấy thông tin `/api/v1/auth/me` bị chặn do CORS khi Frontend gọi trực tiếp tới cổng `8081`.
        2. Dashboard báo lỗi `500 Internal Server Error` không rõ nguyên nhân sau khi đăng nhập Google thành công.
    *   *Cách giải quyết:*
        1. Thay đổi cổng gọi API tại file `src/api.js` ở Frontend từ `localhost:8081` sang `localhost:8080` (API Gateway) để tận dụng cấu hình CORS tập trung.
        2. Cập nhật lại hàm `getMyProfile` tại `AuthServiceImpl` để kiểm tra kiểu dữ liệu `anonymousUser` an toàn và gọi lại DB thông qua `userRepository.findById` để tránh lỗi Lazy Loading.

---

### 📝 Ngày 24/06/2026 - Chủ đề: Bảo mật Credentials với Git (Sử dụng assume-unchanged)

*   **Khái niệm mới học được (Hiểu theo ý mình):**
    *   **GitHub Push Protection:** Cơ chế tự động quét mã nguồn khi push của GitHub nhằm ngăn chặn việc vô tình tải lên các mã khóa nhạy cảm (API Keys, Client Secret, Passwords...).
    *   **Thủ thuật Git `assume-unchanged`:** Khi muốn hardcode thông tin nhạy cảm ở local để test nhanh nhưng không muốn commit/push file đó lên GitHub, ta có thể dùng cờ `--assume-unchanged` để bảo Git "bỏ qua" sự thay đổi của file cụ thể đó.

*   **Đoạn code / Cấu hình tâm đắc:**
    ```bash
    # Bật tính năng bỏ qua thay đổi của file cấu hình tại local:
    git update-index --assume-unchanged jobradar-backend/auth-service/src/main/resources/application.properties

    # Tắt tính năng bỏ qua (để Git theo dõi và commit file bình thường trở lại):
    git update-index --no-assume-unchanged jobradar-backend/auth-service/src/main/resources/application.properties
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**
    *   *Mô tả lỗi:* Lệnh `git push` bị GitHub từ chối với mã lỗi `GH013: Repository rule violations` do phát hiện Google Client ID & Secret thực tế trong file config.
    *   *Cách giải quyết:* 
        1. Thay thế credentials thật bằng các placeholder giả định (`YOUR_DEFAULT_GOOGLE_CLIENT_ID`) rồi commit và push lên GitHub an toàn.
        2. Khôi phục lại credentials thật tại local để chạy thử.
        3. Sử dụng lệnh `git update-index --assume-unchanged` để cố định file cấu hình local, tránh việc vô tình commit đè trong tương lai.

---

### 📝 Ngày 26/06/2026 - Chủ đề: Hoàn thiện CRUD, DTO & Validation cho Job Service

*   **Khái niệm mới học được (Hiểu theo ý mình):**
    *   **DTO (Data Transfer Object) Pattern:** Tách biệt dữ liệu nhận từ client (`JobRequest`) và Entity (`Job`). Giúp bảo vệ Entity khỏi việc bị gán giá trị xấu trực tiếp (như tự gán `id` hay `createdAt` từ request - lỗ hổng *Mass Assignment*). Giúp API sạch hơn và kiểm soát chặt chẽ dữ liệu đầu vào.
    *   **Jakarta Bean Validation:** Dùng các annotation (`@NotBlank`, `@URL`, `@Valid`) để kiểm tra dữ liệu đầu vào tự động thay vì viết các câu lệnh `if-else` thủ công dài dòng.
    *   **Global Exception Handling (`@RestControllerAdvice`):** Gom tất cả lỗi xảy ra trong ứng dụng về một nơi xử lý tập trung. Giúp trả về định dạng lỗi JSON thống nhất (`ErrorResponse`) cho Frontend dễ xử lý, thay vì quăng ra trang lỗi mặc định của Spring Boot.
    *   **MethodArgumentNotValidException:** Exception tự động văng ra khi validation thất bại. Ta bắt nó trong Exception Handler để trích xuất danh sách các trường lỗi (`FieldError`) và ghép thành thông báo lỗi cụ thể để phản hồi về client.

*   **Đoạn code / Cấu hình tâm đắc:**
    *   *Tự động format thông báo validation lỗi trong GlobalExceptionHandler:*
    ```java
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex, WebRequest request) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
        String errorMessage = String.join(", ", errors);
        
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                errorMessage,
                request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    ```

---

### 📝 Ngày 26/06/2026 - Chủ đề: Tích hợp Redis Caching cho Job Service

*   **Khái niệm mới học được (Hiểu theo ý mình):**
    *   **Redis Caching (In-Memory Data):** Lưu trữ tạm thời các bản ghi hay được truy cập trên bộ nhớ RAM (Redis) thay vì liên tục truy vấn đĩa cứng (PostgreSQL). Giúp tăng tốc độ phản hồi API xuống dưới vài mili-giây.
    *   **Serializable:** Khi lưu một Object Java vào Redis cache, Spring Boot cần chuyển đổi Object đó sang dạng byte để ghi xuống RAM/ổ cứng (Tuần tự hóa). Bắt buộc Class Entity phải `implements Serializable` và định nghĩa `serialVersionUID` cố định để kiểm soát phiên bản cấu trúc dữ liệu, tránh lỗi giải mã khi cập nhật code.
    *   **@Cacheable, @CachePut, @CacheEvict:**
        *   `@Cacheable`: Soi trong tủ Redis xem có cache chưa. Có rồi thì lấy ra dùng luôn (không chạy SQL). Chưa có thì chạy SQL rồi cất vào Redis.
        *   `@CachePut`: Luôn luôn chạy hàm để cập nhật DB, đồng thời cập nhật đè cache mới vào Redis để tránh lệch pha dữ liệu.
        *   `@CacheEvict`: Xóa bỏ cache khỏi Redis khi dữ liệu gốc bị xóa để tránh việc đọc phải dữ liệu "rác" đã lỗi thời (Stale Data).

*   **Đoạn code / Cấu hình tâm đắc:**
    *   *Cấu hình cache trong Service Impl:*
    ```java
    @Cacheable(value = "jobs", key = "#id")
    public Job getJobById(Long id) { ... }

    @CachePut(value = "jobs", key = "#id")
    public Job updateJob(Long id, JobRequest jobRequest) { ... }

    @CacheEvict(value = "jobs", key = "#id")
    public void deleteJob(Long id) { ... }
    ```

---

### 💡 BÀI HỌC KINH NGHIỆM ĐỂ TRẢ LỜI PHỎNG VẤN (INTERVIEW TIPS)

*   **Q: Tại sao em lại cần DTO khi đã có Entity?**
    *   **A:** Entity dùng để ánh xạ trực tiếp với cấu trúc cơ sở dữ liệu. DTO dùng để trao đổi dữ liệu với client. Việc tách biệt giúp ta ẩn đi các trường nhạy cảm (như hash mật khẩu), ngăn chặn lỗi bảo mật *Mass Assignment* (client gửi đè các trường `id`, `createdAt`), và linh hoạt thay đổi cấu trúc API mà không làm ảnh hưởng đến cấu trúc database.
*   **Q: Tại sao class lưu vào Redis lại bắt buộc phải implements Serializable?**
    *   **A:** Vì Redis lưu trữ dữ liệu dạng nhị phân hoặc chuỗi byte. Để lưu một Java Object sang Redis qua kết nối mạng, ta phải chuyển cấu trúc object thành mảng byte thông qua cơ chế *Serialization* của Java. Interface `Serializable` đóng vai trò đánh dấu (Marker Interface) báo cho JVM biết class này được phép tuần tự hóa.
*   **Q: Em làm thế nào để đảm bảo dữ liệu trong Cache và Database không bị lệch nhau?**
    *   **A:** Em áp dụng cơ chế đồng bộ Cache thông qua các annotation của Spring: dùng `@CachePut` ghi đè cache khi có hành động cập nhật (Update), và `@CacheEvict` xóa cache khi có hành động xóa (Delete). Đồng thời cài đặt TTL (Time-To-Live) cho key Redis (ví dụ 10 phút) để dữ liệu tự động làm mới định kỳ.

---

### 📝 Ngày 26/06/2026 - Chủ đề: Khắc phục lỗi Duplicate Key Unique Constraint (Hibernate Action Order Conflict)

*   **Khái niệm mới học được (Hiểu theo ý mình):**
    *   **Hibernate SQL Action Order (Thứ tự thực thi SQL):** Trong một Transaction (`@Transactional`), Hibernate sẽ xếp hàng các câu lệnh SQL để gửi xuống DB theo thứ tự mặc định của nó: Lệnh `INSERT` (chèn) luôn được ưu tiên chạy trước lệnh `DELETE` (xóa).
    *   **Lỗi Conflict:** Khi ta viết logic xóa token cũ (`deleteByUser()`) rồi tạo token mới (`save()`) cho cùng 1 User có quan hệ `@OneToOne` (ràng buộc duy nhất `user_id`). Hibernate cố gắng chạy lệnh `INSERT` trước -> Database thấy trùng `user_id` -> ném lỗi `duplicate key constraint` 500 ngay lập tức trước khi Hibernate kịp chạy lệnh `DELETE`.
    *   **Giải pháp Upsert (Cập nhật hoặc Chèn):** Thay vì xóa đi tạo lại, ta tìm xem User đã có Refresh Token chưa. Nếu có rồi thì chỉ việc cập nhật (`UPDATE`) lại các trường dữ liệu (`token`, `expiryDate`), nếu chưa có mới tạo mới (`INSERT`). Đây là phương án sạch nhất và tối ưu hiệu năng DB.

*   **Đoạn code / Cấu hình tâm đắc:**
    *   *Logic tạo/cập nhật Refresh Token tối ưu trong RefreshTokenService:*
    ```java
    @Transactional
    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Tìm token cũ của user. Nếu có rồi thì cập nhật, chưa có thì tạo mới (tránh lỗi duplicate)
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElseGet(() -> RefreshToken.builder().user(user).build());

        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));

        return refreshTokenRepository.save(refreshToken);
    }
    ```

---

### 📝 Ngày 26/06/2026 - Chủ đề: Khởi tạo Crawler Service & Thiết kế Strategy Pattern cào tin đa nguồn

*   **Khái niệm mới học được (Hiểu theo ý mình):**
    *   **Declarative REST Client (Spring Cloud OpenFeign):** Thay vì tự tạo `RestTemplate` và viết code kết nối HTTP thủ công dài dòng, OpenFeign cho phép khai báo một interface có `@FeignClient` và các annotation mapping. Spring Cloud sẽ tự động sinh ra client gọi API nội bộ cực kỳ sạch sẽ và dễ đọc.
    *   **Strategy Pattern trong Spring Boot:** Áp dụng cho các bộ cào tin. Interface `JobCrawler` là bộ khung chung. Các class cụ thể như `ChoTotCrawler` implement interface này. Trong Controller, ta chỉ cần tiêm `List<JobCrawler>` để Spring Boot tự động thu thập tất cả các bean implement `JobCrawler`. Khi cần thêm trang web cào mới, ta chỉ việc tạo class mới mà không cần chỉnh sửa bất kỳ dòng code nào ở Controller hay Service chính (đảm bảo tính đóng/mở - Open/Closed Principle trong SOLID).
    *   **CSR (Client-Side Rendering) Scraping:** Với các trang CSR như Chợ Tốt, tin tuyển dụng được gọi qua một API JSON nội bộ. Ta không cần dùng JSoup parse HTML, chỉ cần gọi thẳng API của họ bằng `RestTemplate` để lấy JSON sạch về, giúp cào cực nhanh và bền vững hơn (vì HTML đổi giao diện liên tục nhưng API JSON ít khi đổi trường).

*   **Đoạn code / Cấu hình tâm đắc:**
    *   *Sử dụng Feign Client gọi sang Job Service:*
    ```java
    @FeignClient(name = "job-service", url = "${services.job-service.url}")
    public interface JobClient {
        @PostMapping("/api/v1/jobs")
        void createJob(@RequestBody JobRequest jobRequest);
    }
    ```
    *   *Tiêm tự động toàn bộ Strategy Implementations vào Controller:*
    ```java
    private final List<JobCrawler> crawlers;
    // Spring Boot tự động scan và thu gom toàn bộ các bean implement JobCrawler
    ```

---

### 💡 BÀI HỌC KINH NGHIỆM ĐỂ TRẢ LỜI PHỎNG VẤN (INTERVIEW TIPS - CRAWLER & FEIGN)

*   **Q: OpenFeign là gì và tại sao lại dùng nó thay vì RestTemplate?**
    *   **A:** OpenFeign là một Declarative REST Client trong hệ sinh thái Spring Cloud. Thay vì tự dựng `RestTemplate`, cấu hình HTTP Header và viết boilerplate code để gọi HTTP request, OpenFeign cho phép khai báo interface cùng các annotation mapping (như `@GetMapping`, `@PostMapping`). Spring sẽ tự tạo class triển khai ngầm. Giúp code clean, dễ bảo trì, và tích hợp rất mượt với Eureka Service Discovery, Load Balancer (Spring Cloud LoadBalancer), hay Resilience4j (Circuit Breaker).
*   **Q: Strategy Pattern giải quyết vấn đề gì trong Crawler?**
    *   **A:** Giúp dự án tuân thủ nguyên lý **OCP (Open/Closed Principle)** trong SOLID. Mỗi trang tuyển dụng (Chợ Tốt, TopCV, ITviec) có cấu trúc và thuật toán cào khác nhau. Khi định nghĩa interface `JobCrawler` và tiêm `List<JobCrawler>` vào Controller/Service, nếu cần thêm trang web cào mới, ta chỉ cần tạo một class mới implements `JobCrawler` mà không cần sửa bất kỳ dòng code nào của Controller hay các bộ cào cũ, giúp hệ thống không bị lỗi dây chuyền và dễ mở rộng.
*   **Q: Em phân biệt cách cào dữ liệu từ trang CSR (Client-Side) và SSR (Server-Side) như thế nào?**
    *   **A:** 
        *   Với trang **CSR** (như Chợ Tốt), dữ liệu được tải bất đồng bộ qua API JSON nội bộ. Ta dùng Developer Tools (F12 Network) để dò tìm endpoint API của họ và gọi thẳng bằng `RestTemplate/WebClient` để lấy JSON sạch về xử lý. Cách này chạy rất nhanh, nhẹ và ít bị lỗi do thay đổi giao diện.
        *   Với trang **SSR** (như TopCV, Việc Làm 24h), dữ liệu nằm trực tiếp trong cấu trúc HTML trả về từ server. Ta phải dùng thư viện parse HTML như **JSoup** kết hợp CSS Selector (`div.job-item`, `a.job-title`) để bóc tách thông tin. Cách này chạy chậm hơn và dễ lỗi nếu trang nguồn đổi giao diện.

---

### 🛠️ NHẬT KÝ THỰC CHIẾN: KHẮC PHỤC LỖI VALIDATION & CHIẾN LƯỢC CÀO TIN SỐ LƯỢNG LỚN (26/06/2026)

#### 1. Sự cố Validation trong Microservices (Lỗi 400 Bad Request)
*   **Sự cố:** `crawler-service` gọi API của `job-service` qua Feign client thì bị lỗi:
    `[400] during [POST] to [http://localhost:8083/api/v1/jobs] [JobClient#createJob(JobRequest)]: [{"message":"jobUrl: Đường dẫn bài tuyển dụng gốc không được để trống"}]`
*   **Nguyên nhân:** DTO [JobRequest.java](file:///K:/Project/ProjectForIntern/jobradar-backend/job-service/src/main/java/com/jobradar/job/dto/JobRequest.java) trong `job-service` ràng buộc `@NotBlank` và `@URL` đối với trường `jobUrl`. Tuy nhiên, API Chợ Tốt thay đổi cấu trúc và không còn trả về trường `share_url` (hoặc rỗng), dẫn đến crawler gửi dữ liệu không hợp lệ.
*   **Cách xử lý:** 
    *   Sử dụng dữ liệu định danh duy nhất có sẵn `list_id` từ API nguồn để tự động lắp ghép thành link URL rút gọn: `https://www.chotot.com/{list_id}.htm`.
    *   Tận dụng cơ chế **301 Redirect** tự động của trang nguồn để tự chuyển hướng người dùng về link gốc (trang `vieclamtot.com`) khi click xem chi tiết.
    *   Làm sạch các dữ liệu chuỗi `"null"` phát sinh từ Jackson parser đối với các trường có thể null như `companyLogo`.
    *   **Bài học kinh nghiệm:** Khi làm việc với dữ liệu từ bên thứ ba (Web Scraping), cấu trúc dữ liệu của họ có thể thay đổi bất cứ lúc nào. Luôn cần cơ chế xử lý fallback (giải pháp dự phòng) dựa trên các định danh cứng (như ID bài đăng) để tự sinh dữ liệu hợp lệ vượt qua vòng kiểm duyệt (Validation) của dịch vụ đích.

#### 2. Chiến lược nâng cấp số lượng tin cào (Pagination & Limit)
*   **Hạn chế hiện tại:** Mặc định API của Chợ Tốt được giới hạn cứng `limit=10` trên mỗi request, dẫn đến mỗi lần chỉ cào được tối đa 10 tin tuyển dụng.
*   **Các hướng xử lý thực tế:**
    1.  **Tăng Limit tối đa của API nguồn:** Thay đổi query parameter `limit` lên 50 hoặc 100 (mức tối đa thông thường mà máy chủ nguồn cho phép). Phù hợp cho việc cào định kỳ các tin mới nhất.
    2.  **Phân trang (Pagination) bằng Offset:** Chạy vòng lặp tăng dần tham số dịch chuyển `o` (offset). Ví dụ: `o=0`, `o=20`, `o=40`... để cào được toàn bộ hoặc một số lượng trang cố định (ví dụ 5 trang đầu). Cần thiết lập khoảng nghỉ (`Thread.sleep`) để tránh bị khóa IP (Rate Limit/IP Block).
    3.  **Dynamic Parameter (Tham số động):** Cho phép truyền `limit` và `page` trực tiếp từ Controller qua Endpoint điều khiển `GET /api/v1/crawler/crawl?source=chotot&limit=50` để tăng tính tùy biến mà không cần biên dịch lại mã nguồn backend.

#### 3. Xây dựng Tính năng Tự động Cào Định kỳ (Spring Scheduler)
*   **Yêu cầu:** Tự động kích hoạt cào toàn bộ nguồn tuyển dụng định kỳ mỗi 30 phút một lần.
*   **Giải pháp kỹ thuật:**
    *   Sử dụng cơ chế lập lịch **Spring Scheduler** bằng cách bật `@EnableScheduling` tại Class khởi chạy ứng dụng ([CrawlerServiceApplication.java](file:///K:/Project/ProjectForIntern/jobradar-backend/crawler-service/src/main/java/com/jobradar/crawler/CrawlerServiceApplication.java)).
    *   Tạo Component [CrawlerScheduler.java](file:///K:/Project/ProjectForIntern/jobradar-backend/crawler-service/src/main/java/com/jobradar/crawler/scheduler/CrawlerScheduler.java) và khai báo phương thức `@Scheduled`.
    *   **Best Practice về cấu hình:** Sử dụng tham số `fixedRateString = "${crawler.schedule.rate-ms:1800000}"` để vừa thiết lập thời gian mặc định là 30 phút (1.800.000 ms), vừa có thể dễ dàng thay đổi cấu hình này thông qua file `application.yml` mà không cần sửa code Java.
    *   **Tránh block luồng chính:** Khi kích hoạt cào, sử dụng `new Thread(crawler::crawl).start()` để chạy tác vụ cào bất đồng bộ trên một luồng riêng biệt, giúp luồng quản lý Scheduler không bị nghẽn (block) nếu việc cào dữ liệu từ một nguồn mất nhiều thời gian.
    *   **initialDelay:** Sử dụng `initialDelay = 10000` (10 giây) để trì hoãn lần chạy đầu tiên sau khi khởi động, giúp ứng dụng startup mượt mà và tránh bị quá tải ngay lúc khởi chạy.

#### 4. Kỹ thuật cào dữ liệu từ ứng dụng Next.js (VietnamWorks Crawler)
*   **Đặc điểm:** Các trang web hiện đại viết bằng Next.js (như VietnamWorks) thường render dữ liệu phía Server (SSR - Server-Side Rendering) nhưng đi kèm cơ chế hydrate ở Client. Dữ liệu thô thường được nhúng trực tiếp trong mã HTML để React đồng bộ lại trạng thái.
*   **Giải pháp kỹ thuật:**
    *   Thay vì dùng JSoup để parse từng thẻ DOM HTML phức tạp (dễ bị vỡ cấu trúc khi trang web đổi giao diện), ta dùng JSoup để chọn thẻ script đặc biệt có `id="__NEXT_DATA__"`:
        `Element script = doc.select("script#__NEXT_DATA__").first();`
    *   Thẻ này chứa một chuỗi JSON khổng lồ lưu toàn bộ trạng thái dữ liệu (props) của trang web được Server render trước đó.
    *   Sử dụng thư viện **Jackson Object Mapper** để parse chuỗi JSON này, đi sâu vào cấu trúc: `props -> pageProps -> jobsData` để trích xuất trực tiếp danh sách công việc sạch (như `urgentJobs`, `featuredJobs`, `highSalaryJobs`, `bestJobs`).
    *   **Ưu điểm:** Tốc độ cào siêu nhanh, dữ liệu thô cực sạch, và crawler cực kỳ bền vững (ít bị hỏng) vì cấu trúc JSON props này ít khi bị thay đổi so với cấu trúc HTML DOM bên ngoài.
    *   **Lưu ý thực chiến (Lệch pha Validation & Tiền lọc dữ liệu thô):** Khi phát triển hệ thống Microservices, cấu trúc DTO của dịch vụ nhận (`job-service`) thường có các ràng buộc validation nghiêm ngặt (như `@NotBlank`, `@URL` trên `jobUrl`), trong khi DTO của dịch vụ gửi (`crawler-service`) lại là POJO tự do. Khi dữ liệu cào từ bên thứ ba bị lỗi hoặc thay đổi cấu trúc (ví dụ: trả về `jobUrl` trống hoặc chỉ là đường dẫn tương đối dạng `/chuyen-vien-ke-toan...`), request gửi đi qua Feign Client sẽ lập tức bị chặn với lỗi 400 Bad Request.
    *   **Giải pháp tối ưu:** Cản lọc và chuẩn hóa dữ liệu ngay tại "đầu nguồn" (Crawler Service):
        - Sử dụng logic kiểm tra: Bỏ qua (skip) các bài đăng thiếu thông tin bắt buộc (`title` hoặc `jobUrl`) bằng từ khóa `continue`.
        - Tự động chuẩn hóa URL tương đối (relative URL) thành URL tuyệt đối (absolute URL) bằng cách ghép thêm tên miền gốc của trang nguồn trước khi gửi đi.
        - Phương pháp này giúp bảo vệ tính toàn vẹn dữ liệu cho database của hệ thống và tránh việc phải nới lỏng các ràng buộc an toàn ở dịch vụ nhận.
