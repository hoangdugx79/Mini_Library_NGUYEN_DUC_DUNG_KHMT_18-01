import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "Mini Library Management System",
  description: "Hệ thống quản lý thư viện mini",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <head>
        {/* Script chống nhấp nháy giao diện (FOUC) khi tải trang */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-bg-app text-text-app flex h-screen font-sans antialiased overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar />
        
        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto bg-bg-app relative transition-colors duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
