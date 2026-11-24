import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { lerBanco, salvarBanco, type Usuario } from './store'

export const COOKIE_SESSAO = 'solaria_session'
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

export function hashSenha(senha: string) {
  const sal = randomBytes(16).toString('hex')
  return `${sal}:${scryptSync(senha, sal, 64).toString('hex')}`
}

export function senhaConfere(senha: string, hash: string) {
  const [sal, esperado] = hash.split(':')
  if (!sal || !esperado) return false
  const calculado = scryptSync(senha, sal, 64).toString('hex')
  return timingSafeEqual(Buffer.from(esperado, 'hex'), Buffer.from(calculado, 'hex'))
}

export async function usuarioAtual(): Promise<Usuario | null> {
  const token = (await cookies()).get(COOKIE_SESSAO)?.value
  if (!token) return null
  const banco = lerBanco()
  const hash = hashToken(token)
  const sessao = banco.sessoes.find((item) => item.tokenHash === hash)
  if (!sessao || new Date(sessao.expiraEm) <= new Date()) return null
  return banco.usuarios.find((usuario) => usuario.id === sessao.usuarioId) ?? null
}

export function respostaComSessao(resposta: NextResponse, usuarioId: string, lembrar: boolean) {
  const banco = lerBanco()
  const token = randomBytes(32).toString('base64url')
  const duracao = lembrar ? 60 * 60 * 24 * 30 : 60 * 60 * 12
  banco.sessoes = banco.sessoes.filter((sessao) => new Date(sessao.expiraEm) > new Date())
  banco.sessoes.push({ tokenHash: hashToken(token), usuarioId, expiraEm: new Date(Date.now() + duracao * 1000).toISOString() })
  salvarBanco(banco)
  resposta.cookies.set(COOKIE_SESSAO, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: duracao })
  return resposta
}

export async function exigeAutenticacao() {
  const usuario = await usuarioAtual()
  return usuario ?? null
}
