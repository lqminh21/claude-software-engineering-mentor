---
created_at: 2026-08-05
---

## 2026-08-05 — Dựng khung topic mới: OOP Design Principles & Architecture
Phác thảo và duyệt roadmap 14 chương (OOP → SOLID → Clean Code → nguyên tắc bổ sung → Design Patterns → Refactoring/Code Smells → Testability → Clean Architecture), chốt ví dụ nghiệp vụ xuyên suốt là hệ thống quản lý đơn hàng của một sàn thương mại điện tử. Tạo `00-README.md` và khung thư mục `examples/`, `exercises/`, `my-work/`. Chưa học chương nào.

Đáng lưu:
- Bản nháp roadmap ban đầu gộp LSP+ISP+DIP vào 1 chương và DRY+KISS+YAGNI+Composition over Inheritance vào 1 chương — bị Instructional Designer chỉ ra vượt tải nhận thức (mỗi nguyên tắc là một bài tập thiết kế riêng, không chỉ là khái niệm). Đã tách: LSP+ISP thành 1 chương, DIP thành chương riêng (vì DIP là nền tảng trực tiếp cho Testability); Composition over Inheritance dời sang mở đầu chương Strategy Pattern để motivate pattern đó, còn DRY+KISS+YAGNI giữ chung vì cùng kể một câu chuyện (loại trùng lặp, không phức tạp hoá, không thêm khả năng mở rộng chưa cần).
- Bản nháp ban đầu dựng một `OrderProcessor` giả định mới để dạy nhận diện code smell — bị loại vì đứt mạch ví dụ xuyên suốt (học viên vừa sửa xong một God Class thì lại gặp một God Class khác không liên quan). Đổi thành: dạy smell mới phát sinh ngay trên chính codebase đã xây, xuất hiện sau khi áp các pattern ở những chương liền trước.
- Chương Testability ban đầu chỉ ở mức Apply (viết test theo khuôn có sẵn) dù gắn nhãn giai đoạn Advanced/Evaluate — nâng cấp thành yêu cầu đánh giá trade-off giữa các cách inject dependency (constructor injection / factory / service locator) để khớp đúng cấp Evaluate.
- Tên topic: cân nhắc `oop-solid-clean-architecture` (loại vì chỉ nêu 3/8 mảng nội dung, bỏ sót Clean Code/Patterns/Refactoring/Testability) và `software-design-foundations` (loại vì quá chung chung, dễ đụng hàng khi có thêm topic khác sau này) trước khi chốt `oop-design-principles-and-architecture`.
