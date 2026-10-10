// @ts-nocheck
//   ↑ 纯注释，只对编辑器/类型检查器生效，**对 Cloudflare Workers 运行时零影响**。
//   为什么加：这份文件在 VS Code 里会被 JS 类型检查器扫出 ~34 条「unknown / KVNamespace」类诊断
//   （PROBLEMS 面板），但那些**全部来自原有代码**，与本次 APIYI 改动无关，且 Cloudflare 部署时不做类型检查。
//   实测：加了这一行，同一个 tsc 配置下 **46 → 0 条**；node --check 与 42 条端到端仿真仍全绿。
//   ⇒ 让 PROBLEMS 面板干净，真正的问题才看得见；不需要它的话删掉这一行即可，其余一切不变。

/**
 * =====================================================================
 * ⭐⭐⭐ APIYI 通道版（2026-10-01）—— 基线 = IMPL-150 完整版，整份替换
 * =====================================================================
 * 【基线】ai-media-proxy-IMPL150-full.js（100,430 B）—— 含
 *   IMPL-98 /media/sf|ds 媒体直连代理 · IMPL-113 预检 ACAH 修正 + 版本特征头 ·
 *   IMPL-150 /media/wy 速创透明代理（**宿主位图 AI 六个动作的唯一通道**）。
 *   ★★ 2026-10-01 线上实测：media.gaze23.work 当前**只到 IMPL-98 时代** ——
 *      PUT /media/wy/x → 401（路由不在）· OPTIONS 无 x-media-proxy-version ·
 *      ACAH 缺 X-Enable-Watermark ⇒ 线上位图 AI 现在应当是 404。
 *      **本次粘贴 = 一次补齐【wy 通道 + IMPL-113 修正 + APIYI 新通道】。**
 *
 * 【相对 IMPL-150 基线只有 9 处新增，原有代码逐字未动】
 *   ① 本横幅
 *   ② 模块级新增 APIYI_PATH_PREFIXES / apiyiPathAllowed() / apiyiV1Base()（紧邻 llmProviderConfig 之前）
 *   ③ llmProviderConfig() 增第 4 家 apiyi
 *      ⇒ "provider:模型名" 语法立即可用：body.model = "apiyi:gpt-5.6-luna"
 *   ④ resolveLlmModel() 增 apiyi 分支（auto 在 APIYI 自己的 /v1/models 里选，不去问百炼）
 *   ⑤ /llm/chat 探活的 providers 增 apiyi（响应只增字段，旧调用方不受影响）
 *   ⑥a handleMediaProxy() 上游分流增 apiyi（含端点白名单拒绝分支）
 *   ⑥b handleMediaProxy() 增 900s 超时闸门（仅 apiyi 生效；sf/ds/wy 零改动）
 *   ⑥c fetch 分发增 /media/apiyi/*
 *   ⑥d fetch 入口 OPTIONS 预检增 x-apiyi-proxy: APIYI-1
 *      （x-media-proxy-version 保持 "IMPL-113" 不动 —— 宿主自诊断要求它非空）
 *   ⑦ 文件末尾追加「APIYI 自检」注释段
 * 原有 R2 上传 / 任务中心 / 批量队列 / 流水线 / 链式 / cron / lottie / userdata / archive 逐字未动。
 * KV 绑定沿用 TASKS，无需新增任何绑定。
 *
 * 【要配的环境变量】Settings → Variables and Secrets → Add（类型选 Secret）
 *   APIYI_API_KEY = sk-xxxxxxxx            ← 必填；只放这里，别写进代码、别提交
 *   APIYI_BASE    = https://api.apiyi.com  ← 可选（默认即它）
 *                   备用节点：b.apiyi.com / api-cf.apiyi.com
 *                   不带 /v1 会自动补；写成 .../v1 也不会变成 .../v1/v1
 *
 * 【部署】dash.cloudflare.com → Workers & Pages → 选中该 Worker → Edit code
 *         → 编辑器内 Ctrl+A 全选 → 删除 → 粘贴本文件全文 → Deploy
 *         （定时触发器等部署设置在 Dashboard 配置页，不受粘贴代码影响）
 *
 * 【自检】见文件末尾「APIYI 自检」注释段。
 * =====================================================================
 */

/**
 * =====================================================================
 * ⭐ ai-media-proxy Worker 完整合并版（你的原码 + /llm/chat + /llm/models 技能路由，IMPL-68 三上游）
 * =====================================================================
 * 组成：原 worker.js（md5 5405996b539c2a34876a0e126515c95d）
 *      + worker-llm-chat-route.js 路由模块（含 IMPL-66 消影子 + IMPL-68 三上游升级）
 * 合并改动共五处（其余逐字零改动）：
 *   ① 本文件顶部拼接路由模块全文（handleLlmChat / handleLlmModels 及辅助函数）；
 *   ② fetch 分发区在 requireAuth 之前插入两行：/llm/chat 与 /llm/models 分发（搜 "★" 可见）；
 *   ③ 路由模块内 2 处上游调用 fetch → globalThis.fetch —— 你的原码顶层声明了
 *      async function fetch(request,env,ctx)，同模块作用域会遮蔽全局 fetch，
 *      裸调用会递归进路由器而非发网络请求（本地仿真实测：必 502 网络异常）；
 *   ④ 原 Speedx 两处 fetch（submit/detail）→ globalThis.fetch（同一遮蔽隐患，
 *      若生产任务出现过 networkError 类失败，此修复顺带解决）。
 * 原有全部功能（R2 上传/任务中心/批量队列/流水线/链式/cron/lottie/userdata/archive）
 * 逻辑零改动；KV 绑定 TASKS 沿用，无需新增任何绑定。
 *
 * 【部署 3 步】
 *   1. dash.cloudflare.com → Workers & Pages → ai-media-proxy → Edit code
 *   2. 编辑器内 Ctrl+A 全选 → 删除 → 粘贴本文件全文 → Deploy
 *      （定时触发器等部署设置在 Dashboard 配置页，不受粘贴代码影响）
 *   3. Settings → Variables and Secrets → Add（类型均选密钥/Secret，配完自动重部署）：
 *        LLM_API_KEY        = 阿里云百炼 API Key（保险箱密码簿第 6 钥）
 *        DEEPSEEK_API_KEY   = DeepSeek 平台 API Key
 *        SILICONFLOW_API_KEY = SiliconFlow 平台 API Key
 *
 * 【部署后验证】
 *   浏览器打开 https://media.gaze23.work/llm/chat （GET 探活免鉴权）
 *   应返回 {"ok":true,"route":"/llm/chat","limit":100,"model":"auto",
 *           "providers":{"dashscope":true,"deepseek":true,"siliconflow":true}}
 *   → 工作台「技能系统」随即全功能（含设置 → 技能模型五预设切换 + 模型清单刷新）；
 *   沙箱侧巡检探针会自动发现 404→200 并复验
 *
 * 【可选变量】LLM_MODEL=auto（默认智能千问选型；支持 dashscope:/deepseek:/siliconflow: 前缀）
 *            LLM_LIMIT_DAILY=100（日限额）/ LLM_STRICT_SYSTEM="1"（可选加固）
 *            DEEPSEEK_BASE_URL / SILICONFLOW_BASE_URL（默认官方地址，一般不用配）
 * 【密钥纪律】三把 LLM Key 只存 Secret：不进 git、不进前端、不进日志
 * =====================================================================
 * 【IMPL-99 预检修复】/media/* OPTIONS 在 requireAuth 前短路 204+完整 CORS（修复 Kolors 报跨域）；ACAH 白名单放行 X-DashScope-Async / X-Enable-Watermark
 * 【IMPL-113 预检二次修正（真根因）】生产 curl 实测实锤：fetch 入口的无条件 OPTIONS 拦截位于 IMPL-99
 *   /media/* 专用短路之前 → 专用短路从未生效（死代码）；Z-Image-Turbo/Kolors 报「媒体代理不通」
 *   真根因 = 入口 preflight 的 ACAH 白名单缺 X-Enable-Watermark（前端水印关闭时带此头 → 预检被拒）。
 *   本版：ACAH 补全 + x-media-proxy-version: IMPL-113 版本特征头（Expose 给前端探测）——
 *   部署验证：curl -s -i -X OPTIONS https://<worker域>/media/sf/v1/images/generations | grep -i x-media-proxy-version
 *   应输出 x-media-proxy-version: IMPL-113；工作台报错文案会自动区分「仍为旧版/已部署瞬时异常/网络不通」。
 * 【IMPL-98 媒体直连代理】/media/sf/<path> 与 /media/ds/<path>（前端零密钥）：
 *   工作台直连模型（硅基流动生图/ASR、百炼生图/视频/TTS/ASR）全部改经本代理，
 *   Authorization 由 Worker 侧注入：sf→SILICONFLOW_API_KEY、ds→DASHSCOPE_API_KEY（缺省回落 LLM_API_KEY）。
 *   ?token= 鉴权与 /upload 一致（requireAuth）；token 参数剥除后不再转发上游；
 *   白名单透传 Content-Type / X-DashScope-Async；JSON 与 FormData（multipart）body 原样流转。
 *   新增 Secret：DASHSCOPE_API_KEY（可选，未配则用 LLM_API_KEY 同一把百炼 Key）。
 * =====================================================================
 * 【IMPL-150 Z17 速创通道】/media/wy/* 透明代理 api.wuyinkeji.com（W5 位图 AI 异步闭环）：
 *   与 /media/sf|ds 完全同形态（分发在 requireAuth 之前、鉴权实装于 handleWyProxy 内部）。
 *   Authorization = SPEEDX_KEY 密钥本体（速创形态无 Bearer；与任务中心 submitToSpeedx 同源同 key，
 *   零新增 Secret；可选别名 WY_KEY）。上游路由：POST /api/async/image_gpt_2.5[_flare|_sunburst]（提交）、
 *   GET /api/async/detail?id=（轮询）。前端 V26.9.168 的 studioEdits 走 /media/wy/* 异步闭环。
 *   ★ 本版改动仅两处：新增 handleWyProxy 函数 + fetch 入口加一行 wy 分发（其余逐字未动）。
 * =====================================================================
 */

/**
 * =====================================================================
 * worker-llm-chat-route.js —— Cloudflare Worker /llm/chat + /llm/models 路由模块
 * （IMPL-54 P0：技能系统 LLM 端点；IMPL-55：智能千问选型；
 *   IMPL-68：三上游多模型 dashscope / deepseek / siliconflow + 模型清单端点 + 思考开关）
 * =====================================================================
 *
 * 【用途】
 *   工作台「技能系统」的 LLM 调用端点。定位为哑管道（dumb pipe）：
 *   只做 鉴权 → 每日限额 → 请求整形 → SSE 零缓冲透传，
 *   不解析响应内容、不缓存对话、不 log 任何对话内容；LLM Key 只存在于 Worker Secret。
 *
 * 【三上游（IMPL-68）】body.model 支持 "provider:模型名" 前缀，跨三家自由切换：
 *   dashscope:qwen3.8-max / deepseek:deepseek-reasoner / siliconflow:Qwen/...；
 *   无前缀 = dashscope（兼容 IMPL-55 语义）；"auto" / 缺省 = dashscope 智能选型。
 *   思考模式：body.thinking===true 时 —— dashscope 恒注入 enable_thinking；
 *   siliconflow 仅 Qwen3 系注入；deepseek 不注入（reasoner 天然思考、chat 不支持该字段）。
 *
 * 【集成方法（Cloudflare Dashboard 在线编辑器，无需 wrangler）】
 *   1. dash.cloudflare.com → Workers & Pages → ai-media-proxy → Edit code；
 *   2. 将本文件全部代码粘贴到 worker.js 编辑器最顶部（零依赖、无顶层副作用、
 *      不使用 export/import —— Module 与 Service Worker 两种 Worker 格式均可直接拼接）；
 *   3. 在现有 fetch handler 的路由分发处、requireAuth 之前加两行：
 *        if (url.pathname === "/llm/chat") return handleLlmChat(request, env);
 *        if (url.pathname === "/llm/models") return handleLlmModels(request, env);
 *   4. Settings → Variables and Secrets → Add（类型均选 Secret）：
 *        LLM_API_KEY       = 阿里云百炼 API Key（sk-…，保险箱密码簿第 6 钥）
 *        DEEPSEEK_API_KEY  = DeepSeek 平台 API Key（sk-…）
 *        SILICONFLOW_API_KEY = SiliconFlow 平台 API Key（sk-…）
 *   5. Deploy 后验证：浏览器打开 https://media.gaze23.work/llm/chat 应返回
 *      {"ok":true,"route":"/llm/chat",...,"providers":{...}}（GET 探活无需鉴权）。
 *
 * 【需要配置的 Worker Secrets / 变量】
 *   ┌────────────────────┬────────┬──────────────────────────────────────────┬───────────────────────────┐
 *   │ 名称                │ 类型    │ 默认值                                    │ 说明                       │
 *   ├────────────────────┼────────┼──────────────────────────────────────────┼───────────────────────────┤
 *   │ AUTH_TOKEN         │ Secret │ （沿用现有，必填）                        │ 工作台访问令牌，鉴权用      │
 *   │ LLM_API_KEY        │ Secret │ 必填                                     │ DashScope 上游 Key          │
 *   │ DEEPSEEK_API_KEY   │ Secret │ 可选（不配则该上游 503）                  │ DeepSeek 上游 Key           │
 *   │ SILICONFLOW_API_KEY│ Secret │ 可选（不配则该上游 503）                  │ SiliconFlow 上游 Key        │
 *   │ LLM_BASE_URL       │ 变量    │ https://dashscope.aliyuncs.com/compatible-mode/v1 │ dashscope 根地址 │
 *   │ DEEPSEEK_BASE_URL  │ 变量    │ https://api.deepseek.com/v1              │ deepseek 根地址（可选）      │
 *   │ SILICONFLOW_BASE_URL│变量    │ https://api.siliconflow.cn/v1            │ siliconflow 根地址（可选）   │
 *   │ LLM_MODEL          │ 变量    │ auto（dashscope 智能选型；支持 provider: 前缀）│ 缺省模型              │
 *   │ LLM_LIMIT_DAILY    │ 变量    │ 100                                      │ 每日调用限额（全局计数）     │
 *   │ LLM_STRICT_SYSTEM  │ 变量    │ 未设（可选）                              │ ="1" 开启 system 前缀校验加固│
 *   │ TASKS              │ KV 绑定 │ 沿用现有 TASKS namespace                  │ 限额+三上游模型清单缓存      │
 *   └────────────────────┴────────┴──────────────────────────────────────────┴───────────────────────────┘
 *
 * 【协议】
 *   POST /llm/chat    headers: Authorization: Bearer <AUTH_TOKEN>（兼容 ?token=）
 *                     body: { messages, stream?, max_tokens?, temperature?, model?, thinking? }
 *                     成功 → 200 OpenAI SSE（text/event-stream，零缓冲透传）
 *                     401 令牌无效 / 400 messages 非法 / 429 今日限额
 *                     / 502 上游错误 / 503 该上游未配 Key
 *   GET  /llm/chat    探活 → { ok, route, limit, model, providers:{dashscope,deepseek,siliconflow} }
 *   GET  /llm/models  模型清单（需鉴权）→ { ok, providers:{dashscope:[...]|null, deepseek:...}, ts }
 *                     ?fresh=1 绕过 6h 缓存强制拉取；未配 Key 的上游返回 null
 *   与本地联调实现 mini-services/llm-chat-proxy/index.ts（3031）完全同构。
 *
 * 【安全纪律 —— 三不原则】
 *   1. 三把 LLM Key 不进 git（只存 Worker Secret）；
 *   2. 不进前端（前端只有 AUTH_TOKEN 三级读取链，Key 零下发；探活只回布尔存在性）；
 *   3. 不进日志（本模块不 log 请求/响应内容，502 错误摘要仅截取上游错误体前 160 字符，
 *      且绝不含 Authorization 头或完整请求内容）；Worker 不落内容（SSE 纯透传）。
 * =====================================================================
 */

/* ---------- CORS（与 imageseg 既有路由一致的放行策略，头集合按本端点需要收敛） ---------- */
/* ★ R9J：Worker 版本**单一来源** —— /health 的 version 与 OPTIONS 预检的 x-aiwork-proxy 都读它。
   （R9G/R9H/R9I 时期这两处各写一遍 ⇒ 每批都要记得改两处，本次收敛为一处，防漂移。） */
const PROXY_VERSION = 'R9ZQ-20261010';

/* ★★ R9ZI：慢请求保活参数（治 Cloudflare 524）—— 见 handleMediaProxy 内的长注释。
   GRACE：先等上游多少毫秒；这段时间内返回就**原样透传**（零变化）。
   BEAT ：切保活后每多少毫秒写一个换行，续 CF 的 Proxy Read Timeout。
   ⚠ CF 的 125s 计的是「源站响应**首字节**」⇒ 只要 GRACE < 125s 且 BEAT 远小于 125s 就安全。 */
/* ★★ R9ZX 加固：GRACE **50s → 1.2s**。
   起因：修贴了 R9ZI（保活在位）后**仍然 524** ⇒ 「等 50 秒再发首字节」这条路没走通。
   CF 的 524 语义（官方 524 页 + connection-limits 表）只说"origin 没在 125 秒内提供响应"，
   没说清是"首字节"还是"完整响应"；既然 50s 不够早，就压到**几乎立刻**——
   这样任何"必须在 X 秒内看到响应"的假设（X ≥ 1.2s）都能兜住，代价只是**几乎所有 APIYI POST
   都走一次保活封装**（前端 R9ZI+ 的解包已支持，语义透明）。
   同时 BEAT 15s → 5s：更密的心跳，兜住"两次读之间不能超过 N 秒"的那一类语义。 */
const R9ZI_GRACE_MS = 1200;
const R9ZI_BEAT_MS = 5000;
const R9ZI_MAGIC = '\u0000R9ZI\u0000';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  /* ★ R79-D：补 PUT —— /userdata 前端一直用 PUT 写，而这里只声明了 POST/GET/OPTIONS。
     此前没炸是因为 fetch 入口的 preflight 用的是另一套（含 PUT）；两处不一致是隐患，统一之。 */
  'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS',
  /* ★ R9ZI：ACAH 补 X-Aiwork-Slow-Ok —— 新版前端在 APIYI POST 上带这个头**主动声明**「我认保活流」，
     Worker 只对带了它的请求启用保活（旧前端不带 ⇒ 行为逐字节不变，最坏仍是原来的 524）。
     ⚠ 加自定义请求头必触发预检，ACAH 不补 ⇒ 整个 APIYI 图片链路会被浏览器拦掉。 */
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-DashScope-Async, X-Enable-Watermark, X-Aiwork-Slow-Ok',
};

/** JSON 响应统一出口（错误体与本地代理同构：{error:{message}}，始终带 CORS 头便于前端读取） */
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS },
  });
}

/* ---------- 上海时区 yyyyMMdd（限额计数 key 用的日期串，UTC+8 直接平移，无需完整时区库） ---------- */
function shanghaiDate() {
  return new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10).replace(/-/g, '');
}

/* =====================================================================
 * APIYI 通道（2026-10-01 新增，第 4 条媒体通道；与 sf / ds 并列）
 *   上游根 = https://api.apiyi.com/v1（OpenAI 兼容官转）
 *   Key   = env.APIYI_API_KEY（Secret；只在这一处取用，不进 git / 前端 / 日志）
 * ===================================================================== */
