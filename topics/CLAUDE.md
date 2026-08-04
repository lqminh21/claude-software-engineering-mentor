# Quy ước khi làm việc trong `topics/`

Mỗi thư mục con ở đây là một topic bundle — tiến trình học của người dùng với một chủ đề. Nội dung trong đó là công sức của họ, không phải file sinh ra tự động: đừng sửa hay xoá khi không được yêu cầu rõ ràng.

Mỗi bundle có một sổ học tập tại `<topic>/.recap/LEARNING-JOURNAL.md`, ghi mỗi phiên một entry: đã làm gì, và các điểm đáng lưu nếu có. Đây là nguồn duy nhất cho biết quá trình học đã diễn ra thế nào — cấu trúc bundle chỉ cho biết kết quả.

## Trước khi đọc bất cứ gì

Kéo bản mới nhất từ remote:

```bash
git pull --ff-only
```

Người dùng học trên nhiều máy. Trạng thái trên đĩa của máy hiện tại có thể cũ hơn remote, và tin vào bản cũ sẽ dẫn tới dạy lại một chương đã học xong, hoặc tạo roadmap chồng lên roadmap đã có.

Nếu `pull` báo xung đột hoặc không fast-forward được, dừng lại và báo người dùng trước khi làm gì tiếp — đừng tự merge.

## Khi bắt đầu làm việc với một topic

Đọc sổ học tập nếu file đó tồn tại, **trước** khi kết luận gì từ danh sách file trên đĩa.

Danh sách file chỉ cho biết đã học tới chương nào. Nó không cho biết người dùng từng hiểu sai chỗ nào và đã sửa ra sao, hay phương án nào từng bị loại và vì sao.

Sau khi đọc, nói lại ngắn gọn cho người dùng biết họ đang ở đâu: đã học tới đâu, đã sửa hiểu sai gì, đã chốt quyết định nào. Đây thường là câu đầu tiên họ cần khi ngồi vào một máy khác.

## Hỏi ôn tập theo khoảng nghỉ

Khoảng nghỉ = ngày hiện tại trừ ngày của entry cuối cùng trong sổ học tập. Sổ chưa có entry nào thì bỏ qua phần này.

| Khoảng nghỉ | Hành vi |
|---|---|
| Dưới 3 ngày | Không nhắc gì |
| 3–7 ngày | Không nhắc, trừ khi sổ có điểm "Đáng lưu" chưa từng được ôn lại |
| Trên 7 ngày | Nhắc rõ, kèm số điểm đáng ôn |
| Trên 30 ngày | Đề xuất ôn **trước** khi học chương mới, và nói rõ vì sao |

Căn cứ của các ngưỡng: không có hoạt động nhớ lại, phần kiến thức mất đi lớn nhất nằm trong vài ngày đầu rồi chậm lại — nên dưới 3 ngày thì nhắc chỉ gây nhiễu, còn quá một tuần thì phần đã mờ đủ lớn để đáng dừng lại.

Ngưỡng 30 ngày có lý do riêng: quy trình dạy cố tình giảm dần việc giải thích lại khái niệm đã học ở các chương trước. Sau một tháng nghỉ, cách đó phản tác dụng — chương mới sẽ dựng trên một nền đã mờ mà không ai kiểm tra lại. Khi vượt ngưỡng này, nói thẳng điều đó với người dùng thay vì chỉ đề nghị chung chung, và trong phiên đó chủ động nhắc lại khái niệm cũ khi dùng tới, đừng coi như họ vẫn nắm.

Dạng nhắc: một dòng, để người dùng chọn.

> Bạn nghỉ 12 ngày. Sổ có 3 điểm đáng ôn lại — ôn trước, hay học tiếp chương mới?

Chờ họ quyết. Không tự bắt đầu ôn khi họ đang muốn học chương mới; nhưng cũng đừng im lặng, vì ôn tập giãn cách chỉ có tác dụng khi đúng nhịp và người dùng không có cách nào tự biết nhịp đó. Nếu họ đồng ý, dùng skill `recall`.

## Khi người dùng định bắt đầu một topic hoàn toàn mới

Trước khi dựng bundle mới, dùng skill `weakspot` để soi các khái niệm còn hiểu sai lặp lại ở những topic đã học. Báo cáo ngắn, rồi hỏi họ muốn xử lý trước hay bắt đầu topic mới luôn.

Đây là thời điểm duy nhất việc soi lại có tác dụng thật: sau khi đã mở thêm một mặt trận, người học sẽ không quay lại nữa. Nhưng chỉ báo cáo và hỏi — không chặn việc bắt đầu topic mới.

## Khi người dùng kết thúc phiên học

Họ gõ `/recap` để ghi entry vào sổ và đồng bộ lên remote. Không tự làm việc này giữa cuộc hội thoại — chỉ người dùng biết phiên đã kết thúc hay chưa.

Đây là đường ghi **duy nhất** vào sổ học tập. Các skill khác chỉ đọc. Nên nếu một phiên có gì đáng lưu mà người dùng chưa gõ `/recap`, nhắc họ một câu trước khi phiên kết thúc — không gõ thì phiên đó không để lại dấu vết nào, và cả `/recall` lẫn `/weakspot` sau này đều không thấy.
