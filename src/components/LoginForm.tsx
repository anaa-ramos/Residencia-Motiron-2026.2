'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LockKeyhole, Mail, Sun } from 'lucide-react'

const indicadores = [
  { valor: '3', rotulo: 'Usinas ativas' },
  { valor: '7.400', rotulo: 'kWp geridos' },
  { valor: '99,2%', rotulo: 'Uptime médio' },
]

export default function LoginForm() {
  const router = useRouter()
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [aviso, setAviso] = useState('')

  function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAviso('')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[minmax(350px,24%)_1fr]">
      <aside className="login-panel-grid relative hidden min-h-screen flex-col overflow-hidden px-7 py-8 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-[0_0_18px_rgba(245,158,11,0.55)]">
            <Sun className="h-4 w-4" strokeWidth={2.4} />
          </span>
          <div>
            <p className="text-sm font-bold tracking-[-0.03em]">Solaria Management</p>
            <p className="mt-0.5 text-[9px] font-medium tracking-[0.11em] text-slate-400">PLATAFORMA DE GESTÃO SOLAR</p>
          </div>
        </div>

        <div className="my-auto max-w-[285px] pb-8">
          <h1 className="text-[30px] font-bold leading-[1.18] tracking-[-0.045em]">
            Controle total <span className="text-amber-400">de cada usina</span> na palma da mão.
          </h1>
          <p className="mt-3 max-w-[275px] text-xs leading-5 text-slate-300">
            Monitore geração, gerencie licenças, acompanhe manutenções e audite operações — tudo em um único centro de comando.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {indicadores.map(({ valor, rotulo }) => (
            <div key={rotulo} className="rounded-2xl border border-slate-700/80 bg-slate-800/60 px-2.5 py-2.5 backdrop-blur-sm">
              <p className="text-base font-bold leading-none text-amber-400">{valor}</p>
              <p className="mt-1.5 text-[8px] leading-3 text-slate-400">{rotulo}</p>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <section className="w-full max-w-80" aria-labelledby="titulo-login">
          <div className="mb-9 lg:hidden">
            <div className="flex items-center gap-2 text-slate-950">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500"><Sun className="h-4 w-4" /></span>
              <span className="font-bold">Solaria Management</span>
            </div>
          </div>

          <h1 id="titulo-login" className="text-xl font-bold tracking-[-0.035em] text-slate-950">
            Bem-vindo de volta
          </h1>
          <p className="mt-1 text-xs text-slate-500">Acesse sua conta para continuar</p>

          <form className="mt-6 space-y-4" onSubmit={entrar}>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-slate-700">E-mail</label>
              <div className="relative">
                <Mail aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="nome@empresa.com"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="senha" className="text-xs font-medium text-slate-700">Senha</label>
              <div className="relative">
                <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="senha"
                  name="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-10 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((visivel) => !visivel)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-0.5 text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                <input type="checkbox" name="lembrar" className="h-3.5 w-3.5 rounded border-slate-300 text-amber-500 focus:ring-amber-400" />
                Lembrar de mim
              </label>
              <button
                type="button"
                onClick={() => setAviso('Entre em contato com o suporte para redefinir sua senha.')}
                className="font-medium text-amber-600 transition hover:text-amber-700 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>

            {aviso && <p role="status" className="rounded-md bg-amber-50 px-3 py-2 text-center text-xs text-amber-800">{aviso}</p>}

            <button type="submit" className="h-10 w-full rounded-lg bg-amber-500 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:bg-amber-600">
              Entrar
            </button>
          </form>

          <p className="mt-5 text-center text-[10px] text-slate-400">
            Problemas para acessar?{' '}
            <a href="mailto:suporte@solaria.com" className="text-amber-600 hover:underline">Fale com o suporte</a>
          </p>
        </section>
      </main>
    </div>
  )
}
