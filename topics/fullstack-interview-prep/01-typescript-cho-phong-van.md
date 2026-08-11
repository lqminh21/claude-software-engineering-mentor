# Chương 1: TypeScript cho phỏng vấn

## Vấn đề chương này giải quyết

Interview cho vị trí Middle/Pre-Senior hiếm khi hỏi "viết cho tôi một interface". Câu hỏi thật thường có dạng "tại sao bạn dùng `type` ở đây mà không phải `interface`?", "generic khác `any` ở điểm nào, không phải chỉ là cú pháp?", hoặc đưa một đoạn code có lỗi type và hỏi lỗi đó xảy ra ở đâu, vì sao. Đây là câu hỏi về cơ chế của type system, không phải cú pháp — và cơ chế là thứ dev viết TypeScript hàng ngày dễ bỏ qua nhất, vì code vẫn chạy đúng dù không giải thích được vì sao trình biên dịch chấp nhận hoặc từ chối một đoạn code.

Khoảng cách đó là lý do chương này tồn tại: bạn đã dùng `interface`, `type`, generic trong công việc thật — mục tiêu ở đây không phải học lại cú pháp, mà là nắm được cơ chế đứng sau từng lựa chọn, để khi bị hỏi xoáy ("vậy nếu tôi đổi `interface` thành `type` ở đây thì sao?") bạn trả lời được bằng lý do kỹ thuật, không phải "quen tay viết vậy".

Một số dạng câu hỏi hay gặp, đúng dạng chương này chuẩn bị cho bạn trả lời:

- "`interface` và `type` khác nhau ở đâu, ngoài cú pháp?" — trả lời bằng cách nhắc lại định nghĩa (khai báo shape hay khai báo alias) thì chưa đủ; trả lời được bằng cơ chế (declaration merging, fail-fast vs fail-silent) mới chạm tới điều người phỏng vấn thực sự muốn kiểm tra.
- "Cho một hàm nhận `any`, bạn sửa sao để giữ type safety mà vẫn dùng được cho nhiều kiểu dữ liệu?" — câu trả lời đúng không phải "thêm kiểu cụ thể" mà là generic, và phải giải thích được vì sao generic khác union cố định.
- "Đoạn code này báo lỗi ở dòng nào, vì sao?" — thường là một đoạn `switch` thiếu case, hoặc một lời gọi hàm generic constraint với key không tồn tại; trả lời đúng dòng không khó, giải thích được cơ chế TypeScript dùng để phát hiện lỗi đó mới là điều được chấm.
- "Khi nào bạn dùng `unknown` thay `any`?" — câu trả lời tốt nêu được tình huống cụ thể (dữ liệu từ `JSON.parse`, từ `catch`), không chỉ nêu "an toàn hơn".

## Ba lối mòn hay gặp — và cái giá phải trả

Ba cách làm dưới đây đều "chạy được" trong phần lớn trường hợp, nên rất dễ trở thành thói quen mà không ai chất vấn — cho tới khi bị hỏi trong phỏng vấn, hoặc tới khi code thật gặp đúng tình huống mà cách làm đó không còn che được.

**Dùng `any` thay generic.** Một hàm nhận vào giá trị bất kỳ và trả về đúng giá trị đó — viết nhanh nhất là khai kiểu tham số và kiểu trả về đều là `any`. Code chạy đúng ở runtime. Cái mất là mối liên kết giữa kiểu đầu vào và kiểu đầu ra: `any` tắt hẳn việc kiểm tra kiểu, nên gọi một method không tồn tại trên giá trị trả về vẫn qua được lúc biên dịch, và chỉ lộ ra khi chạy đúng dòng đó ở runtime — có thể là ở production, không phải lúc code review. Mục "Generic" dưới đây đi vào đúng cơ chế bị mất này.

**Dùng union cố định thay generic constraint.** Bài toán "lấy property của object, báo lỗi nếu key không tồn tại" nhìn qua giống chỉ cần một generic `T` cho object và khai kiểu key là `keyof T`. Cách này compile được, nhưng kiểu trả về luôn là union của toàn bộ property trong `T` — cùng một union bất kể bạn truyền key nào vào, không phân biệt được lời gọi lấy `status` khác lời gọi lấy `total`. Mục "Generic constraint" dưới đây chỉ ra vì sao cần một generic thứ hai, ràng buộc bởi generic thứ nhất, để giữ được chính xác đó theo từng lời gọi.

**Viết `interface`/`type` theo thói quen, không theo lý do kỹ thuật.** Nhiều codebase chọn cố định một trong hai — "team dùng `interface` cho tất cả" hoặc ngược lại — như một quy ước không giải thích được. Vấn đề chỉ hiện ra khi gặp tình huống mà hai cách không tương đương: cần biểu diễn "hoặc A hoặc B" (`type` làm được, `interface` không), hoặc cần mở rộng một type định nghĩa sẵn trong thư viện bên thứ ba (`interface` làm được qua merge, `type` không). Chọn sai ở đây không báo lỗi ngay — nó chỉ khiến bạn phải viết vòng qua bằng cách khác, phức tạp hơn cần thiết:

