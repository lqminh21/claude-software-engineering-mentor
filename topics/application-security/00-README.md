---
created_at: 2026-08-03
---

# Application Security — Bảo mật ở tầng source code

## Mục tiêu bundle

Học cách nhận diện và phòng chống các lỗ hổng bảo mật phổ biến nhất **ngay trong lúc viết code**, cho cả phía backend (API/server) lẫn phía frontend (giao diện chạy trên trình duyệt người dùng). Kết thúc bundle, bạn sẽ:

- Nhìn một đoạn code và chỉ ra được nó có thể bị tấn công theo cách nào (injection, XSS, IDOR, CSRF, v.v.), không cần công cụ quét tự động.
- Tự thiết kế được cơ chế phòng thủ đúng cho một tính năng mới, thay vì chỉ vá lỗi khi đã bị phát hiện.
- Đọc và tự review code của người khác dưới góc nhìn bảo mật (security code review).
- Hiểu các nguyên tắc này áp dụng thế nào khi hệ thống được tách thành nhiều service (microservice) — như một phần mở rộng.

**Phạm vi:** bundle này CHỈ nói về bảo mật triển khai được trong source code của ứng dụng (secure coding / application security). Bảo mật hạ tầng — network segmentation, service mesh/mTLS, cloud IAM, container/K8s security, firewall, WAF — **không** thuộc phạm vi này. Những chủ đề đó sẽ được nhắc tới như liên kết mở rộng ở đúng chỗ, và sẽ trở thành một topic bundle riêng sau này.

## Ví dụ nghiệp vụ xuyên suốt

Một nền tảng thương mại điện tử (e-commerce) đơn giản, gồm:

- **Backend**: API viết bằng Node.js/TypeScript, phục vụ đăng ký/đăng nhập, giỏ hàng, đặt hàng, thanh toán, đánh giá sản phẩm, và một khu vực quản trị (admin) cho người bán (seller).
- **Frontend**: một SPA (single-page application, tức web app chạy chủ yếu bằng JavaScript trên trình duyệt thay vì tải lại trang mỗi lần bấm) gọi tới API backend nói trên.
- **Mở rộng (giai đoạn cuối)**: hình dung hệ thống trên được tách thành các service độc lập — order service, payment service, inventory service, user service, notification service — để minh hoạ các vấn đề bảo mật phát sinh riêng khi có nhiều service gọi lẫn nhau.

Ví dụ này được chọn vì đủ phổ biến, dễ hình dung, và có đủ "bề mặt tấn công" tự nhiên (giỏ hàng, thanh toán, upload ảnh đánh giá sản phẩm, trang admin...) để minh hoạ gần như toàn bộ các lớp lỗ hổng trong bundle mà không cần bịa tình huống giả tạo.

## Giai đoạn & bảng chương

| # | Chương | Giai đoạn | Nội dung chính |
|---|--------|-----------|----------------|
| 1 | tu-duy-bao-mat-khi-viet-code | Beginner | Threat modeling (mô hình hoá mối đe doạ) cơ bản, least privilege, defense in depth, fail securely, khung OWASP Top 10 dùng tham chiếu xuyên suốt bundle |
| 2 | secure-logging-va-error-handling | Beginner | Tránh rò rỉ dữ liệu nhạy cảm qua log/error message |
| 3 | injection-va-input-validation | Beginner | SQL/NoSQL/command injection, parameterized query, allowlist validation |
| 4 | file-upload-va-path-traversal | Beginner | Validate extension/MIME, path traversal qua filename, lưu trữ file an toàn |
| 5 | xss-va-output-encoding | Beginner | Reflected/stored/DOM XSS, output encoding theo ngữ cảnh, sink đặc thù React/Vue, CSP cơ bản |
| 6 | client-side-state-va-secret-boundary | Beginner | Dữ liệu nào lưu ở đâu trên trình duyệt thì script nào cũng đọc được, build-time env var bị lộ vào bundle FE, source map leak, postMessage an toàn, "ẩn UI không phải authorization" |
| 7 | authentication-an-toan | Intermediate | Password hashing (bcrypt/argon2), session management |
| 8 | brute-force-va-rate-limiting-mfa | Intermediate | Rate limiting/lockout ở tầng code, MFA cơ bản (TOTP) |
| 9 | jwt-va-token-security | Intermediate | alg=none, weak secret, trade-off localStorage vs cookie HttpOnly, refresh token rotation |
| 10 | authorization-va-access-control | Intermediate | Broken access control, IDOR, privilege escalation (giỏ hàng/đơn hàng người khác) |
| 11 | mass-assignment-va-business-logic-flaws | Intermediate | Over-posting, race condition/TOCTOU khi checkout, price/coupon tampering |
| 12 | csrf-va-cors | Intermediate | CSRF token, SameSite cookie, cấu hình CORS an toàn (cả góc nhìn từ frontend) |
| 13 | csp-sri-va-kiem-soat-third-party-script | Intermediate | CSP nonce/strict-dynamic, frame-ancestors (chống clickjacking), SRI cho CDN script, kiểm soát third-party script |
| 14 | quan-ly-secret-trong-code | Intermediate | Hardcoded credentials, .env, secret scanning, inject secret an toàn vào runtime |
| 15 | cryptography-ung-dung | Advanced | Mã hoá dữ liệu nhạy cảm ở tầng code, sai lầm thường gặp (ECB, tự chế thuật toán) |
| 16 | deserialization-khong-an-toan | Advanced | Rủi ro deserialize dữ liệu không tin cậy |
| 17 | ssrf | Advanced | SSRF qua validate URL, open redirect liên quan |
| 18 | dependency-security | Advanced | SCA (software composition analysis), supply chain risk (cả server-side lẫn client-side) |
| 19 | security-code-review-va-threat-modeling | Advanced (capstone) | SAST cơ bản, checklist security code review, tự thiết kế threat model cho một tính năng mới |
| 20 | xac-thuc-uy-quyen-giua-cac-service | Mở rộng: Microservice | Zero trust nội bộ (không tin request chỉ vì nó tới từ service khác trong hệ thống), token propagation, service credential quản lý trong code, confused deputy |
| 21 | bao-mat-message-event-payload | Mở rộng: Microservice | Validate schema message không tin cậy, sign/verify payload (HMAC), idempotent consumer, replay attack |
| 22 | ro-ri-du-lieu-qua-tracing-va-log-tong-hop | Mở rộng: Microservice | Rò rỉ dữ liệu nhạy cảm qua trace context/correlation ID, log tổng hợp giữa nhiều service |

**Thực chiến:** `examples/` sẽ chứa một project "vulnerable-then-fixed" — một e-commerce API + frontend cố tình chứa các lỗ hổng đã học (before), kèm bản đã sửa (after) — và một ví dụ minh hoạ ngắn khi hệ thống được tách thành microservice cho phần Mở rộng.

## Ghi chú phạm vi quan trọng

- Mỗi khi một chương chạm tới ranh giới hạ tầng (ví dụ: chương 20 nhắc tới mTLS, chương 21 nhắc tới message broker, chương 13 nhắc tới CDN), chương đó sẽ nói rõ phần hạ tầng tương ứng KHÔNG được dạy ở đây, chỉ nhắc như liên kết.
- "Mở rộng: Microservice" là một giai đoạn riêng biệt, tách khỏi Advanced — vì đây là thay đổi giả định kiến trúc (từ một service duy nhất sang nhiều service gọi lẫn nhau), không đơn thuần là "khó hơn".
