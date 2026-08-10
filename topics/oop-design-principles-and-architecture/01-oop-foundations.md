---
created_at: 2026-08-10
bloom_level: Understand
---

# Chương 1 — Nền tảng hướng đối tượng: ranh giới của một object

## Cần đọc trước

- `00-README.md` — roadmap bundle và ví dụ nghiệp vụ xuyên suốt (hệ thống quản
  lý đơn hàng của một sàn thương mại điện tử).

Đây là chương đầu tiên, không cần kiến thức nào khác trong bundle. Thuật ngữ đều
được giải nghĩa ở lần dùng đầu và gom lại ở mục Thuật ngữ cuối chương.

## Chương này bàn gì

Hai phần, khác nhau về độ sâu một cách có chủ ý.

**Phần bản đồ** — mục ngay dưới đây — mô tả gọn cả bốn thuộc tính thường được kể
là nền của lập trình hướng đối tượng: abstraction, encapsulation, inheritance,
polymorphism. Lý do phải có phần này: trong code thật bốn thứ đó luôn xuất hiện
cùng nhau, nên học rời từng cái ở bốn chương khác nhau sẽ nắm được định nghĩa mà
không thấy chúng làm việc cùng nhau thế nào.

**Phần đi sâu** — từ mục 1 — chỉ lấy hai thuộc tính đầu, abstraction và
encapsulation, cùng ba khái niệm không tách được khỏi chúng: **information
hiding**, **class invariant**, **representation exposure**. Inheritance và
polymorphism đi sâu ở chương 2, sau khi chương này đã dựng xong ranh giới của
một object đơn lẻ.

Mọi ví dụ code trong chương viết bằng TypeScript. Code minh hoạ nằm ở
`scratch/01-encapsulation/`. Bundle chưa tới giai đoạn Thực chiến nên
`examples/` còn rỗng — code trong `scratch/` chạy được nhưng chỉ để minh hoạ.

---

## Bản đồ: bốn thuộc tính, nhìn một lượt

### Cả bốn trong một đoạn code

Ví dụ: hệ thống cần tính phí giao hàng, và có nhiều hãng vận chuyển. Đoạn dưới
đây lược phần thân hàm (`{ ... }`) để nhìn thấy quan hệ giữa bốn thuộc tính, nên
nó không biên dịch được như đang viết. Code đầy đủ chạy được nằm ở mục 8 và
trong `scratch/01-encapsulation/`.

```ts
// (1) ABSTRACTION — quyết định phần còn lại của hệ thống cần biết gì về
// một hãng vận chuyển: tính được phí, và cho biết mấy ngày tới.
// Mọi thứ khác — gọi API hãng nào, bảng giá ra sao — không cần biết.
interface Carrier {
  fee(order: Order): number;
  etaDays(order: Order): number;
}

// (3) INHERITANCE — hai hãng nội địa dùng chung cách tính phụ phí vùng xa,
// nên phần đó viết một lần ở class cha.
abstract class VietnamCarrier implements Carrier {
  protected remoteAreaSurcharge(order: Order): number { ... }

  abstract fee(order: Order): number;
  abstract etaDays(order: Order): number;
}

// (2) ENCAPSULATION — bảng giá là chuyện bên trong của hãng này.
// Bên ngoài không đọc, không sửa, không biết nó có tồn tại.
class GhnCarrier extends VietnamCarrier {
  #priceTable: PriceTable;

  fee(order: Order): number {
    return this.#priceTable.lookup(order.totalWeightGram)
         + this.remoteAreaSurcharge(order);
  }

  etaDays(order: Order): number { ... }
}

class ViettelPostCarrier extends VietnamCarrier { ... }

// (4) POLYMORPHISM — hàm này không biết và không cần biết đang có bao nhiêu
// hãng, cũng không cần biết là hãng nào. Thêm hãng thứ ba: hàm này không sửa.
function cheapest(order: Order, carriers: Carrier[]): Carrier {
  return carriers.reduce((a, b) => (a.fee(order) <= b.fee(order) ? a : b));
}
```

Bốn thuộc tính không phải bốn kỹ thuật rời nhau dùng ở bốn chỗ khác nhau. Trong
đoạn trên chúng là bốn vai trong cùng một quyết định thiết kế.

### Từng thuộc tính

**Abstraction — trừu tượng hoá.** Chọn xem với nhu cầu này thì chi tiết nào là
bản chất, chi tiết nào bỏ đi được. Ở ví dụ trên là quyết định: một hãng vận
chuyển, với phần còn lại của hệ thống, chỉ gồm hai phép toán `fee` và `etaDays`.

Đây là hoạt động thiết kế của con người, không phải một từ khoá trong ngôn ngữ.
Chọn sai thì cả ba thuộc tính còn lại đều xây trên nền sai. *Đi sâu: mục 3 của
chương này.*

**Encapsulation — đóng gói.** Gom dữ liệu với logic tác động lên dữ liệu đó vào
một đơn vị, và hạn chế truy cập từ bên ngoài vào state của đơn vị đó.
`#priceTable` là ví dụ: nó nằm cùng chỗ với hàm dùng nó, và bên ngoài không với
tới.

Cái nó mua được: khi bảng giá đổi cấu trúc, chỗ phải sửa là bên trong class này,
không lan ra ngoài. *Đi sâu: mục 3, 4, 5 của chương này.*

**Inheritance — kế thừa.** Một class nhận lại dữ liệu và hành vi của class khác,
rồi bổ sung hoặc thay đổi phần của mình. `GhnCarrier extends VietnamCarrier` để
không phải viết lại cách tính phụ phí vùng xa.

Đây là thuộc tính **tuỳ chọn**, khác ba cái kia: Go và Rust không có inheritance
mà vẫn là ngôn ngữ làm việc với object bình thường. Nó cũng là thuộc tính bị lạm
dụng nhiều nhất — dùng kế thừa chỉ để dùng lại vài dòng code sẽ tạo ra ràng buộc
mà về sau rất khó tháo. *Đi sâu: chương 2, và chương 8 chỉ ra khi nào nên thay
bằng composition.*

**Polymorphism — đa hình.** Nhiều loại object khác nhau được gọi theo cùng một
cách, và mỗi loại tự phản ứng theo cách của mình. Hàm `cheapest` gọi `fee` mà
không biết đang gọi vào hãng nào.

