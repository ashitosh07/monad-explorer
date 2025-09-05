import './globals.css'

export const metadata = {
  title: 'Monad Explorer',
  description: 'Real-time Monad blockchain explorer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  )
}