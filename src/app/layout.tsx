import '@/styles/globals.css'
import { TQueryProvider, ThemeProvider } from '@/Providers'
import { Navbar } from '@/components'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'


export const metadata = {
  title: 'Hive',
  description: 'Welcome to Hive - Your Personalized Community Platform! Create your own HiveHub, connect with like-minded individuals, and share your passions. Join today to post, interact, and discover a vibrant world of diverse content. Unleash your creativity and be part of a buzzing hive of inspiration and engagement. Sign up now and experience the power of community-driven connections.',
  verification: {
    google: 'nAV5D-dLP4jkCuMD1eCj6BX1zzXwTFqmkNcFPXng9AA'
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
      <body className='min-h-screen pt-12 scrollbar-thin scrollbar-thumb-current scrollbar-thumb-rounded-sm'>
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