```ts
// Team quy ước "chỉ dùng interface" — tới khi cần props loại trừ nhau cho component:
interface ButtonPropsWrong {
  variant: 'link' | 'button';
  href?: string;      // optional vì không phải lúc nào cũng có
  onClick?: () => void; // optional vì không phải lúc nào cũng có
}
// Compile qua, nhưng không còn ràng buộc "link phải có href, button phải có onClick".
// Gọi renderButton({ variant: 'link' }) — thiếu cả href và onClick — vẫn qua lúc biên dịch,
// và chỉ crash lúc runtime khi code cố gọi onClick() trên một giá trị undefined.
```

Đây chính là hậu quả cụ thể: không phải `interface` "sai", mà quy ước cứng "chỉ dùng một loại" đã loại bỏ lựa chọn `type` đúng lúc cần discriminated union, buộc phải nới lỏng ràng buộc bằng optional field — và optional field không ép được quan hệ "có field này thì bắt buộc có field kia" như discriminated union làm được.

## `interface` vs `type`: khác ở đâu, không phải ở đâu

### Điểm chung: cả hai mô tả object shape

```ts
interface OrderA {
  id: string;
  total: number;
}

type OrderB = {
  id: string;
  total: number;
};
```

Hai khai báo trên tương đương hoàn toàn — cùng cho phép, cùng từ chối những giá trị giống nhau. Với object shape đơn giản như trên, không có khác biệt kỹ thuật nào để chọn giữa hai cách; phần khác biệt thật nằm ở những gì `interface` làm được mà `type` không, và ngược lại.

### `type` làm được union, alias cho kiểu không-phải-object; `interface` không

```ts
type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';
type OrderId = string;
type Coordinates = [number, number];
```

`interface` không có cách viết tương đương cho ba khai báo trên — nó chỉ mô tả object shape, không mô tả "một trong các giá trị sau" (union), không đặt tên cho một kiểu nguyên thuỷ, không mô tả tuple.

### `interface` merge được, `type` không

**Declaration merging** — khai báo cùng một tên ở nhiều nơi khác nhau, TypeScript tự gộp các khai báo đó lại thành một, thay vì báo lỗi trùng tên — là khả năng riêng của `interface`:

```ts
interface Animal {
  name: string;
}

interface Animal {
  age: number;
}

// TypeScript gộp hai khai báo trên; Animal thực tế có cả hai field.
const cat: Animal = { name: 'Tom', age: 3 };
```

Thử viết lại bằng `type` sẽ báo lỗi ngay: `type Animal = { name: string }` rồi `type Animal = { age: number }` ở dưới là khai báo trùng tên, không phải mở rộng — TypeScript báo "Duplicate identifier 'Animal'".

Khả năng này không chỉ là chi tiết cú pháp — nó là cách thực tế để mở rộng một type định nghĩa sẵn trong thư viện bên thứ ba mà bạn không sửa được file gốc. Tình huống hay gặp nhất: middleware xác thực gắn thêm field `user` vào object `Request` của Express sau khi verify token, nhưng type `Request` gốc trong `@types/express` không có field đó. Vì `Express.Request` được khai báo bằng `interface`, bạn augment thêm field mà không cần đụng vào file trong `node_modules`:

```ts
// file types của bạn, ví dụ src/types/express.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

// từ đây, mọi nơi dùng Express.Request trong codebase đều thấy field user
function requireAuth(req: Request) {
  if (!req.user) throw new Error('Unauthorized');
}
```

Nếu `Request` được định nghĩa bằng `type` thay vì `interface`, cách augment này không tồn tại — bạn buộc phải tạo một type mới (`type AuthenticatedRequest = Request & { user: ... }`) và đổi kiểu tham số ở mọi handler cần field đó, thay vì mở rộng type gốc tại chỗ.

### `extends` fail-fast, `&` fail-silent-rồi-nổ-muộn

Đây là khác biệt cơ chế quan trọng nhất giữa hai cách mở rộng type — và cũng là điểm hay bị hỏi xoáy nhất trong phỏng vấn. Xét hai cách mở rộng cùng một object shape xung khắc nhau ở field `id`:

```ts
interface A {
  id: string;
}

interface B extends A {
  id: number;
  // Lỗi ngay tại dòng này:
  // Interface 'B' incorrectly extends interface 'A'.
  //   Types of property 'id' are incompatible.
}
```

`extends` giữa hai `interface` thực hiện **subtype checking** — kiểm tra chủ động xem type mở rộng có còn là tập con hợp lệ của type gốc không — ngay tại thời điểm khai báo. Field `id` xung khắc (một bên `string`, một bên `number`) bị TypeScript phát hiện và chặn lại lập tức, tại đúng dòng gây ra vấn đề.

```ts
type X = { id: string };

type Y = X & { id: number };
// Compile qua bình thường — không có lỗi nào ở đây.

function useY(y: Y) {
  y.id; // kiểu của y.id là `never`
}
```

