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

## 2026-08-06 — Chương 01: Class, Object, Encapsulation (đã dạy, chưa viết file lesson)
Dạy xong nội dung chương 01 qua hội thoại và vượt chất vấn của Software Architect. Chốt ngôn ngữ code cho cả bundle là TypeScript, chạy bằng Node 24 (type-stripping sẵn có, không cài thêm gì). Dựng thư mục `scratch/chuong-01-encapsulation/` gồm file minh hoạ 5 ca đọc dữ liệu, file bài tập khung, và README. Chưa viết `01-*.md`, người học chưa làm bài tập.

Đáng lưu:
- Phát biểu invariant ban đầu ở dạng thao tác ("thêm item thì phải cập nhật total") — điểm yếu là mỗi thao tác mới lại cần một quy tắc mới, không nói gì về removeItem hay `order.total = 0`. Đã sửa sang dạng điều kiện luôn đúng về dữ liệu: "total luôn bằng tổng unitPrice × qty trên mọi item".
- Lý do chọn getter cho `total` ban đầu có một vế sai: "tách field ra sẽ conflict với `get total`". Đó là chuyện đặt tên (`_total` là hết), không phải đánh đổi thiết kế. Vế đúng còn lại: lưu field thì mọi mutator phải nhớ cập nhật, getter thì không tồn tại trạng thái nào để lệch.
- Software Architect lật ngược lập luận getter: nếu `total` là sự kiện đã xảy ra (đơn đã đặt) chứ không phải dữ liệu suy diễn (giỏ hàng), thì tính lại từ giá sống mới là cái phá invariant. Giải quyết bằng price snapshot — chốt `unitPrice` vào `Item` lúc addItem, giữ nguyên getter.
- Ngộ nhận chính đã sửa: chọn **deep copy** để chặn `getItems().push(...)`. Phản biện chỉ ra deep copy nằm cùng nhóm với chính mối đe doạ người học tự định nghĩa ("sai logic nhưng không có log") — nó nuốt thao tác sai trong im lặng, người gọi tin là mình đã sửa đơn hàng. Đã đổi sang `readonly` hai tầng (field readonly + kiểu trả về `readonly Item[]`): báo đỏ lúc compile, miễn phí lúc chạy.
- Quy tắc rút ra từ 5 ca caller: "mặc định là trả lời câu hỏi, không đưa dữ liệu; chỉ đưa dữ liệu khi câu hỏi không thể biết trước". Nhóm A (hiển thị, cân nặng, tồn kho) → kiểu trả về hẹp riêng cho từng nhu cầu. Nhóm B (khuyến mãi tự lọc) → mới cần `readonly Item[]`. Ca persistence tách riêng, ba hướng đều có giá, để lại chương 14.
- Loại việc viết test cho chương này. Lý do: phòng thủ của thiết kế nằm ở compile-time, `readonly`/`private` bị xoá trước khi test chạy — hai thứ đáng kiểm nhất thì test runtime không với tới. Thay bằng khối 4 dòng vi phạm để comment sẵn trong file, uncomment ra xem editor báo đỏ.
- Loại thư mục `my-work/practice/` cho code nháp trong lúc học, vì trùng chỗ với bài nộp `my-work/NN-{bai-tap}/attempt-N/`. Chốt `scratch/` ở gốc bundle, tách hẳn khỏi cả `exercises/` lẫn `my-work/`.
