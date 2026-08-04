---
name: weakspot
description: Tổng hợp các khái niệm người học hiểu sai hoặc hỏi lại nhiều lần trên toàn bộ topic, chỉ ra chỗ nào cần học lại nghiêm túc. Kích hoạt khi người dùng gõ /weakspot, hoặc trước khi họ bắt đầu một topic mới.
---

# Skill: weakspot

## Khi nào dùng

Khi người dùng gõ `/weakspot`, hoặc khi họ chuẩn bị bắt đầu một topic hoàn toàn mới — đó là lúc hợp lý nhất để soi lại còn nợ gì trước khi mở thêm mặt trận.

Ở trường hợp thứ hai, báo cáo trước rồi hỏi họ có muốn xử lý điểm yếu trước hay bắt đầu topic mới luôn. Không tự quyết thay, và không chặn việc học topic mới.

## Việc skill này làm

Đọc `.recap/LEARNING-JOURNAL.md` của **mọi** topic trong `topics/`, tìm khái niệm xuất hiện lặp lại, và báo cáo chỗ người học chưa thật sự nắm.

Một entry recap đơn lẻ chỉ nói "hôm đó hiểu sai chỗ này, đã sửa". Nhưng cùng một khái niệm xuất hiện ở ba entry cách nhau nhiều tuần, ở hai topic khác nhau — đó là tín hiệu khác hẳn: lần sửa nào cũng chưa đủ sâu. Không nguồn nào khác trong bundle cho biết điều này, vì chỉ recap ghi lại quá trình.

## Bước 1 — Thu thập

Đọc toàn bộ `topics/*/.recap/LEARNING-JOURNAL.md`. Nếu không có file nào, nói thẳng là chưa có dữ liệu vì `/recap` chưa từng chạy, rồi dừng — đừng suy ra điểm yếu từ danh sách file hay từ nội dung lesson.

Chỉ đọc mục **"Đáng lưu"** trong mỗi entry. Dòng mô tả việc đã làm ở đầu entry không phải tín hiệu điểm yếu — "học xong chương 03" chỉ nói chương đó đã học, không nói người học vướng ở đâu. Đếm cả phần đó sẽ biến mọi chương đã học thành điểm yếu.

Với mỗi mục trong "Đáng lưu", ghi nhận: ngày, topic, chương, loại điểm (ngộ nhận đã sửa / phương án bị loại / câu hỏi lặp lại), và **khái niệm kỹ thuật** liên quan.

Khái niệm là đơn vị để đếm, không phải câu chữ. "Encapsulation chỉ là để private field" và "không rõ vì sao cần getter" cùng thuộc khái niệm *encapsulation* dù diễn đạt khác nhau. Gom theo khái niệm, không gom theo cụm từ trùng nhau.

## Bước 2 — Xếp mức độ

| Mức | Điều kiện | Ý nghĩa |
|---|---|---|
| 🔴 Cần học lại | Cùng khái niệm ≥3 lần, **hoặc** ≥2 lần ở hai topic khác nhau | Lần sửa trước chưa đủ. Xuất hiện lại ở topic khác nghĩa là sai ở nền tảng, không phải nhầm chi tiết |
| 🟡 Cần xác nhận | Cùng khái niệm 2 lần trong cùng một topic | Có thể chỉ là nhắc lại; kiểm tra bằng một câu hỏi trước khi kết luận |
| ⚪ Đã qua | Xuất hiện 1 lần | Không báo. Hiểu sai một lần rồi sửa là chuyện bình thường |

Khoảng cách thời gian quan trọng hơn số lần. Ba lần trong cùng một buổi là dấu hiệu buổi đó giải thích chưa tốt. Ba lần rải qua ba tháng là dấu hiệu khái niệm chưa vào — nặng hơn nhiều. Nêu rõ khoảng cách trong báo cáo.

## Bước 3 — Báo cáo

Báo cáo trực tiếp trong hội thoại, **không ghi file**. Đây là ảnh chụp tại một thời điểm; ghi ra file thì hôm sau nó thành dữ liệu cũ và người học phải tự đoán file nào còn đúng.

Mỗi mục nêu bốn thứ — khái niệm, xuất hiện ở đâu và khi nào, lặp lại theo kiểu nào, việc cụ thể nên làm:

```
🔴 Idempotency
   3 lần: oop-solid (2026-03-12), event-driven (2026-05-02, 2026-07-18)
   — trải 4 tháng, hai topic khác nhau.
   Cùng một kiểu sai: coi idempotent là "gọi lại không lỗi", trong khi nó
   là "gọi lại cho cùng kết quả".
   → Nên làm: ôn lại event-driven Chương 02 qua /recall, rồi tự viết một
     ví dụ retry không có idempotency key để thấy hậu quả.
```

Nếu không có mục 🔴 hay 🟡 nào, nói thẳng là chưa thấy điểm yếu lặp lại — đừng vét mục ⚪ ra cho báo cáo có nội dung.

## Giới hạn phải nói rõ với người học

Skill này chỉ thấy những gì `/recap` đã ghi. Phiên nào người học không gõ `/recap`, hoặc phiên đó không phát sinh điểm nào đủ tiêu chí, thì không để lại dấu vết ở đây.

Nên báo cáo này là **cận dưới** của điểm yếu thật, không phải bức tranh đầy đủ. Nói điều đó ra khi báo cáo trống hoặc mỏng, để người học không kết luận sai rằng mình không còn chỗ nào yếu.
