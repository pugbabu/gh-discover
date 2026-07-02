import type { Novelty } from "@/lib/types";

export interface AiVerdict {
  isAiApp: boolean; // 是不是「能直接跑的 AI 应用」（A 类）
  reason: string; // 判定理由（调试用，不展示）
  category: string; // 子方向，如 "AI 剪辑"
  novelty: Novelty; // 新颖度：套壳降权，新玩法顶上来
  whatItIs: string; // 是啥（一句话，卡片用）
  whyHot: string; // 凭啥火（一句话，卡片用）
  whatItIsLong: string; // 详情页用
  whyHotLong: string;
}

export interface ClassifyInput {
  owner: string;
  name: string;
  description: string | null;
  language: string | null;
  readme: string | null;
}

const ENDPOINT = "https://api.deepseek.com/chat/completions";

const SYSTEM = `你是 GitHub AI 应用鉴别专家。判断一个仓库是不是「能直接跑起来用的 AI 应用」（A 类）。

只算 A 类：终端用户或开发者能直接跑起来用的、以 AI 为核心的应用 / 工具（AI 剪辑、Agent 工具、AI 爬虫、本地大模型客户端、AI 效率工具等）。
不算 A 类（isAiApp=false）：AI 框架/SDK/库、模型权重、论文复现、benchmark、数据集、awesome/prompt 合集、以及和 AI 无关的一切。

新颖度 novelty：
- high：没见过的新玩法 / 新场景
- mid：常见方向里做得不错
- low：又一个套壳 chatbot / 明显跟风

只输出 JSON，中文，讲解口语化、别写营销黑话。`;

function userPrompt(input: ClassifyInput): string {
  return `仓库：${input.owner}/${input.name}
语言：${input.language ?? "未知"}
简介：${input.description ?? "无"}
README（截断）：
${input.readme ?? "无"}

按这个 JSON 结构输出：
{
  "isAiApp": boolean,
  "reason": "一句话判定理由",
  "category": "子方向（4-6字，如 AI 剪辑）",
  "novelty": "high | mid | low",
  "whatItIs": "是啥，一句话，30字内",
  "whyHot": "凭啥火，一句话，40字内",
  "whatItIsLong": "是啥，2-3句",
  "whyHotLong": "凭啥火，2-3句"
}
isAiApp 为 false 时，其余字段可留空字符串。`;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function classifyAndExplain(input: ClassifyInput): Promise<AiVerdict | null> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("缺少 DEEPSEEK_API_KEY");

  const body = JSON.stringify({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: userPrompt(input) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  // 429/503（限流 / 服务繁忙）指数退避重试
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body,
      cache: "no-store",
    });

    if (res.status === 429 || res.status === 503) {
      if (attempt < 3) {
        await sleep(1000 * 2 ** attempt);
        continue;
      }
    }
    if (!res.ok) throw new Error(`DeepSeek 调用失败: ${res.status} ${await res.text()}`);

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;
    try {
      return JSON.parse(content) as AiVerdict;
    } catch {
      return null;
    }
  }
  return null;
}
