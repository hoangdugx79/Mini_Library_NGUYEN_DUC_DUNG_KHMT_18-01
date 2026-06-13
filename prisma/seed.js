const { PrismaClient } = require('@prisma/client')

// Cấu hình adapter cho SQLite để tương thích với Prisma v7
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')

const prismaClientSingleton = () => {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? 'file:./dev.db'
  })
  return new PrismaClient({ adapter })
}

const prisma = prismaClientSingleton()

async function main() {
  console.log('Bắt đầu dọn dẹp cơ sở dữ liệu...')
  await prisma.borrowTicket.deleteMany()
  await prisma.book.deleteMany()
  await prisma.reader.deleteMany()
  console.log('Đã xóa dữ liệu cũ.')

  console.log('Đang nạp sách mẫu...')
  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        quantity: 5
      }
    }),
    prisma.book.create({
      data: {
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        quantity: 3
      }
    }),
    prisma.book.create({
      data: {
        title: 'Sapiens: Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        quantity: 0 // Hết hàng
      }
    }),
    prisma.book.create({
      data: {
        title: 'Cha Giàu Cha Nghèo',
        author: 'Robert Kiyosaki',
        quantity: 8
      }
    }),
    prisma.book.create({
      data: {
        title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
        author: 'Nguyễn Nhật Ánh',
        quantity: 4
      }
    })
  ])
  console.log(`Đã nạp ${books.length} cuốn sách mẫu.`)

  console.log('Đang nạp độc giả mẫu...')
  const readers = await Promise.all([
    prisma.reader.create({
      data: {
        name: 'Nguyễn Văn Anh',
        phone: '0901234567'
      }
    }),
    prisma.reader.create({
      data: {
        name: 'Trần Thị Bình',
        phone: '0912345678'
      }
    }),
    prisma.reader.create({
      data: {
        name: 'Lê Hoàng Cường',
        phone: '0923456789'
      }
    }),
    prisma.reader.create({
      data: {
        name: 'Phạm Minh Duy',
        phone: '0934567890'
      }
    })
  ])
  console.log(`Đã nạp ${readers.length} độc giả mẫu.`)

  console.log('Đang nạp phiếu mượn mẫu...')
  const now = new Date()

  // 1. Phiếu đã trả đúng hạn (mượn cách đây 5 ngày, trả cách đây 1 ngày)
  const borrowDate1 = new Date()
  borrowDate1.setDate(now.getDate() - 5)
  const returnDate1 = new Date()
  returnDate1.setDate(now.getDate() - 1)
  await prisma.borrowTicket.create({
    data: {
      bookId: books[0].id,
      readerId: readers[0].id,
      borrowDate: borrowDate1,
      returnDate: returnDate1,
      status: 'RETURNED',
      lateFee: 0
    }
  })

  // 2. Phiếu đã trả trễ hạn (mượn cách đây 15 ngày, trả cách đây 3 ngày -> mượn 12 ngày, trễ 5 ngày -> phạt 25,000đ)
  const borrowDate2 = new Date()
  borrowDate2.setDate(now.getDate() - 15)
  const returnDate2 = new Date()
  returnDate2.setDate(now.getDate() - 3)
  await prisma.borrowTicket.create({
    data: {
      bookId: books[1].id,
      readerId: readers[1].id,
      borrowDate: borrowDate2,
      returnDate: returnDate2,
      status: 'RETURNED',
      lateFee: 25000
    }
  })

  // 3. Phiếu đang mượn và trong hạn (mượn cách đây 3 ngày)
  const borrowDate3 = new Date()
  borrowDate3.setDate(now.getDate() - 3)
  await prisma.borrowTicket.create({
    data: {
      bookId: books[3].id,
      readerId: readers[2].id,
      borrowDate: borrowDate3,
      status: 'BORROWED',
      lateFee: 0
    }
  })

  // 4. Phiếu đang mượn và trễ hạn (mượn cách đây 12 ngày -> trễ hạn 5 ngày so với quy định 7 ngày)
  const borrowDate4 = new Date()
  borrowDate4.setDate(now.getDate() - 12)
  await prisma.borrowTicket.create({
    data: {
      bookId: books[4].id,
      readerId: readers[3].id,
      borrowDate: borrowDate4,
      status: 'BORROWED',
      lateFee: 0 // Sẽ tính khi thực hiện trả, ở UI sẽ đánh dấu trễ hạn
    }
  })

  console.log('Đã nạp toàn bộ phiếu mượn mẫu thành công!')
  console.log('Database seeding hoàn tất!')
}

main()
  .catch((e) => {
    console.error('Lỗi khi seed database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
