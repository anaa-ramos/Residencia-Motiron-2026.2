import { NextResponse } from 'next/server'
import { z } from 'zod'
import { respostaComSessao, senhaConfere } from '@/lib/auth'
import { lerBanco } from '@/lib/store'

const schema = z.object({ email: z.string().trim().email(), senha: z.string().min(1), lembrar: z.boolean().optional() })

export async function POST(request: Request) {
  const dados = schema.safeParse(await request.json())
  if (!dados.success) return NextResponse.json({ erro: 'Informe e-mail e senha válidos.' }, { status: 400 })
  const usuario = lerBanco().usuarios.find((item) => item.email === dados.data.email.toLowerCase())
  if (!usuario || !senhaConfere(dados.data.senha, usuario.senhaHash)) return NextResponse.json({ erro: 'E-mail ou senha incorretos.' }, { status: 401 })
  return respostaComSessao(NextResponse.json({ usuario: { nome: usuario.nome, email: usuario.email } }), usuario.id, dados.data.lembrar ?? false)
}
