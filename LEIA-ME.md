# Solaria Management

Sistema de gestão de usinas solares: usinas, licenças e manutenções.
Os dados são de exemplo e ficam na memória: voltam ao início quando o servidor é reiniciado.

## Antes de começar (uma vez só)

1. Ter o **Node.js** instalado (versão LTS, 20 ou mais nova). Para conferir, abra o terminal e rode `node -v`.
   Se der erro, baixe em https://nodejs.org. Se o computador não deixar instalar, peça ao suporte de TI.
2. Ter o **VS Code** (opcional, mas ajuda a abrir os arquivos).
3. Ter **internet** na primeira vez, para baixar as dependências.

## Passo a passo

1. Copie a pasta `solaria-management` para um lugar do computador, como a Área de Trabalho ou Documentos.
   Evite rodar de dentro de pen drive ou de uma pasta de rede: fica muito lento ou falha.
2. Abra o terminal **dentro** dessa pasta:
   - No VS Code: *File → Open Folder* e escolha `solaria-management`, depois *Terminal → New Terminal*.
   - Se aparecer erro de "execução de scripts desabilitada" no PowerShell, troque para **Command Prompt**
     (setinha ao lado do `+` no painel do terminal).
3. Instale as dependências (demora uns minutos, só na primeira vez):

   ```
   npm install
   ```

4. Inicie o sistema:

   ```
   npm run dev
   ```

5. Abra no navegador: **http://localhost:3000**
6. Para parar, volte ao terminal e aperte `Ctrl + C`.

Nas próximas vezes, só os passos 2, 4 e 5.

## O que aparece

- **Dashboard:** total de usinas, MWp em operação, licenças críticas e manutenções pendentes.
- **Usinas:** lista, cadastro de nova usina e página de detalhes de cada uma.
- **Licenças:** tabela com selos verde, amarelo e vermelho calculados pela data de validade, com filtro e busca.
- **Usina inativa** (Solaria Mossoró): só consulta, sem cadastros.
- **Concluir uma manutenção** pede confirmação antes.
- **Carregamento:** enquanto os dados chegam, as telas mostram retângulos cinza piscando (esqueleto). A API de exemplo demora 0,8 s de propósito; para mudar, edite `LATENCIA_SIMULADA_MS` em `src/app/api/data/route.ts`.

## Estrutura de pastas

```
solaria-management/
├── LEIA-ME.md
├── package.json              lista de dependências e comandos
├── package-lock.json         versões exatas (não apagar)
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── src/
    ├── app/
    │   ├── layout.tsx        estrutura geral (menu + topo)
    │   ├── providers.tsx     liga o TanStack Query
    │   ├── page.tsx          redireciona para /dashboard
    │   ├── globals.css
    │   ├── api/data/route.ts dados de exemplo e API (GET, POST, PUT)
    │   ├── dashboard/page.tsx
    │   ├── usinas/page.tsx           lista e cadastro
    │   ├── usinas/[id]/page.tsx      detalhes (modo somente leitura)
    │   └── licencas/page.tsx
    ├── components/           Sidebar, Header, StatusBadge
    ├── hooks/useSolar.ts     busca e salva dados na API
    ├── schemas/solarSchema.ts  validação dos formulários (Zod)
    ├── types/solar.ts        tipos de Usina, Licença e Manutenção
    └── utils/                cálculo do status da licença e formatação
```

## Problemas comuns

| O que aparece | O que fazer |
|---|---|
| `npm` não é reconhecido | Node.js não está instalado. Instale e reabra o VS Code. |
| "Execução de scripts desabilitada" | Use o Command Prompt no lugar do PowerShell. |
| Erro de rede no `npm install` | Rede da faculdade bloqueando. Tente outra rede ou fale com a TI. |
| Porta 3000 em uso | O Next usa outra porta e mostra o endereço no terminal. |
| Alerta do Firewall do Windows | Cancele, ou permita só em redes privadas. Não precisa liberar para usar o localhost. |
| Página estranha depois de mudar arquivos | Pare com `Ctrl + C`, apague a pasta `.next` e rode `npm run dev` de novo. |

## Para levar de volta para casa

Copie a pasta **sem** `node_modules` e sem `.next` (são pesadas e são recriadas com `npm install`).