`&` (intersection) không kiểm tra xung khắc tại chỗ khai báo — nó chỉ gộp cơ học các field, và với field trùng tên nhưng kiểu khác nhau, kết quả là **`never`** — kiểu đại diện cho tập rỗng, không có giá trị nào vừa thoả `string` vừa thoả `number` cùng lúc. Khai báo `type Y = X & { id: number }` compile qua vô điều kiện. Lỗi chỉ lộ ra ở bất kỳ chỗ nào sau đó cố gán một giá trị thật vào `y.id` — có thể cách xa hàng chục dòng, hàng chục file so với nơi `Y` được định nghĩa, và người debug lúc đó nhìn thấy lỗi "type never không nhận string" chứ không thấy ngay nguyên nhân gốc là field `id` xung khắc giữa `X` và phần mở rộng.

Tóm gọn dùng được khi phỏng vấn: `interface extends` **fail-fast** tại điểm khai báo; `type` với `&` **fail-silent-rồi-nổ-muộn** ở nơi dùng.

### Discriminated union — lý do thực tế chọn `type` cho props component

**Discriminated union** — một union gồm nhiều object shape, mỗi shape có chung một field làm dấu hiệu phân biệt (discriminant) giữ giá trị literal cố định, để TypeScript tự thu hẹp (narrow) được đang ở shape nào dựa vào giá trị field đó — là lý do thực tế phổ biến nhất để chọn `type` thay `interface` cho props của component:

```ts
type ButtonProps =
  | { variant: 'link'; href: string }
  | { variant: 'button'; onClick: () => void };
```

`ButtonProps` biểu diễn "hoặc là link kèm `href`, hoặc là button kèm `onClick` — loại trừ nhau, không thể vừa có `href` vừa có `onClick`". `interface` không có khái niệm "hoặc" giữa hai shape, nên không viết được cấu trúc này — nó chỉ có thể mô tả một shape duy nhất tại một thời điểm, hoặc mở rộng thêm field vào một shape có sẵn, không phải chọn một trong nhiều shape loại trừ nhau.

### Tổng kết nhanh dùng được khi phỏng vấn

Cả hai đều mô tả object shape; khác biệt thật là `interface` merge được và fail-fast khi extend xung khắc, `type` làm được union/tuple/alias cho kiểu không-phải-object — chọn theo cái mình cần biểu diễn, không theo thói quen.

## Generic: giữ type safety mà vẫn linh hoạt

### Generic khác `any` ở đâu

Xét hàm nhận một giá trị và trả về đúng giá trị đó, viết theo ba cách:

```ts
function identityAny(param: any): any {
  return param;
}

function identityGeneric<T>(param: T): T {
  return param;
}

identityAny(5).toUpperCase();
// Compile qua vô điều kiện — any tắt hết type checking.
// Runtime crash: (5).toUpperCase is not a function.

identityGeneric(5).toUpperCase();
// Lỗi compile-time ngay tại dòng này:
// Property 'toUpperCase' does not exist on type 'number'.
```

`identityAny` xoá hoàn toàn thông tin kiểu — TypeScript không còn biết gì về `param` sau khi nó đi qua hàm, nên chấp nhận bất kỳ method nào được gọi lên kết quả, đúng hay sai đều qua. `identityGeneric<T>` giữ lại quan hệ input-output: mỗi lời gọi tự suy ra `T` riêng theo giá trị truyền vào — `identityGeneric(5)` suy ra `T = number`, `identityGeneric("a")` suy ra `T = string` — và TypeScript biết chắc kiểu trả về là chính xác kiểu đó, nên phát hiện `toUpperCase` không tồn tại trên `number` ngay lúc biên dịch, trước khi code chạy.

Đây là giá trị thật của generic: giữ được type safety như khi viết kiểu cụ thể, mà vẫn linh hoạt dùng chung một hàm cho nhiều kiểu khác nhau — khác `any` (tắt hẳn kiểm tra) và cũng khác việc gán cố định một kiểu cụ thể (mất tính dùng lại cho kiểu khác).

### Generic khác union cố định ở đâu

Một cách viết khác cũng "linh hoạt hơn một kiểu cụ thể" là dùng union cố định:

```ts
function identityUnion(param: number | string): number | string {
  return param;
}

const result = identityUnion(5);
// Kiểu của result là `number | string`, KHÔNG phải `number`.
// Muốn gọi method riêng của number (ví dụ toFixed) phải tự narrow lại bằng typeof,
// dù bạn vừa truyền vào đúng một số cụ thể.
```

`identityUnion` chấp nhận cả `number` và `string`, nhưng kiểu trả về luôn là cùng một union `number | string` cho mọi lời gọi — TypeScript không phân biệt được lời gọi nào truyền `number`, lời gọi nào truyền `string`. Generic giữ được sự phân biệt đó vì `T` được suy ra lại từ đầu ở mỗi lời gọi, không phải một kiểu cố định gán một lần khi viết hàm.

### Bẫy hay gặp: generic phải nằm ở call signature

Một cách viết sai phổ biến khi tách kiểu hàm generic ra một alias riêng — nhìn qua có vẻ tương đương nhưng làm mất đúng thứ generic tồn tại để giữ:

