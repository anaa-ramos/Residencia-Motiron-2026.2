export const TIPOS_LICENCA = ['Parecer de Acesso', 'Licença de Operação Ambiental', 'Outorga ANEEL'] as const

export type TipoLicenca = (typeof TIPOS_LICENCA)[number]
export type StatusUsina = 'ativa' | 'inativa'
export type StatusLicenca = 'valida' | 'proximo_vencimento' | 'expirada'
export type StatusManutencao = 'pendente' | 'em_andamento' | 'concluida'

export interface Usina {
  id: string
  nome: string
  localizacao: string
  capacidadeKwp: number
  status: StatusUsina
}

export interface Licenca {
  id: string
  usinaId: string
  tipo: TipoLicenca
  emissor: string
  numero: string
  dataValidade: string
}

export interface Manutencao {
  id: string
  usinaId: string
  titulo: string
  responsavel: string
  prazo: string
  status: StatusManutencao
}

export interface DadosSolar {
  usinas: Usina[]
  licencas: Licenca[]
  manutencoes: Manutencao[]
}
