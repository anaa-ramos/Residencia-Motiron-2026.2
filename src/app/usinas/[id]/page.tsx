'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Lock } from 'lucide-react'
import { Skeleton, SkeletonTabela } from '@/components/Skeleton'
import StatusBadge from '@/components/StatusBadge'
import { useAdicionarLicenca, useAtualizarManutencao, useSolar } from '@/hooks/useSolar'
import { licencaSchema, type LicencaForm } from '@/schemas/solarSchema'
import { TIPOS_LICENCA, type Manutencao, type StatusManutencao } from '@/types/solar'
import { formatarCapacidade, formatarData } from '@/utils/format'

const rotuloManutencao: Record<StatusManutencao, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}

const classeCampo =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60'

export default function UsinaDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useSolar()
  const adicionarLicenca = useAdicionarLicenca()
  const atualizarManutencao = useAtualizarManutencao()
  const [conclusao, setConclusao] = useState<Manutencao | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LicencaForm>({
    resolver: zodResolver(licencaSchema),
    defaultValues: { usinaId: id },
  })

  if (isLoading) {
    return (
      <div role="status" aria-label="Carregando usina" className="space-y-6">
        <Skeleton className="h-4 w-36" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-5 w-48" />
        <SkeletonTabela linhas={2} colunas={5} />
        <Skeleton className="h-52 w-full rounded-lg" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-36 w-full rounded-lg" />
      </div>
    )
  }

  const usina = data?.usinas.find((u) => u.id === id)
  if (!data || !usina) return <p className="text-red-600">Usina não encontrada.</p>

  const somenteLeitura = usina.status === 'inativa'
  const licencas = data.licencas.filter((l) => l.usinaId === id)
  const manutencoes = data.manutencoes.filter((m) => m.usinaId === id)

  const salvarLicenca = (valores: LicencaForm) =>
    adicionarLicenca.mutate({ ...valores, usinaId: id }, { onSuccess: () => reset({ usinaId: id }) })

  const alterarStatus = (manutencao: Manutencao, status: StatusManutencao) => {
    if (status === 'concluida') setConclusao(manutencao)
    else atualizarManutencao.mutate({ id: manutencao.id, status })
  }

  const confirmarConclusao = () => {
    if (!conclusao) return
    atualizarManutencao.mutate({ id: conclusao.id, status: 'concluida' }, { onSuccess: () => setConclusao(null) })
  }

  return (
    <div className="space-y-6">
      <Link href="/usinas" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Voltar às usinas
      </Link>

      <div>
        <h2 className="text-xl font-semibold">{usina.nome}</h2>
        <p className="text-sm text-slate-600">
          {usina.localizacao} · {formatarCapacidade(usina.capacidadeKwp)} · {usina.status === 'ativa' ? 'Ativa' : 'Inativa'}
        </p>
      </div>

      {somenteLeitura && (
        <div role="alert" className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <Lock className="h-4 w-4 shrink-0" />
          Esta usina está inativa. Os dados ficam disponíveis apenas para consulta.
        </div>
      )}

      <section className="space-y-3">
        <h3 className="font-medium">Licenças e homologações</h3>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Número</th>
                <th className="px-4 py-3 font-medium">Emissor</th>
                <th className="px-4 py-3 font-medium">Validade</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {licencas.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Nenhuma licença cadastrada para esta usina.
                  </td>
                </tr>
              )}
              {licencas.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">{l.tipo}</td>
                  <td className="px-4 py-3">{l.numero}</td>
                  <td className="px-4 py-3">{l.emissor}</td>
                  <td className="px-4 py-3">{formatarData(l.dataValidade)}</td>
                  <td className="px-4 py-3"><StatusBadge dataValidade={l.dataValidade} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleSubmit(salvarLicenca)} className="rounded-lg border border-slate-200 bg-white p-4">
          <fieldset disabled={somenteLeitura || adicionarLicenca.isPending} className="space-y-3">
            <legend className="mb-2 text-sm font-medium">Adicionar licença</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                Tipo
                <select {...register('tipo')} className={classeCampo} defaultValue="">
                  <option value="" disabled>Selecione</option>
                  {TIPOS_LICENCA.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {errors.tipo && <span className="text-xs text-red-600">{errors.tipo.message}</span>}
              </label>
              <label className="space-y-1 text-sm">
                Emissor (órgão ou concessionária)
                <input {...register('emissor')} className={classeCampo} />
                {errors.emissor && <span className="text-xs text-red-600">{errors.emissor.message}</span>}
              </label>
              <label className="space-y-1 text-sm">
                Número
                <input {...register('numero')} className={classeCampo} />
                {errors.numero && <span className="text-xs text-red-600">{errors.numero.message}</span>}
              </label>
              <label className="space-y-1 text-sm">
                Data de validade
                <input type="date" {...register('dataValidade')} className={classeCampo} />
                {errors.dataValidade && <span className="text-xs text-red-600">{errors.dataValidade.message}</span>}
              </label>
            </div>
            <button
              type="submit"
              className="rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Adicionar licença
            </button>
            {adicionarLicenca.isError && <p className="text-sm text-red-600">Não foi possível salvar a licença.</p>}
          </fieldset>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="font-medium">Manutenções</h3>
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
          {manutencoes.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-slate-500">Nenhuma manutenção para esta usina.</li>
          )}
          {manutencoes.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{m.titulo}</p>
                <p className="text-slate-500">
                  {m.responsavel} · prazo {formatarData(m.prazo)}
                </p>
              </div>
              <select
                aria-label={`Status da manutenção ${m.titulo}`}
                value={m.status}
                disabled={somenteLeitura}
                onChange={(e) => alterarStatus(m, e.target.value as StatusManutencao)}
                className="rounded-md border border-slate-300 px-2 py-1.5 text-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60"
              >
                {Object.entries(rotuloManutencao).map(([valor, rotulo]) => (
                  <option key={valor} value={valor}>{rotulo}</option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      </section>

      {conclusao && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Concluir manutenção?</h3>
            <p className="text-sm text-slate-600">
              “{conclusao.titulo}” será marcada como Concluída e deixará de contar nas manutenções pendentes.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConclusao(null)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarConclusao}
                disabled={atualizarManutencao.isPending}
                className="rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-300 disabled:opacity-50"
              >
                Concluir manutenção
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
