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
    if(confirm('Bạn xác nhận muốn trả cuốn sách này?')) {
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Mượn / Trả Sách</h1>
        <button 
          onClick={openAdd}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          + Tạo phiếu mượn
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Phiếu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Độc giả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sách</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày mượn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phí phạt</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {initialTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{ticket.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.reader.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.book.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(ticket.borrowDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.status === 'RETURNED' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {ticket.status === 'RETURNED' ? 'Đã trả' : 'Đang mượn'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                  {ticket.lateFee > 0 ? formatCurrency(ticket.lateFee) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {ticket.status === 'BORROWED' ? (
                    <button onClick={() => handleReturn(ticket.id)} className="text-green-600 hover:text-green-900 font-bold">Nhận trả sách</button>
                  ) : (
                    <span className="text-gray-400">Hoàn tất</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initialTickets.length === 0 && (
          <div className="text-center py-8 text-gray-500">Chưa có giao dịch mượn/trả nào.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tạo Phiếu Mượn Mới</h2>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
            
            <form action={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Chọn Độc giả</label>
                <select name="readerId" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border bg-white">
                  <option value="">-- Lựa chọn độc giả --</option>
                  {readers.map(r => (
                    <option key={r.id} value={r.id}>{r.name} - {r.phone}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Chọn Sách</label>
                <select name="bookId" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border bg-white">
                  <option value="">-- Lựa chọn sách --</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id} disabled={b.quantity <= 0}>
                      {b.title} (Kho: {b.quantity})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="bg-orange-600 border border-transparent rounded-md shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Tạo phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