Cái nó mua được, và đây là lợi ích lớn nhất trong bốn cái: thêm một loại mới
không phải sửa code đã chạy. *Đi sâu: chương 2.*

### Quan hệ giữa bốn cái

Thứ tự phụ thuộc, không phải thứ tự quan trọng:

1. **Abstraction đi trước** — nó quyết định ranh giới nằm ở đâu (`Carrier` gồm
   hai phép toán nào).
2. **Encapsulation giữ ranh giới đó** — nó là công cụ ngăn bên ngoài chạm vào
   phần bên trong ranh giới.
3. **Polymorphism là cái thu được** khi mọi chỗ gọi chỉ phụ thuộc vào ranh giới
   chứ không phụ thuộc vào một hiện thực cụ thể.
4. **Inheritance là một cơ chế phụ trợ** để nhiều hiện thực dùng chung phần
   giống nhau. Có thể thay bằng composition, và thường nên thay.

Vì vậy bốn thứ này không cùng phạm trù, dù thường được liệt kê ngang hàng:

| Thuộc tính | Thực chất là gì |
|---|---|
| Abstraction | Hoạt động thiết kế — việc con người quyết định |
| Encapsulation | Cơ chế ngôn ngữ, phục vụ một nguyên tắc |
| Inheritance | Một cơ chế ngôn ngữ cụ thể, tuỳ chọn |
| Polymorphism | Tính chất thu được, đạt qua nhiều cơ chế khác nhau |

Đây là lý do bundle này không tổ chức chương theo bộ bốn, mà tổ chức theo phạm
vi bài toán: chương 1 là ranh giới của **một** object, từ chương 2 là quan hệ
giữa **nhiều** type.

| Thuộc tính | Đi sâu ở |
|---|---|
| Abstraction, Encapsulation | Chương 1 (chương này) |
| Inheritance, Polymorphism | Chương 2; chương 8 cho lựa chọn composition |

---

## 1. Vì sao cần OOP

### 1.1 Chi phí thật nằm ở thay đổi

Một phần độ phức tạp của phần mềm là do bản chất bài toán: nghiệp vụ thuế thật
sự có nhiều trường hợp, không ai bỏ được. Phần còn lại do chính cách ta viết
code sinh thêm ra: một công thức tính tiền tồn tại ở bảy chỗ, nên sửa thuế phải
sửa bảy lần. Cách tổ chức code chỉ tác động được vào phần thứ hai.

Từ đó có thước đo dùng cho mọi quyết định trong bundle này:

> Khi một quy tắc nghiệp vụ đổi, có bao nhiêu chỗ trong code phải sửa theo, và
> ta có biết chắc danh sách chỗ đó gồm những gì không?

### 1.2 Cùng một bài toán, viết theo ba cách

Đây là mục trả lời câu "vì sao OOP cần thiết" bằng cách cho thấy hai cách khác
làm gì trên cùng một yêu cầu. Yêu cầu gồm hai phần, cố tình nhỏ:

- `total` luôn bằng tổng `unitPrice × qty` trên mọi item.
- Đơn đã thanh toán thì không thêm item được nữa.

#### Cách 1 — procedural: dữ liệu một nơi, hàm một nơi

Lập trình theo thủ tục (procedural) tổ chức code thành các hàm xử lý, còn dữ
liệu là bản ghi trần mà hàm nào cũng đọc và ghi được.

```ts
// types.ts — chỉ có dữ liệu
type Order = {
  id: string;
  items: Item[];
  total: number;
  paid: boolean;
};

// cart-service.ts
function addItem(order: Order, item: Item): void {
  if (order.paid) throw new Error("order already paid");
  order.items.push(item);
  order.total += item.unitPrice * item.qty;   // phải nhớ cập nhật total
}

// import-service.ts — viết 3 tháng sau, bởi người khác
function importItems(order: Order, items: Item[]): void {
  order.items.push(...items);                  // quên kiểm tra paid
  order.total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);  // và quên cộng dồn
}
```

Ba chỗ hỏng, và cả ba đều hỏng theo thời gian chứ không hỏng lúc viết:

1. **Quy tắc không có chủ.** Điều kiện `paid` phải được lặp lại ở mọi hàm thêm
   item. `importItems` bỏ sót, và không có gì báo.
2. **Không biết trước danh sách chỗ phải sửa.** Mai thêm quy tắc thứ hai (không
   thêm item khi đơn đã huỷ) thì phải đi tìm mọi hàm ghi vào `items`. Số hàm đó
   tăng theo thời gian.
3. **Trạng thái sai vẫn hợp lệ về kiểu.** `order.total = -999` biên dịch được,
   và một đơn có `total` lệch với `items` vẫn trôi qua toàn hệ thống.

#### Cách 2 — OOP: dữ liệu và quy tắc cùng một chỗ

```ts
class Order {
  private readonly items: Item[] = [];
  private paid = false;

  addItem(item: Item): void {
    if (this.paid) throw new Error("order already paid");
    this.items.push(item);
  }

  get total(): number {
    return this.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  }
}
```

| Chỗ hỏng ở cách 1 | OOP xử lý thế nào |
|---|---|
| Quy tắc không có chủ | Chỉ tồn tại một đường thêm item, nên quy tắc đặt ở đó là xong, bất kể có bao nhiêu chỗ gọi |
| Không biết danh sách chỗ phải sửa | Danh sách đó là "các method public của class này" — đọc được, và không tăng ngoài tầm kiểm soát |
| Trạng thái sai vẫn hợp lệ | `order.total = -999` không biên dịch được; `total` không phải chỗ ghi được |

#### Cách 3 — functional: bỏ hẳn việc sửa dữ liệu

Lập trình hàm (functional programming) giải cùng vấn đề bằng một hướng khác: dữ
liệu không sửa được, hàm không có tác dụng phụ, và mỗi phép biến đổi trả về một
giá trị mới.

