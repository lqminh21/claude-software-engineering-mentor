# Viết tiếng Việt kỹ thuật — dùng chung

Áp dụng cho mọi câu tiếng Việt mà agent trong `../agents/` hoặc luồng `/learn` sinh ra: viết nội dung mới, biên tập nội dung có sẵn, và viết lời review. Thước đo duy nhất: một junior đọc một lượt là làm được, không phải vừa đọc vừa đoán ý.

## 1. Gọi đúng tên khái niệm, đừng thay bằng từ phổ thông

Dùng đúng thuật ngữ chuyên ngành: "race condition", không phải "lỗi khi chạy cùng lúc"; "idempotent", không phải "an toàn khi gọi lại nhiều lần". Từ phổ thông nghe dễ hơn, nhưng nó chỉ tới nhiều tình huống hơn khái niệm thật: "lỗi khi chạy cùng lúc" còn có thể là deadlock, là quá tải kết nối, là nhiều thứ khác. Người đọc đem cụm từ đó đi tra cứu hoặc đi hỏi đồng nghiệp sẽ không tìm được đúng thứ họ cần.

Thuật ngữ lạ với người đọc thì giải nghĩa bằng ví dụ cụ thể, không né bằng cách diễn đạt vòng vo. Mục này cấm gỡ bỏ thuật ngữ để thay bằng từ phổ thông; mục 2 cấm dịch thuật ngữ theo từng chữ. Hai mục chặn hai hướng ngược nhau nên không mâu thuẫn.

## 2. Mô tả cơ chế, đừng dịch ẩn dụ

Nhiều ẩn dụ tiếng Anh đã dùng lâu tới mức trở thành thuật ngữ cố định, đọc là hiểu ngay. Dịch từng chữ thì người đọc tiếng Việt lại phải hiểu chúng theo nghĩa đen, tức thêm một bước giải nghĩa. Thay bằng cơ chế mà ẩn dụ đó mô tả, dù dài hơn:

| Gốc tiếng Anh | Dịch bám chữ — sai | Mô tả cơ chế — đúng |
|---|---|---|
| `an arbitrary file-read primitive` | "một nguyên thuỷ đọc tệp tuỳ ý" | "khả năng đọc tuỳ ý mọi tệp trên máy người dùng" |
| `hot state in context` | "state nóng trong context" | "state thay đổi liên tục — mỗi lần gõ phím, mỗi lần kéo chuột — đặt trong context" |
| `split along that seam` | "tách theo đường nối đó" | "tách theo ranh giới giữa hai nhóm export đó" |
| `blast radius` | "bán kính ảnh hưởng" | "phạm vi những chỗ khác bị thay đổi này kéo theo" |

Bảng trên không liệt kê hết được. Nhận ra một ẩn dụ chưa có trong bảng bằng hai dấu hiệu: bạn thấy cần đặt cụm từ vừa dịch vào trong ngoặc kép, hoặc bạn phải đọc lại câu tiếng Anh thì mới hiểu được bản dịch do chính mình viết ra.

## 3. Giữ nguyên tiếng Anh khi dịch làm mất chức năng

| Loại | Ví dụ | Cách xử lý |
|---|---|---|
| **Định danh mà hệ thống khác trích dẫn** | khoá và giá trị frontmatter (`difficulty: Beginner`, `verdict`), tên agent trong Bảng agent theo domain | Giữ nguyên tiếng Anh, và thêm vào chính file đang soạn một câu khai báo rằng giá trị này luôn viết nguyên văn tiếng Anh. Thiếu câu khai báo đó thì người viết file sau sẽ gõ `difficulty: Người mới` trong khi file trước ghi `difficulty: Beginner`, và bước đối chiếu tiến độ đọc hai file ra hai kết quả khác nhau. |
| **Code và comment bên trong code** | `// the type is the guarantee` | Giữ nguyên tuyệt đối, kể cả khi văn bản bao quanh là tiếng Việt. Dịch comment làm code mẫu lệch khỏi code thật trong repo. |
| **Thuật ngữ chưa có tương đương ổn định** | transport, hunk, call site, payload, idempotent | Giữ nguyên, giải nghĩa ở lần dùng đầu trong mỗi file, chèn giữa hai gạch ngang: "với từng hunk — từng khối thay đổi liền mạch trong diff — …" |

## 4. Một từ, một nghĩa

Trước khi chốt một từ dịch, `grep` toàn bộ tài liệu (trong `/learn` là toàn bộ bundle đang xây). Nếu từ đó đang mang nghĩa khác ở chỗ khác, đổi một trong hai. Nhất quán quan trọng hơn chọn được từ hay nhất.

