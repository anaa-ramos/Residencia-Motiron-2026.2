'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/login') return <>{children}</>

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
