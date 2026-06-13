'use client'

import { useState } from 'react'
import { addReader, updateReader, deleteReader } from '../actions/reader'

export default function ReaderClient({ initialReaders }) {
  const [readers, setReaders] = useState(initialReaders)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReader, setEditingReader] = useState(null)
  
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Độc giả</h1>
        <button 
          onClick={openAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Thêm độc giả mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên độc giả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {initialReaders.map((reader) => (
              <tr key={reader.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reader.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reader.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reader.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openEdit(reader)} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</button>
                  <button onClick={() => handleDelete(reader.id)} className="text-red-600 hover:text-red-900">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initialReaders.length === 0 && (
          <div className="text-center py-8 text-gray-500">Chưa có độc giả nào.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingReader ? 'Sửa thông tin độc giả' : 'Thêm độc giả mới'}</h2>
            <form action={editingReader ? handleUpdate : handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên độc giả</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={editingReader?.name} 
                  required 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input 
                  type="text" 
                  name="phone" 
                  defaultValue={editingReader?.phone} 
                  required 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
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
                  className="bg-green-600 border border-transparent rounded-md shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
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