## 5. Ngưỡng tường minh

Đọc lại câu vừa viết và tự hỏi bốn câu dưới đây thay cho một junior. Nếu một câu hỏi trong đó không tìm được câu trả lời ngay trong câu văn, thì câu văn đó chưa đạt và phải viết lại.

- **"Cụ thể tôi phải làm gì?"** — câu nêu trạng thái mong muốn mà không nêu hành động, hoặc nêu hành động mà không nói tác động lên cái gì.
  *"Cả hai cổng đều bắt buộc."* → *"Tới hai cổng này phải dừng hẳn, trình bày phương án, và chờ người phụ trách trả lời rồi mới đi tiếp."*

- **"Bao nhiêu thì đủ, khi nào thì dừng?"** — câu nêu một mức độ mà không kèm con số hay điều kiện quan sát được, nên người đọc không tự kiểm tra được mình đã đạt hay chưa.
  *"Đừng trừu tượng hoá quá sớm."* → *"Đếm được hai bên gọi thật rồi mới trừu tượng hoá."*

- **"Từ này nghĩa là gì?"** — thuật ngữ dùng lần đầu mà chưa giải nghĩa, hoặc một từ đang mang nghĩa khác ở chỗ khác trong cùng tài liệu.
  *"Với từng hunk đã thay đổi…"* → *"Với từng hunk — từng khối thay đổi liền mạch trong diff — …"*

- **"Rồi sao, hỏng thì hỏng thế nào?"** — câu nêu vấn đề bằng tính từ đánh giá (khó bảo trì, không tốt, mong manh) thay vì bằng sự cố cụ thể sẽ xảy ra.
  *"Log thiếu ngữ cảnh thì khó debug."* → *"Một rejection được log mà không kèm order id thì lúc 3 giờ sáng không ai biết khách hàng nào chưa nhận được email."*

## 6. Giọng văn và định dạng

Trung tính, câu chủ động, chủ ngữ rõ. Không khẩu ngữ, không văn hoa.

Ngắt dòng theo đúng độ rộng mà file đang dùng — đo bằng cách nhìn các đoạn văn sẵn có, đừng tự đặt một con số mới. Nếu bạn ngắt theo độ rộng khác, thì chỉ sửa hai chữ cũng làm toàn bộ đoạn văn hiện lên như đã thay đổi trong `git diff`, và người review không tách được đâu là sửa nội dung, đâu chỉ là xuống dòng lại. Code, bảng và frontmatter không áp dụng quy tắc này.

Cụm tiếng Việt gần như luôn dài hơn cụm tiếng Anh nó thay thế, nên thay chuỗi xong phải ngắt dòng lại cả đoạn. Không làm vậy thì đoạn văn còn lại một dòng dài vượt quá độ rộng và một dòng chỉ có vài chữ. Đổi tiêu đề thì cập nhật mọi tham chiếu chéo trong cùng lần sửa.

## 7. Sửa xong, review hai lượt

Áp dụng khi vừa biên tập một file có sẵn — không cần cho một đoạn hội thoại ngắn.

**Lượt 1 — chỉ đọc phần vừa sửa.** Tìm lỗi do chính thao tác sửa gây ra: dòng dài vượt độ rộng và dòng chỉ có vài chữ như mục 6 mô tả, câu mất chủ ngữ sau khi cắt ghép, ý vừa thêm trùng với câu ngay kế bên, tham chiếu chéo trỏ vào một tiêu đề đã đổi tên hoặc một số thứ tự mục đã thay đổi.

**Lượt 2 — đọc lại toàn bộ tài liệu từ đầu.** Lượt 1 chỉ nhìn được những chỗ bạn đã mở ra để sửa, nên có hai loại lỗi nó không thể thấy:

- *Cùng một lỗi, ở những chỗ bạn chưa mở.* Một lỗi mang tính hệ thống — chẳng hạn dịch ẩn dụ theo nghĩa đen — thì gần như chắc chắn còn lặp lại ở các file chưa đọc tới. Vì vậy lượt 2 đi tìm theo *loại lỗi* vừa phát hiện, không đi tìm lại từng từ đã sửa.
- *Hai mục quy định mâu thuẫn nhau, nằm cách nhau vài chục dòng.* Ví dụ: một mục cấm dùng khẩu ngữ, mục khác lại tự viết "soi" và "bắt được gì". Đọc riêng từng mục thì mục nào cũng đạt; chỉ khi đọc liền một mạch từ đầu mới thấy mục sau đang vi phạm mục trước.

Báo cáo lượt nào phát hiện điều gì. Không có thì nói không có.
