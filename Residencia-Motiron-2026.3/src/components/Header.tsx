'use client'

import { Bell, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSolar } from '@/hooks/useSolar'
import { calcularStatusLicenca } from '@/utils/status'

export default function Header() {
  const router = useRouter()
  const { data } = useSolar()
  const criticas = data?.licencas.filter((l) => calcularStatusLicenca(l.dataValidade).status !== 'valida').length ?? 0

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h1 className="text-sm font-medium text-slate-600">Gestão corporativa de usinas solares</h1>
      <div className="flex items-center gap-1">
        <button type="button" aria-label={`${criticas} licenças exigem atenção`} className="relative rounded-md p-2 text-slate-600 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          {criticas > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">{criticas}</span>}
        </button>
        <button type="button" onClick={async () => { await fetch('/api/auth/session', { method: 'DELETE' }); router.replace('/login') }} className="rounded-md p-2 text-slate-600 hover:bg-slate-100" aria-label="Sair da conta">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
