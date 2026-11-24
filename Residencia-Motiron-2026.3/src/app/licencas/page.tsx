'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Skeleton, SkeletonTabela } from '@/components/Skeleton'
import StatusBadge from '@/components/StatusBadge'
import { useSolar } from '@/hooks/useSolar'
import type { StatusLicenca } from '@/types/solar'
import { formatarData } from '@/utils/format'
import { calcularStatusLicenca } from '@/utils/status'

type Filtro = 'todas' | StatusLicenca

const filtros: { valor: Filtro; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'valida', rotulo: 'Válidas' },
  { valor: 'proximo_vencimento', rotulo: 'Próximas do vencimento' },
  { valor: 'expirada', rotulo: 'Expiradas' },
]

const descreverPrazo = (dias: number) => {
  if (dias < 0) return `venceu há ${-dias} ${dias === -1 ? 'dia' : 'dias'}`
  if (dias === 0) return 'vence hoje'
  return `vence em ${dias} ${dias === 1 ? 'dia' : 'dias'}`
}

export default function LicencasPage() {
  const { data, isLoading, isError } = useSolar()
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [busca, setBusca] = useState('')

  if (isLoading) {
    return (
      <div role="status" aria-label="Carregando licenças" className="space-y-4">
        <Skeleton className="h-7 w-64" />
        <div className="flex flex-wrap items-center gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-full" />
          ))}
          <Skeleton className="ml-auto h-9 w-full sm:w-64" />
        </div>
        <SkeletonTabela linhas={5} colunas={5} />
      </div>
    )
  }
  if (isError || !data) return <p className="text-red-600">Não foi possível carregar os dados.</p>

  const nomeUsina = new Map(data.usinas.map((u) => [u.id, u.nome]))
  const termo = busca.trim().toLowerCase()

  const linhas = data.licencas
    .map((l) => ({ ...l, usina: nomeUsina.get(l.usinaId) ?? '—', situacao: calcularStatusLicenca(l.dataValidade) }))
    .filter((l) => filtro === 'todas' || l.situacao.status === filtro)
    .filter((l) => !termo || [l.tipo, l.numero, l.emissor, l.usina].some((campo) => campo.toLowerCase().includes(termo)))
    .sort((a, b) => a.situacao.diasRestantes - b.situacao.diasRestantes)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Licenças e homologações</h2>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {filtros.map(({ valor, rotulo }) => (
            <button
              key={valor}
              type="button"
              onClick={() => setFiltro(valor)}
              aria-pressed={filtro === valor}
              className={`rounded-full border px-3 py-1 text-sm ${
                filtro === valor
                  ? 'border-amber-400 bg-amber-400 font-medium text-slate-900'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {rotulo}
            </button>
          ))}
        </div>
        <label className="relative ml-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar licença ou usina"
            aria-label="Buscar licença ou usina"
            className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Licença</th>
              <th className="px-4 py-3 font-medium">Usina</th>
              <th className="px-4 py-3 font-medium">Emissor</th>
              <th className="px-4 py-3 font-medium">Validade</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {linhas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  Nenhuma licença encontrada. Ajuste o filtro ou a busca.
                </td>
              </tr>
            )}
            {linhas.map((l) => (
              <tr key={l.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{l.tipo}</p>
                  <p className="text-xs text-slate-500">{l.numero}</p>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/usinas/${l.usinaId}`} className="text-amber-700 hover:underline">{l.usina}</Link>
                </td>
                <td className="px-4 py-3">{l.emissor}</td>
                <td className="px-4 py-3">
                  <p>{formatarData(l.dataValidade)}</p>
                  <p className="text-xs text-slate-500">{descreverPrazo(l.situacao.diasRestantes)}</p>
                </td>
                <td className="px-4 py-3"><StatusBadge dataValidade={l.dataValidade} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
