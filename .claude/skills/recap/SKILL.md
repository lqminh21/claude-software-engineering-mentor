---
name: recap
description: Ghi lại phiên học vừa rồi vào sổ học tập của topic và đồng bộ lên remote, để phiên sau hoặc máy khác không mất ngữ cảnh. Chỉ kích hoạt khi người dùng gõ /recap.
---

# Skill: recap

## Khi nào dùng

Chỉ khi người dùng gọi rõ ràng `/recap`. Họ gõ lệnh này khi kết thúc một phiên học — không có tín hiệu nào khác cho biết phiên đã kết thúc, nên đừng tự chạy skill này ở giữa cuộc hội thoại.

Ghi **mọi** phiên được gõ lệnh, kể cả phiên trôi qua êm đẹp không có gì đặc biệt. Một entry "hôm nay học xong chương 03, không có gì vướng" vẫn có giá trị: nó cho biết ngày bạn học lần cuối, và cho biết chương 03 đã được nhìn tới.

## Việc skill này làm

Đọc lại cuộc hội thoại của phiên hiện tại, ghi một entry vào `topics/<topic>/.recap/LEARNING-JOURNAL.md`, rồi commit và đồng bộ lên remote.

Bundle chỉ lưu **kết quả**: một file lesson tồn tại nghĩa là chương đó đã xong, roadmap chỉ giữ quyết định cuối cùng. Không chỗ nào lưu **quá trình** — bạn đã làm gì trong buổi nào, hiểu sai gì rồi sửa ra sao, phương án nào từng được cân nhắc rồi loại. Đó là phần sổ học tập giữ lại, và là thứ duy nhất đi được sang phiên sau hoặc máy khác.

## Bước 1 — Xác định topic

Suy ra từ cuộc hội thoại vừa rồi: phiên này làm việc với thư mục nào trong `topics/`. Nếu hội thoại chạm vào nhiều topic, hoặc không đủ căn cứ để chắc chắn, hỏi người dùng thay vì đoán — ghi vào sổ của topic sai còn tệ hơn không ghi.

## Bước 2 — Viết entry

Tạo file kèm frontmatter `created_at: <ngày hiện tại>` nếu chưa có. Entry mới **thêm vào cuối**, không sửa entry cũ.

Mỗi entry hai phần. Phần đầu bắt buộc, phần sau có thể trống:

```markdown
## 2026-08-04 — Chương 02: Tính đóng gói
Học xong chương 02 và viết file lesson. Làm bài tập 01, chưa nộp.

Đáng lưu:
- Ngộ nhận ban đầu: encapsulation = để mọi field private. Backend Engineer
  chỉ ra thiếu invariant enforcement — một class có đủ getter/setter cho
  từng field thì vẫn đặt được trạng thái sai từ bên ngoài. Đã sửa lại:
  encapsulation là bảo vệ điều kiện luôn phải đúng của object.
- Cân nhắc dạy interface trước abstract class, đã loại: người học chưa gặp
  bài toán đa kế thừa nên chưa thấy interface giải quyết vấn đề gì.
```

```markdown
## 2026-08-06 — Ôn chương 01, 02
Ôn lại hai chương qua /recall, giải thích được cả hai. Không có gì mới.
```

**Phần đầu — đã làm gì.** Một đến ba câu, cụ thể: học chương nào, ôn chương nào, làm bài tập nào, dựng project nào. Đây là phần cho biết ngày và phạm vi, nên luôn phải có.

**Phần "Đáng lưu"** — chỉ ghi khi phiên đó thật sự phát sinh một trong ba loại sau. Không có thì bỏ hẳn mục này, đừng viết "không có gì đáng lưu" cho đủ cấu trúc:

1. **Ngộ nhận đã được sửa** — người học phát biểu một cách hiểu, bị phản biện, rồi tự điều chỉnh. Ghi cả ba phần: hiểu sai ban đầu, phản biện chỉ ra điều gì, hiểu đúng cuối cùng. Chỉ ghi khi họ đã thật sự phản hồi lại phản biện; im lặng nghe thì chưa có gì để ghi.
2. **Quyết định có phương án bị loại** — ghi phương án bị loại **kèm lý do loại**. Đây là loại thông tin dễ mất nhất: tài liệu chỉ ghi phương án được chọn, nên vài tuần sau không ai còn biết vì sao hướng kia bị bỏ, và câu hỏi đó sẽ được đặt lại từ đầu.
3. **Câu hỏi lặp lại** — người học hỏi lại một câu đã hỏi trước đó trong cùng topic. Ghi chính câu hỏi đó; nó là dấu hiệu chỗ này giải thích chưa đủ, không phải dấu hiệu người học kém tập trung.

Viết bằng tiếng Việt, ngắn, cụ thể. Tránh câu chung chung kiểu "người học đã hiểu rõ hơn về OOP" — entry như vậy không giúp được phiên sau. Mỗi dòng trong "Đáng lưu" phải trả lời được: sai ở đâu, đúng là gì, hoặc loại gì và vì sao.

Ngày lấy theo ngữ cảnh phiên làm việc hiện tại.

## Bước 3 — Commit và đưa bundle lên remote

```bash
git add topics/<topic>
git commit -m "<mô tả việc vừa học, kèm chương/bài tập nếu có>"
git push origin HEAD
```

Commit cả những thay đổi khác trong bundle của phiên này — file lesson vừa viết, đề bài vừa tạo, bài làm và review — không chỉ riêng sổ học tập. Bài làm trong `my-work/` cũng phải được commit; nếu nó bị `.gitignore` chặn thì báo cho người dùng, vì khi đó tiến trình học sẽ sang máy khác ở trạng thái nửa vời: có ghi chú nhưng không có bài làm.

Nếu môi trường không cho phép `git push`, đưa lệnh đó cho người dùng tự chạy và nói rõ commit chưa lên remote.

Cuối cùng báo lại ngắn gọn: đã ghi gì, đã commit gì, đã đồng bộ chưa.
