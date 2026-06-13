# Mini Library Management System

Hệ thống quản lý thư viện mini được phát triển bằng các công nghệ hiện đại nhất (Next.js, Tailwind CSS, Prisma, SQLite), áp dụng kiến trúc MVC và quản lý mã nguồn chuyên nghiệp bằng Git.

## 🚀 Công nghệ sử dụng

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [SQLite](https://sqlite.org/) (File-based, không cần cài đặt server)
- **ORM**: [Prisma](https://www.prisma.io/)

## 📂 Kiến trúc hệ thống (MVC)

Hệ thống được thiết kế theo mô hình Model-View-Controller, ứng dụng trực tiếp trong Next.js:
- **Model (`prisma/schema.prisma`)**: Quản lý database schema (Sách, Độc giả, Phiếu mượn). Tương tác qua Prisma Client (`lib/db.js`).
- **View (`app/.../page.js`, `...Client.js`)**: Các React Components kết hợp Tailwind CSS để render UI trực quan, mượt mà.
- **Controller (`app/actions/...`)**: Next.js Server Actions đóng vai trò xử lý logic nghiệp vụ backend một cách bảo mật.

## ✨ Chức năng chính

1. **Quản lý Sách**:
   - Thêm, sửa, xóa thông tin sách.
   - Theo dõi số lượng sách còn trong kho.
2. **Quản lý Độc giả**:
   - Đăng ký mới, cập nhật thông tin độc giả (Tên, SĐT).
3. **Mượn / Trả Sách**:
   - Tạo phiếu mượn (Tự động trừ số lượng sách, báo lỗi nếu kho hết sách).
   - Xử lý trả sách (Cập nhật lại kho).
   - Tự động tính toán phí phạt trễ hạn (Nếu mượn quá 7 ngày, phạt 5.000đ/ngày trễ).

## 🛠️ Hướng dẫn cài đặt và chạy ứng dụng

### Yêu cầu hệ thống
- Máy tính đã cài đặt **Node.js** (phiên bản 18.x trở lên).

### Các bước cài đặt

1. **Clone/Tải mã nguồn về máy**:
   Mở terminal trong thư mục chứa dự án.

2. **Cài đặt các thư viện**:
   ```bash
   npm install
   ```

3. **Khởi tạo cơ sở dữ liệu (SQLite)**:
   Hệ thống sử dụng SQLite nên mọi thứ rất đơn giản, chỉ cần chạy lệnh sau để push schema:
   ```bash
   npx prisma db push
   ```
   *(Thao tác này sẽ tự động tạo file `dev.db` trong thư mục project)*

4. **Chạy ứng dụng (Development Mode)**:
   ```bash
   npm run dev
   ```

5. **Truy cập ứng dụng**:
   Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

## 🌳 Chiến lược quản lý mã nguồn (Git)

Dự án tuân thủ nghiêm ngặt quy trình làm việc Git chuyên nghiệp:
- Mã nguồn chính được lưu trên nhánh `master` (hoặc `main`).
- Mỗi chức năng được phát triển trên một nhánh riêng biệt (`feature/manage-books`, `feature/manage-readers`, `feature/borrow-return`).
- Sau khi hoàn thiện từng chức năng, tiến hành commit với message rõ ràng và Merge vào nhánh chính.
