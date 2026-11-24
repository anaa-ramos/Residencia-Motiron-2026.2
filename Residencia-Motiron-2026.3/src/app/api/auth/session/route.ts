import { NextResponse } from 'next/server'
import { COOKIE_SESSAO, usuarioAtual } from '@/lib/auth'
import { lerBanco, salvarBanco } from '@/lib/store'

export async function GET() {
  const usuario = await usuarioAtual()
  if (!usuario) return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 })
  return NextResponse.json({ usuario: { nome: usuario.nome, email: usuario.email } })
}

export async function DELETE(request: Request) {
  const token = request.headers.get('cookie')?.match(new RegExp(`${COOKIE_SESSAO}=([^;]+)`))?.[1]
  if (token) {
    const banco = lerBanco()
    const { createHash } = await import('node:crypto')
    const hash = createHash('sha256').update(token).digest('hex')
    banco.sessoes = banco.sessoes.filter((sessao) => sessao.tokenHash !== hash)
    salvarBanco(banco)
  }
  const resposta = NextResponse.json({ ok: true })
  resposta.cookies.set(COOKIE_SESSAO, '', { path: '/', maxAge: 0 })
  return resposta
}
