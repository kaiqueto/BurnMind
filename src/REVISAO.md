# Revisão do código — BurnoutMind (Angular)

## Corrigido
1. `main.ts` importava `./app/app.component`, que não existia (o arquivo era `app.ts` com o template de boas-vindas do Angular, sem `<router-outlet>`). Criado `AppComponent` (header + router-outlet + footer + link "Ir para o conteúdo").
2. 8 módulos importados por ~20 arquivos não existiam: `CardComponent`, `ChipComponent`, `DisclaimerComponent`, `LinkCardComponent`, `PageHeaderComponent`, `CheckInService`, `HomePageComponent` e `FooterComponent`. Criados seguindo o uso nos templates e nos specs existentes (ex.: `check-in.service.spec.ts`).
3. Removidos scaffolds vazios do `ng generate` ("… works!") e duplicados: `features/component/**`, `shared/components/{button,card}/*`, `layout/components/{app-shell,footer,header/header.ts,page-header}` e `app.spec.ts` antigo (esperava "Hello, BurnMind").
4. Páginas `/doencas`, `/chat` e `/resultados/assistencia-proxima` eram linkadas (menu e Resultados) mas caíam silenciosamente na Home pela rota `**`. Agora mostram "Em breve".
5. `styles.scss` não importava `bootstrap/scss/close`: o botão ✕ do modal (`.btn-close`) ficava sem aparência.
6. `index.html` com `lang="en"` num app em pt-BR (leitores de tela) → `pt-BR`.
7. Questionário: `control.reset(...)` emitia `valueChanges` e regravava no storage a resposta recém-lida → `emitEvent: false`.
8. Comentários obsoletos (welcome, routes).

## Pontos de atenção (não alterados)
- Não há `package.json`/`angular.json`/`tsconfig` no zip: não foi possível compilar nem rodar os testes. Só foi feita checagem estática (imports, exports, seletores, sintaxe). Rode `ng build` e `ng test`.
- `src/styles.css` (só `@import bootstrap`) convive com `styles/styles.scss`. Se o `angular.json` listar os dois, o Bootstrap carrega duas vezes; deixe apenas o `.scss`.
- `favicon.ico` referenciado no `index.html` não está no zip.
- Consentimento (LGPD): há `ConsentService.revoke()`, mas nenhuma tela o usa, e não há como apagar os dados locais (check-ins, respostas).
- `QuestionStepPage.next()` navega para `/resultados` mesmo se `complete()` retornar `null` (hoje o guard impede, mas é frágil).
- `crypto.randomUUID()` exige contexto seguro (HTTPS/localhost).
- Textos marcados [SUGESTÃO]/[PENDENTE] (níveis de atenção, perfis, dicas) precisam de revisão de conteúdo/profissional de saúde antes de produção.
- Sass `@import` está deprecado (funciona; migrar para `@use` no futuro).