```ts
// SAI: T bị chốt cứng ngay tại chỗ khai báo biến
type IdentityWrong<T> = (param: T) => T;

const identityWrong: IdentityWrong<number> = (param) => param;
identityWrong(5);      // OK
identityWrong("a");    // Lỗi: chỉ nhận number, đã mất tính generic

// ĐÚNG: đặt <T> ngay trong call signature, không phải trên tên alias
type Identity = <T>(param: T) => T;

const identityRight: Identity = (param) => param;
identityRight(5);       // T suy ra number cho riêng lời gọi này
identityRight("a");     // T suy ra string cho riêng lời gọi này
```

Khác biệt nằm ở vị trí đặt `<T>`. Ở cách sai, `IdentityWrong<T>` cần một kiểu cụ thể điền vào `T` ngay khi khai báo biến `identityWrong` — sau dòng đó, `T` đã là `number` cố định, không còn gì để suy luận ở các lời gọi tiếp theo. Ở cách đúng, `<T>` nằm bên trong call signature của `Identity` — nghĩa là `T` chưa bị gán ở đâu cả cho tới khi `identityRight` thực sự được gọi, và mỗi lời gọi tự suy ra `T` của riêng nó, đúng như hàm `identityGeneric` viết trực tiếp ở trên.

## Generic constraint: ràng buộc một generic bằng generic khác

### Bài toán: lấy property của object, type-safe

Đề bài quen gặp trong phỏng vấn: viết một hàm lấy giá trị của một property trong object, sao cho vẫn giữ type-safe và báo lỗi ngay lúc biên dịch nếu key được truyền không tồn tại trên object đó.

```ts
interface Order {
  id: string;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  total: number;
}

const order: Order = { id: 'o-001', status: 'pending', total: 250_000 };
```

### Vì sao một generic `T` là không đủ

Cách viết đầu tiên nhiều người thử — cùng gốc với sai lầm "union cố định thay generic" ở mục trước — dùng một generic `T` cho object, và khai kiểu key trực tiếp là `keyof T`:

```ts
function getPropertyWrong<T>(obj: T, key: keyof T): T[keyof T] {
  return obj[key];
}

const value = getPropertyWrong(order, 'status');
// Kiểu của value: string | number
// (hợp nhất kiểu của TẤT CẢ property trong Order — id, status, total —
//  không phải riêng kiểu thật của "status" mà lời gọi này truyền vào)
```

`keyof T` và `T[keyof T]` là union **cố định** — tính một lần từ toàn bộ property của `T`, giống nhau cho mọi lời gọi, không phân biệt được lời gọi truyền `'status'` khác lời gọi truyền `'total'`. Đây đúng là cùng cơ chế sai với `identityUnion` ở mục Generic: dùng một union thay cho việc để TypeScript suy luận riêng theo từng lời gọi.

### Đáp án: `K extends keyof T` — generic thứ hai, ràng buộc bởi generic thứ nhất

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const status = getProperty(order, 'status');
// Kiểu của status: 'pending' | 'paid' | 'shipped' | 'cancelled' — đúng kiểu thật của status

getProperty(order, 'age');
// Lỗi compile-time ngay tại tham số key:
// Argument of type '"age"' is not assignable to parameter of type
// '"id" | "status" | "total"'.
```

**Generic constraint** — ràng buộc giới hạn một generic parameter chỉ được nhận một tập kiểu nhất định, viết bằng `extends` — ở đây là `K extends keyof T`: giới hạn `K` chỉ được là một trong các key thật của `T`. Vì `K` là generic riêng, nó được suy ra lại theo từng lời gọi giống `T` ở hàm `identity` — gọi với `'status'` thì `K = 'status'`, và kiểu trả về `T[K]` khi đó chính xác là `T['status']`, không lẫn với `id` hay `total`. Đây là lý do cần generic thứ hai: `T` một mình không đủ để vừa mô tả "key phải thuộc về object nào" vừa giữ được độ chính xác theo từng lời gọi — phải tách vai trò đó ra một generic riêng, ràng buộc bởi generic thứ nhất.

## Utility type nền: tất cả đều xây từ mapped type

### Mapped type — nền của mọi utility type dưới đây

**Mapped type** — cú pháp lặp qua từng key của một type để tạo ra type mới, dạng `{ [K in keyof T]: ... }` — đọc là "với mỗi key `K` trong `keyof T`, tạo ra một property tương ứng":

```ts
type Clone<T> = { [K in keyof T]: T[K] };
// Với mỗi key K trong keyof T, giữ nguyên kiểu giá trị T[K].
// Clone<Order> tương đương chính Order.
```

Bốn utility type dưới đây — `Partial`, `Pick`, `Omit`, `Record` — đều là biến thể của cùng cú pháp này, khác nhau ở việc lặp qua tập key nào và có sửa gì thêm vào mỗi property hay không. Cả bốn đều đã có sẵn trong TypeScript (không cần tự định nghĩa); phần định nghĩa dưới đây chỉ để lộ cơ chế bên trong.

### `Partial<T>` — thêm dấu optional vào mọi property

```ts
type Partial<T> = { [K in keyof T]?: T[K] };

type OrderPatch = Partial<Order>;
// { id?: string; status?: ...; total?: number }

