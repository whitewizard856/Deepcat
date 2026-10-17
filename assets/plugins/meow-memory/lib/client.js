window.__ModuleLoader__.load({
  id: "meow-memory",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.ts
var client_exports = {};
__export(client_exports, {
  MemoryFoldDock: () => MemoryFoldDock,
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");

// src/i18n/en.ts
var en = {
  // ── reflection / dream turn bars ──────────────────────────────────────────
  "fold.title.reflect": "Memory reflection",
  "fold.title.dream": "Memory dream task",
  "fold.status.running": "{title} in progress\u2026",
  "fold.hint.running": " (your message joins this turn)",
  "fold.status.interrupted": "{title} interrupted",
  "fold.status.remembered": "{title} \xB7 {n} memories added",
  "fold.status.updated": "{title} \xB7 {n} updated",
  "fold.status.nothing": "{title} \xB7 nothing to save",
  // ── memory injection bars ─────────────────────────────────────────────────
  "inject.bar": "Memory injected",
  "inject.kind.first": " (long-term)",
  "inject.kind.hit": " (keyword hits)",
  "inject.expand": "Click to expand",
  "inject.collapse": "Click to collapse",
  "inject.copy": "Copy",
  "inject.copied": "Copied",
  "inject.result": "[Result]",
  // ── delegate marker bubbles ───────────────────────────────────────────────
  "notice.reflect.running": "\u25B8 Memory reflection task in progress\u2026",
  "notice.reflect.done": "\u25B8 Memory reflection task completed.",
  "notice.dream.running": "\u25B8 Memory dream task in progress\u2026",
  "notice.dream.done": "\u25B8 Memory dream task completed.",
  "notice.dream.interrupted": "\u25B8 Memory dream task interrupted; retrying automatically later.",
  // ── session menu ──────────────────────────────────────────────────────────
  "menu.skipDream": "Skip dream memory consolidation",
  "menu.unskipDream": "Resume dream memory consolidation",
  // ── settings tab ──────────────────────────────────────────────────────────
  "settings.title": "Meow memory",
  "settings.summary": 'Every setting of the cross-session memory plugin. Changes are stored in DSH settings (per field; "Restore default" goes back to the plugin factory default and ignores the patch assembly baseline); they take effect after a hot reload or restart of the meow-memory plugin.',
  "settings.loading": "Loading meow-memory configuration\u2026",
  "settings.unavailable": "This connection does not support settings writes (only loopback connections can edit).",
  "settings.readonly": "This connection is read-only (settings writes are limited to loopback connections).",
  "settings.saved": "Saved \u2713 takes effect after a hot reload or restart of the meow-memory plugin",
  "settings.badge.override": "Overridden",
  "settings.badge.default": "Default",
  "settings.reset": "Restore default",
  "settings.saveFailed": "Save failed: {error}",
  "settings.saveNotApplied": "Save did not take effect: the server rejected the write (it may have failed validation). Showing the current server value again.",
  "settings.resetFailed": "Restore default failed: {error}",
  "settings.resetNotApplied": "Restore default did not take effect; please try again.",
  "settings.suppress.format": 'A window must look like "HH:MM-HH:MM"; got "{value}"',
  "settings.suppress.atLeastOne": "At least one window is required",
  "settings.group.base": "Basics",
  "settings.group.inject": "Injection and hits",
  "settings.group.reflect": "Reflection",
  "settings.group.delegate": "Consolidation task model",
  "settings.group.dream": "Idle consolidation (dream)",
  "settings.group.language": "Language",
  "settings.field.enabled.label": "Master switch",
  "settings.field.enabled.hint": "When off, injection, reflection and the memory tools are all disabled",
  "settings.field.projectDir.label": "Memory directory",
  "settings.field.projectDir.hint": "Data directory, relative to the workspace",
  "settings.field.autoMigrate.label": "Auto-migrate old database",
  "settings.field.autoMigrate.hint": "Migrate PROJECT.md automatically the first time a v1 database is opened",
  "settings.field.hitTopK.label": "Max hits per message",
  "settings.field.hitTopK.hint": "Upper bound on keyword-hit entries injected per message (fact/lesson/rules/topic)",
  "settings.field.titleMax.label": "Guide title truncation length",
  "settings.field.titleMax.hint": "Truncation length (characters) of the project list in the memory guide",
  "settings.field.reflect.label": "Automatic reflection",
  "settings.field.reflect.hint": "Review memory automatically after a task ends",
  "settings.field.reflectTurns.label": "Reflection trigger turns",
  "settings.field.reflectTurns.hint": "Consecutive tool steps inside one task needed to trigger at the end",
  "settings.field.delegateModel.label": "Reflection/dream model override",
  "settings.field.delegateModel.hint": "Empty = the main model throughout. When set, reflection and dream turns run on that model and switch back to the main model at the end of the turn (the rest of the conversation is unaffected); 'provider/model' selects the route, 'model' only changes the model name",
  "settings.field.delegateModel.placeholder": "e.g. zai-coding-cn/glm-5.3-flash",
  "settings.field.dreamEnabled.label": "Idle consolidation switch",
  "settings.field.dream.idleMinutes.label": "Idle minutes",
  "settings.field.dream.idleMinutes.hint": "A window idle for this many minutes allows a dream",
  "settings.field.dream.suppressWindows.label": "Peak-hour suppression windows",
  "settings.field.dream.suppressWindows.hint": 'Comma-separated "HH:MM-HH:MM"; no dream is triggered inside these windows',
  "settings.field.dream.suppressLeadMinutes.label": "Extra suppression before peak (minutes)",
  "settings.field.dream.checkMinutes.label": "Check interval (minutes)",
  "settings.field.dream.timeZone.label": "Timezone for suppression windows",
  "settings.field.dream.timeZone.hint": "Peak windows are computed in this fixed timezone (independent of the system clock)",
  "settings.field.dream.rulesReviewDays.label": "Rules anti-churn days",
  "settings.field.dream.rulesReviewDays.hint": "Stable rules whose updated_at is older than this many days skip dream round 1; 0 = no filter",
  "settings.field.promptLang.label": "Prompt and retrieval language",
  "settings.field.promptLang.hint": "Empty = zh by default (sessions that never configured it get a one-time first-run guide); 'en' = built-in English pack. The UI language is unrelated \u2014 that follows the DSH language setting. The language must match the one you speak, or keyword hit rates drop",
  "settings.field.promptLang.placeholder": "zh / en",
  // ── date and time ─────────────────────────────────────────────────────────
  "datetime.ymd": "{m}/{d}",
  "datetime.ymdFull": "{y}/{m}/{d}"
};

// src/i18n/zh.ts
var zh = {
  // ── 反思 / dream 轮横条 ────────────────────────────────────────────────────
  "fold.title.reflect": "\u8BB0\u5FC6\u53CD\u601D",
  "fold.title.dream": "\u8BB0\u5FC6\u68A6\u5883\u4EFB\u52A1",
  "fold.status.running": "{title}\u8FDB\u884C\u4E2D\u2026",
  "fold.hint.running": "\uFF08\u63D2\u8BDD\u4F1A\u62FC\u8FDB\u672C\u8F6E\uFF09",
  "fold.status.interrupted": "{title}\u5DF2\u4E2D\u65AD",
  "fold.status.remembered": "{title} \xB7 \u65B0\u589E\u8BB0\u5FC6 {n} \u6761",
  "fold.status.updated": "{title} \xB7 \u5DF2\u66F4\u65B0 {n} \u6761",
  "fold.status.nothing": "{title} \xB7 \u65E0\u9700\u8BB0\u5FC6",
  // ── 记忆注入横条 ──────────────────────────────────────────────────────────
  "inject.bar": "\u5DF2\u6CE8\u5165\u8BB0\u5FC6",
  "inject.kind.first": "\uFF08\u957F\u671F\u8BB0\u5FC6\uFF09",
  "inject.kind.hit": "\uFF08\u5173\u952E\u8BCD\u547D\u4E2D\uFF09",
  "inject.expand": "\u70B9\u51FB\u5C55\u5F00",
  "inject.collapse": "\u70B9\u51FB\u6536\u8D77",
  "inject.copy": "\u590D\u5236",
  "inject.copied": "\u5DF2\u590D\u5236",
  "inject.result": "\u3010\u7ED3\u679C\u3011",
  // ── delegate 打点气泡 ─────────────────────────────────────────────────────
  "notice.reflect.running": "\u25B8 \u8BB0\u5FC6\u53CD\u601D\u4EFB\u52A1\u8FDB\u884C\u4E2D\u2026\u2026",
  "notice.reflect.done": "\u25B8 \u8BB0\u5FC6\u53CD\u601D\u4EFB\u52A1\u5DF2\u5B8C\u6210\u3002",
  "notice.dream.running": "\u25B8 \u68A6\u5883\u8BB0\u5FC6\u6574\u7406\u4EFB\u52A1\u8FDB\u884C\u4E2D\u2026\u2026",
  "notice.dream.done": "\u25B8 \u68A6\u5883\u8BB0\u5FC6\u6574\u7406\u4EFB\u52A1\u5DF2\u5B8C\u6210\u3002",
  "notice.dream.interrupted": "\u25B8 \u68A6\u5883\u8BB0\u5FC6\u6574\u7406\u5DF2\u4E2D\u65AD\uFF0C\u7A0D\u540E\u81EA\u52A8\u91CD\u8BD5\u3002",
  // ── 会话菜单 ──────────────────────────────────────────────────────────────
  "menu.skipDream": "\u8DF3\u8FC7\u68A6\u5883\u6574\u7406\u8BB0\u5FC6",
  "menu.unskipDream": "\u53D6\u6D88\u8DF3\u8FC7\u68A6\u5883\u6574\u7406\u8BB0\u5FC6",
  // ── 设置页 ────────────────────────────────────────────────────────────────
  "settings.title": "\u55B5\u8BB0\u5FC6",
  "settings.summary": "\u8DE8\u4F1A\u8BDD\u8BB0\u5FC6\u63D2\u4EF6\u7684\u5168\u90E8\u8BBE\u7F6E\u3002\u6539\u52A8\u4FDD\u5B58\u5728 DSH \u8BBE\u7F6E\u91CC\uFF08\u5B57\u6BB5\u7EA7\uFF0C\u300C\u6062\u590D\u9ED8\u8BA4\u300D= \u56DE\u5230\u63D2\u4EF6\u51FA\u5382\u9ED8\u8BA4\uFF0C\u4E0D\u53D7 patch \u88C5\u914D\u57FA\u7EBF\u5F71\u54CD\uFF09\uFF1B\u751F\u6548\u9700\u8981\u70ED\u91CD\u8F7D/\u91CD\u542F meow-memory \u63D2\u4EF6\u3002",
  "settings.loading": "\u55B5\u8BB0\u5FC6\u914D\u7F6E\u52A0\u8F7D\u4E2D\u2026",
  "settings.unavailable": "\u5F53\u524D\u8FDE\u63A5\u4E0D\u652F\u6301\u8BBE\u7F6E\u5199\u5165\uFF08\u4EC5\u672C\u673A\u56DE\u73AF\u8FDE\u63A5\u53EF\u7F16\u8F91\uFF09\u3002",
  "settings.readonly": "\u5F53\u524D\u8FDE\u63A5\u4E3A\u53EA\u8BFB\uFF08\u8BBE\u7F6E\u5199\u5165\u4EC5\u9650\u672C\u673A\u56DE\u73AF\u8FDE\u63A5\uFF09\u3002",
  "settings.saved": "\u5DF2\u4FDD\u5B58 \u2713 \u70ED\u91CD\u8F7D/\u91CD\u542F meow-memory \u63D2\u4EF6\u540E\u751F\u6548",
  "settings.badge.override": "\u5DF2\u8986\u76D6",
  "settings.badge.default": "\u9ED8\u8BA4",
  "settings.reset": "\u6062\u590D\u9ED8\u8BA4",
  "settings.saveFailed": "\u4FDD\u5B58\u5931\u8D25\uFF1A{error}",
  "settings.saveNotApplied": "\u4FDD\u5B58\u672A\u751F\u6548\uFF1A\u5199\u5165\u88AB\u670D\u52A1\u5668\u62D2\u7EDD\uFF08\u53EF\u80FD\u672A\u901A\u8FC7\u6821\u9A8C\uFF09\uFF0C\u5DF2\u6062\u590D\u663E\u793A\u670D\u52A1\u5668\u5F53\u524D\u503C\u3002",
  "settings.resetFailed": "\u6062\u590D\u9ED8\u8BA4\u5931\u8D25\uFF1A{error}",
  "settings.resetNotApplied": "\u6062\u590D\u9ED8\u8BA4\u672A\u751F\u6548\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  "settings.suppress.format": '\u65F6\u6BB5\u683C\u5F0F\u5E94\u4E3A "HH:MM-HH:MM"\uFF0C\u6536\u5230 "{value}"',
  "settings.suppress.atLeastOne": "\u81F3\u5C11\u4E00\u4E2A\u65F6\u6BB5",
  "settings.group.base": "\u57FA\u7840",
  "settings.group.inject": "\u6CE8\u5165\u4E0E\u547D\u4E2D",
  "settings.group.reflect": "\u53CD\u601D",
  "settings.group.delegate": "\u6574\u7406\u4EFB\u52A1\u6A21\u578B",
  "settings.group.dream": "\u7A7A\u95F2\u6574\u7406\uFF08dream\uFF09",
  "settings.group.language": "\u8BED\u8A00",
  "settings.field.enabled.label": "\u603B\u5F00\u5173",
  "settings.field.enabled.hint": "\u5173\u95ED\u540E\u6CE8\u5165\u3001\u53CD\u601D\u3001\u8BB0\u5FC6\u5DE5\u5177\u5168\u90E8\u505C\u7528",
  "settings.field.projectDir.label": "\u8BB0\u5FC6\u76EE\u5F55",
  "settings.field.projectDir.hint": "\u76F8\u5BF9\u5DE5\u4F5C\u533A\u7684\u6570\u636E\u76EE\u5F55",
  "settings.field.autoMigrate.label": "\u81EA\u52A8\u8FC1\u79FB\u65E7\u5E93",
  "settings.field.autoMigrate.hint": "\u9996\u6B21\u6253\u5F00 v1 \u5E93\u65F6\u81EA\u52A8\u8FC1\u79FB PROJECT.md",
  "settings.field.hitTopK.label": "\u6BCF\u6761\u6D88\u606F\u547D\u4E2D\u6761\u6570\u4E0A\u9650",
  "settings.field.hitTopK.hint": "\u5173\u952E\u8BCD\u547D\u4E2D\u6CE8\u5165\u7684\u6761\u76EE\u4E0A\u9650\uFF08fact/lesson/rules/topic\uFF09",
  "settings.field.titleMax.label": "\u5BFC\u5F15\u6807\u9898\u622A\u65AD\u957F\u5EA6",
  "settings.field.titleMax.hint": "\u8BB0\u5FC6\u5BFC\u5F15\u91CC\u9879\u76EE\u5217\u8868\u7684\u622A\u65AD\u957F\u5EA6\uFF08\u5B57\u7B26\uFF09",
  "settings.field.reflect.label": "\u81EA\u52A8\u53CD\u601D",
  "settings.field.reflect.hint": "\u4EFB\u52A1\u7ED3\u675F\u540E\u81EA\u52A8\u56DE\u987E\u8BB0\u5FC6",
  "settings.field.reflectTurns.label": "\u53CD\u601D\u89E6\u53D1\u8F6E\u6570",
  "settings.field.reflectTurns.hint": "\u5355\u4EFB\u52A1\u5185\u8FDE\u7EED\u5DE5\u5177\u6B65\u8FBE\u5230\u8BE5\u503C\u624D\u5728\u7ED3\u675F\u65F6\u89E6\u53D1",
  "settings.field.delegateModel.label": "\u53CD\u601D/\u68A6\u5883\u6362\u6A21\u578B",
  "settings.field.delegateModel.hint": "\u7559\u7A7A=\u5168\u7A0B\u4E3B\u6A21\u578B\u3002\u586B\u5199\u540E\u53CD\u601D\u8F6E\u4E0E\u68A6\u5883\u8F6E\u81EA\u52A8\u6362\u7528\u8BE5\u6A21\u578B\u6267\u884C\uFF0C\u8F6E\u6B21\u7ED3\u675F\u81EA\u52A8\u6362\u56DE\u4E3B\u6A21\u578B\uFF08\u5176\u4F59\u5BF9\u8BDD\u4E0D\u53D7\u5F71\u54CD\uFF09\uFF1B'provider/model' \u6307\u5B9A\u8DEF\u7531\uFF0C'model' \u53EA\u6362\u6A21\u578B\u540D",
  "settings.field.delegateModel.placeholder": "\u5982 zai-coding-cn/glm-5.3-flash",
  "settings.field.dreamEnabled.label": "\u7A7A\u95F2\u6574\u7406\u5F00\u5173",
  "settings.field.dream.idleMinutes.label": "\u7A7A\u95F2\u5206\u949F\u6570",
  "settings.field.dream.idleMinutes.hint": "\u7A97\u53E3\u7A7A\u95F2\u6EE1\u8BE5\u5206\u949F\u6570\u5373\u5141\u8BB8 dream",
  "settings.field.dream.suppressWindows.label": "\u5CF0\u65F6\u6291\u5236\u65F6\u6BB5",
  "settings.field.dream.suppressWindows.hint": '"HH:MM-HH:MM" \u9017\u53F7\u5206\u9694\uFF1B\u8FD9\u4E9B\u65F6\u6BB5\u5185\u4E0D\u89E6\u53D1 dream',
  "settings.field.dream.suppressLeadMinutes.label": "\u5CF0\u65F6\u524D\u8FFD\u52A0\u6291\u5236\uFF08\u5206\u949F\uFF09",
  "settings.field.dream.checkMinutes.label": "\u68C0\u67E5\u5468\u671F\uFF08\u5206\u949F\uFF09",
  "settings.field.dream.timeZone.label": "\u6291\u5236\u65F6\u6BB5\u65F6\u533A",
  "settings.field.dream.timeZone.hint": "\u5CF0\u65F6\u7A97\u53E3\u6309\u6B64\u56FA\u5B9A\u65F6\u533A\u8BA1\u7B97\uFF08\u4E0E\u7CFB\u7EDF\u65F6\u949F\u65E0\u5173\uFF09",
  "settings.field.dream.rulesReviewDays.label": "\u51C6\u5219\u9632 churn \u5929\u6570",
  "settings.field.dream.rulesReviewDays.hint": "updated_at \u8DDD\u4ECA\u8D85\u8BE5\u5929\u6570\u7684\u7A33\u5B9A\u51C6\u5219\u4E0D\u8FDB dream \u7B2C 1 \u8F6E\uFF1B0=\u4E0D\u8FC7\u6EE4",
  "settings.field.promptLang.label": "prompt \u4E0E\u68C0\u7D22\u8BED\u8A00",
  "settings.field.promptLang.hint": "\u7559\u7A7A=\u9ED8\u8BA4 zh\uFF08\u672A\u914D\u7F6E\u8FC7\u7684\u4F1A\u8BDD\u4F1A\u6536\u5230\u4E00\u6B21\u9996\u7528\u5F15\u5BFC\uFF09\uFF1B'en'=\u5185\u7F6E\u82F1\u6587\u8BED\u8A00\u5305\u3002\u754C\u9762\u8BED\u8A00\u4E0E\u5B83\u65E0\u5173\u2014\u2014\u90A3\u7531 DSH \u7684\u8BED\u8A00\u8BBE\u7F6E\u51B3\u5B9A\u3002\u8BED\u8A00\u5FC5\u987B\u4E0E\u4F60\u8BF4\u7684\u8BDD\u4E00\u81F4\uFF0C\u5426\u5219\u5173\u952E\u8BCD\u547D\u4E2D\u7387\u4E0B\u964D",
  "settings.field.promptLang.placeholder": "zh / en",
  // ── 日期时间 ──────────────────────────────────────────────────────────────
  "datetime.ymd": "{m}\u6708{d}\u65E5",
  "datetime.ymdFull": "{y}\u5E74{m}\u6708{d}\u65E5"
};

// src/i18n/pt-br.ts
var ptBr = {
  // ── barras das rodadas de reflection / dream ──────────────────────────────
  "fold.title.reflect": "Reflex\xE3o de mem\xF3ria",
  "fold.title.dream": "Consolida\xE7\xE3o ociosa de mem\xF3ria (dream)",
  "fold.status.running": "{title} em andamento\u2026",
  "fold.hint.running": " (mensagem entra nesta rodada)",
  "fold.status.interrupted": "{title} interrompida",
  "fold.status.remembered": "{title} \xB7 {n} mem\xF3rias adicionadas",
  "fold.status.updated": "{title} \xB7 {n} atualizadas",
  "fold.status.nothing": "{title} \xB7 nada a guardar",
  // ── barras de injeção de memória ──────────────────────────────────────────
  "inject.bar": "Mem\xF3ria injetada",
  "inject.kind.first": " (longo prazo)",
  "inject.kind.hit": " (acertos por palavra-chave)",
  "inject.expand": "Clique para expandir",
  "inject.collapse": "Clique para recolher",
  "inject.copy": "Copiar",
  "inject.copied": "Copiado",
  "inject.result": "[Resultado]",
  // ── bolhas de marcação do delegate ────────────────────────────────────────
  "notice.reflect.running": "\u25B8 Tarefa de reflex\xE3o de mem\xF3ria em andamento\u2026",
  "notice.reflect.done": "\u25B8 Tarefa de reflex\xE3o de mem\xF3ria conclu\xEDda.",
  "notice.dream.running": "\u25B8 Tarefa de consolida\xE7\xE3o ociosa de mem\xF3ria em andamento\u2026",
  "notice.dream.done": "\u25B8 Tarefa de consolida\xE7\xE3o ociosa de mem\xF3ria conclu\xEDda.",
  "notice.dream.interrupted": "\u25B8 Tarefa de consolida\xE7\xE3o ociosa de mem\xF3ria interrompida; nova tentativa autom\xE1tica em breve.",
  // ── menu da sessão ────────────────────────────────────────────────────────
  "menu.skipDream": "Pular a consolida\xE7\xE3o de mem\xF3ria (dream)",
  "menu.unskipDream": "Voltar a fazer a consolida\xE7\xE3o de mem\xF3ria (dream)",
  // ── aba de configurações ──────────────────────────────────────────────────
  "settings.title": "Meow memory",
  "settings.summary": 'Todas as configura\xE7\xF5es do plugin de mem\xF3ria entre sess\xF5es. As mudan\xE7as ficam nas configura\xE7\xF5es do DSH (campo a campo; "Restaurar padr\xE3o" volta ao padr\xE3o de f\xE1brica do plugin e ignora a base do patch); para valer, \xE9 preciso recarregar a quente ou reiniciar o plugin meow-memory.',
  "settings.loading": "Carregando a configura\xE7\xE3o do meow-memory\u2026",
  "settings.unavailable": "Esta conex\xE3o n\xE3o permite gravar configura\xE7\xF5es (s\xF3 conex\xF5es locais de loopback podem editar).",
  "settings.readonly": "Esta conex\xE3o \xE9 somente leitura (gravar configura\xE7\xF5es \xE9 limitado a conex\xF5es locais de loopback).",
  "settings.saved": "Salvo \u2713 passa a valer ap\xF3s recarregar a quente ou reiniciar o plugin meow-memory",
  "settings.badge.override": "Alterado",
  "settings.badge.default": "Padr\xE3o",
  "settings.reset": "Restaurar padr\xE3o",
  "settings.saveFailed": "Falha ao salvar: {error}",
  "settings.saveNotApplied": "A grava\xE7\xE3o n\xE3o teve efeito: o servidor recusou a escrita (talvez n\xE3o tenha passado na valida\xE7\xE3o). Exibindo de novo o valor atual do servidor.",
  "settings.resetFailed": "Falha ao restaurar o padr\xE3o: {error}",
  "settings.resetNotApplied": "Restaurar o padr\xE3o n\xE3o teve efeito; tente de novo.",
  "settings.suppress.format": 'O intervalo deve ter o formato "HH:MM-HH:MM"; recebido "{value}"',
  "settings.suppress.atLeastOne": "\xC9 necess\xE1rio pelo menos um intervalo",
  "settings.group.base": "B\xE1sico",
  "settings.group.inject": "Inje\xE7\xE3o e acertos",
  "settings.group.reflect": "Reflex\xE3o",
  "settings.group.delegate": "Modelo das tarefas de consolida\xE7\xE3o",
  "settings.group.dream": "Consolida\xE7\xE3o ociosa (dream)",
  "settings.group.language": "Idioma",
  "settings.field.enabled.label": "Chave geral",
  "settings.field.enabled.hint": "Desligado, a inje\xE7\xE3o, a reflex\xE3o e as ferramentas de mem\xF3ria ficam todas inativas",
  "settings.field.projectDir.label": "Diret\xF3rio de mem\xF3ria",
  "settings.field.projectDir.hint": "Diret\xF3rio de dados, relativo ao workspace",
  "settings.field.autoMigrate.label": "Migrar banco antigo automaticamente",
  "settings.field.autoMigrate.hint": "Migra o PROJECT.md automaticamente na primeira vez que um banco v1 \xE9 aberto",
  "settings.field.hitTopK.label": "M\xE1ximo de acertos por mensagem",
  "settings.field.hitTopK.hint": "Limite de entradas por acerto de palavra-chave injetadas a cada mensagem (fact/lesson/rules/topic)",
  "settings.field.titleMax.label": "Comprimento de corte do t\xEDtulo",
  "settings.field.titleMax.hint": "Comprimento (em caracteres) do corte da lista de projetos no guia de mem\xF3ria",
  "settings.field.reflect.label": "Reflex\xE3o autom\xE1tica",
  "settings.field.reflect.hint": "Revisa a mem\xF3ria automaticamente quando a tarefa termina",
  "settings.field.reflectTurns.label": "Rodadas para disparar a reflex\xE3o",
  "settings.field.reflectTurns.hint": "Passos de ferramenta seguidos dentro de uma tarefa para disparar no fim",
  "settings.field.delegateModel.label": "Trocar o modelo de reflex\xE3o/consolida\xE7\xE3o ociosa",
  "settings.field.delegateModel.hint": "Vazio = modelo principal do come\xE7o ao fim. Preenchido, as rodadas de reflex\xE3o e de consolida\xE7\xE3o ociosa passam a usar esse modelo e voltam ao principal no fim da rodada (o resto da conversa n\xE3o muda); 'provider/model' escolhe a rota, 'model' troca s\xF3 o nome do modelo",
  "settings.field.delegateModel.placeholder": "ex.: zai-coding-cn/glm-5.3-flash",
  "settings.field.dreamEnabled.label": "Ligar a consolida\xE7\xE3o ociosa",
  "settings.field.dream.idleMinutes.label": "Minutos de ociosidade",
  "settings.field.dream.idleMinutes.hint": "Uma janela ociosa por esses minutos j\xE1 permite um dream",
  "settings.field.dream.suppressWindows.label": "Janelas de supress\xE3o em hor\xE1rio de pico",
  "settings.field.dream.suppressWindows.hint": '"HH:MM-HH:MM" separados por v\xEDrgula; dentro dessas janelas nenhum dream \xE9 disparado',
  "settings.field.dream.suppressLeadMinutes.label": "Supress\xE3o extra antes do pico (minutos)",
  "settings.field.dream.checkMinutes.label": "Intervalo de verifica\xE7\xE3o (minutos)",
  "settings.field.dream.timeZone.label": "Fuso das janelas de supress\xE3o",
  "settings.field.dream.timeZone.hint": "As janelas de pico s\xE3o calculadas neste fuso fixo (independente do rel\xF3gio do sistema)",
  "settings.field.dream.rulesReviewDays.label": "Dias anti-churn das regras",
  "settings.field.dream.rulesReviewDays.hint": "Regras est\xE1veis com updated_at mais antigo que esses dias ficam fora da 1\xAA rodada do dream; 0 = sem filtro",
  "settings.field.promptLang.label": "Idioma dos prompts e da busca",
  "settings.field.promptLang.hint": "Vazio = zh por padr\xE3o (sess\xF5es que nunca configuraram recebem um guia de primeira vez); 'en' = pacote ingl\xEAs embutido. O idioma da interface n\xE3o tem rela\xE7\xE3o \u2014 ele segue a configura\xE7\xE3o de idioma do DSH. O idioma precisa ser o mesmo em que voc\xEA fala, sen\xE3o a taxa de acerto das palavras-chave cai",
  "settings.field.promptLang.placeholder": "zh / en",
  // ── data e hora ───────────────────────────────────────────────────────────
  "datetime.ymd": "{d}/{m}",
  "datetime.ymdFull": "{d}/{m}/{y}"
};

// src/i18n/core.ts
var NS = "meow-memory";
var SUPPORTED_UI_LOCALES = [
  { id: "zh", label: "\u4E2D\u6587" },
  { id: "en", label: "English" },
  { id: "pt-br", label: "Portugu\xEAs (Brasil)" }
];
var DICTS = {
  en,
  zh,
  "pt-br": ptBr
};
var FALLBACK_CHAIN = {
  zh: ["zh", "en"],
  en: ["en"],
  "pt-br": ["pt-br", "en"]
};
var DEFAULT_LOCALE = "zh";
var service = null;
var active = DEFAULT_LOCALE;
var registeredLocales = /* @__PURE__ */ new Set();
var registeredDicts = /* @__PURE__ */ new Set();
var listeners = /* @__PURE__ */ new Set();
function normalize(tag) {
  return tag.trim().toLowerCase().replace(/_/g, "-");
}
function primary(tag) {
  return normalize(tag).split("-")[0];
}
function match(tag) {
  const wanted = normalize(tag);
  const exact = SUPPORTED_UI_LOCALES.find((l) => normalize(l.id) === wanted);
  if (exact !== void 0) return exact.id;
  const byPrimary = SUPPORTED_UI_LOCALES.find((l) => primary(l.id) === primary(wanted));
  return byPrimary !== void 0 ? byPrimary.id : null;
}
function browserLocale() {
  if (typeof navigator === "undefined") return null;
  const listed = [];
  if (Array.isArray(navigator.languages)) {
    for (const tag of navigator.languages) if (typeof tag === "string") listed.push(tag);
  }
  if (typeof navigator.language === "string") listed.push(navigator.language);
  for (const tag of listed) {
    const hit = match(tag);
    if (hit !== null) return hit;
  }
  return null;
}
function staticTranslate(locale, key, params) {
  const chain = FALLBACK_CHAIN[locale] ?? [locale, "en"];
  let template;
  for (const lang of chain) {
    const hit = DICTS[lang]?.[key];
    if (hit !== void 0) {
      template = hit;
      break;
    }
  }
  if (template === void 0) template = DICTS.en[key] ?? key;
  return fill(template, params);
}
function fill(template, params) {
  if (params === void 0) return template;
  let out = template;
  for (const [name, value] of Object.entries(params)) {
    out = out.replaceAll(`{${name}}`, () => String(value));
  }
  return out;
}
function installI18n(ctx, warn = (m) => console.warn(m)) {
  const svc = typeof ctx?.get === "function" ? ctx.get("locale") : null;
  if (svc === null || svc === void 0 || typeof svc.getLocale !== "function" || typeof svc.register !== "function") {
    service = null;
    active = browserLocale() ?? DEFAULT_LOCALE;
    notify();
    return [];
  }
  service = svc;
  const done = [];
  for (const locale of SUPPORTED_UI_LOCALES) {
    if (registeredLocales.has(locale.id)) {
      done.push(locale.id);
      continue;
    }
    try {
      if (locale.id === "zh" || locale.id === "en") {
        registeredLocales.add(locale.id);
        done.push(locale.id);
        continue;
      }
      if (typeof svc.addLanguage !== "function") continue;
      svc.addLanguage({ id: locale.id, label: locale.label, fallback: "en" });
      registeredLocales.add(locale.id);
      done.push(locale.id);
    } catch (error) {
      warn(`[meow-memory] \u8BED\u8A00 "${locale.id}" \u6CE8\u518C\u5931\u8D25\uFF08UI \u9000\u56DE\u82F1\u6587/\u4E2D\u6587\uFF09\uFF1A${String(error)}`);
    }
  }
  for (const locale of SUPPORTED_UI_LOCALES) {
    const dict = DICTS[locale.id];
    if (dict === void 0 || registeredDicts.has(locale.id)) continue;
    try {
      svc.register(NS, locale.id, { ...dict });
      registeredDicts.add(locale.id);
    } catch (error) {
      warn(`[meow-memory] \u754C\u9762\u5B57\u5178 "${locale.id}" \u6CE8\u518C\u5931\u8D25\uFF08\u8BE5\u8BED\u8A00\u9000\u56DE\u82F1\u6587\uFF09\uFF1A${String(error)}`);
    }
  }
  active = readServiceLocale();
  try {
    svc.subscribe(() => {
      const next = readServiceLocale();
      if (next === active) return;
      active = next;
      notify();
    });
  } catch (error) {
    warn(`[meow-memory] \u8BED\u8A00\u53D8\u5316\u8BA2\u9605\u5931\u8D25\uFF08\u6587\u6848\u5728\u5207\u6362\u8BED\u8A00\u524D\u4FDD\u6301\u5F53\u524D\u8BED\u8A00\uFF09\uFF1A${String(error)}`);
  }
  notify();
  return done;
}
function readServiceLocale() {
  try {
    const snapshot = service?.getLocale();
    const id = snapshot?.active;
    if (typeof id !== "string" || id === "") return DEFAULT_LOCALE;
    return match(id) ?? primary(id);
  } catch {
    return DEFAULT_LOCALE;
  }
}
function notify() {
  for (const fn of [...listeners]) {
    try {
      fn(active);
    } catch (error) {
      console.error("[meow-memory] UI \u8BED\u8A00\u8BA2\u9605\u8005\u5F02\u5E38\uFF1A", error);
    }
  }
}
function getUiLocale() {
  return active;
}
function onUiLocaleChange(fn) {
  listeners.add(fn);
  try {
    fn(active);
  } catch (error) {
    console.error("[meow-memory] UI \u8BED\u8A00\u8BA2\u9605\u8005\u5F02\u5E38\uFF1A", error);
  }
  return () => {
    listeners.delete(fn);
  };
}
var t = (key, params) => {
  if (service !== null) {
    try {
      const translate = service.bind(NS);
      const out = translate(key, params);
      if (out !== key) return out;
    } catch {
    }
  }
  return staticTranslate(active, key, params);
};

// src/i18n/keys.ts
var UI_KEYS = [
  // reflection / dream turn bars
  "fold.title.reflect",
  "fold.title.dream",
  "fold.status.running",
  "fold.hint.running",
  "fold.status.interrupted",
  "fold.status.remembered",
  "fold.status.updated",
  "fold.status.nothing",
  // memory injection bars
  "inject.bar",
  "inject.kind.first",
  "inject.kind.hit",
  "inject.expand",
  "inject.collapse",
  "inject.copy",
  "inject.copied",
  "inject.result",
  // delegate marker bubbles
  "notice.reflect.running",
  "notice.reflect.done",
  "notice.dream.running",
  "notice.dream.done",
  "notice.dream.interrupted",
  // session menu
  "menu.skipDream",
  "menu.unskipDream",
  // settings tab
  "settings.title",
  "settings.summary",
  "settings.loading",
  "settings.unavailable",
  "settings.readonly",
  "settings.saved",
  "settings.badge.override",
  "settings.badge.default",
  "settings.reset",
  "settings.saveFailed",
  "settings.saveNotApplied",
  "settings.resetFailed",
  "settings.resetNotApplied",
  "settings.suppress.format",
  "settings.suppress.atLeastOne",
  "settings.group.base",
  "settings.group.inject",
  "settings.group.reflect",
  "settings.group.delegate",
  "settings.group.dream",
  "settings.group.language",
  "settings.field.enabled.label",
  "settings.field.enabled.hint",
  "settings.field.projectDir.label",
  "settings.field.projectDir.hint",
  "settings.field.autoMigrate.label",
  "settings.field.autoMigrate.hint",
  "settings.field.hitTopK.label",
  "settings.field.hitTopK.hint",
  "settings.field.titleMax.label",
  "settings.field.titleMax.hint",
  "settings.field.reflect.label",
  "settings.field.reflect.hint",
  "settings.field.reflectTurns.label",
  "settings.field.reflectTurns.hint",
  "settings.field.delegateModel.label",
  "settings.field.delegateModel.hint",
  "settings.field.delegateModel.placeholder",
  "settings.field.dreamEnabled.label",
  "settings.field.dream.idleMinutes.label",
  "settings.field.dream.idleMinutes.hint",
  "settings.field.dream.suppressWindows.label",
  "settings.field.dream.suppressWindows.hint",
  "settings.field.dream.suppressLeadMinutes.label",
  "settings.field.dream.checkMinutes.label",
  "settings.field.dream.timeZone.label",
  "settings.field.dream.timeZone.hint",
  "settings.field.dream.rulesReviewDays.label",
  "settings.field.dream.rulesReviewDays.hint",
  "settings.field.promptLang.label",
  "settings.field.promptLang.hint",
  "settings.field.promptLang.placeholder",
  // date and time
  "datetime.ymd",
  "datetime.ymdFull"
];

// src/client-fold.ts
var REFLECT_MARKER = "[meow-memory-reflect]";
var DREAM_MARKER = "[meow-memory-dream]";
var PLUGIN_NAME = "meow-memory";
var META_SECTION_NAME = "__meta__";
function extractMetaFromSections(sections) {
  if (!Array.isArray(sections)) return void 0;
  const raw = sections.find((s) => s?.name === META_SECTION_NAME)?.text;
  if (raw === void 0) return void 0;
  try {
    return JSON.parse(raw);
  } catch {
    return void 0;
  }
}
function turnOf(node) {
  const location = node.location;
  if (location?.kind === "turn") return location.turn?.turn;
  if (location?.kind === "step") return location.turn?.turn;
  return void 0;
}
function contextText(node) {
  return blocksToText(node.data.content ?? []);
}
function isMemoryPrompt(node) {
  if (node.kind !== "context") return false;
  const source = node.data.source;
  if (source?.kind !== "plugin" || source.plugin !== PLUGIN_NAME) return false;
  const text = contextText(node);
  return text.includes(REFLECT_MARKER) || text.includes(DREAM_MARKER);
}
function variantOf(node) {
  const text = contextText(node);
  return text.includes(DREAM_MARKER) ? "dream" : "reflect";
}
function toolNameOf(node) {
  if (node.kind !== "tool-call") return void 0;
  const root = node.data.root;
  if (root === void 0) return void 0;
  if ("name" in root) return root.name;
  return root.call?.name;
}
function computeFoldGroups(snapshot) {
  if (snapshot?.chat === void 0) return [];
  const order = snapshot.chat.order;
  const nodes = snapshot.chat.nodes;
  const anchors = /* @__PURE__ */ new Map();
  for (const key of order) {
    const node = nodes.get(key);
    if (node === void 0 || !isMemoryPrompt(node)) continue;
    const turn = turnOf(node);
    if (turn === void 0) continue;
    const variant = variantOf(node);
    const mapKey = `${turn}:${variant}`;
    if (anchors.has(mapKey)) continue;
    anchors.set(mapKey, { key, turn, variant });
  }
  const groups = [];
  for (const anchor of anchors.values()) {
    const turnKeys = snapshot.chat.locations.getTurn(anchor.turn);
    const startIdx = turnKeys.indexOf(anchor.key);
    const ownsTurn = startIdx === 0;
    const keys = turnKeys.slice(startIdx === -1 ? 0 : startIdx).filter((k) => {
      const n = nodes.get(k);
      return n !== void 0 && n.kind !== "user" && n.kind !== "steering" && (n.kind !== "turn-tail" || ownsTurn);
    });
    let rememberCount = 0;
    let updateCount = 0;
    let status = "done";
    for (const k of keys) {
      const n = nodes.get(k);
      if (n === void 0) continue;
      const name = toolNameOf(n);
      if (name === "memory_remember") rememberCount++;
      else if (name === "memory_update") updateCount++;
      if (n.kind === "assistant") {
        const data = n.data;
        if (data.status === "running") status = "running";
        else if (data.status === "interrupted" && status !== "running") status = "interrupted";
      }
    }
    groups.push({ id: anchor.key, variant: anchor.variant, keys, rememberCount, updateCount, status });
  }
  return groups;
}
function memoryTurnNumbers(snapshot) {
  const out = /* @__PURE__ */ new Set();
  if (snapshot?.chat === void 0) return out;
  for (const key of snapshot.chat.order) {
    const node = snapshot.chat.nodes.get(key);
    if (node === void 0 || !isMemoryPrompt(node)) continue;
    const turn = turnOf(node);
    if (turn !== void 0) out.add(turn);
  }
  return out;
}
function foldLabel(group, expanded) {
  const arrow = expanded ? "\u25BE" : "\u25B8";
  const title = t(group.variant === "dream" ? "fold.title.dream" : "fold.title.reflect");
  if (group.status === "running") {
    const hint = group.variant === "dream" ? t("fold.hint.running") : "";
    return `${arrow} ${t("fold.status.running", { title })}${hint}`;
  }
  if (group.status === "interrupted") return `${arrow} ${t("fold.status.interrupted", { title })}`;
  if (group.rememberCount > 0) return `${arrow} ${t("fold.status.remembered", { title, n: group.rememberCount })}`;
  if (group.updateCount > 0) return `${arrow} ${t("fold.status.updated", { title, n: group.updateCount })}`;
  return `${arrow} ${t("fold.status.nothing", { title })}`;
}
function toolCallDetail(block) {
  let args = block.argsRaw;
  try {
    args = JSON.stringify(JSON.parse(block.argsRaw), null, 2);
  } catch {
  }
  return args.length > 0 ? `${block.name}
${args}` : block.name;
}
function blocksToText(blocks) {
  return blocks.map((block) => block.text ?? "").join("\n").trim();
}
var FIRST_INJECTION_MARKER = "===== \u957F\u671F\u8BB0\u5FC6 =====";
var HIT_INJECTION_MARKER = "\u53EF\u80FD\u76F8\u5173\u7684\u8BB0\u5FC6\uFF0C\u4EC5\u4F9B\u53C2\u8003\uFF1A";
var PROMPT_SEPARATOR = "\u672C\u8F6E\u7528\u6237prompt\uFF1A";
var EN_PROMPT_SEPARATOR = "This turn's user prompt:";
function computeInjectionGroups(snapshot) {
  if (snapshot?.chat === void 0) return [];
  const groups = [];
  for (const key of snapshot.chat.order) {
    const node = snapshot.chat.nodes.get(key);
    if (node === void 0) continue;
    if (node.kind === "context") {
      const ctx = node.data;
      const source = ctx.source;
      if (source?.kind !== "plugin" || source.plugin !== PLUGIN_NAME) continue;
      const meta = extractMetaFromSections(source.sections) ?? source.memory;
      const memKind = meta?.kind;
      if (memKind === "initial" || memKind === "reinjection") {
        groups.push({ id: key, kind: "first", injectedText: contextText(node) });
        continue;
      }
      if (memKind === "hit") {
        groups.push({ id: key, kind: "hit", injectedText: contextText(node) });
        continue;
      }
      if (meta !== void 0) continue;
      if (source.form === "snapshot") {
        const injectedText = contextText(node);
        const isFirst = injectedText.startsWith(FIRST_INJECTION_MARKER) || injectedText.includes("LONG-TERM MEMORY");
        groups.push({ id: key, kind: isFirst ? "first" : "hit", injectedText });
      }
      continue;
    }
    if (node.kind !== "user") continue;
    const content = node.data.content ?? [];
    if (content.length === 0 || content.some((b) => b.type !== "text")) continue;
    const text = blocksToText(content);
    if (text.length === 0) continue;
    let kind = null;
    if (text.startsWith(FIRST_INJECTION_MARKER) || text.includes("LONG-TERM MEMORY") || text.includes("===== \u957F\u671F\u8BB0\u5FC6 =====")) kind = "first";
    else if (text.startsWith(HIT_INJECTION_MARKER) || text.includes("Possibly relevant memories") || text.includes("\u53EF\u80FD\u76F8\u5173\u7684\u8BB0\u5FC6")) kind = "hit";
    if (kind === null) continue;
    const sep = text.includes(PROMPT_SEPARATOR) ? PROMPT_SEPARATOR : text.includes(EN_PROMPT_SEPARATOR) ? EN_PROMPT_SEPARATOR : null;
    if (sep === null) continue;
    const sepIdx = text.lastIndexOf(sep);
    const userText = text.slice(sepIdx + sep.length).replace(/^\n+/, "");
    const time = typeof node.data.time === "number" ? node.data.time : void 0;
    groups.push({ id: key, kind, injectedText: text.slice(0, sepIdx + sep.length), userText, time });
  }
  return groups;
}
function formatInjectionClock(time, now = Date.now()) {
  const d = new Date(time);
  const n = new Date(now);
  const pad = (value) => String(value).padStart(2, "0");
  const clock = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const sameDay = d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
  if (sameDay) return clock;
  const md = d.getFullYear() === n.getFullYear() ? t("datetime.ymd", { m: d.getMonth() + 1, d: d.getDate() }) : t("datetime.ymdFull", { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() });
  return `${md} ${clock}`;
}

// src/client-delegate-vanish.ts
var DELEGATE_LABEL_PREFIX = "meow-memory ";
function isMeowDelegateLabel(label) {
  return typeof label === "string" && label.startsWith(DELEGATE_LABEL_PREFIX);
}
function indexSubagentDescendantCount(byId, rootId) {
  if (byId === void 0 || rootId === void 0) return 0;
  let total = 0;
  for (const descendant of Object.values(byId)) {
    if (descendant?.origin !== "subagent") continue;
    const seen = /* @__PURE__ */ new Set();
    let node = descendant;
    while (node?.origin === "subagent" && typeof node.parentId === "string" && !seen.has(node.id ?? "")) {
      seen.add(node.id ?? "");
      if (node.parentId === rootId) {
        total += 1;
        break;
      }
      node = byId[node.parentId];
    }
  }
  return total;
}
function computeVanishDecision(state) {
  const current = state?.current;
  const catalog = current === void 0 ? void 0 : state?.subagentsByParent?.[current];
  const entries = catalog?.state === "ready" ? (catalog.entries ?? []).filter((e) => e?.kind === "child") : [];
  if (catalog?.state !== "ready") {
    return { known: false, hideTrigger: false, mineCount: 0, othersCount: 0 };
  }
  const mine = entries.filter((e) => isMeowDelegateLabel(e.label));
  const others = entries.length - mine.length;
  const lineageTotal = indexSubagentDescendantCount(state?.byId, current);
  const hideTrigger = others === 0 && mine.length > 0 && lineageTotal <= mine.length;
  return { known: true, hideTrigger, mineCount: mine.length, othersCount: others };
}
var SENTINEL_ATTR = "data-meow-vanish";
var ROW_ATTR = "data-meow-vanish-row";
function locateLineageRoot(sentinel) {
  let scope = sentinel?.parentElement ?? null;
  for (let hop = 0; scope !== null && hop < 5; hop += 1, scope = scope.parentElement) {
    const candidates = scope.querySelectorAll(':scope [class*="_root"]');
    for (const candidate of Array.from(candidates)) {
      if (candidate.contains(sentinel ?? null)) continue;
      if (candidate.querySelector(':scope [class*="_trigger"]') !== null) return candidate;
    }
  }
  return null;
}
function vanishRows(root = document) {
  const rows = root.querySelectorAll('[role="treeitem"]');
  for (const row of Array.from(rows)) {
    const match2 = isMeowDelegateLabel(row.getAttribute("aria-label"));
    const marked = row.getAttribute(ROW_ATTR) === "1";
    if (match2 && !marked) {
      row.setAttribute(ROW_ATTR, "1");
      row.style.display = "none";
    } else if (!match2 && marked) {
      row.removeAttribute(ROW_ATTR);
      row.style.display = "";
    }
  }
}
function applyTriggerVisibility(root, hide) {
  if (root === null || root === void 0) return;
  const trigger = root.querySelector(':scope [class*="_trigger"]');
  if (trigger === null) return;
  const next = hide ? "none" : "";
  if (trigger.style.display !== next) trigger.style.display = next;
}
function applyVanishDom(decision, sentinel) {
  try {
    vanishRows();
    if (decision.known) applyTriggerVisibility(locateLineageRoot(sentinel), decision.hideTrigger);
  } catch (e) {
    console.warn("[meow-memory] vanish DOM \u5E94\u7528\u5931\u8D25\uFF08fail-open\uFF0C\u4FDD\u6301\u5B98\u65B9\u663E\u793A\uFF09\uFF1A", e);
  }
}
function startVanishObserver(getApply) {
  let timer = 0;
  const observer = new MutationObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      const { decision, sentinel } = getApply();
      applyVanishDom(decision, sentinel);
    }, 80);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return () => {
    window.clearTimeout(timer);
    observer.disconnect();
  };
}

// src/client-dream-events.ts
var listeners2 = /* @__PURE__ */ new Set();
var pollTimer = 0;
var lastStates = /* @__PURE__ */ new Map();
var lastSkipped = /* @__PURE__ */ new Set();
var hasBaseline = false;
function emit(sessionId, state) {
  for (const listener of [...listeners2]) {
    try {
      listener({ sessionId, state });
    } catch {
    }
  }
}
async function pollDreamEventsOnce() {
  let states;
  let skipped2;
  try {
    const [statesRes, skipRes] = await Promise.all([
      fetch("/meow-memory/dreamed-sessions", { cache: "no-store" }),
      fetch("/meow-memory/skip-dreams", { cache: "no-store" })
    ]);
    if (!statesRes.ok || !skipRes.ok) return;
    const statesData = await statesRes.json();
    const skipData = await skipRes.json();
    states = /* @__PURE__ */ new Map();
    if (Array.isArray(statesData.sessionIds)) {
      for (const id of statesData.sessionIds) if (typeof id === "string") states.set(id, "dreamed");
    }
    if (Array.isArray(statesData.dreamingIds)) {
      for (const id of statesData.dreamingIds) if (typeof id === "string") states.set(id, "dreaming");
    }
    skipped2 = /* @__PURE__ */ new Set();
    if (Array.isArray(skipData.sessionIds)) {
      for (const id of skipData.sessionIds) if (typeof id === "string") skipped2.add(id);
    }
  } catch {
    return;
  }
  if (!hasBaseline) {
    lastStates = states;
    lastSkipped = skipped2;
    hasBaseline = true;
    return;
  }
  for (const [sessionId, state] of states) {
    if (lastStates.get(sessionId) !== state) emit(sessionId, state);
  }
  for (const [sessionId, state] of lastStates) {
    if (!states.has(sessionId)) emit(sessionId, "active");
  }
  for (const sessionId of skipped2) {
    if (!lastSkipped.has(sessionId)) emit(sessionId, "skip");
  }
  for (const sessionId of lastSkipped) {
    if (!skipped2.has(sessionId)) emit(sessionId, "unskip");
  }
  lastStates = states;
  lastSkipped = skipped2;
}
function subscribeDreamEvents(listener) {
  listeners2.add(listener);
  if (listeners2.size === 1 && pollTimer === 0) {
    pollTimer = window.setInterval(() => {
      void pollDreamEventsOnce();
    }, 6e4);
    void pollDreamEventsOnce();
  }
  return () => {
    listeners2.delete(listener);
    if (listeners2.size === 0 && pollTimer !== 0) {
      window.clearInterval(pollTimer);
      pollTimer = 0;
    }
  };
}

// src/client-i18n-replay.ts
var replayers = /* @__PURE__ */ new Set();
function registerUiReplayer(fn) {
  replayers.add(fn);
  return () => {
    replayers.delete(fn);
  };
}
function replayUiForLocale() {
  for (const fn of [...replayers]) {
    try {
      fn();
    } catch (error) {
      console.error("[meow-memory] UI \u8BED\u8A00\u91CD\u653E\u5931\u8D25\uFF1A", error);
    }
  }
}
onUiLocaleChange(() => {
  replayUiForLocale();
});

// src/client-delegate-notice.ts
var REFLECT_DELEGATE_MARKER = "\u3010\u8BB0\u5FC6\u53CD\u601D\u6807\u8BB0\u3011";
var REFLECT_DONE_DELEGATE_MARKER = "\u3010\u8BB0\u5FC6\u53CD\u601D\u5B8C\u6210\u6807\u8BB0\u3011";
var DREAM_DELEGATE_MARKER = "\u3010\u8BB0\u5FC6\u6574\u7406\u6807\u8BB0\u3011";
var PLUGIN_NAME2 = "meow-memory";
var HIDDEN_ATTR = "data-meow-delegate-hidden";
var ANCHOR_ATTR = "data-meow-delegate-anchor";
var CSS_ID = "meow-meow-delegate-notice-css";
var NOTICE_CSS = `[${HIDDEN_ATTR}="true"]{display:none!important}`;
var REFLECT_FRESH_MS = 30 * 6e4;
var DREAM_RUNNING_STALE_MS = 30 * 6e4;
var META_SECTION_NAME2 = "__meta__";
function extractMetaFromSections2(sections) {
  if (!Array.isArray(sections)) return void 0;
  const raw = sections.find((s) => s?.name === META_SECTION_NAME2)?.text;
  if (raw === void 0) return void 0;
  try {
    return JSON.parse(raw);
  } catch {
    return void 0;
  }
}
function noticeText(node) {
  const blocks = node.data?.content ?? [];
  return blocks.map((block) => block.text ?? "").join("\n").trim();
}
function delegateVariantOf(node) {
  if (node.kind !== "context") return void 0;
  const source = node.data?.source;
  if (source === void 0 || source === null || typeof source !== "object") return void 0;
  if (source.kind !== "plugin" || source.plugin !== PLUGIN_NAME2) return void 0;
  const meta = extractMetaFromSections2(source.sections) ?? source.memory;
  const memKind = meta?.kind;
  if (memKind === "reflect-marker") return "reflect";
  if (memKind === "reflect-done-marker") return "reflect-done";
  if (memKind === "dream-marker") return "dream";
  const text = noticeText(node);
  if (text.includes(REFLECT_DONE_DELEGATE_MARKER)) return "reflect-done";
  if (text.includes(REFLECT_DELEGATE_MARKER)) return "reflect";
  if (text.includes(DREAM_DELEGATE_MARKER)) return "dream";
  return void 0;
}
function delegateSessionIdOf(node) {
  const meta = extractMetaFromSections2(node.data?.source?.sections) ?? node.data?.source?.memory;
  const sid = meta?.sessionId;
  return typeof sid === "string" && sid !== "" ? sid : void 0;
}
function delegateTimeOf(node) {
  const time = node.data?.time;
  return typeof time === "number" ? time : void 0;
}
var dreamStateBySession = /* @__PURE__ */ new Map();
var lastApplied = [];
function delegateNoticeLabelFor(variant, running, interrupted = false) {
  if (variant === "dream") {
    if (interrupted) return t("notice.dream.interrupted");
    return running ? t("notice.dream.running") : t("notice.dream.done");
  }
  if (variant === "reflect-done") return t("notice.reflect.done");
  return running ? t("notice.reflect.running") : t("notice.reflect.done");
}
function delegateNoticeLabel(notice) {
  return delegateNoticeLabelFor(notice.variant, notice.running, notice.interrupted === true);
}
function computeDelegateNotices(snapshot, now = Date.now()) {
  if (snapshot?.chat === void 0) return [];
  const found = [];
  for (const key of snapshot.chat.order) {
    const node = snapshot.chat.nodes.get(key);
    if (node === void 0) continue;
    const variant = delegateVariantOf(node);
    if (variant === void 0) continue;
    found.push({ key, variant, sessionId: delegateSessionIdOf(node), time: delegateTimeOf(node) });
  }
  let lastReflectIdx = -1;
  for (let i = 0; i < found.length; i++) {
    if (found[i].variant === "reflect" || found[i].variant === "reflect-done") lastReflectIdx = i;
  }
  const out = found.map((f, i) => {
    if (f.variant !== "dream") {
      return {
        id: f.key,
        variant: f.variant,
        sessionId: f.sessionId,
        running: f.variant === "reflect" && i === lastReflectIdx && f.time !== void 0 && now - f.time < REFLECT_FRESH_MS
      };
    }
    const state = f.sessionId !== void 0 ? dreamStateBySession.get(f.sessionId) : void 0;
    if (state === "dreaming") return { id: f.key, variant: f.variant, sessionId: f.sessionId, running: true };
    if (state === "dreamed") return { id: f.key, variant: f.variant, sessionId: f.sessionId, running: false };
    const stale = f.time !== void 0 && now - f.time >= DREAM_RUNNING_STALE_MS;
    return { id: f.key, variant: f.variant, sessionId: f.sessionId, running: !stale, interrupted: stale };
  });
  return out;
}
function ensureCss() {
  if (typeof document === "undefined") return;
  const existing = document.querySelector(`style[data-plugin-css="${CSS_ID}"]`);
  if (existing !== null && existing.textContent === NOTICE_CSS) return;
  for (const stale of Array.from(document.querySelectorAll(`style[data-plugin-css="${CSS_ID}"]`))) {
    stale.remove();
  }
  const tag = document.createElement("style");
  tag.dataset.plugin = "meow-memory-delegate-notice";
  tag.dataset.pluginCss = CSS_ID;
  tag.textContent = NOTICE_CSS;
  document.head.appendChild(tag);
}
function applyDelegateNotices(groups) {
  if (typeof document === "undefined") return;
  lastApplied = groups;
  ensureCss();
  const containers = Array.from(document.querySelectorAll("[data-chat-flow]"));
  if (containers.length === 0) return;
  const liveIds = new Set(groups.map((group) => group.id));
  for (const container of containers) {
    for (const stale of Array.from(container.querySelectorAll(`[${ANCHOR_ATTR}]`))) {
      if (!liveIds.has(stale.getAttribute(ANCHOR_ATTR) ?? "")) stale.remove();
    }
    for (const row of Array.from(container.querySelectorAll(`[${HIDDEN_ATTR}]`))) {
      if (!liveIds.has(row.getAttribute("data-chat-flow-key") ?? "")) row.removeAttribute(HIDDEN_ATTR);
    }
    for (const group of groups) {
      const row = container.querySelector(`[data-chat-flow-key="${CSS.escape(group.id)}"]`);
      if (row === null || row.parentElement === null) continue;
      row.setAttribute(HIDDEN_ATTR, "true");
      if (group.variant === "reflect-done") continue;
      let anchor = container.querySelector(`[${ANCHOR_ATTR}="${CSS.escape(group.id)}"]`);
      if (anchor === null) {
        anchor = document.createElement("div");
        anchor.setAttribute(ANCHOR_ATTR, group.id);
        row.parentElement.insertBefore(anchor, row);
      }
      let bubble = anchor.querySelector(":scope > [data-meow-delegate-bubble]");
      if (bubble === null) {
        bubble = document.createElement("div");
        bubble.setAttribute("data-meow-delegate-bubble", "true");
        bubble.style.cssText = [
          "display:block;margin:4px 0;padding:5px 12px;",
          "font-size:12px;line-height:1.6;text-align:left;",
          "color:var(--dsw-alias-label-secondary, rgba(127,127,127,.9));",
          "background:rgba(127,127,127,.07);border:1px solid rgba(127,127,127,.14);",
          "border-radius:999px;"
        ].join("");
        anchor.appendChild(bubble);
      }
      const label = delegateNoticeLabel(group);
      if (bubble.textContent !== label) bubble.textContent = label;
    }
  }
}
function startDelegateStateSync() {
  if (typeof window === "undefined") return () => {
  };
  const notify2 = () => {
    if (lastApplied.length > 0) applyDelegateNotices(lastApplied);
  };
  const refresh = async () => {
    try {
      const response = await fetch("/meow-memory/dreamed-sessions", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      dreamStateBySession.clear();
      if (Array.isArray(data.sessionIds)) {
        for (const id of data.sessionIds) if (typeof id === "string") dreamStateBySession.set(id, "dreamed");
      }
      if (Array.isArray(data.dreamingIds)) {
        for (const id of data.dreamingIds) if (typeof id === "string") dreamStateBySession.set(id, "dreaming");
      }
      notify2();
    } catch {
    }
  };
  const unsubscribeDreamEvents = subscribeDreamEvents((event) => {
    const { sessionId, state } = event;
    if (state === "dreaming" || state === "dreamed") dreamStateBySession.set(sessionId, state);
    else dreamStateBySession.delete(sessionId);
    notify2();
  });
  void refresh();
  const unregisterReplay = registerUiReplayer(notify2);
  return () => {
    unregisterReplay();
    unsubscribeDreamEvents();
    dreamStateBySession.clear();
    lastApplied = [];
  };
}

// src/client-dream-icon.ts
var DREAM_ICON_ATTR = "data-meow-dreamed";
var DREAMING_ATTR = "data-meow-dreaming";
var SKIPPED_ATTR = "data-meow-skip-dream";
var MOON_SVG = '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
var SKIP_MOON_PATH = "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z";
var SKIP_SLASH_PATH = "M2.5 2.5l19 19";
function makeSkipMoonSvg() {
  const id = `meow-skip-${Math.random().toString(36).slice(2, 10)}`;
  return `<svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true"><defs><mask id="${id}"><rect width="24" height="24" fill="#fff"/><path d="${SKIP_SLASH_PATH}" fill="none" stroke="#000" stroke-width="4.4" stroke-linecap="round"/></mask></defs><g mask="url(#${id})"><path fill="currentColor" d="${SKIP_MOON_PATH}"/></g><path d="${SKIP_SLASH_PATH}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`;
}
var ICON_CSS = `[${DREAM_ICON_ATTR}],
[${DREAMING_ATTR}],
[${SKIPPED_ATTR}] {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
  margin-right: 4px; /* \u69FD\u4F4D\u5185\u5C45\u72B6\u6001\u70B9\u5DE6\u4FA7 / flat \u884C\u9996\u5185\u8054\uFF1A\u4E0E\u53F3\u4FA7\u5185\u5BB9\u4FDD\u6301\u95F4\u8DDD */
}
[${DREAM_ICON_ATTR}] { color: #e9c46a; opacity: 0.9; } /* \u6DE1\u9EC4\u505C\u9A7B */
[${DREAMING_ATTR}] {
  color: #f2c14e;
  animation: meow-dream-breathe 2.4s ease-in-out infinite;
}
@keyframes meow-dream-breathe {
  0%, 100% { color: #fff8e6; opacity: 0.55; }
  50% { color: #f2c14e; opacity: 1; }
}
[${SKIPPED_ATTR}] { color: #94a3b8; opacity: 0.85; } /* \u9759\u97F3\u7070\uFF1A\u8FD9\u6247\u7A97\u4E0D\u505A\u68A6 */
`;
var FIBER_KEY_RE = /^__reactFiber\$/;
function readSessionId(row) {
  let fiber = null;
  for (const key of Object.keys(row)) {
    if (FIBER_KEY_RE.test(key)) {
      fiber = row[key];
      break;
    }
  }
  let cur = fiber;
  for (let depth = 0; depth < 8 && cur !== null && cur !== void 0; depth++) {
    const f = cur;
    if (typeof f.key === "string" && f.key.length > 0) return f.key;
    cur = f.return;
  }
  return null;
}
function makeIcon(state) {
  const icon = document.createElement("span");
  icon.setAttribute(attrForState(state) ?? DREAM_ICON_ATTR, "true");
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = state === "skipped" ? makeSkipMoonSvg() : MOON_SVG;
  return icon;
}
function attrForState(state) {
  if (state === "dreaming") return DREAMING_ATTR;
  if (state === "dreamed") return DREAM_ICON_ATTR;
  if (state === "skipped") return SKIPPED_ATTR;
  return null;
}
var ANY_ICON_SEL = `[${DREAM_ICON_ATTR}], [${DREAMING_ATTR}], [${SKIPPED_ATTR}]`;
var SESSION_ROWS_SEL = 'div[role="treeitem"][class*="_sessionRow"]';
function mergeIconStates(dreamStates, skippedIds) {
  const merged = /* @__PURE__ */ new Map();
  for (const [id, state] of dreamStates) merged.set(id, state);
  for (const id of skippedIds) {
    if (merged.get(id) !== "dreaming") merged.set(id, "skipped");
  }
  return merged;
}
function applyDreamIcons(states, rows) {
  const all = rows ?? document.querySelectorAll(SESSION_ROWS_SEL);
  for (const row of all) {
    const id = readSessionId(row);
    const state = id !== null ? states.get(id) : void 0;
    const wantAttr = attrForState(state);
    const slot = row.querySelector('[class$="_slot"]');
    if (slot !== null) {
      const cur = slot.querySelector(ANY_ICON_SEL);
      const consistent = cur !== null && wantAttr !== null && cur.getAttribute(wantAttr) === "true";
      if (state !== void 0 && !consistent) {
        cur?.remove();
        slot.insertBefore(makeIcon(state), slot.firstChild);
      } else if (state === void 0 && cur !== null) {
        cur.remove();
      }
    } else if (state !== void 0) {
      const cur = row.querySelector(ANY_ICON_SEL);
      const consistent = cur !== null && cur.getAttribute(wantAttr ?? "") === "true";
      if (!consistent) {
        cur?.remove();
        const icon = makeIcon(state);
        icon.setAttribute("data-meow-inline-icon", "true");
        row.insertBefore(icon, row.firstChild);
      }
    } else {
      row.querySelector(ANY_ICON_SEL)?.remove();
    }
  }
}
function startDreamIconManager() {
  const dreamStates = /* @__PURE__ */ new Map();
  const skippedIds = /* @__PURE__ */ new Set();
  let timer = 0;
  const replay = () => applyDreamIcons(mergeIconStates(dreamStates, skippedIds));
  const refreshSkips = async () => {
    try {
      const response = await fetch("/meow-memory/skip-dreams", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      skippedIds.clear();
      if (Array.isArray(data.sessionIds)) {
        for (const id of data.sessionIds) {
          if (typeof id === "string") skippedIds.add(id);
        }
      }
    } catch {
    }
  };
  const refresh = async () => {
    try {
      const response = await fetch("/meow-memory/dreamed-sessions", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      dreamStates.clear();
      if (Array.isArray(data.sessionIds)) {
        for (const id of data.sessionIds) {
          if (typeof id === "string") dreamStates.set(id, "dreamed");
        }
      }
      if (Array.isArray(data.dreamingIds)) {
        for (const id of data.dreamingIds) {
          if (typeof id === "string") dreamStates.set(id, "dreaming");
        }
      }
    } catch {
    }
    await refreshSkips();
    replay();
  };
  const unsubscribeDreamEvents = subscribeDreamEvents((event) => {
    const { sessionId, state } = event;
    if (state === "dreamed" || state === "dreaming") dreamStates.set(sessionId, state);
    else if (state === "skip") skippedIds.add(sessionId);
    else if (state === "unskip") skippedIds.delete(sessionId);
    else dreamStates.delete(sessionId);
    replay();
  });
  for (const stale of Array.from(document.querySelectorAll("style[data-meow-dream-icon-css]"))) {
    stale.remove();
  }
  const style = document.createElement("style");
  style.dataset.meowDreamIconCss = "true";
  style.dataset.plugin = "meow-memory";
  style.textContent = ICON_CSS;
  document.head.appendChild(style);
  const observer = new MutationObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(replay, 120);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  void refresh();
  return () => {
    observer.disconnect();
    window.clearTimeout(timer);
    unsubscribeDreamEvents();
    style.remove();
    for (const el2 of Array.from(document.querySelectorAll(`[${DREAM_ICON_ATTR}], [${DREAMING_ATTR}], [${SKIPPED_ATTR}]`))) el2.remove();
  };
}

// src/client-dream-skip.ts
var SKIP_ITEM_ATTR = "data-meow-skip-item";
var ROW_ACTIONS_SEL = '[class*="_rowActions"]';
var SESSION_ROW_SEL = '[role="treeitem"][class*="_sessionRow"]';
var MENU_OPEN_ROW_SEL = '[role="treeitem"][class*="_sessionRow"][class*="_menuOpen"]';
var MENU_WINDOW_MS = 1500;
function skipLabel(skipped2) {
  return skipped2 ? t("menu.unskipDream") : t("menu.skipDream");
}
function setMenuIcon(item, skipped2) {
  const icon = item.querySelector("svg");
  if (icon !== null) icon.outerHTML = skipped2 ? MOON_SVG : makeSkipMoonSvg();
}
function captureSessionIdFromTarget(target) {
  const el2 = target;
  if (el2 === null || el2 === void 0 || typeof el2.closest !== "function") return null;
  if (el2.closest(ROW_ACTIONS_SEL) === null) return null;
  const row = el2.closest(SESSION_ROW_SEL);
  if (row === null) return null;
  return readSessionId(row);
}
function retitleLeaf(root, text) {
  let leaf = null;
  const walk = (el2) => {
    let hasElementChild = false;
    for (const c of el2.children) {
      hasElementChild = true;
      walk(c);
    }
    if (!hasElementChild && (el2.textContent ?? "").trim().length > 0) leaf = el2;
  };
  walk(root);
  if (leaf === null) return false;
  leaf.textContent = text;
  return true;
}
function resolveMenuSessionId(doc, fallback) {
  const openRow = doc.querySelector(MENU_OPEN_ROW_SEL);
  if (openRow === null) return null;
  const sid = readSessionId(openRow);
  return sid !== null ? sid : fallback;
}
function injectSkipItem(menu, sessionId, host) {
  for (const old of Array.from(menu.querySelectorAll(`[${SKIP_ITEM_ATTR}]`))) {
    if (old.getAttribute("data-meow-session-id") === sessionId) return null;
    old.remove();
  }
  const template = menu.querySelector('[role="menuitem"]');
  if (template === null) return null;
  const item = template.cloneNode(true);
  item.removeAttribute("id");
  for (const el2 of Array.from(item.querySelectorAll("[id]"))) el2.removeAttribute("id");
  item.setAttribute("role", "menuitem");
  if (!retitleLeaf(item, skipLabel(readSkipped(sessionId)))) return null;
  item.setAttribute(SKIP_ITEM_ATTR, "true");
  item.setAttribute("data-meow-session-id", sessionId);
  setMenuIcon(item, readSkipped(sessionId));
  const onClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const next = !readSkipped(sessionId);
    writeSkipped(sessionId, next);
    retitleLeaf(item, skipLabel(next));
    setMenuIcon(item, next);
    host.onToggle(sessionId, next, () => {
      writeSkipped(sessionId, !next);
      retitleLeaf(item, skipLabel(!next));
      setMenuIcon(item, !next);
    });
  };
  item.addEventListener("click", onClick, true);
  item.addEventListener("pointerdown", (e) => e.stopPropagation());
  menu.appendChild(item);
  return item;
}
var skipped = /* @__PURE__ */ new Set();
function readSkipped(sid) {
  return skipped.has(sid);
}
function writeSkipped(sid, val) {
  if (val) skipped.add(sid);
  else skipped.delete(sid);
}
function startDreamSkipManager() {
  let pendingSid = null;
  let pendingAt = 0;
  let observerTimer = 0;
  const syncOpenMenus = () => {
    const withinWindow = pendingSid !== null && Date.now() - pendingAt <= MENU_WINDOW_MS;
    const sid = resolveMenuSessionId(document, withinWindow ? pendingSid : null);
    if (sid === null) return;
    for (const menu of Array.from(document.querySelectorAll('[role="menu"]'))) {
      injectSkipItem(menu, sid, { onToggle: handleToggle });
    }
  };
  const observer = new MutationObserver((muts) => {
    if (pendingSid !== null && Date.now() - pendingAt <= MENU_WINDOW_MS) {
      const sid = resolveMenuSessionId(document, pendingSid);
      if (sid !== null) {
        for (const m of muts) {
          for (const node of Array.from(m.addedNodes)) {
            if (!(node instanceof HTMLElement)) continue;
            const menus = node.matches('[role="menu"]') ? [node] : Array.from(node.querySelectorAll('[role="menu"]'));
            for (const menu of menus) injectSkipItem(menu, sid, { onToggle: handleToggle });
          }
        }
        for (const menu of Array.from(document.querySelectorAll('[role="menu"]'))) {
          injectSkipItem(menu, sid, { onToggle: handleToggle });
        }
      }
    }
    window.clearTimeout(observerTimer);
    observerTimer = window.setTimeout(syncOpenMenus, 120);
  });
  const handleToggle = (sessionId, skip, rollback) => {
    void (async () => {
      try {
        const resp = await fetch("/meow-memory/skip-dreams", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId, skip })
        });
        if (!resp.ok) throw new Error(String(resp.status));
      } catch {
        rollback();
      }
    })();
  };
  const onPointerDown = (e) => {
    const sid = captureSessionIdFromTarget(e.target);
    if (sid === null) return;
    pendingSid = sid;
    pendingAt = Date.now();
  };
  const refresh = async () => {
    try {
      const response = await fetch("/meow-memory/skip-dreams", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      skipped.clear();
      if (Array.isArray(data.sessionIds)) {
        for (const id of data.sessionIds) {
          if (typeof id === "string") skipped.add(id);
        }
      }
    } catch {
    }
  };
  const unsubscribeDreamEvents = subscribeDreamEvents((event) => {
    const { sessionId, state } = event;
    if (state === "skip") {
      skipped.add(sessionId);
    } else if (state === "unskip") {
      skipped.delete(sessionId);
    } else {
      return;
    }
    void syncOpenMenus();
  });
  document.addEventListener("pointerdown", onPointerDown, true);
  observer.observe(document.body, { childList: true, subtree: true });
  void refresh();
  const unregisterReplay = registerUiReplayer(() => {
    for (const item of Array.from(document.querySelectorAll(`[${SKIP_ITEM_ATTR}]`))) {
      const sid = item.getAttribute("data-meow-session-id");
      if (sid !== null) retitleLeaf(item, skipLabel(readSkipped(sid)));
    }
  });
  return () => {
    unregisterReplay();
    document.removeEventListener("pointerdown", onPointerDown, true);
    observer.disconnect();
    window.clearTimeout(observerTimer);
    unsubscribeDreamEvents();
    for (const item of Array.from(document.querySelectorAll(`[${SKIP_ITEM_ATTR}]`))) item.remove();
  };
}

// src/client-menu-dream.ts
var MENU_SELECTOR = "[data-trigger-menu]";
var ROW_ID_PREFIX = "dsh-slash-option-command-";
var DREAM_SHORT = "\u624B\u52A8\u5524\u8D77\u4E00\u6B21\u8BB0\u5FC6\u6574\u7406";
var DREAM_LONG_PREFIX = "\u624B\u52A8\u5524\u8D77\u4E00\u6B21\u8BB0\u5FC6\u6574\u7406\uFF08dream\uFF09";
var MOON_SVG2 = '<svg viewBox="0 0 512 512" aria-hidden="true" focusable="false"><path fill="currentColor" d="M279.135 512c78.756 0 150.982-35.804 198.844-94.775 28.27-34.831-2.558-85.722-46.249-77.401-82.348 15.683-158.272-47.268-158.272-130.792 0-48.424 26.06-92.292 67.434-115.836 38.745-22.05 28.999-80.788-15.022-88.919A257.936 257.936 0 0 0 279.135 0c-141.36 0-256 114.575-256 256 0 141.36 114.576 256 256 256zm0-464c12.985 0 25.689 1.201 38.016 3.478-54.76 31.163-91.693 90.042-91.693 157.554 0 113.848 103.641 199.2 215.252 177.944C402.574 433.964 344.366 464 279.135 464c-114.875 0-208-93.125-208-208s93.125-208 208-208z"/></svg>';
function findDreamRow(menu) {
  const rows = menu.querySelectorAll(`button[id^="${ROW_ID_PREFIX}"]`);
  for (const row of rows) {
    for (const span of row.querySelectorAll(":scope > span")) {
      if (span.textContent === "dream") return row;
    }
  }
  return null;
}
function officialIconClass(menu) {
  const svg = menu.querySelector(`button[id^="${ROW_ID_PREFIX}"] > span > svg`);
  const span = svg?.parentElement;
  if (span === null || span === void 0 || span.className.length === 0) return null;
  return span.className;
}
function decorateRow(row, iconClass) {
  const spans = row.querySelectorAll(":scope > span");
  let nameSpan = null;
  let descriptionSpan = null;
  for (const span of spans) {
    if (span.textContent === "dream") nameSpan = span;
    else if ((span.textContent?.length ?? 0) > 4 && span !== nameSpan) descriptionSpan = span;
  }
  if (nameSpan === null) return;
  const prev = nameSpan.previousElementSibling;
  if (prev === null || !prev.hasAttribute("data-meow-dream-face")) {
    const icon = document.createElement("span");
    icon.setAttribute("data-meow-dream-face", "1");
    if (iconClass !== null) icon.className = iconClass;
    else icon.style.cssText = "display:inline-flex;flex:none;width:14px;height:14px;align-items:center;justify-content:center;";
    icon.innerHTML = MOON_SVG2;
    nameSpan.parentElement?.insertBefore(icon, nameSpan);
  }
  if (descriptionSpan !== null && descriptionSpan !== nameSpan && descriptionSpan.textContent?.startsWith(DREAM_LONG_PREFIX) === true) {
    descriptionSpan.textContent = DREAM_SHORT;
  }
}
function startMenuDreamFace() {
  if (typeof document === "undefined") return () => {
  };
  let scheduled = false;
  const decorate = () => {
    scheduled = false;
    try {
      const menu = document.querySelector(MENU_SELECTOR);
      if (menu === null) return;
      const row = findDreamRow(menu);
      if (row === null) return;
      decorateRow(row, officialIconClass(menu));
    } catch {
    }
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(decorate);
  };
  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true });
  schedule();
  return () => {
    observer.disconnect();
  };
}

