'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getBooks() {
  return await prisma.book.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function addBook(formData) {
  const title = formData.get('title')
  const author = formData.get('author')
  const quantity = parseInt(formData.get('quantity'))

  await prisma.book.create({
    data: {
      title,
      author,
      quantity
    }
  })

  revalidatePath('/books')
}

export async function updateBook(id, formData) {
  const title = formData.get('title')
  const author = formData.get('author')
  const quantity = parseInt(formData.get('quantity'))

  await prisma.book.update({
    where: { id },
    data: {
      title,
      author,
      quantity
    }
  })

  revalidatePath('/books')
}

export async function deleteBook(id) {
  await prisma.book.delete({
    where: { id }
  })

  revalidatePath('/books')
}
