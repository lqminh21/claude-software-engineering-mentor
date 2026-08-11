---
created_at: 2026-08-10
---

## 2026-08-10 — Scaffold bundle & thiết kế roadmap 24 chương

Tạo branch `lqminh21/topics/fullstack-interview-prep`, cùng phác thảo roadmap ôn phỏng vấn Fullstack qua nhiều vòng chỉnh sửa, gửi Instructional Designer phản biện Bloom/tải nhận thức, rồi scaffold `00-README.md` (24 chương, không có `exercises/`/`my-work/`).

Đáng lưu:
- Quyết định: bundle này độc lập hoàn toàn, không merge/kế thừa từ các bundle mastery đã có (`message-brokers`, `nodejs-project-architecture`, `application-security`, `api-types`) dù trùng domain — lý do: mục đích là ôn tập chắt lọc cho phỏng vấn, không phải mastery track đầy đủ.
- Quyết định: gộp toàn bộ stack (backend/frontend/database/message broker/cloud) vào 1 bundle duy nhất thay vì tách theo domain — cùng lý do trên, tránh biến thành nhiều track mastery song song.
- Instructional Designer phản biện 🔴: chương gộp Event Loop + hiệu năng + kiến trúc NestJS/Express, và chương gộp RabbitMQ + Kafka + Redis Pub/Sub quá tải khái niệm (~9-12 khái niệm/chương, ngưỡng an toàn là 3-5) — đã tách mỗi cụm thành 2 chương riêng, dời Redis Pub/Sub về chung nhà với chương Redis caching.

## 2026-08-12 — Chương 01: TypeScript cho phỏng vấn

Dạy xong Chương 1 qua hỏi-đáp Socratic liên tục, viết file lesson `01-typescript-cho-phong-van.md`, cập nhật giới hạn nội dung Ch1 và link chương trong `00-README.md`.

Đáng lưu:
- Ngộ nhận lặp lại 2 lần cùng gốc ở generic: lần 1 viết `type Identity<T> = (param: T) => T` rồi `const identity: Identity<number> = ...` — tưởng vậy vẫn generic, thực ra `T` bị chốt cứng = `number` ngay tại chỗ khai báo biến, hàm không còn nhận được string. Lần 2 lặp lại y hệt lỗi đó ở bài `getProperty`: dùng `p2: keyof T` và return `T`/`T[keyof T]` — tưởng đúng nhưng đây vẫn là union cố định (`number | string`), không phân biệt theo từng lời gọi. Đã sửa: generic parameter phải nằm ở call signature (mỗi lời gọi tự suy `T` riêng), và với bài toán 2 biến — cần generic thứ hai `K extends keyof T`, return `T[K]`. Đáng nhớ cho các chương sau: khi người học tưởng đã generic hoá nhưng vẫn "chốt cứng 1 kiểu duy nhất tại chỗ khai báo", đó là dấu hiệu hiểu sai gốc này, không phải lỗi cú pháp vụn.
- Ngộ nhận đã sửa: cho rằng exhaustiveness check bằng `never` trong `switch` (`const _exhaustiveCheck: never = props`) là "code smell vì thêm dòng vô nghĩa về mặt logic". Quality Engineer phản biện: nhầm giữa "runtime-meaningless" và "purposeless" — dòng đó không làm gì lúc chạy nhưng mua lại một đảm bảo ở tầng compile-time, giống `assert()`; cái thật sự đáng gọi smell là LẶP LẠI pattern này ở nhiều switch, không phải bản thân kỹ thuật. Người học đồng ý, chốt hướng sửa bằng cách factor hàm chung `assertNever(x: never): never`.