function updateOrder(id: string, patch: Partial<Order>) {
  // patch có thể chỉ chứa { status: 'paid' }, không cần đủ mọi field của Order
}
```

Khác `Clone<T>` ở trên đúng một chỗ: thêm `?:` sau mỗi `K`, khiến mọi property trở thành optional. Dùng cho các hàm cập nhật một phần — như `updateOrder` chỉ cần patch chứa những field muốn sửa, không phải toàn bộ `Order`.

### `Pick<T, K>` — chỉ giữ một tập con key do người gọi chỉ định

```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] };

type OrderSummary = Pick<Order, 'id' | 'status'>;
// { id: string; status: 'pending' | 'paid' | 'shipped' | 'cancelled' }
// Field "total" bị loại hẳn khỏi type này, không phải chỉ ẩn.
```

Khác biệt so với `Partial`/`Clone`: `Pick` lặp qua `K` — tập con key do người gọi chỉ định qua generic constraint `K extends keyof T`, giống hệt cơ chế đã thấy ở `getProperty` — thay vì lặp qua toàn bộ `keyof T`. Property không nằm trong `K` bị loại hẳn ra khỏi type kết quả; `Pick` cũng không thêm `?:` như `Partial`, các property được giữ vẫn required như ở `T`.

### `Omit<T, K>` — phần bù của `Pick`

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type OrderWithoutTotal = Omit<Order, 'total'>;
// { id: string; status: 'pending' | 'paid' | 'shipped' | 'cancelled' }
```

`Omit` không tự lặp qua key — nó tính ra tập key còn lại (toàn bộ `keyof T` trừ `K`) bằng `Exclude<keyof T, K>`, rồi giao lại cho `Pick` xử lý phần lặp. `Exclude` là một **conditional type** — cách TypeScript rẽ nhánh kiểu dựa trên điều kiện, tương tự `extends ? :` ở mức type — nằm ngoài phạm vi chương này; ở đây chỉ cần biết `Omit<T, K>` tương đương `Pick<T, "mọi key trừ K">`, không cần tự viết lại `Exclude`.

`Pick` và `Omit` hay xuất hiện cùng nhau khi định hình dữ liệu trả về cho client — ví dụ endpoint danh sách đơn hàng không cần trả nguyên `Order` đầy đủ. Giả sử `Order` trong ví dụ này có thêm một field chỉ dùng nội bộ:

```ts
interface Order {
  id: string;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  total: number;
  internalNote: string; // chỉ dùng nội bộ, không trả ra API
}

type OrderListItem = Omit<Order, 'internalNote'>;
// Tương đương Pick<Order, 'id' | 'status' | 'total'> —
// nhưng Omit không yêu cầu liệt kê lại các field muốn giữ,
// tiện hơn khi Order có nhiều field và chỉ muốn loại một vài field nhạy cảm.
```

Chọn `Pick` hay `Omit` phụ thuộc field nào ít hơn: nhiều field cần giữ, ít field cần loại — dùng `Omit`; ngược lại dùng `Pick`.

### `Record<K, V>` — bảng tra cứu key cố định, value cố định

```ts
type Record<K extends keyof any, V> = { [P in K]: V };

const statusLabel: Record<Order['status'], string> = {
  pending: 'Đang xử lý',
  paid: 'Đã thanh toán',
  shipped: 'Đã giao',
  cancelled: 'Đã huỷ',
};

const inventoryBySku: Record<string, number> = {
  'SKU-001': 42,
  'SKU-002': 0,
};
```

Khác ba utility type trên: `Record<K, V>` không lấy `K` từ `keyof` của một type có sẵn — `K` ở đây là tập key bạn tự định nghĩa (một union literal như `Order['status']`, hoặc rộng như `string`), và mọi property đều mang cùng một kiểu value `V`. Dùng cho các bảng tra cứu: `statusLabel` ép người viết phải có đủ nhãn cho cả bốn trạng thái — thiếu một trạng thái sẽ báo lỗi compile-time; `inventoryBySku` biểu diễn số lượng tồn kho theo mã SKU, key không cố định trước nên khai `string`.

## `unknown` vs `any`: khác một dòng chặn, khác cả một lớp lỗi

```ts
function parseWithAny(raw: any) {
  return raw.toUpperCase();
  // Compile qua vô điều kiện.
  // Runtime crash nếu raw không phải string — ví dụ raw là số hoặc null.
}

function parseWithUnknown(raw: unknown) {
  return raw.toUpperCase();
  // Lỗi compile-time: Object is of type 'unknown'.
}

function parseWithUnknownSafe(raw: unknown) {
  if (typeof raw === 'string') {
    return raw.toUpperCase(); // đã narrow về string, hợp lệ
  }
  throw new Error('Giá trị nhận được không phải string');
}
```

`any` cho phép gọi bất kỳ method, đọc bất kỳ property trên giá trị đó mà không cần kiểm tra gì — TypeScript coi như đã biết chắc mọi thứ về giá trị này, dù thực ra không biết gì cả. `unknown` giữ nguyên ý nghĩa "chưa biết hình dạng thật của giá trị này", nhưng **chặn mọi phép dùng** — gọi method, đọc property, truyền vào chỗ cần kiểu cụ thể — cho tới khi giá trị được **narrow**, tức thu hẹp về một kiểu cụ thể qua `typeof`, `instanceof`, hoặc type guard tự viết.

