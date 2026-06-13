import { getBooks } from '../actions/book'
import BookClient from './BookClient'

export const metadata = {
  title: 'Quản lý Sách | Mini Library',
}

export default async function BooksPage() {
  const books = await getBooks()
  
  return <BookClient initialBooks={books} />
}
