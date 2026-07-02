# gh-discover

一个**打开即刷的 AI 应用发现引擎**。只发现 GitHub 上「能直接跑的 AI 应用」，默认不问用户任何问题，按"惊喜程度"往下喂卡片流，每张卡片用 AI 一句话讲清"这是啥、凭啥突然火"，看到喜欢的一键收藏。

## 产品的魂（做决策时的北极星）

打动用户的核心是 **"发现新东西的爽感"**，不是"又一个榜单"。所以：

- 它**不是表格榜单**，是**打开即刷的卡片信息流**（更像抖音，不像 GitHub Trending）。
- 只收**能直接跑的 AI 应用**（A 类）——不是 AI 框架/SDK，不是模型权重/论文复现，不是 awesome/prompt 合集。判"是不是应用"关键词做不到，必须让 AI 读 README 才分得清。
- 排序**不按 star 绝对值**，按**"惊喜分"**——让"没听过但在爆"的新 AI 应用顶上来。
- 每张卡片**必须有 AI 中文讲解**（是啥 + 凭啥火），这是区别于所有现有榜单站的灵魂。
- 默认**被动流**（打开即刷、掺随机性防腻），筛选功能藏起来、想收窄再点。

> 惊喜分逻辑：`新增star × (1/项目年龄) × 新颖度`。
> 因为只做 AI 领域，"领域热度"惩罚项失效（圈内人人都热），改用**新颖度**：按 AI 子方向判——"又一个套壳 chatbot"降权，"没见过的新玩法/新场景"顶上来。
> 一个刚建两周、玩法新颖、三天涨 2000 star 的应用，比存在 3 年的老牌 AI 应用涨 5000 star 更让人"卧槽"。

## 项目性质

- **A 起步**：先做成自己每天打开就爽的工具，成功标准是"自己爱用 + 技术练到"，不背变现包袱。
- **给 B 留口子**：架构上把内容页做成**服务端渲染、可被搜索收录**，哪天想做 SEO 获客，内容库现成、不返工。
- 结论：**别先做自媒体引流**（受众窄、静态载体配不上动态爽感、收藏型内容算法不爱，已放弃）。产品的真正难点是获客，未来的获客方向优先考虑 **SEO / Chrome 插件（新标签页展示今日惊喜项目）/ 产品社区首发**，而非当网红。

## 技术配置单（已逐项确认）

| 决策项 | 选择 |
|---|---|
| 技术栈 | Next.js（App Router + RSC） |
| 数据源 | 定时抓 `github.com/trending`（daily/weekly），解析 HTML |
| AI 讲解 + 判类 | v1 就带；**DeepSeek `deepseek-chat`（OpenAI 兼容，baseURL=https://api.deepseek.com）**，模块可插拔。读 README 一次调用同时判"是不是能跑的 AI 应用 + 子方向新颖度 + 中文讲解" |
| 范围 | 只做 A 类「能直接跑的 AI 应用」，全语言 |
| 排序 | 惊喜分（新增 star × 年龄衰减 × 新颖度） |
| 部署 | Vercel（站点，读提交进 git 的榜单，push 自动重部署） |
| 定时抓取 | **GitHub Actions 定时任务**，每天跑 pipeline（原定 Vercel Cron 因 pipeline 耗时几分钟超 serverless 时限，已弃用） |
| 数据存储 | **提交式 `src/data/feed.json`**（入 git，天然每日快照；原 Vercel KV 已弃用，A 阶段自用不需要外部存储） |
| 收藏 | localStorage 本地 |
| SEO 口子 | 每个项目独立可分享详情页 `/repo/[owner]/[name]`，SSR 可收录 |

## v1 功能范围（就四块，不多做）

1. **抓取**：Vercel Cron 每天抓 trending（全领域）→ 解析 → 存 KV。
2. **判类 + AI 讲解**：抓 description + README 摘要 → DeepSeek 一次调用判「是不是能跑的 AI 应用」+ 子方向新颖度 + 中文"是啥 + 凭啥火"；非 AI 应用直接丢弃。
3. **惊喜分排序**：按惊喜分（新增star × 年龄衰减 × 新颖度）+ 一点随机性排序，记录"已刷过"避免重复喂。
4. **卡片流 + 收藏**：打开即刷的卡片流，一键收藏存 localStorage。

## 现实约束

- GitHub 官方**无 Trending API**，"新增 star"是 trending 页自己算的，v1 只能用它展示的结果；以后要"真实增速曲线"需自己用 Search API 定时快照算 delta（数据是这类产品唯一护城河，历史数据抄不走）。
- GitHub API 限流：未认证 60 次/小时，带 token 5000 次/小时 → 配 token（服务端环境变量，勿硬编码）。
- pipeline（判类+讲解）单次跑几分钟，超 Vercel serverless 函数时限 → 每日任务放 **GitHub Actions**（6 小时上限），跑完把 `feed.json` 提交回仓库，Vercel 靠 push 自动重部署。

## 环境变量（.env.local 本地；生产放 GitHub Actions secrets）

```
DEEPSEEK_API_KEY=      # 必填：AI 判类 + 讲解
GITHUB_TOKEN=          # 可选：抓 README/元信息 提限流（Actions 自带，本地留空用未认证 60/小时）
```
> Vercel 侧无需任何环境变量（站点只读提交进 git 的 `src/data/feed.json`）。

## 状态

2026-07-02：完成需求推演 + 技术选型，配置单已定。定位收窄为「AI 应用发现器」——只做能直接跑的 AI 应用（A 类），惊喜分改用「新颖度」替代原「领域热度」惩罚，新增 DeepSeek 判类步骤。

2026-07-02：**骨架已搭并本地跑通**。Next.js 16（App Router + RSC）+ TS + Tailwind v4。三页齐活（主页全屏卡流 `/` + 详情页 `/repo/[owner]/[name]` SSR + 收藏页 `/saved` localStorage），设计稿存 `design/`。

2026-07-02：**数据管线全线打通并用真实数据验证**。①抓 trending 解析（`src/lib/github/trending.ts`，cheerio）②DeepSeek 判类+讲解（`src/lib/ai/classify.ts`，JSON 模式，429/503 退避重试）③惊喜分（`src/lib/score.ts`）。管线 `src/lib/pipeline.ts` 串联，并发上限 5，单项目失败只跳过不中断。真实抓取的 AI 应用已展示在卡片流。

2026-07-02：**定时/存储架构定型 + 生产构建通过**。实测 pipeline 跑 25 个候选耗时约 5 分钟（DeepSeek 慢），远超 Vercel serverless 时限——弃用 Vercel Cron+KV，改为 **GitHub Actions（`.github/workflows/refresh.yml`）每天跑 `scripts/refresh.ts` → 写 `src/data/feed.json` → 提交 → Vercel 自动重部署**。站点静态化：主页/收藏页预渲染，详情页 `generateStaticParams` 逐个 SSG（可收录，落实 SEO 口子）。`npm run build` 通过。

**待办（部署，需你上手）**：① 代码推上 GitHub ② Vercel 导入仓库部署（无需环境变量）③ GitHub 仓库 Settings→Secrets 加 `DEEPSEEK_API_KEY`，并把 Workflow 权限设为可写 ④ 手动触发一次 workflow 验证线上刷新。之后：惊喜分权重、候选数量调优。
