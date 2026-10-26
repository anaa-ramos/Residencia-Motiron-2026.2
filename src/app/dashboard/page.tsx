'use client'

import Link from 'next/link'
import { Sun, TriangleAlert, Wrench, Zap } from 'lucide-react'
import { Skeleton, SkeletonCard, SkeletonTabela } from '@/components/Skeleton'
import StatusBadge from '@/components/StatusBadge'
import { useSolar } from '@/hooks/useSolar'
import { formatarData } from '@/utils/format'
import { calcularStatusLicenca } from '@/utils/status'

export default function DashboardPage() {
  const { data, isLoading, isError } = useSolar()

  if (isLoading) {
    return (
      <div role="status" aria-label="Carregando dashboard" className="space-y-6">
        <Skeleton className="h-7 w-40" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <Skeleton className="h-5 w-56" />
        <SkeletonTabela linhas={3} colunas={4} />
      </div>
    )
  }
  if (isError || !data) return <p className="text-red-600">Não foi possível carregar os dados.</p>

  const ativas = data.usinas.filter((u) => u.status === 'ativa')
  const mwpEmOperacao = ativas.reduce((soma, u) => soma + u.capacidadeKwp, 0) / 1000
  const licencasCriticas = data.licencas
    .map((l) => ({ ...l, situacao: calcularStatusLicenca(l.dataValidade) }))
    .filter((l) => l.situacao.status !== 'valida')
    .sort((a, b) => a.situacao.diasRestantes - b.situacao.diasRestantes)
  const pendentes = data.manutencoes.filter((m) => m.status !== 'concluida').length
  const nomeUsina = new Map(data.usinas.map((u) => [u.id, u.nome]))

  const metricas = [
    { rotulo: 'Total de usinas', valor: data.usinas.length, detalhe: `${ativas.length} em operação`, Icone: Sun },
    {
      rotulo: 'MWp em operação',
      valor: mwpEmOperacao.toLocaleString('pt-BR', { maximumFractionDigits: 1 }),
      detalhe: 'Soma das usinas ativas',
      Icone: Zap,
    },
    { rotulo: 'Licenças críticas', valor: licencasCriticas.length, detalhe: 'Vencidas ou a 15 dias ou menos de vencer', Icone: TriangleAlert },
    { rotulo: 'Manutenções pendentes', valor: pendentes, detalhe: 'Ainda não concluídas', Icone: Wrench },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricas.map(({ rotulo, valor, detalhe, Icone }) => (
          <div key={rotulo} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
              {rotulo}
              <Icone className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-2 text-3xl font-semibold">{valor}</p>
            <p className="mt-1 text-xs text-slate-500">{detalhe}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h3 className="font-medium">Licenças que exigem atenção</h3>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Licença</th>
                <th className="px-4 py-3 font-medium">Usina</th>
                <th className="px-4 py-3 font-medium">Validade</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {licencasCriticas.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    Todas as licenças estão válidas.
                  </td>
                </tr>
              )}
              {licencasCriticas.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{l.tipo}</p>
                    <p className="text-xs text-slate-500">{l.numero}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/usinas/${l.usinaId}`} className="text-amber-700 hover:underline">
                      {nomeUsina.get(l.usinaId)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{formatarData(l.dataValidade)}</td>
                  <td className="px-4 py-3"><StatusBadge dataValidade={l.dataValidade} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