```ts
// Dữ liệu bất biến. Không có method, và cũng không cần private:
// không ai sửa được thứ không có phép gán.
type Order = {
  readonly id: string;
  readonly items: readonly Item[];
  readonly paid: boolean;
};

// Phép toán là hàm thuần: cùng đầu vào cho cùng đầu ra, không sửa gì cả.
const total = (order: Order): number =>
  order.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

// "Thêm item" trả về một Order MỚI, đơn cũ vẫn nguyên vẹn.
const addItem = (order: Order, item: Item): Order =>
  order.paid
    ? order   // hoặc trả về một kiểu kết quả có lỗi, thay vì ném ngoại lệ
    : { ...order, items: [...order.items, item] };
```

Điều đáng chú ý: cách này giải quyết được cả ba chỗ hỏng, nhưng bằng cơ chế khác
hẳn. `total` không thể lệch vì nó không được lưu ở đâu. Không có representation
exposure vì không có gì sửa được để mà rò rỉ. Đây là lý do phải nói rõ:
**functional không phải "không có encapsulation"** — nó chỉ đặt ranh giới ở chỗ
khác, ở cấp module và cấp kiểu thay vì cấp object.

Cái nó chưa giải quyết bằng đoạn code trên: quy tắc `paid` vẫn có thể bị một hàm
khác viết sau này bỏ sót, hệt cách 1. Lời giải trong lối functional là **đặt quy
tắc vào kiểu** — chỉ cho phép tạo giá trị hợp lệ qua một hàm duy nhất, và cho
đơn đã thanh toán một kiểu riêng không có hàm `addItem` nào nhận nó. Cách đó rất
mạnh, nhưng nó là chủ đề của một hướng học riêng, không phải của bundle này.

#### So sánh

| | Procedural | OOP | Functional |
|---|---|---|---|
| Quy tắc nghiệp vụ nằm ở | Rải trong các hàm ghi dữ liệu | Trong class sở hữu dữ liệu | Trong hàm tạo giá trị, hoặc trong kiểu |
| Chống trạng thái sai bằng | Không có gì, ngoài kỷ luật của người viết | Giới hạn đường ghi vào state | Không cho sửa gì cả |
| Thêm một *loại* mới (hãng vận chuyển thứ ba) | Thêm nhánh `if` ở mọi hàm | Dễ: thêm một class, không sửa code cũ | Phải thêm nhánh ở mọi hàm xử lý loại đó |
| Thêm một *phép toán* mới trên mọi loại | Dễ: viết thêm một hàm | Phải sửa mọi class | Dễ: viết thêm một hàm |
| Điểm yếu điển hình | Quy tắc rải rác, không ai chịu trách nhiệm | Lạm dụng kế thừa; class phình to; state ẩn khó lần | Mỗi thay đổi tạo object mới; đội chưa quen thì code khó đọc hơn |

Hai dòng giữa bảng là một đánh đổi có tên riêng, và nó giải thích vì sao không
hướng nào thắng tuyệt đối: OOP dễ thêm loại nhưng khó thêm phép toán, functional
thì ngược lại. Chương 13 bàn kỹ.

#### Vậy OOP cần thiết khi nào

Không phải luôn luôn. Ba điều kiện, và cần đủ cả ba:

1. Có **state thay đổi theo thời gian** — đơn hàng chuyển từ chờ sang đã thanh
   toán sang đã giao.
2. Có **quy tắc phải luôn đúng** về state đó.
3. Có **nhiều chỗ trong hệ thống** cùng tác động lên state đó.

Đủ cả ba thì procedural sẽ làm quy tắc rải rác, và OOP là lời giải trực tiếp
nhất. Thiếu điều kiện 1 — dữ liệu chỉ chạy qua, không đổi — thì kiểu bản ghi bất
biến cộng hàm thuần gọn hơn và ít lỗi hơn. Thiếu điều kiện 2 hoặc 3 thì class
chỉ là bao bì thừa (mục 6.3).

Trong thực tế, ba cách này không loại trừ nhau. Code TypeScript và Java hiện đại
thường là: object với ranh giới rõ cho phần có state và có quy tắc, hàm thuần
cho phần tính toán, và dữ liệu bất biến ở mọi chỗ làm được. Chọn theo tính chất
của từng phần, không theo nhãn paradigm.

### 1.3 Định nghĩa dùng trong bundle này

> **Lập trình hướng đối tượng** là cách phân rã hệ thống thành các đơn vị, mỗi
> đơn vị vừa giữ dữ liệu vừa giữ logic tác động lên dữ liệu đó, tự chịu trách
> nhiệm về tính hợp lệ của dữ liệu mình giữ, và chỉ cho bên ngoài thấy một bộ
> phép toán thay vì thấy cấu trúc bên trong.

---

## 2. Object: state, behavior, identity

Một object được đặc tả gọn nhất bằng ba thuộc tính:

| Thuộc tính | Nghĩa | Với một đơn hàng |
|---|---|---|
| **State** | Dữ liệu object đang giữ | Danh sách sản phẩm, địa chỉ giao, đã thanh toán chưa |
| **Behavior** | Bộ phép toán object phản ứng lại | Thêm sản phẩm, xác nhận thanh toán, tính tổng tiền |
| **Identity** | Cái làm object này là chính nó | Đơn `ORD-001` không phải `ORD-002`, dù trùng khớp mọi dữ liệu |

Bốn từ hay bị dùng lẫn:

- **Class** — khai báo, tồn tại trong code: một đơn hàng gồm dữ liệu gì, có
  những phép toán nào.
- **Object** — một thực thể cụ thể lúc chương trình chạy, có state riêng.
- **Instance** — gần như đồng nghĩa với object, nhưng dùng kèm class: "`ORD-001`
  là một instance của `Order`".
- **Type** — tập các phép toán mà một giá trị bảo đảm có. Mỗi class định nghĩa
  một type, nhưng không phải type nào cũng là class: interface là type không có
  hiện thực.

Class không phải điều kiện cần để có object. Một closure — hàm trả về hàm, giữ
lại biến cục bộ của chỗ nó được tạo ra — cũng cho ra đủ ba thuộc tính ở trên, và
`items` ở đây riêng tư thật, không có cách nào chạm vào từ bên ngoài:

```ts
function createOrder(id: string) {
  const items: Item[] = [];          // state, không ai bên ngoài với tới được

  return {                            // behavior
    id,                               // identity
    addItem: (item: Item) => { items.push(item); },
    total: () => items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0),
  };
}
```

