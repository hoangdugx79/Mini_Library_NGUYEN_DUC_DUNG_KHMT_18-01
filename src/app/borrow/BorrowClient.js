'use client'

import { useState } from 'react'
import { createTicket, returnBook } from '../actions/borrow'

export default function BorrowClient({ initialTickets, books, readers }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (formData) => {
    try {
      setError('')
      await createTicket(formData)
      setIsModalOpen(false)
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra')
    }
  }

  const handleReturn = async (id) => {
    if(confirm('Bạn xác nhận muốn nhận trả cuốn sách này?')) {
      await returnBook(id)
    }
  }

  const openAdd = () => {
    setError('')
    setIsModalOpen(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold font-title tracking-tight text-text-app">
            Mượn / Trả sách
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Ghi nhận phiếu mượn mới, theo dõi trạng thái trả sách và tính phí phạt trễ hạn tự động.
          </p>
        </div>
        <button 
          onClick={openAdd}
          className="bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 transition duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Tạo phiếu mượn
        </button>
      </div>

      {/* Tickets List */}
      <div className="bg-card-app border border-card-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-card-border">
            <thead className="bg-slate-500/5">
              <tr className="text-left text-xs font-bold text-text-muted uppercase tracking-wider">
                <th className="px-6 py-4">Mã Phiếu</th>
                <th className="px-6 py-4">Độc giả</th>
                <th className="px-6 py-4">Sách mượn</th>
                <th className="px-6 py-4">Ngày mượn</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Phí phạt</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-sm">
              {initialTickets.map((ticket) => {
                const borrowDate = new Date(ticket.borrowDate)
                const dueDate = new Date(borrowDate)
                dueDate.setDate(dueDate.getDate() + 7)
                const isOverdue = ticket.status === 'BORROWED' && new Date() > dueDate

                return (
                  <tr key={ticket.id} className="hover:bg-slate-500/5 transition duration-150">
                    <td className="px-6 py-4 text-text-muted font-medium">#{ticket.id}</td>
                    <td className="px-6 py-4 font-semibold text-text-app">{ticket.reader.name}</td>
                    <td className="px-6 py-4 text-text-app font-medium">{ticket.book.title}</td>
                    <td className="px-6 py-4 text-text-muted font-medium">{formatDate(ticket.borrowDate)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                          ticket.status === 'RETURNED' 
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' 
                            : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
                        }`}>
                          {ticket.status === 'RETURNED' ? 'Đã trả' : 'Đang mượn'}
                        </span>
                        {isOverdue && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-md">Trễ hạn</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-rose-500 font-semibold">
                      {ticket.lateFee > 0 ? formatCurrency(ticket.lateFee) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {ticket.status === 'BORROWED' ? (
                        <button 
                          onClick={() => handleReturn(ticket.id)} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 text-xs font-bold uppercase tracking-wider rounded-lg border border-green-500/10 transition"
                        >
                          Nhận trả sách
                        </button>
                      ) : (
                        <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">Hoàn tất</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {initialTickets.length === 0 && (
          <div className="text-center py-12 text-text-muted">Chưa có giao dịch mượn/trả nào được lập.</div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card-app border border-card-border rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-card-border flex justify-between items-center">
              <h2 className="text-lg font-bold text-text-app font-title">Tạo phiếu mượn sách mới</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-app text-2xl font-bold focus:outline-none"
              >
                &times;
              </button>
            </div>
            
            {error && (
              <div className="mx-6 mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            
            <form action={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Chọn độc giả mượn</label>
                <select 
                  name="readerId" 
                  required 
                  className="w-full bg-slate-500/5 border border-card-border rounded-xl p-3 text-sm text-text-app focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-card-app select-none cursor-pointer"
                >
                  <option value="">-- Lựa chọn độc giả --</option>
                  {readers.map(r => (
                    <option key={r.id} value={r.id}>{r.name} - {r.phone}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Chọn sách cần mượn</label>
                <select 
                  name="bookId" 
                  required 
                  className="w-full bg-slate-500/5 border border-card-border rounded-xl p-3 text-sm text-text-app focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-card-app select-none cursor-pointer"
                >
                  <option value="">-- Lựa chọn sách --</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id} disabled={b.quantity <= 0}>
                      {b.title} {b.quantity <= 0 ? '(Hết sách)' : `(Còn ${b.quantity} cuốn)`}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-card-border mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-500/10 hover:bg-slate-500/20 text-text-app border border-card-border rounded-xl px-4 py-2.5 text-sm font-semibold transition"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 transition"
                >
                  Lập phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