const APIYI_PATH_PREFIXES = [
  '/v1/chat/completions',   // LLM（技能 / 提示词优化）
  '/v1/responses',          // LLM（新式响应端点）
  '/v1/images/generations', // 文生图
  '/v1/images/edits',       // 改图（multipart：image[] / mask）
  '/v1/models',             // 模型清单
  '/v1/embeddings',         // 向量
  '/v1/videos',             // 视频 create / {id} / {id}/content（Phase 2 预置，免二次部署）
  '/v1/tasks',              // 视频：部分厂商的任务查询路径
  // ★ 2026-10-01 v2：Nano Banana 系走 **Gemini 原生端点**（/v1beta/models/{model}:generateContent）。
  //   ⚠ 前缀匹配是「=== p || startsWith(p + 斜杠)」⇒ 写成 /v1beta/models 就能放行
  //      /v1beta/models/gemini-3-pro-image:generateContent（冒号在末段，不影响前缀判定）。
  '/v1beta/models',         // Gemini 原生生成（Nano Banana Pro / 2 / 2 Lite）
  // ★★ 2026-10-05（R44）：**视频三家分流**补白名单 —— 官方文档明说视频没有统一路径，
  //   而白名单当时只放了 /v1/videos（Phase 2 预置）⇒ 另两家的请求全被我们自己的 Worker 挡掉。
  //   活体实测（GET 不存在的任务，零计费）：/seedance/… → 403 · /wan/… → 403 ·
  //   对照 /v1/videos/probe-none → 上游 400 task_not_exist（说明前两条确实拦在我们这层）。
  '/seedance',              // Seedance 2.5 提交/轮询：/seedance/api/v3/contents/generations/tasks[/{id}]
  '/wan',                   // Wan 3.0 提交：/wan/api/v1/services/aigc/video-generation/video-synthesis
];

/** 白名单判定：精确命中，或命中其子路径（/v1/videos/task_x → /v1/videos 放行）。 */
function apiyiPathAllowed(pathname) {
  return APIYI_PATH_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'));
}

/** APIYI 根地址（**不含** /v1）：APIYI_BASE 若已带 /vN 会被剥掉。
 *  ★ 为什么必须单拆一个：/media/apiyi/<上游路径> 形态下 sub 里**已含** /v1
 *    （/media/apiyi/v1/images/edits → sub = /v1/images/edits），基址再带一次就成了 /v1/v1
 *    —— 2026-10-01 端到端仿真抓到过这个真 bug，别再合回去。 */
function apiyiOrigin(env) {
  const raw = String(env.APIYI_BASE || 'https://api.apiyi.com').trim().replace(/\/+$/, '');
  return raw.replace(/\/v\d+[a-z]*$/i, '');
}

/** APIYI 的 /v1 根地址 —— 供 base + '/chat/completions'、base + '/models' 这类形态使用。
 *  口径：APIYI_BASE 只填**站点根**；末尾的 /vN… 一律规范化掉，统一按 /v1 走
 *  （白名单里全是 /v1 路径；填 /v1 不会变成 /v1/v1，填 /v2 也归一到 /v1）。 */
function apiyiV1Base(env) {
  return apiyiOrigin(env) + '/v1';
}

/* =====================================================================
 * 三上游注册表（IMPL-68）：provider → { base, key }
 * dashscope 兼容旧配（LLM_API_KEY / LLM_BASE_URL）；另两家用专属 Secret/变量。
 * ===================================================================== */
function llmProviderConfig(env) {
  return {
    dashscope: {
      base: String(env.LLM_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1').replace(/\/+$/, ''),
      key: env.LLM_API_KEY || '',
    },
    deepseek: {
      base: String(env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/+$/, ''),
      key: env.DEEPSEEK_API_KEY || '',
    },
    siliconflow: {
      base: String(env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1').replace(/\/+$/, ''),
      key: env.SILICONFLOW_API_KEY || '',
    },
    // APIYI（2026-10-01）：一把 Key 通吃 317 个模型；根地址见 apiyiV1Base()。
    // 未配 Key 时该上游 503（与 deepseek / siliconflow 同规矩）。
    apiyi: {
      base: apiyiV1Base(env),
      key: env.APIYI_API_KEY || '',
    },
  };
}

/** body.model / env.LLM_MODEL 解析："auto" | "模型名" | "provider:模型名"（未知名义 provider 回落 dashscope） */
function parseLlmModelField(raw, env) {
  const cfg = String(raw == null ? (env.LLM_MODEL || 'auto') : raw).trim();
  if (!cfg || cfg === 'auto') return { provider: 'dashscope', model: 'auto' };
  const i = cfg.indexOf(':');
  if (i > 0) {
    const p = cfg.slice(0, i).toLowerCase();
    const cfgs = llmProviderConfig(env);
    if (cfgs[p]) return { provider: p, model: cfg.slice(i + 1).trim() || 'auto' };
  }
  return { provider: 'dashscope', model: cfg };
}

/* =====================================================================
 * 智能千问选型（IMPL-55）：/models 清单解析 + 6h 缓存 + 视觉路由（dashscope auto 语义保留）
 * 零依赖；内存缓存 per-isolate per-provider，另用 KV（TASKS）尽力而为做跨 isolate 缓存。
 * ===================================================================== */
const LLM_MODEL_TTL = 6 * 3600e3;
const llmModelCache = {};
const qwenVer = id => { const m = /^qwen(\d+(?:\.\d+)?)/.exec(id); return m ? parseFloat(m[1]) : 0; };
const hasSnap = id => /-\d{4,8}$/.test(id) || /-\d{4}-\d{2}-\d{2}$/.test(id);
const noPreview = id => !/preview/i.test(id);

/** 文本旗舰：qwenN-max[-日期] 族，版本最高 → 快照优先 → created 最新；空则 plus 兜底 */
function pickQwenText(list) {
  const max = list.filter(m => /^qwen\d+(\.\d+)*-max(-\d{4,8})?$/.test(m.id) && noPreview(m.id));
  if (max.length) {
    max.sort((a, b) => qwenVer(b.id) - qwenVer(a.id) || (hasSnap(b.id) ? 1 : 0) - (hasSnap(a.id) ? 1 : 0) || b.created - a.created);
    return max[0].id;
  }
  const plus = list.filter(m => /^qwen\d+(\.\d+)*-plus(-\d{4,8})?$/.test(m.id) && noPreview(m.id));
  if (plus.length) {
    plus.sort((a, b) => qwenVer(b.id) - qwenVer(a.id) || b.created - a.created);
    return plus[0].id;
  }
  return null;
}

/** 视觉模型：qwenN-vl-{plus,max,flash} 族，档位 plus>max>flash（质量优先）→ 版本 → 快照 */
function pickQwenVision(list) {
  const tier = { plus: 3, max: 2, flash: 1 };
  const fam = list.filter(m => /^qwen\d+(\.\d+)*-vl-(plus|max|flash)(-\d{4,8})?$/.test(m.id) && noPreview(m.id));
  if (fam.length) {
    fam.sort((a, b) => {
      const ta = tier[(a.id.match(/-vl-(plus|max|flash)/) || [])[1]] || 0;
      const tb = tier[(b.id.match(/-vl-(plus|max|flash)/) || [])[1]] || 0;
      return tb - ta || qwenVer(b.id) - qwenVer(a.id) || (hasSnap(b.id) ? 1 : 0) - (hasSnap(a.id) ? 1 : 0) || b.created - a.created;
    });
    return fam[0].id;
  }
  const legacy = list.filter(m => /^qwen-vl-max(-latest)?$/.test(m.id));
  return legacy.length ? legacy.sort((a, b) => b.id.length - a.id.length)[0].id : null;
}

/** messages 含图片（image_url / image 分片）→ 需要视觉模型 */
function llmNeedsVision(messages) {
  return messages.some(m => Array.isArray(m.content) && m.content.some(p => p && (p.type === 'image_url' || p.type === 'image')));
}

/**
 * 拉取某上游 /models 清单：内存缓存 → KV 缓存（key: LLM#MODELS#<provider>，TTL 6h）→ 上游。
 * fresh=true 绕过两级缓存强制拉取（/llm/models?fresh=1 刷新场景）；失败时退回旧缓存。
 */
async function fetchLlmModels(env, provider, base, apiKey, fresh) {
  const mem = llmModelCache[provider] || (llmModelCache[provider] = { ts: 0, list: null });
  if (!fresh && mem.list && mem.list.length && Date.now() - mem.ts < LLM_MODEL_TTL) return mem.list;
  if (!fresh && env.TASKS) {
    try {
      const raw = await env.TASKS.get('LLM#MODELS#' + provider);
      if (raw) {
        const j = JSON.parse(raw);
        if (j && j.ts && Date.now() - j.ts < LLM_MODEL_TTL && Array.isArray(j.list) && j.list.length) {
          mem.list = j.list; mem.ts = j.ts;
          return j.list;
        }
      }
    } catch (e) { /* KV 异常不阻塞 */ }
  }
  let list = null; const ts = Date.now();
  try {
    // globalThis.fetch：宿主 Worker（Module 格式）顶层常声明 async function fetch(request,env,ctx)，
    // 同模块作用域内会遮蔽全局 fetch —— 裸调用会递归进宿主路由器而非发网络请求（IMPL-66 实测修正）。
    const r = await globalThis.fetch(`${base}/models`, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (r.ok) {
      const j = await r.json();
      list = (j.data || []).map(m => ({ id: String(m.id || ''), created: m.created || 0 })).filter(m => m.id);
    }
  } catch (e) { /* 网络异常走兜底 */ }
  if (list && list.length) {
    mem.list = list; mem.ts = ts;
    if (env.TASKS) {
      try { await env.TASKS.put('LLM#MODELS#' + provider, JSON.stringify({ ts, list: list.slice(0, 400) }), { expirationTtl: 21600 }); } catch (e) { /* 尽力而为 */ }
    }
    return list;
  }
  return (!fresh && mem.list && mem.list.length) ? mem.list : null;
}

/**
 * 模型解析入口：显式模型名（含 provider 前缀已剥出）直接返回；
 * auto = dashscope 智能选型（IMPL-55 语义）。
 * 兜底硬编码：文本 qwen3.8-max-0902 / 视觉 qwen3-vl-plus（清单不可用时）。
 */
async function resolveLlmModel(env, messages, parsed) {
  if (parsed.model !== 'auto') return parsed.model;
  const wantVision = llmNeedsVision(messages);
  const fbText = 'qwen3.8-max-0902', fbVision = 'qwen3-vl-plus';

  // APIYI 的 auto（2026-10-01）：它一把 Key 代理 317 个模型，目录里没有 qwenN-max 可挑，
  // 所以不走 dashscope 那套选型；改为在它自己的 /v1/models 里按
  // 「先精确命中偏好表 → 再按名字偏好 → 最后取首个」落一档。
  // 兜底默认：文本 gpt-5.6-luna（性价比旗舰）· 视觉 gemini-3.1-pro-preview（多模态旗舰）——
  // 两者都确在官方 317 模型表内，不是猜的。
  if (parsed.provider === 'apiyi') {
    const cfg = llmProviderConfig(env).apiyi;
    const list = await fetchLlmModels(env, 'apiyi', cfg.base, cfg.key, false);
    const ids = list && list.length ? list.map(m => m.id) : [];
    const prefer = wantVision
      ? ['gemini-3.1-pro-preview', 'gemini-3-pro-preview', 'gpt-5.6-sol', 'gemini-2.5-pro']
      : ['gpt-5.6-luna', 'gpt-5.4-mini', 'gemini-3.1-flash-lite', 'gpt-5-mini'];
    for (const id of prefer) if (ids.includes(id)) return id;
    const rx = wantVision ? /image|vision|omni/i : /(^|-)(mini|flash|lite|nano)/i;
    const hit = ids.find(i => rx.test(i));
    if (hit) return hit;
    return ids.length ? ids[0] : (wantVision ? 'gemini-3.1-pro-preview' : 'gpt-5.6-luna');
  }

  const cfg = llmProviderConfig(env).dashscope;
  const list = await fetchLlmModels(env, 'dashscope', cfg.base, cfg.key, false);
  if (!list) return wantVision ? fbVision : fbText;
  const picked = wantVision ? pickQwenVision(list) : pickQwenText(list);
  if (picked) return picked;
  const alt = wantVision ? pickQwenText(list) : pickQwenVision(list);
  return alt || (wantVision ? fbVision : fbText);
}

/* ---------- 鉴权：Authorization: Bearer 优先，兼容 ?token= 查询参数 ---------- */
function extractToken(request, url) {
  const m = /^Bearer\s+(.+)$/i.exec(request.headers.get('Authorization') || '');
  if (m) return m[1].trim();
  return url.searchParams.get('token') || '';
}

/* ---------- 每日限额：KV 计数（key = LLM#{yyyyMMdd}），尽力而为、异常放行不阻塞主链路 ---------- */
async function enforceDailyLimit(env) {
  if (!env.TASKS) return null; // 未绑定 KV：限额自动跳过不报错
  try {
    const key = `LLM#${shanghaiDate()}`;
    const n = parseInt((await env.TASKS.get(key)) || '0', 10) || 0;
    const limit = parseInt(env.LLM_LIMIT_DAILY || '100', 10) || 100;
    if (n >= limit) return limit; // 超限：返回限额数值供 429 文案
    // TTL 48h：跨日新 key 自然生效，旧 key 自动过期防 KV 垃圾堆积
    await env.TASKS.put(key, String(n + 1), { expirationTtl: 172800 });
    return null; // 放行
  } catch (e) {
    return null; // KV 读写异常：放行（限额是尽力而为，不阻塞主链路）
  }
}

/**
 * /llm/chat 主处理器 —— 在现有 worker.js fetch handler 中挂载：
 *   if (url.pathname === "/llm/chat") return handleLlmChat(request, env);
 *   if (url.pathname === "/llm/models") return handleLlmModels(request, env);
 * 不使用 export：粘贴进任意 Worker 格式（Module / Service Worker）均可直接调用。
 */
async function handleLlmChat(request, env) {
  const url = new URL(request.url);

  /* ---------- CORS 预检 ---------- */
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  /* ---------- 探活（供部署后快速验证路由挂载成功；providers 只回布尔存在性，不泄 Key） ---------- */
  if (request.method === 'GET') {
    const limit = parseInt(env.LLM_LIMIT_DAILY || '100', 10) || 100;
    const cfgs = llmProviderConfig(env);
    return json({
      ok: true, route: '/llm/chat', limit, model: String(env.LLM_MODEL || 'auto'),
      providers: { dashscope: !!cfgs.dashscope.key, deepseek: !!cfgs.deepseek.key, siliconflow: !!cfgs.siliconflow.key, apiyi: !!cfgs.apiyi.key },
    });
  }

  if (request.method !== 'POST') {
    return json({ error: { message: '仅支持 POST /llm/chat' } }, 405);
  }

  /* ---------- 鉴权 ---------- */
  // 令牌为高熵随机串且调用频次受限额约束，计时侧信道风险可忽略，简单 === 比对即可；
  // 如需常量时间比较可换 crypto.subtle 逐字节异或累积方案，此处刻意保持零依赖。
  const token = extractToken(request, url);
  if (!env.AUTH_TOKEN || token !== env.AUTH_TOKEN) {
    return json({ error: { message: 'Worker 令牌无效' } }, 401);
  }

  /* ---------- 每日限额 ---------- */
  const overLimit = await enforceDailyLimit(env);
  if (overLimit !== null) {
    return json({ error: { message: `今日技能额度已用完（限额 ${overLimit} 次）` } }, 429);
  }

  /* ---------- 解析 body：{ messages, stream, max_tokens, temperature, model, thinking } ---------- */
  let body = null;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: { message: '请求体不是合法 JSON' } }, 400);
  }
  const messages = body && body.messages;
  const messagesValid = Array.isArray(messages)
    && messages.length > 0
    && messages.every(m => m && typeof m.role === 'string');
  if (!messagesValid) {
    return json({ error: { message: 'messages 字段缺失或非法' } }, 400);
  }

  /* ---------- 可选加固：system 前缀校验（LLM_STRICT_SYSTEM === "1" 时开启） ---------- */
  // 防令牌持有者把端点当通用 LLM 代理滥用：首轮必须挂工作台技能 system 前缀。
  // content 兼容字符串与多模态数组两种形态（数组取 type==="text" 的 text 拼接）。
  if (env.LLM_STRICT_SYSTEM === '1') {
    const first = messages[0] || {};
    const text = typeof first.content === 'string'
      ? first.content
      : Array.isArray(first.content)
        ? first.content.filter(p => p && p.type === 'text').map(p => p.text || '').join('')
        : '';
    if (first.role !== 'system' || !text.startsWith('【技能执行模式】')) {
      return json({ error: { message: '请求必须来自工作台技能会话' } }, 400);
    }
  }

  /* ---------- 上游解析（IMPL-68）：provider 前缀 → 配置；未配 Key 明确 503 ---------- */
  const parsed = parseLlmModelField(body && body.model, env);
  const upCfg = llmProviderConfig(env)[parsed.provider];
  if (!upCfg.key) {
    const secretName = parsed.provider === 'dashscope' ? 'LLM_API_KEY' : parsed.provider.toUpperCase() + '_API_KEY';
    return json({ error: { message: `Worker 未配置 ${secretName}（Secret），${parsed.provider} 上游不可用` } }, 503);
  }

  /* ---------- 组装上游请求：智能选型 + 强制 stream:true，保留 messages/max_tokens/temperature ---------- */
  const model = await resolveLlmModel(env, messages, parsed);
  const upstreamBody = {
    model,
    messages,
    stream: true, // 契约固定流式；非流式请求也强制转流式，前端按 SSE 解析
  };
  if (body.max_tokens != null) upstreamBody.max_tokens = body.max_tokens;
  if (body.temperature != null) upstreamBody.temperature = body.temperature;
  // 思考开关（IMPL-68 建；IMPL-76 76-b 官方文档修正）：dashscope 恒注入（omni 默认开思考，恒注入 false 为保命设计）；
  // siliconflow：官方支持清单为全名 ID——旧 /^qwen3/i 错锚模型名开头，Qwen/Qwen3-*、Pro/Qwen/Qwen3-* 全部漏注 → 关思考无效（P1-1）；
  //   补 zai-org/GLM-4.5V/4.6V/5V-Turbo 与 deepseek-ai/DeepSeek-V3.x（均在官方支持清单）；
  // deepseek：官方「Thinking mode is enabled by default」，开关=顶层 {thinking:{type:enabled|disabled}}——
  //   旧版完全不注入 → 关思考无效（P1-2）；仅对 flash/v4 系注入，chat/reasoner 不动。
  if (parsed.provider === 'dashscope') {
    upstreamBody.enable_thinking = body.thinking === true;
  } else if (parsed.provider === 'siliconflow' && /qwen3/i.test(model)) {
    upstreamBody.enable_thinking = body.thinking === true;
  } else if (parsed.provider === 'siliconflow' && /(zai-org\/GLM-(4\.5V|4\.6V|5V-Turbo)|deepseek-ai\/DeepSeek-V3)/i.test(model)) {
    upstreamBody.enable_thinking = body.thinking === true;
  } else if (parsed.provider === 'deepseek' && /^deepseek-(flash|v4)/i.test(model)) {
    upstreamBody.thinking = { type: body.thinking === true ? 'enabled' : 'disabled' };
  }

  /* ---------- 转发上游 ---------- */
  let upstream;
  try {
    // globalThis.fetch：同上，防宿主顶层 function fetch 声明遮蔽全局 fetch（IMPL-66）
    upstream = await globalThis.fetch(`${upCfg.base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${upCfg.key}`, // 三不原则：Key 只在这里出现，不进 git/前端/日志
      },
      body: JSON.stringify(upstreamBody),
    });
  } catch (e) {
    // 网络层失败：无上游状态码可带，摘要不含任何请求内容
    return json({ error: { message: '上游 LLM 服务错误 HTTP 网络异常' } }, 502);
  }

  if (!upstream.ok) {
    // 摘要仅取上游错误体前 160 字符用于排障；绝不回传 Authorization 头或完整请求内容
    const brief = (await upstream.text().catch(() => '')).slice(0, 160);
    return json({ error: { message: `上游 LLM 服务错误 HTTP ${upstream.status}${brief ? '：' + brief : ''}` } }, 502);
  }

  /* ---------- 成功：SSE 零缓冲透传（不解析、不缓存、不 log 内容） ---------- */
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
      ...CORS_HEADERS,
    },
  });
}

/**
 * /llm/models 模型清单端点（IMPL-68，需鉴权）：聚合三上游 /models（尽力而为）。
 * 响应 providers[provider] = [{id,created}...] | null（未配 Key 或拉取失败）。
 * ?fresh=1 绕过 6h 缓存强制拉取（工作台「刷新模型清单」按钮）。
 */
