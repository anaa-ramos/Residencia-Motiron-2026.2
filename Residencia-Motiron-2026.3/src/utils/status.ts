import type { StatusLicenca } from '@/types/solar'

export interface ResultadoStatus {
  status: StatusLicenca
  cor: 'verde' | 'amarelo' | 'vermelho'
  label: string
  classes: string
  diasRestantes: number
}

const MS_POR_DIA = 24 * 60 * 60 * 1000

export function calcularStatusLicenca(dataValidade: string, hoje: Date = new Date()): ResultadoStatus {
  const validade = new Date(`${dataValidade}T00:00:00`)
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  const diasRestantes = Math.round((validade.getTime() - inicioHoje.getTime()) / MS_POR_DIA)

  if (diasRestantes < 0) {
    return { status: 'expirada', cor: 'vermelho', label: 'Expirada', classes: 'bg-red-100 text-red-800', diasRestantes }
  }
  if (diasRestantes <= 15) {
    return { status: 'proximo_vencimento', cor: 'amarelo', label: 'Próximo do Vencimento', classes: 'bg-amber-100 text-amber-800', diasRestantes }
  }
  return { status: 'valida', cor: 'verde', label: 'Válida', classes: 'bg-green-100 text-green-800', diasRestantes }
}
