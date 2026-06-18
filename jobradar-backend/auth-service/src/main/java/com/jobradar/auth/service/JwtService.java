package com.jobradar.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    // Thời gian sống của Token: 1 ngày = 86400000 milliseconds
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    /**
     * Hàm chính để tạo JWT Token từ email (username) của người dùng
     */
    public String generateToken(String username) {
        return generateToken(new HashMap<>(), username);
    }

    /**
     * Hàm tạo Token nâng cao, cho phép nhúng thêm extraClaims (ví dụ: role, thông tin phụ...)
     */
    public String generateToken(Map<String, Object> extraClaims, String username) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(username) // Lưu email người dùng vào phần Payload của Token
                .setIssuedAt(new Date(System.currentTimeMillis())) // Thời gian tạo
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration)) // Thời gian hết hạn
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Ký bằng mã bảo mật
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenValid(String token, org.springframework.security.core.userdetails.UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Chuyển đổi chuỗi bí mật thành đối tượng Key của thuật toán HMAC SHA
     */
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
