# Residência Motiron 2026.2

Plataforma web de gestão corporativa feita pela squad 2 da Residência Tecnológica da Motiron Technologies.

O módulo que estamos construindo agora é o **Solaria Management**, um sistema para uma empresa que opera usinas solares acompanhar licenças e manutenções num lugar só.

<!--
Quando tiver os prints, salve em docs/ e troque pelos nomes reais:

![Dashboard do Solaria Management](docs/dashboard.png)
-->

## Por que existe

Uma usina solar depende de papéis que vencem: o parecer de acesso da concessionária, a licença de operação ambiental, a outorga da ANEEL. Se um deles vence sem ninguém perceber, a operação fica irregular. Além disso, cada usina tem manutenções para fazer, como limpar os painéis e inspecionar os inversores.

A ideia aqui é juntar tudo isso numa tela e deixar claro o que precisa de atenção primeiro.

## O que já funciona

- **Dashboard** com o total de usinas, os MWp em operação, as licenças críticas e as manutenções pendentes. O sino no topo conta quantas licenças pedem atenção.
- **Usinas**: lista com localização e capacidade, cadastro de usina nova e uma página de detalhes para cada uma.
- **Licenças**: tabela com filtro por status e busca, ordenada da mais urgente para a menos urgente.
- **Manutenções**: cada usina tem a sua lista, e marcar uma como concluída pede confirmação antes.
- **Usina inativa** fica só para consulta: a tela bloqueia os formulários e o servidor também recusa qualquer gravação.
- Enquanto os dados carregam, as telas mostram um esqueleto cinza no lugar do conteúdo.

### Como a cor da licença é decidida

O status não fica gravado em lugar nenhum. A tela calcula a partir da data de validade e de hoje, então ele muda sozinho com o passar do tempo.

| Situação | Cor |
|---|---|
| Faltam mais de 15 dias | Verde, Válida |
| Faltam 15 dias ou menos | Amarelo, Próximo do Vencimento |
| Data já passou | Vermelho, Expirada |

## Como rodar

Precisa do Node.js 20.9 ou mais novo.

```bash
git clone https://github.com/SEU-USUARIO/Residencia-Motiron-2026.2.git
cd Residencia-Motiron-2026.2
npm install
npm run dev
```

Depois é só abrir http://localhost:3000.

Se o PowerShell reclamar de execução de scripts, use o Prompt de Comando.

## Como o código está organizado

```
src/
├── app/
│   ├── api/data/        API de exemplo (GET, POST, PUT)
│   ├── dashboard/
│   ├── usinas/          lista e detalhes ([id])
│   └── licencas/
├── components/          menu lateral, topo, selo de status, esqueleto
├── hooks/               busca e gravação de dados (TanStack Query)
├── schemas/             regras dos formulários (Zod)
├── types/               formato de usina, licença e manutenção
└── utils/               cálculo do status e formatação
```

## Ferramentas

| Ferramenta | Para quê |
|---|---|
| Next.js 16 (App Router) | páginas e API no mesmo projeto |
| TypeScript | tipos para o editor avisar erros antes de rodar |
| Tailwind CSS | estilo |
| TanStack Query | buscar dados, guardar em cache e recarregar quando algo muda |
| React Hook Form + Zod | formulários e validação |
| Lucide | ícones |

## O que ainda falta

- Banco de dados de verdade. Hoje os dados de exemplo ficam na memória do servidor e voltam ao início quando ele reinicia.
- Login e permissões por usuário.
- Testes automatizados.

## Site para ver sem precisar baixar (Vercel foi usado)

- https://solaria-management.vercel.app/login

## Squad 2

| Nome | O que fez |
|---|---|
| Nome da pessoa | Parte do projeto |
| Nome da pessoa | Parte do projeto |
| Nome da pessoa | Parte do projeto |

Residência Tecnológica, Motiron Technologies, turma 2026.2.
