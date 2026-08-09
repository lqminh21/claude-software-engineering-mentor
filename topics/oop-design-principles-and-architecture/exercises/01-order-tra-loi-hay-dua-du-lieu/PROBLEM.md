---
difficulty: Beginner
related_lessons: []
estimated_time: "60-75 phút"
skills: ["encapsulation", "invariants", "least-privilege", "immutable-types", "responsibility-boundaries"]
---

<!--
`related_lessons` để rỗng có chủ ý: chương 1 đã dạy qua hội thoại nhưng bundle
chưa có file lesson `01-*.md` nào trên đĩa. Khi file lesson chương 1 được viết,
bổ sung slug của nó vào đây. Không điền slug chưa tồn tại.

Giá trị của khoá `difficulty` luôn viết nguyên văn tiếng Anh
(`Beginner` | `Intermediate` | `Advanced`) để bước đối chiếu tiến độ giữa các
file đọc ra cùng một kết quả.

Quy ước cho `skills`: kebab-case tiếng Anh, không dấu, không trộn tiếng Việt.
Đây là khoá để máy đối chiếu giữa các bài tập, nên nó phải khớp nhau chính xác —
`readonly-hai-tang` và `immutable-types` là hai tag khác nhau dù cùng nói một
thứ. Nội dung tiếng Việt nằm ở phần thân file, không nằm ở đây.
-->

# Bài tập 01 — `Order` nên trả lời câu hỏi, hay đưa dữ liệu?

## Mục tiêu

Làm xong bài này, bạn tự phân loại được một nhu cầu đọc dữ liệu bất kỳ vào một
trong hai nhóm, và viết ra được kiểu dữ liệu tương ứng:

- **Nhóm A** — `Order` biết trước câu hỏi → trả lời, mỗi nhu cầu một kiểu trả về
  hẹp riêng.
- **Nhóm B** — `Order` không đoán được câu hỏi → đưa dữ liệu, khoá bằng
  `readonly` ở cả hai tầng.

Đây là bộ nhu cầu **khác** với năm ca đã đi qua trong buổi học — đừng tra lại
bảng phân loại cũ rồi chép sang, vì có nhu cầu ở đây thoạt nhìn giống một ca cũ
nhưng rơi vào nhóm khác, và có hai nhu cầu khác nhau cùng rơi vào một nhóm —
đừng vì thế mà tưởng mỗi nhu cầu cần một getter riêng.

## Bối cảnh

Vẫn là sàn thương mại điện tử của bundle, nhưng `Order` giờ phục vụ thêm một
nhánh nghiệp vụ mới: **đơn hàng bách hoá có hàng đông lạnh và có xuất hoá đơn
giá trị gia tăng (VAT)**. Mỗi item trong đơn mang theo tám field sau:

| Field | Ý nghĩa |
|---|---|
| `productId` | mã sản phẩm |
| `name` | tên hiển thị |
| `unitPrice` | đơn giá chưa thuế, chốt tại thời điểm thêm vào đơn |
| `qty` | số lượng |
| `vatRate` | thuế suất của mặt hàng, ví dụ `0.08` hoặc `0.1` — khác nhau theo mặt hàng |
| `requiresCold` | có phải hàng cần giữ lạnh không |
| `volumeCm3` | thể tích một đơn vị sản phẩm, tính bằng cm³ |
| `category` | danh mục, ví dụ `"frozen-food"`, `"beverage"` |

Hai invariant sau đây là hai điều luôn đúng về dữ liệu của `Order` — không phải
hai thao tác phải thực hiện:

1. `total` luôn bằng tổng `unitPrice × qty` trên mọi item (số tiền **chưa** thuế).
2. `totalPayable` luôn bằng tổng `unitPrice × qty × (1 + vatRate)` trên mọi item.

Vì thuế suất khác nhau giữa các mặt hàng, invariant 2 **không** rút gọn được
thành `total × một thuế suất chung`.

## Năm nhu cầu từ phía caller

