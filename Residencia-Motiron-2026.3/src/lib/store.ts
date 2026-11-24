import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { DadosSolar } from '@/types/solar'

export type Usuario = {
  id: string
  nome: string
  email: string
  senhaHash: string
  criadoEm: string
}

export type Sessao = { tokenHash: string; usuarioId: string; expiraEm: string }
type Banco = { usuarios: Usuario[]; sessoes: Sessao[]; solar: DadosSolar }

const arquivo = join(process.cwd(), '.solaria-data', 'banco.json')

const emDias = (dias: number) => {
  const data = new Date()
  data.setDate(data.getDate() + dias)
  return data.toISOString().slice(0, 10)
}

const inicial = (): Banco => ({
  usuarios: [],
  sessoes: [],
  solar: {
    usinas: [
      { id: '1', nome: 'Solaria Petrolina I', localizacao: 'Petrolina, PE', capacidadeKwp: 30000, status: 'ativa' },
      { id: '2', nome: 'Solaria Juazeiro', localizacao: 'Juazeiro, BA', capacidadeKwp: 12500, status: 'ativa' },
      { id: '3', nome: 'Solaria Pirapora', localizacao: 'Pirapora, MG', capacidadeKwp: 2400, status: 'ativa' },
      { id: '4', nome: 'Solaria Mossoró', localizacao: 'Mossoró, RN', capacidadeKwp: 800, status: 'inativa' },
    ],
    licencas: [
      { id: 'l1', usinaId: '1', tipo: 'Parecer de Acesso', emissor: 'Neoenergia Pernambuco', numero: 'PA-2210/2024', dataValidade: emDias(200) },
      { id: 'l2', usinaId: '1', tipo: 'Licença de Operação Ambiental', emissor: 'CPRH', numero: 'LO-0873/2025', dataValidade: emDias(12) },
      { id: 'l3', usinaId: '2', tipo: 'Outorga ANEEL', emissor: 'ANEEL', numero: 'DESP-1482/2023', dataValidade: emDias(-15) },
      { id: 'l4', usinaId: '2', tipo: 'Parecer de Acesso', emissor: 'Coelba', numero: 'PA-5521/2024', dataValidade: emDias(90) },
      { id: 'l5', usinaId: '3', tipo: 'Licença de Operação Ambiental', emissor: 'FEAM', numero: 'LO-3310/2024', dataValidade: emDias(15) },
      { id: 'l6', usinaId: '4', tipo: 'Outorga ANEEL', emissor: 'ANEEL', numero: 'DESP-987/2022', dataValidade: emDias(400) },
    ],
    manutencoes: [
      { id: 'm1', usinaId: '1', titulo: 'Limpeza dos painéis', responsavel: 'Equipe Norte', prazo: emDias(5), status: 'pendente' },
      { id: 'm2', usinaId: '1', titulo: 'Inspeção de inversores', responsavel: 'Carlos Nunes', prazo: emDias(2), status: 'em_andamento' },
      { id: 'm3', usinaId: '2', titulo: 'Laudo de aterramento', responsavel: 'Ana Ribeiro', prazo: emDias(-3), status: 'pendente' },
      { id: 'm4', usinaId: '2', titulo: 'Limpeza dos painéis', responsavel: 'Equipe Sul', prazo: emDias(-10), status: 'concluida' },
      { id: 'm5', usinaId: '3', titulo: 'Inspeção de inversores', responsavel: 'Carlos Nunes', prazo: emDias(14), status: 'pendente' },
      { id: 'm6', usinaId: '4', titulo: 'Laudo de aterramento', responsavel: 'Equipe Norte', prazo: emDias(30), status: 'pendente' },
    ],
  },
})

export function lerBanco(): Banco {
  if (!existsSync(arquivo)) return inicial()
  return JSON.parse(readFileSync(arquivo, 'utf8')) as Banco
}

export function salvarBanco(banco: Banco) {
  mkdirSync(join(process.cwd(), '.solaria-data'), { recursive: true })
  const temporario = `${arquivo}.tmp`
  writeFileSync(temporario, JSON.stringify(banco, null, 2), 'utf8')
  renameSync(temporario, arquivo)
}
