# Mezzanine UI Vue 元件目錄

> 此檔案為 AI 工具最佳化的元件索引，幫助快速定位元件用途與搭配關係。
> 對照 `packages/react/COMPONENTS.md`；每移植一個元件就同步更新。

## General（基礎）

| 元件       | 匯入名稱        | 匯入路徑                       | 說明                                                                                   |
| ---------- | --------------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| Icon       | `MznIcon`       | `@mezzanine-ui/vue/icon`       | SVG 圖示元件，搭配 `@mezzanine-ui/icons` 使用，支援顏色、尺寸與旋轉動畫控制            |
| Separator  | `MznSeparator`  | `@mezzanine-ui/vue/separator`  | 水平或垂直分隔線，以 `<hr>` 為基礎，垂直時自動標註 `aria-orientation`                  |
| Typography | `MznTypography` | `@mezzanine-ui/vue/typography` | 文字排版元件，`variant` 為語意排版類型並自動推斷標籤，支援色彩、對齊、單行截斷與不換行 |
