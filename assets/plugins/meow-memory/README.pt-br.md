# meow-memory 🐱📝

| [中文](README.md) | [English](README.en.md) | [Português (BR)](README.pt-br.md) | [MIT License](LICENSE) |
| :---: | :---: | :---: | :---: |

Memória entre sessões para o [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH).


**A ideia central**: cada workspace mantém um banco de memória estruturado (`.dsh-meow/memory.db`, sobre `node:sqlite`).
O manual estático de memória (visão geral dos dados + uso das ferramentas + princípios de escrita) fica no
**system prompt** como sections fixas — o texto é constante, então não quebra o cache KV/de contexto do
provider de LLM. O conteúdo dinâmico (soul/user completos, princípios de design, guia de memória) é injetado
como **prefixo da primeira mensagem do usuário**, e a primeira rodada injeta só a memória de longo prazo,
sem acertos por palavra-chave; a partir da segunda rodada cada mensagem do usuário faz acertos por
palavra-chave (top-2). O modelo aprofunda a busca sob demanda com `memory_search` / `memory_project`.
Cada janela consolida as próprias memórias (as criadas + as já extraídas nela) quando fica ociosa ("dream"),
congelando o conhecimento da janela no timestamp da última conversa.

## ✨ Recursos

- **Memória em sete níveis** (`soul` = a própria IA / `user` = fatos e preferências básicas do usuário /
  `project` = informação de projeto, com `subcategory` (overview/structure/decisions/quotes/ops/todo) /
  `fact` = fato atômico / `lesson` = o que se aprendeu e correções / `topic` = assunto em andamento com
  frase-objetivo / `rules` = princípios de design e diretrizes de comportamento).
  Uma tabela SQLite por nível, UUID com prefixo de tempo, a ordem dos ids é a ordem de criação.