async function handleLlmModels(request, env) {
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (request.method !== 'GET') {
    return json({ error: { message: '仅支持 GET /llm/models' } }, 405);
  }

  const token = extractToken(request, url);
  if (!env.AUTH_TOKEN || token !== env.AUTH_TOKEN) {
    return json({ error: { message: 'Worker 令牌无效' } }, 401);
  }

  const cfgs = llmProviderConfig(env);
  const fresh = url.searchParams.get('fresh') === '1';
  const providers = {};
  for (const name of Object.keys(cfgs)) {
    const c = cfgs[name];
    if (!c.key) { providers[name] = null; continue; }
    // 串行拉取防并发风暴；单家失败不拖垮整体（返回 null，前端按「未就绪」渲染）
    try {
      providers[name] = await fetchLlmModels(env, name, c.base, c.key, fresh);
    } catch (e) {
      providers[name] = null;
    }
  }
  return json({ ok: true, providers, ts: Date.now() });
}

// ============================================================
// ↓↓↓ 以下为原有 worker.js 全文（改动 = 上方 "★" 分发行 + 两处 fetch 消影子）
// ============================================================

/**
 * AI Media Workbench — Cloudflare Worker Backend (Task Center)
 *
 * Single-file ES module Worker providing:
 *   1. R2 file upload (backward compatible with existing frontend)
 *   2. Task Center: submit / list / get / cancel / delete single tasks
 *   3. Batch Queue: priority field + cron-driven concurrency-limited dispatch
 *   4. Pipeline (TTS → DigitalHuman → Package): step advancement on cron
 *   5. Chain (long-video segments): frontend-driven advancement, worker stores state
 *   6. Cron handler: polls running tasks, processes queued tasks, advances pipelines
 *   7. URL extraction that mirrors the frontend `extractUrl` exactly
 *   8. Speedx (速创) API forwarding with key held server-side only
 *
 * Endpoints (all authed via ?token=XXX unless noted):
 *   GET  /                              Health check (public)
 *   POST /upload                        R2 upload — FormData with "file" field
 *   POST /task                          Submit {kind:"single"|"pipeline"|"chain", ...}
 *   GET  /tasks                         Active + recent 20 completed tasks
 *   GET  /task/<id>                     Single task record
 *   POST /task/<id>/cancel              Mark canceled, move to recent
 *   DELETE /task/<id>                   Hard delete from KV + indexes
 *   POST /task/<id>/retry               Retry failed pipeline/chain/single
 *   POST /chain/<id>/advance            Frontend-driven: set tailFrameUrl, advance to next segment
 *   GET  /userdata?key=<k>&token=xxx   Read R2-backed JSON value (history sync)
 *   PUT  /userdata?key=<k>&token=xxx   Write R2-backed JSON value (body = raw JSON)
 *   POST /archive?token=xxx&url=...&ext=png   Download upstream result → store to R2 results/
 *
 * Environment:
 *   AUTH_TOKEN      (required)  Shared secret compared to ?token=
 *   SPEEDX_KEY      (required)  速创 API key, sent verbatim as Authorization header
 *   LIMIT_DAILY     (optional)  Daily submission cap, default 200
 *   PUBLIC_BASE_URL (optional)  Public URL prefix for R2 objects (custom domain)
 *
 * Bindings:
 *   TASKS     KV namespace — task records (key task:<id>) + index keys (idx:active, idx:recent)
 *   AI_BUCKET R2 bucket (existing)     — file uploads stored under uploads/<ts>-<rand>.<ext>
 */

// ============================================================
// Constants
// ============================================================

/** Speedx API base URL. */
const SPEEDX_BASE = 'https://api.wuyinkeji.com';

/** Speedx detail endpoint (GET with ?id=). */
const SPEEDX_DETAIL_PATH = '/api/async/detail';

/** KV key holding the JSON array of active task IDs (queued or running). */
const ACTIVE_INDEX_KEY = 'idx:active';

/** KV key holding the JSON array of recently completed task IDs (max RECENT_MAX). */
const RECENT_INDEX_KEY = 'idx:recent';

/** Maximum number of IDs retained in idx:recent. */
const RECENT_MAX = 50;

/** Number of recently completed tasks returned by GET /tasks. */
const RECENT_RETURN = 20;

/** Per-modelType concurrency caps applied when processing queued tasks. */
const CONCURRENCY = { image: 2, video: 1, audio: 2 };

/** Auto-retry delay (seconds) — queued task is skipped until notBefore elapses. */
const RETRY_DELAY_SEC = 60;

/** Maximum submit attempts (initial + retries) before permanent failure. */
const MAX_ATTEMPTS = 2;

/** Running task is treated as timed out after this many seconds since createdAt. */
const STALE_RUNNING_SEC = 1800;

/** Minimum seconds between two consecutive detail polls of the same task. */
const POLL_MIN_GAP_SEC = 3;

/** KV TTL for task records (30 days). */
const TASK_TTL_SEC = 86400 * 30;

/** KV TTL for daily counter keys (~25h to span any timezone's "today"). */
const COUNTER_TTL_SEC = 90000;

/** Top-level keys searched by extractUrl, in priority order. Mirrors frontend. */
const URL_KEYS = [
  'url', 'video_url', 'image_url', 'audio_url', 'result', 'result_url',
  'demo_audio', 'file_url', 'download_url', 'output_url',
  'video', 'image', 'audio', 'media_url', 'output',
];

/** Regex matching http(s) URLs, used by isUrl. */
const URL_RE = /^https?:\/\/\S+/i;

/**
 * Regex matching OSS / aliyuncs hosts served over HTTP — fixUrl rewrites them to HTTPS.
 * Captures the host so the rewrite preserves it. Mirrors frontend fixUrl exactly.
 */
const HTTP_OSS_RE = /^http:\/\/(wywxopenai\.oss[^/]+|[^/]*aliyuncs\.com)\//i;

// ============================================================
// Response & utility helpers
// ============================================================

/**
 * Build a JSON Response with no-store cache headers.
 * @param {number} status  HTTP status code.
 * @param {unknown} body   JSON-serializable body.
 * @returns {Response}
 */
function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'access-control-allow-headers': 'Content-Type, Authorization',
    },
  });
}

/**
 * Generate a random short ID with a descriptive prefix.
 * Uses crypto.getRandomValues for non-deterministic 16 hex chars.
 * @param {string} prefix  Short prefix like "tc", "pl", "ch", "r2".
 * @returns {string} e.g. "tc_3f9a2b1c4d5e6f7a"
 */
function genId(prefix) {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${prefix}_${hex}`;
}

/** Current time as integer seconds (matches JS Date.now()/1000). */
function nowSec() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Parse a value as JSON if it is a string; return non-strings unchanged.
 * Mirrors the inline IIFE in frontend extractUrl.
 * @param {unknown} v
 * @returns {unknown}
 */
function tryParseJson(v) {
  if (typeof v !== 'string') return v;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
}

/**
 * Test whether a value is a usable URL string.
 * Mirrors frontend `isUrl`: string, http(s) prefix, length under 4000 chars.
 * @param {unknown} s
 * @returns {boolean}
 */
function isUrl(s) {
  return typeof s === 'string' && URL_RE.test(s) && s.length < 4000;
}

/**
 * Rewrite HTTP OSS / aliyuncs URLs to HTTPS to avoid browser mixed-content blocking.
 * Mirrors frontend fixUrl() exactly — do not diverge.
 * @param {string|unknown} url
 * @returns {string|unknown}
 */
function fixUrl(url) {
  if (typeof url !== 'string') return url;
  return url.replace(HTTP_OSS_RE, 'https://$1/');
}

/**
 * Recursively search an arbitrary nested structure for the first URL-like string.
 * Prefers values whose key matches /url|file|output|result|media|video|image|audio/i.
 * Bounded at depth 8 to prevent runaway recursion.
 * Mirrors frontend _deepFindUrl exactly.
 * @param {unknown} obj
 * @param {number} [depth=0]
 * @returns {string|null}
 */
function deepFindUrl(obj, depth = 0) {
  if (!obj || depth > 8) return null;
  if (typeof obj === 'string') return isUrl(obj) ? obj : null;
  if (Array.isArray(obj)) {
    for (const it of obj) {
      const u = deepFindUrl(it, depth + 1);
      if (u) return u;
    }
    return null;
  }
  if (typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (/url|file|output|result|media|video|image|audio/i.test(k) && isUrl(v)) return v;
      const u = deepFindUrl(v, depth + 1);
      if (u) return u;
    }
  }
  return null;
}

/**
 * Extract a result URL from a Speedx detail response.
 *
 * Strategy mirrors frontend extractUrl exactly — divergence causes
 * "frontend shows success / worker reports failure" splits:
 *   1. Try common top-level keys (url, video_url, image_url, ...)
 *   2. Try nested obj.data (often a JSON string with the real payload)
 *   3. Try obj.outputs (array or object)
 *   4. Deep search the whole object
 *
 * All returned URLs are run through fixUrl for HTTP→HTTPS normalization.
 * @param {unknown} data  The full Speedx response body.
 * @returns {string|null}
 */
function extractUrl(data) {
  if (!data) return null;
  const obj = tryParseJson(data);

  for (const k of URL_KEYS) {
    const v = obj?.[k];
    if (isUrl(v)) return fixUrl(v);
    if (Array.isArray(v)) {
      const u = v.find(isUrl);
      if (u) return fixUrl(u);
    }
  }

  if (obj?.data) {
    const nested = tryParseJson(obj.data);
    for (const k of URL_KEYS) {
      const v = nested?.[k];
      if (isUrl(v)) return fixUrl(v);
      if (Array.isArray(v)) {
        const u = v.find(isUrl);
        if (u) return fixUrl(u);
      }
    }
    if (isUrl(nested)) return fixUrl(nested);
  }

  if (obj?.outputs) {
    if (Array.isArray(obj.outputs)) {
      for (const it of obj.outputs) {
        if (isUrl(it)) return fixUrl(it);
        if (typeof it === 'object' && it !== null) {
          const u = extractUrl(it);
          if (u) return fixUrl(u);
        }
      }
    } else if (typeof obj.outputs === 'object' && obj.outputs !== null) {
      const u = extractUrl(obj.outputs);
      if (u) return fixUrl(u);
    }
  }

  return fixUrl(deepFindUrl(obj));
}

/**
 * Map Speedx detail status (0/1/2/3) to internal task status.
 *   0 init, 1 running  → "running"
 *   2 succeeded        → "succeeded"
 *   3 failed           → "failed"
 * @param {number} s
 * @returns {"running"|"succeeded"|"failed"}
 */
function mapApiStatus(s) {
  if (s === 2) return 'succeeded';
  if (s === 3) return 'failed';
  return 'running';
}

/**
 * Decide whether an upstream failure is retryable.
 * Retryable: network errors (status 0), HTTP 429, HTTP 5xx,
 * or error messages mentioning timeout/network/fetch/tcp/dns.
 * @param {number} status   HTTP status from Speedx, or 0 for network error.
 * @param {string} [errMsg] Upstream error message.
 * @returns {boolean}
 */
function isRetryableError(status, errMsg) {
  if (status === 0) return true;
  if (status === 429) return true;
  if (status >= 500 && status < 600) return true;
  if (errMsg && /timeout|network|fetch|tcp|dns/i.test(errMsg)) return true;
  return false;
}

// ============================================================
// Auth
// ============================================================

/**
 * Validate ?token= against env.AUTH_TOKEN.
 * @param {URL} url
 * @param {{ AUTH_TOKEN?: string }} env
 * @returns {{ ok: true } | { ok: false, response: Response }}
 */
function requireAuth(url, env) {
  if (!env.AUTH_TOKEN) {
    return { ok: false, response: jsonResponse(500, { error: 'AUTH_TOKEN not configured' }) };
  }
  const token = url.searchParams.get('token');
  if (!token || token !== env.AUTH_TOKEN) {
    return { ok: false, response: jsonResponse(401, { error: 'Unauthorized' }) };
  }
  return { ok: true };
}

/* ★★ R9G-SEC-P1-1（报告 03 · 短期第一条）：**让 token 可以走 Authorization 头**。
   现状问题：`requireAuth(url, env)` 只认 `?token=` ⇒ token 必然进 CF 边缘日志 / 任意中间代理日志 /
   浏览器扩展可见（报告原话「三合一万能口令」）。本函数**完全向后兼容**：头优先、URL 兜底
   —— 老前端（只带 ?token=）零改动照常工作。
   前端配合方式（**无上线顺序约束**）：启动探 `GET /health` 的 `caps.bearerAuth`，
   为真才把头模式打开；旧 Worker 不返该字段 ⇒ 自动回退现状。
   ⚠ 为什么不在本函数里做 Origin 校验：Origin 与"凭据是否正确"是两件事，混在一起会让 401 与 403 无法区分；
     白名单在入口处单独拦（见 fetch 入口的 ALLOWED_ORIGINS 段）。 */
function requireAuthReq(request, env) {
  if (!env.AUTH_TOKEN) {
    return { ok: false, response: jsonResponse(500, { error: 'AUTH_TOKEN not configured' }) };
  }
  const m = /^Bearer\s+(.+)$/i.exec(request.headers.get('Authorization') || '');
  let token = m ? m[1].trim() : '';
  if (!token) token = new URL(request.url).searchParams.get('token') || '';
  if (!token || token !== env.AUTH_TOKEN) {
    return { ok: false, response: jsonResponse(401, { error: 'Unauthorized' }) };
  }
  return { ok: true };
}

/* ★ R9G-SEC-P1-1：**可选** Origin 白名单（env `ALLOWED_ORIGINS`，逗号分隔）。
   · **空 = 不启用** ⇒ 默认行为零变化（不改变你现在的使用方式）。
   · 只拦「带了 Origin 且不在名单里」的请求；不带 Origin 的（curl / Worker 间调用 / 部分 sendBeacon）放行
     —— 因为 Origin 本身可伪造，它防的是"别的网页拿你的页面当代理"，不是防 curl。
   · 填法示例（Worker 变量 ALLOWED_ORIGINS）：https://yxiu23.github.io,https://www.gaze23.work,http://127.0.0.1:5500
   ⚠ 填之前先把自己所有入口都列全，**漏一个就是那个入口全 403**。 */
function originDenied(request, env) {
  const allow = String(env.ALLOWED_ORIGINS || '').trim();
  if (!allow) return null;
  const org = request.headers.get('Origin');
  if (!org) return null;
  const list = allow.split(',').map(s => s.trim()).filter(Boolean);
  if (list.includes(org)) return null;
  return jsonResponse(403, { error: 'Origin not allowed', origin: org });
}

// ============================================================
// Media direct proxy (IMPL-98) — 前端零密钥：上游 Key 全部来自 Worker 变量
//   /media/sf/<path> → https://api.siliconflow.cn/<path>    Authorization: Bearer SILICONFLOW_API_KEY
//   /media/ds/<path> → https://dashscope.aliyuncs.com/<path> Authorization: Bearer DASHSCOPE_API_KEY || LLM_API_KEY
// 透传 GET/POST（JSON / FormData multipart 均原样流转）与白名单头；
// ?token= 鉴权（IMPL-119 实装）后剥除（不转发上游）；响应流式回传 + CORS。
// ============================================================
async function handleMediaProxy(request, env, provider) {
  if (request.method !== 'GET' && request.method !== 'POST' && request.method !== 'OPTIONS') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  // IMPL-119：补 ?token= 鉴权（上方块注释一直声称与 /upload 一致但从未实现——代理可无凭据直用上游 Key）。
  // 前端 /media 调用恒带 token（Api._directReq），零破坏；OPTIONS 已在 fetch 入口 preflight 短路不会到达此处，探测不受影响。
  const auth = requireAuthReq(request, env);
  if (!auth.ok) return auth.response;
  const isSf = provider === 'sf';
  // APIYI（2026-10-01）：第 4 条通道，与 sf/ds 同一套做法（Key 收敛在 Worker 变量、前端零密钥）。
  // 比 sf/ds 多两道：① 端点白名单（本路由带 Key，不当任意代理用）
  //               ② 900s 超时（v2 由 600 提到 900：NB Pro 4K 官方建议 600s 兜底，顶格会撞）（APIYI 明说「客户端超时不会取消上游任务，照样计费」⇒ 闸门不能先断）
  const isApiyi = provider === 'apiyi';
  const key = isApiyi
    ? String(env.APIYI_API_KEY || '')
    : isSf
      ? String(env.SILICONFLOW_API_KEY || '')
      : String(env.DASHSCOPE_API_KEY || env.LLM_API_KEY || '');
  if (!key) {
    return jsonResponse(500, {
      error: isApiyi
        ? 'APIYI_API_KEY not configured（请在 Worker Variables 配置 APIYI 密钥；Key 从 https://api.apiyi.com/token 复制）'
        : isSf
          ? 'SILICONFLOW_API_KEY not configured（请在 Worker Variables 配置硅基流动密钥）'
          : 'DASHSCOPE_API_KEY not configured（未配置时回落 LLM_API_KEY——请确认百炼密钥已配）',
    });
  }
  const url = new URL(request.url);
  const sub = url.pathname.replace(/^\/media\/(?:sf|ds|apiyi)/, '');
  if (isApiyi && !apiyiPathAllowed(sub)) {
    return jsonResponse(403, {
      error: 'APIYI 路由仅放行白名单端点，当前路径被拒: ' + sub,
      allowed: APIYI_PATH_PREFIXES,
    });
  }
  const base = isApiyi ? apiyiOrigin(env) : isSf ? 'https://api.siliconflow.cn' : 'https://dashscope.aliyuncs.com';
  const q = new URLSearchParams(url.search);
  q.delete('token');
  const qs = q.toString();
  const upstream = base + (sub.charAt(0) === '/' ? sub : '/' + sub) + (qs ? '?' + qs : '');
  const headers = { Authorization: 'Bearer ' + key };
  const ct = request.headers.get('content-type');
  if (ct) headers['Content-Type'] = ct;
  const xds = request.headers.get('x-dashscope-async');
  if (xds) headers['X-DashScope-Async'] = xds;
  const xew = request.headers.get('x-enable-watermark'); // IMPL-113：水印开关透传（原只白名单放行未转发，水印关闭指令到不了上游）
  if (xew) headers['X-Enable-Watermark'] = xew;

  // 900s 闸门：仅 APIYI 用（sf/ds/wy 保持原状零改动）。abort 只影响上游连接，不会取消上游任务。
  // ⚠★ v2（2026-10-01）：**600000 → 900000**。官方明写 Nano Banana Pro 出 4K「**4K 用 600 秒兜底**」，
  //   而闸门原本正好 600s ⇒ **顶格撞上**，4K 请求会被我们这侧先切断；而「客户端断开不取消上游、照常计费」
  //   ⇒ 切早 = 花了钱拿不到图。留 300s 余量。
  const ctl = isApiyi ? new AbortController() : null;
  const timer = ctl ? setTimeout(() => ctl.abort(), 900000) : null;
  /* ══════════════════════════════════════════════════════════════════════════
     ★★ R9ZI · 慢请求保活（治 Cloudflare **524**）
     ──────────────────────────────────────────────────────────────────────────
     【真根因】CF 的 Proxy Read Timeout = **125 秒**，计的是「源站响应**首字节**」的等待；
       Free/Pro/Business 三档**均不可调**（只有 Enterprise 能把 524 上限提到 6000s）。
       而 APIYI 官转大图 / 4K 实测常超 125s ⇒ 前端那 360s 预算**根本用不上**：
       CF 先在 125s 断连，浏览器拿到 524；而 APIYI 明文「客户端断开**不取消**上游、照常计费」
       ⇒ 最坏情况是**钱扣了、图没拿到**。
     【做法】把「等首字节」变成「立刻有字节」：
       ① `_up` 先发出去（与状态无关）；
       ② 与 **GRACE=50s** 定时器赛跑：
          · 50s 内上游返回 ⇒ **逐字节走原路径**（状态码/头/体全不变，前端零感知）；
          · 超 50s ⇒ 切**保活流**：立刻 200 + chunked（首字节在 50s 发出 ⇒ 远离 125s），
            之后每 BEAT=15s 写一个换行续命；上游返回后把**真实状态码与 body** 用魔数尾包补在后面。
     【三重风控】（缺一不可，任一条不满足就退回原行为）
       ① 仅 **isApiyi** 通道；② 仅 **POST**；③ 仅请求头 **x-aiwork-slow-ok: 1** 存在时
          —— 新版前端才带这个头 ⇒ 旧前端 / 其他消费者 / GET 轮询**行为逐字节不变**。
     【尾包协议】`\u0000R9ZI\u0000<status>\u0000<body>`；前端按**最后一个**魔数切分，
       其前的所有保活换行一并丢弃。⚠ 之所以先回 200 再补真状态码：HTTP 状态码在首字节前
       就已定死，保活流无法中途改状态 ⇒ 只能把真码放进体里（这是本方案唯一的代价，前端已配合解包）。
     ══════════════════════════════════════════════════════════════════════════ */
  const _r9ziKA = isApiyi && request.method === 'POST'
    && String(request.headers.get('x-aiwork-slow-ok') || '') === '1';
  /* ⚠ 两个参数可用 Worker 变量覆盖（**可选**，不配就用默认）—— 给离线验收脚本用，
     也给将来"想调松/调紧"留一个不用改代码的口子。非法/0/负数一律回落默认值。 */
  const _kaGrace = Number((env && env.R9ZI_GRACE_MS) || 0) > 0 ? Number(env.R9ZI_GRACE_MS) : R9ZI_GRACE_MS;
  const _kaBeat = Number((env && env.R9ZI_BEAT_MS) || 0) > 0 ? Number(env.R9ZI_BEAT_MS) : R9ZI_BEAT_MS;
  let _r9ziHold = false; // 切了保活流 ⇒ finally 里**不能**清 900s 闸门（上游还在跑，需要它兜底）
  try {
    const _up = globalThis.fetch(upstream, {
      method: request.method,
      headers,
      body: request.method === 'POST' ? request.body : undefined,
      signal: ctl ? ctl.signal : undefined,
    });
    if (_r9ziKA) {
      const _race = await Promise.race([
        _up.then((x) => ({ t: 'done', x })).catch((e) => ({ t: 'err', e })),
        new Promise((res) => setTimeout(() => res({ t: 'slow' }), _kaGrace)),
      ]);
      if (_race.t === 'err') throw _race.e;
      if (_race.t === 'slow') {
        _r9ziHold = true;
        return r9ziKeepalive(_up, _kaBeat);
      }
    }
    const resp = await _up;
    const rct = resp.headers.get('content-type') || 'application/json';
    const out = {
      'Content-Type': rct,
      'Access-Control-Allow-Origin': '*',
    };
    if (isApiyi) out['X-Apiyi-Status'] = String(resp.status);
    return new Response(resp.body, { status: resp.status, headers: out });
  } catch (e) {
    return jsonResponse(502, {
      error: '媒体代理上游请求失败: ' + String(e && e.message || e),
      ...(isApiyi ? { note: 'APIYI 侧超时/网络错误；客户端超时不取消上游任务，可能仍会计费' } : {}),
    });
  } finally {
    if (timer && !_r9ziHold) clearTimeout(timer);
  }
}

/* ★★ R9ZI · 保活响应体：把「等待中的上游 fetch」包成一条持续吐字节的流。
   ⚠ 三条不能省：
     ① 首字节必须**同步** enqueue（在 start 里第一行）—— 否则 CF 仍按「源站没响应」计时；
     ② 心跳的 enqueue 要 try/catch —— 客户端提前断开时 controller 已 closed，抛错会打死整个流；
     ③ 上游返回/报错/闸门 abort 三条路径都要 clearInterval + close，不然定时器泄漏。 */
function r9ziKeepalive(upPromise, beatMs) {
  const enc = new TextEncoder();
  const body = new ReadableStream({
    async start(ctrl) {
      /* ★ R9ZX：心跳用**合法的 SSE 注释行**（`:` 开头 + 空行）。
         为什么要改成 SSE 形态：CF 对 `text/event-stream` 有明确的"流式直通、不缓冲"处理，
         而普通 text/plain 的 chunked 响应有被边缘缓冲的可能（缓冲 ⇒ 首字节一直不出去 ⇒ 524）。
         ⚠ 对前端**零影响**：解包是按最后一个魔数切的，心跳字节是什么都无所谓。 */
      const beat = () => { try { ctrl.enqueue(enc.encode(':\n\n')); } catch (_e) { /* 客户端已断开 */ } };
      beat();
      const iv = setInterval(beat, (Number(beatMs) > 0 ? Number(beatMs) : R9ZI_BEAT_MS));
      let st = 502;
      let txt = '';
      try {
        const resp = await upPromise;
        st = resp.status;
        txt = await resp.text();
      } catch (e) {
        txt = JSON.stringify({
          error: '媒体代理上游请求失败: ' + String(e && e.message || e),
          note: '保活流内上游失败；APIYI 侧超时/网络错误，客户端超时不取消上游任务，可能仍会计费',
        });
      }
      clearInterval(iv);
      try { ctrl.enqueue(enc.encode(R9ZI_MAGIC + st + '\u0000' + txt)); } catch (_e) { /* 同上 */ }
      try { ctrl.close(); } catch (_e) { /* 同上 */ }
    },
  });
  return new Response(body, {
    status: 200,
    headers: {
      // text/plain 而非 application/json：保活期体里全是换行，声明 JSON 会让浏览器/中间层试图解析
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store',
      /* ★ R9ZX：nginx 系的"别缓冲"惯例头（CF 若认，可避免边缘把流攒起来）。 */
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
      // ⚠ 自定义响应头必须 Expose 才可被前端 JS 读到（否则 res.headers.get() 恒 null ⇒ 解包失效）
      'Access-Control-Expose-Headers': 'X-Aiwork-Keepalive',
      'X-Aiwork-Keepalive': '1',
    },
  });
}

// ============================================================
// Wuyinkeji (速创) direct proxy (IMPL-150 Z17) — 前端零密钥：上游 Key 来自 Worker 变量
//   /media/wy/<path> → https://api.wuyinkeji.com/<path>   Authorization: SPEEDX_KEY（速创形态：密钥本体，无 Bearer）
// 透传 GET/POST（JSON body 原样流转）；?token= 鉴权（与 /media/sf|ds 同形态，在函数内实装）后剥除（不转发上游）；
// 响应流式回传 + CORS。上游路由：/api/async/image_gpt_2.5[_flare|_sunburst]（提交）
// 与 /api/async/detail?id=（轮询）——前端 studioEdits 异步闭环（IMPL-150 Z19/Z20，4s 轮询 / 30min 上限）。
// 零新增 Secret：复用任务中心同一把 env.SPEEDX_KEY（可选别名 WY_KEY）。
// ============================================================
async function handleWyProxy(request, env) {
  if (request.method !== 'GET' && request.method !== 'POST' && request.method !== 'OPTIONS') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }
  // 与 handleMediaProxy 同形态：?token= 鉴权（OPTIONS 已在 fetch 入口 preflight 短路不会到达此处，探测不受影响）。
  const auth = requireAuthReq(request, env);
  if (!auth.ok) return auth.response;
  const key = String(env.SPEEDX_KEY || env.WY_KEY || '');
  if (!key) {
    return jsonResponse(500, {
      error: 'SPEEDX_KEY not configured（请在 Worker Variables 配置速创密钥——与任务中心 /task 同一把，无需新增；或用别名 WY_KEY）',
    });
  }
  const url = new URL(request.url);
  const sub = url.pathname.replace(/^\/media\/wy/, '');
  const q = new URLSearchParams(url.search);
  q.delete('token');
  const qs = q.toString();
  const upstream = SPEEDX_BASE + (sub.charAt(0) === '/' ? sub : '/' + sub) + (qs ? '?' + qs : '');
  const headers = { Authorization: key }; // 速创形态：密钥本体直接作鉴权头（与 submitToSpeedx 同源同 key）
  const ct = request.headers.get('content-type');
  if (ct) headers['Content-Type'] = ct;

  try {
    const resp = await globalThis.fetch(upstream, {
      method: request.method,
      headers,
      body: request.method === 'POST' ? request.body : undefined,
    });
    const rct = resp.headers.get('content-type') || 'application/json';
    return new Response(resp.body, {
      status: resp.status,
      headers: {
        'Content-Type': rct,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e) {
    return jsonResponse(502, { error: '速创代理上游请求失败: ' + String(e && e.message || e) });
  }
}

// ============================================================
// Speedx API forwarding
// ============================================================

/**
 * Forward a task body to a Speedx async endpoint.
 * The Authorization header carries SPEEDX_KEY verbatim (no Bearer prefix).
 * @param {{ SPEEDX_KEY: string }} env
 * @param {string} endpoint  Path beginning with /api/async/
 * @param {unknown} body     JSON-serializable request body.
 * @returns {Promise<{ status: number, ok: boolean, data: unknown|null, networkError: boolean }>}
 */
async function submitToSpeedx(env, endpoint, body) {
  try {
    const resp = await globalThis.fetch(`${SPEEDX_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: env.SPEEDX_KEY,
      },
      body: JSON.stringify(body),
    });
    const text = await resp.text();
    let data = null;
    if (text) {
      try { data = JSON.parse(text); } catch { data = null; }
    }
    return { status: resp.status, ok: resp.ok, data, networkError: false };
  } catch (e) {
    return { status: 0, ok: false, data: null, networkError: true, error: e.message };
  }
}