Mỗi nhu cầu dưới đây đến từ một **caller** khác nhau — một bộ phận hoặc hệ
thống gọi tới `Order` để lấy dữ liệu, ví dụ phòng kế toán ở N1 hay bộ phận điều
phối vận chuyển ở N2. Với **mỗi** nhu cầu, bạn phải quyết định: `Order` trả lời
(nhóm A), hay đưa dữ liệu (nhóm B).

**N1 — Bộ phận kế toán xuất hoá đơn VAT.**
Hoá đơn cần từng dòng gồm: tên hàng, số lượng, đơn giá chưa thuế, thuế suất, tiền
thuế của dòng đó, và thành tiền đã gồm thuế. Cuối hoá đơn in tổng tiền thanh
toán.

**N2 — Điều phối vận chuyển chọn loại xe.**
Đơn có bất kỳ mặt hàng đông lạnh nào thì phải xếp cho xe có khoang lạnh. Bên điều
phối chỉ cần biết đơn này có thuộc diện đó hay không.

**N3 — Trạm đóng gói chọn thùng carton.**
Trạm cần biết đơn này nên đóng vào thùng cỡ nào: S, M, hay chia hai kiện, dựa
trên tổng thể tích của đơn. Ngưỡng phân loại hiện là "dưới 20.000 cm³ dùng thùng
S, từ đó tới 50.000 cm³ dùng thùng M, trên nữa chia hai kiện" — ngưỡng này do
bên vận hành kho tự đặt và đã đổi ba lần trong năm nay. `Order` biết thể tích
từng item, nhưng ngưỡng phân loại thì không — đó là chính sách vận hành kho,
không phải sự thật cố định về đơn hàng, nên không nên khoá cứng thành một
method riêng trên `Order`.

**N4 — Màn hình chi tiết đơn gợi ý "sản phẩm cùng loại".**
Bộ phận gợi ý sản phẩm cần biết đơn này chạm tới những danh mục nào, mỗi danh mục
kể một lần. Bộ phận này không được nhìn thấy giá.

**N5 — Engine khuyến mãi "mua kèm".**
Marketing cấu hình điều kiện ngay trên giao diện quản trị, không qua lập trình
viên. Ví dụ điều kiện đang chạy tháng này: "đơn có từ 2 mặt hàng thuộc danh mục
`beverage` với đơn giá trên 30.000đ thì tặng một mã giảm giá". Tháng sau điều
kiện sẽ khác, và không ai biết trước là khác thế nào.

## Yêu cầu

1. Viết lại từ đầu file `starter/order.ts` (chép sang thư mục làm bài của bạn
   trước khi sửa). Không mở file minh hoạ của buổi học trong lúc làm.
2. Khai báo kiểu `Item` với tám field ở bảng trên, và mọi kiểu dữ liệu chỉ để đọc
   mà bạn thấy cần thêm. Tự đặt tên các kiểu đó.
3. Viết class `Order` với `id`, một danh sách item nội bộ, `addItem`, và hai
   getter `total` / `totalPayable` giữ đúng hai invariant.
4. Với mỗi nhu cầu N1–N5: quyết định nó rơi vào nhóm A hay nhóm B, rồi thêm
   đúng thứ nhóm đó cần vào `Order`.
5. Đây là phần được chấm kỹ nhất, không phải phần code: ở đầu file, viết một
   bảng comment năm dòng — mỗi nhu cầu → nhóm bạn xếp nó vào → một câu lý do.
6. Cuối file để sẵn khối tự kiểm ở dạng comment (xem mục dưới).

### Ràng buộc kỹ thuật

- TypeScript, chạy bằng `node order.ts` trên Node 24. Node **xoá** phần type rồi
  chạy chứ không biên dịch, nên:
  - Không dùng parameter property (`constructor(private items: Item[]) {}`) —
    khai báo field tường minh trong thân class.
  - Node không kiểm tra kiểu. Muốn kiểm thì dựa vào editor, hoặc chạy
    `npx tsc --noEmit`.
- Không dùng thư viện ngoài.
- Không deep copy để bảo vệ dữ liệu.

### Cách tự kiểm — không có test