Đây là lý do `unknown` là kiểu mặc định của tham số trong `catch` khi bật `strict` mode (từ TypeScript 4.4, qua cờ `useUnknownInCatchVariables`). `JSON.parse()` thì khác: TypeScript vẫn khai kiểu trả về là `any`, không phải `unknown` — nhưng dữ liệu từ `JSON.parse()` không có gì đảm bảo đúng shape mong đợi, nên nên tự ép về `unknown` hoặc kiểm tra shape ngay khi nhận kết quả, thay vì tin tưởng `any` đó:

```ts
try {
  const parsed = JSON.parse(rawInventoryPayload);
  // parsed: any theo mặc định của JSON.parse — nên gán ngay sang một type cụ thể
  // hoặc kiểm tra shape trước khi dùng, thay vì tin tưởng mù quáng.
} catch (err) {
  // err: unknown
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error('Lỗi không xác định:', err);
  }
}
```

Giá trị từ bên ngoài ranh giới của type system — lỗi bị throw (có thể là bất kỳ giá trị nào, không chỉ `Error`), dữ liệu parse từ JSON, response từ một API không có type — là dữ liệu mà TypeScript không có cách nào biết trước hình dạng thật. Ép kiểu `unknown` buộc phải kiểm tra trước khi dùng; để `any` lọt qua tức âm thầm tin tưởng một giá trị chưa biết hình dạng, và khi tin tưởng đó sai, lỗi chỉ lộ ra ở runtime.

Ghép lại với ví dụ nghiệp vụ ở đầu chương: nhận payload đặt hàng từ request body, ép về `unknown` trước rồi mới kiểm tra shape, thay vì tin ngay đó là `Order` hợp lệ:

```ts
function toOrder(payload: unknown): Order {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'id' in payload &&
    'status' in payload &&
    'total' in payload
  ) {
    // Sau các kiểm tra trên, TypeScript vẫn chưa tự suy ra đủ để coi payload là Order —
    // trường hợp này thường cần ép kiểu rõ ràng (`as Order`) sau khi đã tự kiểm tra shape,
    // vì kiểm tra "in" chỉ xác nhận field tồn tại, không xác nhận đúng kiểu giá trị.
    return payload as Order;
  }
  throw new Error('Payload không đúng shape của Order');
}
```

Nếu tham số khai `any` thay `unknown`, hàm `toOrder` vẫn "chạy" mà không ép ai phải viết khối kiểm tra ở trên — và một payload thiếu field `total` (ví dụ do client cũ gọi API mới) sẽ lặng lẽ đi qua, gây lỗi ở một dòng tính toán xa phía sau, đúng dạng hậu quả đã nêu ở đầu chương cho việc dùng `any` thay công cụ kiểm tra kiểu đúng.

## Exhaustiveness check: dùng `never` để bắt case thiếu sót

### Cơ chế

Nối lại `never` đã gặp ở mục `interface` vs `type` — lần đó là hệ quả không mong muốn của `&` xung khắc, lần này là công cụ dùng có chủ đích. Lấy lại discriminated union `ButtonProps`:

```ts
type ButtonProps =
  | { variant: 'link'; href: string }
  | { variant: 'button'; onClick: () => void };

function renderLink(props: { variant: 'link'; href: string }) {
  /* ... */
}
function renderButton(props: { variant: 'button'; onClick: () => void }) {
  /* ... */
}

function render(props: ButtonProps) {
  switch (props.variant) {
    case 'link':
      return renderLink(props);
    case 'button':
      return renderButton(props);
    default: {
      const _exhaustiveCheck: never = props;
      throw new Error(`Unhandled variant: ${JSON.stringify(props)}`);
    }
  }
}
```

Mỗi nhánh `case` thu hẹp (narrow) dần kiểu của `props` theo giá trị discriminant `variant`. Tới nhánh `default`, nếu mọi case đã được xử lý hết, phần kiểu còn lại của `props` là `never` — tập rỗng, không còn shape nào chưa bị loại — nên gán `props` vào biến khai báo kiểu `never` là hợp lệ.

Giá trị thật của kỹ thuật này lộ ra khi thêm một biến thể mới mà quên sửa `switch`:

```ts
type ButtonProps =
  | { variant: 'link'; href: string }
  | { variant: 'button'; onClick: () => void }
  | { variant: 'icon'; iconName: string }; // biến thể mới thêm vào

// Trong render() ở trên, nếu switch chưa được sửa để xử lý 'icon':
// Ở nhánh default, props giờ còn lại kiểu { variant: 'icon'; iconName: string } —
// KHÔNG còn là never nữa. Gán vào biến khai báo `never` báo lỗi type ngay:
// Type '{ variant: "icon"; iconName: string }' is not assignable to type 'never'.
```

Lỗi xuất hiện ngay tại chỗ thêm biến thể mới, thời điểm sửa `ButtonProps` — không phải tới khi chạy đúng nhánh `icon` ở production mới phát hiện switch xử lý thiếu.

### Có phải code smell?

Nhìn thoáng qua, dòng `_exhaustiveCheck: never = props` không làm gì lúc chạy — nếu mọi case đã xử lý đủ, nhánh `default` không bao giờ được vào, biến đó tồn tại mà không có tác dụng runtime nào. Từ đó dễ kết luận đây là code vô nghĩa, cần bỏ.

