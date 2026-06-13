import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mini Library Management System",
  description: "Hệ thống quản lý thư viện mini",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 flex h-screen`}
      >
        <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
          <div className="h-16 flex items-center px-6 border-b">
            <h1 className="text-xl font-bold text-blue-600">Mini Library</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium">Dashboard</Link>
            <Link href="/books" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium">Quản lý Sách</Link>
            <Link href="/readers" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium">Quản lý Độc giả</Link>
            <Link href="/borrow" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium">Mượn / Trả sách</Link>
          </nav>
        </aside>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
