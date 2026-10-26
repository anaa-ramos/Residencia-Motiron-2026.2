'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileCheck2, LayoutDashboard, Sun, Zap } from 'lucide-react'

const itens = [
  { href: '/dashboard', rotulo: 'Dashboard', Icone: LayoutDashboard },
  { href: '/usinas', rotulo: 'Usinas', Icone: Zap },
  { href: '/licencas', rotulo: 'Licenças', Icone: FileCheck2 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-6 bg-slate-900 p-4 md:flex">
      <div className="flex items-center gap-2 px-3 py-2 text-white">
        <Sun className="h-6 w-6 text-amber-400" />
        <span className="font-semibold">Solaria Management</span>
      </div>

      <nav className="flex flex-col gap-1">
        {itens.map(({ href, rotulo, Icone }) => {
          const ativo = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                ativo ? 'bg-amber-400 font-medium text-slate-900' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icone className="h-4 w-4" />
              {rotulo}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
