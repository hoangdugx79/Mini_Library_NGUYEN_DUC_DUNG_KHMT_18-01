import { getTickets } from '../actions/borrow'
import { getBooks } from '../actions/book'
import { getReaders } from '../actions/reader'
import BorrowClient from './BorrowClient'

export const metadata = {
  title: 'Mượn Trả Sách | Mini Library',
}

export default async function BorrowPage() {
  const tickets = await getTickets()
  const books = await getBooks()
  const readers = await getReaders()
  
  return <BorrowClient initialTickets={tickets} books={books} readers={readers} />
}