Đây là cách viết phổ biến trong JavaScript trước khi ES6 có `class`, và vẫn dùng
được. Class chỉ là cơ chế dựng ranh giới phổ biến nhất, không phải duy nhất —
mục 3 liệt kê các cơ chế còn lại.

Về identity, còn một câu hỏi chương này chưa trả lời: so sánh hai object thế
nào? Mặc định của hầu hết ngôn ngữ là so sánh theo danh tính — hai biến bằng khi
trỏ tới cùng một object trong bộ nhớ. Nhưng có những khái niệm mà so sánh theo
danh tính là sai: hai số tiền `100.000 VND` nên được coi là bằng nhau, không
phải hai giá trị khác nhau. Phân biệt hai loại này — và cách khai báo so sánh
theo giá trị — thuộc chương 4.

---

## 3. Abstraction, information hiding, encapsulation

Ba từ này thường được dùng thay nhau, kể cả trong tài liệu chuyên môn, nhưng
chúng ở ba tầng khác nhau:

| Khái niệm | Nó là gì | Câu hỏi nó trả lời |
|---|---|---|
| **Abstraction** | Hoạt động thiết kế | "Bên ngoài *nên* biết gì về thứ này?" |
| **Information hiding** | Nguyên tắc | "Quyết định nào ở đây dễ đổi, và ai đang phụ thuộc vào nó?" |
| **Encapsulation** | Cơ chế của ngôn ngữ | "Tôi có công cụ gì để thực thi ranh giới đó?" |

### Che cái gì

`private` không tự nói cho bạn biết nên đặt nó ở đâu. Tiêu chí là: **che những
quyết định bạn muốn giữ quyền đổi ý.**

Ví dụ, `items` của một đơn hàng đang là mảng. Sáu tháng sau cần tra nhanh theo
`productId` nên phải đổi sang `Map`. Nếu mọi chỗ trong hệ thống đang viết
`order.items[0]` hay `order.items.length` thì tất cả phải sửa, và bạn không biết
trước có bao nhiêu chỗ như vậy. Nếu chúng chỉ gọi `order.hasProduct(id)` thì
việc đổi mảng sang `Map` không ai thấy.

Cái được che ở đây không phải "dữ liệu bí mật" mà là **một lựa chọn kỹ thuật**:
lưu bằng mảng hay `Map`, tính ngay hay tính khi cần, lưu tiền bằng đồng hay bằng
xu. Cái nào có khả năng đổi cao nhất thì che trước.

Nguyên tắc này không chỉ áp cho class. Cùng một ý ở các cấp khác, và bạn dùng
chúng hằng ngày:

| Cấp | Cơ chế | Cái được che |
|---|---|---|
| Object | `private`, `#field` | Cấu trúc state bên trong |
| File / module | `export` — thứ không export thì bên ngoài không thấy | Biến và hàm phụ trợ bên trong file |
| Package | `exports` trong `package.json`, `internal/` của Go, `internal` của C# | Toàn bộ chi tiết hiện thực, chỉ để lộ API công bố |
| Service | API công khai, DTO riêng khác model nội bộ | Schema cơ sở dữ liệu — service khác không đọc thẳng bảng của bạn |

```ts
// price-table.ts — che ở cấp file, không cần class nào
const table = new Map<number, number>();     // không export: bên ngoài không thấy

export function lookup(weightGram: number): number {
  return table.get(weightGram) ?? 0;
}
```

Nên khi cần che một quyết định mà không có state phải bảo vệ theo từng thực thể,
module là công cụ đủ và gọn hơn class.

### Encapsulation không tự cho ra information hiding

Điều quan trọng nhất của mục này: **encapsulation không tự động cho ra
information hiding.** Một class có toàn bộ field `private`, kèm một getter và
một setter cho từng field, là class đúng cú pháp encapsulation nhưng không che
gì: cấu trúc dữ liệu bên trong vẫn hiện nguyên hình ra ngoài qua bộ
getter/setter, và mọi chỗ gọi vẫn phụ thuộc đúng vào cấu trúc đó. Đổi cấu trúc
bên trong vẫn là đổi API công khai.

### `private` bảo đảm được gì — tuỳ ngôn ngữ

| Ngôn ngữ | Cơ chế | Được bảo đảm lúc nào |
|---|---|---|
| Java, C# | `private` / `protected` / `public` | Biên dịch, và lúc chạy cũng chặn |
| TypeScript | `private` — bị xoá khi sinh ra JavaScript | Chỉ lúc biên dịch |
| TypeScript, JavaScript | `#field` | Lúc chạy: truy cập từ ngoài là lỗi |
| Python | Quy ước `_name` | Không có gì chặn — hoàn toàn là quy ước |

Hai hệ quả cần rút ra:

1. Trong Python, `_internal` không chặn ai. Nó là một câu thông báo: "tôi có
   quyền đổi cái này bất cứ lúc nào, đừng gọi tới". Cả cộng đồng vận hành theo
   quy ước đó và nó có tác dụng thật, nhưng đó là loại bảo đảm khác về bản chất
   so với `private` của Java.
2. Chọn cơ chế nào phụ thuộc vào **mối đe doạ đang phòng**. Phòng đồng đội trong
   cùng repo vô tình gọi sai thì compile-time là đủ, và nó báo sớm hơn mọi hàng
   rào lúc chạy. Phòng người dùng bên ngoài mà bạn không kiểm soát được code của
   họ thì phải là cơ chế có hiệu lực lúc chạy.

---

## 4. Class invariant: object tự chịu trách nhiệm về dữ liệu của mình

### 4.1 Định nghĩa

**Class invariant** — bất biến của class — là một điều kiện về state của object,
luôn đúng ở mọi thời điểm bên ngoài quan sát được object đó.

Phần cần chính xác: trong lúc một method đang chạy dở, state có thể tạm thời
không thoả invariant; yêu cầu là nó phải đúng trở lại trước khi method kết thúc.
Từ đó có ba luật:

1. **Constructor thiết lập invariant.** Đây là lý do constructor phải nhận đủ dữ
   liệu tối thiểu để object hợp lệ. Một object vừa tạo đã chưa hợp lệ, phải gọi
   thêm hai `init()` nữa mới dùng được, là object mà mọi chỗ gọi phải nhớ luật
   ngầm.
