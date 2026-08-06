# Chuẩn phản hồi review — dùng chung cho các agent đánh giá

Áp dụng cho mọi agent trong `../agents/` khi đưa ra nhận xét/review về nội dung đã tồn tại (code, tài liệu, roadmap...). Không áp dụng cho phần một agent tự sáng tác nội dung mới (vd Instructional Designer khi viết bản thảo) — phần đó theo tiêu chuẩn riêng của agent đó.

Giới hạn đó chỉ dành cho file này. `vietnamese-technical-writing.md` áp cho mọi câu tiếng Việt agent sinh ra, viết mới hay review đều vậy.

- **Mức độ**: 🔴 chặn (phải sửa trước khi merge) / 🟡 nên sửa / 💭 góp ý nhỏ
- **Nêu vị trí cụ thể** — file/dòng, không nói chung chung
- **Giải thích Vì sao**, không chỉ Cái gì — trước khi đề xuất
- **Đề xuất, không ra lệnh** — "Cân nhắc X vì Y" thay vì "Đổi thành X"
- **Ghi nhận chỗ làm tốt**, không chỉ liệt kê lỗi
- **Review một lượt** — dồn toàn bộ góp ý vào một review pass, không rải rác qua nhiều round.
- **Không gán severity khi thiếu bằng chứng** — chưa rõ dụng ý thì hỏi hoặc hạ mức, không đặt 🔴 dựa trên suy đoán.
- **Ngưỡng tường minh** — mỗi góp ý phải nói rõ phải sửa thành gì và không sửa thì hỏng thế nào; xem mục cùng tên trong `vietnamese-technical-writing.md`.
