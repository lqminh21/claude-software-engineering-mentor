---
name: recall
description: Buổi ôn nhanh dựa trên những gì đã ghi trong sổ học tập của topic — bắt người học tự nhớ lại trước khi xem đáp án. Kích hoạt khi người dùng gõ /recall, hoặc khi họ đồng ý ôn sau lời nhắc khoảng nghỉ.
---

# Skill: recall

## Khi nào dùng

Khi người dùng gõ `/recall`, hoặc khi họ đồng ý sau lời nhắc "bạn nghỉ N ngày, ôn trước không".

Không tự bắt đầu ôn khi người dùng đang muốn học chương mới. Hỏi một câu, chờ họ đồng ý.

## Skill này không giữ trạng thái nào

Nguồn duy nhất là `topics/<topic>/.recap/LEARNING-JOURNAL.md`. Không có file lịch, không có bảng hạn ôn, không ghi nhãn đạt/chưa đạt.

Nếu buổi ôn phát sinh điều đáng lưu — người học hiểu sai bản chất, không phải quên chi tiết — thì đường ghi vẫn là `/recap` như mọi phiên khác. Skill này chỉ đọc.

Lý do không tự dựng lịch: một hệ thống xếp hạn ôn cần giữ đúng trạng thái của từng chương qua từng buổi, và trạng thái đó chỉ để trả lời một câu hỏi mà sổ học tập đã trả lời được — lần cuối chương này được nhìn tới là khi nào.

## Nguyên tắc: bắt nhớ lại trước, xem đáp án sau

Đọc lại một chương không làm kiến thức bền hơn — nó chỉ tạo cảm giác quen thuộc, và cảm giác đó khiến người học tưởng mình đã nắm. Cái làm kiến thức bền là **tự lôi nó ra khỏi đầu khi chưa nhìn tài liệu**, kể cả khi lôi ra sai.

Nên trình tự luôn là: đặt câu hỏi → chờ người học trả lời bằng lời của họ → **rồi mới** đối chiếu với nội dung chương. Không bao giờ đưa đáp án trước, không bao giờ tóm tắt chương rồi hỏi "đúng không".

Sai là kết quả hữu ích. Một câu trả lời sai chỉ ra chính xác chỗ cần ôn, còn "tôi nhớ mà không diễn đạt được" nghĩa là chưa nhớ.

## Bước 1 — Chọn nội dung ôn

Đọc sổ học tập của topic. Nếu file không tồn tại, nói thẳng là chưa có gì để ôn vì `/recap` chưa từng chạy, và dừng — đừng tự chọn chương từ danh sách file, vì khi đó không biết chương nào đã được nhìn lại rồi.

Ưu tiên theo thứ tự:

1. **Các điểm trong mục "Đáng lưu"** — đây là chỗ đã biết chắc là yếu, ghi lại bởi chính người học ở phiên trước. Ưu tiên điểm cũ hơn và điểm xuất hiện nhiều lần.
2. **Chương lâu nhất chưa xuất hiện trong entry nào** — chương được học từ lâu và không được nhắc lại kể từ đó.

Tối đa **3 điểm** một buổi. Đây là buổi ôn nhanh, không phải học lại. Nhiều hơn thì người học trả lời cho xong thay vì thật sự nhớ lại, và buổi ôn dài sẽ khiến họ tránh gõ `/recall` lần sau.

Nói rõ ngay từ đầu sẽ ôn những gì, để người học biết buổi này dài bao lâu.

## Bước 2 — Ôn từng điểm

Đọc file lesson liên quan để biết nội dung, nhưng **không** hiển thị nó ra.

Đặt 1–2 câu hỏi mỗi điểm, đòi giải thích hoặc áp dụng, không đòi nhắc lại định nghĩa:

| Câu hỏi yếu | Câu hỏi tốt |
|---|---|
| "Encapsulation là gì?" | "Một class có mọi field private và đủ getter/setter cho từng field — nó đã encapsulate chưa? Vì sao?" |
| "Kể tên bốn trụ cột OOP" | "Trong ví dụ đơn hàng ở chương này, bỏ polymorphism đi thì code phải thay đổi thế nào?" |

Câu hỏi dạng thứ hai không trả lời được bằng cách nhớ mặt chữ.

Với điểm lấy từ "Đáng lưu" là một ngộ nhận cũ, đặt câu hỏi nhắm đúng vào chỗ từng sai — nhưng **không** nhắc lại rằng họ đã từng sai ở đó trước khi họ trả lời. Nhắc trước là đưa gợi ý, và câu trả lời sau đó không cho biết họ đã nắm hay chỉ đang nhớ lời cảnh báo.

Sau khi người học trả lời, đối chiếu với nội dung chương và nói rõ: đúng phần nào, thiếu phần nào, sai phần nào. Nếu họ dùng sai thuật ngữ, sửa ngay — nhớ sai tên khái niệm sẽ gây hiểu sai ở các chương sau.

## Bước 3 — Kết thúc

Tổng kết ngắn: đã ôn những gì, chỗ nào còn chưa vững.

Nếu buổi ôn cho thấy một ngộ nhận vẫn còn — hoặc lộ ra một ngộ nhận mới — nhắc người dùng gõ `/recap` để nó được ghi vào sổ. Đó là cách duy nhất `/weakspot` biết được khái niệm này đã sai lần thứ mấy.

Không tự ghi file, không tự commit.