/**
 * Query Speedx detail API for a task's current status & result.
 * @param {{ SPEEDX_KEY: string }} env
 * @param {string} apiId  The id returned by the original submit call.
 * @returns {Promise<{ status: number, ok: boolean, data: unknown|null }>}
 */
async function getDetailFromSpeedx(env, apiId) {
  try {
    const resp = await globalThis.fetch(
      `${SPEEDX_BASE}${SPEEDX_DETAIL_PATH}?id=${encodeURIComponent(apiId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: env.SPEEDX_KEY,
        },
      },
    );
    const text = await resp.text();
    let data = null;
    if (text) {
      try { data = JSON.parse(text); } catch { data = null; }
    }
    return { status: resp.status, ok: resp.ok, data };
  } catch (e) {
    return { status: 0, ok: false, data: null };
  }
}

// ============================================================
// KV index helpers
// ============================================================

/**
 * Read a JSON-array index key from KV. Returns [] on missing/invalid.
 * @param {{ TASKS: KVNamespace }} env
 * @param {string} key
 * @returns {Promise<string[]>}
 */
async function getIndex(env, key) {
  const raw = await env.TASKS.get(key);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/**
 * Overwrite an index key with a JSON array.
 * @param {{ TASKS: KVNamespace }} env
 * @param {string} key
 * @param {string[]} arr
 */
async function putIndex(env, key, arr) {
  await env.TASKS.put(key, JSON.stringify(arr));
}

/**
 * Append an ID to an index key (dedup, no ordering guarantees).
 * @param {{ TASKS: KVNamespace }} env
 * @param {string} key
 * @param {string} id
 */
async function addToIndex(env, key, id) {
  const arr = await getIndex(env, key);
  if (!arr.includes(id)) {
    arr.push(id);
    await putIndex(env, key, arr);
  }
}

/**
 * Remove an ID from an index key (no-op if absent).
 * @param {{ TASKS: KVnamespace }} env
 * @param {string} key
 * @param {string} id
 */
async function removeFromIndex(env, key, id) {
  const arr = await getIndex(env, key);
  const i = arr.indexOf(id);
  if (i >= 0) {
    arr.splice(i, 1);
    await putIndex(env, key, arr);
  }
}

/**
 * Move an ID from idx:active to idx:recent (most-recent-first, capped at RECENT_MAX).
 * @param {{ TASKS: KVNamespace }} env
 * @param {string} id
 */
async function moveToRecent(env, id) {
  await removeFromIndex(env, ACTIVE_INDEX_KEY, id);
  const recent = await getIndex(env, RECENT_INDEX_KEY);
  if (!recent.includes(id)) {
    recent.unshift(id);
    if (recent.length > RECENT_MAX) recent.length = RECENT_MAX;
    await putIndex(env, RECENT_INDEX_KEY, recent);
  }
}

// ============================================================
// Daily rate limit
// ============================================================

/**
 * Check whether the daily submission limit has been reached.
 * Uses a single global counter (single-tenant AUTH_TOKEN model).
 * @param {{ TASKS: KVNamespace, LIMIT_DAILY?: string }} env
 * @returns {Promise<{ ok: boolean, limit: number, count: number, key?: string }>}
 */
async function checkDailyLimit(env) {
  const limit = parseInt(env.LIMIT_DAILY || '200', 10) || 200;
  const today = new Date().toISOString().slice(0, 10);
  const key = `cnt:${today}`;
  const raw = await env.TASKS.get(key);
  const count = raw ? parseInt(raw, 10) || 0 : 0;
  if (count >= limit) return { ok: false, limit, count };
  return { ok: true, limit, count, key };
}

/**
 * Increment the daily counter, with ~25h TTL so it self-expires.
 * @param {{ TASKS: KVNamespace }} env
 * @param {string} key  The counter key returned by checkDailyLimit.
 */
async function incrDailyCount(env, key) {
  const raw = await env.TASKS.get(key);
  const count = raw ? parseInt(raw, 10) || 0 : 0;
  await env.TASKS.put(key, String(count + 1), { expirationTtl: COUNTER_TTL_SEC });
}

// ============================================================
// Task record read/write
// ============================================================

/**
 * Read a task record (single / pipeline / chain) by id.
 * @param {{ TASKS: KVNamespace }} env
 * @param {string} id
 * @returns {Promise<object|null>}
 */
async function getTask(env, id) {
  const raw = await env.TASKS.get(`task:${id}`);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

/**
 * Persist a task record. Sets updatedAt on every write for conflict detection.
 * @param {{ TASKS: KVNamespace }} env
 * @param {object} task
 */
async function putTask(env, task) {
  task.updatedAt = nowSec();
  await env.TASKS.put(`task:${task.id}`, JSON.stringify(task), {
    expirationTtl: TASK_TTL_SEC,
  });
}

/**
 * Optimistic update: re-read the task and only persist if updatedAt is unchanged
 * since the caller read it. Used by the cron to avoid clobbering concurrent
 * API-driven writes (cancel/delete) — KV is last-write-wins.
 * @param {{ TASKS: KVNamespace }} env
 * @param {object} task   The task as the caller currently sees it.
 * @returns {Promise<boolean>} true if the write succeeded.
 */
async function putTaskIfFresh(env, task) {
  const fresh = await getTask(env, task.id);
  if (fresh && fresh.updatedAt > task.updatedAt) {
    return false; // a newer write happened; skip
  }
  await putTask(env, task);
  return true;
}

// ============================================================
// Task submission — single / pipeline / chain
// ============================================================

/**
 * Submit a single task.
 *
 * Behavior:
 *   - Validates minimal structure (endpoint, body, modelType).
 *   - Enforces daily rate limit.
 *   - Stores the task as "queued" and adds to idx:active.
 *   - If no `priority` field was supplied → forward to Speedx immediately
 *     (Phase 2 "立即转发" semantics). On retryable failure, leaves as queued
 *     with notBefore = now + RETRY_DELAY_SEC for the cron to retry.
 *   - If `priority` was supplied → leave queued; the cron dispatches under
 *     concurrency caps (Phase 3 batch queue).
 *
 * @param {object} env
 * @param {{
 *   model?: string,
 *   modelType: "image"|"video"|"audio",
 *   endpoint: string,
 *   body: object,
 *   prompt?: string,
 *   cost?: number,
 *   priority?: number,
 * }} payload
 * @returns {Promise<{ ok: true, task: object } | { ok: false, status: number, error: string }>}
 */
async function submitSingleTask(env, payload) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, status: 400, error: 'Invalid payload' };
  }
  if (!payload.endpoint || typeof payload.endpoint !== 'string' || !payload.endpoint.startsWith('/api/')) {
    return { ok: false, status: 400, error: 'endpoint must be a string starting with /api/' };
  }
  if (!payload.body || typeof payload.body !== 'object') {
    return { ok: false, status: 400, error: 'body must be an object' };
  }
  if (!['image', 'video', 'audio'].includes(payload.modelType)) {
    return { ok: false, status: 400, error: 'modelType must be one of image|video|audio' };
  }

  const limitCheck = await checkDailyLimit(env);
  if (!limitCheck.ok) {
    return {
      ok: false,
      status: 429,
      error: `Daily limit reached (${limitCheck.count}/${limitCheck.limit})`,
    };
  }

  const now = nowSec();
  const hasPriority = payload.priority !== undefined && payload.priority !== null;

  /** @type {object} */
  const task = {
    id: genId('tc'),
    kind: 'single',
    model: payload.model || '',
    modelType: payload.modelType,
    endpoint: payload.endpoint,
    body: payload.body,
    prompt: payload.prompt || '',
    status: 'queued',
    apiId: null,
    resultUrl: null,
    error: null,
    createdAt: now,
    updatedAt: now,
    finishedAt: 0,
    attempts: 0,
    cost: typeof payload.cost === 'number' ? payload.cost : 0,
    priority: hasPriority ? Number(payload.priority) : 0,
    notBefore: 0,
  };

  await putTask(env, task);
  await addToIndex(env, ACTIVE_INDEX_KEY, task.id);
  await incrDailyCount(env, limitCheck.key);

  // Priority-queued tasks are dispatched by the cron under concurrency caps.
  if (hasPriority) {
    return { ok: true, task };
  }

  // Phase 2: forward immediately so the user sees "running" right away.
  await forwardTaskToSpeedx(env, task);
  return { ok: true, task };
}

/**
 * Forward a queued task to Speedx and update its state.
 *
 * On success: status=running, apiId set.
 * On retryable failure (429/5xx/network) with attempts<MAX_ATTEMPTS:
 *   attempts++, notBefore = now + RETRY_DELAY_SEC, status stays queued.
 * On non-retryable failure or attempts exhausted: status=failed, moved to recent.
 *
 * @param {object} env
 * @param {object} task  Mutated in place and persisted.
 */
async function forwardTaskToSpeedx(env, task) {
  const resp = await submitToSpeedx(env, task.endpoint, task.body);

  if (resp.ok && resp.data && resp.data.data && resp.data.data.id) {
    task.apiId = resp.data.data.id;
    task.status = 'running';
    task.error = null;
    await putTask(env, task);
    return;
  }

  const msg = (resp.data && resp.data.msg) || (resp.networkError ? 'network error' : `upstream ${resp.status}`);

  if (isRetryableError(resp.status, msg) && task.attempts < MAX_ATTEMPTS) {
    task.attempts += 1;
    task.notBefore = nowSec() + RETRY_DELAY_SEC;
    task.error = msg;
    await putTask(env, task);
    return;
  }

  task.status = 'failed';
  task.error = msg;
  task.finishedAt = nowSec();
  await putTask(env, task);
  await moveToRecent(env, task.id);
}

/**
 * Submit a pipeline (multi-step workflow). Step 1 is dispatched immediately;
 * subsequent steps are dispatched by the cron when the prior step succeeds.
 *
 * Payload shape:
 *   {
 *     kind: "pipeline",
 *     prompt?: string,
 *     cost?: number,
 *     steps: [
 *       { type, model?, modelType, endpoint, body, needs: [] },
 *       { type, model?, modelType, endpoint, body, needs: ["audioUrl"] },
 *       ...
 *     ]
 *   }
 *
 * The `needs` array on step N names the body keys that should be filled from
 * step N-1's resultUrl before submission. e.g. step 2 needs ["audioUrl"]
 * means step 1's audio URL is written to step2.body.audioUrl.
 *
 * @param {object} env
 * @param {object} payload
 * @returns {Promise<{ ok: true, task: object } | { ok: false, status: number, error: string }>}
 */
async function submitPipeline(env, payload) {
  if (!Array.isArray(payload?.steps) || payload.steps.length === 0) {
    return { ok: false, status: 400, error: 'Pipeline requires non-empty steps array' };
  }
  const limitCheck = await checkDailyLimit(env);
  if (!limitCheck.ok) {
    return {
      ok: false,
      status: 429,
      error: `Daily limit reached (${limitCheck.count}/${limitCheck.limit})`,
    };
  }

  const now = nowSec();
  /** @type {object} */
  const pipeline = {
    id: genId('pl'),
    kind: 'pipeline',
    steps: payload.steps.map((s, i) => ({
      seq: i + 1,
      type: s.type || '',
      model: s.model || s.type || '',
      modelType: s.modelType,
      endpoint: s.endpoint,
      body: s.body || {},
      needs: Array.isArray(s.needs) ? s.needs : [],
      status: 'pending',
      taskId: null,
      resultUrl: null,
      error: null,
    })),
    current: 1,
    status: 'running',
    failedStep: null,
    createdAt: now,
    updatedAt: now,
    finishedAt: 0,
    prompt: payload.prompt || '',
    cost: typeof payload.cost === 'number' ? payload.cost : 0,
  };

  await putTask(env, pipeline);
  await addToIndex(env, ACTIVE_INDEX_KEY, pipeline.id);
  await incrDailyCount(env, limitCheck.key);

  // Dispatch step 1 immediately (best-effort). On failure, the cron will retry.
  await startPipelineStep(env, pipeline, 1);
  return { ok: true, task: pipeline };
}

/**
 * Start a pipeline step by creating a child single task with priority=10
 * (so it skips immediate forward and goes through the cron queue).
 *
 * Fills the step's `needs` body keys from the prior step's resultUrl.
 * On submit failure (rate limit), marks the pipeline as failed with failedStep.
 *
 * @param {object} env
 * @param {object} pipeline  Mutated in place.
 * @param {number} seq       1-based step index.
 */
async function startPipelineStep(env, pipeline, seq) {
  const step = pipeline.steps[seq - 1];
  if (!step) return;

  if (seq > 1) {
    const prev = pipeline.steps[seq - 2];
    if (prev && prev.resultUrl) {
      for (const need of step.needs) {
        step.body[need] = prev.resultUrl;
      }
    }
  }

  const childResp = await submitSingleTask(env, {
    model: step.model,
    modelType: step.modelType,
    endpoint: step.endpoint,
    body: step.body,
    prompt: step.body?.prompt || '',
    cost: 0,
    priority: 10,
  });

  if (!childResp.ok) {
    step.status = 'failed';
    step.error = childResp.error;
    pipeline.status = 'failed';
    pipeline.failedStep = seq;
    pipeline.finishedAt = nowSec();
    await putTask(env, pipeline);
    await moveToRecent(env, pipeline.id);
    return;
  }

  step.taskId = childResp.task.id;
  step.status = 'running';
  pipeline.current = seq;
  await putTask(env, pipeline);
}

/**
 * Submit a chain (long-video segments). Segment 1 is dispatched immediately.
 * Subsequent segments are dispatched by the frontend calling
 * POST /chain/<id>/advance with the prior segment's tailFrameUrl.
 *
 * Payload shape:
 *   {
 *     kind: "chain",
 *     segments: [{ prompt: "..." }, ...],
 *     stylePrefix?: string,
 *     refImages?: string[],
 *     segmentSeconds?: number,
 *     endpoint?: string,        // default /api/async/video_wan_3.0
 *     model?: string,           // default "wan3"
 *     modelType?: string,       // default "video"
 *     cost?: number,
 *   }
 *
 * @param {object} env
 * @param {object} payload
 * @returns {Promise<{ ok: true, task: object } | { ok: false, status: number, error: string }>}
 */
async function submitChain(env, payload) {
  if (!Array.isArray(payload?.segments) || payload.segments.length === 0) {
    return { ok: false, status: 400, error: 'Chain requires non-empty segments array' };
  }
  const limitCheck = await checkDailyLimit(env);
  if (!limitCheck.ok) {
    return {
      ok: false,
      status: 429,
      error: `Daily limit reached (${limitCheck.count}/${limitCheck.limit})`,
    };
  }

  const now = nowSec();
  /** @type {object} */
  const chain = {
    id: genId('ch'),
    kind: 'chain',
    segments: payload.segments.map((s, i) => ({
      seq: i + 1,
      taskId: null,
      status: 'pending',
      resultUrl: null,
      tailFrameUrl: null,
      prompt: s.prompt || '',
    })),
    stylePrefix: payload.stylePrefix || '',
    refImages: Array.isArray(payload.refImages) ? payload.refImages : [],
    segmentSeconds: payload.segmentSeconds || 30,
    endpoint: payload.endpoint || '/api/async/video_wan_3.0',
    model: payload.model || 'wan3',
    modelType: payload.modelType || 'video',
    current: 1,
    status: 'running',
    createdAt: now,
    updatedAt: now,
    finishedAt: 0,
    cost: typeof payload.cost === 'number' ? payload.cost : 0,
  };

  await putTask(env, chain);
  await addToIndex(env, ACTIVE_INDEX_KEY, chain.id);
  await incrDailyCount(env, limitCheck.key);

  await startChainSegment(env, chain, 1);
  return { ok: true, task: chain };
}

/**
 * Start a chain segment by creating a child single task.
 *
 * The body is built from:
 *   - prompt = stylePrefix + " " + segment.prompt
 *   - duration = segmentSeconds
 *   - first_frame = previous segment's tailFrameUrl (if present)
 *   - images = chain.refImages joined with comma (if present)
 *
 * @param {object} env
 * @param {object} chain  Mutated in place.
 * @param {number} seq    1-based segment index.
 */
async function startChainSegment(env, chain, seq) {
  const seg = chain.segments[seq - 1];
  if (!seg) return;

  /** @type {object} */
  const body = {
    prompt: (chain.stylePrefix ? chain.stylePrefix + ' ' : '') + seg.prompt,
    duration: String(chain.segmentSeconds),
  };
  if (seq > 1 && chain.segments[seq - 2].tailFrameUrl) {
    body.first_frame = chain.segments[seq - 2].tailFrameUrl;
  }
  if (chain.refImages && chain.refImages.length > 0) {
    body.images = chain.refImages.join(',');
  }

  const childResp = await submitSingleTask(env, {
    model: chain.model,
    modelType: chain.modelType,
    endpoint: chain.endpoint,
    body,
    prompt: body.prompt,
    cost: 0,
    priority: 10,
  });

  if (!childResp.ok) {
    seg.status = 'failed';
    seg.error = childResp.error;
    chain.status = 'failed';
    chain.finishedAt = nowSec();
    await putTask(env, chain);
    await moveToRecent(env, chain.id);
    return;
  }

  seg.taskId = childResp.task.id;
  seg.status = 'running';
  chain.current = seq;
  await putTask(env, chain);
}

// ============================================================
// HTTP route handlers
// ============================================================

/**
 * Handle R2 file upload. Backward compatible with existing frontend:
 * FormData with "file" field → returns { url, fileUrl, publicUrl }.
 *
 * @param {Request} request
 * @param {object} env
 * @returns {Promise<Response>}
 */
async function handleUpload(request, env, dir) {
  if (!env.AI_BUCKET) {
    return jsonResponse(500, { error: 'AI_BUCKET not bound' });
  }
  const ct = request.headers.get('content-type') || '';
  // V26.9.11: sanitize dir param — only allow alphanumeric (defined here for all paths)
  const safeDir = (dir || 'uploads').replace(/[^a-zA-Z0-9_-]/g, '') || 'uploads';

  if (ct.startsWith('multipart/form-data')) {
    // Clone the request so we can fall back to manual binary parsing if formData()
    // misbehaves (some legacy Workers runtimes returned File fields as string).
    const requestClone = request.clone();

    // Primary path: Workers' formData() returns File objects (Blob subclass) for
    // file fields — this is fully binary-safe and the runtime handles multipart
    // parsing internally without any text-decode of the body.
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      if (file && typeof file !== 'string' && typeof file.stream === 'function') {
        const fileName = file.name || 'file';
        const fileType = file.type || 'application/octet-stream';
        const ext = fileName.split('.').pop().toLowerCase() || 'bin';
        const key = `${safeDir}/${nowSec()}-${genId('r2')}.${ext}`;
        await env.AI_BUCKET.put(key, file.stream(), {
          httpMetadata: { contentType: fileType, cacheControl: 'public, max-age=31536000, immutable' },
        });
        const base = env.PUBLIC_BASE_URL ? String(env.PUBLIC_BASE_URL).replace(/\/$/, '') : '';
        const publicUrl = base ? `${base}/${key}` : `r2://${key}`;
        return jsonResponse(200, { url: publicUrl, fileUrl: publicUrl, publicUrl });
      }
      // file is missing or returned as string → fall through to binary-safe parser.
    } catch {
      // formData() threw → fall through to binary-safe parser.
    }

    // Fallback: binary-safe manual multipart parser.
    // CRITICAL: Never use TextDecoder on the request body — that decodes binary
    // image bytes as UTF-8 text and replaces every invalid byte (e.g. PNG's 0x89
    // magic byte) with U+FFFD, irrecoverably corrupting the file. We operate
    // entirely on Uint8Array: headers are decoded as latin1 (lossless for all
    // 256 byte values), and the file body is sliced directly as bytes.
    return await parseMultipartBinary(requestClone, env, ct, safeDir);
  }

  // Raw body upload (no multipart) — treat entire body as the file.
  const file = await request.arrayBuffer();
  if (!file || file.byteLength === 0) {
    return jsonResponse(400, { error: 'Empty request body' });
  }
  const dispo = request.headers.get('content-disposition') || '';
  const m = /filename="?([^";\s]+)"?/i.exec(dispo);
  const fileName = m ? m[1] : 'file';
  const fileType = request.headers.get('content-type') || 'application/octet-stream';
  const ext = fileName.split('.').pop().toLowerCase() || 'bin';
  const key = `${safeDir}/${nowSec()}-${genId('r2')}.${ext}`;
  await env.AI_BUCKET.put(key, file, {
    httpMetadata: { contentType: fileType, cacheControl: 'public, max-age=31536000, immutable' },
  });
  const base = env.PUBLIC_BASE_URL ? String(env.PUBLIC_BASE_URL).replace(/\/$/, '') : '';
  const publicUrl = base ? `${base}/${key}` : `r2://${key}`;
  return jsonResponse(200, { url: publicUrl, fileUrl: publicUrl, publicUrl });
}

