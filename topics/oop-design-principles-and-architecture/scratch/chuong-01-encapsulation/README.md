# Chương 1 — Encapsulation

Chỗ nháp trong lúc học. Nằm ngoài `exercises/` (đề bài chính thức) và `my-work/`
(bài nộp) để code nháp không lẫn với bài tập.

## Các file

| File | Vai trò | Cách dùng |
|---|---|---|
| `order-expose-data-vs-behavior.ts` | Code minh hoạ 5 ca caller cần đọc dữ liệu từ `Order` | `node order-expose-data-vs-behavior.ts` |
| `order.ts` | Bài tập của bạn — tự viết lại `Order` không nhìn file trên | `node order.ts` |

Node 24 chạy thẳng file `.ts`, không cần cài gì.

**Không có test ở chương này.** Phần phòng thủ của thiết kế nằm ở compile-time,
mà `readonly` và `private` bị xoá trước khi test chạy — hai điều đáng kiểm tra
nhất thì test runtime không với tới được. Chỗ chấm bài là editor: uncomment khối
cuối `order.ts`, đủ 4 dòng đỏ là thiết kế đúng.

Hai điều cần biết về cách Node chạy TypeScript: nó chỉ **xoá** phần type rồi
chạy, không biên dịch. Nên (1) parameter property
(`constructor(private items: Item[]) {}`) không dùng được — khai báo field
tường minh trong thân class; và (2) Node **không** kiểm tra kiểu, muốn kiểm tra
thì dựa vào editor hoặc `npx tsc --noEmit`.

## Hai câu đã chốt

**(a) `total` — getter tính lại, không lưu thành field.**
Lưu field thì mọi mutator hiện tại và tương lai phải nhớ cập nhật; quên một chỗ
là invariant vỡ. Getter thì không tồn tại trạng thái nào để lệch. Chỉ an toàn
được vì `unitPrice` đã chốt lúc thêm item — nếu đọc giá sống thì mở lại đơn cũ
sau khi shop tăng giá sẽ ra số khác hoá đơn đã xuất.

**(b) `private items` không đủ, nhưng cách chữa là `readonly`, không phải deep copy.**
Deep copy cũng chặn được, nhưng chặn trong im lặng: người gõ `items[0].qty = 5`
không nhận được lỗi nào và tin rằng mình vừa sửa đơn hàng. Đúng loại "sai logic
không có log" — thứ đang muốn tránh. `readonly` báo đỏ ngay lúc gõ, và miễn phí
lúc chạy.

Invariant phải giữ: `total` luôn bằng tổng `unitPrice × qty` trên mọi item.

## Quy tắc rút ra từ 5 ca

> Mặc định là trả lời câu hỏi, không đưa dữ liệu.
> Chỉ đưa dữ liệu khi câu hỏi không thể biết trước.

| Nhóm | Ca | `Order` đưa ra |
|---|---|---|
| A — câu hỏi biết trước | 1 hiển thị, 2 vận chuyển, 3 tồn kho | Câu trả lời, mỗi ca một kiểu hẹp riêng |
| B — câu hỏi không đoán được | 5 khuyến mãi | Dữ liệu, khoá bằng `readonly` cả hai tầng |
| Ngoại lệ | 4 persistence | Cửa riêng, xem mục dưới |

Cái giá của hướng này: `Order` mọc thêm một method cho mỗi nhu cầu đọc mới. Khi
nhu cầu đọc đủ đa dạng, tách hẳn đường đọc ra khỏi entity sẽ tốt hơn — chương 13.

## Ca 4 — persistence: ba hướng, không hướng nào miễn phí

Bốn ca kia có lời giải rõ. Ca 4 thì không, nên tách ra đây thay vì nhồi vào
comment trong code.

Vấn đề: tầng lưu trữ cần đọc **hết** state để ghi xuống bảng `order_items` — kể
cả những field vừa cẩn thận giấu đi. Nó cần đúng thứ mà encapsulation tồn tại để
ngăn.

### Hướng 1 — dùng chung getter với code nghiệp vụ

```ts
class OrderRepository {
  save(order: Order): void {
    db.insert("order_items", order.allItems);   // dùng lại getter của Ca 5
  }
}
```

Rẻ nhất, không thêm gì vào `Order`.

Đổi lại: `allItems` sinh ra cho khuyến mãi (Ca 5), giờ gánh thêm vai trò lưu trữ.
Hai nhu cầu khác nhau dùng chung một cửa, nên khi persistence cần thêm field
(`createdAt`, `version`), bạn phải mở rộng cửa đó — và code khuyến mãi cũng thấy
luôn. Encapsulation nới ra vì một lý do thuần kỹ thuật.

### Hướng 2 — cặp snapshot

```ts
type OrderSnapshot = { id: string; items: Item[] };

class Order {
  toSnapshot(): OrderSnapshot { ... }
  static fromSnapshot(s: OrderSnapshot): Order { ... }
}

class OrderRepository {
  save(order: Order): void        { db.write(order.toSnapshot()); }
  load(id: string): Order         { return Order.fromSnapshot(db.read(id)); }
}
```

Một cửa riêng, tên nói rõ mục đích. Code nghiệp vụ không có lý do gọi
`toSnapshot()`, nên hai nhu cầu không giẫm chân nhau. Có trong file minh hoạ.

Đổi lại: `OrderSnapshot` trở thành hợp đồng phải giữ. Đơn lưu từ tháng trước vẫn
nằm trong DB theo cấu trúc cũ — hôm nay bạn đổi `Order`, `fromSnapshot` vẫn phải
đọc được dữ liệu cũ đó:

```ts
static fromSnapshot(s: OrderSnapshot | OrderSnapshotV1): Order {
  if ("version" in s) { ... }
  // dữ liệu cũ không có field `version` — xử lý riêng
}
```

Đó là versioning, và nó không đơn giản.

### Hướng 3 — repository biết cấu trúc trong của `Order`

```ts
class Order {
  /** @internal — chỉ OrderRepository được dùng */
  readonly _items: Item[] = [];
}

class OrderRepository {
  save(order: Order): void { db.insert("order_items", order._items); }
}
```

Encapsulation giữ được với phần còn lại của hệ thống — quy ước `_` và ghi chú
`@internal` nói rõ ai được phép chạm. Không cần dựng thêm kiểu `OrderSnapshot`,
không có bài toán versioning.

Đổi lại: quy ước không phải hàng rào, compiler không chặn ai cả. Và hai class
dính chặt — đổi cấu trúc trong `Order` là hỏng `OrderRepository`.

Điều cần nhớ ở chương 1: persistence là ca **đặc biệt**. Đừng lấy nó làm lý do
mở toang getter cho toàn hệ thống. Chương 14 (Clean Architecture) quay lại.
