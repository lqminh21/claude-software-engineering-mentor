---
created_at: 2026-08-04
---

# OOP Design Principles & Architecture

## Mục tiêu bundle

Sau khi hoàn thành bundle này, bạn có thể:

- Thiết kế class/object đúng nguyên tắc hướng đối tượng (OOP) thay vì chỉ viết code chạy được.
- Áp dụng SOLID để code chịu được thay đổi nghiệp vụ mà không phải sửa lại những gì đã chạy ổn.
- Nhận diện code smell và refactor có chủ đích, thay vì sửa theo cảm tính.
- Chọn đúng design pattern cho đúng vấn đề — không dùng pattern vì "nghe có vẻ chuyên nghiệp".
- Áp dụng DRY, KISS, YAGNI, Composition over Inheritance để tránh cả hai thái cực: code trùng lặp lộn xộn và code bị over-engineer.
- Tách một hệ thống thành các lớp (layer) theo Clean Architecture, biết khi nào việc tách lớp là cần thiết và khi nào là dư thừa.
- Thiết kế code có khả năng kiểm thử (testable) ngay từ đầu, không phải chắp vá test sau cùng.

## Ví dụ nghiệp vụ xuyên suốt

**Hệ thống quản lý đơn hàng của một sàn thương mại điện tử** — từ giỏ hàng → đặt hàng → tính giá/khuyến mãi → thanh toán → vận chuyển → thông báo khách hàng.

Model trung tâm là `Order`, được xây dựng dần qua từng chương thay vì đưa ra đầy đủ ngay từ đầu:

| Chương giới thiệu | Field/khái niệm thêm vào `Order` |
|---|---|
| Chương 1 | `id`, danh sách sản phẩm (`items`), tổng tiền |
| Chương 2 | Địa chỉ giao hàng, nhà vận chuyển |
| Chương 4-7 | Mã khuyến mãi, cách tính giảm giá |
| Chương 6 | Thông tin thanh toán (qua abstraction, không phải class cụ thể) |
| Chương 9 | Trạng thái đơn hàng (pending, paid, shipped, delivered...) |

Toàn bộ ví dụ minh hoạ trong các chương lý thuyết đều xoay quanh hệ thống này. Đến giai đoạn Thực chiến, project trong `examples/` sẽ là bản hoàn chỉnh, chạy được, gộp toàn bộ những gì đã học.

## Giai đoạn & bảng chương

### Giai đoạn 1 — Beginner (Understand)

| # | Chương | Nội dung chính |
|---|---|---|
| 1 | [Nền tảng OOP](01-oop-foundations.md) | Bản đồ bốn thuộc tính (abstraction, encapsulation, inheritance, polymorphism); object; information hiding; class invariant; representation exposure — `Order` tối giản (id, items, tổng tiền) |
| 2 | OOP nâng cao | Inheritance vs Interface, Polymorphism qua ví dụ nhà vận chuyển |
| 3 | Clean Code cơ bản | Đặt tên, hàm nhỏ, tránh side effect — áp dụng cho hàm tính tổng đơn hàng; Command-Query Separation |

### Giai đoạn 2 — Intermediate (Apply/Analyze)

| # | Chương | Nội dung chính |
|---|---|---|
| 4 | SOLID: SRP & OCP | Tách `OrderManager` (God Class) thành các class nhỏ; thêm loại khuyến mãi mới không sửa code cũ; anemic domain model, Law of Demeter, entity vs value object |
| 5 | SOLID: LSP & ISP | Thay thế nhà vận chuyển đúng hợp đồng; tách interface thông báo theo kênh (email/SMS); Design by Contract — precondition/postcondition |
| 6 | SOLID: DIP | Phụ thuộc vào abstraction thanh toán thay vì concrete class — nền tảng trực tiếp cho Testability (chương 12) |
| 7 | DRY, KISS, YAGNI | Loại bỏ trùng lặp logic tính giảm giá, tránh over-engineer khi chưa cần; make illegal states unrepresentable |
| 8 | Composition over Inheritance & Strategy Pattern | Motivate composition trước, rồi dùng Strategy cho tính phí ship/giảm giá |
| 9 | Factory & Observer Pattern | Tạo đơn hàng theo loại (kèm named constructor); thông báo thay đổi trạng thái đơn hàng |
| 10 | Adapter & Decorator Pattern | Tích hợp cổng thanh toán bên thứ 3; gói quà/phụ phí |
| 11 | Code Smells & Refactoring | Nhận diện & sửa smell mới phát sinh sau chương 8-10 (Duplicated Code giữa các Strategy, Long Method trong NotificationService) |

### Giai đoạn 3 — Advanced (Evaluate/Create)

| # | Chương | Nội dung chính |
|---|---|---|
| 12 | Testability & Dependency Injection | So sánh constructor injection/factory/service locator; test domain logic không cần DB/payment gateway thật |
| 13 | Đánh giá kiến trúc | Khi nào cần tách layer, khi nào là over-engineering — đánh đổi giữa các lựa chọn; leaky abstraction; CQRS; phê phán OOP (data-oriented design, expression problem) |
| 14 | Clean Architecture / Layered Architecture | Capstone: dựng domain – application – infrastructure – presentation hoàn chỉnh; ba hướng cho persistence và bài toán versioning |

### Giai đoạn 4 — Thực chiến

Project ví dụ hoàn chỉnh tại `examples/` áp dụng toàn bộ OOP + SOLID + patterns + Clean Architecture + testable, kèm bài tập thực hành trong `exercises/`.
