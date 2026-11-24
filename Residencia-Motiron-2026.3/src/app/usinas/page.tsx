'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Skeleton, SkeletonTabela } from '@/components/Skeleton'
import { useAdicionarUsina, useSolar } from '@/hooks/useSolar'
import { usinaSchema, type UsinaForm } from '@/schemas/solarSchema'
import { formatarCapacidade } from '@/utils/format'

const classeCampo = 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm'

export default function UsinasPage() {
  const { data, isLoading, isError } = useSolar()
  const adicionarUsina = useAdicionarUsina()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UsinaForm>({
    resolver: zodResolver(usinaSchema),
    defaultValues: { status: 'ativa' },
  })

  if (isLoading) {
    return (
      <div role="status" aria-label="Carregando usinas" className="space-y-6">
        <Skeleton className="h-7 w-32" />
        <SkeletonTabela linhas={4} colunas={4} />
        <Skeleton className="h-52 w-full rounded-lg" />
      </div>
    )
  }
  if (isError || !data) return <p className="text-red-600">Não foi possível carregar os dados.</p>

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Usinas</h2>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Usina</th>
              <th className="px-4 py-3 font-medium">Localização</th>
              <th className="px-4 py-3 font-medium">Capacidade</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.usinas.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/usinas/${u.id}`} className="font-medium text-amber-700 hover:underline">{u.nome}</Link>
                </td>
                <td className="px-4 py-3">{u.localizacao}</td>
                <td className="px-4 py-3">{formatarCapacidade(u.capacidadeKwp)}</td>
                <td className="px-4 py-3">{u.status === 'ativa' ? 'Ativa' : 'Inativa'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        onSubmit={handleSubmit((valores) =>
          adicionarUsina.mutate(valores, { onSuccess: () => reset({ status: 'ativa' }) }),
        )}
        className="rounded-lg border border-slate-200 bg-white p-4"
      >
        <fieldset disabled={adicionarUsina.isPending} className="space-y-3">
          <legend className="mb-2 text-sm font-medium">Nova usina</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              Nome
              <input {...register('nome')} className={classeCampo} />
              {errors.nome && <span className="text-xs text-red-600">{errors.nome.message}</span>}
            </label>
            <label className="space-y-1 text-sm">
              Localização
              <input {...register('localizacao')} placeholder="Cidade, UF" className={classeCampo} />
              {errors.localizacao && <span className="text-xs text-red-600">{errors.localizacao.message}</span>}
            </label>
            <label className="space-y-1 text-sm">
              Capacidade (kWp)
              <input type="number" step="any" {...register('capacidadeKwp', { valueAsNumber: true })} className={classeCampo} />
              {errors.capacidadeKwp && <span className="text-xs text-red-600">{errors.capacidadeKwp.message}</span>}
            </label>
            <label className="space-y-1 text-sm">
              Status
              <select {...register('status')} className={classeCampo}>
                <option value="ativa">Ativa</option>
                <option value="inativa">Inativa</option>
              </select>
            </label>
          </div>
          <button type="submit" className="rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-300 disabled:opacity-50">
            Adicionar usina
          </button>
          {adicionarUsina.isError && <p className="text-sm text-red-600">Não foi possível salvar a usina.</p>}
        </fieldset>
      </form>
    </div>
  )
}
