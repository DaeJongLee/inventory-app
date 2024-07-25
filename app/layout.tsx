import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '재고 관리 앱',
  description: '간단한 재고 관리 애플리케이션',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}