2. **Mọi method public bảo toàn invariant.** Vào đúng thì ra cũng phải đúng.
3. **Method private được phép tạm phá**, vì bên ngoài không quan sát được ở
   giữa.

Invariant là một phần của một bộ ba lớn hơn, gọi là **Design by Contract**: điều
kiện người gọi phải bảo đảm trước khi gọi, điều kiện method phải bảo đảm sau khi
chạy, và invariant mà cả class phải giữ. Chương 5 (LSP) bàn đủ bộ ba, vì hợp
đồng chính là lõi của LSP.

### 4.2 Phát biểu invariant đúng dạng

| Dạng | Ví dụ | Vấn đề |
|---|---|---|
| Dạng thao tác | "thêm item thì phải cập nhật tổng tiền" | Mỗi thao tác mới lại cần một quy tắc mới. Nó không nói gì về `removeItem`, cũng không nói gì về việc có ai gán trực tiếp vào tổng tiền. |
| Dạng điều kiện trên state | "tổng tiền luôn bằng tổng `đơn giá × số lượng` trên mọi item" | Dùng được: kiểm tra được ở bất kỳ thời điểm nào mà không cần biết vừa có thao tác gì |

Dạng thứ hai còn cho ra ngay danh sách những đường phải chặn: mọi đường sửa được
danh sách item hoặc sửa được tổng tiền mà không đi qua object đều là một đường
phá invariant. Nói cách khác, phát biểu invariant xong là có đặc tả cho phần
encapsulation phải làm.

### 4.3 Giá trị suy diễn: lưu lại hay tính lại

Quyết định gặp ở gần như mọi class có invariant dạng "X bằng tổng của Y":

| | **Lưu thành field** | **Tính lại khi đọc** |
|---|---|---|
| Nguy cơ | Mọi method làm đổi state, hiện tại và tương lai, phải nhớ cập nhật; quên một chỗ là invariant vỡ trong im lặng | Không tồn tại trạng thái nào để lệch |
| Chi phí | Đọc rất nhanh | Tính lại mỗi lần đọc |
| Khi nào chọn | Phép tính đắt và bị đọc nhiều, đã đo được là chỗ nghẽn | Mặc định |

Mặc định là tính lại, và lý do không phải "gọn hơn" mà là nó xoá hẳn một loại
lỗi, còn phương án kia chỉ nhanh hơn ở một chỗ bạn chưa chứng minh là nghẽn.

Nhưng có một trường hợp đảo ngược kết luận. Tính lại chỉ đúng khi **nguyên liệu
của phép tính không tự đổi sau lưng**. Với giỏ hàng, tổng tiền là giá trị suy
diễn từ giá hiện tại nên tính lại là đúng. Với đơn đã đặt, tổng tiền là *sự kiện
đã xảy ra* — khách đã đồng ý trả đúng số đó; nếu phép tính đọc giá sống từ danh
mục sản phẩm thì sau khi shop tăng giá, mở lại đơn tháng trước sẽ ra số khác hoá
đơn đã xuất.

Cách xử lý không phải bỏ getter, mà là chốt giá vào từng dòng đơn ngay lúc thêm
vào — **price snapshot**. Nguyên tắc rộng hơn: dữ liệu mô tả một sự kiện trong
quá khứ phải được lưu tại thời điểm đó, không suy ra từ trạng thái hiện tại.

---

## 5. Representation exposure

Đặt `private` cho một field kiểu tập hợp rồi trả nó ra qua getter là chưa che
được gì. Lưu ý `Item` dưới đây là bản **cố tình chưa khoá** để thấy lỗ hổng —
bản đã khoá nằm ở mục 8:

```ts
type Item = { productId: string; unitPrice: number; qty: number };

class Order {
  private readonly items: Item[] = [];

  getItems(): Item[] {
    return this.items;   // trả về chính danh sách nội bộ
  }
}
```

```ts
order.getItems().push(newItem);   // thêm item, không qua addItem
order.getItems()[0].qty = 99;     // sửa item đã nằm trong đơn
order.getItems().length = 0;      // xoá sạch đơn hàng
```

Không dòng nào đi qua method nào của `Order`, nên mọi kiểm tra và mọi invariant
`Order` định giữ đều bị vượt qua. Liskov và Guttag gọi tên hiện tượng này là
**representation exposure** — bên ngoài giữ được tham chiếu tới chính cấu trúc
dữ liệu nội bộ của object khác.

Nó có hai chiều, và chiều thứ hai hay bị bỏ sót hơn:

```ts
constructor(items: Item[]) {
  this.items = items;   // caller vẫn giữ tham chiếu và sửa được sau đó
}
```

```ts
const items = [item1, item2];
const order = new Order(items);
items.push(item3);        // vừa thêm item vào đơn hàng, từ bên ngoài
```

### Ba cách chặn

| Cách | Cơ chế | Đánh đổi |
|---|---|---|
| **Immutable type** — kiểu bất biến | Phần tử không có method nào đổi được state, nên có tham chiếu cũng không sửa được gì | Phải thiết kế từ đầu; mỗi lần "đổi" là tạo object mới. Không tốn gì lúc chạy. |
| **Read-only view** — khung nhìn chỉ đọc | Khai báo kiểu trả về là `readonly Item[]`; ở Java là bọc bằng `Collections.unmodifiableList` | TypeScript chỉ chặn lúc biên dịch, còn Java chặn lúc chạy bằng cách ném ngoại lệ |
| **Defensive copy** — copy phòng ngừa | Copy lúc nhận vào và lúc trả ra: `return this.items.map((i) => ({ ...i }))` | Tốn bộ nhớ và thời gian. Quan trọng hơn: **chặn trong im lặng** — người viết `items[0].qty = 5` không nhận được lỗi nào và tin rằng mình vừa sửa đơn hàng. |

Chọn thế nào: khi bạn tự thiết kế được kiểu của phần tử thì immutable type tốt
hơn ở mọi mặt. Defensive copy là công cụ đúng khi bạn *không kiểm soát* được
kiểu đó — nhận vào một object từ thư viện ngoài, có sẵn method sửa được state,
thì copy là cách duy nhất.

### Bất biến phải áp ở mọi tầng

Các cơ chế của ngôn ngữ thường chỉ khoá một tầng. Với TypeScript:

