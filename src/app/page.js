import { prisma } from '@/lib/db'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard Overview | Mini Library',
}

export default async function Dashboard() {
  const booksCount = await prisma.book.count()
  const readersCount = await prisma.reader.count()
  const activeBorrows = await prisma.borrowTicket.count({
    where: { status: 'BORROWED' }
  })
  
  // Lấy 5 phiếu mượn gần đây nhất
  const recentTickets = await prisma.borrowTicket.findMany({
    take: 5,
    include: {
      book: true,
      reader: true
    },
    orderBy: { borrowDate: 'desc' }
  })

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-6">
        <div>
          <h1 className="text-4xl font-extrabold font-title tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Hệ thống Quản lý Thư viện Mini
          </h1>
          <p className="text-text-muted text-sm mt-1.5 font-medium">
            Chào mừng quay trở lại. Dưới đây là tình hình hoạt động của thư viện hôm nay.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-500/20">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Books */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-300">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">Tổng Số Sách</span>
              <p className="text-4xl font-bold font-title leading-none">{booksCount}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
            <span>Xem danh mục</span>
            <Link href="/books" className="hover:underline font-medium flex items-center gap-1">
              Chi tiết &rarr;
            </Link>
          </div>
        </div>

        {/* Card 2: Readers */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl p-6 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Tổng Số Độc Giả</span>
              <p className="text-4xl font-bold font-title leading-none">{readersCount}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-100">
            <span>Danh sách thành viên</span>
            <Link href="/readers" className="hover:underline font-medium flex items-center gap-1">
              Chi tiết &rarr;
            </Link>
          </div>
        </div>

        {/* Card 3: Borrowings */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-orange-500 to-rose-600 text-white rounded-2xl p-6 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-100">Đang Mượn</span>
              <p className="text-4xl font-bold font-title leading-none">{activeBorrows}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-orange-100">
            <span>Xem phiếu mượn</span>
            <Link href="/borrow" className="hover:underline font-medium flex items-center gap-1">
              Chi tiết &rarr;
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 bg-card-app border border-card-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-text-app mb-4 font-title">Hoạt động mượn trả gần đây</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-card-border">
              <thead>
                <tr className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                  <th className="pb-3">Độc giả</th>
                  <th className="pb-3">Tên sách</th>
                  <th className="pb-3">Ngày mượn</th>
                  <th className="pb-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border text-sm">
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-550/10 transition duration-150">
                    <td className="py-3.5 font-medium text-text-app">{ticket.reader.name}</td>
                    <td className="py-3.5 text-text-muted">{ticket.book.title}</td>
                    <td className="py-3.5 text-text-muted">
                      {new Date(ticket.borrowDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ticket.status === 'RETURNED' 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                          : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      }`}>
                        {ticket.status === 'RETURNED' ? 'Đã trả' : 'Đang mượn'}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentTickets.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-text-muted text-sm">
                      Chưa có hoạt động mượn sách nào được ghi nhận.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-card-app border border-card-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-app mb-4 font-title">Thao tác nhanh</h2>
            <div className="space-y-3">
              <Link href="/books" className="flex items-center gap-3.5 p-3.5 rounded-xl border border-card-border hover:bg-slate-500/5 transition text-sm font-medium">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  +
                </div>
                <div>
                  <p className="text-text-app leading-none">Thêm Sách mới</p>
                  <p className="text-text-muted text-[10px] mt-1 font-normal">Đưa đầu sách mới vào kho</p>
                </div>
              </Link>

              <Link href="/readers" className="flex items-center gap-3.5 p-3.5 rounded-xl border border-card-border hover:bg-slate-500/5 transition text-sm font-medium">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  +
                </div>
                <div>
                  <p className="text-text-app leading-none">Đăng ký Độc giả</p>
                  <p className="text-text-muted text-[10px] mt-1 font-normal">Cấp thẻ thư viện thành viên</p>
                </div>
              </Link>

              <Link href="/borrow" className="flex items-center gap-3.5 p-3.5 rounded-xl border border-card-border hover:bg-slate-500/5 transition text-sm font-medium">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  +
                </div>
                <div>
                  <p className="text-text-app leading-none">Lập Phiếu Mượn</p>
                  <p className="text-text-muted text-[10px] mt-1 font-normal">Xử lý mượn/trả sách nhanh</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="pt-6 border-t border-card-border mt-6 text-xs text-text-muted">
            <span className="font-semibold text-text-app">Quy định thư viện:</span> Thời hạn mượn mặc định là 7 ngày. Phí trễ hạn tự động áp dụng 5.000đ/ngày.
          </div>
        </div>
      </div>
    </div>
  )
}
