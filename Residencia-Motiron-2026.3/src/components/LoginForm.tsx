'use client'

import { FormEvent, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LockKeyhole, Mail, Sun, UserRound } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const [cadastro, setCadastro] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setErro(''); setEnviando(true)
    const form = new FormData(event.currentTarget)
    const resposta = await fetch(cadastro ? '/api/auth/register' : '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: form.get('nome'), email: form.get('email'), senha: form.get('senha'), lembrar: form.get('lembrar') === 'on' }) })
    const dados = await resposta.json(); setEnviando(false)
    if (!resposta.ok) return setErro(dados.erro ?? 'Não foi possível concluir a solicitação.')
    router.replace('/dashboard')
  }

  return <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[minmax(350px,24%)_1fr]">
    <aside className="login-panel-grid relative hidden min-h-screen flex-col overflow-hidden px-7 py-8 text-white lg:flex">
      <div className="flex items-center gap-2.5"><Logo /><div><p className="text-sm font-bold">Solaria Management</p><p className="mt-0.5 text-[9px] tracking-[.11em] text-slate-400">PLATAFORMA DE GESTÃO SOLAR</p></div></div>
      <div className="my-auto max-w-[285px]"><h1 className="text-[30px] font-bold leading-[1.18] tracking-tight">Controle total <span className="text-amber-400">de cada usina</span> na palma da mão.</h1><p className="mt-3 text-xs leading-5 text-slate-300">Monitore geração, gerencie licenças, acompanhe manutenções e audite operações — tudo em um único centro de comando.</p></div>
      <div className="grid grid-cols-3 gap-3">{[['3', 'Usinas ativas'], ['7.400', 'kWp geridos'], ['99,2%', 'Uptime médio']].map(([valor, rotulo]) => <div key={rotulo} className="rounded-2xl border border-slate-700/80 bg-slate-800/60 px-2.5 py-2.5"><p className="text-base font-bold text-amber-400">{valor}</p><p className="mt-1.5 text-[8px] text-slate-400">{rotulo}</p></div>)}</div>
    </aside>
    <main className="flex min-h-screen items-center justify-center px-6 py-12"><section className="w-full max-w-80"><div className="mb-9 flex items-center gap-2 text-slate-950 lg:hidden"><Logo /><span className="font-bold">Solaria Management</span></div>
      <h1 className="text-xl font-bold tracking-tight text-slate-950">{cadastro ? 'Crie sua conta' : 'Bem-vindo de volta'}</h1><p className="mt-1 text-xs text-slate-500">{cadastro ? 'Use seus dados para acessar a plataforma' : 'Acesse sua conta para continuar'}</p>
      <form className="mt-6 space-y-4" onSubmit={enviar}>
        {cadastro && <Campo id="nome" rotulo="Nome completo" tipo="text" icone={<UserRound className="h-4 w-4" />} autoComplete="name" />}
        <Campo id="email" rotulo="E-mail" tipo="email" icone={<Mail className="h-4 w-4" />} autoComplete="email" />
        <div className="space-y-1.5"><label htmlFor="senha" className="text-xs font-medium text-slate-700">Senha</label><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="senha" name="senha" type={mostrarSenha ? 'text' : 'password'} autoComplete={cadastro ? 'new-password' : 'current-password'} required minLength={8} placeholder="Mínimo de 8 caracteres" className="h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-10 text-xs" /><button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Mostrar ou ocultar senha">{mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600"><input type="checkbox" name="lembrar" /> Lembrar de mim neste dispositivo</label>
        {erro && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-center text-xs text-red-700">{erro}</p>}
        <button disabled={enviando} type="submit" className="h-10 w-full rounded-lg bg-amber-500 text-sm font-semibold text-slate-950 disabled:opacity-60">{enviando ? 'Aguarde…' : cadastro ? 'Criar conta e entrar' : 'Entrar'}</button>
      </form>
      <p className="mt-5 text-center text-xs text-slate-500">{cadastro ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'} <button type="button" onClick={() => { setCadastro(!cadastro); setErro('') }} className="font-medium text-amber-600 hover:underline">{cadastro ? 'Entrar' : 'Criar conta'}</button></p>
    </section></main>
  </div>
}

function Logo() { return <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-slate-950"><Sun className="h-4 w-4" /></span> }
function Campo({ id, rotulo, tipo, icone, autoComplete }: { id: string; rotulo: string; tipo: string; icone: ReactNode; autoComplete: string }) { return <div className="space-y-1.5"><label htmlFor={id} className="text-xs font-medium text-slate-700">{rotulo}</label><div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icone}</span><input id={id} name={id} type={tipo} autoComplete={autoComplete} required placeholder={tipo === 'email' ? 'nome@empresa.com' : 'Seu nome'} className="h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs" /></div></div> }
