import '@/styles/globals.css'
import { TQueryProvider, ThemeProvider } from '@/Providers'
import { Navbar } from '@/components'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'


export const metadata = {
  title: 'suc-it',
}

const inter = Inter({
  subsets: ['latin']
})

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode,
  authModal: React.ReactNode
}) {
  return (
    <html lang='en' className={cn('', inter.className)} suppressHydrationWarning>
      <body className='min-h-screen pt-12 '>
        <TQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* @ts-expect-error server component */}
            <Navbar />
            {authModal}
            <div className='container max-w-7xl mx-auto h-full pt-12'>
              {children}
            </div>
            <Toaster />
          </ThemeProvider>
        </TQueryProvider>
      </body>
    </html>
  )
}
