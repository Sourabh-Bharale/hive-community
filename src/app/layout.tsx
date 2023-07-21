import { ThemeProvider } from '@/components/ui/theme-provider'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'


export const metadata = {
  title: 'suc-it',
}

const inter = Inter({
  subsets:['latin']
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={cn('',inter.className)} suppressHydrationWarning>
      <body className='min-h-screen pt-12 '>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
      </body>
    </html>
  )
}