/**
 * Binary-safe multipart/form-data parser — fallback for environments where
 * request.formData() is unavailable or returns File fields as strings.
 *
 * Operates entirely on Uint8Array. Headers are decoded as latin1 (lossless for
 * byte values 0–255); the file body is sliced directly as bytes and never
 * passes through TextDecoder/TextEncoder (which would corrupt binary data).
 *
 * @param {Request} request   A fresh/unconsumed request (use request.clone()).
 * @param {object} env
 * @param {string} ct         The original Content-Type header value.
 * @returns {Promise<Response>}
 */
async function parseMultipartBinary(request, env, ct, safeDir) {
  const boundary = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(ct);
  if (!boundary) return jsonResponse(400, { error: 'No boundary in content-type' });
  const bndStr = '--' + (boundary[1] || boundary[2]).trim();
  // Boundary strings are ASCII; TextEncoder is safe here (we never touch the body).
  const bndBytes = new TextEncoder().encode(bndStr);

  const rawBody = new Uint8Array(await request.arrayBuffer());

  // Locate every boundary occurrence in the byte stream.
  const positions = [];
  for (let i = 0; i + bndBytes.length <= rawBody.length; i++) {
    let match = true;
    for (let j = 0; j < bndBytes.length; j++) {
      if (rawBody[i + j] !== bndBytes[j]) { match = false; break; }
    }
    if (match) { positions.push(i); i += bndBytes.length - 1; }
  }
  if (positions.length < 2) {
    return jsonResponse(400, { error: 'Malformed multipart body' });
  }

  // Header/body separator: \r\n\r\n (0x0D 0x0A 0x0D 0x0A).
  const CRLFCRLF = [0x0D, 0x0A, 0x0D, 0x0A];
  const findSubarray = (arr, sub, start, end) => {
    for (let i = start; i + sub.length <= end; i++) {
      let match = true;
      for (let j = 0; j < sub.length; j++) {
        if (arr[i + j] !== sub[j]) { match = false; break; }
      }
      if (match) return i;
    }
    return -1;
  };

  // Decode a byte slice as latin1 (each byte → one char; lossless for all byte values).
  // Used ONLY for part headers, never for the file body.
  const decodeLatin1 = (arr, start, end) => {
    let s = '';
    for (let i = start; i < end; i++) s += String.fromCharCode(arr[i]);
    return s;
  };

  for (let p = 0; p + 1 < positions.length; p++) {
    // Part starts after the boundary marker and the trailing CRLF.
    let partStart = positions[p] + bndBytes.length;
    if (partStart + 1 < rawBody.length &&
        rawBody[partStart] === 0x0D && rawBody[partStart + 1] === 0x0A) {
      partStart += 2;
    }
    // Part ends at the next boundary, minus the trailing CRLF that precedes it.
    let partEnd = positions[p + 1];
    if (partEnd >= 2 &&
        rawBody[partEnd - 2] === 0x0D && rawBody[partEnd - 1] === 0x0A) {
      partEnd -= 2;
    }
    if (partEnd <= partStart) continue;

    const sepPos = findSubarray(rawBody, CRLFCRLF, partStart, partEnd);
    if (sepPos === -1) continue;

    const headerStr = decodeLatin1(rawBody, partStart, sepPos);
    const bodyStart = sepPos + CRLFCRLF.length;
    const bodyEnd = partEnd;

    const cdMatch = /Content-Disposition: form-data;[^]*?name="([^"]+)"(?:;\s*filename="([^"]*)")?/i.exec(headerStr);
    if (!cdMatch || cdMatch[1] !== 'file') continue;
    const fileName = cdMatch[2] || 'file';
    const ctMatch = /Content-Type:\s*([^\r\n]+)/i.exec(headerStr);
    const fileType = ctMatch ? ctMatch[1].trim() : 'application/octet-stream';

    // Slice body bytes directly — NO text-encoding conversion.
    // .slice() on Uint8Array returns a new Uint8Array copy; R2 accepts it as-is.
    const fileBytes = rawBody.slice(bodyStart, bodyEnd);

    const ext = fileName.split('.').pop().toLowerCase() || 'bin';
    const key = `${safeDir}/${nowSec()}-${genId('r2')}.${ext}`;
    await env.AI_BUCKET.put(key, fileBytes, {
      httpMetadata: { contentType: fileType, cacheControl: 'public, max-age=31536000, immutable' },
    });
    const base = env.PUBLIC_BASE_URL ? String(env.PUBLIC_BASE_URL).replace(/\/$/, '') : '';
    const publicUrl = base ? `${base}/${key}` : `r2://${key}`;
    return jsonResponse(200, { url: publicUrl, fileUrl: publicUrl, publicUrl });
  }

  return jsonResponse(400, { error: 'No "file" field found in multipart data' });
}

/**
 * Handle GET /tasks — returns active tasks plus the most recent 20 completed.
 * @param {object} env
 * @returns {Promise<Response>}
 */
async function handleListTasks(env) {
  const activeIds = await getIndex(env, ACTIVE_INDEX_KEY);
  const recentIds = (await getIndex(env, RECENT_INDEX_KEY)).slice(0, RECENT_RETURN);

  const [active, recent] = await Promise.all([
    Promise.all(activeIds.map((id) => getTask(env, id))),
    Promise.all(recentIds.map((id) => getTask(env, id))),
  ]);

  return jsonResponse(200, {
    active: active.filter(Boolean),
    recent: recent.filter(Boolean),
  });
}

/**
 * Handle GET /task/<id>.
 * @param {object} env
 * @param {string} id
 * @returns {Promise<Response>}
 */
async function handleGetTask(env, id) {
  const task = await getTask(env, id);
  if (!task) return jsonResponse(404, { error: 'Task not found' });
  return jsonResponse(200, { task });
}

/**
 * Handle POST /task/<id>/cancel.
 * Marks the task (and any active child task) as canceled and moves to recent.
 * @param {object} env
 * @param {string} id
 * @returns {Promise<Response>}
 */
async function handleCancelTask(env, id) {
  const task = await getTask(env, id);
  if (!task) return jsonResponse(404, { error: 'Task not found' });

  task.status = 'canceled';
  task.finishedAt = nowSec();
  await putTask(env, task);

  // For pipelines / chains, cancel the currently-running child task as well.
  if (task.kind === 'pipeline') {
    const step = task.steps[task.current - 1];
    if (step && step.taskId) {
      const child = await getTask(env, step.taskId);
      if (child && (child.status === 'queued' || child.status === 'running')) {
        child.status = 'canceled';
        child.finishedAt = nowSec();
        await putTask(env, child);
        await moveToRecent(env, child.id);
      }
    }
  } else if (task.kind === 'chain') {
    const seg = task.segments[task.current - 1];
    if (seg && seg.taskId) {
      const child = await getTask(env, seg.taskId);
      if (child && (child.status === 'queued' || child.status === 'running')) {
        child.status = 'canceled';
        child.finishedAt = nowSec();
        await putTask(env, child);
        await moveToRecent(env, child.id);
      }
    }
  }

  await moveToRecent(env, id);
  return jsonResponse(200, { task });
}

/**
 * Handle DELETE /task/<id>.
 * Hard-deletes the task record and removes it from both index keys.
 * @param {object} env
 * @param {string} id
 * @returns {Promise<Response>}
 */
async function handleDeleteTask(env, id) {
  const task = await getTask(env, id);
  if (!task) return jsonResponse(404, { error: 'Task not found' });
  await env.TASKS.delete(`task:${id}`);
  await removeFromIndex(env, ACTIVE_INDEX_KEY, id);
  await removeFromIndex(env, RECENT_INDEX_KEY, id);
  return jsonResponse(200, { ok: true });
}

/**
 * Handle POST /task/<id>/retry.
 *   - single: re-queue the failed task with attempts reset.
 *   - pipeline: restart from failedStep (prior steps' resultUrls preserved).
 *   - chain: restart from ?seq=N (or current), resetting that segment and all later ones.
 * @param {object} env
 * @param {string} id
 * @param {URL} url
 * @returns {Promise<Response>}
 */
async function handleRetryTask(env, id, url) {
  const task = await getTask(env, id);
  if (!task) return jsonResponse(404, { error: 'Task not found' });

  if (task.kind === 'pipeline') {
    if (task.status !== 'failed' || !task.failedStep) {
      return jsonResponse(400, { error: 'Pipeline is not in a retryable state' });
    }
    const seq = task.failedStep;
    const step = task.steps[seq - 1];
    step.status = 'pending';
    step.taskId = null;
    step.resultUrl = null;
    step.error = null;
    task.status = 'running';
    task.failedStep = null;
    task.current = seq;
    task.finishedAt = 0;
    await putTask(env, task);
    await addToIndex(env, ACTIVE_INDEX_KEY, task.id);
    await startPipelineStep(env, task, seq);
    return jsonResponse(200, { task: await getTask(env, id) });
  }

  if (task.kind === 'chain') {
    const seqParam = url.searchParams.get('seq');
    const seq = seqParam ? parseInt(seqParam, 10) : task.current;
    if (!Number.isInteger(seq) || seq < 1 || seq > task.segments.length) {
      return jsonResponse(400, { error: 'Invalid seq parameter' });
    }
    for (let i = seq - 1; i < task.segments.length; i++) {
      task.segments[i].status = 'pending';
      task.segments[i].taskId = null;
      task.segments[i].resultUrl = null;
      task.segments[i].tailFrameUrl = null;
      task.segments[i].error = null;
    }
    task.current = seq;
    task.status = 'running';
    task.finishedAt = 0;
    await putTask(env, task);
    await addToIndex(env, ACTIVE_INDEX_KEY, task.id);
    await startChainSegment(env, task, seq);
    return jsonResponse(200, { task: await getTask(env, id) });
  }

  // single
  if (task.status !== 'failed') {
    return jsonResponse(400, { error: 'Task is not failed' });
  }
  task.status = 'queued';
  task.error = null;
  task.apiId = null;
  task.attempts = 0;
  task.notBefore = 0;
  task.finishedAt = 0;
  await putTask(env, task);
  await addToIndex(env, ACTIVE_INDEX_KEY, task.id);
  // If no priority, forward immediately (Phase 2 semantics).
  if (!task.priority) {
    await forwardTaskToSpeedx(env, task);
  }
  return jsonResponse(200, { task: await getTask(env, id) });
}

