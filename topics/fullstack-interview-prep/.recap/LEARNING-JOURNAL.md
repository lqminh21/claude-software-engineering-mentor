---
created_at: 2026-08-10
---

## 2026-08-10 — Scaffold bundle & thiết kế roadmap 24 chương

Tạo branch `lqminh21/topics/fullstack-interview-prep`, cùng phác thảo roadmap ôn phỏng vấn Fullstack qua nhiều vòng chỉnh sửa, gửi Instructional Designer phản biện Bloom/tải nhận thức, rồi scaffold `00-README.md` (24 chương, không có `exercises/`/`my-work/`).

Đáng lưu:
- Quyết định: bundle này độc lập hoàn toàn, không merge/kế thừa từ các bundle mastery đã có (`message-brokers`, `nodejs-project-architecture`, `application-security`, `api-types`) dù trùng domain — lý do: mục đích là ôn tập chắt lọc cho phỏng vấn, không phải mastery track đầy đủ.
- Quyết định: gộp toàn bộ stack (backend/frontend/database/message broker/cloud) vào 1 bundle duy nhất thay vì tách theo domain — cùng lý do trên, tránh biến thành nhiều track mastery song song.
- Instructional Designer phản biện 🔴: chương gộp Event Loop + hiệu năng + kiến trúc NestJS/Express, và chương gộp RabbitMQ + Kafka + Redis Pub/Sub quá tải khái niệm (~9-12 khái niệm/chương, ngưỡng an toàn là 3-5) — đã tách mỗi cụm thành 2 chương riêng, dời Redis Pub/Sub về chung nhà với chương Redis caching.
