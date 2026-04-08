# React → Angular Parity Deviations

當 React 與 Angular 元件因平台差異無法達成完整 parity 時，**先停下來**向使用者說明原因，取得核可後在此檔新增一列。`tools/parity/compare.ts` 會解析下表，**只**抑制明列的 `(Component, Story, Kind)` 三元組 diff，其他一律視為失敗。

- `Component`：kebab-case，需與 `tools/parity/.out/<component>/` 對應
- `Story`：story 的 `name`（即 export 名稱）；填 `*` 代表該元件所有 story
- `Kind`：`tag` | `attr` | `style` | `text` | `missing` | `extra` | `api`
- `Reason`：必須具體說明為何無法 parity
- `Approved`：使用者核可日期 `YYYY-MM-DD`

| Component | Story | Kind | React | Angular | Reason | Approved |
| --------- | ----- | ---- | ----- | ------- | ------ | -------- |