/**
 * Handle POST /chain/<id>/advance.
 * Frontend-driven chain advancement: client extracts the prior segment's tail
 * frame (browser canvas), uploads it to R2, then posts { tailFrameUrl } here.
 * The worker stores the tailFrameUrl and dispatches the next segment.
 *
 * No-op if the current segment is not yet succeeded, or if this is the last segment.
 * @param {object} env
 * @param {string} id
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleAdvanceChain(env, id, request) {
  const chain = await getTask(env, id);
  if (!chain || chain.kind !== 'chain') {
    return jsonResponse(404, { error: 'Chain not found' });
  }

  let body = {};
  try { body = await request.json(); } catch { body = {}; }

  const seg = chain.segments[chain.current - 1];
  if (!seg) return jsonResponse(400, { error: 'No current segment' });

  if (typeof body.tailFrameUrl === 'string' && body.tailFrameUrl) {
    seg.tailFrameUrl = fixUrl(body.tailFrameUrl);
  }

  const canAdvance =
    seg.status === 'succeeded' &&
    seg.tailFrameUrl &&
    chain.current < chain.segments.length;

  if (canAdvance) {
    // startChainSegment mutates chain and persists it.
    await startChainSegment(env, chain, chain.current + 1);
  } else {
    await putTask(env, chain);
  }

  return jsonResponse(200, { task: await getTask(env, id) });
}

/**
 * Handle POST /task — dispatch by payload.kind to single/pipeline/chain submit.
 * @param {Request} request
 * @param {object} env
 * @returns {Promise<Response>}
 */
async function handleSubmitTask(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  let result;
  if (payload && payload.kind === 'pipeline') {
    result = await submitPipeline(env, payload);
  } else if (payload && payload.kind === 'chain') {
    result = await submitChain(env, payload);
  } else {
    result = await submitSingleTask(env, payload);
  }

  if (!result.ok) {
    return jsonResponse(result.status || 500, { error: result.error });
  }
  return jsonResponse(200, { task: result.task });
}

// ============================================================
// Userdata sync (历史记录同步) — R2-backed JSON key/value store
// ============================================================

/**
 * Allowed keys for /userdata — alphanumeric only, max 64 chars.
 * Prevents path traversal (no slashes, dots, or special chars).
 */
const USERDATA_KEY_RE = /^[a-zA-Z0-9]{1,64}$/;

/**
 * Handle GET /userdata?key=<key>&token=xxx
 * Reads R2 object "userdata/<key>.json" and returns the parsed JSON.
 * Returns { ok: true, data: null } when the object does not exist (treat
 * missing-key as empty history — the frontend distinguishes via `data`).
 * @param {object} env
 * @param {string} key
 * @returns {Promise<Response>}
 */
async function handleUserdataGet(env, key) {
  if (!env.AI_BUCKET) {
    return jsonResponse(500, { error: 'AI_BUCKET not bound' });
  }
  if (!USERDATA_KEY_RE.test(key)) {
    return jsonResponse(400, { error: 'Invalid key (alphanumeric, 1-64 chars)' });
  }
  const obj = await env.AI_BUCKET.get('userdata/' + key + '.json');
  if (!obj) {
    return jsonResponse(200, { ok: true, data: null });
  }
  const text = await obj.text();
  let data = null;
  try { data = JSON.parse(text); } catch { data = null; }
  return jsonResponse(200, { ok: true, data });
}

/**
 * Handle PUT|POST /userdata?key=<key>&token=xxx
 * Writes the request body (raw JSON) to R2 object "userdata/<key>.json".
 * Body is validated as parseable JSON before storing — refuses garbage so
 * the GET path always returns valid JSON or null.
 *
 * ★★ R79-D（2026-10-07）：history 槽位改为 **服务端 read-merge-write**。
 *   事故背景：前端推送是 `PUT body = 本地 history.slice(0,500)` —— **整体覆盖**。
 *   任何一台设备只要推送，就用它自己的本地列表换掉云端；某台设备本地少/新，
 *   云端就被冲成少量（实测从 105 条掉到 2 条）。
 *   前端已加「先拉后推」（R79-A），但那条路走不通时必须有人兜底：
 *     · 「关页面立即推」用 sendBeacon —— 它**是一次性 POST，无法先 GET**
 *     · 多设备同时推仍有竞态
 *   ⇒ 服务端自己合：读旧值 → 按 id 合并（completedAt/createdAt 较新者胜）→ 写回。
 *   前端不可信；无论谁怎么推，云端只会变多不会变少。
 *
 *   ⚠ 已知取舍：合并只增不减 ⇒ **在本地删掉的历史会被云端合并回来**。
 *     要修需要「墓碑」（前端把被删 id 一起推上来），留到 R80，届时本函数按
 *     `{items:[...], tombstones:[...]}` 识别——旧格式（纯数组）继续兼容。
 *
 *   ★ 同时接受 POST：`navigator.sendBeacon` 只能发 POST，且不能带自定义头
 *     （前端用 text/plain 规避预检），所以这里不能只认 PUT。
 *
 * @param {Request} request
 * @param {object} env
 * @param {string} key
 * @returns {Promise<Response>}
 */
async function handleUserdataWrite(request, env, key) {
  if (!env.AI_BUCKET) {
    return jsonResponse(500, { error: 'AI_BUCKET not bound' });
  }
  if (!USERDATA_KEY_RE.test(key)) {
    return jsonResponse(400, { error: 'Invalid key (alphanumeric, 1-64 chars)' });
  }
  let body = await request.text();
  let parsed = null;
  try { parsed = JSON.parse(body); } catch {
    return jsonResponse(400, { error: 'Body must be valid JSON' });
  }
  const objPath = 'userdata/' + key + '.json';

  /* ★ R80-D 墓碑：本地删掉的历史要能"删到云端"
     R79-D 的服务端合并是"只增不减" ⇒ 本地删除会被合并回来（修：本地有删除云端的设置，这个要能生效）。
     解法：前端把被删 id 写进独立的 key `historytomb`，这边合并 history 时据此剔除。
     ⚠ 刻意用**独立 key** 而不是塞进 history 载荷里（比如 {items,tombstones}）—— 这样即使某处
       还挂着旧版 Worker（只认纯数组），history 同步也照常工作，不会退化成覆盖。 */
  if (key === 'historytomb' && Array.isArray(parsed)) {
    let oldT = [];
    try {
      const t0 = await env.AI_BUCKET.get(objPath);
      if (t0) {
        const j0 = JSON.parse(await t0.text());
        if (Array.isArray(j0)) oldT = j0;
      }
    } catch { oldT = []; }
    const union = new Map();
    const putT = (x) => {
      const id = (x && x.id) || x;
      if (!id) return;
      union.set(String(id), (x && typeof x === 'object') ? x : { id: String(id), at: Date.now() });
    };
    oldT.forEach(putT);
    parsed.forEach(putT);
    const outT = Array.from(union.values()).slice(-5000);
    await env.AI_BUCKET.put(objPath, JSON.stringify(outT), {
      httpMetadata: { contentType: 'application/json; charset=utf-8' },
    });
    return jsonResponse(200, { ok: true, merged: true, kind: 'tomb', count: outT.length });
  }

  const mergeable = (key === 'history') && Array.isArray(parsed);
  let mergedCount = null;
  let droppedByTomb = 0;
  if (mergeable) {
    let old = [];
    let tomb = [];
    try {
      const prev = await env.AI_BUCKET.get(objPath);
      if (prev) {
        const j = JSON.parse(await prev.text());
        if (Array.isArray(j)) old = j;
      }
    } catch { old = []; }
    try {
      const tp = await env.AI_BUCKET.get('userdata/historytomb.json');
      if (tp) {
        const jt = JSON.parse(await tp.text());
        if (Array.isArray(jt)) tomb = jt;
      }
    } catch { tomb = []; }
    const dead = new Set();
    tomb.forEach((x) => { const id = (x && x.id) || x; if (id) dead.add(String(id)); });

    const rank = (h) => (h && ((h.completedAt || 0) || (h.createdAt || 0))) || 0;
    const map = new Map();
    const consider = (h) => {
      if (!h || typeof h !== 'object' || !h.id) return;
      const ex = map.get(h.id);
      if (!ex || rank(h) >= rank(ex)) map.set(h.id, h);
    };
    old.forEach(consider);
    parsed.forEach(consider);
    const mergedAll = Array.from(map.values()).sort((a, b) => ((b.createdAt || 0) - (a.createdAt || 0)));
    const merged = mergedAll.filter((h) => !dead.has(String(h.id)));
    droppedByTomb = mergedAll.length - merged.length;
    mergedCount = merged.length;
    body = JSON.stringify(merged.slice(0, 500));
  }
  await env.AI_BUCKET.put(objPath, body, {
    httpMetadata: { contentType: 'application/json; charset=utf-8' },
  });
  return jsonResponse(200, { ok: true, merged: mergeable, count: mergedCount, dropped: droppedByTomb });
}

// ============================================================
// Result archive (结果转存) — download upstream result → R2 results/
// ============================================================

/* ★ R76-C（2026-10-07）：R2 媒体对象统一加长缓存。
   真机实测：上传时**只设了 contentType、没有 cacheControl** ⇒ 浏览器每次加载都要完整网络往返
   （列表/大图预览/编辑器反复读同一张图时尤其明显）。
   媒体对象内容不变（key 含时间戳+随机 id，天然不可变）⇒ 长缓存 + immutable 是安全的。
   ⚠ 只加在**媒体上传**（/upload 的三种分支 + /archive）；userdata（历史 JSON）**保持不加** —— 它必须读到最新值。 */
/**
 * Allowed file extensions for /archive, mapped to their Content-Type.
 * Used both for validation and for setting R2 httpMetadata.
 */
const ARCHIVE_EXT_CT = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
};

/** Download timeout for /archive subrequests (ms). */
const ARCHIVE_TIMEOUT_MS = 30000;

/**
 * Handle POST /archive?token=xxx&url=<encoded URL>&ext=png
 *
 * Downloads the upstream result URL (速创 / aliyuncs OSS) with a 30s
 * timeout, stores the response body to R2 under results/<ts>-<rand>.<ext>,
 * and returns the public R2 URL. On download failure returns 502 with
 * { ok: false, error }.
 * @param {Request} request
 * @param {object} env
 * @param {string} srcUrl
 * @param {string} ext
 * @returns {Promise<Response>}
 */
// ============================================================
// ★★ R9J-SEC-P1-2：阿里云抠图链路 **服务端化**
//    背景（报告 03 P1-2）：抠图走的是阿里云 VIApi（viapiutils 换 OSS 临时凭证 → 暂存桶 →
//    imageseg 抠图），而**签名必须在持有 SK 的一方做** —— 原来的实现把这一步放在浏览器，
//    于是长效 AccessKeySecret 常驻前端内存（任何 XSS / 恶意扩展读一次就没了）。
//    现在把「签名 + 出网」整体搬到 Worker：前端只发**业务参数**，一个密钥字节都不碰。
//
//    端点（都吃 R9G 那套鉴权：Authorization: Bearer 优先、?token= 兜底）：
//      POST /media/seg/imageseg  body { action, params }  → { ok, data } | { ok:false, code, message }
//      POST /media/seg/stage?ext=png  body: 图片原始字节   → { ok, url }
//
//    需要两个 Worker 变量（Cloudflare Dashboard → 该 Worker → 设置 → 变量）：
//      IMAGESEG_AK / IMAGESEG_SK  ← 就是你现在填在「设置 → 抠图」里的那对
//    ⚠ 未配置时这两个端点返回 501，前端会**自动回退**到原来的浏览器直连路径（能力协商）⇒ 不配也不会坏。
// ============================================================
/* ⚠⚠ **本文件里一律写 `globalThis.fetch`，不要裸写 `fetch`**（R9J 亲踩）：
   本模块顶层声明了 `async function fetch(request, env, ctx)` ⇒ 模块作用域内裸 `fetch(...)`
   会被**同名函数遮蔽**，于是"调用自己"（传进去的 URL 被当成 request.url ⇒ `new URL` 直接报
   `Invalid URL`）。这个报错**看起来像"URL 拼错了"**，极具误导性 —— 文件里既有多处上游调用
   早就统一用 `globalThis.fetch` 并写了原因（见 IMPL-66 注释），本段沿用同一纪律。 */
const SEG_IMAGESEG_HOST = 'https://imageseg.cn-shanghai.aliyuncs.com';
const SEG_VPIUTILS_HOST = 'https://viapiutils.cn-shanghai.aliyuncs.com';
const SEG_OSS_HOST = 'https://viapi-customer-temp.oss-cn-shanghai.aliyuncs.com';
const SEG_OSS_BUCKET = 'viapi-customer-temp';
const SEG_MAX_BYTES = 30 * 1024 * 1024;

/** 阿里云 POP 的百分号编码：encodeURIComponent 之外还要把 * 编掉、把 %7E 还原成 ~。
 *  与前端 `signUrl` / `viapiSts` 里的 pct 逐字一致（同一份口径，别各写一份）。 */
function segPct(s) {
  return encodeURIComponent(String(s)).replace(/\+/g, '%20').replace(/\*/g, '%2A').replace(/%7E/g, '~');
}

/** Uint8Array → 标准 base64（分批避免 apply 参数上限）。 */
function segB64(u8) {
  let out = '';
  for (let i = 0; i < u8.length; i += 0x8000) {
    out += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  }
  return btoa(out);
}

/** HMAC-SHA1 + base64。Worker 里用 WebCrypto（前端那份是纯 JS 实现，因为浏览器同步路径需要）。 */
async function segHmacSha1B64(keyStr, msg) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(keyStr),
    { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg));
  return segB64(new Uint8Array(sig));
}

function segCreds(env) {
  const ak = String(env.IMAGESEG_AK || '').trim();
  const sk = String(env.IMAGESEG_SK || '').trim();
  return (ak && sk) ? { ak, sk } : null;
}

/** STS 临时凭证缓存（isolate 级；30 分钟有效，提前 5 分钟重取）。 */
let _segSts = { ak: '', akId: '', akSecret: '', token: '', expireAt: 0 };

async function segSts(env) {
  const c = segCreds(env);
  if (!c) throw Object.assign(new Error('IMAGESEG_AK / IMAGESEG_SK not configured'), { segCode: 'NoCredential' });
  if (_segSts.ak === c.ak && _segSts.expireAt > Date.now() + 5 * 60 * 1000) return _segSts;
  const params = {
    Action: 'GetOssStsToken',
    Version: '2020-04-01',
    Format: 'JSON',
    AccessKeyId: c.ak,
    SignatureMethod: 'HMAC-SHA1',
    SignatureVersion: '1.0',
    SignatureNonce: genId('nonce'),
    Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
  };
  const canonical = Object.keys(params).sort()
    .map((k) => segPct(k) + '=' + segPct(params[k])).join('&');
  const sig = await segHmacSha1B64(c.sk + '&', 'POST&%2F&' + segPct(canonical));
  const ac = new AbortController();
  const tid = setTimeout(() => ac.abort(), 30000);
  let resp;
  try {
    resp = await globalThis.fetch(SEG_VPIUTILS_HOST + '/?Signature=' + segPct(sig), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: canonical,
      signal: ac.signal,
    });
  } finally { clearTimeout(tid); }
  const j = await resp.json().catch(() => null);
  if (!j || j.Code || !(j.Data && j.Data.AccessKeyId)) {
    throw Object.assign(new Error((j && j.Message) || 'GetOssStsToken failed'),
      { segCode: (j && j.Code) || 'StsFailed' });
  }
  /* ★★ R9ZF：有效期**不再写死 30 分钟** —— 官方只说 STS 票"建议一次业务一次性使用"，未保证时长；
     写死偏大 ⇒ 超时后复用过期票 ⇒ OSS 报 SecurityTokenExpired / AccessDenied（与报障同表象）。
     现在：响应里有 Expiration 就用它（提前 3 分钟作废）；没有就保守取 10 分钟。 */
  let _r9fExpAt = Date.now() + 10 * 60 * 1000;
  try {
    const _raw = j.Data.Expiration || j.Data.expiration;
    const _t = _raw ? Date.parse(String(_raw)) : NaN;
    if (isFinite(_t) && _t > Date.now() + 60000) _r9fExpAt = _t - 3 * 60 * 1000;
  } catch (_e) { /* 解析失败就用手上的保守值 */ }
  _segSts = {
    ak: c.ak,
    akId: j.Data.AccessKeyId,
    akSecret: j.Data.AccessKeySecret,
    token: j.Data.SecurityToken,
    expireAt: _r9fExpAt,
  };
  return _segSts;
}

/** POST /media/seg/imageseg —— 前端只给 { action, params }，签名与出网全在这里。 */
/* ══════════════════════════════════════════════════════════════════════════════
   ★ R9W（2026-10-09）：GET /media/img?url=<encoded> —— **服务端取图**。
   为什么必须有它（实测，不是推测）：
     R2 公网域 `pub-*.r2.dev` **不返回任何 ACAO**（OPTIONS 预检直接 403），
     浏览器 `fetch(url)` 报 `Failed to fetch`；`fetch(url,{mode:'no-cors'})` 拿到的是
     **opaque 响应 ⇒ blob.size = 0**（实测）⇒ 前端**物理上拿不到字节**。
     旧代码把这一步的异常吞在 try/catch 里 ⇒ 参考图被静默丢弃 ⇒ 退化成纯文生图
     （修报「还是不按参考图生成」的真因）。
   两条路径：
     ① 自家 R2（`*.r2.dev` 或 PUBLIC_BASE_URL）⇒ **直接按 key 从 AI_BUCKET 读**：不出网、
        不受对象生命周期/公开权限影响；
     ② 其它 http(s) ⇒ 服务端 `fetch`（30s 超时 · ≤25MB · **禁环回/内网地址**）。
   鉴权与其它 /media/* 同口径（Authorization: Bearer 优先、?token= 兜底）。
   ⚠ 这是"前端拿不到字节"的唯一正解 —— 别试图在浏览器侧绕（no-cors / img+canvas 都不行：
     canvas 会被污染、createImageBitmap 抛 SecurityError）。
   ══════════════════════════════════════════════════════════════════════════════ */