| Kiểu | Chặn `push` | Chặn `items[0].qty = 5` |
|---|---|---|
| `Item[]` | không | không |
| `readonly Item[]` | có | không — chỉ khoá mảng |
| `Readonly<Item>[]` | không | có — chỉ khoá field của phần tử |
| `readonly Readonly<Item>[]` | có | có |

Cùng hiện tượng ở các ngôn ngữ khác: `Collections.unmodifiableList` của Java
chặn `add`/`remove` nhưng nếu `Item` có setter thì `list.get(0).setQty(99)` vẫn
chạy; `tuple` của Python không đổi được nhưng phần tử là `list` bên trong thì
vẫn đổi được. Nguyên tắc kiểm tra: hỏi tới tầng sâu nhất mà bên ngoài với tới
được.

Lưu ý cú pháp TypeScript: `readonly Item[]`, `Readonly<Item[]>` và
`ReadonlyArray<Item>` là cùng một kiểu; `Readonly<T>` chỉ đi một tầng; từ khoá
`readonly` chỉ dùng cho mảng và tuple, với `Map` phải dùng `ReadonlyMap`.

---

## 6. Object nên cho ra cái gì

Mục 3–5 đã dựng được ranh giới. Câu hỏi còn lại: ranh giới đó nên có cửa nào.

### 6.1 Tell, Don't Ask

**Tell, Don't Ask** — bảo object làm việc, đừng hỏi nó dữ liệu rồi tự làm thay
nó.

```ts
// Hỏi rồi tự làm — logic về đơn hàng nằm ngoài đơn hàng
if (order.status === "pending" && order.getItems().length > 0) {
  order.status = "paid";
  order.paidAt = new Date();
}

// Bảo nó làm — điều kiện và hệ quả nằm trong đơn hàng
order.confirmPayment(new Date());
```

Bản thứ hai hơn ở ba điểm cụ thể, không phải ở việc ngắn hơn: điều kiện "đơn
phải đang chờ và phải có hàng" được phát biểu một lần thay vì lặp ở mọi chỗ xác
nhận thanh toán; không tồn tại đường nào đặt `status = "paid"` mà quên `paidAt`;
và khi nghiệp vụ thêm điều kiện thứ ba, chỗ phải sửa là một.

Dạng vi phạm này có tên trong danh mục code smell của Martin Fowler:
**Feature Envy** — method quan tâm tới dữ liệu của class khác hơn dữ liệu của
class chứa nó. Chương 4 và 11 bàn tiếp.

### 6.2 Khi nào buộc phải đưa dữ liệu ra

Tell-Don't-Ask có giới hạn thật, và biết giới hạn quan trọng như biết nguyên
tắc. Hai trường hợp phải đưa dữ liệu ra:

1. **Câu hỏi không đoán trước được.** Khi điều kiện do người ngoài đội cấu hình
   và tháng sau sẽ khác — một engine khuyến mãi mà marketing tự đặt điều kiện
   trên giao diện quản trị — thì mọc thêm một method cho mỗi điều kiện nghĩa là
   sửa class lõi mỗi lần có campaign mới. Đây là chỗ đưa dữ liệu ra là đúng, và
   phần bảo vệ chuyển sang các cơ chế ở mục 5.
2. **Lưu trữ.** Tầng lưu trữ cần đọc toàn bộ state để ghi xuống, tức cần đúng
   thứ encapsulation tồn tại để ngăn. Đây là xung đột thật giữa hai yêu cầu đều
   đúng, không có lời giải miễn phí; chương 14 (Clean Architecture) bàn với đủ
   ngữ cảnh. Điều cần nhớ ở chương 1: đây là ca đặc biệt, đừng lấy nó làm lý do
   mở toang getter cho toàn hệ thống.

### 6.3 Khi nào không cần class

Nói cho đủ, vì đây là chỗ dễ áp dụng quá tay. Cả mục 4 và 5 đều xuất phát từ
việc có một quy tắc phải giữ và có nhiều chỗ ghi vào dữ liệu. Không có cả hai
điều đó thì class chỉ là bao bì thừa:

- Dữ liệu chỉ chạy qua, không có quy tắc nào phải giữ — payload nhận từ một API
  rồi truyền tiếp, object cấu hình đọc từ file.
- Một hàm thuần tính từ đầu vào ra đầu ra, không giữ state — `formatCurrency`
  là một hàm, không cần class `CurrencyFormatter`.

Phép thử: *có điều gì phải luôn đúng về dữ liệu này không, và có nhiều hơn một
chỗ ghi vào nó không?* Chương 7 (DRY, KISS, YAGNI) bàn kỹ hơn các dạng bọc thừa.

---

## 7. Sự thật hay chính sách

Có đủ dữ liệu để tính một thứ **không phải** lý do để đặt phép tính đó vào
class. Đây là ngộ nhận tốn kém nhất trong thực tế, vì nó luôn đúng ở thời điểm
viết code và chỉ sai dần theo thời gian.

Một class `Order` có tổng cân nặng thì có đủ dữ liệu để tính phí vận chuyển.
Nhưng nếu đặt `calculateShippingFee()` vào đó:

- Tháng 2: hãng vận chuyển tăng cước → sửa `Order`.
- Tháng 4: thêm hãng thứ hai với bảng giá khác → `Order` phải biết đơn này giao
  bằng hãng nào.
- Tháng 6: chương trình "miễn phí vận chuyển cho khách mới" → `Order` phải biết
  về khách hàng và lịch sử mua, những khái niệm nó vốn không cần biết.
- Tháng 8: cần hiện phí của cả ba lựa chọn giao hàng cho khách chọn → một method
  trả về một con số không đáp ứng được.

Sau tám tháng, `Order` phụ thuộc vào hãng vận chuyển, hồ sơ khách hàng và chương
trình khuyến mãi, và không kiểm thử được mà không dựng cả ba thứ đó.

Câu hỏi **không** phải "chỗ này có đủ dữ liệu để tính không" — hầu như luôn có,
đó chính là cái bẫy. Hai cách hỏi hữu ích hơn:

> **Ai yêu cầu thay đổi?** Khi công thức này đổi, người yêu cầu là ai? Nếu người
> đó nằm ngoài đội sở hữu class lõi — hãng vận chuyển, marketing, vận hành kho —
> thì logic đó không thuộc class lõi. Đây là dạng chính xác của Single
> Responsibility Principle (chương 4).

