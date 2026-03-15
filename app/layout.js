import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: { default: 'Blog CMS', template: '%s | Blog CMS' },
  description: 'A modern blog management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Navbar />
         <div className="pt-16"/>
        {children}
        </body>
    </html>
  )
}