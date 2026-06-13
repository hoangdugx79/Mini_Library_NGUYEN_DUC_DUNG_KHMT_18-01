'use client'

import { useState, useEffect } from 'react'
import { addBook, updateBook, deleteBook } from '../actions/book'

export default function BookClient({ initialBooks }) {
  const [books, setBooks] = useState(initialBooks)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  
  useEffect(() => {
    setBooks(initialBooks)
  }, [initialBooks])

  const filteredBooks = books.filter((book) => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = async (formData) => {
    await addBook(formData)
    setIsModalOpen(false)
  }

  const handleUpdate = async (formData) => {
    await updateBook(editingBook.id, formData)
    setEditingBook(null)
    setIsModalOpen(false)
  }

  const handleDelete = async (id) => {
    if(confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      await deleteBook(id)
    }
  }

  const openEdit = (book) => {
    setEditingBook(book)
    setIsModalOpen(true)
  }

  const openAdd = () => {
    setEditingBook(null)
    setIsModalOpen(true)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold font-title tracking-tight text-text-app">
            Quản lý Sách
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Xem, thêm mới, sửa hoặc xóa các đầu sách trong thư viện của bạn.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Modern Search bar */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-8 py-2 w-full bg-card-app border border-card-border text-text-app rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-app"
              >
                ✕
              </button>
            )}
          </div>

          <button 
            onClick={openAdd}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7-7H5" />
            </svg>
            Thêm sách mới
          </button>
        </div>
      </div>

      {/* Books Table Container */}
      <div className="bg-card-app border border-card-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-card-border">
            <thead className="bg-slate-500/5">
              <tr className="text-left text-xs font-bold text-text-muted uppercase tracking-wider">
                <th className="px-6 py-4">Mã Sách</th>
                <th className="px-6 py-4">Tên Sách</th>
                <th className="px-6 py-4">Tác Giả</th>
                <th className="px-6 py-4">Số Lượng Kho</th>
                <th className="px-6 py-4 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-sm">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-slate-500/5 transition duration-150">
                  <td className="px-6 py-4 text-text-muted font-medium">#{book.id}</td>
                  <td className="px-6 py-4 font-semibold text-text-app">{book.title}</td>
                  <td className="px-6 py-4 text-text-muted">{book.author}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                      book.quantity > 0 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    }`}>
                      {book.quantity > 0 ? `Còn hàng (${book.quantity} cuốn)` : 'Hết sách'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => openEdit(book)} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-500/10 transition"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(book.id)} 
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
        {filteredBooks.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            {searchTerm ? 'Không tìm thấy sách phù hợp với từ khóa.' : 'Chưa có sách nào trong thư viện.'}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
          <div className="bg-card-app border border-card-border rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-card-border flex justify-between items-center">
              <h2 className="text-lg font-bold text-text-app font-title">
                {editingBook ? 'Sửa thông tin sách' : 'Thêm đầu sách mới'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-app text-2xl font-bold focus:outline-none"
              >
                &times;
              </button>
            </div>
            
            <form action={editingBook ? handleUpdate : handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Tên sách</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingBook?.title} 
                  required 
                  className="w-full bg-slate-500/5 border border-card-border rounded-xl p-3 text-sm text-text-app focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Nhập tên cuốn sách..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Tác giả</label>
                <input 
                  type="text" 
                  name="author" 
                  defaultValue={editingBook?.author} 
                  required 
                  className="w-full bg-slate-500/5 border border-card-border rounded-xl p-3 text-sm text-text-app focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Nhập tên tác giả..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Số lượng nhập kho</label>
                <input 
                  type="number" 
                  name="quantity" 
                  min="0"
                  defaultValue={editingBook?.quantity ?? 1} 
                  required 
                  className="w-full bg-slate-500/5 border border-card-border rounded-xl p-3 text-sm text-text-app focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Số lượng bản sao..."
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
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