> **Đây là lời hứa của ai?** Object giữ lời hứa này cho chính nó, hay đây chỉ là
> phép tính phục vụ một nhu cầu bên ngoài? Xoá tổng tiền khỏi khái niệm "đơn
> hàng" thì khái niệm đó mất phần cốt lõi — nó là invariant. Xoá phí vận chuyển
> thì đơn hàng vẫn là đơn hàng.

Cân nặng là **sự thật** về đơn hàng. "18k cho 3kg đầu, miễn phí đơn trên 500k"
là **chính sách** của một hãng vận chuyển, và nó đổi mỗi quý. Chương 8 (Strategy
Pattern) là chỗ đặt các chính sách sau khi đã tách được chúng ra.

---

## 8. Ví dụ áp dụng: class `Order` tối giản

Code chạy được đầy đủ ở
`scratch/01-encapsulation/order-expose-data-vs-behavior.ts`.

### 8.1 Đặc tả trước khi viết code

**Invariant** (mục 4.2): `total` luôn bằng tổng `unitPrice × qty` trên mọi item.

**Quyết định 1** — `unitPrice` chốt tại thời điểm thêm vào đơn (mục 4.3): đơn đã
đặt là sự kiện đã xảy ra, không suy lại từ giá hiện tại.

**Quyết định 2** — `total` là getter tính lại, không phải field được lưu (mục
4.3). An toàn được nhờ Quyết định 1.

**Quyết định 3** — chặn representation exposure bằng immutable type, không bằng
defensive copy (mục 5): mối đe doạ đang phòng là đồng đội trong cùng repo vô
tình sửa sai, và với mối đe doạ đó thì báo lỗi lúc biên dịch tốt hơn chặn trong
im lặng.

```ts
export type Item = {
  readonly productId: string;
  readonly name: string;
  readonly unitPrice: number;   // chốt tại thời điểm addItem
  readonly qty: number;
  readonly weightGram: number;
  readonly category: string;
};

export class Order {
  readonly id: string;
  private readonly items: Item[] = [];

  constructor(id: string) {
    this.id = id;
  }

  addItem(item: Item): void {
    this.items.push(item);
  }

  get total(): number {
    return this.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  }
}
```

### 8.2 Bốn nhu cầu đọc, và cửa cho từng nhu cầu

| Nhu cầu của caller | Cửa | Lý do |
|---|---|---|
| Màn hình chi tiết đơn cần từng dòng kèm thành tiền | `get lines(): OrderLine[]` — kiểu riêng, `Order` tự tính `lineTotal` | Để màn hình tự nhân `unitPrice * qty` thì công thức tính tiền tồn tại ở hai nơi; thêm thuế từng dòng là hai nơi lệch nhau mà không gì báo (mục 6.1) |
| Tính phí vận chuyển cần tổng cân nặng | `get totalWeightGram(): number`, và **không** có `calculateShippingFee()` | Cân nặng là sự thật của đơn; bảng giá là chính sách của hãng (mục 7) |
| Kiểm tra tồn kho cần mã sản phẩm và số lượng | `get stockRequirements()` — kiểu chỉ có `productId` và `qty` | Đưa cả `Item` thì service kho thấy được giá, và cái gì thấy được thì sớm muộn có người dùng tới rồi thành phụ thuộc thật (mục 3) |
| Engine khuyến mãi tự đặt điều kiện | `get allItems(): readonly Item[]` — đưa dữ liệu, khoá bất biến hai tầng | Câu hỏi không đoán trước được (mục 6.2) |

Cái giá của hướng này, nói rõ để không bị bất ngờ: class mọc thêm một cửa cho
mỗi nhu cầu đọc mới. Với ba đến năm nhu cầu thì đây là đánh đổi đúng — mỗi cửa
là một hợp đồng rõ ràng. Khi nhu cầu đọc tăng nhanh hơn nhu cầu ghi, tách hẳn
đường đọc ra khỏi object là hướng đúng hơn (chương 13).

### 8.3 Kiểm tra thiết kế mà không có test runtime

Phần phòng thủ của thiết kế này nằm ở hệ thống kiểu, và trong TypeScript thì cả
`readonly` lẫn `private` đều bị xoá trước khi code chạy (mục 3). Nên hai thứ
đáng kiểm nhất lại là hai thứ test runtime không với tới được.

Chỗ kiểm là trình biên dịch: để sẵn trong file một khối các dòng cố tình sai ở
dạng comment, uncomment cả khối thì mọi dòng phải báo lỗi.

```ts
// order.allItems.push(order.allItems[0]); // thêm item không qua addItem
// order.allItems[0].qty = 99; // sửa item đã nằm trong đơn
// order.total = 0; // gán đè total, phá invariant
// order.items; // với tới state nội bộ
```

Chú thích phải nằm cùng dòng, sau đoạn code — để trên dòng riêng thì lúc
uncomment cả khối, dòng chú thích thành câu lệnh sai cú pháp.

Nếu chạy `node` với bốn dòng đó ở dạng thường, chương trình vẫn chạy và state bị
sửa thật, kể cả `order.items`. Đó là đúng với Quyết định 3, không phải lỗ hổng:
mối đe doạ được phòng là viết nhầm trong cùng repo. Nếu `Order` là API của một
thư viện phát hành ra ngoài thì phải chọn khác — `#items` thay cho
`private items`.

```bash
# Node 24 trở lên chạy trực tiếp file .ts
node order-expose-data-vs-behavior.ts

# Node 22 (máy đang dùng là 22.15.1) cần cờ này,
# thiếu cờ thì báo ERR_UNKNOWN_FILE_EXTENSION
node --experimental-strip-types order-expose-data-vs-behavior.ts

# Node chỉ XOÁ phần khai báo kiểu rồi chạy, KHÔNG kiểm tra kiểu:
npx tsc --noEmit
```

Hai hệ quả của việc Node chỉ xoá kiểu: không dùng được parameter property
(`constructor(private items: Item[]) {}`), phải khai báo field tường minh trong
thân class; và output của `node` không nói gì về việc thiết kế có đúng hay
không.

---

## Tổng kết

