import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import AppShell from '@/components/AppShell'
import Providers from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Solaria Management',
  description: 'Gestão corporativa de usinas solares',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