- **Injeção da primeira rodada (bloco de memória de longo prazo)**: antes da primeira mensagem do usuário
  injeta o formato fixo `===== MEMÓRIA DE LONGO PRAZO =====` → `Sobre você` (soul completo) →
  `Sobre o usuário` (user completo) → `Princípios de design` (rules globais com importance≥2, diretrizes
  imperativas, poucas e boas) → `Guia de memória` (instruções de uso + a lista dinâmica "todos os projetos
  do usuário", para escolher em `memory_project`). A memória entra como uma mensagem plugin snapshot
  independente antes da mensagem real do usuário, sem reescrever o prompt dele.
  **A primeira rodada não roda acertos por palavra-chave** (eles começam na segunda). Mesmo que a primeira
  mensagem do usuário chegue junto com uma notificação do plugin (por exemplo, aviso de mudança de
  approval policy), o snapshot ainda é inserido colado antes da mensagem real e nenhum acerto se antecipa.
- **Acerto por palavra-chave a cada mensagem**: a partir da segunda mensagem do usuário, cada mensagem real
  busca fact/lesson/rules/topic (escopo = global + ancorado no projeto atual), e os top-2 acertos entram com
  o prefixo "Memórias possivelmente relevantes, apenas para referência:". O acerto usa as **palavras-chave da
  entrada** (extraídas pelo LLM ou bigramas automáticos), não o texto inteiro — casar texto inteiro gera
  ruído. A pontuação = interseção × idf × cobertura × decaimento de Ebbinghaus (pelo timestamp da memória)
  × peso de importance × bônus de title.
- **Ancoragem no projeto atual**: `memory_remember/search/update/project` com o parâmetro project ancora o
  projeto atual daquela sessão; sem ancoragem os acertos buscam só o global (conversa fiada do usuário não
  atrapalha).
- **Projetado para cache**: a section estática `meow-memory:guide` (order 130, logo após as descrições
  `tool:*`) é registrada uma vez no system prompt — texto constante, amigável ao cache KV. As memórias já
  vistas (`injected` + `searched`) são registradas por sessão (`.dsh-meow/sessions/<id>.json`): a injeção
  nunca se repete; os 5 primeiros de `memory_search` são pegos direto por relevância (sem excluir vistos nem
  memórias criadas nesta sessão) e o restante completa desviando dos vistos a partir das posições seguintes
  do ranking; ao receber sinal de compactação da sessão (`compaction/*`) os registros de vistos são
  liberados, permitindo que voltem a ser acertados e extraídos depois da compactação.
- **Reinjeção após compactação**: depois que a sessão é compactada (`/compact` manual ou automática por
  pressão de tokens), a rodada seguinte do usuário reinjeta automaticamente o snapshot de longo prazo + o
  panorama dos projetos consultados nesta sessão com `memory_project` + o texto das memórias que esta sessão
  escreveu/atualizou (tudo remontado com os dados mais recentes) — a "memória" que a compactação jogou fora
  volta em um turno, e a IA não perde a lembrança de repente.
- **Conjunto de ferramentas**: `memory_remember` (escrita; content/project/keywords/importance obrigatórios,
  com erro orientando o preenchimento quando faltam, deduplicação/merge automáticos, e confirmação de leitura
  de volta: palavras-chave e projeto) /
  `memory_search` (BM25 × peso de recência, filtros level/project/status/days, top10 padrão = os 5 mais
  relevantes sem excluir vistos + 5 completando e desviando dos vistos, ordenados pelo timestamp da memória;
  devolve a visão de metadados: origem + id completo + tempo relativo + lista de palavras-chave, sem o texto) /
  `memory_project` (parágrafo de panorama do projeto; **o parâmetro project é obrigatório** — qual projeto
  você quer ver? agrupa por subcategoria, entrega todas as entradas não obsoletas, cada uma com id completo e
  timestamp da última atualização, e no todo imprime "Concluído:" com as 5 últimas + "Lista de tarefas:",
  terminando com a localização do banco de memória e do histórico de sessões) /
  `memory_find_similar` (checagem de duplicatas e conflitos) / `memory_read` / `memory_update` (com correção
  manual de status active/archived/stale, importance, goal e keywords) / `memory_dream` (disparo manual; o
  usuário também pode digitar o comando `/dream` direto no input).
- **Timestamp da memória** (`updated_at` = última atualização): atualizado quando o dream congela ou quando
  `memory_update` atualiza. Todo timestamp exibido é o `updated_at`; search (visão de trabalho) traz o tempo
  relativo, e a injeção por acerto / memory_project (visão do texto) traz relativo + absoluto
  (por exemplo "2026-08-15 10:58 [2 dias atrás]").
- **Atribuição de projeto**: informação de aplicação global preenche project com `"global"` (distinto de
  vazio = sem rótulo); quando vale para vários projetos, separe por vírgula (por exemplo `"dsh, femwa"`) —
  a busca/o acerto decide por "contém o nome do projeto atual ou é global".
- **Dream por janela**: com a janela ociosa por ≥ `idleMinutes` (padrão **180 minutos = 3 horas**) ela entra
  no estado que permite disparo (substituindo a antiga janela noturna); cada janela cuja última fala é mais
  recente que o último dream é consolidada pelo próprio agente principal — em rodadas (rodada 1 = memórias
  atômicas project/fact/lesson/rules/soul/user, rodada 2 = memórias topic, rodada 3 = resumo de projeto,
  acrescentado quando a janela envolve um projeto concreto: chama memory_project para revisar e enxugar em
  uma nova memória de longo prazo do projeto, arquivando as entradas antigas substituídas), com subtítulos
  por projeto e uma linha de palavras-chave em cada memória (para a IA conferir/reescrever as chaves); o
  escopo = memórias criadas + extraídas (injetadas/buscadas/consultadas com memory_read) nesta janela, usando
  o contexto completo da conversa dela; rules estáveis de longo prazo não são reavaliadas à toa
  (`dream.rulesReviewDays` padrão 2 dias: só entra na lista o que foi atualizado dentro disso, evitando
  atualização "por falar demais"). **Supressão em horário de pico** (calculada pelo `timeZone`, padrão
  horário de Pequim): dentro de `suppressWindows` (padrão 09:00–12:00 e 14:00–18:00, os picos de tarifa de
  energia da API) e dos `suppressLeadMinutes` (padrão 15) anteriores ao início de cada janela o dream não
  dispara; terminado o pico, ele dispara no próximo ciclo de verificação; um dream em andamento não é
  interrompido. Janelas antigas sem agente vivo e com mais de 24h, e sessões já arquivadas, não são
  processadas.
- **Comando `/dream`**: não quer esperar a ociosidade? Digite `/dream` no input para acordar na hora a
  consolidação de memória desta janela (mesma semântica da ferramenta `memory_dream`, sem sofrer a supressão
  de pico). O comando é executado pelo plano de comandos do dsh, não vai ao modelo, e aparece direto no menu
  de autocompletar ao digitar `/`; se já houver uma consolidação em andamento ele avisa claramente e não
  inicia outra.
- **Pular a consolidação do dream (client)**: não quer que a memória de uma janela seja consolidada
  automaticamente? No menu "…" da linha dessa sessão na barra lateral, clique em
  **"Pular a consolidação de memória (dream)"** e depois em
  **"Voltar a fazer a consolidação de memória (dream)"** para restaurar. Janelas puladas deixam de ser
  consolidadas pelo timer de ociosidade (`/dream` e o disparo manual com `memory_dream` não são afetados) e
  aparecem na lista de sessões com um ícone **cinza silenciado de "lua + barra"**, reconhecível de relance.
  O estado de pulo é persistido, sobrevive a reinícios, e como duas instâncias compartilham o mesmo banco de
  memória o estado é naturalmente consistente.
- **Reflexão**: depois de ≥7 passos de ferramenta seguidos dentro de uma mesma tarefa, o plugin pergunta ao
  modelo se há algo que valha memorizar desde a última consolidação. Se a última ferramenta for `memory_*`,
  considera que já houve memorização ativa e não reflete de novo; rodadas canceladas nunca disparam.
- **UI de recolhimento da injeção (client)**: o texto injetado (memória de longo prazo da primeira rodada /
  acertos por palavra-chave de cada mensagem) é recolhido no frontend em uma barra
  "▸ Memória injetada (longo prazo / acertos por palavra-chave)" (com a mesma largura do balão do usuário);
  clicando, o texto completo da injeção aparece. O prompt do usuário é exibido direto como balão e o fluxo
  de mensagens fica limpo, sem enxurrada de injeções. Só mensagens de texto puro são recolhidas (as com
  anexo ficam como estão).
- **UI de recolhimento das rodadas de reflexão (client)**: o prompt da rodada de reflexão/dream e os
  think/tool calls/relatórios seguintes são recolhidos em uma barra (recolhida por padrão, mostrando
  "N memórias adicionadas" / "Tarefa de sonho da memória"); ao clicar, ela se expande em um card com o
  registro completo — dentro do card, Think / tool call / injeção de contexto podem ser abertos para ver os
  detalhes.
- **Ícone de dream na lista de sessões (client)**: na lista de sessões da esquerda, a linha da sessão cuja
  "memória foi consolidada pelo dream e depois não teve conversa/informação nova" mostra uma **lua crescente
  amarelo-clara 🌙**; durante a rodada de dream mostra a **lua em respiração branco→dourado** (convivendo com
  o ponto de status do dsh, com a lua à esquerda, sem confundir com trabalho normal); sessões com a
  **consolidação pulada** mostram o **cinza silenciado de "lua + barra"** (ao cancelar o pulo ele volta
  sozinho; prioridade: respiração > pulo > lua). Atividade nova remove o ícone. O ícone vai para o slot de
  status da linha de sessão do dsh, à esquerda do ponto de status — só nós próprios adicionamos/removemos
  nós nossos, sem reescrever os filhos que pertencem ao React (substituir o slot inteiro dessincroniza o
  virtual DOM do React e o commit lança removeChild NotFoundError, desmontando a árvore inteira da barra
  lateral). Os dados vêm de um polling diff de 60s compartilhado por toda a página (correção de pool de
  conexões da v0.23.0, substituindo o antigo SSE de longa duração): um GET em
  `/meow-memory/dreamed-sessions` e outro em `/meow-memory/skip-dreams`, com a mesma semântica de eventos —
  dream começando emite `state:'dreaming'`, concluído emite `state:'dreamed'`, atividade nova emite
  `state:'active'`, e a inversão do pulo emite `state:'skip'/'unskip'`; ao montar, o client faz uma
  reconciliação completa. O posicionamento das linhas não exige mudança nenhuma no dsh: lê o fiber do React
  18 (atributo interno `__reactFiber$`) para pegar a render key da linha de sessão = session id, sem depender
  de casar títulos.
- **Anti-duplicação do dream**: portão de check (throttle de 60s com checagem atômica no banco) + aquisição
  idempotente no start (`dream_pending`) + autocura de interrupção (dream sem desfecho é finalizado
  automaticamente) + finalização de órfãos (dá para finalizar mesmo com fim de turn após outra instância ou
  hot reload); os eventos das rodadas injetadas pelo plugin não renovam a atividade da janela — uma janela
  já consolidada não é consolidada de novo repetidamente.
- **Zero dependências de runtime**: `node:sqlite` (disponível por padrão no Node ≥22.13; 22.5–22.12 precisa
  de `--experimental-sqlite`) + artefato esbuild autocontido (`lib/index.js`). Nenhum módulo nativo.

## 📦 Instalação

### Instalação em um comando (recomendada)

```sh
dsh plugin --profile web add github:Phant0Meow/dsh-meow-memory
```
#### Fork em PT-BR
```sh
dsh plugin --profile web add github:coutogilson/dsh-meow-memory
```

Um comando instala e já vale: a instalação compila automaticamente (o pacote traz o script `prepare`),
monta sozinho, e depois de reiniciar o `dsh web` novas sessões carregam o plugin automaticamente.

> O pnpm ≥10 bloqueia por padrão scripts de build na instalação: o primeiro `add` pode falhar pedindo
> `allowBuilds`; siga a instrução, adicione as chaves mostradas no `pnpm-workspace.yaml` do profile e rode
> de novo.

### Desinstalação

```sh
dsh plugin --profile web remove meow-memory
```

### Instalação manual (desenvolvedores, qualquer instalação do DSH, sem npm)

1. Copie (ou crie um link simbólico de) este pacote para o `node_modules` do profile:
   ```sh
   mkdir -p ~/.dsh/profiles/web/node_modules
   ln -s /path/to/meow-memory ~/.dsh/profiles/web/node_modules/meow-memory
   ```
   (Windows: `New-Item -ItemType Junction ...` — junction NTFS, sem precisar de administrador.)
2. Adicione `meow-memory` ao `dsh.profile.bundles` do `package.json` do profile (como acima).
3. Reinicie o `dsh web`. Novas sessões carregam o plugin automaticamente.

## 🔌 Compatibilidade

Suporta **dsh 0.1.5** (incluindo o `0.1.5-rc.1` mais recente) e também versões antigas — atualizar o dsh
não exige mudar este plugin nem nenhuma configuração.

O plugin não fixa número de versão: ele detecta as capacidades do host em runtime, então cada versão segue
o ramo correto. Duas gerações já foram testadas de verdade: no `0.1.5-rc.1` a primeira injeção, as chamadas
das ferramentas de memória e a renderização no cliente funcionam; no `0.1.1-rc.2` o comportamento é
idêntico ao das versões anteriores.

## ⚙️ Configuração

Todos os campos são opcionais (patch do profile ou `cordis.patch.yml`). **Também dá para não editar arquivo
nenhum**: a página de configurações do DSH tem a aba "Meow memory" deste plugin (no mesmo nível de "Geral" e
"Modelos"), onde todos os itens abaixo são editáveis na interface, com gravação por campo e restauração
individual do padrão (restaurar padrão = voltar ao padrão de fábrica do plugin, sem sofrer a base do patch);
depois de salvar, vale após recarregar a quente/reiniciar o plugin meow-memory.

```yaml
- id: meow-memory
  name: 'meow-memory'
  config:
    enabled: true          # chave geral
    projectDir: '.dsh-meow' # diretório de memória (relativo ao workspace)
    promptLang: 'pt-br'    # ⚠️ configure explicitamente no primeiro uso (ver abaixo); o valor é o nome do
                           # diretório do pacote: zh / en / pt-br
    hitTopK: 2             # máximo de entradas por acerto de palavra-chave a cada mensagem (fact/lesson/rules/topic)
    reflect: true          # reflexão automática após ≥reflectTurns rodadas seguidas de ferramenta
    reflectTurns: 7        # rodadas seguidas de ferramenta para disparar a reflexão
    dream:
      enabled: true
      idleMinutes: 180      # janela ociosa por ≥180 minutos (3 horas) permite o dream
      suppressWindows:      # janelas de supressão em horário de pico (calculadas pelo timeZone abaixo, "HH:MM" início-fim)
        - start: '09:00'    #   picos de tarifa de energia da API
          end: '12:00'
        - start: '14:00'
          end: '18:00'
      suppressLeadMinutes: 15  # também não dispara nos 15 minutos antes de cada pico
      checkMinutes: 15
      timeZone: 'Asia/Shanghai'  # o relógio da máquina do usuário está no fuso dos EUA; a supressão
                                 # precisa ser calculada neste fuso fixo
      rulesReviewDays: 2    # regras estáveis com updated_at mais antigo que esses dias ficam fora da
                            # lista da 1ª rodada do dream (evita revisar o que não mudou); 0 = sem filtro
    delegate:
      model: ''            # troca de modelo nas tarefas de consolidação (opcional): preenchido, as rodadas
                           # de reflexão e de sonho passam a usar esse modelo e voltam ao principal no fim
                           # da rodada; 'provider/model' escolhe provider+model, 'model' troca só o modelo
                           # (provider herdado do principal); vazio = sempre o modelo principal
```

### Troca de modelo nas tarefas de consolidação (opcional)

A rodada de reflexão e cada grupo do dream sempre rodam na janela principal (steer) — prompt, resposta do
modelo e chamadas de ferramenta caem no log da sessão principal (a UI de recolhimento cuida do visual). O
modo de execução em subagente fork independente foi removido na v0.24 e não existe mais o interruptor
"execução independente".

Se quiser rodar a consolidação de memória em outro modelo (mais barato): com `delegate.model` configurado,
cada requisição de LLM disparada nas rodadas de reflexão/sonho tem provider/model sobrescritos
automaticamente pelo waterfall `agent/request` do dsh, e ao fim da rodada o modelo principal volta — conversa
normal e rodadas de ferramenta não são afetadas. A implementação é sem estado: cada requisição é julgada por
"o turn atual carrega ou não a marca de instrução de reflexão/sonho", então aborto do usuário, travamento ou
hot reload nunca deixam um estado sujo de "preso no modelo trocado".

### Idioma da interface: segue a configuração de idioma do DSH (v0.27.0)

O texto da interface do plugin (barras de recolhimento, bolhas de marcação, item do menu da sessão, página de
configurações) passa por uma **camada de texto de UI** própria, que segue o
"Configurações → Geral → Idioma" do DSH: **中文 / English / Português (Brasil)** já vêm embutidos, e a troca
vale na hora (o rótulo da página de configurações se re-registra conforme o contrato oficial, e nós de DOM
puro são atualizados pelo registro de replay).

É uma camada separada do `promptLang` (texto do modelo) e as duas não interferem: a interface pode seguir o
idioma do shell enquanto os prompts injetados continuam seguindo o `promptLang` (o `promptLang` só escolhe o
pacote de textos de modelo em `src/prompts/`, hoje `zh` / `en`). Em hosts antigos (sem o serviço de locale)
ele cai para o idioma do navegador + os dicionários embutidos, terminando em `zh` — inalterado para quem lê
chinês com o navegador em chinês, e já puxando o inglês (que é o objetivo da mudança) para quem pede esse
idioma.

Para criar/contribuir com um idioma de interface: um arquivo de dicionário + uma linha em
`SUPPORTED_UI_LOCALES` (sem mexer no código da UI). Detalhes em [`src/i18n/README.md`](src/i18n/README.md).

### promptLang: idioma dos prompts e da busca (importante)

O `promptLang` decide duas coisas: ① o idioma do texto de injeção/reflexão/dream; ② o idioma das descrições
das ferramentas. Ele também influencia o idioma em que o modelo escreve as entradas de memória — as
palavras-chave são extraídas no idioma da entrada, então **vale o idioma em que você fala**.

**Por isso configure-o explicitamente no primeiro uso**: `promptLang: 'zh'` (padrão), `'en'` (pacote inglês
embutido) ou `'pt-br'` (pacote português do Brasil embutido). O valor **é** o nome do subdiretório e é casado
**literalmente**: um nome que não existe em `src/prompts/` (por exemplo `pt`) não gera erro nenhum — ele cai
no pacote chinês, em silêncio.

Sobre a busca: a tokenização do BM25 é independente de idioma desde a v0.20.0 (roteamento por categoria), e
a diferença de idioma entre entradas e consulta não "mata a busca"; o modo `en` habilita ainda uma
normalização do inglês (filtro de stopwords + stemmer de Porter), e flexões não atrapalham o acerto
(`tokenizers` acerta uma entrada guardada como `tokenizer`).

O `pt-br` já vem embutido (tradução brasileira). Para outra variante de português ou para ajustar o texto, use
o override de instância em `<home>/.dsh-meow/prompts/<lang>/` (pode sobrescrever só alguns slots) e configure o
`promptLang` com esse mesmo nome. Pacotes de prompt são arquivos de dados (`src/prompts/`), um diretório por
idioma, e passam a valer só editando os arquivos, sem mexer no código — veja
[`src/prompts/README.md`](src/prompts/README.md) (com guia de contribuição e a autoverificação
`npm run check-lang`).

## 🧠 Como funciona

```
Primeira mensagem ............ injeta o bloco de memória de longo prazo
(prefixo = snapshot       .... Sobre você (soul) / Sobre o usuário (user) /
 plugin, prompt do              Princípios de design (rules) / Guia de memória
 usuário intocado)              (a 1ª rodada NÃO faz acertos por palavra-chave)

Da 2ª mensagem em diante ..... "Memórias possivelmente relevantes, apenas para
                                referência:" + top-2 acertos por palavra-chave
                                (global + ancorado no projeto atual)
                                ids já vistos registrados por sessão
                                (sessions/<id>.json); sinal de compactação
                                libera os vistos

Janela ociosa ≥3h ............ dream por janela: 3 rodadas (a 3ª é o resumo de
e fora do pico                  projeto) sobre as memórias criadas + extraídas
                                nesta janela, congelando por updated_at no
                                timestamp da última conversa
```

Os rótulos acima são os do pacote de prompts em português; com `promptLang: 'zh'` eles aparecem em chinês e
com `'en'` em inglês (por exemplo `===== LONG-TERM MEMORY =====`,
`Possibly relevant memories, for reference only:`).

## 🛠 Desenvolvimento

```sh
npm install
npm run build          # empacota com esbuild → lib/index.js (autocontido)
npm run test           # suíte de testes: host (db / bm25 / migrate / inject / reflect / dream / tools / apply) + cliente (fold / i18n / settings / delegate / ícone / skip)
```

Os pacotes `@deepseek-ai/*` ficam no pnpm workspace do dsh-meow, não no `node_modules` deste pacote.
No Windows, `npm run link-workspace` (ou `scripts/link-workspace.ps1`) cria os junctions espelhando os
pacotes do workspace para o esbuild resolvê-los; o `build.mjs` os referencia via `nodePaths`.
Esses links só são necessários em tempo de build.

## 🙏 Agradecimentos

Obrigado a cada contribuidor que faz o meow-memory melhorar:

- **[daveycodez](https://github.com/daveycodez)** — pacote de prompts em inglês e tokenização do inglês ([PR #6](https://github.com/Phant0Meow/dsh-meow-memory/pull/6), lançado na v0.22.0)
- **[chenmzh](https://github.com/chenmzh)** — injeção de memória como mensagem plugin snapshot independente, resolvendo a poluição do título da sessão ([PR #10](https://github.com/Phant0Meow/dsh-meow-memory/pull/10))
- **[cuddly-guacamole](https://github.com/cuddly-guacamole)** — compatibilidade de Session events entre as duas versões do dsh 0.1.2-alpha.4 ([PR #11](https://github.com/Phant0Meow/dsh-meow-memory/pull/11))
- **[coutogilson](https://github.com/coutogilson)** — pacote de prompts em português do Brasil (`src/prompts/pt-br/`) e a camada de texto de UI que segue o locale do DSH

## 📄 License

MIT —— ver [LICENSE](LICENSE).
