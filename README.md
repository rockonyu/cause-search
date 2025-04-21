## 關於專案

這是基於 Next.js 和 Express 開發的 TypeScript 全端專案，透過 Github Actions 持續部署到 Vercel，並針對 [Serverless 環境](https://vercel.com/guides/using-express-with-vercel#adapting-to-serverless-environments) 進行了發佈策略調整。專案的 Git Commit 經過整理，僅保留了與功能實現相關的檔案變更，方便追蹤開發歷程。

## 功能

- 輕量化前端：無額外的前端套件，可根據需求進行擴展與重構。
- 伺服器端渲染：初次進入網站時，透過 SSR 提供初始的頁面資料。
- 無限滾動：使用 IntersectionObserver 實現無限滾動載入更多內容。
- 請求中斷控制：透過 AbortController 確保頁面資料與查詢條件一致。
- 資料庫存取：使用 Prisma 存取 Neon 遠端資料庫。
- 測試：
  - 使用 Jest 撰寫單元測試。
  - 使用 Playwright 撰寫 E2E 測試。
- 環境變數管理：透過 Github Secrets 與 Vercel Environment Variables 管理敏感資訊。

## 安裝與啟動

### 1. 安裝依賴

請確保已安裝 [Node.js](https://nodejs.org/) 和 [npm](https://www.npmjs.com/)。

```bash
npm install
```

### 2. 環境變數 / 執行資料庫移轉

在專案根目錄下建立 .env 文件，並根據需求配置環境變數。例如：

```bash
# Postgresql
DATABASE_URL=your-database-url

NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

```bash
npm run prisma:migrate:dev
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

## 測試

使用 Jest 執行單元測試

```bash
npm run test
```

使用 Playwright 執行 E2E 測試

```bash
npm run test:e2e
```
