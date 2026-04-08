# Next Session — Init Prompt

Paste the following into a fresh Claude session to resume the element → attribute selector refactor work cleanly.

---

## Init Prompt (copy from here)

我正在進行 Angular mezzanine-ui 元件的 element → attribute selector 批次 refactor，目的是讓 Angular Storybook 渲染的 DOM 與 React Storybook 一致，由 `tools/parity/` harness 驗證。

**請先依序讀這三份檔案瞭解完整 context**：

1. `tools/parity/REFACTOR.md` — 進度表 + blockers + gotchas + per-batch workflow
2. `tools/parity/refactor-selector.mjs` — 自動化腳本，能處理什麼、不能處理什麼
3. `tools/parity/api.ts` — parity harness 的 API 比對器

**分支**：`angular`。最後 commit：`git log --oneline -5`。

**當前 blockers（必須先解決再往下做）**：
REFACTOR.md 的 "Blocker discovered on `empty`" 區段說明有兩個未解決問題 — attribute leakage（string inputs 洩漏到 host DOM 屬性）和 style regression（descendants rgb 輕微偏移）。這兩個不解決，繼續 refactor 會一直回歸。請先讀那一段並提出解決方案讓我確認，再開始批次作業。

**快速狀態檢查**：

```bash
git status --short
git log --oneline -6
cat tools/parity/.out/summary.json 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin); print('total:', sum(x['count'] for x in d))" 2>/dev/null || echo "no parity baseline yet — run 'npm run parity:all' first"
```

**分階段目標**：

- Priority 1: `badge`、`empty`、`text-field`、`description-content`（high tag-diff impact）
- Priority 2: `layout`、`anchor-group`、`notifier`、`form-group`、`dropdown-status`（簡單 selector-only）
- Priority 3: Dropdown / Pagination / Navigation / Description / Card / Transition family 協調 refactor

**Context 管理規則**：

- 每做完一個 batch（5-10 個元件）commit 一次、更新 REFACTOR.md Progress 表
- 每次 commit 後檢查 context 用量，如果超過 60% 開始準備 handoff
- Handoff 時：更新 REFACTOR.md 的 "Session Handoff" 區段、更新 SESSION_INIT.md 如有必要、confirm 所有改動 committed、告知使用者開新 session

**重要背景**：

- 目前 parity baseline ~6866 diffs 分散在 91 個元件
- 已完成 refactor：`icon`, `floating-button`, `separator`
- `refactor-selector.mjs` 只做 mechanical 替換，複雜 template 結構（outer wrapper collapse、dynamic `[class]`、sub-component 協調）要手動
- Pre-existing 的 `.js`/`.d.ts` stale files 常常會再生，每個 session 開始前跑一次：
  ```
  find packages/ng -type f \( -name '*.js' -o -name '*.d.ts' \) -not -path '*/node_modules/*' -not -path '*/dist/*' -delete
  ```
- Angular Storybook 的 HMR 對 selector / template 結構改動不可靠，改完 component 後要重啟（`kill $(pgrep -f 'ng run ng-storybook')` 然後 `npm run ng:storybook` 背景執行）

從分析當前 blocker 並提出解方開始。
