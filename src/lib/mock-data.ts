import type { Repo } from "./types";

// v1 骨架用假数据；真实抓取接好后由 repos.ts 换成 KV 数据源。
export const MOCK_REPOS: Repo[] = [
  {
    owner: "ferrous",
    name: "llama-tray",
    language: "Rust",
    category: "本地大模型",
    novelty: "high",
    accent: "pink",
    stars: 5600,
    starsToday: 3210,
    surpriseRank: 1,
    ageDays: 9,
    whatItIs: "常驻托盘的本地大模型开关，点一下起 OpenAI 兼容接口。",
    whyHot: "把跑本地模型从命令行劝退变成点托盘图标，刚建 9 天就三天涨 3200 星。",
    whatItIsLong:
      "llama-tray 是一个常驻系统托盘的本地大模型开关。点一下就在后台起一个 OpenAI 兼容接口，任何应用都能连本地模型，全程零终端操作。",
    whyHotLong:
      "它把「跑本地模型」从命令行小白劝退，变成了点一下托盘图标，普通用户也能用。刚建仓 9 天就三天涨了 3200 星，惊喜分冲到当日第一。",
    howToRun: "cargo install llama-tray\nllama-tray",
    license: "Apache-2.0",
    updatedAt: "1 小时前",
    topics: ["llm", "local", "tray"],
  },
  {
    owner: "nano-labs",
    name: "whisper-flow",
    language: "Python",
    category: "AI 剪辑",
    novelty: "high",
    accent: "indigo",
    stars: 12300,
    starsToday: 2047,
    surpriseRank: 2,
    ageDays: 18,
    whatItIs: "长视频自动切成带字幕的竖屏短视频，本地跑、免 API。",
    whyHot: "一条播客切 30 条爆款短视频的 demo 冲上 HN 首页，戳中自媒体痛点。",
    whatItIsLong:
      "whisper-flow 是一个本地运行的长视频自动切片工具。把一条播客、直播录像或长视频丢进去，它用语音识别 + 语义分析找出「高能片段」，自动加卡点、配竖屏字幕，直接吐出一批适合发抖音 / 小红书 / YouTube Shorts 的短视频切片，全程不需要上传云端、不需要 API key。",
    whyHotLong:
      "上周作者发布了一条演示视频——「把一期 2 小时播客自动切成 30 条短视频」，冲上了 Hacker News 首页。它精准戳中了自媒体创作者的核心痛点：切片剪辑最耗时、最枯燥。加上「本地跑、不上传、免 API」打消了内容隐私顾虑，短短三天涨了 2000 多个 star。",
    howToRun: "pip install whisper-flow\nwhisper-flow ./podcast.mp4 --clips 30 --vertical",
    license: "MIT",
    updatedAt: "2 小时前",
    topics: ["whisper", "video", "shorts"],
  },
  {
    owner: "agent-ui",
    name: "copilot-canvas",
    language: "TypeScript",
    category: "Agent 工具",
    novelty: "mid",
    accent: "emerald",
    stars: 8100,
    starsToday: 1530,
    surpriseRank: 5,
    ageDays: 62,
    whatItIs: "给 AI Agent 用的无限画布，实时看它摆卡片、连线、跑工具。",
    whyHot: "把 agent 的黑盒执行过程可视化，调 prompt 时能看到哪步跑歪。",
    whatItIsLong:
      "copilot-canvas 是一块给 AI Agent 用的无限画布，你能看着 agent 一步步在画布上摆卡片、连线、跑工具，像看它「在白板上思考」。",
    whyHotLong:
      "它把 agent 的黑盒执行过程可视化了，调 prompt 时能直观看到哪一步跑歪，戳中了做 agent 的开发者，被好几个 AI 博主转发。",
    howToRun: "npx copilot-canvas init\nnpm run dev",
    license: "MIT",
    updatedAt: "6 小时前",
    topics: ["agent", "canvas", "devtool"],
  },
];