| Câu hỏi | Chốt của chương |
|---|---|
| OOP cần thiết khi nào | Khi có đủ ba điều: state đổi theo thời gian, quy tắc phải luôn đúng về state đó, và nhiều chỗ cùng tác động lên nó. Thiếu một điều thì procedural hoặc functional gọn hơn (mục 1.2) |
| Ba cách lập trình khác nhau ở đâu | Procedural để quy tắc rải trong các hàm ghi dữ liệu, nên số chỗ phải sửa không biết trước; OOP gom quy tắc vào class sở hữu dữ liệu; functional bỏ hẳn việc sửa dữ liệu nên không có gì để lệch (mục 1.2) |
| Bốn thuộc tính quan hệ với nhau thế nào | Abstraction chọn ranh giới → encapsulation giữ ranh giới → polymorphism là cái thu được → inheritance là cơ chế phụ trợ, tuỳ chọn (Bản đồ) |
| Object là gì | State, behavior, identity (mục 2) |
| Ba từ dễ lẫn | Abstraction = chọn ranh giới; information hiding = lý do có ranh giới; encapsulation = cơ chế giữ ranh giới (mục 3) |
| `private` nghĩa là gì | Tuỳ ngôn ngữ: bảo đảm lúc biên dịch, lúc chạy, hay chỉ là quy ước. Chọn theo mối đe doạ đang phòng (mục 3) |
| Phát biểu invariant thế nào | Dạng điều kiện luôn đúng trên state. Constructor thiết lập, mọi method public bảo toàn (mục 4) |
| Giá trị suy diễn: lưu hay tính lại | Mặc định tính lại. Lưu lại khi giá trị là sự kiện trong quá khứ (mục 4.3) |
| `private` cho một danh sách là đủ chưa | Chưa — trả ra tham chiếu là representation exposure. Ba cách chặn, và bất biến phải áp ở mọi tầng (mục 5) |
| Object nên cho ra cái gì | Mặc định bảo nó làm việc. Đưa dữ liệu khi câu hỏi không đoán trước được (mục 6) |
| Logic nào không thuộc class lõi | Chính sách — cái đổi theo quý, do người ngoài đội yêu cầu đổi (mục 7) |
| Khi nào không cần class | Không có gì phải luôn đúng về dữ liệu, hoặc chỉ có một chỗ ghi vào nó (mục 6.3) |

## Thuật ngữ

Giữ nguyên tiếng Anh vì đây là dạng dùng chung của ngành, và là dạng tra cứu
được:

| Thuật ngữ | Nghĩa ngắn |
|---|---|
| Abstraction | Chọn xem chi tiết nào là bản chất với một nhu cầu, bỏ phần còn lại |
| Encapsulation | Gom dữ liệu với logic vào một đơn vị và hạn chế truy cập vào state |
| Information hiding | Che những quyết định thiết kế dễ đổi sau một ranh giới |
| Inheritance | Một class nhận lại dữ liệu và hành vi của class khác |
| Polymorphism | Nhiều loại object được gọi theo cùng một cách, mỗi loại tự phản ứng |
| Class invariant | Điều kiện luôn đúng về state ở mọi thời điểm bên ngoài quan sát được |
| Representation exposure | Bên ngoài giữ được tham chiếu tới cấu trúc dữ liệu nội bộ |
| Defensive copy | Copy lúc nhận vào và lúc trả ra để cách ly dữ liệu nội bộ |
| Tell, Don't Ask | Bảo object làm việc thay vì hỏi dữ liệu rồi tự làm thay nó |
| Feature Envy | Method quan tâm tới dữ liệu của class khác hơn dữ liệu của class chứa nó |
| Pure function — hàm thuần | Cùng đầu vào luôn cho cùng đầu ra, và không sửa gì bên ngoài nó |
| Immutability — bất biến | Giá trị không đổi được sau khi tạo; mỗi phép "đổi" tạo ra giá trị mới |

## Luyện tập

`exercises/01-answer-or-expose-data/PROBLEM.md` — cho năm nhu cầu đọc trên đơn
hàng bách hoá có hàng đông lạnh và xuất hoá đơn thuế giá trị gia tăng, tự quyết
định từng nhu cầu nên được trả lời hay được đưa dữ liệu, rồi viết kiểu dữ liệu
tương ứng. Bài tập đo trực tiếp mục 4, 5, 6 và 7.

## Đọc thêm

- **David Parnas**, *On the Criteria To Be Used in Decomposing Systems into
  Modules*, CACM 1972 — mười trang, và là nguồn của tiêu chí "che cái gì" ở mục
  3. Đọc khi bạn muốn biết lập luận đầy đủ đằng sau nó.
- **Martin Fowler**, *AnemicDomainModel* (bài blog, 2003) — ngắn, mô tả đúng
  dạng thiết kế bạn sẽ gặp nhiều nhất trong dự án thật. Chương 4 quay lại.
- **Scott Wlaschin**, *Domain Modeling Made Functional* — cùng bài toán bảo vệ
  quy tắc nghiệp vụ, giải bằng kiểu dữ liệu và hàm thuần thay vì bằng class. Đọc
  để thấy phần nào ở chương này là bản chất, phần nào chỉ là cách làm của OOP.
- **Joshua Bloch**, *Effective Java* — các mục về giảm khả năng thay đổi, về
  defensive copy, về hạn chế mức truy cập. Nguyên tắc áp được cho cả ngôn ngữ
  khác.

## Đọc tiếp

- **Chương 2 — OOP nâng cao**: đi sâu hai thuộc tính còn lại của bản đồ —
  inheritance, interface, polymorphism — qua ví dụ nhiều hãng vận chuyển.
- **Chương 4 — SRP & OCP**: dạng chính xác của câu hỏi "ai yêu cầu thay đổi" ở
  mục 7, áp cho cả hệ thống chứ không riêng một class.
- **Chương 5 — LSP & ISP**: đủ bộ ba Design by Contract, mục 4.1 chỉ giới thiệu
  một phần.
- **Chương 8 — Strategy Pattern**: chỗ đặt các chính sách mà mục 7 giữ ngoài
  class lõi; và khi nào thay inheritance bằng composition.
- **Chương 14 — Clean Architecture**: lời giải cho trường hợp lưu trữ ở mục 6.2.