Kết luận đó nhầm hai tầng khác nhau: **runtime-meaningless** (không làm gì lúc chương trình chạy) và **purposeless** (không có mục đích). Một dòng không chạy gì lúc runtime vẫn có mục đích rõ ràng nếu nó ràng buộc điều gì ở một tầng khác — ở đây là tầng compile-time, giống hệt vai trò của một `assert(x > 0)`: bản thân assert cũng không "làm" gì cho logic nghiệp vụ, giá trị của nó là chặn một trạng thái sai càng sớm càng tốt.

Chi phí đối trọng nếu bỏ dòng này: case thiếu sót không biến mất khỏi codebase — nó chỉ chuyển từ "báo lỗi compile-time ngay khi thêm biến thể mới" sang "im lặng cho tới khi có request chạy đúng nhánh đó ở production, và không ai xử lý". Với một union chỉ có 2 case, rủi ro này nhỏ, dễ nhớ tự kiểm. Với union 6-7 case trở lên, nhiều người cùng maintain qua thời gian, quên cập nhật `switch` khi thêm biến thể là "khi nào" chứ không phải "nếu nào" — đây chính là kiểu lỗi mà chương trình chạy ổn ở mọi test case cũ, và chỉ vỡ khi gặp đúng biến thể mới chưa từng được test.

Điểm thật sự đáng gọi là smell không phải kỹ thuật này vô nghĩa, mà là **lặp lại cùng một khối `_exhaustiveCheck` ở nhiều `switch` khác nhau** trong codebase — đó là trùng lặp code, không phải vô nghĩa về logic.

### `assertNever` — factor phần lặp lại thành một hàm dùng chung

```ts
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(x)}`);
}

