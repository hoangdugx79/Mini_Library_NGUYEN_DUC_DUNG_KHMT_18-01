import { prisma } from '@/lib/db'

export default async function Dashboard() {
  const booksCount = await prisma.book.count()
  const readersCount = await prisma.reader.count()
  const activeBorrows = await prisma.borrowTicket.count({
    where: { status: 'BORROWED' }
  })

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Tổng số Sách</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">{booksCount}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Tổng số Độc giả</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">{readersCount}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-orange-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Đang mượn</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">{activeBorrows}</p>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Chào mừng đến với Hệ thống Quản lý Thư viện Mini</h2>
        <p className="text-gray-600">
          Sử dụng thanh điều hướng bên trái để truy cập các chức năng:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
          <li><strong>Quản lý Sách:</strong> Thêm, sửa, xóa và theo dõi số lượng sách trong kho.</li>
          <li><strong>Quản lý Độc giả:</strong> Đăng ký thẻ độc giả, cập nhật thông tin người mượn.</li>
          <li><strong>Mượn / Trả sách:</strong> Lập phiếu mượn, theo dõi trả sách và tính phí trễ hạn tự động.</li>
        </ul>
      </div>
    </div>
  )
}
