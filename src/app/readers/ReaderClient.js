'use client'

import { useState, useEffect } from 'react'
import { addReader, updateReader, deleteReader } from '../actions/reader'

export default function ReaderClient({ initialReaders }) {
  const [readers, setReaders] = useState(initialReaders)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReader, setEditingReader] = useState(null)
  
  const [selectedReader, setSelectedReader] = useState(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  useEffect(() => {
    setReaders(initialReaders)
    if (selectedReader) {
      const updatedSelected = initialReaders.find(r => r.id === selectedReader.id)
      if (updatedSelected) {
        setSelectedReader(updatedSelected)
      }
    }
  }, [initialReaders])

  const handleAdd = async (formData) => {
    await addReader(formData)
    setIsModalOpen(false)
  }

  const handleUpdate = async (formData) => {
    await updateReader(editingReader.id, formData)
    setEditingReader(null)
    setIsModalOpen(false)
  }

  const handleDelete = async (id) => {
    if(confirm('Bạn có chắc chắn muốn xóa độc giả này?')) {
      await deleteReader(id)
    }
  }

  const openEdit = (reader) => {
    setEditingReader(reader)
    setIsModalOpen(true)
  }

  const openAdd = () => {
    setEditingReader(null)
    setIsModalOpen(true)
  }

  const openHistory = (reader) => {
    setSelectedReader(reader)
    setIsHistoryOpen(true)
  }

  // Lấy avatar chữ từ tên độc giả
  const getInitials = (name) => {
    if (!name) return ''
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  // Lấy màu nền ngẫu nhiên theo ID độc giả
  const getAvatarBg = (id) => {
    const colors = [
      'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/20',
      'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20',
      'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/20',
      'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20'
    ]
    return colors[id % colors.length]
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="space-y-8 animate-fade-in">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-6">
          <div>
            <h1 className="text-3xl font-extrabold font-title tracking-tight text-text-app">
              Quản lý Độc giả
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Đăng ký thẻ, cập nhật thông tin và theo dõi lịch sử mượn trả của các độc giả.
            </p>
          </div>
          <button 
            onClick={openAdd}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Đăng ký độc giả
          </button>
        </div>

      {/* Readers List Card Grid or Table */}
      <div className="bg-card-app border border-card-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-card-border">
            <thead className="bg-slate-500/5">
              <tr className="text-left text-xs font-bold text-text-muted uppercase tracking-wider">
                <th className="px-6 py-4">Mã Độc giả</th>
                <th className="px-6 py-4">Độc giả</th>
                <th className="px-6 py-4">Số điện thoại</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-sm">
              {readers.map((reader) => (
                <tr key={reader.id} className="hover:bg-slate-500/5 transition duration-150">
                  <td className="px-6 py-4 text-text-muted font-medium">#{reader.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-bold font-title select-none ${getAvatarBg(reader.id)}`}>
                        {getInitials(reader.name)}
                      </div>
                      <span className="font-semibold text-text-app">{reader.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-muted font-medium">{reader.phone}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => openHistory(reader)} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold uppercase tracking-wider rounded-lg border border-emerald-500/10 transition"
                    >
                      Lịch sử
                    </button>
                    <button 
                      onClick={() => openEdit(reader)} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-500/10 transition"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(reader.id)} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-bold uppercase tracking-wider rounded-lg border border-rose-500/10 transition"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {readers.length === 0 && (
          <div className="text-center py-12 text-text-muted">Chưa có độc giả nào được đăng ký.</div>
        )}
      </div>
    </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card-app border border-card-border rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-card-border flex justify-between items-center">
              <h2 className="text-lg font-bold text-text-app font-title">
                {editingReader ? 'Sửa thông tin độc giả' : 'Đăng ký độc giả mới'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-app text-2xl font-bold focus:outline-none"
              >
                &times;
              </button>
            </div>
            
            <form action={editingReader ? handleUpdate : handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Tên độc giả</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={editingReader?.name} 
                  required 
                  className="w-full bg-slate-500/5 border border-card-border rounded-xl p-3 text-sm text-text-app focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Nhập họ và tên..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Số điện thoại</label>
                <input 
                  type="text" 
                  name="phone" 
                  defaultValue={editingReader?.phone} 
                  required 
                  className="w-full bg-slate-500/5 border border-card-border rounded-xl p-3 text-sm text-text-app focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Nhập số điện thoại..."
                />
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
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition"
                >
                  Lưu độc giả
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Borrow History Modal */}
      {isHistoryOpen && selectedReader && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card-app border border-card-border rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-card-border flex justify-between items-center bg-slate-500/5">
              <h2 className="text-lg font-bold text-text-app font-title">
                Lịch sử mượn sách: <span className="text-emerald-500 font-semibold">{selectedReader.name}</span>
              </h2>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="text-text-muted hover:text-text-app text-2xl font-bold focus:outline-none"
              >
                &times;
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              {!selectedReader.tickets || selectedReader.tickets.length === 0 ? (
                <div className="text-center py-12 text-text-muted font-medium">Độc giả này chưa mượn cuốn sách nào.</div>
              ) : (
                <table className="min-w-full divide-y divide-card-border">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                      <th className="pb-3 pr-4">Tên sách</th>
                      <th className="pb-3 pr-4">Ngày mượn</th>
                      <th className="pb-3 pr-4">Hạn trả / Ngày trả</th>
                      <th className="pb-3 pr-4">Trạng thái</th>
                      <th className="pb-3 text-right">Phí phạt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border text-sm">
                    {selectedReader.tickets.map((ticket) => {
                      const borrowDate = new Date(ticket.borrowDate)
                      const dueDate = new Date(borrowDate)
                      dueDate.setDate(dueDate.getDate() + 7)
                      const returnDate = ticket.returnDate ? new Date(ticket.returnDate) : null
                      const isOverdue = !returnDate && new Date() > dueDate

                      return (
                        <tr key={ticket.id} className="hover:bg-slate-500/5 transition">
                          <td className="py-3.5 pr-4 font-semibold text-text-app">{ticket.book.title}</td>
                          <td className="py-3.5 pr-4 text-text-muted">
                            {borrowDate.toLocaleDateString('vi-VN')}
                          </td>
                          <td className="py-3.5 pr-4 text-text-muted">
                            {returnDate ? (
                              <div className="text-emerald-500 font-medium">
                                Đã trả: {returnDate.toLocaleDateString('vi-VN')}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span>Hạn: {dueDate.toLocaleDateString('vi-VN')}</span>
                                {isOverdue && (
                                  <span className="text-[10px] px-1.5 py-0.5 font-bold uppercase tracking-wider text-rose-500 bg-rose-500/10 border border-rose-500/25 rounded-md">Trễ hạn</span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 pr-4">
                            {ticket.status === 'BORROWED' ? (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                Đang mượn
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-green-500/10 text-green-600 dark:text-green-400">
                                Đã trả
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 text-right font-medium text-rose-500">
                            {ticket.lateFee > 0 ? `${ticket.lateFee.toLocaleString('vi-VN')}đ` : '-'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-card-border flex justify-end bg-slate-500/5">
              <button 
                type="button" 
                onClick={() => setIsHistoryOpen(false)}
                className="bg-slate-500/10 hover:bg-slate-500/20 text-text-app border border-card-border rounded-xl px-5 py-2 text-sm font-semibold transition"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
