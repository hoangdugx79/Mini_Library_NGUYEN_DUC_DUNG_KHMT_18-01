'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getReaders() {
  return await prisma.reader.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function addReader(formData) {
  const name = formData.get('name')
  const phone = formData.get('phone')

  await prisma.reader.create({
    data: {
      name,
      phone
    }
  })

  revalidatePath('/readers')
}

export async function updateReader(id, formData) {
  const name = formData.get('name')
  const phone = formData.get('phone')

  await prisma.reader.update({
    where: { id },
    data: {
      name,
      phone
    }
  })

  revalidatePath('/readers')
}

export async function deleteReader(id) {
  await prisma.reader.delete({
    where: { id }
  })

  revalidatePath('/readers')
}