Bài này **không có test runtime** — đây là quyết định thiết kế, không phải
thiếu sót. `readonly` và `private` bị xoá trước khi test chạy, nên hai thứ đáng
kiểm nhất trong bài lại chính là hai thứ test runtime không với tới được.

Chỗ chấm bài là editor. Cuối file, để sẵn một khối các dòng **cố tình sai** ở
dạng comment. Uncomment cả khối thì editor phải báo đỏ ở **mọi** dòng. Chú
thích giải thích phải nằm **cùng dòng, sau** đoạn code, để uncomment không sinh
lỗi cú pháp. Nhớ comment lại sau khi xem xong.

Khối đó phải bao gồm ít nhất bốn tình huống:

| Tình huống cần chặn | Nó tương ứng với việc gì ngoài đời |
|---|---|
| Thêm item vào đơn mà không qua `addItem` | Một chỗ nào đó `push` thẳng vào danh sách, bỏ qua mọi kiểm tra tương lai bạn định đặt trong `addItem` |
| Sửa `qty` của một item đã nằm trong đơn | Kho tự trừ số lượng ngay trên object đơn hàng; hoá đơn đã xuất và đơn trong bộ nhớ lệch nhau |
| Gán đè `total` hoặc `totalPayable` | Một chỗ "sửa nhanh" số tiền, và từ đó invariant không còn đúng |
| Với tay vào danh sách item nội bộ từ bên ngoài | Bất kỳ ai cũng thao tác được trực tiếp lên state, mọi phân loại A/B ở trên thành vô nghĩa |

## Tiêu chí đạt

Bài đạt khi **tất cả** những điều dưới đây đúng.

**Về phân loại**

- Bảng comment đầu file có đủ năm dòng, mỗi dòng nêu được lý do dựa trên "câu hỏi
  có biết trước được không", chứ không dựa trên "trả về ít dữ liệu hơn thì an
  toàn hơn".
- N3 và N5 phải dùng chung đúng **một** getter nhóm B. Lý do đưa N3 vào nhóm B
  phải nêu đúng: ngưỡng đóng thùng là chính sách vận hành kho hay đổi, không
  phải sự thật cố định của `Order`, nên không hardcode thành method riêng —
  khác với lý do của N5 (câu hỏi tương lai không đoán trước được).
- Nhu cầu nào rơi vào nhóm B thì trong file chỉ có **một** getter trả về danh
  sách item đầy đủ. Có từ hai getter kiểu đó trở lên là chưa đạt.

**Về kiểu dữ liệu**

- Không nhu cầu nhóm A nào nhận về `Item` đầy đủ. Mỗi nhu cầu nhóm A có kiểu trả
  về riêng, chỉ chứa đúng field nó dùng.
- Nhu cầu nào nói rõ "không được nhìn thấy giá" thì kiểu trả về của nó không có
  đường nào chạm tới `unitPrice` — kể cả gián tiếp qua một field lồng bên trong.
- Getter của nhóm B trả về kiểu chặn được cả `push` lẫn gán đè field của phần tử.
- Không có deep copy ở bất kỳ đâu.

**Về invariant**

- `total` và `totalPayable` là getter tính lại, không phải field được lưu và cập
  nhật trong `addItem`.
- `totalPayable` tính thuế theo `vatRate` của từng item, không dùng một thuế suất
  chung cho cả đơn.
- Chạy `node order.ts` in ra được số tiền của một đơn có ít nhất ba item, trong đó
  có hai mặt hàng khác thuế suất và ít nhất một mặt hàng đông lạnh.

**Về khối tự kiểm**

- Uncomment cả khối thì editor báo đỏ ở mọi dòng, đủ bốn tình huống trong bảng
  trên.
- Uncomment xong file vẫn đúng cú pháp — không dòng nào bị chú thích cắt ngang.

## Nộp bài

Đặt bài làm tại
`topics/oop-design-principles-and-architecture/my-work/01-order-tra-loi-hay-dua-du-lieu/attempt-1/order.ts`,
rồi báo mentor để được review.