// src/settings-page.ts
var React = __toESM(require("react"), 1);

// src/defaults.ts
var DEFAULT_RULES_REVIEW_DAYS = 2;
var CONFIG_DEFAULTS = {
  enabled: true,
  projectDir: ".dsh-meow",
  hitTopK: 2,
  titleMax: 40,
  reflect: true,
  reflectTurns: 7,
  autoMigrate: true,
  dream: {
    enabled: true,
    idleMinutes: 180,
    suppressWindows: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "18:00" }],
    suppressLeadMinutes: 15,
    checkMinutes: 15,
    timeZone: "Asia/Shanghai",
    rulesReviewDays: DEFAULT_RULES_REVIEW_DAYS
  },
  delegate: { model: "" }
};
function factoryDefaultOf(spec) {
  const scope = spec.sub === void 0 ? CONFIG_DEFAULTS : CONFIG_DEFAULTS[spec.sub];
  if (scope === void 0 || scope === null || typeof scope !== "object") return void 0;
  return scope[spec.key];
}

// src/settings-page.ts
var SETTINGS_NS = "meow-memory";
var CSS_ID2 = "meow-memory-settings-css";
var CSS2 = `
.meowmm_set_page{color:var(--dsw-alias-label-primary);display:flex;flex-direction:column;gap:10px;max-width:760px;padding:4px 0}
.meowmm_set_title{font-size:16px;font-weight:600;margin:0}
.meowmm_set_subtitle{color:var(--dsw-alias-label-caption);font-size:12px;line-height:1.6;margin:0}
.meowmm_set_card{background:color-mix(in srgb,currentColor 3%,transparent);border:1px solid var(--dsw-alias-border-l3);border-radius:10px;display:flex;flex-direction:column;gap:8px;padding:12px}
.meowmm_set_group{color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600;margin-top:2px}
.meowmm_set_row{align-items:flex-start;display:flex;gap:10px;justify-content:space-between}
.meowmm_set_rowtext{display:flex;flex-direction:column;gap:2px;min-width:0}
.meowmm_set_label{font-size:13px;font-weight:500}
.meowmm_set_hint{color:var(--dsw-alias-label-caption);font-size:12px;line-height:1.5}
.meowmm_set_ctrl{flex:none;padding-top:2px}
.meowmm_set_input{background:transparent;border:1px solid var(--dsw-alias-border-l3);border-radius:6px;color:inherit;font-size:13px;padding:4px 8px;width:190px}
.meowmm_set_input_err{border-color:#f43f5e}
.meowmm_set_input_time{width:230px;font-family:ui-monospace,monospace}
.meowmm_set_check{cursor:pointer}
.meowmm_set_badge{border-radius:999px;font-size:11px;line-height:16px;padding:0 8px;flex:none}
.meowmm_set_badge_override{background:color-mix(in srgb,#f59e0b 18%,transparent);color:#f59e0b}
.meowmm_set_badge_prefill{background:color-mix(in srgb,#60a5fa 18%,transparent);color:#60a5fa}
.meowmm_set_reset{background:transparent;border:1px solid var(--dsw-alias-border-l3);border-radius:6px;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:12px;padding:2px 8px}
.meowmm_set_reset:hover{border-color:var(--dsw-alias-border-l2);color:inherit}
.meowmm_set_err{color:#f43f5e;font-size:12px;line-height:1.5;margin:0}
.meowmm_set_saved{color:#34d399;font-size:12px}
.meowmm_set_muted{color:var(--dsw-alias-label-caption);font-size:12px}
`;
var el = React.createElement;
var FIELDS = [
  {
    title: "settings.group.base",
    fields: [
      { key: "enabled", label: "settings.field.enabled.label", type: "bool", hint: "settings.field.enabled.hint" },
      { key: "projectDir", label: "settings.field.projectDir.label", type: "str", hint: "settings.field.projectDir.hint", placeholder: ".dsh-meow" },
      { key: "autoMigrate", label: "settings.field.autoMigrate.label", type: "bool", hint: "settings.field.autoMigrate.hint" }
    ]
  },
  {
    title: "settings.group.inject",
    fields: [
      { key: "hitTopK", label: "settings.field.hitTopK.label", type: "num", hint: "settings.field.hitTopK.hint" },
      { key: "titleMax", label: "settings.field.titleMax.label", type: "num", hint: "settings.field.titleMax.hint" }
    ]
  },
  {
    title: "settings.group.reflect",
    fields: [
      { key: "reflect", label: "settings.field.reflect.label", type: "bool", hint: "settings.field.reflect.hint" },
      { key: "reflectTurns", label: "settings.field.reflectTurns.label", type: "num", hint: "settings.field.reflectTurns.hint" }
    ]
  },
  {
    title: "settings.group.delegate",
    fields: [
      { key: "model", sub: "delegate", label: "settings.field.delegateModel.label", type: "str", hint: "settings.field.delegateModel.hint", placeholder: "settings.field.delegateModel.placeholder" }
    ]
  },
  {
    title: "settings.group.dream",
    fields: [
      { key: "enabled", sub: "dream", label: "settings.field.dreamEnabled.label", type: "bool" },
      { key: "idleMinutes", sub: "dream", label: "settings.field.dream.idleMinutes.label", type: "num", hint: "settings.field.dream.idleMinutes.hint" },
      { key: "suppressWindows", sub: "dream", label: "settings.field.dream.suppressWindows.label", type: "str", hint: "settings.field.dream.suppressWindows.hint", placeholder: "09:00-12:00, 14:00-18:00" },
      { key: "suppressLeadMinutes", sub: "dream", label: "settings.field.dream.suppressLeadMinutes.label", type: "num" },
      { key: "checkMinutes", sub: "dream", label: "settings.field.dream.checkMinutes.label", type: "num" },
      { key: "timeZone", sub: "dream", label: "settings.field.dream.timeZone.label", type: "str", hint: "settings.field.dream.timeZone.hint" },
      { key: "rulesReviewDays", sub: "dream", label: "settings.field.dream.rulesReviewDays.label", type: "num", hint: "settings.field.dream.rulesReviewDays.hint" }
    ]
  },
  {
    title: "settings.group.language",
    fields: [
      { key: "promptLang", label: "settings.field.promptLang.label", type: "str", hint: "settings.field.promptLang.hint", placeholder: "settings.field.promptLang.placeholder" }
    ]
  }
];
function placeholderOf(spec) {
  if (spec.placeholder === void 0) return void 0;
  return UI_KEYS.includes(spec.placeholder) ? t(spec.placeholder) : spec.placeholder;
}
function parseSuppressWindows(text) {
  const trimmed = text.trim();
  if (trimmed === "") return { value: [] };
  const out = [];
  for (const part of trimmed.split(/[,，]/)) {
    const seg = part.trim();
    if (!seg) continue;
    const m = /^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/.exec(seg);
    if (!m) return { error: t("settings.suppress.format", { value: seg }) };
    out.push({ start: m[1], end: m[2] });
  }
  if (out.length === 0) return { error: t("settings.suppress.atLeastOne") };
  return { value: out };
}
function serializeSuppressWindows(w) {
  return (w ?? []).map((x) => `${x.start}-${x.end}`).join(", ");
}
function fieldValue(value, spec) {
  if (spec.sub === void 0) return value?.[spec.key];
  const parent = value?.[spec.sub];
  return parent?.[spec.key];
}
function inUserLayer(user, spec) {
  if (user === void 0) return false;
  if (spec.sub === void 0) return spec.key in user;
  const parent = user[spec.sub];
  return parent !== void 0 && spec.key in parent;
}
function draftKey(spec) {
  return spec.sub === void 0 ? spec.key : `${spec.sub}.${spec.key}`;
}
function jsonEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((entry, i) => jsonEqual(entry, b[i]));
  }
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => k in b && jsonEqual(a[k], b[k]));
}
function useUiLocale() {
  const subscribe = React.useCallback((cb) => onUiLocaleChange(() => cb()), []);
  return React.useSyncExternalStore(subscribe, getUiLocale, getUiLocale);
}
function MemorySettingsSection(props) {
  const scope = props.scope;
  useUiLocale();
  const subscribe = React.useCallback((cb) => scope.subscribe(cb), [scope]);
  const getSnapshot = React.useCallback(() => scope.getSnapshot(), [scope]);
  const snap = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const [savedAt, setSavedAt] = React.useState(0);
  const [error, setError] = React.useState(null);
  const [suppressText, setSuppressText] = React.useState(null);
  const [drafts, setDrafts] = React.useState({});
  const flashSaved = () => {
    setSavedAt(Date.now());
    window.setTimeout(() => setSavedAt((t2) => t2 === 0 ? 0 : t2), 4e3);
  };
  const clearDraft = (spec) => {
    const key = draftKey(spec);
    setDrafts((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };
  const apply2 = async (spec, newValue) => {
    setError(null);
    try {
      if (spec.sub === void 0) {
        await scope.set(spec.key, newValue);
      } else {
        const user = scope.getSnapshot().user;
        const parent = { ...user?.[spec.sub] ?? {} };
        parent[spec.key] = newValue;
        await scope.set(spec.sub, parent);
      }
    } catch (e) {
      setError(t("settings.saveFailed", { error: e instanceof Error ? e.message : String(e) }));
      return false;
    }
    const landed = () => {
      const v = scope.getSnapshot().user;
      const cur = spec.sub === void 0 ? v?.[spec.key] : v?.[spec.sub]?.[spec.key];
      return jsonEqual(cur, newValue);
    };
    if (landed()) {
      flashSaved();
      return true;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    if (landed()) {
      flashSaved();
      return true;
    }
    clearDraft(spec);
    setError(t("settings.saveNotApplied"));
    return false;
  };
  const reset = async (spec) => {
    setError(null);
    const def = factoryDefaultOf(spec);
    try {
      if (def === void 0) {
        if (spec.sub === void 0) {
          await scope.unset(spec.key);
        } else {
          const user = scope.getSnapshot().user;
          const parent = { ...user?.[spec.sub] ?? {} };
          delete parent[spec.key];
          if (Object.keys(parent).length === 0) await scope.unset(spec.sub);
          else await scope.set(spec.sub, parent);
        }
      } else {
        const value = JSON.parse(JSON.stringify(def));
        if (spec.sub === void 0) {
          await scope.set(spec.key, value);
        } else {
          const user = scope.getSnapshot().user;
          const parent = { ...user?.[spec.sub] ?? {} };
          parent[spec.key] = value;
          await scope.set(spec.sub, parent);
        }
      }
      const landed = () => {
        const user = scope.getSnapshot().user;
        if (def === void 0) {
          const cur = spec.sub === void 0 ? user?.[spec.key] : user?.[spec.sub]?.[spec.key];
          return cur === void 0;
        }
        return jsonEqual(fieldValue(user, spec), def);
      };
      if (!landed()) await new Promise((resolve) => window.setTimeout(resolve, 300));
      if (landed()) {
        flashSaved();
      } else {
        setError(t("settings.resetNotApplied"));
      }
    } catch (e) {
      setError(t("settings.resetFailed", { error: e instanceof Error ? e.message : String(e) }));
    }
  };
  if (snap.status === "loading") {
    return el("div", { className: "meowmm_set_page" }, el("span", { className: "meowmm_set_muted" }, t("settings.loading")));
  }
  if (snap.status === "unavailable") {
    return el("div", { className: "meowmm_set_page" }, el("span", { className: "meowmm_set_muted" }, t("settings.unavailable")));
  }
  const renderField = (spec) => {
    const raw = fieldValue(snap.value, spec);
    const def = factoryDefaultOf(spec);
    const overridden = def === void 0 ? inUserLayer(snap.user, spec) : !jsonEqual(raw, def);
    const isSuppress = spec.sub === "dream" && spec.key === "suppressWindows";
    const editingSuppress = isSuppress && suppressText !== null;
    const mirrorText = typeof raw === "string" ? raw : spec.type === "num" && typeof raw === "number" ? String(raw) : "";
    const draft = drafts[draftKey(spec)];
    let control = null;
    if (spec.type === "bool") {
      const checked = typeof draft === "boolean" ? draft : raw === true;
      control = el("input", {
        className: "meowmm_set_check",
        type: "checkbox",
        checked,
        disabled: !snap.writable,
        onChange: (e) => {
          const next = e.target.checked;
          setDrafts((prev) => ({ ...prev, [draftKey(spec)]: next }));
          void apply2(spec, next).then((ok) => {
            if (ok) clearDraft(spec);
          });
        }
      });
    } else if (spec.type === "num") {
      const text = typeof draft === "string" ? draft : mirrorText;
      control = el("input", {
        className: "meowmm_set_input",
        type: "number",
        value: text,
        disabled: !snap.writable,
        onChange: (e) => setDrafts((prev) => ({ ...prev, [draftKey(spec)]: e.target.value })),
        onBlur: (e) => {
          const v = e.target.value;
          const num = Number(v);
          if (v.trim() === "" || !Number.isFinite(num) || num === raw) {
            clearDraft(spec);
            return;
          }
          void apply2(spec, num).then((ok) => {
            if (ok) clearDraft(spec);
          });
        }
      });
    } else if (isSuppress) {
      const text = editingSuppress ? suppressText : serializeSuppressWindows(raw);
      const parsed = parseSuppressWindows(text);
      control = el("input", {
        className: "meowmm_set_input meowmm_set_input_time" + (editingSuppress && parsed.error ? " meowmm_set_input_err" : ""),
        value: text,
        disabled: !snap.writable,
        placeholder: "09:00-12:00, 14:00-18:00",
        onChange: (e) => setSuppressText(e.target.value),
        onBlur: () => {
          if (!editingSuppress) return;
          const res = parseSuppressWindows(suppressText);
          setSuppressText(null);
          if (res.error !== void 0 || res.value === void 0) return;
          void apply2(spec, res.value);
        }
      });
    } else {
      const text = typeof draft === "string" ? draft : mirrorText;
      control = el("input", {
        className: "meowmm_set_input",
        type: "text",
        value: text,
        placeholder: placeholderOf(spec),
        disabled: !snap.writable,
        onChange: (e) => setDrafts((prev) => ({ ...prev, [draftKey(spec)]: e.target.value })),
        onBlur: (e) => {
          const next = e.target.value;
          if (next === mirrorText) {
            clearDraft(spec);
            return;
          }
          void apply2(spec, next).then((ok) => {
            if (ok) clearDraft(spec);
          });
        }
      });
    }
    return el(
      "div",
      { key: spec.key, className: "meowmm_set_row" },
      el(
        "div",
        { className: "meowmm_set_rowtext" },
        el("span", { className: "meowmm_set_label" }, t(spec.label)),
        spec.hint !== void 0 ? el("span", { className: "meowmm_set_hint" }, t(spec.hint)) : null,
        editingSuppress && parseSuppressWindows(suppressText).error !== void 0 ? el("span", { className: "meowmm_set_err" }, parseSuppressWindows(suppressText).error) : null
      ),
      el(
        "div",
        { className: "meowmm_set_ctrl", style: { display: "flex", gap: "8px", alignItems: "center" } },
        control,
        el("span", { className: `meowmm_set_badge ${overridden ? "meowmm_set_badge_override" : "meowmm_set_badge_prefill"}` }, t(overridden ? "settings.badge.override" : "settings.badge.default")),
        overridden && snap.writable ? el("button", { className: "meowmm_set_reset", onClick: () => {
          clearDraft(spec);
          setSuppressText(null);
          void reset(spec);
        } }, t("settings.reset")) : null
      )
    );
  };
  return el(
    "div",
    { className: "meowmm_set_page" },
    el("h2", { className: "meowmm_set_title" }, t("settings.title")),
    el("p", { className: "meowmm_set_subtitle" }, t("settings.summary")),
    !snap.writable ? el("span", { className: "meowmm_set_muted" }, t("settings.readonly")) : null,
    savedAt > 0 ? el("span", { className: "meowmm_set_saved" }, t("settings.saved")) : null,
    error !== null ? el("div", { className: "meowmm_set_err" }, error) : null,
    ...FIELDS.map(
      (group) => el(
        "div",
        { key: group.title, className: "meowmm_set_card" },
        el("div", { className: "meowmm_set_group" }, t(group.title)),
        ...group.fields.map(renderField)
      )
    )
  );
}
function applySettingsPage(ctx) {
  let settingsScope;
  if (typeof ctx?.get === "function") settingsScope = ctx.get("settingsScope");
  else {
    try {
      settingsScope = ctx?.settingsScope;
    } catch {
      settingsScope = void 0;
    }
  }
  if (settingsScope === void 0) {
    console.info("[meow-memory] settingsScope \u670D\u52A1\u7F3A\u5931\uFF080.1.7+\uFF09\uFF0C\u8BBE\u7F6E\u9875\u672A\u6CE8\u518C");
    return () => {
    };
  }
  if (typeof document !== "undefined" && document.querySelector(`style[data-plugin-css="${CSS_ID2}"]`) === null) {
    const tag = document.createElement("style");
    tag.dataset.plugin = "meow-memory-settings";
    tag.dataset.pluginCss = CSS_ID2;
    tag.textContent = CSS2;
    document.head.appendChild(tag);
  }
  const scope = settingsScope.bind({ namespace: SETTINGS_NS });
  let disposeEntry = null;
  const registerSection = () => {
    try {
      disposeEntry?.();
    } catch {
    }
    disposeEntry = ctx.slots.register(
      {
        name: "settings.section",
        id: SETTINGS_NS,
        order: 35,
        label: () => t("settings.title"),
        inject: () => ({ scope })
      },
      MemorySettingsSection
    );
  };
  const disposeInjection = ctx.slots.inject("settings.section", registerSection);
  const unsubscribeLocale = onUiLocaleChange(registerSection);
  return () => {
    unsubscribeLocale();
    try {
      disposeInjection();
    } catch {
    }
    try {
      disposeEntry?.();
    } catch {
    }
  };
}

// src/client.ts
var FOLDED_ATTR = "data-meow-memory-folded";
var ANCHOR_ATTR2 = "data-meow-memory-anchor";
var BODY_ATTR = "data-meow-memory-body";
var INJ_ANCHOR_ATTR = "data-meow-injection-anchor";
var INJ_BODY_ATTR = "data-meow-injection-body";
var INJ_PROMPT_ATTR = "data-meow-injection-prompt";
var FOLD_CSS = `[${FOLDED_ATTR}="true"] { display: none !important; }
[data-meow-detail-body] {
  display: none;
  margin: 2px 0 8px 22px;
  padding: 8px 10px;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--dsw-alias-label-secondary, rgba(190,190,190,.9));
  background: rgba(127,127,127,.06);
  border: 1px solid rgba(127,127,127,.12);
  border-radius: 8px;
  font-family: ui-monospace, 'Cascadia Code', Consolas, 'Courier New', monospace;
}
[data-meow-detail-body="think"] {
  font-family: inherit;
  font-style: italic;
  opacity: .9;
}
[${INJ_BODY_ATTR}] {
  display: none;
  margin: 2px 0 8px;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--dsw-alias-label-secondary, rgba(190,190,190,.9));
  background: rgba(127,127,127,.05);
  border: 1px solid rgba(127,127,127,.12);
  border-radius: 8px;
  font-family: ui-monospace, 'Cascadia Code', Consolas, 'Courier New', monospace;
}
[${INJ_PROMPT_ATTR}] {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}
/* \u7528\u6237 prompt \u6C14\u6CE1\uFF1A\u6837\u5F0F\u5BF9\u9F50 dsh \u672C\u4F53 UserStyleBubble\uFF08MessageItem.module.css
 * .userStack/.bubble\uFF09\u2014\u2014\u540C token \u540C\u5C3A\u5BF8\uFF0C\u4E3B\u9898\u5207\u6362\u81EA\u52A8\u8DDF\u968F\u3002 */
[${INJ_PROMPT_ATTR}] > [data-meow-inj-bubble] {
  max-width: min(525px, 82%);
  padding: 10px 16px;
  border-radius: 22px;
  background: var(--dsw-specific-bubble);
  color: var(--dsw-alias-label-primary);
  font-size: 16px;
  line-height: 24px;
  white-space: pre-wrap;
  word-break: break-word;
}
[data-meow-inj-actions] {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 28px;
  background: transparent;
}
[data-meow-inj-time] {
  padding-right: 12px;
  font-size: 14px;
  line-height: 24px;
  color: var(--dsw-alias-label-tertiary);
  white-space: nowrap;
  background: transparent;
}
@media (hover: hover) {
  [data-meow-inj-time] {
    opacity: 0;
    transition: opacity 80ms ease;
  }
  [${INJ_PROMPT_ATTR}]:hover [data-meow-inj-time],
  [${INJ_PROMPT_ATTR}]:focus-within [data-meow-inj-time] {
    opacity: 1;
  }
}
[data-meow-inj-copy] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 6px;
  border: none;
  border-radius: 28px;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
}
[data-meow-inj-copy]:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-secondary);
}`;
var bodySigs = /* @__PURE__ */ new Map();
function sigOf(container, keys) {
  return keys.map((key) => flowRow(container, key)?.textContent ?? "").join("");
}
function flowRow(container, key) {
  return container.querySelector(`[data-chat-flow-key="${CSS.escape(key)}"]`);
}
function anchorOf(container, id) {
  return container.querySelector(`[${ANCHOR_ATTR2}="${CSS.escape(id)}"]`);
}
function ensureAnchor(container, group, expanded, onToggle) {
  let anchor = anchorOf(container, group.id);
  if (anchor === null) {
    const startRow = flowRow(container, group.id);
    if (startRow === null || startRow.parentElement === null) return;
    anchor = document.createElement("div");
    anchor.setAttribute(ANCHOR_ATTR2, group.id);
    startRow.parentElement.insertBefore(anchor, startRow);
  }
  let bar = anchor.querySelector(":scope > button");
  if (bar === null) {
    bar = document.createElement("button");
    bar.type = "button";
    bar.style.cssText = [
      "display:block;width:100%;margin:4px 0;padding:5px 12px;",
      "font-size:12px;line-height:1.6;text-align:left;cursor:pointer;",
      "color:var(--dsw-alias-label-secondary, rgba(127,127,127,.9));",
      "background:rgba(127,127,127,.07);border:1px solid rgba(127,127,127,.14);",
      "border-radius:999px;"
    ].join("");
    bar.addEventListener("click", () => onToggle(group.id));
    anchor.appendChild(bar);
  }
  const label = foldLabel(group, expanded);
  if (bar.textContent !== label) bar.textContent = label;
  const hint = t(expanded ? "inject.collapse" : "inject.expand");
  if (bar.title !== hint) bar.title = hint;
  let body = anchor.querySelector(`:scope > [${BODY_ATTR}]`);
  if (body === null) {
    body = document.createElement("div");
    body.setAttribute(BODY_ATTR, "true");
    body.style.display = "none";
    body.style.cssText = [
      "display:none;",
      "background:rgba(127,127,127,.05);",
      "border:1px solid rgba(127,127,127,.12);",
      "border-radius:12px;",
      "margin:2px 0 6px;",
      "padding:6px 10px;",
      "max-height:70vh;",
      "overflow-y:auto;"
    ].join("");
    anchor.appendChild(body);
  }
}
function attachDisclosure(rowEl, label, text) {
  const root = rowEl.parentElement;
  if (root === null) return;
  if (root.querySelector(":scope > [data-meow-detail-body]") !== null) return;
  const body = document.createElement("div");
  body.setAttribute("data-meow-detail-body", label);
  body.textContent = text;
  body.style.display = "none";
  root.appendChild(body);
  rowEl.addEventListener("click", () => {
    const open = root.getAttribute("data-open") === "true";
    root.setAttribute("data-open", open ? "" : "true");
    body.style.display = open ? "none" : "block";
  });
}
function enhanceClone(clone, node) {
  if (node === void 0) return;
  if (node.kind === "assistant-step") {
    const blocks = node.data.blocks ?? [];
    const reasoning = blocks.filter((b) => b.kind === "reasoning");
    const toolCalls = blocks.filter((b) => b.kind === "tool-call");
    const thinkRows = Array.from(clone.querySelectorAll('[data-variant="think"]'));
    thinkRows.forEach((root, i) => {
      const text = reasoning[i]?.text;
      const rowEl = root.querySelector("[data-disclosure-row]");
      if (text !== void 0 && rowEl !== null) attachDisclosure(rowEl, "think", text);
    });
    const toolRows = Array.from(clone.querySelectorAll("[data-disclosure-row]")).filter((el2) => el2.closest('[data-variant="think"]') === null);
    toolRows.forEach((rowEl, i) => {
      const block = toolCalls[i];
      if (block !== void 0) attachDisclosure(rowEl, "tool", toolCallDetail(block));
    });
  } else if (node.kind === "tool-call") {
    const root = node.data.root;
    if (root === void 0) return;
    const rowEl = clone.querySelector("[data-disclosure-row]");
    if (rowEl === null) return;
    const name = "name" in root ? root.name : root.call?.name ?? root.callId;
    const argsRaw = "name" in root ? root.argsRaw : root.call?.argsRaw ?? "";
    const detail = toolCallDetail({ name, argsRaw });
    const resultText = "content" in root ? blocksToText(root.content) : "";
    attachDisclosure(rowEl, "tool", resultText.length > 0 ? `${detail}

${t("inject.result")}
${resultText}` : detail);
  } else if (node.kind === "context") {
    const content = node.data.content;
    const text = blocksToText(content ?? []);
    const rowEl = clone.querySelector("[data-disclosure-row]");
    if (rowEl !== null && text.length > 0) attachDisclosure(rowEl, "context", text);
  }
}
function fillBody(id, visible, keys, session) {
  for (const container of Array.from(document.querySelectorAll("[data-chat-flow]"))) {
    const anchor = anchorOf(container, id);
    if (anchor === null) continue;
    const body = anchor.querySelector(`:scope > [${BODY_ATTR}]`);
    if (body === null) continue;
    body.replaceChildren();
    if (!visible) {
      body.style.display = "none";
      bodySigs.delete(id);
      return;
    }
    body.style.display = "block";
    for (const key of keys) {
      const row = flowRow(container, key);
      if (row === null) continue;
      const clone = row.cloneNode(true);
      clone.removeAttribute(FOLDED_ATTR);
      clone.removeAttribute("data-chat-flow-key");
      clone.removeAttribute("data-chat-anchor-key");
      clone.removeAttribute("data-chat-flow-kind");
      body.appendChild(clone);
      enhanceClone(clone, session.chat?.nodes.get(key));
    }
    bodySigs.set(id, sigOf(container, keys));
  }
}
var COPY_ICON_SVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.14929 4.02032C7.11197 4.02032 7.87983 4.02016 8.49597 4.07598C9.12128 4.13269 9.65792 4.25188 10.1415 4.53106C10.7202 4.8653 11.2008 5.3459 11.535 5.92462C11.8142 6.40818 11.9334 6.94481 11.9901 7.57012C12.0459 8.18625 12.0458 8.95419 12.0458 9.9168C12.0458 10.8795 12.0459 11.6473 11.9901 12.2635C11.9334 12.8888 11.8142 13.4254 11.535 13.909C11.2008 14.4877 10.7202 14.9683 10.1415 15.3025C9.65792 15.5817 9.12128 15.7009 8.49597 15.7576C7.87984 15.8134 7.11196 15.8133 6.14929 15.8133C5.18667 15.8133 4.41874 15.8134 3.80261 15.7576C3.1773 15.7009 2.64067 15.5817 2.1571 15.3025C1.5784 14.9683 1.09778 14.4877 0.76355 13.909C0.484366 13.4254 0.365184 12.8888 0.308472 12.2635C0.252649 11.6473 0.252808 10.8795 0.252808 9.9168C0.252808 8.95418 0.252664 8.18625 0.308472 7.57012C0.365184 6.94481 0.484366 6.40818 0.76355 5.92462C1.09777 5.34589 1.57839 4.86529 2.1571 4.53106C2.64067 4.25188 3.1773 4.13269 3.80261 4.07598C4.41874 4.02017 5.18666 4.02032 6.14929 4.02032ZM6.14929 5.37774C5.16181 5.37774 4.46634 5.37761 3.92566 5.42657C3.39434 5.47472 3.07859 5.56574 2.83582 5.70587C2.4632 5.92106 2.15354 6.2307 1.93835 6.60333C1.79823 6.8461 1.70721 7.16185 1.65906 7.69317C1.6101 8.23385 1.61023 8.92933 1.61023 9.9168C1.61023 10.9043 1.61009 11.5998 1.65906 12.1404C1.70721 12.6717 1.79823 12.9875 1.93835 13.2303C2.15356 13.6029 2.46321 13.9126 2.83582 14.1277C3.07859 14.2679 3.39434 14.3589 3.92566 14.407C4.46634 14.456 5.16182 14.4559 6.14929 14.4559C7.13682 14.4559 7.83224 14.456 8.37292 14.407C8.90425 14.3589 9.21999 14.2679 9.46277 14.1277C9.83535 13.9126 10.145 13.6029 10.3602 13.2303C10.5004 12.9875 10.5914 12.6717 10.6395 12.1404C10.6885 11.5998 10.6884 10.9043 10.6884 9.9168C10.6884 8.92934 10.6885 8.23384 10.6395 7.69317C10.5914 7.16185 10.5004 6.8461 10.3602 6.60333C10.1451 6.23071 9.83536 5.92107 9.46277 5.70587C9.21999 5.56574 8.90424 5.47472 8.37292 5.42657C7.83224 5.3776 7.13682 5.37774 6.14929 5.37774ZM9.80164 0.367975C10.7638 0.367975 11.5314 0.36788 12.1473 0.423639C12.7726 0.480307 13.3093 0.598759 13.7928 0.877741C14.3717 1.21192 14.8521 1.69355 15.1864 2.27227C15.4655 2.75574 15.5857 3.29164 15.6425 3.9168C15.6983 4.53301 15.6971 5.3016 15.6971 6.26446V7.82989C15.6971 8.29264 15.6989 8.58993 15.6649 8.84844C15.4668 10.3525 14.401 11.5738 12.9833 11.9988V10.5467C13.6973 10.1903 14.2105 9.49662 14.3192 8.67169C14.3387 8.52347 14.3407 8.3358 14.3407 7.82989V6.26446C14.3407 5.27706 14.3398 4.58149 14.2909 4.04083C14.2428 3.50968 14.1526 3.19372 14.0126 2.95098C13.7974 2.57849 13.4876 2.26869 13.1151 2.05352C12.8724 1.91347 12.5564 1.82237 12.0253 1.77423C11.4847 1.72528 10.7888 1.7254 9.80164 1.7254H7.71472C6.7562 1.72558 5.92665 2.27697 5.52332 3.07891H4.07019C4.54221 1.51132 5.9932 0.368186 7.71472 0.367975H9.80164Z" fill="currentColor"/></svg>';
var CHECK_ICON_SVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.0498 3.92579L8.49512 12.3818C8.25774 12.6881 8.04517 12.9645 7.84668 13.1689C7.63957 13.3823 7.38732 13.5841 7.04492 13.6719C6.86373 13.7183 6.6757 13.7346 6.48926 13.7197C6.13666 13.6915 5.8528 13.5355 5.6123 13.3604C5.38201 13.1926 5.12573 12.9567 4.83984 12.6953L1.03125 9.21289L1.96875 8.1875L5.77734 11.6699C6.08684 11.9529 6.27773 12.1249 6.43066 12.2363C6.50183 12.2882 6.54699 12.3135 6.57324 12.3252C6.58525 12.3305 6.59269 12.3322 6.5957 12.333C6.59802 12.3336 6.59961 12.334 6.59961 12.334C6.63317 12.3367 6.66758 12.3335 6.7002 12.3252C6.7002 12.3252 6.70211 12.3251 6.7041 12.3242C6.70698 12.3229 6.71348 12.319 6.72461 12.3115C6.74849 12.2956 6.78843 12.2642 6.84961 12.2012C6.98138 12.0654 7.13957 11.8628 7.39648 11.5313L13.9502 3.07422L15.0498 3.92579Z" fill="currentColor"/></svg>';
async function copyInjectionText(button, text) {
  let ok = false;
  try {
    await navigator.clipboard.writeText(text);
    ok = true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    textarea.remove();
  }
  if (!ok || button.dataset.meowInjState === "copied") return;
  button.dataset.meowInjState = "copied";
  button.title = t("inject.copied");
  button.innerHTML = CHECK_ICON_SVG;
  window.setTimeout(() => {
    button.dataset.meowInjState = "copy";
    button.title = t("inject.copy");
    button.innerHTML = COPY_ICON_SVG;
  }, 1e3);
}
function applyInjectionFold(groups, expanded, onToggle) {
  const containers = Array.from(document.querySelectorAll("[data-chat-flow]"));
  if (containers.length === 0) return;
  const liveIds = new Set(groups.map((g) => g.id));
  for (const container of containers) {
    for (const stale of Array.from(container.querySelectorAll(`[${INJ_ANCHOR_ATTR}]`))) {
      if (!liveIds.has(stale.getAttribute(INJ_ANCHOR_ATTR) ?? "")) stale.remove();
    }
    for (const group of groups) {
      const startRow = flowRow(container, group.id);
      if (startRow === null || startRow.parentElement === null) continue;
      startRow.setAttribute(FOLDED_ATTR, "true");
      let anchor = container.querySelector(`[${INJ_ANCHOR_ATTR}="${CSS.escape(group.id)}"]`);
      if (anchor === null) {
        anchor = document.createElement("div");
        anchor.setAttribute(INJ_ANCHOR_ATTR, group.id);
        startRow.parentElement.insertBefore(anchor, startRow);
      }
      let bar = anchor.querySelector(":scope > button");
      if (bar === null) {
        bar = document.createElement("button");
        bar.type = "button";
        bar.style.cssText = [
          "display:block;margin:4px 0 4px auto;max-width:82%;padding:5px 12px;",
          "font-size:12px;line-height:1.6;text-align:left;cursor:pointer;",
          "color:var(--dsw-alias-label-secondary, rgba(127,127,127,.9));",
          "background:rgba(127,127,127,.07);border:1px solid rgba(127,127,127,.14);",
          "border-radius:999px;"
        ].join("");
        bar.addEventListener("click", () => onToggle(group.id));
        anchor.appendChild(bar);
      }
      const kindLabel = t(group.kind === "first" ? "inject.kind.first" : "inject.kind.hit");
      const label = `${expanded.has(group.id) ? "\u25BE" : "\u25B8"} ${t("inject.bar")}${kindLabel}`;
      if (bar.textContent !== label) bar.textContent = label;
      let body = anchor.querySelector(`:scope > [${INJ_BODY_ATTR}]`);
      if (body === null) {
        body = document.createElement("div");
        body.setAttribute(INJ_BODY_ATTR, "true");
        anchor.appendChild(body);
      }
      if (expanded.has(group.id)) {
        if (body.textContent !== group.injectedText) body.textContent = group.injectedText;
        body.style.display = "block";
      } else {
        body.style.display = "none";
      }
      let prompt = anchor.querySelector(`:scope > [${INJ_PROMPT_ATTR}]`);
      if (group.userText === void 0) {
        prompt?.remove();
        continue;
      }
      if (prompt === null) {
        prompt = document.createElement("div");
        prompt.setAttribute(INJ_PROMPT_ATTR, "true");
        const bubble2 = document.createElement("div");
        bubble2.dataset.meowInjBubble = "true";
        prompt.appendChild(bubble2);
        const actions = document.createElement("div");
        actions.dataset.meowInjActions = "true";
        const timeLabel2 = document.createElement("span");
        timeLabel2.dataset.meowInjTime = "true";
        actions.appendChild(timeLabel2);
        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.dataset.meowInjCopy = "true";
        copyButton.title = t("inject.copy");
        copyButton.setAttribute("aria-label", t("inject.copy"));
        copyButton.innerHTML = COPY_ICON_SVG;
        copyButton.addEventListener("click", () => {
          if (group.userText !== void 0) {
            void copyInjectionText(copyButton, group.userText);
          }
        });
        actions.appendChild(copyButton);
        prompt.appendChild(actions);
        anchor.appendChild(prompt);
      }
      const bubble = prompt.querySelector(":scope > [data-meow-inj-bubble]");
      if (bubble !== null && bubble.textContent !== group.userText) bubble.textContent = group.userText;
      const timeLabel = prompt.querySelector(":scope > [data-meow-inj-actions] > [data-meow-inj-time]");
      if (timeLabel !== null) {
        const label2 = group.time === void 0 ? "" : formatInjectionClock(group.time);
        if (timeLabel.textContent !== label2) timeLabel.textContent = label2;
        if (label2 === "") timeLabel.style.display = "none";
        else if (timeLabel.style.display !== "") timeLabel.style.display = "";
      }
    }
  }
}
function applyFoldState(groups, expanded, onToggle, session) {
  const containers = Array.from(document.querySelectorAll("[data-chat-flow]"));
  if (containers.length === 0) return;
  const liveIds = new Set(groups.map((group) => group.id));
  for (const container of containers) {
    for (const stale of Array.from(container.querySelectorAll(`[${ANCHOR_ATTR2}]`))) {
      if (!liveIds.has(stale.getAttribute(ANCHOR_ATTR2) ?? "")) stale.remove();
    }
    for (const group of groups) {
      for (const key of group.keys) {
        const row = flowRow(container, key);
        if (row === null) continue;
        row.setAttribute(FOLDED_ATTR, "true");
      }
      ensureAnchor(container, group, expanded.has(group.id), onToggle);
      if (expanded.has(group.id)) {
        const sig = sigOf(container, group.keys);
        if (bodySigs.get(group.id) !== sig) fillBody(group.id, true, group.keys, session);
      } else {
        bodySigs.delete(group.id);
      }
    }
  }
}
var TURN_NAV_FRAME_VAR = "--turn-rail-inset";
function applyTurnNavHiding(memoryTurns) {
  if (memoryTurns.size === 0) return;
  for (const nav of document.querySelectorAll("nav[style]")) {
    if (nav.style.getPropertyValue(TURN_NAV_FRAME_VAR) === "") continue;
    for (const btn of nav.querySelectorAll("button[aria-label]")) {
      const nums = (btn.getAttribute("aria-label") ?? "").match(/\d+/g);
      if (nums === null) continue;
      const turn = Number(nums[nums.length - 1]);
      const slot = btn.parentElement;
      if (Number.isInteger(turn) && memoryTurns.has(turn) && slot !== null) slot.style.display = "none";
    }
  }
}
var chatIdentity = (chat) => chat;
function MemoryFoldDock(props) {
  const useChat = props?.useChat;
  const chatViaHook = typeof useChat === "function" ? useChat(chatIdentity) : void 0;
  const legacySession = props?.session;
  const snapshot = chatViaHook !== void 0 ? { chat: chatViaHook } : legacySession !== null && typeof legacySession === "object" && legacySession.chat !== void 0 ? legacySession : void 0;
  const [expanded, setExpanded] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
  const [injExpanded, setInjExpanded] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
  const groups = (0, import_react.useMemo)(() => computeFoldGroups(snapshot), [snapshot]);
  const injGroups = (0, import_react.useMemo)(() => computeInjectionGroups(snapshot), [snapshot]);
  const dgNotices = (0, import_react.useMemo)(() => computeDelegateNotices(snapshot), [snapshot]);
  const memTurns = (0, import_react.useMemo)(() => memoryTurnNumbers(snapshot), [snapshot]);
  const toggle = (0, import_react.useCallback)((id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      const willExpand = !next.has(id);
      if (willExpand) next.add(id);
      else next.delete(id);
      const group = groups.find((candidate) => candidate.id === id);
      fillBody(id, willExpand, group?.keys ?? [], snapshot);
      return next;
    });
  }, [groups, snapshot]);
  const toggleInj = (0, import_react.useCallback)((id) => {
    setInjExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  (0, import_react.useLayoutEffect)(() => {
    applyFoldState(groups, expanded, toggle, snapshot);
    applyInjectionFold(injGroups, injExpanded, toggleInj);
    applyDelegateNotices(dgNotices);
    applyTurnNavHiding(memTurns);
  }, [groups, expanded, toggle, snapshot, injGroups, injExpanded, toggleInj, dgNotices, memTurns]);
  const latest = (0, import_react.useRef)({ groups, expanded, toggle, snapshot, injGroups, injExpanded, toggleInj, dgNotices, memTurns });
  latest.current = { groups, expanded, toggle, snapshot, injGroups, injExpanded, toggleInj, dgNotices, memTurns };
  (0, import_react.useEffect)(() => {
    let timer = 0;
    const observer = new MutationObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        applyFoldState(latest.current.groups, latest.current.expanded, latest.current.toggle, latest.current.snapshot);
        applyInjectionFold(latest.current.injGroups, latest.current.injExpanded, latest.current.toggleInj);
        applyDelegateNotices(latest.current.dgNotices);
        applyTurnNavHiding(latest.current.memTurns);
      }, 80);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
  (0, import_react.useEffect)(() => {
    return onUiLocaleChange(() => {
      applyFoldState(latest.current.groups, latest.current.expanded, latest.current.toggle, latest.current.snapshot);
      applyInjectionFold(latest.current.injGroups, latest.current.injExpanded, latest.current.toggleInj);
      applyDelegateNotices(latest.current.dgNotices);
    });
  }, []);
  return null;
}
function makeDelegateVanishDock(refreshSubagents) {
  return function DelegateVanishDock({ useSessions }) {
    const current = useSessions?.((state) => state?.current);
    const byId = useSessions?.((state) => state?.byId);
    const catalogs = useSessions?.((state) => state?.subagentsByParent);
    const sentinelRef = (0, import_react.useRef)(null);
    const decision = (0, import_react.useMemo)(
      () => computeVanishDecision({ current, byId, subagentsByParent: catalogs }),
      [current, byId, catalogs]
    );
    const latest = (0, import_react.useRef)({ decision });
    latest.current = { decision };
    (0, import_react.useLayoutEffect)(() => {
      applyVanishDom(decision, sentinelRef.current);
    }, [decision]);
    (0, import_react.useEffect)(() => {
      if (current !== void 0 && typeof refreshSubagents === "function") {
        try {
          refreshSubagents(current);
        } catch {
        }
      }
      return startVanishObserver(() => ({ decision: latest.current.decision, sentinel: sentinelRef.current }));
    }, [current]);
    return (0, import_react.createElement)("span", {
      [SENTINEL_ATTR]: "1",
      style: { display: "none" },
      ref: sentinelRef
    });
  };
}
var inject = ["slots", "sessions"];
function apply(ctx) {
  const disposers = [];
  try {
    installI18n(ctx);
  } catch (e) {
    console.warn("[meow-memory] \u6587\u6848\u5C42\u521D\u59CB\u5316\u5931\u8D25\uFF08UI \u9000\u56DE\u9ED8\u8BA4\u8BED\u8A00\uFF09\uFF1A", e);
  }
  disposers.push(startDreamIconManager());
  disposers.push(startDelegateStateSync());
  disposers.push(startDreamSkipManager());
  disposers.push(startMenuDreamFace());
  try {
    disposers.push(applySettingsPage(ctx));
  } catch (e) {
    console.warn("[meow-memory] \u8BBE\u7F6E\u9875\u6CE8\u518C\u5931\u8D25\uFF08\u4E0D\u5F71\u54CD\u6298\u53E0\u4E0E\u56FE\u6807\uFF09\uFF1A", e);
  }
  for (const stale of Array.from(document.querySelectorAll("style[data-meow-memory-css]"))) {
    stale.remove();
  }
  const style = document.createElement("style");
  style.dataset.meowMemoryCss = "true";
  style.dataset.plugin = "meow-memory";
  style.textContent = FOLD_CSS;
  document.head.appendChild(style);
  const slots = ctx?.slots;
  if (slots === void 0 || typeof slots.inject !== "function") {
    console.warn("[meow-memory] slots service unavailable; reflection folding disabled");
  } else {
    disposers.push(slots.inject("conversation.composer.dock", () => slots.register(
      {
        name: "conversation.composer.dock",
        id: "meow-memory",
        order: 90
      },
      MemoryFoldDock
    )));
    const sessions = ctx?.sessions;
    const refreshSubagents = typeof sessions?.refreshSubagents === "function" ? (id) => sessions.refreshSubagents(id) : void 0;
    disposers.push(slots.inject("conversation.session.header.actions", () => slots.register(
      {
        name: "conversation.session.header.actions",
        id: "meow-memory",
        order: 200
      },
      makeDelegateVanishDock(refreshSubagents)
    )));
  }
  return () => {
    for (const dispose of disposers) {
      try {
        dispose();
      } catch {
      }
    }
  };
}
    return module.exports;
  }
});
//# sourceMappingURL=client.js.map
