import { getReaders } from '../actions/reader'
import ReaderClient from './ReaderClient'

export const metadata = {
  title: 'Quản lý Độc giả | Mini Library',
}

export default async function ReadersPage() {
  const readers = await getReaders()
  
  return <ReaderClient initialReaders={readers} />
}
