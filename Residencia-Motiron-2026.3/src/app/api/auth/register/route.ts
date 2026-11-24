import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { hashSenha, respostaComSessao } from '@/lib/auth'
import { lerBanco, salvarBanco } from '@/lib/store'

const schema = z.object({ nome: z.string().trim().min(2), email: z.string().trim().email(), senha: z.string().min(8), lembrar: z.boolean().optional() })

export async function POST(request: Request) {
  const dados = schema.safeParse(await request.json())
  if (!dados.success) return NextResponse.json({ erro: 'Preencha os dados corretamente. A senha deve ter ao menos 8 caracteres.' }, { status: 400 })
  const banco = lerBanco()
  const email = dados.data.email.toLowerCase()
  if (banco.usuarios.some((usuario) => usuario.email === email)) return NextResponse.json({ erro: 'Já existe uma conta com este e-mail.' }, { status: 409 })
  const usuario = { id: randomUUID(), nome: dados.data.nome, email, senhaHash: hashSenha(dados.data.senha), criadoEm: new Date().toISOString() }
  banco.usuarios.push(usuario)
  salvarBanco(banco)
  return respostaComSessao(NextResponse.json({ usuario: { nome: usuario.nome, email: usuario.email } }, { status: 201 }), usuario.id, dados.data.lembrar ?? false)
}
