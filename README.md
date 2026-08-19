# XPrice

X Premium 官方各国 Web 标价的全球分布图。只浏览比价，不提供换区或代订。

线上地址：[https://jarvis11x.space](https://jarvis11x.space)

## 本地运行

```bash
pnpm install
pnpm data    # 从 data/official-table.md 重建 data/markets.json
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 数据

- 本币价：`data/official-table.md`（摘自 [X Help · About X Premium](https://help.x.com/en/using-x/x-premium#tbpricing-bycountry)）
- 结构化结果：`data/markets.json`
- 汇率：运行时拉取公开中间价，失败则回退 `data/rates-fallback.json`

产品说明见 `docs/PRD.md`。
