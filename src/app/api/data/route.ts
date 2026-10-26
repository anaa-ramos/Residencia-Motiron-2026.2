import { NextResponse } from 'next/server'
import { z } from 'zod'
import { licencaSchema, usinaSchema } from '@/schemas/solarSchema'
import type { DadosSolar } from '@/types/solar'

const emDias = (dias: number) => {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const dadosIniciais = (): DadosSolar => ({
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
    { id: 'm6', usinaId: '4', titulo: 'Laudo de aterramento', responsavel: 'Ana Ribeiro', prazo: emDias(30), status: 'pendente' },
  ],
})

const globalDb = globalThis as unknown as { __solarDb?: DadosSolar }
const db = (globalDb.__solarDb ??= dadosIniciais())

const LATENCIA_SIMULADA_MS = 800

const erroValidacao = (issues: unknown) => NextResponse.json({ erro: 'Dados inválidos', issues }, { status: 400 })
const usinaInativa = () => NextResponse.json({ erro: 'Usina inativa: somente leitura' }, { status: 403 })

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, LATENCIA_SIMULADA_MS))
  return NextResponse.json(db)
}

export async function POST(request: Request) {
  const body = await request.json()

  if (body.tipo === 'usina') {
    const parsed = usinaSchema.safeParse(body.dados)
    if (!parsed.success) return erroValidacao(parsed.error.issues)
    const usina = { id: crypto.randomUUID(), ...parsed.data }
    db.usinas.push(usina)
    return NextResponse.json(usina, { status: 201 })
  }

  if (body.tipo === 'licenca') {
    const parsed = licencaSchema.safeParse(body.dados)
    if (!parsed.success) return erroValidacao(parsed.error.issues)
    const usina = db.usinas.find((u) => u.id === parsed.data.usinaId)
    if (!usina) return NextResponse.json({ erro: 'Usina não encontrada' }, { status: 404 })
    if (usina.status === 'inativa') return usinaInativa()
    const licenca = { id: crypto.randomUUID(), ...parsed.data }
    db.licencas.push(licenca)
    return NextResponse.json(licenca, { status: 201 })
  }

  return NextResponse.json({ erro: 'Tipo inválido' }, { status: 400 })
}

const manutencaoSchema = z.object({
  id: z.string(),
  status: z.enum(['pendente', 'em_andamento', 'concluida']),
})

export async function PUT(request: Request) {
  const parsed = manutencaoSchema.safeParse(await request.json())
  if (!parsed.success) return erroValidacao(parsed.error.issues)

  const manutencao = db.manutencoes.find((m) => m.id === parsed.data.id)
  if (!manutencao) return NextResponse.json({ erro: 'Manutenção não encontrada' }, { status: 404 })
  if (db.usinas.find((u) => u.id === manutencao.usinaId)?.status === 'inativa') return usinaInativa()

  manutencao.status = parsed.data.status
  return NextResponse.json(manutencao)
}
