'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { LicencaForm, UsinaForm } from '@/schemas/solarSchema'
import type { DadosSolar, StatusManutencao } from '@/types/solar'

const chave = ['solar']

async function enviar(method: 'POST' | 'PUT', body: unknown) {
  const res = await fetch('/api/data', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Falha ao salvar')
  return res.json()
}

function useMutacao<T>(enviarDados: (dados: T) => Promise<unknown>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: enviarDados,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chave }),
  })
}

export function useSolar() {
  return useQuery<DadosSolar>({
    queryKey: chave,
    queryFn: async () => {
      const res = await fetch('/api/data')
      if (!res.ok) throw new Error('Falha ao carregar dados')
      return res.json()
    },
  })
}

export const useAdicionarUsina = () => useMutacao((dados: UsinaForm) => enviar('POST', { tipo: 'usina', dados }))

export const useAdicionarLicenca = () => useMutacao((dados: LicencaForm) => enviar('POST', { tipo: 'licenca', dados }))

export const useAtualizarManutencao = () =>
  useMutacao((dados: { id: string; status: StatusManutencao }) => enviar('PUT', dados))