function render(props: ButtonProps) {
  switch (props.variant) {
    case 'link':
      return renderLink(props);
    case 'button':
      return renderButton(props);
    default:
      return assertNever(props);
  }
}
```

Cơ chế giữ nguyên hoàn toàn — tham số `x: never` của `assertNever` chỉ nhận được giá trị hợp lệ khi kiểu còn lại ở nhánh `default` đúng là `never`, nên vẫn báo lỗi compile-time đúng như cách viết khai biến `_exhaustiveCheck` trực tiếp. Khác biệt duy nhất là phần `throw new Error(...)` không còn phải lặp lại ở mỗi `switch` — mọi nơi cần exhaustiveness check chỉ cần gọi `assertNever(props)` ở nhánh `default`.

## Giới hạn: khi nào không dùng

### Khi nào không cần generic

Generic tồn tại để giữ mối liên kết kiểu giữa nhiều lời gọi khác nhau của cùng một hàm hoặc nhiều instance khác nhau của cùng một cấu trúc. Khi object shape đã cố định và hàm chỉ dùng cho đúng một kiểu, không có kế hoạch dùng lại cho kiểu khác — viết kiểu cụ thể trực tiếp đơn giản hơn, dễ đọc hơn:

```ts
// Không cần generic ở đây — hàm này chỉ và luôn xử lý Order,
// không có lời gọi nào khác truyền kiểu khác vào.
function calculateOrderTotal(order: Order): number {
  return order.total;
}
```

Thêm `<T>` vào một hàm chỉ dùng cho một kiểu duy nhất không tăng type safety — nó chỉ thêm một lớp gián tiếp không cần thiết, khiến người đọc phải tự hỏi "hàm này có định dùng cho kiểu khác không?" trong khi câu trả lời luôn là không.

### Khi nào `interface`/`type` không tạo khác biệt thực tế

Với object shape đơn giản, không cần `extends`, không cần union — như `OrderA`/`OrderB` ở phần đầu chương — hai cách viết cho kết quả tương đương hoàn toàn ở mọi khía cạnh đã nêu: cùng chấp nhận/từ chối giá trị giống nhau, không bên nào cần đến merge hay union. Đây là một trong số ít trường hợp nên thẳng thắn gọi là **không quan trọng, chọn theo convention của team** — không cần và không nên tự bịa một lý do kỹ thuật gượng gạo để bảo vệ lựa chọn. Ép một lý do kỹ thuật vào chỗ không có khác biệt kỹ thuật thật chỉ khiến người nghe (đồng nghiệp, hoặc người phỏng vấn) nhận ra ngay là lý do đó không đứng vững khi bị hỏi thêm một câu "vậy nếu đổi sang cách khác thì sao?".

Nếu buộc phải chọn một quy ước mặc định khi team chưa có convention nào, một cách thực dụng: bắt đầu bằng `type`, vì nhu cầu union (discriminated union cho props, cho response có nhiều dạng) thường xuất hiện muộn hơn lúc mới viết shape đầu tiên — chuyển từ `type` sang `interface` khi thật cần merge dễ hơn chuyển ngược lại khi một shape ban đầu tưởng cố định hoá ra cần thêm một biến thể loại trừ nhau. Đây vẫn là gợi ý thực dụng, không phải quy tắc kỹ thuật bắt buộc — team có convention riêng thì theo convention đó.

## Bảng so sánh tổng hợp

| Tiêu chí | `interface` | `type` |
|---|---|---|
| Mô tả object shape | Có | Có |
| Union (`A \| B`), tuple, alias cho kiểu nguyên thuỷ | Không | Có |
| Declaration merging (mở rộng type của thư viện bên thứ ba) | Có | Không |
| Mở rộng khi field xung khắc | `extends` fail-fast tại khai báo | `&` fail-silent, ra `never`, lỗi nổ muộn ở nơi dùng |
| Discriminated union cho props loại trừ nhau | Không làm được | Làm được |

| Cách làm | Giữ liên kết input-output theo từng lời gọi? | Chặn sai kiểu lúc compile? | Dùng khi nào |
|---|---|---|---|
| `any` | Không | Không | Không nên dùng — tắt hẳn type checking |
| Union cố định (`number \| string`) | Không — cùng một union cho mọi lời gọi | Có, nhưng không chính xác theo lời gọi | Khi số kiểu khả dĩ hữu hạn và không cần phân biệt theo lời gọi |
| Generic (`<T>`, `<T, K extends keyof T>`) | Có | Có, chính xác theo từng lời gọi | Khi cần tái sử dụng cho nhiều kiểu mà vẫn giữ type an toàn |

| Tiêu chí | `any` | `unknown` |
|---|---|---|
| Gọi method/đọc property không kiểm tra trước | Compile qua (rủi ro crash runtime) | Lỗi compile-time |
| Cần narrow (`typeof`/`instanceof`/type guard) trước khi dùng | Không | Có, bắt buộc |
| Trường hợp dùng hợp lý | Hầu như không — nên tránh | `catch (err)`, kết quả `JSON.parse()`, dữ liệu chưa rõ hình dạng từ bên ngoài |

## Tổng kết

Toàn chương xoay quanh một chủ đề duy nhất: giữ được **type safety** — khả năng để trình biên dịch phát hiện sai kiểu trước khi chạy, thay vì để lỗi lộ ra ở runtime — mà không đánh đổi bằng độ linh hoạt. `any` mua linh hoạt bằng cách tắt hẳn kiểm tra kiểu. Union cố định và generic constraint viết sai (một `T` duy nhất) mua sự "linh hoạt" giả — trông như tổng quát nhưng lại tính cùng một union cho mọi lời gọi. Generic đúng cách, `interface`/`type` chọn đúng theo nhu cầu biểu diễn, và `unknown` thay `any` cho dữ liệu chưa rõ hình dạng — đều là cách giữ cả hai: an toàn và linh hoạt cùng lúc, bằng cách để TypeScript suy luận lại theo từng ngữ cảnh cụ thể, thay vì cố định một lần cho mọi trường hợp.

Đối chiếu lại với ba lối mòn nêu ở đầu chương: dùng `any` thay generic mất liên kết input-output — sửa bằng generic thật (`<T>`, không phải khai ở alias); dùng union cố định thay generic constraint mất độ chính xác theo từng lời gọi — sửa bằng thêm generic thứ hai ràng buộc bởi generic thứ nhất (`K extends keyof T`); viết `interface`/`type` theo thói quen cứng một quy ước — sửa bằng chọn theo cái cần biểu diễn (merge/fail-fast cần `interface`, union/discriminated union cần `type`), trừ trường hợp object shape đơn giản thì cả hai tương đương và chọn theo convention team là hợp lý.

## Thuật ngữ

- **Declaration merging** — khai báo cùng tên ở nhiều nơi khác nhau, TypeScript tự gộp lại thành một; chỉ `interface` làm được.
- **Discriminated union** — union gồm nhiều object shape, mỗi shape có chung một field discriminant giữ giá trị literal để TypeScript narrow theo giá trị đó.
- **Mapped type** — cú pháp `{ [K in keyof T]: ... }`, lặp qua từng key của một type để tạo type mới; nền của `Partial`, `Pick`, `Omit`, `Record`.
- **Generic constraint** — ràng buộc giới hạn một generic parameter chỉ nhận một tập kiểu nhất định, viết bằng `extends` (ví dụ `K extends keyof T`).
- **Narrowing** — thu hẹp kiểu của một giá trị về một kiểu cụ thể hơn, qua `typeof`, `instanceof`, hoặc kiểm tra discriminant field trong `switch`/`if`.
- **Exhaustiveness check** — kỹ thuật dùng kiểu `never` ở nhánh `default`/`else` để buộc trình biên dịch báo lỗi nếu có case của một union chưa được xử lý.
- **Conditional type** — cách TypeScript rẽ nhánh kiểu dựa trên điều kiện (`Exclude`, `Extract` dùng cơ chế này) — chỉ nêu tên ở chương này, không đào sâu cơ chế.

## Đọc thêm

TypeScript Handbook chính thức, các phần: Generics, Narrowing, Utility Types, Type Compatibility — đây là nguồn chính xác nhất cho cơ chế đã nêu trong chương này, và các ví dụ trong Handbook thường được dùng lại nguyên văn trong phỏng vấn.

## Chương tiếp theo

Node.js Runtime & Performance — chuyển từ type system sang cơ chế thực thi của Node.js: kiến trúc Event Loop, non-blocking I/O, và các vấn đề hiệu năng thường gặp.
