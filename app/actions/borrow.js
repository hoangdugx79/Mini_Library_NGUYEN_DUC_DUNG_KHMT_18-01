'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const LATE_FEE_PER_DAY = 5000;
const MAX_BORROW_DAYS = 7;

export async function getTickets() {
  return await prisma.borrowTicket.findMany({
    include: {
      book: true,
      reader: true
    },
    orderBy: { borrowDate: 'desc' }
  })
}

export async function createTicket(formData) {
  const bookId = parseInt(formData.get('bookId'))
  const readerId = parseInt(formData.get('readerId'))

  // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
  await prisma.$transaction(async (tx) => {
    const book = await tx.book.findUnique({ where: { id: bookId } })
    
    if (!book) throw new Error('Sách không tồn tại')
    if (book.quantity <= 0) throw new Error('Sách đã hết trong kho')

    // Tạo phiếu mượn
    await tx.borrowTicket.create({
      data: {
        bookId,
        readerId,
        status: 'BORROWED'
      }
    })

    // Giảm số lượng sách
    await tx.book.update({
      where: { id: bookId },
      data: { quantity: book.quantity - 1 }
    })
  })

  revalidatePath('/borrow')
  revalidatePath('/books')
  revalidatePath('/')
}

export async function returnBook(ticketId) {
  await prisma.$transaction(async (tx) => {
    const ticket = await tx.borrowTicket.findUnique({ where: { id: ticketId } })
    
    if (!ticket || ticket.status === 'RETURNED') return

    const now = new Date()
    const borrowDate = new Date(ticket.borrowDate)
    
    // Tính toán số ngày trễ hạn
    const diffTime = Math.abs(now - borrowDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    let lateFee = 0
    if (diffDays > MAX_BORROW_DAYS) {
      lateFee = (diffDays - MAX_BORROW_DAYS) * LATE_FEE_PER_DAY
    }

    // Cập nhật phiếu mượn
    await tx.borrowTicket.update({
      where: { id: ticketId },
      data: {
        status: 'RETURNED',
        returnDate: now,
        lateFee
      }
    })

    // Tăng số lượng sách
    const book = await tx.book.findUnique({ where: { id: ticket.bookId } })
    await tx.book.update({
      where: { id: ticket.bookId },
      data: { quantity: book.quantity + 1 }
    })
  })

  revalidatePath('/borrow')
  revalidatePath('/books')
  revalidatePath('/')
}
