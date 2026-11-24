'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [autenticado, setAutenticado] = useState<boolean | null>(null)

  useEffect(() => {
    if (pathname === '/login') return
    fetch('/api/auth/session').then((resposta) => {
      if (!resposta.ok) router.replace('/login')
      else setAutenticado(true)
    }).catch(() => router.replace('/login'))
  }, [pathname, router])

  if (pathname === '/login') return <>{children}</>

  if (!autenticado) return <div className="min-h-screen bg-slate-50" aria-busy="true" />

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