const IMG_MIME_BY_EXT = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp',
  gif: 'image/gif', bmp: 'image/bmp', avif: 'image/avif', svg: 'image/svg+xml',
};
function imgMimeOf(name, fallback) {
  const ext = (String(name || '').match(/\.([a-z0-9]+)(?:\?|#|$)/i) || [])[1];
  const byExt = ext ? IMG_MIME_BY_EXT[ext.toLowerCase()] : '';
  const f = String(fallback || '').split(';')[0].trim().toLowerCase();
  if (f && f !== 'application/json' && f !== 'application/octet-stream' && f !== 'binary/octet-stream') return f;
  return byExt || f || 'application/octet-stream';
}
/** 禁环回 / 内网 / 链路本地（防把本 Worker 当内网探测代理）。 */
function imgDeniedHost(host) {
  const h = String(host || '').toLowerCase().replace(/^\[|\]$/g, '');
  if (!h) return true;
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.internal') || h.endsWith('.local')) return true;
  if (/^(10|127)\./.test(h)) return true;
  if (/^192\.168\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true;
  if (h === '::1' || /^f[cd][0-9a-f]{2}:/.test(h) || /^fe80:/.test(h)) return true;
  return false;
}
async function handleImgProxy(request, env, url) {
  const raw = String(url.searchParams.get('url') || '').trim();
  if (!raw) return jsonResponse(400, { ok: false, error: 'url required' });
  let target;
  try { target = new URL(raw); } catch (_e) { return jsonResponse(400, { ok: false, error: 'bad url' }); }
  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    return jsonResponse(400, { ok: false, error: 'only http(s) supported' });
  }
  const cors = { 'access-control-allow-origin': '*', 'cache-control': 'public, max-age=600' };

  /* ① 自家 R2：按 key 直读（不出网） */
  const base = String(env.PUBLIC_BASE_URL || '').replace(/\/$/, '');
  const isR2 = target.hostname.endsWith('.r2.dev') || (!!base && raw.startsWith(base + '/'));
  if (isR2 && env.AI_BUCKET) {
    let key = '';
    if (base && raw.startsWith(base + '/')) key = decodeURIComponent(raw.slice(base.length + 1).split('?')[0]);
    else key = decodeURIComponent(target.pathname.replace(/^\/+/, ''));
    try {
      const obj = key ? await env.AI_BUCKET.get(key) : null;
      if (obj) {
        return new Response(obj.body, {
          headers: Object.assign({}, cors, {
            'content-type': imgMimeOf(key, obj.httpMetadata && obj.httpMetadata.contentType),
          }),
        });
      }
    } catch (_e) { /* 读不到就落到 ② */ }
  }

  /* ② 第三方 URL：服务端 fetch */
  if (imgDeniedHost(target.hostname)) return jsonResponse(400, { ok: false, error: 'host not allowed' });
  const ac = new AbortController();
  const tid = setTimeout(() => ac.abort(), 30000);
  let resp;
  try {
    resp = await globalThis.fetch(target.toString(), { signal: ac.signal, redirect: 'follow' });
  } catch (e) {
    return jsonResponse(502, { ok: false, error: 'fetch failed: ' + ((e && e.message) || 'network') });
  } finally { clearTimeout(tid); }
  if (!resp.ok) return jsonResponse(502, { ok: false, error: 'upstream ' + resp.status });
  const buf = new Uint8Array(await resp.arrayBuffer());
  if (!buf.length) return jsonResponse(502, { ok: false, error: 'empty body' });
  if (buf.length > 25 * 1024 * 1024) return jsonResponse(413, { ok: false, error: 'too large (>25MB)' });
  return new Response(buf, {
    headers: Object.assign({}, cors, {
      'content-type': imgMimeOf(target.pathname, resp.headers.get('content-type')),
    }),
  });
}

async function handleSegImageseg(request, env) {
  const c = segCreds(env);
  if (!c) {
    return jsonResponse(501, { ok: false, error: 'IMAGESEG_AK / IMAGESEG_SK not configured on this Worker' });
  }
  let body = null;
  try { body = await request.json(); } catch (_e) { body = null; }
  const action = String((body && body.action) || '').trim();
  if (!action) return jsonResponse(400, { ok: false, error: 'action required' });
  const biz = (body && body.params && typeof body.params === 'object') ? body.params : {};
  const params = Object.assign({
    Action: action,
    Version: '2019-12-30',
    Format: 'JSON',
    AccessKeyId: c.ak,
    SignatureMethod: 'HMAC-SHA1',
    SignatureVersion: '1.0',
    SignatureNonce: genId('nonce'),
    Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
  }, biz);
  const canonical = Object.keys(params).sort()
    .map((k) => segPct(k) + '=' + segPct(params[k])).join('&');
  const b64 = await segHmacSha1B64(c.sk + '&', 'GET&%2F&' + segPct(canonical));
  const target = SEG_IMAGESEG_HOST + '/?' + canonical + '&Signature=' + segPct(b64);

  const ac = new AbortController();
  const tid = setTimeout(() => ac.abort(), 60000);
  let resp;
  try {
    resp = await globalThis.fetch(target, { signal: ac.signal });
  } catch (e) {
    return jsonResponse(502, { ok: false, error: 'upstream: ' + ((e && e.message) || 'network') });
  } finally { clearTimeout(tid); }
  const raw = await resp.json().catch(() => null);
  if (!raw) return jsonResponse(502, { ok: false, error: 'upstream not json', status: resp.status });
  if (raw.Code) {
    return jsonResponse(200, { ok: false, code: raw.Code, message: raw.Message || '', requestId: raw.RequestId || '', data: raw });
  }
  return jsonResponse(200, { ok: true, data: raw });
}

/** POST /media/seg/stage?ext=png —— 图片字节进来，Worker 换临时凭证后传暂存桶，回一个可读 URL。 */
async function handleSegStage(request, env) {
  const c = segCreds(env);
  if (!c) {
    return jsonResponse(501, { ok: false, error: 'IMAGESEG_AK / IMAGESEG_SK not configured on this Worker' });
  }
  const url = new URL(request.url);
  const ext = String(url.searchParams.get('ext') || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
  const ctype = request.headers.get('Content-Type') || ('image/' + (ext === 'jpg' ? 'jpeg' : ext));
  const buf = new Uint8Array(await request.arrayBuffer());
  if (!buf.length) return jsonResponse(400, { ok: false, error: 'empty body' });
  if (buf.length > SEG_MAX_BYTES) return jsonResponse(413, { ok: false, error: 'too large (>30MB)' });

  let sts;
  try { sts = await segSts(env); }
  catch (e) {
    return jsonResponse(502, { ok: false, error: 'sts: ' + ((e && e.message) || 'failed'), code: (e && e.segCode) || '' });
  }

  const rand = () => (crypto.randomUUID ? crypto.randomUUID() : genId('seg')).replace(/-/g, '');
  /* ★★ R9ZF（2026-10-10）：**前缀必须是调用 GetOssStsToken 时用的那个 AccessKeyId** ——
     阿里云官方明文（视觉智能开放平台《文件URL处理》步骤 2）：
       「上传的路径前缀**必须是**您在步骤1中调用接口时所使用的 AccessKeyId」
       （例：LTAxxxxxxxabc/<uuid>/test.jpg）
     R9W 初版照抄了宿主那侧的被改坏写法（随机前缀）⇒ 该 STS 票只被授权写**自己 AK 前缀下**的对象
     ⇒ OSS 直接拒写 **AccessDenied** ⇒ 抠图死在"暂存"这一步（修 2026-10-10 报障）。
     ⚠ AK **ID** 是标识符不是机密（真正的机密是 SK，它从不进 URL）；官方要求它出现在对象路径里。 */
  const prefix = String(c.ak || '');
  const object = prefix + '/' + rand() + 'src.' + ext;
  const policy = btoa(JSON.stringify({
    expiration: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    conditions: [
      { bucket: SEG_OSS_BUCKET },
      ['starts-with', '$key', prefix + '/'],
      ['content-length-range', 1, SEG_MAX_BYTES],
      { 'x-oss-security-token': sts.token },
    ],
  }));
  // ⚠ 这里的 HMAC key 是 **临时 akSecret 本身**（不加 "&"）—— OSS PostObject 的签名口径
  //    与 POP（GET/POST&%2F&…）不同，别混用。
  const sig = await segHmacSha1B64(sts.akSecret, policy);

  const fd = new FormData();
  fd.append('key', object);
  fd.append('policy', policy);
  fd.append('OSSAccessKeyId', sts.akId);
  fd.append('Signature', sig);
  fd.append('x-oss-security-token', sts.token);
  fd.append('success_action_status', '200');
  fd.append('file', new Blob([buf], { type: ctype }), 'src.' + ext);

  const ac = new AbortController();
  const tid = setTimeout(() => ac.abort(), 60000);
  let up;
  try {
    up = await globalThis.fetch(SEG_OSS_HOST + '/', { method: 'POST', body: fd, signal: ac.signal });
  } catch (e) {
    return jsonResponse(502, { ok: false, error: 'oss: ' + ((e && e.message) || 'network') });
  } finally { clearTimeout(tid); }
  if (up.status !== 200 && up.status !== 204) {
    const t = await up.text().catch(() => '');
    const code = (/<Code>([^<]+)<\/Code>/.exec(t) || [])[1] || '';
    return jsonResponse(502, { ok: false, error: 'oss put failed', status: up.status, code });
  }
  return jsonResponse(200, { ok: true, url: SEG_OSS_HOST + '/' + object });
}

async function handleArchive(request, env, srcUrl, ext) {
  if (!env.AI_BUCKET) {
    return jsonResponse(500, { error: 'AI_BUCKET not bound' });
  }
  if (!isUrl(srcUrl)) {
    return jsonResponse(400, { error: 'Invalid url parameter' });
  }
  // V26.9.12: normalize URL to avoid "Invalid URL string" in Workers fetch
  try { srcUrl = new URL(srcUrl).href; } catch (e) {
    return jsonResponse(400, { ok: false, error: 'Invalid url parameter' });
  }
  const normExt = (ext || '').toLowerCase();
  if (!ARCHIVE_EXT_CT[normExt]) {
    return jsonResponse(400, {
      error: 'Invalid or unsupported ext (allowed: png/jpg/jpeg/webp/mp4/mp3/wav)',
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ARCHIVE_TIMEOUT_MS);
  let upstream;
  try {
    upstream = await globalThis.fetch(srcUrl, { signal: controller.signal });
  } catch (e) {
    return jsonResponse(502, {
      ok: false,
      error: 'Download failed: ' + (e?.message || 'network error'),
    });
  } finally {
    clearTimeout(timeoutId);
  }
  if (!upstream || !upstream.ok) {
    const status = upstream ? upstream.status : 0;
    return jsonResponse(502, { ok: false, error: 'Upstream returned status ' + status });
  }

  const filename = `${nowSec()}-${genId('r2')}.${normExt}`;
  const r2Key = `results/${filename}`;
  try {
    // Stream the upstream body directly into R2 — avoids buffering large
    // media files (video/audio) in Worker memory.
    await env.AI_BUCKET.put(r2Key, upstream.body, {
      httpMetadata: { contentType: ARCHIVE_EXT_CT[normExt], cacheControl: 'public, max-age=31536000, immutable' },
    });
  } catch (e) {
    return jsonResponse(502, {
      ok: false,
      error: 'R2 store failed: ' + (e?.message || 'unknown'),
    });
  }

  const base = env.PUBLIC_BASE_URL ? String(env.PUBLIC_BASE_URL).replace(/\/$/, '') : '';
  const publicUrl = base ? `${base}/${r2Key}` : `r2://${r2Key}`;
  return jsonResponse(200, { ok: true, url: publicUrl });
}

// ============================================================
// Main fetch router
// ============================================================

/**
 * Worker fetch entry point.
 * @param {Request} request
 * @param {object} env
 * @param {ExecutionContext} ctx
 * @returns {Promise<Response>}
 */
async function fetch(request, env, ctx) {
  const url = new URL(request.url);

  // 【IMPL-113 真根因修正】本入口拦截无条件处理所有 OPTIONS（位于一切路由之前）——
  //   IMPL-99 的 /media/* 专用短路排在其后属死代码从未生效（生产 curl 实测头组合与本处吻合实锤）。
  //   Z-Image-Turbo/Kolors 报「媒体代理不通」真根因：前端水印关闭时带 X-Enable-Watermark 头，
  //   本处 ACAH 白名单缺它 → 预检被拒。修正：ACAH 补全 + x-media-proxy-version 版本特征头
  //   （Expose 给前端，探测可区分「仍为旧版 / 已部署瞬时异常 / 网络不通」三态）。
  // CORS preflight — respond immediately with CORS headers, no auth.
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'access-control-allow-headers': 'Content-Type, Authorization, X-DashScope-Async, X-Enable-Watermark, X-Aiwork-Slow-Ok',
        'access-control-max-age': '86400',
        'x-media-proxy-version': 'IMPL-113',
        // ★ 2026-10-01：APIYI 通道自己的在位标记（x-media-proxy-version 保持 IMPL-113 不动，
        //   宿主自诊断要求它非空；这一条只用来区分「APIYI 版是否已部署」）。
        'x-apiyi-proxy': 'APIYI-1',
        // ★ R9G：版本特征头（**只在 OPTIONS 预检返回** —— 铁 75：校验线上版本必须发 OPTIONS）。
        //   粘贴新 Worker 后：curl -s -i -X OPTIONS https://<worker域>/ | grep -i x-aiwork-proxy
        'x-aiwork-proxy': PROXY_VERSION,
        'access-control-expose-headers': 'X-Media-Proxy-Version, X-Apiyi-Proxy, X-Aiwork-Proxy, X-Aiwork-Keepalive',
      },
    });
  }

  /* ★ R9G-SEC-P1-1：**可选** Origin 白名单 —— env `ALLOWED_ORIGINS` 为空时**不启用**（默认零变化）。
     放在 OPTIONS 之后、一切路由之前：预检必须无条件可用（浏览器拿不到预检响应就无法发正式请求）。 */
  const _od = originDenied(request, env);
  if (_od) return _od;

  // Public health check — no auth required.
  // ★ R9G-SEC-P1-3（报告 03）：**能力协商端点**。
  //   原来只返 {ok, service, time} ⇒ 前端无法知道"对面这个 Worker 会什么"，
  //   版本漂移只能靠用户在报错文案里读说明（报告点名「Worker 契约黑盒」）。
  //   现在把**契约能力**显式写出来（只增字段，旧调用方不受影响）；
  //   前端据此**自动开关**行为（例：caps.bearerAuth 为真才把 token 从 URL 移到 Authorization 头，
  //   旧 Worker 不返该字段 ⇒ 自动维持现状，**不存在"必须 Worker 先部署"的顺序约束**）。
  if (url.pathname === '/' || url.pathname === '/health') {
    return jsonResponse(200, {
      ok: true,
      service: 'ai-media-proxy',
      version: PROXY_VERSION,
      channels: ['sf', 'ds', 'apiyi', 'wy', 'seg'],
      caps: {
        bearerAuth: true,                 // requireAuthReq：Authorization: Bearer 优先、?token= 兜底
        mediaBothAuth: true,              // /media/* 同样吃头（老前端只带 ?token= 不受影响）
        apiyiPathWhitelist: true,         // /media/apiyi/* 只放行 APIYI_PATH_PREFIXES
        originAllowlist: !!String(env.ALLOWED_ORIGINS || '').trim(),  // 是否启用了 Origin 白名单
        llmChat: true,
        upload: true,
        archive: true,
        userdata: true,
        // ★ R9J-SEC-P1-2：抠图服务端化**是否就绪**（= 本 Worker 配了 IMAGESEG_AK/SK）。
        //   前端据此决定"走服务端签名"还是"沿用浏览器直连"⇒ 没配也**不会坏**，只是不切换。
        segProxy: !!segCreds(env),
        // ★ R9W：**服务端取图**是否可用（GET /media/img?url=…）——
        //   前端据此决定"参考图字节走 Worker 取"还是"沿用浏览器直取（会因无 ACAO 失败）"。
        readProxy: true,
        // ★ R9ZI：**慢请求保活**是否可用（治 CF 524）—— 前端据此决定"APIYI POST 带不带 X-Aiwork-Slow-Ok"。
        //   旧 Worker 不返该字段 ⇒ 自动不带头 ⇒ 行为维持现状，**不存在"必须 Worker 先部署"的顺序约束**。
        slowKeepalive: true,
        // ★ R9ZW：**保活自检路由**是否在位（`/ktest?ms=N[&force=1]`，不出网、零费用）。
        //   用途：把"CF 到底能不能扛过 125 秒"从推测变成一条 curl 就能复验的事实。
        keepaliveSelfTest: true,
        // ★ R9ZQ：**subrequest 真超时探针**是否在位（`/ktest?probe=<绝对URL>`，零成本、零计费）。
        //   用途：量出"Worker 内部的 fetch 到外部源站"到底吃不吃 CF 的 125s 墙 —— 这是 524 的唯一未解之谜。
        subrequestProbe: true,
      },
      time: nowSec(),
    });
  }

  // V26.9.9: Public Lottie JSON proxy (CORS-enabled, no auth)
  if (url.pathname.startsWith('/lottie/')) {
    const key = url.pathname.slice(1); // remove leading /
    if (!env.AI_BUCKET) return jsonResponse(500, { error: 'AI_BUCKET not bound' });
    const obj = await env.AI_BUCKET.get(key);
    if (!obj) return jsonResponse(404, { error: 'Not found' });
    return new Response(obj.body, {
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'cache-control': 'public, max-age=86400',
      },
    });
  }

  // ★ /llm/chat + /llm/models（技能系统 LLM 端点，IMPL-68 三上游）——必须放在 requireAuth 之前：
  //   本路由自带鉴权（Authorization: Bearer 优先、兼容 ?token=），GET 探活无需鉴权；
  //   /llm/models 需鉴权；每日限额复用现有 TASKS KV（key: LLM#yyyyMMdd），未绑定 KV 时自动跳过。
  if (url.pathname === '/llm/chat') return handleLlmChat(request, env);
  if (url.pathname === '/llm/models') return handleLlmModels(request, env);

  // 【IMPL-113】原 IMPL-99 的 /media/* OPTIONS 专用短路已上移合并至 fetch 入口 preflight——
  //   本文件入口无条件拦截所有 OPTIONS，其后任何专用短路均不可达（IMPL-99 版此处为死代码从未生效）。
  // ★ /media/sf|ds/*（IMPL-98 媒体直连代理，前端零密钥）——?token= 鉴权与 /upload 一致（IMPL-119 起在 handleMediaProxy 内实装）。
  if (url.pathname.startsWith('/media/sf/')) return handleMediaProxy(request, env, 'sf');
  if (url.pathname.startsWith('/media/ds/')) return handleMediaProxy(request, env, 'ds');
  // ★ APIYI（2026-10-01 新增第 4 条通道）：/media/apiyi/<上游路径>，例如
  //   /media/apiyi/v1/images/edits  →  https://api.apiyi.com/v1/images/edits
  if (url.pathname.startsWith('/media/apiyi/')) return handleMediaProxy(request, env, 'apiyi');
  // ★ IMPL-150 Z17：/media/wy/*（速创透明代理，前端零密钥）——与 /media/sf|ds 同形态（?token= 鉴权在 handleWyProxy 内实装；
  //   OPTIONS 预检已被 fetch 入口 preflight 无条件覆盖，先于本行，无需在此另设短路）。
  if (url.pathname.startsWith('/media/wy/')) return handleWyProxy(request, env);

  // ★★ R9J-SEC-P1-2：阿里云抠图链路服务端化（Authorization: Bearer 优先、?token= 兜底 —— 与上面四条通道同口径）。
  //   ⚠ 走 requireAuthReq：老前端即便还带 ?token= 也照常工作；配了 R9G+ 的前端会自动改带头。
  /* ★★ R9W：**服务端取图**（参考图字节）—— 前端拿不到字节时唯一的正解。
     与 /media/seg/* 同口径：自带鉴权，不放行匿名（免得被当公开图床代理）。 */
  if (url.pathname === '/media/img') {
    const _imgAuth = requireAuthReq(request, env);
    if (!_imgAuth.ok) return _imgAuth.response;
    if (request.method !== 'GET') return jsonResponse(405, { error: 'Method not allowed' });
    return await handleImgProxy(request, env, url);
  }

  if (url.pathname === '/media/seg/imageseg' || url.pathname === '/media/seg/stage') {
    const _segAuth = requireAuthReq(request, env);
    if (!_segAuth.ok) return _segAuth.response;
    if (request.method !== 'POST') return jsonResponse(405, { error: 'Method not allowed' });
    if (url.pathname === '/media/seg/imageseg') return await handleSegImageseg(request, env);
    return await handleSegStage(request, env);
  }

  /* ══════════════════════════════════════════════════════════════════════════
     ★★ R9ZW · 保活自检路由 `/ktest?ms=<毫秒>[&force=1]`（**不出网、零费用**）
     ──────────────────────────────────────────────────────────────────────────
     存在的理由：CF 的 `Proxy Read Timeout` 是 **125 秒**（官方 connection-limits 表），
     我们已经上线「慢请求保活」，但"到底有没有绕过那道墙"**没办法零成本验证** ——
       · 真调一次慢模型要花钱，而且**不保证**能慢过 50 秒（慢不成就测不到保活）
       · 用"永不完成的请求体"做探针也不行（实测：CF 会先等客户端 body 传完才回，两条对照都没响应）
     ⇒ 加一条**不碰上游**的自检路由：它**直接复用 `r9ziKeepalive()` 本体**（不是抄一份逻辑），
        `ms` 毫秒后返回一小段 JSON。于是：
          `curl -N "<worker>/ktest?ms=140000&token=…"`  —— 带声明头 ⇒ 期望 **约 50 秒**拿到 200 + 开始流
          `curl -N "<worker>/ktest?ms=140000&force=1&…"` —— 不保活对照 ⇒ 期望 **约 125 秒**的 524
        两条一对比，谁的问题一目了然；以后每次改 Worker 也能 30 秒复验一次。
     ⚠ 鉴权与 `/media/*` 同口径（requireAuthReq）—— 不开匿名口子（否则成了廉价长连接 DoS 面）。
     ⚠ ms 上限 300000，防被当长连接占位器用。 */
  if (url.pathname === '/ktest') {
    const _ktAuth = requireAuthReq(request, env);
    if (!_ktAuth.ok) return _ktAuth.response;
    if (request.method !== 'GET' && request.method !== 'POST') return jsonResponse(405, { error: 'Method not allowed' });
    const _ktMs = Math.max(0, Math.min(300000, Number(url.searchParams.get('ms') || 0) || 0));
    const _ktForce = url.searchParams.get('force') === '1';
    const _ktFlag = String(request.headers.get('x-aiwork-slow-ok') || '') === '1';
    /* ★★ R9ZQ：`?probe=<绝对 URL>` —— 用**真实 fetch** 替代 setTimeout，量出 subrequest 的真实超时。
       为什么需要它（第五轮的决定性待办）：`/ktest?ms=N` 证明的是"CF 对 **Worker 自身**没有 125s 限制"
       （因为 Worker 在客户端的保活流里活得好好的）；但**用户看到 524 的那一跳**是 Worker 内部
       `fetch("https://api.apiyi.com/…")` 这个 **subrequest**。subrequest 是否另外吃一道墙，只有真 fetch 才知道。
       ⇒ probe 模式：把 ms 那个假 promise 换成**真的对外请求**，其余完全复用保活流：
          · **零成本**：默认探针用 `https://httpbin.org/delay/N`（纯延迟、无计费；也可自带 `<绝对 URL>`）
          · **零副作用**：只 GET，不带任何 APIYI 密钥，**绝不可能产生上游计费**
          · **判定**：
              带声明头 + probe ⇒ front 200 + `waitedMs` = 实际耗时 + `probeStatus`
              · 若 `probeStatus` 是 200 且耗时 >125s ⇒ **subrequest 不受 125s 限制**（那 524 另有其因）
              · 若耗时 ≈125s 且 `probeStatus` 是 524/504 ⇒ **subrequest 确实吃 125s 墙**（保活救不了，必须换上游）
        ⚠ 安全：probe 只接受 http/https，**禁内网地址**；仍走 requireAuthReq ⇒ 不开匿名 SSRF 面。
        ⚠ 对照组：`force=1` 时不启用保活，直接 await 真 fetch ⇒ 若它超 125s 被 CF 断成 524，
          那恰好从**另一个方向**证实「subrequest 墙」——即"不经保活流的裸 fetch"确实过不去。 */
    const _ktProbe = String(url.searchParams.get('probe') || '').trim();
    if (_ktProbe) {
      let _pUrl = null;
      try { _pUrl = new URL(_ktProbe); } catch (_e) { _pUrl = null; }
      if (!_pUrl || (_pUrl.protocol !== 'http:' && _pUrl.protocol !== 'https:')) {
        return jsonResponse(400, { error: 'probe 必须是 http/https 绝对 URL' });
      }
      // 禁内网/回环/元数据地址（防止被当 SSRF 跳板）
      const _ph = _pUrl.hostname.toLowerCase();
      if (/^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$)/.test(_ph)) {
        return jsonResponse(400, { error: 'probe 不允许内网/回环地址' });
      }
      const _pStart = Date.now();
      const _pFetch = (async () => {
        // ⚠ 不设 signal：就是要它自然超时，量出"墙在哪"
        // ⚠⚠ 必须 `globalThis.fetch` —— 本模块顶层声明了 `async function fetch(request,env,ctx)`，
        //    模块作用域内裸 `fetch(...)` 会解析到**本文件自己的 fetch 处理器**（把字符串当 Request ⇒ "Invalid URL"）。
        //    这正是文件头第 59/62 行记录的既有遮蔽隐患（IMPL-66），本批新增代码同样中招（第一次跑就现形）。
        const r = await globalThis.fetch(_pUrl.toString(), { method: 'GET', redirect: 'manual' });
        const _t = await r.text().catch(() => '');
        return new Response(JSON.stringify({
          ok: true, keepalive: true, mode: 'probe', probeUrl: _pUrl.toString(),
          probeStatus: r.status, waitedMs: Date.now() - _pStart, version: PROXY_VERSION,
          bodyHead: _t.slice(0, 120),
          note: 'probe 模式：真实 subrequest。若 probeStatus=524/504 且 waitedMs≈125000 ⇒ subrequest 吃 CF 125s 墙',
        }), { status: 200, headers: { 'content-type': 'application/json' } });
      })();
      if (_ktForce || !_ktFlag) {
        // 对照组：不保活，裸 await —— 超 125s 会被 CF 断成 524（这本身就是"墙存在"的旁证）
        try {
          const r = await _pFetch;
          const t = await r.text();
          return new Response(t, { status: r.status, headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        } catch (e) {
          return jsonResponse(502, { ok: false, mode: 'probe', keepalive: false, error: String(e && e.message || e), waitedMs: Date.now() - _pStart });
        }
      }
      return r9ziKeepalive(_pFetch, 0);
    }
    if (_ktForce || !_ktFlag) {
      await new Promise((r) => setTimeout(r, _ktMs));
      return jsonResponse(200, { ok: true, keepalive: false, waitedMs: _ktMs, version: PROXY_VERSION, note: '未启用保活（force=1 或未带 x-aiwork-slow-ok）——超过 125 秒应被 CF 断成 524，这正是对照组的预期' });
    }
    const _ktFake = new Promise((res) => setTimeout(() => res(new Response(
      JSON.stringify({ ok: true, keepalive: true, waitedMs: _ktMs, version: PROXY_VERSION, note: '保活流：50 秒起开始吐字节，因此 CF 的 125 秒首字节墙不会触发' }),
      { status: 200, headers: { 'content-type': 'application/json' } })), _ktMs));
    return r9ziKeepalive(_ktFake, 0);
  }

  // All other endpoints require ?token= matching AUTH_TOKEN.
  const auth = requireAuthReq(request, env);
  if (!auth.ok) return auth.response;

  // R2 upload (graceful degradation: works even if TASKS KV is unbound).
  if (url.pathname === '/upload' && request.method === 'POST') {
    try {
      // V26.9.11: pass dir param for subdirectory (e.g. thumb/)
      const dir = url.searchParams.get('dir') || 'uploads';
      return await handleUpload(request, env, dir);
    } catch (e) {
      return jsonResponse(500, { error: 'Upload failed: ' + (e?.message || 'unknown') });
    }
  }

  // Task Center
  if (url.pathname === '/task' && request.method === 'POST') {
    return await handleSubmitTask(request, env);
  }

  if (url.pathname === '/tasks' && request.method === 'GET') {
    return await handleListTasks(env);
  }

  // /task/<id>
  const taskMatch = url.pathname.match(/^\/task\/([^/]+)$/);
  if (taskMatch) {
    const id = taskMatch[1];
    if (request.method === 'GET') return await handleGetTask(env, id);
    if (request.method === 'DELETE') return await handleDeleteTask(env, id);
  }

  // /task/<id>/cancel
  const cancelMatch = url.pathname.match(/^\/task\/([^/]+)\/cancel$/);
  if (cancelMatch && request.method === 'POST') {
    return await handleCancelTask(env, cancelMatch[1]);
  }

  // /task/<id>/retry
  const retryMatch = url.pathname.match(/^\/task\/([^/]+)\/retry$/);
  if (retryMatch && request.method === 'POST') {
    return await handleRetryTask(env, retryMatch[1], url);
  }

  // /chain/<id>/advance
  const advanceMatch = url.pathname.match(/^\/chain\/([^/]+)\/advance$/);
  if (advanceMatch && request.method === 'POST') {
    return await handleAdvanceChain(env, advanceMatch[1], request);
  }

  // Userdata sync — R2-backed JSON key/value store (history sync).
  if (url.pathname === '/userdata' && request.method === 'GET') {
    return await handleUserdataGet(env, url.searchParams.get('key') || '');
  }
  /* ★ R79-D：PUT 与 POST 等价（POST 是给 navigator.sendBeacon 用的 —— 它只能发 POST）。
     写入走 handleUserdataWrite，对 history 做服务端 read-merge-write。 */
  if (url.pathname === '/userdata' && (request.method === 'PUT' || request.method === 'POST')) {
    return await handleUserdataWrite(request, env, url.searchParams.get('key') || '');
  }

  // Result archive — download upstream result and store to R2 results/.
  if (url.pathname === '/archive' && request.method === 'POST') {
    return await handleArchive(
      request,
      env,
      url.searchParams.get('url') || '',
      url.searchParams.get('ext') || '',
    );
  }

  return jsonResponse(404, { error: 'Not found', path: url.pathname });
}

// ============================================================
// Scheduled (cron) handler
// ============================================================

/**
 * Cron entry point. Runs every minute via wrangler.toml triggers.crons.
 * Delegates all work to processScheduled via controller.waitUntil.
 * @param {ScheduledController} controller
 * @param {object} env
 * @param {ExecutionContext} ctx
 */
async function scheduled(controller, env, ctx) {
  ctx.waitUntil(processScheduled(env));
}

/**
 * Main scheduled work — runs in four phases:
 *   1. Poll all "running" single tasks for completion (Speedx detail API).
 *   2. Advance pipelines (submit next step on success, fail on child failure).
 *   3. Update chains (mark segment succeeded/failed; advancement is frontend-driven).
 *   4. Process queued tasks under concurrency caps (priority-sorted, notBefore-gated).
 *
 * Each phase tolerates partial failure: a single task error doesn't abort the rest.
 * @param {object} env
 */
async function processScheduled(env) {
  if (!env.TASKS || !env.SPEEDX_KEY) return;

  const activeIds = await getIndex(env, ACTIVE_INDEX_KEY);
  const tasks = (await Promise.all(activeIds.map((id) => getTask(env, id)))).filter(Boolean);

  const singles = tasks.filter((t) => t.kind === 'single');
  const pipelines = tasks.filter((t) => t.kind === 'pipeline');
  const chains = tasks.filter((t) => t.kind === 'chain');

  // Phase 1: poll running single tasks.
  await Promise.all(singles.map((t) => pollSingleTask(env, t).catch(() => null)));

  // Phase 2: advance pipelines.
  for (const p of pipelines) {
    if (p.status !== 'running') continue;
    try { await advancePipeline(env, p); } catch { /* skip on error */ }
  }

  // Phase 3: update chains.
  for (const c of chains) {
    if (c.status !== 'running') continue;
    try { await updateChain(env, c); } catch { /* skip on error */ }
  }

  // Phase 4: re-read active list (polling may have completed some tasks)
  // and dispatch queued tasks under concurrency caps.
  const freshIds = await getIndex(env, ACTIVE_INDEX_KEY);
  const freshTasks = (await Promise.all(freshIds.map((id) => getTask(env, id)))).filter(Boolean);
  await processQueuedTasks(env, freshTasks);
}

/**
 * Poll a single running task: call Speedx detail, update status on completion.
 *
 * Stale-check: tasks running > STALE_RUNNING_SEC are marked failed (timeout).
 * Throttled: skips polling if updated < POLL_MIN_GAP_SEC ago.
 * Conflict-safe: uses putTaskIfFresh to avoid clobbering concurrent writes.
 *
 * @param {object} env
 * @param {object} task
 */
async function pollSingleTask(env, task) {
  if (task.status !== 'running' || !task.apiId) return;

  const elapsed = nowSec() - task.createdAt;
  if (elapsed > STALE_RUNNING_SEC) {
    task.status = 'failed';
    task.error = 'timeout';
    task.finishedAt = nowSec();
    if (await putTaskIfFresh(env, task)) {
      await moveToRecent(env, task.id);
    }
    return;
  }

  if (task.updatedAt && nowSec() - task.updatedAt < POLL_MIN_GAP_SEC) return;

  const detail = await getDetailFromSpeedx(env, task.apiId);
  if (!detail.ok || !detail.data) return;

  // The data field may be a JSON string or an object.
  const innerRaw = detail.data.data;
  const inner = tryParseJson(innerRaw);
  if (!inner || typeof inner !== 'object') return;

  const mapped = mapApiStatus(inner.status);
  if (mapped === 'running') return;

  if (mapped === 'succeeded') {
    const url = extractUrl(detail.data);
    task.status = 'succeeded';
    task.resultUrl = url;
    task.error = null;
    task.finishedAt = nowSec();
    if (await putTaskIfFresh(env, task)) {
      await moveToRecent(env, task.id);
    }
    return;
  }

  // mapped === 'failed'
  const msg = inner.message || detail.data.msg || 'upstream failed';
  if (isRetryableError(detail.status, msg) && task.attempts < MAX_ATTEMPTS) {
    task.attempts += 1;
    task.status = 'queued';
    task.apiId = null;
    task.notBefore = nowSec() + RETRY_DELAY_SEC;
    task.error = msg;
    await putTaskIfFresh(env, task);
    // stays in idx:active for cron to retry
  } else {
    task.status = 'failed';
    task.error = msg;
    task.finishedAt = nowSec();
    if (await putTaskIfFresh(env, task)) {
      await moveToRecent(env, task.id);
    }
  }
}

/**
 * Advance a pipeline based on the current step's child task status.
 *
 *   step pending  → start the step (creates child single task)
 *   step running  → no-op (pollSingleTask will update the child)
 *   step succeeded → set step.resultUrl, advance to next step (or mark pipeline done)
 *   step failed    → mark pipeline failed with failedStep
 *
 * @param {object} env
 * @param {object} pipeline
 */
async function advancePipeline(env, pipeline) {
  const step = pipeline.steps[pipeline.current - 1];
  if (!step) return;

  if (step.status === 'pending' && !step.taskId) {
    await startPipelineStep(env, pipeline, pipeline.current);
    return;
  }

  if (step.status === 'succeeded') {
    // Already advanced — no-op.
    return;
  }

  if (step.status === 'failed') {
    pipeline.status = 'failed';
    pipeline.failedStep = pipeline.current;
    pipeline.finishedAt = nowSec();
    await putTask(env, pipeline);
    await moveToRecent(env, pipeline.id);
    return;
  }

  if (!step.taskId) return;
  const child = await getTask(env, step.taskId);
  if (!child) return;

  if (child.status === 'succeeded') {
    step.status = 'succeeded';
    step.resultUrl = child.resultUrl;

    if (pipeline.current >= pipeline.steps.length) {
      pipeline.status = 'succeeded';
      pipeline.finishedAt = nowSec();
      await putTask(env, pipeline);
      await moveToRecent(env, pipeline.id);
      return;
    }

    // Fill next step's needs from this step's resultUrl.
    const nextStep = pipeline.steps[pipeline.current];
    for (const need of nextStep.needs) {
      nextStep.body[need] = step.resultUrl;
    }
    await putTask(env, pipeline);
    await startPipelineStep(env, pipeline, pipeline.current + 1);
    return;
  }

  if (child.status === 'failed') {
    step.status = 'failed';
    step.error = child.error;
    pipeline.status = 'failed';
    pipeline.failedStep = pipeline.current;
    pipeline.finishedAt = nowSec();
    await putTask(env, pipeline);
    await moveToRecent(env, pipeline.id);
  }
}

/**
 * Update a chain's current segment based on its child task status.
 *
 * Chain advancement to the next segment is frontend-driven
 * (POST /chain/<id>/advance with tailFrameUrl) — the cron only updates
 * segment status from the child task and marks the chain done/failed.
 *
 * @param {object} env
 * @param {object} chain
 */
async function updateChain(env, chain) {
  const seg = chain.segments[chain.current - 1];
  if (!seg) return;

  if (seg.status === 'succeeded') {
    // If this is the last segment, the chain is complete.
    if (chain.current >= chain.segments.length) {
      chain.status = 'succeeded';
      chain.finishedAt = nowSec();
      await putTask(env, chain);
      await moveToRecent(env, chain.id);
    }
    return;
  }

  if (seg.status === 'failed') {
    chain.status = 'failed';
    chain.finishedAt = nowSec();
    await putTask(env, chain);
    await moveToRecent(env, chain.id);
    return;
  }

  if (!seg.taskId) return;
  const child = await getTask(env, seg.taskId);
  if (!child) return;

  if (child.status === 'succeeded') {
    seg.status = 'succeeded';
    seg.resultUrl = child.resultUrl;
    await putTask(env, chain);
    // If this is the last segment, mark the chain done now.
    if (chain.current >= chain.segments.length) {
      chain.status = 'succeeded';
      chain.finishedAt = nowSec();
      await putTask(env, chain);
      await moveToRecent(env, chain.id);
    }
    return;
  }

  if (child.status === 'failed') {
    seg.status = 'failed';
    seg.error = child.error;
    chain.status = 'failed';
    chain.finishedAt = nowSec();
    await putTask(env, chain);
    await moveToRecent(env, chain.id);
  }
}

/**
 * Dispatch queued single tasks under per-modelType concurrency caps.
 *
 * Selection: kind=single, status=queued, notBefore<=now (or 0).
 * Ordering: priority desc (higher first), then createdAt asc (older first).
 *
 * For each task up to its type's concurrency cap, calls forwardTaskToSpeedx.
 * Failures during forward (retryable) leave the task queued with notBefore.
 *
 * @param {object} env
 * @param {object[]} tasks  All currently-active task records.
 */
async function processQueuedTasks(env, tasks) {
  const now = nowSec();

  // Count running single tasks per modelType.
  const runningByType = { image: 0, video: 0, audio: 0 };
  for (const t of tasks) {
    if (t.kind === 'single' && t.status === 'running') {
      runningByType[t.modelType] = (runningByType[t.modelType] || 0) + 1;
    }
  }

  const queued = tasks
    .filter((t) =>
      t.kind === 'single' &&
      t.status === 'queued' &&
      (!t.notBefore || t.notBefore <= now),
    )
    .sort((a, b) => (b.priority || 0) - (a.priority || 0) || a.createdAt - b.createdAt);

  for (const task of queued) {
    const cap = CONCURRENCY[task.modelType] || 1;
    if (runningByType[task.modelType] >= cap) continue;

    // Re-read the task to detect concurrent writes (e.g. user just canceled).
    const fresh = await getTask(env, task.id);
    if (!fresh || fresh.status !== 'queued') continue;
    if (fresh.notBefore && fresh.notBefore > now) continue;

    runningByType[task.modelType] += 1;
    await forwardTaskToSpeedx(env, fresh);

    // If forward left it running, the running count stays up. If it failed
    // and was moved to recent (non-retryable), decrement so the next queued
    // task of the same type can start this tick.
    const after = await getTask(env, fresh.id);
    if (!after || after.status !== 'running') {
      runningByType[task.modelType] -= 1;
    }
  }
}

// ============================================================
// Exports
// ============================================================

export default { fetch, scheduled };

/* ═══════════════════════════════════════════════════════════════════════════════
   APIYI 自检（部署后按顺序跑；把 <WORKER> 与 <R2_TOKEN> 换成你自己的）
   ---------------------------------------------------------------------------
   0) 确认已换版（应输出 x-apiyi-proxy: APIYI-1）
      curl -s -i -X OPTIONS "<WORKER>/media/apiyi/v1/models" | grep -i x-apiyi-proxy

   1) LLM 探活（应出现 "apiyi":true）
      curl -s "<WORKER>/llm/chat" | head -c 400

   2) 通道 + Key + 白名单三件都活（应 HTTP 200 + 一串模型 JSON）
      curl -s "<WORKER>/media/apiyi/v1/models?token=<R2_TOKEN>" -H "Accept: application/json" | head -c 300

   3) LLM 真跑一次（非流式看不到，这里只看 HTTP 与首行 SSE）
      curl -s -N -X POST "<WORKER>/media/apiyi/v1/chat/completions?token=<R2_TOKEN>" \
        -H "Content-Type: application/json" \
        -d '{"model":"gpt-5.6-luna","stream":true,"messages":[{"role":"user","content":"说"OK""}]}' | head -c 300

   ---------------------------------------------------------------------------
   失败码处置
     · HTTP 500 且 error 含 "APIYI_API_KEY not configured"
         ⇒ 环境变量没配，或名字拼错（必须正好是 APIYI_API_KEY，类型选 Secret）
     · HTTP 401 invalid_key（上游回原文）
         ⇒ Key 错 / 已停用 / 没余额的账号签发 —— 去 https://api.apiyi.com/token 重取；
            APIYI 的 error.message 只返回一次、服务端不留存 ⇒ 当场记下来
     · HTTP 403 且 error 含 "白名单端点"
         ⇒ 路径拼错，或该端点不在 APIYI_PATH_PREFIXES 里（模块级常量，改完重新粘贴部署）
     · HTTP 502 且 note 含 "可能仍会计费"
         ⇒ 闸门断的（超时/网络），不是上游拒的；可试 APIYI_BASE=https://b.apiyi.com
     · HTTP 429
         ⇒ 限流 **或** 余额不足 —— APIYI 文档明说这两态分不清，两头都要看
   ═══════════════════════════════════════════════════════════════════════════════ */
