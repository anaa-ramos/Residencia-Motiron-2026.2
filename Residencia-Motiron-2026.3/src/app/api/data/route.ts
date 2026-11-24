import { NextResponse } from 'next/server'
import { z } from 'zod'
import { exigeAutenticacao } from '@/lib/auth'
import { lerBanco, salvarBanco } from '@/lib/store'
import { licencaSchema, usinaSchema } from '@/schemas/solarSchema'

const erroValidacao = (issues: unknown) => NextResponse.json({ erro: 'Dados inválidos', issues }, { status: 400 })
const usinaInativa = () => NextResponse.json({ erro: 'Usina inativa: somente leitura' }, { status: 403 })
const naoAutorizado = () => NextResponse.json({ erro: 'Sua sessão expirou. Entre novamente.' }, { status: 401 })

export async function GET() {
  if (!(await exigeAutenticacao())) return naoAutorizado()
  return NextResponse.json(lerBanco().solar)
}

export async function POST(request: Request) {
  if (!(await exigeAutenticacao())) return naoAutorizado()
  const body = await request.json()
  const banco = lerBanco()
  if (body.tipo === 'usina') {
    const parsed = usinaSchema.safeParse(body.dados)
    if (!parsed.success) return erroValidacao(parsed.error.issues)
    const usina = { id: crypto.randomUUID(), ...parsed.data }
    banco.solar.usinas.push(usina)
    salvarBanco(banco)
    return NextResponse.json(usina, { status: 201 })
  }
  if (body.tipo === 'licenca') {
    const parsed = licencaSchema.safeParse(body.dados)
    if (!parsed.success) return erroValidacao(parsed.error.issues)
    const usina = banco.solar.usinas.find((item) => item.id === parsed.data.usinaId)
    if (!usina) return NextResponse.json({ erro: 'Usina não encontrada' }, { status: 404 })
    if (usina.status === 'inativa') return usinaInativa()
    const licenca = { id: crypto.randomUUID(), ...parsed.data }
    banco.solar.licencas.push(licenca)
    salvarBanco(banco)
    return NextResponse.json(licenca, { status: 201 })
  }
  return NextResponse.json({ erro: 'Tipo inválido' }, { status: 400 })
}

const manutencaoSchema = z.object({ id: z.string(), status: z.enum(['pendente', 'em_andamento', 'concluida']) })

export async function PUT(request: Request) {
  if (!(await exigeAutenticacao())) return naoAutorizado()
  const parsed = manutencaoSchema.safeParse(await request.json())
  if (!parsed.success) return erroValidacao(parsed.error.issues)
  const banco = lerBanco()
  const manutencao = banco.solar.manutencoes.find((item) => item.id === parsed.data.id)
  if (!manutencao) return NextResponse.json({ erro: 'Manutenção não encontrada' }, { status: 404 })
  if (banco.solar.usinas.find((item) => item.id === manutencao.usinaId)?.status === 'inativa') return usinaInativa()
  manutencao.status = parsed.data.status
  salvarBanco(banco)
  return NextResponse.json(manutencao)
}
