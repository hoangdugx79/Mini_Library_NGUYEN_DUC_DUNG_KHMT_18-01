'use client'

import { useState } from 'react'
import { addBook, updateBook, deleteBook } from '../actions/book'

export default function BookClient({ initialBooks }) {
  const [books, setBooks] = useState(initialBooks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  
  // Update state without waiting for revalidation for optimistic UI
  // Real app should handle errors better
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Sách</h1>
        <button 
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Thêm sách mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sách</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác giả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {initialBooks.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {book.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openEdit(book)} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</button>
                  <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:text-red-900">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initialBooks.length === 0 && (
          <div className="text-center py-8 text-gray-500">Chưa có sách nào trong thư viện.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingBook ? 'Sửa thông tin sách' : 'Thêm sách mới'}</h2>
            <form action={editingBook ? handleUpdate : handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên sách</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingBook?.title} 
                  required 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tác giả</label>
                <input 
                  type="text" 
                  name="author" 
                  defaultValue={editingBook?.author} 
                  required 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                <input 
                  type="number" 
                  name="quantity" 
                  min="0"
                  defaultValue={editingBook?.quantity ?? 1} 
                  required 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
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
                  className="bg-blue-600 border border-transparent rounded-md shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
