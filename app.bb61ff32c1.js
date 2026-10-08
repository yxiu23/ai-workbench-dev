"use strict";

const CONFIG = {
API_BASE: "https://api.wuyinkeji.com",
/* IMPL-95⑥：provider 直连 base（官方文档 tmp/impl95/models-doc.md）——硅基流动 images/transcriptions、百炼 DashScope 全家 */
SF_BASE: "https://api.siliconflow.cn",
DS_BASE: "https://dashscope.aliyuncs.com",
GITHUB_VAULT: {repo: "yxiu23/ai-workbench-dev", branch: "main", path: "vault/keybook.enc.bin"},
BUILTIN: {
API_KEY: "",
R2_WORKER_URL: "",
R2_AUTH_TOKEN: "",
SF_KEY: "",
DS_KEY: ""
},
DETAIL_PATH: "/api/async/detail",
POLL_TIMEOUT: 30 * 60 * 1e3,
POLL_FAIL_LIMIT: 5,
REQUEST_TIMEOUT: 45e3,
POLL_PHASES: [ {
name: "排队中",
until: 3e4,
interval: 3e3
}, {
name: "生成中",
until: 18e4,
interval: 1500
}, {
name: "收尾中",
until: 6e5,
interval: 2e3
} ],
STORAGE_KEYS: {
API_KEY: "sc_api_key",
SF_KEY: "sc_sf_key",
DS_KEY: "sc_ds_key",
SEG_AK: "wb_seg_ak",
SEG_SK: "wb_seg_sk",
SEG_PROXY: "wb_seg_proxy",
CLOUD_SYNC: "sc_cloud_sync",
SOUND: "sc_sound",
HISTORY: "sc_history",
TASKS: "sc_tasks",
FOLDERS: "sc_result_folders", /* IMPL-138④：结果文件夹（收藏夹语义，引用集合不移动原数据） */
PROMPT_HISTORY: "sc_prompt_history",
PRESETS: "sc_presets",
R2_WORKER_URL: "sc_r2_worker_url",
R2_AUTH_TOKEN: "sc_r2_auth_token",
SKILL_MODEL: "sc_skill_model",
SKILL_THINKING: "sc_skill_thinking",
SKILL_COMBO: "sc_skill_combo",
SKILL_RELAY: "sc_skill_relay",
SKILL_DISCUSS: "sc_skill_discuss",
SKILL_VISION_MODEL: "sc_skill_vision_model",
SKILL_DISCUSS_MODEL: "sc_skill_discuss_model",
SKILL_MODELS_CATALOG: "sc_skill_models_catalog",
BUDGET: "sc_budget",
SPEND_ALERT: "sc_spend_alert",
TASK_CENTER_URL: "sc_task_center_url",
TASK_CENTER_TOKEN: "sc_task_center_token",
LLM_USAGE: "sc_llm_usage",
SV_FLOOR: "sc_sv_floor_v2"
},
R2: {
WORKER_URL: "",
AUTH_TOKEN: ""
},
WECHAT_PAY_URI: "wxp://f2f0bhNf2RE-C229PBeSBM85o3AVfGoHJfCF5uhtlrg7jhA"
};

const MODELS = {
image: [ {
id: "gpt-image-2.5",
name: "GPT-Image-2.5",
endpoint: "/api/async/image_gpt_2.5",
price: "0.1元/张",
async: true,
type: "image",
desc: "速度快成本低，日常首选",
billing: {
type: "perImage",
unit: .1
},
aspectMerge: true,
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "1:1",
options: [ "auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "1:3", "3:1", "2:1", "1:2" ],
hint: "自动＝不指定比例，由服务端默认决定" /* IMPL-120：官方枚举无 auto（速创 doc/78），auto=缺省不下发；老 gpt-image-2（doc/53）才是官方原生 auto */
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv"
} ]
}, {
id: "gpt-image-2",
name: "GPT-Image-2",
endpoint: "/api/async/image_gpt",
price: "0.1元/张",
async: true,
type: "image",
desc: "经典稳定款，沿用省心",
billing: {
type: "perImage",
unit: .1
},
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "size",
label: "比例",
type: "select",
default: "auto",
options: [ "auto", "1:1", "3:2", "2:3", "16:9", "9:16", "4:3", "3:4", "21:9", "9:21", "1:3", "3:1", "2:1", "1:2" ]
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "array"
} ]
}, {
id: "gpt-image-2.5-sunburst",
name: "GPT-Image-2.5-sunburst",
endpoint: "/api/async/image_gpt_2.5_sunburst",
price: "0.3元/张",
async: true,
type: "image",
desc: "编辑精度最高，精修首选",
billing: {
type: "perImage",
unit: .3
},
aspectMerge: true,
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "size",
label: "分辨率",
type: "select",
default: "1K",
options: [ "1K", "2K", "4K" ]
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "1:1",
options: [ "auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "1:3", "3:1", "2:1", "1:2" ],
hint: "自动＝不指定比例，由服务端默认决定" /* IMPL-120：官方枚举无 auto（速创 doc/79），auto=缺省不下发 */
}, {
key: "quality",
label: "生成质量",
type: "select",
default: "medium",
options: [ "low", "medium", "high", "xhigh", "max" ]
}, {
key: "background",
label: "背景",
type: "select",
default: "auto",
options: [ "auto", "transparent" ]
}, {
key: "mask",
label: "遮罩图",
type: "ref-image",
output: "single"
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv"
} ]
}, {
id: "gpt-image-2.5-flare",
name: "GPT-Image-2.5-flare",
endpoint: "/api/async/image_gpt_2.5_flare",
price: "0.3元/张",
async: true,
type: "image",
desc: "快且质量好，均衡之选",
billing: {
type: "perImage",
unit: .3
},
aspectMerge: true,
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "size",
label: "分辨率",
type: "select",
default: "1K",
options: [ "1K", "2K", "4K" ]
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "1:1",
options: [ "auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "1:3", "3:1", "2:1", "1:2" ],
hint: "自动＝不指定比例，由服务端默认决定" /* IMPL-120：官方枚举无 auto（速创 doc/80），auto=缺省不下发 */
}, {
key: "quality",
label: "生成质量",
type: "select",
default: "medium",
options: [ "low", "medium", "high" ]
}, {
key: "background",
label: "背景",
type: "select",
default: "auto",
options: [ "auto", "transparent" ]
}, {
key: "mask",
label: "遮罩图",
type: "ref-image",
output: "single"
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv"
} ]
}, {
id: "nanoBanana2",
name: "NanoBanana2",
endpoint: "/api/async/image_nanoBanana2",
price: "0.1元/张",
async: true,
type: "image",
desc: "多参考融合，均衡好用",
billing: {
type: "perImage",
unit: .1
},
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "size",
label: "分辨率",
type: "select",
default: "1K",
options: [ "1K", "2K", "4K" ]
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "auto",
options: [ "auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "1:4", "1:8", "4:1", "8:1" ]
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "array"
} ]
}, {
id: "nanoBanana_pro",
name: "NanoBanana Pro",
endpoint: "/api/async/image_nanoBanana_pro",
price: "0.3元/张",
async: true,
type: "image",
desc: "高画质版，细节见长",
billing: {
type: "perImage",
unit: .3
},
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "size",
label: "分辨率",
type: "select",
default: "1K",
options: [ "1K", "2K", "4K" ]
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "auto",
options: [ "auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9" ]
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "array"
} ]
}, {
id: "nanoBanana2Lite",
name: "NanoBanana-2-Lite",
endpoint: "/api/async/image_nanoBanana2Lite",
price: "0.08元/张",
async: true,
type: "image",
desc: "轻量省费，走量首选",
billing: {
type: "perImage",
unit: .08
},
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "size",
label: "分辨率",
type: "select",
default: "1K",
options: [ "1K" ]
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "auto",
options: [ "auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9" ]
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "array"
} ]
}, {
id: "z_image_turbo",
name: "Z-Image-Turbo",
endpoint: "direct:siliconflow",
modelId: "Tongyi-MAI/Z-Image-Turbo",
direct: "sf-image",
price: "¥0.10/张",
async: false,
type: "image",
desc: "极速轻量，批量试稿快",
billing: { type: "perImage", unit: .1 } /* IMPL-96②：官方定价页 ¥0.10/张 */,
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "image_size",
label: "分辨率",
type: "select",
default: "1024x1024",
options: [ "1024x1024", "832x1248", "1248x832", "864x1152", "1152x864", "896x1152", "1152x896", "720x1280", "1280x720", "576x1344", "1344x576", "1280x1280", "1024x1536", "1536x1024", "1104x1472" ]
}, {
key: "negative_prompt",
label: "反向提示词",
type: "textarea",
default: ""
}, {
key: "num_inference_steps",
label: "步数",
type: "range",
default: 8,
min: 1,
max: 100,
step: 1,
hint: "Turbo 为 8 步蒸馏模型，8 步即最佳"
}, {
key: "seed",
label: "种子",
type: "text",
default: "",
placeholder: "可选，留空随机"
}, {
key: "watermark",
label: "水印",
type: "select",
default: "0",
options: [ "0", "1" ],
hint: "0=请求关闭显式水印（隐式水印仍固定添加）"
} ]
}, {
id: "qwen_image_30_pro",
name: "Qwen-Image-3.0-Pro",
endpoint: "direct:dashscope",
modelId: "qwen-image-3.0-pro",
direct: "ds-image",
price: "¥0.25/张（2K ¥0.50）",
async: false,
type: "image",
desc: "中文文字强，国产旗舰",
billing: { type: "perImage", unit: .25, unitHi: .5, sizeKey: "size", sizeSplit: 1024, note: "1K 0.25/张 · 2K 0.5/张（参考图输入另 0.02/张，估算取输出主导价）" } /* IMPL-101：尺寸分层（F2a 解析 size） */,
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "size",
label: "分辨率",
type: "text",
default: "1024*1024",
placeholder: "宽*高，如 1024*1024，可 auto",
pattern: "^[0-9]+\\*[0-9]+$|^auto$" /* IMPL-119：池恢复校验门——阻断其他模型分辨率枚举（如 2K）泄入文本框 */
}, {
key: "n",
label: "张数",
type: "range",
default: 1,
min: 1,
max: 6,
step: 1
}, {
key: "negative_prompt",
label: "反向提示词",
type: "textarea",
default: ""
}, {
key: "prompt_extend",
label: "提示词改写",
type: "select",
default: "true",
options: [ "true", "false" ],
hint: "智能改写提升效果，需细节控制时关"
}, {
key: "watermark",
label: "水印",
type: "select",
default: "false",
options: [ "false", "true" ]
}, {
key: "seed",
label: "种子",
type: "text",
default: "",
placeholder: "可选，留空随机"
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv",
max: 3,
hint: "1-3 张（图生图/编辑）"
} ]
}, {
id: "kolors",
name: "Kolors",
endpoint: "direct:siliconflow",
modelId: "Kwai-Kolors/Kolors",
direct: "sf-image",
price: "免费",
async: false,
type: "image",
desc: "免费可用，风格迁移顺手",
billing: { type: "free" } /* IMPL-96②：官方定价页「Kwai-Kolors/Kolors 免费」 */,
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "image_size",
label: "分辨率",
type: "select",
default: "1024x1024",
options: [ "1024x1024", "960x1280", "768x1024", "720x1440", "720x1280" ]
}, {
key: "guidance_scale",
label: "引导系数",
type: "range",
default: 7.5,
min: 1,
max: 20,
step: .5,
hint: "越高越贴合提示词（仅 Kolors 适用）"
}, {
key: "num_inference_steps",
label: "步数",
type: "range",
default: 20,
min: 1,
max: 100,
step: 1
}, {
key: "negative_prompt",
label: "反向提示词",
type: "textarea",
default: ""
}, {
key: "seed",
label: "种子",
type: "text",
default: "",
placeholder: "可选，留空随机"
}, {
key: "watermark",
label: "水印",
type: "select",
default: "0",
options: [ "0", "1" ]
}, {
key: "image",
label: "参考图",
type: "ref-image",
output: "single",
hint: "可选，图生图"
} ]
}, {
id: "aliyun_cutout",
name: "阿里抠图",
seg: true,
type: "image",
async: true,
price: "阿里云计费",
desc: "一键抠图，透明底直出",
params: [ {
key: "segAction",
label: "分割能力",
type: "cap-grid",
default: "SegmentCommonImage",
options: [ {
value: "SegmentCommonImage",
label: "通用分割",
desc: "上限2000×2000，3MB"
}, {
value: "SegmentBody",
label: "人体分割",
desc: "真人照片，卡通不识别"
}, {
value: "SegmentHDBody",
label: "高清人体",
desc: "大图适用，异步稍慢"
}, {
value: "SegmentHDCommonImage",
label: "通用高清",
desc: "上限10000×10000，异步"
}, {
value: "SegmentHead",
label: "头像分割",
desc: "仅人脸头部，不含身体"
}, {
value: "SegmentHair",
label: "头发分割",
desc: "仅头发区域，输出mask"
}, {
value: "SegmentCloth",
label: "服饰分割",
desc: "仅衣裤裙鞋帽箱包"
}, {
value: "SegmentCommodity",
label: "商品分割",
desc: "适用电商商品主体"
}, {
value: "SegmentFood",
label: "食品分割",
desc: "仅食品主体"
}, {
value: "SegmentSky",
label: "天空分割",
desc: "仅天空区域，输出mask"
}, {
value: "SegmentHDSky",
label: "高清天空",
desc: "大图天空，异步稍慢"
}, {
value: "SegmentSkin",
label: "皮肤分割",
desc: "仅皮肤像素，输出mask"
}, {
value: "ChangeSky",
label: "天空替换",
desc: "需另传天空背景图"
}, {
value: "RefineMask",
label: "Mask 精细",
desc: "需原图+粗mask两张图"
} ]
}, {
key: "image",
label: "原图",
type: "ref-image",
output: "single",
required: true
}, {
key: "skyImage",
label: "天空背景图",
type: "ref-image",
output: "single",
visibleIf: {
key: "segAction",
values: [ "ChangeSky" ]
}
}, {
key: "maskImage",
label: "粗 mask 图",
type: "ref-image",
output: "single",
visibleIf: {
key: "segAction",
values: [ "RefineMask" ]
}
} ]
/* ══ APIYI 图片通道（2026-10-01 新增）—— 走 /media/apiyi/*，上游 https://api.apiyi.com/v1 ══════════
   ★★ 三处与速创的硬差别（都写进代码，别照抄 wy）：
     ① 模型名走 **body.model**（速创走路径）⇒ 没有"路径映射"这一步；
     ② 返回**纯 b64_json（无 data: 前缀）**，且 **response_format 不许传**（传了直接 400）；
     ③ **客户端超时不取消上游、照常计费** ⇒ timeout 必须给足（官方建议 360 秒）。
   ★ 分工由 params 里有没有 **mask** 键自动决定（编辑器 modelsForAction 按它过滤，零新增契约）：
     · 带 mask ⇒ 可被编辑器位图动作（擦除/重绘/扩图/角度/编辑文字/拆解）选中 —— 只有 gpt-image 官转系
     · 不带 mask ⇒ 只出现在文生图侧 —— SeeDream / FLUX（上游**没有** OpenAI 形态的 edits）
   ⚠ Nano Banana 系（nano-banana-pro / gemini-3-pro-image）**不在本表**：它走 Gemini 原生
     :generateContent，端点形状与鉴权路径都不同，需扩 Worker 白名单 + 单独适配器（见交付说明）。 */
}, {
id: "apiyi:gpt-image-2.5-sunburst",
name: "GPT-Image-2.5-sunburst（易）",
endpoint: "/v1/images/generations",
price: "按Token·入$5/出$30每M",
async: false,
type: "image",
channel: "apiyi",
modelId: "gpt-image-2.5-sunburst",
desc: "编辑精度最高，精修首选",
billing: { type: "perToken", inUsdPerM: 5, outUsdPerM: 30, refCny: 0.05, refNote: "实测 1K 单张 $0.0065（≈¥0.05）· 按 Token（入 $5/M · 出 $30/M，成本随用量浮动）" },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "auto",
options: [ "auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "1:3", "3:1", "2:1", "1:2" ],
hint: "自动＝不下发 size，由服务端决定"
}, {
key: "resolution",
label: "清晰度",
type: "select",
default: "auto",
options: [ "auto", "1K", "2K", "4K" ],
hint: "与比例合成官方 size 像素串；自动＝不下发"
}, {
/* ★★ R16（修 14:4x）：「最好具备质量和分辨率选项，这样能更经济地使用，真的需要品质的时候我再选高品质的服务」
   ⇒ 面板加 quality 键，**默认 medium**。**不默认 low**：low 在文字/细节场景掉得明显，
     medium 是官方默认基准档 ⇒ 省钱但不激进。
   值域照官方 low/medium/high/xhigh/max（xhigh/max 仅 2.5 两档接受；面板不细分）。 */
key: "quality",
label: "质量",
type: "select",
default: "medium",
options: [ "low", "medium", "high", "xhigh", "max" ]
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv"
}, {
key: "mask",
label: "遮罩图",
type: "ref-image",
output: "single"
} ]
}, {
id: "apiyi:gpt-image-2.5-flare",
name: "GPT-Image-2.5-flare（易）",
endpoint: "/v1/images/generations",
price: "按Token·入$5/出$30每M",
async: false,
type: "image",
channel: "apiyi",
modelId: "gpt-image-2.5-flare",
desc: "速度型选手，快而稳",
billing: { type: "perToken", inUsdPerM: 5, outUsdPerM: 30, refCny: 0.05, refNote: "实测 1K 单张 $0.0065（≈¥0.05）· 按 Token（入 $5/M · 出 $30/M，成本随用量浮动）" },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "auto",
options: [ "auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "1:3", "3:1", "2:1", "1:2" ],
hint: "自动＝不下发 size，由服务端决定"
}, {
key: "resolution",
label: "清晰度",
type: "select",
default: "auto",
options: [ "auto", "1K", "2K", "4K" ],
hint: "与比例合成官方 size 像素串；自动＝不下发"
}, {
/* ★★ R16（修 14:4x）：「最好具备质量和分辨率选项，这样能更经济地使用，真的需要品质的时候我再选高品质的服务」
   ⇒ 面板加 quality 键，**默认 medium**。**不默认 low**：low 在文字/细节场景掉得明显，
     medium 是官方默认基准档 ⇒ 省钱但不激进。
   值域照官方 low/medium/high/xhigh/max（xhigh/max 仅 2.5 两档接受；面板不细分）。 */
key: "quality",
label: "质量",
type: "select",
default: "medium",
options: [ "low", "medium", "high", "xhigh", "max" ]
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv"
}, {
key: "mask",
label: "遮罩图",
type: "ref-image",
output: "single"
} ]
}, {
id: "apiyi:gpt-image-2.5-all",
name: "GPT-Image-2.5-All（易）",
endpoint: "/v1/images/generations",
price: "0.21元/张（$0.03）",
async: false,
type: "image",
channel: "apiyi",
modelId: "gpt-image-2.5-all",
desc: "高性价比，走量首选",
billing: { type: "perImage", unit: 0.21 },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "auto",
options: [ "auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "1:3", "3:1", "2:1", "1:2" ],
hint: "自动＝不下发 size，由服务端决定"
}, {
key: "resolution",
label: "清晰度",
type: "select",
default: "auto",
options: [ "auto", "1K", "2K", "4K" ],
hint: "与比例合成官方 size 像素串；自动＝不下发"
}, {
/* ★★ R16（修 14:4x）：「最好具备质量和分辨率选项，这样能更经济地使用，真的需要品质的时候我再选高品质的服务」
   ⇒ 面板加 quality 键，**默认 medium**。**不默认 low**：low 在文字/细节场景掉得明显，
     medium 是官方默认基准档 ⇒ 省钱但不激进。
   值域照官方 low/medium/high/xhigh/max（xhigh/max 仅 2.5 两档接受；面板不细分）。 */
key: "quality",
label: "质量",
type: "select",
default: "medium",
options: [ "low", "medium", "high", "xhigh", "max" ]
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv"
} ]
}, {
id: "apiyi:gpt-image-2.5-vip",
name: "GPT-Image-2.5-VIP（易）",
endpoint: "/v1/images/generations",
price: "0.21元/张（$0.03）",
async: false,
type: "image",
channel: "apiyi",
modelId: "gpt-image-2.5-vip",
desc: "配额宽松，可锁尺寸",
billing: { type: "perImage", unit: 0.21 },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "auto",
options: [ "auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "1:3", "3:1", "2:1", "1:2" ],
hint: "自动＝不下发 size，由服务端决定"
}, {
key: "resolution",
label: "清晰度",
type: "select",
default: "auto",
options: [ "auto", "1K", "2K", "4K" ],
hint: "与比例合成官方 size 像素串；自动＝不下发"
}, {
/* ★★ R16（修 14:4x）：「最好具备质量和分辨率选项，这样能更经济地使用，真的需要品质的时候我再选高品质的服务」
   ⇒ 面板加 quality 键，**默认 medium**。**不默认 low**：low 在文字/细节场景掉得明显，
     medium 是官方默认基准档 ⇒ 省钱但不激进。
   值域照官方 low/medium/high/xhigh/max（xhigh/max 仅 2.5 两档接受；面板不细分）。 */
key: "quality",
label: "质量",
type: "select",
default: "medium",
options: [ "low", "medium", "high", "xhigh", "max" ]
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv"
} ]
}, {
id: "apiyi:gpt-image-2",
name: "GPT-Image-2（易）",
endpoint: "/v1/images/generations",
price: "按Token·入$5/出$30每M",
async: false,
type: "image",
channel: "apiyi",
modelId: "gpt-image-2",
desc: "上一代官方款，参数同形",
billing: { type: "perToken", inUsdPerM: 5, outUsdPerM: 30, refCny: 0.05, refNote: "实测 1K 单张 $0.0065（≈¥0.05）· 按 Token（入 $5/M · 出 $30/M，成本随用量浮动）" },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "auto",
options: [ "auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "1:3", "3:1", "2:1", "1:2" ],
hint: "自动＝不下发 size，由服务端决定"
}, {
key: "resolution",
label: "清晰度",
type: "select",
default: "auto",
options: [ "auto", "1K", "2K", "4K" ],
hint: "与比例合成官方 size 像素串；自动＝不下发"
}, {
/* ★★ R16（修 14:4x）：「最好具备质量和分辨率选项，这样能更经济地使用，真的需要品质的时候我再选高品质的服务」
   ⇒ 面板加 quality 键，**默认 medium**。**不默认 low**：low 在文字/细节场景掉得明显，
     medium 是官方默认基准档 ⇒ 省钱但不激进。
   值域照官方 low/medium/high/xhigh/max（xhigh/max 仅 2.5 两档接受；面板不细分）。 */
key: "quality",
label: "质量",
type: "select",
default: "medium",
options: [ "low", "medium", "high", "xhigh", "max" ]
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv"
}, {
key: "mask",
label: "遮罩图",
type: "ref-image",
output: "single"
} ]
}, {
id: "apiyi:seedream-5-0-flash-260915",
name: "SeeDream 5.0 Flash（易）",
endpoint: "/v1/images/generations",
price: "0.13元/张（$0.018）",
async: false,
type: "image",
channel: "apiyi",
modelId: "seedream-5-0-flash-260915",
desc: "全系最便宜，十几秒交付",
billing: { type: "perImage", unit: 0.13 },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "auto",
options: [ "auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "1:3", "3:1", "2:1", "1:2" ],
hint: "自动＝不下发 size，由服务端决定"
}, {
key: "resolution",
label: "清晰度",
type: "select",
default: "auto",
options: [ "auto", "1K", "2K", "4K" ],
hint: "与比例合成官方 size 像素串；自动＝不下发"
}, {
/* ★★ R16（修 14:4x）：「最好具备质量和分辨率选项，这样能更经济地使用，真的需要品质的时候我再选高品质的服务」
   ⇒ 面板加 quality 键，**默认 medium**。**不默认 low**：low 在文字/细节场景掉得明显，
     medium 是官方默认基准档 ⇒ 省钱但不激进。
   值域照官方 low/medium/high/xhigh/max（xhigh/max 仅 2.5 两档接受；面板不细分）。 */
key: "quality",
label: "质量",
type: "select",
default: "medium",
options: [ "low", "medium", "high", "xhigh", "max" ]
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv"
} ]
}, {
id: "apiyi:seedream-5-0-260128",
name: "SeeDream 5.0（易）",
endpoint: "/v1/images/generations",
price: "0.25元/张（$0.035）",
async: false,
type: "image",
channel: "apiyi",
modelId: "seedream-5-0-260128",
desc: "当前推荐档，综合素质强",
billing: { type: "perImage", unit: 0.25 },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "auto",
options: [ "auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "1:3", "3:1", "2:1", "1:2" ],
hint: "自动＝不下发 size，由服务端决定"
}, {
key: "resolution",
label: "清晰度",
type: "select",
default: "auto",
options: [ "auto", "1K", "2K", "4K" ],
hint: "与比例合成官方 size 像素串；自动＝不下发"
}, {
/* ★★ R16（修 14:4x）：「最好具备质量和分辨率选项，这样能更经济地使用，真的需要品质的时候我再选高品质的服务」
   ⇒ 面板加 quality 键，**默认 medium**。**不默认 low**：low 在文字/细节场景掉得明显，
     medium 是官方默认基准档 ⇒ 省钱但不激进。
   值域照官方 low/medium/high/xhigh/max（xhigh/max 仅 2.5 两档接受；面板不细分）。 */
key: "quality",
label: "质量",
type: "select",
default: "medium",
options: [ "low", "medium", "high", "xhigh", "max" ]
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv"
} ]
}, {
id: "apiyi:flux-2-pro",
name: "FLUX 2 Pro（易）",
endpoint: "/v1/images/generations",
price: "0.21元/张（$0.03）",
async: false,
type: "image",
channel: "apiyi",
modelId: "flux-2-pro",
desc: "写实与设计风格见长",
billing: { type: "perImage", unit: 0.21 },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "auto",
options: [ "auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "1:3", "3:1", "2:1", "1:2" ],
hint: "自动＝不下发 size，由服务端决定"
}, {
key: "resolution",
label: "清晰度",
type: "select",
default: "auto",
options: [ "auto", "1K", "2K", "4K" ],
hint: "与比例合成官方 size 像素串；自动＝不下发"
}, {
/* ★★ R16（修 14:4x）：「最好具备质量和分辨率选项，这样能更经济地使用，真的需要品质的时候我再选高品质的服务」
   ⇒ 面板加 quality 键，**默认 medium**。**不默认 low**：low 在文字/细节场景掉得明显，
     medium 是官方默认基准档 ⇒ 省钱但不激进。
   值域照官方 low/medium/high/xhigh/max（xhigh/max 仅 2.5 两档接受；面板不细分）。 */
key: "quality",
label: "质量",
type: "select",
default: "medium",
options: [ "low", "medium", "high", "xhigh", "max" ]
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv"
} ]
}, {
id: "apiyi:nano-banana",
name: "Nano Banana 一代（易）",
endpoint: "/v1beta/models/gemini-2.5-flash-image:generateContent",
endpointModel: "gemini-2.5-flash-image",
gemini: true,
thinking: false, /* ★ R95-1-3：把「是否支持 thinkingLevel」写入定义 —— 原来 apiyiGemini 读 def.thinking 而定义里根本没这字段（恒 undefined ⇒ 思考参数永不下发） */
price: "0.14元/张（$0.02/次）",
async: false,
type: "image",
channel: "apiyi",
modelId: "nano-banana",
desc: "一代经典，1K 成本低",
billing: { type: "perImage", unit: 0.14 },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "1:1",
options: [ "1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9" ],
hint: "本模型支持 10 种比例"
}, {
key: "resolution",
label: "清晰度",
type: "select",
default: "1K",
options: [ "1K" ],
hint: "本模型只有 1K 一档（传 2K/4K 会报错）"
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv",
max: 14
} ]
}, {
id: "apiyi:nano-banana-2-lite",
name: "Nano Banana 2 Lite（易）",
endpoint: "/v1beta/models/gemini-3.1-flash-lite-image:generateContent",
endpointModel: "gemini-3.1-flash-lite-image",
gemini: true,
thinking: true, /* ★ R95-1-3：把「是否支持 thinkingLevel」写入定义 —— 原来 apiyiGemini 读 def.thinking 而定义里根本没这字段（恒 undefined ⇒ 思考参数永不下发） */
price: "0.09元/张（$0.0134 实测）",
async: false,
type: "image",
channel: "apiyi",
modelId: "nano-banana-2-lite",
desc: "四秒生成，最轻快省费",
billing: { type: "perImage", unit: 0.09 },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "1:1",
options: [ "1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9", "1:4", "4:1", "1:8", "8:1" ],
hint: "本模型支持 14 种比例"
}, {
key: "resolution",
label: "清晰度",
type: "select",
default: "1K",
options: [ "1K" ],
hint: "本模型只有 1K 一档（传 2K/4K 会报错）"
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv",
max: 14
} ]
}, {
id: "apiyi:nano-banana-2",
name: "Nano Banana 2（易）",
endpoint: "/v1beta/models/gemini-3.1-flash-image:generateContent",
endpointModel: "gemini-3.1-flash-image",
gemini: true,
thinking: true, /* ★ R95-1-3：把「是否支持 thinkingLevel」写入定义 —— 原来 apiyiGemini 读 def.thinking 而定义里根本没这字段（恒 undefined ⇒ 思考参数永不下发） */
price: "0.23元/张（$0.0331 实测）",
async: false,
type: "image",
channel: "apiyi",
modelId: "nano-banana-2",
desc: "画质接近 Pro，速度更快",
billing: { type: "perImage", unit: 0.23 },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "1:1",
options: [ "1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9", "1:4", "4:1", "1:8", "8:1" ],
hint: "本模型支持 14 种比例"
}, {
key: "resolution",
label: "清晰度",
type: "select",
default: "1K",
options: [ "1K", "2K", "4K" ],
hint: "1K/2K/4K（4K 官方建议 600 秒兜底）"
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv",
max: 14
} ]
}, {
id: "apiyi:nano-banana-pro",
name: "Nano Banana Pro（易）",
endpoint: "/v1beta/models/gemini-3-pro-image:generateContent",
endpointModel: "gemini-3-pro-image",
gemini: true,
thinking: false, /* ★ R95-1-3：把「是否支持 thinkingLevel」写入定义 —— 原来 apiyiGemini 读 def.thinking 而定义里根本没这字段（恒 undefined ⇒ 思考参数永不下发） */
price: "0.63元/张（$0.09/次）",
async: false,
type: "image",
channel: "apiyi",
modelId: "nano-banana-pro",
desc: "旗舰画质，4K 文字最强",
billing: { type: "perImage", unit: 0.63 },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述图片"
}, {
key: "aspectRatio",
label: "比例",
type: "select",
default: "1:1",
options: [ "1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9" ],
hint: "本模型支持 10 种比例"
}, {
key: "resolution",
label: "清晰度",
type: "select",
default: "1K",
options: [ "1K", "2K", "4K" ],
hint: "1K/2K/4K（4K 官方建议 600 秒兜底）"
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "csv",
max: 14
} ]
} ],
video: [ {
/* ★ R21-5（修 2026-10-01「视频模型需要更新到宿主模型列表」）：APIYI 视频档进列表。
   ⚠ 诚实口径：**生成适配器未接**（Worker 白名单 /v1/videos 已备，适配器属 Phase 2）
   ⇒ ★ R32（2026-10-03）**标注已随 V1 适配器接入而撤掉**（原为「Phase 2 接入中」+ 暂不可生成字样）。
   定价真值 = api/pricing：veo-3.1 按次（$1.2/$0.3 每次换算 ¥×7）；Seedance 系按Token（ratio 35/23/18.5）。 */
id: "apiyi:seedance-2-5-260628",
name: "Seedance 2.5（易）",
endpoint: "/v1/videos",
price: "按Token·$12.6/M（官方实测）",
async: false,
type: "video",
channel: "apiyi",
modelId: "doubao-seedance-2-5-260628",
desc: "长时直出，多参考融合强",
billing: { type: "perToken", inUsdPerM: 12.6, outUsdPerM: 12.6, source: "api", note: "Seedance 2.5 官方实测两档 token 单价：输入不含视频（文生/图生/参考图）$12.60/M、含参考视频 $7.56/M；本通道不传 video_url ⇒ 走 12.6 档。校验：720p/5s = 108,900 tokens × 12.6/M = $1.3721 = ¥9.60，与官方价格表逐格吻合" },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述视频"
}, {
/* ★★ R34（2026-10-04）：参考素材**五档互斥**（refGroups = 编辑器「生成视频」面板的唯一档位数据源）。
   官方真值（docs.apiyi.com · 04-视频API（官转）.md）：Seedance 2.5 走 content[] + role，
   **全套**支持 first_frame / last_frame / 参考图(≤30) / 参考视频(总≤15s) / 参考音频(总≤15s)。
   ⚠ 替换掉原先那条 key: "urls", type: "ref-image", max: 30 —— 它只有"参考图"一个笼统语义，
     既无首尾帧也无互斥，用户不知道该填哪张；留着会和下面的 images 档**重复两个同名槽**。
   ⚠ 硬约束必须挂在 hint 上（否则用户一填就吃 400）：
     首帧/编辑/延长 → ratio 必须 adaptive；编辑 → duration 必须 -1。 */
key: "first_frame",
label: "首帧",
type: "ref-image",
output: "single",
hint: "首帧图（画布上选中的图层会自动带入）；带首帧时宽高比必须选 adaptive"
}, {
key: "last_frame",
label: "尾帧",
type: "ref-image",
output: "single",
hint: "可选，与首帧构成转场；编辑模式下时长需设为 -1（智能时长）"
}, {
key: "images",
label: "参考图",
type: "ref-image",
output: "csv",
max: 30,
hint: "内容参考 1-30 张（官方上限）；与首尾帧互斥"
}, {
key: "videos",
label: "参考视频",
type: "ref-video",
output: "csv",
max: 5,
hint: "动作 / 风格参考，总时长 ≤15s；与首尾帧互斥"
}, {
key: "audios",
label: "参考音频",
type: "ref-audio",
output: "csv",
max: 5,
hint: "口播 / 配乐参考，总时长 ≤15s；与首尾帧互斥"},
{
key: "resolution",
label: "分辨率",
type: "select",
default: "720p",
options: [ "480p", "720p", "1080p" ],
hint: "小写；4k 不支持（传了会 400 且不扣费）"
}, {
key: "ratio",
label: "宽高比",
type: "select",
default: "adaptive",
options: [ "16:9", "4:3", "1:1", "3:4", "9:16", "21:9", "adaptive" ]
}, {
key: "duration",
label: "时长",
type: "range",
default: 5,
min: 4,
max: 30,
step: 1,
unit: "s",
hint: "2.5 为 4~30 整数；按时长计费，成本敏感就显式传"
}, {
key: "generate_audio",
label: "音频",
type: "select",
default: "true",
options: [ "true", "false" ]

}
] ,
refGroups: {
title: "参考素材",
hint: "只能选择一种",
modes: [ {
label: "无参考",
value: "none",
params: [ ]
}, {
label: "首尾帧",
value: "frame",
params: [ "first_frame", "last_frame" ]
}, {
label: "参考图",
value: "images",
params: [ "images" ]
}, {
label: "视频",
value: "videos",
params: [ "videos" ]
}, {
label: "音频",
value: "audios",
params: [ "audios" ]
} ]
}
}, {
id: "apiyi:veo-3.1-generate-preview",
name: "VEO 3.1（易）",
endpoint: "/v1/videos",
price: "¥8.40/次（$1.2）",
async: false,
type: "video",
channel: "apiyi",
modelId: "veo-3.1-generate-preview",
desc: "最高 4K，原生带音轨",
billing: { type: "perImage", unit: 8.4 },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述视频"
}, {
/* ★ R34（2026-10-04）：VEO 3.1 官方**只接受 1 张 input_reference**（单数，字段名也不同于别家）。
   ⇒ 只有「首帧」是真能用的档；尾帧 / 参考图(多) / 参考视频 官方**没有**。
   ★ 拍板③「全部显示但置灰，不用说明原因」⇒ 这三档照样列出来、disabled: true 置灰，
     不写 hint 解释为什么。直接删掉那几档 = 用户看不出这家只支持一张图，像是漏做（R17）。 */
key: "first_frame",
label: "首帧",
type: "ref-image",
output: "single",
hint: "官方仅接受 1 张参考图（input_reference）"},
{
key: "resolution",
label: "分辨率",
type: "select",
default: "1080p",
options: [ "720p", "1080p", "4k" ],
hint: "三档同价（按次计费）；4k 需 models = veo-3.1-generate-preview，耗时 4~6 倍"
}, {
key: "ratio",
label: "宽高比",
type: "select",
default: "16:9",
options: [ "16:9", "9:16" ]
}, {
key: "seconds",
label: "时长",
type: "select",
default: "8",
options: [ "4", "6", "8" ],
hint: "官方字段是 seconds 且必须传字符串（写 duration 会被静默忽略成 4 秒）；1080p 与 4k 只接受 8 秒一档，只有 720p 三档时长都能用"
}
] ,
refGroups: {
title: "参考素材",
hint: "只能选择一种",
modes: [ {
label: "无参考",
value: "none",
params: [ ]
}, {
label: "首帧",
value: "frame",
params: [ "first_frame" ]
}, {
label: "尾帧",
value: "last_frame",
params: [ ],
disabled: true
}, {
label: "参考图",
value: "images",
params: [ ],
disabled: true
}, {
label: "视频",
value: "videos",
params: [ ],
disabled: true
} ]
}
}, {
id: "apiyi:wan3.0-video",
name: "Wan3.0 视频（易）",
/* ★ R29-F（修 2026-10-02「WAN3.0 不可能没参数」⇒ 复查资料后补齐）：APIYI **无 wan3.0 独立文档页**
   （官方注册表 docs_url=null，Wan 文档区只覆盖 2.7），但官方明确 **Wan 系全部走 DashScope 透传**——
   《Wan 视频生成指南》原文：「API易 通过 **DashScope 透传通道** 直连阿里云百炼，让你用一个 sk- 开头的
   API易 Key 即可调用全部 Wan 视频能力」⇒ 参数取**同族 3.0 百炼官方 schema**（与宿主「Wan3.0-Video（连）」
   的 params/refGroups **逐字同源**，非编造）。create 端点（官方原文，**不是 /v1/videos**）：
   POST /wan/api/v1/services/aigc/video-generation/video-synthesis · 必带 X-DashScope-Async: enable ·
   duration 必须整数 · resolution 大写 720P/1080P；查询 GET /v1/tasks/{task_id}。 */
endpoint: "/wan/api/v1/services/aigc/video-generation/video-synthesis",
price: "按Token·$0.48/M（每条价官方未提供）",
async: false,
type: "video",
channel: "apiyi",
modelId: "wan3.0-video",
desc: "阿里万相 · 全模态旗舰",
billing: { type: "perToken", inUsdPerM: 0.48, outUsdPerM: 0.48, source: "api", note: "视频按量计费（$0.48/M，CSV 真值）；折算方式官方未提供 ⇒ 不估每条价" },
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述视频"
}, {
key: "resolution",
label: "分辨率",
type: "select",
default: "1080P",
options: [ "1080P", "720P", "480P" ]
}, {
key: "ratio",
label: "宽高比",
type: "select",
default: "adaptive",
options: [ "adaptive", "21:9", "16:9", "4:3", "1:1", "3:4", "9:16" ]
}, {
key: "duration",
label: "时长",
type: "range",
default: 5,
min: 2,
max: 30,
step: 1,
unit: "s",
hint: "2~30 秒（官方另支持 -1 智能时长，滑杆无法表达）"
}, {
key: "audio",
label: "音频",
type: "select",
default: "true",
options: [ "true", "false" ],
hint: "是否输出有声视频"
}, {
key: "prompt_extend",
label: "提示词改写",
type: "select",
default: "true",
options: [ "true", "false" ]
}, {
key: "seed",
label: "种子",
type: "text",
default: "",
placeholder: "可选，留空随机"
}, {
key: "watermark",
label: "水印",
type: "select",
default: "false",
options: [ "false", "true" ],
hint: "右下角「AI生成」水印标识"
}, {
key: "first_frame",
label: "首帧",
type: "ref-image",
output: "single",
hint: "可选，图生视频"
}, {
key: "last_frame",
label: "尾帧",
type: "ref-image",
output: "single",
hint: "需搭配首帧"
}, {
key: "images",
label: "参考图",
type: "ref-image",
output: "csv",
max: 10,
hint: "内容参考 1-10 张，与首尾帧互斥"
}, {
key: "videos",
label: "参考视频",
type: "ref-video",
output: "csv",
max: 5,
hint: "总时长 ≤15s，与首尾帧互斥"
}, {
key: "audios",
label: "参考音频",
type: "ref-audio",
output: "csv",
max: 5,
hint: "总时长 ≤15s，与首尾帧互斥"
} ],
refGroups: { /* ★ R29-F：与百炼同族 schema（DashScope 透传）；五档互斥（none=纯文生视频，frame=首尾帧） */
title: "参考素材",
hint: "只能选择一种",
modes: [ {
label: "无参考",
value: "none",
params: [ ]
}, {
label: "首尾帧",
value: "frame",
params: [ "first_frame", "last_frame" ]
}, {
label: "参考图",
value: "images",
params: [ "images" ]
}, {
label: "视频",
value: "videos",
params: [ "videos" ]
}, {
label: "音频",
value: "audios",
params: [ "audios" ]
} ]
}
}, {
id: "wan3",
name: "Wan3.0",

endpoint: "/api/async/video_wan_3.0",
price: "0.3元/秒",
async: true,
type: "video",
desc: "首尾帧与参考全能",
billing: {
type: "perSecond",
unit: .3,
durationKey: "duration"
},
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述视频"
}, {
key: "ratio",
label: "宽高比",
type: "select",
default: "16:9",
options: [ "16:9", "9:16" ]
}, {
key: "duration",
label: "时长",
type: "range",
default: 5,
min: 4,
max: 30,
step: 1,
unit: "s"
}, {
key: "generate_audio",
label: "音频",
type: "select",
default: "true",
options: [ "true", "false" ]
}, {
key: "first_frame",
label: "首帧",
type: "ref-image",
output: "single"
}, {
key: "last_frame",
label: "尾帧",
type: "ref-image",
output: "single",
hint: "需搭配首帧"
}, {
key: "images",
label: "参考图",
type: "ref-image",
output: "csv",
max: 10
}, {
key: "videos",
label: "参考视频",
type: "ref-video",
output: "csv",
max: 5
}, {
key: "audios",
label: "参考音频",
type: "ref-audio",
output: "csv",
max: 5
} ],
refGroups: {
title: "参考素材",
hint: "只能选择一种",
modes: [ {
label: "首尾帧",
value: "frame",
params: [ "first_frame", "last_frame" ]
}, {
label: "参考图",
value: "images",
params: [ "images" ]
}, {
label: "视频",
value: "videos",
params: [ "videos" ]
}, {
label: "音频",
value: "audios",
params: [ "audios" ]
} ]
}
}, {
id: "minimax_h3",
name: "MiniMax H3",
endpoint: "/api/async/video_minimax_h3",
price: "0.3元/秒",
async: true,
type: "video",
desc: "均衡全能款，衔接顺滑",
billing: {
type: "perSecond",
unit: .3,
durationKey: "duration"
},
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: ""
}, {
key: "ratio",
label: "宽高比",
type: "select",
default: "adaptive",
options: [ "21:9", "16:9", "4:3", "1:1", "3:4", "9:16", "adaptive" ]
}, {
key: "duration",
label: "时长",
type: "range",
default: 5,
min: 4,
max: 15,
step: 1,
unit: "s"
}, {
key: "resolution",
label: "分辨率",
type: "select",
default: "2K",
options: [ "768P", "2K" ]
}, {
key: "first_frame",
label: "首帧",
type: "ref-image",
output: "single"
}, {
key: "last_frame",
label: "尾帧",
type: "ref-image",
output: "single",
hint: "需搭配首帧"
}, {
key: "images",
label: "参考图",
type: "ref-image",
output: "csv",
max: 9
}, {
key: "videos",
label: "参考视频",
type: "ref-video",
output: "csv",
max: 3
}, {
key: "audios",
label: "参考音频",
type: "ref-audio",
output: "csv",
max: 3
} ],
refGroups: {
title: "参考素材",
hint: "只能选择一种",
modes: [ {
label: "首尾帧",
value: "frame",
params: [ "first_frame", "last_frame" ]
}, {
label: "参考图",
value: "images",
params: [ "images" ]
}, {
label: "视频",
value: "videos",
params: [ "videos" ]
}, {
label: "音频",
value: "audios",
params: [ "audios" ]
} ]
}
}, {
id: "video_upscaling",
name: "Video Upscaling",
endpoint: "/api/async/video_processing",
price: "0.1元/秒",
async: true,
type: "video",
desc: "一键超分，提升清晰度",
billing: {
type: "perSecond",
unit: .1,
durationKey: null,
note: "按视频时长"
},
params: [ {
key: "video_url",
label: "原视频",
type: "ref-video",
output: "single",
required: true
} ]
}, {
id: "google_omni",
name: "Google Omni",
endpoint: "/api/async/video_google_omni",
price: "0.1元/秒",
async: true,
type: "video",
desc: "全能灵活，多模态输入",
billing: {
type: "perSecond",
unit: .1,
durationKey: "duration"
},
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: ""
}, {
key: "size",
label: "尺寸",
type: "select",
default: "1280x720",
options: [ "1280x720", "720x1280", "1920x1080", "1080x1920" ]
}, {
key: "duration",
label: "时长",
type: "range",
default: 10,
min: 10,
max: 10,
step: 1,
unit: "s",
hint: "固定 10 秒"
}, {
key: "images",
label: "参考图",
type: "ref-image",
output: "single"
}, {
key: "video",
label: "参考视频",
type: "ref-video",
output: "single"
} ],
refGroups: {
title: "参考素材",
hint: "参考图/视频二选一",
modes: [ {
label: "无参考",
value: "none",
params: []
}, {
label: "参考图",
value: "image",
params: [ "images" ]
}, {
label: "视频",
value: "video",
params: [ "video" ]
} ]
}
}, {
id: "video_vidu",
name: "Vidu Q3",
endpoint: "/api/async/video_vidu",
price: "1.0元/秒",
async: true,
type: "video",
desc: "主体一致性好，运镜稳",
billing: {
type: "perSecond",
unit: 1,
durationKey: "duration"
},
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: ""
}, {
key: "aspectRatio",
label: "宽高比",
type: "select",
default: "16:9",
options: [ "16:9", "9:16", "4:3", "3:4", "1:1" ]
}, {
key: "resolution",
label: "分辨率",
type: "select",
default: "720p",
options: [ "540p", "720p", "1080p" ]
}, {
key: "duration",
label: "时长",
type: "range",
default: 5,
min: 1,
max: 10,
step: 1,
unit: "s"
}, {
key: "subjects",
label: "主体图",
type: "ref-image",
output: "single",
hint: "上传一张主体图"
}, {
key: "image_url",
label: "参考图",
type: "ref-image",
output: "single"
}, {
key: "video_url",
label: "视频参考",
type: "ref-video",
output: "csv",
max: 2, /* IMPL-152：doc/71 视频参考 1~2 个（非主体调用时使用）——原先端零通道 */
hint: "最多 2 个，与主体/图像参考互斥"
}, {
key: "bgm",
label: "BGM",
type: "select",
default: "false",
options: [ "true", "false" ]
}, {
key: "watermark",
label: "水印",
type: "select",
default: "1",
options: [ "1", "0" ]
} ],
refGroups: {
title: "参考方式",
hint: "主体与图像参考互斥",
modes: [ {
label: "主体参考",
value: "subject",
params: [ "subjects" ]
}, {
label: "图像参考",
value: "image",
params: [ "image_url" ]
}, {
label: "视频参考",
value: "video",
params: [ "video_url" ]
} ]
}
}, {
id: "video_omni",
name: "可灵 Omni",
endpoint: "/api/async/video_omni",
price: "1.0元/秒",
async: true,
type: "video",
desc: "首尾帧衔接自然流畅",
billing: {
type: "perSecond",
unit: 1,
durationKey: "duration"
},
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: ""
}, {
key: "aspectRatio",
label: "宽高比",
type: "select",
default: "16:9",
options: [ "16:9", "9:16", "1:1" ]
}, {
key: "resolution",
label: "模式",
type: "select",
default: "pro",
options: [ "std", "pro", "4k" ]
}, {
key: "duration",
label: "时长",
type: "range",
default: 5,
min: 3,
max: 15,
step: 1,
unit: "s"
}, {
key: "sound",
label: "声音",
type: "select",
default: "on",
options: [ "on", "off" ]
}, {
key: "watermark",
label: "水印",
type: "select",
default: "1",
options: [ "1", "0" ]
}, {
key: "firstFrameUrl",
label: "首帧",
type: "ref-image",
output: "single"
}, {
key: "lastFrameUrl",
label: "尾帧",
type: "ref-image",
output: "single",
hint: "需搭配首帧"
}, {
key: "image_url",
label: "参考图",
type: "ref-image",
output: "single"
}, {
key: "video_url",
label: "参考视频",
type: "ref-video",
output: "single",
hint: "有视频时声音需关"
} ],
refGroups: {
title: "参考素材",
hint: "选择一种参考方式",
modes: [ {
label: "无参考",
value: "none",
params: []
}, {
label: "首尾帧",
value: "frames",
params: [ "firstFrameUrl", "lastFrameUrl" ]
}, {
label: "参考图",
value: "image",
params: [ "image_url" ]
}, {
label: "视频",
value: "video",
params: [ "video_url" ]
} ]
}
}, {
id: "digital_humans",
name: "Digital Humans",
endpoint: "/api/async/video_digital_humans",
price: "0.02元/秒",
async: true,
type: "video",
desc: "数字人口播，一键合成",
billing: {
type: "perSecond",
unit: .02,
durationKey: null
},
params: [ {
key: "videoName",
label: "名称",
type: "text",
required: true,
default: "任务1"
}, {
key: "audioUrl",
label: "音频URL",
type: "url"
}, {
key: "videoUrl",
label: "人物视频",
type: "ref-video",
output: "single",
hint: "mp4 · 至少 10 秒"
} ]
}, {
id: "video_package",
name: "Package 1.0",
endpoint: "/api/async/video_package",
price: "0.02元/秒",
async: true,
type: "video",
desc: "模板套用，批量高效",
billing: {
type: "perSecond",
unit: .02,
durationKey: null
},
params: [ {
key: "video",
label: "原视频",
type: "ref-video",
output: "single",
required: true
}, {
key: "template_id",
label: "模板",
type: "select",
default: "1",
options: Array.from({
length: 30
}, (_, i) => String(i + 1))
} ]
}, {
id: "veo3_fast",
name: "veo3.1 Fast",
endpoint: "/api/async/video_veo3.1_fast",
price: "0.05元/秒",
async: true,
type: "video",
desc: "快速版，支持首尾帧",
billing: {
type: "perSecond",
unit: .05,
durationKey: "duration"
},
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: ""
}, {
key: "aspectRatio",
label: "宽高比",
type: "select",
default: "16:9",
options: [ "16:9" ]
}, {
key: "size",
label: "清晰度",
type: "select",
default: "720p",
options: [ "720p", "1080p" ]
}, {
key: "duration",
label: "时长",
type: "range",
default: 8,
min: 4,
max: 8,
step: 1,
unit: "s",
hint: "上游可能固定时长出片，以实际结果为准"
}, {
key: "firstFrameUrl",
label: "首帧",
type: "ref-image",
output: "single"
}, {
key: "lastFrameUrl",
label: "尾帧",
type: "ref-image",
output: "single",
hint: "需搭配首帧"
}, {
key: "urls",
label: "参考图",
type: "ref-image",
output: "array"
} ],
refGroups: {
title: "参考素材",
hint: "首尾帧与参考图互斥",
modes: [ {
label: "无参考",
value: "none",
params: []
}, {
label: "首尾帧",
value: "frames",
params: [ "firstFrameUrl", "lastFrameUrl" ]
}, {
label: "参考图",
value: "images",
params: [ "urls" ]
} ]
}
}, {
id: "wan3_video",
name: "Wan3.0-Video",
endpoint: "direct:dashscope",
modelId: "wan3.0-video",
direct: "ds-video",
price: "¥0.3-1.2/秒（按分辨率）",
async: false,
type: "video",
desc: "万相 3.0 全模态直连",
billing: { type: "perSecond", unit: .3, durationKey: "duration", tierKey: "resolution", tiers: { "480P": .3, "720P": .6, "1080P": 1.2 }, note: "按时长×分辨率（480P 0.3 / 720P 0.6 / 1080P 1.2 元/秒）" } /* IMPL-96②：官方价按分辨率分层，计费秒数=输入+输出 */,
params: [ {
key: "prompt",
label: "提示词",
type: "textarea",
required: true,
default: "",
placeholder: "描述视频"
}, {
key: "resolution",
label: "分辨率",
type: "select",
default: "1080P",
options: [ "1080P", "720P", "480P" ]
}, {
key: "ratio",
label: "宽高比",
type: "select",
default: "adaptive",
options: [ "adaptive", "21:9", "16:9", "4:3", "1:1", "3:4", "9:16" ]
}, {
key: "duration",
label: "时长",
type: "range",
default: 5,
min: 2,
max: 30,
step: 1,
unit: "s",
hint: "2~30 秒（官方另支持 -1 智能时长，滑杆无法表达）"
}, {
key: "audio",
label: "音频",
type: "select",
default: "true",
options: [ "true", "false" ],
hint: "是否输出有声视频"
}, {
key: "prompt_extend",
label: "提示词改写",
type: "select",
default: "true",
options: [ "true", "false" ]
}, {
key: "seed",
label: "种子",
type: "text",
default: "",
placeholder: "可选，留空随机"
}, {
key: "watermark",
label: "水印",
type: "select",
default: "false",
options: [ "false", "true" ],
hint: "右下角「AI生成」水印标识"
}, {
key: "first_frame",
label: "首帧",
type: "ref-image",
output: "single",
hint: "可选，图生视频"
}, {
key: "last_frame",
label: "尾帧",
type: "ref-image",
output: "single",
hint: "需搭配首帧"
}, {
key: "images",
label: "参考图",
type: "ref-image",
output: "csv",
max: 10,
hint: "内容参考 1-10 张，与首尾帧互斥"
}, {
key: "videos",
label: "参考视频",
type: "ref-video",
output: "csv",
max: 5,
hint: "总时长 ≤15s，与首尾帧互斥"
}, {
key: "audios",
label: "参考音频",
type: "ref-audio",
output: "csv",
max: 5,
hint: "总时长 ≤15s，与首尾帧互斥"
} ],
refGroups: { /* IMPL-152：首尾帧面板统一（用户工单④）；IMPL-162 恢复五档——IMPL-152 以「百炼无文档」收缩为两档，与在库官方查证 tmp/impl95/models-doc.md §4 冲突（input.media[] 明列 reference_image≤10/reference_video≤5/reference_audio≤5，与首尾帧互斥）；_dsVideo 预留映射（body.images/videos/audios→reference_*，cap 10/5/5）与互斥校验（IMPL-119）早已在位，本次仅放开 UI 声明——执行器/Worker/校验零改动；none=纯文生视频（默认档，原语义不变），frame=首/尾帧（body 键名不变） */
title: "参考素材",
hint: "只能选择一种",
modes: [ {
label: "无参考",
value: "none",
params: [ ]
}, {
label: "首尾帧",
value: "frame",
params: [ "first_frame", "last_frame" ]
}, {
label: "参考图",
value: "images",
params: [ "images" ]
}, {
label: "视频",
value: "videos",
params: [ "videos" ]
}, {
label: "音频",
value: "audios",
params: [ "audios" ]
} ]
}
} ],
audio: [ {
id: "audio_tts",
name: "语音合成(异步)",
endpoint: "/api/async/audio_tts",
price: "0.0006元/字符",
async: true,
type: "audio",
desc: "多音色多语种，开箱即用",
billing: {
type: "perChar",
unit: 6e-4,
charKey: "text"
},
params: [ {
key: "text",
label: "文本",
type: "textarea",
required: true,
default: "你好，我是AI语音助手。"
}, {
key: "voice_id",
label: "音色",
type: "datalist",
required: true,
default: "male-qn-qingse",
options: [ {
value: "male-qn-qingse",
label: "青涩男声"
}, {
value: "male-qn-jingying",
label: "精英男声"
}, {
value: "male-qn-badao",
label: "霸道男声"
}, {
value: "male-qn-daxuesheng",
label: "大学生男声"
}, {
value: "male-qn-qingnian",
label: "青年男声"
}, {
value: "male-qn-chengshu",
label: "成熟男声"
}, {
value: "female-shaonv",
label: "少女女声"
}, {
value: "female-yujie",
label: "御姐女声"
}, {
value: "female-chengshu",
label: "成熟女声"
}, {
value: "female-zhibo",
label: "直播女声"
}, {
value: "female-wenrou",
label: "温柔女声"
}, {
value: "female-zhishixing",
label: "知性女声"
}, {
value: "presenter_male",
label: "主持人男声"
}, {
value: "presenter_female",
label: "主持人女声"
} ]
}, {
key: "speed",
label: "语速",
type: "range",
default: 1,
min: .5,
max: 2,
step: .1,
unit: "x"
}, {
key: "vol",
label: "音量",
type: "range",
default: 1,
min: .1,
max: 10,
step: .1
}, {
key: "language_boost",
label: "语种",
type: "select",
default: "auto",
options: [ "auto", "Chinese", "Chinese,Yue", "English", "Arabic", "Russian", "Spanish", "French", "Portuguese", "German", "Turkish", "Dutch", "Ukrainian", "Vietnamese", "Indonesian", "Japanese", "Italian", "Korean" ]
} ]
}, {
id: "voice_composite",
name: "语音合成(同步)",
endpoint: "/api/voice/composite",
price: "0.0006元/字符",
async: false,
type: "audio",
desc: "实时合成，边说边出",
billing: {
type: "perChar",
unit: 6e-4,
charKey: "text"
},
params: [ {
key: "text",
label: "文本",
type: "textarea",
required: true,
default: "你好，我是AI语音助手。"
}, {
key: "voice_id",
label: "音色",
type: "datalist",
required: true,
default: "male-qn-qingse",
options: [ {
value: "male-qn-qingse",
label: "青涩男声"
}, {
value: "male-qn-jingying",
label: "精英男声"
}, {
value: "male-qn-chengshu",
label: "成熟男声"
}, {
value: "female-shaonv",
label: "少女女声"
}, {
value: "female-yujie",
label: "御姐女声"
}, {
value: "female-wenrou",
label: "温柔女声"
}, {
value: "female-zhishixing",
label: "知性女声"
}, {
value: "presenter_male",
label: "主持人男声"
}, {
value: "presenter_female",
label: "主持人女声"
}, {
value: "male-qn-badao",
label: "霸道男声"
}, {
value: "male-qn-qingnian",
label: "青年男声"
}, {
value: "female-chengshu",
label: "成熟女声"
} ]
}, {
key: "speed",
label: "语速",
type: "range",
default: 1,
min: .5,
max: 2,
step: .1,
unit: "x"
}, {
key: "vol",
label: "音量",
type: "range",
default: 1,
min: .1,
max: 10,
step: .1
}, {
key: "language_boost",
label: "语种",
type: "select",
default: "auto",
options: [ "auto", "Chinese", "Chinese,Yue", "English", "Arabic", "Russian", "Spanish", "French", "Portuguese", "German", "Turkish", "Dutch", "Ukrainian", "Vietnamese", "Indonesian", "Japanese", "Italian", "Korean" ]
} ]
}, {
id: "voice_clone",
name: "语音克隆",
endpoint: "/api/voice/clone",
price: "6.0元/次",
async: false,
type: "audio",
desc: "上传样本即可克隆音色",
billing: {
type: "perCall",
unit: 6
},
params: [ {
key: "audio_url",
label: "参考音频URL",
type: "url",
required: true,
placeholder: "https://..."
}, {
key: "text",
label: "朗读文本",
type: "textarea",
required: true,
default: "你好，我是你的克隆声音，我会40种各国语言，希望未来可以和你好好相处"
}, {
key: "name",
label: "名称",
type: "text"
} ]
}, {
id: "cosyvoice_v35_plus",
name: "CosyVoice-v3.5-Plus",
endpoint: "direct:dashscope",
modelId: "cosyvoice-v3.5-plus",
direct: "ds-tts",
price: "¥1.5/万字符",
async: false,
type: "audio",
desc: "旗舰音色，音质细腻",
billing: { type: "perChar", unit: .00015, charKey: "text" } /* IMPL-96②：官方价 1.5 元/万字符 */,
params: [ {
key: "text",
label: "文本",
type: "textarea",
required: true,
default: "你好，我是AI语音助手。",
hint: "非流式 ≤2000 字符"
}, {
key: "voice",
label: "音色",
type: "datalist",
required: true,
default: "longanlingxin",
options: [ { value: "longanlingxin", label: "龙安灵心（女 · 知心温暖）" }, { value: "longanlufeng", label: "龙安鲁风（男 · 明亮开朗）" } ] /* R58-7：音频音色补全（原 text 且默认空） */
}, {
key: "format",
label: "格式",
type: "select",
default: "mp3",
options: [ "mp3", "wav", "pcm", "opus" ]
}, {
key: "sample_rate",
label: "采样率",
type: "select",
default: "22050",
options: [ "22050", "44100", "48000", "24000", "16000", "12000", "8000" ]
}, {
key: "rate",
label: "语速",
type: "range",
default: 1,
min: .5,
max: 2,
step: .05,
unit: "x"
}, {
key: "pitch",
label: "音调",
type: "range",
default: 1,
min: .5,
max: 2,
step: .05
}, {
key: "volume",
label: "音量",
type: "range",
default: 50,
min: 0,
max: 100,
step: 1
}, {
key: "instruction",
label: "指令控制",
type: "text",
default: "",
placeholder: "可选：方言/情感/角色"
} ]
}, {
id: "qwen_audio_tts_plus",
name: "Qwen-Audio-3.0-TTS-Plus",
endpoint: "direct:dashscope",
modelId: "qwen-audio-3.0-tts-plus",
direct: "ds-tts",
price: "¥1.4/万字符",
async: false,
type: "audio",
desc: "实验室级音质，表现力强",
billing: { type: "perChar", unit: .00014, charKey: "text" } /* IMPL-96②：官方价 1.4 元/万字符 */,
params: [ {
key: "text",
label: "文本",
type: "textarea",
required: true,
default: "你好，我是AI语音助手。",
hint: "非流式 ≤2000 字符"
}, {
key: "voice",
label: "音色",
type: "datalist",
required: true,
default: "longanlingxin",
options: [ {
value: "longanlingxin",
label: "龙安灵心（女 · 知心温暖）"
}, {
value: "longanlufeng",
label: "龙安鲁风（男 · 明亮开朗）"
} ],
hint: "需百炼音色 id · 速创克隆不通用"
}, {
key: "format",
label: "格式",
type: "select",
default: "mp3",
options: [ "mp3", "wav", "pcm", "opus" ]
}, {
key: "sample_rate",
label: "采样率",
type: "select",
default: "22050",
options: [ "22050", "44100", "48000", "24000", "16000", "12000", "8000" ]
}, {
key: "rate",
label: "语速",
type: "range",
default: 1,
min: .5,
max: 2,
step: .05,
unit: "x"
}, {
key: "pitch",
label: "音调",
type: "range",
default: 1,
min: .5,
max: 2,
step: .05
}, {
key: "volume",
label: "音量",
type: "range",
default: 50,
min: 0,
max: 100,
step: 1
}, {
key: "instruction",
label: "指令控制",
type: "text",
default: "",
placeholder: "可选：方言/情感/角色"
} ]
}, {
id: "qwen3_asr_flash",
name: "Qwen3-ASR",
endpoint: "direct:dashscope",
modelId: "qwen3-asr-flash",
direct: "ds-asr",
price: "¥0.00022/秒",
async: false,
type: "asr",
desc: "识别默认档，快而准",
billing: { type: "perSecond", unit: .00022, durationKey: "audioDurationSec", note: "约 0.00022 元/秒音频（按上传音频时长计）" } /* IMPL-102：durationKey 对接语音输入 usage 时长回填（_noteUsage 写入 body.audioDurationSec 后计费闭环） */,
params: [ {
key: "audio",
label: "音频",
type: "ref-audio",
output: "single",
required: true,
hint: "≤10MB 且 ≤5 分钟（mp3/wav/m4a/ogg 等）"
}, {
key: "language",
label: "语种",
type: "select",
default: "auto",
options: [ "auto", "zh", "en", "ja", "ko", "de", "fr", "es", "ru", "pt", "ar" ],
hint: "已知语种时指定可提升准确率；混合语种选 auto"
}, {
key: "enable_itn",
label: "文本规整",
type: "select",
default: "false",
options: [ "false", "true" ],
hint: "中文数字→阿拉伯数字（仅中英）"
} ]
}, {
id: "tele_speech_asr",
name: "TeleSpeech-ASR",
endpoint: "direct:siliconflow",
modelId: "TeleAI/TeleSpeechASR",
direct: "sf-asr",
price: "免费",
async: false,
type: "asr",
desc: "超多方言，识别面广",
billing: { type: "free" } /* IMPL-96②：官方免费 */,
params: [ {
key: "audio",
label: "音频",
type: "ref-audio",
output: "single",
required: true,
hint: "≤50MB 且 ≤1 小时"
} ]
}, {
id: "xingchen_asr_v3",
name: "XingChenASR-Ultra",
endpoint: "direct:siliconflow",
modelId: "XingChenAGI/XingChenASR-V3.2-Ultra",
direct: "sf-asr",
price: "免费",
async: false,
type: "asr",
desc: "超清识别档，嘈杂也稳",
billing: { type: "free" } /* IMPL-101：SF 免费 ASR 兜底（TeleSpeech 除名风险对冲） */,
params: [ {
key: "audio",
label: "音频",
type: "ref-audio",
output: "single",
required: true,
hint: "以硅基流动模型页限额为准"
} ]
}, {
id: "qwen3_asr_17b",
name: "Qwen3-ASR-1.7B",
endpoint: "direct:siliconflow",
modelId: "Qwen/Qwen3-ASR-1.7B",
direct: "sf-asr",
price: "免费",
async: false,
type: "asr",
desc: "免费档，轻量够用",
billing: { type: "free" } /* IMPL-101：SF 免费 ASR 兜底 */,
params: [ {
key: "audio",
label: "音频",
type: "ref-audio",
output: "single",
required: true,
hint: "以硅基流动模型页限额为准"
} ]
} ]
};

const PROMPT_PRESETS = [ {
id: "none",
name: "不用预设",
prompt: ""
}, {
id: "clarify",
name: "糊转清晰",
prompt: "增强画质，修复模糊噪点压缩痕迹，还原画面全部细节，保留原图构图物体人物色彩不变，提升锐度，高清化，不要改动原有物体造型。"
}, {
id: "restore-text",
name: "文本还原",
prompt: "增强画质，完整还原图片内全部文字，严格保持原有文字内容、字体样式、字体颜色、排版位置，文字不能出错，不要篡改文字信息。"
}, {
id: "split-elements",
name: "拆分元素",
prompt: "将画面里各个物体、图形元素相互分离开，每个元素独立完整，保留原始造型色彩，分离物体，元素拆分，透明背景。"
}, {
id: "split-poster",
name: "拆分海报",
prompt: "解析海报，把海报中的插画、图形、文字组件全部拆分为独立素材，各自完整保留样式，透明背景。"
}, {
id: "extract-subject",
name: "提取主体",
prompt: "只保留画面主体对象，移除全部背景，透明背景，主体造型、颜色、细节 100% 原样保留。"
}, {
id: "extract-bg",
name: "提取背景",
prompt: "移除画面所有前景主体人物物体，只保留原始背景画面，还原背景细节。"
}, {
id: "remove-text",
name: "去掉文字",
prompt: "抹除画面内所有文字、水印、标识，修复文字区域画面纹理，其余画面内容保持不变。"
}, {
id: "line-art",
name: "转线稿图",
prompt: "根据参考图生成干净黑白线稿，只保留轮廓与结构线条，去除色彩、阴影、渐变，线条干净流畅。"
}, {
id: "old-photo",
name: "修老照片",
prompt: "老照片修复，修复破损、褪色、划痕、噪点，还原人物五官细节，还原色彩，保留老照片氛围感。"
}, {
id: "flat-digital",
name: "转电子版",
prompt: "将实拍拍摄的实物照片转为平面电子版效果图，消除拍摄光影、畸变、环境杂物，平面化呈现设计内容，透明背景。"
}, {
id: "remove-texture",
name: "去布纹理",
prompt: "消除皮革、布料、织物表面纹理褶皱，去除实物拍摄反光，图案内容完整保留，转为平面矢量质感。"
}, {
id: "flat-2d",
name: "转二维图",
prompt: "消除立体光影、透视阴影，把图像扁平化处理，二维平面插画效果，物体形态配色不变。"
}, {
id: "resize-canvas",
name: "修改尺寸",
prompt: "保持原图全部内容、元素、构图不变，调整画布比例尺寸，补全边缘画面，不改动内部物体。"
}, {
id: "poster-design",
name: "海报生成",
prompt: "基于参考图结合用户描述生成商业海报，完善排版布局，优化视觉，可增加标题装饰元素，商业平面海报设计。"
} ];

const VIDEO_PROMPT_PRESETS = [ {
id: "none",
name: "不用预设",
prompt: ""
}, {
id: "cinematic",
name: "电影质感",
prompt: "电影质感，电影级光影，层次分明，色彩自然，画面具有叙事感，35mm胶片质感。"
}, {
id: "anime",
name: "动画风格",
prompt: "日式动画风格，赛璐璐上色，干净线条，鲜明色彩，动画画面感。"
}, {
id: "realistic",
name: "真人实拍",
prompt: "真人实拍质感，自然光线，真实材质，高清细节，纪录片风格。"
}, {
id: "cyberpunk",
name: "赛博朋克",
prompt: "赛博朋克风格，霓虹灯效，雨夜城市，高对比冷暖色调，未来感。"
}, {
id: "push-in",
name: "镜头推进",
prompt: "缓慢镜头推进，主体保持清晰，背景自然虚化，电影感运镜。"
}, {
id: "nature",
name: "自然风光",
prompt: "自然风光，广角大景，色彩饱和，空气感，纪录片画质。"
} ];

const AUDIO_PROMPT_PRESETS = [ {
id: "none",
name: "不用预设",
prompt: ""
} ];

/* ═════════ 技能系统（方案 v1.4 / IMPL-54） ═════════
   技能 = 预置 system prompt + 元数据；经 Worker /llm/chat 哑管道调用多模态 LLM（DeepSeek Vision-Exp / 千问 VL 双预设，Worker 环境变量切换）。
   输出契约 v3.1：合法终态仅两种——``` 围栏块（最新完整版提示词，替换式更新）或「【追问】」开头（≤2 问，每问可附 2~4 个「- 」候选项）。 */
const SKILL_CONTRACT = [
  "",
  "【输出要求】",
  "1. 条件已足：在回答末尾单独给出一段完整的最终提示词，用 ``` 代码块包裹——它是当前最新完整版，必须包含此前所有轮次的全部有效信息；围栏块之外最多再用一句话说明本次改了什么。",
  "2. 条件不足：以「【追问】」三个字开头，提出最多 2 个必须由用户补充的关键问题（如画幅、时长、风格参照、画面文字），不要臆测补全，此时不要输出围栏块。存在典型候选时，在每个问题下另起一行用「- 」列出 2~4 个候选项（开放性问题可不列），格式示例：",
  "【追问】",
  "画幅比例是？",
  "- 16:9 横版",
  "- 9:16 竖版",
  "- 1:1 方形",
  "3. 用户的调整指令互相冲突时，以最新指令为准；已确认过的条件不要反复追问。"
].join("\n");

const SKILLS = [
  { skillId: "prompt-optimizer", name: "提示词优化", description: "把简单想法扩写成结构完整、可直接出图的中文提示词。", allowedTools: [], requiredCapabilities: [], tab: "image", group: "提示词", fallback: null, allowEmpty: false },
  { skillId: "visual-prompt-reverse", name: "图像反推", description: "分析参考图，反推可复现其视觉特征的提示词。", allowedTools: [], requiredCapabilities: ["image_input"], tab: "image", group: "提示词", fallback: null, allowEmpty: true },
  { skillId: "content-visualize", name: "内容视觉化", description: "把文案或概念转成有画面感的视觉方案提示词。", allowedTools: [], requiredCapabilities: [], tab: "image", group: "创意", fallback: null, allowEmpty: true },
  { skillId: "sketch-diagram", name: "手绘技术图解", description: "生成手绘风技术示意图、流程图的图解提示词。", allowedTools: [], requiredCapabilities: [], tab: "image", group: "创意", fallback: null, allowEmpty: false },
  { skillId: "zine-poster", name: "极简纸感海报", description: "极简 Zine 纸感海报：大字排版、丝网印色与留白。", allowedTools: [], requiredCapabilities: [], tab: "image", group: "海报", fallback: null, allowEmpty: true },
  { skillId: "scene-paper", name: "实景拾景纸刊", description: "基于参考图做纸刊风实景排版设计。", allowedTools: [], requiredCapabilities: ["image_input"], tab: "image", group: "海报", fallback: null, allowEmpty: true },
  { skillId: "eterna-cinema", name: "ETERNA 电影感", description: "参考图转电影感图生图：胶片影调与色彩科学。", allowedTools: [], requiredCapabilities: ["image_input"], tab: "image", group: "摄影", fallback: null, allowEmpty: true },
  { skillId: "life-portrait", name: "生命感人像摄影", description: "有呼吸感的人像摄影提示词：情绪、光与真实质感。", allowedTools: [], requiredCapabilities: [], tab: "image", group: "摄影", fallback: "tpl-portrait", allowEmpty: false },
  { skillId: "product-still", name: "产品静物摄影", description: "电商级静物布光提示词：材质受光、光比与场景叙事。", allowedTools: [], requiredCapabilities: [], tab: "image", group: "摄影", fallback: "tpl-product-ecom", allowEmpty: false },
  /* 76-c：工作流型技能——一次产出 N 条提示词；maxTokens=直连分支输出上限覆盖（整稿分页默认 1024 必超）；77-d：wide 全宽卡弃用，技能网格统一 cols5 */
  { skillId: "page-splitter", name: "分页成稿", description: "把长文案或文档整理后按页拆成一组可直接生成的图片提示词（PPT 页/系列海报/分镜/图文卡）。", allowedTools: [], requiredCapabilities: [], tab: "image", group: "工作流", fallback: null, allowEmpty: false, maxTokens: 4096 },
  /* ═══ IMPL-105：视频分类技能（tab:"video"）——全部基于既有视频模型参数+LLM 对话，零新后端 ═══ */
  { skillId: "video-cinema-director", name: "运镜提示词工坊", description: "把画面想法扩写成带动作时序、运镜与声音设计的专业视频提示词。", allowedTools: [], requiredCapabilities: [], tab: "video", group: "运镜", fallback: null, allowEmpty: false, maxTokens: 2048 },
  { skillId: "video-frame-motion", name: "首帧动效工坊", description: "读首帧图写图生视频提示词：保留画面，只编排增量动作与运镜。", allowedTools: [], requiredCapabilities: ["image_input"], tab: "video", group: "图生视频", fallback: null, allowEmpty: false },
  { skillId: "video-frame-bridge", name: "首尾帧衔接师", description: "读首尾两帧，写两帧之间的过渡动作与运镜提示词。", allowedTools: [], requiredCapabilities: ["image_input"], tab: "video", group: "衔接", fallback: null, allowEmpty: false },
  { skillId: "video-storyboard", name: "分镜脚本生成器", description: "一段故事或文案拆成分镜表与逐镜自包含的视频提示词，逐镜填入生成。", allowedTools: [], requiredCapabilities: [], tab: "video", group: "工作流", fallback: null, allowEmpty: false, maxTokens: 4096 },
  { skillId: "video-style-mixer", name: "视频风格配方库", description: "按主题给 3~5 组「风格头+运镜+声音」配方卡，选定后续写成完整提示词。", allowedTools: [], requiredCapabilities: [], tab: "video", group: "风格", fallback: null, allowEmpty: false, maxTokens: 2048 }
];

/* ── 技能模型预设（IMPL-68/72）：智能选型 + 五顶尖，模型名经 2026-09 三上游真实清单核实；
   带 provider: 前缀的值由 Worker/代理端解析路由（dashscope/deepseek/siliconflow 三家 Secret）；
   think=该模型能否安全携带 thinking 标志（IMPL-72 思考能力守卫：false 时前端不发、UI 灰显，
   防止 dashscope 恒注入 enable_thinking 后 qwen-vl/omni 家族 400 报错）── */
const SKILL_MODEL_PRESETS = [
  { id: "auto", label: "智能选型", vision: true, think: true, desc: "按消息内容自动选千问旗舰 / 视觉模型，无需操心" },
  { id: "deepseek:deepseek-flash", label: "DeepSeek V4 Flash", vision: true, think: true, desc: "DeepSeek V4.1 Flash · 深度思考+原生看图（76-b 官方文档核实）" },
  { id: "dashscope:qwen3.8-omni-flash", label: "千问 Qwen3.8-Omni", vision: true, think: false, desc: "千问 3.8 全模态 · 看图对话（不支持深度思考开关）" },
  { id: "siliconflow:Pro/moonshotai/Kimi-K2.6", label: "Kimi K2.6", vision: false, think: false, desc: "月之暗面旗舰 · 长文本强推理" } /* IMPL-119：think:false 诚实化——两版 Worker 均无 Kimi 注入分支，开关为 no-op，灰显防误导 */,
  { id: "siliconflow:zai-org/GLM-4.5V", label: "智谱 GLM-4.5V", vision: true, think: true, desc: "智谱视觉旗舰 · 看图思考" },
  /* ★ 2026-10-01 APIYI 通道档位（Worker 侧 llmProviderConfig.apiyi；模型名经 /v1/models 实拉核实可见）
     ⚠ think:false 是**诚实标注**而非保守 —— Worker 的 thinking 注入只覆盖 dashscope/siliconflow/deepseek
       三家，apiyi 分支**没有任何注入** ⇒ 这个开关是 no-op，灰显防误导（同 IMPL-119 Kimi 先例）。 */
  /* ★ R21-6（修 2026-10-01「GPT-5.6 Luna 不支持视觉？换个支持视觉的强大 GPT」）：
     Luna 档（vision:false，H7 当时就标了）实测没视觉 ⇒ 换 GPT-6.1 Sol —— APIYI 当前最新的
     6 代旗舰档（gpt-6.1-sol，入 $2/M · 出 $10/M），比 5.6 Sol（$4/$20）便宜一半还新一代，
     GPT-6 系原生多模态（视觉）。费率真值 = pricing 端点 enable_groups 含 default ✓。
     ⚠ think:false 仍是诚实标注（Worker 的 apiyi 分支无 thinking 注入，开关是 no-op）。 */
  { id: "apiyi:gpt-6.1-sol", label: "GPT-6.1 Sol（易）", vision: true, think: false, desc: "最新 6 代旗舰 · 支持视觉 · $2/$10 每 M tokens", billing: { type: "perToken", inUsdPerM: 2, outUsdPerM: 10, source: "api", note: "APIYI 官转（入 $2/M · 出 $10/M，pricing 端点 ratio 1.0 × 2 / × 5）" } },
  { id: "apiyi:claude-opus-5-5", label: "Claude Opus 5.5（易）", vision: true, think: false, desc: "Anthropic 旗舰 · 长文与代码强", billing: { type: "perToken", inUsdPerM: 4, outUsdPerM: 20, source: "api", note: "APIYI 官转（入 $4/M · 出 $20/M）" } },
  { id: "apiyi:gemini-3.1-pro-preview", label: "Gemini 3.1 Pro（易）", vision: true, think: false, desc: "Google 多模态旗舰 · 看图理解强", billing: { type: "perToken", inUsdPerM: 1.8, outUsdPerM: 10.8, source: "api", note: "APIYI 官转（入 $1.8/M · 出 $10.8/M）" } }
];

/* ★ R85：非 APIYI 直连档的费率表（只读查询，不参与 UI 模型列表）。单位与 APIYI 档一致 = **美元/百万 token**，
   只在 calcEstimate 出口乘一次 USD_CNY(=7)。价格来源与峰谷口径见批次说明（R85）。
   ⚠ 刻意不含 auto（路由无定价）与 qwen3-vl-plus（百炼现价页未公示）—— 查不到就不编。 */
const LLM_RATE_TABLE = {
  "deepseek:deepseek-flash": { type: "perToken", inUsdPerM: .15, outUsdPerM: .6, source: "official", note: "DeepSeek API Docs 平峰价 $0.15 / $0.60 每 M（峰时段工作日 01-04 / 06-10 UTC 翻倍）" },
  "deepseek:deepseek-v4-pro": { type: "perToken", inUsdPerM: .66, outUsdPerM: 1.98, source: "official", note: "DeepSeek API Docs 平峰价 $0.66 / $1.98 每 M（峰时段翻倍）" },
  "dashscope:qwen3.8-omni-flash": { type: "perToken", inUsdPerM: .8 / 7, outUsdPerM: 2.7 / 7, source: "official", note: "阿里云百炼官价 ¥0.8 / ¥2.7 每百万 token（USD_CNY=7 折美元）" },
  "dashscope:qwen3.8-max-0902": { type: "perToken", inUsdPerM: 12 / 7, outUsdPerM: 36 / 7, source: "official", note: "阿里云百炼官价 ¥12 / ¥36 每百万 token（USD_CNY=7 折美元）" },
  "siliconflow:Pro/moonshotai/Kimi-K2.6": { type: "perToken", inUsdPerM: .95, outUsdPerM: 4, source: "official", note: "SiliconFlow 官方发布价 $0.95 / $4.00 每 M" },
  "siliconflow:zai-org/GLM-4.5V": { type: "perToken", inUsdPerM: .14, outUsdPerM: .86, source: "official", note: "SiliconFlow 官方发布价 $0.14 / $0.86 每 M" }
};

/* IMPL-72 需求②：思考能力守卫——判断模型能否安全携带 thinking 标志。
   预设查表优先（人工核实），家族正则兜底（对齐 Worker v3 注入语义，IMPL-68）：
   · dashscope：Worker 恒注入 enable_thinking（76-b 文档核实：qwen3.8-omni 默认开启思考，恒注入 false 为保命设计；
     vl/omni 家族官方已支持 enable_thinking，UI 仍保守灰显属控速选择，放开须同步 Worker thinking_budget）；
   · siliconflow：Worker 以 /qwen3/i contains 锚注入（Qwen/Qwen3-* 等组织前缀全名均覆盖，IMPL-76 修正），
     另补 zai-org/GLM-4.5V/4.6V/5V-Turbo 与 deepseek-ai/DeepSeek-V3.x；Kimi 系无注入分支 → think:false 灰显（IMPL-119）
   · deepseek：Worker 对 flash/v4 系注入顶层 thinking:{type:enabled|disabled}（IMPL-76 修正），reasoner/chat 不动 → 全系支持
   · auto：上游智能路由，IMPL-68 实测 thinking:true 正常 → 支持 */
function _modelThinkCapable(model) {
  const id = String(model || "");
  if (id === "auto" || !id) return true;
  const preset = SKILL_MODEL_PRESETS.find(m => m.id === id);
  if (preset) return preset.think !== false;
  const prov = id.includes(":") ? id.slice(0, id.indexOf(":")) : "";
  const mPart = prov ? id.slice(prov.length + 1) : id;
  if (prov === "deepseek") return true;
  if (prov === "siliconflow") return /qwen3/i.test(mPart);
  /* dashscope 及无前缀（无前缀默认 dashscope，兼容 IMPL-55 语义），未收录新家族按不含 qwen3 保守处理：宁可灰显不可 400 */
  return /qwen3/i.test(mPart) && !/vl|omni|qvq|audio|mt|asr|tts|realtime/i.test(mPart);
}

/* ★ R9C-UX-P1-4a（报告 04）：思考徽标的**精确说明**。
   报告指出「思考×」把**通道限制**误读成**模型能力** —— 实测确认这个误读成立：
   Worker 只给 dashscope / siliconflow-qwen3 / siliconflow-GLM / deepseek-flash|v4 注入思考参数，
   apiyi 全系与 SiliconFlow 的 Kimi 系**没有任何注入**（开关是 no-op），
   但这些模型本身是具备推理能力的（gpt-6.1-sol 官方支持 reasoning_effort）。 */
function _thinkHint(model) {
  const id = String(model || "");
  if (_modelThinkCapable(id)) return "思考开关对本模型生效";
  if (/^apiyi:/i.test(id)) return "本通道暂不支持一键思考（APIYI 分支不注入思考参数）；模型自身具备推理能力";
  if (/^siliconflow:.*kimi/i.test(id)) return "本通道暂不支持一键思考（SiliconFlow 分支无注入）；Kimi 自身是长链推理模型";
  return "该模型不支持深度思考开关";
}
/* 徽标渲染单处收口 —— 说明走 title（悬浮可见），零版面成本 */
function _thinkChip(model) {
  const ok = _modelThinkCapable(model);
  const t = String(_thinkHint(model)).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  return ok
    ? '<i class="sm-chip think" title="' + t + '">思考</i>'
    : '<i class="sm-chip think-off" title="' + t + '">思考×</i>';
}

/* ── 79-c(a)：视觉能力判定单处收口——原 llmChatStream（自动切视觉守卫）/ SkillSession._docTargetVision /
   renderSkillModels（自定义模型「视觉」chip）三处各自维护的模型名正则（/vl|vision|omni|qvq|-4v|glm-4\.5v|deepseek-flash/i，
   renderSkillModels 版少 deepseek-flash）合并为一个共享判定，与 _modelThinkCapable（思考能力守卫）对偶。
   语义：①"auto"/空 = true——上游按消息内容智能路由（带图自动选视觉模型），与旧三处语义逐条一致
   （llmChatStream 旧 model!=="auto" 才判 / _docTargetVision 旧 auto→true / SKILL_MODEL_PRESETS.auto vision:true）；
   ②预设查表优先（SKILL_MODEL_PRESETS.vision 人工核实，含 deepseek:deepseek-flash 原生看图，76-b 官方文档核实）；
   ③家族正则兜底（provider 前缀剥离后匹配，自定义目录模型走此路）── */
function isVisionModelName(name) {
  const id = String(name || "");
  if (id === "auto" || !id) return true;
  const preset = SKILL_MODEL_PRESETS.find(m => m.id === id);
  if (preset) return !!preset.vision;
  const mPart = id.includes(":") ? id.slice(id.indexOf(":") + 1) : id;
  return /vl|vision|omni|qvq|-4v|glm-4\.5v|deepseek-flash/i.test(mPart);
}

/* IMPL-70 需求①：组合模式——识图/思考分工。识图阶段固定用全模态旗舰（密集 OCR 与细节定位最强），
   产出《画面事实报告》后交由用户所选思考模型接棒；感知与推理解耦，各自用最强的一段。 */
const SKILL_VISION_MODEL = "dashscope:qwen3.8-omni-flash";
const SKILL_DISCUSS_MODEL = "deepseek:deepseek-v4-pro";
/* IMPL-72 需求⑥「识与论切」两组选项：接棒模式=识图模型（IMPL-71 三项）；
   讨论模式=顶尖思考模型（IMPL-68/69 核实在架：v4-pro 冒烟✓ / qwen3.8-max-0902 thinking 实测✓ / Kimi / GLM-4.5V） */
const SKILL_VISION_MODEL_OPTIONS = [
  { id: "dashscope:qwen3.8-omni-flash", label: "千问 Qwen3.8-Omni" },
  { id: "dashscope:qwen3-vl-plus", label: "千问 VL-Plus" },
  { id: "siliconflow:zai-org/GLM-4.5V", label: "智谱 GLM-4.5V" }
];
const SKILL_DISCUSS_MODEL_OPTIONS = [
  { id: "deepseek:deepseek-v4-pro", label: "DeepSeek V4 Pro" },
  { id: "dashscope:qwen3.8-max-0902", label: "千问 Qwen3.8-Max" },
  { id: "siliconflow:Pro/moonshotai/Kimi-K2.6", label: "Kimi K2.6" },
  { id: "siliconflow:zai-org/GLM-4.5V", label: "智谱 GLM-4.5V" }
];
/* IMPL-72 需求④：识图报告提示词全面详细化（六节→八节，300~600→500~900 字，逐条穷举纪律） */
/* IMPL-75 需求⑤：多参考图协议——首行「共 N 张」+ 逐图分条（图1/图2…可被下游按号引用）+ 第⑨节跨图关系；单图行为与长度纪律不变
   IMPL-78 R4：第④节补画面锚位（九宫方位/贴边居中）、第⑧节补版式与设计语言（设计类适用）与整体色彩气质——论证结论：位置两两相对已有，缺绝对锚位；版式语言是设计类下游刚需；色彩定量已足、补定性气质。不新增独立节（八节结构与下游引用稳定） */
const SKILL_REPORT_PROMPT = "你是商业修图总监级识图分析引擎。逐张仔细观察所给图片，只依据画面可见证据，输出一份供下游思考模型使用的《画面事实报告》——下游模型可能直接看到原图（此时你的报告是交叉核对的参照基线），也可能看不到原图（此时你的每个字就是它对画面的全部认知），宁多勿漏。【多图纪律】若输入含 2 张及以上图片：第一行写「共 N 张参考图」，此后每一节内部按「图1」「图2」…逐图分条陈述（节序保持一致，方便下游按图号引用）；仅 1 张图时不写图号不加此行。按八节输出：①总述：题材、场景类型、拍摄视角与镜头感（广角/标准/长焦倾向）、整体氛围与时间线索（季节/时段），2~4 句；②主体清单：逐个列出画面中全部主体与陪体，每个主体写清姿态动作、朝向与视线方向、服饰造型要点、材质与使用痕迹/新旧程度；③人物与表情特征（画面有人物时逐人描述，无人物则整节写「无」）：年龄感与性别气质、脸型发型发色、表情与眼神方向、情绪状态、肤质与可见特征（雀斑/皱纹/痣/胡茬/妆面）、手部姿态与持物；④环境与空间关系：按前景→中景→背景逐层穷举可见物体，每个物体先给画面锚位（画面左上/正中/右下等九宫方位、贴边或居中），再写物体两两之间的相对位置（左右/上下/前后/遮挡/贴合）与在画面中的占比（约几分之一）；⑤比例与尺度：主体与环境、主体与主体之间的相对大小关系（如人物约为画面高度的几分之一）、可作实际尺度参照的物体（门/桌/砖缝等）、透视汇聚方向与消失点位置；⑥光影事实：光源数量、方向与高度（顺光/侧光/逆光、顶光/低角度）、软硬性质、高光与阴影落点、投影形态与长度方向、明暗对比强度与反光面位置；⑦文字符号：逐字抄录画面中出现的全部文字、数字、标识、水印及其字体气质与所在位置，无则写「无」；⑧瑕疵与色彩定量：构图骨架与透视问题、版式与设计语言（画面属平面设计/海报/UI/包装类时适用：网格与对齐方式、留白密度、信息层级与视觉动线、线条色块边框角标等装饰元素）、可见噪点/伪影/涂抹感/边缘裁切/畸变，以及主色/辅色/点缀色的具体色名、占比与冷暖倾向、整体色彩气质（如低饱和莫兰迪/高对比霓虹/胶片褪色感）。多图输入时在八节之后追加第⑨节「跨图关系」：逐对比较关键相同点与差异点（构图/光线/主体状态/色彩/清晰度）、推断图片间的空间或时序逻辑（同场景多角度、前后对比、组图序列等）、并指出组图整体一致性与互相矛盾之处。全程客观陈述，逐条穷举、宁可琐碎不可遗漏；不得给建议或评价，不得虚构画面中不存在的元素，无法确认的属性如实标注「疑似/无法确认」；总长：单图 500~900 字，多图按每图 300~500 字外加跨图节 150~300 字；信息密度优先，直接输出报告正文，不要标题和客套。";

const SKILL_PROMPTS = {
  "prompt-optimizer": "你是一位服务商用文生图模型的资深提示词工程师兼摄影指导，把用户想法扩写成一条可直接出图的提示词。产出会粘贴进本工作台的生图模型（Nano Banana 系与 GPT-Image 系，均支持中英文自然语言长句与参考图编辑，画幅由界面「比例」下拉控制）。核心信条：好的提示词是「具体的取舍」而非「要素的堆砌」——用户手写的好提示词，往往胜在只写了对画面真正有用的部分；你的价值是判断哪些细节能让这张图更好，而不是把每个维度填满。每写一个词都要能回答「它改变了画面什么」，完稿前删掉一切不改变画面的词。\n【第一步 · 判断画面骨架】提示词以主体开场，词序即优先级，最重要的放最前。先判断画面类型再决定重心：单主体特写（人像/静物/产品）重心在主体与质感；场景叙事（环境/街景/电影感）重心在纵深与光线；平面设计（海报/图解/UI）重心在版式与文字。除主体外的一切模块按需选用，宁缺毋滥。\n【第二步 · 按需选用的模块】\n- 主体与动作（默认满配）：身份特征、姿态、视线方向、与道具的互动；人物补身体取景范围与手脚位置（全身入画/双手自然扶着车把），不留悬空含糊\n- 环境与场景（场景类必写，特写类可省）：地点时代特征；多主体用方位词交代相对位置与大小（左侧并肩/约为画面高度一半）\n- 构图与镜头（按需）：景别、机位高度与角度、焦段与景深（85mm 浅景深/广角透视/微距）；镜头词是外观线索，写清想要的外观即可，不堆参数\n- 光线（几乎总值得写——对画质影响最大的单一维度）：光源方向与软硬、色温、投影形态；写光从哪里来、什么性质，不写「光影氛围好」这类空话\n- 色彩与质感（特写与风格类必写）：主辅点缀色点到为止；材质写到可验证的微观（海军蓝粗花呢，而非「西装」；蚀刻银纹的做旧板甲，而非「盔甲」）；写实度词最多 1~2 个\n- 风格与媒介（风格是诉求时写）：落实到胶片型号、相机机型、画种笔触、印刷工艺等具体实体，风格与氛围标签统一放句尾\n- 效果词（最多 1~2 个）：胶片颗粒/柔光溢出/动态模糊等，叠多画面发散\n【长度纪律 · 三档量级】简单主体（单物/头像/概念图）30~60 字；常规场景 80~150 字；复杂多主体或含文字排版 200~400 字。超档时先删不改变画面的词，保留有信息量的细节，删装饰性形容词与同义重复\n【文字渲染】画面要出现文字时：把要渲染的文字用直引号原样包住；说明出现次数、位置与字体气质（顶部一行加粗无衬线英文 \"GLOW\"）；字越少越稳，小字密排最先糊掉；句尾加「除上述文字外，画面不出现任何其他文字或水印」。用户没给文案就不造字，出无字方案\n【参考图 / 图生图】带参考图时输出的是编辑指令而非重绘描述：动词开头说改什么，把「要改的」与「要保留的」分开写；多张参考图给每张指派角色（图 1 为主体、图 2 为风格参照）；只想借风格时写「仅参考其色彩与质感气质，构图按我的描述」；局部修改写清范围（只改背景，其余保持原样）\n【排除与负面】优先正向描述（想要空街就写「空无一人的街道」，而非「没有汽车」——模型对否定词会反向关注）；确需排除时用一句自然语言放句尾（画面中不出现人物与文字），不堆负面词串\n【模型语法边界】不写 Midjourney/SD 专属语法：无 --ar/--stylize 参数、无 (word:1.2) 权重、无 negative prompt 区、不堆「8k/大师级/杰作」类灌水词；画幅由界面比例选项控制，提示词内不重复写画幅\n【语言】默认输出一条中文提示词；用户要英文或画面文字是英文时给英文版；双语时语义一致、以中文为准\n【自检】输出前过一遍：空泛形容词（高级/唯美/大气/震撼）清零；每个细节能指向画面具体位置或属性；效果词不超过 2 个；渲染文字都在引号内且有位置说明；长度落在对应档位\n【关键约束】\n- 输出单条可直接使用的提示词，自然成句、不写模块名与解释\n- 多轮迭代每轮只落实用户最新指令，保留此前已确认的有效信息，每次输出完整最新版\n- 用户没有指定画幅或关键风格时按契约追问，不要臆测",
  "visual-prompt-reverse": "你是一位商业修图总监级的图像分析师，以摄影师与修图师双视角拆解参考图。用户会提供参考图片，任务是用中文提示词精确复现该图的视觉特征。先按要素顺序分析：①主体与姿态；②镜头语言（横竖画幅比例、等效焦段感与畸变、机位高度与俯仰、透视、景深与焦平面落点）；③光线（光源性质硬光/柔光、方向与高度、光比、阴影边缘软硬与投影朝向、有无轮廓光/眼神光）；④影调（高光/中间调/暗部分布、对比度、动态范围感）；⑤色彩科学（白平衡冷暖倾向、主色辅色点缀色、饱和与明度关系、互补或邻近的色彩对比逻辑）；⑥材质质感（漫反射/镜面/透光、纹理密度、使用痕迹与瑕疵）；⑦风格媒介与氛围（胶片/数码/印刷、颗粒噪点、年代感）。用摄影师行话精确指认，判断须能落到画面具体区域，拒绝空泛形容词堆砌。\n【关键约束】\n- 最终交付一条自然语言成句的中文提示词（粘贴即用），不输出逗号分隔的 tag 串；主体开场，词序即优先级\n- 长度 60~200 字按画面复杂度取舍，密度优先于修辞；画面简单就短写，只保留复现所需的有效特征\n- 只描述画面可见证据，不虚构画面里没有的元素；原片的噪点/颗粒/瑕疵若构成画面气质的一部分，作为正向特征写入，不写成待排除项\n- 图片过小或模糊、光线与镜头属性无法判断时按契约追问拍摄意图",
  "content-visualize": "你是一位视觉创意导演。用户会给出一段文案、概念或主题，先在内部完成三步再落笔：提炼文案的核心命题→寻找唯一的视觉隐喻（一个喻体只承载一个概念，拒绝元素拼贴）→选择让隐喻成立的最优场景。输出分镜级提示词：隐喻主体（形态与动势）永远满配并开场；其余维度按画面需要选用、宁缺毋滥——场景与道具符号（道具要服务隐喻）、构图与负空间（留白本身参与表意，视线有一条明确路径）、机位与景别、光源逻辑与光比、色彩的心理依据（说明主色为何而选）、风格与媒介。画面必须一眼读懂——首读层是隐喻主体，次读层才是环境细节。\n【关键约束】\n- 一个方案只讲一个核心创意，元素数量克制，不堆砌；每个视觉选择都能回答「为什么是它」，与文案语义强相关\n- 隐喻追求意料之外、情理之中，规避陈词滥调（如励志=山顶日出、奋斗=攀岩）\n- 画面出现文字时：只用用户给定的词，用直引号原样包住并说明位置与字体气质；未给文字则做无字纯图形方案，不自行拟标语\n- 文案存在多种视觉方向时按契约追问用途（海报、配图、封面）",
  "sketch-diagram": "你是一位科普图书插画家，把技术概念画成一眼看懂的手绘图解。先做信息设计、再做画面：判定图解类型（流程图=时序因果、结构图=层级拆解、对比图=双栏维度、步骤图=编号顺序）→先在脑中铺版面网格（节点行列对齐、间距均匀，留白不少于画面三成）→再落图形。输出图解提示词：节点造型（圆角框、气泡或简笔物件）；三级视觉层级——标题最大、节点标签次之、注释最小，线宽与字重随层级递减；连线语义——箭头方向明确，实线为主流程，虚线为分支或反馈回路；标注文字紧贴锚定对象、不跨线压图；整体为白底马克笔粗线+钢笔淡彩（淡彩限 2~3 种低饱和色，只用于区分模块与强调关键路径），线条带轻微手绘抖动与纸面微纹，像精心绘制的学习笔记而非随手涂鸦。\n【关键约束】\n- 图中文字是画面主角也是最难渲染的部分：用户给定的术语用直引号原样写入，节点标签取核心短语（≤8 字），全称入注释——截取不改写；提示词末尾要求「文字清晰可读、无错别字、除标签外无多余文字」\n- 节点不超过 9 个，超限时优先合并同类项，而不是缩小字号硬塞；标签字号不得小于标题的三分之一，禁止密集小字\n- 系统过于复杂时先按契约追问要拆解到哪一层",
  "zine-poster": "你是一位独立出版物美术指导，生成极简 Zine 纸感海报提示词。按海报语法组织：版式用非对称网格，中文大字标题是画面主角（通栏或占上半幅，笔画本身参与构图，可断行制造阅读节奏）；负空间不少于五成且要有走向——留白引导一条明确视线动线，而非均匀散布；丝网印配色给到具体色对（如荧光橙+墨黑+纸白、克莱因蓝+暖白）并点明大中小色块面积关系；字体气质最多两种（如粗黑体的力量感×细宋的克制），字距与行距制造张力；视觉锚点唯一——单个几何图形（圆、斜切条、残缺矩形）或单幅小图；保留印刷质感关键词：纸张纹理、丝网油墨颗粒、1~2mm 定向套印错位。\n【关键约束】\n- 画面文字严格使用用户提供的文字内容，标题用直引号原样包住并说明位置与字体气质；字越少越稳，主标题控制在 12 字内；用户未给标题文案时先按契约追问\n- 提示词末尾加一句排除：除标题给定文字外，画面不出现任何其他文字与水印\n- 最多两种字体气质、三个颜色，色对选择要能自圆其说\n- 每个元素要么承载信息、要么组织构图，二者皆无则删去\n- 印刷质感关键词（纸纹、套印偏移、油墨颗粒）必须保留；自检：画面缩到缩略图尺寸时主标题仍可辨认",
  "scene-paper": "你是一位兼具印刷生产经验的杂志艺术总监。用户会提供实景照片，任务是输出把它排进纸刊版式的图生图提示词。这是编辑指令，把「保留」与「改动」分开写：先声明保留——原片主体、视角与自然光影方向，不做二次打光；再写改动——暗部按印刷网点可达的密度压缩、高光留纸感不刺白、保留胶片颗粒；版式说明写栏式网格与图占位、刊名/页码/图注的位置与字号层级、天头地脚订口留白、出血与版心比例；整体氛围落印刷语言：低饱和 CMYK 油墨色域、暖白或米白纸色、哑光纸面微反光、轻微套印错位与可见纸纹。\n【关键约束】\n- 编辑指令动词开头（保留…/改为…/叠加…），提示词末尾一句「除上述改动外，画面其余内容保持原样」\n- 版面文字内容只在用户给定时写入并加直引号；未给定时按契约追问刊名与栏目名\n- 参考图角色唯一：它是内容基底，只做印刷质感与排版化处理，不改变原片场景主体与视角\n- 色彩必须落在印刷语言上（低饱和油墨色、纸色偏暖、无荧光艳色、暗部不死黑）",
  "eterna-cinema": "你是一位精通胶片色彩科学的电影感调色指导。用户会提供参考图，任务是输出把它转成 ETERNA 胶片模拟气质的图生图提示词，只重塑光影与色彩科学，光影与色彩描述前置：影调写低对比宽宽容度、黑位轻微提升呈奶雾感而非死黑、高光柔和滚降不溢出；色彩写阴影偏青绿、中间调保护、肤色保持暖调但降饱和、与青绿阴影形成克制的色相分离；质感写细腻均匀的卤化银颗粒；光源逻辑沿用画面已有的自然光方向，不新增光源；宽银幕感只通过上下 letterbox 暗幅或横向视野微延伸表达（2.39:1 或 1.85:1 呼吸感），不改变既有景别与主体位置。\n【关键约束】\n- 编辑指令动词开头，提示词末尾一句排除：「只调整影调与色彩，画面主体、构图与所有物体保持原样，不添加不删除」\n- 影调关键词必须出现（ETERNA、低对比、柔和高光滚降、胶片颗粒）\n- 用户想改构图或画面内容时先按契约确认再执行",
  "life-portrait": "你是一位以「生命感」著称的人像摄影大师，用真实拍摄的物理逻辑组织画面。任务是把用户的人像想法写成有呼吸感的摄影提示词：主体开场；光源写清性质与来向（单侧大窗软光/黄金时刻低角度侧逆光/阴天全向柔光），光比温和、阴影过渡渐变；眼神光形状与光源对应，发丝轮廓光勾边，环境色自然反射进暗部与肤色；镜头写等效焦段与光圈感（85mm f/1.4 级浅景深、焦平面锁定眼睛、背景奶油状虚化），机位与视线齐平或略低，构图留呼吸空间；服装写材质与受光（针织吸光、丝绸高光流动、棉麻褶皱），褶皱与姿态联动；质感落到皮肤物理层——毛孔、细绒毛、真实油光与瑕疵保留，叠轻微胶片颗粒；动态只取微小真实瞬间（风吹发丝、衣角摆动、将笑未笑）；手部形态明确（持物/插袋）或裁出画外，不留悬空模糊。环境模块按画面需要取舍：纯背景特写可整段省去，把字数让给光线与质感。\n【关键约束】\n- 提示词句尾一句自然语言排除：画面保持真实人像质感，不美化、不磨皮、不过度锐化\n- 人物姿态自然不摆拍，情绪有具体所指（出神、低语、回眸）\n- 商用棚拍与生活感方向冲突时按契约追问用途",
  "product-still": "你是一位服务电商目录与品牌广告的静物摄影指导，用棚拍逻辑组织画面。任务是把用户的产品写成可直出的静物摄影提示词：主体开场写清形态、比例与表面工艺（哑光烤漆/阳极氧化铝/磨砂玻璃/缝线皮革），材质决定受光方式——漫反射面用大面积柔光箱顺光，镜面与釉面靠黑侧/白侧反光板勾轮廓亮线，透明体靠穿透光与瓶身高光塑形；布光写灯具逻辑：顶部主光定基调、左右 45° 辅光定光比（如 2:1）、背景纸过曝留白或深灰渐变；倒影与投影写形态（白色亚克力的正向倒影、水泥面的柔和落影、垂直背景板上的贴身投影）；机位写正视/45° 俯拍与产品占比（产品约占画面高度三分之二，四周留白对称）；道具至多一件且面积小于产品三分之一，只作尺度参照或用途暗示；色彩限定产品本色与中性背景，禁环境色污染产品固有色。电商主图场景写纯白无缝背景：产品居中、轮廓干净、无杂乱投影；需要透明底时提醒用户选用支持透明背景的模型与界面「背景」选项。\n【关键约束】\n- 产品结构、logo 与按键布局严格按用户描述，不虚构产品上不存在的细节\n- 画面文字（品牌名/标签/说明书）仅用用户给定原文并加直引号，未给定时输出无字干净产品\n- 长度 60~200 字按画面取舍，材质与布光参数优先于修辞；末尾可加一句排除（无多余道具、无水印）\n- 未说明材质、使用场景或平台规格（主图/详情页）时按契约追问",
  /* 76-c：分页成稿——两阶段纪律（围栏外分页规划→围栏内逐页成稿）；唯一围栏+「===第 N 页 | 页标题===」分隔符（_extractFence 只认最后闭合围栏，多围栏案不可行）；规划末行「共 N 页·画幅·形态」作版本说明（_noteOf 取围栏外末行） */
  "page-splitter": "你是连续画面的内容策划与提示词工程总监，把一份完整内容（用户粘贴的长文案或上传文档：讲稿/文章/剧本/要点）整理成一组可逐页独立生成的图片提示词，目标形态可以是 PPT 页、系列海报、分镜、图文卡片等任何成组画面。工作分两阶段，禁止跳步：\n【第一阶段 · 整理与分页规划】通读全部内容，提炼信息结构（章节/要点/叙事顺序），先在围栏块之外输出一份简短规划：逐行「页码 · 页标题 · 本页要点」，内容撑不满预期页数就合并，装不下就建议用户分批；规划最后一行以「共 N 页 · 画幅 · 目标形态」收尾（此行将作为版本说明展示）。\n【第二阶段 · 逐页成稿】在回答末尾用唯一一个 ``` 围栏块输出全部页面：页与页之间用分隔行「===第 N 页 | 页标题===」（半角等号、独占一行、N 从 1 递增）隔开；围栏块外除第一阶段规划外不写其他解释。每一页的提示词必须自包含、可单独直接使用：以整套统一的「风格头」开头（约 30~60 字的媒介/色彩/光线/质感描述，逐页原样重复、逐字一致），后接本页版式与内容描述（80~200 字）。画面文字只用用户给定的原文；未给定的画面文字不自行拟写，无文字需求的页写明「无画面文字」。\n有参考图时先判断用户意图，两开关可同时要求：「保持风格」＝把参考图的色彩/材质/光线/媒介气质压缩为一组固定风格 tokens 写进每页风格头；「保持版式」＝把参考图版面骨架（栅格栏式、标题区/正文区/页码位置、留白比例）写成每页重复的版式骨架描述；参考图仅用于风格版式，画面主体按每页内容独立构图。无参考图时按用户描述或内容气质自行拟定一套风格头，整套保持一致。\n【关键约束】\n- 本技能中【输出要求】的『最终提示词』＝整套分页提示词（含全部页面分隔行），仍用唯一围栏块包裹；围栏块内禁止出现 ``` 和其他分隔行格式\n- 总页数默认 6~12 页，用户指定页数时以用户为准；页序即阅读/放映顺序，封面与结尾页按内容需要安排，不强制\n- 整套只有一套风格头与画幅，禁止页间漂移；页面内容与用户原文冲突时以用户原文为准\n- 目标形态、画幅、页数、是否保持风格/版式未明确时按契约追问；追问最多两问，优先「目标形态（选项文案中并入画幅，如 PPT 页 · 16:9）」与「页数」",
  "video-cinema-director": "你是一位广告片与短剧出身的视频导演兼分镜师，把用户的画面想法扩写成可直接投喂文生视频模型的专业提示词。产出会粘贴进本工作台「视频」分类的生视频模型（万相 Wan3.0 / MiniMax H3 / 可灵 Omni / veo3.1 Fast / Vidu Q3 / Google Omni，首轮消息会标注当前模型），时长由界面「时长」滑杆控制、画幅由「宽高比」下拉控制，提示词内不要写时长秒数与画幅比例。\n【第一步 · 定三要素】①镜头数：默认单镜头一镜到底（最稳）；仅当用户要叙事推进时切多镜，≤3 镜且每镜给足独立信息，镜间用「镜头二：」明示衔接；②动作时序：把可用时长按节奏分 2~4 拍，写清每一拍主体在做什么、动作如何衔接——「先…然后…最后…」的时序句式视频模型响应最好；③镜头语言：景别与运镜各写清起点与终点（从中景缓推至面部特写/跟随主体横移/低角度仰拍环绕），一段 5~10 秒的视频只安排 1~2 个运镜动作，多了画面发散。\n【第二步 · 按需选用的模块】\n- 主体与细节：身份、服饰、神态、持物——静态外观一句定场，字数留给动作\n- 环境动态：风、雨、雪、烟、水流、人群、车流、光影闪烁——至少 1 个动态元素，纯静止画面会死板\n- 光线与氛围：光源方向、时段、色温与影调，具体到「低角度金色侧逆光，长投影」而非「氛围感」\n- 声音设计：模型支持原生出声（万相/MiniMax/可灵/veo，界面音频开关为 true）时才写：一句环境音底+至多 1 个点睛音效（「环境音：…；关键音效：…」）；不支持或用户关音频时整段省去\n- 风格与画质：胶片/动画/纪录片等媒介词放句尾，最多 1~2 个\n【长度纪律】单镜 60~150 字；2~3 镜每镜 40~100 字；超档先删静态装饰词，保动作与运镜。\n【模型语法边界】不写 --ar / camera: / [shot] 等任何参数语法，不输出分镜表格排版，正文自然成段；「超高清/大师级/电影级大片」类灌水词清零；否定式排除用一句自然语言放句尾。\n【自检】动作时序读得通吗？运镜 ≤2 个吗？每个镜头有明确起点与终点吗？声音段与模型能力匹配吗？\n【关键约束】\n- 输出单条可直接使用的中文视频提示词，自然成句，不写模块名与解释\n- 多轮迭代每轮只落实用户最新指令，保留已确认信息，每次输出完整最新版\n- 用户未说明时长档与题材基调时按契约追问（时长候选项给「5 秒内快节奏 / 5~10 秒标准 / 15~30 秒叙事」）",
  "video-frame-motion": "你是一位专精图生视频（首帧驱动）的视频导演。用户会上传一张首帧图到界面「首帧」参数位，任务是为这张静态画面写出「让它动起来」的视频提示词——产出粘贴进本工作台支持首帧图生视频的模型（万相 Wan3.0 / Wan3.0-Video / MiniMax H3 / 可灵 Omni / veo3.1 Fast；Vidu 与 Google Omni 的参考图是手工 URL 位，提示词写法不变，由用户自行粘贴）。\n【核心信条】首帧已是画面的第一帧事实，提示词的价值不在重新描述画面，而在精确编排「从这一帧开始发生什么」。主体长相、构图、光线方向、场景陈设已被首帧锁定，冗长的静态复述会与首帧冲突导致画面抖动——你只写增量。\n【写法结构】\n1. 开场一句锁定主体与当前状态：引用首帧可见元素（「画面中的女孩站在天台，风吹动她的裙摆」），不新增不修改\n2. 主体动作（必写）：一个有起点-过程-终点的连续动作，幅度适中——首帧驱动适合「小而具体」（转身回眸、抬手拨发、杯口升起热气），避免剧烈位移与肢体重构（换姿势/换位置是最常见崩坏源）\n3. 镜头运动（必写且至多 1 个）：固定机位（最稳，写明「镜头固定」）或单一运动（缓推/缓拉/环绕/手持跟随）；不做变焦+位移复合运镜\n4. 环境动态（强烈建议）：与场景自洽的 1~2 个动态元素（树叶摇曳、人群走动、雨丝下落、光影缓移）\n5. 声音（可选）：模型支持原生出声且用户开着音频开关时，写一句环境音或主体音效\n【跨模态纪律】接棒/讨论模式下识图报告在场时：画面事实以报告与你的直接观察互证，冲突先指出再写；动效必须与画面逻辑自洽（正面特写别写环绕到背面）；不虚构画面中不存在的元素。\n【模型语法边界】不写时长与画幅；不写「保持首帧不变」这类否定式——写「动作从当前姿态自然开始」的正向表达；总长 60~150 字。\n【关键约束】\n- 画面不变量只引用不重写：不改主体外观、服饰、构图与光线方向\n- 增量封顶：主体动作 1 个 + 运镜 1 个 + 环境动态 1~2 个，宁少勿多\n- 参考图多于 1 张、或用户意图是「借风格」而非「首帧驱动」时按契约追问\n- 用户对画面事实的描述与图片矛盾时先指出再执行",
  "video-frame-bridge": "你是一位专精首尾帧（起止帧）控制的视频导演。用户上传两张图：按界面上传顺序，图 1 是首帧（起点画面），图 2 是尾帧（终点画面）——本工作台首帧/尾帧是两个独立参数位，图片按此顺序作为「图1/图2」提供。任务是写出让模型从图 1 自然演化到图 2 的过渡提示词，产出粘贴进支持首尾帧的模型（万相 / MiniMax H3 / 可灵 Omni / veo3.1 Fast，尾帧需搭配首帧使用；Vidu 与 Google Omni 不支持首尾帧，用户选了它们时先提醒换模型）。\n【第一步 · 读帧】分别读两帧，回答三个问题：①什么变了（主体位置/姿态/景别/光线/场景元素），什么没变（主体身份、场景、色调——不变量是衔接的锚）；②变化的方向与路径（左→右？全景→特写？黄昏→夜？）；③跨度是否适合一段视频完成（跨场景/换主体这类硬伤直接说明，建议拆成两段，不硬编）。\n【第二步 · 编排过渡】\n- 路径唯一：为变化设计一条最简单可预测的运动路径（直线优先、弧线次之），明写两端状态与中间过程（「她从画面左侧缓步走向右侧窗边，途中抬手拂过窗台」）\n- 首尾同述：每条提示词必须同时描述首帧状态与尾帧状态（模型据此插值），不能只写中间发生什么\n- 运镜解耦：优先固定机位让主体自己动；确需运镜只安排 1 个且与主体位移同向，避免拉扯感\n- 时间感：用「渐渐/缓缓/逐渐」给节奏线索——两帧差异小走舒缓，差异大用「先…再…最后…」分 ≤3 段\n- 锚定不变量：句首一句锁定两帧共有元素（「同一间木屋书房内，暖黄台灯始终亮着」），防中途漂移\n【异常处理】两图主体或场景完全不同（非同一时空的演化）→ 不硬编，按契约追问意图（传错图 / 想要转场式衔接——转场用「画面渐变为」表述并注明是风格化转场）；参考图多于 2 张时追问哪两张是首尾帧；上传顺序与画面逻辑矛盾时追问方向，不臆测。\n【模型语法边界】不写时长与画幅；不用否定式；总长 60~150 字。\n【关键约束】\n- 两帧共有不变量必须显式锚定，变化路径必须唯一且可预测\n- 首帧状态与尾帧状态都要在提示词中复现（各一句），中间过程为主体\n- 无法判断哪张是首帧时按契约追问",
  /* IMPL-105：分镜脚本——复用 76-c 分页两阶段纪律与「===第 N 页 | 镜头名===」分隔协议（_parsePages 兼容），页卡 UI 需 _pageList 白名单放行；不放行时优雅降级为整稿围栏块 */
  "video-storyboard": "你是短片导演兼分镜师，把一段完整故事、文案或脚本（用户粘贴文本或上传文档，支持 srt/vtt 剧本）拆成一组可逐镜生成的视频提示词。工作分两阶段，禁止跳步：\n【第一阶段 · 分镜规划】通读内容，确定叙事结构（开场-发展-高潮-收尾或信息递进），在围栏块之外输出简短分镜表：逐行「镜号 · 镜头名 · 本镜内容与时长建议」；并为整套分镜定一份「风格头」（30~60 字：媒介/色调/光线/质感，逐镜复用）；规划最后一行以「共 N 镜 · 风格头要点」收尾（此行将作为版本说明展示）。默认 4~8 镜，用户指定时以用户为准。\n【第二阶段 · 逐镜成稿】在回答末尾用唯一一个 ``` 围栏块输出全部分镜：镜与镜之间用分隔行「===第 N 页 | 镜头名===」（半角等号、独占一行、N 从 1 递增）；围栏块外除第一阶段分镜表外不写其他解释。每一镜的提示词必须自包含、可单独直接粘贴生成：以统一的「风格头」开头（逐镜逐字一致），后接本镜内容（60~150 字）：主体与动作（有时序：先…然后…）、景别与运镜（起点+终点，至多 1 个运镜）、环境动态 1~2 个、需要的原生声音（可选一句）；镜与镜之间通过重复锚定元素（主角服饰、场景标志物、色调词）保持连贯，上一镜的尾状态尽量作为下一镜的起状态。\n【连贯性纪律】整套分镜只有一套风格头与画幅；角色外观第一次出现写全、之后用短锚定词；时间/场景跳跃处在镜内用「新场景：…」明示，不指望模型脑补；每镜按 5~10 秒估算，总时长超出平台单段上限（如万相 30 秒）时建议分批生成。\n【使用提示（保持一句话）】每镜可「填入并生成」逐镜出片；需要角色强一致时，先生成第 1 镜，把结果帧用作后续镜的首帧参考（配合首帧动效工坊/首尾帧衔接师续接）。\n【关键约束】\n- 本技能中【输出要求】的『最终提示词』＝整套分镜提示词（含全部镜分隔行），仍用唯一围栏块包裹；围栏块内禁止出现 ``` 和其他分隔行格式\n- 每镜自包含：不写「承上一镜」「同上」——单镜提示词单独粘贴也能生成\n- 内容与用户原文冲突时以用户原文为准；不把画幅写进提示词（界面控制）\n- 题材、画风、镜数、目标模型未明确时按契约追问，最多两问（优先「镜数与画风」，候选项给常见组合）",
  "video-style-mixer": "你是视频视觉风格顾问，帮用户在动手写提示词之前先定风格方向。用户给出主题（产品、人物、场景、情绪皆可），你输出 3~5 组「风格配方卡」供挑选——每组是一套可直接复用的提示词构件。\n【配方卡格式】每组按固定四行输出：\n- 风格名：4~8 字的易记命名（如「雨夜霓虹」「胶片日光」「晨雾青灰」）\n- 风格头（40~70 字）：媒介（胶片/CG/动画/实拍）+ 色调（具体色名与明度关系）+ 光线（方向与软硬）+ 质感关键词——这段将被放进最终视频提示词，必须自洽成句\n- 运镜与节奏（20~40 字）：适配该风格的运镜与节奏建议（如「固定机位微晃+缓推，呼吸感节奏」）\n- 声音气质（10~20 字）：环境音底与点睛音效方向（模型不支持声音时可忽略此行）\n【差异化纪律】组与组之间必须在媒介、色调、运镜至少一个维度有实质差异，不输出同质变体；配方贴合主题的商业或表达目的（电商主图视频 ≠ 情绪短片头）。\n【收束】卡片之后用一句话提醒：选定某组后直接回复「用第 N 组 + 你的画面描述」，会按该配方把画面描述续写成完整视频提示词（此时再按运镜提示词工坊的标准产出围栏块终稿）。\n【关键约束】\n- 每组配方是「构件」不是完整提示词——不替用户编画面内容，只给风格骨架\n- 用户已指定风格要素时，围绕它给邻近变体（同方向不同执行），不跑题\n- 主题过泛（如「随便来点高级感」）时按契约追问用途与载体（电商/社媒/短片头）"
};

const SkillSession = {
  LS_ACTIVE: "sc_skills_active",
  MAX_ROUNDS: 0, // 0 = 无上限（IMPL-68：对话轮数不再受限）
  _inited: false,
  _watchdog: null,
  active: [],
  ses: null,
  wrap: null,
  init() {
    try {
      const v = JSON.parse(storageGet(this.LS_ACTIVE, "[]"));
      if (Array.isArray(v)) this.active = v.filter(id => SKILLS.some(s => s.skillId === id));
    } catch (e) {}
  },
  save() {
    try { storageSet(this.LS_ACTIVE, JSON.stringify(this.active)); } catch (e) {}
  },
  get(id) {
    return SKILLS.find(s => s.skillId === id) || null;
  },
  listForTab(tab) {
    return this.active.map(id => this.get(id)).filter(s => s && s.tab === tab);
  },
  has(id) {
    return this.active.includes(id);
  },
  configReady() {
    return !!(Store.getR2WorkerUrl() && Store.getR2AuthToken());
  },
  toggle(id) {
    const s = this.get(id);
    if (!s) return;
    if (this.has(id)) {
      this.active = this.active.filter(x => x !== id);
      Toast.info("已移除技能：" + s.name);
    } else {
      this.active.push(id);
      Store.recordPresetUsage(`skill|${s.tab}|${id}`);
      Toast.success("已挂载技能：" + s.name);
      if (this.listForTab(s.tab).length === 4) Toast.warning("技能较多，输出可能发散，建议以第一个为主", 3200);
    }
    if (this.ses) this.end("技能组合已变化，已开启新会话");
    this.save();
    this.render();
  },
  end(msg) {
    if (this.ses && this.ses.abort) { try { this.ses.abort.abort(); } catch (e) {} }
    this._disarmWatchdog();
    this.pendingDocs = [];
    this.ses = null;
    this.render();
    if (msg) Toast.info(msg);
  },
  onTabSwitch() {
    if (this.ses) {
      if (this.ses.abort) { try { this.ses.abort.abort(); } catch (e) {} } /* IMPL-104：中止在途流，防孤立会话整段上游计费且输出全弃 */
      this._disarmWatchdog();
      this.ses = null;
      Toast.info("已切换分类，技能会话结束");
    }
    this.render();
  },
  attach(wrap) {
    if (!this._inited) { this.init(); this._inited = true; }
    this.wrap = wrap;
    this.render();
  },
  render() {
    this.renderBubbles();
    this.renderPanel();
    this.wandSync();
  },

  /* ── 魔棒三态状态机：未挂技能=开选择器 / 挂了=发送 / 有会话=下一轮 / 执行中=中止 ── */
  onWandClick() {
    if (this.ses && this.ses.streaming) {
      if (this.ses.abort) { try { this.ses.abort.abort(); } catch (e) {} }
      return;
    }
    const list = this.listForTab(UI.state.tab);
    if (!list.length) { UI._openPresetPicker("skills"); return; }
    if (!this.configReady()) {
      Toast.warning("配置 Worker URL 与 Auth Token 后可用技能（设置 → R2 图床）", 3600);
      return;
    }
    const ta = $('[data-key="prompt"], [data-key="text"]');
    const text = ta ? ta.value.trim() : "";
    if (this.ses) return this.nextRound(text, "wand");
    this.firstRound(list, text);
  },
  async firstRound(list, text) {
    /* IMPL-104：重入守卫——ses 在 _waitRefs（最长 30s）之后才创建，仅判 this.ses 存在窗口期漏洞（E2E 实锤双会话）；
       _starting 标志从入口到 ses 创建全程封堵，双击/双调只会有一个会话一份计费 */
    if (this.ses || this._starting) return;
    this._starting = true;
    const needImg = list.some(s => (s.requiredCapabilities || []).includes("image_input"));
    await this._waitRefs();
    this._starting = false; /* 窗口关闭：此后到 ses 创建为同步段，由 this.ses 接管守卫 */
    const urls = this._collectRefUrls();
    if (needImg && !urls.length) {
      Toast.warning("该技能需要参考图——请先在参考图区添加图片", 3600);
      return;
    }
    if (!text && !urls.length && !this.pendingDocs.length && !list.some(s => s.allowEmpty)) {
      Toast.info("先写一句想法或附加一份文档，再用技能优化");
      return;
    }
    const main = list[0];
    let sys = SKILL_PROMPTS[main.skillId] || "";
    const aux = list.slice(1);
    if (aux.length) {
      const parts = aux.map(s => {
        const p = SKILL_PROMPTS[s.skillId] || "";
        const m = p.match(/【关键约束】[\s\S]*$/);
        return "【辅助技能 · " + s.name + "】\n" + (m ? m[0] : s.description);
      });
      sys += "\n\n" + parts.join("\n\n") + "\n\n【合并规则】存在多个技能时，以第一个技能为主风格锚点，辅助技能仅补充其关键约束；指令冲突时以主技能为准。";
    }
    sys += "\n" + SKILL_CONTRACT;
    const userParts = [{ type: "text", text: "我的想法：" + (text || (this.pendingDocs.length && !urls.length ? "（请分析我附加的文档）" : "（以参考图为准）")) + "\n当前模型：" + (UI.state.model?.name || "") }];
    urls.forEach(u => userParts.push({ type: "image_url", image_url: { url: u } }));
    this._drainDocs(userParts, "首轮");
    this.ses = {
      skillIds: list.map(s => s.skillId),
      messages: [{ role: "system", content: sys }, { role: "user", content: userParts }],
      rounds: 0, versions: [], verIdx: -1, lastTurn: null, lastBrief: text, sentUrls: urls,
      streamText: "", streaming: false, error: null, partial: null,
      pendingAsk: null, askAnswers: null, pendingDirective: "", userSpeech: "", discHistory: [], histOpen: null,
      showDiff: false, collapsed: false, abort: null, lastTemp: 0.5, rawText: ""
    };
    this.render();
    this._sendTurn(0.5);
  },
  async nextRound(text, source) {
    const ses = this.ses;
    if (!ses) { this.onWandClick(); return; }
    if (ses.streaming) return;
    if (this.MAX_ROUNDS > 0 && ses.rounds >= this.MAX_ROUNDS) {
      Toast.warning(`已达 ${this.MAX_ROUNDS} 轮上限——建议填入后手动微调，或移除技能气泡开新会话`, 3800);
      return;
    }
    let directive = "", temp = 0.5;
    if (ses.pendingDirective) {
      directive = ses.pendingDirective;
      ses.pendingDirective = "";
    } else if (ses.lastTurn === "ask") {
      if (!text) { Toast.info("先回答技能的问题（点选项或直接输入）"); return; }
      directive = "用户补充：" + text;
      /* IMPL-74：panel/选项作答也是用户发言——讨论模式下入讨论流（你的补充卡） */
      if (source === "panel" && Store.getSkillDiscuss()) ses.userSpeech = text;
      if (source === "wand") ses.lastBrief = text;
    } else if (source === "panel") {
      if (!text) return;
      directive = text;
      /* IMPL-74：讨论模式下用户补充发言=参与者卡（当轮讨论流顶部），并驱动发言者/终结者正面回应 */
      if (Store.getSkillDiscuss()) ses.userSpeech = text;
    } else {
      if (text && text !== ses.lastBrief) {
        directive = "用户调整了想法，基于历史继续更新：" + text;
        ses.lastBrief = text;
      } else {
        directive = "重新生成一版不同方向的";
        temp = 0.9;
      }
    }
    // IMPL-68：对话中补充的参考图随本轮消息一起发送（只发新增的，不重复传旧图）
    await this._waitRefs();
    const fresh = this._collectRefUrls().filter(u => !(ses.sentUrls || []).includes(u));
    if (fresh.length) (ses.sentUrls = ses.sentUrls || []).push(...fresh);
    let userContent = fresh.length
      ? [{ type: "text", text: directive + `（已补充参考图 ${fresh.length} 张，以最新参考图为准）` }, ...fresh.map(u => ({ type: "image_url", image_url: { url: u } }))]
      : directive;
    /* IMPL-75 需求④：待发文档随本轮消息注入（文字分片，任何模型可读；附加时已按多模态门槛校验） */
    if (this.pendingDocs.length) {
      const parts = Array.isArray(userContent) ? userContent.slice() : [{ type: "text", text: userContent }];
      this._drainDocs(parts, "本轮");
      userContent = parts;
    }
    ses.messages.push({ role: "user", content: userContent });
    this._sendTurn(temp);
  },

  /* ── 参考图收集：复用 uploadToR2 公网 URL（首轮全量、后续轮只发新增，IMPL-68） ── */
  _refKeys() {
    return (UI.state.model?.params || []).filter(p => p.type === "ref-image").map(p => p.key);
  },
  _collectRefUrls() {
    const out = [];
    for (const key of this._refKeys()) {
      for (const r of UI._getRefs(key)) {
        const u = r.kind === "url" ? r.src : r.remote;
        if (u && /^https?:\/\//.test(u) && !out.includes(u)) out.push(u);
      }
    }
    return out;
  },
  _pendingRefs() {
    return this._refKeys().some(key => UI._getRefs(key).some(r => r.kind === "local" && !r.uploaded && !r.uploadError));
  },
  async _waitRefs() {
    if (!this._pendingRefs()) return;
    Toast.info("等待参考图上传完成...");
    for (let i = 0; i < 30 && this._pendingRefs(); i++) await new Promise(r => setTimeout(r, 1000));
  },

  /* ── IMPL-75 需求④：文档直传——文本类文档读为文字分片随下一条消息发送。
     门槛按用户纪律执行：目标模型（讨论态=讨论主模型，其余=技能模型）非多模态 → 按钮灰显；
     格式白名单外（PDF/Office/二进制）明确提醒并拒收；文档本质是文字分片，任何模型可读，附加门槛只是预期管理 ── */
  DOC_TEXT_EXT: ["txt","md","markdown","json","csv","tsv","log","xml","html","htm","srt","vtt","yaml","yml","ini","conf","cfg","js","ts","jsx","tsx","css","py","java","c","cpp","h","sh","sql","rs","go","rb","php","kt","swift"],
  DOC_MAX_BYTES: 204800,
  DOC_MAX_CHARS: 12000,
  DOC_MAX_FILES: 3,
  pendingDocs: [],
  _docTargetVision() {
    /* 79-c(a)：判定收口 isVisionModelName——auto/空=可看图、预设查表、家族正则兜底，旧内联实现逐条等价 */
    const id = Store.getSkillDiscuss() ? Store.getSkillDiscussModel() : Store.getSkillModel();
    return isVisionModelName(id);
  },
  _docSync() {
    const btn = this.wrap?.querySelector("[data-doc-btn]");
    if (btn) {
      const ok = this._docTargetVision();
      btn.classList.toggle("off", !ok);
      btn.title = ok ? "上传文档给模型分析（文本类文件，随下一条消息发送）" : "当前模型不支持文档输入——请切换到多模态/视觉模型";
      btn.setAttribute("aria-disabled", String(!ok));
    }
    const box = this.wrap?.querySelector("[data-doc-chips]");
    if (box) {
      box.hidden = !this.pendingDocs.length;
      box.innerHTML = this.pendingDocs.map((d, i) => '<span class="doc-chip" title="' + esc(d.name) + ' · ' + d.chars + ' 字"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg><span class="dc-name">' + esc(d.name) + '</span><span class="dc-x" data-doc-x="' + i + '" role="button" tabindex="0" aria-label="移除文档 ' + esc(d.name) + '">×</span></span>').join("");
      box.querySelectorAll("[data-doc-x]").forEach(x => {
        const rm = () => { this.pendingDocs.splice(+x.dataset.docX, 1); this._docSync(); };
        x.addEventListener("click", rm);
        x.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); rm(); } });
      });
    }
  },
  _onDocBtn() {
    if (!this._docTargetVision()) { Toast.warning("当前模型不支持文档输入——请切换到多模态/视觉模型后再上传", 3200); return; }
    this.wrap?.querySelector("[data-doc-input]")?.click();
  },
  _onDocFiles(files) {
    const okModel = this._docTargetVision();
    [].forEach.call(files, f => {
      const ext = (String(f.name).split(".").pop() || "").toLowerCase();
      if (!okModel) { Toast.warning("当前模型不支持文档输入——「" + f.name + "」未添加", 3200); return; }
      if (!this.DOC_TEXT_EXT.includes(ext)) { Toast.warning("暂不支持 ." + ext + " 格式，「" + f.name + "」未添加——PDF/Office 文档请先另存为纯文本（或截图后走参考图）", 4600); return; }
      if (f.size > this.DOC_MAX_BYTES) { Toast.warning("文档过大（限 200KB），「" + f.name + "」未添加", 3600); return; }
      if (this.pendingDocs.length >= this.DOC_MAX_FILES) { Toast.warning("最多附加 " + this.DOC_MAX_FILES + " 个文档，「" + f.name + "」未添加", 3200); return; }
      if (this.pendingDocs.some(d => d.name === f.name && d.size === f.size)) { Toast.info("文档已在附件列表：" + f.name, 2400); return; }
      const reader = new FileReader;
      reader.onload = e => {
        const raw = String(e.target.result || "");
        const chars = raw.length;
        const text = chars > this.DOC_MAX_CHARS ? raw.slice(0, this.DOC_MAX_CHARS) + "…（原文过长，已截断至前 " + this.DOC_MAX_CHARS + " 字符）" : raw;
        this.pendingDocs.push({ name: f.name, size: f.size, chars, text });
        this._docSync();
        Toast.success("文档已附加，将随下一条消息发送：" + f.name, 2800);
      };
      reader.onerror = () => Toast.error("文档读取失败：" + f.name);
      reader.readAsText(f);
    });
  },
  _drainDocs(userParts, label) {
    if (!this.pendingDocs.length) return;
    this.pendingDocs.forEach(d => {
      userParts.push({ type: "text", text: "【用户上传文档 · " + d.name + (label ? " · " + label : "") + "】\n" + d.text + "\n【文档结束】请基于文档内容执行任务；文档与用户描述冲突时先指出再处理。" });
    });
    this.pendingDocs = [];
    this._docSync();
  },

  /* ── 流式执行（SSE，15s 无增量看门狗，中止轮不计次） ── */
  async _sendTurn(temp) {
    const ses = this.ses;
    if (!ses || ses.streaming) return;
    ses.streaming = true;
    ses.lastTemp = temp == null ? 0.5 : temp;
    /* IMPL-74：上一轮讨论卡存档（仅成功完成的轮；错误轮随重试丢弃与既有行为一致）。浅拷贝数组即可——条目在轮结束后只读 */
    if (ses.discussion && ses.discussion.length && !ses.error) {
      (ses.discHistory = ses.discHistory || []).push({ round: ses.rounds, cards: ses.discussion.slice(), vision: ses.visionReport || null });
    }
    /* 79-c(c)：多轮 token 纪律——新一轮开始把「历史轮次」消息里的原图替换为占位：该轮【识图报告】文本已随消息持久
      （讨论模式另有 discHistory 发言卡存档），旧图不再跨轮携带，多轮 payload 不随轮数线性膨胀；
      仅保留最后一条 user 消息（=本轮刚推送的）的原图供多模态模型直读。lastU 按引用豁免：
      失败轮 retry 时 rounds 未递增且当前轮 user 消息就是末条，不受影响；占位措辞对「该轮无报告（识图失败回退）」
      的历史也成立——该轮画面信息仍可从上方历史消息（含识图报告段，若有）追溯 */
    if (ses.rounds > 0) {
      const lastU = ses.messages[ses.messages.length - 1];
      ses.messages = ses.messages.map(m => (m === lastU || !Array.isArray(m.content) || !m.content.some(p => p && (p.type === "image_url" || p.type === "image")))
        ? m
        : Object.assign({}, m, { content: m.content.map(p => p && (p.type === "image_url" || p.type === "image") ? { type: "text", text: "（历史轮参考图已按多轮上下文纪律移出——该轮画面信息以上方历史消息为准）" } : p) }));
    }
    ses.error = null;
    ses.partial = null;
    ses.streamText = "";
    /* IMPL-71：阶段化状态——识图报告/讨论卡片每轮重建 */
    ses.discussion = [];
    /* IMPL-74：用户补充发言入当轮讨论流顶部（仅讨论模式；userSpeech 无条件消费防残留）；存档在先、入卡在后，不污染上一轮档案 */
    if (ses.userSpeech) {
      if (Store.getSkillDiscuss()) ses.discussion.push({ name: "你", model: "user", text: ses.userSpeech, isUser: true, isFinal: false, streaming: false, thought: false });
      ses.userSpeech = "";
    }
    ses.visionReport = null;
    ses.visionLive = false;
    ses.visionOpen = true;
    this._stagePartial = null;
    ses.abort = new AbortController();
    this.renderPanel();
    this.wandSync();
    /* IMPL-74（74-c P1-2）：段首看门狗预武装——主链首 delta 前沿用默认 15s 会被深度思考/非流式回退误杀；
       IMPL-157：预算按「思考/带图」分档提额（带图 prefill 实测 1~5s、大图慢集群 15s+；onActivity 字节级续命后此预算仅约束「完全静默」窗口） */
    this._armWatchdog(Store.getSkillThinking() ? 60000 : (this._lastUserHasImg() ? 40000 : 25000));
    try {
      const relay = Store.getSkillRelay();
      const discuss = Store.getSkillDiscuss();
      const hasImg = this._lastUserHasImg();
      if (discuss) {
        /* 讨论模式（IMPL-72 需求⑥）：带图先识图出报告 → 双模型会诊（speaker_1=识与论切·讨论主模型 / speaker_2=异厂商）→ 主模型终结者按契约收拢 */
        if (hasImg) await this._visionStage();
        const dModel = Store.getSkillDiscussModel();
        const sp1 = await this._speakerStage(1, dModel, null);
        const sp2 = await this._speakerStage(2, this._pickPeer(dModel), sp1);
        await this._finalStage(sp1, sp2);
      } else {
        /* 接棒模式（IMPL-71 需求③⑥）：识图→报告卡可视化→所选思考模型接棒；或直连（双关） */
        if (relay && hasImg) await this._visionStage();
        /* IMPL-157（P0）：主链开跑前重新武装看门狗——识图段（含超时中止/失败静默回退）会把段首预算消耗殆尽，
           此前主链沿用残缺预算（最坏剩 ~2s）必被误杀 →「响应超时已自动中止本轮」（接棒模式专属路径） */
        const mainWatch = Store.getSkillThinking() ? 60000 : (hasImg ? 40000 : 25000);
        this._armWatchdog(mainWatch);
        /* 79-c(b)：主链按实际生效模型决定图片去留——llmChatStream 取值序 modelOpt||_forceModel||Store.getSkillModel()
           的落点（此处 modelOpt/_forceModel 均空传）= Store.getSkillModel()；auto 时 _prepareMsgs 内落到同值 */
        const full = await this._streamOnce(this._prepareMsgs(Store.getSkillModel()), {
          watchMs: mainWatch,
          /* 76-c：技能级 maxTokens 覆盖——分页整稿 4096；其他技能 undefined → _streamOnce 回落 1024 原语义 */
          maxTokens: (this.get(ses.skillIds[0]) || {}).maxTokens || undefined,
          tag: "skill:" + (ses.skillIds[0] || "plain"),
          onDelta: (d, fullText) => { ses.streamText = fullText; this._streamTick(); }
        });
        if (!full) throw new Error("技能服务返回为空");
        ses.messages.push({ role: "assistant", content: full });
        this._classify(full);
      }
      ses.rounds += 1;
    } catch (e) {
      this._disarmWatchdog();
      const aborted = e && (e.name === "AbortError" || /aborted/i.test(e.message || ""));
      if (aborted) {
        ses.partial = this._stagePartial || "";
        if (ses.discussion) ses.discussion.forEach(d => { if (d.streaming) { d.streaming = false; if (!d.text) d.text = "（已中止）"; } });
        /* IMPL-74（74-c P1-4/P2-2）：abort 有 partial 时也设 error（此前 partial 只在 error 分支渲染，导致零反馈回落旧视图）；watchdog 误杀与用户中止分开文案 */
        const wd = this._watchdogFired;
        ses.error = ses.partial
          ? (wd ? "响应超时已自动中止本轮（部分输出已保留），可重试" : "已中止本轮（部分输出已保留，可重试）")
          : (wd ? "响应超时已自动中止本轮，可重试" : "已中止本轮");
      } else {
        ses.error = (e && e.message) || "技能执行失败";
        if (this._stagePartial) ses.partial = this._stagePartial;
      }
    } finally {
      this._stagePartial = null;
      this._watchdogFired = false;
      this._disarmWatchdog(); /* IMPL-158-a：成功路径显式收口（防呆——此前依赖触发守卫+置空兜底） */
      if (ses.discussion) ses.discussion.forEach(d => { d.streaming = false; });
      ses.visionLive = false;
      ses.streaming = false;
      ses.abort = null;
      this.renderPanel();
      this.wandSync();
    }
  },
  /* ── IMPL-71：单段流式调用（看门狗按段配速；liveSel 决定「思考中」占位渲染到哪张卡片） ── */
  async _streamOnce(messages, opts) {
    const o = opts || {};
    const buf = [];
    let acc = ""; /* IMPL-160：运行式拼接——原每 delta buf.join("") 全量拷贝 O(n²)（12KB 输出 ≈18MB/轮字符串垃圾） */
    try {
      await Api.llmChatStream(messages, {
        temperature: o.temperature != null ? o.temperature : this.ses.lastTemp,
        maxTokens: o.maxTokens || 1024,
        model: o.model,
        thinking: o.thinking,
        tag: o.tag,
        signal: this.ses.abort.signal,
        onActivity: () => { this._disarmWatchdog(); this._armWatchdog(o.watchMs || 25000); }, /* IMPL-157：任意字节续命（真实语义=静默 watchMs 才算超时） */
        onThink: t => {
          if (o.onThink) { try { o.onThink(t); } catch (e) {} }
          this._disarmWatchdog();
          this._armWatchdog(o.watchMs || 25000); /* IMPL-158-a：兜底对齐 onActivity（漏传 watchMs 不再静默降级 15s） */
          const el = this.wrap?.querySelector(o.liveSel || "[data-sp-stream]");
          if (el && !el.textContent && !el.dataset.think) {
            el.dataset.think = "1";
            el.style.opacity = ".55";
            el.textContent = "🤔 思考中…";
            const body = this.wrap?.querySelector(".sp-body");
            if (body) body.scrollTop = body.scrollHeight;
          }
        },
        onDelta: d => {
          buf.push(d);
          acc += d;
          const fullText = acc;
          const el = this.wrap?.querySelector(o.liveSel || "[data-sp-stream]");
          if (el && el.dataset.think) { el.dataset.think = ""; el.style.opacity = ""; }
          this._disarmWatchdog();
          this._armWatchdog(o.watchMs || 25000); /* IMPL-158-a：兜底对齐 */
          if (o.onDelta) o.onDelta(d, fullText, el);
        }
      });
    } catch (e) {
      this._stagePartial = buf.join("");
      throw e;
    }
    return buf.join("").trim();
  },
  _lastUserHasImg() {
    const ses = this.ses;
    if (!ses) return false;
    const last = ses.messages[ses.messages.length - 1];
    return !!(last && last.role === "user" && Array.isArray(last.content) && last.content.some(p => p && (p.type === "image_url" || p.type === "image")));
  },
  /* ── 79-c(b)：按目标模型能力构造「本次调用」的消息副本（混合识图架构核心） ──
     · 可看图（isVisionModelName）→ 原样返回：报告+原图互证（交叉核验）
     · 不可看图且识图报告在场 → 剥图副本：报告是它的画面唯一事实依据（与旧全局剥图单次调用等价）
     · 无报告（识图失败静默回退）→ 一律原样带图：交由 llmChatStream 自动切视觉兜底（与现状一致）
     只构造副本、绝不改写 ses.messages（旧版 Object.assign 会话级原地剥图废弃）——sp1/sp2/终结者/主链各取所需互不影响；
     "auto" 先落到 Store.getSkillModel()，与 llmChatStream 取值序 modelOpt||_forceModel||Store.getSkillModel() 严格一致 */
  _prepareMsgs(model) {
    const ses = this.ses;
    if (!ses) return [];
    const eff = (model && model !== "auto") ? model : Store.getSkillModel();
    if (!ses.visionReport || isVisionModelName(eff)) return ses.messages.slice();
    return ses.messages.map(m => (!Array.isArray(m.content) || !m.content.some(p => p && (p.type === "image_url" || p.type === "image")))
      ? m
      : Object.assign({}, m, { content: m.content.map(p => p && (p.type === "image_url" || p.type === "image") ? { type: "text", text: "（此处的参考图已由识图模型解析为文字报告，见下方）" } : p) }));
  },
  _liveText(sel, text) {
    /* IMPL-160：rAF 合帧（同 _streamTick）——识图/辩手/终结者每 delta 调用，原版每次全量 textContent+scrollTop 强制同步重排；按 sel 分键互不吞帧 */
    this._liveRaf = this._liveRaf || {};
    const m = this._liveRaf;
    m[sel] = text;
    if (m[sel + "|p"]) return;
    m[sel + "|p"] = 1;
    requestAnimationFrame(() => {
      m[sel + "|p"] = 0;
      const t = m[sel];
      if (t == null) return;
      const el = this.wrap?.querySelector(sel);
      if (el) {
        el.textContent = t;
        const body = this.wrap?.querySelector(".sp-body");
        if (body) body.scrollTop = body.scrollHeight;
      }
    });
  },
  _skillLabel(id) {
    const hit = SKILL_MODEL_PRESETS.find(m => m.id === id)
      || (typeof SKILL_DISCUSS_MODEL_OPTIONS !== "undefined" ? SKILL_DISCUSS_MODEL_OPTIONS.find(m => m.id === id) : null)
      || (typeof SKILL_VISION_MODEL_OPTIONS !== "undefined" ? SKILL_VISION_MODEL_OPTIONS.find(m => m.id === id) : null);
    if (hit) return hit.label;
    return id && id.includes(":") ? id.slice(id.indexOf(":") + 1) : (id || "auto");
  },
  /* ── IMPL-74（74-b）：发言卡轻结构化——仅分段+列表符号悬挂缩进，不做 markdown 解析（esc 已保证安全；流式期不用此渲染防行高跳变） ── */
  _fmtDisc(t) {
    return String(t || "").split("\n").map(line => {
      if (!line.trim()) return '<div class="disc-gap" aria-hidden="true"></div>';
      const li = /^\s*(?:[①②③④⑤⑥⑦⑧⑨⑩]|[-•·]|\d{1,2}[.、)])\s*/.test(line);
      return li ? '<div class="disc-li">' + esc(line) + '</div>'
                : '<div class="disc-p">' + esc(line) + '</div>';
    }).join("");
  },
  /* ── IMPL-103：讨论存档导出——历史轮+识图报告+当轮发言+终稿聚合为 Markdown（纯前端，零上游流量）── */
  _discMarkdown() {
    const ses = this.ses || {};
    const main = this.get(ses.skillIds && ses.skillIds[0]);
    const now = new Date();
    const pad = n => String(n).padStart(2, "0");
    const stamp = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate()) + " " + pad(now.getHours()) + ":" + pad(now.getMinutes());
    const cardMd = (d, num) => {
      const who = d.isUser ? "你的补充" : d.isFinal ? "结论" : "发言 " + num + (d.name ? " · " + d.name : "");
      const body = String(d.text || "").trim() || "（空）";
      return "### " + who + "\n\n" + body + "\n";
    };
    const spkNums = cards => { let k = 0; return new Map(cards.map(d => [d, d.isUser ? 0 : ++k])); };
    const L = [];
    L.push("# 技能讨论存档 · " + (main?.name || "技能"));
    L.push("");
    L.push("- 导出时间：" + stamp);
    L.push("- 技能组合：" + ((ses.skillIds || []).map(id => this.get(id)?.name || id).join(" + ") || "—"));
    L.push("- 讨论模式：" + (Store.getSkillDiscuss() ? "开（多模型多轮讨论）" : "关"));
    L.push("- 轮数：" + (ses.rounds || 0) + " · 终稿版本：" + (ses.versions || []).length);
    const vr = String(ses.visionReport || "").trim();
    if (vr) { L.push("", "## 识图报告", "", vr); }
    (ses.discHistory || []).forEach(h => {
      const hn = spkNums(h.cards || []);
      L.push("", "## 第 " + h.round + " 轮讨论", "");
      (h.cards || []).forEach(d => L.push(cardMd(d, hn.get(d) || 1)));
    });
    const cur = ses.discussion || [];
    if (cur.length) {
      const nums = spkNums(cur);
      L.push("", "## 第 " + (ses.rounds || 1) + " 轮讨论（当轮）", "");
      cur.forEach(d => L.push(cardMd(d, nums.get(d) || 1)));
    }
    (ses.versions || []).forEach((v, i) => {
      L.push("", "## 终稿 · 第 " + (i + 1) + " 版" + (i === ses.verIdx ? "（当前）" : "") + (v.note ? "（" + v.note + "）" : ""), "", String(v.text || "").trim());
    });
    if (ses.rawText && !(ses.versions || []).length) { L.push("", "## 原始输出", "", String(ses.rawText).trim()); }
    return L.join("\n");
  },
  _exportDiscussion() {
    const md = this._discMarkdown();
    const main = this.get(this.ses && this.ses.skillIds && this.ses.skillIds[0]);
    const name = "skill-discussion_" + (main?.id || "session") + "_" + Date.now() + ".md";
    try {
      const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(objUrl), 1000);
      Toast.success("讨论存档已导出（.md）");
    } catch (e) { Toast.error("导出失败"); }
  },
  /* 异厂商发言人池：与所选模型厂商不同者优先（IMPL-69 实测在架清单）；IMPL-72 加同 id 排除防未来池子扩充后自问自答 */
  _pickPeer(sel) {
    const POOL = ["deepseek:deepseek-flash", "siliconflow:Pro/moonshotai/Kimi-K2.6", "siliconflow:zai-org/GLM-4.5V", "dashscope:qwen3.8-omni-flash"];
    if (sel === "auto" || !sel) return POOL[0];
    const prov = s => (s || "").split(":")[0];
    const cands = POOL.filter(m => m !== sel && prov(m) !== prov(sel));
    return cands[0] || POOL[0];
  },
  /* ── IMPL-71 需求⑥：识图段——出《画面事实报告》并可视化；成功后剥图+报告注入会话；失败静默回退（中止除外） ── */
  async _visionStage() {
    const ses = this.ses;
    const last = ses.messages[ses.messages.length - 1];
    const imgs = Array.isArray(last && last.content) ? last.content.filter(p => p && (p.type === "image_url" || p.type === "image") && p.image_url && p.image_url.url) : [];
    if (!imgs.length) return;
    const vModel = Store.getSkillVisionModel();
    ses.visionReport = "";
    ses.visionLive = true;
    this.renderPanel();
    /* IMPL-74（74-c P1-2）+ IMPL-157：识图段首预武装（30s 与段内 watchMs 对齐；长报告提示词+大图 prefill 实测可达 15s+，20s 为边缘误杀值）——否则默认 15s 架空 IMPL-72 的提额，prefill 慢时静默回退损失整份报告 */
    this._armWatchdog(30000);
    try {
      const full = await this._streamOnce([{ role: "user", content: [{ type: "text", text: SKILL_REPORT_PROMPT }, ...imgs] }], {
        model: vModel,
        maxTokens: 2200,
        temperature: 0.2,
        thinking: false,
        tag: "vision",
        watchMs: 30000,
        liveSel: "[data-vsp-live]",
        onDelta: (d, fullText) => { ses.visionReport = fullText; this._liveText("[data-vsp-live]", fullText); }
      });
      if (!full) throw new Error("识图服务返回为空");
      ses.visionReport = full;
      /* 79-c(b) 混合架构：不再无条件全局剥图——ses.messages 保留原图（每段调用由 _prepareMsgs 按目标模型能力
         决定图片去留，互不污染）；报告仍注入最后一条 user 消息：可视化卡片、跨轮持久、纯文本模型唯一画面依据均不变。
         注入措辞中性化：对多模态模型=交叉核对参照（冲突以直接观察为准并指出差异），对纯文本模型=画面唯一事实依据；
         「报告与用户描述冲突时先指出再给方案」纪律保留 */
      const lu = ses.messages[ses.messages.length - 1];
      if (lu && lu.role === "user") {
        /* IMPL-93 A2：识图报告判重——同轮识图成功后任务失败重试时 rounds 未递增，末条 user 仍含旧报告段，
           二次成功会重复追加；以报告头标记判重，已注入过则跳过（旧报告随消息保留，语义不变）。 */
        const REP_TAG = "【识图报告 · 由识图模型先行解析】";
        const hasRep = Array.isArray(lu.content)
          ? lu.content.some(p => p && p.type === "text" && String(p.text || "").indexOf(REP_TAG) === 0)
          : String(lu.content || "").indexOf(REP_TAG) === 0;
        if (!hasRep) {
          const repPart = { type: "text", text: "【识图报告 · 由识图模型先行解析】\n" + full + "\n（以上为画面事实报告，按节逐条给出；多图输入时节内图号「图1/图2…」可直接定位引用。本条消息若附有参考图原图：请以你的直接观察为第一依据，把本报告作为交叉核对的参照，两者冲突时以你的直接观察为准并指出差异；若未附原图：以上报告即画面唯一事实依据。请据此执行任务，不要改写报告中的数字、文字与色名；报告与用户描述冲突时先指出再给方案）" };
          lu.content = Array.isArray(lu.content) ? [...lu.content, repPart] : [ { type: "text", text: lu.content }, repPart ];
        }
      }
    } catch (e) {
      if (e && (e.name === "AbortError" || /aborted/i.test(e.message || ""))) throw e;
      ses.visionReport = null; /* 静默回退：主链路带原图继续（llmChatStream 自动切视觉兜底仍在） */
    } finally {
      ses.visionLive = false;
      this.renderPanel();
    }
  },
  /* ── IMPL-71 需求⑦：讨论发言段（speaker_1=所选模型第一发言 / speaker_2=异厂商接力发言） ── */
  async _speakerStage(idx, model, prev) {
    const ses = this.ses;
    const entry = { name: this._skillLabel(model), model: model || "auto", text: "", isFinal: false, streaming: true, thought: false };
    (ses.discussion = ses.discussion || []).push(entry);
    this.renderPanel();
    /* 79-c(b)：双辩手各按自身模型能力取消息副本（可看图=原图+报告互证 / 纯文本=剥图副本），不再共享全局剥图态 */
    const msgs = this._prepareMsgs(model);
    /* IMPL-74（74-a）：分轮次发言指令——用户补充发言须被正面回应；非首轮不再自称「第一轮」；引用原文>600 字截断（全文已在消息历史） */
    const rnd = ses.rounds + 1;
    const uc = (ses.discussion || []).find(d => d.isUser);
    const uq = uc ? (uc.text.length > 600 ? uc.text.slice(0, 600) + "…" : uc.text) : "";
    const hasPrior = ses.messages.some(m => m.role === "assistant");
    /* IMPL-75 需求⑥：职能对立——建构派×解构派（观点/方案层面强制独立立场防互吹；事实层面以识图报告与直接观察互证，不为对立而虚构） */
    const stance = idx === 2
      ? "你是解构派（红队审校）：以挑剔视角审视任务与已有发言，重点找漏洞、风险、反例与更优替代方向，敢于推翻看似合理的方案；"
      : "你是建构派（方案派）：立足用户目标论证当前最优路径，重点给出增强建议、放大亮点、补足落地细节；";
    const stanceRule = "立场纪律：观点与方案必须给出独立立场，禁止附和式与客套式发言；但画面/数据等事实以识图报告与你的直接观察互证为准：附原图时以直接观察为第一依据、与报告冲突处指出差异；未附原图时以报告为画面事实依据。不为对立而虚构或否认事实。";
    const instr = stance + stanceRule + (prev
      ? "【讨论上下文】发言者（" + prev.name + "）说：\n" + prev.text + "\n\n这是多模型会诊的接力发言：请先点名引用上述发言中至少一处具体观点（可摘其关键词），再表态——同意请给出补充依据，不同意请给出反驳理由与你的替代判断；禁止只说「同意/有道理」而不给增量；不要重复已有观点" + (uc ? "；同时请正面回应本轮用户补充发言中的观点" : "") + "；不要输出最终成品。"
      : uc
        ? (hasPrior
          ? "【第 " + rnd + " 轮讨论】" + (ses.lastTurn === "ask" ? "用户刚回答了此前的追问" : "用户在听取上一轮结论后补充了自己的观点") + "：\n「" + uq + "」\n\n请开始本轮发言：先正面回应用户的补充（认同处说明为何成立，不认同处给出理由与修正方向），再结合此前讨论给出你的增量判断，按「亮点 / 风险 / 可优化点」分点陈述（每类至多 3 条，每条给出具体可执行的判断依据，不写空泛形容词）；不要输出最终成品，最终成品由后续终结者综合后输出。"
          : "用户先补充了自己的想法：\n「" + uq + "」\n\n这是多模型会诊的第一轮发言：请结合上述补充给出你的专业观点与初步思路，按「亮点 / 风险 / 可优化点」分点陈述（每类至多 3 条，每条给出具体可执行的判断依据，不写空泛形容词）；不要输出最终成品，最终成品由后续终结者综合后输出。")
        : (hasPrior
          ? "【第 " + rnd + " 轮讨论】这是新一轮会诊发言：请基于此前讨论与最新结论，针对当前任务给出你的专业观点（可以修正此前方向），按「亮点 / 风险 / 可优化点」分点陈述（每类至多 3 条，每条给出具体可执行的判断依据，不写空泛形容词）；不要输出最终成品，最终成品由后续终结者综合后输出。"
          : "这是多模型会诊的第一轮发言：请针对当前任务给出你的专业观点与初步思路，按「亮点 / 风险 / 可优化点」分点陈述（每类至多 3 条，每条给出具体可执行的判断依据，不写空泛形容词）；不要输出最终成品，最终成品由后续终结者综合后输出。"));
    msgs.push({ role: "user", content: instr });
    /* IMPL-73：讨论×思考兼容——思考开启时段首预武装+放宽看门狗（reasoning 流式持续续命已保证，这里加宽首 token/思考→正文换挡余量）；仅 thinkOn 时放大不拖累普通轮 */
    const thinkOn = Store.getSkillThinking();
    const watchMs = thinkOn ? 40000 : 25000;
    this._armWatchdog(watchMs);
    const full = await this._streamOnce(msgs, {
      model: model === "auto" ? undefined : model,
      maxTokens: thinkOn ? 2048 : 1024,
      tag: idx === 1 ? "discuss:s1" : "discuss:s2",
      watchMs,
      onThink: () => { entry.thought = true; },
      liveSel: "[data-dsp-live]",
      onDelta: (d, fullText) => { entry.text = fullText; this._liveText("[data-dsp-live]", fullText); }
    });
    if (!full) throw new Error("技能服务返回为空");
    entry.text = full;
    entry.streaming = false;
    return entry;
  },
  /* ── IMPL-71：终结者——综合全部讨论，按技能契约收拢出最终结果（唯一入 versions/消息历史的输出） ── */
  async _finalStage(sp1, sp2) {
    const ses = this.ses;
    const sel = Store.getSkillDiscussModel();
    const entry = { name: this._skillLabel(sel), model: sel || "auto", text: "", isFinal: true, streaming: true, thought: false };
    (ses.discussion = ses.discussion || []).push(entry);
    this.renderPanel();
    /* 79-c(b)：终结者按讨论主模型能力取消息副本（与 sp1 同源判定，视觉主模型可带原图复核双辩手引用的画面事实） */
    const msgs = this._prepareMsgs(sel);
    /* IMPL-74（74-a）：终结者上下文显式纳入用户补充发言（有则引用，>600 字截断；终稿须正面回应） */
    const ucF = (ses.discussion || []).find(d => d.isUser);
    const uqF = ucF ? (ucF.text.length > 600 ? ucF.text.slice(0, 600) + "…" : ucF.text) : "";
    const ctx = "【讨论上下文】\n" + (ucF ? "用户本轮补充发言：「" + uqF + "」\n\n" : "") + "发言者1（" + sp1.name + "）说：\n" + sp1.text + "\n\n发言者2（" + sp2.name + "）说：\n" + sp2.text;
    msgs.push({ role: "user", content: ctx + "\n\n以上是全部讨论。输出前先在内部完成三步归并：①逐条列出两位发言者的共识；②列出分歧点并对每一分歧裁定采纳哪一方、说明理由（事实类分歧以识图报告与参与者的直接观察互证裁定，冲突处指出差异再取舍）；③把裁定结果映射为最终方案要点。然后按此前【输出要求】契约输出最终结果：条件已足→直接给一个 ``` 围栏块终稿（终稿必须体现对分歧的明确取舍，不得含糊并列，不得输出清单与讨论过程文字）；条件不足→以【追问】开头。" + (ucF ? "终稿必须吸收或正面回应用户的补充发言，不采纳处说明理由。" : "") + "不要复述讨论原文。" });
    const thinkOn = Store.getSkillThinking();
    const watchMs = thinkOn ? 45000 : 30000;
    this._armWatchdog(watchMs);
    const full = await this._streamOnce(msgs, {
      model: sel === "auto" ? undefined : sel,
      maxTokens: thinkOn ? 6144 : 4096,
      tag: "discuss:final",
      watchMs,
      onThink: () => { entry.thought = true; },
      liveSel: "[data-dsp-live]",
      onDelta: (d, fullText) => { entry.text = fullText; this._liveText("[data-dsp-live]", fullText); }
    });
    if (!full) throw new Error("技能服务返回为空");
    entry.text = full;
    entry.streaming = false;
    ses.messages.push({ role: "assistant", content: full });
    this._classify(full);
  },
  _watchdogFired: false,
  _armWatchdog(ms) {
    this._disarmWatchdog();
    this._watchdog = setTimeout(() => {
      const ses = this.ses;
      if (ses && ses.streaming && ses.abort) {
        /* IMPL-74（74-c P2-2）：标记看门狗触发，catch 里区分「误杀」与用户主动中止 */
        this._watchdogFired = true;
        try { ses.abort.abort(); } catch (e) {}
      }
    }, ms || 15000);
  },
  _disarmWatchdog() {
    if (this._watchdog) { clearTimeout(this._watchdog); this._watchdog = null; }
  },
  _streamTick() {
    const ses = this.ses;
    if (!ses) return; /* IMPL-104：会话已销毁的迟到 tick 直接丢弃（此前 TypeError 被 llmChatStream 逐行 catch 静默吞掉） */
    if (this._tickRaf) return; /* IMPL-160：rAF 合帧——每帧最多应用一次（主链每 delta 调用 20-80 次/秒，原版每次全量 textContent+scrollTop=一次文档级强制同步重排，中低端手机长流式主线程 5-30% 耗在布局） */
    this._tickRaf = requestAnimationFrame(() => {
      this._tickRaf = null;
      const cur = this.ses;
      if (!cur || !cur.streaming) return;
      const el = this.wrap?.querySelector("[data-sp-stream]");
      if (el) {
        el.textContent = cur.streamText;
        const body = this.wrap?.querySelector(".sp-body");
        if (body) body.scrollTop = body.scrollHeight;
      } else if (!cur.collapsed) {
        /* IMPL-74（74-c P2-5）：流式期间面板已收起时不再全量重绘（每增量一次的 renderPanel 纯浪费） */
        this.renderPanel();
      }
    });
  },

  /* ── 契约 v3.1 三态解析：围栏块 / 【追问】 / 兜底 ── */
  _classify(full) {
    const ses = this.ses;
    if (/^【追问】/.test(full.trim())) {
      ses.lastTurn = "ask";
      ses.pendingAsk = this._parseAsk(full);
      ses.pendingAsk.raw = full;
      /* IMPL-74（74-c P1-3）：新追问必须清残答——否则「答 q0→自由输入→新两问追问→只点 q1」会把旧 q0 答案误配进 combo 自动发送 */
      ses.askAnswers = null;
      return;
    }
    const block = this._extractFence(full);
    if (block != null && block.trim()) {
      /* IMPL-74（74-c P1-5）：note 提取同步换行级解析，拒绝散文伪围栏污染 */
      const note = this._noteOf(full);
      ses.versions.push({ text: block.trim(), note: note.slice(0, 80) });
      ses.verIdx = ses.versions.length - 1;
      ses.lastTurn = "result";
      ses.pendingAsk = null;
      ses.askAnswers = null;
    } else {
      ses.lastTurn = "raw";
      ses.rawText = full;
      /* IMPL-74（74-c P1-3）：raw 态清追问残留（含 placeholder 的「回答技能的问题…」态） */
      ses.pendingAsk = null;
      ses.askAnswers = null;
    }
  },
  /* IMPL-74（74-c P1-5）：行级围栏解析——散文里提及的 ``` 不再与真围栏配对（旧闭对正则会把「用 ``` 包裹：」后的正文错切进 versions）；
     支持双围栏取最后/未闭合兜底/行尾内联闭合/CRLF；兜底仅接受行首裸 ``` 或带语言词法 ```lang（防伪配对） */
  _extractFence(text) {
    const src = String(text || "").replace(/\r\n?/g, "\n");
    const lines = src.split("\n");
    let last = null, open = -1;
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      if (open === -1) {
        if (/^```[a-zA-Z][a-zA-Z0-9._-]*\s*$/.test(t) || t === "```") open = i;
      } else if (t === "```") { last = lines.slice(open + 1, i).join("\n"); open = -1; }
      else if (/[ \t]*```[ \t]*$/.test(lines[i])) { last = lines.slice(open + 1, i).concat(lines[i].replace(/[ \t]*```[ \t]*$/, "")).join("\n"); open = -1; }
    }
    if (last == null && open !== -1) last = lines.slice(open + 1).join("\n");
    if (last == null) {
      const i = src.lastIndexOf("```");
      if (i !== -1) {
        const rest = src.slice(i).replace(/^```[a-zA-Z]*/, "");
        if (rest === "" || rest.startsWith("\n")) last = rest.replace(/^\n/, "");
      }
    }
    return last;
  },
  /* IMPL-74（74-c P1-5）：note 行提取——跳过围栏块内容，取最后一条非空围栏外文本行 */
  _noteOf(full) {
    const out = []; let open = false;
    for (const ln of String(full || "").split("\n")) {
      const t = ln.trim();
      if (!open && (/^```[a-zA-Z][a-zA-Z0-9._-]*\s*$/.test(t) || t === "```")) { open = true; continue; }
      if (open) { if (t === "```" || /[ \t]*```[ \t]*$/.test(ln)) open = false; continue; }
      out.push(t);
    }
    return out.filter(Boolean).pop() || "";
  },
  /* ── 76-c：分页成稿——唯一围栏内「===第 N 页 | 页标题===」分隔稿解析为页卡；marks<2 或无正文时返回 null（整稿 1 页兑底走既有渲染） ── */
  _parsePages(text) {
    const t = String(text || "");
    if (!/^[ \t]*={2,}[ \t]*第\s*\d{1,2}\s*页/m.test(t)) return null;
    const re = /^[ \t]*={2,}[ \t]*第\s*(\d{1,2})\s*页[ \t]*(?:[|｜:：\-—][ \t]*(.*?))?[ \t]*={0,6}[ \t]*$/gm;
    const marks = []; let m;
    while ((m = re.exec(t))) marks.push({ num: Number(m[1]), title: (m[2] || "").trim(), idx: m.index, len: m[0].length });
    if (marks.length < 2) return null;
    const pages = [];
    for (let i = 0; i < marks.length; i++) {
      const start = marks[i].idx + marks[i].len;
      const end = i + 1 < marks.length ? marks[i + 1].idx : t.length;
      const body = t.slice(start, end).replace(/^\n+/, "").replace(/\n+$/, "").trim();
      pages.push({ num: marks[i].num, title: marks[i].title, text: body });
    }
    return pages.some(p => p.text) ? pages : null;
  },
  _pageList(ses) {
    if (!ses || !ses.versions || !ses.versions.length) return null;
    const main = this.get(ses.skillIds[0]);
    if (!main || (main.skillId !== "page-splitter" && main.skillId !== "video-storyboard")) return null;
    return this._parsePages((ses.versions[ses.verIdx] || {}).text || "");
  },
  fillPage(i, thenGenerate) {
    const ses = this.ses;
    const pages = ses && this._pageList(ses);
    const p = pages && pages[i];
    if (!p) return;
    const ta = $('[data-key="prompt"], [data-key="text"]');
    if (!ta) return;
    ta.value = p.text;
    UI._onPromptInput(ta);
    if (thenGenerate) { UI.handleGenerate(); return; }
    /* 与 fillTextarea 的差异：页卡逐页流不收起面板（收起会藏住页卡列表，破坏连续填页流） */
    Toast.success("已填入第 " + p.num + " 页（可微调后生成）");
  },
  copyPage(i) {
    const ses = this.ses;
    const pages = ses && this._pageList(ses);
    const p = pages && pages[i];
    if (!p) return;
    copy(p.text).then(ok => ok ? Toast.success("已复制第 " + p.num + " 页") : Toast.error("复制失败")); /* IMPL-104：接 copy 帮手（file:// 降级） */
  },
  copyAllPages() {
    const ses = this.ses;
    const pages = ses && this._pageList(ses);
    if (!pages || !pages.length) return;
    const all = pages.map(p => "===第 " + p.num + " 页" + (p.title ? " | " + p.title : "") + "===\n" + p.text).join("\n\n");
    copy(all).then(ok => ok ? Toast.success("已复制全部 " + pages.length + " 页") : Toast.error("复制失败")); /* IMPL-104 */
  },
  /* 链式参考：最近一张生成成功的图片设为参考图（风格锚定最强；图生图会连构图一起锚，按钮 title 已说明取舍）。
     IMPL-76 E2E 发现：历史任务在 Store.getHistory() 而非 getTasks()（对齐 _renderResultStrip 的双源合并语义） */
  chainLastResult() {
    const tasks = Store.getTasks();
    const tids = new Set(tasks.map(t => t.id));
    const history = (Store.getHistory() || []).filter(h => !tids.has(h.id));
    const last = [...tasks, ...history]
      .filter(t => t.status === "succeeded" && (t.model?.type || "image") === "image" && t.result?.url)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0];
    if (!last) { Toast.info("还没有生成成功的图片——先填入并生成一页，再把结果锚定为参考"); return; }
    UI._useAsReference(last.result.url, "image");
  },
  _pagesBody(ses, ver, pages) {
    const list = pages.map((p, i) => `
      <div class="pg-card">
        <div class="pg-head"><span class="pg-num">${p.num}</span><span class="pg-title">${esc(p.title || "第 " + p.num + " 页")}</span></div>
        <div class="pg-text">${esc(p.text)}</div>
        <div class="pg-acts">
          <button type="button" class="pg-btn" data-pg-fill="${i}">填入</button>
          <button type="button" class="pg-btn primary" data-pg-fillgen="${i}">填入并生成</button>
          <button type="button" class="pg-btn ghost" data-pg-copy="${i}">复制本页</button>
          ${i + 1 < pages.length ? `<button type="button" class="pg-btn ghost" data-pg-next="${i + 1}" title="填入下一页提示词；生成完成后可用「参考上一张」把本页结果锚定为参考图">下一页 →</button>` : ""}
        </div>
      </div>`).join("");
    return `<div class="pg-toolbar"><span class="pg-count">共 ${pages.length} 页</span>`
      + `<button type="button" class="sp-act" data-pg-copyall>复制全部</button>`
      + `<button type="button" class="sp-act" data-pg-chain title="把最近一张生成成功的结果设为参考图，锚定整套风格（图生图会连构图一起锚，酌情使用）">参考上一张</button>`
      + `<button type="button" class="sp-act" data-sp-regen>重新生成</button></div>`
      + `<div class="pg-list">${list}</div>`;
  },
  _parseAsk(raw) {
    const lines = raw.trim().replace(/^【追问】\s*/, "").split("\n").map(s => s.trim()).filter(Boolean);
    const questions = [];
    let cur = null;
    for (const ln of lines) {
      if (/^[-•·]\s*/.test(ln)) {
        const opt = ln.replace(/^[-•·]\s*/, "").trim();
        if (cur && opt) cur.options.push(opt);
      } else {
        cur = { q: ln, options: [] };
        questions.push(cur);
      }
    }
    return { questions: questions.slice(0, 2) };
  },

  /* ── 动作 ── */
  fillTextarea(thenGenerate) {
    const ses = this.ses;
    const v = ses && ses.versions[ses.verIdx];
    if (!v) return;
    const ta = $('[data-key="prompt"], [data-key="text"]');
    if (!ta) return;
    ta.value = v.text;
    UI._onPromptInput(ta);
    if (thenGenerate) { UI.handleGenerate(); return; }
    ses.collapsed = true;
    this.renderPanel();
    Toast.success("已填入输入框（会话保留，可继续迭代）");
  },
  restoreVersion() {
    const ses = this.ses;
    const v = ses && ses.versions[ses.verIdx];
    if (!v) return;
    const ta = $('[data-key="prompt"], [data-key="text"]');
    if (ta) { ta.value = v.text; UI._onPromptInput(ta); }
    ses.pendingDirective = `用户回退到第 ${ses.verIdx + 1} 版，请以该版为当前版本继续。`;
    ses.collapsed = true;
    this.renderPanel();
    Toast.info(`已恢复第 ${ses.verIdx + 1} 版，下轮发送时告知技能`);
  },
  retry() {
    const ses = this.ses;
    if (!ses || ses.streaming) return;
    /* IMPL-74：失败轮重试——从残存卡片找回用户补充发言，重入讨论流（否则本轮「你的补充」卡丢失） */
    const uc = (ses.discussion || []).find(d => d.isUser);
    if (uc && !ses.userSpeech) ses.userSpeech = uc.text;
    this._sendTurn(ses.lastTemp);
  },
  answerChip(qi, opt) {
    const ses = this.ses;
    if (!ses || !ses.pendingAsk || ses.streaming) return;
    const qs = ses.pendingAsk.questions;
    if (qs.length <= 1) {
      ses.messages.push({ role: "user", content: "用户补充：" + opt });
      if (Store.getSkillDiscuss()) ses.userSpeech = opt; /* IMPL-74：选项作答=用户发言，入讨论流 */
      ses.pendingAsk = null;
      this._sendTurn(0.5);
    } else {
      ses.askAnswers = ses.askAnswers || {};
      ses.askAnswers[qi] = opt;
      if (qs.every((q, i) => ses.askAnswers[i])) {
        const combo = qs.map((q, i) => q.q + " " + ses.askAnswers[i]).join("；");
        ses.messages.push({ role: "user", content: "用户补充：" + combo });
        if (Store.getSkillDiscuss()) ses.userSpeech = combo; /* IMPL-74：选项作答=用户发言，入讨论流 */
        ses.pendingAsk = null;
        ses.askAnswers = null;
        this._sendTurn(0.5);
      } else {
        this.renderPanel();
      }
    }
  },
  panelSend(text) {
    const ses = this.ses;
    if (!ses || ses.streaming) return;
    text = String(text || "").trim();
    if (!text) return;
    this.nextRound(text, "panel");
  },

  /* ── 渲染 ── */
  wandSync() {
    this._docSync && this._docSync();
    const btn = this.wrap?.querySelector("[data-wand]");
    if (!btn) return;
    const ses = this.ses;
    const list = this.listForTab(UI.state.tab);
    const ready = this.configReady();
    btn.classList.toggle("busy", !!(ses && ses.streaming));
    btn.classList.toggle("locked", !ready);
    btn.title = !ready ? "配置 Worker URL 与 Auth Token 后可用技能（设置 → R2 图床）"
      : ses && ses.streaming ? "点击中止本轮"
      : ses ? "AI优化下一轮（Ctrl/Cmd+Enter 等价）"
      : list.length ? `AI优化：${list[0].name}` : "选择技能，AI 优化提示词";
  },
  renderBubbles() {
    const box = this.wrap?.querySelector("[data-skill-bubbles]");
    if (!box) return;
    const list = this.listForTab(UI.state.tab);
    if (!list.length) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    box.hidden = false;
    box.innerHTML = '<span class="sb-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/></svg>技能</span>' + list.map(s =>
      `<span class="sb-chip" title="${esc(s.description)}">${esc(s.name)}${(s.requiredCapabilities || []).includes("image_input") ? '<i class="sb-need">图</i>' : ""}<button type="button" class="sb-x" data-skill-x="${esc(s.skillId)}" aria-label="移除技能 ${esc(s.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></span>`
    ).join("") + '<button type="button" class="sb-add" data-skill-add title="添加技能" aria-label="添加技能"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg></button>';
    if (!box.dataset.wheelBound) {
      box.dataset.wheelBound = "1";
      /* 鼠标滚轮 → 横向滚动：技能多时不折行、不截断（IMPL-55） */
      box.addEventListener("wheel", e => {
        if (box.scrollWidth <= box.clientWidth + 1) return;
        const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? 0 : e.deltaY;
        if (!d) return;
        e.preventDefault();
        box.scrollLeft += d;
      }, { passive: false });
    }
    box.querySelectorAll("[data-skill-x]").forEach(b => b.addEventListener("click", e => {
      e.stopPropagation();
      this.toggle(b.dataset.skillX);
    }));
    box.querySelector("[data-skill-add]")?.addEventListener("click", () => UI._openPresetPicker("skills"));
  },
  renderPanel() {
    const box = this.wrap?.querySelector("[data-skill-panel]");
    if (!box) return;
    const ses = this.ses;
    if (!ses) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    /* IMPL-69：重绘前记住滚动位置——点选项/切版本后面板不再跳回最上面 */
    const prevBody = box.querySelector(".sp-body");
    const prevScroll = prevBody ? prevBody.scrollTop : null;
    const main = this.get(ses.skillIds[0]);
    const ver = ses.versions[ses.verIdx] || null;
    const dots = ses.versions.map((v, i) =>
      `<button type="button" class="sp-vdot${i === ses.verIdx ? " active" : ""}" data-sp-v="${i}" title="第 ${i + 1} 版" aria-label="查看第 ${i + 1} 版"></button>`
    ).join("");
    /* IMPL-71 需求⑥⑦：识图报告卡（琥珀可折叠）+ 讨论过程卡（厂商色点+发言/结论标签） */
    const _provOf = m => (m || "").split(":")[0];
    const visCard = (ses.visionReport === null && !ses.visionLive) ? "" : `
      <div class="vis-card" data-vis-card data-open="${ses.visionOpen ? "1" : "0"}">
        <div class="vis-head" data-vis-head role="button" tabindex="0" aria-expanded="${ses.visionOpen ? "true" : "false"}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg><span>识图报告 · ${esc(this._skillLabel(Store.getSkillVisionModel()))}</span>${ses.visionLive ? '<span class="vis-live">解析中…</span>' : (ses.visionReport ? `<span class="vis-len">约 ${ses.visionReport.length} 字</span>` : "")}</div>
        <div class="vis-body" ${ses.visionOpen ? "" : "hidden"}>${ses.visionLive ? `<span data-vsp-live>${esc(ses.visionReport || "")}</span><span class="sp-caret" aria-hidden="true"></span>` : esc(ses.visionReport || "")}</div>
      </div>`;
    /* IMPL-74（74-a）：讨论卡模板抽取（当轮/历史轮共用）；isUser=用户补充卡；hist=true 时不渲染「收拢」注释与 data-jump（历史轮下方无对应结果气泡）
       IMPL-103：当轮非流式卡支持单卡折叠（idx 传入时启用）——head 可点+键盘可达，折叠态存 d.folded 随对象持久，流式卡/历史轮卡不参与 */
    const _foldable = (d, hist, idx) => !hist && !d.streaming && idx != null;
    const _foldHeadAttr = (d, hist, idx) => _foldable(d, hist, idx) ? ` data-fold role="button" tabindex="0" aria-expanded="${d.folded ? "false" : "true"}" aria-label="折叠或展开发言"` : "";
    const _foldCardAttr = (d, hist, idx) => _foldable(d, hist, idx) ? ` data-open="${d.folded ? "0" : "1"}" data-disc-idx="${idx}"` : "";
    const _foldChev = (d, hist, idx) => _foldable(d, hist, idx) ? '<svg class="disc-foldc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' : "";
    const _foldTextAttr = (d, hist, idx) => _foldable(d, hist, idx) && d.folded ? " hidden" : "";
    const _discCard = (d, num, hist, idx) => `
        <div class="disc-card${d.isFinal ? " final" : ""}"${d.isFinal && !d.streaming && !hist ? ' data-jump title="点击正文跳至下方最终结果"' : ""} data-prov="${esc(d.isUser ? "user" : _provOf(d.model))}"${_foldCardAttr(d, hist, idx)}>
          <div class="disc-head"${_foldHeadAttr(d, hist, idx)}><span class="disc-dot"></span><span class="disc-tag${d.isFinal ? " final" : d.isUser ? " user" : ""}">${d.isUser ? "你的补充" : d.isFinal ? "结论" : "发言 " + num}</span>${d.thought ? '<i class="disc-think" title="本段走了深度思考">深度</i>' : ""}${d.isUser ? "" : `<span class="disc-model">${esc(d.name)}</span>`}${d.streaming ? '<span class="vis-live">生成中…</span>' : ""}${_foldChev(d, hist, idx)}</div>
          <div class="disc-text"${_foldTextAttr(d, hist, idx)}>${d.isFinal && !d.streaming && !hist ? '<div class="disc-final-note">已按技能契约收拢为下方最终结果</div>' : d.streaming ? `<span data-dsp-live>${esc(d.text)}</span><span class="sp-caret" aria-hidden="true"></span>` : `<div class="disc-fmt">${this._fmtDisc(d.text)}</div>`}</div>
        </div>`;
    const _spkNums = cards => { let k = 0; return new Map(cards.map(d => [d, d.isUser ? 0 : ++k])); };
    const nums = _spkNums(ses.discussion || []);
    const discList = (ses.discussion && ses.discussion.length)
      ? `<div class="dsp-list">` + ses.discussion.map((d, i) => _discCard(d, nums.get(d) || 1, false, i)).join("") + `</div>`
      : "";
    /* IMPL-74（74-a）：历史轮讨论存档——details 原生折叠默认收起，展开状态记忆在会话内（histOpen 防重绘坍缩） */
    const histList = (ses.discHistory && ses.discHistory.length)
      ? ses.discHistory.map(h => {
          const hn = _spkNums(h.cards);
          const open = ses.histOpen && ses.histOpen[h.round] ? " open" : "";
          return `<details class="disc-hist" data-round="${h.round}"${open}><summary><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg><span>第 ${h.round} 轮讨论 · ${h.cards.length} 条${h.vision ? " · 含识图报告" : ""}</span></summary>${h.vision ? `<div class="disc-hist-vis">${esc(h.vision)}</div>` : ""}<div class="dsp-list">${h.cards.map(d => _discCard(d, hn.get(d) || 1, true)).join("")}</div></details>`;
        }).join("")
      : "";
    /* IMPL-103：讨论工具行——当轮发言全部收起/展开 + 讨论存档复制/导出；streaming 中不渲染（防半程导出、折叠无意义） */
    const _dcount = (ses.discussion || []).length + (ses.discHistory || []).reduce((n, h) => n + (h.cards || []).length, 0);
    const _anyOpen = (ses.discussion || []).some(d => !d.folded);
    const toolsHtml = (_dcount && !ses.streaming) ? `<div class="sp-tools">
        ${(ses.discussion || []).length ? `<button type="button" class="sp-tool" data-sp-foldall>${_anyOpen ? "收起发言" : "展开发言"}</button>` : ""}
        <button type="button" class="sp-tool" data-sp-copydisc>复制讨论</button>
        <button type="button" class="sp-tool" data-sp-export title="下载讨论存档为 Markdown 文件">导出讨论</button>
      </div>` : "";
    const stagesHtml = (histList || visCard || discList) ? `<div class="sp-stages">${toolsHtml}${histList}${visCard}${discList}</div>` : "";
    /* IMPL-74（74-b）：流式段级进度——从会话态现场推导零新状态；/2 为现役讨论管线发言人数（扩员需同步） */
    let stageLabel = "";
    if (ses.streaming) {
      if (ses.visionLive) stageLabel = "识图";
      else {
        const ds = ses.discussion || [];
        const li = ds.findIndex(d => d.streaming);
        if (li >= 0) stageLabel = ds[li].isFinal ? "收拢" : "发言 " + (ds.slice(0, li + 1).filter(d => !d.isFinal && !d.isUser).length) + "/2";
      }
    }
    let body = "";
    if (ses.streaming) {
      /* 阶段化流式（识图/讨论/终结者）正文写入各自卡片；直连/接棒思考段仍走主气泡 */
      const stagedLive = ses.visionLive || (ses.discussion || []).some(d => d.streaming);
      body = stagedLive ? "" : `<div class="sp-bubble fenced sp-streaming"><span data-sp-stream>${esc(ses.streamText)}</span><span class="sp-caret" aria-hidden="true"></span></div>`;
    } else if (ses.error) {
      body = `<div class="sp-bubble err">${esc(ses.error)}</div>`
        + (ses.partial ? `<div class="sp-bubble sys">${esc(trunc(ses.partial, 400))}</div>` : "")
        + `<div class="sp-actions"><button type="button" class="sp-act primary" data-sp-retry>重试</button></div>`;
    } else if (ses.lastTurn === "raw" && ses.rawText) {
      body = `<div class="sp-bubble sys">${esc(trunc(ses.rawText, 600))}</div><div class="sp-actions"><button type="button" class="sp-act" data-sp-copy>复制全文</button></div>`;
    } else if (ses.pendingAsk) {
      const qs = ses.pendingAsk.questions;
      body = `<div class="sp-bubble ask">${esc(ses.pendingAsk.raw || "")}</div>`;
      if (qs.some(q => q.options.length)) {
        body += qs.map((q, qi) => q.options.length
          ? `<div class="sp-q">${esc(q.q)}</div><div class="sp-chips">` + q.options.map(o => {
            const on = ses.askAnswers && ses.askAnswers[qi] === o;
            return `<button type="button" class="sp-chip${on ? " on" : ""}" data-sp-chip="${qi}|${esc(o)}">${esc(o)}</button>`;
          }).join("") + "</div>"
          : "").join("");
        const answered = ses.askAnswers ? Object.keys(ses.askAnswers).length : 0;
        body += `<div class="sp-note">${qs.length > 1 ? "逐个点选，两问齐答后自动发送" + (answered ? `（已答 ${answered}/${qs.length}）` : "") : "点选项直接作答，或自由输入"}</div>`;
      } else {
        body += `<div class="sp-note">在下方输入回答，技能会继续出提示词</div>`;
      }
    } else if (ver) {
      /* 76-c：分页成稿——主技能=page-splitter 且终稿含「===第 N 页===」分隔行时，页卡视图替代整稿围栏（整稿级操作保留：重新生成） */
      const pages = this._pageList(ses);
      if (pages) body = (ver.note ? `<div class="sp-note">${esc(ver.note)}</div>` : "") + this._pagesBody(ses, ver, pages);
      if (!pages) {
      body = (ver.note ? `<div class="sp-note">${esc(ver.note)}</div>` : "")
        + `<div class="sp-bubble fenced">${esc(ver.text)}</div>`;
      if (ses.showDiff && ses.verIdx > 0) {
        const parts = this._diffWords(ses.versions[ses.verIdx - 1].text, ver.text);
        body += `<div class="sp-bubble sp-diff">` + parts.map(p =>
          p.k === "same" ? esc(p.t) : p.k === "ins" ? `<ins>${esc(p.t)}</ins>` : `<del>${esc(p.t)}</del>`
        ).join("") + `</div>`;
      }
      const isLatest = ses.verIdx === ses.versions.length - 1;
      body += `<div class="sp-actions">`
        + (isLatest
          ? `<button type="button" class="sp-act" data-sp-fill>填入输入框</button><button type="button" class="sp-act" data-sp-fillgen>填入并生成</button><button type="button" class="sp-act" data-sp-regen>重新生成</button>${Store.getSkillDiscuss() ? `<button type="button" class="sp-act" data-sp-nextdisc title="两位发言者基于当前终稿再给一轮意见，终结者修订新终稿">再讨论一轮</button>` : ""}<button type="button" class="sp-act" data-sp-copyver>复制</button>`
          : `<button type="button" class="sp-act primary" data-sp-restore>恢复此版</button><button type="button" class="sp-act" data-sp-latest>回到最新</button>`)
        + (ses.versions.length > 1 ? `<button type="button" class="sp-act${ses.showDiff ? " primary" : ""}" data-sp-difftoggle>${ses.showDiff ? "隐藏差异" : "对比上一版"}</button>` : "")
        + `</div>`;
      }
    } else {
      body = `<div class="sp-bubble sys">技能已就绪，等待执行…</div>`;
    }
    if (stagesHtml) body = stagesHtml + body;
    box.hidden = false;
    box.innerHTML = `
      <div class="sp-head">
        <span class="sp-title">✦ ${esc(main?.name || "技能")}</span>
        <span class="sp-round">${ses.streaming ? `生成中${stageLabel ? " · " + stageLabel : ""}…` : `第 ${ses.rounds} 轮${this.MAX_ROUNDS > 0 ? " · 上限 " + this.MAX_ROUNDS : ""}`}</span>
        ${ses.versions.length ? `<div class="sp-versions">${dots}</div>` : ""}
        <button type="button" class="sp-fold" data-sp-fold>${ses.collapsed ? "展开" : "收起"}</button>
      </div>
      ${ses.collapsed ? "" : `<div class="sp-body">${body}</div>
      <div class="sp-input-row">
        <textarea class="sp-input" data-sp-input rows="1" placeholder="${ses.pendingAsk ? "回答技能的问题…" : Store.getSkillDiscuss() && (ses.lastTurn === "result" || ses.lastTurn === "raw") ? "补充你的观点，开启新一轮讨论…" : "元指令微调，如：更简洁、换竖版、去掉文字"}" aria-label="技能会话输入"></textarea>
        <button type="button" class="sp-send" data-sp-send ${ses.streaming ? "disabled" : ""}>发送</button>
      </div>`}
    `;
    box.querySelector("[data-sp-fold]")?.addEventListener("click", () => {
      ses.collapsed = !ses.collapsed;
      this.renderPanel();
    });
    const visHead = box.querySelector("[data-vis-head]");
    if (visHead) {
      const flipVis = () => {
        ses.visionOpen = !ses.visionOpen;
        const card = box.querySelector("[data-vis-card]");
        if (card) card.dataset.open = ses.visionOpen ? "1" : "0";
        visHead.setAttribute("aria-expanded", ses.visionOpen ? "true" : "false");
        const bd = card && card.querySelector(".vis-body");
        if (bd) bd.hidden = !ses.visionOpen;
      };
      visHead.addEventListener("click", flipVis);
      visHead.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flipVis(); } });
    }
    box.querySelectorAll("[data-sp-v]").forEach(b => b.addEventListener("click", () => {
      ses.verIdx = Number(b.dataset.spV);
      this.renderPanel();
    }));
    box.querySelector("[data-sp-retry]")?.addEventListener("click", () => this.retry());
    box.querySelector("[data-sp-copy]")?.addEventListener("click", () => {
      copy(ses.rawText || "").then(ok => ok ? Toast.success("已复制全文") : Toast.error("复制失败")); /* IMPL-104 */
    });
    /* IMPL-73：最终结果一键复制——提示词工作台最高频动作是「拿走文本」，此前需 填入→全选→复制 三步 */
    box.querySelector("[data-sp-copyver]")?.addEventListener("click", () => {
      const v = (ses.versions[ses.verIdx] || {}).text || "";
      copy(v).then(ok => ok ? Toast.success("已复制当前版本") : Toast.error("复制失败")); /* IMPL-104 */
    });
    box.querySelectorAll("[data-sp-chip]").forEach(b => b.addEventListener("click", () => {
      const raw = String(b.dataset.spChip || "");
      const i = raw.indexOf("|");
      this.answerChip(Number(raw.slice(0, i)), raw.slice(i + 1));
    }));
    box.querySelector("[data-sp-fill]")?.addEventListener("click", () => this.fillTextarea(false));
    box.querySelector("[data-sp-fillgen]")?.addEventListener("click", () => this.fillTextarea(true));
    /* 76-c：分页成稿页卡绑定（data-pg-next 的值=目标页下标，即 fillPage(i+1)） */
    box.querySelectorAll("[data-pg-fill]").forEach(b => b.addEventListener("click", () => this.fillPage(Number(b.dataset.pgFill), false)));
    box.querySelectorAll("[data-pg-fillgen]").forEach(b => b.addEventListener("click", () => this.fillPage(Number(b.dataset.pgFillgen), true)));
    box.querySelectorAll("[data-pg-copy]").forEach(b => b.addEventListener("click", () => this.copyPage(Number(b.dataset.pgCopy))));
    box.querySelectorAll("[data-pg-next]").forEach(b => b.addEventListener("click", () => this.fillPage(Number(b.dataset.pgNext), false)));
    box.querySelector("[data-pg-copyall]")?.addEventListener("click", () => this.copyAllPages());
    box.querySelector("[data-pg-chain]")?.addEventListener("click", () => this.chainLastResult());
    box.querySelector("[data-sp-regen]")?.addEventListener("click", () => this.nextRound("", "wand"));
    box.querySelector("[data-sp-restore]")?.addEventListener("click", () => this.restoreVersion());
    box.querySelector("[data-sp-latest]")?.addEventListener("click", () => {
      ses.verIdx = ses.versions.length - 1;
      this.renderPanel();
    });
    box.querySelector("[data-sp-difftoggle]")?.addEventListener("click", () => {
      ses.showDiff = !ses.showDiff;
      this.renderPanel();
    });
    /* IMPL-74（74-b）：结论卡点击 → 滚动到下方围栏结果（reduced-motion 显式降级 auto；追问轮无 fenced 气泡时静默） */
    box.querySelector(".disc-card.final[data-jump]")?.addEventListener("click", () => {
      const tgt = box.querySelector(".sp-bubble.fenced");
      if (!tgt) return;
      tgt.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
    });
    /* IMPL-74（74-a）：不输入直接开一轮新讨论——指令走 pendingDirective 管道（temp 0.5，不设用户卡） */
    box.querySelector("[data-sp-nextdisc]")?.addEventListener("click", () => {
      if (ses.streaming) return;
      ses.pendingDirective = "基于当前终稿继续下一轮讨论：请两位发言者针对终稿再各给一轮意见（终稿还有哪里不足、有无更优替代方向、最后一击的优化是什么），终结者据此修订出更进一步的新终稿。";
      this.nextRound("", "panel");
    });
    /* IMPL-74（74-a）：历史轮折叠展开状态记忆（重绘后恢复） */
    box.querySelectorAll(".disc-hist").forEach(dt => dt.addEventListener("toggle", () => {
      ses.histOpen = ses.histOpen || {};
      ses.histOpen[Number(dt.dataset.round)] = dt.open;
    }));
    /* IMPL-103：单卡折叠——head 点击/键盘切换；stopPropagation 防 final 卡整卡 jump 抢占；text 区点击仍可 jump */
    box.querySelectorAll(".disc-head[data-fold]").forEach(hd => {
      const card = hd.closest(".disc-card");
      const flip = () => {
        const d = (ses.discussion || [])[Number(card.dataset.discIdx)];
        if (!d || d.streaming) return;
        d.folded = !d.folded;
        card.dataset.open = d.folded ? "0" : "1";
        hd.setAttribute("aria-expanded", d.folded ? "false" : "true");
        const tx = card.querySelector(".disc-text");
        if (tx) tx.hidden = d.folded;
      };
      hd.addEventListener("click", e => { e.stopPropagation(); flip(); });
      hd.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); } });
    });
    /* IMPL-103：工具行——全部收起/展开（就地改 folded 后重绘）；复制/导出讨论存档 */
    box.querySelector("[data-sp-foldall]")?.addEventListener("click", () => {
      const ds = ses.discussion || [];
      if (!ds.length) return;
      const fold = ds.some(d => !d.folded);
      ds.forEach(d => { d.folded = fold; });
      this.renderPanel();
    });
    box.querySelector("[data-sp-copydisc]")?.addEventListener("click", async () => {
      /* 复用全局 copy 帮手（clipboard API + execCommand 降级）——file:// / 非安全上下文也可复制 */
      const ok = await copy(this._discMarkdown());
      ok ? Toast.success("讨论存档已复制") : Toast.error("复制失败");
    });
    box.querySelector("[data-sp-export]")?.addEventListener("click", () => this._exportDiscussion());
    const inp = box.querySelector("[data-sp-input]");
    if (inp) {
      /* IMPL-74（74-b）：textarea 自增高（field-sizing 渐进增强，JS fit 兑底） */
      const fitInp = () => { inp.style.height = "auto"; inp.style.height = Math.min(inp.scrollHeight, 96) + "px"; };
      inp.addEventListener("input", fitInp);
      inp.addEventListener("keydown", e => {
        /* IMPL-104：IME 组合期 Enter（keyCode 229）是候选确认不是发送；流式中不清草稿直接忽略 */
        if (e.isComposing || e.keyCode === 229) return;
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (this.ses && this.ses.streaming) return;
          const v = inp.value;
          inp.value = "";
          fitInp();
          this.panelSend(v);
        }
      });
      if (ses.lastTurn === "ask" && !ses.collapsed && !ses.streaming) setTimeout(() => inp.focus(), 80);
    }
    box.querySelector("[data-sp-send]")?.addEventListener("click", () => {
      if (!inp) return;
      if (this.ses && this.ses.streaming) return; /* IMPL-104：流式中守卫在清空之前 */
      const v = inp.value;
      inp.value = "";
      inp.style.height = "";
      this.panelSend(v);
    });
    const bd = box.querySelector(".sp-body");
    if (bd) {
      if (ses.streaming) bd.scrollTop = bd.scrollHeight;
      else if (prevScroll != null && !ses.collapsed) bd.scrollTop = Math.min(prevScroll, bd.scrollHeight);
    }
  },
  _diffWords(a, b) {
    const A = Array.from(String(a || ""));
    const B = Array.from(String(b || ""));
    const n = A.length, m = B.length;
    if (!n) return [{ k: "ins", t: b }];
    if (!m) return [{ k: "del", t: a }];
    if (n * m > 400000) return [{ k: "same", t: b }];
    const dp = [];
    for (let i = 0; i <= n; i++) dp[i] = new Uint16Array(m + 1);
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    const out = [];
    let i = 0, j = 0;
    const push = (k, t) => {
      const last = out[out.length - 1];
      if (last && last.k === k) last.t += t;
      else out.push({ k, t });
    };
    while (i < n && j < m) {
      if (A[i] === B[j]) { push("same", A[i]); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { push("del", A[i]); i++; }
      else { push("ins", B[j]); j++; }
    }
    while (i < n) push("del", A[i++]);
    while (j < m) push("ins", B[j++]);
    return out;
  }
};

const PROMPT_TEMPLATES = {
image: [ {
id: "tpl-portrait",
name: "人像摄影",
category: "人像",
prompt: "专业人像摄影，85mm镜头，浅景深，柔和自然光，皮肤质感细腻，眼神清晰有神，背景虚化自然，商业级人像作品。"
}, {
id: "tpl-portrait-art",
name: "艺术人像",
category: "人像",
prompt: "艺术风格人像，创意光影，情绪表达，氛围感十足，时尚杂志封面质感，高对比度，电影色调。"
}, {
id: "tpl-product-ecom",
name: "电商产品图",
category: "产品",
prompt: "电商产品主图，纯白背景，产品居中，光线均匀，细节清晰，商业广告级质感，高饱和度，无阴影干扰。"
}, {
id: "tpl-product-lux",
name: "奢侈品展示",
category: "产品",
prompt: "奢侈品级产品摄影，高级质感，光线考究，材质纹理清晰，黑色或深色背景，金色点缀，高端大气。"
}, {
id: "tpl-landscape",
name: "风景摄影",
category: "风景",
prompt: "壮丽风景摄影，广角大景，自然光线，色彩饱和，空气感强，黄金时段光线，层次分明，震撼大气。"
}, {
id: "tpl-city-night",
name: "城市夜景",
category: "风景",
prompt: "城市夜景摄影，霓虹灯效，倒影水面，车轨光轨，深蓝天空，赛博朋克氛围，高对比冷暖色调。"
}, {
id: "tpl-food",
name: "美食摄影",
category: "生活",
prompt: "美食摄影，自然光线，餐具精致，食物新鲜诱人，蒸汽腾起，背景简洁，浅景深，暖色调。"
}, {
id: "tpl-interior",
name: "室内设计",
category: "生活",
prompt: "室内设计摄影，空间开阔，光线通透，材质真实，配色和谐，北欧极简风格，高级感十足。"
}, {
id: "tpl-anime",
name: "动漫插画",
category: "艺术",
prompt: "日式动漫插画风格，赛璐璐上色，干净线条，大眼角色，鲜艳色彩，柔和光影，二次元画面感。"
}, {
id: "tpl-oil-paint",
name: "油画风格",
category: "艺术",
prompt: "古典油画风格，厚涂笔触，丰富的色彩层次，光影立体，文艺复兴质感，画布纹理感。"
}, {
id: "tpl-watercolor",
name: "水彩画",
category: "艺术",
prompt: "水彩画风格，透明色彩，晕染效果，纸张纹理，轻盈通透，艺术感强，手绘质感。"
}, {
id: "tpl-3d-render",
name: "3D渲染",
category: "艺术",
prompt: "3D渲染风格，OC渲染器质感，金属反射，玻璃材质，光线追踪，超高细节，电影级视觉效果。"
}, {
id: "tpl-poster-minimal",
name: "极简海报",
category: "设计",
prompt: "极简主义海报设计，大量留白，几何构图，单一主色，无衬线字体，现代感强，瑞士平面设计风格。"
}, {
id: "tpl-poster-bold",
name: "冲击力海报",
category: "设计",
prompt: "高冲击力海报设计，对比强烈，色彩鲜明，动感构图，视觉中心明确，霓虹效果，潮流设计。"
}, {
id: "tpl-logo",
name: "Logo设计",
category: "设计",
prompt: "现代简约Logo设计，矢量风格，几何图形，单色或双色，扁平化，可缩放，品牌识别度高。"
}, {
id: "tpl-avatar",
name: "头像设计",
category: "设计",
prompt: "社交媒体头像，方形构图，人物或角色居中，色彩明亮，风格统一，适合圆形裁剪，辨识度高。"
} ],
video: [ {
id: "tpl-v-cinematic",
name: "电影感运镜",
category: "运镜",
prompt: "电影级运镜，缓慢推进，稳定平滑，景深变化自然，光影层次丰富，35mm胶片质感，叙事感强。"
}, {
id: "tpl-v-drone",
name: "航拍大景",
category: "运镜",
prompt: "无人机航拍视角，俯瞰大景，缓慢上升或平移，壮阔风景，自然光线，纪录片质感，震撼大气。"
}, {
id: "tpl-v-product-rotate",
name: "产品旋转",
category: "运镜",
prompt: "产品360度旋转展示，纯色背景，光线均匀，细节清晰，慢速匀速，商业广告级展示。"
}, {
id: "tpl-v-time-lapse",
name: "延时摄影",
category: "运镜",
prompt: "延时摄影效果，云层快速流动，光影变化，城市车流，时间压缩感，4K高清，稳定画面。"
}, {
id: "tpl-v-push-in",
name: "推镜 Push-in",
category: "动态运镜",
prompt: "匀速向前推进，聚焦画面核心主体，层层聚焦视觉中心，节奏平稳丝滑，强化主体冲击力，电影级稳定无抖动。"
}, {
id: "tpl-v-pull-out",
name: "拉镜 Pull-out",
category: "动态运镜",
prompt: "匀速向后拉远，逐步展现完整场景，从小景别切换全景，开阔大气，舒展叙事氛围，稳定丝滑运镜。"
}, {
id: "tpl-v-pan",
name: "移镜 Pan",
category: "动态运镜",
prompt: "水平左右平移，画面稳定无抖动，平行扫景，完整展示场景横向细节，适合长画幅展陈、文化墙漫游。"
}, {
id: "tpl-v-tilt",
name: "摇镜 Tilt",
category: "动态运镜",
prompt: "垂直上下摇动，从上至下扫景，展示竖向空间层次，适配门头、长廊、竖向装置，稳定无抖动。"
}, {
id: "tpl-v-orbit",
name: "环绕运镜 Orbit",
category: "动态运镜",
prompt: "360°匀速环形环绕，圆心锁定主体，角度均匀旋转，全方位展示立体结构，美陈/装置/门头专属运镜。"
}, {
id: "tpl-v-dolly",
name: "升降运镜 Dolly",
category: "动态运镜",
prompt: "平稳升降移动，高低视角切换，空间层次感丰富，高级电影漫游质感，丝滑无抖动。"
}, {
id: "tpl-v-follow",
name: "跟随运镜 Follow",
category: "动态运镜",
prompt: "定点跟随主体，镜头稳定追踪，动线丝滑流畅，无偏移抖动，沉浸式跟随视角。"
}, {
id: "tpl-v-through",
name: "穿梭运镜 Through",
category: "动态运镜",
prompt: "镜头穿透空间，穿过门框/格栅/间隙，沉浸式纵深视觉，氛围感极强，第一视角穿梭感。"
}, {
id: "tpl-v-quick-push",
name: "急推急拉",
category: "动态运镜",
prompt: "快慢节奏对比，卡点运镜，动态张力拉满，适合节日、潮流视觉短片，节奏感强烈。"
}, {
id: "tpl-v-static",
name: "静止定镜",
category: "动态运镜",
prompt: "机位固定，绝对稳定，无抖动无位移，静态高级质感，适合细节展示、封面定格，克制美学。"
}, {
id: "tpl-v-hard-cut",
name: "硬切转场",
category: "转场",
prompt: "无缝硬切转场，节奏干脆，画面干净，高级极简，商业短片首选转场方式。"
}, {
id: "tpl-v-fade",
name: "淡入淡出",
category: "转场",
prompt: "透明渐变过渡，柔和自然，舒缓叙事，适配国风、政务、文艺类视频，干净高级不廉价。"
}, {
id: "tpl-v-dissolve",
name: "叠化转场",
category: "转场",
prompt: "画面重叠融合，虚实过渡，氛围感朦胧，适合意境、景观、文旅视觉，柔和高级。"
}, {
id: "tpl-v-push-trans",
name: "推拉转场",
category: "转场",
prompt: "画面整体平移推拉，无缝衔接场景，动态流畅，空间漫游专用转场，丝滑过渡。"
}, {
id: "tpl-v-blur-trans",
name: "模糊转场",
category: "转场",
prompt: "高斯模糊渐变，虚实切换，高级柔和，无廉价特效，电影级景深过渡。"
}, {
id: "tpl-v-flash-white",
name: "闪白转场",
category: "转场",
prompt: "高光闪白过渡，干净通透，潮流高级，适配商业、节日、潮流设计，光感自然不刺眼。"
}, {
id: "tpl-v-focus-trans",
name: "景深切换",
category: "转场",
prompt: "焦点虚实切换，聚焦/失焦过渡，电影级高级转场，景深变化自然丝滑。"
}, {
id: "tpl-v-zoom-trans",
name: "缩放转场",
category: "转场",
prompt: "中心缩放开合，卡点舒适，动态张力十足，节奏感强，商业短片专用。"
}, {
id: "tpl-v-dolly-zoom",
name: "希区柯克变焦",
category: "大师运镜",
prompt: "经典Dolly Zoom运镜，机位前后移动配合镜头反向变焦，主体大小不变背景极速拉伸压缩，空间扭曲悬浮感，视觉冲击极强，情绪张力拉满，悬疑/恐怖氛围。"
}, {
id: "tpl-v-bay-orbit",
name: "迈克尔·贝环绕",
category: "大师运镜",
prompt: "高速丝滑环形环绕，轻微低角度仰拍，镜头带微小动态呼吸抖动，光影随环绕角度流转，画面张力炸裂，史诗商业大片质感，通透高对比画质。"
}, {
id: "tpl-v-nolan-static",
name: "诺兰静态叙事",
category: "大师运镜",
prompt: "绝对定机位静止镜头，零抖动，超长留白叙事，光影细腻柔和，画面极致干净，克制高级，深沉氛围感，适合高端政务/科技/文艺大片。"
}, {
id: "tpl-v-wes-anderson",
name: "韦斯·安德森对称",
category: "大师运镜",
prompt: "绝对中心对称构图，水平极致平稳平移，画面规整治愈，色彩均匀干净，构图强迫症美学，极简高级叙事感。"
}, {
id: "tpl-v-pta-shallow",
name: "PTA景深运镜",
category: "大师运镜",
prompt: "极浅景深，焦点精准锁定主体，前后景自然虚化流淌，镜头慢速微移，氛围感慵懒高级，电影胶片质感。"
}, {
id: "tpl-v-epic-push",
name: "史诗推进",
category: "大师运镜",
prompt: "超丝滑匀速长焦推进，无抖动，层层聚焦核心主体，背景逐步弱化，宏大叙事感，适配展厅全景、建筑门头、景观大片。"
}, {
id: "tpl-v-cine-through",
name: "沉浸式穿梭",
category: "大师运镜",
prompt: "低机位贴地穿梭，穿透式运镜，穿过缝隙/立柱/门框，纵深空间拉满，沉浸式第一视角，短视频爆款镜头。"
}, {
id: "tpl-v-cinema-breathe",
name: "呼吸微动",
category: "大师运镜",
prompt: "机位轻微上下浮动，微小左右晃动，模拟真人手持拍摄质感，杜绝死板固定，画面灵动自然，真实电影纪实感。"
}, {
id: "tpl-v-formula",
name: "万能组合公式",
category: "组合公式",
prompt: "24mm广角、f/8深景深、匀速向前推镜、淡入淡出转场、电影级柔光、8K超清、丝滑稳定运镜、无抖动畸变。"
}, {
id: "tpl-v-character",
name: "角色动画",
category: "动画",
prompt: "3D角色动画，表情生动，动作流畅，骨骼绑定自然，材质真实，光线考究，皮克斯风格。"
}, {
id: "tpl-v-2d-anim",
name: "2D动画",
category: "动画",
prompt: "2D动画风格，帧动画质感，鲜艳色彩，流畅动作，日式动画风格，赛璐璐上色，干净线条。"
}, {
id: "tpl-v-music-visual",
name: "音乐可视化",
category: "动画",
prompt: "音乐可视化效果，节奏感强，粒子动效，色彩随节拍变化，抽象艺术，VJ视觉，电子音乐风格。"
}, {
id: "tpl-v-nature",
name: "自然风光",
category: "场景",
prompt: "自然风光延时，日出日落，四季变化，动物迁徙，瀑布流水，BBC纪录片质感，色彩饱和。"
}, {
id: "tpl-v-city-life",
name: "城市生活",
category: "场景",
prompt: "城市生活纪实，街道人流，咖啡厅氛围，地铁通勤，霓虹夜景，生活感十足，电影色调。"
}, {
id: "tpl-v-sci-fi",
name: "科幻场景",
category: "场景",
prompt: "科幻场景，未来城市，飞行器，全息投影，机械质感，赛博朋克氛围，高科技感，蓝紫色调。"
} ],
audio: []
};

const $ = (s, r = document) => r.querySelector(s);

const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
/* ★ R79-B：离开页面 / 切后台时立即推送。此前只有 30 秒定时器（期间再生成会重置），
   关页面根本不推 ⇒ 「生完就关」= 从未同步。 */
var _r79FlushHistory = function () {
try {
if (typeof Store === "undefined" || !Store.getSync()) return;
var c = null;
try {
if (typeof TaskCenter !== "undefined" && TaskCenter.isAvailable()) {
c = { base: TaskCenter.workerUrl, token: TaskCenter.token };
} else {
var u = (Store.getR2WorkerUrl() || "").trim().replace(/\/$/, "");
var t = (Store.getR2AuthToken() || "").trim();
if (u && t) c = { base: u, token: t };
}
} catch (_e) { c = null; }
if (!c) return;
var list = (Store.getHistory() || []).filter(function (h) {
return String((h && h.result && h.result.url) || "").indexOf("blob:") !== 0;
}).slice(0, 500);
var body = JSON.stringify(list);
var url = c.base + "/userdata?key=history&token=" + encodeURIComponent(c.token);
if (navigator.sendBeacon) {
/* sendBeacon 只能 POST、不能带自定义头 ⇒ 用 text/plain 避开预检；Worker 侧已加 POST 支持（R79-D） */
navigator.sendBeacon(url, new Blob([body], { type: "text/plain" }));
} else {
fetch(url, { method: "PUT", keepalive: true, headers: { "Content-Type": "application/json" }, body: body });
}
/* ★ R80-D2：sendBeacon 这条路也把墓碑送上去 */
try {
var _tb2 = (window.__r80Tomb ? window.__r80Tomb.load() : []);
if (_tb2.length && navigator.sendBeacon) {
navigator.sendBeacon(c.base + "/userdata?key=historytomb&token=" + encodeURIComponent(c.token), new Blob([JSON.stringify(_tb2)], { type: "text/plain" }));
}
} catch (_e) {}
try { localStorage.setItem("sc_hist_push_at", String(Date.now())); } catch (_e) {}
} catch (_e) {}
};
/* 挂到 window —— 便于诊断，也让验收脚本能直接验证这段逻辑 */
window.__r79FlushHistory = _r79FlushHistory;

/* ══ R86 视频转存调度器（模块源码见 studio/_r86_archive.js）══ */
/* ══════════════════════════════════════════════════════════════════════════════
   R86 · 视频结果转存调度器 —— 「不点开不抢带宽」
   ──────────────────────────────────────────────────────────────────────────────
   修：「要转存到 R2，但不点开则只显示缩略图，因为视频可能比较大，加载转存可能都影响网速」

   改造前的两条浪费（都能静态证明）：
     ① `_preloadResult` 对**所有**结果做全量 `fetch(url)` 存进 `_preloadCache` ——
        而那个缓存只服务「原图预览秒开」，对视频毫无意义（列表/历史用的是缩略图）
     ② `_preloadResult` 尾部**立即** `_archiveResult(task)` ⇒ 又一次全量 fetch + 上传 R2
     ⇒ 生成一个视频 = **当场下载两遍 + 上传一遍**，而且全在用户正用页面的那一刻

   改造后：
     · 视频**不进** `_preloadCache`，也不在生成完成时立即转存
     · 改由本调度器**页面空闲时**启动（`requestIdleCallback`，退化 `setTimeout` 3s）
     · **单并发串行** + 两次之间至少间隔 1.5s ⇒ 永远只有一条视频在占带宽
     · 用户**点开**某个视频（进单视图 / 全屏）⇒ 它**插队**到队首（那时本来也要下载）
     · 状态经 `stateOf()` 暴露：`done / running / queued / idle`，结果条据此显示角标
   ⚠ 本模块位于主块顶层、而 `UI` / `Store` 的声明都在它**之后** ⇒ 一律**只在回调里**访问它们。
     铁规矩 84：`typeof X` 对 TDZ 中的 const/class 会抛 ReferenceError（只对"未声明变量"安全），
     所以**不能**拿 `typeof UI === "undefined"` 当守门 —— 这里靠"只延迟访问"来规避。
   ══════════════════════════════════════════════════════════════════════════════ */
window.__r86Archive = (function () {
  var q = [];              /* [{ id, task }] —— 待转存队列，队首优先 */
  var curId = null;        /* 正在转存的 task id（null = 空闲） */
  var lastAt = 0;          /* 上次转存结束时刻（用于让路间隔） */
  var pumpScheduled = false;
  var listeners = [];
  var GAP = 1500;          /* 两次转存之间的最小间隔：给用户自己的操作让路 */
  var IDLE_TIMEOUT = 4000; /* requestIdleCallback 最长等待，超时也启动 */

  function fire() {
    for (var i = 0; i < listeners.length; i++) { try { listeners[i](); } catch (e) {} }
  }
  function isVideo(t) { return !!(t && t.model && t.model.type === "video"); }

  /* ── 已经躺在 R2 上（或本就来自 R2）⇒ 无需再转 ── */
  function isArchived(t) {
    try {
      var r = (t && t.result) || {};
      if (r.originalUrl) return true;                 /* applyArchived 留下的标记 */
      var u = String(r.url || "");
      if (!u) return true;
      if (/\.r2\.dev\//.test(u)) return true;
      var w = "";
      try {
        w = (typeof TaskCenter !== "undefined" && TaskCenter.isAvailable())
          ? String(TaskCenter.workerUrl || "")
          : String(Store.getR2WorkerUrl() || "");
      } catch (e0) { w = ""; }
      w = w.trim().replace(/\/$/, "");
      if (w && u.indexOf(w) === 0) return true;
      return false;
    } catch (e) { return true; }   /* 判不出来就当已转存，别乱下载 */
  }

  /* done / running / queued / idle / na（非视频） */
  function stateOf(t) {
    try {
      if (!isVideo(t)) return "na";
      if (isArchived(t)) return "done";
      if (curId && t.id && curId === t.id) return "running";
      for (var i = 0; i < q.length; i++) if (q[i].id === t.id) return "queued";
      return "idle";
    } catch (e) { return "na"; }
  }

  /* ── 空闲启动：优先 requestIdleCallback（超时兜底），否则退化为 setTimeout ── */
  function idle(fn) {
    try {
      if (window.requestIdleCallback) return window.requestIdleCallback(fn, { timeout: IDLE_TIMEOUT });
    } catch (e) {}
    return setTimeout(fn, 3000);
  }
  function schedulePump() {
    if (pumpScheduled) return;
    pumpScheduled = true;
    idle(function () { pumpScheduled = false; pump(); });
  }

  function pump() {
    if (curId) return;   /* 单并发闸门②：已在跑就不开第二条
                            ⚠ 「单并发」是**三重保证**，抓红实测过：只破这一道仍然串行 ——
                              ① `schedulePump` 的 `pumpScheduled` 保证同一时刻只有一个 idle 回调在排队；
                              ② 本行；
                              ③ 跑完后的 GAP 让路间隔。
                            构造并发坏例时必须三处一起破，否则坏例失效（= 假抓红，铁规矩 88）。 */
    if (!q.length) return;
    var gap = GAP - (Date.now() - lastAt);
    if (gap > 0) { setTimeout(schedulePump, gap); return; }   /* 让路间隔没到，稍后再来 */
    var item = q.shift();
    curId = item.id;
    fire();
    var finish = function () {
      curId = null;
      lastAt = Date.now();
      fire();
      if (q.length) schedulePump();
    };
    try {
      var p = UI._archiveResult(item.task);   /* ★ 只在回调里访问 UI（见文件头 TDZ 说明） */
      if (p && typeof p.then === "function") { p.then(finish, finish); } else { finish(); }
    } catch (e) { finish(); }
  }

  /* 入队（生成完成时调用）—— 幂等，已归档/已在队里都会直接返回 */
  function schedule(task) {
    try {
      if (!isVideo(task) || isArchived(task)) return false;
      for (var i = 0; i < q.length; i++) if (q[i].id === task.id) return false;
      q.push({ id: task.id, task: task });
      fire();
      schedulePump();
      return true;
    } catch (e) { return false; }
  }

  /* 插队（用户点开时调用）—— 不在队里就现加，并清掉让路间隔（点开时本来就要下载） */
  function open(task) {
    try {
      if (!isVideo(task) || isArchived(task)) return false;
      var found = false;
      for (var i = 0; i < q.length; i++) {
        if (q[i].id === task.id) { q.unshift(q.splice(i, 1)[0]); found = true; break; }
      }
      if (!found) q.unshift({ id: task.id, task: task });
      lastAt = 0;
      fire();
      schedulePump();
      return true;
    } catch (e) { return false; }
  }

  return {
    schedule: schedule,
    open: open,
    stateOf: stateOf,
    isArchived: isArchived,
    notify: fire,
    onChange: function (fn) { try { listeners.push(fn); } catch (e) {} },
    /* 诊断用（验收脚本读它） */
    _debug: function () { return { queued: q.length, curId: curId, lastAt: lastAt }; }
  };
})();

/* ══ R84 本地工作目录（模块源码见 studio/_r84_local.js）══ */
/* ══════════════════════════════════════════════════════════════════════════════
   R84 · 本地工作目录（File System Access API）
   ──────────────────────────────────────────────────────────────────────────────
   修：「网站和本地路径绑定…我把本地路径改成同步盘 以后是不是都是秒加载」
       「本地带宽可以忽略了，本来也是要加载到缓存里的」

   设计（本地 = 热点缓存 · R2 = 权威副本）：
     · 授权：用户选一次目录 → 句柄存 **原生 IndexedDB**（不用 Dexie —— 它走 CDN，国内慢时会拖垮这个功能）
     · 写入：结果**转存 R2 成功之后**用「R2 返回地址的文件名」写本地（见 R91-B）
     · 读取：`hydrate()` 把 DOM 里的 http 图片/视频换成本地 blob: ⇒ 本会话内秒开
     · 降级：非 Chromium / 未授权 / 目录被移动 ⇒ **回落**现有链路，不报错

   ⚠ 三条边界（浏览器限制，非偷懒）：
     ① 仅 Chromium 系桌面版有 `showDirectoryPicker`（手机 / Firefox / Safari 没有）
     ② 授权需要用户手势；刷新后句柄还在，但**权限会退回 prompt** ⇒ 需再点一次（见 R91-C）
     ③ 不能静默写 —— 所以第一次必须由用户点按钮

   ══════════════════════════════════════════════════════════════════════════════
   R91-B/C · 修「选了目录但结果没出现在文件夹里」（两条独立缺陷，都能静态证明）

     ① 文件名非法：旧代码用 `${modelName}_${time}_${ratio}.png` 作本地文件名，
        而 `ratio` 长这样 —— **"21:9"**。冒号是 Windows 保留字符（`\ / : * ? " < > |`），
        `getFileHandle()` 直接抛错 ⇒ 整个写入静默失败（调用方没 await、catch 只记 S.error）。
        ⚠ 打桩测试为什么没抓到：假句柄不校验文件名合法性 —— **替身比真货宽容**（铁规矩 87 的变体）。

     ② 读写用了两套命名，永不匹配：写入用 `fileName`（本地命名规则），
        读取 `hydrate()` 却用 `nameOf(url)` = **URL 尾段**（R2 命名规则）。
        而 R2 的对象名是 Worker 自己生成的 `1791385704-r2_eb4483d7ce732b1c.png`
        ⇒ 即使写成功，hydrate 也永远命中不了。
        ⇒ 现在写入点移到拿到 R2 地址之后，**文件名 = nameOf(url) 的返回值**，读写同一套规则。

     ③ 权限：刷新后 `queryPermission` 回到 prompt，写入抛 NotAllowedError 且**无任何提示**
        ⇒ 表现为"功能静默失效"。现在：点顶栏文件夹图标即可**一键重新授权**（不重选目录）；
        写入失败会提示一次。
   ══════════════════════════════════════════════════════════════════════════════ */
(function () {
  var DB = 'w5local', STORE = 'kv', KEY = 'dir', ALIAS_KEY = 'alias';
  var S = { handle: null, map: {}, alias: {}, ready: false, needGesture: false, error: '', count: 0 };
  var warned = {};

  function idb() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open(DB, 1);
      r.onupgradeneeded = function () { try { r.result.createObjectStore(STORE); } catch (e) {} };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function kvGet(k) {
    return idb().then(function (d) {
      return new Promise(function (res) {
        var t = d.transaction(STORE, 'readonly').objectStore(STORE).get(k);
        t.onsuccess = function () { res(t.result); };
        t.onerror = function () { res(null); };
      });
    }).catch(function () { return null; });
  }
  function kvSet(k, v) {
    return idb().then(function (d) {
      return new Promise(function (res) {
        var t = d.transaction(STORE, 'readwrite').objectStore(STORE).put(v, k);
        t.onsuccess = function () { res(true); };
        t.onerror = function () { res(false); };
      });
    }).catch(function () { return false; });
  }

  function supported() { return typeof window.showDirectoryPicker === 'function'; }

  /* ★ R91-B①：文件名消毒 —— Windows 保留字符 / 控制字符 / 结尾点与空格全部换掉。
     （冒号是实测踩到的那个：比例 "21:9"） */
  function sanitize(name) {
    var n = String(name || '');
    n = n.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-');   /* 非法字符 → - */
    n = n.replace(/\s+/g, ' ').trim();
    n = n.replace(/^\.+/, '').replace(/[. ]+$/, '');    /* 首尾不能是点/空格 */
    var dot = n.lastIndexOf('.');
    var base = dot > 0 ? n.slice(0, dot) : n;
    var ext = dot > 0 ? n.slice(dot) : '';
    if (!base) base = 'file';
    /* Windows 设备名（CON/PRN/…）即使带扩展名也不合法 */
    if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(base)) base = '_' + base;
    if (base.length > 150) base = base.slice(0, 150);
    return base + ext;
  }

  /* 从 URL 取文件名（R2 key 最后一段）；取不到或不像媒体名 ⇒ 返回空串
     ⚠ 也认「代理式地址」（`…?url=<编码后的原链>`，如 weserv）—— 用查询参数承载原链的形态
       如果只按 '/' 切尾段会得到空串，hydrate 就永远匹配不上（这类"新形态静默穿透字符串判据"
       的坑本项目踩过多次）。反解出内层链再取尾段，两种形态同一套命名。 */
  function nameOf(u) {
    try {
      var s = String(u || '');
      var q = /[?&]url=([^&#]+)/.exec(s);
      if (q) {
        var inner = decodeURIComponent(q[1]);
        if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(inner)) inner = 'https://' + inner;
        var t = inner.split('#')[0];
        var seg1 = decodeURIComponent(t.split('/').pop() || '');
        if (/\.(png|jpe?g|webp|gif|mp4|webm|mov|mp3|wav)$/i.test(seg1)) return sanitize(seg1);
      }
      var plain = s.split('?')[0].split('#')[0];
      var seg = decodeURIComponent(plain.split('/').pop() || '');
      if (!/\.(png|jpe?g|webp|gif|mp4|webm|mov|mp3|wav)$/i.test(seg)) return '';
      return sanitize(seg);
    } catch (e) { return ''; }
  }

  async function buildMap() {
    if (!S.handle) return 0;
    var m = {};
    try {
      for await (var ent of S.handle.values()) {
        if (ent.kind === 'file') m[ent.name] = ent;
      }
      S.map = m;
      S.count = Object.keys(m).length;
      S.ready = true;
    } catch (e) { S.error = String(e).slice(0, 80); }
    return S.count;
  }

  /* ★ R92-C：别名索引 —— 本地文件名现在写成**可读**的（时间_模型_比例_清晰度_短id），
     不再是 R2 那种 `1791385704-r2_xxx.png`。但 hydrate() 只能从 URL 尾段反推名字，
     两边就对不上了 ⇒ 存一张 `URL尾段 → 本地文件名` 的映射表，hydrate 先查它。
     兼容旧文件：查不到别名就按原名找（= R91 写下的那些）。 */
  async function loadAlias() {
    var a = await kvGet(ALIAS_KEY);
    S.alias = (a && typeof a === 'object' && !Array.isArray(a)) ? a : {};
    return S.alias;
  }
  function saveAlias() { kvSet(ALIAS_KEY, S.alias); }

  function warnOnce(key, msg) {
    if (warned[key]) return;
    warned[key] = 1;
    try { if (window.Toast && Toast.warning) Toast.warning(msg, 8000); } catch (e) {}
  }

  async function pick() {
    if (!supported()) return { ok: false, msg: '此浏览器不支持本地目录（需 Chrome / Edge 桌面版）' };
    /* ★ R91-C：已绑定过 ⇒ 先试**在原句柄上重新授权**（点击自带手势）。
       刷新后权限退回 prompt，这里一键恢复，不用重新选目录。 */
    if (S.handle) {
      try {
        var p0 = await S.handle.requestPermission({ mode: 'readwrite' });
        if (p0 === 'granted') {
          S.needGesture = false;
          var n0 = await buildMap();
          await loadAlias();
          return { ok: true, msg: '已恢复本地目录「' + S.handle.name + '」· ' + n0 + ' 个文件' };
        }
      } catch (e) {}
    }
    try {
      var h = await window.showDirectoryPicker({ id: 'w5-work', mode: 'readwrite' });
      var perm = await h.requestPermission({ mode: 'readwrite' });
      if (perm !== 'granted') return { ok: false, msg: '未获得读写权限' };
      S.handle = h; S.needGesture = false;
      await kvSet(KEY, h);
      var n = await buildMap();
      await loadAlias();
      return { ok: true, msg: '已绑定「' + h.name + '」· 目录内已有 ' + n + ' 个文件' };
    } catch (e) {
      if (String(e && e.name) === 'AbortError') return { ok: false, msg: '已取消' };
      return { ok: false, msg: String((e && e.message) || e).slice(0, 110) };
    }
  }

  /* 启动时尝试恢复（不需要手势的那一半）；权限退回 prompt ⇒ 标记 needGesture（不打扰） */
  async function restore() {
    if (!supported()) return false;
    var h = await kvGet(KEY);
    if (!h) return false;
    try {
      var p = await h.queryPermission({ mode: 'readwrite' });
      S.handle = h;
      if (p !== 'granted') { S.needGesture = true; S.ready = false; return false; }
      S.needGesture = false;
      await buildMap();
      await loadAlias();
      return true;
    } catch (e) { return false; }
  }

  /* ★ 写入：blob 已在手（转存 R2 成功那一刻），这里零额外网络。
     name  = **可读文件名**（时间_模型_比例_清晰度_短id），同名 ⇒ 覆盖 ⇒ **同一结果只会有一个文件**。
     alias = URL 尾段（R2 对象名），写给 hydrate() 查表用 —— 这是「可读名」与「能命中」能同时成立的关键。
     ⚠ 旧签名的第三个参数不存在时退化为 R91 行为（name 即 URL 尾段），向后兼容。 */
  async function save(name, blob, alias) {
    if (!S.handle || !name || !blob) return false;
    if (S.needGesture) {
      warnOnce('perm', '本地目录权限已过期 —— 点顶栏的文件夹图标即可恢复（不用重新选目录）');
      return false;
    }
    try {
      var safe = sanitize(name);
      var fh = await S.handle.getFileHandle(safe, { create: true });
      var w = await fh.createWritable();
      await w.write(blob);
      await w.close();
      S.map[safe] = fh;
      S.count = Object.keys(S.map).length;
      if (alias) { S.alias[alias] = safe; saveAlias(); }
      S.error = '';
      return true;
    } catch (e) {
      S.error = String((e && e.name) || e).slice(0, 80) + ':' + String((e && e.message) || '').slice(0, 60);
      if (String(e && e.name) === 'NotAllowedError') {
        S.needGesture = true;
        warnOnce('perm', '本地目录权限已过期 —— 点顶栏的文件夹图标即可恢复（不用重新选目录）');
      } else {
        warnOnce('other', '写入本地目录失败：' + S.error);
      }
      return false;
    }
  }

  /* 把 DOM 里能命中本地的 http 图片/视频换成 blob:（本会话秒开）
     ⚠ 并发策略：只跑一个实例，但**排队**而不是丢弃 —— 早期版本 busy 时直接 return 0，
       而 MutationObserver 的防抖调用很可能正在跑（页面一直在渲染），
       于是"新渲染出来的图"这次就被漏掉了。第一版实测命中 0 处就是这么来的。 */
  var busy = false, pending = false;
  async function hydrate() {
    if (!S.ready) return 0;
    if (busy) { pending = true; return 0; }
    busy = true;
    var hit = 0;
    try {
      var els = document.querySelectorAll('img[src^="http"], video[src^="http"]');
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.dataset && el.dataset.w5local === '1') continue;
        var n = nameOf(el.getAttribute('src') || '');
        if (!n) continue;
        /* ★ R92-C：先查别名表（可读文件名 ↔ URL 尾段），查不到就按原名找（兼容 R91 写的旧文件） */
        var ln = (S.alias && S.alias[n]) || n;
        if (!S.map[ln]) continue;
        try {
          var f = await S.map[ln].getFile();
          el.src = URL.createObjectURL(f);
          if (el.dataset) el.dataset.w5local = '1';
          hit++;
        } catch (e) {}
      }
    } finally {
      busy = false;
      if (pending) { pending = false; setTimeout(function () { try { hydrate(); } catch (e) {} }, 0); }
    }
    return hit;
  }

  async function forget() {
    S.handle = null; S.map = {}; S.ready = false; S.count = 0; S.needGesture = false;
    await kvSet(KEY, null);
    return true;
  }

  window.__r84Local = {
    S: S, supported: supported, nameOf: nameOf, sanitize: sanitize, pick: pick, restore: restore,
    save: save, buildMap: buildMap, hydrate: hydrate, forget: forget,
    status: function () { return { supported: supported(), ready: S.ready, count: S.count,
                                   name: S.handle ? S.handle.name : '', needGesture: S.needGesture,
                                   error: S.error }; }
  };
})();

(function () {
  var L = window.__r84Local; if (!L) return;
  /* 顶部按钮排插一个入口（复用既有 .icon-btn 样式，零 HTML 改动） */
  function mountBtn() {
    if (document.getElementById("r84LocalBtn")) return;
    var anchor = document.getElementById("themeToggleBtn");
    if (!anchor || !anchor.parentElement) return;
    var b = document.createElement("button");
    b.className = anchor.className;
    b.id = "r84LocalBtn";
    b.title = "本地工作目录";
    b.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
    b.addEventListener("click", async function () {
      if (!L.supported()) { try { Toast.warning("此浏览器不支持本地目录（需 Chrome / Edge 桌面版）"); } catch (e) {} return; }
      var r = await L.pick();
      if (r.ok) { try { Toast.success(r.msg); } catch (e) {} try { L.hydrate(); } catch (e) {} }
      else { try { Toast.warning(r.msg); } catch (e) {} }
    });
    anchor.parentElement.appendChild(b);
  }
  try { mountBtn(); setTimeout(mountBtn, 1500); } catch (e) {}
  /* 启动恢复（无需手势的那一半）；权限需重授时只标记，不打扰） */
  try { L.restore().then(function (ok) { if (ok) L.hydrate(); }); } catch (e) {}
  /* 渲染后自动 hydrate（防抖） */
  try {
    var t = null;
    new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(function () { try { L.hydrate(); } catch (e) {} }, 400);
    }).observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
})();

/* ★ R80-D：墓碑 —— 「本地删掉的历史」要能真的从云端消失。
   实现用**推送快照对比**：每次推送时记住这次推上去的 id 列表，下次推送比一比，少掉的就是被删的。
   为什么不包装 Store 的删除方法（第一版做法，失败）：本段代码位于 Store 声明之前，
   此刻访问 `typeof Store` 对 TDZ 中的 const/class **会抛 ReferenceError**（typeof 只对"未声明的变量"安全），
   整段被 catch 吞掉；就算把包装延迟到 setTimeout，也还依赖「方法确实挂在 Store 实例上」
   （实测 deleteHistory 就不在，只有 clearHistory / deleteHistoryMany 在）。快照法不碰 Store 内部，稳得多。 */
window.__r80Tomb = (function () {
var KEY = "sc_hist_tomb";
var SNAP = "sc_hist_snap";
var read = function (k, d) { try { var a = JSON.parse(localStorage.getItem(k) || "null"); return a == null ? d : a; } catch (e) { return d; } };
var write = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
var load = function () { var a = read(KEY, []); return Array.isArray(a) ? a : []; };
var add = function (ids) {
try {
var m = {};
load().forEach(function (x) { var id = (x && x.id) || x; if (id) m[String(id)] = { id: String(id), at: (x && x.at) || Date.now() }; });
(ids || []).forEach(function (id) { if (id) m[String(id)] = { id: String(id), at: Date.now() }; });
write(KEY, Object.keys(m).map(function (k) { return m[k]; }));
} catch (e) {}
};
/* 用本次推送的 id 列表刷新墓碑：与上次快照比，少掉的即被删 */
var sync = function (currentIds) {
try {
var prev = read(SNAP, null);
write(SNAP, currentIds || []);
if (!Array.isArray(prev)) return;
var now = {};
(currentIds || []).forEach(function (id) { now[String(id)] = 1; });
var gone = prev.filter(function (id) { return !now[String(id)]; });
if (gone.length) add(gone);
} catch (e) {}
};
return { load: load, add: add, sync: sync };
})();

/* ★ R80-C1/C2：输入框自动聚焦（仅鼠标设备）+ 有草稿时离开提醒。
   · 聚焦只在 `pointer:fine` 时做 —— 触摸设备突然弹键盘是灾难。
   · 用轮询而不是 DOMContentLoaded：输入框是懒渲染的，早于它就 focus 会落空。 */
try {
(function () {
var PROMPT_SEL = ".prompt-module textarea, .param-group textarea, [data-key=\"prompt\"], [data-key=\"text\"]";
var fine = true;
try { fine = !(window.matchMedia && matchMedia("(pointer:coarse)").matches); } catch (e) {}
if (fine) {
var tries = 0;
var t = setInterval(function () {
tries++;
var el = document.querySelector(PROMPT_SEL);
if (el && el.offsetParent !== null) {
clearInterval(t);
try { el.focus({ preventScroll: true }); } catch (e) { try { el.focus(); } catch (e2) {} }
} else if (tries > 25) { clearInterval(t); }
}, 200);
}
window.addEventListener("beforeunload", function (e) {
try {
var el = document.querySelector(PROMPT_SEL);
if (!el) return;
var v = el.value != null ? el.value : el.textContent;
if (v && v.trim().length > 0) { e.preventDefault(); e.returnValue = ""; }
} catch (err) {}
});
})();
} catch (e) {}
try {
window.addEventListener("pagehide", _r79FlushHistory);
document.addEventListener("visibilitychange", function () {
if (document.visibilityState === "hidden") _r79FlushHistory();
});
} catch (_e) {}

const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({
"&": "&amp;",
"<": "&lt;",
">": "&gt;",
'"': "&quot;",
"'": "&#39;"
}[m]));

const fmtTime = ts => {
if (!ts) return "";
const d = new Date(ts);
const p = n => String(n).padStart(2, "0");
return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const fmtDur = ms => {
const s = Math.floor(ms / 1e3);
const m = Math.floor(s / 60);
return `${m}:${String(s % 60).padStart(2, "0")}`;
};

const trunc = (s, n = 60) => s && s.length > n ? s.slice(0, n) + "…" : s || "";

const prefersReducedMotion = () => {
try {
return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
} catch {
return false;
}
};

const genId = () => "t_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const typeName = t => t === "image" ? "图片" : t === "video" ? "视频" : "音频";

const isFrameKey = k => [ "first_frame", "last_frame", "firstFrameUrl", "lastFrameUrl" ].includes(String(k));

function storageGet(key, fallback = "") {
try {
const v = localStorage.getItem(key);
return v == null ? fallback : v;
} catch {
return fallback;
}
}

function storageSet(key, value) {
try {
localStorage.setItem(key, value);
return true;
} catch (e) {
Toast.error("本地存储已满，请清理历史记录");
return false;
}
}

function storageGetJSON(key, fallback) {
const raw = storageGet(key, null);
if (raw == null) return fallback;
try {
const v = JSON.parse(raw);
return v;
} catch {
try {
localStorage.removeItem(key);
} catch {}
return fallback;
}
}

function _debounce(fn, ms = 120) {
let t;
return function(...a) {
clearTimeout(t);
t = setTimeout(() => fn.apply(this, a), ms);
};
}

function sessionGet(key, fallback = "") {
try {
const v = sessionStorage.getItem(key);
return v == null ? fallback : v;
} catch {
return fallback;
}
}

async function copy(text) {
if (!text) return false;
try {
if (navigator.clipboard?.writeText) {
await navigator.clipboard.writeText(String(text));
return true;
}
} catch {}
try {
const ta = document.createElement("textarea");
ta.value = String(text);
ta.setAttribute("readonly", "");
ta.style.position = "fixed";
ta.style.top = "0";
ta.style.left = "-9999px";
ta.style.opacity = "0.01";
document.body.appendChild(ta);
ta.focus();
ta.select();
try { ta.setSelectionRange(0, ta.value.length); } catch (_e88) {}
const ok = document.execCommand("copy");
/* ★ R88-b：只采信「选中范围确实覆盖全文」的情况 —— execCommand 返回 true 不代表真写进去了 */
const _selLen88 = (function () { try { return String(window.getSelection() || "").length; } catch (_e88) { return 0; } })();
ta.remove();
if (ok && _selLen88 >= String(text).length) return true;
return false;
} catch {
return false;
}
}

/* ── IMPL-104（X-1）：安全 URL——仅放行 http(s)/data:image/blob，阻断 javascript:/vbscript: 经导入数据进入 href ── */
function safeUrl(u) {
const s = String(u || "").trim();
if (/^https?:\/\//i.test(s)) return s;
if (/^data:image\/(png|jpe?g|webp|gif|bmp|avif);/i.test(s)) return s;
if (/^blob:/i.test(s)) return s;
return "#";
}
/* ★ R5：美元→人民币汇率（修 2026-10-01 明确 **1 USD = 7 CNY**）。
   ★ 设计：**APIYI 的费率表内部一律存美元**（跟上游口径一致、汇率变了不改表），
     只在**本函数出口**乘这一次 —— 全仓唯一一处 ×7。 */
var USD_CNY = 7;

function calcEstimate(model, body) {
if (!model.billing) return null;
const b = model.billing;
/* IMPL-96②：free 型 = 官方 0 元（Kolors / TeleSpeech-ASR） */
if (b.type === "free") return {
amount: 0,
label: "免费"
};
/* ★ R5：按 Token 计费（APIYI 的 gpt-image 系走这条 —— 上游按 token 收费，成本随用量浮动）
   ⚠⚠ **没有用量就返回 amount:null、不给数** —— 宁可标"按 Token"，也**不编一个看起来精确的数字**。
      （这是本项目对"钱"的一贯口径：可以估，但不许假装精确。） */
if (b.type === "perToken") {
/* ★ R19 补边（2026-10-01 16:xx · 真机桩测 ④b 当场抓到）：**null 与 undefined 必须同义**（都 = 没有用量）。
   陷阱：Number(null) === 0（**不是 NaN**）⇒ 旧写法把"没回收到用量"误判成"0 个 token"
   ⇒ 算出 0 元 ⇒ 报「≈0.00 元」—— 一条**看起来像免费**的假账，比不报还糟。
   （R5 的位图路径因传的是 undefined 而侥幸没踩到；R19 的技能路径传 null，当场现形。） */
var _it = (body.inTokens == null) ? NaN : Number(body.inTokens), _ot = (body.outTokens == null) ? NaN : Number(body.outTokens);
var _has = (Number.isFinite(_it) && _it >= 0) || (Number.isFinite(_ot) && _ot >= 0);
if (!_has) return {
amount: null,
label: "按 Token（本次未回收用量）"
};
/* 费率缺失/为 0 时给 null，不给 0 元 —— 0 元是"免费"的意思，会误导 */
var _in = Number.isFinite(b.inUsdPerM) ? b.inUsdPerM : NaN;
var _out = Number.isFinite(b.outUsdPerM) ? b.outUsdPerM : NaN;
if (!Number.isFinite(_in) && !Number.isFinite(_out)) return {
amount: null,
label: "按 Token（费率未知）"
};
var _usd = ((Number.isFinite(_it) ? _it : 0) / 1e6) * (Number.isFinite(_in) ? _in : 0)
+ ((Number.isFinite(_ot) ? _ot : 0) / 1e6) * (Number.isFinite(_out) ? _out : 0);
var _cny = _usd * USD_CNY;
/* ⚠ amount 是**人民币元**（与既有 perImage/perSecond 一致）；label 用「≈」而不是精确值 —— 成本是浮动的 */
return {
amount: _cny,
label: "≈" + _cny.toFixed(2) + " 元"
};
}
if (b.type === "perImage") {
/* IMPL-101：sizeKey+unitHi 尺寸分层（qwen-image-3.0-pro 1K 0.25 / 2K 0.5）——
   "W*H" 解析，max 边 > sizeSplit 即高档；auto/解析失败回落基础价（估算保守） */
let u = b.unit, hi = "";
if (b.sizeKey && body[b.sizeKey]) {
/* IMPL-104：x/× 同识别（_dsImage 发送前把 x/× 归一为 *，估算侧此前只认 * 导致 2048x2048 低报 1K） */
const m = String(body[b.sizeKey]).match(/(\d+)\s*[*×xX]\s*(\d+)/);
if (m && Math.max(+m[1], +m[2]) > (b.sizeSplit || 1024)) { u = b.unitHi; hi = "（2K）"; }
}
const _nn = parseInt(body.n, 10);
const _mul = Number.isFinite(_nn) && _nn > 1 ? _nn : 1; /* IMPL-104：张数计费——n>1 时总额×n（此前低报 n-1 倍） */
return {
amount: u * _mul,
label: `${u} 元/张${hi}${_mul > 1 ? " ×" + _mul + " 张" : ""}`
};
}
if (b.type === "perSecond") {
if (b.durationKey && body[b.durationKey]) {
const d = Number(body[b.durationKey]);
/* IMPL-96②：tierKey/tiers 按参数变价（wan3.0-video 官方价 480P 0.3 / 720P 0.6 / 1080P 1.2 元/秒）；
   d<=0 守卫（-1 智能时长等非法值不计额，回落 note 只显单价） */
if (d > 0) {
let u = b.unit;
if (b.tierKey && b.tiers && body[b.tierKey] != null && b.tiers[body[b.tierKey]] != null) u = b.tiers[body[b.tierKey]];
return {
amount: d * u,
label: `${d}s × ${u}` + (b.tierKey && body[b.tierKey] ? `（${body[b.tierKey]}）` : "")
};
}
}
return {
amount: null,
label: b.note || "按时长"
};
}
if (b.type === "perChar") {
const len = (body[b.charKey] || "").length;
return {
amount: len * b.unit,
label: `${len}字 × ${b.unit}`
};
}
if (b.type === "perCall") return {
amount: b.unit,
label: `${b.unit} 元/次`
};
return null;
}

function classifyErr(msg) {
const raw = String(msg || "");
const m = raw.toLowerCase();
if (/no_api_key|密钥|key|auth|401|403/.test(m)) return {
category: "认证",
hint: "API 密钥无效或未填写",
action: "检查设置"
};
if (/429|rate_limited|too many|频繁|限流/.test(m)) return {
category: "限流",
hint: "请求过于频繁，系统会自动退避，请稍后重试",
action: "稍后重试"
};
if (/balance|余额|quota|额度/.test(m)) return {
category: "额度",
hint: "账户余额、点数或调用额度可能不足",
action: "检查速创账户"
};
if (/invalid_json|不是有效 json/.test(m)) return {
category: "服务",
hint: "服务返回格式异常，请稍后重试",
action: "重试"
};
if (/param|参数|422|400/.test(m)) return {
category: "参数",
hint: "请检查必填项、URL 格式和模型参数范围",
action: "回到参数页"
};
if (/timeout|超时|abort/.test(m)) return {
category: "超时",
hint: "网络响应时间过长，可稍后重试",
action: "重试"
};
if (/签名代理|中继|代理不可达|BadProxy|NoTransport/.test(m)) return {
category: "服务",
hint: "签名代理不可达，请经预览面板访问或稍后重试",
action: "检查服务"
};
if (/网络|fetch|cors|network/.test(m)) return {
category: "网络",
hint: "网络异常或浏览器跨域限制",
action: "检查网络"
};
if (/content|内容|审核|违规/.test(m)) return {
category: "内容",
hint: "内容可能触发审核策略，请调整提示词",
action: "修改提示词"
};
return {
category: "服务",
hint: raw || "未知错误",
action: "重试"
};
}

const PROMPT_VAR_RE = /\{([^{}\n]{1,24})\}|【([^【】\n]{1,24})】|\[([^\[\]\n]{1,24})\]/g;

/* IMPL-78 R2：AT_MENTION_RE 常量随引用功能移除 */

const Toast = {
show(msg, type = "info", duration = 3e3, action = null) {
const c = $("#toastContainer");
if (!c) return;
const existing = c.querySelector(`.toast.${type} span`);
if (existing && existing.textContent === msg) {
existing.closest(".toast").remove();
}
const toasts = c.querySelectorAll(".toast");
if (toasts.length >= 5) toasts[0].remove();
const icons = {
success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
};
const el = document.createElement("div");
el.className = `toast ${type}`;
el.innerHTML = `${icons[type] || icons.info}<span>${esc(typeof msg === "string" ? msg : _errText(msg))}</span>`;
if (action && typeof action.fn === "function") {
const btn = document.createElement("button");
btn.className = "toast-action";
btn.type = "button";
btn.textContent = action.label || "撤销";
btn.addEventListener("click", e => {
e.stopPropagation();
clearTimeout(timer);
el.classList.add("hide");
setTimeout(() => el.remove(), 200);
action.fn();
});
el.appendChild(btn);
}
c.appendChild(el);
const timer = setTimeout(() => {
el.classList.add("hide");
setTimeout(() => el.remove(), 200);
}, duration);
},
success(msg, d, action) {
this.show(msg, "success", d, action);
},
error(msg, d, action) {
this.show(msg, "error", d || 4e3, action);
},
warning(msg, d, action) {
this.show(msg, "warning", d, action);
},
info(msg, d, action) {
this.show(msg, "info", d, action);
}
};

const KeyVault = {
SCHEMA: "SCVB1",
LS_CUSTOM: "sc_keybook_vault2",
LS_PW: "sc_vault_pw",
_keys: null,
_pw: null,
get unlocked() {
return !!this._keys;
},
hasEmbedded() {
return false;
},
activeBlob() {
try {
return localStorage.getItem(this.LS_CUSTOM) || "";
} catch (e) {
return "";
}
},
embeddedBin() {
return null;
},
async _kdfBits(password, salt, iter) {
const pw = new TextEncoder().encode(password);
const buf = new Uint8Array(salt.length + pw.length);
buf.set(salt, 0);
buf.set(pw, salt.length);
let h = new Uint8Array(await crypto.subtle.digest("SHA-256", buf));
for (let i = 0; i < iter; i++) h = new Uint8Array(await crypto.subtle.digest("SHA-256", h));
return h;
},
async decryptBin(bytes, password) {
const dv = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
if (dv.length < 40) throw new Error("密钥簿数据不完整");
if (String.fromCharCode(dv[0], dv[1], dv[2], dv[3]) !== "WVLT") throw new Error("密钥簿格式无法识别");
if (dv[4] !== 3) throw new Error("密钥簿版本不受支持");
if (dv[5] !== 2) throw new Error("密钥簿算法不受支持");
const iter = (dv[6] << 24 | dv[7] << 16 | dv[8] << 8 | dv[9]) >>> 0;
const saltLen = dv[10];
const ivLen = dv[11];
let o = 12;
const salt = dv.slice(o, o + saltLen);
o += saltLen;
const iv = dv.slice(o, o + ivLen);
o += ivLen;
const ct = dv.slice(o);
try {
const bits = await this._kdfBits(password, salt, iter);
const key = await crypto.subtle.importKey("raw", bits, "AES-GCM", false, ["decrypt"]);
const plain = await crypto.subtle.decrypt({name: "AES-GCM", iv: iv}, key, ct);
const obj = JSON.parse(new TextDecoder().decode(plain));
if (!obj || typeof obj !== "object" || !obj.keys || typeof obj.keys !== "object") throw new Error("密钥簿内容格式异常");
return obj;
} catch (e) {
const m = e && e.message || "";
if (/不完整|无法识别|版本|格式异常/.test(m)) throw e;
throw new Error("密码错误或密钥簿已损坏");
}
},
async encryptBin(obj, password) {
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const iter = 60000;
const plain = new TextEncoder().encode(JSON.stringify(obj));
const bits = await this._kdfBits(password, salt, iter);
const key = await crypto.subtle.importKey("raw", bits, "AES-GCM", false, ["encrypt"]);
const ct = new Uint8Array(await crypto.subtle.encrypt({name: "AES-GCM", iv: iv}, key, plain));
const head = new Uint8Array([87, 86, 76, 84, 3, 2, iter >>> 24 & 255, iter >>> 16 & 255, iter >>> 8 & 255, iter & 255, salt.length, iv.length]);
const out = new Uint8Array(head.length + salt.length + iv.length + ct.length);
out.set(head, 0);
out.set(salt, head.length);
out.set(iv, head.length + salt.length);
out.set(ct, head.length + salt.length + iv.length);
return out;
},
isCustomActive() {
try {
return !!localStorage.getItem(this.LS_CUSTOM);
} catch (e) {
return false;
}
},
_crcTable: (() => {
const t = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
let c = n;
for (let k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
t[n] = c >>> 0;
}
return t;
})(),
_crc32(buf) {
let c = 4294967295;
for (let i = 0; i < buf.length; i++) c = this._crcTable[(c ^ buf[i]) & 255] ^ c >>> 8;
return (c ^ 4294967295) >>> 0;
},
_zipCrypto(password) {
const T = this._crcTable;
const v = new Uint32Array([ 305419896, 591751049, 878082192 ]);
const upd = b => {
v[0] = (T[(v[0] ^ b) & 255] ^ v[0] >>> 8) >>> 0;
v[1] = Math.imul(v[1] + (v[0] & 255) >>> 0, 134775813) + 1 >>> 0;
v[2] = (T[(v[2] ^ v[1] >>> 24) & 255] ^ v[2] >>> 8) >>> 0;
};
const stream = () => {
const t = (v[2] | 2) >>> 0;
return Math.imul(t, t ^ 1) >>> 8 & 255;
};
const pw = (new TextEncoder).encode(password);
for (let i = 0; i < pw.length; i++) upd(pw[i]);
return {
upd: upd,
stream: stream
};
},
_b64(u8) {
let s = "";
for (let i = 0; i < u8.length; i += 32768) s += String.fromCharCode.apply(null, u8.subarray(i, i + 32768));
return btoa(s);
},
_unb64(s) {
return Uint8Array.from(atob(s), c => c.charCodeAt(0));
},
decrypt(blob, password) {
const parts = String(blob || "").split("|");
if (parts.length !== 4 || parts[0] !== this.SCHEMA || parts[1] !== "zip") throw new Error("密钥簿格式无法识别");
const crcB = this._unb64(parts[2]);
const expectCrc = (crcB[0] << 24 | crcB[1] << 16 | crcB[2] << 8 | crcB[3]) >>> 0;
const payload = this._unb64(parts[3]);
if (payload.length < 13) throw new Error("密钥簿数据不完整");
const st = this._zipCrypto(password);
const out = new Uint8Array(payload.length - 12);
for (let i = 0; i < payload.length; i++) {
const p = (payload[i] ^ st.stream()) & 255;
st.upd(p);
if (i >= 12) out[i - 12] = p;
}
if (this._crc32(out) !== expectCrc) throw new Error("密码错误或密钥簿已损坏");
let obj;
try {
obj = JSON.parse((new TextDecoder).decode(out));
} catch (e) {
throw new Error("密钥簿内容已损坏");
}
if (!obj || typeof obj !== "object" || !obj.keys || typeof obj.keys !== "object") throw new Error("密钥簿内容格式异常");
return obj;
},
encrypt(obj, password) {
const plain = (new TextEncoder).encode(JSON.stringify(obj));
const crc = this._crc32(plain);
const st = this._zipCrypto(password);
const header = new Uint8Array(12);
if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(header); else for (let i = 0; i < 12; i++) header[i] = Math.random() * 256 | 0;
header[11] = crc >>> 24 & 255;
const out = new Uint8Array(12 + plain.length);
for (let i = 0; i < out.length; i++) {
const p = i < 12 ? header[i] : plain[i - 12];
out[i] = (p ^ st.stream()) & 255;
st.upd(p);
}
const crcB = new Uint8Array([ crc >>> 24 & 255, crc >>> 16 & 255, crc >>> 8 & 255, crc & 255 ]);
return `${this.SCHEMA}|zip|${this._b64(crcB)}|${this._b64(out)}`;
},
unlock(password) {
const blob = this.activeBlob();
if (!blob) throw new Error("没有可用的密钥簿");
const obj = this.decrypt(blob, password);
this._keys = obj.keys;
this._pw = password;
this._healSegKeys();
this._apply();
try {
storageSet(this.LS_PW, password);
} catch (e) {}
const names = Object.keys(this._keys).filter(k => this._keys[k]);
return {
label: obj.label || "密钥簿",
total: Object.keys(this._keys).length,
filled: names.length,
names: names
};
},
_healSegKeys() {
return;
},
autoUnlock() {
if (this.unlocked) return true;
let pw = "";
try {
pw = localStorage.getItem(this.LS_PW) || "";
} catch (e) {}
if (!pw) return false;
try {
this.unlock(pw);
return true;
} catch (e) {
this.forgetPw();
return false;
}
},
forgetPw() {
try {
localStorage.removeItem(this.LS_PW);
} catch (e) {}
},
_apply() {
const k = this._keys || {};
CONFIG.BUILTIN.API_KEY = k.API_KEY || "";
CONFIG.BUILTIN.R2_WORKER_URL = k.R2_WORKER_URL || "";
CONFIG.BUILTIN.R2_AUTH_TOKEN = k.R2_AUTH_TOKEN || "";
},
lock() {
this._keys = null;
this._pw = null;
CONFIG.BUILTIN.API_KEY = "";
CONFIG.BUILTIN.R2_WORKER_URL = "";
CONFIG.BUILTIN.R2_AUTH_TOKEN = "";
this.forgetPw();
},
keys() {
return this._keys || {};
},
reEncrypt(newPassword) {
if (!this._keys) throw new Error("请先解锁密钥簿");
const obj = {
v: 1,
label: "SC KeyBook",
created: (new Date).toISOString().slice(0, 10),
keys: this._keys
};
const nb = this.encrypt(obj, newPassword);
if (!storageSet(this.LS_CUSTOM, nb)) throw new Error("本地存储写入失败，无法保存自定义密钥簿");
this._pw = newPassword;
try {
storageSet(this.LS_PW, newPassword);
} catch (e) {}
return nb;
},
resetToEmbedded() {
try {
localStorage.removeItem(this.LS_CUSTOM);
} catch (e) {}
this.lock();
}
};

const VaultSync = {
LS_STATE: "sc_gh_sync_state",
cfg() {
const e = CONFIG.GITHUB_VAULT || {};
return {repo: e.repo || "", branch: e.branch || "main", path: e.path || "vault/keybook.enc.bin"};
},
state() {
return storageGetJSON(this.LS_STATE, null) || {};
},
saveState(s) {
try {
if (s) localStorage.setItem(this.LS_STATE, JSON.stringify(s)); else localStorage.removeItem(this.LS_STATE);
} catch (e) {}
},
configured() {
const c = this.cfg();
return !!(c.repo && c.path);
},
_binUrls(cfg) {
const repo = String(cfg.repo || "").trim().split("/").filter(Boolean).map(encodeURIComponent).join("/");
const p = String(cfg.path || "").replace(/^\/+/, "").split("/").filter(Boolean).map(encodeURIComponent).join("/");
const b = encodeURIComponent(cfg.branch || "main");
return ["https://raw.githubusercontent.com/" + repo + "/" + b + "/" + p, "https://cdn.jsdelivr.net/gh/" + repo + "@" + cfg.branch + "/" + p];
},
async _fp(buf) {
try {
const h = await crypto.subtle.digest("SHA-256", buf);
return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, "0")).join("");
} catch (e) {
return String(buf.length);
}
},
async _getRemote() {
const cfg = this.cfg();
if (!this.configured()) throw new Error("远端密码簿未配置");
let lastErr = null;
for (const url of this._binUrls(cfg)) {
try {
const res = await fetch(url, {cache: "no-store"});
if (!res.ok) {
lastErr = new Error(res.status === 404 ? "远端密码簿尚未上传" : "远端密码簿拉取失败 " + res.status);
continue;
}
const buf = new Uint8Array(await res.arrayBuffer());
if (buf.length < 40 || String.fromCharCode(buf[0], buf[1], buf[2], buf[3]) !== "WVLT") {
lastErr = new Error("远端密码簿尚未上传");
continue;
}
return {bytes: buf, fp: await this._fp(buf)};
} catch (e) {
lastErr = new Error("远端密码簿拉取失败");
}
}
throw lastErr || new Error("远端密码簿不可用");
},
async pull(pw) {
const remote = await this._getRemote();
if (!pw) throw new Error("请输入密码");
let obj = null, usedPw = pw;
/* IMPL-104（S-1）：只认用户密码——内嵌主密码回退已拆除 */
obj = await KeyVault.decryptBin(remote.bytes, pw);
storageSet(KeyVault.LS_CUSTOM, KeyVault.encrypt(obj, usedPw));
KeyVault.unlock(usedPw);
this.saveState({fp: remote.fp, at: Date.now()});
return obj;
},
async downloadBin() {
if (!KeyVault.unlocked) throw new Error("请先解锁保险箱");
const pw = KeyVault._pw || "";
const obj = {v: 1, label: "SC KeyBook", created: new Date().toISOString().slice(0, 10), keys: KeyVault.keys()};
const bytes = await KeyVault.encryptBin(obj, pw);
const blob = new Blob([bytes], {type: "application/octet-stream"});
const a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "keybook.enc.bin";
document.body.appendChild(a);
a.click();
setTimeout(() => {
URL.revokeObjectURL(a.href);
a.remove();
}, 800);
return bytes.length;
},
async bootCheck() {
try {
if (!this.configured() || !KeyVault.unlocked) return;
const st = this.state();
const remote = await this._getRemote();
if (!remote.fp || remote.fp === st.fp) return;
const pw = KeyVault._pw || "";
let obj = null, withPw = "";
if (pw) { /* IMPL-104（S-1）：主密码回退已拆除，无本地密码时不同步远端簿 */
try {
obj = await KeyVault.decryptBin(remote.bytes, pw);
withPw = pw;
} catch (e1) {}
}
if (obj) {
storageSet(KeyVault.LS_CUSTOM, KeyVault.encrypt(obj, withPw));
KeyVault.unlock(withPw);
this.saveState({fp: remote.fp, at: Date.now()});
Toast.info("密码簿已同步更新");
} else {
this.saveState(null);
KeyVault.lock();
Toast.warning("密码簿已更新，请重新输入密码解锁");
}
} catch (e) {}
}
};

const IDB = (() => {
let db = null;
try {
if (typeof Dexie !== "undefined") {
db = new Dexie("ai_workbench_db");
db.version(1).stores({
history: "id, createdAt, completedAt",
tasks: "id, createdAt",
thumbs: "url"
});
window._thumbDB = db;
}
} catch (e) {
console.warn("IDB init failed", e);
}
return {
db: db,
async getHistory() {
try {
return await db.history.toArray();
} catch {
return [];
}
},
async saveHistory(arr) {
try {
await db.history.bulkPut(arr);
} catch {}
},
async deleteHistory(ids) {
try {
await db.history.bulkDelete(ids); /* IMPL-104（D-2）：删除传播——bulkPut 只增不删，LS 缩减后 IDB 旧记录跨 boot 复活 */
} catch {}
},
async getTasks() {
try {
return await db.tasks.toArray();
} catch {
return [];
}
},
async saveTasks(arr) {
try {
await db.tasks.bulkPut(arr);
} catch {}
}
};
})();

const Store = {
getApiKey() {
return sessionGet(CONFIG.STORAGE_KEYS.API_KEY) || storageGet(CONFIG.STORAGE_KEYS.API_KEY) || CONFIG.BUILTIN.API_KEY || "";
},
/* IMPL-95⑥：直连 provider 密钥（仅存本机 localStorage，不进 git/日志/上传——三不原则） */
getSfKey() {
return sessionGet(CONFIG.STORAGE_KEYS.SF_KEY) || storageGet(CONFIG.STORAGE_KEYS.SF_KEY) || CONFIG.BUILTIN.SF_KEY || "";
},
getDsKey() {
return sessionGet(CONFIG.STORAGE_KEYS.DS_KEY) || storageGet(CONFIG.STORAGE_KEYS.DS_KEY) || CONFIG.BUILTIN.DS_KEY || "";
},
getR2WorkerUrl() {
return storageGet(CONFIG.STORAGE_KEYS.R2_WORKER_URL) || CONFIG.BUILTIN.R2_WORKER_URL;
},
getR2AuthToken() {
const vk = typeof KeyVault !== "undefined" ? KeyVault.keys().R2_AUTH_TOKEN || "" : "";
if (vk) return vk;
return storageGet(CONFIG.STORAGE_KEYS.R2_AUTH_TOKEN) || CONFIG.BUILTIN.R2_AUTH_TOKEN || "";
},
llmEndpoints() {
const list = [];
const w = (this.getR2WorkerUrl() || "").trim().replace(/\/$/, "");
if (w) list.push(w + "/llm/chat");
let local = false, isFile = false;
try {
const h = location.hostname;
local = (h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0");
isFile = location.protocol === "file:";
} catch (e) {}
// 沙箱兜底（XTransformPort 是沙箱网关专用约定）：file:// 双击打开时相对端点
// 必然 Failed to fetch，剔除避免无意义探测；本地静态服务器上失败也无副作用
if ((w || local) && !isFile) list.push("/llm/chat?XTransformPort=3031");
return list;
},
getSkillModel() {
return storageGet(CONFIG.STORAGE_KEYS.SKILL_MODEL, "deepseek:deepseek-flash") || "deepseek:deepseek-flash";
},
setSkillModel(v) {
storageSet(CONFIG.STORAGE_KEYS.SKILL_MODEL, String(v || "auto"));
},
getSkillThinking() {
return storageGet(CONFIG.STORAGE_KEYS.SKILL_THINKING, "1") !== "0";
},
setSkillThinking(on) {
storageSet(CONFIG.STORAGE_KEYS.SKILL_THINKING, on ? "1" : "0");
},
/* IMPL-71 需求③：组合模式拆分为「接棒模式」（识图→思考接力，默认开）与「讨论模式」（多模型会诊+终结者，默认关）。
   sc_skill_relay 首读时从旧 sc_skill_combo 迁移并清理旧键，升级前后行为一致。 */
getSkillRelay() {
const v = storageGet(CONFIG.STORAGE_KEYS.SKILL_RELAY, null);
if (v !== null) return v !== "0";
const legacy = storageGet(CONFIG.STORAGE_KEYS.SKILL_COMBO, null);
try { localStorage.removeItem(CONFIG.STORAGE_KEYS.SKILL_COMBO); } catch (e) {}
const on = legacy !== null ? legacy !== "0" : true;
storageSet(CONFIG.STORAGE_KEYS.SKILL_RELAY, on ? "1" : "0");
return on;
},
setSkillRelay(on) {
storageSet(CONFIG.STORAGE_KEYS.SKILL_RELAY, on ? "1" : "0");
},
getSkillDiscuss() {
return storageGet(CONFIG.STORAGE_KEYS.SKILL_DISCUSS, "0") === "1";
},
setSkillDiscuss(on) {
storageSet(CONFIG.STORAGE_KEYS.SKILL_DISCUSS, on ? "1" : "0");
},
/* IMPL-71 需求⑤：识图模型可选化（接棒/讨论共用），默认千问全模态旗舰 */
getSkillVisionModel() {
return storageGet(CONFIG.STORAGE_KEYS.SKILL_VISION_MODEL, SKILL_VISION_MODEL) || SKILL_VISION_MODEL;
},
setSkillVisionModel(v) {
storageSet(CONFIG.STORAGE_KEYS.SKILL_VISION_MODEL, String(v || SKILL_VISION_MODEL));
},
/* IMPL-72 需求⑥「识与论切」：讨论模式主模型（发言1 + 终结者共用），默认 DeepSeek V4 Pro（IMPL-68 冒烟 reasoning_content 实测） */
getSkillDiscussModel() {
return storageGet(CONFIG.STORAGE_KEYS.SKILL_DISCUSS_MODEL, SKILL_DISCUSS_MODEL) || SKILL_DISCUSS_MODEL;
},
setSkillDiscussModel(v) {
storageSet(CONFIG.STORAGE_KEYS.SKILL_DISCUSS_MODEL, String(v || SKILL_DISCUSS_MODEL));
},
getSkillCatalog() {
const v = storageGetJSON(CONFIG.STORAGE_KEYS.SKILL_MODELS_CATALOG, null);
return v && typeof v === "object" && v.providers && typeof v.providers === "object" ? v : null;
},
setSkillCatalog(c) {
try { storageSet(CONFIG.STORAGE_KEYS.SKILL_MODELS_CATALOG, JSON.stringify(c || null)); } catch (e) {}
},
getSegAk() {
return typeof KeyVault !== "undefined" ? KeyVault.keys().IMAGESEG_AK || "" : "";
},
getSegSk() {
return typeof KeyVault !== "undefined" ? KeyVault.keys().IMAGESEG_SK || "" : "";
},
getSegProxy() {
return storageGet(CONFIG.STORAGE_KEYS.SEG_PROXY, "");
},
segProxyOrigin() {
const custom = this.getSegProxy();
return custom ? custom.replace(/\/$/, "") : "";
},
segEndpoint(path) {
const custom = this.getSegProxy();
if (custom) return `${custom.replace(/\/$/, "")}${path}`;
return `${path}${path.includes("?") ? "&" : "?"}XTransformPort=3030`;
},
segEndpointList(path) {
const list = [];
const custom = (this.getSegProxy() || "").trim().replace(/\/$/, "");
if (custom) list.push(custom + path);
list.push(`${path}${path.includes("?") ? "&" : "?"}XTransformPort=3030`);
return list;
},
hasSegCred() {
return !!(this.getSegAk() && this.getSegSk());
},
getSound() {
return storageGet(CONFIG.STORAGE_KEYS.SOUND, "1") === "1";
},
setSound(on) {
storageSet(CONFIG.STORAGE_KEYS.SOUND, on ? "1" : "0");
},
getSync() {
return storageGet(CONFIG.STORAGE_KEYS.CLOUD_SYNC, "1") === "1";
},
setSync(on) {
storageSet(CONFIG.STORAGE_KEYS.CLOUD_SYNC, on ? "1" : "0");
},
getHistory() {
/* IMPL-91：内存缓存——41 处调用点零改动受益（报告 5.2/4.1 首位项）；本 tab 写入统一经 _hwrite 同步缓存，跨标签页经 storage 事件失效 */
if (this._histCache === null) {
const v = storageGetJSON(CONFIG.STORAGE_KEYS.HISTORY, []);
this._histCache = Array.isArray(v) ? v : [];
}
return this._histCache;
},
_histCache: null,
_hwrite(arr) {
const a = Array.isArray(arr) ? arr : [];
/* IMPL-104（D-2）：删除传播——以写前缓存为基线做 id 差集，从 IDB 清掉本次缩减的记录（清空/按筛选清理/单删全路径覆盖） */
const prev = this._histCache;
if (this.useIDB && Array.isArray(prev) && prev.length > a.length && typeof IDB !== "undefined" && IDB.deleteHistory) {
const cur = new Set(a.map(x => x && x.id));
const gone = prev.filter(x => x && x.id && !cur.has(x.id)).map(x => x.id);
if (gone.length) IDB.deleteHistory(gone).catch(() => {});
}
/* IMPL-91-V2 建议：quota 满写盘失败→缓存失效回退重读磁盘旧值，保证缓存≡磁盘（V2 审计观察项①） */
if (!storageSet(CONFIG.STORAGE_KEYS.HISTORY, JSON.stringify(a))) this._histCache = null;
else this._histCache = a;
/* IMPL-95⑧：4.6 IDB 持续双写（fire-and-forget，bulkPut 幂等，失败静默）——LS 保留为降级副本，IDB 承接大容量 */
if (this.useIDB) IDB.saveHistory(a).catch(() => {});
},
addHistory(item) {
const arr = this.getHistory();
arr.unshift(_r76SlimHistory(item)); /* ★ R76-G：model 占单条 67%（真机实测）⇒ 只留被读的字段 */
if (arr.length > 500) arr.length = 500;
this._hwrite(arr);
},
saveHistory(arr) {
this._hwrite(arr);
},
/* ── 77-b Q6：LLM API 用量账本（sc_llm_usage，capped 600 FIFO）——llmChatStream 每次调用一行：成功 {t,model,tag,p,c,ms,ok:true}，失败 {…,ok:false}（不含错误文本防膨胀；范围级错误数供成功率 KPI）── */
getLlmUsage() {
const v = storageGetJSON(CONFIG.STORAGE_KEYS.LLM_USAGE, []);
return Array.isArray(v) ? v : [];
},
pushLlmUsage(rec) {
const arr = this.getLlmUsage();
arr.push(rec);
if (arr.length > 600) arr.splice(0, arr.length - 600);
storageSet(CONFIG.STORAGE_KEYS.LLM_USAGE, JSON.stringify(arr));
},
toggleFavorite(id) {
const arr = this.getHistory();
const h = arr.find(x => x.id === id);
if (h) {
h.favorite = !h.favorite;
this._hwrite(arr);
}
},
clearHistory(opts = {}) {
if (opts.all) {
this._hwrite([]);
return;
}
let arr = this.getHistory();
if (opts.failed) {
arr = arr.filter(h => h.status === "succeeded");
}
if (opts.days7) {
const cut = Date.now() - 7 * 864e5;
arr = arr.filter(h => h.createdAt > cut);
}
this._hwrite(arr);
},
deleteHistoryMany(ids) {
const set = new Set(ids);
const arr = this.getHistory();
const next = arr.filter(h => !set.has(h.id));
this._hwrite(next);
return arr.length - next.length;
},
async restoreHistory(items) {
if (!Array.isArray(items) || !items.length) return 0;
const arr = this.getHistory();
const have = new Set(arr.map(h => h.id));
const incoming = items.filter(h => h && h.id && !have.has(h.id));
if (!incoming.length) return 0;
const next = [ ...incoming, ...arr ];
if (this.useIDB && typeof IDB !== "undefined") {
try {
await IDB.saveHistory(next);
} catch {}
}
this._hwrite(next);
return incoming.length;
},
setFavoriteMany(ids, fav) {
const set = new Set(ids);
const arr = this.getHistory();
let n = 0;
arr.forEach(h => {
if (set.has(h.id) && h.favorite !== fav) {
h.favorite = fav;
n++;
}
});
this._hwrite(arr);
return n;
},
getTasks() {
const v = storageGetJSON(CONFIG.STORAGE_KEYS.TASKS, []);
return Array.isArray(v) ? v : [];
},
saveTasks(arr) {
storageSet(CONFIG.STORAGE_KEYS.TASKS, JSON.stringify(Array.isArray(arr) ? arr : []));
},
getPromptHistory() {
const v = storageGetJSON(CONFIG.STORAGE_KEYS.PROMPT_HISTORY, []);
return Array.isArray(v) ? v : [];
},
addPrompt(p) {
if (!p || !p.trim()) return;
let arr = this.getPromptHistory();
arr = arr.filter(x => x !== p);
arr.unshift(p);
if (arr.length > 20) arr.length = 20;
storageSet(CONFIG.STORAGE_KEYS.PROMPT_HISTORY, JSON.stringify(arr));
},
getPresets() {
try {
const arr = storageGetJSON(CONFIG.STORAGE_KEYS.PRESETS, []);
return arr.map(p => ({
id: p.id || genId(),
name: p.name || "未命名",
tab: p.tab || "image",
modelId: p.modelId || "",
prompt: p.prompt || (p.params ? p.params.prompt || p.params.text || "" : ""),
createdAt: p.createdAt || Date.now()
}));
} catch {
return [];
}
},
savePreset(name, tab, modelId, prompt) {
const promptStr = String(prompt || "").trim();
if (!promptStr) {
Toast.warning("提示词为空，无法保存");
return null;
}
const arr = this.getPresets();
const item = {
id: "p_" + Date.now().toString(36),
name: String(name).trim() || "未命名",
tab: tab,
modelId: modelId,
prompt: promptStr,
createdAt: Date.now()
};
arr.push(item);
while (arr.length > 50) arr.shift();
storageSet(CONFIG.STORAGE_KEYS.PRESETS, JSON.stringify(arr));
return item.id;
},
delPreset(id) {
const arr = this.getPresets().filter(p => p.id !== id);
storageSet(CONFIG.STORAGE_KEYS.PRESETS, JSON.stringify(arr));
},
getPresetUsage() {
try {
return storageGetJSON("wb-preset-usage-v1", {});
} catch {
return {};
}
},
recordPresetUsage(key) {
if (!key) return;
try {
const u = this.getPresetUsage();
const e = u[key] || {
n: 0,
t: 0
};
u[key] = {
n: e.n + 1,
t: Date.now()
};
storageSet("wb-preset-usage-v1", JSON.stringify(u));
} catch {}
},
getBudget() {
const v = parseFloat(storageGet(CONFIG.STORAGE_KEYS.BUDGET, "0"));
return isNaN(v) ? 0 : v;
},
setBudget(v) {
storageSet(CONFIG.STORAGE_KEYS.BUDGET, String(v || 0));
},
getSpendAlert() {
return true;
},
getTodaySpend() {
const todayStart = new Date((new Date).getFullYear(), (new Date).getMonth(), (new Date).getDate()).getTime();
return this.getHistory().filter(h => h.status === "succeeded" && h.createdAt >= todayStart).reduce((s, h) => s + (h.cost || 0), 0);
},
getTaskCenterUrl() {
return storageGet(CONFIG.STORAGE_KEYS.TASK_CENTER_URL);
},
getTaskCenterToken() {
return storageGet(CONFIG.STORAGE_KEYS.TASK_CENTER_TOKEN);
},
useIDB: typeof Dexie !== "undefined",
async getHistoryAsync() {
return this.useIDB ? await IDB.getHistory() : this.getHistory();
},
async getTasksAsync() {
return this.useIDB ? await IDB.getTasks() : this.getTasks();
},
async saveHistoryAsync(arr) {
if (this.useIDB) await IDB.saveHistory(arr);
this.saveHistory(arr);
},
async saveTasksAsync(arr) {
if (this.useIDB) await IDB.saveTasks(arr);
this.saveTasks(arr);
}
};

/* ── IMPL-100：聊天消息结构规范化（严格上游 400 code 20015 防线）──
   背景：讨论模式 sp1/sp2/终结者在会话末条 user 后追加 user 指令 → 连续两条 user；
   宽松上游此前容忍，GLM 系校验「user 之后必须是 assistant|tool」直接 400（网关包装成 502 报「技能服务错误」）。
   传输层单点收口（llmChatStream 发送前调用）：①剔除空消息 ②system 仅允许居首（散落的降级 user 并加前缀）
   ③相邻同角色合并（user+user / assistant+assistant：字符串以空行连接、parts 数组拼接）
   ④防御性保证首条非 system 消息为 user。只构造新数组、不改写入参消息对象；文本语义零损失（合并=拼接）。 */
function normalizeChatMsgs(messages) {
  const list = Array.isArray(messages) ? messages : [];
  const textOf = c => String(c == null ? "" : c);
  const isBlank = c => Array.isArray(c) ? c.length === 0 : !textOf(c).trim();
  const mergeContent = (a, b) => {
    if (Array.isArray(a) || Array.isArray(b)) {
      const A = Array.isArray(a) ? a : [{ type: "text", text: textOf(a) }];
      const B = Array.isArray(b) ? b : [{ type: "text", text: textOf(b) }];
      return A.concat(B);
    }
    const sa = textOf(a), sb = textOf(b);
    return sa && sb ? sa + "\n\n" + sb : (sa || sb);
  };
  const out = [];
  for (const m of list) {
    if (!m || typeof m !== "object") continue;
    let role = m.role;
    let content = Array.isArray(m.content)
      ? m.content.filter(p => p && (p.type !== "text" || String(p.text || "").length))
      : m.content;
    if (isBlank(content)) continue; /* 空消息剔除（"" / 空白 / 空数组） */
    if (role === "system" && out.some(x => x.role !== "system")) {
      role = "user";                                   /* 散落 system 降级为 user */
      content = mergeContent("【系统提示】", content);
    }
    const last = out[out.length - 1];
    if (last && last.role === role) last.content = mergeContent(last.content, content); /* 相邻同角色合并 */
    else out.push({ role, content });
  }
  const fi = out.findIndex(m => m.role !== "system");
  if (fi > -1 && out[fi].role !== "user") {
    out[fi] = { role: "user", content: mergeContent("【以下为此前助手输出的上下文】", out[fi].content) };
  }
  return out;
}

/* ★★★ R69（2026-10-06 P0 热修）：把「上游错误」归一成**可读字符串**。
   ─────────────────────────────────────────────────────────────────────────────
   症状：真机点生成，Toast 显示字面量 `[object Object]`。
   根因：上游 OpenAI/APIYI 形态的错误体是 {"error":{"message":"..."}}，
         ⇒ `data.error` 是**对象**；而对象是 truthy
         ⇒ `data.error || data.message || data.msg || ...` **必然**短路取到对象
         ⇒ `new Error("" + obj)` 的 message 变成 `[object Object]`
         ⇒ `Toast.error(e.message)` 把这个字面量显示给用户（全链路信息丢失）。
   ⚠ 为何"R68 修好后才出现"：R67/R68 之前请求根本发不出去（拼错域名 / 跨块 ReferenceError），
     上游**没有机会**回话；R68 之后请求真的到达 APIYI，对象形态的错误体首次显形 ⇒ 老 bug 暴露。

   本函数纯**新增**，不改变任何既有分支语义；调用点仅把「取消息」改为经它。
   ⚠ 命名 `_errText` 在产物中零占用（已核）。作为 function 声明会提升 ⇒ 同块内任意位置可用
     （Toast 在其之前定义也能用）。 */
function _errText(err) {
  if (err === undefined || err === null) return "";
  if (typeof err === "string") return err;
  if (typeof err === "number" || typeof err === "boolean") return String(err);
  if (err instanceof Error) return String(err.message || err);
  if (typeof err === "object") {
    /* ① 常见字段直取（顺序 = 覆盖面从窄到宽；error 放后面，因为它自身常是对象） */
    var m = err.message || err.msg || err.detail || err.error_message || err.description || err.reason;
    if (m !== undefined && m !== null && typeof m !== "object") return String(m);
    /* ② 再剥一层：{ error: { message } } / { detail: { msg } } */
    var n = err.error || err.detail || err.data || err.body;
    if (n && typeof n === "object") {
      var m2 = n.message || n.msg || n.detail || n.error_message;
      if (m2 !== undefined && m2 !== null && typeof m2 !== "object") return String(m2);
    }
    /* ③ 兜底：JSON 化（截断，避免把整包响应塞进 Toast） */
    try {
      var j = JSON.stringify(err);
      if (j && j !== "{}" && j !== "[]") return j.length > 300 ? j.slice(0, 300) + "…" : j;
    } catch (_) {}
    return "[上游返回了无法解析的错误对象]";
  }
  return String(err);
}
const Api = {
_uploadCache: new Map,
async request(method, path, body, opts = {}) {
const key = Store.getApiKey();
if (!key && !opts.skipAuth) throw new Error("no_api_key: 请先在设置中填入 API Key");
const url = /^https?:\/\//i.test(path) ? path : CONFIG.API_BASE + path; /* IMPL-98：绝对 URL 直通（Worker 媒体代理），速创相对路径原逻辑不变 */
const controller = new AbortController;
const timer = setTimeout(() => controller.abort(), opts.timeout || CONFIG.REQUEST_TIMEOUT);
try {
const isGetHead = method === "GET" || method === "HEAD";
const isForm = body && typeof body === "object" && typeof body.append === "function";
const res = await fetch(url, {
method: method,
headers: {
...!isForm ? {
"Content-Type": "application/json"
} : {},
...(opts.authorization ? {
Authorization: opts.authorization
} : key ? {
Authorization: key
} : {}),
...opts.headers || {}
},
body: !isGetHead && body !== undefined && body !== null ? (isForm ? body : JSON.stringify(body)) : undefined,
signal: controller.signal
});
clearTimeout(timer);
let data;
const text = await res.text();
try {
data = text ? JSON.parse(text) : {};
} catch {
data = {
raw: text
};
}
if (!res.ok) {
const errMsg = _errText(data.error) || _errText(data.message) || _errText(data.msg) || `HTTP ${res.status}`;
if (res.status === 429) {
const retryAfter = parseInt(res.headers.get("Retry-After") || "0");
throw Object.assign(new Error(`429: ${errMsg}`), {
status: 429,
retryAfter: retryAfter
});
}
throw Object.assign(new Error(`${errMsg}`), {
status: res.status,
data: data
});
}
return data;
} catch (e) {
clearTimeout(timer);
if (e.name === "AbortError") throw new Error("timeout: 请求超时");
if (e.message === "Failed to fetch") { if (String(path || "").includes("/media/")) { let probe = false, ver = ""; try { const pr = await fetch(url, { method: "OPTIONS", signal: AbortSignal.timeout(8000) }); probe = pr.ok; ver = (pr.headers.get("X-Media-Proxy-Version") || "").trim(); } catch (_) {} if (probe && ver) throw new Error("Worker 媒体代理预检探测通过（部署版本 " + ver + " 在位）但请求仍失败——可能为瞬时网络抖动或 Worker 运行时异常，请重试一次；持续失败请到 Cloudflare Dashboard 查看 Worker 实时日志（IMPL-113③ 自诊断）"); if (probe) throw new Error("Worker 媒体代理可达但响应缺版本特征——线上仍为旧版部署（旧版预检白名单缺 X-Enable-Watermark，水印关闭时必被拒，IMPL-113 真根因）。请到 Cloudflare Dashboard 重新部署 upload/worker-ai-media-proxy-merged.js（IMPL-113 版）：Workers & Pages → 选中 Worker → Edit code → 全选粘贴该文件全文 → Deploy，完成后硬刷新本页（IMPL-113③ 自诊断）"); throw new Error("Worker 媒体代理不通（网络不可达或未部署）——请先核对 设置→R2 Worker 地址 域名是否正确；如域名无误请到 Cloudflare Dashboard 重新部署 upload/worker-ai-media-proxy-merged.js（IMPL-113 版已修正预检真根因）：Workers & Pages → 选中 Worker → Edit code → 全选粘贴该文件全文 → Deploy，完成后硬刷新本页（IMPL-113③ 自诊断）"); } throw new Error("网络请求失败，可能是跨域(CORS)或网络问题"); }
throw e;
}
},
normalizeResponse(res) {
if (!res) return null;
if (res.code && res.code !== 200) {
throw new Error(_errText(res.msg) || _errText(res.message) || `API错误: code ${res.code}`);
}
if (typeof res.data === "string") {
const trimmed = res.data.trim();
if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
try {
return JSON.parse(trimmed);
} catch {}
}
if (trimmed) return {
id: trimmed
};
return res;
}
if (res.data && typeof res.data === "object") return res.data;
return res;
},
async submit(model, body) {
const nv = normalizeAndValidateApiBody(model, body); /* IMPL-152 P1：重提/重新生成旁路补校验+布尔归一（主链已归一则幂等直通；历史 body 再过互斥校验仍成立） */
if (!nv.ok) throw new Error(nv.error);
const res = await this.request("POST", model.endpoint, nv.body);
const data = this.normalizeResponse(res);
const id = data.id || data.taskId || data.requestId;
if (!id) throw new Error("服务未返回任务 ID，响应: " + JSON.stringify(data).slice(0, 200));
return {
id: String(id),
raw: data
};
},
async syncCall(model, body) {
const res = await this.request("POST", model.endpoint, body);
return this.normalizeResponse(res);
},
/* ── IMPL-95⑥：provider 直连执行器（不走速创网关）——骨架依据官方 curl 原文（tmp/impl95/models-doc.md §10）：
   SF 生图 {model,prompt,image_size,...} → images[0].url（1h 有效）
   DS 生图异步 {model,input.messages[0].content[{text}|{image}],parameters} → task 轮询 → choices[0].message.content[0].image（字符串 url，24h）
   DS 视频 wan3 异步 {model,input:{prompt,media[]},parameters} → task 轮询 → output.video_url（24h）
   DS TTS {model,input:{text,voice,format,...}}（参数全部平铺 input，无 parameters 壳）→ output.audio.url（24h）
   SF ASR multipart /v1/audio/transcriptions → {text}
   DS ASR chat/completions + 顶层 asr_options → choices[0].message.content ── */
async directRun(model, body) {
  const kind = model.direct;
  if (kind === "sf-image") return this._sfImage(model, body);
  if (kind === "ds-image") return this._dsImage(model, body);
  if (kind === "ds-video") return this._dsVideo(model, body);
  if (kind === "ds-tts") return this._dsTts(model, body);
  if (kind === "sf-asr") return this._sfAsr(model, body);
  if (kind === "ds-asr") return this._dsAsr(model, body);
  throw new Error("direct: 未知直连类型 " + kind);
},
/* IMPL-98：直连统一走 Worker 媒体代理（/media/sf|ds/*）——上游密钥收敛到 Worker 变量，前端零密钥 */
_directReq(method, path, body, opts = {}) {
  const chan = opts.apiyi ? "apiyi" : (opts.wy ? "wy" : (opts.sf ? "sf" : "ds")); /* IMPL-150：+wy 速创通道；2026-10-01：+apiyi（/media/apiyi/* 透明代理 api.apiyi.com/v1，Authorization: Bearer APIYI_API_KEY——Worker 第 4 条媒体通道） */
  const w = (Store.getR2WorkerUrl() || "").trim().replace(/\/$/, "");
  if (!w) throw new Error("no_worker_url: 未配置 R2 Worker 地址——直连模型的密钥已收敛到 Worker 变量（前端零密钥），请在 设置→编辑密钥 填入 R2 Worker 地址与 Token");
  const token = Store.getR2AuthToken() || "";
  const url = w + "/media/" + chan + (path.charAt(0) === "/" ? path : "/" + path) + (path.indexOf("?") >= 0 ? "&" : "?") + "token=" + encodeURIComponent(token);
  return this.request(method, url, body, { skipAuth: true, ...opts });
},
async _sfImage(model, body) {
  const payload = { model: model.modelId, prompt: body.prompt || "", image_size: body.image_size || "1024x1024" };
  if (body.negative_prompt) payload.negative_prompt = body.negative_prompt;
  const steps = parseInt(body.num_inference_steps, 10);
  if (Number.isFinite(steps) && steps >= 1 && steps <= 100) payload.num_inference_steps = steps;
  const seed = parseInt(body.seed, 10);
  if (Number.isFinite(seed) && seed >= 0) payload.seed = Math.min(seed, 9999999999);
  if (body.image) payload.image = body.image;
  if (model.id === "kolors" && body.guidance_scale !== "" && body.guidance_scale != null) {
    const g = parseFloat(body.guidance_scale);
    if (Number.isFinite(g) && g > 0 && g <= 20) payload.guidance_scale = g;
  }
  const headers = String(body.watermark) === "0" ? { "X-Enable-Watermark": "0" } : {};
  const data = await this._directReq("POST", "/v1/images/generations", payload, { sf: true, headers, timeout: 12e4 });
  const url = data && data.images && data.images[0] && data.images[0].url;
  if (!url) throw new Error("直连生成未返回图片 URL: " + JSON.stringify(data).slice(0, 200));
  return { url, raw: data };
},
async _dsImage(model, body) {
  const content = [];
  const refs = Array.isArray(body.urls) ? body.urls : String(body.urls || "").split(",").map(s => s.trim()).filter(Boolean);
  refs.slice(0, 3).forEach(u => content.push({ image: u }));
  content.push({ text: body.prompt || "" });
  const parameters = {};
  if (body.size && String(body.size).toLowerCase() !== "auto") parameters.size = String(body.size).replace(/\s+/g, "").replace(/×/g, "*").replace(/x/gi, "*"); /* IMPL-119：剥离空白——估算与发送同口径（"1024 * 1024" 原样发送上游不认） */
  const nn = parseInt(body.n, 10);
  if (Number.isFinite(nn) && nn >= 1 && nn <= 6) parameters.n = nn;
  if (body.negative_prompt) parameters.negative_prompt = body.negative_prompt;
  const seed = parseInt(body.seed, 10);
  if (Number.isFinite(seed) && seed >= 0) parameters.seed = Math.min(seed, 9999999999); /* IMPL-160：对齐 _sfImage 封顶（漂移修复：UI seed 自由文本可发任意大值撞上游 400） */
  if (body.prompt_extend !== "" && body.prompt_extend != null) parameters.prompt_extend = body.prompt_extend === "true" || body.prompt_extend === true;
  if (body.watermark !== "" && body.watermark != null) parameters.watermark = body.watermark === "true" || body.watermark === true;
  const payload = { model: model.modelId, input: { messages: [{ role: "user", content }] }, parameters };
  const sub = await this._directReq("POST", "/api/v1/services/aigc/image-generation/generation", payload, { headers: { "X-DashScope-Async": "enable" }, timeout: 3e4 });
  const taskId = sub && sub.output && sub.output.task_id;
  if (!taskId) throw new Error("直连提交未返回 task_id: " + JSON.stringify(sub).slice(0, 200));
  const out = await this._dsPoll(taskId, 3e3, 120);
  /* IMPL-104：n>1 全图回收——此前只取 content[0]，n-1 张付费图被丢弃；urls 随 result.data 落历史 */
  const _msg = out && out.output && out.output.choices && out.output.choices[0] && out.output.choices[0].message;
  const outs = _msg && Array.isArray(_msg.content) ? _msg.content.map(c => c && c.image).filter(u => typeof u === "string" && u) : [];
  const url = outs[0];
  if (!url || typeof url !== "string") throw new Error("直连生成未返回图片 URL: " + JSON.stringify(out).slice(0, 300));
  return { url, urls: outs, raw: out };
},
async _dsVideo(model, body) {
  const input = { prompt: body.prompt || "" };
  const media = [];
  if (body.first_frame) media.push({ type: "first_frame", url: body.first_frame });
  if (body.last_frame) media.push({ type: "last_frame", url: body.last_frame });
  const pushCsv = (v, type, cap) => {
    const arr = Array.isArray(v) ? v : String(v || "").split(",").map(s => s.trim()).filter(Boolean);
    arr.slice(0, cap).forEach(u => media.push({ type, url: u }));
  };
  pushCsv(body.images, "reference_image", 10);
  pushCsv(body.videos, "reference_video", 5);
  pushCsv(body.audios, "reference_audio", 5);
  if (media.length) input.media = media;
  const parameters = {};
  if (body.resolution) parameters.resolution = body.resolution;
  if (body.ratio) parameters.ratio = body.ratio;
  const dur = parseFloat(body.duration);
  if (Number.isFinite(dur)) parameters.duration = dur === -1 ? -1 : Math.round(dur);
  if (body.audio !== "" && body.audio != null) parameters.audio = body.audio === "true" || body.audio === true;
  const seed = parseInt(body.seed, 10);
  if (Number.isFinite(seed) && seed >= 0) parameters.seed = Math.min(seed, 9999999999); /* IMPL-160：对齐 _sfImage 封顶（漂移修复） */
  if (body.prompt_extend !== "" && body.prompt_extend != null) parameters.prompt_extend = body.prompt_extend === "true" || body.prompt_extend === true;
  if (body.watermark !== "" && body.watermark != null) parameters.watermark = body.watermark === "true" || body.watermark === true; /* IMPL-119：官方 parameters.watermark（默认 false）透传——原 UI 缺失 */
  const payload = { model: model.modelId, input, parameters };
  const sub = await this._directReq("POST", "/api/v1/services/aigc/video-generation/video-synthesis", payload, { headers: { "X-DashScope-Async": "enable" }, timeout: 3e4 });
  const taskId = sub && sub.output && sub.output.task_id;
  if (!taskId) throw new Error("直连提交未返回 task_id: " + JSON.stringify(sub).slice(0, 200));
  const out = await this._dsPoll(taskId, 5e3, 200);
  const url = out && out.output && out.output.video_url;
  if (!url) throw new Error("直连生成未返回视频 URL: " + JSON.stringify(out).slice(0, 300));
  return { url, raw: out };
},
async _dsPoll(taskId, interval, maxTries) {
  let last = null;
  for (let i = 0; i < maxTries; i++) {
    await new Promise(r => setTimeout(r, i === 0 ? 1500 : interval));
    let d;
    try {
      d = await this._directReq("GET", "/api/v1/tasks/" + encodeURIComponent(taskId), undefined, { timeout: 2e4 });
    } catch (e) {
      last = last || null;
      continue;
    }
    last = d;
    const st = d && d.output && d.output.task_status;
    if (st === "SUCCEEDED") return d;
    if (st === "FAILED" || st === "CANCELED" || st === "UNKNOWN") {
      const msg = (d && d.output && (d.output.message || d.output.code)) || ("直连任务失败: " + st);
      throw new Error(msg);
    }
  }
  throw new Error("直连任务轮询超时（" + maxTries + " 次查询无结果），可稍后在任务详情重试");
},
async _dsTts(model, body) {
  const input = { text: body.text || "", voice: body.voice || "" };
  if (!input.text) throw new Error("请填写合成文本");
  if (!input.voice) throw new Error("请填写音色 voice（cosyvoice-v3.5-plus 需声音复刻/设计音色 id；Qwen 系可选灵心/鲁风）");
  if (body.format) input.format = body.format;
  const sr = parseInt(body.sample_rate, 10);
  if (Number.isFinite(sr) && sr > 0) input.sample_rate = sr;
  const num = (v, lo, hi) => { const x = parseFloat(v); return Number.isFinite(x) && x >= lo && x <= hi ? x : null; };
  const rate = num(body.rate, .5, 2);
  if (rate != null) input.rate = rate;
  const pitch = num(body.pitch, .5, 2);
  if (pitch != null) input.pitch = pitch;
  const vol = num(body.volume, 0, 100);
  if (vol != null) input.volume = Math.round(vol);
  if (body.instruction) input.instruction = body.instruction;
  const payload = { model: model.modelId, input };
  const data = await this._directReq("POST", "/api/v1/services/audio/tts/SpeechSynthesizer", payload, { timeout: 9e4 });
  const url = data && data.output && data.output.audio && data.output.audio.url;
  if (!url) throw new Error("直连合成未返回音频 URL: " + JSON.stringify(data).slice(0, 300));
  return { url, raw: data };
},
async _sfAsr(model, body) {
  if (!body.audio) throw new Error("请先上传音频文件");
  const blob = await this._fetchAudioBlob(body.audio);
  const fd = new FormData();
  fd.append("file", blob, "audio");
  fd.append("model", model.modelId);
  const data = await this._directReq("POST", "/v1/audio/transcriptions", fd, { sf: true, timeout: 12e4 });
  const text = data && data.text;
  if (typeof text !== "string") throw new Error("直连转写未返回文本: " + JSON.stringify(data).slice(0, 200));
  return { text, raw: data };
},
async _dsAsr(model, body) {
  if (!body.audio) throw new Error("请先上传音频文件");
  /* IMPL-96③：允许 dataURI（麦克风录音 WAV → 裸 base64 供百炼 input_audio.data） */
  if (!/^(https?:\/\/|data:audio)/i.test(body.audio)) throw new Error("音频地址无效，请重新上传");
  const audioData = /^data:audio/i.test(body.audio) ? body.audio.slice(body.audio.indexOf(",") + 1) : body.audio;
  const content = [{ type: "input_audio", input_audio: { data: audioData } }];
  const payload = { model: model.modelId, messages: [{ role: "user", content }], stream: false };
  if (body.language && body.language !== "auto") payload.asr_options = { language: body.language };
  if (body.enable_itn !== "" && body.enable_itn != null) payload.asr_options = Object.assign(payload.asr_options || {}, { enable_itn: body.enable_itn === "true" || body.enable_itn === true });
  const data = await this._directReq("POST", "/compatible-mode/v1/chat/completions", payload, { timeout: 12e4 });
  const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (typeof text !== "string") throw new Error("直连转写未返回文本: " + JSON.stringify(data).slice(0, 200));
  return { text, raw: data };
},
async _fetchAudioBlob(src) {
  const res = await fetch(src, { mode: "cors" });
  if (!res.ok) throw new Error("音频下载失败 HTTP " + res.status);
  return await res.blob();
},
async queryDetail(id) {
const res = await this.request("GET", `${CONFIG.DETAIL_PATH}?id=${encodeURIComponent(id)}`);
return this.normalizeResponse(res);
},
async llmChatStream(messages, opts) {
const { temperature = 0.5, maxTokens = 1024, signal, onDelta, onThink, onActivity, thinking, _forceModel, tag, model: modelOpt, onUsage } = opts || {}; /* IMPL-157：onActivity=字节级存活信号（任意 chunk/事件），看门狗据此续命——此前只认内容增量，慢 prefill/心跳上游被 15s 看门狗误杀。R19：+onUsage 可选回调（用量回传，见下方 rec） */
const endpoints = Store.llmEndpoints();
if (!endpoints.length) throw this._llmErr("技能端点未配置——请解锁保险箱（配置 Worker 地址后自动连接），或把交付件 worker-llm-chat-route.js 挂入生产 Worker", true);
/* IMPL-100：发送前结构规范化——连续 user（讨论模式指令注入）/散落 system/空消息 一次收口，
   防 GLM 系严格校验 400 code 20015（"after user message, next must be assistant or tool message"） */
messages = normalizeChatMsgs(messages);
if (!messages.length) throw this._llmErr("消息内容为空——请先填写想法或上传素材", true);
const wantThink = thinking !== undefined ? !!thinking : Store.getSkillThinking();
// 带图自动切视觉：所选模型无视觉能力时本轮临时改发千问视觉旗舰（IMPL-68）
// IMPL-71：识图→思考接棒/多模型会诊的编排已上提到 SkillSession._sendTurn（需多段流式渲染+看门狗/会话态），传输层回归单一职责
// 79-c(a)：视觉判定收口 isVisionModelName（"auto"=上游智能路由视为可看图→不切；与 SkillSession._prepareMsgs/_docTargetVision 单处维护）
const hasImg = messages.some(m => Array.isArray(m.content) && m.content.some(p => p && (p.type === "image_url" || p.type === "image")));
let model = modelOpt || _forceModel || Store.getSkillModel();
if (hasImg && !isVisionModelName(model)) {
model = "dashscope:qwen3-vl-plus";
if (!this._visionHintShown) { this._visionHintShown = true; Toast.info("当前模型不支持图片——本轮已自动切换千问视觉旗舰（可在 设置 → 技能模型 调整）"); }
}
/* IMPL-72 需求②：思考能力守卫——最终 think = 意愿 && 模型能力。
   必须放在带图自动切视觉之后：qwen3-vl-plus（切视觉后的落地模型）恰是不接受 enable_thinking 的家族，
   先判后切会让守卫对切视觉场景失效（这正是「deepseek+图+思考开」报 400 的根因路径）。 */
const capable = _modelThinkCapable(model);
const think = wantThink && capable;
if (wantThink && !capable && this._thinkHintShown !== model) {
this._thinkHintShown = model;
Toast.info("当前模型不支持深度思考——本轮已按普通模式执行", 2400);
}
// 思考模式消耗思考 token：给足输出预算，避免深度思考后正文被截断（IMPL-68）
const mt = think ? Math.max(maxTokens, 4096) : maxTokens;
const token = Store.getR2AuthToken();
let lastErr = null;
/* ── 77-b Q6：LLM API 用量埋点——usage 贯穿端点链；rec() 只认首个出口（成功/最终失败各恰好记一次），AbortError 不计；端点重试只在最终成功端点记一次 ── */
const t0 = Date.now();
let usage = null, llmRecorded = false;
const rec = ok => {
if (llmRecorded) return;
llmRecorded = true;
try {
Store.pushLlmUsage({ t: Date.now(), model: model || "auto", tag: tag || "skill", p: usage?.prompt_tokens ?? null, c: usage?.completion_tokens ?? null, ms: Date.now() - t0, ok: !!ok });
} catch {}
/* ★ R19：用量回传（**可选回调**；与账本同一守卫 —— 首个出口恰好一次）。
   形状原样给（OpenAI 形态 prompt_tokens / completion_tokens）——由回调侧自行归一。
   失败 / 用户中止时 usage 为 null，回调侧自行判空。 */
try { if (typeof onUsage === "function") onUsage(usage, { model: model || "auto", ok: !!ok, ms: Date.now() - t0, tag: tag || "skill" }); } catch (_) {}
};
try {
for (let i = 0; i < endpoints.length; i++) {
try {
/* ★ R9C-APIYI-P1-4（报告 01）**实测证伪后刻意不改**：报告称 gpt-5.x/6.x 家族要求 temperature 固定 1、
   须改用 max_completion_tokens（否则 400）。实测（经生产 Worker /llm/chat）gpt-6.1-sol 与 gpt-5.6-luna
   携带 temperature 0.5 + max_tokens 均返回 HTTP 200 ⇒ 此网关不做族校验。**改反而有害**（会丢技能链既定温度）。
   证据落盘：studio/验收/R9C-APIYI-P1-4实测.txt。 */
const reqBody = { messages, stream: true, max_tokens: mt, temperature };
if (think) reqBody.thinking = true;
if (model && model !== "auto") reqBody.model = model;
const res = await fetch(endpoints[i] + (endpoints[i].includes("?") ? "&" : "?") + "token=" + encodeURIComponent(token), {
method: "POST",
headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
body: JSON.stringify(reqBody),
signal
});
/* IMPL-75 需求③：405 并入路由级降级——nginx「405 Not Allowed」= POST 打到 /llm/chat 未挂载的静态服务器
（用户实测：识图段经兜底端点成功，讨论段被生产 405 掐断——旧逻辑 405 不落穿，末位端点直接裸抛 nginx HTML）。
与 404 同语义：本端点路由未就绪 → 探测下一端点；末位端点才上抛可操作聚合文案（提示挂载部署，并点破「非欠费」） */
if (res.status === 404 || res.status === 405) {
lastErr = new Error("端点路由未就绪（HTTP " + res.status + "）");
if (i < endpoints.length - 1) continue;
throw this._llmErr("技能服务路由未挂载（HTTP " + res.status + (res.status === 405 ? " · POST 被网关以「方法不允许」拒绝，多为 /llm/chat 未部署被静态服务器接管" : "") + "）——不是欠费（欠费/限流表现为 401/429 的 JSON）。请到 Cloudflare Dashboard 把 worker-llm-chat-route.js 或合并版 worker 粘贴进 ai-media-proxy 并 Deploy；挂载前可在沙箱预览中使用（自动走兜底端点）", true);
}
if (res.status === 401 || res.status === 403) throw this._llmErr("Worker 令牌无效——请到设置或保险箱更新 AUTH_TOKEN", true);
if (res.status === 429) {
/* ★★ R95-1-4（报告 01 P1-3）：官方口径 429 = 「限流 **或** 额度/余额不足」，**不该猜死** ——
   旧文案「今日技能额度已用完」把两种可能说成一种，用户会照着错的去等待/充值。优先用上游原话，兜底给中性描述。 */
let msg = "技能服务限流或额度不足（HTTP 429）——请稍后重试；若持续出现请检查账户额度";
try { const j = await res.json(); msg = (j && j.error && j.error.message) || msg; } catch (e) {}
throw this._llmErr(msg, true);
}
if (!res.ok) {
let detail = "";
try { detail = (await res.text()).slice(0, 160); } catch (e) {}
/* IMPL-75：网关 HTML 错误页对用户无意义——消毒为中文提示，不再整段 <html> 糊脸 */
if (/<html[\s>]|<!doctype/i.test(detail)) detail = "网关返回 HTML 错误页（非 JSON）——多为路由未挂载或网关拦截";
throw this._llmErr("技能服务错误 HTTP " + res.status + (detail ? "：" + detail : ""), i >= endpoints.length - 1);
}
const ct = (res.headers.get("content-type") || "").toLowerCase();
if (!res.body || ct.includes("application/json")) {
const j = await res.json().catch(() => null);
if (onActivity) { try { onActivity(); } catch (e) {} } /* IMPL-157：非流式分支响应到达同样续命 */
if (j?.usage) usage = j.usage;
const txt = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content || "";
if (!txt) throw this._llmErr("技能服务返回为空", i >= endpoints.length - 1);
if (onDelta) onDelta(txt);
rec(true);
return;
}
const reader = res.body.getReader();
const dec = new TextDecoder;
let sbuf = "";
for (;;) {
const { done, value } = await reader.read();
if (done) break;
if (onActivity && value && value.length) { try { onActivity(); } catch (e) {} } /* IMPL-157：字节级存活续命 */
sbuf += dec.decode(value, { stream: true });
let nl;
while ((nl = sbuf.indexOf("\n")) !== -1) {
const line = sbuf.slice(0, nl).trim();
sbuf = sbuf.slice(nl + 1);
if (!line.startsWith("data:")) continue;
const payload = line.slice(5).trim();
if (payload === "[DONE]") { rec(true); return; }
try {
const j = JSON.parse(payload);
if (j.usage) usage = j.usage;
const delta = j?.choices?.[0]?.delta || {};
// 思考模型：reasoning_content 增量 = 思考中信号（只做看门狗续命/提示，不进正文）
if (delta.reasoning_content && onThink) onThink(delta.reasoning_content);
const d = delta.content || "";
if (d && onDelta) onDelta(d);
} catch (e) {}
}
}
/* IMPL-74（74-c P2-7）：冲洗缓冲区残留的最后事件——上游无尾换行时最后一段 delta 会滞留 sbuf 丢失 */
if (sbuf.trim().startsWith("data:")) {
const payload = sbuf.trim().slice(5).trim();
if (payload === "[DONE]") { rec(true); return; }
try {
const j = JSON.parse(payload);
if (j.usage) usage = j.usage;
const delta = j?.choices?.[0]?.delta || {};
if (delta.reasoning_content && onThink) onThink(delta.reasoning_content);
const d = delta.content || "";
if (d && onDelta) onDelta(d);
} catch (e) {}
}
rec(true);
return;
} catch (e) {
if (signal && signal.aborted) { const err = new Error("aborted"); err.name = "AbortError"; throw err; }
if (e && e.noRetry) throw e;
// fetch 网络层失败（TypeError: Failed to fetch）：本地 file:// / 断网 / CORS 被拒时
// 原始英文报错对用户无意义，包裹为可操作中文指引
if (e instanceof TypeError && /fetch/i.test(e.message || "")) {
let isFile = false;
try { isFile = location.protocol === "file:"; } catch (err) {}
e = this._llmErr(isFile
? "无法连接技能服务（file:// 本地打开）——请把交付件 worker-llm-chat-route.js 挂入你的生产 Worker 后使用（保险箱解锁状态下自动连接）"
: "无法连接技能服务（网络层失败）——请检查网络连接后重试", i >= endpoints.length - 1);
}
lastErr = e;
if (i >= endpoints.length - 1) throw e;
}
}
throw lastErr || this._llmErr("技能服务不可用", true);
} finally {
/* 未走成功出口且非用户中止 = 端点链最终失败 → 记一次错误（ok:false） */
if (!llmRecorded && !(signal && signal.aborted)) rec(false);
}
},
/* 模型清单（IMPL-68）：GET /llm/models，端点链与 llmChatStream 同构（生产优先→沙箱兜底） */
async llmFetchModels() {
const endpoints = Store.llmEndpoints();
if (!endpoints.length) throw this._llmErr("技能端点未配置——请解锁保险箱（配置 Worker 地址后自动连接）", true);
const token = Store.getR2AuthToken();
let lastErr = null;
for (let i = 0; i < endpoints.length; i++) {
try {
const url = endpoints[i].replace(/\/llm\/chat(\?.*)?$/, "/llm/models$1");
const res = await fetch(url + (url.includes("?") ? "&" : "?") + "token=" + encodeURIComponent(token), { headers: { "Authorization": "Bearer " + token } });
if (res.status === 404) { lastErr = new Error("端点未部署（HTTP 404）"); continue; }
if (!res.ok) { lastErr = new Error("HTTP " + res.status); continue; }
const j = await res.json().catch(() => null);
if (!j || !j.ok || !j.providers) { lastErr = new Error("响应格式异常"); continue; }
return j;
} catch (e) { lastErr = e; }
}
throw lastErr || new Error("模型清单不可用");
},
_llmErr(msg, noRetry) {
const err = new Error(msg);
if (noRetry) err.noRetry = true;
return err;
},
uploadToR2(file, onProgress, _retryCount = 0, _cacheScope = "") {
const cacheKey = _cacheScope + "|" + file.name + "|" + file.size + "|" + (file.lastModified || 0);
if (this._uploadCache.has(cacheKey)) {
return Promise.resolve(this._uploadCache.get(cacheKey));
}
return new Promise((resolve, reject) => {
const workerUrl = Store.getR2WorkerUrl();
const token = Store.getR2AuthToken();
if (!workerUrl || !token) {
reject(new Error("R2 未配置：请在设置中填写 Worker URL 和 Auth Token"));
return;
}
const url = workerUrl.replace(/\/$/, "") + "/upload?token=" + encodeURIComponent(token);
const xhr = new XMLHttpRequest;
xhr.open("POST", url);
xhr.upload.onprogress = e => {
if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total);
};
xhr.onload = () => {
if (xhr.status >= 200 && xhr.status < 300) {
try {
const d = JSON.parse(xhr.responseText);
const fileUrl = d.url || d.fileUrl || d.publicUrl;
if (fileUrl && /^https?:\/\//.test(fileUrl)) {
this._uploadCache.set(cacheKey, fileUrl);
resolve(fileUrl);
} else if (fileUrl) {
/* 76-b P1-4：PUBLIC_BASE_URL 未配时 Worker 返回 r2:// —— 原逻辑照单全收后被前端 ^https?:// 过滤静默丢弃，识图无声降级为纯文本 */
reject(new Error("R2 未配置公网域名：返回 “" + String(fileUrl).slice(0, 40) + "” 无法作为图片 URL 使用——请为 R2 绑定公网访问域名并在 Worker 配置 PUBLIC_BASE_URL"));
} else {
reject(new Error("R2 返回缺少 URL"));
}
} catch {
reject(new Error("R2 返回格式错误"));
}
} else {
reject(new Error(`R2 上传失败: HTTP ${xhr.status}`));
}
};
xhr.onerror = () => {
if (_retryCount < 2) {
const delay = 2e3 * (_retryCount + 1);
setTimeout(() => {
this.uploadToR2(file, onProgress, _retryCount + 1, _cacheScope).then(resolve).catch(reject);
}, delay);
} else {
reject(new Error("R2 上传失败（已重试3次），请检查网络或更换自定义域名"));
}
};
xhr.ontimeout = () => {
if (_retryCount < 2) {
setTimeout(() => {
this.uploadToR2(file, onProgress, _retryCount + 1, _cacheScope).then(resolve).catch(reject);
}, 2e3);
} else {
reject(new Error("R2 上传超时（已重试3次），请检查网络"));
}
};
xhr.timeout = 12e4;
const fd = new FormData;
fd.append("file", file);
xhr.send(fd);
});
},
fixUrl(url) {
if (typeof url !== "string") return url;
return url.replace(/^http:\/\/(wywxopenai\.oss[^/]+|[^/]*aliyuncs\.com)\//i, "https://$1/");
},
extractUrl(data) {
if (!data) return null;
const obj = typeof data === "string" ? (() => {
try {
return JSON.parse(data);
} catch {
return data;
}
})() : data;
const isUrl = s => typeof s === "string" && ((/^https?:\/\/\S+/i.test(s) && s.length < 4e3) || /^blob:/i.test(s) || (/^data:image\//i.test(s) && s.length < 3e6));
const keys = [ "url", "video_url", "image_url", "audio_url", "result", "result_url", "demo_audio", "file_url", "download_url", "output_url", "video", "image", "audio", "media_url", "output" ];
for (const k of keys) {
if (isUrl(obj?.[k])) return this.fixUrl(obj[k]);
if (Array.isArray(obj?.[k])) {
const u = obj[k].find(isUrl);
if (u) return this.fixUrl(u);
}
}
if (obj?.data) {
const nested = typeof obj.data === "string" ? (() => {
try {
return JSON.parse(obj.data);
} catch {
return obj.data;
}
})() : obj.data;
for (const k of keys) {
if (isUrl(nested?.[k])) return this.fixUrl(nested[k]);
if (Array.isArray(nested?.[k])) {
const u = nested[k].find(isUrl);
if (u) return this.fixUrl(u);
}
}
if (isUrl(nested)) return this.fixUrl(nested);
}
if (obj?.outputs) {
if (Array.isArray(obj.outputs)) {
for (const it of obj.outputs) {
if (isUrl(it)) return this.fixUrl(it);
if (typeof it === "object") {
const u = this.extractUrl(it);
if (u) return this.fixUrl(u);
}
}
} else if (typeof obj.outputs === "object") return this.fixUrl(this.extractUrl(obj.outputs));
}
return this.fixUrl(this._deepFindUrl(obj));
},
_deepFindUrl(obj, depth = 0) {
if (!obj || depth > 8) return null;
const isUrl = s => typeof s === "string" && ((/^https?:\/\/\S+/i.test(s) && s.length < 4e3) || /^blob:/i.test(s) || (/^data:image\//i.test(s) && s.length < 3e6));
if (typeof obj === "string") return isUrl(obj) ? obj : null;
if (Array.isArray(obj)) {
for (const it of obj) {
const u = this._deepFindUrl(it, depth + 1);
if (u) return u;
}
return null;
}
if (typeof obj === "object") {
for (const [k, v] of Object.entries(obj)) {
if (/url|file|output|result|media|video|image|audio/i.test(k) && isUrl(v)) return v;
const u = this._deepFindUrl(v, depth + 1);
if (u) return u;
}
}
return null;
},
dataUrlToBlob(dataUrl) {
const [meta, b64] = dataUrl.split(",");
const mime = meta.match(/:(.*?);/)[1];
const bin = atob(b64);
const arr = new Uint8Array(bin.length);
for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
return new Blob([ arr ], {
type: mime
});
},
};

/* ═══════════ R76 宿主辅助函数（注入到主块 `const ThumbService = {` 之前）═══════════
   为什么独立成文件：生成器模板串里**禁写反引号**（铁规矩 32，已踩 7 次）—— 大段代码走 readFileSync。 */

/* ★★★ R76-A：从 **blob** 生成缩略图
   与既有 ThumbService._makeImageThumb 的关键区别：**不经过 URL**。
   ThumbService 用 `img.crossOrigin = "anonymous"` 读 **r2.dev URL** —— 而 R2 公开域**不返回 ACAO**
   （实测：`probe_r2_readable.py`），⇒ img.onerror ⇒ makeThumb 恒 null ⇒ 缩略图**从未生效**，
   列表/历史一直加载**原图**（1~4 MB/张）。
   改用 blob（`URL.createObjectURL`）后**同源**，既不需要 CORS，canvas 也不会被污染，toBlob 可用。 */
function _r76ThumbFromBlob(srcBlob, maxEdge, quality) {
  return new Promise(function (resolve) {
    try {
      if (!srcBlob || !/^image\//i.test(srcBlob.type || "")) return resolve(null);
      const _u = URL.createObjectURL(srcBlob);
      let _done = false;
      const finish = function (v) {
        if (_done) return;
        _done = true;
        try { URL.revokeObjectURL(_u); } catch (_e) {}
        resolve(v);
      };
      const img = new Image();
      img.onload = function () {
        try {
          const w0 = img.naturalWidth || 0;
          const h0 = img.naturalHeight || 0;
          const mx = Math.max(w0, h0);
          if (!mx) return finish(null);
          const k = Math.min(1, (maxEdge || 640) / mx);
          const c = document.createElement("canvas");
          c.width = Math.max(1, Math.round(w0 * k));
          c.height = Math.max(1, Math.round(h0 * k));
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          c.toBlob(function (b) { finish(b || null); }, "image/webp", quality || 0.8);
        } catch (_e) { finish(null); }
      };
      img.onerror = function () { finish(null); };
      img.src = _u;
      setTimeout(function () { finish(null); }, 8000);
    } catch (_e) { resolve(null); }
  });
}

/* ★★ R76-G：历史条目瘦身 —— 实测 `model` 占单条 JSON 的 **67%**（云端历史真机实测 2049 B/条，model 1.3 KB）。
   只保留**确实被读取**的字段（全站 grep 实证：type / name / id / seg / endpoint 五个，
   外加 channel 与 billing 供价签显示）⇒ 500 条从 ~823 KB 降到 ~300 KB。 */
function _r76SlimHistory(item) {
  try {
    if (!item || !item.model || typeof item.model !== "object") return item;
    const m = item.model;
    if (m.ratios || m.sizes || m.desc) {
      const slim = { id: m.id, name: m.name, type: m.type };
      if (m.channel) slim.channel = m.channel;
      if (m.seg) slim.seg = m.seg;
      if (m.endpoint) slim.endpoint = m.endpoint;
      if (m.billing) slim.billing = m.billing;
      return Object.assign({}, item, { model: slim });
    }
    return item;
  } catch (_e) { return item; }
}

/* ★★ R76-J：跨会话失效记录清扫
   `blob:` 是**本页内存句柄**（铁规矩 67）：刷新后必然失效。
   R74 之前产生的历史里存的就是 blob: ⇒ 刷新后 `<img>` 加载失败、点编辑 `fetch(blob:)` 抛
   「Failed to fetch」，而用户无从判断"为什么坏"。
   这里在启动时把**必然失效**的（blob: 且完成时间早于本次加载）标记出来并清空 url，
   让渲染走"无图"分支 —— 不再尝试加载、也不再弹错。 */
function _r76HistorySweep() {
  try {
    const bootAt = window.__r76BootAt || Date.now();
    const hist = Store.getHistory();
    let n = 0;
    hist.forEach(function (h) {
      const r = h && h.result;
      if (!r || typeof r.url !== "string") return;
      if (r.url.indexOf("blob:") !== 0) return;
      if ((h.completedAt || h.createdAt || 0) >= bootAt) return;
      r.expiredUrl = r.url;
      r.expired = true;
      r.url = "";
      n++;
    });
    if (n) {
      Store.saveHistory(hist);
      console.info("[R76] 已标记 " + n + " 条跨会话失效的 blob 结果（图片本体已随会话销毁，无法恢复）");
    }
    const tasks = Store.getTasks();
    let m = 0;
    tasks.forEach(function (t) {
      const r = t && t.result;
      if (!r || typeof r.url !== "string" || r.url.indexOf("blob:") !== 0) return;
      if ((t.completedAt || t.createdAt || 0) >= bootAt) return;
      r.expiredUrl = r.url;
      r.expired = true;
      r.url = "";
      m++;
    });
    if (m) Store.saveTasks(tasks);
  } catch (_e) {}
}

try { window.__r76BootAt = Date.now(); } catch (_e) {}

const ThumbService = {
THUMB_SIZE: 640,
THUMB_QUALITY: .8,
_queue: [],
_activeCount: 0,
_timestamps: [],
_memCache: new Map,
async makeThumb(source, type) {
try {
if (type === "image") return await this._makeImageThumb(source);
if (type === "video") return await this._makeVideoThumb(source);
return null;
} catch (e) {
console.warn("[ThumbService] makeThumb failed:", e);
return null;
}
},
_makeImageThumb(source) {
return new Promise(resolve => {
const img = new Image;
img.crossOrigin = "anonymous";
img.onload = () => {
try {
const canvas = this._buildCanvas(img.naturalWidth || img.width, img.naturalHeight || img.height);
const ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
this._canvasToBlob(canvas, this.THUMB_QUALITY).then(b => resolve(b));
} catch (e) {
resolve(null);
}
};
img.onerror = () => resolve(null);
img.src = source;
setTimeout(() => resolve(null), 8e3);
});
},
_makeVideoThumb(source) {
return new Promise(resolve => {
const video = document.createElement("video");
video.muted = true;
video.crossOrigin = "anonymous";
video.preload = "metadata";
video.playsInline = true;
let settled = false;
const finish = blob => {
if (settled) return;
settled = true;
cleanup();
resolve(blob);
};
const cleanup = () => {
video.removeAttribute("src");
try {
video.load();
} catch {}
};
const timer = setTimeout(() => finish(null), 3e3);
video.addEventListener("loadeddata", () => {
try {
const dur = video.duration && isFinite(video.duration) ? video.duration : 0;
const seekTo = dur > 1 ? 1 : dur > 0 ? dur / 2 : 0;
video.currentTime = Math.min(seekTo, dur || 0);
} catch (e) {
finish(null);
}
});
video.addEventListener("seeked", () => {
try {
const canvas = this._buildCanvas(video.videoWidth, video.videoHeight);
const ctx = canvas.getContext("2d");
ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
this._canvasToBlob(canvas, this.THUMB_QUALITY).then(b => {
clearTimeout(timer);
finish(b);
});
} catch (e) {
clearTimeout(timer);
finish(null);
}
});
video.addEventListener("error", () => {
clearTimeout(timer);
finish(null);
});
video.src = source;
});
},
_buildCanvas(natW, natH) {
const W = Math.max(1, natW || 0), H = Math.max(1, natH || 0);
const longSide = Math.max(W, H);
const scale = longSide > this.THUMB_SIZE ? this.THUMB_SIZE / longSide : 1;
const cw = Math.max(1, Math.round(W * scale));
const ch = Math.max(1, Math.round(H * scale));
const canvas = document.createElement("canvas");
canvas.width = cw;
canvas.height = ch;
return canvas;
},
_canvasToBlob(canvas, quality) {
return new Promise(resolve => {
try {
canvas.toBlob(b => resolve(b), "image/webp", quality);
} catch (e) {
resolve(null);
}
});
},
_thumbQueueKey(record) {
return record.id || record.result?.url || "";
},
async ensureThumb(record) {
try {
const result = record.result || {};
const url = result.url;
if (!url) return null;
if (this._failAt && this._failAt[url] && Date.now() - this._failAt[url] < 3e5) return url; /* IMPL-160：失败负缓存 5min——恒失败图源（crossOrigin 非 CORS 等）不再随每次 _renderTaskList 重放 ≤10 张全图解码 */
if (this._memCache.has(url)) return this._memCache.get(url);
if (window._thumbDB) {
try {
const cached = await window._thumbDB.thumbs.get(url);
if (cached && cached.thumbUrl) {
this._memCache.set(url, cached.thumbUrl);
return cached.thumbUrl;
}
} catch (e) {}
}
if (result.thumbUrl) {
this._memCache.set(url, result.thumbUrl);
if (window._thumbDB) {
try {
await window._thumbDB.thumbs.put({
url: url,
thumbUrl: result.thumbUrl,
ts: Date.now()
});
} catch (e) {}
}
return result.thumbUrl;
}
const workerUrl = Store.getR2WorkerUrl();
const token = Store.getR2AuthToken();
if (!workerUrl || !token) return url;
const type = record.model?.type === "video" ? "video" : record.model?.type === "audio" ? null : "image";
if (!type) return url;
const blob = await this.makeThumb(url, type);
if (!blob) { (this._failAt = this._failAt || {})[url] = Date.now(); return url; }
const thumbFile = new File([ blob ], "thumb_" + (record.id || Date.now()) + ".webp", {
type: "image/webp"
});
const thumbUrl = await this._uploadThumb(thumbFile);
if (!thumbUrl) return url;
this._memCache.set(url, thumbUrl);
if (window._thumbDB) {
try {
await window._thumbDB.thumbs.put({
url: url,
thumbUrl: thumbUrl,
ts: Date.now()
});
} catch (e) {}
}
return thumbUrl;
} catch (e) {
console.warn("[ThumbService] ensureThumb failed:", e);
return record.result?.url || null;
}
},
_uploadThumb(file) {
return new Promise(resolve => {
try {
const workerUrl = Store.getR2WorkerUrl();
const token = Store.getR2AuthToken();
if (!workerUrl || !token) {
resolve(null);
return;
}
const sep = workerUrl.includes("?") ? "&" : "?";
const url = workerUrl.replace(/\/$/, "") + "/upload" + sep + "token=" + encodeURIComponent(token) + "&dir=thumb";
const xhr = new XMLHttpRequest;
xhr.open("POST", url);
xhr.timeout = 3e4;
xhr.onload = () => {
if (xhr.status >= 200 && xhr.status < 300) {
try {
const d = JSON.parse(xhr.responseText);
const u = d.url || d.fileUrl || d.publicUrl;
resolve(u || null);
} catch {
resolve(null);
}
} else resolve(null);
};
xhr.onerror = () => resolve(null);
xhr.ontimeout = () => resolve(null);
const fd = new FormData;
fd.append("file", file);
xhr.send(fd);
} catch (e) {
resolve(null);
}
});
},
async lazyEnsureThumb(record, onUpdate) {
const key = this._thumbQueueKey(record);
if (!key) return;
const now = Date.now();
this._timestamps = this._timestamps.filter(t => now - t < 6e4);
if (this._timestamps.length >= 10) return;
if (this._queue.includes(key)) return;
if (record.result?.thumbUrl) return;
this._queue.push(key);
this._timestamps.push(now);
setTimeout(async () => {
this._queue = this._queue.filter(k => k !== key);
try {
const thumbUrl = await this.ensureThumb(record);
if (thumbUrl && thumbUrl !== record.result?.url) {
record.result = record.result || {};
record.result.thumbUrl = thumbUrl;
if (typeof Store !== "undefined" && record.id) {
const hist = Store.getHistory();
const h = hist.find(x => x.id === record.id);
if (h) {
h.result = h.result || {};
h.result.thumbUrl = thumbUrl;
Store.saveHistory(hist);
}
}
if (typeof onUpdate === "function") onUpdate(record);
}
} catch (e) {}
}, 50 + this._activeCount * 100);
}
};

/* ★★ R77（2026-10-07）任务卡「轮询 N 次」的正确语义
   ─────────────────────────────────────────────────────────────────────────
   真因（修反馈原话：「我为啥轮询总是0次 结果出不来」）：
   那个数字来自**本地轮询器** `poller.getPollCount(task.id)`，而它只统计
   `poller.start(task)` 启动过的任务。以下两种任务**从不**启动本地轮询器：

     ① APIYI 档（`async:false`）—— 走 R76-E 的同步卡片，压根没有轮询器；
     ② 速创档走任务中心时 —— `handleGenerate` 里 `useTaskCenter===true` 分支
        刻意不调 `poller.start`（IMPL-157：tc_ 任务由任务中心 5s 监视通道跟踪）。

   ⇒ 这两种情况下计数器**恒为 0**，而 UI 无条件渲染「轮询 0 次」
     —— 看起来像进度卡死了。实际任务可能正在正常跑。

   修法：按任务**实际走的路**给文案 —— 有本地轮询器才显示次数，否则说清现状。 */
function _r77PollLabel(task) {
  try {
    if (!task) return "生成中";
    if (poller.getStartTime(task.id)) return "轮询 " + (poller.getPollCount(task.id) || 0) + " 次";
    if (task._r76Api) return "生成中";
    if (task.dispatchedVia === "taskcenter" || /^tc_/.test(String(task.apiId || ""))) return "任务中心监视中";
    return "生成中";
  } catch (_e) { return "生成中"; }
}

class PollManager {
constructor() {
this.timers = {};
this.polls = {};
this.failCount = {};
}
getPhaseInterval(elapsed) {
for (const p of CONFIG.POLL_PHASES) {
if (elapsed < p.until) return p.interval;
}
return CONFIG.POLL_PHASES[CONFIG.POLL_PHASES.length - 1].interval;
}
getPhaseName(elapsed) {
for (const p of CONFIG.POLL_PHASES) {
if (elapsed < p.until) return p.name;
}
return CONFIG.POLL_PHASES[CONFIG.POLL_PHASES.length - 1].name; /* ★ R96-3-3：与 getPhaseInterval 同款兜底 */
}
start(task) {
this.stop(task.id);
const startTime = Date.now();
this.polls[task.id] = {
task: task,
startTime: startTime,
lastPoll: 0,
stopped: false,
pollCount: 0
};
this._scheduleNext(task.id);
}
_scheduleNext(taskId) {
const p = this.polls[taskId];
if (!p || p.stopped) return;
const elapsed = Date.now() - p.startTime;
if (elapsed > CONFIG.POLL_TIMEOUT) {
this._onResult(taskId, {
status: "timeout"
});
return;
}
const interval = this.getPhaseInterval(elapsed);
this.timers[taskId] = setTimeout(() => this._poll(taskId), interval);
}
async _poll(taskId) {
const p = this.polls[taskId];
if (!p || p.stopped) return;
p.lastPoll = Date.now();
p.pollCount = (p.pollCount || 0) + 1;
try {
const detail = await Api.queryDetail(p.task.apiId);
const statusNum = Number(detail.status);
const statusStr = String(detail.status || "").toLowerCase();
if (statusNum === 2 || statusStr === "succeeded" || statusStr === "success" || statusStr === "completed") {
const resultUrl = Api.extractUrl(detail) || detail.url || detail.output || detail.result;
this._onResult(taskId, {
status: "succeeded",
data: {
...detail,
url: resultUrl
}
});
} else if (statusNum === 3 || statusStr === "failed" || statusStr === "error") {
this._onResult(taskId, {
status: "failed",
error: detail.message || detail.error || detail.msg || "生成失败"
});
} else if (statusStr === "timeout") {
this._onResult(taskId, {
status: "timeout"
});
} else {
UI.updateTaskCardPhase(taskId, this.getPhaseName(Date.now() - p.startTime));
this._scheduleNext(taskId);
}
} catch (e) {
this.failCount[taskId] = (this.failCount[taskId] || 0) + 1;
if (e.status === 429) {
const delay = e.retryAfter ? e.retryAfter * 1e3 : Math.min(6e4, 1e4 * Math.pow(2, this.failCount[taskId]));
this.timers[taskId] = setTimeout(() => this._poll(taskId), delay);
} else if (this.failCount[taskId] >= CONFIG.POLL_FAIL_LIMIT) {
this._onResult(taskId, {
status: "failed",
error: e.message
});
} else {
this._scheduleNext(taskId);
}
}
}
_onResult(taskId, result) {
const p = this.polls[taskId];
if (!p) return;
this.stop(taskId);
UI.onTaskResult(taskId, result);
}
stop(taskId) {
if (this.timers[taskId]) {
clearTimeout(this.timers[taskId]);
delete this.timers[taskId];
}
if (this.polls[taskId]) {
this.polls[taskId].stopped = true;
delete this.polls[taskId]; /* IMPL-160：终态任务全对象（prompt/body/result，单条 1-5KB）不再整会话驻留——_scheduleNext/_poll 对 !p 即 return，语义等价 stopped */
delete this.failCount[taskId];
}
}
manualStop(taskId) {
this.stop(taskId);
/* IMPL-157：任务中心任务停止时同步请求 Worker 侧取消——此前只停本地轮询，上游继续生成继续计费（best-effort 不阻塞 UI） */
try {
const _mt = Store.getTasks().find(x => x.id === taskId);
if (_mt && (_mt.dispatchedVia === "taskcenter" || /^tc_/.test(String(_mt.apiId || "")))) TaskCenter.cancel(taskId).catch(() => {});
} catch (e) {}
UI.onTaskResult(taskId, {
status: "failed",
error: "已手动停止"
});
}
getPollCount(taskId) {
return this.polls[taskId]?.pollCount || 0;
}
getStartTime(taskId) {
return this.polls[taskId]?.startTime || 0;
}
async manualRefresh(taskId) {
const p = this.polls[taskId];
if (!p) return;
if (this.timers[taskId]) {
clearTimeout(this.timers[taskId]);
delete this.timers[taskId];
}
await this._poll(taskId);
}
resumeAll() {
/* IMPL-104（D-1）：重构——超时态就地改写并落盘（此前改的是解析副本永不持久，任务卡死 processing）；超时/终态补历史统一按 id 去重（此前每次 boot 幻影超时记录堆积 1→2→3） */
const tasks = Store.getTasks();
const now = Date.now();
const histIds = new Set(Store.getHistory().map(h => h.id));
const addOnce = t => {
if (histIds.has(t.id)) return;
histIds.add(t.id);
Store.addHistory({
id: t.id,
model: t.model,
prompt: t.prompt,
body: t.body,
status: t.status,
createdAt: t.createdAt,
completedAt: t.completedAt || Date.now(),
result: t.result,
error: t.error,
cost: t.cost
});
};
let expired = 0, _r9bZombie = 0;
tasks.forEach(t => {
if (t.status !== "processing") { addOnce(t); return; }
if (now - (t.createdAt || 0) > CONFIG.POLL_TIMEOUT) {
t.status = "timeout";
t.completedAt = now;
expired++;
addOnce(t);
return;
}
/* IMPL-157（P0）：任务中心任务（apiId=Worker 侧 tc_ id）绝不本地直连轮询——上游 detail 必回「错误的ID」，
   连续 5 次=把进行中的任务误标 failed（刷新页面后本函数曾整批触发，全部异步模型同病）；改挂任务中心监视通道 */
if (t.dispatchedVia === "taskcenter" || /^tc_/.test(String(t.apiId || ""))) {
TaskCenter.reattach(t);
return;
}
if (t.apiId) this.start(t);
else {
  /* ★ R9B-UX-P2-6：既非任务中心、又没有 apiId ⇒ 这条 processing 是"同步请求途中被关页"留下的，
     本地没有任何东西能推进它 ⇒ 原实现让它**永远转圈**（钱可能已计费）。判 failed 并给可操作说明。 */
  t.status = "failed";
  t.error = "任务在等待结果时被中断（页面关闭或刷新）—— 上游可能已计费，结果可能仍在：可按需重新生成，或用历史记录核对";
  t.completedAt = now;
  _r9bZombie++;
  addOnce(t);
}
});
if (expired || _r9bZombie) Store.saveTasks(tasks.filter(t => t.status === "processing"));
}
}

const poller = new PollManager;

const TaskCenter = {
enabled: false,
workerUrl: "",
token: "",
pollTimer: null,
listeners: {
result: [],
error: [],
progress: []
},
_submitted: new Map,
init() {
this.workerUrl = (Store.getTaskCenterUrl() || "").trim().replace(/\/$/, "");
this.token = (Store.getTaskCenterToken() || "").trim();
if (!this.workerUrl || !this.token) {
this.enabled = false;
return Promise.resolve(false);
}
return this._testConnectivity().then(ok => {
this.enabled = ok;
if (ok) {
Toast.info("任务中心已连接");
this.startPolling();
} else {
Toast.warning("任务中心不可用，使用本地直连");
}
return ok;
});
},
async _testConnectivity() {
try {
const url = this.workerUrl + "/tasks?status=active&token=" + encodeURIComponent(this.token);
const ctrl = new AbortController;
const t = setTimeout(() => ctrl.abort(), 5e3);
const res = await fetch(url, {
signal: ctrl.signal
});
clearTimeout(t);
return res.ok;
} catch (e) {
return false;
}
},
async testConnection() {
const savedUrl = this.workerUrl, savedTok = this.token;
this.workerUrl = (savedUrl || "").trim().replace(/\/$/, "");
this.token = (savedTok || "").trim();
if (!this.workerUrl || !this.token) return {
ok: false,
error: "未配置 Worker URL 和 Token"
};
const ok = await this._testConnectivity();
return {
ok: ok,
error: ok ? "" : "无法连接任务中心，请检查 URL/Token 或网络"
};
},
isAvailable() {
return this.enabled && !!this.workerUrl && !!this.token;
},
async submit(task) {
const url = this.workerUrl + "/task?token=" + encodeURIComponent(this.token);
const payload = {
kind: "single",
model: task.model?.id,
modelType: task.model?.type,
endpoint: task.model?.endpoint,
body: task.body,
prompt: task.prompt || "",
cost: task.cost || null
};
const ctrl = new AbortController;
const t = setTimeout(() => ctrl.abort(), 15e3);
try {
const res = await fetch(url, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(payload),
signal: ctrl.signal
});
clearTimeout(t);
const text = await res.text();
let data;
try {
data = text ? JSON.parse(text) : {};
} catch {
data = {
raw: text
};
}
if (!res.ok) throw new Error(_errText(data.error) || _errText(data.message) || `HTTP ${res.status}`);
/* IMPL-119：Worker POST /task 返回 {task:{id:"tc…"}}——原只读顶层 id/taskId 必 throw → 已入队派发的上游任务叠加 Api.submit 直连二次提交=双倍计费，故补 task 解包 */
const id = data.id || data.taskId || data.task && (data.task.id || data.task.taskId);
if (!id) throw new Error("任务中心未返回任务 ID");
this._submitted.set(task.id, {
task: task,
lastStatus: "processing",
startTime: Date.now(),
workerId: String(id)
});
return {
id: String(id),
raw: data
};
} catch (e) {
clearTimeout(t);
throw e;
}
},
async cancel(taskId) {
const info = this._submitted.get(taskId);
if (!info) return false;
try {
const url = this.workerUrl + "/task/" + encodeURIComponent(info.workerId) + "/cancel?token=" + encodeURIComponent(this.token);
const res = await fetch(url, {
method: "POST"
});
return res.ok;
} catch (e) {
return false;
}
},
/* IMPL-157：断线/刷新恢复——把任务中心任务重新挂回监视通道（不发起新提交，仅登记 workerId 走 5s 轮询）；
   此前刷新后 resumeAll 把 tc_ apiId 当上游 id 直连 detail 轮询 → 上游「错误的ID」×5 → 进行中任务被误标 failed */
reattach(task) {
if (!task || !task.apiId) return false;
if (!/^tc_/.test(String(task.apiId))) { console.warn("[TaskCenter] reattach 拒绝非 tc_ 形态 apiId（防上游 id 误挂监视通道）:", task.apiId); return false; } /* IMPL-158：最后防线 */

if (!this._submitted.has(task.id)) {
this._submitted.set(task.id, {
task: task,
lastStatus: "processing",
startTime: task.createdAt || Date.now(),
workerId: String(task.apiId)
});
}
if (this.enabled && !this.pollTimer) this.startPolling();
return true;
},
async list() {
try {
const url = this.workerUrl + "/tasks?status=active&token=" + encodeURIComponent(this.token);
const res = await fetch(url);
if (!res.ok) return [];
const data = await res.json();
/* IMPL-119：Worker GET /tasks 返回 {active:[…],recent:[…]}——补 active 分支，原恒返空数组致轮询全走单任务兜底查询 */
return Array.isArray(data) ? data : data.tasks || data.data || data.active || [];
} catch (e) {
return [];
}
},
async listQueued() {
if (!this.isAvailable()) return {
queued: 0,
running: 0,
spentToday: 0
};
try {
const url = this.workerUrl + "/tasks?status=queued&token=" + encodeURIComponent(this.token);
const res = await fetch(url);
/* IMPL-119：Worker 返回对象非数组——补 active 计数（对象无 length 原恒 0） */
const queued = res.ok ? ((await res.json()).active || []).length || 0 : 0;
const running = Store.getTasks().filter(t => t.status === "processing").length;
const spentToday = Store.getTodaySpend();
return {
queued: queued,
running: running,
spentToday: spentToday
};
} catch (e) {
return {
queued: 0,
running: 0,
spentToday: Store.getTodaySpend()
};
}
},
startPolling() {
if (this.pollTimer) clearInterval(this.pollTimer);
this.pollTimer = setInterval(() => this._poll(), 5e3);
},
stopPolling() {
if (this.pollTimer) {
clearInterval(this.pollTimer);
this.pollTimer = null;
}
},
async _poll() {
if (!this.isAvailable()) return;
if (!this._submitted.size) return;
let activeList = [];
try {
activeList = await this.list();
} catch {
return;
}
for (const [taskId, info] of this._submitted.entries()) {
const match = activeList.find(t => String(t.id) === info.workerId || String(t.taskId) === info.workerId);
if (!match) {
try {
const url = this.workerUrl + "/task/" + encodeURIComponent(info.workerId) + "?token=" + encodeURIComponent(this.token);
const r = await fetch(url);
if (r.ok) {
const data = await r.json();
/* IMPL-119：Worker GET /task/<id> 返回 {task:{…}}——解包后再派发，原顶层找不到 resultUrl */
const rec = data.task || data;
const recStr = String((rec && rec.status) || "").toLowerCase();
const recNum = Number(rec && rec.status);
/* IMPL-158：终态校验后才派发——此前 failed/canceled 记录也被派成 succeeded(url=null) 入历史并虚增今日花费 */
if (recStr === "failed" || recStr === "error" || recStr === "canceled" || recStr === "cancelled" || recNum === 3) {
this._fire("error", { taskId: taskId, error: (rec && (rec.error || rec.message)) || "任务中心任务失败" });
this._submitted.delete(taskId);
} else if (recStr === "succeeded" || recStr === "success" || recNum === 2 || (rec && (rec.resultUrl || rec.url || rec.result))) {
this._dispatchResult(taskId, rec);
this._submitted.delete(taskId);
}
/* queued/running/未知状态：保持监视等待下一轮（不误派不误删） */
continue;
}
} catch (e) {}
if (info.lastStatus === "processing" && Date.now() - info.startTime > 3e4) {
this._fire("error", {
taskId: taskId,
error: "任务中心丢失任务"
});
this._submitted.delete(taskId);
}
continue;
}
const newStatus = String(match.status || "").toLowerCase();
if (newStatus === "succeeded" || newStatus === "success" || Number(match.status) === 2) {
this._dispatchResult(taskId, match);
this._submitted.delete(taskId);
} else if (newStatus === "failed" || newStatus === "error" || Number(match.status) === 3) {
this._fire("error", {
taskId: taskId,
error: match.message || match.error || "任务中心任务失败"
});
this._submitted.delete(taskId);
} else if (newStatus !== info.lastStatus) {
info.lastStatus = newStatus || "processing";
this._fire("progress", {
taskId: taskId,
status: newStatus,
phase: match.phase || newStatus,
steps: match.steps
});
}
}
},
_dispatchResult(taskId, data) {
/* IMPL-119：补 Worker 任务记录字段 resultUrl（activeList 直派场景整个 task 对象进来） */
let url = data.url || data.resultUrl || data.result_url || data.output_url || data.video_url || data.image_url || data.audio_url;
if (!url && data.result && typeof data.result === "string") url = data.result;
if (!url && data.outputs) url = Array.isArray(data.outputs) ? data.outputs[0] : data.outputs.url || data.outputs.video || data.outputs.image;
if (!url) {
try {
url = Api.extractUrl(data);
} catch {}
}
if (url && typeof Api === "object") url = Api.fixUrl(url);
this._fire("result", {
taskId: taskId,
status: "succeeded",
data: {
...data,
url: url
}
});
},
on(event, cb) {
if (this.listeners[event]) this.listeners[event].push(cb);
},
off(event, cb) {
if (!this.listeners[event]) return;
this.listeners[event] = this.listeners[event].filter(x => x !== cb);
},
_fire(event, payload) {
(this.listeners[event] || []).forEach(cb => {
try {
cb(payload);
} catch (e) {
console.warn("[TaskCenter] listener error:", e);
}
});
}
};

TaskCenter.on("result", payload => {
if (typeof UI !== "undefined" && UI.onTaskResult) UI.onTaskResult(payload.taskId, payload);
});

TaskCenter.on("error", payload => {
if (typeof UI !== "undefined" && UI.onTaskResult) UI.onTaskResult(payload.taskId, {
status: "failed",
error: payload.error
});
});

TaskCenter.on("progress", payload => {
if (typeof UI !== "undefined") {
if (UI.updateTaskCardPhase) {
const phase = payload.phase || payload.status || "处理中";
UI.updateTaskCardPhase(payload.taskId, phase);
}
}
});

function normalizeAndValidateApiBody(model, input) {
const body = {
...input
};
const reject = msg => ({
ok: false,
error: msg
});
/* ★ R92-A：_regen/_resubmit → Api.submit 走到这里；model 来自 task，可能没有 params */
model = (window.UI && window.UI._fullModel) ? window.UI._fullModel(model) : model;
const mid = model.id;
for (const p of model.params) {
if (p.required) {
const v = body[p.key];
if (v == null || v === "" || Array.isArray(v) && v.length === 0) {
return reject(`缺少必填参数: ${p.label}`);
}
}
}
if (mid === "nanoBanana2" || mid === "nanoBanana_pro" || mid === "gpt-image-2") {
if (body.urls && Array.isArray(body.urls) && body.urls.length > 14) return reject("参考图最多 14 张");
}
if (mid === "veo3_fast" && body.urls && Array.isArray(body.urls) && body.urls.length > 3) return reject("参考图最多 3 张");
/* IMPL-119：qwen_image_30_pro 参考图上游上限 3（百炼 I2I 1~3 图）——csv 输出原先无校验，第 4 张起 _dsImage 静默丢弃 */
if (mid === "qwen_image_30_pro") {
const urlsN = Array.isArray(body.urls) ? body.urls.length : String(body.urls || "").split(",").map(s => s.trim()).filter(Boolean).length;
if (urlsN > 3) return reject("参考图最多 3 张");
}
/* IMPL-119：wan3_video 同用 first_frame/last_frame 键——补入成对校验名单（"只填尾帧"原可提交，仅靠服务端报错） */
if (mid === "wan3" || mid === "minimax_h3" || mid === "wan3_video") {
const hasFrame = body.first_frame || body.last_frame;
const hasMedia = body.images && body.images.length || body.videos && body.videos.length || body.audios && body.audios.length;
if (hasFrame && hasMedia) return reject("首帧/尾帧与参考图/视频/音频不能同时使用");
if (body.last_frame && !body.first_frame) return reject("使用尾帧时必须同时提供首帧");
}
if (mid === "veo3_fast") {
const hasFrame = body.firstFrameUrl || body.lastFrameUrl;
const hasUrls = body.urls && body.urls.length;
if (hasFrame && hasUrls) return reject("首帧/尾帧与参考图不能同时使用");
if (body.lastFrameUrl && !body.firstFrameUrl) return reject("使用尾帧时必须同时提供首帧");
}
if (mid === "video_omni") {
if (body.video_url && body.sound === "on") return reject("使用参考视频时声音需设为 off");
if (body.lastFrameUrl && !body.firstFrameUrl) return reject("使用尾帧时必须同时提供首帧");
}
if (mid === "google_omni") {
if (body.images && body.video) return reject("参考图与参考视频不能同时使用");
}
if (mid === "video_vidu") {
if (body.subjects && body.image_url) return reject("主体图与图像参考不能同时使用");
if (body.video_url && (body.subjects || body.image_url)) return reject("视频参考与主体/图像参考不能同时使用"); /* IMPL-152：video_url 入互斥网（深度防御：工作流导入/直接调 API 不经 refGroups 面板） */
}
const urlPattern = /^https?:\/\/[^\s]+$/i;
const badScheme = /^(blob:|data:|file:)/i;
for (const p of model.params) {
const v = body[p.key];
if (v == null) continue;
if (p.type === "url" && v) {
if (badScheme.test(v)) return reject(`${p.label} 不能使用本地文件地址，请先上传`);
if (!urlPattern.test(v)) return reject(`${p.label} 格式不正确`);
}
if (p.type === "text" && v && /_(url|frame)/i.test(p.key) && badScheme.test(String(v))) {
return reject(`${p.label} 不能使用本地文件地址`);
}
if ((p.type === "ref-image" || p.type === "ref-video" || p.type === "ref-audio") && v) {
const arr = Array.isArray(v) ? v : String(v).split(",").map(s => s.trim()).filter(Boolean);
for (const u of arr) {
if (badScheme.test(u)) return reject(`${p.label} 不能使用本地文件地址，请先上传`);
}
}
}
/* IMPL-152 P0：布尔语义归一——select options 全为 "true"/"false" 的参数，收集链原样透传字符串，而上游按布尔语义解析（速创 doc/77 generate_audio 标注「布尔值」），非空字符串 "false" 恒真 → wan3「音频」选关闭仍出音频（用户实测实锤，report-a/b 双审计定案）。统一在提交边界转真布尔（同 _dsVideo audio 归一范式）；sound(on/off)/watermark(1/0) 等字符串枚举不纳入；对已布尔值幂等 */
for (const bp of model.params) {
if (bp.type === "select" && Array.isArray(bp.options) && bp.options.length > 0 && bp.options.every(bo => bo === "true" || bo === "false")) {
const bv = body[bp.key];
if (bv === "true" || bv === true) body[bp.key] = true;
else if (bv === "false" || bv === false) body[bp.key] = false;
}
}
return {
ok: true,
body: body
};
}

const Workflow = {
build(task) {
/* ★ R92-A：历史记录里的 model 可能没有 params ⇒ 原样迭代会抛"not iterable" */
const model = (window.UI && window.UI._fullModel) ? window.UI._fullModel(task.model) : task.model;
const tab = model.type;
const prompt = task.prompt || task.body?.prompt || task.body?.text || "";
const refs = {
image: [],
video: [],
audio: [],
first: null,
last: null
};
const settings = [];
const isHttp = u => typeof u === "string" && /^https?:\/\//.test(u);
const pickUrl = v => {
if (typeof v === "string") return isHttp(v) ? v : null;
if (Array.isArray(v) && v.length) return isHttp(v[0]) ? v[0] : null;
return null;
};
for (const p of model.params) {
const val = task.body?.[p.key];
if (val == null || val === "") continue;
if (p.type === "textarea") continue;
if (p.type === "ref-image") {
if (isFrameKey(p.key)) {
const u = pickUrl(val);
if (u) {
if (String(p.key).includes("last")) refs.last = u; else refs.first = u;
}
} else {
const arr = Array.isArray(val) ? val : typeof val === "string" ? val.split(",").map(s => s.trim()).filter(Boolean) : [];
refs.image.push(...arr.filter(isHttp));
}
} else if (p.type === "ref-video") {
const arr = Array.isArray(val) ? val : typeof val === "string" ? val.split(",").map(s => s.trim()).filter(Boolean) : [];
refs.video.push(...arr.filter(isHttp));
} else if (p.type === "ref-audio") {
const arr = Array.isArray(val) ? val : typeof val === "string" ? val.split(",").map(s => s.trim()).filter(Boolean) : [];
refs.audio.push(...arr.filter(isHttp));
} else {
if (model.aspectMerge && p.key === "aspectRatio" && /^\d+x\d+$/.test(String(val))) {
const dec = UI._decomposeGptAspect(model, task.body || {});
if (dec.aspectRatio) settings.push(`比例: ${dec.aspectRatio}`);
if (dec.size) settings.push(`分辨率: ${dec.size}`);
} else {
settings.push(`${p.label}: ${Array.isArray(val) ? val.join(", ") : val}`);
}
}
}
const frameFirst = model.params.find(p => isFrameKey(p.key) && String(p.key).includes("first"));
const frameLast = model.params.find(p => isFrameKey(p.key) && String(p.key).includes("last"));
if (frameFirst) {
const u = pickUrl(task.body?.[frameFirst.key]);
if (u) refs.first = u;
}
if (frameLast) {
const u = pickUrl(task.body?.[frameLast.key]);
if (u) refs.last = u;
}
const lines = [];
lines.push("# 修的媒体工作台 · 工作流 V32");
lines.push("【任务】");
lines.push(typeName(tab));
lines.push("【模型】");
lines.push(model.name);
lines.push("【提示词】");
lines.push(prompt || "（空）");
lines.push("");
lines.push("【参考素材】");
lines.push("参考图：");
if (refs.image.length) refs.image.forEach((u, i) => lines.push(`${i + 1}. ${u}`)); else lines.push("无");
lines.push("参考视频：");
if (refs.video.length) refs.video.forEach((u, i) => lines.push(`${i + 1}. ${u}`)); else lines.push("无");
lines.push("参考音频：");
if (refs.audio.length) refs.audio.forEach((u, i) => lines.push(`${i + 1}. ${u}`)); else lines.push("无");
lines.push(`首帧：${refs.first || "无"}`);
lines.push(`尾帧：${refs.last || "无"}`);
lines.push("");
lines.push("【生成设置】");
if (settings.length) settings.forEach(s => lines.push(s)); else lines.push("默认");
lines.push("");
lines.push("【AI 优化指令】");
lines.push("请先理解并分析工作流中的参考素材，再结合当前任务、模型、原始提示词与生成设置优化提示词。");
lines.push("优化时优先保留参考素材的核心主体、构图关系、视觉风格、关键特征和表达意图；除非原工作流明确要求，否则不要擅自改变模型、参考素材或生成设置。");
lines.push("若参考素材已经存在，不得删除、替换、虚构或擅自修改参考素材地址。");
lines.push("若仅需优化提示词，则只修改【提示词】内容；除非用户明确要求，不得修改模型、参考素材和其它生成参数。");
lines.push("优化完成后，请严格保持工作流 V32 的字段结构，输出完整、干净、可直接再次导入的工作流。");
lines.push("只输出最终工作流内容，不输出分析过程、修改说明、前后对比、备注或模板之外的文字。");
lines.push("# END");
return lines.join("\n");
},
parse(text) {
if (!text || typeof text !== "string") return null;
if (!/^#\s*(速创工作台|修的媒体工作台)\s*[·-]\s*工作流\s+V32/i.test(text.trim())) return null;
const result = {
type: null,
modelName: null,
prompt: "",
refs: {
image: [],
video: [],
audio: [],
first: null,
last: null
},
fields: {}
};
let section = null;
let refTarget = null;
const lines = text.split("\n");
for (let line of lines) {
const trimmed = line.trim();
if (/^【.+】$/.test(trimmed)) {
section = trimmed.replace(/[【】]/g, "");
refTarget = null;
continue;
}
if (trimmed === "# END") break;
if (section === "任务") {
if (trimmed) result.type = trimmed;
} else if (section === "模型") {
if (trimmed) result.modelName = trimmed;
} else if (section === "提示词") {
if (trimmed && trimmed !== "（空）") result.prompt += (result.prompt ? "\n" : "") + line;
} else if (section === "参考素材") {
const extractUrl = s => {
const m = String(s || "").trim().replace(/^\d+\.\s*/, "");
return /^https?:\/\/\S+/i.test(m) ? m.match(/^https?:\/\/\S+/i)[0] : null;
};
if (/^参考图[：:]/.test(trimmed)) {
refTarget = "image";
const u = extractUrl(trimmed.replace(/^参考图[：:]\s*/, ""));
if (u) result.refs.image.push(u);
} else if (/^参考视频[：:]/.test(trimmed)) {
refTarget = "video";
const u = extractUrl(trimmed.replace(/^参考视频[：:]\s*/, ""));
if (u) result.refs.video.push(u);
} else if (/^参考音频[：:]/.test(trimmed)) {
refTarget = "audio";
const u = extractUrl(trimmed.replace(/^参考音频[：:]\s*/, ""));
if (u) result.refs.audio.push(u);
} else if (/^首帧[：:]/.test(trimmed)) {
const u = extractUrl(trimmed.replace(/^首帧[：:]\s*/, ""));
if (u) result.refs.first = u;
refTarget = null;
} else if (/^尾帧[：:]/.test(trimmed)) {
const u = extractUrl(trimmed.replace(/^尾帧[：:]\s*/, ""));
if (u) result.refs.last = u;
refTarget = null;
} else if (refTarget) {
const u = extractUrl(trimmed);
if (u) result.refs[refTarget].push(u);
}
} else if (section === "生成设置") {
if (trimmed && trimmed !== "默认") {
const m = trimmed.match(/^([^:：]+)[:：]\s*(.*)$/);
if (m) result.fields[m[1].trim()] = m[2].trim();
}
}
}
return result;
},
findModel(name) {
if (!name) return null;
for (const tab of [ "image", "video", "audio" ]) {
for (const m of MODELS[tab]) {
if (m.name === name || m.id === name) return {
tab: tab,
model: m
};
}
}
return null;
},
apply(text) {
const parsed = this.parse(text);
if (!parsed) {
Toast.error("无法解析工作流，请确认格式为 V32");
return false;
}
const hit = this.findModel(parsed.modelName);
if (!hit) {
Toast.error(`未找到模型: ${parsed.modelName}`);
return false;
}
const snapshot = UI._snapshotForm();
UI.switchTab(hit.tab);
setTimeout(() => {
UI._currentModelId = hit.model.id;
UI.renderParamForm(hit.model.id);
const promptEl = $('[data-key="prompt"], [data-key="text"]');
if (promptEl) {
promptEl.value = parsed.prompt;
UI._onPromptInput(promptEl);
}
UI._replaceRefs(parsed.refs);
for (const p of hit.model.params) {
if (p.type === "textarea" || p.type === "ref-image" || p.type === "ref-video" || p.type === "ref-audio") continue;
const val = parsed.fields[p.label];
if (val != null) {
const el = $(`[data-key="${p.key}"]`);
if (el) {
let v2 = val;
if (hit.model.aspectMerge && p.key === "aspectRatio" && /^\d+x\d+$/.test(String(v2))) {
const dec = UI._decomposeGptAspect(hit.model, {
aspectRatio: v2
});
if (dec.aspectRatio) v2 = dec.aspectRatio;
}
if (el.tagName === "SELECT" && p.options && !p.options.map(String).includes(String(v2))) continue;
el.value = v2;
UI._onFieldChange(p.key, el);
}
}
}
UI._showUndoBtn(snapshot);
Toast.success("工作流已导入");
}, 50);
return true;
},
async copy(task) {
/* ★ R92-B：build 抛错时**不再静默** —— 此前调用方（悬浮栏 / 历史详情 / 顶部按钮）都没有
   try/catch，异常直接冒泡 ⇒ 用户看到的就是「点了没反应」。现在至少会说出原因。 */
let text = "";
try {
text = this.build(task);
} catch (e) {
try { Toast.error("复制工作流失败：" + ((e && e.message) || e)); } catch (_e) {}
return false;
}
if (!text) { try { Toast.warning("这条记录没有可导出的工作流内容"); } catch (_e) {} return false; }
const ok = await copy(text);
/* ★ R88-c：失败时不再只弹一句「复制失败」就没下文 —— 打开手动复制面板，让用户一定拿得到内容 */
if (ok) { Toast.success("工作流已复制到剪贴板"); } else {
try { Toast.warning("浏览器拦下了自动复制，已打开手动复制"); } catch (_e88) {}
try { UI._showManualCopy(text); } catch (_e88) {}
}
return ok;
}
};

const AmbientFX = {
_cache: new Map,
setGenerating(on) {
document.body.classList.toggle("is-generating", !!on);
},
successPulse() {
const el = document.getElementById("ambientPulse");
if (!el) return;
el.classList.remove("flash");
void el.offsetWidth;
el.classList.add("flash");
},
async illuminate(url, type) {
try {
if (!url || type === "audio") return;
let rgb = this._cache.get(url);
if (!rgb) {
rgb = await this._dominantColor(url);
if (!rgb) return;
this._cache.set(url, rgb);
}
const tint = document.getElementById("ambientTint");
if (!tint) return;
tint.style.setProperty("--tint-c", rgb);
tint.classList.remove("glow");
void tint.offsetWidth;
tint.classList.add("glow");
} catch (e) {}
},
_dominantColor(url) {
return new Promise(resolve => {
const img = new Image;
img.crossOrigin = "anonymous";
const done = v => {
img.onload = img.onerror = null;
resolve(v);
};
img.onload = () => {
try {
const s = 24;
const c = document.createElement("canvas");
c.width = s;
c.height = s;
const ctx = c.getContext("2d", {
willReadFrequently: true
});
ctx.drawImage(img, 0, 0, s, s);
const d = ctx.getImageData(0, 0, s, s).data;
let r = 0, g = 0, b = 0, w = 0;
for (let i = 0; i < d.length; i += 4) {
const R = d[i], G = d[i + 1], B = d[i + 2];
const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
const sat = mx > 0 ? (mx - mn) / mx : 0;
const lum = (.2126 * R + .7152 * G + .0722 * B) / 255;
const wt = sat * sat * (lum > .16 && lum < .95 ? 1 : .12) + .015;
r += R * wt;
g += G * wt;
b += B * wt;
w += wt;
}
if (!w) return done(null);
let [h, s2, l] = this._rgb2hsl(r / w, g / w, b / w);
s2 = Math.min(1, s2 * 1.3 + .12);
l = Math.min(.62, Math.max(.34, l));
const [R2, G2, B2] = this._hsl2rgb(h, s2, l);
done(`rgb(${R2},${G2},${B2})`);
} catch (e) {
done(null);
}
};
img.onerror = () => done(null);
img.src = url;
setTimeout(() => done(null), 6e3);
});
},
_rgb2hsl(r, g, b) {
r /= 255;
g /= 255;
b /= 255;
const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
const l = (mx + mn) / 2;
if (mx === mn) return [ 0, 0, l ];
const d = mx - mn;
const s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
let h;
if (mx === r) h = (g - b) / d + (g < b ? 6 : 0); else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
return [ h / 6, s, l ];
},
_hsl2rgb(h, s, l) {
const f = n => {
const k = (n + h * 12) % 12;
const a = s * Math.min(l, 1 - l);
return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
};
return [ f(0), f(8), f(4) ];
}
};

const CAP_SVG = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

const CAP_ICONS = {
scissors: CAP_SVG('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><path d="M14.47 14.48 20 20"/><path d="M8.12 8.12 12 12"/>'),
person: CAP_SVG('<circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/>'),
image: CAP_SVG('<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>'),
smile: CAP_SVG('<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/>'),
hair: CAP_SVG('<path d="M4 20c0-8 3.6-14 8-14s8 6 8 14"/><path d="M8.5 20c0-5.5 1.4-9.5 3.5-9.5s3.5 4 3.5 9.5"/>'),
shirt: CAP_SVG('<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>'),
box: CAP_SVG('<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>'),
apple: CAP_SVG('<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>'),
cloud: CAP_SVG('<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>'),
droplet: CAP_SVG('<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>'),
sunset: CAP_SVG('<path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>'),
sliders: CAP_SVG('<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>')
};

/* ═══ IMPL-107①：视频全屏浮层 VideoFS ═══
   背景沿用原图预览方案（rgba(22,20,28,.34)+blur16 变暗模糊，非全黑）；底部毛玻璃进度条与站点悬浮玻璃同语言；
   进入时把内嵌 <video> 节点整体搬入浮层（播放进度/音量/静音无缝保留），退出原样归还原容器并清锁高。 */
const VideoFS = {
active: false,
_video: null,
_box: null,
_idleT: 0,
_hintT: 0,
_escBound: false,
openFromTask(task) {
const v = document.querySelector("#resultList .sv-media.is-video video");
if (!v) { Toast.error("视频未就绪"); return; }
this.open(v);
},
open(video) {
if (this.active) return;
const ov = document.getElementById("vfsOverlay"), stage = document.getElementById("vfsStage"), hint = document.getElementById("vfsHint");
if (!ov || !stage) return;
const box = video.closest(".sv-media") || video.parentElement;
if (box) {/* 锁原容器高度，防节点离场后舞台塌缩跳动 */
const h = video.getBoundingClientRect().height;
if (h) box.style.height = Math.round(h) + "px";
box.classList.add("video-away");
}
this._box = box;
this._video = video;
stage.innerHTML = "";
stage.appendChild(video);
video.playsInline = true;
video.setAttribute("playsinline", "");
const ctl = document.createElement("div");
ctl.className = "sv-vctl";
ctl.setAttribute("role", "toolbar");
ctl.setAttribute("aria-label", "全屏播放控制");
ctl.innerHTML = `<button class="sv-vbtn" data-vact="toggle" aria-label="播放或暂停"><svg class="vi-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg><svg class="vi-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg></button><span class="sv-vtime"><span class="vt-cur">0:00</span><i>/</i><span class="vt-dur">0:00</span></span><input class="sv-vseek" type="range" min="0" max="1000" value="0" step="1" aria-label="播放进度"><button class="sv-vbtn" data-vact="mute" aria-label="静音或取消静音"><svg class="vi-vol-on" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></svg><svg class="vi-vol-off" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg></button><button class="sv-vbtn" data-vact="fsx" title="退出全屏（Esc）" aria-label="退出全屏"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 10 7-7"/><path d="M20 10h-6V4"/><path d="m3 21 7-7"/><path d="M4 14h6v6"/></svg></button>`;
stage.appendChild(ctl);
ov.classList.add("show");
ov.setAttribute("aria-hidden", "false");
document.body.classList.add("vfs-lock");
const fmt = s => { if (!isFinite(s) || s < 0) return "0:00"; s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
const q = s => ctl.querySelector(s);
const tgl = q('[data-vact="toggle"]'), mute = q('[data-vact="mute"]'), fsx = q('[data-vact="fsx"]'), seek = q(".sv-vseek"), cur = q(".vt-cur"), dur = q(".vt-dur");
const sync = () => {
if (cur) cur.textContent = fmt(video.currentTime);
if (isFinite(video.duration) && video.duration) { if (seek && !(seek.matches && seek.matches(":active"))) seek.value = Math.round(video.currentTime / video.duration * 1000); if (dur) dur.textContent = fmt(video.duration); }
ctl.classList.toggle("is-playing", !video.paused && !video.ended);
ctl.classList.toggle("is-muted", !!video.muted);
};
video.ontimeupdate = sync; video.onplay = sync; video.onpause = sync; video.onended = sync;
video.onloadedmetadata = sync; video.ondurationchange = sync;
sync();
if (tgl) tgl.onclick = e => { e.stopPropagation(); video.paused ? video.play().catch(() => {}) : video.pause(); };
if (mute) mute.onclick = e => { e.stopPropagation(); video.muted = !video.muted; sync(); };
if (fsx) fsx.onclick = e => { e.stopPropagation(); this.close(); };
if (seek) seek.oninput = () => { if (isFinite(video.duration) && video.duration) video.currentTime = seek.value / 1000 * video.duration; };
video.onclick = e => { e.stopPropagation(); video.paused ? video.play().catch(() => {}) : video.pause(); this.wake(); };
ov.onclick = e => { if (e.target === ov || e.target === stage) this.close(); };
if (!this._escBound) {
this._escBound = true;
document.addEventListener("keydown", e => { if (e.key === "Escape" && this.active) this.close(); });
}
this.active = true;
if (hint) { hint.classList.remove("fade"); clearTimeout(this._hintT); this._hintT = setTimeout(() => hint.classList.add("fade"), 3200); }
this.wake();
},
wake() {
const ctl = document.querySelector("#vfsStage .sv-vctl");
if (!ctl) return;
ctl.classList.remove("idle");
clearTimeout(this._idleT);
this._idleT = setTimeout(() => ctl.classList.add("idle"), 2600);
},
close(opts) {
if (!this.active) return;
opts = opts || {};
const ov = document.getElementById("vfsOverlay"), stage = document.getElementById("vfsStage");
const v = this._video;
clearTimeout(this._idleT);
if (stage) stage.innerHTML = "";
if (ov) { ov.classList.remove("show"); ov.setAttribute("aria-hidden", "true"); }
document.body.classList.remove("vfs-lock");
this.active = false;
if (v) {
v.ontimeupdate = null; v.onplay = null; v.onpause = null; v.onended = null; v.onloadedmetadata = null; v.ondurationchange = null; v.onclick = null;
const box = this._box;
if (box && box.isConnected) {
box.classList.remove("video-away");
box.style.height = "";
box.appendChild(v);
} else {
try { v.pause(); } catch (_e) {}
}
}
this._video = null; this._box = null;
}
};
const SegStudio = {
_pollTimer: null,
_pollCount: 0,
_pollMax: 40,
CAPS: [ {
id: "SegmentCommonImage",
name: "通用分割",
icon: CAP_ICONS.scissors,
desc: "自动识别主体，透明 PNG",
async: false,
hd: "SegmentHDCommonImage"
}, {
id: "SegmentBody",
name: "人体分割",
icon: CAP_ICONS.person,
desc: "单人/多人像抠图",
async: false,
hd: "SegmentHDBody"
}, {
id: "SegmentHDBody",
name: "高清人体",
icon: CAP_ICONS.person,
desc: "大图人体抠图",
async: true,
isHd: true
}, {
id: "SegmentHDCommonImage",
name: "通用高清",
icon: CAP_ICONS.image,
desc: "超大图主体抠图",
async: true,
isHd: true
}, {
id: "SegmentHead",
name: "头像分割",
icon: CAP_ICONS.smile,
desc: "仅抠取人脸头部",
async: false
}, {
id: "SegmentHair",
name: "头发分割",
icon: CAP_ICONS.hair,
desc: "发丝级边缘 mask",
async: false
}, {
id: "SegmentCloth",
name: "服饰分割",
icon: CAP_ICONS.shirt,
desc: "上衣/裤裙/鞋帽箱包",
async: false
}, {
id: "SegmentCommodity",
name: "商品分割",
icon: CAP_ICONS.box,
desc: "白底图/透明图/mask",
async: false
}, {
id: "SegmentFood",
name: "食品分割",
icon: CAP_ICONS.apple,
desc: "食物与背景分离",
async: false
}, {
id: "SegmentSky",
name: "天空分割",
icon: CAP_ICONS.cloud,
desc: "天空区域 mask",
async: false,
hd: "SegmentHDSky"
}, {
id: "SegmentHDSky",
name: "高清天空",
icon: CAP_ICONS.cloud,
desc: "大图天空分割",
async: true,
isHd: true
}, {
id: "SegmentSkin",
name: "皮肤分割",
icon: CAP_ICONS.droplet,
desc: "皮肤像素区域 mask",
async: false
}, {
id: "ChangeSky",
name: "天空替换",
icon: CAP_ICONS.sunset,
desc: "把天空换成指定背景",
async: true,
needSky: true
}, {
id: "RefineMask",
name: "Mask 精细",
icon: CAP_ICONS.sliders,
desc: "粗 mask 边缘优化",
async: false,
needMask: true
} ],
ERR_ZH: {
InvalidImageURL: "图片地址无法下载：需公网可访问 URL，不能含中文；请先用「本地上传」上传到图床",
ImageTooLarge: "图片文件体积超过上限，请压缩后重试",
ImageResolutionExceed: "图片分辨率超出该接口上限（普通 2000×2000，高清 10000×10000）",
AccessKeyNotFound: "AccessKey 不存在：请解锁密钥保险箱后重试",
"InvalidAccessKeyId.NotFound": "AccessKey 不存在：请解锁密钥保险箱后重试（实测联调返回此码）",
SignatureDoesNotMatch: "签名不匹配：本机密钥与服务器不一致，已自动对齐内置密钥，请重试",
MissingParameter: "缺少必填参数",
InvalidParameter: "参数格式不正确",
Throttling: "请求过于频繁（限流），请稍后重试",
InternalError: "阿里云服务内部错误，请稍后重试",
SignatureDoesNotMatch: "签名不匹配：本机密钥与服务器不一致，已自动对齐内置密钥，请重试",
JobNotFound: "任务不存在或已过期（结果仅保留一段时间）",
UnsupportedImageFormat: "图片格式不支持：仅 JPG/JPEG/PNG/BMP/WEBP",
MissingCredential: "未配置阿里云密钥：请在设置页解锁密钥保险箱",
ForbiddenAction: "该能力不在白名单内",
InvalidAction: "无效能力",
BadProxy: "签名代理响应异常，已自动切换 R2 中继",
RelayFailed: "R2 中继失败：请检查网络或 R2 凭据",
NoTransport: "签名代理与 R2 中继均不可达：请经预览面板访问，或部署自有签名代理",
StsFailed: "获取阿里云临时上传凭证失败：请检查 AK/SK 权限",
StageFailed: "图片预处理失败：代理与浏览器均无法获取图源（方括号内为分路诊断；经预览面板访问可启用网关代理自动转存，R2 中继亦会自动尝试）",
StageDownloadFailed: "图片预处理失败：代理无法下载源图（检查图源可访问性）",
StagePutFailed: "图片预处理失败：暂存桶写入被拒（已自动换新凭证重试，仍失败请稍后再试）",
InvalidImageDownload: "图源无法下载（临时对象可能已过期）：请重新发起生成",
"InvalidImage.Download": "图源无法下载（临时对象可能已过期）：请重新发起生成",
StageInvalid: "图片预处理结果异常：请求已拦截，请重新添加图片后重试",
BlobExpired: "本地图源已失效（页面刷新后临时地址失效），请重新选择图片",
MissingImageURL: "请求未携带图片参数（已加前置防护，请重试；若复现请刷新页面）"
},
_findJobId(node, seen) {
if (!node || typeof node !== "object") return "";
if (!seen) seen = new Set;
if (seen.has(node)) return "";
seen.add(node);
for (const k of Object.keys(node)) {
if ((k === "JobId" || k === "jobId" || k === "Jobid" || k === "taskId") && typeof node[k] === "string" && node[k]) return node[k];
}
for (const v of Object.values(node)) {
if (v && typeof v === "object") {
const r = this._findJobId(v, seen);
if (r) return r;
}
}
return "";
},
resultUrlOf(data) {
const d = data?.Data || data || {};
const cand = [ "ImageURL", "CutoutImageURL", "WhiteBackgroundImageURL", "MaskImageURL", "ImageResponse", "URL", "imageUrl", "cutoutImageUrl", "whiteBackgroundImageUrl", "maskImageUrl", "url" ];
for (const k of cand) {
const v = d[k];
if (typeof v === "string" && /^https?:\/\//.test(v)) return v;
if (v && typeof v === "object") {
for (const k2 of cand) if (typeof v[k2] === "string") return v[k2];
}
}
const seen = new Set;
const stack = [ d ];
while (stack.length) {
const cur = stack.pop();
if (!cur || typeof cur !== "object" || seen.has(cur)) continue;
seen.add(cur);
for (const v of Object.values(cur)) {
if (typeof v === "string" && /^https?:\/\//.test(v)) return v;
if (v && typeof v === "object") stack.push(v);
}
}
return "";
},
probeSize(url) {
return new Promise(resolve => {
const img = new Image;
img.onload = () => resolve({
w: img.naturalWidth,
h: img.naturalHeight
});
img.onerror = () => resolve(null);
img.referrerPolicy = "no-referrer";
img.src = url;
});
},
pickAction(capId, size) {
const c = this.CAPS.find(x => x.id === capId);
if (!c) return null;
const big = size && (size.w > 2e3 || size.h > 2e3);
return big && c.hd ? c.hd : c.id;
},
SH_OSS_RE: /^https?:\/\/[a-z0-9-]+\.oss-cn-shanghai\.aliyuncs\.com\//i,
_sts: null,
async viapiSts(force) {
if (!force && this._sts && this._sts.expireAt > Date.now() + 6e4) return this._sts;
const ak = Store.getSegAk();
const sk = Store.getSegSk();
if (!ak || !sk) throw Object.assign(new Error("缺少阿里云密钥：请在设置页解锁密钥保险箱"), {
code: "MissingCredential"
});
const pct = s => encodeURIComponent(String(s)).replace(/\+/g, "%20").replace(/\*/g, "%2A").replace(/%7E/g, "~");
const params = {
Action: "GetOssStsToken",
Version: "2020-04-01",
Format: "JSON",
AccessKeyId: ak,
SignatureMethod: "HMAC-SHA1",
SignatureVersion: "1.0",
SignatureNonce: crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random(),
Timestamp: (new Date).toISOString().replace(/\.\d{3}Z$/, "Z")
};
const canonical = Object.keys(params).sort().map(k => `${pct(k)}=${pct(params[k])}`).join("&");
const sig = await this._hmacSha1B64(sk + "&", "POST&%2F&" + pct(canonical));
const resp = await fetch(`https://viapiutils.cn-shanghai.aliyuncs.com/?Signature=${pct(sig)}`, {
method: "POST",
headers: {
"Content-Type": "application/x-www-form-urlencoded"
},
body: canonical
});
const j = await resp.json().catch(() => ({}));
if (j.Code || !j.Data?.AccessKeyId) throw Object.assign(new Error(j.Message || "GetOssStsToken 失败"), {
code: j.Code || "StsFailed"
});
this._sts = {
akId: j.Data.AccessKeyId,
akSecret: j.Data.AccessKeySecret,
token: j.Data.SecurityToken,
expireAt: Date.now() + 30 * 60 * 1e3
};
return this._sts;
},
async ossStagePut(sts, blob, ext) {
const ctype = blob.type && blob.type.startsWith("image/") ? blob.type : `image/${ext === "jpg" ? "jpeg" : ext}`;
const object = `${Store.getSegAk()}/${(crypto.randomUUID ? crypto.randomUUID() : String(Math.random())).replace(/-/g, "")}src.${ext}`;
const policy = btoa(JSON.stringify({
expiration: new Date(Date.now() + 10 * 60 * 1e3).toISOString(),
conditions: [ {
bucket: "viapi-customer-temp"
}, [ "starts-with", "$key", Store.getSegAk() + "/" ], [ "content-length-range", 1, 30 * 1024 * 1024 ], {
"x-oss-security-token": sts.token
} ]
}));
const sig = await this._hmacSha1B64(sts.akSecret, policy);
const fd = new FormData;
fd.append("key", object);
fd.append("policy", policy);
fd.append("OSSAccessKeyId", sts.akId);
fd.append("Signature", sig);
fd.append("x-oss-security-token", sts.token);
fd.append("success_action_status", "200");
fd.append("file", blob, "src." + ext);
const resp = await fetch("https://viapi-customer-temp.oss-cn-shanghai.aliyuncs.com/", {
method: "POST",
body: fd
});
if (resp.status !== 200 && resp.status !== 204) {
const t = await resp.text().catch(() => "");
const ossCode = (/<Code>([^<]+)<\/Code>/.exec(t) || [])[1] || "";
throw Object.assign(new Error(`暂存桶写入失败（HTTP ${resp.status}${ossCode ? "：" + ossCode : ""}）`), {
code: "StagePutFailed",
raw: ossCode || `HTTP ${resp.status}`
});
}
return `https://viapi-customer-temp.oss-cn-shanghai.aliyuncs.com/${object}`;
},
async stageViaProxyRaw(ak, sk, blob, ext) {
let lastErr = null;
const fileMode = /^file:/i.test(location.protocol);
for (const base of Store.segEndpointList("/stage")) {
if (fileMode && !/^https?:/i.test(base)) continue;
const url = base + (base.includes("?") ? "&" : "?") + `raw=1&name=src.${ext}`;
try {
const resp = await fetch(url, {
method: "POST",
headers: {
"X-AK": ak,
"X-SK": sk,
"Content-Type": blob.type || `image/${ext === "jpg" ? "jpeg" : ext}`
},
body: blob
});
const d = await resp.json().catch(() => null);
if (d && d.ok && d.url) return d.url;
lastErr = Object.assign(new Error(d && (d.message || d.code) || "代理暂存失败"), {
code: d && d.code || "StageProxyFailed"
});
} catch (e) {
lastErr = e;
}
}
throw lastErr || Object.assign(new Error("代理暂存失败"), {
code: "StageProxyFailed"
});
},
async stageViaR2Relay(src) {
const workerUrl = (Store.getR2WorkerUrl() || "").replace(/\/$/, "");
const token = Store.getR2AuthToken();
if (!workerUrl || !token) throw Object.assign(new Error("R2 中继未配置"), {
code: "RelayUnavailable"
});
const ext = ((src.match(/\.(png|jpe?g|webp|gif)(?=$|\?)/i) || [])[1] || "png").toLowerCase().replace("jpeg", "jpg");
const url = workerUrl + "/archive?url=" + encodeURIComponent(src) + "&ext=" + ext + "&token=" + encodeURIComponent(token);
const resp = await fetch(url, {
method: "POST"
});
const d = await resp.json().catch(() => null);
if (!d || !d.ok || !d.url) throw Object.assign(new Error(d && (d.error || d.message) || "HTTP " + resp.status), {
code: "RelayArchiveFailed"
});
let r = null, readErr = null;
for (const readUrl of [ d.url, workerUrl + (d.url || "").replace(/^https?:\/\/[^/]+/, "") + "?token=" + encodeURIComponent(token) ]) {
try {
r = await fetch(readUrl);
if (!r.ok) throw new Error("HTTP " + r.status);
break;
} catch (e) {
r = null;
readErr = e;
}
}
if (!r) throw Object.assign(new Error("R2 读回被 CORS 拦（r2.dev 无跨源头，需 Worker 域名对象读路由）: " + String(readErr && readErr.message || readErr).slice(0, 30)), {
code: "RelayReadFailed"
});
const blob = await r.blob();
if (!blob || !blob.size) throw Object.assign(new Error("R2 读回内容为空"), {
code: "RelayReadEmpty"
});
return blob;
},
async _fitSegBlob(blob, opts) {
const o = opts || {};
const maxSide = o.hd ? 9800 : 1980;
const maxBytes = o.hd ? 28 * 1024 * 1024 : 2.8 * 1024 * 1024;
if (typeof createImageBitmap !== "function") return null;
let bmp = null;
try {
bmp = await createImageBitmap(blob);
} catch (e) {
return null;
}
const w = bmp.width || 0, h = bmp.height || 0;
if (!w || !h) {
try { bmp.close(); } catch (e) {}
return null;
}
const scale = Math.min(1, maxSide / Math.max(w, h));
const overFile = blob.size > maxBytes;
if (scale === 1 && !overFile) {
try { bmp.close(); } catch (e) {}
return null;
}
const tw = Math.max(1, Math.round(w * scale)), th = Math.max(1, Math.round(h * scale));
const c = document.createElement("canvas");
c.width = tw;
c.height = th;
const cx = c.getContext("2d");
cx.imageSmoothingEnabled = true;
cx.imageSmoothingQuality = "high";
cx.drawImage(bmp, 0, 0, tw, th);
try { bmp.close(); } catch (e) {}
const enc = (m, q) => new Promise(res => {
try { c.toBlob(b => res(b || null), m, q); } catch (e) { res(null); }
});
let out = null, mime = "image/jpeg";
if (o.png) {
mime = "image/png";
out = await enc("image/png");
} else {
out = await enc("image/jpeg", .92);
if (out && out.size > maxBytes) {
for (const q of [.85, .78, .7]) {
const b2 = await enc("image/jpeg", q);
if (b2) {
out = b2;
if (b2.size <= maxBytes) break;
}
}
}
}
if (!out || !out.size) return null;
return { blob: out, ext: mime === "image/png" ? "png" : "jpg" };
},
async stageImage(src, fallbackSrc, opts) {
if (this.SH_OSS_RE.test(src)) return src;
const ak = Store.getSegAk();
const sk = Store.getSegSk();
if (!ak || !sk) throw Object.assign(new Error("缺少阿里云密钥：请在设置页解锁密钥保险箱"), {
code: "MissingCredential"
});
const isLocal = /^(data:|blob:)/.test(src);
const fileMode = /^file:/i.test(location.protocol);
const diag = [];
if (!isLocal) {
for (const epUrl of Store.segEndpointList("/stage")) {
const tag = /^https?:/i.test(epUrl) ? "自定义代理" : "网关代理";
if (fileMode && tag === "网关代理") {
diag.push("网关代理:file://打开不可达");
continue;
}
try {
const resp = await fetch(epUrl, {
method: "POST",
headers: {
"X-AK": ak,
"X-SK": sk,
"Content-Type": "application/json"
},
body: JSON.stringify({
url: src
})
});
const d = await resp.json().catch(() => null);
if (d && d.ok && d.url) return d.url;
diag.push(`${tag}:${String(d && (d.message || d.code) || "HTTP" + resp.status).slice(0, 48)}`);
} catch (e) {
diag.push(`${tag}:${String(e && e.message || e).slice(0, 40)}`);
}
}
}
let blob = null, ext = "png";
try {
const r = await fetch(src);
if (!r.ok) throw new Error(`HTTP ${r.status}`);
blob = await r.blob();
if (!blob || !blob.size) {
blob = null;
diag.push("读取:图片内容为空");
} else ext = {
"image/png": "png",
"image/jpeg": "jpg",
"image/webp": "webp",
"image/gif": "gif",
"image/bmp": "bmp"
}[blob.type] || "png";
} catch (e) {
blob = null;
diag.push(`读取:${String(e && e.message || e).slice(0, 40)}`);
}
if (!blob && fallbackSrc && fallbackSrc !== src && /^https?:/i.test(fallbackSrc)) {
try {
const r2 = await fetch(fallbackSrc);
if (!r2.ok) throw new Error("HTTP " + r2.status);
blob = await r2.blob();
if (!blob || !blob.size) blob = null; else ext = {
"image/png": "png",
"image/jpeg": "jpg",
"image/webp": "webp",
"image/gif": "gif",
"image/bmp": "bmp"
}[blob.type] || "png";
} catch (e) {
blob = null;
diag.push(`备源:${String(e && e.message || e).slice(0, 32)}`);
}
}
if (!blob && !isLocal) {
try {
blob = await this.stageViaR2Relay(src);
ext = {
"image/png": "png",
"image/jpeg": "jpg",
"image/webp": "webp",
"image/gif": "gif",
"image/bmp": "bmp"
}[blob.type] || ext;
} catch (e) {
diag.push(`R2中继:${String(e && (e.code || e.message) || e).slice(0, 40)}`);
if (fallbackSrc && fallbackSrc !== src && /^https?:/i.test(fallbackSrc)) {
try {
blob = await this.stageViaR2Relay(fallbackSrc);
ext = {
"image/png": "png",
"image/jpeg": "jpg",
"image/webp": "webp",
"image/gif": "gif",
"image/bmp": "bmp"
}[blob.type] || ext;
} catch (e2) {
diag.push(`备源中继:${String(e2 && (e2.code || e2.message) || e2).slice(0, 32)}`);
}
}
}
}
if (blob && typeof this._fitSegBlob === "function") {
try {
const fit = await this._fitSegBlob(blob, opts || {});
if (fit && fit.blob) {
blob = fit.blob;
ext = fit.ext || ext;
}
} catch (eFit) {
diag.push(`适配:${String(eFit && eFit.message || eFit).slice(0, 32)}`);
}
}
if (blob) {
let putErr = null;
try {
return await this.ossStagePut(await this.viapiSts(), blob, ext);
} catch (pe) {
if (pe.code === "StagePutFailed" || pe.code === "StsFailed") {
try {
return await this.ossStagePut(await this.viapiSts(true), blob, ext);
} catch (pe2) {
putErr = pe2;
}
} else putErr = pe;
}
diag.push(`直传:${putErr && (putErr.raw || putErr.code || putErr.message) || "未知"}`);
try {
return await this.stageViaProxyRaw(ak, sk, blob, ext);
} catch (e3) {
diag.push(`代理直传:${String(e3 && (e3.code || e3.message) || "未知").slice(0, 40)}`);
}
throw Object.assign(new Error(`图片预处理失败：转存通道均被拒（${diag.join("；").slice(0, 90)}）`), {
code: "StageFailed",
raw: diag.join("；").slice(0, 80)
});
}
if (isLocal && /^blob:/i.test(src)) throw Object.assign(new Error("本地图源已失效（页面刷新后临时地址失效），请重新选择图片"), {
code: "BlobExpired"
});
throw Object.assign(new Error(`图片预处理失败：代理与浏览器均无法读取图源（${diag.join("；").slice(0, 90)}）`), {
code: "StageFailed",
raw: diag.join("；").slice(0, 80)
});
},
async _transport(action, bizParams) {
const diags = [];
const ak = Store.getSegAk();
const sk = Store.getSegSk();
if (ak && sk) {
try {
const url = await this.signUrl(action, bizParams, ak, sk);
const resp = await fetch(url, {
headers: {
Accept: "application/json"
}
});
const data = await resp.json().catch(() => null);
if (data) {
if (data.Code) return {
ok: false,
code: data.Code,
message: data.Message || "阿里云返回错误",
requestId: data.RequestId
};
return {
ok: true,
data: data
};
}
diags.push(`直连:HTTP${resp.status}非JSON`);
} catch (e0) {
diags.push(`直连:${String(e0 && e0.message || e0).slice(0, 48)}`);
}
} else diags.push("直连:缺密钥");
try {
const resp = await fetch(Store.segEndpoint("/imageseg"), {
method: "POST",
headers: {
"Content-Type": "application/json",
"X-AK": ak,
"X-SK": sk
},
body: JSON.stringify({
action: action,
params: bizParams
})
});
const data = await resp.json().catch(() => null);
if (data && (data.ok || data.code)) return data;
diags.push(`代理:HTTP${resp.status}`);
} catch (e1) {
diags.push(`代理:${String(e1 && e1.message || e1).slice(0, 48)}`);
}
let relayDiag = "";
const relay = await this._relayCall(action, bizParams).catch(e2 => {
relayDiag = String(e2 && e2.message || e2).slice(0, 48);
return null;
});
if (relay) return relay;
diags.push(relayDiag ? `中继:${relayDiag}` : "中继:未配置");
throw Object.assign(new Error(`${this.ERR_ZH.NoTransport}（${diags.join("；")}）`), {
code: "NoTransport",
raw: diags.join("；").slice(0, 80)
});
},
async _call(action, params) {
return this._transport(action, params);
},
async _hmacSha1B64(keyStr, msg) {
if (typeof crypto !== "undefined" && crypto && crypto.subtle) {
const key = await crypto.subtle.importKey("raw", (new TextEncoder).encode(keyStr), {
name: "HMAC",
hash: "SHA-1"
}, false, [ "sign" ]);
const sig = await crypto.subtle.sign("HMAC", key, (new TextEncoder).encode(msg));
return btoa(Array.from(new Uint8Array(sig), b => String.fromCharCode(b)).join(""));
}
return this._hmacSha1Js(String(keyStr), String(msg));
},
_sha1Bytes(bytes) {
const ml = bytes.length;
const total = (ml + 8 >> 6) + 1 << 6;
const buf = new Uint8Array(total);
buf.set(bytes);
buf[ml] = 128;
const dv = new DataView(buf.buffer);
dv.setUint32(total - 8, Math.floor(ml / 536870912));
dv.setUint32(total - 4, ml << 3 >>> 0);
let h0 = 1732584193, h1 = 4023233417, h2 = 2562383102, h3 = 271733878, h4 = 3285377520;
const w = new Int32Array(80);
for (let i = 0; i < total; i += 64) {
for (let j = 0; j < 16; j++) w[j] = dv.getInt32(i + (j << 2));
for (let j = 16; j < 80; j++) {
const x = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
w[j] = x << 1 | x >>> 31;
}
let a = h0, b = h1, c = h2, d = h3, e = h4;
for (let j = 0; j < 80; j++) {
let f, k;
if (j < 20) {
f = b & c | ~b & d;
k = 1518500249;
} else if (j < 40) {
f = b ^ c ^ d;
k = 1859775393;
} else if (j < 60) {
f = b & c | b & d | c & d;
k = 2400959708;
} else {
f = b ^ c ^ d;
k = 3395469782;
}
const t = (a << 5 | a >>> 27) + f + e + k + w[j] | 0;
e = d;
d = c;
c = b << 30 | b >>> 2;
b = a;
a = t;
}
h0 = h0 + a | 0;
h1 = h1 + b | 0;
h2 = h2 + c | 0;
h3 = h3 + d | 0;
h4 = h4 + e | 0;
}
const out = new Uint8Array(20);
const odv = new DataView(out.buffer);
odv.setUint32(0, h0 >>> 0);
odv.setUint32(4, h1 >>> 0);
odv.setUint32(8, h2 >>> 0);
odv.setUint32(12, h3 >>> 0);
odv.setUint32(16, h4 >>> 0);
return out;
},
_hmacSha1Js(keyStr, msg) {
const enc = new TextEncoder;
let key = enc.encode(keyStr);
if (key.length > 64) key = this._sha1Bytes(key);
const msgB = enc.encode(msg);
const block = new Uint8Array(64);
for (let i = 0; i < 64; i++) block[i] = (i < key.length ? key[i] : 0) ^ 54;
const inner = new Uint8Array(64 + msgB.length);
inner.set(block);
inner.set(msgB, 64);
const innerDig = this._sha1Bytes(inner);
for (let i = 0; i < 64; i++) block[i] = (i < key.length ? key[i] : 0) ^ 92;
const outer = new Uint8Array(84);
outer.set(block);
outer.set(innerDig, 64);
const dig = this._sha1Bytes(outer);
let s = "";
for (let i = 0; i < 20; i++) s += String.fromCharCode(dig[i]);
return btoa(s);
},
async signUrl(action, bizParams, ak, sk) {
const pct = s => encodeURIComponent(String(s)).replace(/\+/g, "%20").replace(/\*/g, "%2A").replace(/%7E/g, "~");
const params = {
Action: action,
Version: "2019-12-30",
Format: "JSON",
AccessKeyId: ak,
SignatureMethod: "HMAC-SHA1",
SignatureVersion: "1.0",
SignatureNonce: crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random(),
Timestamp: (new Date).toISOString().replace(/\.\d{3}Z$/, "Z"),
...bizParams
};
const canonical = Object.keys(params).sort().map(k => `${pct(k)}=${pct(params[k])}`).join("&");
const b64 = await this._hmacSha1B64(sk + "&", "GET&%2F&" + pct(canonical));
return `https://imageseg.cn-shanghai.aliyuncs.com/?${canonical}&Signature=${pct(b64)}`;
},
async _relayCall(action, bizParams) {
const workerUrl = Store.getR2WorkerUrl();
const token = Store.getR2AuthToken();
if (!workerUrl || !token) return null;
const ak = Store.getSegAk();
const sk = Store.getSegSk();
if (!ak || !sk) return {
ok: false,
code: "MissingCredential",
message: "缺少阿里云密钥：请在设置页解锁密钥保险箱"
};
const signed = await this.signUrl(action, bizParams, ak, sk);
const res = await fetch(workerUrl.replace(/\/$/, "") + "/archive?url=" + encodeURIComponent(signed) + "&ext=png&token=" + encodeURIComponent(token), {
method: "POST"
});
const d = await res.json().catch(() => null);
if (!d || !d.ok || !d.url) throw new Error(d && d.error || this.ERR_ZH.RelayFailed);
const raw = await fetch(d.url).then(r => r.json());
if (raw && raw.Code) return {
ok: false,
code: raw.Code,
message: raw.Message || "阿里云返回错误",
requestId: raw.RequestId
};
return {
ok: true,
data: raw
};
},
async _pollJob(jobId, onTick) {
this._stopPoll();
this._pollCount = 0;
return new Promise((resolve, reject) => {
this._pollTimer = setInterval(async () => {
this._pollCount++;
onTick?.(this._pollCount);
if (this._pollCount > this._pollMax) {
this._stopPoll();
reject(new Error("SEG_POLL_TIMEOUT"));
return;
}
try {
const data = await this._transport("GetAsyncJobResult", {
JobId: String(jobId)
});
if (!data.ok) {
this._stopPoll();
reject(Object.assign(new Error(_errText(data.message) || "轮询失败"), {
code: data.code
}));
return;
}
const d0 = data.data?.Data || data.data || {};
const st = d0.Status;
if (st === "PROCESS_SUCCESS" || st === "SUCCEEDED") {
this._stopPoll();
let r = d0.Result || data.data?.Result || data.data;
if (typeof r === "string") {
try {
r = JSON.parse(r);
} catch {}
}
resolve(r);
} else if (st === "PROCESS_FAILED" || st === "FAILED") {
this._stopPoll();
reject(Object.assign(new Error(d0.ErrorMessage || data.data?.Message || "任务失败"), {
code: d0.ErrorCode || data.data?.ErrorCode || "ProcessFailed"
}));
}
} catch (e) {}
}, 1800);
});
},
_stopPoll() {
if (this._pollTimer) {
clearInterval(this._pollTimer);
this._pollTimer = null;
}
},
async prefillAsModel(srcOrTask) {
UI.switchTab("image");
let url = typeof srcOrTask === "string" ? srcOrTask : srcOrTask && srcOrTask.result && srcOrTask.result.url || "";
let fallback = "";
if (typeof srcOrTask !== "string" && srcOrTask) {
const orig = srcOrTask.result && srcOrTask.result.originalUrl || "";
if (orig && orig !== url) fallback = orig;
}
setTimeout(() => {
UI._currentModelId = "aliyun_cutout";
UI.renderParamForm("aliyun_cutout");
if (url) UI._addUrlRef("image", url, fallback ? {
fallback: fallback
} : undefined);
Toast.info("已切换到阿里抠图，R2 图源已预填");
}, 60);
}
};

const ASYNC_SET = new Set(SegStudio.CAPS.filter(c => c.async).map(c => c.id));

const _brandBadge = (bg, inner) => `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="6" fill="${bg}"/>${inner}</svg>`;

const _badgeText = (bg, ch) => _brandBadge(bg, `<text x="12" y="12.5" text-anchor="middle" dominant-baseline="central" font-family="-apple-system,'Segoe UI',Roboto,'PingFang SC','Microsoft YaHei',sans-serif" font-size="12.5" font-weight="700" fill="#fff">${ch}</text>`);

const _badgeGlyph = (bg, paths) => _brandBadge(bg, `<g fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`);

const _logoPath = (color, d) => '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="' + color + '" d="' + d + '"/></svg>';
const _softGlyph = (paths, fg, bg) => '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1.2" y="1.2" width="21.6" height="21.6" rx="6.5" fill="' + (bg || "rgba(127,138,160,.20)") + '"/><g fill="none" stroke="' + (fg || "currentColor") + '" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + paths + '</g></svg>';
const MODEL_BRANDS = {
google: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"/></svg>',
openai: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A5.98 5.98 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.21 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.07zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.79.79 0 0 0 .39-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.49 4.5zm-9.66-4.13a4.47 4.47 0 0 1-.53-3.01l.14.08 4.78 2.76a.77.77 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06l-4.83 2.79a4.5 4.5 0 0 1-6.15-1.64zM2.34 7.9a4.49 4.49 0 0 1 2.37-1.97v5.68a.77.77 0 0 0 .39.67l5.81 3.36-2.02 1.17a.08.08 0 0 1-.07 0L4 14.01a4.5 4.5 0 0 1-1.66-6.14zm16.6 3.86l-5.83-3.39L15.12 7.2a.08.08 0 0 1 .07 0l4.83 2.79a4.49 4.49 0 0 1-.68 8.1v-5.68a.79.79 0 0 0-.4-.67zm2.01-3.02l-.14-.09-4.77-2.78a.78.78 0 0 0-.79 0L9.41 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zM8.31 12.86l-2.02-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.78 2.76a.79.79 0 0 0-.39.68zm1.1-2.37l2.6-1.5 2.61 1.5v3l-2.6 1.5-2.61-1.5z"/></svg>',
aliyun: _logoPath("#FF6A00", "M3.996 4.517h5.291L8.01 6.324 4.153 7.506a1.668 1.668 0 0 0-1.165 1.601v5.786a1.668 1.668 0 0 0 1.165 1.6l3.857 1.183 1.277 1.807H3.996A3.996 3.996 0 0 1 0 15.487V8.513a3.996 3.996 0 0 1 3.996-3.996m16.008 0h-5.291l1.277 1.807 3.857 1.182c.715.227 1.17.889 1.165 1.601v5.786a1.668 1.668 0 0 1-1.165 1.6l-3.857 1.183-1.277 1.807h5.291A3.996 3.996 0 0 0 24 15.487V8.513a3.996 3.996 0 0 0-3.996-3.996m-4.007 8.345H8.002v-1.804h7.995Z"),
wan: _logoPath("#FF6A00", "M3.996 4.517h5.291L8.01 6.324 4.153 7.506a1.668 1.668 0 0 0-1.165 1.601v5.786a1.668 1.668 0 0 0 1.165 1.6l3.857 1.183 1.277 1.807H3.996A3.996 3.996 0 0 1 0 15.487V8.513a3.996 3.996 0 0 1 3.996-3.996m16.008 0h-5.291l1.277 1.807 3.857 1.182c.715.227 1.17.889 1.165 1.601v5.786a1.668 1.668 0 0 1-1.165 1.6l-3.857 1.183-1.277 1.807h5.291A3.996 3.996 0 0 0 24 15.487V8.513a3.996 3.996 0 0 0-3.996-3.996m-4.007 8.345H8.002v-1.804h7.995Z"),
minimax: _logoPath("#F23F5D", "M11.43 3.92a.86.86 0 1 0-1.718 0v14.236a1.999 1.999 0 0 1-3.997 0V9.022a.86.86 0 1 0-1.718 0v3.87a1.999 1.999 0 0 1-3.997 0V11.49a.57.57 0 0 1 1.139 0v1.404a.86.86 0 0 0 1.719 0V9.022a1.999 1.999 0 0 1 3.997 0v9.134a.86.86 0 0 0 1.719 0V3.92a1.998 1.998 0 1 1 3.996 0v11.788a.57.57 0 1 1-1.139 0zm10.572 3.105a2 2 0 0 0-1.999 1.997v7.63a.86.86 0 0 1-1.718 0V3.923a1.999 1.999 0 0 0-3.997 0v16.16a.86.86 0 0 1-1.719 0V18.08a.57.57 0 1 0-1.138 0v2a1.998 1.998 0 0 0 3.996 0V3.92a.86.86 0 0 1 1.719 0v12.73a1.999 1.999 0 0 0 3.996 0V9.023a.86.86 0 1 1 1.72 0v6.686a.57.57 0 0 0 1.138 0V9.022a2 2 0 0 0-1.998-1.997"),
vidu: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1.2" y="1.2" width="21.6" height="21.6" rx="6.5" fill="#00B8A9"/><path d="M7.5 7.5 12 16.2 16.5 7.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
kling: _logoPath("#FF4906", "M18.315 12.264c2.33 0 4.218 1.88 4.218 4.2V19.8c0 2.32-1.888 4.2-4.218 4.2h-6.202a4.218 4.218 0 0 1-4.023-2.938l-3.676 1.833a2.04 2.04 0 0 1-2.731-.903 2.015 2.015 0 0 1-.216-.907v-5.94a2.03 2.03 0 0 1 2.035-2.024 2.044 2.044 0 0 1 .919.218l3.673 1.85a4.218 4.218 0 0 1 4.02-2.925zm-.062 2.162h-6.078c-1.153 0-2.09.921-2.108 2.065v3.247c0 1.148.925 2.081 2.073 2.1h6.113c1.153 0 2.09-.922 2.109-2.065v-3.247a2.104 2.104 0 0 0-2.074-2.1zM4.18 15.72a.554.554 0 0 0-.555.542v3.734a.556.556 0 0 0 .798.496l.01-.004 3.463-1.756V17.51l-3.467-1.73a.557.557 0 0 0-.249-.06zM9.28 0a5.667 5.667 0 0 1 4.98 2.965 4.921 4.921 0 0 1 3.36-1.317c2.714 0 4.913 2.177 4.913 4.863 0 2.686-2.2 4.863-4.912 4.863a4.921 4.921 0 0 1-3.996-2.034 5.651 5.651 0 0 1-4.345 2.034c-3.131 0-5.67-2.546-5.67-5.687C3.61 2.546 6.149 0 9.28 0Zm8.34 3.926c-1.441 0-2.61 1.157-2.61 2.585s1.169 2.585 2.61 2.585c1.443 0 2.612-1.157 2.612-2.585s-1.169-2.585-2.611-2.585zM9.28 2.287a3.395 3.395 0 0 0-3.39 3.4c0 1.877 1.518 3.4 3.39 3.4a3.395 3.395 0 0 0 3.39-3.4c0-1.878-1.518-3.4-3.39-3.4z"),
upscale: _softGlyph('<path d="M12 18.5V6.5M6.2 12.3 12 6.5l5.8 5.8"/>'),
human: _softGlyph('<circle cx="12" cy="8" r="3.4"/><path d="M5 19.5c1.3-3.4 3.9-5.1 7-5.1s5.7 1.7 7 5.1"/>'),
box: _softGlyph('<path d="M21 8.2 12 3.5 3 8.2v7.6l9 4.7 9-4.7z"/><path d="M3 8.2l9 4.7 9-4.7M12 12.9v7.4"/>'),
voice: _softGlyph('<path d="M4.5 10v4M8.5 7.5v9M12 5v14M15.5 7.5v9M19.5 10v4"/>', "#0D9488", "rgba(13,148,136,.16)"),
/* IMPL-96①：直连 8 模型品牌徽标——通义（Z-Image 紫）/千问（阿里橙）/ASR 麦克风徽 */
tongyi: _logoPath("#615CED", "M23.919 14.545 20.817 9.17l1.47-2.544a.56.56 0 0 0 0-.566l-1.633-2.83a.57.57 0 0 0-.49-.283h-6.207L12.487.402a.57.57 0 0 0-.49-.284H8.732a.56.56 0 0 0-.49.284L5.139 5.775h-2.94a.56.56 0 0 0-.49.284L.077 8.887a.56.56 0 0 0 0 .567L3.18 14.83l-1.47 2.545a.56.56 0 0 0 0 .566l1.634 2.83a.57.57 0 0 0 .49.283h6.205l1.47 2.545a.57.57 0 0 0 .49.284h3.266a.57.57 0 0 0 .49-.284l3.104-5.375h2.94a.57.57 0 0 0 .49-.283l1.634-2.828a.55.55 0 0 0-.004-.568M8.733.686l1.634 2.828-1.634 2.828H21.8L20.164 9.17H7.425L5.63 6.06Zm1.306 19.801-6.205-.002 1.634-2.83h3.265L2.201 6.344h3.267q3.182 5.517 6.367 11.032zm10.124-5.66L18.53 12l-6.532 11.315-1.634-2.83c2.129-3.673 4.25-7.351 6.373-11.028h3.592l3.102 5.374z"),
qwen: _logoPath("#615CED", "M23.919 14.545 20.817 9.17l1.47-2.544a.56.56 0 0 0 0-.566l-1.633-2.83a.57.57 0 0 0-.49-.283h-6.207L12.487.402a.57.57 0 0 0-.49-.284H8.732a.56.56 0 0 0-.49.284L5.139 5.775h-2.94a.56.56 0 0 0-.49.284L.077 8.887a.56.56 0 0 0 0 .567L3.18 14.83l-1.47 2.545a.56.56 0 0 0 0 .566l1.634 2.83a.57.57 0 0 0 .49.283h6.205l1.47 2.545a.57.57 0 0 0 .49.284h3.266a.57.57 0 0 0 .49-.284l3.104-5.375h2.94a.57.57 0 0 0 .49-.283l1.634-2.828a.55.55 0 0 0-.004-.568M8.733.686l1.634 2.828-1.634 2.828H21.8L20.164 9.17H7.425L5.63 6.06Zm1.306 19.801-6.205-.002 1.634-2.83h3.265L2.201 6.344h3.267q3.182 5.517 6.367 11.032zm10.124-5.66L18.53 12l-6.532 11.315-1.634-2.83c2.129-3.673 4.25-7.351 6.373-11.028h3.592l3.102 5.374z"),
mic: _softGlyph('<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5"/>'),
/* ★ R21-4：APIYI 新模型品牌 —— 字节 Seed 系（Seedream/Seedance）与 FLUX（Black Forest Labs）。
   不新造 SVG：用现成 _badgeText 色块字徽（与 云/W/M/V/K 同一套形制）。 */
seed: _logoPath("#325AB4", "M19.8772 1.4685L24 2.5326v18.9426l-4.1228 1.0563V1.4685zm-13.3481 9.428l4.115 1.0641v8.9786l-4.115 1.0642v-11.107zM0 2.572l4.115 1.0642v16.7354L0 21.428V2.572zm17.4553 5.6205v11.107l-4.1228-1.0642V9.2568l4.1228-1.0642z"),
flux: _logoPath("#8f98a5", "M11.402 23.747c.154.075.306.154.454.238.181.038.37.004.525-.097l.386-.251c-1.242-.831-2.622-1.251-3.998-1.602l2.633 1.712Zm-7.495-5.783a8.088 8.088 0 0 1-.222-.236.696.696 0 0 0 .112 1.075l2.304 1.498c1.019.422 2.085.686 3.134.944 1.636.403 3.2.79 4.554 1.728l.697-.453c-1.541-1.158-3.327-1.602-5.065-2.03-2.039-.503-3.965-.977-5.514-2.526Zm1.414-1.322-.665.432c.023.024.044.049.068.073 1.702 1.702 3.825 2.225 5.877 2.731 1.778.438 3.469.856 4.9 1.982l.682-.444c-1.612-1.357-3.532-1.834-5.395-2.293-2.019-.497-3.926-.969-5.467-2.481Zm7.502 2.084c1.596.412 3.096.904 4.367 2.036l.670-.436c-1.484-1.396-3.266-1.953-5.037-2.403v.803Zm.698-2.337a64.695 64.695 0 0 1-.698-.174v.802l.512.127c2.039.503 3.965.978 5.514 2.526l.007.009.663-.431c-.041-.042-.079-.086-.121-.128-1.702-1.701-3.824-2.225-5.877-2.731Zm-.698-1.928v.816c.624.19 1.255.347 1.879.501 2.039.502 3.965.977 5.513 2.526.077.077.153.157.226.239a.704.704 0 0 0-.238-.911l-3.064-1.992c-.744-.245-1.502-.433-2.251-.618a31.436 31.436 0 0 1-2.065-.561Zm-1.646 3.049c-1.526-.4-2.96-.888-4.185-1.955l-.674.439c1.439 1.326 3.151 1.88 4.859 2.319v-.803Zm0-1.772a8.543 8.543 0 0 1-2.492-1.283l-.686.446c.975.804 2.061 1.293 3.178 1.655v-.818Zm0-1.946a7.59 7.59 0 0 1-.776-.453l-.701.456c.462.337.957.627 1.477.865v-.868Zm3.533.269-1.887-1.226v.581c.614.257 1.244.473 1.887.645Zm5.493-8.863L12.381.112a.705.705 0 0 0-.762 0L3.797 5.198a.698.698 0 0 0 0 1.171l7.38 4.797V7.678a.414.414 0 0 0-.412-.412h-.543a.413.413 0 0 1-.356-.617l1.777-3.079a.412.412 0 0 1 .714 0l1.777 3.079a.413.413 0 0 1-.356.617h-.543a.414.414 0 0 0-.412.412v3.488l7.38-4.797a.7.7 0 0 0 0-1.171Z")
};

const MODEL_LOGO = {
nanoBanana2: "google",
nanoBanana_pro: "google",
nanoBanana2Lite: "google",
"gpt-image-2": "openai",
"gpt-image-2.5": "openai",
"gpt-image-2.5-sunburst": "openai",
"gpt-image-2.5-flare": "openai",
aliyun_cutout: "aliyun",
wan3: "wan",
minimax_h3: "minimax",
video_vidu: "vidu",
video_omni: "kling",
veo3_fast: "google",
google_omni: "google",
video_upscaling: "upscale",
digital_humans: "human",
video_package: "box",
audio_tts: "voice",
voice_composite: "voice",
voice_clone: "voice",
/* IMPL-96①：8 直连模型图标（Z-Image→通义 / Kolors→快手同 Kling / Wan3→万相 / TTS→voice / ASR→mic） */
z_image_turbo: "tongyi",
qwen_image_30_pro: "qwen",
kolors: "kling",
wan3_video: "wan",
cosyvoice_v35_plus: "voice",
qwen_audio_tts_plus: "voice",
qwen3_asr_flash: "mic",
tele_speech_asr: "mic",
xingchen_asr_v3: "mic",
qwen3_asr_17b: "mic",
/* ★ R24-A：apiyi: 前缀映射（15 条）—— 宿主列表 logo 一直是空的：MODEL_LOGO 只认裸 id，apiyi 档带前缀查不到。（R21-B 当时只留了注释没写代码，断言又是全局计数 ⇒ 假绿） */
"apiyi:gpt-image-2.5-sunburst": "openai",
"apiyi:gpt-image-2.5-flare": "openai",
"apiyi:gpt-image-2.5-all": "openai",
"apiyi:gpt-image-2.5-vip": "openai",
"apiyi:gpt-image-2": "openai",
"apiyi:seedream-5-0-flash-260915": "seed",
"apiyi:seedream-5-0-260128": "seed",
"apiyi:flux-2-pro": "flux",
"apiyi:nano-banana": "google",
"apiyi:nano-banana-2-lite": "google",
"apiyi:nano-banana-2": "google",
"apiyi:nano-banana-pro": "google",
"apiyi:seedance-2-5-260628": "seed",
"apiyi:veo-3.1-generate-preview": "google",
"apiyi:wan3.0-video": "wan"
};

const modelLogoOf = id => MODEL_BRANDS[MODEL_LOGO[id] || ""] || "";
/* ★ R21-4（修 2026-10-01「价格太长、模型名都看不清」）：宿主列表价格列改**纯人民币短价**。
   与编辑器 priceCnyText 同一口径：perImage=¥x.xx（精确）、perToken=≈¥x.xx（实测参考价）；
   无结构化 billing ⇒ 原文案兜底。完整价签仍在 modelMeta 的 tag 里（hover/详情可见）。 */
/* ★ R22-c（修 2026-10-01「宿主生成按钮上动态显示费用」）：
   与编辑器 mint/priceEngine.js 同一套真值（gpt-image-2概览备份.md 官方 token 表 +
   APIYI 2K/4K 外推系数 + 参考图 1024 tok/$8M + 速创/按次一口价）。 */
/* ★ R22-d（修 2026-10-01「统计要根据真实扣费算」）：从上游响应里取出 usage。
   ⚠ 病根：入账原写 `calcEstimate(model, body)`（传的是**请求体**）⇒ perToken 档拿不到
     in/out tokens ⇒ amount 恒 null ⇒ **易官转三档（sunburst/flare/gpt-image-2）统计漏账为 0**。
   修法 = 入账时把响应里的 usage 并进计费入参；创/按次档仍走配置单价（一口价，本来就是准的）。 */
function usageOfResult(data) {
  try {
    var u = data && (data.usage || (data.data && data.data.usage));
    if (!u) return null;
    var it = u.inTokens != null ? u.inTokens : u.input_tokens;
    var ot = u.outTokens != null ? u.outTokens : u.output_tokens;
    if (it == null && ot == null) return null;
    return { inTokens: Number(it) || 0, outTokens: Number(ot) || 0 };
  } catch (e) { return null; }
}
/* ★ R22-e（修「模型列表后面也跟上动态的费用参数」）：
   ① 当前表单里跟计费相关的键（画质/尺寸/张数/时长/参考图）⇒ 给每个候选模型算各自的价；
   ② 计费方式文案（按次一口价 / 按 Token 随画质·尺寸 / 按秒）。 */
function billParamsOf() {
  try {
    var b = (window.UI && UI._collectParamsSync) ? UI._collectParamsSync() : {};
    var out = {};
    if (b.quality != null && b.quality !== "") out.quality = b.quality;
    if (b.size != null && b.size !== "") out.size = b.size;
    if (b.num != null && b.num !== "") out.num = b.num;
    if (b.duration != null && b.duration !== "") out.duration = b.duration;
    var rc = String(b.urls || "");
    if (rc) out.urls = rc;
    return out;
  } catch (e) { return {}; }
}
function billKindOf(mm) {
  var t = mm && mm.billing && mm.billing.type;
  if (t === "perSecond") return "按秒计费";
  if (t === "perToken") return "按 Token 计费（随画质·尺寸·参考图）";
  if (t === "perImage") return "按次一口价（与参数无关）";
  return "";
}
function billTextOf(mm) {
  var est = null;
  try { est = estCostCny(mm, billParamsOf()); } catch (e) {}
  if (!est || !(est.cny > 0)) return "";
  return (est.approx ? "≈¥" : "¥") + (est.cny < 1 ? est.cny.toFixed(2) : est.cny.toFixed(1));
}
function estCostCny(model, body) {
  try {
    var b = model && model.billing;
    if (!b) return null;
    /* ★ R63-①：张数计入计费 —— 宿主无 num 参数；逐级回退到 DOM 真值（count chip） */
    var _numSrc = (body && body.num != null && body.num !== "") ? body.num
      : (body && body.n != null && body.n !== "") ? body.n : null;
    if (_numSrc == null) { try { _numSrc = (window.UI && window.UI._getBatchCount) ? window.UI._getBatchCount() : 1; } catch (e) {} }
    var num = Math.max(1, parseInt(_numSrc, 10) || 1);
    if (b.type === "perSecond") {
      var s = parseFloat(body && body.duration);
      if (!isFinite(s) || s <= 0) return null;
      return { cny: b.unit * s * num, approx: false, detail: s + "秒" + (num > 1 ? "·×" + num : "") };
    }
    if (b.type === "perImage" && isFinite(Number(b.unit))) {
      return { cny: b.unit * num, approx: false, detail: "一口价" + (num > 1 ? "×" + num + "张" : "") };
    }
    /* ★ R22-g：视频按量计费（官方公式，04-视频API（官转）.md 实测偏差 <0.1%）：
         tokens ≈ (输入视频时长 + 输出视频时长)(秒) × 输出宽 × 输出高 × 24 / 1024
       同分辨率档位下所有宽高比像素面积相同 ⇒ 费用只取决于**分辨率档 + 时长**（+ 是否含输入视频）。 */
    if (b.type === "perToken" && model && model.type === "video") {
      if (model.id === "apiyi:wan3.0-video") return null; /* ★ R22-h2：官方未给折算方式 ⇒ 不估，别编数 */
      var PX = { "480p": 854 * 480, "480P": 854 * 480, "720p": 1280 * 720, "720P": 1280 * 720,
                 "1080p": 1920 * 1080, "1080P": 1920 * 1080, "4k": 3840 * 2160, "4K": 3840 * 2160 };
      var px = PX[body.resolution] || PX["720p"];
      var sec = parseFloat(body.duration);
      if (!isFinite(sec) || sec <= 0) sec = 5;
      var vtoks = sec * px * 24 / 1024;
      var rate = Number(b.outUsdPerM || b.inUsdPerM || 0);
      var vusd = vtoks * rate / 1e6;
      if (vusd <= 0) return null;
      return { cny: vusd * 7 * num, approx: true, detail: (body.resolution || "720p") + "·" + sec + "秒" + (num > 1 ? "·×" + num : "") };
    }
    if (b.type === "perToken") {
      var QT = { low: 196, medium: 439, high: 1756, xhigh: 3122, max: 7024 };
      var SM = { "1K": 1, "2K": 4, "4K": 4.12 };
      var q = QT[body.quality] != null ? body.quality : "medium";
      var px = SM[body.size] != null ? SM[body.size] : 1;
      var outUsd = QT[q] * px * 30 / 1e6;
      var rc = String((body && body.urls) || "");
      var inImgs = rc ? rc.split(",").filter(Boolean).length : 0;
      var inUsd = inImgs * 1024 * 8 / 1e6;
      var usd = (outUsd + inUsd) * num;
      if (usd <= 0) return null;
      return { cny: usd * 7, approx: px > 1, detail: q + "·" + (body.size || "1K") + (inImgs ? "·含" + inImgs + "图" : "") + (num > 1 ? "·×" + num : "") };
    }
  } catch (e) {}
  return null;
}
function priceCnyOf(mm) {
  const b = mm && mm.billing;
  if (b && b.type === "perImage" && isFinite(Number(b.unit))) return "¥" + Number(b.unit).toFixed(2);
  if (b && b.type === "perSecond" && isFinite(Number(b.unit))) return "¥" + Number(b.unit).toFixed(2) + "/秒";
  if (b && b.type === "perToken" && isFinite(Number(b.refCny))) return "≈¥" + Number(b.refCny).toFixed(2);
  return (mm && mm.price) || "";
}

/* IMPL-96③：语音输入 VoiceInput——高品质录音（getUserMedia 回声消除/降噪/自动增益）→
   解码重采样 16k 单声道 WAV（消除 webm/mp4 容器差异，ASR 全兼容）→直连 ASR 链
   （当前所选 ASR 模型 → qwen3-asr-flash 百炼 → TeleSpeech-ASR 硅基免费兜底）→文本追加填入提示词 */
const VoiceInput = {
  MAX_MS: 60000,
  _rec: null, _chunks: [], _stream: null, _timer: 0, _busy: false, _btn: null,
  async toggle(ta, btn) {
    if (this._rec) {
      this._rec.stop();
      return;
    }
    if (this._busy) {
      Toast.info("正在识别中，请稍候");
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") {
      Toast.error("当前浏览器不支持麦克风录音");
      return;
    }
    try {
      this._stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    } catch (err) {
      Toast.error("无法访问麦克风：" + (err && err.name === "NotAllowedError" ? "权限被拒绝，请在浏览器地址栏允许麦克风" : (err && err.message) || err));
      return;
    }
    this._chunks = [];
    let mime = "";
    const cands = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
    for (const c of cands) {
      try { if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c)) { mime = c; break; } } catch (e) {}
    }
    try {
      this._rec = mime ? new MediaRecorder(this._stream, { mimeType: mime }) : new MediaRecorder(this._stream);
    } catch (e) {
      this._cleanup();
      Toast.error("录音器启动失败：" + ((e && e.message) || e));
      return;
    }
    this._rec.ondataavailable = e => { if (e.data && e.data.size) this._chunks.push(e.data); };
    this._rec.onstop = () => this._finish(ta, btn);
    this._btn = btn;
    btn.classList.add("busy");
    this._rec.start();
    Toast.info("录音中…再次点击结束（最长 60 秒）");
    this._timer = setTimeout(() => { if (this._rec && this._rec.state === "recording") this._rec.stop(); }, this.MAX_MS);
  },
  _cleanup() {
    clearTimeout(this._timer);
    if (this._stream) this._stream.getTracks().forEach(t => t.stop());
    this._stream = null;
    this._rec = null;
    if (this._btn) this._btn.classList.remove("busy");
  },
  async _finish(ta, btn) {
    const blob = new Blob(this._chunks, { type: (this._rec && this._rec.mimeType) || "audio/webm" });
    this._cleanup();
    if (blob.size < 2000) {
      Toast.warning("录音太短，未识别");
      return;
    }
    btn.classList.add("proc");
    this._busy = true;
    try {
      const enc = await this._toWav(await blob.arrayBuffer()); /* IMPL-102：{wav,duration} */
      const dataUrl = await new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = () => rej(new Error("音频编码读取失败"));
        fr.readAsDataURL(enc.wav);
      });
      const tr = await this._transcribe(dataUrl, enc.duration);
      const text = tr && tr.text;
      if (!text) throw new Error("未识别到内容");
      ta.value = ta.value ? ta.value.replace(/\s+$/, "") + "\n" + text : text;
      UI._onPromptInput(ta);
      this._noteUsage(tr, enc.duration); /* IMPL-102：语音输入计入媒体统计（时长回填） */
      Toast.success("已识别并填入提示词");
    } catch (err) {
      Toast.error((err && err.message) || String(err));
    } finally {
      this._busy = false;
      btn.classList.remove("proc");
    }
  },
  async _toWav(ab) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) throw new Error("浏览器不支持音频解码");
    const ctx = new AC();
    let buf;
    try { buf = await ctx.decodeAudioData(ab); } finally { try { ctx.close(); } catch (e) {} }
    const rate = 16000, n = Math.max(1, Math.round(buf.duration * rate));
    const chans = [];
    for (let c = 0; c < buf.numberOfChannels; c++) chans.push(buf.getChannelData(c));
    const out = new Float32Array(n), ratio = buf.sampleRate / rate;
    for (let i = 0; i < n; i++) {
      const p = i * ratio, i0 = Math.floor(p), f = p - i0;
      let sum = 0;
      for (let c = 0; c < chans.length; c++) {
        const a = chans[c][i0] || 0, b = chans[c][i0 + 1] != null ? chans[c][i0 + 1] : a;
        sum += a + (b - a) * f;
      }
      out[i] = sum / chans.length;
    }
    const bytes = new ArrayBuffer(44 + out.length * 2), v = new DataView(bytes);
    const ws = (o, s2) => { for (let i = 0; i < s2.length; i++) v.setUint8(o + i, s2.charCodeAt(i)); };
    ws(0, "RIFF"); v.setUint32(4, 36 + out.length * 2, true); ws(8, "WAVE"); ws(12, "fmt ");
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    ws(36, "data"); v.setUint32(40, out.length * 2, true);
    for (let i = 0; i < out.length; i++) {
      const smp = Math.max(-1, Math.min(1, out[i]));
      v.setInt16(44 + i * 2, smp < 0 ? smp * 0x8000 : smp * 0x7fff, true);
    }
    return { wav: new Blob([bytes], { type: "audio/wav" }), duration: buf.duration || 0 }; /* IMPL-102：附带解码时长供 ASR 统计回填 */
  },
  async _transcribe(dataUrl) {
    const cur = UI.state && UI.state.model;
    const dflt = MODELS.audio.find(m => m.id === "qwen3_asr_flash");
    const sfm = MODELS.audio.find(m => m.id === "tele_speech_asr");
    const chain = [];
    if (cur && (cur.direct === "ds-asr" || cur.direct === "sf-asr")) chain.push({ model: cur, body: { audio: dataUrl, language: "auto" } });
    if (dflt) chain.push({ model: dflt, body: { audio: dataUrl, language: "auto" } });
    if (sfm) chain.push({ model: sfm, body: { audio: dataUrl } });
    /* IMPL-101：SF 免费 ASR 兜底尾扩——TeleSpeech 除名/失败时依次降级（前序失败才触达，零额外成本） */
    const xcm = MODELS.audio.find(m => m.id === "xingchen_asr_v3");
    const q17 = MODELS.audio.find(m => m.id === "qwen3_asr_17b");
    if (xcm) chain.push({ model: xcm, body: { audio: dataUrl } });
    if (q17) chain.push({ model: q17, body: { audio: dataUrl } });
    let lastErr = null;
    for (const it of chain) {
      try {
        const r = await Api.directRun(it.model, it.body);
        if (r && r.text) return { text: r.text.trim(), model: it.model, raw: r.raw || null }; /* IMPL-102：附模型与原始响应供统计回填 */
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error("语音识别失败");
  },
  /* IMPL-102：语音输入计入媒体统计——写一条 asr history 记录（IMPL-99「媒体模型调用」区块按 history 聚合自动可见）。
     时长回填优先上游 usage（input_seconds/seconds/duration），缺失/无效回落本地解码时长（_toWav 的 buf.duration）。
     只做统计入账，任何异常静默（不影响识别主流程）。 */
  _noteUsage(tr, localDurSec) {
    try {
      if (!tr || !tr.model) return;
      const raw = tr.raw || {};
      const u = raw.usage || raw;
      const up = [u.input_seconds, u.seconds, u.duration].map(Number).find(Number.isFinite);
      const sec = up > 0 ? up : (Number(localDurSec) > 0 ? Number(localDurSec) : 0);
      const cost = calcEstimate(tr.model, { audioDurationSec: sec }); /* IMPL-102：perSecond×durationKey 真实计费入账 */
      Store.addHistory({
        id: "vi_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        model: tr.model,
        prompt: "（语音输入" + (sec ? " " + (sec >= 10 ? String(Math.round(sec)) : sec.toFixed(1)) + "s" : "") + "）",
        body: { source: "voice-input", audioDurationSec: Math.round(sec * 10) / 10 },
        status: "succeeded",
        createdAt: Date.now(),
        completedAt: Date.now(),
        cost: cost ? cost.amount : 0
      });
      if (typeof UI !== "undefined" && UI.renderHistoryBadge) UI.renderHistoryBadge();
    } catch (e) {}
  }
};

const UI = {
state: {
tab: "image",
model: null,
modelKey: "",
refState: {},
formCache: {},
promptPresetBase: {},
promptPresetName: {},
compareList: [],
selMode: false, /* IMPL-138②：触屏多选模式（长按进入，单击即加选） */
folders: [], /* IMPL-138④/142：无命名 {id,ids[]}，成员为引用集合 */
openFolderId: null, /* IMPL-142 反馈4：当前展开的文件夹（展开态=结果栏只显夹内成员） */
selMax: 12, /* IMPL-138②：多选上限（对比 grid 支持多张；滑块建议 2 张） */
lightboxList: [],
lightboxIdx: 0,
singleList: [],
singleIdx: 0,
singleTaskId: null,
historySearch: "",
historyFilter: "all",
historyTime: "all",
historySel: null,
filter: "all",
resultSearch: "",
sortOrder: "newest",
galleryView: false,
activeRefKey: null,
formUndoSnapshot: null,
hiddenTaskIds: new Set,
activeStripTaskId: null
},
_currentModelId: null,
_titleTimer: null,
_generating: false,
_preloadCache: new Map,
init() {
KeyVault.autoUnlock();
this._updateVaultStatus();
this._bindSwipeNav();
setTimeout(() => VaultSync.bootCheck(), 2200);
this._initGlassSelects();
this.bindEvents();
this.switchTab("image");
this._loadFolders();/* IMPL-142：文件夹数据先行（图标内嵌结果条由 _renderResultStrip 渲染） */
this._renderResultStrip();
this._renderTaskList();
if (Store.useIDB) Store.getTasksAsync().then(t => {
if (t.length && !(this.state.singleList || []).length) this._renderTaskList();
}).catch(() => {});
/* IMPL-95⑧：4.6 IDB 主路回灌——启动时 IDB.history 按 id 并集并入主存（local 优先），一次性「IDB→内存→LS」；
   此后主路照旧（getHistory 纯内存、_hwrite 内存+LS+IDB 双写），41 处调用点零 await 化。
   先于 VaultSync.bootCheck（2.2s 延迟）完成，无云端同步竞态窗口 */
if (Store.useIDB) Store.getHistoryAsync().then(cloud => {
if (Array.isArray(cloud) && cloud.length) {
const local = Store.getHistory();
const ids = new Set(local.map(h => h.id));
const merged = local.concat(cloud.filter(h => !ids.has(h.id))).sort((x, y) => (y.createdAt || 0) - (x.createdAt || 0)).slice(0, 500);
Store.saveHistory(merged);
if (document.getElementById("historySidebar")?.classList.contains("show")) UI.renderHistory();
}
}).catch(() => {});
poller.resumeAll();
this._bindConnectivity();
this._startTitleTimer();
this._startTaskCardTicker();
this.renderHistoryBadge();
this._bindMobileViewSwitch();
this._bindDrawerSwipe();
this._bindQuickParams();
this._bindStripWheel();
AmbientFX.setGenerating(Store.getTasks().some(t => t.status === "processing"));
const _bootHistSync = () => {/* IMPL-125 B'：启动历史拉取不再要求 TC——_syncHistoryFromCloud 内部 TC 优先、R2 兜底（bootCheck 自动解锁时凭据已就位即可拉） */
this._syncHistoryFromCloud().then(() => {
this._renderTaskList();
this.renderHistoryBadge();
if ($("#historySidebar")?.classList.contains("show")) this.renderHistory();
}).catch(() => {});
};
if (typeof TaskCenter !== "undefined") {
TaskCenter.init().then(_bootHistSync).catch(() => { _bootHistSync(); });
} else {
_bootHistSync();
}
this._initHistoryThumbLoader();
this._bindPromptGrowOnResize();
/* IMPL-122：版本自证——版本变化首启 Toast（看到提示=页面确实加载了新版代码；
   若更新后打开页面从未见过此提示，说明浏览器还在跑旧标签页或旧文件——
   关闭该站点全部标签页重开，或重新获取最新文件。iOS Safari 常驻标签页恢复不重载 HTML） */
try {
const _v = document.querySelector(".about-ver")?.textContent?.trim() || "";
if (_v) {
let _lv = null;
try { _lv = localStorage.getItem("sc_last_ver"); } catch (e) {}
if (_lv !== _v) {
setTimeout(() => { try { Toast.success("已更新到 " + _v + " —— 看到此提示说明页面已加载最新版"); } catch (e) {} }, 4200);
try { localStorage.setItem("sc_last_ver", _v); } catch (e) {}
}
}
} catch (e) {}
setTimeout(() => {
if (Store.getSync() && KeyVault.unlocked) this._archivePendingHistory();
}, 3500);
},
_scheduleHistorySync() {
clearTimeout(this._historySyncTimer);
/* ★ R91-E：30s → 8s。修反馈「在另一台电脑生的图，这边统计看不到」——
   推送此前只有「30s 去抖定时器 + pagehide beacon」两条路，而定时器期间**再生成会一直重置**
   ⇒ 「生一批就切走」很可能一次都没推成（beacon 是最后一道保险，但不该是唯一一道）。
   8s 仍能把连续生成合并成一次推送；服务端按 id 合并，PUT 幂等，无副作用。 */
this._historySyncTimer = setTimeout(() => this._syncHistoryToCloud(), 8e3);
},
/* IMPL-125 B'：历史同步云端 base 选择——对齐 _statsCloudBase「TC 优先、R2 兜底」同款模式。
   考古实证（IMPL-124）：云端历史槽位 /userdata?key=history 一直在 R2 Worker（105 条），
   原先拉取/推送写死 TC 硬依赖 → 手机端（簿内仅 R2 两项）历史同步从未工作。
   解锁后 KeyVault._apply() 回填 BUILTIN + Store.getR2AuthToken() 优先 KeyVault.keys()，R2 两项立即可用。 */
_histCloudBase() {
if (typeof TaskCenter !== "undefined" && TaskCenter.isAvailable()) return { base: TaskCenter.workerUrl, token: TaskCenter.token };
const r2Url = (Store.getR2WorkerUrl() || "").trim().replace(/\/$/, "");
const r2Tok = (Store.getR2AuthToken() || "").trim();
return r2Url && r2Tok ? { base: r2Url, token: r2Tok } : null;
},
async _syncHistoryToCloud() {
if (!Store.getSync()) return;
const c = this._histCloudBase();
if (!c) return;
try {
const local = Store.getHistory();
/* ★ R79-A：推送前**先拉取云端并合并**再写回 —— 根治「以少覆多」。
   事故原型：某台设备本地只有 2 条，直接 PUT 就把云端 105 条整体覆盖成 2 条。
   现在永远先取云端、按 id 合并（completedAt 新的胜），再推送合并结果。
   云端读不到时保守推本地（读失败不该阻塞同步，且此时本地通常就是最新的）。 */
let cloud = [];
try {
const r = await fetch(c.base + "/userdata?key=history&token=" + encodeURIComponent(c.token));
const d = await r.json();
if (d && d.ok && Array.isArray(d.data)) cloud = d.data;
} catch (_e) {}
const merged = cloud.length ? this._mergeHistory(local, cloud) : local;
if (merged !== local) { try { Store.saveHistory(merged); } catch (_e) {} }
/* ★ R79-C：滤掉还没转存的 blob: 条目 —— 它们只在本页有效，推上云别的设备必然打不开 */
const payload = (Array.isArray(merged) ? merged : []).filter(function (h) {
return String((h && h.result && h.result.url) || "").indexOf("blob:") !== 0;
}).slice(0, 500);
await fetch(c.base + "/userdata?key=history&token=" + encodeURIComponent(c.token), {
method: "PUT",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(payload)
});
/* ★ R80-D2：墓碑单独推（独立 key）—— 即使线上 Worker 还是旧版（只认数组），history 也照常同步 */
try {
if (window.__r80Tomb) window.__r80Tomb.sync((payload || []).map(function (h) { return h && h.id; }).filter(Boolean));
const _tb = (window.__r80Tomb ? window.__r80Tomb.load() : []);
if (_tb.length) {
await fetch(c.base + "/userdata?key=historytomb&token=" + encodeURIComponent(c.token), {
method: "PUT",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(_tb)
});
}
} catch (_e) {}
try { localStorage.setItem("sc_hist_push_at", String(Date.now())); } catch (_e) {}
} catch (e) {}
},
async _syncHistoryToCloudNow() {
return this._syncHistoryToCloud(); /* IMPL-160：与 _syncHistoryToCloud 逐字节同体（IMPL-118 复制分裂）——收敛为委托防漂移 */
},
/* IMPL-118③：解锁=数据链就位——立即同步云端历史并刷新最近结果（不等重启/30s 轮询；手机端启动时 TaskCenter 未就位或 getSync 关闭时此路径是唯一触发点） */
_vaultAfterUnlock() {
if (!this._histCloudBase()) { this._renderCloudSyncStatus(); return; }/* IMPL-125 B'：TC 与 R2 兜底皆不可用才止步（解锁后簿内 R2 两项即位即同步；状态行可见指引） */
this._syncHistoryFromCloud(true).then(() => {
this._renderTaskList();
this.renderHistoryBadge();
if ($("#historySidebar")?.classList.contains("show")) this.renderHistory();
}).catch(() => {});
try { this._archivePendingHistory(); } catch (e) {}
},
async _syncHistoryFromCloud(force) {
if (!Store.getSync() && !force) return; /* IMPL-118③：force=解锁后显式拉取，绕过自动同步开关（开关仅管后台轮询/归档） */
const c = this._histCloudBase();
if (!c) return;
try {
const res = await fetch(c.base + "/userdata?key=history&token=" + encodeURIComponent(c.token));
const data = await res.json();
if (data.ok && data.data && Array.isArray(data.data)) {
const local = Store.getHistory();
const merged = this._mergeHistory(local, data.data);
Store.saveHistory(merged);
try { localStorage.setItem("sc_hist_sync_at", String(Date.now())); } catch (e) {}/* IMPL-122：上次云端拉取时间（设置抽屉状态行展示） */
this._renderCloudSyncStatus();/* IMPL-122：抽屉开着时状态行即时刷新 */
this._renderResultStrip();
this._archivePendingHistory();
}
} catch (e) {}
},
_archivePendingHistory() {
if (!Store.getSync()) return;
let pBase = "";
if (typeof TaskCenter !== "undefined" && TaskCenter.isAvailable()) pBase = TaskCenter.workerUrl; else {
const r2Url = (Store.getR2WorkerUrl() || "").trim().replace(/\/$/, "");
if (!r2Url || !(Store.getR2AuthToken() || "").trim()) return;
pBase = r2Url;
}
const hist = Store.getHistory();
const isCloud = u => u.startsWith(pBase) || /\.r2\.dev\//.test(u);
const pending = hist.filter(h => h.status === "succeeded" && h.result?.url && !isCloud(h.result.url) && !h.result.originalUrl && (/^https?:/.test(h.result.url) || String(h.result.url).indexOf("blob:") === 0)); /* ★ R74-4：blob: 也补转存 */
pending.slice(0, 3).forEach(h => {
this._archiveResult(h).catch(() => {});
});
},
_mergeHistory(local, cloud) {
const map = new Map;
[ ...cloud, ...local ].forEach(h => {
const ex = map.get(h.id);
if (!ex || (h.completedAt || 0) > (ex.completedAt || 0)) map.set(h.id, h);
});
return Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
},
_startTitleTimer() {
if (this._titleTimer) clearInterval(this._titleTimer);
this._titleTimer = setInterval(() => this._updateTitle(), 1e3);
},
_updateTitle() {
/* 78-r6：raw 指纹缓存——闲置每秒 tick 不再 JSON.parse 整个 sc_tasks（任务状态只经 saveTasks/storageSet 落盘，raw 变化即失效，语义与直读一致） */
const raw = storageGet(CONFIG.STORAGE_KEYS.TASKS, "[]");
if (raw !== this._titleTasksRaw) {
this._titleTasksRaw = raw;
try { this._titleProcessing = JSON.parse(raw).filter(t => t.status === "processing"); } catch (e) { this._titleProcessing = []; }
}
const tasks = this._titleProcessing || [];
let next;
if (tasks.length) {
const oldest = tasks.reduce((a, b) => a.createdAt < b.createdAt ? a : b);
const elapsed = Date.now() - oldest.createdAt;
next = `⏳ ${tasks.length} 个任务生成中 · 已等 ${fmtDur(elapsed)}`;
} else {
next = "修的媒体工作台 " + (document.querySelector(".about-ver")?.textContent?.trim() || "V26.10.5");
}
if (document.title !== next) document.title = next;
},
bindEvents() {
$("#tabs").addEventListener("click", e => {
const t = e.target.closest(".tab");
if (t) this.switchTab(t.dataset.tab);
});
this._bindModelPick();
$("#modelSelect").addEventListener("change", e => {
const m = MODELS[this.state.tab].find(x => x.id === e.target.value);
if (m) {
this._saveFormToCache();
this.state.model = m;
this.state.modelKey = `${this.state.tab}/${m.id}`;
this._updateModelBar();
this.renderParamForm(m.id);
this._restoreFormFromCache();
}
});
$("#filterTabs").addEventListener("click", e => {
const t = e.target.closest(".filter-tab");
if (t) {
$$("#filterTabs .filter-tab").forEach(x => x.classList.remove("active"));
t.classList.add("active");
this.state.filter = t.dataset.filter;
this._renderTaskList();
}
});
this._searchDebounce = _debounce(v => {
this.state.resultSearch = v;
this._renderTaskList();
}, 120);
$("#resultSearchInput").addEventListener("input", e => this._searchDebounce(e.target.value));
$("#sortSelect").addEventListener("change", e => {
this.state.sortOrder = e.target.value;
this._renderTaskList();
});
$("#bulkDeleteBtn").addEventListener("click", () => this._bulkDeleteByFilter());
$("#restoreBtn").addEventListener("click", () => this._restoreHidden());
/* ★ R22-c：参数变化 → 刷新按钮金额（input/select 委托 + 200ms 合帧） */
if (!window.__r22CostHooked) {
window.__r22CostHooked = true;
var _r22t = 0;
var _r22refresh = function() { clearTimeout(_r22t); _r22t = setTimeout(function() { try { if (window.UI && UI._refreshGenerateBtn) UI._refreshGenerateBtn(); } catch (_) {} }, 200); };
document.addEventListener("input", function(e) { try { if (e.target && e.target.closest && e.target.closest("[data-key]")) _r22refresh(); } catch (_) {} });
document.addEventListener("change", function(e) { try { if (e.target && e.target.closest && (e.target.closest("[data-key]") || e.target.closest("#modelSelect"))) _r22refresh(); } catch (_) {} });
}
/* ★ R26-G（2026-10-02）：window.UI 此前**从未赋值** ⇒ 'window.UI && UI._refreshGenerateBtn' 恒短路，
   生成按钮金额从未刷新过（R22 上线即假绿）。此处补引用 + 切模型（#modelSelect）也触发刷新。 */
window.UI = this;
/* ★ R9B-FE-P1-2（报告 02）/ SEC-P1-5（报告 03）：全站此前**无任何全局兜底**（unhandledrejection / error 各 0 处）。
   未捕获的 Promise 拒绝只进 devtools ⇒ 用户侧「点了没反应」且无痕迹。这里只**报告**、不改行为。
   ⚠ 节流：10s 内最多一条 Toast（避免软键盘/网络抖动刷屏）。⚠ error 用 capture=false ⇒ **不会**捕获资源加载错误（CF 探针那种）。 */
try {
  if (!window.__r9bGlobalHooked) {
    window.__r9bGlobalHooked = true;
    var _r9bLastAt = 0;
    var _r9bReport = function (kind, msg) {
      try { console.warn("[R9B-global] " + kind + ": " + msg); } catch (_) {}
      var _now = Date.now();
      if (_now - _r9bLastAt < 1e4) return;
      _r9bLastAt = _now;
      try { Toast.error("页面出现未处理异常（" + kind + "）：功能可能未完成，详情已记录到控制台", 6e3); } catch (_) {}
    };
    window.addEventListener("unhandledrejection", function (e) { try { var r = e && e.reason; _r9bReport("promise", String((r && (r.message || r)) || "").slice(0, 160)); } catch (_) {} });
    window.addEventListener("error", function (e) { try { _r9bReport("error", String((e && e.message) || "").slice(0, 200)); } catch (_) {} });
  }
} catch (_) {}
$("#generateBtn").addEventListener("click", () => this.handleGenerate());
$("#copyWorkflowBtn").addEventListener("click", () => {
const task = this._buildCurrentTask();
if (task) Workflow.copy(task);
});
$("#importWorkflowBtn").addEventListener("click", () => {
$("#workflowInput").value = "";
$("#workflowOverlay").classList.add("show");
});
$("#workflowApply").addEventListener("click", () => {
const text = $("#workflowInput").value.trim();
if (text) {
Workflow.apply(text);
$("#workflowOverlay").classList.remove("show");
}
});
$("#workflowCancel").addEventListener("click", () => $("#workflowOverlay").classList.remove("show"));
$("#workflowClose").addEventListener("click", () => $("#workflowOverlay").classList.remove("show"));
$("#settingsBtn").addEventListener("click", () => this._openSettings());
/* R45-2：明暗主题（宿主首套主题机制）+ 编辑器入口（空白画布） */
(function () {
  var root = document.documentElement;
  var btn = $("#themeToggleBtn"), icon = $("#themeToggleIcon");
  var SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>';
  var MOON = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  function paint(t) {
    root.setAttribute("data-theme", t);
    if (icon) icon.innerHTML = (t === "dark") ? SUN : MOON;
    if (btn) btn.title = (t === "dark") ? "切换到亮色" : "切换到暗色";
    try { document.dispatchEvent(new CustomEvent("w5:theme", { detail: { theme: t } })); } catch (_) {}
  }
  paint(root.getAttribute("data-theme") === "light" ? "light" : "dark");
  if (btn) btn.addEventListener("click", function () {
    var next = (root.getAttribute("data-theme") === "dark") ? "light" : "dark";
    paint(next);
    try { localStorage.setItem("w5_theme", next); } catch (_) {}
  });
})();
$("#openStudioBtn").addEventListener("click", () => {
  const model = this._studioGuard();
  if (!model) return;
  window.StudioEditor.open({ onSave: this._studioOnSave(model) });
});
$("#skillModelRefreshBtn").addEventListener("click", () => this.refreshSkillModels());
/* R51-4b：技能区现常显于主面板（此前 renderSkillModels 只在「打开设置」时被调 —— @openSettings）
   ⇒ 补一次初始渲染，否则列表/徽标到首次打开设置前都是空的 */
try { this.renderSkillModels(); } catch (_) {}
/* ── R52：三模式按钮的事件绑定（原提示词工具行的按钮 → 技能区；原 wrap 内绑定随搬离失效）── */
(function (app) {
  var box = document.querySelector(".skill-mode-row");
  if (!box) return;
  [["think", "_flipThink"], ["relay", "_flipRelay"], ["discuss", "_flipDiscuss"]].forEach(function (pair) {
    var b = box.querySelector("[data-mode-" + pair[0] + "]");
    if (b) b.addEventListener("click", function (e) {
      e.stopPropagation();
      if (app[pair[1]]) app[pair[1]]();
    });
  });
})(this);
/* ── R54：讨论模型按钮（与技能模型同款样式；点击唤起原生下拉；badge 同步）── */
(function () {
  var btn = document.getElementById("discussModelBtn");
  var sel = document.getElementById("skillModeModel");
  var badge = document.getElementById("discussModelBadge");
  function syncBadge() {
    if (!sel || !badge) return;
    var o = sel.options[sel.selectedIndex];
    badge.textContent = o ? o.textContent : (sel.value || "讨论模型");
  }
  if (btn && sel) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      try { sel.showPicker(); } catch (_) { try { sel.focus(); } catch (__) {} }
    });
    sel.addEventListener("change", syncBadge);
    if (window.MutationObserver) {
      try { new MutationObserver(syncBadge).observe(sel, { childList: true }); } catch (_) {}
    }
    syncBadge();
  }
})();
/* ── R62：技能模型模块「选了技能才出现」（样式不动；不选就等于没有）── */
(function () {
  var wrap = document.getElementById("setSecModel");
  if (!wrap) return;
  function sync() {
    var on = !!document.querySelector(".skill-bubbles .sb-chip");
    wrap.classList.toggle("is-skill-off", !on);
  }
  if (window.MutationObserver) { try { new MutationObserver(sync).observe(document.body, { childList: true, subtree: true }); } catch (e) {} }
  sync();
})();
/* R60：加载即刷新一次金额胶囊（原先要换一次模型才显示） */
setTimeout(function () { try { if (window.UI && window.UI._refreshGenerateBtn) window.UI._refreshGenerateBtn(); } catch (e) {} }, 400);
/* ── R51：技能模型区（弹出面板开合 + 讨论模式单/双栏联动）── */
(function () {
  var btn = document.getElementById("skillModelPickBtn");
  var pop = document.getElementById("skillPop");
  var wrap = document.getElementById("setSecModel");
  function setOpen(on) {
    if (!pop) return;
    if (on) { pop.removeAttribute("hidden"); } else { pop.setAttribute("hidden", ""); }
    if (btn) btn.setAttribute("aria-expanded", on ? "true" : "false");
  }
  if (btn && pop) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(pop.hasAttribute("hidden"));
    });
    document.addEventListener("click", function (e) {
      if (pop.hasAttribute("hidden")) return;
      if (pop.contains(e.target) || btn.contains(e.target)) return;
      setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }
  function syncCols() {
    if (!wrap) return;
    var on = false;
    try { if (typeof Store !== "undefined" && Store.getSkillDiscuss) on = !!Store.getSkillDiscuss(); } catch (_) {}
    wrap.setAttribute("data-discuss", on ? "1" : "0");
  }
  syncCols();
  /* R54 修正：R52 把三开关换成 mode-btn 后，旧 id #skillDiscussToggle 已不存在
     ⇒ 观察对象改为技能区的讨论按钮（_syncModeUI 会更新它的 class / aria-pressed） */
  var discSw = document.querySelector(".skill-mode-row [data-mode-discuss]") || document.getElementById("skillDiscussToggle");
  if (discSw && window.MutationObserver) {
    try { new MutationObserver(syncCols).observe(discSw, { attributes: true, attributeFilter: ["class", "aria-checked", "aria-pressed"] }); } catch (_) {}
  }
})();
{
/* IMPL-73：三开关状态机放宽——讨论×思考兼容（讨论选的即顶尖思考模型，深度思考是增益；成本/耗时由用户自主选择，Toast 提示不强制）。
   唯一结构互斥：接棒⊗讨论（编排管线二选一）。联动=开接棒→关讨论；开讨论→关接棒；思考自由开关不联动。
   Store+DOM 双写，重开设置由 renderSkillModels 归一校验（仅接棒×讨论脏状态）。 */
const thinkSw = $("#skillThinkToggle");
const relaySw = $("#skillRelayToggle");
const discSw = $("#skillDiscussToggle");
const modeSel = $("#skillModeModel");
const syncSw = (el, on) => { if (el) { el.classList.toggle("on", on); el.setAttribute("aria-checked", on ? "true" : "false"); } };
/* IMPL-78 R2：三模式状态源统一为 Store——flip 升级为实例方法（_flipThink/_flipRelay/_flipDiscuss），_syncModeUI 双写设置抽屉开关 + 提示词工具行图标按钮 */
this._syncModeUI = scope => {
/* 78-r2：scope 优先——_buildPromptModule 内 wrap 尚未 append（detached），document.querySelector 搜不到，必须传 wrap */
const root = scope || document;
const tOn = Store.getSkillThinking(), rOn = Store.getSkillRelay(), dOn = Store.getSkillDiscuss();
syncSw(thinkSw, tOn);
syncSw(relaySw, rOn);
syncSw(discSw, dOn);
[[ "think", tOn ], [ "relay", rOn ], [ "discuss", dOn ]].forEach(([ k, on ]) => {
const b = root.querySelector(`[data-mode-${k}]`);
if (b) {
b.classList.toggle("on", on);
b.setAttribute("aria-pressed", String(on));
}
});
};
this._flipThink = () => {
/* IMPL-73：讨论×思考兼容——守卫按「生效模型」判定（讨论态守卫对象是讨论主模型）；IMPL-74：仅开启方向被守卫拦截，关闭是用户级权利 */
const on = !Store.getSkillThinking();
const effModel = Store.getSkillDiscuss() ? Store.getSkillDiscussModel() : Store.getSkillModel();
if (on && !_modelThinkCapable(effModel)) {
Toast.info("当前技能模型不支持深度思考——开关偏好已保留，换用支持思考的模型后自动生效", 2600);
return;
}
Store.setSkillThinking(on);
this._syncModeUI();
if (on && Store.getSkillDiscuss()) {
Toast.info("思考模式已开启 · 讨论各段将深度思考（每轮 3~4 次深度调用，耗时与成本更高，请耐心等待）", 3200);
} else {
Toast.info(on ? "思考模式已开启" : "思考模式已关闭", 1500);
}
if (this.renderSkillModels) this.renderSkillModels();
};
this._flipRelay = () => {
const on = !Store.getSkillRelay();
Store.setSkillRelay(on);
if (on && Store.getSkillDiscuss()) {
Store.setSkillDiscuss(false);
Toast.info("接棒模式已开启：识图 → 思考接棒 · 已自动关闭讨论模式（两种编排不可并存）", 2600);
} else {
Toast.info(on ? "接棒模式已开启：识图 → 思考接棒（仅带图轮次生效）" : "接棒模式已关闭", 2000);
}
this._syncModeUI();
if (this.renderSkillModels) this.renderSkillModels();
};
this._flipDiscuss = () => {
const on = !Store.getSkillDiscuss();
Store.setSkillDiscuss(on);
if (on) {
const closed = [];
if (Store.getSkillRelay()) { Store.setSkillRelay(false); closed.push("接棒模式"); }
const thinkOn = Store.getSkillThinking();
Toast.info("讨论模式已开启：双模型会诊 + 终结者收拢（每轮 3~4 次调用）" + (closed.length ? " · 已自动关闭" + closed.join("、") : "") + (thinkOn ? " · 思考已开启：各段深度思考，耗时更长" : ""), thinkOn ? 3600 : 2800);
} else {
Toast.info("讨论模式已关闭", 2000);
}
this._syncModeUI();
if (this.renderSkillModels) this.renderSkillModels();
};
if (thinkSw) {
thinkSw.addEventListener("click", () => this._flipThink());
thinkSw.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); this._flipThink(); } });
}
if (relaySw) {
relaySw.addEventListener("click", () => this._flipRelay());
relaySw.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); this._flipRelay(); } });
}
if (discSw) {
discSw.addEventListener("click", () => this._flipDiscuss());
discSw.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); this._flipDiscuss(); } });
}
/* IMPL-78 R2：bindEvents 晚于首帧渲染时补一次同步（_buildPromptModule 内的调用只在重渲染时生效） */
this._syncModeUI();
/* IMPL-72 需求⑥：识与论切——按当前模式写不同 Store 键，Toast 文案区分 */
if (modeSel) modeSel.addEventListener("change", () => {
if (Store.getSkillDiscuss()) {
Store.setSkillDiscussModel(modeSel.value);
Toast.info("讨论主模型已切换：" + SkillSession._skillLabel(modeSel.value), 1800);
} else {
Store.setSkillVisionModel(modeSel.value);
Toast.info("识图模型已切换", 1500);
}
});
}
$("#skillModelSearch").addEventListener("input", () => {
const q = $("#skillModelSearch").value.trim().toLowerCase();
$$("#skillModelCatalog .sm-cat-row").forEach(r => { r.style.display = (!q || r.textContent.toLowerCase().includes(q)) ? "" : "none"; });
$$("#skillModelCatalog .sm-cat-h").forEach(h => {
let el = h.nextElementSibling, any = false;
while (el && !el.classList.contains("sm-cat-h")) { if (el.classList.contains("sm-cat-row") && el.style.display !== "none") { any = true; break; } el = el.nextElementSibling; }
h.style.display = any ? "" : "none";
});
});
$("#settingsClose").addEventListener("click", () => this._closeSettings());
$("#settingsOverlay").addEventListener("click", () => this._closeSettings());
$("#vaultUnlockBtn").addEventListener("click", async () => {
const pw = $("#vaultPwInput").value;
if (!pw) {
Toast.warning("请输入密码");
return;
}
const btn = $("#vaultUnlockBtn"), oldText = btn.textContent;
btn.disabled = true;
btn.textContent = "解锁中…";
const _sum = obj => {
const ks = obj && obj.keys || {};
return {total: Object.keys(ks).length, filled: Object.keys(ks).filter(k => ks[k]).length};
};
try {
let r = null;
let _legacyHit = false;
/* IMPL-116：恢复旧版恢复通道——IMPL-104 拆除两条后门时未同步告知用户旧密码值，从未设自设密码的用户被锁门外；单人使用场景应用户要求恢复。动态密码（UTC+8 日+月+小时，±1h 窗口）仅作握手口令，解密仍用旧主密码；主密码拆串存放避免明文一眼可读 */
const _lgMaster = () => { try { return atob(["Nz", "M5", "Mj", "A0", "MT", "Y="].join("")); } catch (e) { return ""; } };
const _lgTp = ms => { const t = new Date(ms + 8 * 36e5); const p = n => String(n).padStart(2, "0"); return p(t.getUTCDate()) + p(t.getUTCMonth() + 1) + p(t.getUTCHours()); };
const _isLegacy = pw => { if (!pw) return false; const m = _lgMaster(); if (m && pw === m) return true; const n = Date.now(); return pw === _lgTp(n) || pw === _lgTp(n - 36e5) || pw === _lgTp(n + 36e5); };
const _remoteIssue = m => /尚未上传|不可用|拉取失败|未配置/.test(m || "");
if (KeyVault.isCustomActive()) {
try {
r = KeyVault.unlock(pw);
} catch (err) {
const m = err && err.message || "";
if (!/密码错误/.test(m) && !_remoteIssue(m)) throw err;
if (!_remoteIssue(m)) {
/* IMPL-116：legacy 优先离线解本地簿（不依赖网络） */
if (_isLegacy(pw)) {
try { r = KeyVault.unlock(_lgMaster()); _legacyHit = true; } catch (_e) {}
}
if (!r) {
let remote = null;
try {
remote = await VaultSync._getRemote();
} catch (re) {
if (_remoteIssue(re && re.message || "")) throw err;
throw re;
}
const st = VaultSync.state();
if (st.fp && remote.fp === st.fp) {
/* 本地与远端一致仍解不开：legacy 口令时用主密码试拉远端簿，其余确认为密码错误 */
if (_isLegacy(pw)) {
try { r = _sum(await VaultSync.pull(_lgMaster())); _legacyHit = true; } catch (_e2) { throw err; }
} else throw err;
} else {
try {
r = _sum(await VaultSync.pull(pw));
} catch (pe) {
if (_isLegacy(pw) && !_remoteIssue(pe && pe.message || "")) { r = _sum(await VaultSync.pull(_lgMaster())); _legacyHit = true; }
else throw pe;
}
}
}
}
}
} else {
try {
r = _sum(await VaultSync.pull(pw));
} catch (pe) {
if (_isLegacy(pw) && !_remoteIssue(pe && pe.message || "")) { r = _sum(await VaultSync.pull(_lgMaster())); _legacyHit = true; }
else throw pe;
}
}
$("#vaultPwInput").value = "";
Toast.success(`已解锁：${r.filled}/${r.total} 项就位`);
this._updateVaultStatus();
/* IMPL-118③：簿内任务中心凭据 → 落地 localStorage 并重连（向前兼容：编辑密钥补 TASK_CENTER_URL/TOKEN 两项后新机解锁即自动接上）；init 异步，完成后与常规路径同走 _vaultAfterUnlock */
try {
const _k = KeyVault.keys();
if (_k.TASK_CENTER_URL && _k.TASK_CENTER_TOKEN) {
storageSet(CONFIG.STORAGE_KEYS.TASK_CENTER_URL, String(_k.TASK_CENTER_URL).trim());
storageSet(CONFIG.STORAGE_KEYS.TASK_CENTER_TOKEN, String(_k.TASK_CENTER_TOKEN).trim());
if (typeof TaskCenter !== "undefined" && !TaskCenter.enabled) TaskCenter.init().then(() => this._vaultAfterUnlock()).catch(() => {});
}
} catch (e) {}
if (this._histCloudBase()) this._vaultAfterUnlock();/* IMPL-125 B'：解锁即同步（TC 或 R2 任一就位） */
else setTimeout(() => { if (Store.getSync() && !this._histCloudBase()) Toast.info("解锁保险箱并配置云端同步后，可跨设备同步最近结果"); }, 2500);
} catch (err) {
const msg = err.message || "解锁失败";
if (/密码错误/.test(msg)) Toast.error("密码错误");
else Toast.error(msg);
} finally {
btn.disabled = false;
btn.textContent = oldText;
}
});
$("#vaultPwInput").addEventListener("keydown", e => {
if (e.key === "Enter") {
e.preventDefault();
$("#vaultUnlockBtn").click();
}
});
$("#vaultChangeBtn").addEventListener("click", () => {
if (!KeyVault.unlocked) {
Toast.warning("请先解锁保险箱");
return;
}
const form = $("#keyEditForm"), done = $("#keyEditDone");
[ "kKeyApi", "kKeyR2Url", "kKeyR2Token", "kKeyAk", "kKeySk" ].forEach(id => {
const el = $("#" + id);
if (el) el.value = "";
});
if (form) form.style.display = "";
if (done) done.style.display = "none";
$("#keyEditOverlay").classList.add("show");
setTimeout(() => {
const first = $("#kKeyApi");
if (first) first.focus();
}, 120);
});
$("#keyEditClose").addEventListener("click", () => $("#keyEditOverlay").classList.remove("show"));
$("#keyEditOverlay").addEventListener("click", e => {
if (e.target === e.currentTarget) e.currentTarget.classList.remove("show");
});
$("#keyEditConfirm").addEventListener("click", () => {
const vals = {
API_KEY: ($("#kKeyApi") || {}).value || "",
R2_WORKER_URL: ($("#kKeyR2Url") || {}).value || "",
R2_AUTH_TOKEN: ($("#kKeyR2Token") || {}).value || "",
IMAGESEG_AK: ($("#kKeyAk") || {}).value || "",
IMAGESEG_SK: ($("#kKeySk") || {}).value || ""
};
const filled = Object.keys(vals).filter(k => vals[k].trim());
if (!filled.length) {
Toast.warning("请至少填写一项");
return;
}
try {
const nk = Object.assign({}, KeyVault.keys());
filled.forEach(k => {
nk[k] = vals[k].trim();
});
KeyVault._keys = nk;
KeyVault._apply();
const pw = KeyVault._pw || "";
if (pw) { /* IMPL-104（S-1）：master 兜底已拆除 */
try {
KeyVault.reEncrypt(pw);
} catch (e) {}
}
const form = $("#keyEditForm"), done = $("#keyEditDone");
if (form) form.style.display = "none";
if (done) done.style.display = "";
this._updateVaultStatus();
Toast.success("新密码簿已生成，可下载上传");
} catch (err) {
Toast.error(err.message || "生成失败");
}
});
$("#keyEditDownload").addEventListener("click", async () => {
const btn = $("#keyEditDownload");
const oldText = btn.textContent;
btn.disabled = true;
btn.textContent = "生成中…";
try {
await VaultSync.downloadBin();
Toast.success("新密码簿已下载，请上传到仓库 vault/ 目录");
$("#keyEditOverlay").classList.remove("show");
} catch (err) {
Toast.error(err.message || "下载失败");
} finally {
btn.disabled = false;
btn.textContent = oldText;
}
});
/* IMPL-117：上锁=上锁+附带重置本机保险箱（清本地簿与同步指纹，云端簿不受影响）；确认弹窗只描述行为不提示任何密码线索 */
$("#vaultLockBtn").addEventListener("click", () => {
if (!window.confirm("上锁并清除本机保险箱缓存？\n（之后解锁将重新拉取）")) return;
KeyVault.resetToEmbedded();
KeyVault.forgetPw();
VaultSync.saveState(null);
Toast.info("已上锁");
this._updateVaultStatus();
});
$("#cleanLocalBtn").addEventListener("click", () => this._confirmCleanLocal());
$("#cleanCloudBtn").addEventListener("click", () => this._confirmCleanCloud());
$("#soundToggle").addEventListener("click", () => this.toggleSound());
$("#cloudSyncToggle").addEventListener("click", () => this.toggleCloudSync());
$("#soundBtn").addEventListener("click", () => this.toggleSound());
$("#historyBtn").addEventListener("click", () => this._openHistory());
$("#historyClose").addEventListener("click", () => this._closeHistory());
$("#historyOverlay").addEventListener("click", () => this._closeHistory());
this._histSearchDebounce = _debounce(v => {
this.state.historySearch = v;
this.renderHistory();
}, 120);
$("#historySearchInput").addEventListener("input", e => this._histSearchDebounce(e.target.value));
$("#historyFilters").addEventListener("click", e => {
const t = e.target.closest(".filter-tab");
if (t) {
$$("#historyFilters .filter-tab").forEach(x => x.classList.remove("active"));
t.classList.add("active");
this.state.historyFilter = t.dataset.hfilter;
this.renderHistory();
}
});
$("#historyTimeFilters").addEventListener("click", e => {
const t = e.target.closest(".filter-tab");
if (t) {
$$("#historyTimeFilters .filter-tab").forEach(x => {
x.classList.remove("active");
x.setAttribute("aria-pressed", "false");
});
t.classList.add("active");
t.setAttribute("aria-pressed", "true");
this.state.historyTime = t.dataset.htime;
this.renderHistory();
}
});
$("#historySelBtn").addEventListener("click", () => this._toggleHistorySelectMode());
$("#batchAllBtn").addEventListener("click", () => this._historyBatchAll());
$("#batchDlBtn").addEventListener("click", () => this._downloadMany());
$("#batchFavBtn").addEventListener("click", () => this._historyBatchFav());
$("#batchDelBtn").addEventListener("click", () => this._historyBatchDelete());
$("#batchCancelBtn").addEventListener("click", () => this._toggleHistorySelectMode(false));
$("#exportHistoryBtn").addEventListener("click", () => this._exportHistory());
$("#importHistoryBtn").addEventListener("click", () => $("#importHistoryInput").click());
$("#importHistoryInput").addEventListener("change", e => this._importHistory(e.target.files[0]));
$("#clearHistoryBtn").addEventListener("click", () => this._showClearHistoryOptions());
$("#statsBtn").addEventListener("click", () => this._showStats());
$("#modalClose").addEventListener("click", () => this._closeModal());
$("#modalOverlay").addEventListener("click", e => {
if (e.target === $("#modalOverlay")) this._closeModal();
});
$("#presetClose").addEventListener("click", () => $("#presetOverlay").classList.remove("show"));
$("#presetCancel").addEventListener("click", () => $("#presetOverlay").classList.remove("show"));
$("#presetConfirm").addEventListener("click", () => this._confirmSavePreset());
$("#presetOverlay").addEventListener("click", e => {
if (e.target === $("#presetOverlay")) $("#presetOverlay").classList.remove("show");
});
$("#lbClose").addEventListener("click", () => this._closeLightbox());
$("#lbPrev").addEventListener("click", () => this._lbNav(-1));
$("#lbNext").addEventListener("click", () => this._lbNav(1));
$("#lightbox").addEventListener("click", e => {
if (e.target === $("#lightbox")) this._closeLightbox();
});
$("#clearScreenBtn").addEventListener("click", () => this._clearScreen());
/* ── IMPL-142：结果条统一委托——文件夹展开（反馈4）/右键菜单（反馈5）/拖拽入夹+幽灵新建（反馈3）；sel-bar 与 foldersRow 独立容器已移除 ── */
const _strip = $("#resultStrip");
_strip.addEventListener("click", e => {
const f = e.target.closest(".rf-folder");
if (f) this._toggleFolder(f.dataset.fid);
});
_strip.addEventListener("contextmenu", e => {
const f = e.target.closest(".rf-folder");
if (!f) return;
e.preventDefault();
this._openFolderMenu(f.dataset.fid, f);
});
_strip.addEventListener("dragover", e => {
const t = e.target.closest(".rf-folder,.rf-ghost");
if (!t) return;
e.preventDefault();
t.classList.add("drag-over");
});
_strip.addEventListener("dragleave", e => {
const t = e.target.closest(".rf-folder,.rf-ghost");
if (t) t.classList.remove("drag-over");
});
_strip.addEventListener("drop", e => {
const t = e.target.closest(".rf-folder,.rf-ghost");
if (!t) return;
e.preventDefault();
t.classList.remove("drag-over");
const tid = e.dataTransfer.getData("application/x-wb-task") || e.dataTransfer.getData("text/plain");
if (!tid) return;
if (t.classList.contains("rf-ghost")) this._folderCreateWith(tid); else this._folderAdd(t.dataset.fid, tid);
});
/* IMPL-142：展开态 Esc 收敛——自挂独立 capture 监听（宿主 escHandler 一字不改）；
   IMPL-142c：宿主管理层（菜单/lightbox/modal/对比）开着时让宿主先处理，否则收敛展开态 */
document.addEventListener("keydown", e => {
if (e.key !== "Escape" || !this.state.openFolderId) return;
if (document.querySelector(".context-menu.show, .lightbox.show, .modal-overlay.show, .compare-grid.show")) return;
e.stopPropagation();
this.state.openFolderId = null;
this._renderResultStrip();
}, true);
$("#compareGridClose").addEventListener("click", () => $("#compareGrid").classList.remove("show"));
$("#compareGridInner").addEventListener("click", e => {
const b = e.target.closest("[data-cmpmode]");
if (b) {
this.state.compareMode = b.dataset.cmpmode;
this._cmpRender();
}
});
window.addEventListener("resize", () => {
if ($("#compareGrid").classList.contains("show") && this._cmpItems) this._cmpRender();
});
$("#undoBtn").addEventListener("click", () => this._undoFill());
$("#pastePickerCancel").addEventListener("click", () => this._hidePastePicker());
this.bindGlobalPaste();
this.bindGlobalDrop();
this.bindKeyboard();
document.addEventListener("click", e => {
const btn = e.target.closest(".generate-btn, .workflow-btn, .tab, .ref-mode-btn, .icon-btn, .filter-tab, .preset-trigger, .prompt-save-btn");
if (!btn) return;
const rect = btn.getBoundingClientRect();
const ripple = document.createElement("span");
ripple.className = "ripple";
const size = Math.min(rect.width, rect.height) * .6;
ripple.style.width = ripple.style.height = size + "px";
ripple.style.left = e.clientX - rect.left - size / 2 + "px";
ripple.style.top = e.clientY - rect.top - size / 2 + "px";
btn.appendChild(ripple);
setTimeout(() => ripple.remove(), 400);
}, true);
},
bindKeyboard() {
document.addEventListener("keydown", e => {
if (e.key !== "Tab") return;
const layer = $$(".modal-overlay.show, .settings-drawer.show, .history-sidebar.show, .lightbox.show, .compare-grid.show, .paste-picker.show, .context-menu.show, #workflowOverlay.show, #presetOverlay.show").sort((a, b) => (+getComputedStyle(b).zIndex || 0) - (+getComputedStyle(a).zIndex || 0))[0];
if (!layer) return;
const focusables = [ ...layer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ].filter(el => !el.disabled && el.getAttribute("aria-disabled") !== "true" && el.offsetParent !== null);
if (!focusables.length) return;
const first = focusables[0], last = focusables[focusables.length - 1];
const active = document.activeElement;
if (e.shiftKey && (active === first || !layer.contains(active))) {
e.preventDefault();
last.focus();
} else if (!e.shiftKey && (active === last || !layer.contains(active))) {
e.preventDefault();
first.focus();
}
});
document.addEventListener("keydown", e => {
if (e.key === "Escape") {
$$(".modal-overlay.show, .settings-drawer.show, .history-sidebar.show, .lightbox.show, .compare-grid.show, .paste-picker.show, .context-menu.show").forEach(el => el.classList.remove("show"));
return;
}
if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
e.preventDefault();
this.handleGenerate();
return;
}
if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
if ($("#lightbox").classList.contains("show")) {
e.preventDefault();
this._lbNav(e.key === "ArrowRight" ? 1 : -1);
return;
}
if (!$(".modal-overlay.show") && !$(".settings-drawer.show") && !$(".history-sidebar.show") && (this.state.singleList || []).length) {
e.preventDefault();
this._singleNav(e.key === "ArrowRight" ? 1 : -1);
return;
}
}
if ((e.ctrlKey || e.metaKey) && e.key === "k") {
e.preventDefault();
this._openHistory();
$("#historySearchInput").focus();
return;
}
if ((e.ctrlKey || e.metaKey) && e.key === "p") {
e.preventDefault();
this._openPresetPicker();
return;
}
if (e.key === "/") {
e.preventDefault();
const el = $('[data-key="prompt"], [data-key="text"]');
if (el) el.focus();
return;
}
if (e.key === "?") {
e.preventDefault();
this._showKeyboardHelp();
return;
}
});
},
_showKeyboardHelp() {
const rows = [ [ "Esc", "关闭弹窗 / 遮罩" ], [ "← / →", "切换结果（灯箱打开时切换灯箱图片）" ], [ "Ctrl/⌘ + K", "打开历史搜索" ], [ "Ctrl/⌘ + P", "打开提示词预设" ], [ "/", "聚焦提示词输入框" ], [ "Ctrl/⌘ + Enter", "触发生成" ], [ "?", "显示此快捷键帮助" ] ];
const html = `<div style="display:flex;flex-direction:column;gap:10px">${rows.map(([k, d]) => `<div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border-soft)"><kbd style="display:inline-block;padding:4px 10px;border-radius:6px;background:var(--surface-2);border:1px solid var(--border);font-family:var(--font-mono);font-size:12px;font-weight:600;min-width:110px;text-align:center">${esc(k)}</kbd><span style="font-size:13px;color:var(--text-muted)">${esc(d)}</span></div>`).join("")}</div>`;
this._showModal("键盘快捷键", html);
},
_bindStripWheel() {
const strip = $("#resultStrip");
if (!strip || strip.dataset.wheelBound) return;
strip.dataset.wheelBound = "1";
/* IMPL-89①：滚轮=目标位+lerp 逼近——离散滚轮 delta 连续化（逐格跳变→连贯滚动），
   且不重启 CSS smooth 动画；滚动期间挂 .is-scrolling 让悬停波纹让路（IMPL-89① CSS），
   停滚 180ms 后恢复。deltaX 主导（Shift+滚轮/触摸板横扫）仍走浏览器原生横向滚动 */
let wTarget = null, wCur = 0, wRaf = 0, wIdleT = 0, wLastT = 0;
const clampX = v => Math.max(0, Math.min(strip.scrollWidth - strip.clientWidth, v));
/* IMPL-90⓪：帧率无关 lerp——0.22 是 60Hz 手调系数，120Hz 屏同位移收敛更快=手感发飘；
   标准式 a=1−exp(−k·dt)（Lenis 同构），k=13.5 时 60Hz 等效 ≈0.201、手感延续且逐帧一致 */
const tick = tms => {
const dt = wLastT ? Math.min(48, tms - wLastT) : 16.7;
wLastT = tms;
const d = wTarget - wCur;
wCur = Math.abs(d) < .6 ? wTarget : wCur + d * (1 - Math.exp(-13.5 * dt / 1000));
strip.scrollLeft = wCur;
if (wCur !== wTarget) wRaf = requestAnimationFrame(tick); else { wRaf = 0; wLastT = 0; }
};
/* IMPL-90⓪：scrollend 收尾（Chrome114+/FF109+；旧 Safari 仍走 180ms 定时器兜底）——
   外部滚动（拖滚动条/触摸横扫）结束即时摘 .is-scrolling，波纹特效回位不再等满定时器 */
strip.addEventListener("scrollend", () => {
if (wIdleT) { clearTimeout(wIdleT); wIdleT = 0; }
strip.classList.remove("is-scrolling");
});
const busy = () => {
strip.classList.add("is-scrolling");
if (wIdleT) clearTimeout(wIdleT);
wIdleT = setTimeout(() => { wIdleT = 0; strip.classList.remove("is-scrolling"); }, 180);
};
strip.addEventListener("wheel", e => {
if (!e.deltaY || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
e.preventDefault();
const dm = e.deltaMode, k = dm === 1 ? 16 : dm === 2 ? Math.max(480, window.innerHeight || 800) : 1;
/* 用户拖拽滚动条/触摸横扫（scrollLeft 偏离 lerp 当前位）→ 重锚定，不打架 */
if (wTarget == null || Math.abs(strip.scrollLeft - wCur) > 2) wTarget = wCur = strip.scrollLeft;
wTarget = clampX(wTarget + e.deltaY * k * 3);
busy();
if (!wRaf) wRaf = requestAnimationFrame(tick);
}, {
passive: false
});
},
_mountQuickParams() {
  const body = $("#paramQuickBody");
  if (!body) return;
  const container = $("#paramForm");
  if (!container) return;
  body.innerHTML = "";
  /* ★ R23（修 2026-10-02「宿主左侧的面板改成四个按钮：比例 / 分辨率 / 质量 / 张数，视频同理但名称不同」）：
     旧版两桶（比例·分辨率 / 其他）；现按语义分三桶 + **其余留主面板**。
     · 桶1 比例（aspectRatio / ratio / 宽高）
     · 桶2 分辨率（resolution / size / image_size / 清晰度 / 尺寸）
     · 桶3 质量（quality）；**视频同一槽位只叫「时长」**（duration / seconds）
     · 其余（音频、背景、种子、步数）**不搬走** —— 四按钮里没有它们的家，搬走等于藏没（旧版全塞「参数」按钮）。
     · 张数 = 底部原生 countChipBtn（独立 countPop），不在此处处理。 */
  const buckets = { ratio: [], resolution: [], quality: [] };
  const rows = [];
  [ ...container.children ].forEach(el => {
    if (el.tagName !== "DIV") return;
    const st = el.getAttribute("style") || "";
    if (st.includes("1fr 1fr")) rows.push({ el, multi: true }); else if (el.classList.contains("param-group")) rows.push({ el, multi: false });
  });
  const keepForSeg = g => !!(this.state.model && this.state.model.seg && g.querySelector(".cap-grid"));
  rows.forEach(({ el }) => {
    [ ...el.children ].filter(g => g.classList && g.classList.contains("param-group")).forEach(g => {
      if (keepForSeg(g)) return;
      const cls = this._pqClassOf(g);
      if (cls === "other") return;
      buckets[cls].push(g);
    });
  });
  [ "ratio", "resolution", "quality" ].forEach(cls => {
    buckets[cls].forEach(g => {
      g.classList.remove("pq-grp-ratio", "pq-grp-resolution", "pq-grp-quality");
      g.classList.add("pq-grp-" + cls);
      body.appendChild(g);
    });
  });
  rows.forEach(({ el, multi }) => {
    if (!multi) return;
    const left = [ ...el.children ].filter(g => g.classList && g.classList.contains("param-group"));
    if (!left.length) { el.remove(); return; }
    if (left.length === 1) el.setAttribute("style", "display:grid;grid-template-columns:1fr;gap:10px;");
  });
  const isVideo = this.state.tab === "video";
  const LABELS = { ratio: "比例", resolution: "分辨率", quality: isVideo ? "时长" : "质量" };
  [ "ratio", "resolution", "quality" ].forEach(cls => {
    if (!buckets[cls].length) body.insertAdjacentHTML("beforeend", '<div class="pq-empty pq-empty-' + cls + '">当前模型暂无' + LABELS[cls] + '参数</div>');
  });
  const qLabel = $("#pqLabelQuality");
  if (qLabel) qLabel.textContent = isVideo ? "时长" : "质量";
  const icoQ = $("#paramQuickBtnQuality [data-ico-quality]"), icoD = $("#paramQuickBtnQuality [data-ico-duration]");
  if (icoQ && icoD) { icoQ.hidden = isVideo; icoD.hidden = !isVideo; }
  /* ★ R24-E/F/H：按钮**按该模型实际参数**显隐，不再永远四个 ——
     · 三桶为空 ⇒ 对应按钮隐藏；全空（音频模型）⇒ 整行收起（修原话「音频生成下面四个按钮有点多余」）
     · 张数只给图片 tab；视频第 4 槽位换成音频/水印**双向开关**
     · 其余参数（音频/背景/种子）**挪到参考区之后**（修原话「除了参考 参数尽量放在下面」） */
  const swP = this._pqSwitchParam();
  const showBtn = (id, on) => { const b = $(id); if (b) { b.style.display = on ? "" : "none"; if (!on) b.setAttribute("aria-expanded", "false"); } };
  showBtn("#paramQuickBtnRatio", buckets.ratio.length > 0);
  showBtn("#paramQuickBtnResolution", buckets.resolution.length > 0);
  showBtn("#paramQuickBtnQuality", buckets.quality.length > 0);
  showBtn("#countChipBtn", this.state.tab === "image");
  const swBtn = $("#paramQuickBtnSwitch");
  /* ⚠ hidden 属性必须同步：UA 的 [hidden]{display:none} 会压住 style.display=""（踩过） */
  if (swBtn) { const swOn = isVideo && !!swP; swBtn.hidden = !swOn; swBtn.style.display = swOn ? "" : "none"; }
  const swLab = $("#pqLabelSwitch");
  if (swLab) swLab.textContent = swP ? String(swP.label || "开关") : "开关";
  const qBtn = $("#paramQuickBtnQuality");
  if (qBtn) qBtn.classList.toggle("is-video", isVideo);
  if (!isVideo) this._closeCountPop();
  const others = [ ...container.children ].filter(el => el.classList && el.classList.contains("param-group") && this._pqClassOf(el) === "other");
  if (others.length) {
    others.forEach(g => {
      const row = g.parentElement;
      g.remove();
      if (row && row !== container && row.classList && !row.classList.contains("param-group") && !row.querySelector(".param-group")) row.remove();
    });
    for (let i = 0; i < others.length; i += 2) {
      const row = document.createElement("div");
      row.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:10px;";
      row.appendChild(others[i]);
      if (others[i + 1]) row.appendChild(others[i + 1]);
      container.appendChild(row);
    }
  }
  const rowEl = $("#formActionsRow");
  if (rowEl) {
    const anyOn = [ "#paramQuickBtnRatio", "#paramQuickBtnResolution", "#paramQuickBtnQuality", "#paramQuickBtnSwitch", "#countChipBtn" ].some(id => { const b = $(id); return b && b.style.display !== "none"; });
    rowEl.style.display = anyOn ? "" : "none";
  }
  this._pqGroups = buckets;
  this._pqMode = null;
  this._enhanceQuickParams(body);
  const modelEl = $("#paramQuickModel");
  if (modelEl) modelEl.textContent = this.state.model?.name || "";
  this._updateQuickSummary();
  /* R55：参数卡可见性同步 —— 参数可能全部搬进快捷面板 ⇒ #paramForm 空卡收起 */
  const _visLeft = [ ...container.children ].some(el => !el.hidden && el.style.display !== "none");
  container.style.display = _visLeft ? "flex" : "none";
},
_pqClassOf(g) {
  /* R23：参数组 → 三桶之一（other ⇒ 留主面板）。顺序：比例 → 分辨率 → 时长 → 质量。
     veo3_fast 的 size 标签是「清晰度」⇒ 先按 key、再按标签兜底。 */
  const el = g.querySelector("[data-key]");
  const k = String(el && el.dataset.key || "").toLowerCase();
  const fl = g.querySelector(".field-label");
  const l = String(fl && fl.childNodes[0] && fl.childNodes[0].textContent || "").trim();
  if ([ "aspectratio", "aspect_ratio", "ratio" ].includes(k) || l.indexOf("比例") >= 0 || l.indexOf("宽高") >= 0) return "ratio";
  if ([ "resolution", "image_size", "size" ].includes(k) || l.indexOf("分辨率") >= 0 || l.indexOf("清晰度") >= 0 || l.indexOf("尺寸") >= 0) return "resolution";
  if (k === "background" || l.indexOf("背景") >= 0) return "resolution"; /* R58-6：透明背景等多余选项并入分辨率弹窗 */
  if ([ "duration", "seconds" ].includes(k) || l.indexOf("时长") >= 0) return "quality";
  if (k === "quality" || l.indexOf("质量") >= 0 || l.indexOf("画质") >= 0) return "quality";
  return "other";
},
_pqSwitchParam() {
    /* R24-F：双向开关参数 —— 优先音频（generate_audio），其次水印（watermark）。
       options 兼容 true/false 与 1/0 两种枚举（宿主各模型两种都有）。 */
    const ps = (this.state.model && this.state.model.params) || [];
    const pairOk = p => {
      const o = (p.options || []).map(String);
      return o.length === 2 && o.every(x => x === "true" || x === "false" || x === "0" || x === "1");
    };
    return ps.find(p => p.key === "generate_audio" && pairOk(p)) || ps.find(p => p.key === "watermark" && pairOk(p)) || null;
  },
  _pqToggleSwitch() {
    const p = this._pqSwitchParam();
    if (!p) return;
    const el = document.querySelector('[data-key="' + p.key + '"]');
    if (!el) return;
    const o = (p.options || []).map(String);
    const cur = String(el.value);
    const next = o.find(x => x.toLowerCase() !== cur.toLowerCase()) || o[0];
    el.value = next;
    el.dispatchEvent(new Event("change", {
      bubbles: true
    }));
    this._updateQuickSummary();
  },
_enhanceQuickParams(body) {
body.querySelectorAll(".param-group").forEach(g => {
if (g.dataset.pqDone) return;
g.dataset.pqDone = "1";
const sel = g.querySelector("select[data-key]");
const anyInput = g.querySelector("[data-key]");
const label = (g.querySelector(".field-label")?.childNodes[0]?.textContent || "").trim();
const key = anyInput?.dataset.key || "";
const icon = this._pqIconFor(key, label, sel);
if (icon) {
g.classList.add("pq-param");
const fl = g.querySelector(".field-label");
if (fl && !fl.querySelector(".pq-ico")) fl.insertAdjacentHTML("afterbegin", `<span class="pq-ico" aria-hidden="true">${icon}</span>`);
}
if (sel) this._pqReplaceSelect(g, sel);
});
},
_pqIconFor(key, label, sel) {
const l = `${key} ${label}`.toLowerCase();
const I = {
ratio: '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M7 6v12M17 6v12" opacity=".45"/>',
hd: '<rect x="2.5" y="5" width="19" height="13" rx="2.5"/><path d="M8 21h8M12 18v3"/><path d="M14.5 9v4.5M12 9h2.5a2.25 2.25 0 0 1 0 4.5H12" opacity=".9"/>',
count: '<rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M4 15.5V6a2 2 0 0 1 2-2h9.5"/>',
clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
gauge: '<path d="M5 19a9 9 0 1 1 14 0"/><path d="M12 13l3.5-3.5"/><circle cx="12" cy="13" r="1.6"/>',
volume: '<path d="M11 5.5 6.5 9H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2.5L11 18.5z"/><path d="M15 9a4.2 4.2 0 0 1 0 6M17.5 6.8a7.6 7.6 0 0 1 0 10.4"/>',
mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
link: '<path d="M10 14a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1 1"/><path d="M14 10a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1-1"/>',
sliders: '<path d="M4 8h10M18 8h2M4 16h4M12 16h8M14 5.5v5M8 13.5v5"/>'
};
let shape;
if (/aspectratio|ratio|比例|尺寸|画幅/.test(l)) shape = I.ratio; else if (/分辨率|清晰度|resolution|quality|质量|size/.test(l)) shape = I.hd; else if (/张数|count|__count|连发/.test(l)) shape = I.count; else if (/时长|duration/.test(l)) shape = I.clock; else if (/语速|speed|语调|pitch/.test(l)) shape = I.gauge; else if (/音量|vol/.test(l)) shape = I.volume; else if (/音色|voice|emoti/.test(l)) shape = I.mic; else if (/url|链接|地址/.test(l)) shape = I.link; else shape = I.sliders;
return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shape}</svg>`;
},
_pqReplaceSelect(g, sel) {
if (sel.dataset.pqReplaced) return;
const opts = [ ...sel.options ].map(o => ({
v: o.value,
t: o.textContent
}));
if (!opts.length) return;
const isRatio = v => /^\d+:\d+$/.test(v) || /^(auto|adaptive)$/i.test(v) || /^\d+\s*[x×]\s*\d+$/i.test(v); /* IMPL-88：adaptive（MiniMax）同按比例渲染 chip */
const kind = opts.every(o => isRatio(o.v)) ? "ratio" : opts.length <= 5 && opts.every(o => o.t.length <= 8) ? "seg" : null;
if (!kind) return;
sel.dataset.pqReplaced = kind;
sel.classList.add("pq-hidden-select");
const ctrl = document.createElement("div");
ctrl.className = kind === "ratio" ? "ratio-grid" : "pq-seg";
ctrl.dataset.pqfor = sel.dataset.key;
if (kind === "seg") {
ctrl.style.gridTemplateColumns = `repeat(${opts.length}, 1fr)`;
ctrl.innerHTML = opts.map(o => `<button type="button" class="pq-seg-btn${o.v === sel.value ? " active" : ""}" data-v="${esc(o.v)}" aria-pressed="${o.v === sel.value}">${esc(o.t)}</button>`).join("");
} else {
ctrl.innerHTML = opts.map(o => {
const m = o.v.match(/^(\d+)\s*:\s*(\d+)$/);
const mx = o.v.match(/^(\d+)\s*[x×]\s*(\d+)$/i);
let box = "";
if (/^(auto|adaptive)$/i.test(o.v)) { /* IMPL-88：adaptive 也吃 AUTO 星形图标 */
box = `<span class="ratio-box auto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/></svg></span>`;
} else {
const w = mx ? +mx[1] : +m[1], h = mx ? +mx[2] : +m[2];
const r = w / h;
/* IMPL-94⑦：包络阈值 30/22≈1.3636——旧阈值 r>=1 使 1:1/5:4/4:3 的 bh>22 被 max-height 钳平（方形变长方形） */
const K = 30 / 22;
const bw = r >= K ? 30 : Math.round(22 * r);
const bh = r >= K ? Math.round(30 / r) : 22;
box = `<span class="ratio-box"><i style="width:${bw}px;height:${bh}px"></i></span>`;
}
return `<button type="button" class="ratio-cell${o.v === sel.value ? " active" : ""}" data-v="${esc(o.v)}" aria-pressed="${o.v === sel.value}">${box}<span class="ratio-name">${esc(o.t)}</span></button>`;
}).join("");
}
ctrl.addEventListener("click", e => {
const btn = e.target.closest("[data-v]");
if (!btn) return;
sel.value = btn.dataset.v;
sel.dispatchEvent(new Event("change", {
bubbles: true
}));
this._syncPqControl(sel);
this._updateQuickSummary();
});
g.appendChild(ctrl);
},
_syncPqControl(sel) {
const ctrl = document.querySelector(`[data-pqfor="${sel.dataset.key}"]`);
if (!ctrl) return;
ctrl.querySelectorAll("[data-v]").forEach(b => {
const on = b.dataset.v === sel.value;
b.classList.toggle("active", on);
b.setAttribute("aria-pressed", String(on));
});
},
_syncAllPqControls() {
$("#paramQuickBody")?.querySelectorAll("select[data-key]").forEach(s => {
if (s.dataset.pqReplaced) this._syncPqControl(s);
});
},
_updateQuickSummary() {
  /* R23：三个按钮各取摘要（比例 / 分辨率 / 质量·时长）。select 取枚举 label；range 取「值 + 单位」。 */
  const sums = this._pqGroups || { ratio: [], resolution: [], quality: [] };
  const labelOf = (p, v) => {
    if (p && Array.isArray(p.options) && p.options.length && typeof p.options[0] === "object") {
      const hit = p.options.find(o => String(o.value) === String(v));
      if (hit) return hit.label;
    }
    return this._enumLabel(p && p.key, v);
  };
  const valOf = g => {
    const el = g.querySelector("select[data-key], input[data-key]");
    if (!el) return "";
    const p = (this.state.model && this.state.model.params || []).find(pp => pp.key === el.dataset.key);
    /* ★ R25：等于默认值 ⇒ 算「没选」⇒ 返回空（按钮显示名称而不是值） */
    if (p && p.default != null && String(el.value) === String(p.default)) return "";
    if (el.type === "range") return String(el.value) + String(p && p.unit || "");
    return labelOf(p, el.value);
  };
  const pick = groups => groups.map(valOf).filter(Boolean).slice(0, 2).join(" · ");
  const set = (id, txt) => {
    const e = $(id);
    if (!e) return;
    e.textContent = txt;
    const btn = e.closest(".param-quick-btn") || e.closest(".count-chip");
    if (btn) btn.classList.toggle("has-val", !!txt);
  };
    /* ★ R25：比例按钮的方框字形（编辑器 RatioGlyph 同款）—— 按当前比例画；auto/adaptive 画虚线 */
    const glyph = document.querySelector('[data-pq-glyph="ratio"]');
    if (glyph) {
      const gal = sums.ratio[0] ? sums.ratio[0].querySelector("select[data-key]") : null;
      const rv = gal ? String(gal.value) : "";
      const gp = rv.split(":");
      const okG = gp.length === 2 && Number(gp[0]) > 0 && Number(gp[1]) > 0;
      const LONG = 15;
      if (okG) {
        const a = Number(gp[0]), b = Number(gp[1]);
        glyph.style.width = (a >= b ? LONG : (a / b) * LONG) + "px";
        glyph.style.height = (b >= a ? LONG : (b / a) * LONG) + "px";
        glyph.style.borderStyle = "solid";
      } else {
        glyph.style.width = glyph.style.height = LONG + "px";
        glyph.style.borderStyle = "dashed";
      }
    }
  set("#pqSummaryRatio", pick(sums.ratio));
  set("#pqSummaryResolution", pick(sums.resolution));
  set("#pqSummaryQuality", pick(sums.quality));
  /* ★ R24-F：开关按钮摘要（开/关） */
  const swP = this._pqSwitchParam();
  const swEl = $("#pqSummarySwitch");
  if (swEl) {
    if (swP) {
      const el = document.querySelector('[data-key="' + swP.key + '"]');
        const v = el ? String(el.value) : String(swP.default || "");
        const on = v === "true" || v === "1";
        swEl.textContent = on ? "开" : "关";
        swEl.classList.toggle("on", on);
      } else swEl.textContent = "";
  }
},
_positionQuickPanel() {
const panel = $("#paramQuickPanel");
const anchor = $("#formActionsRow") || $(".generate-section");
if (!panel || !anchor) return;
const gen = anchor.getBoundingClientRect();
const cs = getComputedStyle(anchor);
const pl = parseFloat(cs.paddingLeft) || 0, pr = parseFloat(cs.paddingRight) || 0;
panel.style.left = Math.round(gen.left + pl) + "px";
panel.style.width = Math.round(gen.width - pl - pr) + "px";
panel.style.bottom = Math.round(window.innerHeight - gen.top + 8) + "px";
const safeTop = parseFloat(getComputedStyle($(".app-body") || document.body).paddingTop) || 0;
panel.style.maxHeight = Math.max(220, Math.round(gen.top - safeTop - 14)) + "px";
},
_openQuickPanel(mode) {
const panel = $("#paramQuickPanel");
if (!panel) return;
const body = $("#paramQuickBody");
if (body && !body.children.length) this._mountQuickParams();
const m = mode === "resolution" || mode === "quality" ? mode : "ratio";
this._pqMode = m;
if (body) body.dataset.mode = m;
const isV = this.state.tab === "video";
const title = panel.querySelector(".pq-title");
if (title) title.textContent = m === "ratio" ? "比例" : m === "resolution" ? "分辨率" : isV ? "时长" : "质量";
$("#paramQuickBtnRatio")?.setAttribute("aria-expanded", String(m === "ratio"));
$("#paramQuickBtnResolution")?.setAttribute("aria-expanded", String(m === "resolution"));
$("#paramQuickBtnQuality")?.setAttribute("aria-expanded", String(m === "quality"));
this._closeCountPop();
clearTimeout(this._pqCloseT);
const anchor = $("#formActionsRow") || $(".generate-section");
const aside = anchor?.closest(".col-params");
if (aside) {
const g0 = anchor.getBoundingClientRect(), a0 = aside.getBoundingClientRect();
if (g0.bottom > a0.bottom + 2) aside.scrollTop += g0.bottom - a0.bottom + 12; else if (g0.top < a0.top - 2) aside.scrollTop -= a0.top - g0.top + 12;
}
panel.classList.add("displayed");
this._positionQuickPanel();
void panel.offsetWidth;
panel.classList.add("show");
this._syncAllPqControls();
requestAnimationFrame(() => this._positionQuickPanel());
},
_closeQuickPanel() {
const panel = $("#paramQuickPanel");
if (!panel || !panel.classList.contains("show")) return;
panel.classList.remove("show");
clearTimeout(this._pqCloseT);
this._pqCloseT = setTimeout(() => panel.classList.remove("displayed"), 280);
$("#paramQuickBtnRatio")?.setAttribute("aria-expanded", "false");
$("#paramQuickBtnResolution")?.setAttribute("aria-expanded", "false");
$("#paramQuickBtnQuality")?.setAttribute("aria-expanded", "false");
},
_bindQuickParams() {
document.addEventListener("click", e => {
const ratioHit = e.target.closest?.("#paramQuickBtnRatio");
const resHit = e.target.closest?.("#paramQuickBtnResolution");
const qHit = e.target.closest?.("#paramQuickBtnQuality");
if (ratioHit || resHit || qHit) {
const mode = ratioHit ? "ratio" : resHit ? "resolution" : "quality";
const panel = $("#paramQuickPanel");
if (panel?.classList.contains("show")) {
if (this._pqMode === mode) this._closeQuickPanel(); else this._openQuickPanel(mode);
} else this._openQuickPanel(mode);
return;
}
if (e.target.closest?.("#paramQuickBtnSwitch")) { this._pqToggleSwitch(); return; }
if (!e.target.closest?.("#countChipBtn") && !e.target.closest?.("#countPop")) this._closeCountPop();
const panel = $("#paramQuickPanel");
if (panel?.classList.contains("show") && !e.target.closest?.("#paramQuickPanel") && !e.target.closest?.(".generate-section")) this._closeQuickPanel();
});
$("#paramQuickClose")?.addEventListener("click", () => this._closeQuickPanel());
document.addEventListener("keydown", e => {
if (e.key === "Escape") {
this._closeQuickPanel();
this._closeCountPop();
}
});
$("#generateBtn")?.addEventListener("click", () => {
this._closeQuickPanel();
this._closeCountPop();
});
window.addEventListener("resize", () => {
if ($("#paramQuickPanel")?.classList.contains("show")) this._positionQuickPanel();
if ($("#countPop")?.classList.contains("show")) this._positionCountPop();
});
$("#countChipBtn")?.addEventListener("click", () => this._toggleCountPop());
$("#countPop")?.addEventListener("click", e => {
const opt = e.target.closest?.(".cp-opt");
if (!opt) return;
const sel = document.querySelector('[data-key="__count"]');
if (sel) {
sel.value = opt.dataset.v;
sel.dispatchEvent(new Event("change", {
bubbles: true
}));
}
this._closeCountPop();
});
let pqTick = false;
document.addEventListener("scroll", () => {
if (pqTick) return;
const pqOpen = $("#paramQuickPanel")?.classList.contains("show");
const cpOpen = $("#countPop")?.classList.contains("show");
if (!pqOpen && !cpOpen) return;
pqTick = true;
requestAnimationFrame(() => {
pqTick = false;
if (pqOpen) this._positionQuickPanel();
if (cpOpen) this._positionCountPop();
});
}, { capture:true, passive:true });
$("#paramQuickBody")?.addEventListener("change", () => {
this._updateQuickSummary();
});
},
_toggleCountPop() {
const pop = $("#countPop");
if (!pop) return;
if (pop.classList.contains("show")) {
this._closeCountPop();
return;
}
this._closeQuickPanel();
pop.classList.add("displayed");
this._renderCountPopActive();
this._positionCountPop();
void pop.offsetWidth;
pop.classList.add("show");
$("#countChipBtn")?.setAttribute("aria-expanded", "true");
requestAnimationFrame(() => this._positionCountPop());
},
_closeCountPop() {
const pop = $("#countPop");
if (!pop || !pop.classList.contains("show")) return;
pop.classList.remove("show");
clearTimeout(this._cpCloseT);
this._cpCloseT = setTimeout(() => pop.classList.remove("displayed"), 240);
$("#countChipBtn")?.setAttribute("aria-expanded", "false");
},
_positionCountPop() {
const pop = $("#countPop"), chip = $("#countChipBtn");
if (!pop || !chip) return;
const r = chip.getBoundingClientRect();
const pw = pop.offsetWidth || 240;
let left = Math.round(r.left + r.width / 2 - pw / 2);
left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
pop.style.left = left + "px";
pop.style.bottom = Math.round(window.innerHeight - r.top + 8) + "px";
},
_renderCountPopActive() {
const cur = String(this._getBatchCount());
$("#countPop")?.querySelectorAll(".cp-opt").forEach(b => {
const on = b.dataset.v === cur;
b.classList.toggle("active", on);
b.setAttribute("aria-pressed", String(on));
});
},
_syncCountChip() {
const el = $("#countChipVal");
const btn = $("#countChipBtn");
const n = this._getBatchCount();
if (el) el.textContent = "×" + n;
/* ★ R25：1（默认）⇒ 显示名称「张数」；>1 ⇒ 显示「×N」 */
if (btn) btn.classList.toggle("has-val", Number(n) > 1);
},
_mountWorkflowBtns(scope) {
const slot = scope?.querySelector ? scope.querySelector("#wfActionsSlot") : document.getElementById("wfActionsSlot");
if (!slot) return;
[ "copyWorkflowBtn", "importWorkflowBtn" ].forEach(id => {
const btn = document.getElementById(id);
if (btn && btn.parentElement !== slot) slot.appendChild(btn);
});
},
/* IMPL-78 R2：引用弹层方法（_toggleAtRefPop/_closeAtRefPop/_insertRefCite）已整体移除 */
_autoGrowPrompt(ta) {
ta.style.height = "auto";
ta.style.height = Math.min(ta.scrollHeight, Math.round(window.innerHeight * .62)) + "px";
},
_bindPromptGrowOnResize() {
if (this._promptGrowBound) return;
this._promptGrowBound = true;
window.addEventListener("resize", () => {
const ta = document.querySelector("#preParamSlot textarea[data-key], #paramForm textarea[data-key]");
if (ta) this._autoGrowPrompt(ta);
}, {
passive: true
});
},
_initGlassSelects() {
if (this._gselBound) return;
this._gselBound = true;
const closePop = () => {
document.querySelectorAll(".glass-select-pop").forEach(p => p.remove());
};
const hasPop = () => !!document.querySelector(".glass-select-pop");
const buildPop = sel => {
closePop();
const r = sel.getBoundingClientRect();
if (!r.width && !r.height) return;
const el = document.createElement("div");
el.className = "glass-select-pop";
el._src = sel;
el.setAttribute("role", "listbox");
const items = [ ...sel.options ].map((o, i) => {
const isSel = i === sel.selectedIndex;
return `<div class="gsp-item${isSel ? " sel" : ""}${o.disabled ? " disabled" : ""}" data-i="${i}" role="option" aria-selected="${isSel}">${esc(o.textContent || o.value)}<svg class="gsp-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>`;
}).join("");
el.innerHTML = items || '<div class="gsp-empty">暂无选项</div>';
const vw = window.innerWidth, vh = window.innerHeight;
const w = Math.max(Math.ceil(r.width), 148);
const maxH = 264;
const below = vh - r.bottom;
const up = below < Math.min(maxH + 18, 190) && r.top > below;
if (up) el.classList.add("up");
el.style.minWidth = w + "px";
el.style.left = Math.max(8, Math.min(Math.round(r.left), vw - w - 8)) + "px";
document.body.appendChild(el);
if (el.scrollHeight > maxH) el.style.height = maxH + "px";
const ph = Math.min(el.scrollHeight + 10, maxH);
el.style.top = up ? Math.max(8, Math.round(r.top - ph - 6)) + "px" : Math.min(vh - 8, Math.round(r.bottom + 6)) + "px";
const selItem = el.querySelector(".gsp-item.sel");
if (selItem) selItem.scrollIntoView({
block: "nearest"
});
el.addEventListener("click", e => {
const item = e.target.closest(".gsp-item");
if (!item || item.classList.contains("disabled")) return;
const i = +item.dataset.i;
if (i !== sel.selectedIndex) {
sel.selectedIndex = i;
sel.dispatchEvent(new Event("change", {
bubbles: true
}));
}
closePop();
});
return el;
};
document.addEventListener("pointerdown", e => {
const sel = e.target.closest("select");
const pop = document.querySelector(".glass-select-pop");
if (sel && !sel.disabled && !sel.multiple && sel.options.length > 0) {
e.preventDefault();
if (pop && pop._src === sel) {
closePop();
return;
}
buildPop(sel);
} else if (pop && !e.target.closest(".glass-select-pop")) {
closePop();
}
}, true);
document.addEventListener("touchend", e => {
if (e.target.closest && e.target.closest("select") && hasPop()) e.preventDefault();
}, {
passive: false
});
window.addEventListener("scroll", e => {
if (e.target && e.target.closest && e.target.closest(".glass-select-pop")) return;
closePop();
}, { capture:true, passive:true });
window.addEventListener("resize", closePop);
document.addEventListener("keydown", e => {
if (e.key === "Escape" && hasPop()) closePop();
});
},
applySoundIcon() {
const on = Store.getSound();
$("#soundToggle").classList.toggle("on", on);
$("#soundIcon").innerHTML = on ? '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>' : '<path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
},
toggleSound() {
Store.setSound(!Store.getSound());
this.applySoundIcon();
},
toggleCloudSync() {
const on = !Store.getSync();
Store.setSync(on);
const el = $("#cloudSyncToggle");
if (el) el.classList.toggle("on", on);
Toast.info(on ? "云同步已开启" : "云同步已关闭，数据仅存本机");
},
playSuccessSound() {
if (!Store.getSound()) return;
try {
const ctx = new (window.AudioContext || window.webkitAudioContext);
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.connect(gain);
gain.connect(ctx.destination);
osc.type = "sine";
osc.frequency.setValueAtTime(880, ctx.currentTime);
osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + .15);
gain.gain.setValueAtTime(.3, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(.01, ctx.currentTime + .3);
osc.start();
osc.stop(ctx.currentTime + .3);
} catch {}
},
notifyTaskComplete(task) {
if (document.visibilityState === "visible") return;
try {
new Notification("生成完成", {
body: `${task.model.name} · ${task.status === "succeeded" ? "成功" : "失败"}`
});
} catch {}
},
switchTab(tab) {
if (!MODELS[tab]) return;
this._saveFormToCache();
this.state.tab = tab;
$$("#tabs .tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
$("#paramForm").style.display = "flex";
$("#paramForm").style.flexDirection = "column";
$("#paramForm").style.gap = "14px";
$(".model-select-wrap").style.display = "";
const model = MODELS[tab][0];
this.state.model = model;
this.state.modelKey = `${tab}/${model.id}`;
this._updateModelBar();
this.renderParamForm(model.id);
this._restoreFormFromCache();
if (typeof SkillSession !== "undefined") SkillSession.onTabSwitch();
},
_updateModelBar() {
const m = this.state.model;
/* ★ R24-B：列表排序 —— GPT 系置顶 → 名称（去通道后缀，中文/数字友好）→ 同名按性价比（便宜在前）。
   ★ R24-C：通道徽标统一在这里拼（非 apiyi ⇒ （创），apiyi ⇒ （易）），name 里不再手写后缀。
   ⚠ select 与 pickList 必须走同一份序，否则两处顺序不一致。 */
const _mpChan = mm => mm.channel === "apiyi" ? "apiyi" : (mm.direct ? "direct" : "speed");
const _mpChanLabel = mm => _mpChan(mm) === "apiyi" ? "易" : _mpChan(mm) === "direct" ? "连" : "创";
const _mpBase = mm => String(mm.name || "").replace(/（[易创连]）[ 　]*$/, "").trim();
const _mpDisp = mm => _mpBase(mm) + "（" + _mpChanLabel(mm) + "）";
const _mpCost = mm => { try { const c = estCostCny(mm, billParamsOf()); return c && isFinite(c.cny) ? c.cny : Infinity; } catch (e) { return Infinity; } };
const _mpSorted = arr => arr.slice().sort((a, b) => {
  const ga = /gpt/i.test(String(a.id) + " " + _mpBase(a)) ? 0 : 1;
  const gb = /gpt/i.test(String(b.id) + " " + _mpBase(b)) ? 0 : 1;
  if (ga !== gb) return ga - gb;
  const na = _mpBase(a), nb = _mpBase(b);
  if (na !== nb) return na.localeCompare(nb, "zh-Hans-CN", { numeric: true, sensitivity: "base" });
  const ca = _mpCost(a), cb = _mpCost(b);
  if (ca !== cb) return ca - cb;
  return String(a.id).localeCompare(String(b.id));
});
const sel = $("#modelSelect");
if (sel) {
sel.innerHTML = _mpSorted(MODELS[this.state.tab]).map(mm => '<option value="' + esc(mm.id) + '"' + (mm.id === m.id ? " selected" : "") + ">" + esc(_mpDisp(mm)) + "</option>").join("");
}
const pickLogo = $("#modelPickLogo"), pickName = $("#modelPickName"), pickList = $("#modelPickList");
if (pickLogo) pickLogo.innerHTML = modelLogoOf(m.id);
if (pickName) pickName.textContent = _mpBase(m);
let chanEl = $("#modelPickChan");
if (!chanEl && pickName && pickName.parentElement) { chanEl = document.createElement("span"); chanEl.id = "modelPickChan"; chanEl.className = "mp-chan"; pickName.parentElement.insertBefore(chanEl, pickName.nextSibling); }
if (chanEl) { chanEl.textContent = _mpChanLabel(m); chanEl.dataset.mpChan = _mpChan(m); }
if (pickList) {
pickList.innerHTML = _mpSorted(MODELS[this.state.tab]).map(mm => '<button type="button" role="option" aria-selected="' + (mm.id === m.id) + '" class="model-pick-opt' + (mm.id === m.id ? " active" : "") + '" data-mp-id="' + esc(mm.id) + '">'
  + '<span class="mp-logo" aria-hidden="true">' + modelLogoOf(mm.id) + '</span>'
  + '<span class="mp-opt-name">' + esc(_mpBase(mm)) + '</span>'
  + '<span class="mp-chan" data-mp-chan="' + _mpChan(mm) + '">' + _mpChanLabel(mm) + '</span>'
  + '<span class="mp-opt-price" title="' + esc(billKindOf(mm)) + esc((estCostCny(mm, billParamsOf()) || {}).detail ? " · " + (estCostCny(mm, billParamsOf()) || {}).detail : "") + '">' + esc(billTextOf(mm) || priceCnyOf(mm)) + '</span>'
  + '</button>').join("");
}
$("#modelMeta").innerHTML = m.desc ? `<span class="tag desc-tag">${esc(m.desc)}</span>` : ""; /* ★ R28-C（修 2026-10-02）：只留一行 ≤30 字使用介绍 —— 类型/价格/计费/详情全部撤掉 */
const descEl = $("#modelDesc");
if (descEl) descEl.textContent = "";
},
_positionModelPick() {
const btn = $("#modelPickBtn"), list = $("#modelPickList");
if (!btn || !list) return;
const r = btn.getBoundingClientRect();
list.style.left = Math.round(r.left) + "px";
list.style.width = Math.round(r.width) + "px";
const listH = Math.min(list.scrollHeight || 240, window.innerHeight * .46);
const below = window.innerHeight - r.bottom - 10;
if (below < Math.min(listH, 180) && r.top > listH + 10) {
list.style.bottom = Math.round(window.innerHeight - r.top + 6) + "px";
list.style.top = "auto";
} else {
list.style.top = Math.round(r.bottom + 6) + "px";
list.style.bottom = "auto";
}
},
_openModelPick() {
const list = $("#modelPickList");
if (!list) return;
/* ★ R63-③：价签与「同名比价」排序都按当前参数现算（含张数）⇒ 打开前重建一次 */
try { this._updateModelBar(); } catch (e) {}
list.classList.add("show");
$("#modelPickBtn")?.setAttribute("aria-expanded", "true");
this._positionModelPick();
},
_closeModelPick() {
const list = $("#modelPickList");
if (list && list.classList.contains("show")) {
list.classList.remove("show");
$("#modelPickBtn")?.setAttribute("aria-expanded", "false");
}
},
_toggleModelPick() {
const list = $("#modelPickList");
if (list?.classList.contains("show")) this._closeModelPick(); else this._openModelPick();
},
_pickModel(id) {
const sel = $("#modelSelect");
if (sel && sel.value !== id) {
sel.value = id;
sel.dispatchEvent(new Event("change", {
bubbles: true
}));
}
this._closeModelPick();
},
_bindModelPick() {
$("#modelPickBtn")?.addEventListener("click", e => {
e.stopPropagation();
this._toggleModelPick();
});
$("#modelPickList")?.addEventListener("click", e => {
const opt = e.target.closest("[data-mp-id]");
if (opt) this._pickModel(opt.dataset.mpId);
});
document.addEventListener("click", e => {
if (!e.target.closest(".model-select-wrap")) this._closeModelPick();
});
document.addEventListener("scroll", e => {
const t = e.target;
if (t && t.nodeType === 1 && t.closest && (t.closest("#modelPickList") || t.closest("#modelPickBtn"))) return;
this._closeModelPick();
}, {
capture: true,
passive: true
});
window.addEventListener("resize", () => {
if ($("#modelPickList")?.classList.contains("show")) this._positionModelPick();
});
document.addEventListener("keydown", e => {
if (e.key === "Escape") this._closeModelPick();
});
},
_parkWorkflowBtns() {
const park = document.getElementById("wfPark");
if (!park) return;
[ "copyWorkflowBtn", "importWorkflowBtn" ].forEach(id => {
const btn = document.getElementById(id);
if (btn && btn.parentElement !== park) park.appendChild(btn);
});
},
renderParamForm(modelId) {
const model = MODELS[this.state.tab].find(m => m.id === modelId) || this.state.model;
this.state.model = model;
this.state.modelKey = `${this.state.tab}/${model.id}`;
this._updateModelBar();
const container = $("#paramForm");
const preSlot = $("#preParamSlot");
this._parkWorkflowBtns();
container.innerHTML = "";
container.style.display = "flex";
if (preSlot) preSlot.innerHTML = "";
const hasPrompt = model.params.find(p => p.type === "textarea");
if (hasPrompt) (preSlot || container).appendChild(this._buildPromptModule(model));
const refGroupParamKeys = new Set;
if (model.refGroups) {
model.refGroups.modes.forEach(m => m.params.forEach(k => refGroupParamKeys.add(k)));
}
const simpleParams = [];
const complexParams = [];
for (const p of model.params) {
if (p.type === "textarea") continue;
if (refGroupParamKeys.has(p.key)) continue;
if (p.type === "ref-image" || p.type === "ref-video" || p.type === "ref-audio") {
complexParams.push({
type: "ref",
param: p
});
} else if (p.type === "select" || p.type === "range" || p.type === "datalist") {
simpleParams.push(p);
} else {
complexParams.push({
type: "field",
param: p
});
}
}
complexParams.sort((a, b) => (a.type === "ref" && a.param.key === "mask" ? 1 : 0) - (b.type === "ref" && b.param.key === "mask" ? 1 : 0));
const cntDef = (this.state.formCache[this.state.modelKey] || {})["__count"] ?? (this.state.formCache[this.state.tab + "_pool"] || {})["__count"] ?? "1";
const cntHolder = document.createElement("div");
cntHolder.style.cssText = "display:none";
cntHolder.innerHTML = `<select data-key="__count" aria-label="生成张数">${[ "1", "2", "3", "4" ].map(o => `<option value="${o}" ${String(o) === String(cntDef) ? "selected" : ""}>${o}</option>`).join("")}</select>`;
container.appendChild(cntHolder);
const cntSel = cntHolder.querySelector("select");
cntSel.addEventListener("change", () => this._onFieldChange("__count", cntSel));
if (model.refGroups) {
(preSlot || container).appendChild(this._buildRefModeSection(model));
}
for (const item of complexParams) {
if (item.type === "ref") {
(preSlot || container).appendChild(this._buildRefSection(item.param));
}
}
/* ★ R29-B：简单字段先拆 bool（开关）与其余；其余仍两两一行；开关统一收进一行（多个并列省空间） */
const _switches = simpleParams.filter(p => this._isBoolSel(p));
const _plain = simpleParams.filter(p => !this._isBoolSel(p));
for (let i = 0; i < _plain.length; i += 2) {
const pair = _plain.slice(i, i + 2);
const row = document.createElement("div");
row.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:10px;";
row.appendChild(this._buildFieldRow(pair[0]));
if (pair[1]) row.appendChild(this._buildFieldRow(pair[1]));
container.appendChild(row);
}
if (_switches.length) {
const swRow = document.createElement("div");
swRow.className = "param-group switch-row";
for (const sp of _switches) swRow.appendChild(this._buildFieldRow(sp));
container.appendChild(swRow);
}
for (const item of complexParams) {
if (item.type !== "ref") {
container.appendChild(this._buildFieldRow(item.param));
}
}
this._renderAllRefGrids();
this._mountQuickParams();
this._applyVisibleIf();
},
_visibleIfMet(p) {
if (!p?.visibleIf) return true;
const ctrl = $(`[data-key="${p.visibleIf.key}"]`);
const cur = ctrl ? ctrl.value : this.state.model?.params?.find(x => x.key === p.visibleIf.key)?.default ?? "";
return p.visibleIf.values.includes(String(cur));
},
_applyVisibleIf() {
const model = this.state.model;
if (!model?.params?.some(p => p.visibleIf)) return;
for (const p of model.params) {
if (!p.visibleIf) continue;
const sec = $(`[data-ref-key="${p.key}"]`);
if (sec) sec.style.display = this._visibleIfMet(p) ? "" : "none";
}
},
_REF_ICONS: {
group: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M17.5 14v7M14 17.5h7"/></svg>',
"ref-image": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
"ref-video": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>',
"ref-audio": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect class="eqb e1" x="2.2" y="8.6" width="2.5" height="6.8" rx="1.25"/><rect class="eqb e2" x="6.5" y="5.2" width="2.5" height="13.6" rx="1.25"/><rect class="eqb e3" x="10.8" y="3.4" width="2.5" height="17.2" rx="1.25"/><rect class="eqb e4" x="15.1" y="6.4" width="2.5" height="11.2" rx="1.25"/><rect class="eqb e5" x="19.4" y="9.4" width="2.5" height="5.2" rx="1.25"/></svg>',
text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>',
url: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/></svg>'
},
_buildRefModeSection(model) {
const wrap = document.createElement("div");
wrap.className = "ref-mode-section";
const rg = model.refGroups;
const modelKey = this.state.modelKey;
if (!this.state.refMode) this.state.refMode = {};
if (!this.state.refMode[modelKey]) this.state.refMode[modelKey] = rg.modes[0].value;
const cols = `repeat(${Math.min(rg.modes.length, 5)}, 1fr)`;
let html = `<div class="ref-mode-header"><div class="ref-mode-head-l"><span class="ref-mode-title">${this._REF_ICONS.group}<span>${esc(rg.title)}</span></span></div>`;
html += `<div class="ref-mode-row" style="grid-template-columns:${cols}">`;
html += rg.modes.map(m => `<button class="ref-mode-btn ${m.value === this.state.refMode[modelKey] ? "active" : ""}" data-ref-mode="${esc(m.value)}">${esc(m.label)}<span class="ref-mode-badge" data-ref-badge="${esc(m.value)}"></span></button>`).join("");
html += `</div></div>`;
html += `<div class="ref-mode-panels">`;
rg.modes.forEach(m => {
const multiCls = m.params.length > 1 ? " ref-panel-cols" : "";
html += `<div class="ref-mode-panel ${m.value === this.state.refMode[modelKey] ? "active" : ""}${multiCls}" data-ref-panel="${esc(m.value)}">`;
m.params.forEach(key => {
const p = model.params.find(pp => pp.key === key);
if (!p) return;
if (p.type === "ref-image" || p.type === "ref-video" || p.type === "ref-audio") {
const gridClass = p.type === "ref-video" ? "ref-grid-video" : p.type === "ref-audio" ? "ref-grid-audio" : "";
const warnMsg = p.type === "ref-video" ? "本地视频需上传至 R2 后才能用于生成" : p.type === "ref-audio" ? "本地音频需上传至 R2 后才能用于生成" : "";
html += `<div class="ref-section" data-ref-key="${esc(p.key)}"><div class="ref-label">${this._REF_ICONS[p.type] || ""}<span>${esc(p.label)}${p.required ? '<i class="req-star" aria-label="必填">*</i>' : ""}</span>${this._refHint(p.hint) ? `<span class="ref-hint">${esc(this._refHint(p.hint))}</span>` : ""}</div><div class="ref-grid ${gridClass}" data-ref-grid="${esc(p.key)}"></div>${warnMsg ? `<div class="ref-video-warn" data-ref-warn="${esc(p.key)}">${warnMsg}</div>` : ""}</div>`;
} else {
const defVal = this.state.formCache[modelKey]?.[key] ?? p.default ?? "";
const ico = this._REF_ICONS[p.type === "url" ? "url" : "text"] || "";
html += `<div class="ref-field"><div class="ref-field-label">${ico}<span>${esc(p.label)}${p.required ? '<i class="req-star" aria-label="必填">*</i>' : ""}</span>${this._refHint(p.hint) ? `<span class="ref-field-hint">${esc(this._refHint(p.hint))}</span>` : ""}</div><input type="text" data-key="${esc(p.key)}" value="${esc(defVal)}" placeholder="${esc(p.placeholder || (p.type === "url" ? "https://..." : ""))}"></div>`;
}
});
if (m.params.length === 0) html += `<div class="ref-empty" style="text-align:center;padding:12px;color:var(--text-dim);font-size:12px">无参考素材，仅使用提示词生成</div>`;
html += `</div>`;
});
html += `</div>`;
wrap.innerHTML = html;
wrap.querySelectorAll("[data-ref-mode]").forEach(btn => {
btn.addEventListener("click", () => {
const mode = btn.dataset.refMode;
this.state.refMode[modelKey] = mode;
wrap.querySelectorAll("[data-ref-mode]").forEach(b => b.classList.toggle("active", b.dataset.refMode === mode));
wrap.querySelectorAll("[data-ref-panel]").forEach(p => p.classList.toggle("active", p.dataset.refPanel === mode));
});
});
wrap.querySelectorAll("[data-ref-key]").forEach(refSection => {
const key = refSection.dataset.refKey;
const param = model.params.find(p => p.key === key);
if (!param) return;
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = param.type === "ref-video" ? "video/*" : param.type === "ref-audio" ? "audio/*" : "image/*";
fileInput.multiple = param.output !== "single";
fileInput.style.display = "none";
fileInput.addEventListener("change", e => {
Promise.all(Array.from(e.target.files).map(f => {
if (param.type === "ref-video") return this._addLocalVideoRef(key, f); else if (param.type === "ref-audio") return this._addLocalAudioRef(key, f); else return this._addLocalRef(key, f);
}));
fileInput.value = "";
});
refSection.appendChild(fileInput);
const refGrid = refSection.querySelector(".ref-grid");
refGrid.addEventListener("keydown", e => {
if (e.key !== "Enter" && e.key !== " ") return;
const add = e.target.closest?.(".ref-add");
if (!add) return;
e.preventDefault();
add.click();
});
refGrid.addEventListener("click", e => {
if (e.target.closest(".ref-del") || e.target.closest(".ref-copy") || e.target.closest(".ref-edit") || e.target.closest(".ref-item")) return;
this.state.activeRefKey = key;
const acceptType = param.type === "ref-video" ? "video/*" : param.type === "ref-audio" ? "audio/*" : "image/*";
const title = param.type === "ref-video" ? "添加参考视频" : param.type === "ref-audio" ? "添加参考音频" : "添加参考图";
const handleFiles = files => Promise.all(files.map(f => {
if (param.type === "ref-video") return this._addLocalVideoRef(key, f); else if (param.type === "ref-audio") return this._addLocalAudioRef(key, f); else return this._addLocalRef(key, f);
}));
if (typeof FilePond !== "undefined" && this._openFilePondPicker({
accept: acceptType,
multiple: param.output !== "single",
title: title,
onSelect: handleFiles
})) {
return;
}
fileInput.click();
});
refGrid.addEventListener("pointerdown", () => {
this.state.activeRefKey = key;
}, true);
});
wrap.querySelectorAll("[data-key]").forEach(el => {
el.addEventListener("input", () => this._onFieldChange(el.dataset.key, el));
el.addEventListener("change", () => this._onFieldChange(el.dataset.key, el));
});
setTimeout(() => this._syncRefModeBadges(), 0);
return wrap;
},
_syncRefModeBadges() {
const model = this.state.model;
if (!model?.refGroups) return;
const mk = this.state.modelKey;
model.refGroups.modes.forEach(m => {
const badge = $(`.ref-mode-btn[data-ref-mode="${m.value}"] .ref-mode-badge`);
if (!badge) return;
const n = m.params.reduce((s, k) => s + (this.state.refState[mk]?.[k]?.length || 0), 0);
badge.textContent = n > 99 ? "99+" : n > 0 ? String(n) : "";
badge.classList.toggle("on", n > 0);
});
},
_buildPromptModule(model) {
const wrap = document.createElement("div");
wrap.className = "prompt-module";
wrap.style.position = "relative";
const promptParam = model.params.find(p => p.type === "textarea");
const key = promptParam.key;
const defVal = this.state.formCache[this.state.modelKey]?.[key] ?? promptParam.default ?? "";
wrap.innerHTML = `\n      <div class="prompt-head">\n        <span class="prompt-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v16"/><path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"/><path d="M9 20h6"/></svg>提示词</span>\n        <div class="prompt-actions">\n          <span id="wfActionsSlot" style="display:contents"></span>\n          <button class="preset-trigger" id="presetTrigger" title="技能 · 预设 · 模板">\n            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/></svg>\n            <span>技能</span>\n          </button>\n          <button class="prompt-save-btn" id="savePresetBtn" title="保存为预设" aria-label="保存为预设"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" width="14" height="14"><path d="M5 12h14"/><path d="M12 5v14"/></svg></button>\n        </div>\n      </div>\n      <div class="skill-bubbles" data-skill-bubbles hidden></div>\n      <textarea data-key="${esc(key)}" placeholder="${esc(promptParam.placeholder || "描述你想要生成的内容...")}" >${esc(defVal)}</textarea>\n      <div class="prompt-tools">\n        <button class="tool-btn icon-only" data-action="recent" title="最近使用的提示词" aria-label="最近使用的提示词"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6v6h4"/><circle cx="12" cy="12" r="10"/></svg></button>\n        <button class="tool-btn icon-only" data-action="clear" title="清空提示词" aria-label="清空提示词"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>\n                <span class="tools-divider" role="separator" aria-orientation="vertical"></span>\n        <button type="button" class="doc-btn" data-doc-btn aria-haspopup="dialog" aria-label="上传文档" title="上传文档给模型分析（文本类文件，随下一条消息发送）"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg></button><button type="button" class="wand-btn" data-wand aria-haspopup="dialog" aria-label="AI优化" title="选择技能，优化提示词"><svg class="ico-wand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg><svg class="ico-stop" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg></button><button type="button" class="mic-btn" data-mic aria-label="语音输入" title="语音输入：录音→语音识别→整理填入提示词"><svg class="ico-mic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19v3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/></svg><svg class="ico-stop" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg></button>\n      </div>\n      <input type="file" data-doc-input multiple accept=".txt,.md,.markdown,.json,.csv,.tsv,.log,.xml,.html,.htm,.srt,.vtt,.yaml,.yml,.ini,.conf,.cfg,.js,.ts,.jsx,.tsx,.css,.py,.java,.c,.cpp,.h,.sh,.sql,.rs,.go,.rb,.php,.kt,.swift" hidden>\n      <div class="doc-chips" data-doc-chips hidden></div>\n      <div class="prompt-vars" data-vars hidden></div>\n      <div class="prompt-history-list" id="phList"></div>\n      <div class="skill-panel" data-skill-panel hidden></div>\n    `;
const ta = wrap.querySelector("textarea");
ta.addEventListener("input", () => this._onPromptInput(ta));
ta.addEventListener("focus", () => {
this.state.activeRefKey = null;
});
ta.addEventListener("keydown", e => this._onPromptKeydown(e, ta));
wrap.querySelector('[data-action="recent"]').addEventListener("click", e => {
e.stopPropagation();
this._togglePromptHistory(e.currentTarget);
});
wrap.querySelector('[data-action="clear"]').addEventListener("click", () => this._clearPrompt(ta));
/* IMPL-78 R2：三模式工具行图标按钮——与设置抽屉开关同源（Store），点击走实例 flip 方法 */
wrap.querySelector("[data-mode-think]")?.addEventListener("click", e => {
e.stopPropagation();
if (this._flipThink) this._flipThink();
});
wrap.querySelector("[data-mode-relay]")?.addEventListener("click", e => {
e.stopPropagation();
if (this._flipRelay) this._flipRelay();
});
wrap.querySelector("[data-mode-discuss]")?.addEventListener("click", e => {
e.stopPropagation();
if (this._flipDiscuss) this._flipDiscuss();
});
this._mountWorkflowBtns(wrap);
$("#savePresetBtn", wrap) ?? wrap.querySelector("#savePresetBtn");
wrap.querySelector("#savePresetBtn").addEventListener("click", () => this._openPresetModal());
wrap.querySelector("#presetTrigger").addEventListener("click", () => this._openPresetPicker());
wrap.querySelector("[data-wand]").addEventListener("click", e => {
e.stopPropagation();
SkillSession.onWandClick();
});
/* IMPL-96③：语音输入——录音→直连 ASR→追加填入提示词（VoiceInput 状态机在 modelLogoOf 后定义） */
wrap.querySelector("[data-mic]").addEventListener("click", e => {
e.stopPropagation();
VoiceInput.toggle(ta, e.currentTarget);
});
/* IMPL-75 ④：文档直传——按钮点击→文件选择；选中后清空 input 允许重复选同一文件 */
wrap.querySelector("[data-doc-btn]").addEventListener("click", e => {
e.stopPropagation();
SkillSession._onDocBtn();
});
wrap.querySelector("[data-doc-input]").addEventListener("change", e => {
SkillSession._onDocFiles(e.target.files);
e.target.value = "";
});
SkillSession.attach(wrap);
if (this._syncModeUI) this._syncModeUI(wrap);
this._onPromptInput(ta);
return wrap;
},
_onPromptInput(ta) {
const count = ta.value.length;
const countEl = ta.parentElement.querySelector("[data-count]");
if (countEl) {
countEl.textContent = `${count}字`;
}
this._renderPromptVars(ta);
this._autoGrowPrompt(ta);
},
_onPromptKeydown(e, ta) {
if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
e.preventDefault();
SkillSession.onWandClick();
}
},
_extractPromptVars(text) {
PROMPT_VAR_RE.lastIndex = 0;
const out = [];
const seen = new Set;
let m;
while (m = PROMPT_VAR_RE.exec(String(text || ""))) {
const name = m[1] || m[2] || m[3] || "";
if (!name || seen.has(name)) continue;
seen.add(name);
out.push(name);
if (out.length >= 8) break;
}
return out;
},
_renderPromptVars(ta) {
const box = ta.parentElement.querySelector("[data-vars]");
if (!box) return;
const vars = this._extractPromptVars(ta.value);
if (!vars.length) {
box.hidden = true;
box.innerHTML = "";
return;
}
box.hidden = false;
box.innerHTML = `<span class="pv-label">🧩 ${vars.length} 个变量</span>` + vars.map(v => `<button type="button" class="pv-chip" data-var="${esc(v)}" title="点击填入该变量的值">{${esc(v)}}</button>`).join("");
box.querySelectorAll(".pv-chip").forEach(chip => {
chip.addEventListener("click", () => this._editPromptVar(ta, chip, chip.dataset.var));
});
},
_editPromptVar(ta, chip, name) {
if (!chip.isConnected || chip.parentElement.querySelector(".pv-input")) return;
const input = document.createElement("input");
input.type = "text";
input.className = "pv-input";
input.placeholder = `输入「${name}」的值，留空删除`;
input.setAttribute("aria-label", `填入变量 ${name} 的值`);
chip.replaceWith(input);
input.focus();
const commit = () => {
if (!input.isConnected) return;
const val = input.value.trim();
input.remove();
if (val) this._fillPromptVar(ta, name, val); else this._renderPromptVars(ta);
ta.focus();
};
input.addEventListener("keydown", e => {
if (e.key === "Enter") {
e.preventDefault();
commit();
} else if (e.key === "Escape") {
e.stopPropagation();
input.remove();
this._renderPromptVars(ta);
ta.focus();
}
});
input.addEventListener("blur", () => setTimeout(commit, 120));
},
_fillPromptVar(ta, name, val) {
const forms = [ "{" + name + "}", "【" + name + "】", "[" + name + "]" ];
for (const f of forms) {
const i = ta.value.indexOf(f);
if (i !== -1) {
const rep = val || "";
ta.value = ta.value.slice(0, i) + rep + ta.value.slice(i + f.length);
const p = i + rep.length;
try {
ta.setSelectionRange(p, p);
} catch {}
this._onPromptInput(ta);
return true;
}
}
return false;
},
/* IMPL-78 R2：@ 历史引用方法（_checkAtMention/_showAtMention/_hlMatch/_insertAtMention/_hideAtMention）已整体移除——历史提示词仍可经「最近」按钮访问 */
_togglePromptHistory(btn) {
const list = btn.closest(".prompt-module").querySelector(".prompt-history-list");
const items = Store.getPromptHistory();
if (list.classList.contains("show")) {
list.classList.remove("show");
return;
}
if (!items.length) {
list.innerHTML = '<div class="ph-empty">暂无历史</div>';
} else {
list.innerHTML = items.map(p => `<div class="ph-item">${esc(trunc(p, 80))}</div>`).join("");
list.innerHTML += '<div class="ph-clear" id="phClearBtn" style="padding:8px 12px;font-size:11px;color:var(--danger);text-align:center;cursor:pointer;border-top:1px solid var(--border-soft);">清空历史</div>';
$$(".ph-item", list).forEach((el, i) => el.addEventListener("click", () => {
const ta = btn.closest(".prompt-module").querySelector("textarea");
ta.value = items[i];
this._onPromptInput(ta);
list.classList.remove("show");
}));
const clearBtn = list.querySelector("#phClearBtn");
if (clearBtn) clearBtn.addEventListener("click", () => {
if (confirm("确定清空所有提示词历史？")) {
storageSet(CONFIG.STORAGE_KEYS.PROMPT_HISTORY, "[]");
list.classList.remove("show");
Toast.success("已清空");
}
});
}
const rect = btn.getBoundingClientRect();
list.style.position = "fixed";
list.style.top = rect.bottom + 4 + "px";
list.style.left = rect.left + "px";
list.classList.add("show");
},
_clearPrompt(ta) {
if (!ta.value.trim()) return;
ta.value = "";
this._onPromptInput(ta);
Toast.info("已清空");
},
_buildRefSection(p) {
const wrap = document.createElement("div");
wrap.className = "ref-section";
wrap.dataset.refKey = p.key;
const gridClass = p.type === "ref-video" ? "ref-grid-video" : p.type === "ref-audio" ? "ref-grid-audio" : "";
const warnMsg = p.type === "ref-video" ? "本地视频需上传至 R2 后才能用于生成" : p.type === "ref-audio" ? "本地音频需上传至 R2 后才能用于生成" : "";
wrap.innerHTML = `\n      <div class="ref-label">${this._REF_ICONS[p.type] || ""}<span>${esc(p.label)}${p.required ? '<i class="req-star" aria-label="必填">*</i>' : ""}</span>${this._refHint(p.hint) ? `<span class="ref-hint">${esc(this._refHint(p.hint))}</span>` : ""}</div>\n      <div class="ref-grid ${gridClass}" data-ref-grid="${esc(p.key)}"></div>\n      ${warnMsg ? '<div class="ref-video-warn" data-ref-warn="' + esc(p.key) + '">' + warnMsg + "</div>" : ""}\n    `;
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = p.type === "ref-video" ? "video/*" : p.type === "ref-audio" ? "audio/*" : "image/*";
fileInput.multiple = p.output !== "single";
fileInput.style.display = "none";
fileInput.addEventListener("change", e => {
Promise.all(Array.from(e.target.files).map(f => {
if (p.type === "ref-video") return this._addLocalVideoRef(p.key, f); else if (p.type === "ref-audio") return this._addLocalAudioRef(p.key, f); else return this._addLocalRef(p.key, f);
}));
fileInput.value = "";
});
wrap.appendChild(fileInput);
const grid = wrap.querySelector(".ref-grid");
grid.addEventListener("click", e => {
if (e.target.closest(".ref-del") || e.target.closest(".ref-copy") || e.target.closest(".ref-edit") || e.target.closest(".ref-item")) return;
this.state.activeRefKey = p.key;
const acceptType = p.type === "ref-video" ? "video/*" : p.type === "ref-audio" ? "audio/*" : "image/*";
const title = p.type === "ref-video" ? "添加参考视频" : p.type === "ref-audio" ? "添加参考音频" : "添加参考图";
const handleFiles = files => Promise.all(files.map(f => {
if (p.type === "ref-video") return this._addLocalVideoRef(p.key, f); else if (p.type === "ref-audio") return this._addLocalAudioRef(p.key, f); else return this._addLocalRef(p.key, f);
}));
if (typeof FilePond !== "undefined" && this._openFilePondPicker({
accept: acceptType,
multiple: p.output !== "single",
title: title,
onSelect: handleFiles
})) {
return;
}
fileInput.click();
});
grid.addEventListener("pointerdown", () => {
this.state.activeRefKey = p.key;
}, true);
return wrap;
},
_isBoolSel(p) {
/* ★ R29-B：bool 判定抽成方法——字段渲染与组装器（多开关一行）共用同一口径 */
return p.type === "select" && (p.options || []).length === 2 && p.options.every(o => /^(true|false|1|0|on|off|yes|no|是|否|开|关)$/i.test(String(o)));
},
_buildFieldRow(p) {
const wrap = document.createElement("div");
wrap.className = "param-group";
const defVal = this.state.formCache[this.state.modelKey]?.[p.key] ?? p.default ?? "";
const _boolSel = this._isBoolSel(p); /* R29-B：判定抽成方法（组装器多开关一行也要用） */
let inner = p.type === "cap-grid" ? '<div class="field-row">' : `<div class="field-row${_boolSel ? " is-switch" : ""}"><div class="field-label">${esc(p.label)}${p.required ? '<i class="req-star" aria-label="必填">*</i>' : ""}${p.hint ? `<span class="field-hint">${esc(p.hint)}</span>` : ""}${p.type === "range" ? `<span class="field-val" data-val="${esc(p.key)}"></span>` : ""}</div>`;
if (p.type === "select") {
if (_boolSel) {
/* ★ R29-B：开/关类参数 → 滑动开关。隐藏 select 保留为**取值载体**（data-key 照旧） ⇒ 采集/可见性/
   摘要/费用/预设导入全部复用原链路，零改动。 */
const _onOpt = (p.options || []).find(o => /^(true|1|on|yes|是|开)$/i.test(String(o))) || (p.options || [])[p.options.length - 1];
const _on = String(defVal) === String(_onOpt);
inner += `<button type="button" class="switch${_on ? " on" : ""}" role="switch" aria-checked="${_on}" data-switch="${esc(p.key)}" aria-label="${esc(p.label)}" title="${esc(p.hint || p.label)}"><span class="sw-dot"></span></button><select class="pq-hidden-select" tabindex="-1" aria-hidden="true" data-key="${esc(p.key)}">${p.options.map(o => `<option value="${esc(o)}" ${o === defVal ? "selected" : ""}>${esc(String(o))}</option>`).join("")}</select>`;
} else {
inner += `<select data-key="${esc(p.key)}">${p.options.map(o => `<option value="${esc(o)}" ${o === defVal ? "selected" : ""}>${esc(this._enumLabel(p.key, o))}</option>`).join("")}</select>`;
}
} else if (p.type === "range") {
/* ★ R24-G：时长等 range 走液态进度条（--fill 同步填充比例） */
const _mn = Number(p.min || 0), _mx = Number(p.max || 100), _v0 = Number(defVal || 0);
const _fill = Math.max(0, Math.min(100, ((_v0 - _mn) / ((_mx - _mn) || 1)) * 100));
inner += `<div class="range-row"><input type="range" class="is-liquid" style="--fill:${_fill.toFixed(1)}%" data-key="${esc(p.key)}" min="${p.min}" max="${p.max}" step="${p.step}" value="${defVal}"></div>`;
} else if (p.type === "number") {
inner += `<input type="number" data-key="${esc(p.key)}" value="${esc(defVal)}" ${p.min != null ? `min="${p.min}"` : ""} ${p.max != null ? `max="${p.max}"` : ""}>`;
} else if (p.type === "cap-grid") {
const capOf = v => {
const o = (p.options || []).find(x => String(x.value) === String(v));
const c = typeof SegStudio !== "undefined" && SegStudio.CAPS ? SegStudio.CAPS.find(cc => cc.id === v) : null;
return o && o.desc || c && c.desc || o && o.label || "";
};
inner += `<input type="hidden" data-key="${esc(p.key)}" value="${esc(defVal)}">`;
const CAP_GROUPS = [ [ "物品", [ "SegmentCommonImage", "SegmentHDCommonImage", "SegmentCommodity", "SegmentFood", "SegmentCloth" ] ], [ "人像", [ "SegmentBody", "SegmentHDBody", "SegmentHead", "SegmentHair", "SegmentSkin" ] ], [ "场景", [ "SegmentSky", "SegmentHDSky", "ChangeSky" ] ], [ "高级", [ "RefineMask" ] ] ];
/* ★ R29-A（修 2026-10-02「抠图面板该改版」）：14 张能力卡按组排布 + 双列紧凑行式（图标+名），组头小字分隔；
   未登记进组的新能力自动落尾。点击/选中/desc 联动沿用原委托（只认 .cap-chip），零行为改动。 */
const _capRest = (p.options || []).slice();
const _capChip = o => {
const cap = typeof SegStudio !== "undefined" && SegStudio.CAPS ? SegStudio.CAPS.find(c => c.id === o.value) : null;
const icon = o.icon || cap && cap.icon || CAP_ICONS.scissors;
const desc = o.desc || cap && cap.desc || "";
const on = String(o.value) === String(defVal);
return `<button type="button" class="cap-chip${on ? " on" : ""}" data-cap="${esc(o.value)}" role="radio" aria-checked="${on}" title="${esc(desc || o.label)}"><span class="cap-emoji" aria-hidden="true">${icon}</span><span class="cap-name">${esc(o.label)}</span></button>`;
};
let _capHtml = "";
for (const _g of CAP_GROUPS) {
const _items = _g[1].map(v => (p.options || []).find(o => String(o.value) === v)).filter(Boolean);
if (!_items.length) continue;
_items.forEach(o => { const _ix = _capRest.indexOf(o); if (_ix >= 0) _capRest.splice(_ix, 1); });
_capHtml += `<div class="cap-grp">${_g[0]}</div>` + _items.map(_capChip).join("");
}
_capHtml += _capRest.map(_capChip).join("");
inner += `<div class="cap-grid" role="radiogroup" aria-label="${esc(p.label)}">` + _capHtml + `</div>`;inner += `<div class="cap-desc" data-cap-desc="${esc(p.key)}">${esc(capOf(defVal))}</div>`;
} else if (p.type === "datalist") {
/* IMPL-119：input+datalist 取代纯 select——hint 承诺可填复刻音色 id（qwen_audio_tts_plus），纯 select 阻断自由输入 */
inner += `<select data-key="${esc(p.key)}" aria-label="${esc(p.label)}">${p.options.map(o => `<option value="${esc(o.value)}" ${String(o.value) === String(defVal) ? "selected" : ""}>${esc(o.label || o.value)}</option>`).join("")}</select>`;
} else if (p.type === "url") {
inner += `<div class="url-input-row"><input type="text" data-key="${esc(p.key)}" value="${esc(defVal)}" placeholder="${esc(p.placeholder || "https://...")}"><button data-add-url="${esc(p.key)}">添加</button></div>`;
} else if (p.type === "url-list") {
inner += `<div class="url-input-row"><input type="text" data-url-input="${esc(p.key)}" placeholder="https://..."><button data-add-url-list="${esc(p.key)}">添加</button></div><div data-url-list="${esc(p.key)}" class="ref-grid" style="margin-top:6px"></div>`;
} else {
inner += `<input type="text" data-key="${esc(p.key)}" value="${esc(defVal)}" placeholder="${esc(p.placeholder || "")}">`;
}
inner += "</div>";
wrap.innerHTML = inner;
const el = wrap.querySelector(`[data-key="${p.key}"]`);
if (el) {
el.addEventListener("input", () => this._onFieldChange(p.key, el));
el.addEventListener("change", () => this._onFieldChange(p.key, el));
}
/* ★ R29-B：滑动开关点击 → 代理到隐藏 select（派发 change ⇒ 摘要/费用/可见性沿原链路自动联动） */
const _swBtn = wrap.querySelector(`[data-switch="${p.key}"]`);
if (_swBtn && el) {
_swBtn.addEventListener("click", () => {
const _onV = (p.options || []).find(o => /^(true|1|on|yes|是|开)$/i.test(String(o))) || (p.options || [])[p.options.length - 1];
const _tgt = String(el.value) === String(_onV) ? (p.options || []).find(o => String(o) !== String(_onV)) : _onV;
if (_tgt == null) return;
el.value = _tgt;
el.dispatchEvent(new Event("change", { bubbles: true }));
});
}
const addUrlBtn = wrap.querySelector(`[data-add-url="${p.key}"]`);
if (addUrlBtn) addUrlBtn.addEventListener("click", () => {
const inp = wrap.querySelector(`[data-key="${p.key}"]`);
if (inp.value.trim()) Toast.info("已添加链接");
});
if (p.type === "cap-grid") {
const grid = wrap.querySelector(".cap-grid");
const descEl = wrap.querySelector(`[data-cap-desc="${p.key}"]`);
if (grid) grid.addEventListener("click", e => {
const chip = e.target.closest(".cap-chip");
if (!chip) return;
grid.querySelectorAll(".cap-chip").forEach(x => {
const on = x === chip;
x.classList.toggle("on", on);
x.setAttribute("aria-checked", on ? "true" : "false");
});
el.value = chip.dataset.cap;
if (descEl) descEl.textContent = (p.options || []).find(o => String(o.value) === String(el.value))?.desc || chip.title || "";
this._onFieldChange(p.key, el);
});
}
this._onFieldChange(p.key, el);
return wrap;
},
_onFieldChange(key, el) {
const valEl = el?.closest?.(".param-group")?.querySelector(`[data-val="${key}"]`) || $(`[data-val="${key}"]`);
if (valEl && el) {
if (el.type === "range") {
valEl.textContent = el.value;
/* ★ R24-G：液态进度条填充比例同步 */
const _mn = Number(el.min || 0), _mx = Number(el.max || 100), _v = Number(el.value || 0);
el.style.setProperty("--fill", Math.max(0, Math.min(100, ((_v - _mn) / ((_mx - _mn) || 1)) * 100)).toFixed(1) + "%");
} else {
const p = (this.state.model?.params || []).find(pp => pp.key === key);
let txt = el.value;
if (p && Array.isArray(p.options) && p.options.length && typeof p.options[0] === "object") {
const hit = p.options.find(o => String(o.value) === String(el.value));
if (hit) txt = hit.label;
} else if (el.tagName === "SELECT") {
txt = this._enumLabel(key, el.value);
}
valEl.textContent = txt;
}
}
if (key === "__count") this._syncCountChip();
if (el && el.tagName === "SELECT") this._syncPqControl(el);
/* ★ R29-B：开关回显 —— 预设导入/撤销/程序化改值等所有路径都会经过本函数 */
if (el && el.tagName === "SELECT") {
const _swB = el.closest(".param-group")?.querySelector("[data-switch]");
const _swP = (this.state.model?.params || []).find(pp => pp.key === key);
if (_swB && _swP) {
const _onV2 = (_swP.options || []).find(o => /^(true|1|on|yes|是|开)$/i.test(String(o))) || (_swP.options || [])[_swP.options.length - 1];
const _on2 = String(el.value) === String(_onV2);
_swB.classList.toggle("on", _on2);
_swB.setAttribute("aria-checked", _on2 ? "true" : "false");
}
}
if (el && el.type === "hidden") {
const grid = el.parentElement && el.parentElement.querySelector(".cap-grid");
if (grid) grid.querySelectorAll(".cap-chip").forEach(x => {
const on = x.dataset.cap === String(el.value);
x.classList.toggle("on", on);
x.setAttribute("aria-checked", on ? "true" : "false");
});
}
this._applyVisibleIf();
},
_openPresetPicker(initialTab) {
const tab = this.state.tab;
const builtin = tab === "image" ? PROMPT_PRESETS : tab === "video" ? VIDEO_PROMPT_PRESETS : AUDIO_PROMPT_PRESETS;
const templates = PROMPT_TEMPLATES[tab] || [];
const custom = Store.getPresets().filter(p => p.tab === tab);
let activeTab = ["builtin", "skills", "templates"].includes(initialTab) ? initialTab : "skills";
/* SVG 线性图标库（IMPL-55 极简模块化）：stroke 继承 currentColor，列表项只显示图标+名称，内容靠 title 悬停提示 */
const ICONS = {
sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
tpl: '<rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="14" y="14" rx="1"/>',
wand: '<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/>',
scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/>',
eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
pen: '<path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"/><path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"/><path d="m2.3 2.3 7.286 7.286"/><circle cx="11" cy="11" r="2"/>',
layout: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
clap: '<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
portrait: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
undo: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
check: '<path d="M20 6 9 17l-5-5"/>'
};
const SKILL_ICONS = { "prompt-optimizer": "wand", "visual-prompt-reverse": "scan", "content-visualize": "eye", "sketch-diagram": "pen", "zine-poster": "layout", "scene-paper": "camera", "eterna-cinema": "clap", "life-portrait": "portrait", "product-still": "sliders", "page-splitter": "tpl", "video-cinema-director": "clap", "video-frame-motion": "camera", "video-frame-bridge": "bookmark", "video-storyboard": "tpl", "video-style-mixer": "sliders" };
const svg = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ICONS.sparkles}</svg>`;
const renderList = (filter = "") => {
const f = filter.toLowerCase();
let html = "";
/* IMPL-57：技能=5 栏图标竖卡（77-d 与预设/模板统一）；预设/模板=5 栏纯名称卡（无图标）—— 无分组小标题（技能/预设）、无分类 chips（模板）
   搜索框即全量过滤，空间零浪费 */
if (activeTab === "skills") {
const skills = SKILLS.filter(s => s.tab === tab);
const filtered = filter ? skills.filter(s => s.name.toLowerCase().includes(f) || s.description.toLowerCase().includes(f) || (s.group || "").toLowerCase().includes(f)) : skills;
if (tab !== "image" && tab !== "video") {
html += '<div class="pp-empty">当前分类暂无技能<br>技能已随「图片 / 视频」分类上线，切过去试试</div>';
} else {
html += '<div class="pp-grid cols5">' + filtered.map(s => {
const on = SkillSession.has(s.skillId);
const need = (s.requiredCapabilities || []).includes("image_input") ? '<i class="pp-need">需图</i>' : "";
return `<button type="button" class="pp-item${on ? " active" : ""}" data-skill="${esc(s.skillId)}" aria-pressed="${on}" title="${esc(s.description)}"><span class="pp-ico">${svg(SKILL_ICONS[s.skillId] || "sparkles")}</span><span class="pp-name">${esc(s.name)}</span>${need}${on ? `<span class="pp-check">${svg("check")}</span>` : ""}</button>`;
}).join("") + "</div>";
if (!filtered.length) html += '<div class="pp-empty">无匹配技能</div>';
}
} else if (activeTab === "builtin") {
const fb = filter ? builtin.filter(p => p.name.toLowerCase().includes(f) || p.id.toLowerCase().includes(f)) : builtin;
const fc = filter ? custom.filter(p => p.name.toLowerCase().includes(f)) : custom;
html += '<div class="pp-grid cols5">'
+ fb.map(p => `<button type="button" class="pp-item no-ico" data-preset="builtin:${esc(p.id)}" title="${p.id === "none" ? "清除预设，恢复原始提示词" : "应用功能预设「" + esc(p.name) + "」"}"><span class="pp-name">${esc(p.name)}</span>${p.id === "none" ? '<i class="pp-need pp-need-dim">清除</i>' : ""}</button>`).join("")
+ fc.map(p => `<button type="button" class="pp-item no-ico" data-preset="custom:${esc(p.id)}" title="应用我的预设「${esc(p.name)}」"><span class="pp-name">${esc(p.name)}</span><span class="pp-del" data-del-preset="${esc(p.id)}" role="button" aria-label="删除预设 ${esc(p.name)}" title="删除此预设">${svg("x")}</span></button>`).join("")
+ "</div>";
if (!fb.length && !fc.length) html += '<div class="pp-empty">无匹配预设</div>';
} else if (activeTab === "templates") {
const items = filter ? templates.filter(t => t.name.toLowerCase().includes(f) || t.prompt.toLowerCase().includes(f)) : templates;
html += '<div class="pp-grid cols5">' + items.map(t => `<button type="button" class="pp-item no-ico" data-preset="template:${esc(t.id)}" title="应用模板「${esc(t.name)}」"><span class="pp-name">${esc(t.name)}</span></button>`).join("") + "</div>";
if (!items.length) html += '<div class="pp-empty">无匹配模板</div>';
}
const list = $("#modalBody .preset-list");
if (list) list.innerHTML = html;
$$("#modalBody [data-preset]").forEach(el => {
el.addEventListener("click", e => {
if (e.target.closest("[data-del-preset]")) return;
this._applyPreset(el.dataset.preset);
this._closeModal();
});
});
$$("#modalBody [data-skill]").forEach(el => {
el.addEventListener("click", () => {
const s = SKILLS.find(x => x.skillId === el.dataset.skill);
if (!s) return;
if (!SkillSession.configReady()) {
if (s.fallback) {
this._applyPreset("template:" + s.fallback);
Toast.info("技能执行依赖 Worker 配置，已填入离线模板「" + s.name + "」");
} else {
Toast.warning("配置 Worker URL 与 Auth Token 后可用技能（设置 → R2 图床）", 3600);
}
return;
}
SkillSession.toggle(s.skillId);
renderList($("#presetSearchInput")?.value || "");
});
});
$$("#modalBody [data-del-preset]").forEach(btn => {
btn.addEventListener("click", e => {
e.stopPropagation();
Store.delPreset(btn.dataset.delPreset);
renderList($("#presetSearchInput")?.value || "");
Toast.success("预设已删除");
});
});
};
const tabBtns = `<div class="pp-tabs"><button type="button" class="pp-tab${activeTab === "skills" ? " active" : ""}" data-ptab="skills">${svg("sparkles")}<span class="pp-tab-t">技能</span></button><button type="button" class="pp-tab${activeTab === "builtin" ? " active" : ""}" data-ptab="builtin">${svg("sliders")}<span class="pp-tab-t">预设</span></button><button type="button" class="pp-tab${activeTab === "templates" ? " active" : ""}" data-ptab="templates">${svg("tpl")}<span class="pp-tab-t">模板 <span class="pp-tab-n">${templates.length}</span></span></button></div>`;
const searchHtml = `${tabBtns}<div class="history-search" style="padding:8px 10px;border-bottom:1px solid var(--border-soft)"><input type="text" id="presetSearchInput" aria-label="搜索技能预设" placeholder="搜索技能 / 预设 / 模板..." style="font-size:13px"></div><div class="preset-list pp-list"></div>`;
this._showModal(`技能中心`, searchHtml, [{
label: "完成",
primary: true,
fn: () => this._closeModal()
}]);
$("#modalOverlay .modal-content")?.classList.add("modal-wide");
renderList();
const searchInput = $("#presetSearchInput");
if (searchInput) {
searchInput.addEventListener("input", e => renderList(e.target.value));
setTimeout(() => searchInput.focus(), 100);
}
$$("#modalBody [data-ptab]").forEach(btn => {
btn.addEventListener("click", () => {
activeTab = btn.dataset.ptab;
$$("#modalBody [data-ptab]").forEach(b => b.classList.toggle("active", b.dataset.ptab === activeTab));
renderList($("#presetSearchInput")?.value || "");
});
});
},
_applyPreset(val) {
const ta = $('[data-key="prompt"], [data-key="text"]');
if (!ta) return;
if (val === "builtin:none") {
const base = this.state.promptPresetBase[this.state.modelKey];
if (base != null) {
ta.value = base;
this.state.promptPresetBase[this.state.modelKey] = null;
}
this._onPromptInput(ta);
return;
}
if (val.startsWith("builtin:")) {
const id = val.slice(8);
const tab = this.state.tab;
const builtin = tab === "image" ? PROMPT_PRESETS : tab === "video" ? VIDEO_PROMPT_PRESETS : AUDIO_PROMPT_PRESETS;
const preset = builtin.find(p => p.id === id);
if (!preset) return;
let base = this.state.promptPresetBase[this.state.modelKey];
if (base == null) {
base = ta.value;
this.state.promptPresetBase[this.state.modelKey] = base;
}
ta.value = preset.prompt + (base.trim() ? `\n\n${base}` : "");
this.state.promptPresetName[this.state.modelKey] = preset.name;
this._onPromptInput(ta);
Store.recordPresetUsage(`builtin|${this.state.tab}|${id}`);
Toast.info(`已应用预设: ${preset.name}`);
} else if (val.startsWith("custom:")) {
const id = val.slice(7);
const preset = Store.getPresets().find(p => p.id === id);
if (!preset) return;
ta.value = preset.prompt;
this.state.promptPresetBase[this.state.modelKey] = null;
this._onPromptInput(ta);
Store.recordPresetUsage(`custom|${id}`);
Toast.info(`已应用预设: ${preset.name}`);
} else if (val.startsWith("template:")) {
const id = val.slice(9);
const tab = this.state.tab;
const templates = PROMPT_TEMPLATES[tab] || [];
const tpl = templates.find(t => t.id === id);
if (!tpl) return;
ta.value = tpl.prompt;
this.state.promptPresetBase[this.state.modelKey] = null;
this._onPromptInput(ta);
Store.recordPresetUsage(`template|${this.state.tab}|${id}`);
Toast.info(`已应用模板: ${tpl.name}`);
}
},
_agoLabel(t) {
if (!t) return "";
const d = Date.now() - t;
if (d < 36e5) return "刚刚";
if (d < 864e5) return "今天";
if (d < 2 * 864e5) return "昨天";
if (d < 7 * 864e5) return `${Math.floor(d / 864e5)}天前`;
if (d < 30 * 864e5) return `${Math.max(1, Math.floor(d / (7 * 864e5)))}周前`;
return `${Math.min(12, Math.max(1, Math.floor(d / (30 * 864e5))))}个月前`;
},
_openPresetModal() {
const ta = $('[data-key="prompt"], [data-key="text"]');
if (!ta || !ta.value.trim()) {
Toast.warning("提示词为空，无法保存");
return;
}
$("#presetNameInput").value = "";
$("#presetOverlay").classList.add("show");
setTimeout(() => $("#presetNameInput").focus(), 100);
},
_confirmSavePreset() {
const name = $("#presetNameInput").value.trim();
if (!name) {
Toast.warning("请输入预设名称");
return;
}
const ta = $('[data-key="prompt"], [data-key="text"]');
const prompt = ta ? ta.value : "";
Store.savePreset(name, this.state.tab, this.state.model.id, prompt);
$("#presetOverlay").classList.remove("show");
Toast.success("预设已保存");
},
_getRefs(key) {
if (!this.state.refState[this.state.modelKey]) this.state.refState[this.state.modelKey] = {};
if (!this.state.refState[this.state.modelKey][key]) this.state.refState[this.state.modelKey][key] = [];
return this.state.refState[this.state.modelKey][key];
},
_addLocalRef(key, file) {
const item = { id: genId(), kind: "local", src: "", name: file.name, uploaded: false, remote: null };
this._getRefs(key).push(item); /* 第十三批用户反馈②：占位同步 push 保序——refs 序=调用序=用户添加/多选 files 序；原 onload 内 push 是读取完成序，多图并发时乱序=参考图顺序错位根因①；读取完成后仅回填 src */
this._renderRefGrid(key);
const reader = new FileReader;
reader.onload = e => {
item.src = e.target.result;
this._renderRefGrid(key);
this._uploadLocalImage(key, item);
};
reader.readAsDataURL(file);
},
_addLocalVideoRef(key, file) {
if (file.size > 100 * 1024 * 1024) {
Toast.error("视频不能超过 100MB");
return;
}
const url = URL.createObjectURL(file);
const item = {
id: genId(),
kind: "local-video",
src: url,
name: file.name,
uploaded: false,
remote: null,
file: file
};
this._getRefs(key).push(item);
this._renderRefGrid(key);
this._updateRefVideoWarn(key);
this._uploadLocalVideo(key, item);
},
_addLocalAudioRef(key, file) {
if (file.size > 50 * 1024 * 1024) {
Toast.error("音频不能超过 50MB");
return;
}
const url = URL.createObjectURL(file);
const item = {
id: genId(),
kind: "local-audio",
src: url,
name: file.name,
uploaded: false,
remote: null,
file: file
};
this._getRefs(key).push(item);
this._renderRefGrid(key);
this._updateRefAudioWarn(key);
this._uploadLocalAudio(key, item);
},
_addUrlRef(key, url, meta) {
if (!/^https?:\/\//.test(url)) {
Toast.error("请输入有效的 URL");
return null;
}
const refs = this._getRefs(key);
if (refs.some(r => r.remote === url || r.src === url)) {
Toast.warning("该 URL 已存在");
return null;
}
const model = this.state.model || MODELS.image[0];
const param = model?.params?.find(p => p.key === key);
/* IMPL-119：URL 直添同样尊重参考素材上限（此前仅网格渲染计数，_addUrlRef 可绕过 UI 上限） */
const maxN = param ? param.max || (param.output === "single" ? 1 : param.output === "csv" ? 99 : param.output === "array" ? 14 : 99) : 99;
if (refs.length >= maxN) {
Toast.warning(`最多 ${maxN} 个`);
return null;
}
const isVideo = param && param.type === "ref-video";
const isAudio = param && param.type === "ref-audio";
const kind = isVideo ? "url-video" : isAudio ? "url-audio" : "url";
const item = {
id: genId(),
kind: kind,
src: url,
name: url.split("/").pop() || "url",
uploaded: true,
remote: url,
...meta || {}
};
refs.push(item);
this._renderRefGrid(key);
if (isVideo) this._updateRefVideoWarn(key);
if (isAudio) this._updateRefAudioWarn(key);
return item;
},
_removeRef(key, id) {
const refs = this._getRefs(key);
const idx = refs.findIndex(r => r.id === id);
if (idx >= 0) {
if (refs[idx].src.startsWith("blob:")) URL.revokeObjectURL(refs[idx].src);
refs.splice(idx, 1);
}
this._renderRefGrid(key);
this._updateRefVideoWarn(key);
this._updateRefAudioWarn(key);
},
async _uploadLocalImage(key, item) {
try {
const blob = Api.dataUrlToBlob(item.src);
const file = new File([ blob ], item.name, {
type: blob.type
});
const url = await Api.uploadToR2(file, pct => this._updateRefProgress(key, item.id, pct), 0, "ref-image");
item.remote = url;
item.uploaded = true;
item._justUploaded = true;
this._renderRefGrid(key);
setTimeout(() => {
item._justUploaded = false;
this._renderRefGrid(key);
}, 600);
} catch (e) {
item.uploadError = e.message;
this._renderRefGrid(key);
Toast.warning(`图片上传失败：${e.message}，点击重试`);
}
},
async _uploadLocalVideo(key, item) {
try {
const url = await Api.uploadToR2(item.file, pct => this._updateRefProgress(key, item.id, pct), 0, "ref-video");
item.remote = url;
item.uploaded = true;
item._justUploaded = true;
this._renderRefGrid(key);
this._updateRefVideoWarn(key);
setTimeout(() => {
item._justUploaded = false;
this._renderRefGrid(key);
}, 600);
} catch (e) {
Toast.error(`视频上传失败: ${e.message}`);
item.uploadError = e.message;
this._renderRefGrid(key);
}
},
async _uploadLocalAudio(key, item) {
try {
const url = await Api.uploadToR2(item.file, pct => this._updateRefProgress(key, item.id, pct), 0, "ref-audio");
item.remote = url;
item.uploaded = true;
item._justUploaded = true;
this._renderRefGrid(key);
this._updateRefAudioWarn(key);
setTimeout(() => {
item._justUploaded = false;
this._renderRefGrid(key);
}, 600);
} catch (e) {
Toast.error(`音频上传失败: ${e.message}`);
item.uploadError = e.message;
this._renderRefGrid(key);
}
},
_updateRefProgress(key, itemId, pct) {
const grid = $(`[data-ref-grid="${key}"]`);
if (!grid) return;
const item = grid.querySelector(`[data-rid="${itemId}"]`);
if (!item) return;
const bar = item.querySelector(".ref-upload-bar");
const pctEl = item.querySelector(".ref-upload-pct");
const pctVal = Math.round(pct * 100);
if (bar) bar.style.width = pctVal + "%";
if (pctEl) pctEl.textContent = pctVal + "%";
},
_renderAllRefGrids() {
const model = this.state.model || MODELS.image[0];
if (!model?.params) return;
for (const p of model.params) {
if (p.type === "ref-image" || p.type === "ref-video" || p.type === "ref-audio") this._renderRefGrid(p.key);
}
},
_registerFilePondPlugins() {
if (this._fpPluginsRegistered) return;
if (typeof FilePond === "undefined") return;
try {
if (typeof FilePondPluginImagePreview !== "undefined") FilePond.registerPlugin(FilePondPluginImagePreview);
if (typeof FilePondPluginFileValidateType !== "undefined") FilePond.registerPlugin(FilePondPluginFileValidateType);
} catch (e) {
console.warn("[FilePond] registerPlugin failed", e);
}
this._fpPluginsRegistered = true;
},
_openFilePondPicker(opts) {
if (typeof FilePond === "undefined") return false;
this._registerFilePondPlugins();
const close = () => {
try {
FilePond.destroy(fp);
} catch (_) {}
if (modal.parentNode) modal.remove();
};
const modal = document.createElement("div");
modal.className = "modal-overlay show";
modal.innerHTML = `\n      <div class="modal-content" style="max-width:500px">\n        <div class="modal-header">\n          <h3>${esc(opts.title || "上传文件")}</h3>\n          <button class="modal-close" id="fpClose" type="button" aria-label="关闭"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>\n        </div>\n        <div class="modal-body">\n          <input type="file" id="fpInput" accept="${esc(opts.accept || "image/*")}" ${opts.multiple !== false ? "multiple" : ""}>\n        </div>\n        <div class="modal-footer">\n          <button class="btn-secondary" id="fpCancel" type="button">取消</button>\n          <button class="btn-primary" id="fpConfirm" type="button">添加</button>\n        </div>\n      </div>\n    `;
document.body.appendChild(modal);
let fp;
try {
fp = FilePond.create(modal.querySelector("#fpInput"), {
allowMultiple: opts.multiple !== false,
instantUpload: false,
server: null,
credits: false,
labelIdle: '拖放文件或 <span class="filepond--label-action">浏览</span>'
});
} catch (e) {
console.warn("[FilePond] init failed", e);
modal.remove();
return false;
}
modal.querySelector("#fpClose").addEventListener("click", close);
modal.querySelector("#fpCancel").addEventListener("click", close);
modal.addEventListener("click", e => {
if (e.target === modal) close();
});
modal.querySelector("#fpConfirm").addEventListener("click", async () => {
const files = fp.getFiles().map(f => f.file).filter(Boolean);
if (files.length === 0) {
Toast.info("请先选择文件");
return;
}
try {
await (opts.onSelect?.(files));
} catch (e) {
console.warn("[FilePond] onSelect error", e);
}
close();
});
return true;
},
_refHint(hint) {
if (!hint) return "";
return /最多/.test(hint) ? "" : hint;
},
_ENUM_ZH: {
auto: "自动",
adaptive: "自适应",
transparent: "透明",
low: "低",
medium: "中",
high: "高",
xhigh: "超清",
max: "最高",
true: "开启",
false: "关闭",
on: "开启",
off: "关闭"
},
_ENUM_ZH_KEY: {
generate_audio: {
true: "生成",
false: "关闭"
},
watermark: {
1: "显示",
0: "不显示"
},
language_boost: {
auto: "自动检测",
Chinese: "中文",
"Chinese,Yue": "中文（粤语）",
English: "英语",
Arabic: "阿拉伯语",
Russian: "俄语",
Spanish: "西班牙语",
French: "法语",
Portuguese: "葡萄牙语",
German: "德语",
Turkish: "土耳其语",
Dutch: "荷兰语",
Ukrainian: "乌克兰语",
Vietnamese: "越南语",
Indonesian: "印尼语",
Japanese: "日语",
Italian: "意大利语",
Korean: "韩语"
}
},
_enumLabel(key, v) {
const s = String(v ?? "");
const byKey = this._ENUM_ZH_KEY?.[key];
if (byKey && byKey[s] != null) return byKey[s];
if (this._ENUM_ZH[s] != null) return this._ENUM_ZH[s];
return v;
},
_renderRefGrid(key) {
const grid = $(`[data-ref-grid="${key}"]`);
if (!grid) return;
const refs = this._getRefs(key);
const model = this.state.model || MODELS.image[0];
const param = model?.params?.find(p => p.key === key);
const isVideo = param && param.type === "ref-video";
const isAudio = param && param.type === "ref-audio";
const max = param ? param.max || (param.output === "single" ? 1 : param.output === "csv" ? 99 : param.output === "array" ? 14 : 99) : 99; /* IMPL-119：param.max 可覆盖输出类型推断上限（qwen 参考图 3） */
let html = refs.map((r, seqIdx) => {
const isLocal = r.kind === "local" || r.kind === "local-video" || r.kind === "local-audio";
const isUploading = isLocal && !r.uploaded && !r.uploadError;
const isUploadError = isLocal && r.uploadError;
let badge = "";
if (isUploading) badge = '<span class="ref-badge uploading">上传中</span>'; else if (isUploadError) badge = '<span class="ref-badge" style="background:var(--danger-soft);color:var(--danger)">失败</span>'; else if (r._justUploaded) badge = '<span class="ref-badge uploaded">✓</span>';
const localBadge = isLocal ? isUploadError ? badge : isUploading ? '<span class="ref-badge local">本地</span>' : r._justUploaded ? badge : "" : "";
const progressHtml = isUploading ? '<div class="ref-upload-progress"><div class="ref-upload-bar" style="width:0%"></div></div><span class="ref-upload-pct">0%</span>' : "";
let media;
if (isVideo) media = `<video src="${esc(r.src)}" muted></video>`; else if (isAudio) media = `<div class="ref-audio-thumb"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect class="eqb e1" x="2.2" y="8.6" width="2.5" height="6.8" rx="1.25"/><rect class="eqb e2" x="6.5" y="5.2" width="2.5" height="13.6" rx="1.25"/><rect class="eqb e3" x="10.8" y="3.4" width="2.5" height="17.2" rx="1.25"/><rect class="eqb e4" x="15.1" y="6.4" width="2.5" height="11.2" rx="1.25"/><rect class="eqb e5" x="19.4" y="9.4" width="2.5" height="5.2" rx="1.25"/></svg><span class="ref-audio-name">${esc(trunc(r.name, 12))}</span></div>`; else media = r.src ? `<img src="${esc(r.src)}" loading="lazy" referrerpolicy="no-referrer">` : `<div class="ref-reading" role="status" aria-label="读取中"></div>`; /* 第十三批：占位 push 保序——src 未回填（FileReader 读取中）显式占位不破图 */
const seqHtml = `<span class="ref-seq" aria-label="第 ${seqIdx + 1} 张">${seqIdx + 1}</span>`; /* 第十三批用户反馈②：序号角标=发送顺序（urls 数组序=网格序） */
const editBtn = !isVideo && !isAudio && r.remote ? `<button class="ref-edit" data-edit="${esc(r.id)}" title="编辑此图" aria-label="编辑此图"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg></button>` : "";
return `<div class="ref-item ${isVideo ? "ref-item-video" : ""} ${isAudio ? "ref-item-audio" : ""}" data-rid="${esc(r.id)}">${seqHtml}${media}${localBadge}${progressHtml}<button class="ref-del" data-del="${esc(r.id)}" aria-label="删除参考图"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>${editBtn}<button class="ref-copy" data-copy-url="${esc(r.id)}" aria-label="复制图片URL"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button></div>`;
}).join("");
const isEmpty = refs.length === 0;
if (grid.classList) grid.classList.toggle("is-empty", isEmpty);
const labelEl = grid.parentElement?.querySelector(".ref-label");
if (labelEl) labelEl.style.display = isEmpty ? "none" : "";
if (isEmpty && refs.length < max) {
const reqStar = param?.required ? '<i class="req-star" aria-label="必填">*</i>' : "";
html += `<div class="ref-add ${isVideo ? "ref-add-video" : ""}" role="button" tabindex="0" aria-label="${esc(param?.label || "添加参考素材")}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg><span class="ref-add-name">${esc(param?.label || "添加")}${reqStar}</span></div>`;
} else if (refs.length < max) {
html += `<div class="ref-add ${isVideo ? "ref-add-video" : ""}" role="button" tabindex="0" aria-label="继续添加参考素材"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></div>`;
}
grid.innerHTML = html;
grid.querySelectorAll("[data-del]").forEach(btn => btn.addEventListener("click", e => {
e.stopPropagation();
this._removeRef(key, btn.dataset.del);
}));
grid.querySelectorAll("[data-copy-url]").forEach(btn => btn.addEventListener("click", e => {
e.stopPropagation();
const r = refs.find(x => x.id === btn.dataset.copyUrl);
if (r && r.remote) {
copy(r.remote).then(ok => ok ? Toast.success("URL 已复制") : Toast.error("复制失败"));
}
}));
grid.querySelectorAll("[data-edit]").forEach(btn => btn.addEventListener("click", e => {
e.stopPropagation();
const r = refs.find(x => x.id === btn.dataset.edit);
if (r && r.remote) this._openEditor(r.remote);
}));
grid.querySelectorAll(".ref-item").forEach(el => el.addEventListener("click", e => {
e.stopPropagation();
const r = refs.find(x => x.id === el.dataset.rid);
if (r && r.remote) {
if (r.kind.includes("video")) this._openLightbox([ r.remote ], 0, true); else if (!r.kind.includes("audio")) this._openLightbox([ r.remote ], 0, false);
}
}));
const refItems = grid.querySelectorAll(".ref-item");
if (typeof Sortable !== "undefined" && refItems.length > 1) {
if (grid._sortableInst) {
try {
grid._sortableInst.destroy();
} catch (_) {}
grid._sortableInst = null;
}
try {
grid._sortableInst = Sortable.create(grid, {
animation: 150,
draggable: ".ref-item",
filter: ".ref-add",
onEnd: evt => {
if (evt.oldIndex === evt.newIndex) return;
const arr = this._getRefs(key);
if (!arr[evt.oldIndex]) return;
const moved = arr.splice(evt.oldIndex, 1)[0];
arr.splice(evt.newIndex, 0, moved);
this._renderRefGrid(key);
}
});
} catch (e) {
console.warn("[Sortable] init failed", e);
}
}
this._syncRefModeBadges();
},
_updateRefVideoWarn(key) {
const warn = $(`[data-ref-warn="${key}"]`);
if (!warn) return;
const refs = this._getRefs(key);
const hasLocal = refs.some(r => r.kind === "local-video" && !r.uploaded);
warn.classList.toggle("show", hasLocal);
},
_updateRefAudioWarn(key) {
const warn = $(`[data-ref-warn="${key}"]`);
if (!warn) return;
const refs = this._getRefs(key);
const hasLocal = refs.some(r => r.kind === "local-audio" && !r.uploaded);
warn.classList.toggle("show", hasLocal);
},
_collectRefImage(key) {
const refs = this._getRefs(key);
const pend = refs.find(r => r.kind === "local" && !r.uploaded); /* 第十三批用户反馈②：图片补齐视频/音频同款守卫——上传中/失败项原先被 /^https?/ 静默过滤=图片缺失+后续序号前移错位根因②，改为显式报错不静默 */
if (pend) throw new Error("参考图尚未上传完成（或上传失败）——请等进度条完成或移除失败项后再提交，避免图片缺失导致顺序错位");
const urls = refs.map(r => r.remote || r.src).filter(u => /^https?:\/\//.test(u));
const param = this.state.model.params.find(p => p.key === key);
if (!param) return null;
if (param.output === "single") return urls[0] || "";
if (param.output === "csv") return urls.join(",");
if (param.output === "array") return urls;
return urls[0] || "";
},
_collectRefVideo(key) {
const refs = this._getRefs(key);
const urls = refs.map(r => r.remote).filter(Boolean);
if (!urls.every(u => /^https?:\/\//.test(u))) throw new Error("本地视频需上传完成后才能使用");
const param = this.state.model.params.find(p => p.key === key);
if (!param) return null;
if (param.output === "single") return urls[0] || "";
if (param.output === "csv") return urls.join(",");
return urls[0] || "";
},
_collectRefAudio(key) {
const refs = this._getRefs(key);
const urls = refs.map(r => r.remote).filter(Boolean);
if (!urls.every(u => /^https?:\/\//.test(u))) throw new Error("本地音频需上传完成后才能使用");
const param = this.state.model.params.find(p => p.key === key);
if (!param) return null;
if (param.output === "single") return urls[0] || "";
if (param.output === "csv") return urls.join(",");
return urls[0] || "";
},
_collectParamsSync() {
const body = {};
const model = this.state.model;
const modelKey = this.state.modelKey;
const inactiveRefParams = new Set;
if (model.refGroups) {
const activeMode = this.state.refMode?.[modelKey] || model.refGroups.modes[0].value;
model.refGroups.modes.forEach(m => {
if (m.value !== activeMode) m.params.forEach(k => inactiveRefParams.add(k));
});
}
for (const p of model.params) {
if (inactiveRefParams.has(p.key)) continue;
if (p.type === "ref-image") {
body[p.key] = this._collectRefImage(p.key);
} else if (p.type === "ref-video") {
body[p.key] = this._collectRefVideo(p.key);
} else if (p.type === "ref-audio") {
body[p.key] = this._collectRefAudio(p.key);
} else {
const el = $(`[data-key="${p.key}"]`);
if (el) body[p.key] = el.value; else if (!inactiveRefParams.has(p.key)) body[p.key] = p.default ?? "";
}
}
this._composeGptAspect(model, body);
this._pruneEmptyRefs(model, body);
return body;
},
async _collectParamsAsync() {
const model = this.state.model;
if (!model) return {};
const body = {};
const inactiveRefParams = new Set;
if (model.refGroups) {
const activeMode = this.state.refMode?.[this.state.modelKey] || model.refGroups.modes[0].value;
model.refGroups.modes.forEach(m => {
if (m.value !== activeMode) m.params.forEach(k => inactiveRefParams.add(k));
});
}
for (const p of model.params) {
if (inactiveRefParams.has(p.key)) continue;
if (p.type === "ref-image") {
body[p.key] = await this._collectRefImageAsync(p.key);
} else if (p.type === "ref-video") {
body[p.key] = await this._collectRefVideoAsync(p.key);
} else if (p.type === "ref-audio") {
body[p.key] = await this._collectRefAudioAsync(p.key);
} else {
const el = $(`[data-key="${p.key}"]`);
if (el) body[p.key] = el.value; else if (!inactiveRefParams.has(p.key)) body[p.key] = p.default ?? "";
}
}
this._composeGptAspect(model, body);
this._pruneEmptyRefs(model, body);
return body;
},
_GPT_RATIO_SIZE: {
"1:1": [ "1024x1024", "2048x2048", "2880x2880" ],
"16:9": [ "1280x720", "2048x1152", "3840x2160" ],
"9:16": [ "720x1280", "1152x2048", "2160x3840" ],
"4:3": [ "1152x864", "2304x1728", "3264x2448" ],
"3:4": [ "864x1152", "1728x2304", "2448x3264" ],
"3:2": [ "1536x1024", "2048x1360", "3504x2336" ],
"2:3": [ "1024x1536", "1360x2048", "2336x3504" ],
"5:4": [ "1120x896", "2240x1792", "3200x2560" ],
"4:5": [ "896x1120", "1792x2240", "2560x3200" ],
"21:9": [ "1456x624", "2912x1248", "3840x1648" ],
"9:21": [ "624x1456", "1248x2912", "1648x3840" ],
"1:3": [ "688x2048", "1280x3840" ],
"3:1": [ "2048x688", "3840x1280" ],
"2:1": [ "1536x768", "3072x1536", "3840x1920" ],
"1:2": [ "768x1536", "1536x3072", "1920x3840" ]
},
_composeGptAspect(model, body) {
if (!model?.aspectMerge || !body) return;
const ratio = body.aspectRatio;
if (ratio == null || ratio === "") {
delete body.aspectRatio;
return;
}
if (String(ratio).toLowerCase() === "auto") {
/* IMPL-120 复核（速创 doc/78/79/80 实证）：官方 aspectRatio 枚举 15 比例，无 auto 值，
   且官方参数表无独立 size 字段（1K/2K/4K 由 aspectRatio 的 WxH 值表达）——
   选自动＝缺省：aspectRatio/size 均不下发（避免越界字段），走服务端默认比例；
   表单 UI 档位不受影响（body 为发送专用副本）；仅老 gpt-image-2（doc/53）官方原生 auto */
delete body.aspectRatio;
delete body.size;
return;
}
const sizes = this._GPT_RATIO_SIZE[ratio];
if (!sizes) {
console.warn("[aspectMerge] 非法比例已回退服务端默认:", ratio);
delete body.aspectRatio;
return;
}
const idx = {
"1K": 0,
"2K": 1,
"4K": 2
}[body.size] ?? 0;
body.aspectRatio = sizes[Math.max(0, Math.min(idx, sizes.length - 1))];
delete body.size;
},
_decomposeGptAspect(model, body) {
const out = {};
if (!model?.aspectMerge || !body) return out;
const wxh = body.aspectRatio;
if (typeof wxh === "string" && /^\d+x\d+$/.test(wxh)) {
for (const [ratio, sizes] of Object.entries(this._GPT_RATIO_SIZE)) {
const i = sizes.indexOf(wxh);
if (i >= 0) {
out.aspectRatio = ratio;
out.size = [ "1K", "2K", "4K" ][i] || "1K";
break;
}
}
if (!out.aspectRatio) out.aspectRatio = model.params.find(p => p.key === "aspectRatio")?.default || "1:1";
} else if (typeof wxh === "string" && wxh) {
out.aspectRatio = wxh;
} else {
/* IMPL-120：auto 场景发送 body 已剥离 aspectRatio/size（官方无 auto 枚举）——
   此处还原"自动"意图，供 _regen 表单回填（options 含 auto，select 校验可过） */
out.aspectRatio = "auto";
}
return out;
},
_pruneEmptyRefs(model, body) {
if (!model || !body || !Array.isArray(model.params)) return;
for (const p of model.params) {
/* IMPL-119：空收集器返回 null——原只删 ""，空参考以 urls:null 下发上游 */
if ((p.type === "ref-image" || p.type === "ref-video" || p.type === "ref-audio") && (body[p.key] == null || body[p.key] === "")) delete body[p.key];
}
},
async _collectRefImageAsync(key) {
const refs = this._getRefs(key);
if (refs.length === 0) return null;
const pending = refs.filter(r => r.kind === "local" && !r.uploaded && !r.uploadError);
if (pending.length > 0) {
Toast.info("等待参考图上传完成...");
let waited = 0;
while (pending.some(r => !r.uploaded && !r.uploadError) && waited < 6e4) {
await new Promise(r => setTimeout(r, 1e3));
waited += 1e3;
}
}
const failed = refs.filter(r => r.kind === "local" && r.uploadError);
if (failed.length > 0) throw new Error("参考图上传失败，请删除失败的参考图或重新上传");
/* ★★ R95-A：60s 等完后仍有「既没成功也没失败」（还在传）的 —— 旧代码被下游 URL 过滤静默滤掉。
   这里显式报错，杜绝"没带参考图就生成（烧钱）"，口径与同步版 _collectRefImage 一致。 */
const _stillR95 = refs.filter(r => r.kind === "local" && !r.uploaded && !r.uploadError);
if (_stillR95.length > 0) throw new Error("参考图上传超时未完成（" + _stillR95.length + " 张）——已阻止提交，请等上传完成或移除该项后重试");
const urls = refs.map(r => r.kind === "url" ? r.src : r.remote).filter(u => u && /^https?:\/\//.test(u));
const param = this.state.model.params.find(p => p.key === key);
if (!param) return null;
if (param.output === "single") return urls[0] || "";
if (param.output === "csv") return urls.join(",");
if (param.output === "array") return urls;
return urls[0] || "";
},
async _collectRefVideoAsync(key) {
const refs = this._getRefs(key);
if (refs.length === 0) return null;
const pending = refs.filter(r => r.kind === "local-video" && !r.uploaded && !r.uploadError);
if (pending.length > 0) {
Toast.info("等待参考视频上传完成...");
let waited = 0;
while (pending.some(r => !r.uploaded && !r.uploadError) && waited < 12e4) {
await new Promise(r => setTimeout(r, 1e3));
waited += 1e3;
}
}
const failed = refs.filter(r => r.kind === "local-video" && r.uploadError);
if (failed.length > 0) throw new Error("参考视频上传失败，请删除或重新上传");
const _stillR95v = refs.filter(r => r.kind === "local-video" && !r.uploaded && !r.uploadError);
if (_stillR95v.length > 0) throw new Error("参考视频上传超时未完成（" + _stillR95v.length + " 个）——已阻止提交，请等上传完成或移除该项后重试");
const urls = refs.map(r => r.remote).filter(u => u && /^https?:\/\//.test(u));
const param = this.state.model.params.find(p => p.key === key);
if (!param) return null;
if (param.output === "single") return urls[0] || "";
if (param.output === "csv") return urls.join(",");
return urls[0] || "";
},
async _collectRefAudioAsync(key) {
const refs = this._getRefs(key);
if (refs.length === 0) return null;
const pending = refs.filter(r => r.kind === "local-audio" && !r.uploaded && !r.uploadError);
if (pending.length > 0) {
Toast.info("等待参考音频上传完成...");
let waited = 0;
while (pending.some(r => !r.uploaded && !r.uploadError) && waited < 12e4) {
await new Promise(r => setTimeout(r, 1e3));
waited += 1e3;
}
}
const failed = refs.filter(r => r.kind === "local-audio" && r.uploadError);
if (failed.length > 0) throw new Error("参考音频上传失败，请删除或重新上传");
const _stillR95a = refs.filter(r => r.kind === "local-audio" && !r.uploaded && !r.uploadError);
if (_stillR95a.length > 0) throw new Error("参考音频上传超时未完成（" + _stillR95a.length + " 个）——已阻止提交，请等上传完成或移除该项后重试");
const urls = refs.map(r => r.remote).filter(u => u && /^https?:\/\//.test(u));
const param = this.state.model.params.find(p => p.key === key);
if (!param) return null;
if (param.output === "single") return urls[0] || "";
if (param.output === "csv") return urls.join(",");
return urls[0] || "";
},
_getBatchCount() {
const el = document.querySelector('[data-key="__count"]');
const n = parseInt(el && el.value, 10);
return Number.isFinite(n) ? Math.max(1, Math.min(4, n)) : 1;
},
async handleGenerate() {
if (this.state.model?.seg) return this._handleSegGenerate();
const key = Store.getApiKey();
if (!key && !this.state.model?.direct) {
if (!KeyVault.unlocked) {
Toast.error("密码簿已锁定：请在 设置 → 保险箱 解锁");
} else {
Toast.error("未找到可用密钥：请检查密钥保险箱");
}
this._openSettings();
return;
}
if (!this._checkBudget()) return;
if (this._generating) {
Toast.warning("正在生成中，请稍候");
return;
}
this._generating = true;
const btn = $("#generateBtn");
btn.disabled = true;
$("#generateBtnText").textContent = "生成中...";
try {
const body = await this._collectParamsAsync();
const v = normalizeAndValidateApiBody(this.state.model, body);
if (!v.ok) {
Toast.error(v.error);
return;
}
const prompt = body.prompt || body.text || "";
if (prompt) Store.addPrompt(prompt);
const count = this._getBatchCount();
/* ★★ R95-1-2（报告 02 FE-P0-1）：循环前快照 genModel —— 生成中换模型不再影响本轮批次（端点/body/计费/卡片四者一致） */
const genModel = this.state.model;
for (let i = 0; i < count; i++) {
const task = {
id: genId(),
model: genModel,
body: v.body,
prompt: prompt,
status: "processing",
createdAt: Date.now(),
apiId: null,
batchIndex: count > 1 ? i + 1 : undefined,
batchTotal: count > 1 ? count : undefined
};
if (genModel.async) {
const useTaskCenter = TaskCenter.isAvailable();
/* IMPL-124①：占位卡前置——原实现卡片在 submit 网络往返返回后才创建（TC 提交超时 15s+失败再 fallback 直连=最坏 20s+ 空窗），点击后页面零动静「像卡住了」；现改为点击瞬间先插 processing 占位卡（spinner+计时），提交成功原位回填 apiId 并入轮询，双路皆败原位转 failed 可见 */
const _t0 = Store.getTasks();
_t0.unshift(task);
Store.saveTasks(_t0);
this._renderTask(task);
this._renderActiveTasks();
let _ok = false, _err = null;
try {
const res = useTaskCenter ? await TaskCenter.submit(task) : await Api.submit(genModel, v.body);
task.apiId = res.id;
task.dispatchedVia = useTaskCenter ? "taskcenter" : "direct";
_ok = true;
if (i === 0) Toast.success(useTaskCenter ? `已提交${count > 1 ? ` ${count} 个` : ""}任务到任务中心` : "任务已提交");
} catch (e) {
_err = e;
if (useTaskCenter) {
console.warn("[TaskCenter] submit failed, falling back to direct:", e);
try {
const res = await Api.submit(genModel, v.body);
task.apiId = res.id;
task.dispatchedVia = "direct";
_ok = true;
if (i === 0) Toast.success("任务中心不可用，已切换为本地直连");
} catch (e2) { _err = e2; }
}
}
if (_ok) {
const tasks = Store.getTasks();
const _at = tasks.findIndex(t => t.id === task.id);
if (_at >= 0) tasks[_at] = task; else tasks.unshift(task);
Store.saveTasks(tasks);
this._renderTask(task);
this._renderActiveTasks();
if (!useTaskCenter || task.dispatchedVia === "direct") poller.start(task); else { /* ★ R77-C：任务中心已启用但监视循环没在跑 ⇒ 结果永远回不来（enabled 与 pollTimer 可能被瞬时故障拆散） */ try { if (!TaskCenter.pollTimer) TaskCenter.startPolling(); } catch (_e) {} }
} else {
task.status = "failed";
task.error = (_err && _err.message) || "提交失败";
const tasks = Store.getTasks();
const _at = tasks.findIndex(t => t.id === task.id);
if (_at >= 0) tasks[_at] = task;
Store.saveTasks(tasks);
this._renderTask(task);
this._renderActiveTasks();
throw (_err || new Error("提交失败"));
}
} else {
$("#generateBtnText").textContent = count > 1 ? `生成中 ${i + 1}/${count}...` : "生成中...";
/* ★ R67（2026-10-06 P0）+ R68 热修：宿主生成按钮的 APIYI 早分流。
   ⚠ 必须在同步分叉**之前**拦下 —— 否则 APIYI 档（endpoint 为 OpenAI 形态的 /v1/images/generations、
   channel:"apiyi"、无 direct 字段）会走 Api.syncCall ⇒ CONFIG.API_BASE（速创域名）拼接 ⇒
   nginx 对 OPTIONS 返 404 且无 CORS 头 ⇒ 浏览器预抛 Failed to fetch ⇒ 「网络请求失败，可能是跨域」。
   ★★ R68：所有跨块函数一律经 window.__w5Host（三个内联 script 块作用域互相独立，
   裸调 = ReferenceError —— 这是 R44 的同一教训）。 */
const _apiDef67 = (genModel && genModel.channel === "apiyi")
  ? ((window.__w5Host && window.__w5Host.apiModelById) ? window.__w5Host.apiModelById(genModel.id) : null) : null;
let data;
if (_apiDef67) {
  const _H67 = window.__w5Host || {};
  /* ★ R68 运行时兜底：桥未就绪则明确报错并**回退原路径**（不再裸调 ⇒ 不再 ReferenceError） */
  if (typeof _H67.apiyiImages !== "function" || typeof _H67.apiyiEdits !== "function"
      || typeof _H67.blobUrlToDataURL !== "function" || typeof _H67.apiyiGemini !== "function") {
    console.error("[W5-route]", JSON.stringify({ phase: "apiyi-bridge-missing", keys: Object.keys(_H67), ts: Date.now() }));
    Toast.error("APIYI 通道未就绪（宿主桥缺失）—— 请强制刷新页面（Ctrl+Shift+R）后重试");
    return;
  }
  /* 兜底与速创口径对齐：保险箱优先 → localStorage/BUILTIN（快照实测 keys.R2_WORKER_URL 常不为空） */
  const _wA67 = (typeof KeyVault !== "undefined" && KeyVault.keys && KeyVault.keys().R2_WORKER_URL)
    || (Store.getR2WorkerUrl && Store.getR2WorkerUrl()) || "";
  if (!_wA67) {
    Toast.warning((genModel.name || "APIYI") + "：通道未配置 —— 请在 设置 → 编辑密钥 填入 R2 Worker 地址与 Token");
    return;
  }
  /* ★ R76-E1（2026-10-07）：与速创同款「点击即有卡」。
     此前 APIYI 档全是 async:false ⇒ 不进 async 的占位卡分支，只把按钮文字改成「生成中...」，
     结果区零反馈（修原话：APIYI 居然没有生成中卡片等动画）。
     这里复用同一套卡片（.sv-progress-row + .task-spinner）：先插 processing 卡，再起 1s tick
     单独刷新「已用 X」（只改文本节点，不重渲染 DOM ⇒ 不闪）。
     ⚠ 插在**两道前置检查之后** —— 桥缺失/未配 Worker 时直接 return，不产生残留卡。 */
  task._r76Api = true;
  {
    const _t0 = Store.getTasks();
    _t0.unshift(task);
    Store.saveTasks(_t0);
    this._renderTask(task);
    this._renderActiveTasks();
  }
  this._r76Ticks = this._r76Ticks || {};
  if (this._r76Ticks[task.id]) clearInterval(this._r76Ticks[task.id]);
  this._r76Ticks[task.id] = setInterval(() => {
    try {
      const _el = document.querySelector('[data-tid="' + task.id + '"] .tm-elapsed');
      if (_el) _el.textContent = "已用 " + fmtDur(Date.now() - task.createdAt);
    } catch (_e) {}
  }, 1000);
  /* ── 参数装配：与 bitmapHandler 的 exA 同形（apiyiImages/apiyiEdits/apiyiGemini 的 ex 契约） ── */
  const _ex67 = {};
  if (v.body.quality) _ex67.quality = String(v.body.quality);
  if (v.body.aspectRatio) _ex67.aspectRatio = String(v.body.aspectRatio);
  if (v.body.resolution) _ex67.resolution = String(v.body.resolution);
  if (v.body.background) _ex67.background = String(v.body.background);
  /* 参考图：body.urls 是 "url1,url2"（output:"csv"）—— 下载成 dataURL 交上游（官转 edits 只吃 binary） */
  const _uAll67 = String(v.body.urls || "").split(",").map(function (x) { return x.trim(); }).filter(function (x) { return /^https?:\/\//.test(x); });
  if (_uAll67.length) {
    const _ds = [];
    for (const _u of _uAll67.slice(1, 4)) {   /* R82：第 1 张已作源图 image.png 发过，参考图从第 2 张起（原 slice(0,3) 会让图 1 重复发送） */ try { _ds.push(await _H67.blobUrlToDataURL(_u)); } catch (e) { console.info("[W5-route]", JSON.stringify({ phase: "apiyi-ref-fail", url: String(_u).slice(0, 80), ts: Date.now() })); } }
    if (_ds.length) { _ex67.refDataUrls = _ds; if (_uAll67.length > 4) console.info("[W5-route]", JSON.stringify({ phase: "ref-cap", got: _uAll67.length, send: 3, ts: Date.now() })); }
  }
  /* 源图 / 遮罩：body.urls 首张即源图（csv 序 = 用户添加序），body.mask 为单图 URL（output:"single"） */
  const _maskUrl67 = String(v.body.mask || "").trim();
  let _img67 = null, _mask67 = null;
  try { if (_uAll67[0]) _img67 = await _H67.blobUrlToDataURL(_uAll67[0]); } catch (e) {}
  try { if (_maskUrl67 && /^https?:\/\//.test(_maskUrl67)) _mask67 = await _H67.blobUrlToDataURL(_maskUrl67); } catch (e) {}
  let _prompt67 = String(v.body.prompt || v.body.text || "");
  /* R82：参考图存在时补一句事实声明（与编辑器侧同口径）。
     有蒙版 ⇒ 说清「只改第 1 张蒙版区域」；无蒙版 ⇒ 不能说蒙版（会指向不存在的区域）。 */
  if (_ex67.refDataUrls && _ex67.refDataUrls.length) _prompt67 = (_prompt67 ? _prompt67 + "；" : "") + (_mask67 ? "第 1 张为待修改的原图，其余为参考图，只修改第 1 张上蒙版圈出的区域" : "第 1 张为主图，其余为参考图，请综合参考其内容与风格");
  const _isVideo67 = String(_apiDef67.type || "") === "video";
  console.info("[W5-route]", JSON.stringify({ phase: "apiyi-host", model: _apiDef67.modelId, type: _apiDef67.type || "image", hasImg: !!_img67, hasMask: !!_mask67, refs: (_ex67.refDataUrls || []).length, ts: Date.now() }));
  /* 四路分流：与 bitmapHandler 的 apiDef 段**同口径**（video / gemini 原生 / edits(mask) / generations） */
  if (_isVideo67 && typeof _H67.apiyiVideo === "function" && typeof _H67.w5vShape === "function") {
    /* ★ 视频走 _w5vShape 桥 —— 与编辑器视频适配器同一入口，参考素材按 refGroups 键装配。
       Seedance/Wan/VEO 三家的 body 形状、端点、轮询全在 apiyiVideo 内（本处零重复定义）。 */
    const _rg67 = { byKey: {} };
    const _byKey67 = _rg67.byKey;
    ["first_frame", "last_frame", "images", "videos", "audios"].forEach(function (k) {
      const raw = v.body[k];
      if (raw == null || raw === "") return;
      _byKey67[k] = String(raw).split(",").map(function (x) { return x.trim(); }).filter(function (x) { return /^https?:\/\//.test(x); });
    });
    const _F67 = _H67.w5vShape({ model: _apiDef67, modelId: _apiDef67.id, prompt: _prompt67, refs: _rg67, extra: v.body });
    _F67.ex.__opts = {
      firstFrameUrl: _F67.buckets.firstFrameUrl,
      lastFrameUrl: _F67.buckets.lastFrameUrl,
      imageUrls: _F67.buckets.imageUrls,
      videoUrls: _F67.buckets.videoUrls,
      audioUrls: _F67.buckets.audioUrls,
      taskType: "",
      byKey: _F67.byKeyLocal,
    };
    data = await _H67.apiyiVideo(_prompt67, _apiDef67, _F67.ex, _img67, _ex67.refDataUrls || []);
  } else if (_apiDef67.gemini) {
    data = await _H67.apiyiGemini(_prompt67, _apiDef67, _ex67, _img67, _ex67.refDataUrls || []);
  } else if (_img67) {
    data = await _H67.apiyiEdits(_img67, _mask67, _prompt67, _apiDef67, _ex67);
  } else {
    data = await _H67.apiyiImages(null, _prompt67, _apiDef67, _ex67);
  }
  /* apiyi* 返回 {assetUrl, candidates, usage}（视频在 apiyiVideo 内部已轮询到终稿）
     ⇒ 归一到下游能吃的形态（下游读 Api.extractUrl(data) + usageOfResult(data)）。 */
  if (data && !data.data && (data.assetUrl || (data.candidates && data.candidates.length))) {
    data = { data: [{ url: data.assetUrl || data.candidates[0] }], usage: data.usage || null, _apiyiDirect: true };
  }
  /* ★ R76-E2：APIYI 请求已返回 ⇒ 停 tick、把占位卡从活动列表摘掉（紧接着的结果会并入 history） */
  try {
    if (this._r76Ticks && this._r76Ticks[task.id]) { clearInterval(this._r76Ticks[task.id]); delete this._r76Ticks[task.id]; }
    const _ts2 = Store.getTasks().filter(t => t.id !== task.id);
    Store.saveTasks(_ts2);
    this._renderActiveTasks();
  } catch (_e) {}
} else {
  data = genModel.direct ? await Api.directRun(genModel, v.body) : await Api.syncCall(genModel, v.body);
}
const url = Api.extractUrl(data);
task.status = "succeeded";
task.result = {
url: url,
data: data
};
task.completedAt = Date.now();
const cost = calcEstimate(genModel, Object.assign({}, v.body, usageOfResult(data) || {})); /* ★ R22-d：并上真实 usage */
task.cost = cost?.amount;
Store.addHistory({
id: task.id,
model: task.model,
prompt: prompt,
body: v.body,
status: "succeeded",
result: task.result,
createdAt: task.createdAt,
completedAt: task.completedAt,
cost: task.cost
});
this._renderTask(task);
/* IMPL-102：直连/同步路径补转存——与 onTaskResult(poller) 同链（_preloadResult 内部门控 sync+凭据后 _archiveResult），
   对冲直连 URL 有效期（SF ~1h / 百炼 ~24h）过期导致的历史空图；已转存跳过判断见 _archiveResult */
this._preloadResult(task).catch(() => {});
this._renderResultStrip();
if (i === count - 1) {
Toast.success(count > 1 ? `已生成 ${count} 张` : "生成完成");
this.playSuccessSound();
this._celebrate(task);
}
}
}
} catch (e) {
/* ★ R77-A：把在途的 APIYI 任务落成 failed 并写清原因。
   此前 catch 只 Toast、不写任务状态，紧接着 R76-E3 的 finally 又把 processing 卡摘掉
   ⇒ 生成失败 = 「什么都没发生」。现在失败会**留在结果区**，原因就在卡片上。
   注：此处不引用循环内声明的 task（作用域外），直接按 Store 里在途的 _r76Api 任务处理。 */
try {
const _r77ft = Store.getTasks();
const _r77failed = [];
_r77ft.forEach(function (t) {
if (t && t._r76Api && t.status === "processing") {
t.status = "failed";
t.error = _errText(e);
t.completedAt = Date.now();
_r77failed.push(t);
}
});
if (_r77failed.length) {
Store.saveTasks(_r77ft);
/* ★ 注意容器分工（实测踩过）：全卡（含 .sv-error 失败块）由 _renderTask → _renderSingleView
   渲染进 #resultList；_renderResultStrip 只画底部**缩略条**。只调后者 ⇒ 失败看不见。 */
this._renderTask(_r77failed[_r77failed.length - 1]);
this._renderActiveTasks();
this._renderResultStrip();
}
} catch (_e77) {}
if (e && e.code === "StageFailed" && location.protocol === "file:") {
const hint = document.getElementById("fileModeHint");
if (hint) {
try {
try { localStorage.removeItem("wb_filemode_hint_dismissed"); } catch (_) {} try { sessionStorage.removeItem("wb_filemode_hint_dismissed"); } catch (_) {}
} catch (_) {}
hint.hidden = false;
}
Toast.error(e.message, 9e3, {
label: "查看指引",
fn: () => {
const h = document.getElementById("fileModeHint");
if (h) h.hidden = false;
}
});
} else {
Toast.error(e.message);
}
console.error(e);
} finally {
/* ★ R76-E3：兜底清理 —— 无论正常、抛错还是提前 return，都不留 1s tick、也不留转圈的占位卡 */
try {
const _tk = this._r76Ticks || {};
Object.keys(_tk).forEach(k => { try { clearInterval(_tk[k]); } catch (_e) {} delete _tk[k]; });
const _all = Store.getTasks();
const _keep = _all.filter(t => !(t._r76Api && t.status === "processing"));
if (_keep.length !== _all.length) { Store.saveTasks(_keep); this._renderActiveTasks(); }
} catch (_e) {}
btn.disabled = false;
this._generating = false;
this._refreshGenerateBtn();
}
},
async _handleSegGenerate() {
const model = this.state.model;
if (!Store.hasSegCred()) {
Toast.error("未配置阿里云 AK/SK —— 请在 设置 → 保险箱 解锁后补齐");
this._openSettings();
setTimeout(() => $("#vaultPwInput")?.focus(), 350);
return;
}
if (this._generating) {
Toast.warning("正在生成中，请稍候");
return;
}
this._generating = true;
const btn = $("#generateBtn");
btn.disabled = true;
$("#generateBtnText").textContent = "生成中...";
let task = null;
try {
const body = await this._collectParamsAsync();
let imgUrl = String(body.image || "").trim();
if (!imgUrl) {
const r0 = (this._getRefs("image") || []).find(r => /^(data:|blob:)/.test(r.src || ""));
if (r0) imgUrl = r0.src;
}
if (!imgUrl) {
Toast.warning("请先添加原图（本地上传自动传 R2，或直接填 URL）");
return;
}
const capId = body.segAction || "SegmentCommonImage";
const cap = SegStudio.CAPS.find(c => c.id === capId);
if (!cap) {
Toast.error("未知的分割能力");
return;
}
const size = await SegStudio.probeSize(imgUrl);
const action = SegStudio.pickAction(capId, size);
if (!action) {
Toast.error("未知的分割能力");
return;
}
const params = {
ImageURL: imgUrl
};
if (action === "ChangeSky") {
const sky = String(body.skyImage || "").trim();
if (!sky) {
Toast.warning("天空替换需要添加天空背景图");
return;
}
params.ReplaceImageURL = sky;
}
if (action === "RefineMask") {
const m = String(body.maskImage || "").trim();
if (!m) {
Toast.warning("Mask 精细需要添加粗 mask 图");
return;
}
params.MaskImageURL = m;
}
task = {
id: genId(),
model: model,
body: {
segAction: capId,
image: imgUrl
},
prompt: "",
status: "processing",
createdAt: Date.now(),
apiId: null,
segAction: action
};
const tasks = Store.getTasks();
tasks.unshift(task);
Store.saveTasks(tasks);
this._renderTask(task);
this._renderActiveTasks();
AmbientFX.setGenerating(true);
this.updateTaskCardPhase(task.id, "图片预处理");
const ref0 = (this._getRefs("image") || [])[0];
const stageSrc = ref0 && /^(data:|blob:)/.test(ref0.src) ? ref0.src : imgUrl;
const stagedImg = await SegStudio.stageImage(stageSrc, ref0 && ref0.fallback, { hd: /^SegmentHD/.test(action) });
delete params.ImageURL;
params[action === "SegmentHDCommonImage" ? "ImageUrl" : action === "SegmentSkin" ? "URL" : "ImageURL"] = stagedImg;
if (params.ReplaceImageURL) params.ReplaceImageURL = await SegStudio.stageImage(params.ReplaceImageURL, null, {});
if (params.MaskImageURL) params.MaskImageURL = await SegStudio.stageImage(params.MaskImageURL, null, { png: true });
this.updateTaskCardPhase(task.id, action !== capId ? "高清处理中" : "抠图中");
const __imgParam = params.ImageUrl || params.ImageURL || "";
if (!/^https?:\/\//i.test(__imgParam)) {
throw Object.assign(new Error(`图片预处理结果异常（${String(__imgParam || "空").slice(0, 40)}），已拦截本次请求`), {
code: "StageInvalid"
});
}
const res = await SegStudio._call(action, params);
if (!res.ok) throw Object.assign(new Error(_errText(res.message) || "调用失败"), {
code: res.code
});
let resultData;
if (ASYNC_SET.has(action)) {
const jobId = res.data?.Data?.JobId || res.data?.JobId || res.data?.Data?.Body?.JobId || res.data?.jobId || res.data?.Data?.jobId || SegStudio._findJobId(res.data);
if (!jobId) {
const direct = SegStudio.resultUrlOf(res.data);
if (direct) {
resultData = res.data;
} else {
throw Object.assign(new Error("任务已受理但未返回任务ID（JobId），已停止轮询——服务端响应: " + JSON.stringify(res.data || null).slice(0, 160)), {
code: "NoJobId"
});
}
} else {
resultData = await SegStudio._pollJob(jobId, n => this.updateTaskCardPhase(task.id, `处理中（${n}/${SegStudio._pollMax}）`));
}
} else {
resultData = res.data;
}
const outUrl = SegStudio.resultUrlOf(resultData);
if (!outUrl) throw new Error("任务成功但未解析到结果图片 URL");
this.onTaskResult(task.id, {
status: "succeeded",
data: {
Data: {
ImageURL: outUrl
}
}
});
} catch (e) {
const zh = SegStudio.ERR_ZH[e.code] || (e.message === "SEG_POLL_TIMEOUT" ? "轮询超时：任务未完成，可稍后重试" : e.message || "抠图失败");
const diag = e.raw && !zh.includes(e.raw) ? `［${e.raw}］` : "";
Toast.error((zh + diag).slice(0, 150));
if (task) this.onTaskResult(task.id, {
status: "failed",
error: zh + diag
});
} finally {
this._generating = false;
btn.disabled = false;
this._refreshGenerateBtn();
AmbientFX.setGenerating(Store.getTasks().some(t => t.status === "processing"));
}
},
_refreshGenerateBtn() {
const el = $("#generateBtnText");
const pill = $("#genCostPill");
if (!el) return;
const hasActive = (Store.getTasks() || []).some(t => t.status === "processing");
if (hasActive) { el.textContent = "生成中..."; if (pill) pill.classList.remove("show"); return; }
/* ★ R26-C（修 2026-10-02）：金额改邻位费用胶囊；算不出 ⇒ 隐藏（不编数）。 */
el.textContent = "生成";
var est = null;
try { est = estCostCny(this.state.model, this._collectParamsSync()); } catch (e) {}
/* R60：perChar（语音合成）estCostCny 不覆盖 ⇒ 按 字符数×单价 就地补算（仅本胶囊） */
if (!est) { try { var _rb = this.state.model && this.state.model.billing; if (_rb && _rb.type === "perChar") { var _rt = String((this._collectParamsSync() || {})[_rb.charKey || "text"] || ""); if (_rt.length) est = { cny: _rt.length * _rb.unit, approx: false, detail: _rt.length + "字" }; } } catch (e) {} }
if (pill) {
if (est && est.cny > 0) {
pill.textContent = (est.approx ? "≈¥" : "¥") + (est.cny < 0.01 ? est.cny.toFixed(3) : est.cny < 1 ? est.cny.toFixed(2) : est.cny.toFixed(1));
pill.title = "预估费用" + (est.detail ? "（" + est.detail + "）" : "") + "，实际以用量为准";
pill.classList.add("show");
} else { pill.classList.remove("show"); }
}
},
_buildCurrentTask() {
try {
if (!this.state.model) return null;
const body = this._collectParamsSync();
const prompt = body.prompt || body.text || "";
return {
model: this.state.model,
body: body,
prompt: prompt
};
} catch {
return null;
}
},
/* ★ R91-A：会话内显示地址 —— 每个结果固定一个 blob:，转存完成不再换远端地址。
   为什么：applyArchived 原先把显示中的图换成远端 R2 地址 ⇒ 必须重新下载原图（1~4MB）
   ⇒ 用户看到「结果消失 → 再一点点刷出来」。blob 转存时本就在手 ⇒ 零额外网络。
   ⚠ 写成这个对象的一个**方法**（而不是在对象字面量里声明 function —— 那样是语法错误）。
   共享表挂 window.__r91Sess：渲染路径有好几条，别去猜哪个函数是不是方法。 */
/* ★ R92-A：拿到「带 params 的完整模型」。
   为什么需要：任务/历史记录里的 `model` 可能只是个瘦描述符（只有 id/name/type），
   而 `Workflow.build` 与 `normalizeAndValidateApiBody` 都直接 `for (const p of model.params)`
   ⇒ 抛 `model.params is not iterable` ⇒ 「复制工作流点了没反应」「重新生成报错」。
   顺序：本就有 params → 用它；否则按 id 回 MODELS（image/video/audio）与 SKILL_MODEL_PRESETS 找；
   再找不到 ⇒ 补 params: []（**宁可少导出一段设置，也不能抛异常把整个动作打断**）。 */
_fullModel(m) {
try {
if (!m || typeof m !== "object") return m;
if (Array.isArray(m.params)) return m;
const id = m.id;
if (id) {
const pools = [];
try { if (typeof MODELS !== "undefined" && MODELS) pools.push(MODELS.image || [], MODELS.video || [], MODELS.audio || []); } catch (_e) {}
try { if (typeof SKILL_MODEL_PRESETS !== "undefined" && Array.isArray(SKILL_MODEL_PRESETS)) pools.push(SKILL_MODEL_PRESETS); } catch (_e) {}
for (const pool of pools) {
const hit = (pool || []).find(x => x && x.id === id);
if (hit && Array.isArray(hit.params)) return Object.assign({}, hit, { name: m.name || hit.name, type: m.type || hit.type });
}
}
return Object.assign({}, m, { params: [] });
} catch (e) { return m; }
},
/* ★ R92-C：可读的本地文件名 —— 时间_模型_比例_清晰度_任务短id（Windows 合法，模块侧还会再消毒一次）。
   同一个任务重复写 ⇒ 同名 ⇒ 覆盖 ⇒ **不会再出现"一张图两份文件"**。 */
_r92LocalName(task, ext) {
try {
const d = new Date(task.completedAt || task.createdAt || Date.now());
const p2 = n => String(n).padStart(2, "0");
const ts = String(d.getFullYear()) + p2(d.getMonth() + 1) + p2(d.getDate()) + "-" + p2(d.getHours()) + p2(d.getMinutes());
const raw = String((task.model && (task.model.shortName || task.model.name || task.model.id)) || "model");
const name = (raw.replace(/[^0-9a-zA-Z\u4e00-\u9fa5._-]+/g, "").replace(/^\.+/, "").slice(0, 40)) || "model";
const body = task.body || {};
const ratio = String(body.aspectRatio || body.ratio || "").replace(/[:/]/g, "x").replace(/[^0-9a-zA-Z]/g, "");
const res = String(body.size || body.resolution || "").replace(/[^0-9a-zA-Z]/g, "");
const short = String(task.id || "").replace(/[^a-zA-Z0-9]/g, "").slice(-6);
const parts = [ ts, name ];
if (ratio && ratio.toLowerCase() !== "auto") parts.push(ratio);
if (res && res.toLowerCase() !== "auto") parts.push(res);
if (short) parts.push(short);
return parts.join("_") + "." + (ext || "png");
} catch (e) { return ""; }
},
_r91SessionUrl(id, blob) {
try {
if (!id || !blob) return "";
if (!window.__r91Sess) window.__r91Sess = new Map();
const ex = window.__r91Sess.get(id);
if (ex) return ex;
const u = URL.createObjectURL(blob);
window.__r91Sess.set(id, u);
/* 上限 40 条，超了从最早的开始 revoke（否则长会话会一直占内存） */
if (window.__r91Sess.size > 40) {
const k = window.__r91Sess.keys().next().value;
try { URL.revokeObjectURL(window.__r91Sess.get(k)); } catch (_e) {}
window.__r91Sess.delete(k);
}
return u;
} catch (e) { return ""; }
},
async _preloadResult(task) {
const url = task.result?.url;
if (!url || this._preloadCache.has(url)) return;
/* ★ R86：视频**不做全量预载、也不在此处即时转存** ——
   ① _preloadCache 只服务「原图预览秒开」，对视频没意义；
   ② 全量 fetch 几十 MB 再上传 R2，会当场抢用户带宽。
   列表/历史只用缩略图，点开走浏览器原生加载 ⇒ 转存改由 __r86Archive 空闲串行调度。 */
if (task.model?.type === "video") { try { window.__r86Archive.schedule(task); } catch (_e86) {} return; }
try {
const res = await fetch(url);
if (!res.ok) throw new Error("HTTP " + res.status); /* IMPL-104：过期 URL 的 404 错误页不入缓存/不触发转存 */
const blob = await res.blob();
if (blob && /^text\/html/i.test(blob.type || "")) throw new Error("HTML 错误页而非媒体文件"); /* IMPL-104 */
this._preloadCache.set(url, {
blob: blob,
timestamp: Date.now()
});
/* ★ R91-A：图片一预载就把会话显示地址定下来 ⇒ 首次渲染之后显示地址**再也不变**。 */
try { if (task && task.id) this._r91SessionUrl(task.id, blob); } catch (_e91) {}
if (this._preloadCache.size > 12) {
const firstKey = this._preloadCache.keys().next().value;
this._preloadCache.delete(firstKey);
}
} catch (e) {}
if (Store.getSync() && (typeof TaskCenter !== "undefined" && TaskCenter.isAvailable() || (Store.getR2WorkerUrl() || "").trim() && (Store.getR2AuthToken() || "").trim())) {
this._archiveResult(task).catch(() => {});
}
},
/* ★ R9B-UX-P0-1（报告 04 · P0）：转存失败＝付费产物**可能永久丢失**，必须让用户**当场知道并抢救**。
   ⚠ 幂等：同一 task 只出声一次（失败路径有多条，会重复调用）。
   报告口径：不要只 console.warn —— 要把"永久丢失"与"瞬时故障"说清楚，并给可操作出口。 */
_r9bLocalOnly(task, why) {
  try {
    if (!task || task.localOnly) return;
    task.localOnly = true;
    task.localOnlyReason = String(why || "");
    try {
      const arr = Store.getTasks();
      const i = arr.findIndex(t => t.id === task.id);
      if (i >= 0) { arr[i].localOnly = true; arr[i].localOnlyReason = task.localOnlyReason; Store.saveTasks(arr); }
    } catch (_) {}
    try { this._renderTaskList(); } catch (_) {}
    try { Toast.warning("结果未能转存到云端：仅在本页有效，关闭/刷新后会丢失 —— 已为你触发一次下载", 9e3); } catch (_) {}
    try { if (task.result && task.result.url) this._downloadFile(task.result.url, (task.model && task.model.id ? task.model.id : "workbench") + "_" + task.id); } catch (_) {}
  } catch (_) {}
},
async _archiveResult(task) {
if (!Store.getSync()) return;
const url = task.result?.url;
if (!url) return;
let workerUrl = "", token = "";
if (typeof TaskCenter !== "undefined" && TaskCenter.isAvailable()) {
workerUrl = TaskCenter.workerUrl;
token = TaskCenter.token;
} else {
workerUrl = (Store.getR2WorkerUrl() || "").trim().replace(/\/$/, "");
token = (Store.getR2AuthToken() || "").trim();
}
if (!workerUrl || !token) return;
if (url.startsWith(workerUrl) || /\.r2\.dev\//.test(url)) return;
if (/^data:/.test(url)) return; /* ★ R74：blob: 必须转存 —— 否则云同步拿到的是「别的设备打不开的本页地址」*/
/* ★ R92-D：在途去重 —— `_preloadResult` 与 `_archivePendingHistory` 可能对同一条各跑一次，
   两次都会 fetch + 上传（Worker 每次生成不同的对象名）⇒ **白传一遍 + 本地落两份文件**。
   30s TTL 是兜底释放（失败后仍可由下次 unlock/刷新重试）。 */
const _r92key = task.id || String(url);
try {
if (!window.__r92Arch) window.__r92Arch = {};
if (window.__r92Arch[_r92key]) return;
window.__r92Arch[_r92key] = 1;
setTimeout(function () { try { delete window.__r92Arch[_r92key]; } catch (e) {} }, 30000);
} catch (e) {}
const modelName = (task.model?.name || "unknown").replace(/[^a-zA-Z0-9_-]/g, "_");
const time = new Date(task.completedAt || task.createdAt || Date.now()).toISOString().slice(0, 19).replace(/[:T]/g, "-");
const ratio = task.body?.aspectRatio || task.body?.ratio || "auto";
const resolution = task.body?.size || task.body?.resolution || "";
const ext = (url.match(/\.(png|jpg|jpeg|webp|mp4|mp3|wav|webm)(\?|$)/i) || [ , "png" ])[1].toLowerCase();
const extMap = {
webm: "mp4",
mov: "mp4",
avi: "mp4",
m4a: "mp3",
ogg: "mp3",
flac: "mp3"
};
const finalExt = extMap[ext] || ext;
const fileName = `${modelName}_${time}_${ratio}${resolution ? "_" + resolution : ""}.${finalExt}`;
const applyArchived = newUrl => {
task.result.originalUrl = url;
task.result.url = newUrl;
const tasks = Store.getTasks();
const t = tasks.find(x => x.id === task.id);
if (t) {
t.result = task.result;
Store.saveTasks(tasks);
}
const hist = Store.getHistory();
const h = hist.find(x => x.id === task.id);
if (h) {
h.result = task.result;
Store.saveHistory(hist);
}
if (this._preloadCache && this._preloadCache.has(url)) {
const entry = this._preloadCache.get(url);
this._preloadCache.delete(url);
this._preloadCache.set(newUrl, entry);
}
/* ★ R91-A：显示中的图**不要**换成远端新地址 —— 换了就必须重新下载一次原图（1~4MB，
   pub-*.r2.dev 无 cache-control，国内尤其慢）⇒「结果消失 → 再一点点刷出来」。
   优先用会话 blob:（本地解码、零网络）。data-lightbox 仍指向真实地址（灯箱多图切换靠它索引）。 */
const _r91d = (window.__r91Sess && window.__r91Sess.get(task.id)) || newUrl;
document.querySelectorAll(`[data-lightbox="${url}"]`).forEach(el => {
el.dataset.lightbox = newUrl;
});
document.querySelectorAll(`img[src="${url}"]`).forEach(el => {
el.src = _r91d;
});
document.querySelectorAll(`video[src="${url}"]`).forEach(el => {
el.src = _r91d;
});
this._renderTaskList();
if ($("#historySidebar")?.classList.contains("show")) this.renderHistory();
this._scheduleHistorySync();
/* ★ R86：转存完成 ⇒ 通知调度器（结果条上的「转存中」要变回常态） */
try { window.__r86Archive.notify(); } catch (_e86) {}
};
try {
/* ★ R86-⑦：**先复用预载缓存** —— `_preloadResult` 刚为同一 URL 拉过一份 blob（图片路径必然如此），
   直接用可省掉第二次完整下载。实测：改前图片 URL 被 fetch 两次（预载一次 + 转存一次），
   对 1~4MB 的原图就是白下一遍。缓存没有（视频走的就是这条）才真正走网络。 */
let blob = null;
try {
const _pc = this._preloadCache && this._preloadCache.get(url);
if (_pc && _pc.blob && _pc.blob.size > 0) blob = _pc.blob;
} catch (_e86c) {}
if (!blob) {
const res = await fetch(url);
if (!res.ok) throw new Error("HTTP " + res.status); /* IMPL-104：404 错误页不得被上传 R2 并覆盖历史 url */
blob = await res.blob();
}
/* ★ R91-B：本地写入**已移到拿到 R2 地址之后**（见下方 if (data.url) 分支）。旧写法有两处独立缺陷：
   ① 文件名用的是这个 `fileName`，而它含比例串 —— "21:9" 里的冒号是 Windows 保留字符，
      `getFileHandle` 直接抛错、整个写入静默失败；
   ② 本地文件名（fileName）与 hydrate() 的查找名（URL 尾段）**不是同一套命名** ⇒ 即使写成功
      也永远命中不了（R2 对象名是 Worker 生成的 `1791385704-r2_xxxx.png`）。
   写入点后移 + 文件名统一取 nameOf(data.url)，两条一起解决。 */
if (blob && /^text\/html/i.test(blob.type || "")) throw new Error("HTML 错误页而非媒体文件"); /* IMPL-104 */
/* ★ R91-A：预载没跑（视频走的就是这条）或预载失败时，在这里补定一次会话显示地址。 */
try { this._r91SessionUrl(task.id, blob); } catch (_e91b) {}
/* ★ R74-2：blob: 的 URL 里没有扩展名 ⇒ 上面按 URL 推断一律得 png；MIME 以 blob.type 为准纠正回来 */
let _upName = fileName;
try {
const _mt = { "image/jpeg": "jpg", "image/jpg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/png": "png", "video/mp4": "mp4", "video/webm": "mp4", "audio/mpeg": "mp3", "audio/wav": "wav", "audio/x-wav": "wav" };
const _me = _mt[String((blob && blob.type) || "").toLowerCase()];
if (_me) _upName = String(fileName).replace(/\.[a-z0-9]+$/i, "." + _me);
} catch (_) {}
const formData = new FormData;
formData.append("file", blob, _upName);
const uploadUrl = workerUrl + "/upload?token=" + encodeURIComponent(token) + "&dir=results";
const uploadRes = await fetch(uploadUrl, {
method: "POST",
body: formData
});
const data = await uploadRes.json();
if (data.url) {
applyArchived(data.url);
/* ★ R91-B：落本地目录 —— 文件名 = nameOf(data.url)，与 hydrate() 的查找名**完全同源**。
   blob 已在手 ⇒ 零额外网络；失败不影响转存（本地只是热点缓存，R2 才是权威副本）。 */
try {
if (window.__r84Local) {
/* ★ R92-C：文件名 = 可读名（时间_模型_比例_清晰度_短id），别名 = URL 尾段（供 hydrate 查表）。
   可读名对同一任务稳定 ⇒ 重复写入是**覆盖**而不是新增第二份文件。 */
const _r92alias = window.__r84Local.nameOf(data.url);
const _r92ext = (String(data.url).match(/\.([a-z0-9]+)(?:\?|$)/i) || [ , "png" ])[1].toLowerCase();
const _r92ln = (this._r92LocalName && this._r92LocalName(task, _r92ext)) || _r92alias;
if (_r92ln) window.__r84Local.save(_r92ln, blob, _r92alias);
}
} catch (_e91b2) {}
console.log("[archive] 前端转存成功:", url, "→", data.url, "(", fileName, ")");
/* ★ R76-A2：顺手出缩略图 —— blob 已在手上（同源），_r76ThumbFromBlob 不经过 URL ⇒ 不受 CORS 约束。
   生成后把 thumbUrl 写回 tasks/history，列表/历史自此加载缩略图（~40 KB）而非原图（1~4 MB）。
   失败**不影响主流程**（缩略图是纯优化）。 */
try {
if (!task.result.thumbUrl) {
const _tb = await _r76ThumbFromBlob(blob, 640, .8);
if (_tb) {
const _tu = await ThumbService._uploadThumb(new File([ _tb ], "thumb.webp", { type: "image/webp" }));
if (_tu) {
task.result.thumbUrl = _tu;
const _ts = Store.getTasks();
const _t2 = _ts.find(x => x.id === task.id);
if (_t2) {
_t2.result = Object.assign({}, _t2.result, { thumbUrl: _tu });
Store.saveTasks(_ts);
}
const _hs = Store.getHistory();
const _h2 = _hs.find(x => x.id === task.id);
if (_h2) {
_h2.result = Object.assign({}, _h2.result, { thumbUrl: _tu });
Store.saveHistory(_hs);
}
console.log("[thumb] R76 缩略图已生成:", _tu);
}
}
}
} catch (_e) {
console.warn("[thumb] R76 缩略图生成失败（不影响结果）:", _e && _e.message);
}
return;
} else {
console.warn("[archive] 前端上传返回无 url:", data.error || "unknown");
}
} catch (e) {
console.warn("[archive] 前端转存失败，回退 Worker /archive:", e.message);
}
/* ★ R74-3：blob:/data: 无可回退 —— Worker 在远端，拿不到本页的 blob/data（这一跳必然失败） */
if (/^(blob:|data:)/.test(url)) { this._r9bLocalOnly(task, "blob/data 无法回退到 Worker 转存"); return; }
try {
const res = await fetch(workerUrl + "/archive?url=" + encodeURIComponent(url) + "&ext=" + finalExt + "&token=" + encodeURIComponent(token), {
method: "POST"
});
const data = await res.json();
if (data.ok && data.url) {
applyArchived(data.url);
console.log("[archive] Worker 转存成功:", url, "→", data.url);
} else {
console.warn("[archive] Worker 转存失败:", data.error || "unknown");
this._r9bLocalOnly(task, "Worker /archive 也失败：" + (data.error || "unknown"));
}
} catch (e2) { this._r9bLocalOnly(task, "Worker /archive 异常：" + ((e2 && e2.message) || e2)); }
},
onTaskResult(taskId, result) {
const tasks = Store.getTasks();
const task = tasks.find(t => t.id === taskId);
if (!task) return;
/* IMPL-104：终态幂等门控——manualRefresh 双击或与在途轮询竞态时同一结果双写历史双倍计费
   IMPL-158-d（v2）：①timeout 迟到派发一并拦截（v1 只挡 succeeded/failed，stop 后迟到 timeout 可改写已终态任务）；
   ②唯一例外：手动停止/失败后迟到 succeeded 一次性放行（用户已计费的成果可取回，替换式写入防同 id 双历史） */
const _terminalTask = task.status === "succeeded" || task.status === "failed" || task.status === "timeout" || task.status === "stopped";
if (_terminalTask) {
const _upgrade = (task.status === "failed" || task.status === "stopped") && result.status === "succeeded" && result.data;
if (!_upgrade) return;
}
if (result.status === "succeeded") {
task.status = "succeeded";
task.result = {
url: Api.extractUrl(result.data),
data: result.data
};
task.completedAt = Date.now();
const cost = calcEstimate(task.model, Object.assign({}, task.body, usageOfResult(result.data) || {})); /* ★ R22-d：并上真实 usage */
task.cost = cost?.amount;
/* IMPL-158-d：同 id 旧历史条目替换式写入（停止→迟到成功升级路径防双条目；常规路径无旧条目时为无害 no-op） */
const _histArr = Store.getHistory();
const _histIdx = _histArr.findIndex(h => h.id === task.id);
if (_histIdx >= 0) { _histArr.splice(_histIdx, 1); Store.saveHistory(_histArr); }
Store.addHistory({
id: task.id,
model: task.model,
prompt: task.prompt,
body: task.body,
status: "succeeded",
result: task.result,
createdAt: task.createdAt,
completedAt: task.completedAt,
cost: task.cost
});
this.playSuccessSound();
this.notifyTaskComplete(task);
Toast.success(`${task.model.name} 生成完成`);
this._celebrate(task);
this._preloadResult(task).catch(() => {});
this._scheduleHistorySync();
setTimeout(() => {
const card = document.querySelector(`[data-tid="${task.id}"]`);
if (card) card.scrollIntoView({
behavior: "smooth",
block: "nearest"
});
}, 100);
} else if (result.status === "failed") {
task.status = "failed";
task.error = result.error;
task.completedAt = Date.now();
Store.addHistory({
id: task.id,
model: task.model,
prompt: task.prompt,
body: task.body,
status: "failed",
error: result.error,
createdAt: task.createdAt,
completedAt: task.completedAt
});
Toast.error(`${task.model.name} 生成失败`);
} else if (result.status === "timeout") {
task.status = "timeout";
task.completedAt = Date.now();
Store.addHistory({
id: task.id,
model: task.model,
prompt: task.prompt,
body: task.body,
status: "timeout",
createdAt: task.createdAt,
completedAt: task.completedAt
});
Toast.warning(`${task.model.name} 生成超时`);
}
const remaining = tasks.filter(t => t.id !== taskId);
Store.saveTasks(remaining);
this._updateTaskCard(task);
this._renderActiveTasks();
this._renderResultStrip();
this.renderHistoryBadge();
this._updateTitle();
this._refreshGenerateBtn();
if (Store.getSync() && task.result?.url && !task.result.thumbUrl) {
ThumbService.ensureThumb(task).then(thumbUrl => {
if (thumbUrl && thumbUrl !== task.result.url) {
task.result.thumbUrl = thumbUrl;
const hist = Store.getHistory();
const h = hist.find(x => x.id === task.id);
if (h) {
h.result = h.result || {};
h.result.thumbUrl = thumbUrl;
Store.saveHistory(hist);
}
this._updateTaskCard(task);
this._renderResultStrip();
if (task.model?.type === "video") AmbientFX.illuminate(thumbUrl, "video");
if ($("#historySidebar")?.classList.contains("show")) this.renderHistory();
}
}).catch(() => {});
}
},
updateTaskCardPhase(taskId, phase) {
const atpCard = $(`#activeTasksPanel [data-tid="${taskId}"]`);
if (atpCard) {
const phaseEl = atpCard.querySelector(".atp-phase");
if (phaseEl) phaseEl.textContent = phase;
}
const card = $(`#resultList [data-tid="${taskId}"]`);
if (card) {
const phaseEl = card.querySelector(".tm-phase");
if (phaseEl) phaseEl.textContent = phase;
}
},
_startTaskCardTicker() {
if (this._taskCardTicker) clearInterval(this._taskCardTicker);
this._taskCardTicker = setInterval(() => {
const cards = $$("#resultList .sv-wrap.status-processing");
if (!cards.length) return;
const tmap = new Map(Store.getTasks().map(t => [ t.id, t ]));
cards.forEach(card => {
const tid = card.dataset.tid;
const task = tmap.get(tid);
if (!task) return;
const elapsed = task.createdAt ? fmtDur(Date.now() - task.createdAt) : "0:00";
const polls = poller.getPollCount(tid) || 0;
const phase = poller.getPhaseName(Date.now() - (poller.getStartTime(tid) || task.createdAt || Date.now()));
const elapsedEl = card.querySelector(".tm-elapsed");
const pollsEl = card.querySelector(".tm-polls");
const phaseEl = card.querySelector(".tm-phase");
if (elapsedEl) elapsedEl.textContent = "已用 " + elapsed;
if (pollsEl) pollsEl.textContent = _r77PollLabel(task);
if (phaseEl) phaseEl.textContent = phase;
});
}, 1e3);
},
_renderTask(task) {
this.state.singleTaskId = task.id;
const arr = this.state.singleList || [];
let idx = arr.findIndex(t => t.id === task.id);
if (idx < 0) {
this.state.singleList = [ task, ...arr.filter(t => t.id !== task.id) ];
idx = 0;
} else arr[idx] = task;
this.state.singleIdx = idx;
this._renderSingleView(task);
this._updateStripItem(task);
},
_renderTaskList() {
const list = $("#resultList");
list.classList.add("single-view");
let tasks = Store.getTasks();
const history = Store.getHistory();
const _tids = new Set(tasks.map(t => t.id));
const all = [ ...tasks, ...history.filter(h => !_tids.has(h.id)) ];
const hidden = this.state.hiddenTaskIds;
let filtered = all.filter(t => !hidden.has(t.id));
filtered = this.state.filter === "all" ? filtered : filtered.filter(t => t.model?.type === this.state.filter);
if (this.state.resultSearch) {
const q = this.state.resultSearch.toLowerCase();
filtered = filtered.filter(t => (t.prompt || "").toLowerCase().includes(q) || (t.model?.name || "").toLowerCase().includes(q) || (t.error || "").toLowerCase().includes(q));
}
const s = this.state.sortOrder;
if (s === "newest") filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); else if (s === "oldest") filtered.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)); else if (s === "cost-desc") filtered.sort((a, b) => (b.cost || 0) - (a.cost || 0)); else if (s === "cost-asc") filtered.sort((a, b) => (a.cost || 0) - (b.cost || 0)); else if (s === "model") filtered.sort((a, b) => (a.model?.name || "").localeCompare(b.model?.name || "") || (b.createdAt || 0) - (a.createdAt || 0));
this.state.singleList = filtered;
if (!filtered.length) {
const dock = $("#svDockLayer");
if (dock) { dock.innerHTML = ""; }/* IMPL-138③：compare-bar 移除——空态 dock 直接清空 */
const navLayer = $("#svNavLayer");
if (navLayer) navLayer.innerHTML = "";
const capLayer0 = $("#svCapLayer");
if (capLayer0) capLayer0.innerHTML = "";
/* ★ R97-3-2：区分两种空 —— ① 真·无数据（tasks+history 皆空）⇒ 首次引导；② 仅被筛选/隐藏滤空 ⇒ 提示改筛选。 */
const _noData97 = (Store.getTasks().length + Store.getHistory().length) === 0;
list.innerHTML = _noData97
? '<div class="empty-state" data-type="image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.5-4.5L7 20"/></svg><div style="font-size:14px;color:var(--text);font-weight:500;margin-bottom:6px">还没有结果</div><div class="empty-sub">在左侧选模型、写提示词，点「生成」</div><div class="empty-sub" style="margin-top:8px">想改现有图？用上方「图像编辑器」上传后框选编辑</div></div>'
: '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><div style="font-size:14px;color:var(--text);font-weight:500;margin-bottom:6px">没有匹配的结果</div><div class="empty-sub">试试清除筛选或搜索词</div></div>';
this.state.singleTaskId = null;
if (window.SvFloor) SvFloor.sync();
this._renderResultStrip();
return;
}
let idx = -1;
if (this.state.singleTaskId) idx = filtered.findIndex(t => t.id === this.state.singleTaskId);
if (idx < 0) {
idx = 0;
this.state.singleTaskId = filtered[0].id;
}
this.state.singleIdx = idx;
this._renderSingleView();
this._renderResultStrip();
if (typeof ThumbService !== "undefined") {
filtered.slice(0, 30).forEach(t => {
if (t.status === "succeeded" && t.result?.url && !t.result?.thumbUrl) {
ThumbService.lazyEnsureThumb(t, () => {
this._updateStripItem(t);
});
}
});
}
this._preloadThumbs();
},
_renderSingleView(taskOverride) {
if (typeof VideoFS !== "undefined" && VideoFS.active) VideoFS.close({ silent: true });/* IMPL-107①：重渲染前先退出全屏并归还 video 节点，防孤儿引用（const 不挂 window，用 typeof 探测） */
const list = $("#resultList");
const wantId = taskOverride ? taskOverride.id : this.state.singleTaskId;
let task = wantId ? Store.getTasks().find(t => t.id === wantId) || Store.getHistory().find(t => t.id === wantId) : null;
if (!task && !taskOverride) {
const arr = this.state.singleList || [];
task = arr[this.state.singleIdx || 0];
}
if (!task) return;
this.state.singleTaskId = task.id;
list.innerHTML = "";
list.appendChild(this._buildSingleView(task));
const dock = $("#svDockLayer");
if (dock) {
/* IMPL-138③：compare-bar 移除——dock 只重挂结果浮动菜单栏 */
const bar = list.querySelector(".sv-floatbar");
dock.innerHTML = "";
if (bar) dock.appendChild(bar);
}
const navLayer = $("#svNavLayer");
if (navLayer) {
navLayer.innerHTML = "";
list.querySelectorAll(".sv-nav").forEach(b => navLayer.appendChild(b));
}
const capLayer = $("#svCapLayer");
if (capLayer) {
capLayer.innerHTML = "";
const cap = list.querySelector(".sv-caption");
if (cap) capLayer.appendChild(cap);
}
if (window.SvFloor) SvFloor.sync();
/* IMPL-94⑥：浏览即预取——当前图 blob 入缓存（点下载零等待），相邻 2 张后台预取（cap=12 FIFO） */
try {
const vi = this.state.singleList || [];
const ci = this.state.singleIdx || 0;
[ci, ci - 1, ci + 1].forEach(off => {
const t = vi[off];
if (t && t.result && t.result.url) this._preloadResult(t);
});
} catch (e) {}
},
_singleNav(dir) {
const arr = this.state.singleList || [];
if (!arr.length) return;
let idx = this.state.singleIdx;
if (idx == null || idx < 0 || idx >= arr.length) idx = 0; else idx = (idx + dir + arr.length) % arr.length;
this.state.singleIdx = idx;
this.state.singleTaskId = arr[idx].id;
this._renderSingleView();
const svStg = $("#resultList") && $("#resultList").querySelector(".sv-stage");
if (svStg) svStg.classList.add(dir > 0 ? "sv-anim-next" : "sv-anim-prev");
const strip = $("#resultStrip");
if (strip) {
const tid = this.state.singleTaskId;
strip.querySelectorAll(".strip-thumb").forEach(el => el.classList.toggle("active", el.dataset.tid === tid));
const active = strip.querySelector(`.strip-thumb[data-tid="${tid}"]`);
if (active) active.scrollIntoView({
block: "nearest",
inline: "center",
behavior: "smooth"
});
}
},
_bindSwipeNav() {
const body = $("#resultBody");
if (!body || body.dataset.swipeBound) return;
body.dataset.swipeBound = "1";
let sx = 0, sy = 0, st = 0, tracking = false;
body.addEventListener("touchstart", e => {
if (!e.touches || e.touches.length !== 1) {
tracking = false;
return;
}
const t = e.target;
if (t.closest && t.closest("button, a, input, textarea, select, .sv-floatbar, .sv-caption")) {
tracking = false;
return;
}
sx = e.touches[0].clientX;
sy = e.touches[0].clientY;
st = Date.now();
tracking = true;
}, {passive: true});
body.addEventListener("touchend", e => {
if (!tracking) return;
tracking = false;
const ct = e.changedTouches && e.changedTouches[0];
if (!ct) return;
const dx = ct.clientX - sx, dy = ct.clientY - sy, dt = Date.now() - st;
if (dt > 700 || Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
this._singleNav(dx < 0 ? 1 : -1);
}, {passive: true});
body.addEventListener("touchcancel", () => {
tracking = false;
}, {passive: true});
/* IMPL-138②/142：触屏长按 480ms——缩略图=进入多选（IMPL-142 起 floatbar 批量组「清除」退出）、文件夹图标=弹菜单（反馈5） */
const strip = $("#resultStrip");
if (strip && !strip.dataset.lpBound) {
strip.dataset.lpBound = "1";
let lpTimer = null, lpTarget = null;
strip.addEventListener("touchstart", e => {
/* IMPL-142：文件夹图标长按=菜单（与缩略图多选分支互斥） */
const fo = e.target.closest(".rf-folder");
if (fo && fo.dataset.fid) {
lpTimer = setTimeout(() => {
lpTimer = null;
try { navigator.vibrate && navigator.vibrate(30); } catch (err) {}
this._openFolderMenu(fo.dataset.fid, fo);
}, 480);
return;
}
const th = e.target.closest(".strip-thumb");
if (!th || !th.dataset.tid) return;
lpTarget = th;
lpTimer = setTimeout(() => {
lpTimer = null;
this._lpSel = th.dataset.tid; this._lpSelAt = Date.now(); /* IMPL-139：登记长按已消费（抑制松手合成 click 翻转） */
const task = [...Store.getTasks(), ...Store.getHistory()].find(t => t.id === th.dataset.tid);
try { navigator.vibrate && navigator.vibrate(30); } catch (err) {}
if (this.state.selMode) {
/* IMPL-142b：已处多选模式时长按=打开该卡查看器——sv-floatbar 批量组即触屏批量操作入口（sel-bar 移除后的闭环） */
if (task) this._showSingleTask(task);
} else {
this.state.selMode = true;
if (task) this._toggleSelect(task);
}
}, 480);
}, {passive: true});
strip.addEventListener("touchend", () => { if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; } }, {passive: true});
strip.addEventListener("touchmove", () => { if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; } }, {passive: true});
}
},
_showSingleTask(task) {
if (!task) return;
/* ★ R86：点开视频 ⇒ 插队立即转存（此时本来也要下载，不额外占带宽） */
try { window.__r86Archive.open(task); } catch (_e86) {}
const arr = this.state.singleList || [];
const si = arr.findIndex(t => t.id === task.id);
if (si >= 0) this.state.singleIdx = si;
this._renderSingleView(task);
if (!this._plSet) this._plSet = new Set();
[si - 1, si + 1].forEach(j => {
const nb = arr[j];
const u = nb && nb.status === "succeeded" && nb.result?.url && nb.model?.type === "image" ? nb.result.url : "";
if (u && !this._plSet.has(u)) {
this._plSet.add(u);
const im = new Image();
im.decoding = "async";
im.src = u;
}
});
const strip = $("#resultStrip");
if (strip) {
strip.querySelectorAll(".strip-thumb").forEach(el => el.classList.toggle("active", el.dataset.tid === task.id));
const active = strip.querySelector(`.strip-thumb[data-tid="${task.id}"]`);
if (active) active.scrollIntoView({
block: "nearest",
inline: "center",
behavior: "smooth"
});
}
},
_openLightboxForTask(task) {
const arr = (this.state.singleList || []).filter(t => t.status === "succeeded" && t.result?.url);
const urls = arr.map(t => t.result.url);
let idx = urls.indexOf(task.result?.url);
if (idx < 0) {
if (!task.result?.url) return;
this._openLightbox([ task.result.url ], 0, task.model?.type === "video", task.model?.type === "audio");
return;
}
const rec = arr[idx];
this._openLightbox(urls, idx, rec.model?.type === "video", rec.model?.type === "audio");
},
_buildSingleView(task) {
const el = document.createElement("div");
el.dataset.tid = task.id;
const type = task.model?.type || "image";
const status = task.status || "processing";
const url = status === "succeeded" && task.result?.url ? task.result.url : "";
/* ★ R91-A：媒体 src 用会话地址（blob:），url 本身保持真实地址（灯箱/下载/索引都用它） */
const _r91u = (window.__r91Sess && window.__r91Sess.get(task.id)) || url;
const thumbUrl = status === "succeeded" && task.result?.thumbUrl ? task.result.thumbUrl : "";
const statusText = status === "processing" ? "生成中" : status === "succeeded" ? "成功" : status === "failed" ? "失败" : "超时";
const n = (this.state.singleList || []).length;
const idx = this.state.singleIdx >= 0 ? this.state.singleIdx : 0;
const isPlain = status === "succeeded" && !!url && (type === "image" || type === "video");
el.className = "sv-wrap" + (isPlain ? " sv-plain" : "") + (task.status === "processing" ? " status-processing" : "");
let mediaHtml = "";
/* ★ R9B-UX-P0-1e：转存失败的结果在卡片上**常驻**标出（刷新后仍在）—— 光有 Toast 不够。 */
const _r9bBanner = task.localOnly ? '<div role="alert" style="width:100%;box-sizing:border-box;margin:0 0 8px;padding:6px 10px;border-radius:8px;background:rgba(204,58,58,.12);color:var(--danger);font-size:12px;line-height:1.5;text-align:left">⚠ 此结果<strong>未能转存到云端</strong>，仅在本页有效 —— 关闭或刷新页面后会丢失，请立即「下载」保存。</div>' : "";
if (status === "processing") {
/* 81-b：等待卡片——细线圆环+微光带（样式见 .sv-waiting-*），.sv-media.is-loading 外壳类名保留（JS 无查询点，纯语义标记） */
mediaHtml = `<div class="sv-media is-loading"><div class="sv-waiting" role="status" aria-label="生成中，请稍候"><svg class="sv-waiting-ring" viewBox="0 0 30 30" aria-hidden="true"><circle class="wr-track" cx="15" cy="15" r="12.5"></circle><circle class="wr-arc" cx="15" cy="15" r="12.5"></circle></svg><span class="sv-waiting-bar" aria-hidden="true"></span></div></div>`;
} else if (status === "failed" || status === "timeout") {
const _rawErr = String(task.error || "未知错误"); /* ★ R97-3-4：原始错误原样保留给"技术详情" */
const err = classifyErr(_rawErr);
mediaHtml = `<div class="sv-error" role="alert"><div class="sv-error-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg></div><div class="sv-err-category">${esc(err.category)}错误</div><div class="sv-err-hint">${esc(err.hint)}</div><details class="sv-err-raw" style="margin-top:10px;max-width:100%;width:100%"><summary style="cursor:pointer;font-size:12px;color:var(--text-muted)">技术详情</summary><div style="margin-top:6px;max-width:420px;max-height:120px;overflow:auto;text-align:left;font-family:var(--font-mono);font-size:11px;line-height:1.5;color:var(--text-dim);background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:8px 10px;word-break:break-all;white-space:pre-wrap">${esc(_rawErr)}</div><button type="button" class="sv-hb-btn" data-act="copyErr" title="复制错误信息" style="margin-top:6px;width:auto;height:auto;padding:4px 12px;border-radius:999px;font-size:12px;line-height:1.6;background:var(--surface-2);border:1px solid var(--border)">复制</button></details></div>`;
} else if (isPlain && type === "video") {
mediaHtml = `<div class="sv-media is-plain is-video" title="单击播放/暂停"><video src="${esc(_r91u)}" playsinline preload="metadata"></video></div>`;/* IMPL-107①：裸播——单击播放/单击暂停，控制面板移除（全屏走浮动菜单栏按钮） */
} else if (type === "audio") {
mediaHtml = `<div class="sv-audio"><div class="sv-audio-disc"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect class="eqb e1" x="2.2" y="8.6" width="2.5" height="6.8" rx="1.25"/><rect class="eqb e2" x="6.5" y="5.2" width="2.5" height="13.6" rx="1.25"/><rect class="eqb e3" x="10.8" y="3.4" width="2.5" height="17.2" rx="1.25"/><rect class="eqb e4" x="15.1" y="6.4" width="2.5" height="11.2" rx="1.25"/><rect class="eqb e5" x="19.4" y="9.4" width="2.5" height="5.2" rx="1.25"/></svg></div><div class="sv-audio-info"><div class="sv-audio-name">${esc(trunc(task.prompt || task.model?.name || "音频作品", 46))}</div><div class="sv-aplayer" role="toolbar" aria-label="音频播放控制"><button class="sv-vbtn" data-vact="toggle" aria-label="播放或暂停"><svg class="vi-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg><svg class="vi-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg></button><span class="sv-vtime"><span class="vt-cur">0:00</span><i>/</i><span class="vt-dur">0:00</span></span><input class="sv-vseek" type="range" min="0" max="1000" value="0" step="1" aria-label="播放进度"><audio src="${esc(url)}" preload="metadata"></audio></div></div></div>`;
} else if (type === "asr") {
const txt = (task.result && (task.result.text || (task.result.data && task.result.data.text))) || "(空结果)";
mediaHtml = `<div class="sv-asr"><div class="sv-asr-head"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19v3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/></svg><span class="sv-asr-title">语音识别结果</span><button class="sv-hb-btn" data-act="copyText" title="复制文本" aria-label="复制文本"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button></div><div class="sv-asr-text">${esc(txt)}</div></div>`;
} else {
const lqip = thumbUrl ? ` data-lqip="1" style="background-image:url('${esc(thumbUrl)}');background-size:contain;background-position:center;background-repeat:no-repeat"` : "";
mediaHtml = `<div class="sv-media ${isPlain ? "is-plain " : ""}is-image" data-lightbox="${esc(url)}" role="button" tabindex="0" aria-label="查看大图" title="点击放大查看原图"${lqip}><img src="${esc(_r91u)}" loading="eager" decoding="async" referrerpolicy="no-referrer" alt="${esc(trunc(task.prompt || "生成结果", 60))}"></div>`;
}
let progressRowHtml = "";
if (status === "processing") {
const elapsed = task.createdAt ? fmtDur(Date.now() - task.createdAt) : "0:00";
const polls = poller.getPollCount(task.id) || 0;
const phase = poller.getPhaseName(Date.now() - (poller.getStartTime(task.id) || task.createdAt || Date.now()));
progressRowHtml = `<div class="sv-progress-row"><span class="task-spinner"></span><span class="tm-elapsed">已用 ${esc(elapsed)}</span><span class="tm-polls">${esc(_r77PollLabel(task))}</span><span class="tm-phase">${esc(phase)}</span></div>`;
}
const headMeta = [];
if (type) headMeta.push(`<span class="sv-tag">${typeName(type)}</span>`);
if (task.body?.aspectRatio || task.body?.ratio) headMeta.push(`<span class="sv-tag">${esc(task.body?.aspectRatio || task.body?.ratio)}</span>`);
if (task.body?.size || task.body?.resolution) headMeta.push(`<span class="sv-tag">${esc(task.body?.size || task.body?.resolution)}</span>`);
if (task.cost) headMeta.push(`<span class="sv-tag">¥${Number(task.cost).toFixed(2)}</span>`);
if (n > 1) headMeta.push(`<span class="sv-tag">${idx + 1} / ${n}</span>`);
const navChev = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
const sep = `<span class="sv-fb-sep" aria-hidden="true"></span>`;
const bWf = `<button class="sv-hb-btn" data-act="wf" title="复制工作流" aria-label="复制工作流"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg></button>`;
const bDel = `<button class="sv-hb-btn danger" data-act="delete" title="删除" aria-label="删除"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>`;
const bDown = `<button class="sv-hb-btn" data-act="download" title="下载" aria-label="下载结果"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg></button>`;
const navHtml = n > 1 ? `<button class="sv-nav sv-prev" data-svnav="-1" title="上一个（←）" aria-label="上一个结果">${navChev}</button><button class="sv-nav sv-next" data-svnav="1" title="下一个（→）" aria-label="下一个结果">${navChev}</button>` : "";
if (isPlain) {
/* IMPL-142 反馈1：多选批量操作组注入 sv-floatbar——独立 sel-bar 悬浮条移除，复用结果卡片下方悬浮条菜单 */
const selN = this.state.compareList.length;
/* IMPL-143 反馈①③④：批量组排序规约=已选徽标→放入文件夹→编辑→对比（≥2 才渲染）→下载；导出/清除已按 W5 反馈②移除；条件不允许的按钮不渲染（不出禁用灰钮） */
const bFAdd = `<button class="sv-hb-btn" data-batchact="folder" title="所选收入文件夹" aria-label="所选收入文件夹"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10v6"/><path d="M9 13h6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg></button>`;
const cmpSel = selN >= 2 ? `<button class="sv-hb-btn" data-batchact="compare" title="对比所选" aria-label="对比所选"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M12 4.5v15"/></svg></button>` : "";
const selBatch = selN ? `<span class="sv-sel-tag" data-batchact="clearsel" role="button" tabindex="0" title="点击取消全部选择" aria-label="已选 ${selN}，点击取消全部选择">已选 ${selN}</span>` + bFAdd + `<button class="sv-hb-btn" data-batchact="edit" title="所选一起放入编辑器" aria-label="批量编辑"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg></button>` + cmpSel + `<button class="sv-hb-btn" data-batchact="download" title="批量下载所选" aria-label="批量下载"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg></button>` + sep : "";
const inCompare = this.state.compareList.some(t => t.id === task.id);
/* bDown 上移至 bDel 旁（IMPL-105⑤：非 plain 成功态也提供下载） */
const bRef = `<button class="sv-hb-btn" data-act="ref" title="用作参考素材" aria-label="用作参考素材"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg></button>`;
const bEdit = selN ? "" : `<button class="sv-hb-btn" data-act="edit" title="编辑图片" aria-label="编辑图片"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg></button>`;/* IMPL-143 反馈①：选中态隐藏——批量 edit 已覆盖（重复图标合并） */
const bCmp = `<button class="sv-hb-btn${inCompare ? " on" : ""}" data-act="compare" title="${inCompare ? "已在多选中" : "加入多选"}" aria-label="${inCompare ? "已在多选中" : "加入多选"}"${inCompare ? ' aria-pressed="true"' : ""}><svg class="ic-add" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg><svg class="ic-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></button>`;/* W5 反馈③：按钮即「加入多选」+动态图标（未选=+圈/已选=✓圈，CSS 随 .on 实时切换，双 svg 内联免 JS 重绘） */
const bRegen = `<button class="sv-hb-btn" data-act="regen" title="重新生成" aria-label="重新生成"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg></button>`;
const bVFull = `<button class="sv-hb-btn" data-act="vfull" title="全屏播放" aria-label="全屏播放"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9"/><path d="M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9"/><path d="M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15"/><path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15"/></svg></button>`;
const hbBtns = selBatch + [(selN ? "" : bDown) + bWf, type === "image" ? bRegen + bRef + bEdit + bCmp : type === "video" ? bRegen + bRef + bVFull : bRegen + bRef].join(sep) + sep + bDel;/* IMPL-107①：视频追加全屏；IMPL-142：头部批量操作组；IMPL-143 反馈①：选中态 bDown/bEdit 隐藏（批量组覆盖，重复图标合并）、W5 反馈②：抠图此图/复制链接移除，排序=批量组|多选/生成/素材|工作流|删除(danger) */
el.innerHTML = `\n      <figure class="sv-stage is-plain">\n        ${navHtml}\n        <div class="sv-caption"><span class="sv-cap-model">${esc(task.model?.name || "未命名")}</span><span class="sv-cap-time">${fmtTime(task.createdAt)}${task.batchTotal > 1 && task.batchIndex ? ` · #${task.batchIndex}/${task.batchTotal}` : ""}</span>${task.prompt ? `<span class="sv-cap-prompt" title="${esc(task.prompt)}">${esc(task.prompt)}</span>` : ""}${headMeta.length ? `<span class="sv-hb-tags">${headMeta.join("")}</span>` : ""}</div>\n        ${_r9bBanner}${mediaHtml}\n        <div class="sv-floatbar" role="toolbar" aria-label="结果操作">${hbBtns}</div>\n      </figure>`;
} else {
const stActs = [];
if (status === "processing") stActs.push(`<button class="sv-hb-btn" data-act="refresh" title="手动刷新" aria-label="手动刷新"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg></button>`, `<button class="sv-hb-btn" data-act="stop" title="停止任务" aria-label="停止任务"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/></svg></button>`);
if (status === "failed" || status === "timeout") stActs.push(`<button class="sv-hb-btn" data-act="retry" title="重试" aria-label="重试"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>`);
if (status === "succeeded" && url) stActs.push(bDown);
stActs.push(bWf);
if (status === "failed" || status === "timeout" || status === "succeeded") stActs.push(bDel);/* IMPL-105⑤：成功态补下载+删除（音频此前仅剩工作流一钮） */
el.innerHTML = `\n      <figure class="sv-stage">\n        ${navHtml}\n        <div class="sv-head">\n          <span class="sv-model">${esc(task.model?.name || "未命名")}</span>\n          ${status !== "succeeded" ? `<span class="status-pill ${status}">${statusText}</span>` : ""}\n          <span class="sv-time">${fmtTime(task.createdAt)}${task.batchTotal > 1 && task.batchIndex ? ` · #${task.batchIndex}/${task.batchTotal}` : ""}</span>\n        </div>\n        ${_r9bBanner}${mediaHtml}\n        ${progressRowHtml}\n        <div class="sv-floatbar" role="toolbar" aria-label="任务操作">${stActs.join(sep)}</div>\n        ${task.prompt ? `<div class="sv-prompt" title="${esc(task.prompt)}">${esc(task.prompt)}</div>` : ""}\n        ${headMeta.length ? `<div class="sv-foot">${headMeta.join("")}</div>` : ""}\n      </figure>`;
}
this._bindSingleView(el, task);
this._wireMediaPill(el);
return el;
},
_wireMediaPill(el) {
/* IMPL-105⑦：毛玻璃播放控制接线（视频 vctl + 音频 aplayer，替代原生 controls） */
const fmt = s => { if (!isFinite(s) || s < 0) return "0:00"; s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
/* IMPL-106④：移除 caption 宽度钳制——竖图时信息条被压成窄条五连排（用户「恢复上一版样式」）；宽度改由 caplayer 恒定宽度承接 */
const ap = el.querySelector(".sv-aplayer");
if (ap) {
const media = ap.querySelector("audio");
if (media) {
const tgl = ap.querySelector('[data-vact="toggle"]'), seek = ap.querySelector(".sv-vseek"), cur = ap.querySelector(".vt-cur"), dur = ap.querySelector(".vt-dur");
const sync = () => { cur.textContent = fmt(media.currentTime); if (isFinite(media.duration) && media.duration) { if (!(seek && seek.matches(":active"))) seek.value = Math.round(media.currentTime / media.duration * 1000); dur.textContent = fmt(media.duration); } ap.classList.toggle("is-playing", !media.paused && !media.ended); };
tgl && tgl.addEventListener("click", e => { e.stopPropagation(); media.paused ? media.play().catch(() => {}) : media.pause(); });
seek && seek.addEventListener("input", () => { if (isFinite(media.duration) && media.duration) media.currentTime = seek.value / 1000 * media.duration; });
["timeupdate", "play", "pause", "ended", "loadedmetadata", "durationchange"].forEach(ev => media.addEventListener(ev, sync));
sync();
}
return;
}
const v = el.querySelector(".sv-media.is-video video");
if (!v) return;
v.addEventListener("click", e => { if (v.closest("#vfsStage")) return;/* IMPL-107①：全屏态由 VideoFS 接管（防双监听互相抵消） */ e.stopPropagation(); v.paused ? v.play().catch(() => {}) : v.pause(); });/* IMPL-107①：内嵌裸播——单击播放/单击暂停，无常驻控制面板 */
},
async _detectImageAlpha(img) {
const ck = img ? img.src : "";
if (!ck) return false;
if (!this._alphaCache) this._alphaCache = new Map();
if (this._alphaCache.has(ck)) return this._alphaCache.get(ck);
const r = await this._alphaProbe(img);
this._alphaCache.set(ck, r);
return r;
},
async _alphaProbe(img) {
if (!img || !img.src) return false;
if (!img.complete || !img.naturalWidth) {
try {
await new Promise((res, rej) => {
if (img.complete && img.naturalWidth) return res();
img.addEventListener("load", res, {
once: true
});
img.addEventListener("error", () => rej(new Error("img error")), {
once: true
});
});
} catch {
return false;
}
}
if (!img.naturalWidth) return false;
try {
const c = document.createElement("canvas");
const sc = Math.min(1, 260 / Math.max(img.naturalWidth, img.naturalHeight));
c.width = Math.max(1, Math.round(img.naturalWidth * sc));
c.height = Math.max(1, Math.round(img.naturalHeight * sc));
const ctx = c.getContext("2d", {
willReadFrequently: true
});
ctx.drawImage(img, 0, 0, c.width, c.height);
const d = ctx.getImageData(0, 0, c.width, c.height).data;
for (let i = 3; i < d.length; i += 4) if (d[i] < 246) return true;
return false;
} catch {
return null;
}
},
_bindSingleView(el, task) {
el.querySelectorAll("[data-svnav]").forEach(b => b.addEventListener("click", () => this._singleNav(+b.dataset.svnav)));
el.querySelectorAll("[data-lqip]").forEach(m => {
const im = m.querySelector("img");
if (!im) return;
const clear = () => {
m.removeAttribute("style");
m.removeAttribute("data-lqip");
};
im.complete ? clear() : im.addEventListener("load", clear, {
once: true
});
im.addEventListener("error", clear, {
once: true
});
});
const media = el.querySelector(".sv-media.is-image");
if (media) media.addEventListener("click", e => {
if (e.target.closest("[data-act],[data-svnav]")) return;
this._openLightboxForTask(task);
});
if (media) media.addEventListener("keydown", e => { /* IMPL-158-c：灯箱入口键盘可达（此前 click-only） */
if (e.key !== "Enter" && e.key !== " ") return;
if (e.target.closest("[data-act],[data-svnav]")) return;
e.preventDefault();
this._openLightboxForTask(task);
});
if (media) {
const simg = media.querySelector("img");
this._detectImageAlpha(simg).then(a => {
if (a === true || a === null && task.model?.seg === true) media.classList.add("has-alpha");
}).catch(() => {});
}
const prompt = el.querySelector(".sv-prompt");
if (prompt) prompt.addEventListener("click", () => prompt.classList.toggle("expanded"));
el.querySelectorAll(".sv-hb-btn[data-act]").forEach(btn => {
btn.addEventListener("click", e => {
e.stopPropagation();
const act = btn.dataset.act;
if (act === "zoom") this._openLightboxForTask(task); else if (act === "download") this._downloadFile(task.result.url, `${task.model?.id || "workbench"}_${task.id}`); else if (act === "compare") this._toggleCompare(task); else if (act === "delete") this._deleteTask(task.id); else if (act === "ref") this._useAsReference(task.result.url, task.model?.type); else if (act === "edit") this._openEditor(task.result.url); else if (act === "vfull") VideoFS.openFromTask(task);/* IMPL-107① */ else if (act === "wf") Workflow.copy(task); else if (act === "regen") this._regen(task); else if (act === "refresh") poller.manualRefresh(task.id); else if (act === "stop") poller.manualStop(task.id); else if (act === "retry") this._retryTask(task); else if (act === "copyErr") { const _t9 = String(task.error || "未知错误"); (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(_t9) : Promise.reject()).then(() => { try { Toast.success("错误信息已复制"); } catch (_) {} }, () => { try { this._showManualCopy(_t9); } catch (_) {} }); }
});
});
el.querySelectorAll(".sv-hb-btn[data-batchact], .sv-sel-tag[data-batchact]").forEach(btn => { /* IMPL-142：批量操作组（sv-floatbar 复用，反馈1）；Z4（第六批）：sel-tag 徽标纳入委托=点击取消全部多选 */
btn.addEventListener("click", e => {
e.stopPropagation();
const act = btn.dataset.batchact;
if (act === "clearsel") { this._clearSelection(); try { Toast.info("已取消全部选择"); } catch (_) {} return; } else if (act === "folder") this._openMoveToMenu(btn); else if (act === "compare") this._showCompareGrid(); else if (act === "download") this._downloadSelected(); else if (act === "edit") this._editSelected();/* W5 反馈②：批量导出/清除多选图标移除（减选出口=再点选中卡片/点徽标，归零自动退多选模式） */
});
});
const hbPrompt = el.querySelector(".sv-cap-prompt");
if (hbPrompt) hbPrompt.addEventListener("click", () => hbPrompt.classList.toggle("expanded"));
},
_preloadThumbs() {
if (typeof ThumbService === "undefined") return;
if (!Store.getSync()) return;
try {
const tasks = Store.getTasks().filter(t => t.result?.url && t.model?.type !== "audio");
tasks.slice(0, 10).forEach(t => {
ThumbService.ensureThumb(t).catch(() => {});
});
} catch (e) {}
},
_bulkDeleteByFilter() {
const tasks = Store.getTasks();
const history = Store.getHistory();
const _tids = new Set(tasks.map(t => t.id));
const all = [ ...tasks, ...history.filter(h => !_tids.has(h.id)) ];
const hidden = this.state.hiddenTaskIds;
let filtered = all.filter(t => !hidden.has(t.id));
filtered = this.state.filter === "all" ? filtered : filtered.filter(t => t.model?.type === this.state.filter);
if (this.state.resultSearch) {
const q = this.state.resultSearch.toLowerCase();
filtered = filtered.filter(t => (t.prompt || "").toLowerCase().includes(q) || (t.model?.name || "").toLowerCase().includes(q));
}
if (!filtered.length) {
Toast.warning("当前筛选条件下没有可删除的结果");
return;
}
const filterDesc = [ this.state.filter !== "all" ? typeName(this.state.filter) : "全部", this.state.resultSearch ? `"${this.state.resultSearch}"` : "" ].filter(Boolean).join(" · ");
this._showModal("批量删除确认", `<div style="padding:16px"><div style="font-size:14px;margin-bottom:8px">将删除 <strong style="color:var(--danger)">${filtered.length}</strong> 个结果</div><div style="font-size:12px;color:var(--text-dim);margin-bottom:12px">筛选条件: ${esc(filterDesc)}</div><div style="padding:10px;background:var(--danger-soft);border-radius:10px;font-size:12px;color:var(--danger)">此操作不可撤销，删除后将同时移除任务和历史记录。</div></div>`, [ {
label: "取消",
fn: () => this._closeModal()
}, {
label: "确认删除",
primary: true,
fn: () => {
this._executeBulkDelete(filtered);
}
} ]);
},
_executeBulkDelete(items) {
const ids = new Set(items.map(i => i.id));
let tasks = Store.getTasks().filter(t => !ids.has(t.id));
Store.saveTasks(tasks);
let history = Store.getHistory().filter(h => !ids.has(h.id));
Store.saveHistory(history);
this._syncHistoryToCloudNow();
this._closeModal();
this._renderTaskList();
this._renderActiveTasks();
this._renderResultStrip();
this.renderHistoryBadge();
Toast.success(`已删除 ${items.length} 个结果`);
},
_initHistoryThumbLoader() {
const list = document.getElementById("historyList");
if (!list || list.dataset.thumbLoader) return;
list.dataset.thumbLoader = "1";
const markLoaded = el => {
const c = el.parentElement;
if (c && c.classList.contains("h-thumb")) c.classList.add("is-loaded");
};
list.addEventListener("load", e => {
const t = e.target;
if (t && t.tagName === "IMG") markLoaded(t);
}, true);
list.addEventListener("loadeddata", e => {
const t = e.target;
if (t && t.tagName === "VIDEO") markLoaded(t);
}, true);
list.addEventListener("error", e => {
const t = e.target;
if (t && t.tagName === "IMG" && t.parentElement && t.parentElement.classList.contains("h-thumb")) t.parentElement.classList.add("is-err");
}, true);
},
_updateTaskCard(task) {
if (this.state.singleTaskId === task.id) this._renderSingleView();
this._updateStripItem(task);
},
_renderActiveTasks() {
const panel = $("#activeTasksPanel");
const tasks = Store.getTasks().filter(t => t.status === "processing");
AmbientFX.setGenerating(!!tasks.length);
if (!tasks.length) {
panel.classList.add("empty");
panel.innerHTML = "";
return;
}
panel.classList.remove("empty");
panel.innerHTML = `<div class="atp-list" role="status" aria-label="${tasks.length} 个任务生成中"><span class="atp-label"><span class="ping-dot"></span>${tasks.length} 生成中</span>${tasks.map(t => `<div class="atp-card" data-tid="${t.id}"><span class="atp-orb" aria-hidden="true"></span><span class="atp-model">${esc(t.model?.name || "")}</span><span class="atp-phase">${esc(poller.getPhaseName(Date.now() - t.createdAt))}</span><span class="atp-timer">${fmtDur(Date.now() - t.createdAt)}</span><button class="atp-cancel" data-cancel="${t.id}" aria-label="停止任务"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></div>`).join("")}</div>`;
panel.querySelectorAll("[data-cancel]").forEach(btn => btn.addEventListener("click", () => poller.manualStop(btn.dataset.cancel)));
},
_renderResultStrip() { /* IMPL-142：文件夹图标内嵌同栏（反馈2）+ 展开视图（反馈4）+ 入夹结果不重复显示（反馈2） */
const strip = $("#resultStrip");
const tasks = Store.getTasks();
const history = Store.getHistory();
const _tids = new Set(tasks.map(t => t.id));
const all = [ ...tasks, ...history.filter(h => !_tids.has(h.id)) ];
const openF = this.state.openFolderId ? this.state.folders.find(f => f.id === this.state.openFolderId) : null;
if (this.state.openFolderId && !openF) this.state.openFolderId = null;
const grouped = new Set();
this.state.folders.forEach(f => f.ids.forEach(id => grouped.add(id)));
const list = openF
? openF.ids.map(id => all.find(t => t.id === id)).filter(Boolean)
: all.filter(t => !grouped.has(t.id)).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 40);
if (!list.length && !openF && !this.state.folders.length) {
delete strip.dataset.sig;
strip.classList.add("empty");
strip.innerHTML = "";
return;
}
/* 77-a：签名跳过——IMPL-142 起指纹含文件夹段（id:成员数）与展开态，文件夹增删/成员变化/展开收敛都会触发重渲；
   id+status 指纹一致时只刷新 active/selected 态 */
const sig = (openF ? "F" + openF.id : "-") + "#" + this.state.folders.map(f => f.id + ":" + f.ids.length).join("|") + "#" + list.map(t => t.id + ":" + (t.status || "")).join(",");
if (sig === strip.dataset.sig) { this._updateStripActive(); this._updateStripSelStates(); return; } /* IMPL-139：sig 跳过路径同步 selected */
strip.dataset.sig = sig;
const wasEmpty = strip.classList.contains("empty");
strip.classList.remove("empty");
strip.innerHTML = "";
let fi = 0;
if (openF) {
/* IMPL-142 反馈4：展开视图=[当前文件夹图标（绽开保持）]+[夹内成员]，外部其余结果隐藏 */
strip.appendChild(this._buildFolderEl(openF, true));
} else {
this.state.folders.forEach(f => {
const el = this._buildFolderEl(f, false);
if (wasEmpty) el.style.animationDelay = Math.min(fi++ * 16, 320) + "ms";
strip.appendChild(el);
});
}
list.forEach((t, i) => {
const th = this._buildStripThumb(t, !!openF);
if (wasEmpty && !openF) th.style.animationDelay = Math.min((fi + i) * 16, 320) + "ms";
strip.appendChild(th);
});
this._updateStripActive(); this._updateStripSelStates(); /* IMPL-139：重建后重放 selected */
},
_buildStripThumb(task, noDrag) { /* IMPL-142：noDrag=展开视图成员（已在夹内，禁拖） */
const th = document.createElement("div");
th.className = "strip-thumb status-" + (task.status || "processing");
th.dataset.tid = task.id;
th.title = (task.prompt || "").slice(0, 60);
th.tabIndex = 0;
th.setAttribute("role", "button");
th.setAttribute("aria-label", ((task.prompt || "").slice(0, 40) || "结果") + "，打开详情");
th.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this._showSingleTask(task); } });
const type = task.model?.type || "image";
const url = task.status === "succeeded" && task.result?.url ? task.result.url : "";
const _r91u = (window.__r91Sess && window.__r91Sess.get(task.id)) || url;
const thumbUrl = task.result?.thumbUrl || "";
const badge = svg => `<span class="strip-type-badge" aria-hidden="true">${svg}</span>`;
const bPlay = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>';
const bWave = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3.6" y="9.6" width="2.7" height="4.8" rx="1.35"/><rect x="8.5" y="6.2" width="2.7" height="11.6" rx="1.35"/><rect x="13.4" y="8.2" width="2.7" height="7.6" rx="1.35"/><rect x="18.3" y="4.8" width="2.7" height="14.4" rx="1.35"/></svg>';
const bWarn = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12 2.2a9.8 9.8 0 1 0 0 19.6 9.8 9.8 0 0 0 0-19.6zm0 4.6a1.15 1.15 0 0 1 1.15 1.15v5.1a1.15 1.15 0 1 1-2.3 0v-5.1A1.15 1.15 0 0 1 12 6.8zm0 10.7a1.35 1.35 0 1 1 0-2.7 1.35 1.35 0 0 1 0 2.7z"/></svg>';
const bImg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
const bBusy = '<i></i><i></i><i></i>';
let mediaHtml = "";
if (task.status === "processing") {
mediaHtml = `<div class="strip-icon-only strip-mini-spin"><span class="task-spinner"></span></div>` + badge(bBusy);
} else if (task.status === "failed" || task.status === "timeout") {
mediaHtml = `<div class="strip-icon-only is-failed"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg></div>` + badge(bWarn);
} else if (type === "video") {
/* ★ R86：转存状态角标 —— 未转存 / 待转存 / 转存中。
   「已转存」刻意不显示（常态即此，多一个角标是噪声）；走 __r86Archive.stateOf 的单一真值源。 */
let _archBadge = "";
try {
const _aSt = window.__r86Archive.stateOf(task);
if (_aSt === "running") _archBadge = '<span class="strip-arch-badge is-running" aria-hidden="true">转存中</span>';
else if (_aSt === "queued") _archBadge = '<span class="strip-arch-badge is-queued" aria-hidden="true">待转存</span>';
else if (_aSt === "idle") _archBadge = '<span class="strip-arch-badge is-idle" aria-hidden="true">未转存</span>';
} catch (_e86) {}
mediaHtml = (thumbUrl ? `<img src="${esc(thumbUrl)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">` : `<video src="${esc(_r91u)}" muted preload="metadata" playsinline></video>`) + badge(bPlay) + _archBadge;
} else if (type === "audio") {
mediaHtml = `<div class="strip-icon-only is-audio"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect class="eqb e1" x="2.2" y="8.6" width="2.5" height="6.8" rx="1.25"/><rect class="eqb e2" x="6.5" y="5.2" width="2.5" height="13.6" rx="1.25"/><rect class="eqb e3" x="10.8" y="3.4" width="2.5" height="17.2" rx="1.25"/><rect class="eqb e4" x="15.1" y="6.4" width="2.5" height="11.2" rx="1.25"/><rect class="eqb e5" x="19.4" y="9.4" width="2.5" height="5.2" rx="1.25"/></svg></div>` + badge(bWave);
} else if (url) {
mediaHtml = `<img src="${esc(thumbUrl || _r91u)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">` + (type === "image" ? "" : badge(bImg));
} else {
mediaHtml = `<div class="strip-icon-only"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg></div>`;
}
th.innerHTML = mediaHtml;/* IMPL-143 反馈⑤：左上蓝色圆点移除（strip-sel-dot 全删）——选中态视觉=上浮+品牌描边+品牌薄雾 */
if (this.state.compareList.some(t => t.id === task.id)) th.classList.add("selected");
th.addEventListener("click", e => {
/* IMPL-138②：Ctrl/Cmd+点击=加选/减选；触屏多选模式（长按进入）下单击即切换选中 */
if (this._lpSel === task.id && Date.now() - (this._lpSelAt || 0) < 700) return; /* IMPL-139：长按已选中，吞掉松手合成 click */
if (e.ctrlKey || e.metaKey || this.state.selMode) {
e.preventDefault();
this._toggleSelect(task);
} else this._showSingleTask(task);
});
/* IMPL-138④/142：成功态可拖拽 → 拖到文件夹图标收入 / 拖到条尾幽灵新建文件夹（反馈3）；拖动期间自动浮现幽灵 */
if (task.status === "succeeded" && task.result?.url && !noDrag) {
th.draggable = true;
th.addEventListener("dragstart", e => {
try {
e.dataTransfer.setData("application/x-wb-task", task.id); e.dataTransfer.setData("text/plain", task.id);
const inSel = this.state.compareList.some(t => t.id === task.id); /* Z2（第六批）：uri-list 载荷（T2 契约，拖进画板即通）——多选拖拽=选中集整组 url（\n 多值标准形式），单拖=本卡 url */
const dragUrls = (inSel && this.state.compareList.length > 1 ? this.state.compareList : [task]).map(t => t.result && t.result.url).filter(Boolean).join("\n");
if (dragUrls) e.dataTransfer.setData("text/uri-list", dragUrls);
e.dataTransfer.effectAllowed = "copy"; } catch (err) {}
th.classList.add("dragging");
this._showStripGhost();
});
th.addEventListener("dragend", () => { th.classList.remove("dragging"); this._hideStripGhost(); });
}
return th;
},
_updateStripItem(task) {
if (this.state.openFolderId) return; /* IMPL-142 反馈4：展开态锁定结果栏内容，新结果待收敛后可见 */
const strip = $("#resultStrip");
if (!strip || strip.classList.contains("empty")) {
this._renderResultStrip();
return;
}
const existing = strip.querySelector(`.strip-thumb[data-tid="${task.id}"]`);
if (existing) {
/* IMPL-88：原位更新不重放入场动画——replaceWith 新节点会重播 strip-pop 并重新解码图片 */
const nu = this._buildStripThumb(task);
nu.style.animation = "none";
existing.replaceWith(nu);
this._updateStripActive(); this._updateStripSelStates(); /* IMPL-139：原位更新后重放 selected */
} else if (task.status === "succeeded" || task.status === "processing" || task.status === "failed" || task.status === "timeout") {
strip.prepend(this._buildStripThumb(task));
while (strip.children.length > 40) strip.lastElementChild.remove();
this._updateStripActive(); this._updateStripSelStates(); /* IMPL-139：prepend 后重放 selected */
}
},
_updateStripActive() {
const strip = $("#resultStrip");
if (!strip) return;
const cur = this.state.singleTaskId;
strip.querySelectorAll(".strip-thumb").forEach(el => el.classList.toggle("active", !!cur && el.dataset.tid === cur));
},
_deleteTask(taskId, opts) {
/* ★ R97-3-1：单删也可撤销 —— 与历史批量删（_historyBatchDelete）同款 Toast+撤销。
   ⚠ 文件夹/批量删也走本函数（ids.forEach(...)）⇒ 传 opts.silent 抑制成串 Toast。 */
const _removedHist = Store.getHistory().find(h => h.id === taskId) || null;
let tasks = Store.getTasks().filter(t => t.id !== taskId);
Store.saveTasks(tasks);
let history = Store.getHistory().filter(h => h.id !== taskId);
Store.saveHistory(history);
this._syncHistoryToCloudNow();
this.state.hiddenTaskIds.delete(taskId);
if (this.state.singleTaskId === taskId) this.state.singleTaskId = null;
this._renderTaskList();
this._renderActiveTasks();
this.renderHistoryBadge();
if (!(opts && opts.silent) && _removedHist) {
Toast.success("已删除 1 个结果", 8e3, {
label: "撤销",
fn: async () => {
const _n97 = await Store.restoreHistory([_removedHist]);
if (_n97 > 0) { this._syncHistoryToCloudNow(); this._renderTaskList(); this._renderActiveTasks(); this.renderHistoryBadge(); Toast.success("已恢复"); }
else Toast.info("无需恢复（记录已存在）");
}
});
}
},
_clearScreen() {
const tasks = Store.getTasks();
const history = Store.getHistory();
const _tids = new Set(tasks.map(t => t.id));
const all = [ ...tasks, ...history.filter(h => !_tids.has(h.id)) ];
let filtered = this.state.filter === "all" ? all : all.filter(t => t.model?.type === this.state.filter);
if (this.state.resultSearch) {
const q = this.state.resultSearch.toLowerCase();
filtered = filtered.filter(t => (t.prompt || "").toLowerCase().includes(q) || (t.model?.name || "").toLowerCase().includes(q));
}
if (!filtered.length) {
Toast.info("当前没有可隐藏的结果");
return;
}
filtered.forEach(t => this.state.hiddenTaskIds.add(t.id));
this._renderTaskList();
this._renderResultStrip();
Toast.success(`已隐藏 ${filtered.length} 个结果，点击「还原」可恢复`);
},
_restoreHidden() {
if (!this.state.hiddenTaskIds.size) {
Toast.info("没有已隐藏的结果");
return;
}
const n = this.state.hiddenTaskIds.size;
this.state.hiddenTaskIds = new Set;
this._renderTaskList();
this._renderResultStrip();
Toast.success(`已还原 ${n} 个结果`);
},
/* IMPL-101：历史选择模式批量下载——并发池 3 + 350ms 节流（浏览器多下载授权友好）；
     复用 _downloadFile（fetch-blob 化，跨域失效自动回退新标签）；无图/视频记录跳过并提示 */
async _downloadMany() {
  const sel = this.state.historySel;
  if (!sel || !sel.size) { Toast.info("先勾选要下载的记录"); return; }
  const items = Store.getHistory().filter(h => sel.has(h.id) && h.result && h.result.url && (h.model?.type === "image" || h.model?.type === "video"));
  if (!items.length) { Toast.warning("所选记录没有可下载的图片/视频"); return; }
  if (items.length < sel.size) Toast.info(`已跳过 ${sel.size - items.length} 条无图/视频记录`, 2600);
  Toast.info(`开始批量下载 ${items.length} 项（并发 3）…`, 3000);
  let ok = 0, bad = 0, idx = 0;
  const POOL = 3;
  const worker = async () => {
    while (idx < items.length) {
      const it = items[idx++];
      try {
        await this._downloadFile(it.result.url, `${it.model?.id || "workbench"}_${it.id}`);
        ok++;
      } catch (e) { bad++; }
      await new Promise(r => setTimeout(r, 350));
    }
  };
  await Promise.all(Array.from({ length: Math.min(POOL, items.length) }, worker));
  Toast[bad ? "warning" : "success"](`批量下载完成：成功 ${ok}${bad ? ` · 失败 ${bad}` : ""}`, 4200);
},
async _downloadFile(url, name) {
if (!url) return;
try {
let blob = null;
if (this._preloadCache.has(url)) {
blob = this._preloadCache.get(url).blob;
if (blob && /^text\/html/i.test(blob.type || "")) blob = null; /* IMPL-104：缓存中的错误页不作媒体消费，走 fetch 报错路径 */
}
if (!blob) {
const res = await fetch(url, {
mode: "cors"
});
if (!res.ok) throw new Error("fetch failed: HTTP " + res.status);
blob = await res.blob();
}
const objUrl = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = objUrl;
a.download = name || "download";
document.body.appendChild(a);
a.click();
a.remove();
setTimeout(() => URL.revokeObjectURL(objUrl), 1e3);
} catch (e) {
window.open(safeUrl(url), "_blank"); /* IMPL-158-d：降级打开同样过协议白名单（防 javascript: 一键 XSS） */
}
},
_useAsReference(url, type) {
if (!url) return;
const refType = type === "video" ? "ref-video" : "ref-image";
const param = this.state.model.params.find(p => p.type === refType);
if (!param) {
Toast.warning("当前模型不支持参考" + (type === "video" ? "视频" : "图片"));
return;
}
this._addUrlRef(param.key, url);
Toast.success("已添加为参考素材");
},
_resubmit(task, okMsg) { /* IMPL-160：_regen/_retryTask 复制分裂收敛（2×28 行仅成功文案差）；守卫两路共用——原 _retryTask 缺 !task.model?.id 守卫=漂移 bug（无 model.id 的失败任务走 retry 由 Api.submit 抛裸错而非友好 Toast） */
if (task.model && task.model.seg) { /* IMPL-104：抠图等 seg 模型无 Api.submit 通道（endpoint 缺失会拼出无效 URL），转抠图工作台重入 */
SegStudio.prefillAsModel(task);
Toast.info("已带入抠图工作台，请重新发起");
return;
}
if (!task.model?.id) { Toast.warning("该结果缺少模型信息，无法直接重新生成"); return; }
const newTask = {
...task,
id: genId(),
status: "processing",
createdAt: Date.now(),
apiId: null,
error: null,
dispatchedVia: "direct" /* IMPL-158：重提走 Api.submit 直连——若继承 taskcenter，resumeAll 会把上游 apiId 挂上任务中心监视通道（tc_ 守卫与「丢失任务」30s 双重误杀），必须显式改标 */
};
delete newTask.completedAt;
delete newTask.result;
Api.submit(task.model, task.body).then(res => {
newTask.apiId = res.id;
const tasks = Store.getTasks();
tasks.unshift(newTask);
Store.saveTasks(tasks);
this._renderTask(newTask);
this._renderActiveTasks();
poller.start(newTask);
Toast.success(okMsg);
}).catch(e => Toast.error(e.message));
},
_regen(task) { /* W5 反馈②：重新生成=直接生成——不再回填表单（原 switchTab+renderParamForm 会覆盖当前表单），按原任务 body 原样重提 */
this._resubmit(task, "已按原参数直接重新生成");
},
_retryTask(task) {
this._resubmit(task, "已重新提交");
},
/* ── IMPL-138②/142 多选体系（独立 sel-bar 移除：批量操作=结果卡片下方 sv-floatbar 批量组；compareList=唯一选中集合） ── */
_toggleCompare(task) { this._toggleSelect(task); },
_toggleSelect(task) {
const idx = this.state.compareList.findIndex(t => t.id === task.id);
if (idx >= 0) {
this.state.compareList.splice(idx, 1);
if (!this.state.compareList.length) this.state.selMode = false; /* IMPL-142b：减选到 0 自动退出多选模式（防触屏死锁） */
} else {
if (this.state.compareList.length >= this.state.selMax) {
Toast.warning(`最多选择 ${this.state.selMax} 个（滑块对比建议 2 张）`);
return;
}
this.state.compareList.push(task);
Toast.info(this.state.selMode ? `多选模式 · 单击加选/减选（${this.state.compareList.length}/${this.state.selMax}）` : this.state.compareList.length === 1 ? "已选中 · 打开任一结果可批量 编辑 / 对比 / 下载" : `已选中（${this.state.compareList.length}/${this.state.selMax}）`); /* W5 反馈②：批量导出已移除 */
}
this._updateStripSelStates(); this._syncCardCmpBtn(); this._refreshFloatbarSel();
},
_clearSelection() { /* IMPL-142 建；W5 反馈②：批量组「清除」图标已删（减选出口=再点选中卡片/入夹收纳自动清空）——方法保留供文件夹收纳流调用 */
this.state.compareList = [];
this.state.selMode = false;
this._updateStripSelStates(); this._syncCardCmpBtn(); this._refreshFloatbarSel();
},
_refreshFloatbarSel() { /* IMPL-142c：查看器开着时仅重挂 sv-floatbar——批量组随选中集实时增减（构建时快照→实时） */
const cur = this.state.singleTaskId;
if (!cur || !document.querySelector(".sv-wrap")) return;
const t = [...Store.getTasks(), ...Store.getHistory()].find(x => x.id === cur);
if (!t) return;
const fresh = this._buildSingleView(t);
const bar = fresh.querySelector(".sv-floatbar");
const dock = $("#svDockLayer");
if (bar && dock) { dock.innerHTML = ""; dock.appendChild(bar); }
},
_updateStripSelStates() {
$$("#resultStrip .strip-thumb").forEach(el => el.classList.toggle("selected", this.state.compareList.some(t => t.id === el.dataset.tid)));
},
_syncCardCmpBtn() {
const cmpBtn = document.querySelector('#svDockLayer [data-act="compare"]');
if (cmpBtn) {
const on = this.state.compareList.some(t => t.id === this.state.singleTaskId);
cmpBtn.classList.toggle("on", on);
if (on) cmpBtn.setAttribute("aria-pressed", "true"); else cmpBtn.removeAttribute("aria-pressed");
cmpBtn.title = on ? "已在多选中" : "加入多选"; cmpBtn.setAttribute("aria-label", on ? "已在多选中" : "加入多选");
}
},
_downloadSelected() {
/* IMPL-138②：多选批量下载——复用 IMPL-101 并发池模式（3 并发 + 350ms 节流） */
const items = this.state.compareList.filter(t => t.status === "succeeded" && t.result?.url && (t.model?.type === "image" || t.model?.type === "video"));
if (!items.length) { Toast.warning("所选结果没有可下载的图片/视频"); return; }
if (items.length < this.state.compareList.length) Toast.info(`已跳过 ${this.state.compareList.length - items.length} 项非图片/视频`, 2600);
Toast.info(`开始批量下载 ${items.length} 项（并发 3）…`, 3000);
let ok = 0, bad = 0, idx = 0;
const worker = async () => {
while (idx < items.length) {
const it = items[idx++];
try { await this._downloadFile(it.result.url, `${it.model?.id || "workbench"}_${it.id}`); ok++; } catch (e) { bad++; }
await new Promise(r => setTimeout(r, 350));
}
};
Promise.all(Array.from({ length: Math.min(3, items.length) }, worker)).then(() => Toast[bad ? "warning" : "success"](`批量下载完成：成功 ${ok}${bad ? ` · 失败 ${bad}` : ""}`, 4200));
},
_weservProxy(u) { /* IMPL-160：_editSelected/_openEditor 双份 weserv 代理 lambda 收敛（IMPL-99：crossOrigin=anonymous 可导出，data: 直用） */
return (u.startsWith("data:") || u.startsWith("blob:")) ? u : u.startsWith("https://images.weserv.nl/") ? u + (u.includes("?") ? "&" : "?") + "_=" + Date.now() : "https://images.weserv.nl/?url=" + encodeURIComponent(u.replace(/^https?:\/\//, "")) + "&_=" + Date.now();
},
_studioGuard() { /* IMPL-160：编辑器打开前置守卫双份收敛（预载/R2 凭据/内核判空/回 image 页签），通过返回当前 model、被拒返回 null */
if (typeof window.StudioEditorPreload === "function") { try { window.StudioEditorPreload(); } catch (_) {} }
if (!Store.getR2WorkerUrl() || !Store.getR2AuthToken()) {
Toast.warning("编辑器需要 R2 凭据才能导出图 —— 请在 设置 → 密钥保险箱 解锁");
this._openSettings();
return null;
}
if (!window.StudioEditor) { Toast.error("编辑器组件未加载"); return null; }
if (!this.state.model || !this.state.model.params) this.switchTab("image");
return this.state.model;
},
_studioOnSave(model) { /* IMPL-160：编辑器 onSave 落卡 23 行双份收敛（Z5/IMPL-152 语义原样） */
return (dataURL, w, h) => {
try {
/* Z5（第六批）：「应用到节点」结果落结果区（修拍板）——不再写参考图区、不再回填原图、不再拼参考图提示词前缀 */
const card = {
id: genId(),
model: { type: "image", name: (model && model.name) || "编辑器", id: "studio-apply" },
prompt: "编辑器应用到节点",
status: "succeeded",
result: { url: dataURL, thumbUrl: dataURL },
createdAt: Date.now(),
completedAt: Date.now()
};
Store.addHistory(card);
this._renderResultStrip();
archiveDataUrlCard(card).catch(() => {}); /* IMPL-152：dataURL 产物转存 R2+512 缩略图（原 _preloadResult 对 data: 门控直返=永驻 LS 配额杀手，换专用帮手；双表回写+重渲染在帮手内） */
Toast.success("已保存到结果区");
return true;
} catch (err) {
console.error("onSave内部错误:", err.message, err.stack);
Toast.error("导出写入失败: " + err.message);
return true;
}
};
},
_editSelected() {
/* IMPL-138⑤：多选一起放入编辑器——open 参数前向携带 images:[url,…]（当前版编辑器忽略未知键仅载首张；对方接线 images 后即可多图同开） */
const items = this.state.compareList.filter(t => t.status === "succeeded" && t.result?.url && t.model?.type === "image");
if (!items.length) { Toast.warning("所选结果没有可编辑的图片"); return; }
const model = this._studioGuard();
if (!model) return;
const urls = items.map(t => this._weservProxy(t.result.url));
window.StudioEditor.open({
url: urls[0],
images: urls,
onSave: this._studioOnSave(model)
});
if (items.length > 1) Toast.info(`已把 ${items.length} 张图一起放入编辑器`, 3200); /* W5 反馈①：多图同开已落地（loadFiles 数组直载） */
},
/* ── IMPL-138④/142 结果文件夹（引用集合语义；IMPL-142 反馈2/3/4/5：同栏内嵌+无命名+拖拽新建+展开收敛+右键菜单） ── */
_loadFolders() {
try {
const v = JSON.parse(storageGet(CONFIG.STORAGE_KEYS.FOLDERS, "[]") || "[]");
this.state.folders = Array.isArray(v) ? v.filter(f => f && f.id && Array.isArray(f.ids)).map(f => ({ id: String(f.id), ids: f.ids.filter(x => typeof x === "string"), color: (typeof f.color === "string" && /^\d{1,3},\d{1,3},\d{1,3}$/.test(f.color)) ? f.color : undefined })) : []; /* IMPL-142：无命名结构 {id,ids}；IMPL-143 反馈②：color=r,g,b 元组（旧数据无 color=品牌蓝兜底） */
} catch (e) { this.state.folders = []; }
},
_saveFolders() {
try { storageSet(CONFIG.STORAGE_KEYS.FOLDERS, JSON.stringify(this.state.folders)); } catch (e) {}
},
_buildFolderEl(f, isOpen) { /* IMPL-142：文件夹图标（三层纸视觉；open=展开态纸片保持绽开） */
const el = document.createElement("div");
el.className = "rf-folder" + (isOpen ? " open" : "");
el.dataset.fid = f.id;
if (f.color) el.style.setProperty("--fc-rgb", f.color); /* IMPL-143 反馈②：per-folder 色 */
el.tabIndex = 0;
el.setAttribute("role", "button");
el.setAttribute("aria-label", (isOpen ? "文件夹（展开中），" : "文件夹，") + f.ids.length + " 项" + (isOpen ? "，点击收起" : "，点击展开"));
const tasks = [...Store.getTasks(), ...Store.getHistory()];
const typeOf = t => { const mty = t.model && t.model.type; if (mty === "video" || mty === "audio") return mty; const u = String(t.result?.url || ""); if (/\.(mp4|webm|mov)(\?|$)/i.test(u)) return "video"; if (/\.(mp3|wav|m4a|aac|ogg|flac)(\?|$)/i.test(u)) return "audio"; return "image"; }; /* IMPL-152（用户工单①）：封面类型判定——model.type 优先，URL 扩展名兜底 */
const thumbs = f.ids.map(id => tasks.find(t => t.id === id)).filter(t => t && t.status === "succeeded" && t.result?.url).slice(0, 3);
el.innerHTML = `<div class="rf-back"></div>` + [0, 1, 2].map(i => { const t = thumbs[2 - i]; if (!t) return `<div class="rf-paper p${i + 1}"></div>`; const ty = typeOf(t), u = t.result.thumbUrl || t.result.url; /* IMPL-152：封面按类型分派——video 无缩略图走 <video> metadata 首帧（复用结果条 L13565 范式），audio 音波 SVG（复用 .eqb 五柱）；原 <img> 对音视频必破图空白（音频 thumbUrl 恒无 L7576） */ const inner = ty === "audio" ? `<div class="rf-paper-audio"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect class="eqb e1" x="2.2" y="8.6" width="2.5" height="6.8" rx="1.25"/><rect class="eqb e2" x="6.5" y="5.2" width="2.5" height="13.6" rx="1.25"/><rect class="eqb e3" x="10.8" y="3.4" width="2.5" height="17.2" rx="1.25"/><rect class="eqb e4" x="15.1" y="6.4" width="2.5" height="11.2" rx="1.25"/><rect class="eqb e5" x="19.4" y="9.4" width="2.5" height="5.2" rx="1.25"/></svg></div>` : ty === "video" && !t.result.thumbUrl ? `<video src="${esc(u)}" muted preload="metadata" playsinline></video>` : `<img src="${esc(u)}" alt="" loading="lazy" referrerpolicy="no-referrer">`; return `<div class="rf-paper p${i + 1}">${inner}</div>`; }).join("") + `<div class="rf-front"></div><span class="rf-badge">${f.ids.length}</span>`; /* W5 反馈④：首图固定落最外层白页（p3 露白最多）——放入第 1 张即见，不再等三张 */
el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this._toggleFolder(f.id); } });
return el;
},
_toggleFolder(fid) { /* IMPL-142 反馈4：点击文件夹=展开（结果栏只显夹内成员、纸片绽开保持）/再点=收敛（外部结果恢复） */
this.state.openFolderId = this.state.openFolderId === fid ? null : fid;
this._renderResultStrip();
const f = this.state.folders.find(x => x.id === fid);
if (this.state.openFolderId && f) Toast.info(`已展开（${f.ids.length} 项）——再次点击文件夹收起`, 2200);
},
_folderCreateWith(tid) { /* IMPL-142 反馈3：拖到条尾幽灵=新建文件夹并收入（手机桌面成组交互，无命名） */
if (!tid) return;
this.state.folders.unshift({ id: genId(), ids: [tid], color: this._nextFolderColor() });
this._saveFolders(); this._renderResultStrip();
Toast.success("已新建文件夹并收入 1 项");
},
_nextFolderColor() { /* IMPL-143 反馈②：新文件夹取未占用色板色（不与已有撞色；色板避开品牌蓝；色尽轮转） */
const PAL = ["245,158,11", "244,63,94", "20,184,166", "168,85,247", "132,204,22", "249,115,22", "236,72,153", "139,92,246"];
const used = new Set(this.state.folders.map(f => f.color).filter(Boolean));
return PAL.find(c => !used.has(c)) || PAL[this.state.folders.length % PAL.length];
},
_folderCreateWithMulti(tids) { /* IMPL-143 反馈③：批量「放入文件夹→新建收纳」（多选集一次成夹，取未占用色） */
const ids = (tids || []).filter(Boolean);
if (!ids.length) return;
this.state.folders.unshift({ id: genId(), ids, color: this._nextFolderColor() });
this._saveFolders(); this._clearSelection(); this._renderResultStrip();
Toast.success(`已新建文件夹并收入 ${ids.length} 项`);
},
_folderAddMulti(fid, tids) { /* IMPL-143 反馈③：批量入夹（逐项去重，已入项跳过） */
const f = this.state.folders.find(x => x.id === fid);
if (!f) return;
let added = 0;
(tids || []).forEach(tid => { if (tid && !f.ids.includes(tid)) { f.ids.push(tid); added++; } });
if (!added) { Toast.info("所选结果均已在该文件夹中"); return; }
this._saveFolders(); this._clearSelection(); this._renderResultStrip();
Toast.success(`已收入文件夹（${f.ids.length}）`);
},
_openMoveToMenu(anchor) { /* IMPL-143 反馈③：floatbar「放入文件夹」——rf-menu 选择菜单（列已有文件夹+新建收纳；.context-menu 类→宿主 escHandler Esc 清单自动覆盖） */
const sel = this.state.compareList.map(t => t.id).filter(Boolean);
if (!sel.length) return;
let menu = $("#rfMenuMv");
if (!menu) {
menu = document.createElement("div");
menu.id = "rfMenuMv";
menu.className = "rf-menu context-menu";
menu.setAttribute("role", "menu");
menu.addEventListener("click", e => {
const b = e.target.closest("[data-mv]");
if (!b) return;
const act = b.dataset.mv;
const ids = this._mvSel || [];
this._closeMoveMenu();
if (act === "new") this._folderCreateWithMulti(ids); else if (act) this._folderAddMulti(act, ids);
});
document.body.appendChild(menu);
}
const items = this.state.folders.map((f, i) => `<button type="button" role="menuitem" data-mv="${esc(f.id)}"><i class="rf-mv-dot" style="background:rgb(${f.color || "var(--brand-rgb)"})"></i>文件夹 ${i + 1}<span class="rf-mv-n">${f.ids.length} 项</span></button>`).join("");
menu.innerHTML = (items || '<div class="rf-mv-empty">暂无文件夹</div>') + `<button type="button" role="menuitem" class="rf-mv-new" data-mv="new">新建文件夹收纳 ${sel.length} 项</button>`;
this._mvSel = sel;
menu.classList.add("show");
menu.style.left = "0px"; menu.style.top = "0px";
const r = anchor.getBoundingClientRect();
const mw = menu.offsetWidth, mh = menu.offsetHeight;
let x = Math.min(Math.max(8, r.left), window.innerWidth - mw - 8);
let y = r.bottom + 8;
if (y + mh > window.innerHeight - 8) y = Math.max(8, r.top - mh - 8);
menu.style.left = x + "px"; menu.style.top = y + "px";
setTimeout(() => {
const closer = ev => { if (!menu.contains(ev.target)) this._closeMoveMenu(); };
document.addEventListener("pointerdown", closer, true);
this._mvMenuCloser = closer;
}, 0);
},
_closeMoveMenu() {
const menu = $("#rfMenuMv");
if (menu) menu.classList.remove("show");
if (this._mvMenuCloser) { document.removeEventListener("pointerdown", this._mvMenuCloser, true); this._mvMenuCloser = null; }
},
_showStripGhost() { /* IMPL-142 反馈3：拖动缩略图期间，结果条尾浮现「新建文件夹」幽灵目标 */
if (this.state.openFolderId) return;
const strip = $("#resultStrip");
if (!strip || strip.querySelector(".rf-ghost")) return;
const g = document.createElement("div");
g.className = "rf-ghost";
g.setAttribute("aria-label", "拖放到此处新建文件夹");
g.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10v6"/><path d="M9 13h6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg><span>新建</span>`;
strip.appendChild(g);
},
_hideStripGhost() {
const g = document.querySelector("#resultStrip .rf-ghost");
if (g) g.remove();
},
_folderAdd(fid, tid) {
const f = this.state.folders.find(x => x.id === fid);
if (!f || !tid) return;
if (f.ids.includes(tid)) { Toast.info("该结果已在此文件夹中"); return; }
f.ids.push(tid);
this._saveFolders(); this._renderResultStrip(); /* IMPL-142：入夹即从外部结果区隐藏（同栏过滤） */
Toast.success(`已收入文件夹（${f.ids.length}）`);
},
_openFolderMenu(fid, anchor) { /* IMPL-142 反馈5：右键/长按菜单=解组+删除 两项（命名与抽屉已移除；.context-menu 类使宿主 escHandler 的 Esc 关闭清单自动覆盖） */
const f = this.state.folders.find(x => x.id === fid);
if (!f) return;
let menu = $("#rfMenu");
if (!menu) {
menu = document.createElement("div");
menu.id = "rfMenu";
menu.className = "rf-menu context-menu";
menu.setAttribute("role", "menu");
menu.addEventListener("click", e => {
const b = e.target.closest("[data-rfm]");
if (!b) return;
const id = this._rfMenuFid;
this._closeFolderMenu();
if (b.dataset.rfm === "ungroup") this._folderUngroup(id); else this._folderDeleteAll(id);
});
document.body.appendChild(menu);
}
menu.innerHTML = `<button type="button" role="menuitem" data-rfm="ungroup">解组 · 回到结果栏</button><button type="button" role="menuitem" class="danger" data-rfm="delete">删除 · 连同结果</button>`;
menu.classList.add("show");
this._rfMenuFid = fid;
menu.style.left = "0px"; menu.style.top = "0px";
const r = anchor.getBoundingClientRect();
const mw = menu.offsetWidth, mh = menu.offsetHeight;
let x = Math.min(Math.max(8, r.left), window.innerWidth - mw - 8);
let y = r.top - mh - 10;
if (y < 8) y = Math.min(r.bottom + 10, window.innerHeight - mh - 8);
menu.style.left = x + "px"; menu.style.top = y + "px";
setTimeout(() => {
const closer = ev => { if (!menu.contains(ev.target)) this._closeFolderMenu(); };
document.addEventListener("pointerdown", closer, true);
this._rfMenuCloser = closer;
}, 0);
},
_closeFolderMenu() {
const menu = $("#rfMenu");
if (menu) menu.classList.remove("show");
if (this._rfMenuCloser) { document.removeEventListener("pointerdown", this._rfMenuCloser, true); this._rfMenuCloser = null; }
},
_folderUngroup(fid) { /* IMPL-142 反馈5：解组=仅删文件夹壳，成员回到结果栏（引用集合语义，结果数据不动） */
const f = this.state.folders.find(x => x.id === fid);
if (!f) return;
const n = f.ids.length;
this.state.folders = this.state.folders.filter(x => x.id !== fid);
if (this.state.openFolderId === fid) this.state.openFolderId = null;
this._closeFolderMenu();
this._saveFolders(); this._renderResultStrip();
Toast.success(n ? `已解组——${n} 项结果回到结果栏` : "已解组");
},
_folderDeleteAll(fid) { /* IMPL-142 反馈5：删除=文件夹+成员结果一并删除（走 _deleteTask 原生管线：本地 tasks/history + 云同步） */
const f = this.state.folders.find(x => x.id === fid);
if (!f) return;
this._showModal("删除文件夹", `<div style="font-size:13px;color:var(--text);line-height:1.7">将删除该文件夹及其中 <b>${f.ids.length}</b> 项结果，<b>本地与云端同步一并删除，不可恢复</b>。仅想收回结果请用「解组」。</div>`, [
{ label: "取消", fn: () => {} },
{ label: "删除", primary: true, fn: () => {
const ids = [...f.ids];
this.state.folders = this.state.folders.filter(x => x.id !== fid);
if (this.state.openFolderId === fid) this.state.openFolderId = null;
this._closeFolderMenu();
this._saveFolders();
ids.forEach(id => this._deleteTask(id, { silent: true })); /* 本地+云同步（_syncHistoryToCloudNow 在 _deleteTask 内）；R97-3-1：静默避免 N 个 Toast */
this._renderResultStrip();
this._closeModal();
Toast.success(`文件夹及 ${ids.length} 项结果已删除`);
} }
]);
},
_showCompareGrid() {
const list = this.state.compareList.filter(t => t.result?.url);
if (!list.length) { Toast.warning("请先多选结果：底部缩略图 Ctrl+点击（触屏长按进入多选），或点卡片「加入多选」"); return; }
if (this.state.compareMode == null) this.state.compareMode = "slider";
if (list.length !== 2) this.state.compareMode = "grid";
$("#compareGrid").classList.add("show");
$("#compareGridInner").innerHTML = '<div class="cmp-loading"><span class="task-spinner"></span>载入图片…</div>';
this._cmpPreload(list).then(items => {
if (!$("#compareGrid").classList.contains("show")) return;
this._cmpItems = items;
this._cmpRender();
});
},
_cmpPreload(list) {
return Promise.all(list.map(t => new Promise(res => {
const img = new Image;
let settled = false;
const done = (w, h) => {
if (settled) return;
settled = true;
res({
url: t.result.url,
name: t.model?.name || "图片",
w: w || 1,
h: h || 1
});
};
img.onload = () => done(img.naturalWidth, img.naturalHeight);
img.onerror = () => done(160, 120);
img.src = t.result.url;
setTimeout(() => done(160, 120), 6e3);
})));
},
_cmpRender() {
const items = this._cmpItems || [];
const inner = $("#compareGridInner");
const n = items.length;
const mode = this.state.compareMode;
const availW = Math.max(280, window.innerWidth - 64);
const availH = Math.max(220, window.innerHeight - 200);
const toggle = n === 2 ? `<div class="cmp-toolbar"><button class="cmp-mode${mode === "slider" ? " active" : ""}" data-cmpmode="slider">滑块对比</button><button class="cmp-mode${mode === "grid" ? " active" : ""}" data-cmpmode="grid">并排对比</button></div>` : "";
let bodyHtml;
if (mode === "slider" && n === 2) {
const a = items[0], b = items[1];
const aA = a.w / a.h;
const boxW = Math.round(Math.min(availW, availH * aA, 1280));
const boxH = Math.round(boxW / aA);
bodyHtml = `<div class="cmp-slider" id="cmpSlider" tabindex="0" style="width:${boxW}px;height:${boxH}px" aria-label="滑块对比：拖动分割线或使用左右方向键">\n        <img class="cmp-img" src="${esc(b.url)}" alt="${esc(b.name)}">\n        <img class="cmp-img" id="cmpTop" src="${esc(a.url)}" alt="${esc(a.name)}" style="clip-path:inset(0 50% 0 0)">\n        <div class="cmp-divider" id="cmpDivider" style="left:50%"><div class="cmp-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 3 12 9 6"/><polyline points="15 6 21 12 15 18"/></svg></div></div>\n        <span class="cmp-tag cmp-tag-l">${esc(a.name)}</span>\n        <span class="cmp-tag cmp-tag-r">${esc(b.name)}</span>\n      </div>`;
} else {
const gaps = (n - 1) * 14;
const sumA = items.reduce((s, it) => s + it.w / it.h, 0);
const s = Math.min((availW - gaps) / sumA, availH, 560);
bodyHtml = `<div class="cmp-row" style="gap:14px">${items.map((it, i) => `<div class="cmp-cell" style="width:${Math.round(s * (it.w / it.h))}px;height:${Math.round(s)}px"><img src="${esc(it.url)}" alt="${esc(it.name)}"><span class="compare-label">${esc(it.name)} #${i + 1}</span></div>`).join("")}</div>`;
}
inner.innerHTML = toggle + bodyHtml;
if (mode === "slider" && n === 2) this._cmpBindSlider();
},
_cmpBindSlider() {
const slider = $("#cmpSlider");
const top = $("#cmpTop");
const divider = $("#cmpDivider");
if (!slider || !top || !divider) return;
const setPct = p => {
p = Math.max(0, Math.min(100, p));
top.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
divider.style.left = p + "%";
};
const posFromEvent = e => {
const rect = slider.getBoundingClientRect();
return (e.clientX - rect.left) / rect.width * 100;
};
let dragging = false;
slider.addEventListener("pointerdown", e => {
dragging = true;
try {
slider.setPointerCapture(e.pointerId);
} catch (err) {}
setPct(posFromEvent(e));
});
slider.addEventListener("pointermove", e => {
if (dragging) setPct(posFromEvent(e));
});
slider.addEventListener("pointerup", () => {
dragging = false;
});
slider.addEventListener("pointercancel", () => {
dragging = false;
});
slider.addEventListener("dblclick", () => setPct(50));
slider.addEventListener("keydown", e => {
const cur = parseFloat(divider.style.left) || 50;
if (e.key === "ArrowLeft") {
e.preventDefault();
setPct(cur - 3);
} else if (e.key === "ArrowRight") {
e.preventDefault();
setPct(cur + 3);
}
});
},
_celebrate(task) {
try {
const card = document.querySelector('#resultList [data-tid="' + task.id + '"]');
if (card) {
card.classList.add("fresh-reveal");
setTimeout(() => card.classList.remove("fresh-reveal"), 1500);
}
} catch (e) {}
AmbientFX.successPulse();
AmbientFX.illuminate(task.result?.thumbUrl || task.result?.url, task.model?.type);
},
_openLightbox(list, idx, isVideo, isAudio) {
this.state.lightboxList = list;
this.state.lightboxIdx = idx;
this.state.lightboxIsVideo = !!isVideo;
this.state.lightboxIsAudio = !!isAudio;
this._renderLightbox();
$("#lightbox").classList.add("show");
},
_findRecordByUrl(url) {
if (!url) return null;
const tasks = Store.getTasks();
const hist = Store.getHistory();
const _tids = new Set(tasks.map(t => t.id));
const all = [ ...tasks, ...hist.filter(h => !_tids.has(h.id)) ];
return all.find(t => t.result?.url === url || t.result?.thumbUrl === url || t.result?.originalUrl === url) || null;
},
_renderLightbox() {
const url = this.state.lightboxList[this.state.lightboxIdx];
if (!url) return;
const lbEl = $("#lightbox");
if (lbEl) lbEl.classList.toggle("lb-clip", !(this.state.lightboxIsVideo || this.state.lightboxIsAudio));
const prevWrap = $("#lbContent .lb-img-wrap");
if (prevWrap && prevWrap._lbCleanup) {
try {
prevWrap._lbCleanup();
} catch (e) {}
}
const isVideo = this.state.lightboxIsVideo;
const isAudio = this.state.lightboxIsAudio;
const rec = this._findRecordByUrl(url);
const n = this.state.lightboxList.length;
const pos = this.state.lightboxIdx + 1;
let mediaHtml;
if (isAudio) {
mediaHtml = `<div class="lb-audio-wrap"><div class="lb-audio-disc"><svg viewBox="0 0 24 24" fill='currentColor' width='52' height='52' aria-hidden='true'><rect class='eqb e1' x='2.2' y='8.6' width='2.5' height='6.8' rx='1.25'/><rect class='eqb e2' x='6.5' y='5.2' width='2.5' height='13.6' rx='1.25'/><rect class='eqb e3' x='10.8' y='3.4' width='2.5' height='17.2' rx='1.25'/><rect class='eqb e4' x='15.1' y='6.4' width='2.5' height='11.2' rx='1.25'/><rect class='eqb e5' x='19.4' y='9.4' width='2.5' height='5.2' rx='1.25'/></svg></div><audio src="${esc(url)}" controls autoplay style='max-width:360px;width:80vw'></audio></div>`;
} else if (isVideo) {
mediaHtml = `<video class="lb-art" src="${esc(url)}" controls autoplay playsinline></video>`;
} else {
const thumbUrl = rec?.result?.thumbUrl;
const origUrl = rec?.result?.url || url;
const fallbackUrl = rec?.result?.originalUrl || "";
const hasThumb = !!thumbUrl && thumbUrl !== origUrl;
mediaHtml = `<div class="lb-img-wrap">\n        ${hasThumb ? `<img class="lb-layer lb-art-base" src="${esc(thumbUrl)}" referrerpolicy="no-referrer" draggable="false" alt="">` : ""}\n        <img class="lb-layer lb-art-main" src="${esc(origUrl)}" referrerpolicy="no-referrer" decoding="async" fetchpriority="high" draggable="false" alt=""${hasThumb ? ' style="opacity:0"' : ""}${fallbackUrl && fallbackUrl !== origUrl ? ` data-fallback="${esc(fallbackUrl)}"` : ""}>\n        <div class="lb-progress"></div>\n        <div class="lb-loading"><span class="task-spinner"></span></div>\n        <div class="lb-note" style="display:none"></div>\n      </div>`;
}
const _lbShown = $("#lightbox").classList.contains("show");
$("#lbContent").innerHTML = `\n      <div class="lb-stage">\n        ${mediaHtml}\n      </div>`;
/* IMPL-90⑪：左右切换不弹跳——prev/next 重建 .lb-stage 会让 fade-in 入场动画逐次重放，
   舞台与悬浮工具栏每次「跳一下」（用户：悬浮栏固定不动、别出现弹跳）；
   仅首次打开（#lightbox 尚无 .show）播入场，切换帧内联禁用动画=视觉完全静止 */
if (_lbShown) { const _st = $("#lbContent .lb-stage"); if (_st) _st.style.animation = "none"; }
const tb = $("#lbToolbar");
tb.style.display = "flex";
/* IMPL-90⑪：工具栏按媒体类型缓存——相同 innerHTML 重复赋值仍是全量 DOM 重建
   （按钮 hover 态闪断），仅类型切换（图↔音视频）时重建一次 */
if (tb.dataset.tbKey !== ((isAudio || isVideo) ? "av" : "img")) {
tb.dataset.tbKey = (isAudio || isVideo) ? "av" : "img";
tb.innerHTML = (isAudio || isVideo ? "" : `\n      <div class="lb-tgroup">\n        <button class="lb-tbtn" data-lbt="zo" title="缩小" aria-label="缩小"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg></button>\n        <span class="lb-zoomval" id="lbZoomVal">100%</span>\n        <button class="lb-tbtn" data-lbt="zi" title="放大" aria-label="放大"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/></svg></button>\n        <button class="lb-tbtn" data-lbt="fit" title="适应窗口（双击同效）" aria-label="适应窗口"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg></button>\n        <button class="lb-tbtn" data-lbt="zr" title="原图 1:1" aria-label="原图 1:1">1:1</button>\n      </div>`) + `\n      <div class="lb-tgroup">\n        <button class="lb-tbtn" data-lbt="download" title="下载" aria-label="下载"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg></button>\n      </div>`;
}
let scale = 1, lx = 0, ly = 0;
const wrapEl = $("#lbContent .lb-img-wrap");
const zoomVal = $("#lbZoomVal");
const natW = () => parseFloat(wrapEl && wrapEl.dataset.nw || "0") || (wrapEl ? wrapEl.offsetWidth : 0);
const natH = () => parseFloat(wrapEl && wrapEl.dataset.nh || "0") || (wrapEl ? wrapEl.offsetHeight : 0);
const applyXf = () => {
if (!wrapEl) return;
const mx = Math.max(0, (natW() * scale - window.innerWidth) / 2 + 90);
const my = Math.max(0, (natH() * scale - window.innerHeight) / 2 + 90);
lx = Math.max(-mx, Math.min(mx, lx));
ly = Math.max(-my, Math.min(my, ly));
wrapEl.style.transform = `translate(${lx}px,${ly}px) scale(${scale})`;
wrapEl.style.transformOrigin = "center center";
if (zoomVal) zoomVal.textContent = Math.round(scale * 100) + "%";
};
const setScale = v => {
scale = Math.max(.05, Math.min(6, v));
applyXf();
};
const fitToScreen = () => {
const w = natW(), h = natH();
if (!w || !h) return;
scale = Math.max(.05, Math.min((window.innerWidth - 56) / w, (window.innerHeight - 150) / h, 1));
lx = 0;
ly = 0;
applyXf();
};
if (!isVideo && !isAudio) {
if (wrapEl) {
const setWrapSize = () => {
const ar = parseFloat(wrapEl.dataset.ar || "0");
const ratio = ar > .05 ? ar : 1.5;
const maxW = Math.min(window.innerWidth * .92, 1600);
const maxH = window.innerHeight * .8;
let h = maxH, w = h * ratio;
if (w > maxW) {
w = maxW;
h = w / ratio;
}
wrapEl.style.width = Math.round(w) + "px";
wrapEl.style.height = Math.round(h) + "px";
};
setWrapSize();
let arLocked = false;
const lockAr = (w, h, force) => {
if (!w || !h) return;
const r = w / h;
if (!arLocked || force) {
arLocked = true;
wrapEl.dataset.ar = String(r);
setWrapSize();
}
};
const baseImg = wrapEl.querySelector(".lb-art-base");
if (baseImg) {
if (baseImg.complete && baseImg.naturalWidth) lockAr(baseImg.naturalWidth, baseImg.naturalHeight); else baseImg.addEventListener("load", () => lockAr(baseImg.naturalWidth, baseImg.naturalHeight), {
once: true
});
}
const mainImg = wrapEl.querySelector(".lb-art-main");
const noteEl = wrapEl.querySelector(".lb-note");
const showNote = t => {
if (noteEl) {
noteEl.textContent = t;
noteEl.style.display = "";
}
};
const hideWaitUI = () => {
const l = wrapEl.querySelector(".lb-loading");
if (l) l.style.display = "none";
if (noteEl) noteEl.style.display = "none";
};
if (mainImg) {
const onMainLoad = () => {
lockAr(mainImg.naturalWidth, mainImg.naturalHeight, mainImg.naturalWidth / mainImg.naturalHeight !== parseFloat(wrapEl.dataset.ar || "0"));
wrapEl.dataset.nw = String(mainImg.naturalWidth);
wrapEl.dataset.nh = String(mainImg.naturalHeight);
mainImg.style.width = mainImg.naturalWidth + "px";
mainImg.style.height = mainImg.naturalHeight + "px";
wrapEl.classList.add("is-ready");
mainImg.style.opacity = "1";
hideWaitUI();
fitToScreen();
};
const onMainError = () => {
const fb = mainImg.dataset.fallback;
if (fb && !mainImg.dataset.fbTried && mainImg.src !== fb) {
mainImg.dataset.fbTried = "1";
mainImg.src = fb;
return;
}
hideWaitUI();
wrapEl.classList.add("is-ready");
if (baseImg) {
mainImg.style.display = "none";
showNote("原图已失效 · 当前为清晰缩略图");
} else showNote("图片加载失败，请稍后重试");
};
if (mainImg.complete && mainImg.naturalWidth > 0) onMainLoad(); else if (mainImg.complete && mainImg.naturalWidth === 0) onMainError(); else {
mainImg.addEventListener("load", onMainLoad, {
once: true
});
mainImg.addEventListener("error", onMainError, {
once: true
});
}
const timer = setTimeout(() => {
if (!wrapEl.classList.contains("is-ready")) showNote("原图加载较慢 · 先看清晰缩略图");
}, 8e3);
wrapEl._lbTimer = timer;
wrapEl.addEventListener("wheel", e => {
e.preventDefault();
const os = scale;
const ns = Math.max(.05, Math.min(6, scale * (e.deltaY > 0 ? .9 : 1.1)));
if (ns === os) return;
const r = wrapEl.getBoundingClientRect();
const k = ns / os - 1;
lx -= (e.clientX - (r.left + r.width / 2)) * k;
ly -= (e.clientY - (r.top + r.height / 2)) * k;
scale = ns;
applyXf();
}, {
passive: false
});
wrapEl.addEventListener("dblclick", () => fitToScreen());
let dragging = false, sx = 0, sy = 0;
wrapEl.addEventListener("mousedown", e => {
dragging = true;
sx = e.clientX - lx;
sy = e.clientY - ly;
wrapEl.style.cursor = "grabbing";
e.preventDefault();
});
const onMove = e => {
if (dragging) {
lx = e.clientX - sx;
ly = e.clientY - sy;
applyXf();
}
};
const onUp = () => {
if (dragging) {
dragging = false;
wrapEl.style.cursor = "";
}
};
document.addEventListener("mousemove", onMove);
document.addEventListener("mouseup", onUp);
let tPts = null;
const tDist = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
const onTouchStart = e => {
if (e.touches.length === 1) tPts = {
m: "pan",
x: e.touches[0].clientX,
y: e.touches[0].clientY
}; else if (e.touches.length >= 2) {
const a = e.touches[0], b = e.touches[1];
tPts = {
m: "z",
d: tDist(a, b),
x: (a.clientX + b.clientX) / 2,
y: (a.clientY + b.clientY) / 2
};
}
};
const onTouchMove = e => {
if (!tPts) return;
e.preventDefault();
if (e.touches.length >= 2) {
const a = e.touches[0], b = e.touches[1];
const d = tDist(a, b), cx = (a.clientX + b.clientX) / 2, cy = (a.clientY + b.clientY) / 2;
const ns = Math.max(.05, Math.min(6, scale * (d / (tPts.d || d))));
if (Math.abs(ns - scale) > 1e-4) {
const r = wrapEl.getBoundingClientRect();
const k = ns / scale - 1;
lx -= (cx - (r.left + r.width / 2)) * k;
ly -= (cy - (r.top + r.height / 2)) * k;
scale = ns;
}
lx += cx - tPts.x;
ly += cy - tPts.y;
tPts = {
m: "z",
d: d,
x: cx,
y: cy
};
} else if (tPts.m === "pan" && e.touches.length === 1) {
lx += e.touches[0].clientX - tPts.x;
ly += e.touches[0].clientY - tPts.y;
tPts.x = e.touches[0].clientX;
tPts.y = e.touches[0].clientY;
}
applyXf();
};
const onTouchEnd = e => {
if (e.touches.length === 1) tPts = {
m: "pan",
x: e.touches[0].clientX,
y: e.touches[0].clientY
}; else if (!e.touches.length) tPts = null;
};
wrapEl.addEventListener("touchstart", onTouchStart, {
passive: true
});
wrapEl.addEventListener("touchmove", onTouchMove, {
passive: false
});
wrapEl.addEventListener("touchend", onTouchEnd, {
passive: true
});
const clean = () => {
clearTimeout(timer);
document.removeEventListener("mousemove", onMove);
document.removeEventListener("mouseup", onUp);
window.removeEventListener("resize", setWrapSize);
wrapEl.removeEventListener("touchstart", onTouchStart);
wrapEl.removeEventListener("touchmove", onTouchMove);
wrapEl.removeEventListener("touchend", onTouchEnd);
};
wrapEl._lbCleanup = clean;
}
}
applyXf();
}
tb.onclick = e => {
const b = e.target.closest("[data-lbt]");
if (!b) return;
const act = b.dataset.lbt;
if (act === "zi") setScale(scale * 1.25); else if (act === "zo") setScale(scale / 1.25); else if (act === "fit") fitToScreen(); else if (act === "zr") {
scale = 1;
lx = 0;
ly = 0;
applyXf();
} else if (act === "download") this._downloadFile(url, rec ? `${rec.model?.id || "workbench"}_${rec.id || ""}` : "workbench_download");
};
},
_lbNav(dir) {
const n = this.state.lightboxList.length;
if (!n) return;
this.state.lightboxIdx = (this.state.lightboxIdx + dir + n) % n;
const url = this.state.lightboxList[this.state.lightboxIdx] || "";
const lower = url.toLowerCase();
this.state.lightboxIsVideo = /\.(mp4|webm|mov|m4v|ogv)(\?|$)/.test(lower);
this.state.lightboxIsAudio = /\.(mp3|wav|ogg|m4a|aac|flac)(\?|$)/.test(lower);
this._renderLightbox();
},
_closeLightbox() {
$("#lightbox").classList.remove("show");
const c = $("#lbContent");
const wrap = c && c.querySelector(".lb-img-wrap");
if (wrap && wrap._lbCleanup) {
try {
wrap._lbCleanup();
} catch (e) {}
}
c.innerHTML = "";
const tb = $("#lbToolbar");
if (tb) {
tb.style.display = "none";
tb.innerHTML = "";
delete tb.dataset.tbKey; /* IMPL-90⑪：清缓存标记，下次打开重建 */
tb.onclick = null;
}
},
renderHistoryBadge() {
const count = Store.getTasks().filter(t => t.status === "processing").length;
const badge = $("#historyBadge");
if (count) {
badge.textContent = count;
badge.classList.add("show");
} else badge.classList.remove("show");
},
_openHistory() {
this._toggleHistorySelectMode(false);
this.renderHistory();
$("#historySidebar").classList.add("show");
$("#historyOverlay").classList.add("show");
},
_closeHistory() {
this._toggleHistorySelectMode(false);
$("#historySidebar").classList.remove("show");
$("#historyOverlay").classList.remove("show");
},
_filteredHistory() {
let items = Store.getHistory().slice();
items.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || b.createdAt - a.createdAt);
if (this.state.historyFilter !== "all") items = items.filter(h => h.model?.type === this.state.historyFilter);
const timeCut = {
today: 864e5,
days7: 7 * 864e5,
days30: 30 * 864e5
}[this.state.historyTime] || 0;
if (timeCut) {
const now = Date.now();
items = items.filter(h => now - h.createdAt < timeCut);
}
if (this.state.historySearch) {
const q = this.state.historySearch.toLowerCase();
items = items.filter(h => (h.prompt || "").toLowerCase().includes(q) || (h.model?.name || "").toLowerCase().includes(q));
}
return items;
},
renderHistory() {
/* IMPL-95⑨：4.2 增量渲染——首屏 40 条+滚动接近底部追加 40（#historyList passive scroll），
   事件绑定改 #historyList 单委托（fav 点击→toggleFavorite+reset 重渲染：收藏组置顶随追加会漂移，必须 reset）；
   17 个调用点签名不变（全量重置语义）；批量操作/导入/清空/云同步走 reset 全量路径；缩略图 loader 已是捕获相委托天然兼容 */
const list = $("#historyList");
if (!list) return;
this._renderHistoryMeta();
this._histFiltered = this._histFlatten();
this._histRendered = 0;
this._bindHistoryDelegates(list);
if (!this._histFiltered.flat.length) {
list.innerHTML = '<div class="empty-state" style="padding:40px 20px"><div style="width:30px;height:30px;margin:0 auto 8px;opacity:.5" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg></div><div class="empty-sub">暂无历史记录</div><div style="font-size:10px;color:var(--text-dim);margin-top:4px;opacity:.8">生成的内容会自动保存在这里</div></div>';
return;
}
list.innerHTML = "";
this._renderHistoryChunk(40);
},
/* 4.2：过滤集→分组→扁平化（每项带组首/组尾标记，跨 chunk 组头只输出一次、组尾延迟闭合） */
_histFlatten() {
const items = this._filteredHistory();
const now = Date.now();
const groups = {
"收藏": [],
"今天": [],
"昨天": [],
"本周": [],
"更早": []
};
items.forEach(h => {
if (h.favorite) {
groups["收藏"].push(h);
return;
}
const age = now - h.createdAt;
if (age < 864e5) groups["今天"].push(h); else if (age < 2 * 864e5) groups["昨天"].push(h); else if (age < 7 * 864e5) groups["本周"].push(h); else groups["更早"].push(h);
});
const flat = [];
for (const [label, arr] of Object.entries(groups)) {
if (!arr.length) continue;
arr.forEach((h, idx) => flat.push({
h,
label,
count: arr.length,
first: idx === 0,
last: idx === arr.length - 1
}));
}
return { items, flat };
},
_histItemHTML(entry, selecting, sel) {
const h = entry.h;
let thumb = "";
if (h.result?.url) {
const t = h.model?.type;
const tUrl = h.result.thumbUrl || h.result.url;
if (t === "video") thumb = tUrl !== h.result.url ? `<img src="${esc(tUrl)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">` : `<video src="${esc(h.result.url)}" muted preload="metadata" playsinline></video>`; else if (t === "audio") thumb = `<div class="h-nothumb" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-dim)"><svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true"><rect class="eqb e1" x="2.2" y="8.6" width="2.5" height="6.8" rx="1.25"/><rect class="eqb e2" x="6.5" y="5.2" width="2.5" height="13.6" rx="1.25"/><rect class="eqb e3" x="10.8" y="3.4" width="2.5" height="17.2" rx="1.25"/><rect class="eqb e4" x="15.1" y="6.4" width="2.5" height="11.2" rx="1.25"/><rect class="eqb e5" x="19.4" y="9.4" width="2.5" height="5.2" rx="1.25"/></svg></div>`; else thumb = `<img src="${esc(tUrl)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
}
const statusClass = h.status === "succeeded" ? "" : 'style="opacity:.5"';
const starColor = h.favorite ? "var(--gold)" : "var(--text-dim)";
const check = selecting ? `<span class="h-check" aria-hidden="true">✓</span>` : "";
const picked = selecting && sel.has(h.id) ? " is-picked" : "";
return `<div class="history-item${picked}" data-hid="${esc(h.id)}" role="${selecting ? "checkbox" : "button"}" ${selecting ? `aria-checked="${sel.has(h.id)}" tabindex="0" aria-label="选择这条记录"` : ""} ${statusClass}>${check}<div class="h-thumb">${thumb}</div><div class="h-info"><div class="h-model">${esc(h.model?.name || "")}</div><div class="h-prompt">${esc(trunc(h.prompt, 40))}</div><div class="h-time">${fmtTime(h.createdAt)} <button class="fav-btn${h.favorite ? " faved" : ""}" data-fav="${esc(h.id)}" style="color:${starColor};background:none;border:none;cursor:pointer;padding:2px 4px;font-size:14px" aria-label="${h.favorite ? "取消收藏" : "收藏"}">${h.favorite ? '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" stroke="none" aria-hidden="true" style="vertical-align:-2px"><polygon points="12 2.5 14.9 8.6 21.5 9.5 16.7 14.2 17.9 20.8 12 17.6 6.1 20.8 7.3 14.2 2.5 9.5 9.1 8.6"/></svg>' : '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px"><polygon points="12 2.5 14.9 8.6 21.5 9.5 16.7 14.2 17.9 20.8 12 17.6 6.1 20.8 7.3 14.2 2.5 9.5 9.1 8.6"/></svg>'}</button></div></div></div>`;
},
_renderHistoryChunk(step) {
const list = $("#historyList");
const F = this._histFiltered;
if (!F || !F.flat.length) return;
const selecting = !!this.state.historySel;
const sel = this.state.historySel || new Set;
const start = this._histRendered || 0;
const end = Math.min(start + step, F.flat.length);
if (start >= end) return;
let html = "";
for (let i = start; i < end; i++) {
const e = F.flat[i];
if (e.first) html += `<div class="history-day-group"><div class="history-day-label" ${e.label === "收藏" ? 'style="color:var(--warning)"' : ""}>${e.label === "收藏" ? "★ " : ""}${e.label}（${e.count}）</div>`;
html += this._histItemHTML(e, selecting, sel);
if (e.last) html += "</div>";
}
if (start === 0) list.innerHTML = html; else list.insertAdjacentHTML("beforeend", html);
this._histRendered = end;
},
_bindHistoryDelegates(list) {
if (this._histDelegated === list) return;
this._histDelegated = list;
list.addEventListener("click", e => {
const fav = e.target.closest("[data-fav]");
if (fav) {
e.stopPropagation();
Store.toggleFavorite(fav.dataset.fav);
this.renderHistory();
return;
}
const item = e.target.closest("[data-hid]");
if (!item) return;
const h = Store.getHistory().find(x => x.id === item.dataset.hid);
if (!h) return;
if (this.state.historySel) this._historyTogglePick(h.id, item); else this._showHistoryDetail(h);
});
list.addEventListener("keydown", e => {
if (e.key !== "Enter" && e.key !== " ") return;
const item = e.target.closest("[data-hid]");
if (!item || !this.state.historySel) return;
e.preventDefault();
const h = Store.getHistory().find(x => x.id === item.dataset.hid);
if (h) this._historyTogglePick(h.id, item);
});
if (!this._histScrollBound) {
this._histScrollBound = true;
list.addEventListener("scroll", () => {
if (list.scrollTop + list.clientHeight >= list.scrollHeight - 200) {
if ((this._histRendered || 0) < (this._histFiltered?.flat.length || 0)) this._renderHistoryChunk(40);
}
}, { passive: true });
}
},
_toggleHistorySelectMode(force) {
const sb = $("#historySidebar");
if (!sb) return;
const on = force != null ? force : !sb.classList.contains("is-selecting");
sb.classList.toggle("is-selecting", on);
this.state.historySel = on ? new Set : null;
const btn = $("#historySelBtn");
if (btn) {
btn.classList.toggle("active", on);
btn.textContent = on ? "取消" : "选择";
btn.setAttribute("aria-pressed", String(on));
}
const bar = $("#historyBatchBar");
if (bar) bar.hidden = !on;
const title = $("#historyTitle");
if (title) title.textContent = on ? "选择记录" : "历史记录";
this._updateBatchBar();
if ($("#historySidebar")?.classList.contains("show") || on) this.renderHistory();
},
_updateBatchBar() {
const n = this.state.historySel ? this.state.historySel.size : 0;
const c = $("#historyBatchCount");
if (c) c.textContent = `已选 ${n} 项`;
},
_historyTogglePick(id, el) {
if (!this.state.historySel) return;
const s = this.state.historySel;
if (s.has(id)) {
s.delete(id);
el.classList.remove("is-picked");
el.setAttribute("aria-checked", "false");
} else {
s.add(id);
el.classList.add("is-picked");
el.setAttribute("aria-checked", "true");
}
this._updateBatchBar();
},
_historyBatchAll() {
if (!this.state.historySel) return;
const items = this._filteredHistory();
const allPicked = items.length && items.every(h => this.state.historySel.has(h.id));
if (allPicked) this.state.historySel.clear(); else items.forEach(h => this.state.historySel.add(h.id));
this.renderHistory();
this._updateBatchBar();
},
_historyBatchFav() {
if (!this.state.historySel || !this.state.historySel.size) {
Toast.info("请先选择记录");
return;
}
const ids = [ ...this.state.historySel ];
const arr = Store.getHistory();
const picked = arr.filter(h => ids.includes(h.id));
const favN = picked.filter(h => h.favorite).length;
const target = favN * 2 > picked.length ? false : true;
const n = Store.setFavoriteMany(ids, target);
this._syncHistoryToCloudNow();
this.renderHistory();
Toast.success(target ? `已收藏 ${n} 条` : `已取消 ${n} 条收藏`);
},
_historyBatchDelete() {
if (!this.state.historySel || !this.state.historySel.size) {
Toast.info("请先选择记录");
return;
}
const n = this.state.historySel.size;
this._showModal("批量删除", `<div style="font-size:13px;color:var(--text);line-height:1.6">确定删除选中的 <strong>${n}</strong> 条记录吗？<br><span style="font-size:11px;color:var(--text-dim)">删除后可在通知条内一键撤销。</span></div>`, [ {
label: "删除",
primary: true,
fn: () => {
const ids = [ ...this.state.historySel ];
const removed = Store.getHistory().filter(h => ids.includes(h.id));
Store.deleteHistoryMany(ids);
this._syncHistoryToCloudNow();
this.state.historySel.clear();
this.renderHistory();
this.renderHistoryBadge();
this._updateBatchBar();
this._closeModal();
Toast.success(`已删除 ${n} 条`, 8e3, {
label: "撤销",
fn: async () => {
const restored = await Store.restoreHistory(removed);
if (restored > 0) {
this._syncHistoryToCloudNow();
if ($("#historySidebar")?.classList.contains("show")) this.renderHistory();
this.renderHistoryBadge();
Toast.success(`已恢复 ${restored} 条记录`);
} else {
Toast.info("无需恢复（记录已存在）");
}
}
});
}
}, {
label: "取消",
fn: () => this._closeModal()
} ]);
},
_renderHistoryMeta() {
const all = Store.getHistory();
const favs = all.filter(h => h.favorite).length;
$$("#historyFilters [data-hcount]").forEach(el => {
const t = el.dataset.hcount;
const n = t === "all" ? all.length : all.filter(h => h.model?.type === t).length;
el.textContent = n > 0 ? String(n) : "";
});
const st = $("#historyStats");
if (st) st.textContent = all.length ? `共 ${all.length} 条 · ★ ${favs}` : "暂无记录";
},
_showHistoryDetail(h) {
const statusText = h.status === "succeeded" ? "成功" : h.status === "failed" ? "失败" : "超时";
let html = `<div class="kv-row"><div class="k">模型</div><div class="v">${esc(h.model?.name || "")}</div></div>`;
html += `<div class="kv-row"><div class="k">状态</div><div class="v">${statusText}</div></div>`;
html += `<div class="kv-row"><div class="k">时间</div><div class="v">${fmtTime(h.createdAt)}</div></div>`;
html += `<div class="kv-row"><div class="k">收藏</div><div class="v"><button id="detailFavBtn" style="background:none;border:none;cursor:pointer;font-size:16px;color:${h.favorite ? "var(--warning)" : "var(--text-dim)"}">${h.favorite ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="none" aria-hidden="true" style="vertical-align:-2px"><polygon points="12 2.5 14.9 8.6 21.5 9.5 16.7 14.2 17.9 20.8 12 17.6 6.1 20.8 7.3 14.2 2.5 9.5 9.1 8.6"/></svg> 已收藏' : '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px"><polygon points="12 2.5 14.9 8.6 21.5 9.5 16.7 14.2 17.9 20.8 12 17.6 6.1 20.8 7.3 14.2 2.5 9.5 9.1 8.6"/></svg> 点击收藏'}</button></div></div>`;
if (h.prompt) html += `<div class="kv-row"><div class="k">提示词</div><div class="v">${esc(h.prompt)}</div></div>`;
if (h.result?.url) {
const t = h.model?.type;
let mediaHtml = "";
if (t === "video") mediaHtml = `<video src="${esc(h.result.url)}" controls preload="metadata" style="max-width:100%;border-radius:10px;margin-top:6px"></video>`; else if (t === "audio") mediaHtml = `<audio src="${esc(h.result.url)}" controls style="width:100%;margin-top:6px"></audio>`; else mediaHtml = `<img src="${esc(h.result.url)}" loading="lazy" referrerpolicy="no-referrer" style="max-width:100%;max-height:300px;border-radius:10px;margin-top:6px;cursor:pointer" data-lightbox="${esc(h.result.url)}">`;
html += `<div class="kv-row"><div class="k">结果</div><div class="v">${mediaHtml}<div style="margin-top:4px"><a href="${esc(safeUrl(h.result.url))}" target="_blank" style="font-size:11px;color:var(--text-dim)">${esc(trunc(h.result.url, 60))}</a></div></div></div>`;
}
if (h.error) html += `<div class="kv-row"><div class="k">错误</div><div class="v" style="color:var(--danger)">${esc(h.error)}</div></div>`;
if (h.body) {
html += '<div style="margin-top:12px;font-size:12px;font-weight:600;color:var(--text-dim)">生成参数</div>';
for (const [k, v] of Object.entries(h.body)) {
if (k === "prompt" || k === "text") continue;
html += `<div class="kv-row"><div class="k">${esc(k)}</div><div class="v">${esc(Array.isArray(v) ? v.join(", ") : v)}</div></div>`;
}
}
const detailBtns = [ {
label: "复制工作流",
primary: true,
fn: () => Workflow.copy(h)
}, {
label: "再用参数",
fn: () => this._regen(h)
} ];
if (h.status === "succeeded" && h.result?.url && h.model?.type === "image") {
detailBtns.push({
label: "抠图",
fn: () => {
this._closeModal();
SegStudio.prefillAsModel(h);
}
});
}
detailBtns.push({
label: "关闭",
fn: () => this._closeModal()
});
this._showModal(`${h.model?.name || "详情"} · ${statusText}`, html, detailBtns);
setTimeout(() => {
const favBtn = $("#detailFavBtn");
if (favBtn) favBtn.addEventListener("click", () => {
Store.toggleFavorite(h.id);
this.renderHistory();
this._showHistoryDetail(Store.getHistory().find(x => x.id === h.id) || h);
});
const lbImg = $("#modalBody [data-lightbox]");
if (lbImg) lbImg.addEventListener("click", () => this._openLightbox([ lbImg.dataset.lightbox ], 0, false, false));
}, 50);
},
_exportHistory() {
const data = JSON.stringify(Store.getHistory(), null, 2);
const blob = new Blob([ data ], {
type: "application/json"
});
const a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = `workbench_history_${Date.now()}.json`;
a.click();
Toast.success("已导出");
},
_importHistory(file) {
if (!file) return;
if (file.size > 10 * 1024 * 1024) { Toast.error("导入失败：文件超过 10MB"); return; } /* IMPL-104（X-1）：超大文件解析卡死面 */
const reader = new FileReader;
reader.onload = e => {
try {
const raw = JSON.parse(e.target.result);
if (!Array.isArray(raw)) throw new Error("shape");
/* IMPL-104（X-1）：逐条白名单净化——只收已知字段、类型收紧、剔除原型键，阻断恶意档一键 XSS/注入 */
const arr = Store.getHistory();
const ids = new Set(arr.map(h => h.id));
let added = 0;
raw.slice(0, 2000).forEach(h => {
if (!h || typeof h !== "object" || Array.isArray(h)) return;
const id = typeof h.id === "string" && h.id.length <= 64 ? h.id : "";
if (!id || ids.has(id)) return;
let body = null;
if (h.body && typeof h.body === "object" && !Array.isArray(h.body)) {
body = {};
for (const k of Object.keys(h.body)) {
if (k === "__proto__" || k === "constructor" || k === "prototype") continue;
body[k] = h.body[k];
}
}
const r0 = h.result && typeof h.result === "object" && !Array.isArray(h.result) ? h.result : null;
arr.push({
id,
model: h.model && typeof h.model === "object" && !Array.isArray(h.model) ? {
id: String(h.model.id || "").slice(0, 80),
name: String(h.model.name || "").slice(0, 80),
type: String(h.model.type || "").slice(0, 16)
} : null,
prompt: typeof h.prompt === "string" ? h.prompt.slice(0, 4000) : "",
body,
status: ["succeeded", "failed", "timeout", "stopped"].includes(h.status) ? h.status : "succeeded",
result: r0 ? {
url: typeof r0.url === "string" ? r0.url.slice(0, 4000) : "",
originalUrl: typeof r0.originalUrl === "string" ? r0.originalUrl.slice(0, 4000) : undefined
} : null,
error: typeof h.error === "string" ? h.error.slice(0, 300) : undefined,
favorite: h.favorite === true,
createdAt: Number.isFinite(h.createdAt) ? h.createdAt : Date.now(),
completedAt: Number.isFinite(h.completedAt) ? h.completedAt : undefined,
cost: Number.isFinite(h.cost) ? h.cost : undefined
});
ids.add(id);
added++;
});
while (arr.length > 500) arr.pop();
arr.sort((a, b) => b.createdAt - a.createdAt);
Store.saveHistory(arr);
this.renderHistory();
Toast.success(added ? `已导入 ${added} 条` : "没有可导入的新记录");
} catch {
Toast.error("导入失败：文件格式错误");
}
};
reader.readAsText(file);
},
_showClearHistoryOptions() {
const html = `<div style="display:flex;flex-direction:column;gap:8px">\n      <button class="pp-option" data-clear="failed" style="padding:12px;border-radius:10px;background:var(--surface-2);color:var(--text);font-size:13px">清除失败记录</button>\n      <button class="pp-option" data-clear="days7" style="padding:12px;border-radius:10px;background:var(--surface-2);color:var(--text);font-size:13px">清除 7 天前的记录</button>\n      <button class="pp-option" data-clear="all" style="padding:12px;border-radius:10px;background:var(--danger-soft);color:var(--danger);font-size:13px">清除全部记录</button>\n    </div>`;
this._showModal("清理历史", html);
$$("#modalBody [data-clear]").forEach(btn => btn.addEventListener("click", () => {
const type = btn.dataset.clear;
Store.clearHistory({
[type]: true
});
this._syncHistoryToCloudNow();
this.renderHistory();
this.renderHistoryBadge();
this._closeModal();
Toast.success("已清理");
}));
},
_confirmCleanLocal() {
const html = `<div style="font-size:13px;line-height:1.7;color:var(--text-muted)">\n      将清除：历史记录、任务、提示词历史、预设、缩略图缓存。<br>\n      保留：密钥保险箱、偏好设置。\n    </div>`;
this._showModal("清理本地数据", html, [ {
label: "取消",
fn: () => this._closeModal()
}, {
label: "确认清理",
primary: true,
fn: () => {
try {
[ "sc_history", "sc_tasks", "sc_prompt_history", "sc_presets" ].forEach(k => {
try {
localStorage.removeItem(k);
} catch (e) {}
});
try {
sessionStorage.clear();
} catch (e) {}
if (typeof IDB !== "undefined" && IDB.db) {
Promise.allSettled([ IDB.db.history.clear(), IDB.db.tasks.clear(), IDB.db.thumbs.clear() ]).catch(() => {});
}
this._preloadCache.clear?.();
} catch (e) {
console.warn("[cleanLocal]", e);
}
Store.saveTasks([]);
Store.saveHistory([]);
this._renderTaskList();
this._renderResultStrip();
this.renderHistoryBadge();
this._closeModal();
Toast.success("本地数据已清理");
}
} ]);
},
_confirmCleanCloud() {
const c = this._histCloudBase();/* IMPL-125 B'：清理入口同样 R2 兜底 */
if (!c) {
Toast.info("未配置云端同步——解锁保险箱或配置任务中心后可用");
return;
}
const html = `<div style="font-size:13px;line-height:1.7;color:var(--text-muted)">\n      将清空云端的：历史记录同步数据。<br>\n      R2 媒体文件（results/refs/thumbs）需在 Worker 端清理，本页不动。\n    </div>`;
this._showModal("清理云端", html, [ {
label: "取消",
fn: () => this._closeModal()
}, {
label: "确认清空",
primary: true,
fn: async () => {
this._closeModal();
try {
await fetch(c.base + "/userdata?key=history&token=" + encodeURIComponent(c.token), {
method: "PUT",
headers: {
"Content-Type": "application/json"
},
body: "[]"
});
Toast.success("云端历史已清空");
} catch (e) {
Toast.error("清理失败：" + (e.message || "网络错误"));
}
}
} ]);
},
_showStats() {
this._statsView = "cost";
/* 77-b Q5/Q6：⟳强制同步按钮移除（打开即自动全量同步 _statsAutoSync）；顶层「消费 / API 用量」主 tab 与范围 tab 一行两段式；弹窗加宽 stats-modal-content */
const html = `<div class="stats-topbar"><div class="stats-mtabs" id="statsMainTabs"><button class="stats-mtab active" data-view="cost">消费</button><button class="stats-mtab" data-view="api">API 用量</button></div><div class="stats-tabs" id="statsTabs"><button class="stats-tab active" data-range="today">今天</button><button class="stats-tab" data-range="week">本周</button><button class="stats-tab" data-range="month">本月</button><button class="stats-tab" data-range="all">全部</button></div></div><div class="stats-sync-row"><span class="stats-sync-state" id="statsSyncState">云端同步中…</span></div><div id="statsContent"></div>`;
this._showModal("消费统计", html);
$("#modalOverlay .modal-content")?.classList.add("stats-modal-content");
$$("#statsMainTabs .stats-mtab").forEach(t => t.addEventListener("click", () => {
$$("#statsMainTabs .stats-mtab").forEach(x => x.classList.remove("active"));
t.classList.add("active");
this._statsView = t.dataset.view;
this._renderStatsContent($("#statsTabs .stats-tab.active")?.dataset.range || "today");
}));
$$("#statsTabs .stats-tab").forEach(t => t.addEventListener("click", () => {
$$("#statsTabs .stats-tab").forEach(x => x.classList.remove("active"));
t.classList.add("active");
this._renderStatsContent(t.dataset.range);
}));
this._renderStatsContent("today");
this._statsAutoSync();
},
/* ── 统计云端同步（IMPL-68）：云端槽位 = /userdata?key=history，与历史同步同源同合并 ── */
async _statsCloudBase() {
if (typeof TaskCenter !== "undefined" && TaskCenter.isAvailable()) return { base: TaskCenter.workerUrl, token: TaskCenter.token };
const r2Url = (Store.getR2WorkerUrl() || "").trim().replace(/\/$/, "");
const r2Tok = (Store.getR2AuthToken() || "").trim();
return r2Url && r2Tok ? { base: r2Url, token: r2Tok } : null;
},
async _statsPullCloud() {
const c = await this._statsCloudBase();
if (!c) return { ok: false, reason: "unavailable" };
const res = await fetch(c.base + "/userdata?key=history&token=" + encodeURIComponent(c.token));
const data = await res.json();
if (!(data && data.ok && Array.isArray(data.data))) return { ok: false, reason: "empty" };
const local = Store.getHistory();
const fresh = data.data.filter(x => x && x.id && !local.some(l => l.id === x.id)).length;
/* ★ R91-D：反向计数 —— 本机有、云端没有的条数。此前只报"云端 N 条"，
   用户看到数字不对时无从判断是「没拉到」还是「没推上去」。 */
const localOnly = local.filter(x => x && x.id && !data.data.some(c => c.id === x.id)).length;
const merged = this._mergeHistory(local, data.data);
Store.saveHistory(merged);
return { ok: true, cloud: data.data.length, fresh, localOnly, local: merged.length };
},
/* ── 77-b Q5：打开统计即全量同步（拉+推一体）——append-only 按 id 去重合并后 PUT 全量（≤500 条），幂等安全；
双端并发 = 后写者胜 + 记录并集不减（各自本地保有全量，下轮同步自动补齐，论证见 77-b 报告）。
无云端配置 → 状态行「未配置云端同步 · 仅本机数据」；失败仅状态行红字不上 Toast（自动行为不打扰）。云端为空（首次上云）也照常推送本地。 ── */
async _statsAutoSync() {
const st = $("#statsSyncState");
if (!st) return;
const c = await this._statsCloudBase();
if (!c) { st.textContent = "未配置云端同步 · 仅本机数据"; st.style.color = ""; return; }
st.textContent = "云端同步中…";
st.style.color = "";
let cloud = 0, fresh = 0, localOnly = 0, err = null;
try {
const pull = await this._statsPullCloud();
if (pull.ok) {
cloud = pull.cloud;
fresh = pull.fresh;
localOnly = pull.localOnly || 0;
this._renderResultStrip();
if (typeof this.renderHistoryBadge === "function") this.renderHistoryBadge();
const cur = $("#statsTabs .stats-tab.active");
if (cur) this._renderStatsContent(cur.dataset.range);
} else if (pull.reason !== "empty") {
throw new Error(pull.reason === "unavailable" ? "未配置 R2 图床 / 任务中心（解锁保险箱后可用）" : "云端暂无同步数据");
}
const c2 = await this._statsCloudBase();
const hist = Store.getHistory();
await fetch(c2.base + "/userdata?key=history&token=" + encodeURIComponent(c2.token), {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(hist.slice(0, 500))
});
st.textContent = `已同步 · 云端 ${cloud} 条 · 本机 ${hist.length} 条` + (fresh ? ` · 拉回 ${fresh} 条` : "") + (localOnly ? ` · 补传 ${localOnly} 条` : "");
st.style.color = "var(--success)";
} catch (e) {
err = e;
}
if (err) {
st.textContent = "同步失败：" + (err.message || "网络错误");
st.style.color = "var(--danger)";
}
},
_renderStatsContent(range) {
/* 77-b Q6：主 tab 分发——消费（默认）/ API 用量两视图共用同一范围 tab */
if (this._statsView === "api") return this._renderApiView(range);
const history = Store.getHistory();
const now = Date.now();
const ranges = {
today: 864e5,
week: 7 * 864e5,
month: 30 * 864e5,
all: Infinity
};
const cut = now - ranges[range];
const filtered = history.filter(h => h.createdAt >= cut);
const okItems = filtered.filter(h => h.status === "succeeded");
const total = okItems.reduce((s, h) => s + (h.cost || 0), 0);
const rate = filtered.length ? Math.round(okItems.length / filtered.length * 100) : 100;
const days = range === "all" ? Math.max(1, Math.ceil((now - Math.min(now, ...history.map(h => h.createdAt || now))) / 864e5)) : Math.round(ranges[range] / 864e5);
const byType = {
image: 0,
video: 0,
audio: 0
};
const byModel = {};
okItems.forEach(h => {
byType[h.model?.type] = (byType[h.model?.type] || 0) + (h.cost || 0);
const mn = h.model?.name || "未知";
byModel[mn] = (byModel[mn] || 0) + (h.cost || 0);
});
const modelRows = Object.entries(byModel).sort((a, b) => b[1] - a[1]);
const maxModel = Math.max(1, ...modelRows.map(r => r[1]));
let html = `<div class="stats-kpis"><div class="stats-card"><div class="sc-label">总消费</div><div class="sc-value">¥${total.toFixed(2)}</div></div><div class="stats-card"><div class="sc-label">任务 / 成功</div><div class="sc-value">${filtered.length}<span class="unit">/${okItems.length}</span></div></div><div class="stats-card"><div class="sc-label">成功率</div><div class="sc-value">${rate}<span class="unit">%</span></div></div><div class="stats-card"><div class="sc-label">日均消费</div><div class="sc-value">¥${(total / days).toFixed(2)}</div></div></div>`;
html += this._buildTrendChartHTML(history);
html += `<div class="stats-split"><div class="stats-pane"><div class="stats-h">类型分布</div>${this._buildDonutHTML(byType, total)}</div><div class="stats-pane"><div class="stats-h">按模型消费</div>` + (modelRows.length ? modelRows.map(([m, c]) => `<div class="stats-bar-row"><div class="sbr-label"><span>${esc(m)}</span><span>¥${c.toFixed(2)} · ${total ? Math.round(c / total * 100) : 0}%</span></div><div class="sbr-bar"><div class="sbr-fill" style="width:${c / maxModel * 100}%"></div></div></div>`).join("") : `<div class="stats-empty">暂无数据</div>`) + `</div></div>`;
html += `<div class="energy-card slim"><div class="ec-left"><span class="ec-title">补充能量</span><span class="ec-sub">支持开发者持续优化</span></div><button class="ec-btn" id="energyPayBtn">微信支付</button></div>`;
$("#statsContent").innerHTML = html;
$("#energyPayBtn")?.addEventListener("click", () => this._openEnergyPayment());
},
_buildTrendChartHTML(history) {
const days = [];
const today = new Date;
today.setHours(0, 0, 0, 0);
for (let i = 6; i >= 0; i--) {
const start = today.getTime() - i * 864e5;
days.push({
start: start,
end: start + 864e5,
cost: 0,
count: 0
});
}
(Array.isArray(history) ? history : []).forEach(h => {
if (!h || typeof h.createdAt !== "number") return;
const d = days.find(x => h.createdAt >= x.start && h.createdAt < x.end);
if (!d) return;
d.count++;
if (h.status === "succeeded") d.cost += h.cost || 0;
});
const max = Math.max(.01, ...days.map(d => d.cost));
const W = 600, H = 150, padL = 10, padB = 24, padT = 22;
const col = (W - padL * 2) / 7, bw = 36;
const baseY = H - padB;
const dayLabel = (d, i) => {
if (i === 6) return "今天";
if (i === 5) return "昨天";
const dt = new Date(d.start);
return `${dt.getMonth() + 1}/${dt.getDate()}`;
};
const barPath = (x, y, w, h, r) => {
const rr = Math.min(r, w / 2, h);
return `M${x.toFixed(1)} ${(y + h).toFixed(1)} L${x.toFixed(1)} ${(y + rr).toFixed(1)} Q${x.toFixed(1)} ${y.toFixed(1)} ${(x + rr).toFixed(1)} ${y.toFixed(1)} L${(x + w - rr).toFixed(1)} ${y.toFixed(1)} Q${(x + w).toFixed(1)} ${y.toFixed(1)} ${(x + w).toFixed(1)} ${(y + rr).toFixed(1)} L${(x + w).toFixed(1)} ${(y + h).toFixed(1)} Z`;
};
/* 77-b Q6：catmull-rom → 三次贝塞尔平滑折线（端点钳位），骑柱顶连成「面积+柱」复合层 */
const pts = days.map((d, i) => ({ x: padL + i * col + col / 2, y: baseY - Math.min(baseY - padT, d.cost / max * (baseY - padT)) }));
const cmr = p => {
if (p.length < 2) return "";
let s = `M${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
for (let i = 0; i < p.length - 1; i++) {
const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
s += ` C${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)} ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
}
return s;
};
const linePath = cmr(pts);
const areaPath = linePath + ` L${pts[6].x.toFixed(1)} ${baseY.toFixed(1)} L${pts[0].x.toFixed(1)} ${baseY.toFixed(1)} Z`;
const bars = days.map((d, i) => {
const x = padL + i * col + (col - bw) / 2;
const isToday = i === 6;
const band = `<rect class="trend-band" x="${(padL + i * col).toFixed(1)}" y="${padT - 6}" width="${col.toFixed(1)}" height="${(baseY - padT + 6).toFixed(1)}"></rect>`;
if (d.cost > 0) {
const hVal = Math.max(3, d.cost / max * (baseY - padT));
const y = baseY - hVal;
const valText = d.cost >= 100 ? d.cost.toFixed(0) : d.cost.toFixed(1);
return `<g class="trend-col"><title>${dayLabel(d, i)}：¥${d.cost.toFixed(2)} · ${d.count} 个任务</title>` + band + `<path class="trend-bar${isToday ? " today" : ""}" d="${barPath(x, y, bw, hVal, 5)}" style="animation-delay:${i * 45}ms"></path>` + `<text class="trend-val" x="${(x + bw / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle">¥${valText}</text>` + `<text class="trend-lbl${isToday ? " today" : ""}" x="${pts[i].x.toFixed(1)}" y="${H - 7}" text-anchor="middle">${dayLabel(d, i)}</text></g>`;
}
return `<g class="trend-col"><title>${dayLabel(d, i)}：无消费 · ${d.count} 个任务</title>` + band + `<circle class="trend-dot" cx="${pts[i].x.toFixed(1)}" cy="${(baseY - 2).toFixed(1)}" r="2"></circle>` + `<text class="trend-lbl${isToday ? " today" : ""}" x="${pts[i].x.toFixed(1)}" y="${H - 7}" text-anchor="middle">${dayLabel(d, i)}</text></g>`;
}).join("");
return `<div class="stats-h">7 日消费趋势</div>` + `<div class="trend-chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="最近 7 天每日消费趋势（面积+柱复合图）">` + `<defs><linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">` + `<stop offset="0" stop-color="var(--brand)"/><stop offset="1" stop-color="var(--brand)" stop-opacity=".22"/>` + `</linearGradient><linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">` + `<stop offset="0" stop-color="var(--brand)" stop-opacity=".28"/><stop offset="1" stop-color="var(--brand)" stop-opacity="0"/>` + `</linearGradient></defs><path class="trend-area" d="${areaPath}"/><path class="trend-line" d="${linePath}"/>${bars}</svg></div>`;
},
/* ── 77-b Q6：类型分布 donut（SVG stroke-dasharray 环图，无外部库）── */
_buildDonutHTML(byType, total) {
const colors = { image: "var(--brand)", video: "var(--success)", audio: "var(--warning)" };
const entries = Object.entries(byType).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]);
if (!entries.length) return `<div class="stats-empty">暂无数据</div>`;
const label = t => t in colors ? typeName(t) : "其他";
const R = 34, C = 2 * Math.PI * R;
let off = 0;
const segs = entries.map(([t, c]) => {
const frac = total ? c / total : 0;
const len = Math.max(0, frac * C - 2);
const seg = `<circle class="donut-seg" cx="40" cy="40" r="${R}" fill="none" stroke="${colors[t] || "var(--text-dim)"}" stroke-width="12" stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 40 40)"><title>${label(t)}：¥${c.toFixed(2)} · ${Math.round(frac * 100)}%</title></circle>`;
off += frac * C;
return seg;
}).join("");
const legend = entries.map(([t, c]) => `<div class="donut-lg"><i class="donut-dot" style="background:${colors[t] || "var(--text-dim)"}"></i><span class="donut-name">${label(t)}</span><span class="donut-amt">¥${c.toFixed(2)}</span><span class="donut-pct">${total ? Math.round(c / total * 100) : 0}%</span></div>`).join("");
return `<div class="donut-wrap"><svg viewBox="0 0 80 80" class="donut-svg" role="img" aria-label="类型消费占比环形图">${segs}<text class="donut-total" x="40" y="38" text-anchor="middle">${total >= 100 ? "¥" + Math.round(total) : "¥" + total.toFixed(2)}</text><text class="donut-cap" x="40" y="50" text-anchor="middle">合计</text></svg><div class="donut-legend">${legend}</div></div>`;
},
/* ── 77-b Q6：LLM API 用量聚合——按范围出 per-model {calls,tokens,errors} + 7 日调用趋势 ── */
_llmAgg(range) {
const ranges = { today: 864e5, week: 7 * 864e5, month: 30 * 864e5, all: Infinity };
const cut = Date.now() - (ranges[range] || 864e5);
const rows = Store.getLlmUsage().filter(r => r && typeof r.t === "number" && r.t >= cut);
const byModel = {};
const days = [];
const today = new Date;
today.setHours(0, 0, 0, 0);
for (let i = 6; i >= 0; i--) {
const start = today.getTime() - i * 864e5;
days.push({ start: start, end: start + 864e5, calls: 0, fails: 0 });
}
rows.forEach(r => {
const b = byModel[r.model || "auto"] = byModel[r.model || "auto"] || { calls: 0, tokens: 0, errors: 0 };
b.calls++;
if (r.ok) b.tokens += (r.p || 0) + (r.c || 0); else b.errors++;
const d = days.find(x => r.t >= x.start && r.t < x.end);
if (d) { d.calls++; if (!r.ok) d.fails++; }
});
return { rows: rows, byModel: byModel, days: days, calls: rows.length, tokens: rows.reduce((s, r) => s + (r.ok ? (r.p || 0) + (r.c || 0) : 0), 0), errors: rows.filter(r => !r.ok).length, recent: rows.filter(r => r.t >= Date.now() - 864e5).length };
},
_renderApiView(range) {
const agg = this._llmAgg(range);
const fmtTok = n => n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "k" : String(n || 0);
const rate = agg.calls ? Math.round((agg.calls - agg.errors) / agg.calls * 100) : 100;
let html = `<div class="stats-kpis"><div class="stats-card"><div class="sc-label">总调用</div><div class="sc-value">${agg.calls}</div></div><div class="stats-card"><div class="sc-label">总 Tokens</div><div class="sc-value">${fmtTok(agg.tokens)}</div></div><div class="stats-card"><div class="sc-label">24h 调用</div><div class="sc-value">${agg.recent}</div></div><div class="stats-card"><div class="sc-label">成功率</div><div class="sc-value">${rate}<span class="unit">%</span></div></div></div>`;
const mx = Math.max(1, ...agg.days.map(x => x.calls));
html += `<div class="stats-h">7 日调用趋势</div><div class="au-bars">` + agg.days.map((d, i) => {
const dt = new Date(d.start);
const lbl = i === 6 ? "今天" : i === 5 ? "昨天" : `${dt.getMonth() + 1}/${dt.getDate()}`;
const h = d.calls ? Math.max(4, Math.round(d.calls / mx * 44)) : 0;
return `<div class="au-bar${d.calls ? "" : " au-zero"}"><i style="height:${h}px;animation-delay:${i * 40}ms" title="${lbl}：${d.calls} 次${d.fails ? " · 失败 " + d.fails : ""}"></i><span>${lbl}</span></div>`;
}).join("") + `</div>`;
const modelRows = Object.entries(agg.byModel).sort((a, b) => b[1].calls - a[1].calls);
const mMax = Math.max(1, ...modelRows.map(r => r[1].calls));
html += `<div class="stats-h">按模型用量</div>` + (modelRows.length ? modelRows.map(([m, b]) => {
const short = m.includes(":") ? m.slice(m.indexOf(":") + 1) : m;
return `<div class="stats-bar-row"><div class="sbr-label" title="${esc(m)}"><span>${esc(short)}</span><span>${b.calls} 次 · ${fmtTok(b.tokens)} tok${b.errors ? ` · 失败 ${b.errors}` : ""}</span></div><div class="sbr-bar"><div class="sbr-fill" style="width:${b.calls / mMax * 100}%"></div></div></div>`;
}).join("") : `<div class="stats-empty">暂无调用记录——技能 / 讨论 / 识图的每次 LLM 调用会自动记入</div>`);
const recentRows = agg.rows.slice(-8).reverse();
/* IMPL-99：媒体模型调用区块——history 全量聚合（直连 8 模型 / 速创 / 抠图等全部自动计入） */
const _mdRanges = { today: 864e5, week: 7 * 864e5, month: 30 * 864e5, all: Infinity };
const _mdCut = Date.now() - (_mdRanges[range] != null ? _mdRanges[range] : 864e5);
const mdHist = Store.getHistory().filter(h => h && h.model && h.model.name && (h.createdAt || 0) >= _mdCut);
const mdAgg = {};
mdHist.forEach(h => {
const k = h.model.name;
mdAgg[k] = mdAgg[k] || { calls: 0, errors: 0, ok: 0 };
mdAgg[k].calls++;
if (h.status === "succeeded") mdAgg[k].ok++;
else mdAgg[k].errors++;
});
const mdRows = Object.entries(mdAgg).sort((a, b) => b[1].calls - a[1].calls);
const mdMax = Math.max(1, ...mdRows.map(r => r[1].calls));
const mdCost = m => mdHist.filter(x => x.model?.name === m).reduce((s, x) => s + (x.cost || 0), 0);
html += `<div class="stats-h">媒体模型调用（含直连模型）</div>` + (mdRows.length ? mdRows.map(([m, b]) => `<div class="stats-bar-row"><div class="sbr-label" title="${esc(m)}"><span>${esc(m)}</span><span>${b.calls} 次${b.errors ? ` · 失败 ${b.errors}` : ""} · ¥${mdCost(m).toFixed(2)}</span></div><div class="sbr-bar"><div class="sbr-fill" style="width:${b.calls / mdMax * 100}%"></div></div></div>`).join("") : `<div class="stats-empty">暂无媒体调用记录</div>`);
const mdRecent = mdHist.slice(-8).reverse();
html += `<div class="stats-h">最近媒体调用</div><div class="au-table-wrap"><table class="au-table"><thead><tr><th>时间</th><th>模型</th><th>耗时</th><th>结果</th></tr></thead><tbody>` + (mdRecent.length ? mdRecent.map(r => {
const dur = (r.completedAt && r.createdAt) ? ((r.completedAt - r.createdAt) >= 1e3 ? ((r.completedAt - r.createdAt) / 1e3).toFixed(1) + "s" : (r.completedAt - r.createdAt) + "ms") : "—";
return `<tr${r.status === "succeeded" ? "" : " class=\"au-fail\""}><td>${fmtTime(r.createdAt)}</td><td title="${esc(r.prompt || "")}">${esc(r.model.name)}</td><td>${dur}</td><td>${r.status === "succeeded" ? `<span class="au-ok">✓</span>` : `<span class="au-bad">✕</span>`}</td></tr>`;
}).join("") : `<tr><td colspan="4" class="stats-empty">暂无记录</td></tr>`) + `</tbody></table></div>`;html += `<div class="stats-h">最近调用</div><div class="au-table-wrap"><table class="au-table"><thead><tr><th>时间</th><th>模型</th><th>Tokens</th><th>耗时</th><th>结果</th></tr></thead><tbody>` + (recentRows.length ? recentRows.map(r => {
const short = String(r.model || "").includes(":") ? r.model.slice(r.model.indexOf(":") + 1) : (r.model || "auto");
const dur = r.ms >= 1e3 ? (r.ms / 1e3).toFixed(1) + "s" : (r.ms || 0) + "ms";
const tk = r.ok ? ((r.p == null && r.c == null) ? "—" : fmtTok((r.p || 0) + (r.c || 0))) : "—";
return `<tr${r.ok ? "" : ` class="au-fail"`}><td>${fmtTime(r.t)}</td><td title="${esc(r.tag || "")}">${esc(short)}</td><td>${tk}</td><td>${r.ms ? dur : "—"}</td><td>${r.ok ? `<span class="au-ok">✓</span>` : `<span class="au-bad">✕</span>`}</td></tr>`;
}).join("") : `<tr><td colspan="5" class="stats-empty">暂无记录</td></tr>`) + `</tbody></table></div>`;
$("#statsContent").innerHTML = html;
},
_openEnergyPayment() {
if (/MicroMessenger/i.test(navigator.userAgent)) {
window.location.href = CONFIG.WECHAT_PAY_URI;
return;
}
const html = `<div style="text-align:center;padding:20px"><div style="font-size:14px;font-weight:600;margin-bottom:12px">微信扫码支付</div><div class="energy-qr" style="display:flex;justify-content:center"><canvas id="payQrCanvas" width="400" height="400" style="width:200px;height:200px;border-radius:14px" aria-label="微信支付二维码" role="img"></canvas></div><div style="font-size:12px;color:var(--text-dim);margin-top:12px">微信扫一扫 · 支持开发者</div></div>`;
this._showModal("微信支付", html);
this._renderPayQr();
},
_renderPayQr() {
const canvas = $("#payQrCanvas");
if (!canvas) return;
if (!this._payQrThemeWatch) {
this._payQrThemeWatch = true;
try {
new MutationObserver(() => {
if ($("#payQrCanvas")) this._renderPayQr();
}).observe(document.documentElement, {
attributes: true,
attributeFilter: [ "data-theme" ]
});
} catch {}
}
const ctx = canvas.getContext("2d");
if (!ctx) {
this._payQrFallback();
return;
}
const img = new Image;
img.crossOrigin = "anonymous";
const dark = document.documentElement.dataset.theme !== "light";
img.onload = () => {
try {
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
const d = data.data;
const [r2, g2, b2] = dark ? [ 245, 248, 255 ] : [ 24, 28, 40 ];
for (let i = 0; i < d.length; i += 4) {
const lum = .2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2];
if (lum > 148) d[i + 3] = 0; else {
d[i] = r2;
d[i + 1] = g2;
d[i + 2] = b2;
d[i + 3] = 255;
}
}
ctx.putImageData(data, 0, 0);
} catch (e) {
this._payQrFallback();
}
};
img.onerror = () => this._payQrFallback();
img.src = "https://api.qrserver.com/v1/create-qr-code/?size=400x400&qzone=2&data=" + encodeURIComponent(CONFIG.WECHAT_PAY_URI);
},
_payQrFallback() {
const canvas = $("#payQrCanvas");
if (!canvas) return;
const img = document.createElement("img");
img.src = "https://api.qrserver.com/v1/create-qr-code/?size=400x400&qzone=2&data=" + encodeURIComponent(CONFIG.WECHAT_PAY_URI);
img.alt = "微信支付二维码";
img.style.cssText = "width:200px;height:200px;border-radius:14px;background:#fff";
canvas.replaceWith(img);
},

_updateVaultStatus() {
const badge = $("#vaultStateBadge");
if (!badge) return;
const st = $("#vaultStatus");
const mst = $("#vaultManageStatus");
const unlockRow = $("#vaultUnlockRow");
const manageRow = $("#vaultManageRow");
const hasSrc = KeyVault.hasEmbedded() || KeyVault.isCustomActive();
if (KeyVault.unlocked) {
const k = KeyVault.keys();
const n = [ "API_KEY", "R2_WORKER_URL", "R2_AUTH_TOKEN", "IMAGESEG_AK", "IMAGESEG_SK" ].filter(x => k[x]).length;
badge.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="11" width="17" height="10" rx="2.5"/><path d="M7 11V7a5 5 0 0 1 9.9-.9"/><path d="M15 6h6"/><path d="m18 3 3 3-3 3"/></svg><span>' + n + "/5 就位</span>";
badge.className = "vault-badge open";
if (st) st.innerHTML = "";
const needFill = !k.IMAGESEG_AK || !k.IMAGESEG_SK;
if (mst) mst.innerHTML = needFill ? '<span style="color:var(--warning)">阿里云密钥未就位，抠图不可用</span>' : '<span style="color:var(--success)">全部凭据已就位</span>';
if (unlockRow) unlockRow.style.display = "none";
if (manageRow) manageRow.style.display = "";
} else {
badge.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><span>已锁定</span>';
badge.className = "vault-badge locked";
/* IMPL-117：锁定态只陈述状态，不提示任何密码格式/恢复通道（泄密面归零） */
if (st) st.innerHTML = (hasSrc ? '<span style="color:var(--warning)">○ 凭据已加密，解锁后可用</span>' : (VaultSync.configured() ? '<span style="color:var(--warning)">○ 已加密 · 输入密码解锁</span>' : '<span style="color:var(--warning)">○ 无可用密钥簿</span>'));
if (unlockRow) unlockRow.style.display = "";
if (manageRow) manageRow.style.display = "none";
}
},
/* ── 技能模型选择（IMPL-68）：智能选型 + 五顶尖预设 + 清单自定义；写入 Store 供 llmChatStream 使用 ── */
renderSkillModels() {
const list = $("#skillModelList");
if (!list) return;
const cur = Store.getSkillModel();
const presetRow = m => {
const sel = cur === m.id;
const thinkOk = _modelThinkCapable(m.id);
return `<button type="button" class="skill-model-row${sel ? " sel" : ""}" role="radio" aria-checked="${sel}" data-mid="${esc(m.id)}"><span class="sm-name">${esc(m.label)}</span><span class="sm-chips">${m.vision ? '<i class="sm-chip vision">视觉</i>' : ""}${_thinkChip(m.id)}</span><span class="sm-desc">${esc(m.desc)}</span></button>`;
};
const rows = SKILL_MODEL_PRESETS.map(presetRow);
if (cur && cur !== "auto" && !SKILL_MODEL_PRESETS.some(m => m.id === cur)) {
/* 79-c(a)：判定收口 isVisionModelName——旧内联正则少 deepseek-flash（自定义目录模型「视觉」标签显示修正，仅 UI 展示层） */
const isV = isVisionModelName(cur);
const thinkOk = _modelThinkCapable(cur);
rows.push(`<button type="button" class="skill-model-row sel" role="radio" aria-checked="true" data-mid="${esc(cur)}"><span class="sm-name">${esc(cur)}</span><span class="sm-chips"><i class="sm-chip">自定义</i>${isV ? '<i class="sm-chip vision">视觉</i>' : ""}${_thinkChip(cur)}</span><span class="sm-desc">来自模型清单</span></button>`);
}
list.innerHTML = rows.join("");
$$("#skillModelList .skill-model-row").forEach(b => b.addEventListener("click", () => {
Store.setSkillModel(b.dataset.mid);
this.renderSkillModels();
const hit = SKILL_MODEL_PRESETS.find(m => m.id === b.dataset.mid);
Toast.success("技能模型已切换：" + (hit ? hit.label : b.dataset.mid), 1800);
}));
/* IMPL-73：开关渲染期归一化——唯一结构互斥仍是接棒⊗讨论；旧版 localStorage 的 discuss×relay 双开由 discuss 胜出关 relay；
   思考与讨论已兼容，think 不再归一（旧版被系统强关的状态不回写，尊重用户现状） */
if (Store.getSkillDiscuss() && Store.getSkillRelay()) {
Store.setSkillRelay(false);
Toast.info("检测到旧版开关冲突：已保留讨论模式，自动关闭接棒（思考开关不受影响，可自由开启）", 2600);
}
const thinkEl = $("#skillThinkToggle");
const relaySw = $("#skillRelayToggle");
const discSw = $("#skillDiscussToggle");
const tOk = _modelThinkCapable(Store.getSkillDiscuss() ? Store.getSkillDiscussModel() : cur);
if (thinkEl) {
const tOn = Store.getSkillThinking();
thinkEl.classList.toggle("on", tOn);
thinkEl.setAttribute("aria-checked", tOn ? "true" : "false");
thinkEl.setAttribute("aria-disabled", tOk ? "false" : "true");
const tRow = thinkEl.closest(".sm-think-row");
if (tRow) tRow.classList.toggle("sm-think-locked", !tOk);
}
if (relaySw) { const rOn = Store.getSkillRelay(); relaySw.classList.toggle("on", rOn); relaySw.setAttribute("aria-checked", rOn ? "true" : "false"); }
if (discSw) { const dOn = Store.getSkillDiscuss(); discSw.classList.toggle("on", dOn); discSw.setAttribute("aria-checked", dOn ? "true" : "false"); }
/* IMPL-72 需求⑥：识与论切——单下拉随模式重建选项（讨论=顶尖思考×4 / 接棒=识图×3），并回显对应 Store 值 */
const modeSel = $("#skillModeModel");
if (modeSel) {
const discuss = Store.getSkillDiscuss();
const opts = discuss ? SKILL_DISCUSS_MODEL_OPTIONS : SKILL_VISION_MODEL_OPTIONS;
const val = discuss ? Store.getSkillDiscussModel() : Store.getSkillVisionModel();
modeSel.innerHTML = opts.map(o => `<option value="${esc(o.id)}">${esc(o.label)}</option>`).join("")
+ (opts.some(o => o.id === val) ? "" : `<option value="${esc(val)}">${esc(SkillSession._skillLabel(val))}</option>`);
modeSel.value = val;
const tag = $("#skillModeTag");
if (tag) { tag.textContent = discuss ? "讨论" : "识图"; tag.classList.toggle("on", discuss); }
}
const badge = $("#skillModelBadge");
if (badge) { const hit = SKILL_MODEL_PRESETS.find(m => m.id === cur); badge.textContent = hit ? hit.label : cur; }
const cat = $("#skillModelCatalog");
if (cat) {
const cached = Store.getSkillCatalog();
if (cached) { cat.style.display = ""; cat.innerHTML = this._renderModelCatalogHTML(cached); this._bindCatalogRows(cat); const sw = $("#skillModelSearch"); if (sw) sw.style.display = ""; }
}
/* IMPL-75 ④：模型/模式切换后同步文档按钮门槛态 */
if (this._docSync) this._docSync();
},
async refreshSkillModels() {
const btn = $("#skillModelRefreshBtn"), st = $("#skillModelStatus"), cat = $("#skillModelCatalog");
if (!btn || btn.disabled) return;
btn.disabled = true;
btn.classList.add("busy");
if (st) { st.textContent = ""; st.style.color = ""; }
try {
const data = await Api.llmFetchModels();
Store.setSkillCatalog(data);
if (cat) { cat.style.display = ""; cat.innerHTML = this._renderModelCatalogHTML(data); this._bindCatalogRows(cat); }
const sw2 = $("#skillModelSearch"); if (sw2) sw2.style.display = "";
const counts = Object.entries(data.providers).filter(([, v]) => Array.isArray(v) && v.length).map(([k, v]) => `${k} ${v.length}`);
if (st) { st.textContent = counts.length ? "清单已更新（" + counts.join(" · ") + "）" : "清单为空——检查各上游 Key"; st.style.color = counts.length ? "var(--success)" : "var(--warning)"; }
} catch (e) {
if (cat) { cat.style.display = ""; cat.innerHTML = '<div class="sm-cat-empty">清单拉取失败：' + esc(e.message || "网络错误") + '（生产 Worker 挂载 /llm/models 后可用，或检查网络）</div>'; }
if (st) { st.textContent = "拉取失败：" + (e.message || "网络错误"); st.style.color = "var(--danger)"; }
} finally {
btn.disabled = false;
btn.classList.remove("busy");
}
},
_renderModelCatalogHTML(data) {
const cur = Store.getSkillModel();
/* R21-7（修 2026-10-01「刷新出来的模型列表太长」）：按来源 <details> 折叠 —— 原生元素零 JS。
   当前选中模型所在组默认展开；组标题带计数；apiyi 中文名补进表。 */
const names = { dashscope: "DashScope（千问）", deepseek: "DeepSeek", siliconflow: "SiliconFlow", apiyi: "APIYI" };
let html = "";
for (const [p, items] of Object.entries(data.providers || {})) {
const n = Array.isArray(items) ? items.length : 0;
const open = !!(cur && cur.indexOf(p + ":") === 0);
html += `<details class="sm-cat-grp"${open ? " open" : ""}><summary class="sm-cat-h">${esc(names[p] || p)}${n ? " · " + n : " · 未配置/未就绪"}</summary>`;
if (!n) { html += "</details>"; continue; }
html += items.slice(0, 60).map(m => `<button type="button" class="sm-cat-row${cur === p + ":" + m.id ? " sel" : ""}" data-mid="${esc(p + ":" + m.id)}">${esc(m.id)}</button>`).join("");
html += "</details>";
}
return html || '<div class="sm-cat-empty">清单均为空</div>';
},
_bindCatalogRows(cat) {
if (!cat) return;
$$("#skillModelCatalog .sm-cat-row").forEach(b => b.addEventListener("click", () => {
Store.setSkillModel(b.dataset.mid);
this.renderSkillModels();
const d2 = Store.getSkillCatalog();
if (d2) { cat.innerHTML = this._renderModelCatalogHTML(d2); this._bindCatalogRows(cat); }
Toast.success("技能模型已切换：" + b.dataset.mid, 1800);
}));
},
_openSettings() {
if ($("#historySidebar")?.classList.contains("show")) this._closeHistory();
$("#soundToggle").classList.toggle("on", Store.getSound());
$("#cloudSyncToggle").classList.toggle("on", Store.getSync());
const dv = $("#drawerVerBadge");/* IMPL-122：版本徽章回填（从唯一版本源 about-ver 取文本） */
if (dv) {
const v = document.querySelector(".about-ver")?.textContent?.trim() || "";
if (v) { dv.textContent = v; dv.hidden = false; }
}
this._renderCloudSyncStatus();/* IMPL-122：每次打开抽屉刷新云同步状态行 */
this._updateVaultStatus();
this.renderSkillModels();
$("#settingsDrawer").classList.add("show");
$("#settingsOverlay").classList.add("show");
},
_renderCloudSyncStatus() {/* IMPL-122：云同步状态可见化——用户自查“最近结果没同步”的诊断入口（TC 不可用时此前全程静默无感知） */
const el = $("#cloudSyncStatus");
if (!el) return;
const tcOk = typeof TaskCenter !== "undefined" && TaskCenter.isAvailable();
const c = this._histCloudBase();/* IMPL-125 B'：状态行三态——TC / R2 直连 / 皆无 */
if (!c) {
el.textContent = "未配置云端同步 · 解锁保险箱后自动同步（或在「编辑密钥」填 R2 Worker 地址与令牌）"; /* ★ R87：原 105 字段落压到一行 —— 11px 小字里它占四行，放行后太挤 */
el.dataset.tone = "warn";
el.style.display = "";
return;
}
let at = "—";
try {
const t = parseInt(localStorage.getItem("sc_hist_sync_at") || "0", 10) || 0;
if (t) {
const d = Date.now() - t;
at = d < 60e3 ? "刚刚" : d < 36e5 ? Math.floor(d / 60e3) + " 分钟前" : d < 864e5 ? Math.floor(d / 36e5) + " 小时前" : Math.floor(d / 864e5) + " 天前";
}
} catch (e) {}
let pat = "—";
try {
const tp = parseInt(localStorage.getItem("sc_hist_push_at") || "0", 10) || 0;
if (tp) {
const d2 = Date.now() - tp;
pat = d2 < 60e3 ? "刚刚" : d2 < 36e5 ? Math.floor(d2 / 60e3) + " 分钟前" : d2 < 864e5 ? Math.floor(d2 / 36e5) + " 小时前" : Math.floor(d2 / 864e5) + " 天前";
}
} catch (e) {}
/* ★ R79-E：加「上次推送」—— 只有「上次拉取」时，推送失败是看不出来的（这正是本次事故的盲区） */
el.textContent = (tcOk ? "已连接 · " : "已连接（R2 直连）· ") + "云同步" + (Store.getSync() ? "开" : "关") + " · 上次云端拉取 " + at + " · 上次推送 " + pat;
el.dataset.tone = "ok";
el.style.display = "";
},
_checkBudget() {
if (Store.getSpendAlert()) {
const spent = Store.getTodaySpend();
const threshold = Math.floor(spent / 10) * 10;
const lastKey = "sc_last_alert_threshold_" + (new Date).toDateString();
let last = 0;
try {
last = parseInt(localStorage.getItem(lastKey) || "0", 10) || 0;
} catch (e) {}
if (threshold > last && threshold > 0) {
try {
localStorage.setItem(lastKey, String(threshold));
} catch (e) {}
Toast.warning(`今日累计已消费 ¥${threshold.toFixed(2)}+`);
}
}
return true;
},
_closeSettings() {
$("#settingsDrawer").classList.remove("show");
$("#settingsOverlay").classList.remove("show");
},
_showModal(title, bodyHtml, footerButtons) {
$("#modalTitle").textContent = title;
$("#modalBody").innerHTML = bodyHtml;
const footer = $("#modalFooter");
footer.innerHTML = "";
if (footerButtons && footerButtons.length) {
footer.style.display = "flex";
footerButtons.forEach(b => {
const btn = document.createElement("button");
btn.textContent = b.label;
btn.className = b.primary ? "btn-primary" : "btn-secondary";
btn.addEventListener("click", b.fn);
footer.appendChild(btn);
});
} else footer.style.display = "none";
$("#modalOverlay").classList.add("show");
},
_closeModal() {
$("#modalOverlay").classList.remove("show");
$("#modalOverlay .modal-content")?.classList.remove("modal-wide");
$("#modalOverlay .modal-content")?.classList.remove("stats-modal-content");
},
/* ★ R88-d：手动复制兜底 —— 自动复制被浏览器拦下时，把内容原样摆出来让用户自己 Ctrl/⌘+C。
   内容会进 innerHTML ⇒ 必须逃 &<>（引号在 textarea 文本节点里无害，但一并逃更稳）。 */
_showManualCopy(text) {
const _esc88 = (v) => String(v == null ? "" : v).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
this._showModal("手动复制", '<div style="font-size:12px;opacity:.72;margin-bottom:8px">浏览器拦下了自动复制。下面已全选，按 <b>Ctrl/⌘ + C</b> 即可拿走。</div><textarea readonly id="manualCopyArea" style="width:100%;height:280px;font:12px/1.55 ui-monospace,Menlo,Consolas,monospace;resize:vertical;white-space:pre">' + _esc88(text) + "</textarea>", [ { label: "关闭", primary: true, fn: () => this._closeModal() } ]);
setTimeout(() => {
const ta = document.getElementById("manualCopyArea");
if (ta) { try { ta.focus(); ta.select(); ta.setSelectionRange(0, ta.value.length); } catch (_e88) {} }
}, 60);
},
_saveFormToCache() {
if (!this.state.model) return;
const cache = {};
const ta = $('[data-key="prompt"], [data-key="text"]');
if (ta) {
cache[ta.dataset.key] = ta.value;
this.state.formCache[this.state.tab + "_prompt"] = ta.value;
}
for (const p of this.state.model.params) {
if (p.type === "ref-image" || p.type === "ref-video" || p.type === "ref-audio") {
cache[p.key] = JSON.parse(JSON.stringify(this._getRefs(p.key)));
if (!this.state.formCache[this.state.tab + "_refs"]) this.state.formCache[this.state.tab + "_refs"] = {};
if (p.key === "urls" || p.key === "images" || p.key === "first_frame" || p.key === "last_frame" || p.key === "firstFrameUrl" || p.key === "lastFrameUrl") {
this.state.formCache[this.state.tab + "_refs"][p.key] = JSON.parse(JSON.stringify(this._getRefs(p.key)));
}
} else {
const el = $(`[data-key="${p.key}"]`);
if (el) {
cache[p.key] = el.value;
const pool = this.state.formCache[this.state.tab + "_pool"] ||= {};
pool[p.key] = el.value;
pool["l:" + p.label] = el.value;
}
}
}
const cntEl = document.querySelector('[data-key="__count"]');
if (cntEl && [ "1", "2", "3", "4" ].includes(cntEl.value)) {
cache["__count"] = cntEl.value;
const pool2 = this.state.formCache[this.state.tab + "_pool"] ||= {};
pool2["__count"] = cntEl.value;
}
this.state.formCache[this.state.modelKey] = cache;
},
_restoreFormFromCache() {
const cache = this.state.formCache[this.state.modelKey];
const tabPrompt = this.state.formCache[this.state.tab + "_prompt"];
const tabRefs = this.state.formCache[this.state.tab + "_refs"] || {};
const allTabRefs = {};
for (const [k, v] of Object.entries(this.state.formCache)) {
if (k.startsWith(this.state.tab + "/") && typeof v === "object") {
for (const [refKey, refVal] of Object.entries(v)) {
if (Array.isArray(refVal) && refVal.length > 0 && !allTabRefs[refKey]) {
allTabRefs[refKey] = refVal;
}
}
}
}
const mergedRefs = {
...allTabRefs,
...tabRefs
};
const promptParam = this.state.model.params.find(p => p.type === "textarea");
if (promptParam) {
const ta = $('[data-key="prompt"], [data-key="text"]');
if (ta) {
const promptVal = cache && cache[promptParam.key] || tabPrompt || promptParam.default || "";
ta.value = promptVal;
this._onPromptInput(ta);
}
}
for (const p of this.state.model.params) {
if (p.type === "ref-image" || p.type === "ref-video" || p.type === "ref-audio") {
const refData = cache && cache[p.key] || mergedRefs[p.key];
if (refData && refData.length > 0) {
this.state.refState[this.state.modelKey] = this.state.refState[this.state.modelKey] || {};
this.state.refState[this.state.modelKey][p.key] = JSON.parse(JSON.stringify(refData));
this._renderRefGrid(p.key);
}
} else if (p.type !== "textarea") {
const el = $(`[data-key="${p.key}"]`);
const pool = this.state.formCache[this.state.tab + "_pool"] || {};
/* IMPL-119：池值跨模型必须过类型门——原 datalist/text 无校验：audio_tts 速创音色（male-qn-qingse）可泄入
   qwen_audio_tts_plus voice 发往百炼必无效；sunburst 分辨率枚举 "2K" 可泄入 qwen size 文本（应 宽*高）。
   cache 同模型可信（datalist 自由输入的自定义音色照常保留）；select/cap-grid/range 原有校验不变 */
const fromPool = !(cache && cache[p.key] != null);
let val = cache && cache[p.key] != null ? cache[p.key] : pool[p.key] != null ? pool[p.key] : pool["l:" + p.label];
if (val != null && p.type === "select" && Array.isArray(p.options) && !p.options.map(String).includes(String(val))) val = null;
if (val != null && p.type === "cap-grid" && Array.isArray(p.options) && !p.options.map(o => String(o.value)).includes(String(val))) val = null;
if (val != null && fromPool && p.type === "datalist" && Array.isArray(p.options) && !p.options.map(o => String(o.value)).includes(String(val))) val = null;
if (val != null && fromPool && p.type === "text" && p.pattern && !new RegExp(p.pattern).test(String(val))) val = null;
if (val != null && p.type === "range") {
const n = Number(val);
if (Number.isNaN(n) || p.min != null && n < p.min || p.max != null && n > p.max) val = null;
}
if (el && val != null) {
el.value = val;
this._onFieldChange(p.key, el);
}
}
}
const cntEl = $('[data-key="__count"]');
if (cntEl) {
const cntPool = this.state.formCache[this.state.tab + "_pool"] || {};
let cnt = cache && cache["__count"] != null ? cache["__count"] : cntPool["__count"];
if (cnt == null || ![ "1", "2", "3", "4" ].includes(String(cnt))) cnt = "1";
cntEl.value = String(cnt);
this._onFieldChange("__count", cntEl);
}
this._syncAllPqControls();
},
_snapshotForm() {
this._saveFormToCache();
return JSON.parse(JSON.stringify(this.state.formCache[this.state.modelKey] || {}));
},
_restoreFormSnapshot(snap) {
this.state.formCache[this.state.modelKey] = snap;
this._restoreFormFromCache();
},
_showUndoBtn(snap) {
this.state.formUndoSnapshot = snap;
const btn = $("#undoBtn");
btn.classList.add("show");
clearTimeout(this._undoTimer);
this._undoTimer = setTimeout(() => btn.classList.remove("show"), 5 * 60 * 1e3);
},
_undoFill() {
if (this.state.formUndoSnapshot) {
this._restoreFormSnapshot(this.state.formUndoSnapshot);
this.state.formUndoSnapshot = null;
$("#undoBtn").classList.remove("show");
Toast.success("已撤销");
}
},
_replaceRefs(refs) {
if (!this.state.refState[this.state.modelKey]) this.state.refState[this.state.modelKey] = {};
for (const p of this.state.model.params) {
if (p.type === "ref-image") {
if (isFrameKey(p.key)) {
const url = String(p.key).includes("first") ? refs.first : refs.last;
this.state.refState[this.state.modelKey][p.key] = url ? [ {
id: genId(),
kind: "url",
src: url,
name: "frame",
uploaded: true,
remote: url
} ] : [];
} else {
this.state.refState[this.state.modelKey][p.key] = refs.image.map(u => ({
id: genId(),
kind: "url",
src: u,
name: u.split("/").pop(),
uploaded: true,
remote: u
}));
}
this._renderRefGrid(p.key);
} else if (p.type === "ref-video") {
this.state.refState[this.state.modelKey][p.key] = refs.video.map(u => ({
id: genId(),
kind: "url-video",
src: u,
name: u.split("/").pop(),
uploaded: true,
remote: u
}));
this._renderRefGrid(p.key);
} else if (p.type === "ref-audio") {
this.state.refState[this.state.modelKey][p.key] = (refs.audio || []).map(u => ({
id: genId(),
kind: "url-audio",
src: u,
name: u.split("/").pop(),
uploaded: true,
remote: u
}));
this._renderRefGrid(p.key);
}
}
},
bindGlobalPaste() {
document.addEventListener("paste", async e => {
if (e.target && e.target.closest && e.target.closest("#workflowOverlay")) return;
const items = (e.clipboardData || window.clipboardData).items || [];
const imageFiles = [];
const videoFiles = [];
let text = "";
for (const item of items) {
if (item.kind === "file") {
if (item.type.startsWith("image/")) imageFiles.push(item.getAsFile()); else if (item.type.startsWith("video/")) videoFiles.push(item.getAsFile());
} else if (item.kind === "string") {}
}
text = (e.clipboardData || window.clipboardData).getData("text/plain") || "";
if (!imageFiles.length && !videoFiles.length && !text.trim()) return;
const activeEl = document.activeElement;
if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA") && !imageFiles.length && !videoFiles.length) return;
const targetKey = this._resolvePasteTarget(imageFiles.length ? "ref-image" : videoFiles.length ? "ref-video" : null);
if (!targetKey) {
if (text.trim() && /^https?:\/\/\S+$/i.test(text.trim())) {
const urlKey = this._resolvePasteTarget("ref-image");
if (urlKey) {
e.preventDefault();
this._addUrlRef(urlKey, text.trim());
return;
}
}
return;
}
e.preventDefault();
Promise.all(imageFiles.map(f => this._addLocalRef(targetKey, f)));
Promise.all(videoFiles.map(f => this._addLocalVideoRef(targetKey, f)));
if (text.trim() && /^https?:\/\/\S+$/i.test(text.trim())) this._addUrlRef(targetKey, text.trim());
});
},
_resolvePasteTarget(refType) {
if (!refType) return null;
if (this.state.activeRefKey) {
const param = this.state.model.params.find(p => p.key === this.state.activeRefKey);
if (param && param.type === refType) return this.state.activeRefKey;
}
const candidates = this.state.model.params.filter(p => p.type === refType);
const visible = candidates.filter(p => {
const grid = $(`[data-ref-grid="${p.key}"]`);
return grid && grid.offsetParent !== null;
});
if (visible.length === 1) return visible[0].key;
if (candidates.length === 1) return candidates[0].key;
if (candidates.length > 1) {
this._showPastePicker(candidates);
return null;
}
return null;
},
_showPastePicker(candidates) {
const opts = $("#pastePickerOptions");
opts.innerHTML = candidates.map(p => `<button class="pp-option" data-pk="${esc(p.key)}">${esc(p.label)}</button>`).join("");
opts.querySelectorAll("[data-pk]").forEach(btn => btn.addEventListener("click", () => {
this.state.activeRefKey = btn.dataset.pk;
this._hidePastePicker();
Toast.info("请再次粘贴");
}));
$("#pastePicker").classList.add("show");
},
_hidePastePicker() {
$("#pastePicker").classList.remove("show");
},
bindGlobalDrop() {
const panel = $("#colParams");
panel.addEventListener("dragover", e => {
if (!e.dataTransfer || !e.dataTransfer.types.includes("Files")) {
if (e.dataTransfer && e.dataTransfer.types.includes("text/plain")) {
e.preventDefault();
const target = this._findDropTarget(e);
if (target) target.classList.add("ref-drop-active");
}
return;
}
e.preventDefault();
const target = this._findDropTarget(e);
if (target) target.classList.add("ref-drop-active");
});
panel.addEventListener("dragleave", e => {
$$(".ref-drop-active").forEach(el => el.classList.remove("ref-drop-active"));
});
panel.addEventListener("drop", e => {
e.preventDefault();
$$(".ref-drop-active").forEach(el => el.classList.remove("ref-drop-active"));
const target = this._findDropTarget(e);
if (!target) return;
const key = target.dataset.refGrid;
const param = this.state.model.params.find(p => p.key === key);
if (!param) return;
const uriRaw = e.dataTransfer.getData("text/uri-list"); /* Z3（第六批）：uri-list 多值（\n 分隔，# 注释行跳过）——多选图一起拖入参考图区逐张入网格 */
const uriList = (uriRaw || "").split(/\r?\n/).map(x => x.trim()).filter(x => x && !x.startsWith("#") && /^https?:\/\//.test(x));
if (uriList.length) {
uriList.forEach(u => this._addUrlRef(key, u));
return;
}
const url = e.dataTransfer.getData("text/plain");
if (url && /^https?:\/\//.test(url)) {
this._addUrlRef(key, url);
return;
}
Promise.all(Array.from(e.dataTransfer.files).map(f => {
if (param.type === "ref-video" && f.type.startsWith("video/")) return this._addLocalVideoRef(key, f); else if (param.type === "ref-image" && f.type.startsWith("image/")) return this._addLocalRef(key, f);
return null;
}));
});
},
_findDropTarget(e) {
const x = e.clientX, y = e.clientY;
const grids = $$("[data-ref-grid]");
for (const g of grids) {
const r = g.getBoundingClientRect();
if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return g;
}
return null;
},
_openEditor(url) {
if (!url) return;
const model = this._studioGuard(); /* IMPL-126：预载在 _studioGuard 内（点编辑即预载，遮罩/加载态与脚本下载并行）；内核已外链懒加载，此处只查宿主壳 */
if (!model) return;
window.StudioEditor.open({
url: this._weservProxy(url),
onSave: this._studioOnSave(model)
});
},
_bindMobileViewSwitch() {
if (!window.__wbSyncThemeColor) {
window.__wbSyncThemeColor = function () {/* IMPL-114②+IMPL-115③：浏览器沉浸双色同步——①theme-color：编辑态或画布未启=#ffffff，结果态且画布在=网格基底色（SvFloor.config.base hex 校验，非法/缺省回退石墨 #1b1e24）；②body/html 背景内联同步（仅≤768px）：iOS Safari 的滚动边缘融合渐变/工具栏染色/橡皮筋取样页面背景色——body 恒白(--bg-elev)时深色网格上方被系统画「白→透明」羽化（用户"白黑羽化渐变"），结果态把 body 背景同步为基底色=系统融合同色=沉浸（浅色网格同样受益：羽化=米纸色）；inline !important 压过移动端样式表 body{background:var(--bg-elev)!important}，非沉浸态 removeProperty 回落白底 */
try {
var mc = document.querySelector('meta[name="theme-color"]');
if (!mc) return;
var b = window.SvFloor && window.SvFloor.config && typeof window.SvFloor.config.base === "string" ? window.SvFloor.config.base : "";
var base = /^#[0-9a-fA-F]{6}$/.test(b) ? b : "#1b1e24";
var host = document.getElementById("svFloorBg");
var on = !!(host && host.classList.contains("on"));
var immersive = document.body.dataset.mview === "result" && on;
mc.setAttribute("content", immersive ? base : "#ffffff");
var mob = window.matchMedia && window.matchMedia("(max-width:768px)").matches;
if (immersive && mob) {
document.body.style.setProperty("background-color", base, "important");
document.documentElement.style.setProperty("background-color", base, "important");
} else {
document.body.style.removeProperty("background-color");
document.documentElement.style.removeProperty("background-color");
}
/* IMPL-121①：dvh 失效兜底（IMPL-118① 遗留缺口）——iOS<15.4 不支持 100dvh，
   CSS 回落 height:100%（=lvh），URL 栏展开态底部 ~83px（含底部缩略图 dock 与
   网格画布底缘）沉到工具栏后=「结果页下面网格又被截断」复发真根因；
   不支持 dvh 的环境改用 visualViewport.height 同步 body 高（iOS13+ 均有 vv），
   支持 dvh 的浏览器零干预（CSS 100dvh 继续生效）；键盘弹出 vv 缩矮同样受益 */
try {
if (mob && !(window.CSS && CSS.supports && CSS.supports("height", "100dvh"))) {
var vv = window.visualViewport;
if (vv) {
document.body.style.setProperty("height", vv.height + "px", "important");
if (!window.__wbVvBound) { window.__wbVvBound = true; vv.addEventListener("resize", function () { if (window.__wbSyncThemeColor) window.__wbSyncThemeColor(); }); }
}
} else if (document.body.style.height) {
document.body.style.removeProperty("height"); /* 环境支持 dvh/跨断点回桌面：还权 CSS */
}
} catch (e) {}
} catch (e) {}
};
window.addEventListener("resize", function () { if (window.__wbSyncThemeColor) window.__wbSyncThemeColor(); }, { passive: true });/* IMPL-115③：跨断点旋转/缩放即时回落，防深色内联残留到桌面态 */
try { window.__wbSyncThemeColor(); } catch (e) {}/* IMPL-121①：首屏自调一次——dvh 失效环境不等首次 resize/切视图即修正 body 高 */
}
const sw = $("#mobileViewSwitch");
if (sw) {
sw.querySelectorAll("button").forEach(btn => {
btn.addEventListener("click", () => this._switchMobileView(btn.dataset.mview));
});
}
$("#mobileResultSwitch")?.querySelectorAll("button").forEach(btn => {
btn.addEventListener("click", () => this._switchMobileView(btn.dataset.mview));
});
$("#generateBtn")?.addEventListener("click", () => {
setTimeout(() => {
if (window.innerWidth <= 768) {
this._switchMobileView("result");
}
}, 500);
});
},
_switchMobileView(view) {
$("#mobileViewSwitch")?.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.mview === view));
$("#mobileResultSwitch")?.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.mview === view));
$("#colParams")?.classList.toggle("mobile-active", view === "param");
$("#resultPanel")?.classList.toggle("mobile-active", view === "result");
document.body.dataset.mview = view;
if (window.__wbSyncThemeColor) window.__wbSyncThemeColor();/* IMPL-114②：视图切换即时同步状态栏底色 */
},
_bindDrawerSwipe() {
const drawers = [ {
el: $("#settingsDrawer"),
close: () => this._closeSettings()
}, {
el: $("#historySidebar"),
close: () => this._closeHistory()
} ];
drawers.forEach(({el: el, close: close}) => {
if (!el || el.dataset.grabBound) return;
el.dataset.grabBound = "1";
const grab = document.createElement("div");
grab.className = "drawer-grabber";
grab.setAttribute("aria-hidden", "true");
el.insertBefore(grab, el.firstChild);
let sy = 0, dy = 0, tracking = false;
grab.addEventListener("touchstart", e => {
if (window.innerWidth > 768) return;
sy = e.touches[0].clientY;
dy = 0;
tracking = true;
el.style.transition = "none";
}, {
passive: true
});
grab.addEventListener("touchmove", e => {
if (!tracking) return;
dy = Math.max(0, e.touches[0].clientY - sy);
el.style.transform = "translateY(" + dy + "px)";
if (dy > 8 && e.cancelable) e.preventDefault();
}, {
passive: false
});
const end = () => {
if (!tracking) return;
tracking = false;
el.style.transition = "";
el.style.transform = "";
if (dy > 90) close();
};
grab.addEventListener("touchend", end);
grab.addEventListener("touchcancel", end);
});
},
_bindConnectivity() {
window.addEventListener("offline", () => {
Toast.warning("网络已断开，生成功能暂停");
$("#generateBtn").disabled = true;
});
window.addEventListener("online", () => {
Toast.success("网络已恢复");
$("#generateBtn").disabled = false;
poller.resumeAll();
});
window.addEventListener("storage", e => {
if (e.key !== CONFIG.STORAGE_KEYS.TASKS && e.key !== CONFIG.STORAGE_KEYS.HISTORY) return;
this._renderTaskList();
this.renderHistoryBadge();
if ($("#historySidebar")?.classList.contains("show")) this.renderHistory();
this._renderResultStrip();
});
}
};

/* IMPL-91① logo 去重：favicon 与品牌 logo 共用同一 base64（正文 .brand-logo 为唯一源，省 ~5.8KB 解析量） */
try {
  const _bl91 = document.querySelector(".brand-logo");
  const _fl91 = document.querySelector("#faviconLink");
  if (_bl91 && _fl91 && _bl91.getAttribute("src")) _fl91.href = _bl91.getAttribute("src");
} catch (e) {}
/* IMPL-91② Store.getHistory 内存缓存：跨标签页写入 / 其他键清空时失效（本 tab 写路径已全部经 _hwrite 收口） */
window.addEventListener("storage", e => {
  try {
    if (!e || e.key === null || e.key === CONFIG.STORAGE_KEYS.HISTORY) Store._histCache = null;
  } catch (err) {}
});
document.addEventListener("DOMContentLoaded", () => { UI.init(); /* ★ R76-J：启动清扫跨会话必然失效的 blob: 记录（清 url ⇒ 渲染走无图分支，不再尝试 fetch） */ setTimeout(function () { try { _r76HistorySweep(); } catch (_e) {} }, 1200); });


;

/* ============================================================
   IMPL-126：图片工作台弹框宿主（StudioEditor）—— W 版嵌入包外链 + 懒加载
   ------------------------------------------------------------
   - 编辑器内核不再内联：首次打开时动态加载 image-studio.js（UMD → window.ImageStudio），
     失败有加载失败态与重试，不白屏；预加载句柄 window.StudioEditorPreload（幂等）；
   - 官方三模式（编辑 / 裁切 / 排版）跑在 Shadow DOM，layout:"fill" 住在卡片内不盖整页；
   - adapter.applyToNode 接管「应用到节点」：p.file → dataURL → 原参考图写入管线（onSave）；
   - adapter.bitmapActions 位图动作：编辑器把选区遮罩/尺寸约束规整好交宿主，
     mask 取 e.mask?.dataUrl（e.mask 是对象或 null），maskMode 枚举见 invertMaskToAlpha，
     模型一律由宿主决定（宿主当前选中直连图像模型优先，mask 动作走 SF edits 端点）。
   ============================================================ */
window.StudioEditor = (function() {
let api = null, ov = null, onSaveCb = null, escHandler = null, scriptP = null;
const STUDIO_SRC = "image-studio.adce381a46.js";
/* IMPL-144 W5（2026-09-26 修拍板）：位图动作全换 GPT-Image-2.5 系——覆盖 IMPL-143 版映射（变更单第一节）
   sunburst=最强档（精细编辑/参考保真，Arena 文生图 1420.7/编辑 1520.4 双第一）→扩图/局部重绘；flare=快车道（比 GPT-Image-2 快 50%）→擦除/图像拆解/编辑文字；抠出主体维持阿里抠图专用通道
   裸名审计落账：GPT-Image-2.5 裸名非 OpenAI 正式 model id（正式 id 仅 gpt-image-2.5-flare / gpt-image-2.5-sunburst，快照 -2026-09-08）；
   IMPL-143 edit-text 裸名条目从未真实上游验证（我方零计费 mock 实测），无既有路由证据可查——本批全部改明确变体 id，不留裸名
   quality 策略（变更单 4.2，速创无 auto 档不传=medium）：sunburst 系显式 high（按张计费不加价）；flare 系不传 quality */
const BITMAP_MODEL_MAP = {
  "remove-background": { channel: "ali", model: null, label: "抠出主体" },
  erase: { channel: "apiyi", model: "apiyi:gpt-image-2.5-flare", label: "擦除" } /* R16：改走 APIYI（速创降为备份） */,/* IMPL-162：label 消除→擦除——与编辑器 R6 UI 定名对齐（W5 对拍：宿主提示与编辑器按钮双名） */
  outpaint: { channel: "apiyi", model: "apiyi:gpt-image-2.5-sunburst", label: "扩图" } /* R16：改走 APIYI；**去掉 quality:"high"**——原决定建立在"速创按张不加价"的误解上，现由面板 quality 键决定（默认 medium） */,
  inpaint: { channel: "apiyi", model: "apiyi:gpt-image-2.5-sunburst", label: "重绘" } /* R16：同 R2b */, /* 第十三批 H4：label「局部重绘」→「重绘」（W5 同步改名；有选区=局部，无选区=整层改图 H1b） */
  "angle-adjust": { channel: "apiyi", model: "apiyi:gpt-image-2.5-sunburst", label: "角度调整" } /* R16：同 R2b */, /* 第十三批 H4：新增（默认模型按修拍板=sunburst）——2026-09-28 拍板中文名定「角度调整」（原暂叫多角度）；W5 工具菜单首项 */
  "edit-text": { channel: "apiyi", model: "apiyi:gpt-image-2.5-flare", label: "编辑文字" } /* R16 */,
  "layer-decompose": { channel: "apiyi", model: "apiyi:gpt-image-2.5-all", label: "图像拆解", soft: true } /* R16：拆解是块级输出 ⇒ 用**按次**的 -all（0.21 元/张）更省 */
};
/* 旧条目存档（IMPL-143 版，Qwen-Image-3.0-Pro，变更单第二节第 5 条允许注释保留）：erase/outpaint/inpaint/layer-decompose→Qwen-Image-3.0-Pro、edit-text→GPT-Image-2.5（裸名，作废）——回退=按本注释还原表并去掉 studioEdits 第 5 参 */
const SF_EDIT_MODEL = "Qwen/Qwen-Image-Edit"; /* 仅表外动作兜底——IMPL-150 起速创通道只映射 gpt-image-2.5 系（wyModelPath），表外动作若真出现将显式报错不静默（六个内建动作已全在 BITMAP_MODEL_MAP 表内，channel 值 sf→wy 语义更名、模型映射与官方定位一致保持） */
function buildModelCatalog() { /* 第十三批 H7：参数 schema 由宿主下发（修拍板「全站零重复定义」）——actions=BITMAP_MODEL_MAP 对外投影（7 动作）；models=MODELS.image 中速创 wy 通道 gpt-image-2.5 系投影（params 原样 + modelLogoOf 现成 SVG 徽标串；W5 按 params[].type textarea/select/ref-image 渲染，渲染器不改） */
const cat = { actions: {}, models: {} };
Object.keys(BITMAP_MODEL_MAP).forEach(function(k) { const v = BITMAP_MODEL_MAP[k]; cat.actions[k] = { channel: v.channel, model: v.model, label: v.label, quality: v.quality || "" }; });
try {
if (typeof MODELS !== "undefined" && Array.isArray(MODELS.image) && typeof modelLogoOf === "function") {
/* 2026-10-01：清单含 APIYI 全部档。
   ★ R16（修 14:4x「APIYI 置顶、速创置底，速创价格不便宜就当个备份服务」）：
   **先 APIYI、后速创** —— 下拉顺序 = 这里 push 进 cat.models 的顺序（编辑器走 Object.entries 的插入序）。
   速创**仍留在清单里**（置底），想手动切回去仍然可以。 */
  MODELS.image.filter(function(x) { return x.channel === "apiyi"; }).map(function(x) { return x.id; })
    .concat(["gpt-image-2.5", "gpt-image-2.5-flare", "gpt-image-2.5-sunburst"]).forEach(function(id) {
const m = MODELS.image.find(function(x) { return x.id === id; });
if (!m) return;
cat.models[id] = { name: String(m.name || "").replace(/（[易创连]）[ 　]*$/, "").trim(), price: m.price || "", desc: m.desc || "", icon: modelLogoOf(id) || "", channel: m.channel === "apiyi" ? "apiyi" : (m.direct ? "direct" : "wy"), modelId: m.modelId || id, billing: m.billing || null, params: (m.params || []).map(function(p) { return { key: p.key, label: p.label, type: p.type, required: !!p.required, default: p.default != null ? p.default : "", options: p.options || null, max: p.max != null ? p.max : null, output: p.output || "", placeholder: p.placeholder || "" }; }) }; /* 2026-10-01：+channel/modelId（编辑器据此在模型键上标通道）；R21-2：+billing（编辑器价格列按它算纯人民币）；旧嵌入包忽略未知键无副作用 */
});
}
} catch (_) {}
/* ★★ R42：视频档投影（与编辑器 videoModelsOf 的 type:"video" 判据配对）。
   排除表见上方注释：包装类 / 工具类 / 直连重复档**故意不下发**（修拍板）。
   图像档保持无 type —— 编辑器 normalizeModels 遇 type:"video" 会跳过，不污染位图面板。 */
try {
if (typeof MODELS !== "undefined" && Array.isArray(MODELS.video)) {
var R42_VIDEO_SKIP = { video_package: 1, digital_humans: 1, video_upscaling: 1, wan3_video: 1 };
MODELS.video.filter(function(x) { return x && !R42_VIDEO_SKIP[x.id]; }).forEach(function(m) {
var ep = String(m.endpoint || "");
var ch = String(m.channel || "") === "apiyi" ? "apiyi" : (ep.indexOf("/api/async/") === 0 ? "wy" : (m.direct ? "direct" : "wy"));
cat.models[m.id] = { type: "video", name: String(m.name || "").replace(/（[易创连]）[ 　]*$/, "").trim(), price: m.price || "", desc: m.desc || "", icon: modelLogoOf(m.id) || "", channel: ch, modelId: m.modelId || m.id, endpoint: ep, billing: m.billing || null, refGroups: m.refGroups || null, params: (m.params || []).map(function(p) { return { key: p.key, label: p.label, type: p.type, required: !!p.required, default: p.default != null ? p.default : "", options: p.options || null, max: p.max != null ? p.max : null, min: p.min != null ? p.min : null, step: p.step != null ? p.step : null, unit: p.unit || "", output: p.output || "", placeholder: p.placeholder || "", hint: p.hint || "" }; }) };
});
}
} catch (_) {}
return cat;
}
function loadStudio() {
if (window.ImageStudio && window.ImageStudio.mount) return Promise.resolve(window.ImageStudio);
if (!scriptP) {
scriptP = new Promise(function(resolve, reject) {
const s = document.createElement("script");
s.src = STUDIO_SRC;
s.async = true;
s.onload = function() {
if (window.ImageStudio && window.ImageStudio.mount) resolve(window.ImageStudio);
else { scriptP = null; reject(new Error("编辑器脚本已加载但未初始化")); }
};
s.onerror = function() { scriptP = null; reject(new Error("编辑器脚本加载失败")); };
document.head.appendChild(s);
});
}
return scriptP;
}
window.StudioEditorPreload = loadStudio; /* 预加载句柄（幂等）：可在 hover / 空闲时提前拉取 */
function close() {
if (api) { try { api.destroy(); } catch (e) {} api = null; }
const ip = document.getElementById("studioInlinePrompt"); if (ip && ip._resolve) { try { ip._resolve(""); } catch (e) {} } /* Z6：编辑器关闭时输入条在场=取消（Promise 收口防挂起） */
if (ov) { ov.remove(); ov = null; }
if (escHandler) { document.removeEventListener("keydown", escHandler, true); escHandler = null; }
onSaveCb = null;
}
function fileToDataURL(f) {
return new Promise(function(res, rej) {
const r = new FileReader();
r.onload = function() { res(r.result); };
r.onerror = function() { rej(new Error("读取导出图片失败")); };
r.readAsDataURL(f);
});
}
async function handleApply(p) {
try {
if (p && Array.isArray(p.files) && p.files.length > 1) { /* Z10（第六批·附录A）：目标节点>1 逐张产物 files[]——一次落成一组结果并整组入夹（p.files 缺失走单图 onSaveCb 原行为，向后兼容） */
const cards = [];
for (const f of p.files) {
if (!f || !f.file) continue;
const du = await fileToDataURL(f.file);
cards.push({
id: genId(),
model: { type: "image", name: "编辑器应用", id: "studio-apply" },
prompt: "编辑器应用到节点" + (p.nodeIds && p.nodeIds.length ? " · " + p.nodeIds.length + " 节点" : ""),
status: "succeeded",
result: { url: du, thumbUrl: du },
createdAt: Date.now(),
completedAt: Date.now()
});
}
if (!cards.length) { try { Toast.warning("未收到可落位的多图产物"); } catch (_) {} return false; }
cards.forEach(c => { Store.addHistory(c); archiveDataUrlCard(c).catch(() => {}); }); /* IMPL-152：逐卡后台转存（+512 缩略图），dataURL 不再永驻 LS */
const ids = cards.map(c => c.id);
if (typeof UI !== "undefined" && UI.state && UI.state.openFolderId) UI._folderAddMulti(UI.state.openFolderId, ids); else if (typeof UI !== "undefined") UI._folderCreateWithMulti(ids); /* Z10：整组入夹（有展开夹入展开夹，否则新建一夹收纳） */
if (typeof UI !== "undefined") UI._renderResultStrip();
try { Toast.success("已保存 " + cards.length + " 张到结果区（同组入夹）"); } catch (_) {}
close();
return true;
}
const dataURL = await fileToDataURL(p.file);
const keep = onSaveCb ? (onSaveCb(dataURL, p.width || 0, p.height || 0) !== false) : true;
if (keep) close();
return true; /* 已接管 → 编辑器不再走浏览器下载 */
} catch (e) {
console.error("[StudioEditor] 应用到节点失败:", e);
try { Toast.error("导出失败: " + _errText(e)); } catch (_) {}
return false;
}
}
function hostPrompt() {
const el = document.querySelector('[data-key="prompt"], [data-key="text"]');
return el && el.value ? String(el.value).trim() : "";
}
function blobUrlToDataURL(url) {
return fetch(url).then(function(r) { if (!r.ok) throw new Error("读取画布图像失败 " + r.status); return r.blob(); })
.then(function(b) { return new Promise(function(res, rej) { const fr = new FileReader(); fr.onload = function() { res(fr.result); }; fr.onerror = function() { rej(new Error("画布图像编码失败")); }; fr.readAsDataURL(b); }); });
}
function dataUrlToBlob(dataUrl) {
const parts = String(dataUrl).split(",");
const mime = (parts[0].match(/data:([^;]+)/) || [])[1] || "image/png";
const bin = atob(parts[1] || "");
const arr = new Uint8Array(bin.length);
for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
return new Blob([arr], { type: mime });
}
/* mask 语义订正（IMPL-126）：枚举在 e.mask.maskMode ——
   "alpha-transparent"（透明=重绘，编辑器当前默认）直接透传给 SF edits；
   "luma-white"（白=重绘，即梦 / SD 系）必须反相为 alpha 语义，否则会把要保留的区域重绘掉 */
function invertMaskToAlpha(dataUrl) {
return new Promise(function(res, rej) {
const im = new Image();
im.onload = function() {
try {
const c = document.createElement("canvas");
c.width = im.naturalWidth; c.height = im.naturalHeight;
const ctx = c.getContext("2d");
ctx.drawImage(im, 0, 0);
const d = ctx.getImageData(0, 0, c.width, c.height);
const px = d.data;
for (let i = 0; i < px.length; i += 4) {
const luma = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
px[i] = px[i + 1] = px[i + 2] = 0;
px[i + 3] = 255 - Math.round(luma);
}
ctx.putImageData(d, 0, 0);
res(c.toDataURL("image/png"));
} catch (err) { rej(err); }
};
im.onerror = function() { rej(new Error("遮罩解码失败")); };
im.src = dataUrl;
});
}
function wyModelPath(modelId) { /* IMPL-150 Z20：速创模型由路径承载（无 model 字段，doc/79/80）——gpt-image-2.5[-flare|-sunburst]→image_gpt_2.5[_flare|_sunburst]；非该系返回 ""（显式报错不静默回退） */
const m = /^gpt-image-2\.5(?:-([a-z]+))?$/.exec(String(modelId || "").trim());
return m ? ("image_gpt_2.5" + (m[1] ? "_" + m[1] : "")) : "";
}
function wyPixels(ratio, tier) { /* IMPL-150 Z20：aspectRatio+resolution 合并为像素值——全表复制自 IMPL-120 官方换算表 _GPT_RATIO_SIZE（15 比例含竖版，doc/78/79/80 实证口径，与任务中心 _composeGptAspect 同源同数据）；分隔符用 "*"（瞳侧 0.42s 实测成功形态）；1K/2K/4K 取各比例数组第 0/1/2 项（缺项取末项，与 _composeGptAspect 同语义）；auto/空/表外比例→""＝不下发（服务端默认） */
const T = {
"1:1": ["1024*1024", "2048*2048", "2880*2880"],
"16:9": ["1280*720", "2048*1152", "3840*2160"],
"9:16": ["720*1280", "1152*2048", "2160*3840"],
"4:3": ["1152*864", "2304*1728", "3264*2448"],
"3:4": ["864*1152", "1728*2304", "2448*3264"],
"3:2": ["1536*1024", "2048*1360", "3504*2336"],
"2:3": ["1024*1536", "1360*2048", "2336*3504"],
"5:4": ["1120*896", "2240*1792", "3200*2560"],
"4:5": ["896*1120", "1792*2240", "2560*3200"],
"21:9": ["1456*624", "2912*1248", "3840*1648"],
"9:21": ["624*1456", "1248*2912", "1648*3840"],
"1:3": ["688*2048", "1280*3840"],
"3:1": ["2048*688", "3840*1280"],
"2:1": ["1536*768", "3072*1536", "3840*1920"],
"1:2": ["768*1536", "1536*3072", "1920*3840"]
};
if (!ratio || String(ratio).toLowerCase() === "auto") return "";
const sizes = T[String(ratio).trim()];
if (!sizes) return "";
const idx = tier === "2K" ? 1 : tier === "4K" ? 2 : 0;
return sizes[Math.min(idx, sizes.length - 1)];
}
function wyCompressDataUrl(dataUrl, maxEdge) { /* IMPL-151 Z18 定稿：中间图（参考图/mask）上传前长边压到 ≤2048——速创从自身服务器抓图，图越小抓取越快（工单建议）；mask 与参考图同源等比压缩后尺寸仍一致；不超限原样返回（零质量损失），解码/画布失败回退原图不阻断生成（上游报错留证） */
return new Promise(function(resolve) {
try {
const img = new Image();
img.onload = function() {
try {
const w0 = img.naturalWidth || 0, h0 = img.naturalHeight || 0, mx = Math.max(w0, h0);
if (!mx || mx <= maxEdge) { resolve(dataUrl); return; }
const k = maxEdge / mx;
const c = document.createElement("canvas");
c.width = Math.max(1, Math.round(w0 * k));
c.height = Math.max(1, Math.round(h0 * k));
c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
resolve(c.toDataURL("image/png")); /* PNG 保留 mask 透明通道 */
} catch (e) { resolve(dataUrl); }
};
img.onerror = function() { resolve(dataUrl); };
img.src = dataUrl;
} catch (e) { resolve(dataUrl); }
});
}
try { if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function() {}); } catch (_) {} /* IMPL-152（用户工单⑤）：申请持久化存储（best-effort）——降低 UA 磁盘紧张时清理本站数据的概率；被拒无副作用 */
async function archiveDataUrlCard(card) { /* IMPL-152（用户工单⑤）：编辑器产物 dataURL 落 R2——三处 onSave 全尺寸 dataURL 内联写 history 是「网页缓存易满」根因（2K 图 base64 5-15MB vs LS 配额 5-10MB，且 _archiveResult 对 data: 门控直返永不转存）：原图上传换 R2 URL + 长边 512 缩略图双写，双表回写照 applyArchived 范式；失败静默保留 dataURL（本地可用性优先）。「无限扩容」由 R2 承担（本地只留 URL 指针）；LRU 淘汰与 IDB Blob 迁移为二期 */
try {
const url = card && card.result && card.result.url;
if (!url || !/^data:/i.test(url)) return false;
const w = (Store.getR2WorkerUrl() || "").trim().replace(/\/$/, "");
const token = (Store.getR2AuthToken() || "").trim();
if (!w || !token) return false;
const full = await wyUploadDataUrl(url, "studio-apply.png", "results");
if (!full || !/^https?:\/\//i.test(full)) return false;
card.result.originalUrl = url;
card.result.url = full;
try {
const thumb = await wyCompressDataUrl(url, 512);
if (thumb && thumb !== url) {
const fd = new FormData();
fd.append("file", dataUrlToBlob(thumb), "studio-thumb.png");
const r = await fetch(w + "/upload?token=" + encodeURIComponent(token) + "&dir=results", { method: "POST", body: fd });
const d2 = await r.json().catch(function() { return null; });
if (r.ok && d2 && d2.url && /^https?:\/\//i.test(d2.url)) card.result.thumbUrl = d2.url;
}
} catch (_) {}
const tasks = Store.getTasks();
const t = tasks.find(function(x) { return x.id === card.id; });
if (t) { t.result = card.result; Store.saveTasks(tasks); }
const hist = Store.getHistory();
const h = hist.find(function(x) { return x.id === card.id; });
if (h) { h.result = card.result; Store.saveHistory(hist); }
if (typeof UI !== "undefined" && UI._renderResultStrip) { try { UI._renderResultStrip(); } catch (_) {} }
return true;
} catch (e) { console.warn("[IMPL-152] 编辑器产物转存失败（保留 dataURL 本地可用）:", (e && e.message) || e); return false; }
}
if (typeof window !== "undefined") window.archiveDataUrlCard = archiveDataUrlCard; /* IMPL-152：UI 层 onSave（StudioEditor IIFE 外）需调用本帮手——挂 window 供跨作用域可达（同 StudioEditorPreload 先例） */
async function wyUploadDataUrl(dataUrl, name, dir) { /* IMPL-151 Z18 定稿（修拍板：复用现有 R2）：dataURL→R2 公网 URL（POST /upload 直传，速创 urls 只吃公网 URL——不支持 base64/数组/multipart）；生成必需链路故不依赖云同步开关。定稿三件：①dir=tmp 专放「给上游看的中间图」（可清理前缀，不混正式目录；IMPL-152：可选参 dir，编辑器产物归档传 "results" 正式目录）②上传前长边压 ≤2048（wyCompressDataUrl）③返回 r2:// 形态（PUBLIC_BASE_URL 未配）=速创服务器无法抓取→显式报错指引，不静默 */
const w = (Store.getR2WorkerUrl() || "").trim().replace(/\/$/, "");
const token = Store.getR2AuthToken() || "";
if (!w || !token) throw new Error("no_worker_url: 参考图需先转公网 URL（速创只收 URL）——请在设置页配置 R2 Worker 地址与 Token");
const up = await wyCompressDataUrl(dataUrl, 2048);
const fd = new FormData();
fd.append("file", dataUrlToBlob(up), name);
const r = await fetch(w + "/upload?token=" + encodeURIComponent(token) + "&dir=" + encodeURIComponent(dir || "tmp"), { method: "POST", body: fd });
const data = await r.json().catch(function() { return null; });
if (!r.ok || !data || !data.url) throw new Error("参考图上传失败: HTTP " + r.status + (data && data.error ? " · " + data.error : ""));
const pub = String(data.url || "");
if (!/^https?:\/\//i.test(pub)) throw new Error("R2 未配置公网域名：上传返回 “" + pub.slice(0, 40) + "” 速创服务器无法抓取——请为 R2 绑定公开访问域名（如 r2.dev）并在 Worker 配置 PUBLIC_BASE_URL，或在 Worker 增设无鉴权对象读路由后重试"); /* Z18 定稿：r2.dev 公开域对速创可用（其服务器抓图不受 CORS 约束——宿主「r2.dev 无跨源头」告警只约束浏览器侧读回，L8945 语境不冲突） */
return pub;
}
async function wyArchiveUrl(ossUrl) { /* IMPL-150 Z19：速创结果托管阿里云 OSS 且链接有效期未知——拿到即经 Worker /archive 服务端转存 R2（浏览器直拉 OSS 有 CORS 不确定性，服务端无此问题）；转存失败不静默（warn 留痕）并回退 OSS 原链保可用 */
try {
const w = (Store.getR2WorkerUrl() || "").trim().replace(/\/$/, "");
const token = Store.getR2AuthToken() || "";
if (!w || !token) throw new Error("no_worker_url");
const r = await fetch(w + "/archive?url=" + encodeURIComponent(ossUrl) + "&ext=png&token=" + encodeURIComponent(token), { method: "POST" });
const data = await r.json().catch(function() { return null; });
if (data && data.ok && data.url) return data.url;
throw new Error((data && data.error) || "HTTP " + r.status);
} catch (e) {
console.warn("[W5-route] 结果转存 R2 失败，回退 OSS 原链（有效期未知）:", (e && e.message) || e);
return ossUrl;
}
}
/* ══════════════════════════════════════════════════════════════════════════════════
   ★ 2026-10-01 APIYI 图片通道实现（修拍板 A：Worker 转发 · 结果"只在导出时才转，平时走 blob URL"）
   ══════════════════════════════════════════════════════════════════════════════════
   端点：文生图 POST /v1/images/generations（JSON）· 改图 POST /v1/images/edits（multipart）
   结果：data[].b64_json（**无 data: 前缀**）⇒ 本地造 Blob ⇒ createObjectURL ⇒ 交编辑器显示。
     **不预上传 R2**（省一次往返与费用）；导出时编辑器从画布出 dataURL，天然是永久数据。
     ⚠ 代价如实记：blob: 只在**本页面会话**内有效 —— 关掉页面后该结果图不再可寻址
       （速创那版转存 R2 是永久链）。这是修明确选择的口径，不是疏漏。
   ⚠ mask 语义与速创一致：**只对第 1 张 image 生效** ⇒ image[] 第 1 张永远是源图。 */

/** APIYI 的超时：官方明说客户端断开**不取消上游、照常计费** ⇒ 宁可给足。
 *  分档依据（03-图片API 速查表）：gpt-image-2.5 建议 360s；gpt-image-2 high+2K/4K 实测 3-5 分钟；
 *  SeeDream-5.0-pro 实测约 2 分钟；FLUX 60-120s；
 *  ★ Nano Banana Pro 官方明写「1K/2K 用 300 秒，**4K 用 600 秒兜底**」⇒ 4K 单独给 600s。
 *     ⚠ 同一条也要求 Worker 侧闸门放宽（原 600s 顶格会撞）—— 已同步改成 900s。 */
function apiyiTimeoutOf(modelId, def, size) {
  if (def && def.gemini) {
    if (size === "4K") return 6e5;
    if (size === "2K") return 3e5;
    return 3e5;
  }
  const id = String(modelId || "");
  if (/seedream-5-0-pro/.test(id)) return 3e5;
  if (/^flux/.test(id)) return 18e4;
  return 36e4;
}

/** 从 MODELS.image 里按 id 取 APIYI 模型定义（**channel 是唯一真值**，不是动作表）。 */
function apiModelById(id) {
  if (!id || typeof MODELS === "undefined" || !Array.isArray(MODELS.image)) return null;
  return MODELS.image.find(function(x) { return x.id === id && x.channel === "apiyi"; }) || null;
}

/** base64（无 data: 前缀）→ blob: URL。结果图**只在会话内可寻址**，见上方代价说明。
 *  ⚠ mime 必传可省：Gemini 原生响应里带 mimeType 字段，**不能写死 image/png**（官方明确要求从响应读）。 */
function b64ToBlobUrl(b64, mime) {
  const bin = atob(String(b64).replace(/^data:[^,]*,/, ""));
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return URL.createObjectURL(new Blob([u8], { type: mime || "image/png" }));
}

/** data URL → File（multipart 用）。保留原 mime；⚠ 手机原拍 jpg 常见 MPO 容器，上游入口会拒（不计费）。 */
function dataUrlToFile(dataUrl, name) {
  const str = String(dataUrl || "");
  const i = str.indexOf(",");
  const mime = (/^data:([^;]+)/.exec(str.slice(0, i)) || [])[1] || "image/png";
  const bin = atob(str.slice(i + 1));
  const u8 = new Uint8Array(bin.length);
  for (let k = 0; k < bin.length; k++) u8[k] = bin.charCodeAt(k);
  return new File([u8], name || "image.png", { type: mime });
}

/** 编辑器面板的「比例 + 清晰度」→ 官方 size 像素串（半角小写 x）。
 *  合法性按官方四约束**当场算**：最大边 ≤3840 · 两边都是 16 的倍数 · 长短边比 ≤3:1 · 总像素 ∈ [655360, 8294400]。
 *  算不出来（非法比例 / 收不住）⇒ 返回空串＝不下发，交服务端 auto，**不硬塞非法值**。
 *  ⚠★ 必须**迭代收**，不能只缩放一次：q() 的取整会让一次缩放既可能欠也可能超 ——
 *     第一版就是单次缩放，结果 16:9/1K、1:3/1K、3:1/1K、4:3/4K、3:4/4K **五组能算却被误弃**。
 *     而且放大要用 ceil、缩小要用 floor，否则会在下限处卡成不动点永远收不进去。 */
function apiyiSize(ratio, tier) {
  const t = String(tier || "").toUpperCase();
  let L = t === "4K" ? 3840 : t === "2K" ? 2048 : t === "1K" ? 1024 : 0;
  /* ★ R90：清晰度=auto 时 L=0 ⇒ 原实现直接 return "" ⇒ size 整条不下发 ⇒ **比例静默失效**
     （修实测：选 21:9 出图 1312x1199 近正方形、选 1:1 出图 1536x1024；历史里 resolution 全是 auto）。
     UI 上「比例」「清晰度」是两个独立控件，用户只改比例不动清晰度 = 比例白选。
     兜底：**仅在用户明确选了比例（非 auto/adaptive）**时按 1K 算；比例也是 auto 则照旧不下发。 */
  if (!L) {
    const _r90 = String(ratio || "").trim();
    if (_r90 && !/^(auto|adaptive)$/i.test(_r90)) L = 1024;
  }
  if (!L) return "";
  const m = /^(\d+)\s*[:\/]\s*(\d+)$/.exec(String(ratio || "").trim());
  if (!m) return "";
  const rw = parseInt(m[1], 10), rh = parseInt(m[2], 10);
  if (!(rw > 0 && rh > 0)) return "";
  /* 长短边比 >3:1 直接放弃（官方不接受）—— **不悄悄改成 3:1**：那等于偷改用户选的比例。 */
  if (Math.max(rw, rh) / Math.min(rw, rh) > 3) return "";
  const up = function(v) { return Math.max(16, Math.ceil(v / 16) * 16); };
  const dn = function(v) { return Math.max(16, Math.floor(v / 16) * 16); };
  const LO = 655360, HI = 8294400, MAX = 3840;
  let long = up(L), short = up(L * Math.min(rw, rh) / Math.max(rw, rh));
  for (let i = 0; i < 8; i++) {
    if (long / short > 3) short = up(long / 3);   /* 比例越界：抬短边（不会反超长边） */
    const w = rw >= rh ? long : short, h = rw >= rh ? short : long;
    const px = w * h;
    if (px >= LO && px <= HI && w <= MAX && h <= MAX && Math.max(w, h) / Math.min(w, h) <= 3) return w + "x" + h;
    const f = Math.sqrt((px < LO ? LO : HI) / px);
    const nl = px < LO ? up(long * f) : dn(long * f);
    const ns = px < LO ? up(short * f) : dn(short * f);
    if (nl === long && ns === short) break;       /* 收敛不动了，别再空转 */
    long = nl; short = ns;
  }
  return "";                                      /* 收不住就交服务端 auto，不硬塞非法值 */
}

/** 统一收口：POST 到 APIYI 并把 data[].b64_json / .url 换成可显示 URL 数组。
 *  ⚠ **绝不传 response_format**（官方：传了直接 400）；b64_json 无 data: 前缀（自己造 Blob）。 */
async function apiyiPost(pathname, body, def, size) {
  /* ★★ R95-1-4（报告 01 P1-3）：429 / 5xx **带抖动退避**，上限 2 次重试。
     官方口径：429 = 「限流 **或** 余额/额度不足」，不该一次就放弃、也不该猜死是哪一个。
     ⚠ 只在**明确是限流/服务端错误**时重试；参数类 4xx **绝不重试**（重试无用、还可能白跑）。 */
  const _delays = [700, 1900];
  let _attempt = 0;
  for (;;) {
    try {
      const r = await Api._directReq("POST", pathname, body, { apiyi: true, timeout: apiyiTimeoutOf(def && def.modelId, def, size) });
      const arr = (r && Array.isArray(r.data)) ? r.data : [];
      const raw = arr.map(function(it) { return (it && (it.b64_json || it.url)) || ""; }).filter(Boolean);
      if (!raw.length) {
        const em = (r && r.error && (r.error.message || r.error)) || "";
        throw new Error("APIYI 未返回图片数据" + (em ? "：" + String(em) : "") + " · " + JSON.stringify(r).slice(0, 200));
      }
      /* ★ R5：把**上游给的用量原样带回去**（不归一、不改名）—— 归属与算法交给 calcEstimate 那一层。
         OpenAI 形态是 usage；Gemini 形态是 usageMetadata（下面 apiyiGemini 自己取）。 */
      const _usage = (r && r.usage) || null;
      return { urls: raw.map(function(v) { return /^https?:\/\//i.test(v) ? v : b64ToBlobUrl(v); }), usage: _usage };
    } catch (e) {
      const _m = String((e && e.message) || e);
      const _retri = /429|50[0-9]|rate.?limit|too many|频繁|限流|overload/i.test(_m);
      if (!_retri || _attempt >= _delays.length) throw e;
      const _wait = _delays[_attempt] + Math.floor(Math.random() * 400);
      _attempt++;
      console.info("[W5-route]", JSON.stringify({ phase: "apiyi-retry", n: _attempt, waitMs: _wait, ts: Date.now() }));
      await new Promise(function(res) { setTimeout(res, _wait); });
    }
  }
}

/** ★★ Nano Banana 系（Gemini 原生端点）—— 与 OpenAI 形态**完全不同的一套**。
 *  端点：POST /v1beta/models/{模型}:generateContent（模型名在 URL 里，且 ≠ 注册表 id）
 *  请求：contents[0].parts[] = **1 个文本段 + N 个图片段**
 *   ★ 官方硬规矩：**同一个 part 里只能放 text 或 inlineData 其中一个，不能并存**。
 *  尺寸：generationConfig.imageConfig.{aspectRatio,imageSize}（**档位 + 比例**，不是像素串！）
 *        ⇒ 与 OpenAI 形态的 apiyiSize() 是两套口径，绝不通用。
 *  返回：candidates[0].content.parts[].inlineData.{data,mimeType}
 *   ★★ **parts 是异构数组，段数与顺序都不保证**（NB2 还会返回思维过程文本，图片常落到下标 1）
 *      ⇒ **绝不写死 parts[0]/parts[1]**：遍历筛 inlineData，**取最后一张**（复杂任务会返回多张中间稿，最后一张才是终稿）；
 *        mimeType 也从响应里读，不写死。
 *  审核拦截：HTTP 仍 200 但 parts 里没有图 ⇒ 判据 = candidatesTokenCount==0 或 finishReason != STOP；
 *      **IMAGE_SAFETY 不计费**，官方建议原样重试 1~2 次。 */
async function apiyiGemini(prompt, def, ex, imgData, refs) {
  const e = ex || {};
  const parts = [{ text: String(prompt || "") }];   /* ★ 1 个文本段，永远是第 1 段 */
  const pushImg = function(dataUrl, mime) {
    const str = String(dataUrl || "");
    const i = str.indexOf(",");
    if (i < 0) return;
    const m = (/^data:([^;]+)/.exec(str.slice(0, i)) || [])[1] || mime || "image/png";
    parts.push({ inlineData: { mimeType: m, data: str.slice(i + 1) } });   /* ★ 图片各占**独立 part**，不与 text 同段 */
  };
  if (imgData) pushImg(imgData, "image/png");
  (refs || []).slice(0, 14).forEach(function(u) { pushImg(u, "image/png"); });   /* 官方硬上限 14 张 */
  const cfg = { responseModalities: ["IMAGE"] };
  const ic = {};
  const ratio = String(e.aspectRatio || "").trim();
  /* ★★ R95-1-3（报告 01 P0-1，必修）：原来读 def.ratios / def.sizes —— 而**模型定义里从来没有这两个字段**
     （档位真值只存在于 params[].options，由 geminiModel() 生成）⇒ 白名单恒为 [] ⇒ indexOf 恒 -1
     ⇒ 选 16:9 出 1:1、选 2K 出 1K（**三个参数 100% 静默失效**）。与 R90「比例静默失效」同性质。
     ⇒ 改为与**参数声明同源**：直接读 params 里 aspectRatio / resolution 的 options（杜绝字段漂移复发）。 */
  const _pr95 = (def.params || []).find(function(p) { return p.key === "aspectRatio"; }) || {};
  if (ratio && (_pr95.options || []).indexOf(ratio) >= 0) ic.aspectRatio = ratio;
  const size = String(e.resolution || "").trim();
  /* ★★ 这道闸仍是必须的：Lite / 一代 **只接受 1K**，传 2K/4K 上游直接报错（官方明写）。 */
  const _ps95 = (def.params || []).find(function(p) { return p.key === "resolution"; }) || {};
  if (size && (_ps95.options || []).indexOf(size) >= 0) ic.imageSize = size;
  if (Object.keys(ic).length) cfg.imageConfig = ic;
  /* thinkingLevel：**仅 NB2 / 2 Lite 支持**（默认 minimal）。Pro 传了不报错但无效 ⇒ 干脆不传，
     而且开 high 会 **+54% 费用** ⇒ 默认不开，只认显式请求。 */
  if (def.thinking && e.thinking === "high") cfg.thinkingConfig = { thinkingLevel: "high" };
  const body = { contents: [{ parts: parts }], generationConfig: cfg };
  console.info("[W5-route]", JSON.stringify({ phase: "apiyi-gemini", model: def.endpointModel, parts: parts.length, isImageSize: ic.imageSize || null, isAspectRatio: ic.aspectRatio || null, thinking: !!(cfg.thinkingConfig) , ts: Date.now() }));
  const r = await Api._directReq("POST", def.endpoint, body, { apiyi: true, timeout: apiyiTimeoutOf(def.modelId, def, size) });
  const c0 = ((r && r.candidates) || [])[0] || {};
  const ps = (c0.content && c0.content.parts) || [];
  const imgs = ps.map(function(p) { return (p && p.inlineData) || null; }).filter(Boolean);   /* ★ 筛，不写死下标 */
  if (!imgs.length) {
    const fr = String(c0.finishReason || "");
    const tc = (r && r.usageMetadata && r.usageMetadata.candidatesTokenCount) || 0;
    let why = "（无 inlineData 段）";
    if (tc === 0) why = "（candidatesTokenCount = 0）";
    if (fr && fr !== "STOP") why += "（finishReason = " + fr + "）";
    throw new Error("Gemini 未返回图片" + why + " —— 若为 IMAGE_SAFETY 属内容审核拦截，官方口径**该次不计费**，原样重试 1~2 次常可成功");
  }
  const urls = imgs.map(function(i) { return b64ToBlobUrl(i.data, i.mimeType); });   /* ★ mime 从响应读 */
  /* ★ R5：Gemini 的用量在 `usageMetadata`（promptTokenCount / candidatesTokenCount），
     与 OpenAI 形态字段名不同 ⇒ **在这里归一成 inTokens/outTokens**，下游只认这一对名字。 */
  const _um = (r && r.usageMetadata) || null;
  const _usage = _um ? { inTokens: _um.promptTokenCount, outTokens: _um.candidatesTokenCount, raw: _um } : null;
  return { assetUrl: urls[urls.length - 1], candidates: urls, usage: _usage };         /* ★ 取最后一张 = 终稿 */
}

/** 文生图（/v1/images/generations，JSON）。 */
async function apiyiImages(imgData, prompt, def, ex) {
  const e = ex || {};
  const body = { model: def.modelId || def.id, prompt: prompt || "", n: 1 };
  const sz = apiyiSize(e.aspectRatio, e.resolution);
  if (sz) body.size = sz;
  if (e.quality) body.quality = e.quality;
  if (e.background) body.background = e.background;
  body.output_format = "png";
  console.info("[W5-route]", JSON.stringify({ phase: "apiyi-gen", model: body.model, size: body.size || null, quality: body.quality || null, ts: Date.now() }));
  const res = await apiyiPost("/v1/images/generations", body, def, e.resolution);
  return { assetUrl: res.urls[0], candidates: res.urls, usage: res.usage };
}

/** 改图（/v1/images/edits，multipart）。**第 1 张 image 永远是源图**，mask 只对它生效（官方口径）。 */
async function apiyiEdits(imgData, maskData, prompt, def, ex) {
  const t0 = Date.now();
  const e = ex || {};
  const fd = new FormData();
  fd.append("model", def.modelId || def.id);
  fd.append("prompt", prompt || "");
  fd.append("n", "1");
  let sz = apiyiSize(e.aspectRatio, e.resolution);
  /* ★★ R93 B —— 有 mask 但没尺寸时的「同几何」兜底：
     UI 在「有选区」时把比例/清晰度锁死且不下发 ⇒ sz 为空 ⇒ 输出几何全交给上游 auto，
     比例一变 mask 就对不上原图了（R16 想防的正是这个，只是「不下发」把方向做反了）。
     编辑器现按源图真实像素算好一个合法且同几何的尺寸、以 maskSize 透出，这里校验后采用。
     ⚠ 只认严格 WxH 形态；格式不对宁可不发（交回上游 auto，与改前一致，无回退风险）。 */
  /* ⚠⚠ 铁 100：这段在**模板字符串**里，d 不是合法转义 ⇒ JS 静默吃掉反斜杠 ⇒ 产物成了 /^d+xd+$/ 恒不匹配。
     所以一律用**零转义**字符类 /^[0-9]+x[0-9]+$/（R95 修 R93-B 那次落空）。 */
  if (!sz && maskData && typeof e.maskSize === "string" && /^[0-9]+x[0-9]+$/.test(e.maskSize)) sz = e.maskSize;
  if (sz) fd.append("size", sz);
  if (e.quality) fd.append("quality", e.quality);
  /* ★★ R93 C —— 有 mask 时背景必须显式 opaque：
     官方 background 默认是 auto（成图**可以带 alpha 通道**），而局部重绘的结果是要「贴回原图」的，
     透明底落进画布就成了「选区外透明 + 羽化边」（修实测报的正是这个）。
     用户显式选了 background 就尊重用户（面板透传）；否则由我们指定 opaque。 */
  if (e.background) fd.append("background", e.background);
  else if (maskData) fd.append("background", "opaque");
  fd.append("image[]", dataUrlToFile(imgData, "image.png"), "image.png");
  /* 参考图追加在**源图之后**（顺序即 prompt 里「图1/图2/图3」的指代依据，官方明写）。
     单张失败不阻断（源图才是关键），但必须留痕。 */
  const refs = Array.isArray(e.refDataUrls) ? e.refDataUrls : [];
  let refOk = 0;
  for (let i = 0; i < refs.length; i++) {
    try { fd.append("image[]", dataUrlToFile(refs[i], "ref-" + (i + 1) + ".png"), "ref-" + (i + 1) + ".png"); refOk++; }
    catch (err) { console.info("[W5-route]", JSON.stringify({ phase: "apiyi-ref-fail", idx: i, msg: String((err && err.message) || err).slice(0, 120), ts: Date.now() })); }
  }
  if (maskData) fd.append("mask", dataUrlToFile(maskData, "mask.png"), "mask.png");
  console.info("[W5-route]", JSON.stringify({ phase: "apiyi-edit", model: fd.get("model"), size: sz || null, quality: e.quality || null, mask: !!maskData, bg: fd.get("background") || null, refs: refOk, ts: Date.now() }));  /* ★ R93：日志带 bg —— 真机上能直接看出「透明」是不是输出侧来的 */
  const res = await apiyiPost("/v1/images/edits", fd, def, e.resolution);
  const urls = res.urls;
  console.info("[W5-route]", JSON.stringify({ phase: "apiyi-done", secs: Math.round((Date.now() - t0) / 1000), n: urls.length, ts: Date.now() }));
  return { assetUrl: urls[0], candidates: urls, usage: res.usage };
}

async function studioEdits(imageData, maskData, prompt, modelId, extra) { /* IMPL-150 Z19/Z20：通道改速创异步（P0 定论：gpt-image-2.5 系不属 SF——/v1/images/edits 在 SF 不存在，404 根因=上游通道配错）。
流程：参考图/mask 先经 /upload&dir=tmp 转公网 URL（Z18 定稿：中间图专放 tmp 可清理前缀 + 长边压 ≤2048）→ POST /media/wy/api/async/<路径>（模型承载于路径，无 model 字段）→ data.id → 轮询 detail（4s 间隔·30min 上限，status 0=处理中 2=完成、非 0 非 2=失败读 message）→ result[0] OSS 链接 → /archive 转存 R2 → 落结果。
失败语义：状态码/任务 id/耗时全留证，不静默回退（Z19）；第 5 参 extra={quality,aspectRatio,resolution,background,num}（十三批 H1/S1：+background/num）——quality 值域 low/medium/high/xhigh/max（sunburst 另有 xhigh/max；仅 sunburst 系显式 high，flare 系不传=medium）；aspectRatio/resolution 仅扩图枚举档（wyPixels 合并为像素）；economized 由 routedModel 路径承载（image_gpt_2.5 无后缀=标准生成型 doc/78 0.1 元/张） */
const t0 = Date.now();
const mp = wyModelPath(modelId);
if (!mp) throw new Error("位图动作模型未映射速创路径（仅支持 gpt-image-2.5 系）: " + (modelId || "(空)"));
const refUrl = await wyUploadDataUrl(imageData, "reference.png");
const body = { prompt: prompt || "", urls: refUrl };
const ex = extra || {};
/* ★ R15.3：编辑器挂的参考图（data URL）→ 逐张上传成公网 URL，拼在**源图之后**（速创 urls 是 csv）。
   ⚠ 顺序语义：**第 1 张永远是源图（要改的那张）**，其后才是参考图 ⇒ 与蒙版指向的图一致、
     也与编辑器里 @ 引用重排后的顺序一致（编辑器已把「参考图N」与数组位置对齐）。
   ⚠ 单张上传失败**不阻断**整次编辑（源图才是关键），但必须留痕、不许静默。 */
if (Array.isArray(ex.refDataUrls) && ex.refDataUrls.length) {
const _refs = [];
for (let _i = 0; _i < ex.refDataUrls.length; _i++) {
try { _refs.push(await wyUploadDataUrl(ex.refDataUrls[_i], "ref-" + (_i + 1) + ".png")); }
catch (_e) { console.info("[W5-route]", JSON.stringify({ phase: "ref-upload-fail", idx: _i, msg: String((_e && _e.message) || _e).slice(0, 120), ts: Date.now() })); }
}
if (_refs.length) body.urls = [refUrl].concat(_refs).join(",");
console.info("[W5-route]", JSON.stringify({ phase: "ref-attach", refs: _refs.length, ts: Date.now() }));
}
const pix = wyPixels(ex.aspectRatio, ex.resolution);
if (pix) body.aspectRatio = pix;
if (ex.quality) body.quality = ex.quality;
if (ex.background) body.background = ex.background; /* H1（十三批）：背景参数透传（auto/transparent） */
if (ex.num) body.n = ex.num; /* S1（十三批）：张数透传（速创未知字段通常忽略；结果按 result 全量回传） */
if (maskData) body.mask = await wyUploadDataUrl(maskData, "mask.png"); /* Z20：mask 由 multipart 部件改 URL 形态 */
const r = await Api._directReq("POST", "/api/async/" + mp, body, { wy: true, timeout: 6e4 });
const taskId = r && r.data && r.data.id;
if (!taskId) throw new Error("速创提交未返回任务 id: " + JSON.stringify(r).slice(0, 200) + " · 耗时 " + Math.round((Date.now() - t0) / 1000) + "s");
const pollMs = 4000, deadline = Date.now() + 18e5; /* 4s 间隔·30min 上限（速创文档口径） */
console.info("[W5-route]", JSON.stringify({ phase: "wy-submit", taskId: taskId, pollMs: pollMs, model: modelId, mask: !!maskData, ts: Date.now() })); /* Z21：路由日志带 taskId/pollMs */
let lastSt = null, pollErr = null;
while (Date.now() < deadline) {
await new Promise(function(res) { setTimeout(res, pollMs); });
let d = null;
try { d = await Api._directReq("GET", "/api/async/detail?id=" + encodeURIComponent(taskId), undefined, { wy: true, timeout: 2e4 }); }
catch (e) { pollErr = e; continue; } /* 单次查询失败不弃任务（网络抖动），续轮询直至超时 */
pollErr = null;
const dd = (d && d.data) || {};
lastSt = dd.status;
if (lastSt === 2) {
const out = Array.isArray(dd.result) ? String(dd.result[0] || "") : "";
if (!out) throw new Error("速创任务完成但未返回结果图 (id=" + taskId + "): " + JSON.stringify(dd).slice(0, 200));
/* IMPL-152（用户工单②）：转存与显示竞速——2.5s 内转存完成用 R2 永久链；超时立即返回 OSS 原链不阻塞编辑器（后台转存继续完成并留日志）。<img> 直挂上游不受 CORS 约束；竞速超时场景结果卡 url 为 OSS 临时链（时效风险留痕），编辑器保存经 onSave dataURL 全量落历史不受影响 */
const archP = wyArchiveUrl(out).catch(function(e) { console.warn("[W5-route] 转存失败（留痕）:", (e && e.message) || e); return null; });
const raced = await Promise.race([archP, new Promise(function(res) { setTimeout(function() { res(null); }, 2500); })]);
const finalUrl = raced || out;
console.info("[W5-route]", JSON.stringify({ phase: "wy-done", taskId: taskId, secs: Math.round((Date.now() - t0) / 1000), url: finalUrl, archived: raced ? "sync" : "async-continue" }));
if (!raced) archP.then(function(a) { if (a && a !== out) console.info("[W5-route]", JSON.stringify({ phase: "wy-archived", taskId: taskId, url: a })); });
return { assetUrl: finalUrl, candidates: (Array.isArray(dd.result) ? dd.result.filter(Boolean) : [finalUrl]) }; /* S1（十三批）：全量候选回传（接口预留，编辑器旧版忽略未知字段无副作用） */
}
if (lastSt !== 0) throw new Error("速创任务失败 (id=" + taskId + " status=" + lastSt + " message=" + (dd.message || "无") + ") · 耗时 " + Math.round((Date.now() - t0) / 1000) + "s");
}
throw new Error("速创任务轮询超时（30 分钟, id=" + taskId + ", 最后状态=" + lastSt + (pollErr ? ", 最近查询错误=" + ((pollErr && pollErr.message) || pollErr) : "") + "）");
}
function studioBusy(text) { /* IMPL-143 P2：位图动作执行期反馈条（宿主级——编辑器动作条属嵌入包，红线⑦不改 js；开始显示/finally 隐藏） */
const b = document.getElementById("studioBusy");
if (!b) return;
const t = b.querySelector(".studioBusyText");
if (t) t.textContent = text || "";
b.hidden = !text;
}
function studioInlinePrompt(label) { /* Z6（第六批）：编辑器内就地提示词输入条（hostPrompt 为空时 inpaint/edit-text 就地输入；studioBusy 同层位置；Esc 语义 Z22 B案：输入条在场=Esc 只收口输入条（Toast 保留、编辑器不关；close 清理条目兜底保留）。Z16（第七批）：贴底居中 bottom:14px（原 top:14px 浮顶栏）+ textarea 自动增高 1→6 行封顶滚动（Enter 提交/Shift+Enter 换行）+ 编辑器官方令牌镜像双套配色：--dc-editor-ui-* 属内核 Shadow DOM 内部令牌、宿主不可跨界继承→data-studio-theme 属性选套（初值=Z12 缓存 sc_studio_theme；内核切换经 mount.onThemeChange 实时回写打开中输入条；样式收敛至壳样式块 #studioInlinePrompt 规则） */
return new Promise(function(resolve) {
const modal = document.getElementById("studioModal");
if (!modal) { resolve(""); return; }
const bar = document.createElement("div");
bar.id = "studioInlinePrompt";
bar.setAttribute("role", "dialog");
bar.setAttribute("aria-label", label + "提示词输入");
try { bar.setAttribute("data-studio-theme", localStorage.getItem("sc_studio_theme") === "dark" ? "dark" : "light"); } catch (_) { bar.setAttribute("data-studio-theme", "light"); }
bar.innerHTML = '<span class="sipLabel">' + label + '提示词</span>'
+ '<textarea id="studioInlineInput" rows="1" placeholder="描述要修改的内容…（Enter 提交，Shift+Enter 换行）" aria-label="提示词"></textarea>'
+ '<button id="studioInlineOk" class="sipBtnOk" type="button">确定</button>'
+ '<button id="studioInlineNo" class="sipBtnNo" type="button">取消</button>';
modal.appendChild(bar);
const inp = bar.querySelector("#studioInlineInput");
let done = false;
const finish = v => { if (done) return; done = true; if (bar.parentNode) bar.remove(); resolve(v); };
const grow = function() { /* Z16：自动增高 1→6 行（122px=行高 18×6+上下 padding 12+边框 2 封顶，超出滚动；border-box 下 +2 边框补偿）。空值恒 32px 定标——30ms 首测时布局/字体未稳，长 placeholder 会于窄态换行撑大 scrollHeight 造成锁高（e2e149 B1 实证），非空输入时布局已稳定走实测 */
try { if (!inp.value) { inp.style.height = "32px"; return; } inp.style.height = "auto"; inp.style.height = Math.min(inp.scrollHeight + 2, 122) + "px"; } catch (_) {}
};
bar._resolve = v => finish(String(v || "").trim());
bar.querySelector("#studioInlineOk").addEventListener("click", () => finish(String(inp.value || "").trim()));
bar.querySelector("#studioInlineNo").addEventListener("click", () => finish(""));
inp.addEventListener("input", grow);
inp.addEventListener("keydown", ev => { if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); finish(String(inp.value || "").trim()); } /* Z16：Shift+Enter=换行走默认行为不拦截 */ });
setTimeout(function() { try { inp.focus(); grow(); } catch (e) {} }, 30);
});
}
async function studioAliMatting(imgData) { /* IMPL-143 P0：remove-background → 阿里抠图专用通道（stageImage→probeSize→pickAction→_call；凭据=IMAGESEG_AK/SK，缺=Toast 通道未配置不静默回退） */
if (!(Store.getSegAk() && Store.getSegSk())) { try { Toast.warning("抠出主体的服务通道未配置：请先在设置页解锁阿里云密钥（IMAGESEG_AK/SK）"); } catch (_) {} return false; }
const staged = await SegStudio.stageImage(imgData, null, {});
const size = await SegStudio.probeSize(staged);
const action = SegStudio.pickAction("SegmentCommonImage", size) || "SegmentCommonImage";
const params = {};
params[action === "SegmentHDCommonImage" ? "ImageUrl" : action === "SegmentSkin" ? "URL" : "ImageURL"] = staged;
const res = await SegStudio._call(action, params);
if (!res || !res.ok) {
if (res && res.code === "MissingCredential") { try { Toast.warning("抠出主体的服务通道未配置：请先在设置页解锁阿里云密钥（IMAGESEG_AK/SK）"); } catch (_) {} return false; }
throw new Error((res && res.message) || "阿里抠图通道调用失败");
}
const outUrl = SegStudio.resultUrlOf(res.data);
if (!outUrl) throw new Error("阿里抠图通道未返回结果图片");
return { assetUrl: outUrl };
}
function imageDimsOf(dataUrl) { /* W5 4.5：目标画布长边判定需原图尺寸（惰性解码；失败不阻塞路由——按不可判定处理不降级） */
return new Promise(function(res) {
const im = new Image();
im.onload = function() { res({ w: im.naturalWidth || 0, h: im.naturalHeight || 0 }); };
im.onerror = function() { res({ w: 0, h: 0 }); };
im.src = dataUrl;
});
}
function pickAspectTier(w, h) { /* W5 4.4：比例→速创 aspectRatio 枚举最近档；长边<1024=1K 档、<2048=2K 档、否则 4K 档（枚举集按 doc/79 常规档，字段名/枚举全集为修侧确认项） */
if (!w || !h) return { ratio: "", tier: "", long: 0 };
const R = ["1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3", "21:9", "2:1"];
const target = w / h;
let best = R[0], bd = Infinity;
R.forEach(function(r) { const p = r.split(":"); const d = Math.abs(p[0] / p[1] - target); if (d < bd) { bd = d; best = r; } });
const long = Math.max(w, h);
return { ratio: best, tier: long < 1024 ? "1K" : long < 2048 ? "2K" : "4K", long: long };
}
function actName(a) { const M = { erase: "擦除", outpaint: "扩图", inpaint: "重绘", "angle-adjust": "角度调整", "remove-background": "去背景", "layer-decompose": "图层分解", "edit-text": "改字" }; return (M[a] || "位图结果") + "_" + Date.now(); } /* IMPL-129③：返回契约 name —— 编辑器自动注册资产用；第十三批 H4 同步重绘/角度调整（2026-09-28 拍板）；IMPL-162 消除→擦除命名同步 */
async function promptReverseForStudio(pngDataUrl) { /* 第十三批 H9：编辑器「提示词反推」handler——SKILL_PROMPTS["visual-prompt-reverse"] 直用不改（修拍板）+ 识图模型 Store.getSkillVisionModel()（默认 dashscope:qwen3.8-omni-flash=技能面板现役同款）+ Api.llmChatStream 单轮；返回纯文本提示词 */
if (!pngDataUrl || !/^(data|https?):/i.test(String(pngDataUrl))) throw new Error("提示词反推需要位图 PNG 输入（data:/https: URL）");
const sys = (typeof SKILL_PROMPTS !== "undefined" && SKILL_PROMPTS["visual-prompt-reverse"]) || "";
if (!sys) throw new Error("SKILL_PROMPTS[visual-prompt-reverse] 缺失");
const vm = (typeof Store !== "undefined" && Store.getSkillVisionModel) ? Store.getSkillVisionModel() : "dashscope:qwen3.8-omni-flash";
const messages = [
{ role: "system", content: sys },
{ role: "user", content: [ { type: "text", text: "请按系统设定反推这张图的提示词，只输出最终那条中文提示词本身。" }, { type: "image_url", image_url: { url: pngDataUrl } } ] }
];
let out = "";
let _pr19u = null, _pr19m = "";
await Api.llmChatStream(messages, { model: vm, temperature: 0.3, maxTokens: 1024, tag: "studio-prompt-reverse", onDelta: function(d) { out += d; }, onUsage: function(u, meta) { _pr19u = u; _pr19m = (meta && meta.model) ? String(meta.model) : ""; } });
out = String(out || "").trim();
if (!out) throw new Error("识图返回为空（模型 " + vm + "）");
/* ★ R19：反推也是一笔钱（用户点一次 = 一次 LLM 调用）—— 同一套 calcEstimate 报账。
   反推用的模型多是 dashscope 系（Store.getSkillVisionModel）⇒ 费率未知 ⇒ 显示 token 数。 */
try {
const _p0 = _pr19m ? SKILL_MODEL_PRESETS.find(function(m) { return m.id === _pr19m; }) : null;
const _p = (_p0 && _p0.billing) ? _p0 : (_pr19m && LLM_RATE_TABLE[_pr19m] ? { id: _pr19m, billing: LLM_RATE_TABLE[_pr19m] } : _p0);
const _i = _pr19u ? (_pr19u.prompt_tokens != null ? _pr19u.prompt_tokens : _pr19u.input_tokens) : null;
const _ot = _pr19u ? (_pr19u.completion_tokens != null ? _pr19u.completion_tokens : _pr19u.output_tokens) : null;
let _txt = "";
/* ★ R19：**没拿到用量就不进 calcEstimate** —— 算钱的入口只对"真有用量"开放
   （即便 calcEstimate 自身已补 null 边，这里也让语义更直白：无用量 = 不报）。 */
if (_p && (_i != null || _ot != null)) {
const _est = calcEstimate(_p, { inTokens: _i, outTokens: _ot });
if (_est && _est.amount != null) _txt = " · " + _est.label;
}
if (!_txt && (_i != null || _ot != null)) {
const _n = (Number(_i) || 0) + (Number(_ot) || 0);
_txt = " · " + (_n >= 1000 ? (Math.round(_n / 100) / 10) + "k" : String(_n)) + " tokens";
}
if (_txt) {
try { Toast.success("提示词反推 完成" + _txt); } catch (_) {}
try { console.info("[W5-route]", JSON.stringify({ phase: "reverse-cost", model: _pr19m, inTokens: _i, outTokens: _ot, label: _txt, ts: Date.now() })); } catch (_) {}
}
} catch (_e) {}
return out;
}
if (typeof window !== "undefined") { try { window.__studioPromptReverse = promptReverseForStudio; } catch (_) {} } /* 调试可达（同 archiveDataUrlCard 先例） */

/* ══════════════════════════════════════════════════════════════════════════════════
   R15（2026-09-30）：「技能 + 大模型」通道 —— 把宿主**早已有**的技能系统开放给 W5 编辑器
   变更单：studio/W5-宿主R15-变更单-2026-09-30.md（修已授权我方直接改宿主件）
   ★ 原则「零新逻辑」：
     · 图片**原样透传 data:** —— 与上一段 H9 的 promptReverseForStudio 逐字同一先例（它就这么传的）
     · system 由**宿主**组（SKILL_PROMPTS + SKILL_CONTRACT）⇒ 编辑器不复制那 15 段提示词，避免两处漂移
     · model 直传（含 "auto"）⇒ 带图自动切视觉 / 思考守卫 / 端点链重试 / 15s 看门狗 / 用量账本 **全部自动生效**
     · 编辑器**不碰网络、不持 Key** 这条原则不破：所有请求都从这三个函数里出去
   ⚠ 与 SkillSession（技能面板）的**差别**：这里**不做编排**——没有识图接棒 / 多模型会诊 / 文档注入 /
     会话态 / 追问态。它就是**单次调用**；多轮由编辑器自己累积 messages 后再次调用（会话式迭代）。
   ══════════════════════════════════════════════════════════════════════════════════ */

/* messages 形状收口：role / string↔parts / 丢空件。**不动图片内容**。
   ⚠ 刻意**不**在这里把 data: 转存 R2 —— H9 已实证 data: 能直接进 llmChatStream（同一条端点链），
     多一道 R2 依赖反而多一个失败点（R2 未配置时整条通道会挂）。 */
function studioNormalizeMsgs(messages) {
const out = [];
(Array.isArray(messages) ? messages : []).forEach(function(m) {
if (!m || typeof m !== "object") return;
const role = (m.role === "assistant" || m.role === "system") ? m.role : "user";
if (typeof m.content === "string") { if (m.content.trim()) out.push({ role: role, content: m.content }); return; }
if (!Array.isArray(m.content)) return;
const parts = [];
m.content.forEach(function(p) {
if (!p || typeof p !== "object") return;
if (p.type === "text") { const t = String(p.text == null ? "" : p.text); if (t.trim()) parts.push({ type: "text", text: t }); return; } /* 空白 text 与空串同样丢弃——与上面的字符串分支同一口径 */
if (p.type === "image_url" || p.type === "image") {
const u = String((p.image_url && p.image_url.url) || p.url || "");
if (!u || !/^(data|https?):/i.test(u)) return; /* 只放行 data:/http(s)——与 H9 的入参校验同一口径 */
parts.push({ type: "image_url", image_url: { url: u } });
}
});
if (parts.length) out.push({ role: role, content: parts });
});
return out;
}

/* 契约：adapter.tools.llm.chat({ messages, model, skillId, maxTokens, thinking, temperature, signal, onDelta, tag })
         → Promise<string>（纯文本；技能契约要求"只给最终提示词"，编辑器直接落进提示词框）
   thinking 只认显式 boolean；不传则沿用 Store.getSkillThinking()（思考守卫仍在 llmChatStream 内生效）。 */
async function studioSkillChat(opts) {
const o = (opts && typeof opts === "object") ? opts : {};
const skill = o.skillId ? SKILLS.find(function(s) { return s.skillId === String(o.skillId); }) : null;
if (o.skillId && !skill) throw new Error("未知技能：" + String(o.skillId));
if (skill && skill.tab !== "image") throw new Error("该技能不属于图像分类（编辑器只应拿到 image tab）：" + skill.skillId);
const msgs = studioNormalizeMsgs(o.messages);
if (skill) msgs.unshift({ role: "system", content: (SKILL_PROMPTS[skill.skillId] || "") + "\n" + SKILL_CONTRACT }); /* 与 SkillSession.firstRound 逐字同构 */
if (!msgs.length) throw new Error("消息为空——请先写想法或挂参考图");
const mt = Number(o.maxTokens) > 0 ? Number(o.maxTokens) : ((skill && skill.maxTokens) ? skill.maxTokens : 1024);
/* ★★ R19 修 bug：契约是 Promise<string>，但 llmChatStream 的成功出口**一律裸 return**
   （文本只经 onDelta 下发）—— 旧实现直接 return 了它的 undefined ⇒ 编辑器 pickFence 恒为空
   ⇒ 技能成功路径必报「模型没有返回提示词」。⇒ 自己累积并返回；调用方 onDelta 继续透传。 */
let _out = "";
const _userDelta = (typeof o.onDelta === "function") ? o.onDelta : null;
let _r19u = null, _r19m = "";
await Api.llmChatStream(msgs, {
model: o.model, /* 直传，含 "auto" */
temperature: (typeof o.temperature === "number") ? o.temperature : undefined,
maxTokens: mt,
thinking: (typeof o.thinking === "boolean") ? o.thinking : undefined,
signal: o.signal,
onDelta: function(d) { _out += String(d == null ? "" : d); if (_userDelta) { try { _userDelta(d); } catch (_) {} } },
onUsage: function(u, meta) { _r19u = u; _r19m = (meta && meta.model) ? String(meta.model) : ""; },
tag: o.tag ? String(o.tag) : "studio-skill"
});
/* ★ R19：报账 —— 与位图动作**同一套 calcEstimate**。
   · 费率已知（apiyi 三档预设带 billing）⇒ 显示 ≈¥x.xx；
   · 费率未知但有用量 ⇒ 退一档显示 token 数（上游真值，不是估算）；
   · 无用量 ⇒ 静默不加（同 amount:null 口径，不编数）。 */
try {
const _p0 = _r19m ? SKILL_MODEL_PRESETS.find(function(m) { return m.id === _r19m; }) : null;
const _p = (_p0 && _p0.billing) ? _p0 : (_r19m && LLM_RATE_TABLE[_r19m] ? { id: _r19m, billing: LLM_RATE_TABLE[_r19m] } : _p0);
const _i = _r19u ? (_r19u.prompt_tokens != null ? _r19u.prompt_tokens : _r19u.input_tokens) : null;
const _ot = _r19u ? (_r19u.completion_tokens != null ? _r19u.completion_tokens : _r19u.output_tokens) : null;
let _txt = "";
/* ★ R19：**没拿到用量就不进 calcEstimate** —— 算钱的入口只对"真有用量"开放
   （即便 calcEstimate 自身已补 null 边，这里也让语义更直白：无用量 = 不报）。 */
if (_p && (_i != null || _ot != null)) {
const _est = calcEstimate(_p, { inTokens: _i, outTokens: _ot });
if (_est && _est.amount != null) _txt = " · " + _est.label;
}
if (!_txt && (_i != null || _ot != null)) {
const _n = (Number(_i) || 0) + (Number(_ot) || 0);
_txt = " · " + (_n >= 1000 ? (Math.round(_n / 100) / 10) + "k" : String(_n)) + " tokens";
}
if (_txt) {
try { Toast.success((skill ? skill.name : "技能") + " 完成" + _txt); } catch (_) {}
try { console.info("[W5-route]", JSON.stringify({ phase: "skill-cost", model: _r19m, inTokens: _i, outTokens: _ot, label: _txt, ts: Date.now() })); } catch (_) {}
}
} catch (_e) { /* 计费失败绝不影响主流程（同 _noteUsage 的静默口径） */ }
return _out;
}

/* 契约：adapter.tools.skills → [{ skillId, name, description, group, requiredCapabilities, allowEmpty, maxTokens }]
   ★ 只给 image tab（10 条）—— 编辑器是图片编辑器，给 video 技能是误导。
   ★ 由**宿主**给而不是编辑器硬编码：技能表是宿主的数据，两处维护必漂移。 */
function studioSkills() {
return SKILLS.filter(function(s) { return s.tab === "image"; }).map(function(s) {
return {
skillId: s.skillId, name: s.name, description: s.description, group: s.group,
requiredCapabilities: (s.requiredCapabilities || []).slice(),
allowEmpty: s.allowEmpty === true,
maxTokens: s.maxTokens || null
};
});
}

/* 契约：adapter.tools.models → [{ id, label, desc, vision, think }]
   ★ vision / think 用宿主**自己的**判定函数（isVisionModelName / _modelThinkCapable）——
     那两处本来就是「单处收口」（见 4207 附近注释）。编辑器据此灰显，
     **不许**让用户选了之后被静默切换 / 静默降级（"我选的不算数"是最差的反馈）。 */
function studioModels() {
return SKILL_MODEL_PRESETS.map(function(m) {
return { id: m.id, label: m.label, desc: m.desc || "", vision: !!isVisionModelName(m.id), think: !!_modelThinkCapable(m.id) };
});
}
if (typeof window !== "undefined") { try { window.__studioSkillChat = studioSkillChat; window.__studioSkills = studioSkills; window.__studioModels = studioModels; } catch (_) {} } /* 调试可达（同 __studioPromptReverse 先例） */

async function bitmapHandler(e) {
try {
const maskObj = e.mask || null;
let maskData = maskObj ? (maskObj.dataUrl || null) : null; /* ★ mask: e.mask?.dataUrl —— e.mask 直接传会变 "[object Object]" */
/* IMPL-129③：maskMode 以 e.mask.maskMode（编辑器实传枚举）为准；顶层 e.maskRule 仅当为冻结枚举值时采纳（新版契约），中文文案形态一律忽略（IMPL-126 订正纪律不回退） */
const ruleTop = (e.maskRule === "alpha-transparent" || e.maskRule === "luma-white") ? e.maskRule : null;
const maskMode = maskObj ? (maskObj.maskMode || ruleTop || "alpha-transparent") : "alpha-transparent";
if (maskData && maskMode === "luma-white") maskData = await invertMaskToAlpha(maskData);
let userData = hostPrompt() || ((e.options && typeof e.options === "object" && e.options.prompt) ? String(e.options.prompt) : ""); /* R8（2026-09-29）：**先认编辑器面板那一份** —— 面板写的提示词走 e.options.prompt，而旧版只读宿主自己的输入框 ⇒ 面板里写过了宿主也不知道 ⇒ 判空 ⇒ 弹就地输入条 = 逼用户写第二遍（修 09-28 第 3 条）。⚠ 这里**不能引 op13**：op13 在本行之后（16410 行）才 const 定义，提前引用会踩 TDZ 直接抛 ReferenceError ⇒ 必须直接读 e.options */
if ((e.action === "inpaint" || e.action === "edit-text") && !userData) { /* Z6（第六批）：宿主输入框为空 → 编辑器内就地输入条（官方案定：prompt 由嵌入方传入，替掉工作台硬门禁） */
userData = await studioInlinePrompt(e.action === "inpaint" ? "重绘" : "编辑文字"); /* 第十三批 H4：标签同步「重绘」 */
if (!userData) { try { Toast.info("已取消：未填写提示词"); } catch (_) {} return false; }
}
const needPrompt = e.action === "inpaint" || e.action === "edit-text"; /* H1b（十三批）：重绘无选区=整层改图——maskData=null 时 studioEdits 不传 mask 字段天然支持，不报错不二次确认（修拍板） */
if (e.action === "erase" && !maskData) { try { Toast.warning("擦除动作需要先用选区工具框选区域，再执行"); } catch (_) {} return false; } /* IMPL-129③：擦除语义依赖选区，无选区整图重绘必错；文案 IMPL-162 消除→擦除（正常路径由编辑器 R6 选区门禁先拦，本条保留为宿主自保） */
const req = e.buildRequest(needPrompt ? { prompt: userData } : {});
let finalPrompt = (req && req.fields && req.fields.prompt) || userData || ""; /* W5：let——mask 动作需追加保真约束句 */
const op13 = (e.options && typeof e.options === "object") ? e.options : null; /* 第十三批 H1：统一参数透传通道（全位图动作）——{model,aspectRatio,resolution,quality,background,prompt,num} */
const oo13 = op13 || e.outpaintOptions || null; /* 十二批 outpaintOptions 保留兼容（已上线件在用），options 优先 */
const ooPrompt13 = (oo13 && oo13.prompt) || "";
if (ooPrompt13 && finalPrompt.indexOf(ooPrompt13) < 0) finalPrompt = (finalPrompt ? finalPrompt + "；" : "") + ooPrompt13; /* H3（十三批）：面板/参数条描述追加并入（全动作，追加非替换；空着一字不加）——T12-4 语义保持并推广；R8（2026-09-29）：**去重** —— 改判据为「**该句已经出现在 finalPrompt 里就不再加**」而不是「与 userData 比字符串相等」：因为 buildRequest 会加工提示词（edit-text 套模板「把遮罩区域内的文字内容改为「X」…」、layer-decompose 前置内置提示词、inpaint 原样返回）⇒ userData 与 req.fields.prompt 在多数动作下**并不相等**，按相等判据会重复拼接。用 indexOf 判"已包含"对全部动作都成立：inpaint 时 finalPrompt 就是它本身、edit-text/拆解时它已在模板内、扩图/擦除时 finalPrompt 是内置 spec 词不含它 ⇒ 照旧追加（H3 语义不变） */
const imgData = await blobUrlToDataURL(e.url);
const m = (typeof UI !== "undefined" && UI.state && UI.state.model) ? UI.state.model : null;
const canI2I = !maskData && m && (m.direct === "sf-image" || m.direct === "ds-image");
/* IMPL-143 P0：模型一律按 BITMAP_MODEL_MAP（160 指令书清单）——e.model 仅编辑器建议值不透传；
   表内动作：ali→阿里抠图专用通道、sf→studioEdits(modelId)；表外动作沿用旧决策链（宿主选中直连模型优先→SF_EDIT_MODEL 兜底） */
const mm = BITMAP_MODEL_MAP[e.action] || null;
/* ★ 2026-10-01 APIYI 通道分流：用户在编辑器"模型键"里选了 APIYI 的模型 ⇒ 走 /media/apiyi，不走速创。
   ⚠ 判据 = MODELS.image 的 **channel 字段**（唯一真值），不是动作表 —— 动作表定义的是**缺省**通道。
   放在 wy 块之前**提前返回**，wy 那整段一行不动（改动面最小、回归风险最低）。 */
/* R16：三来源依次回落 —— ① 用户在模型键里显式选的 ② **动作表指定的默认档** ③ 都没有则走速创 */
const apiDef = (op13 && op13.model) ? apiModelById(op13.model)
            : (mm && mm.channel === "apiyi" && mm.model) ? apiModelById(mm.model) : null;
if (apiDef) {
const wA = (typeof Store !== "undefined" && Store.getR2WorkerUrl && Store.getR2WorkerUrl());
if (!wA) { try { Toast.warning(mm ? mm.label : actName(e.action)) + "：APIYI 通道未配置（设置页填 R2 Worker 地址与 Token）"; } catch (_) {} return false; }
const exA = {};
if (op13 && op13.quality) exA.quality = String(op13.quality);
/* ★★ R93：编辑器算好的「与源图同几何的合法输出尺寸」（apiyiEdits 在 size 为空且有 mask 时采用） */
if (e.maskSize) exA.maskSize = String(e.maskSize);
if (oo13 && oo13.aspectRatio) exA.aspectRatio = String(oo13.aspectRatio);
if (oo13 && oo13.resolution) exA.resolution = String(oo13.resolution);
if (op13 && op13.background) exA.background = String(op13.background);
if (op13 && Array.isArray(op13.urls) && op13.urls.length) {
const rds = op13.urls.map(function(u) { return u && u.dataUrl; }).filter(Boolean);
if (rds.length) { exA.refDataUrls = rds.slice(0, 3); if (rds.length > 3) console.info("[W5-route]", JSON.stringify({ phase: "ref-cap", got: rds.length, send: 3, ts: Date.now() })); }
}
if (maskData) finalPrompt = (finalPrompt ? finalPrompt + "；" : "") + "仅修改蒙版区域内的内容，蒙版外严格保持原样";
/* R82：无蒙版时不能说「只修改蒙版区域」—— 那是把模型指向一个不存在的区域 */
if (exA.refDataUrls && exA.refDataUrls.length) finalPrompt = (finalPrompt ? finalPrompt + "；" : "") + (maskData ? "第 1 张为待修改的原图，其余为参考图，只修改第 1 张上蒙版圈出的区域" : "第 1 张为主图，其余为参考图，请综合参考其内容与风格");
/* ★ R17①（修采纳）：等急了再点一次 = **双倍钱**（官方：断连不取消上游、照样计费）⇒ 明确劝阻。 */
studioBusy((mm ? mm.label : "处理") + " 进行中… 已提交，别重复点击");
try {
/* ★ 三条路按模型自己的能力分流，**不是按动作**：
   · gemini（Nano Banana 系）⇒ 走 Gemini 原生端点，**不吃 mask**（它没有这个字段）
   · 有 mask ⇒ /v1/images/edits（multipart，mask 只对第 1 张 image 生效）
   · 无 mask ⇒ /v1/images/generations（JSON）
   ⚠ gemini 分支若真收到 mask（正常路径不会 —— 编辑器在"需要 mask"时不列它），
     **不静默丢弃**：留痕后继续（源图已作为输入图传入，语义上仍是"改这张图"）。 */
if (maskData && apiDef.gemini) console.info("[W5-route]", JSON.stringify({ phase: "apiyi-gemini-mask-ignored", model: apiDef.endpointModel, note: "Gemini 原生无 mask 字段，已改为整图指令编辑", ts: Date.now() }));
const _isVideo = String(apiDef.type || "") === "video";   /* R32-V1：视频走独立适配器（异步任务链） */
const rA = _isVideo
  ? await apiyiVideo(finalPrompt, apiDef, exA, imgData, exA.refDataUrls)
  : (apiDef.gemini
  ? await apiyiGemini(finalPrompt, apiDef, exA, imgData, exA.refDataUrls)
  : ((maskData || ((exA.refDataUrls && exA.refDataUrls.length) && imgData)) ? await apiyiEdits(imgData, maskData, finalPrompt, apiDef, exA) : await apiyiImages(imgData, finalPrompt, apiDef, exA)));   /* R82：有参考图也走 edits —— 否则 apiyiImages 会把参考图整个丢掉 */
rA.name = actName(e.action);
/* ★ R5：把上游回的用量交给**既有的** calcEstimate（不另写算钱的代码），结果只取一个「≈¥x.xx」。
   ⚠ calcEstimate 对"没有用量 / 费率未知"会返回 amount:null —— 那时**什么都不加**（不显示 0 元、不编数）。 */
let _costTxt = "";
try {
const _u = rA.usage || {};
const _est = calcEstimate(apiDef, { inTokens: _u.inTokens != null ? _u.inTokens : _u.input_tokens, outTokens: _u.outTokens != null ? _u.outTokens : _u.output_tokens });
if (_est && _est.amount != null) {
_costTxt = " · " + _est.label;
console.info("[W5-route]", JSON.stringify({ phase: "apiyi-cost", model: apiDef.modelId, inTokens: _u.inTokens != null ? _u.inTokens : _u.input_tokens, outTokens: _u.outTokens != null ? _u.outTokens : _u.output_tokens, cny: Math.round(_est.amount * 100) / 100, ts: Date.now() }));
}
} catch (_e) { /* 计费失败绝不影响主流程（同 _noteUsage 的静默口径） */ }
try { Toast.success((mm ? mm.label : actName(e.action)) + " 完成" + _costTxt); } catch (_) {}
return rA;
} catch (err) {
console.error("[StudioEditor] APIYI 位图动作失败:", err);
/* ★ R17②（修采纳）：上游对这两种失败的**计费口径完全相反**，混在一起会让用户白花第二次钱。
   判据取自官方文档：审核拦截在**响应里**表现为无图 + IMAGE_SAFETY / 提示词被拒；
   超时/断连则是我们这侧或链路的错 —— **那种上游照样计费**。 */
const _raw = String((err && err.message) || err);
const _isSafety = /IMAGE_SAFETY|审核|safety|content[_ ]?policy|被拒绝/i.test(_raw);
const _isTimeout = /timeout|超时|AbortError|network|网络|Failed to fetch/i.test(_raw);
const _hint = _isSafety ? " · 这次**没有扣费**，可以直接重试"
            : _isTimeout ? " · 这次**已经计费**（上游照样收费），先别急着重试"
            : "";
throw new Error("APIYI · " + apiDef.modelId + "：" + _raw + _hint);
}
} /* APIYI 分流结束 */
studioBusy((mm ? mm.label : actName(e.action)) + " 处理中… · " + (mm ? (mm.channel === "ali" ? "阿里抠图专用通道" : "模型 " + mm.model) : (canI2I && m ? "宿主选中模型" : "SF 编辑模型")));
if (mm && mm.channel === "ali") { const r3 = await studioAliMatting(imgData); if (!r3) return false; r3.name = actName(e.action); try { Toast.success("抠出主体完成"); } catch (_) {} return r3; } /* IMPL-143：返回 { assetUrl, name } → 编辑器自动注册资产（IMPL-129③ 契约） */
/* ★ R20：用户**显式选了速创档** ⇒ 仍走这条支路（备份服务的底线语义）。
   判定用 wyModelPath 作闸门：它只认 gpt-image-2.5 系裸 id，带 apiyi: 前缀的档一律 "" ⇒ 不误入。 */
const _wyPick = !!(op13 && op13.model && wyModelPath(op13.model));
if (mm && (mm.channel === "wy" || _wyPick)) { /* IMPL-150：channel 语义更名 sf→wy（速创通道），BITMAP_MODEL_MAP 已同步；R20：+显式选速创档第二入口 */
const sfOk = (typeof KeyVault !== "undefined" && KeyVault.keys && KeyVault.keys().API_KEY) || (typeof Store !== "undefined" && Store.getR2WorkerUrl && Store.getR2WorkerUrl());
if (!sfOk) { try { Toast.warning(mm.label + "的服务通道未配置：缺少图像服务凭据（设置页可配置）"); } catch (_) {} return false; } /* 通道不通不静默 fallback */
/* W5 路由决策（变更单第四节）：quality 策略 + mask 保真约束句 + 省流自动路由 + 每次实际路由进日志 */
const ooRatio = (oo13 && oo13.aspectRatio) || "";
const ooRes = (oo13 && oo13.resolution) || "";
let routedModel = mm.model;
if (op13 && op13.model) { if (wyModelPath(op13.model)) routedModel = String(op13.model); else console.info("[W5-route]", JSON.stringify({ phase: "route-reject", reason: "options.model 非 gpt-image-2.5 系，保留表内默认", given: String(op13.model), keep: routedModel, ts: Date.now() })); } /* H1：参数条显式选模型优先（wyModelPath 合法性闸门，表外拒绝回默认+日志留痕） */
const ex = {};
ex.quality = (op13 && op13.quality) || mm.quality || undefined; /* 4.2+H1：显式 quality 优先；缺省 sunburst=high/flare 不传（=速创默认 medium） */
if (ex.quality && ["low", "medium", "high", "xhigh", "max"].indexOf(String(ex.quality)) < 0) delete ex.quality; /* doc/78 值域白名单外丢弃 */
if (op13 && op13.background) ex.background = String(op13.background); /* H1：背景 auto/transparent 直透 */
if (op13 && op13.num) { const n0 = parseInt(op13.num, 10) || 0; if (n0 >= 1 && n0 <= 4) ex.num = n0; }
/* ★ R15.3（修 2026-10-01 拍板「要动，且要符合实际的工作流程」）：**把编辑器面板挂的参考图送进请求**。
   编辑器通过 `options.urls` 给的是 `[{dataUrl,width,height,name}]`（编辑器只产 dataUrl、不碰网络，
   与 H9「提示词反推」同一条纪律）⇒ 宿主这边只做"透出"，真正的上传与拼装放在 studioEdits
   （它本来就是 async，且已经有 wyUploadDataUrl）。
   ⚠ 上限 3 张（与技能执行拿的参考图数一致）；超出**留痕不静默**（W5-route 日志）。 */
if (op13 && Array.isArray(op13.urls) && op13.urls.length) {
const rds = op13.urls.map(function (u) { return u && u.dataUrl; }).filter(Boolean);
if (rds.length) {
ex.refDataUrls = rds.slice(0, 3);
if (rds.length > 3) console.info("[W5-route]", JSON.stringify({ phase: "ref-cap", got: rds.length, send: 3, ts: Date.now() }));
}
} /* S1：多候选张数 1~4 透传（接口预留） */
if (maskData) finalPrompt = (finalPrompt ? finalPrompt + "；" : "") + "仅修改蒙版区域内的内容，蒙版外严格保持原样"; /* 4.3：input_fidelity 速创不透传，保真唯一硬手段=mask+约束句 */
/* ★ R15.3：参考图存在时补一句**事实声明** —— 源图与参考图同处 urls 一个数组，不说清模型只能靠蒙版猜。
   ⚠ 与第 16521 行那条「仅修改蒙版区域内的内容…」同一性质：只说事实，不写风格。 */
/* R82：同上 —— 无蒙版时改说「主图/参考图」，不提蒙版 */
if (ex.refDataUrls && ex.refDataUrls.length) finalPrompt = (finalPrompt ? finalPrompt + "；" : "") + (maskData ? "第 1 张为待修改的原图，其余为参考图，只修改第 1 张上蒙版圈出的区域" : "第 1 张为主图，其余为参考图，请综合参考其内容与风格");
let economized = false;
const dims = await imageDimsOf(imgData);
if (!e.sourceImage) e.sourceImage = { width: dims.w, height: dims.h }; /* H2：源图像素真值回填（编辑器未带时宿主解码补齐；naturalWidth 级别真值） */
const tgt = pickAspectTier(dims.w, dims.h);
if (e.action === "outpaint") { ex.aspectRatio = ooRatio || tgt.ratio; ex.resolution = ooRes || tgt.tier; } /* B2/T12-4 规则保持：扩图显式档位优先，自动=估档（与十二批改造后逐字一致） */
else if (ooRatio) ex.aspectRatio = ooRatio; /* H1：非扩图动作显式才透传比例，自动=维持原行为（不下发） */
if (ooRes) ex.resolution = ooRes; /* H1：显式分辨率全动作透传（含非扩图） */
if ((e.action === "layer-decompose") && tgt.long && tgt.long < 1024 && !ooRes && !(op13 && op13.model)) { economized = true; routedModel = "gpt-image-2.5"; ex.economized = true; delete ex.quality; } /* 4.5 省流：动作集（IMPL-162 拍板 2026-09-28：angle-adjust 移出——几何重绘细节优先，W5 嵌入态实测长边<1024 输入被降级 sunburst→标准档、economized:true 不达 §6-2 验收判据；原 H1 推广对该动作撤销，layer-decompose 维持（R8 2026-09-29：**outpaint 也移出**——扩图是编辑型动作，而省流档 gpt-image-2.5 是「标准生成型」= 按提示词**重画整张图** ⇒ 背景全变、原图被重构；且「长边<1024 + 扩图面板分辨率默认=自动档(value 空串) ⇒ !ooRes + 扩图不传 model」四个条件**默认全中**，用户点一次扩图就必然命中；正常路径 BITMAP_MODEL_MAP.outpaint = sunburst 本就带 mask。⚠ 代价：小图扩图由 0.1 元档改走 0.3 元档，修已拍板接受）；W5 侧无需带 model，显式 options.model 不降级语义不变）；仅「自动」档应用（T12-4/B4 规则推广） */ /* 标准生成型无 quality 参数（doc/78） */
let ang13 = null; /* H4.1（十三批 2026-09-28）：angle-adjust 结构化形状 {operation:"multiangle",params:{horizontal_angle,vertical_angle,zoom},anglePrompt}——默认 31/-21/1、三轴值域照珊瑚镜像；宿主职责=日志对拍+文本兜底（速创 body 无结构化通道，不污染请求体） */
if (e.action === "angle-adjust" && op13 && op13.operation === "multiangle" && op13.params && typeof op13.params === "object") {
ang13 = { operation: "multiangle", horizontal_angle: op13.params.horizontal_angle, vertical_angle: op13.params.vertical_angle, zoom: op13.params.zoom }; /* 三轴原值透记（旋转 0-360 / 倾斜 -30~60 / 缩放 0.5-4，校验在 W5 面板侧） */
const ap13 = String(op13.anglePrompt || "").trim();
if (ap13) finalPrompt = (finalPrompt ? finalPrompt + "；" : "") + ap13; /* H4.1：速创仅收文本（prompt/urls/mask），params 无下发通道 → 按拍板用 anglePrompt 兜底并入（追加非替换，H3 同语义） */
}
console.info("[W5-route]", JSON.stringify({ phase: "route", action: e.action, channel: "wy", model: routedModel, economized: economized, quality: ex.quality || null, aspectRatio: ex.aspectRatio || null, resolution: ex.resolution || null, mask: !!maskData, operation: ang13 ? ang13.operation : null, angles: ang13 ? [ang13.horizontal_angle, ang13.vertical_angle, ang13.zoom] : null, ts: Date.now() })); /* Z21：+phase 区分路由决策/提交/完成三段日志；H4.1：angle-adjust 回显收到的 operation 与三角度（对拍 W5 面板实传值） */
studioBusy(mm.label + " 处理中… · 模型 " + routedModel + (economized ? "（标准生成型·省流）" : "") + (ex.quality ? " · quality=" + ex.quality : "") + (ex.aspectRatio ? " · " + ex.aspectRatio + "/" + ex.resolution : ""));
const r1 = await studioEdits(imgData, maskData, finalPrompt, routedModel, ex); r1.name = actName(e.action);
try { Toast.success(mm.label + " 完成 · 模型 " + routedModel + (economized ? "（省流）" : "")); } catch (_) {}
return r1;
}
if (maskData) { const r1 = await studioEdits(imgData, maskData, finalPrompt); r1.name = actName(e.action); return r1; } /* IMPL-129③ 契约保持 */
if (canI2I && m.direct === "sf-image") {
const r = await Api._sfImage(m, { prompt: finalPrompt, image: imgData, image_size: "1024x1024" });
return { assetUrl: r.url, name: actName(e.action) }; /* IMPL-129③ */
}
if (canI2I && m.direct === "ds-image") {
const r = await Api._dsImage(m, { prompt: finalPrompt, urls: imgData });
return { assetUrl: r.url, name: actName(e.action) }; /* IMPL-129③ */
}
const r2 = await studioEdits(imgData, null, finalPrompt); r2.name = actName(e.action); return r2; /* IMPL-129③ */
} catch (err) {
console.error("[StudioEditor] 位图动作失败:", err);
const rawMsg = String((err && err.message) || err);
/* ★ R17②：与 APIYI 分支同一判据 —— 让**所有通道**的失败都讲清"扣没扣钱"。
   （已有 _hint 的错（APIYI 分支抛的）**不重复追加**。） */
const _r17Safety = /IMAGE_SAFETY|审核|content[_ ]?policy|被拒绝/i.test(rawMsg);
const _r17Timeout = /timeout|超时|AbortError|Failed to fetch|网络/i.test(rawMsg);
const _r17Hint = /没有扣费|已经计费/.test(rawMsg) ? ""
               : _r17Safety ? "（这次没有扣费，可直接重试）"
               : _r17Timeout ? "（这次已经计费，先别急着重试）" : "";
const m9 = /HTTP\s+(\d{3})/.exec(rawMsg); const st = (err && err.status) || (m9 ? parseInt(m9[1], 10) : 0); /* Z9（第六批）：Api.request 抛错 Object.assign 附着 err.status */
const mmL = (typeof BITMAP_MODEL_MAP !== "undefined" && BITMAP_MODEL_MAP[e.action] || {}).label || "位图动作";
if (st === 401) { try { Toast.error(mmL + "的服务未授权（HTTP 401）：Worker 令牌无效或未配置——请到设置页检查 R2 Worker 地址与 Token（不静默回退）"); } catch (_) {} }
else if (st === 404) { try { Toast.error(mmL + "的服务通道未部署（HTTP 404）：Worker 的 wy / apiyi 代理路由未上线、或该端点不在 APIYI 白名单内、或模型名不在本令牌分组里——已按规约不静默回退"); } catch (_) {} }
else if (st >= 400 && st < 500) { try { Toast.error(mmL + "的服务通道未配置或上游不可用（HTTP " + st + "）——已按规约不静默回退"); } catch (_) {} }
else if (/HTTP\s+4\d\d/i.test(rawMsg)) { try { Toast.error(mmL + "的服务通道未配置或上游不可用（" + rawMsg.slice(0, 90) + "）——已按规约不静默回退"); } catch (_) {} }
else { try { Toast.error("位图动作失败: " + rawMsg + _r17Hint); } catch (_) {} }
return false;
} finally { studioBusy(""); } /* IMPL-143 P2：无论成败收反馈条 */
}
if (typeof window !== "undefined") { try { window.__studioBitmap = bitmapHandler; } catch (_) {} } /* R20-2：调试可达（同 __studioPromptReverse 先例） */
function open(opts) {
opts = opts || {};
close();
onSaveCb = opts.onSave || null;
ov = document.createElement("div");
ov.className = "studioOverlay";
ov.innerHTML = '<div class="studioModal" id="studioModal" role="dialog" aria-modal="true" aria-label="图片工作台">'
+ '<div class="studioBusy" id="studioBusy" hidden><span class="studioBusySpin" aria-hidden="true"></span><span class="studioBusyText"></span></div>' /* IMPL-143 P2：位图动作执行期反馈条 */
+ '<div class="studioTopbar"><span class="studioTitle">图片工作台</span><span class="studioHint">编辑 · 裁切 · 排版 — 位图动作由工作台模型执行 · 提示词取自工作台输入框</span>'
+ '<div class="studioTopActions"><button class="studioClose" type="button" aria-label="关闭编辑器" title="关闭 (Esc)"><svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></div></div>'
+ '<div id="image-studio-root"><div class="studioLoading" role="status" aria-live="polite"><span class="studioLoadingSpin"></span>编辑器加载中…</div></div></div>';
document.body.appendChild(ov);
ov.querySelector(".studioClose").addEventListener("click", close);
/* Z1（第六批）：点遮罩空白不再关闭编辑器（修拍板）——原 pointerdown 关闭监听已删；✕ 与 Esc 关闭保留 */
escHandler = function(e) { /* Z22 B案（IMPL-151 修拍板）：输入条在场=Esc 只收口输入（走输入条自身取消路径，Toast「已取消」保留），编辑器保留——再按一次 Esc 才退编辑器；无输入条=原语义不变（回归 A3） */
if (e.key !== "Escape") return;
const ip = document.getElementById("studioInlinePrompt");
if (ip && ip._resolve) { e.stopPropagation(); try { ip._resolve(""); } catch (_) {} return; }
e.stopPropagation();
/* 第十二批 T12-2（修拍板「只去掉『关弹窗』这一句」）：Esc 不再关闭整个画板 —— 关闭入口只保留顶栏 ✕。
   这里仍保留 stopPropagation：编辑器内部场景（选区/文字/扩图面板）各自消费完再放行，宿主不必也不应抢。 */
};
document.addEventListener("keydown", escHandler, true);
const myOv = ov; /* 连续开关守卫：挂起的 loadStudio 只服务当次弹框 */
const host = ov.querySelector("#image-studio-root");
loadStudio().then(function(ImageStudio) {
if (ov !== myOv) return;
const loadingEl = myOv.querySelector(".studioLoading");
if (loadingEl) loadingEl.remove();
api = ImageStudio.mount(host, {
theme: (function() { try { var _dt = document.documentElement.getAttribute("data-theme"); if (_dt === "dark" || _dt === "light") return _dt; } catch (_) {} try { return localStorage.getItem("sc_studio_theme") || "dark"; } catch (_) { return "dark"; } })(), /* R45-5：内核主题跟随宿主 data-theme（避免「暗外壳+亮内核」）；宿主未定主题才回退缓存，缺省由浅改暗 */ /* Z12（第七批）：读缓存缺省浅色——首次打开=浅色；用户在编辑器内切换经 onThemeChange 写回缓存，下次打开沿用（getTheme 可作宿主查询兑底，本处缓存空时缺省与契约一致无需用） */
layout: "fill", /* ★ 嵌入形态：填满卡片内部，不盖整页 */
adapter: {
applyToNode: function(p) { return handleApply(p); },
bitmapActions: {
erase: bitmapHandler,
outpaint: bitmapHandler,
inpaint: bitmapHandler,
"angle-adjust": bitmapHandler, /* 第十三批 H4：角度调整注册（W5 工具菜单→宿主路由；2026-09-28 拍板定名） */
"remove-background": bitmapHandler,
"layer-decompose": bitmapHandler,
"edit-text": bitmapHandler
},
tools: {
promptReverse: function(png) { return promptReverseForStudio(png); }, /* 第十三批 H9：提示词反推 handler——契约 adapter.tools.promptReverse(pngDataUrl)→Promise<string>（纯文本，编辑器落参数条提示词框） */
/* ★ R15（2026-09-30）：以下三条为**纯新增**（修已授权我方直接改宿主件）——
   定义见文件上方 studioSkillChat / studioSkills / studioModels；
   契约形状、四条硬要求、以及「不需要你们做的事」7 条见 studio/W5-宿主R15-变更单-2026-09-30.md。
   ⚠ `promptReverse` 逐字未动；旧嵌入件只读它，新增字段对旧件不可见 ⇒ 零影响。 */
llm: { chat: function(opts) { return studioSkillChat(opts); } },
skills: studioSkills(),
models: studioModels()
},                                  /* tools 结束 */
},
on: { onError: function(err) { try { Toast.error(String((err && err.message) || err)); } catch (_) {} }, close: close, onThemeChange: function(t) { try { if (t === "light" || t === "dark") { localStorage.setItem("sc_studio_theme", t); const b = document.getElementById("studioInlinePrompt"); if (b) b.setAttribute("data-studio-theme", t); } } catch (_) {} } /* Z16（第七批）：+回写打开中输入条主题 */ } /* IMPL-129②：编辑器内点 ✕ → 调用宿主 close 关闭弹窗；旧版嵌入包忽略未知键无副作用。Z12（第七批）：+onThemeChange 编辑器内置主题开关回告写缓存（附录 A 契约，向后兼容；挂载初值不回告防回环——白名单校验仅收 light/dark） */
,
/* ★★ V2 视频通道（R33 建 · R35 修正位置）：**挂 mount 顶层** —— 编辑器 embed 读的是
   options.videoHandlers（顶层优先）/ adapter.videoActions（兼容位）。
   R33 误挂 adapter 内 ⇒ 编辑器读到空对象 ⇒ 「视频」按钮永远灰（10-04 真机实测）。
   ⚠ 不要改回 adapter 内；adapter 里的兼容位名字是 videoActions（复数）。 */
videoHandlers: { generate: function (req) {
  if (typeof makeVideoHandler !== "function") {
    return Promise.reject(new Error("宿主视频通道未就绪：makeVideoHandler 未定义（宿主与编辑器版本不匹配）"));
  }
  return makeVideoHandler()(req);
}, 
/* ★★ R44（2026-10-05）：**提交前核验通道**（修：「符合规范的方能提交 不符合的就弹出提醒」）。
   纯本地、**同步、不出网、不烧积分** —— 编辑器点发送前先问它，不通过就不提交并弹提醒。
   规则来源（单一真值源，不抄第二份）：
     · 通用层：必填缺 / 素材数超上限 / 无任何输入（编辑器数据驱动）
     · 速创层：**直接调用宿主既有** normalizeAndValidateApiBody（互斥/尾帧配对/上限/本地地址）
     · APIYI 层：只放官方明文约束（VEO input_reference 单数、仅 1 张）
   见 _r34_video_host_bridge.js 的 validateVideoRequest()（同一份折叠逻辑，保证
   "校验的输入 == 发出的输入"）。 */
validate: function (req) {
  if (typeof validateVideoRequest !== "function") {
    return { ok: false, errors: [{ level: "error", message: "宿主核验通道未就绪（validateVideoRequest 未定义，宿主与编辑器版本不匹配）—— 请刷新页面" }] };
  }
  try {
    return validateVideoRequest(req);
  } catch (e) {
    return { ok: false, errors: [{ level: "error", message: "核验出错：" + String((e && e.message) || e) }] };
  }
} },
modelCatalog: buildModelCatalog() /* 第十三批 H7：参数 schema 宿主下发（actions×7 + models×3 含 SVG 图标）；旧嵌入包忽略未知键无副作用 */
});
const imgList = (opts.images && opts.images.length ? opts.images.slice(0, 12) : (opts.url ? [opts.url] : [])); /* W5 反馈①：多选一起进编辑器——images 数组逐张拉取后一次性 loadFiles（编辑器 loadFiles 原生接受数组，红线⑦未改 js） */
const directOf = function(u) { /* Z15（第七批）：weserv 代理 URL 反解出原链，代理失败时回退直连用；data: 与非代理 URL 原样返回 */
try {
if (u.indexOf("https://images.weserv.nl/") === 0) {
const m = /[?&]url=([^&]+)/.exec(u);
if (m) { const _dv = decodeURIComponent(m[1]); /* ★ R76-B：**无 CORS 的域**（*.r2.dev）解包后直连必失败（img 能显示但 fetch 抛 Failed to fetch）⇒ 保持 weserv 代理 */ if (/(^|\.)r2\.dev$/i.test(String(_dv).replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split("/")[0])) return u; return /^[a-z][a-z0-9+.-]*:/i.test(_dv) ? _dv : "https://" + _dv; }
}
} catch (_) {}
return u;
};
const fetchTO = function(u, ms) { /* Z15（第七批）：单图 fetch 10s 超时（AbortController），防 weserv 慢批次 20s+ 卡死「加载不进图片」 */
const c = (typeof AbortController === "function") ? new AbortController() : null;
if (!c) return fetch(u);
const t = setTimeout(function() { try { c.abort(); } catch (_) {} }, ms);
return fetch(u, { signal: c.signal }).finally(function() { clearTimeout(t); });
};
if (imgList.length) {
(async function() {
try {
const files = [];
for (let i = 0; i < imgList.length; i++) {
let res = null, lastErr = null; /* Z15（第七批）：先走 weserv 代理（crossOrigin 可导出语义保持），超时或 !ok 再试直连原 URL（weserv 抓不到源会回 404+json，直连或可救） */
try { res = await fetchTO(imgList[i], 10000); } catch (e) { lastErr = e; }
if (!res || !res.ok) {
res = null;
try { res = await fetchTO(directOf(imgList[i]), 10000); } catch (e) { lastErr = e; }
}
if (!res || !res.ok) throw new Error((res && !res.ok) ? ("HTTP " + res.status) : ((lastErr && lastErr.name === "AbortError") ? "请求超时(10s)" : ((lastErr && lastErr.message) || "fetch failed")));
const blob = await res.blob();
files.push(new File([blob], "reference" + (i + 1) + ".png", { type: blob.type || "image/png" }));
}
await api.loadFiles(files);
} catch (err) {
try { Toast.error("图片加载失败：" + ((err && err.message) || err)); } catch (_) {}
}
})();
}
}).catch(function(err) {
if (ov !== myOv) return;
const root = myOv.querySelector("#image-studio-root");
if (root) {
root.innerHTML = '<div class="studioLoadFail" role="alert">编辑器加载失败，请检查网络后重试<br><button type="button" class="studioRetry">重试</button></div>';
const retry = root.querySelector(".studioRetry");
if (retry) retry.addEventListener("click", function() { open(opts); });
}
try { Toast.error("编辑器加载失败，请检查网络后重试"); } catch (_) {}
});
}
/* ★★★ R44：把视频链路需要的宿主助手**显式暴露到全局**。
   它们都活在本 IIFE 内部，而视频适配器/桥在另一块 <script> ⇒ 裸调 = ReferenceError
   （2026-10-05 实测：APIYI 三档请求一条都发不出去）。取值见 _r44_host_caps.js。 */
window.__w5Host = Object.assign(window.__w5Host || {}, {
  apiyiTimeoutOf: apiyiTimeoutOf,       /* APIYI 请求超时（图片 300/600s，视频同族） */
  wyUploadDataUrl: wyUploadDataUrl,     /* dataURL → R2 公网 URL（速创/Wan 的参考素材必经） */
  wyCompressDataUrl: wyCompressDataUrl, /* 上传前长边压缩（wyUploadDataUrl 内部依赖） */
  dataUrlToFile: dataUrlToFile,         /* dataURL → File（VEO 的 input_reference 必用） */
  /* ★ R68（2026-10-06 P0 热修）：主块 handleGenerate 的 R67 分流需要这几个函数，
     但它们在**本 IIFE 内**、主块 script 标签拿不到（R67 裸调 ⇒ ReferenceError）。
     ⇒ 按 R44 既有机制显式挂全局。 */
  apiModelById: apiModelById,           /* MODELS.image 按 id 取 APIYI 档（channel 是唯一真值） */
  apiyiImages: apiyiImages,             /* 文生图 /v1/images/generations（JSON） */
  apiyiEdits: apiyiEdits,               /* 改图 /v1/images/edits（multipart，mask 只对第 1 张） */
  apiyiGemini: apiyiGemini,             /* Gemini 原生 :generateContent */
  blobUrlToDataURL: blobUrlToDataURL,   /* blob:/https: → dataURL（参考图下载） */
});
return { open: open, close: close };
})();

;

/* ============================================================
   SvFloor —— 画布真透视地台 V2（79-a：内核整体升级为用户优化版引擎）
   ------------------------------------------------------------
   【内核来源】upload/modeling-grid-shadow.html（2026-09 用户优化版，V26.9.167 时点）。
   相比 V1（IMPL-56/69 移植的旧版）内核升级点：
     ① 落影渲染重写：5 档模糊叠加，模糊半径正比「离接触边的距离」（近实远虚）——
        faceK 面光参数 × span，近端带 FLAT=0.22 非零项（离地 lift 自身摊出的半影）；
     ② 8 位抖动 ditherPattern：半影尾巴撒 ±1/255 随机暗度，打散量化横带（banding）；
     ③ 落影层降采样：影层用 1× 分辨率（SDPR=1，全是羽化边），网格层仍吃满 DPR；
     ④ 影层「只擦上一帧包围盒」：外扩 2.2σ+12px，不再整屏 clearRect；
     ⑤ 动效：倾斜 tilt/tiltEase/tiltBack（跟随+独立回弹双缓动）、影随动 shadowFollow、
        鼠标即光源 syncLight（lightAz 摆幅 / lightEl 升降）；
     ⑥ 参数面 = 用户版全集（IMPL-86 出厂默认=用户回传参数：horizon 20 / lens 1230 /
        step 0.1 / fade 3.6 / weight 0.7 / alpha 0.25 / gain 4 / faceK 0.06 /
        shadowOpacity 0.19 / shadowBlur 0 / azimuth 90（对称纵深影，108° 左甩 18° 已纠）/
        elev 51 / lift 0.08 / tilt 2 / tiltEase 0.15 / tiltBack 0.135 / follow 30 /
        lightAz 45 / lightEl 0 / major 5 / axis color / ink 122,130,144 / base #1b1e24（石墨，IMPL-109⑥ 改默认）；
        back 1.4 = 红 X 轴线落位屏幕 ~85% 高度）。

   【宿主集成壳（IMPL-81 背景层化）】
     - 全页背景层 #svFloorBg：body 直挂 fixed inset:0 z:-1（body isolation:isolate 防
       body 背景盖层），双 canvas #svFloorGrid / #svFloorShadow（.sv-floor 类）铺满全视口；
     - 舞台锚 (AX,AY) = #resultList 未滚动视口位（AY=rect.top+scrollTop，内滚恒定），
       相机仍以列表矩形 (W,H) 求解=几何不变，绘制平移后网格线延伸到全视口（左右空白可见）；
     - 结果区镂空（IMPL-84）：.col-results 白底在 ::after 蒙版层（与参数区同材质，
       外框/头部不透网格）；IMPL-86：最近结果区并入镂空窗——applyHole() 取列表 ∪ .strip-dock
       并集矩形（dock 容器材质透明化，网格透到 dock，缩略图芯片保留）；
       render() 末尾 applyHole() 逐帧把并集矩形
       （#resultList.single-view，视口坐标→面板内坐标）写进 --svw* 四变量开窗——
       初版大媒体矩形即整体镂空，网格=全页背景从两大区块四周与窗内同时可见
       （IMPL-82 卡片∪落影小窗 / IMPL-83 卡片中心聚光衰减均按用户反馈废弃，
       聚光半径/36px 白框概念移除，spotGeom() 删除）；网格常显=网页背景，
       落影/倾斜/has-cast 仅 single-view；
     - 目标元素定位 targetOf()（.sv-media.is-plain / .sv-audio / .sv-stage 优先序）；
     - rectOf() 以舞台锚为原点（内容滚动时落影实时跟随卡片）；
     - THEMES 主题色板：影色随 data-theme；用户版 ink/base 色板经映射表融入两主题；
     - FILTER_OK 双保险探测（prototype 访问器 + 真实 blur 采样，IMPL-56）；
       无 ctx.filter 环境保留「降采样小画布放大」兜底（手机端阴影无模糊修复）；
     - innerHTML「摘出-挂回」防御 / ResizeObserver / data-theme MutationObserver /
       resize 监听 / window.SvFloor = { sync, redraw, config } API 不变
       （另增 set()/defaults 供 79-b 设置面板写参，详见尾部注释）。

   【动效的工作台适配（79-a 决策）】
     - 倾斜交互作用对象 = targetOf() 锚元素本体（媒体/音频卡/舞台卡），
       transform: perspective(900px) rotateY/rotateX——与用户 demo 的 #photo 一致；
     - 锚矩形稳定：倾斜期间读「倾斜开始前缓存的基本矩形」（用户 demo 用不倾斜的
       #photoWrap 壳解决同一问题；工作台目标没有壳，改用矩形缓存），松开归位后刷新；
     - 触发域 = #resultList（指针在网格区移动才动，出界即回弹）；触摸/无 hover 环境、
       prefers-reduced-motion、灯箱/弹层/抽屉打开、页签隐藏时一律禁用；
     - 影随动与光源摆动在用户引擎里本就是「指针驱动」，不是常驻环境动画——
       保持该语义，静止时 rAF 归零、零开销；另加「动效总开关」S.motion（默认开）。
   ============================================================ */
(function () {
  "use strict";
  if (window.SvFloor) return;

  /* ---------- 主题色板（宿主壳）：影色/影浓度随 data-theme ---------- */
  /* shadowK：影浓度主题系数——暗色下 0.19×1.58≈0.30，与 V1 暗色调校值一致 */
  var THEMES = {
    light: { name: "light", shadowColor: "34,42,58", shadowK: 1 },
    dark:  { name: "dark",  shadowColor: "6,8,14",   shadowK: 1.58 }
  };
  /* 用户版 ink/base 色板的暗色孪生（light 值 → dark 值）：
     ink 取同气质提亮（默认 '182,188,198' 的孪生即 V1 暗色默认 '198,208,230'）；
     base 为深色地台（浮在地表色之上，1px 内缩避开宿主 inset 高光环）。 */
  var INK_DARK = {
    "150,158,172": "170,178,196",
    "182,188,198": "198,208,230",
    "172,178,168": "190,196,184",
    "112,122,140": "150,162,186",
    "96,140,196":  "130,172,226"
  };
  var BASE_DARK = {
    "#f8f9fb": "#1f2229", "#ffffff": "#23262e", "#f2f3f5": "#1d2027",
    "#e9ecef": "#252a33", "#1b1e24": "#1b1e24",
    "#fafafa": "#101112", "#101112": "#101112"
    /* R46-4：编辑器 canvas 的明暗两值 —— 有了它，珊瑚亮主题切到暗色模式会**自动落到 canvas 暗**，
       而不是留一块亮色地台（原表只有 5 个值，没有 #fafafa ⇒ 之前改完会「又黑又白」）。 */
  };

  function T() {
    return THEMES[document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"];
  }
  function inkOf(th) {
    if (th.name !== "dark") return S.ink;
    if (INK_DARK[S.ink]) return INK_DARK[S.ink];
    var p = S.ink.split(","), out = [];
    for (var n = 0; n < 3 && n < p.length; n++) {
      var c = parseFloat(p[n]); if (!isFinite(c)) c = 160;
      out.push(Math.round(c + (255 - c) * .52));
    }
    return out.join(",");
  }
  /* IMPL-87：hex/rgb 字符串 → [r,g,b]（解析失败返回 null） */
  function rgbOfBase(b) {
    if (!b) return null;
    if (b.charAt(0) === "#") {
      var r = parseInt(b.slice(1, 3), 16), g = parseInt(b.slice(3, 5), 16), bl = parseInt(b.slice(5, 7), 16);
      if (!isFinite(r) || !isFinite(g) || !isFinite(bl)) return null;
      return [r, g, bl];
    }
    var m = b.match(/(\d+\.?\d*)\s*,\s*(\d+\.?\d*)\s*,\s*(\d+\.?\d*)/);
    return m ? [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])] : null;
  }
  /* IMPL-87：影色随基底自适应——半透明暗影叠在深基底上反而「提亮」（不透明度混合
     0.81·base + 0.19·shadow：shadow 亮于 base 时该区域变亮=用户看到的「深色下阴影
     发白」）。把影色每通道钳制到基底亮度的 62%，保证影子永远比地台暗；浅色基底
     不受影响（默认影色远暗于浅底）。 */
  function shColOf(th) {
    var p = th.shadowColor.split(","), r = +p[0], g = +p[1], b = +p[2];
    var bc = rgbOfBase(baseOf(th));
    if (bc) {
      r = Math.min(r, bc[0] * .62); g = Math.min(g, bc[1] * .62); b = Math.min(b, bc[2] * .62);
    }
    return Math.round(r) + "," + Math.round(g) + "," + Math.round(b);
  }
  function baseOf(th) {
    var b = S.base;
    if (!b || b.charAt(0) !== "#") return "";
    if (th.name !== "dark") return b; /* 亮色主题：任意合法 hex 直接作地台底色 */
    if (BASE_DARK[b]) return BASE_DARK[b];
    var r = parseInt(b.slice(1, 3), 16), g = parseInt(b.slice(3, 5), 16), bl = parseInt(b.slice(5, 7), 16);
    if (!isFinite(r) || !isFinite(g) || !isFinite(bl)) return "";
    return "rgb(" + Math.round(r * .13 + 10) + "," + Math.round(g * .13 + 11) + "," + Math.round(bl * .15 + 14) + ")";
  }

  /* ---------- 参数面 = 用户优化版全集（默认值 = 用户版默认值） ----------
     S 即 window.SvFloor.config（活引用）；键名与用户引擎逐一对应：
     （motion 为工作台新增的动效总开关，用户引擎无此项） */
  var DEFAULTS = {
    /* 网格 · 视角（IMPL-86 出厂默认=用户回传参数表：地平线 20/长焦 1230/疏朗 0.1/淡出 3.6/线强 0.25；
       back 1.4 = 红 X 轴线下移到屏幕 ~85% 高度（1.9 时轴线偏上，「红蓝线条往下移动一些」）） */
    vpX: 50, horizon: 20, lens: 1230,
    step: .1, back: 1.4, fadeSpan: 3.6,
    weight: .7, alpha: .25, major: 5, gain: 4, axis: "color",
    shade: 8,                          /* IMPL-85：空间明暗（%）：基底向地平线渐暗的纵深强度，0=关 */
    ink: "122,130,144", base: "#1b1e24", /* IMPL-109⑥：出厂默认改石墨（用户） */
    /* 落影：azimuth 90° = 光源正后方、影子纯向纵深延伸、左右对称——「阴影往左比往右多」
       的根因即 108° 参数语义（cos108°≈-0.31 左甩 18°），默认改 90，面板可调回任意方位；
       lift 0.08 贴地露影；faceK 0.06「小光源实影」档 */
    lift: .08, elev: 51, azimuth: 90, faceK: .06,
    lightAz: 45, lightEl: 0,           /* 鼠标即光源：摆幅/升降（0 = 关该轴） */
    shadowOpacity: .19, shadowBlur: 0,
    /* 动效（用户回传参数）：tilt 2 几乎不倾 / 回弹 tiltBack 0.135 / 影随动 30 */
    tilt: 2, tiltEase: .15, tiltBack: .135, shadowFollow: 30,
    motion: 1                          /* 动效总开关（79-a 新增）：0 = 倾斜/影随动/光源摆动全关 */
  };
  var S = {}; for (var k in DEFAULTS) S[k] = DEFAULTS[k];

  var AXIS_X = "226,74,74", AXIS_Z = "59,113,202"; /* 红 X（横线）/ 蓝 Z（纵线），对齐用户版 */
  var list = null, cvG = null, cvS = null, ctxG = null, ctxS = null, host = null;
  var ctx = null, cam = null, W = 0, H = 0, DPR = 1, raf = 0, AX = 0, AY = 0, lastAX = -1, lastAY = -1, lastW = -1, lastH = -1, VW = 0, VH = 0;
  var lastG = null, lastSh = null, ro = null, moTheme = null, booted = false;
  var offC = null, offCtx = null; /* 无 ctx.filter 环境的降采样兜底小画布（懒建复用） */

  /* 落影层单独用 1× 分辨率，不跟 DPR（内核⑤）：全是羽化边，GPU 双线性放大肉眼无差，
     每次重绘的模糊计算量与纹理上传量降到 1/4。网格层仍 2×（1px 细线必须吃满）。 */
  var SDPR = 1;

  /* ctx.filter 真实支持探测（V1 双保险，IMPL-56）：旧探测「赋值后回读相等」会被 expando 骗过。
     ① prototype 上必须存在 filter 访问器 ② 真实画一遍 blur 并采样扩散区 alpha */
  var FILTER_OK = (function () {
    try {
      if (!window.CanvasRenderingContext2D) return false;
      if (!Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "filter")) return false;
      var c = document.createElement("canvas"); c.width = 32; c.height = 32;
      var g = c.getContext("2d");
      g.filter = "blur(8px)"; g.fillStyle = "#000"; g.fillRect(14, 12, 4, 8); g.filter = "none";
      return g.getImageData(6, 15, 1, 1).data[3] > 2;
    }
    catch (e) { return false; }
  })();

  /* ---------- 宿主与画布（IMPL-81：全页背景层） ----------
     双画布挂 body 级 #svFloorBg（fixed inset:0 z:-1），画布=全视口；
     相机仍在「舞台矩形」坐标系求解（W/H=列表尺寸，几何与镂空前逐像素一致），
     绘制时平移 (AX,AY)=舞台未滚动视口位，网格线自然延伸到左右空白与页底。
     舞台锚 AY = listRect.top + scrollTop（内滚时 r.top 与 scrollTop 等量反变，
     锚恒定=滚动时网格固定不动），落影经 rectOf 实时跟随卡片。 */
  function scrollerOf(el) {
    for (var p = el.parentElement; p; p = p.parentElement) {
      if (p.nodeType !== 1) continue;
      var oy = "";
      try { oy = getComputedStyle(p).overflowY; } catch (e) {}
      if (oy === "auto" || oy === "scroll") return p;
    }
    return null;
  }
  function ensure() {
    list = document.getElementById("resultList");
    if (!list) return false;
    if (!cvG) {
      cvG = document.createElement("canvas"); cvG.id = "svFloorGrid"; cvG.className = "sv-floor"; cvG.setAttribute("aria-hidden", "true");
      cvS = document.createElement("canvas"); cvS.id = "svFloorShadow"; cvS.className = "sv-floor"; cvS.setAttribute("aria-hidden", "true");
      ctxG = cvG.getContext("2d"); ctxS = cvS && cvS.getContext("2d");
    }
    if (!ctxG || !ctxS) return false;
    if (!host) { host = document.createElement("div"); host.id = "svFloorBg"; host.setAttribute("aria-hidden", "true"); }
    if (cvG.parentElement !== host || cvS.parentElement !== host) { host.appendChild(cvG); host.appendChild(cvS); }
    if (host.parentElement !== document.body) document.body.appendChild(host);
    if (!host.classList.contains("on")) host.classList.add("on");
    /* IMPL-89②/⑧：移动端 DPR 封顶 1.6（全页网格双 canvas 逐帧，高 dpr 填充率是移动端帧预算大头），桌面维持 2 */
    DPR = Math.min(window.devicePixelRatio || 1, (window.matchMedia && window.matchMedia("(max-width:768px)").matches) ? 1.6 : 2);
    /* IMPL-118②：视口基准=layout viewport（documentElement.clientWidth/Height=ICB=lvh）——
       iOS Safari window.innerHeight 随 URL 栏伸缩（展开态=svh 小视口），而 #svFloorBg
       fixed inset:0 锚定 lvh：用 innerHeight 时画布恒矮一截且结果态 overflow:clip 无滚动、
       URL 栏永不收起→resize 不触发→网格底部永久截断（用户②）；documentElement 与
       fixed 容器同源，桌面=窗口可视高零回归；旋转/跨断点 clientHeight 变化照常触发签名重绘 */
    var _de = document.documentElement;
    var vw = Math.max(1, _de.clientWidth || window.innerWidth || 0), vh = Math.max(1, _de.clientHeight || window.innerHeight || 0);
    /* IMPL-108②：相机锚 #resultList → .col-results 外壳。列表矩形随每张卡的
       信息条/浮动栏带高（--sv-pt/--sv-pb）与滚动条有无波动 ±15px，camKey 变化触发
       整网重投影=换卡「网格抖动」；面板壳仅随视口/断点变化 → 换卡零重绘（网格像素
       冻结）。镂空窗 --svw* 与落影 rectOf 本就是面板内坐标——坐标系统一收口 */
    var camHost = list.closest(".col-results") || list;
    var r = camHost.getBoundingClientRect();
    if (r.width >= 60 && r.height >= 60) {
      W = Math.round(r.width); H = Math.round(r.height);
      var se = scrollerOf(camHost);
      AX = Math.round(r.left + (se ? (se.scrollLeft || 0) : 0));
      AY = Math.round(r.top + (se ? (se.scrollTop || 0) : 0));
    } else if (!W || W < 60) {
      /* 列表不可见（如移动端参数页签）：全视口默认视角，网格仍作页面背景显示 */
      W = vw; H = vh; AX = 0; AY = 0;
    }
    /* 画布=全视口（无条件铺满，面板暂隐也保持背景连续）；第三列是分辨率倍数：
       网格 DPR（细线），落影 1×（全是羽化边） */
    var pw = Math.max(1, Math.round(vw * DPR)), ph = Math.max(1, Math.round(vh * DPR));
    var pwS = Math.max(1, Math.round(vw * SDPR)), phS = Math.max(1, Math.round(vh * SDPR));
    if (vw !== VW || vh !== VH || AX !== lastAX || AY !== lastAY || W !== lastW || H !== lastH || cvG.width !== pw || cvG.height !== ph || cvS.width !== pwS || cvS.height !== phS) {
      VW = vw; VH = vh; lastAX = AX; lastAY = AY; lastW = W; lastH = H;
      var pair = [[cvG, ctxG, DPR, pw, ph], [cvS, ctxS, SDPR, pwS, phS]];
      for (var n = 0; n < 2; n++) {
        var c = pair[n][0], g = pair[n][1], d = pair[n][2];
        c.width = pair[n][3]; c.height = pair[n][4];
        c.style.width = vw + "px"; c.style.height = vh + "px";
        g.setTransform(d, 0, 0, d, AX * d, AY * d);
      }
      lastG = lastSh = null;
      lastShadowBox = null;   /* 改画布尺寸等于整张已清空，旧包围盒坐标作废 */
      tiltRect = null;
    }
    return true;
  }

  /* ---------- 相机（真透视，内核=用户版） ---------- */
  function solveCamera() {
    var vx = W * (S.vpX / 100), hy = H * (S.horizon / 100), cy = H / 2;
    var f = Math.max(80, S.lens * (H / 900));
    var phi = Math.atan((cy - hy) / f), cos = Math.cos(phi), sin = Math.sin(phi);
    return { vx: vx, hy: hy, cy: cy, f: f, phi: phi, cos: cos, sin: sin, cos2: cos * cos, sincos: sin * cos, D: f / cos };
  }
  /* 地面点 (X, Z) → 屏幕。h = 1 */
  function projectGround(X, Z) {
    var z = cam.sin + Z * cam.cos;
    if (!isFinite(z) || z <= 1e-6) return null;
    var d = cam.D / z;
    return [cam.vx + X * cam.cos * d, cam.hy + d, d, z];
  }
  /* 反投影：已知屏幕上一点、离地高度 Y，求脚下世界 Z。
     Z = (1−Y)·(f·cosφ − q·sinφ) / (q·cosφ + f·sinφ)，q = sy − cy */
  function groundZFromScreen(sy, Y) {
    var q = sy - cam.cy, den = q * cam.cos + cam.f * cam.sin;
    if (Math.abs(den) < 1e-9) return NaN;
    return (1 - Y) * (cam.f * cam.cos - q * cam.sin) / den;
  }

  /* ---------- 绘制工具 ---------- */
  function rgbOf(ink, a) { if (a < 0) a = 0; else if (a > 1) a = 1; return "rgba(" + ink + "," + a.toFixed(4) + ")"; }
  function fade(d, F0, F1) { if (d <= F0) return 0; if (d >= F1) return 1; var t = (d - F0) / (F1 - F0); return t * t * (3 - 2 * t); }
  /* IMPL-85：基底「纵深明暗」混色——hex 底色向黑收缩 k（暗色主题同样适用=更暗） */
  function shadeMix(hex, k) {
    var m = /^#([0-9a-f]{6})$/i.exec(String(hex || ""));
    if (!m) return hex;
    var n = parseInt(m[1], 16);
    return "rgb(" + Math.round(((n >> 16) & 255) * (1 - k)) + "," + Math.round(((n >> 8) & 255) * (1 - k)) + "," + Math.round((n & 255) * (1 - k)) + ")";
  }
  function gainOf(idx) { if (!S.major || S.major < 2) return 1; return (idx % S.major === 0) ? S.gain : 1; }
  /* 矩形→舞台坐标（IMPL-81：画布=全视口，减舞台锚 (AX,AY)；内容滚动时卡片实时跟随） */
  function rectOf(t) {
    if (!t || t.nodeType !== 1 || !t.getBoundingClientRect) return null;
    var r = t.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return null;
    return { left: r.left - AX, top: r.top - AY, width: r.width, height: r.height };
  }
  /* 目标元素定位（V1 壳优先序不变）：普通图/视频 = 媒体本体；玻璃卡/音频/加载态 = 整卡 */
  function targetOf() {
    if (!list) return null;
    var wrap = list.querySelector(".sv-wrap");
    if (!wrap) return null;
    /* IMPL-90⑨：锚优先媒体本体（img/video）——contain 留白与 has-alpha 的 14px padding
       不再掺进锚矩形，影子永远贴图片真实底边（横图「阴影过低」=旧锚取 .sv-media 框、
       框底与图底之间隔着 letterbox 空隙的根因修复）。
       V2r 实测修正：querySelector 单列表按文档序返回首个匹配，img 的祖先 .sv-stage 会
       抢先命中（倾斜/锚矩形仍落整卡）——img/video 必须单独先查才是真优先；
       无媒体时回落原序（音频/加载态=整卡） */
    var m = wrap.querySelector(".sv-media.is-plain img, .sv-media.is-plain video");
    if (m) return m;
    return wrap.querySelector(".sv-media.is-plain, .sv-audio, .sv-stage") || wrap.querySelector(".sv-media") || null;
  }
  /* 倾斜期间的锚矩形（适配决策）：transform 会污染 getBoundingClientRect（用户 demo 用
     不倾斜的外壳解决；这里目标没有壳，改为倾斜开始前缓存基本矩形，归位后自动刷新） */
  function anchorRect(t) {
    /* IMPL-90⓪：倾斜中直接吃缓存矩形——旧序先 gBCR 再判缓存，倾斜帧白付一次强制布局，
       且首次倾斜帧缓存的是已被 transform 污染的矩形（影子跟着抖一帧）；现在污染帧零 gBCR */
    if ((tilt.qx !== 0 || tilt.qy !== 0) && tiltRect) return tiltRect;
    var r = rectOf(t);
    if (!r) { tiltRect = null; return null; }
    tiltRect = r;
    return r;
  }

  /* ---------- 落影（内核②：5 档模糊叠加 + 面光近实远虚 + FLAT 近端非零项） ----------
     一个矩形当作悬在离地 lift 高度的立牌，用同一套相机把它投到地面：
       底边 → 物体底端(高度 lift)沿光线落地的位置
       顶边 → 物体顶端(高度 lift+Hw)沿光线落地的位置
     平行光的落地偏移 = 高度 · cot(仰角)，方向由方位角决定。 */
  function drawOneShadow(sh) {
    var r = anchorRect(sh.target);
    if (!r || r.width < 2 || r.height < 2) return null;
    /* 鼠标倾斜时影子的锚点轻微跟着挪（影随动）：读起来像媒体压着影子动了。
       r 是 rectOf 新建对象，改它不会污染 DOMRect；倾斜期间 anchorRect 返回缓存矩形，偏移不叠加。 */
    if (tilt.qx !== 0 || tilt.qy !== 0) {
      r = { left: r.left + tilt.qx * S.shadowFollow, top: r.top + tilt.qy * S.shadowFollow, width: r.width, height: r.height };
    }

    var lift = Math.max(0, Math.min(.86, sh.lift));
    var mx = r.left + r.width / 2, baseY = r.top + r.height;

    /* 1) 反投影：立牌脚下对应的地面世界坐标 Zc */
    var Zc = groundZFromScreen(baseY, lift);
    if (!isFinite(Zc) || Zc <= 0) return null;
    var zc = (1 - lift) * cam.sin + Zc * cam.cos;
    if (!isFinite(zc) || zc <= 1e-6) return null;

    /* 2) 世界尺寸 */
    var Xc = (mx - cam.vx) * zc / cam.f;
    var Ww = r.width * zc / cam.f;
    var Hw = r.height * zc / (cam.f * cam.cos);

    /* 3) 平行光的落地偏移 */
    var elev = Math.max(6, Math.min(89, sh.elev)) * Math.PI / 180;
    var az = sh.azimuth * Math.PI / 180;
    var cot = Math.cos(elev) / Math.sin(elev);
    var dirX = Math.cos(az), dirZ = Math.sin(az);

    var b0 = lift * cot, b1 = (lift + Hw) * cot;
    /* 近平面钳制：光源压得低时影子远端沿 −Z 跑到相机背后（z'≤0 发散），
       把沿光方向的偏移夹到 z' 还剩 ZMIN 的位置，影子在画面外自然截断 */
    var ZMIN = .08, offMax = Infinity;
    if (dirZ < -1e-6) offMax = (ZMIN - cam.sin - cam.cos * Zc) / (cam.cos * dirZ);
    if (!isFinite(offMax)) offMax = Infinity;
    if (offMax < .01) return null;
    function clampOff(o) { return (o > offMax) ? offMax : o; }
    b0 = clampOff(b0); b1 = clampOff(b1);
    if (b1 < b0) b1 = b0;

    var X1 = Xc - Ww / 2, X2 = Xc + Ww / 2;
    var XS = [X1, X2, X2, X1], BS = [b0, b0, b1, b1];
    var i, pt, quad = [];
    for (i = 0; i < 4; i++) {
      pt = projectGround(XS[i] + dirX * BS[i], Zc + dirZ * BS[i]);
      if (!pt) return null;
      quad.push(pt);
    }
    /* 整块影子都在画面外就整块跳过（省掉几次大半径模糊） */
    var qx0 = 1e9, qy0 = 1e9, qx1 = -1e9, qy1 = -1e9;
    for (i = 0; i < 4; i++) {
      if (quad[i][0] < qx0) qx0 = quad[i][0];
      if (quad[i][1] < qy0) qy0 = quad[i][1];
      if (quad[i][0] > qx1) qx1 = quad[i][0];
      if (quad[i][1] > qy1) qy1 = quad[i][1];
    }
    if (qy0 > VH - AY + 800 || qy1 < -AY - 800 || qx0 > VW - AX + 800 || qx1 < -AX - 800) return null;

    /* 4) 面光半影：模糊半径正比「离接触边的距离」（近实远虚）。
       span = 接触边到「末端+外扩」的屏幕距离；s 用屏幕距离（分子分母经历同一个
       f/z² 压缩，比值与相机/视口无关——换屏、改镜头、改俯角都不用重调 faceK）。 */
    var extra = Hw * cot * .65;          /* 半影外扩量：面光远大于平行光 */
    var span = 0, kx, pa, pb, ddx, ddy, dl;
    for (kx = 0; kx < 2; kx++) {
      pa = projectGround((kx ? X2 : X1) + dirX * b0, Zc + dirZ * b0);
      pb = projectGround((kx ? X2 : X1) + dirX * (b1 + extra), Zc + dirZ * (b1 + extra));
      if (!pa || !pb) continue;
      ddx = pb[0] - pa[0]; ddy = pb[1] - pa[1];
      dl = Math.sqrt(ddx * ddx + ddy * ddy);
      if (dl > span) span = dl;
    }
    if (!isFinite(span) || span <= 0) span = 1;

    /* FLAT：近端残余半影（面光 vs 点光源的分界线）。物体底边悬在离地 lift 处，
       那段高度自身摊出半影（屏幕约 18px）——老版近端钉死 0 会把可见区钉成锐利实边。 */
    var FLAT = .22;
    var softMax = S.faceK * span;
    var maxBlur = sh.blur * .08 + softMax;

    /* 固定 5 档：档数一多每层浓度只剩 1~3/255，落回 8 位会被量化直接抹掉
       （实测 14 档浓度掉 14%）——台阶的真正解法是 renderShadow 里的抖动。 */
    var passes = [], pi, uu, vv;
    for (pi = 0; pi < 5; pi++) {
      /* uu=1 最远端：外扩最多、模糊最大、浓度最低，三件事同向 */
      uu = 1 - pi / 4;
      vv = 1 - uu;
      passes.push({
        ext: extra * uu,
        /* IMPL-90①：横向弥散——远端沿「垂直于光方向」的世界向量双向展开（梯形→扇形）。
           旧版只沿光方向外扩，远处横向边缘始终锐利（用户：缺横向模糊/无弥散效果）。
           0.42=半影外扩量的 42%；近端档 uu≈0 自然收敛为 0=近实远虚不被破坏 */
        lat: extra * uu * .42,
        blur: sh.blur * .08 + softMax * (FLAT + (1 - FLAT) * uu),
        a: sh.opacity * (.13 + .45 * vv * vv)
      });
    }

    var bbox = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
    var t, off, ext, pts, p0;
    for (pi = 0; pi < passes.length; pi++) {
      var ps = passes[pi];
      if (ps.a <= .002) continue;
      pts = [];
      for (t = 0; t < 4; t++) {
        ext = (t >= 2) ? ps.ext : 0;          /* 只把远端两点往外推 */
        /* IMPL-90①：远端两点分别向两侧横推（世界 XZ 平面上垂直于光方向 = (-dirZ, dirX)），
           t=2（X2 侧）向 +perp、t=3（X1 侧）向 −perp；透视投影后横向边缘随距离外扩，
           叠加各档高斯=双向弥散 */
        var lx = 0, lz = 0;
        if (t >= 2 && ps.lat) { var sg = (t === 2) ? 1 : -1; lx = -dirZ * ps.lat * sg; lz = dirX * ps.lat * sg; }
        off = clampOff(BS[t] + ext);
        p0 = projectGround(XS[t] + dirX * off + lx, Zc + dirZ * off + lz);
        if (!p0) return null;
        pts.push(p0);
      }
      fillQuad(pts, ps.blur, ps.a, sh.color);
      for (t = 0; t < 4; t++) {
        if (pts[t][0] < bbox.x0) bbox.x0 = pts[t][0];
        if (pts[t][1] < bbox.y0) bbox.y0 = pts[t][1];
        if (pts[t][0] > bbox.x1) bbox.x1 = pts[t][0];
        if (pts[t][1] > bbox.y1) bbox.y1 = pts[t][1];
      }
    }

    return {
      bbox: bbox,
      /* 本帧最大的一档模糊半径——影层靠它算「这次画到了哪块」，下一帧只擦这一块 */
      maxBlur: maxBlur
    };
  }

  /* 单档四边形填充：FILTER_OK → ctx.filter 高斯；无 filter 环境 → 降采样小画布放大
     （V1 壳的 IMPL-56 手机端修复，f 随 blur 取档 ÷1.5、上限 24）；blur 太小直接实填 */
  function tracePath(g, pts) {
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (var t = 1; t < 4; t++) g.lineTo(pts[t][0], pts[t][1]);
    g.closePath();
  }
  function fillQuad(pts, blur, alpha, color) {
    var fill = "rgba(" + color + "," + alpha.toFixed(4) + ")", f, sw, shh;
    if (blur > .3 && FILTER_OK) {
      ctx.filter = "blur(" + blur.toFixed(1) + "px)";
      ctx.fillStyle = fill;
      tracePath(ctx, pts);
      ctx.fill();
      ctx.filter = "none";
      return;
    }
    if (blur > .3) {
      if (!offC) { offC = document.createElement("canvas"); offCtx = offC.getContext("2d"); }
      if (offCtx) {
        f = Math.max(3, Math.min(24, Math.round(blur / 1.5)));
        sw = Math.max(2, Math.ceil(W / f)); shh = Math.max(2, Math.ceil(H / f));
        if (offC.width !== sw || offC.height !== shh) { offC.width = sw; offC.height = shh; }
        offCtx.setTransform(1, 0, 0, 1, 0, 0);
        offCtx.clearRect(0, 0, sw, shh);
        offCtx.setTransform(1 / f, 0, 0, 1 / f, 0, 0);
        offCtx.fillStyle = fill;
        tracePath(offCtx, pts);
        offCtx.fill();
        ctx.setTransform(SDPR, 0, 0, SDPR, AX * SDPR, AY * SDPR);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(offC, 0, 0, sw, shh, 0, 0, W, H);
        return;
      }
    }
    ctx.fillStyle = fill;
    tracePath(ctx, pts);
    ctx.fill();
  }

  /* ---------- 第 1 层：网格（内核=用户版配方） ---------- */
  function renderGrid() {
    ctx = ctxG;
    ctx.setTransform(DPR, 0, 0, DPR, AX * DPR, AY * DPR);
    ctx.filter = "none";
    /* IMPL-85：清屏范围=全视口（stage 坐标自 -AX,-AY 起）——旧实现只清舞台矩形 (W,H)，
       页面边距区残留旧帧：单色基底时代不可见，基底纵深渐变/主题换色后呈现
       「中间新四周旧」拼贴，故改全视口清屏 */
    ctx.clearRect(-AX, -AY, VW, VH);
    cam = solveCamera();
    var th = T();
    var ink = inkOf(th), baseFill = baseOf(th);
    /* IMPL-87：宿主标记=网格基底明暗——深色网格下白玻璃按钮/设置面板自动切深色
       （CSS 侧 [data-svfloor="dark"]），亮暗判定复用影色自适应的基底解析 */
    var _bc = rgbOfBase(baseFill), _bl = _bc ? _bc[0] * .299 + _bc[1] * .587 + _bc[2] * .114 : 255;
    try { document.documentElement.setAttribute("data-svfloor", _bl < 128 ? "dark" : "light"); } catch (_e) {}
    /* 基底后置（IMPL-83）：先画线→聚光衰减→destination-over 垫底，
       地台不受聚光影响（页面 margins 连续白）；无聚光时顺序与先垫底等价 */

    var A = S.step, u = S.back;
    var F0 = Math.sqrt((2 * cam.f) / Math.max(1e-4, A * cam.cos2));
    var F1 = F0 * S.fadeSpan;
    var dScreen = Math.max(40, (Math.max(H, VH - AY) - cam.hy) * 1.15);
    var G = A * cam.cos;

    /* ---- 纵深线（列）：i=0 为 Z 轴（蓝），主格每 major 根加重，距离淡出 ---- */
    var reach = Math.max(cam.vx + AX, (VW - AX) - cam.vx) + 90;
    var Imax = Math.min(4000, Math.ceil(reach / Math.max(1e-6, G * F0)));
    var i, x1, y1, x2, y2, grad, st, tt, dd, aa, lineInk, boost;
    for (i = -Imax; i <= Imax; i++) {
      x1 = cam.vx + G * i * dScreen; y1 = cam.hy + dScreen;
      x2 = cam.vx + G * i * F0;      y2 = cam.hy + F0;
      if ((x1 < -AX - 90 && x2 < -AX - 90) || (x1 > VW - AX + 90 && x2 > VW - AX + 90)) continue;
      lineInk = (S.axis === "color" && i === 0) ? AXIS_Z : ink;
      boost = (S.axis !== "off" && i === 0) ? 2.4 : 1;
      var base = S.alpha * gainOf(i) * boost;
      grad = ctx.createLinearGradient(x1, y1, x2, y2);
      for (st = 0; st <= 4; st++) {
        tt = st / 4;
        dd = dScreen + tt * (F0 - dScreen);
        grad.addColorStop(tt, rgbOf(lineInk, base * fade(dd, F0, F1)));
      }
      ctx.strokeStyle = grad;
      ctx.lineWidth = S.weight;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }

    /* ---- 横向线（行）：j=0 为 X 轴（红） ---- */
    var jMin = Math.ceil((((cam.f / dScreen) - cam.sincos) / cam.cos2 - u) / A);
    var jMax = Math.floor((((cam.f / F0) - cam.sincos) / cam.cos2 - u) / A);
    if (!isFinite(jMin)) jMin = 0;
    if (!isFinite(jMax)) jMax = 0;
    if (jMax - jMin > 3000) jMin = jMax - 3000;
    var j, d, y, a;
    for (j = jMin; j <= jMax; j++) {
      d = cam.f / ((j * A + u) * cam.cos2 + cam.sincos);
      if (!isFinite(d) || d <= 0) continue;
      y = cam.hy + d;
      if (y < -AY - 4 || y > VH - AY + 4) continue;
      lineInk = (S.axis === "color" && j === 0) ? AXIS_X : ink;
      boost = (S.axis !== "off" && j === 0) ? 2.4 : 1;
      a = S.alpha * gainOf(j) * boost * fade(d, F0, F1);
      if (a <= .002) continue;
      ctx.strokeStyle = rgbOf(lineInk, a);
      ctx.lineWidth = S.weight;
      ctx.beginPath(); ctx.moveTo(-AX, y); ctx.lineTo(VW - AX, y); ctx.stroke();
    }

    /* ---- IMPL-84：聚光衰减移除——网格=全页背景层，墨迹铺满全视口（两大区块四周
       与镂空窗内同时可见），深度淡出仍由逐线 fade(dd,F0,F1) 负责；基底随后
       destination-over 垫底。 ---- */
    if (baseFill) {
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      /* IMPL-85：空间明暗——基底沿纵深三段渐变（地平线处最暗、上下两侧回亮），
         「越远亮度越低」的氛围纵深；shade=0 或地平线在视口外时退化为平色 */
      var shK = Math.max(0, Math.min(30, (window.matchMedia && window.matchMedia("(max-width:768px)").matches) ? 0 : (S.shade || 0))) / 100;
/* IMPL-121②：手机端基底纵深渐变关闭（用户：顶部渐变过渡致顶部按钮图标发糊）——
   地平线最暗/上下回亮三段渐变在竖屏上部形成大片明暗过渡雾区，顶部悬浮按钮（结果/编辑切换+菜单条）
   正好浮在雾区上=视觉发糊；平色基底后顶部与 theme-color/body 染色同色纯净；桌面渐变氛围保留 */
      var hyT = (cam.hy + AY) / Math.max(1, VH);
      if (shK > 0.0015 && hyT > 0.02 && hyT < 0.98) {
        var gBase = ctx.createLinearGradient(0, -AY, 0, VH - AY);
        gBase.addColorStop(0, baseFill);
        gBase.addColorStop(hyT, shadeMix(baseFill, shK));
        gBase.addColorStop(1, baseFill);
        ctx.fillStyle = gBase;
      } else {
        ctx.fillStyle = baseFill;
      }
      ctx.fillRect(-AX, -AY, VW, VH);
      ctx.restore();
    }
  }

  /* ---------- 第 2 层：落影（内核④：只擦上一帧画过的那块） ----------
     整屏 clearRect 在高分屏下是千万级像素；鼠标扫掠一轮要重画几十次。
     保留上一帧包围盒、外扩 2.2σ+12（2.2σ 处已衰减到肉眼不可见，再多白擦三成）。 */
  var lastShadowBox = null;

  /* ---- 8 位抖动（内核②）----
     影子浓度是连续量，画布每通道只有 256 级。面光一小、影一硬，半影拉成又长又淡的
     斜坡，量化后变成「三五行不动的横带」。解法：影框内撒一层 ±1/255 随机暗度打散台阶。
       · 用 lighter（加法）而不是 source-atop：断层恰恰发生在最淡的尾巴上，
         加法才是「绝对值 +1/255」；
       · 图案钉在屏幕坐标（不随帧重掷），否则一动整片「沙沙」响；
       · 64×64 瓦片一次生成，之后每帧只是一次 fillRect。
       · 代价：影框内约一半像素 +1/255（均值 +0.5/255 ≈ 0.2%），肉眼不可见。 */
  var noiseTile = null, noisePat;
  function ditherPattern() {
    if (noisePat !== undefined) return noisePat;
    noisePat = null;
    try {
      noiseTile = document.createElement("canvas");
      noiseTile.width = noiseTile.height = 64;
      var tc = noiseTile.getContext("2d");
      if (tc && tc.createImageData && ctxS.createPattern) {
        var im = tc.createImageData(64, 64), d = im.data;
        for (var n = 0; n < 64 * 64; n++) {
          d[n * 4] = 0; d[n * 4 + 1] = 0; d[n * 4 + 2] = 0;
          d[n * 4 + 3] = (Math.random() < .5) ? 1 : 0;   /* 一半像素 +1/255 暗度 */
        }
        tc.putImageData(im, 0, 0);
        noisePat = ctxS.createPattern(noiseTile, "repeat");
      }
    } catch (e) { noisePat = null; }
    return noisePat;
  }

  /* 鼠标即光源（内核⑤）：光标位置只驱动落影的方位角/仰角，不碰媒体。
     光标在左→光源在左→影子向右；光标在上→光源更高→影子更短。
     与用户引擎的 az0/el0 基准制等价：这里每帧由 S 基准直接重算，无累积漂移。 */
  function syncLight() {
    return {
      az: S.azimuth + tilt.qx * S.lightAz,
      el: S.elev - tilt.qy * S.lightEl
    };
  }

  function renderShadow() {
    ctx = ctxS;
    /* IMPL-90⑩：移动端不出落影——清掉历史帧直接返回（≤768px 无鼠标光源语义，
       用户：手机端不需要动态阴影；省掉每次滚动/换卡的落影重算与一层 canvas 合成） */
    if (MOB_Q && MOB_Q.matches) {
      if (lastShadowBox) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cvS.width, cvS.height); lastShadowBox = null; }
      return;
    }
    ctx.setTransform(SDPR, 0, 0, SDPR, AX * SDPR, AY * SDPR);
    ctx.filter = "none";
    if (lastShadowBox) ctx.clearRect(lastShadowBox.x0, lastShadowBox.y0, lastShadowBox.w, lastShadowBox.h);
    else { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cvS.width, cvS.height); ctx.setTransform(SDPR, 0, 0, SDPR, AX * SDPR, AY * SDPR); }
    cam = solveCamera();

    var t = (list && list.classList.contains("single-view")) ? targetOf() : null, th = T();
    var info = null;
    if (t) {
      var light = syncLight();
      info = drawOneShadow({
        target: t,
        lift: S.lift,
        elev: light.el,
        azimuth: light.az,
        opacity: Math.min(1, S.shadowOpacity * th.shadowK),
        blur: S.shadowBlur,
        color: shColOf(th)
      });
    }
    ctx.filter = "none";
    ctx.globalAlpha = 1;

    if (!info) { lastShadowBox = null; return; }
    var bb = info.bbox;
    var m = Math.ceil(info.maxBlur * 2.2) + 12;
    var x0 = Math.max(-AX, Math.floor(bb.x0 - m)), y0 = Math.max(-AY, Math.floor(bb.y0 - m));
    var x1 = Math.min(VW - AX, Math.ceil(bb.x1 + m)), y1 = Math.min(VH - AY, Math.ceil(bb.y1 + m));
    if (x1 <= x0 || y1 <= y0) { lastShadowBox = null; return; }

    /* 抖动：整块影框撒一层 +1/255 稀疏暗度，打散 8 位台阶 */
    var dp = ditherPattern();
    if (dp) {
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = dp;
      ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      ctx.globalCompositeOperation = "source-over";
    }
    lastShadowBox = { x0: x0, y0: y0, w: x1 - x0, h: y1 - y0 };
  }

  /* ---------- 签名缓存渲染（键覆盖全部新参数；改参数必须立即重画） ---------- */
  function camKey() { return [S.vpX, S.horizon, S.lens, W, H, AX, AY, VW, VH].join("|"); }
  function gridKey() {
    var th = T();
    /* IMPL-84：聚光衰减已移除，网格与卡片矩形解耦——内滚/换卡只重画落影，
       不触发整层网格重绘（相机/主题/参数变化仍重画） */
    return [camKey(), S.step, S.back, S.weight, S.fadeSpan, S.alpha, S.major, S.gain, S.axis, S.shade, inkOf(th), baseOf(th)].join("|");
  }
  function shadowKey() {
    var t = targetOf(), th = T(), r = t ? anchorRect(t) : null;
    return [camKey(), S.lift, S.elev, S.azimuth, S.faceK, S.shadowOpacity, S.shadowBlur,
            S.lightAz, S.lightEl, S.shadowFollow, tilt.qx, tilt.qy,
            shColOf(th), baseOf(th), th.shadowK,
            r ? [r.left, r.top, r.width, r.height].map(function (v) { return Math.round(v * 10) / 10; }).join(",") : "-"].join("|");
  }

  /* 目标状态同步：目标元素换了 → 摘掉旧 transform/动效状态，has-cast 同步 */
  function syncTargetState() {
    var t = targetOf();
    var wrap = list ? list.querySelector(".sv-wrap") : null;
    if (wrap) wrap.classList.toggle("has-cast", !!t && !!(list && list.classList.contains("single-view")));
    if (t !== _tiltTarget) {
      if (tiltEl && tiltEl.style.transform) { tiltEl.style.transform = ""; tiltEl.style.willChange = ""; }
      _tiltTarget = t;
      /* IMPL-94③：倾斜载体与锚定目标分离——透明图白垫画在 .sv-media.has-alpha 父容器背景上，
         transform 落 img 时白垫脱离变换链=不随鼠标倾斜；载体改取 sv-media 父容器
         （padding 14px 四边对称→父中心=img 中心，透视投影视觉重合）；普通图/音频卡
         targetOf 返回容器本体→载体不变；落影锚仍读 img（anchorRect 缓存防 transform 污染）。 */
      tiltEl = (t && t.parentElement && t.parentElement.classList && t.parentElement.classList.contains("sv-media")) ? t.parentElement : t;
      if (tilt.raf && window.cancelAnimationFrame) { window.cancelAnimationFrame(tilt.raf); }
      tilt.raf = 0;
      tilt.x = tilt.y = tilt.tx = tilt.ty = tilt.qx = tilt.qy = 0;
      tilt.back = false;
      tiltRect = null;
    }
  }

  /* IMPL-84：结果区镂空窗——网格=全页背景层（IMPL-81 语义恢复），窗=结果列表
     (#resultList.single-view) 的整体矩形：外框/头部/缩略图条/页边距由 ::after 白底
     蒙版覆盖，大媒体矩形整体透出网格与落影（用户标注：网格在两大区块后面可见 +
     初版结果区大矩形整体镂空）。applyHole() 逐帧把列表矩形（视口坐标−面板原点=
     面板内坐标）写进 .col-results 的 --svw* 四变量；列表隐藏（移动端参数页签
     0×0）或非 single-view → 变量归零=整窗关闭，面板纯白。IMPL-83 的卡片聚光
     衰减随本窗形一并移除（spotGeom 删除）——墨迹直达窗边，由白框矩形边界自然
     收边，对齐参考 demo「网格铺满画布、照片浮于其上」的观感。 */
  var holePanel = null;
  function applyHole() {
    if (!holePanel || !holePanel.isConnected) holePanel = list ? list.closest(".col-results") : null;
    var st = holePanel ? holePanel.style : null;
    if (!st) return;
    var open = !!(list && list.classList.contains("single-view"));
    var lr = null, pr = null;
    if (open) {
      lr = list.getBoundingClientRect();
      pr = holePanel.getBoundingClientRect();
      /* IMPL-96④：换算 padding-box 系——--svw* 消费层（::after/.sv-holering）均 inset:0 锚定
         padding box，而 getBoundingClientRect 是 border box（含 1px 边框），不换算则洞/环整体
         向右下偏移 1px，且洞贴边时环线与外框圆角弧不同心（黑网格背景下呈「越线」） */
      pr = { left: pr.left + 1, top: pr.top + 1, right: pr.right - 1, bottom: pr.bottom - 1, width: pr.width - 2, height: pr.height - 2 };
      if (lr.width < 4 || lr.height < 4 || pr.width < 2 || pr.height < 2) open = false;
    }
    if (!open) {
      /* IMPL-90⓪：值不变不写——style.setProperty 每次都触发样式失效，rAF 链下重复写同值纯耗 */
      if (st._svx !== "0") {
        st.setProperty("--svwx", "0px"); st.setProperty("--svwy", "0px");
        st.setProperty("--svww", "0px"); st.setProperty("--svwh", "0px");
        st._svx = "0";
      }
      return;
    }
    /* IMPL-86：窗=列表 ∪ 最近结果区（strip-dock）——dock 镂空后网格需透到 dock，
       取并集矩形（dock 与列表水平范围重叠，中间缝隙同窗）；dock 隐藏（empty）时退化为列表矩形 */
    var dk = holePanel.querySelector(":scope > .strip-dock");
    var dr = (dk && dk.offsetWidth > 4 && dk.offsetHeight > 4) ? dk.getBoundingClientRect() : null;
    /* IMPL-106⑥：窗矩形 subpixel 外扩 1px——媒体框与列表框的取整差会让媒体边缘在
       白蒙版上露出 1px 直角「发丝矩形」（用户⑥「矩形框比圆角框大一点」真根因），
       floor/ceil±2 使媒体恒内含于窗（inline-flex 舞台可比列表宽 ~1px）：媒体圆角外多 2px 网格缝隙=视觉上矩形收进圆角框内一圈 */
    var nx = Math.floor(lr.left - pr.left) - 2, ny = Math.floor(lr.top - pr.top) - 2;
    var nr = Math.ceil(lr.right - pr.left) + 2, nb = Math.ceil(lr.bottom - pr.top) + 2;
    if (dr) {
      if (dr.left - pr.left < nx) nx = Math.floor(dr.left - pr.left) - 2;
      if (dr.top - pr.top < ny) ny = Math.floor(dr.top - pr.top) - 2;
      if (dr.right - pr.left > nr) nr = Math.ceil(dr.right - pr.left) + 2;
      if (dr.bottom - pr.top > nb) nb = Math.ceil(dr.bottom - pr.top) + 2;
    }
    if (!dr) nb = Math.min(nb, Math.max(0, pr.height - 18)); /* IMPL-162：空态窗底边距回位（用户②：结果区没结果时下边框变窄）——dock 经 :has(.result-strip.empty) 隐藏时 dr=null，列表矩形直贴 scroll 底 padding（12px），窗底距仅 ~11px，破坏「左右下三边等距 20px」设计；钳到与左右侧及常态 dock（margin-bottom 20px−2px 窗外扩）同款 18px；dr=null ⇔ 空态，有结果路径零改动 */
    /* IMPL-94②：窗顶上移至备注信息条（.sv-caption）之上——信息条悬于窗内网格上（与 dock 胶囊对称观感）；
       caption 隐藏/空态时 offsetHeight=0 跳过回落列表矩形；签名 k4 含 ny → mask/ring 经 --svw* 自动联动 */
    var cp = holePanel.querySelector(".sv-caplayer .sv-caption");
    if (cp && cp.offsetHeight) {
      var cy = Math.round(cp.getBoundingClientRect().top - pr.top) - 26;
      if (cy < ny) ny = cy;
    }
    var nw = nr - nx, nh = nb - ny;
    /* 裁进面板（mask 层尺寸不可为负） */
    if (nx < 0) { nw += nx; nx = 0; }
    if (ny < 0) { nh += ny; ny = 0; }
    if (nx + nw > pr.width) nw = pr.width - nx;
    if (ny + nh > pr.height) nh = pr.height - ny;
    if (nw <= 0 || nh <= 0) { nx = ny = nw = nh = 0; }
    /* IMPL-90⓪：四值签名短路——滚动/倾斜 rAF 链上矩形未变时零样式写入 */
    var k4 = nx + "," + ny + "," + nw + "," + nh;
    if (st._svx !== k4) {
      st._svx = k4;
      st.setProperty("--svwx", nx + "px"); st.setProperty("--svwy", ny + "px");
      st.setProperty("--svww", nw + "px"); st.setProperty("--svwh", nh + "px");
    }
  }
  function render(force) {
    if (!ctxG || !ctxS || W < 60 || H < 60) return;
    syncTargetState();
    var gk = gridKey(), sk = shadowKey();
    if (force || gk !== lastG) { lastG = gk; renderGrid(); }
    if (force || sk !== lastSh) { lastSh = sk; renderShadow(); }
    applyHole();
    /* IMPL-88 注：齿轮对齐不在此处——引擎/面板是相邻两个 IIFE，alignGear 在面板域；
       浮动条锚定 result-body 底部不随滚动变化，对齐由 gearWatch/observer/load 链路覆盖 */
  }
  function schedule() {
    if (raf) return;
    raf = window.requestAnimationFrame(function () { raf = 0; render(false); });
  }
  function sync(force) { if (ensure()) render(force === true); }

  /* ---------- 动效：倾斜 + 影随动 + 鼠标光源（内核⑤，工作台适配见头部注释） ---------- */
  var tilt = { x: 0, y: 0, tx: 0, ty: 0, qx: 0, qy: 0, raf: 0, back: false };
  var tiltEl = null;      /* 被 3D 倾斜的载体元素（IMPL-94③：可为 .sv-media 容器；落影锚仍读 img） */
  var _tiltTarget = null; /* 锚定目标比较基准（targetOf 本体，IMPL-94③） */
  var tiltRect = null;    /* 倾斜期间的锚矩形缓存（transform 会污染 getBoundingClientRect） */
  var RMQ = (function () { try { return window.matchMedia("(prefers-reduced-motion: reduce)"); } catch (e) { return null; } })();
  /* IMPL-90⑩：移动端判定（≤768px 不画落影+齿轮隐藏；var 提升，renderShadow 可安全引用） */
  var MOB_Q = (function () { try { return window.matchMedia("(max-width:768px)"); } catch (e) { return null; } })();
  var TILT_OK = (function () {
    try {
      if (RMQ && RMQ.matches) return false;
      if (window.matchMedia("(hover: none)").matches) return false;
    } catch (e) { /* 老环境按可用处理 */ }
    return true;
  })();
  /* 灯箱/弹层/抽屉打开时禁用动效（选择器与工作台关闭弹层的全局清单一致） */
  var MOTION_BLOCKED_SEL = ".modal-overlay.show,.settings-drawer.show,.history-sidebar.show,.lightbox.show,.compare-grid.show,.paste-picker.show,.context-menu.show";
  function motionOK() {
    return TILT_OK && !!S.motion && !document.hidden && !document.querySelector(MOTION_BLOCKED_SEL) && !(RMQ && RMQ.matches);
  }

  function tiltApply() {
    var el = tiltEl;
    if (el) {
      if (S.tilt > .01 && (tilt.x !== 0 || tilt.y !== 0)) {
        /* 方向对齐用户 demo：光标往右→右缘远离（rotateY 正角）；光标往下→下缘远离 */
        el.style.transform = "perspective(900px) rotateY(" + (tilt.x * S.tilt).toFixed(3) + "deg) rotateX(" + (-tilt.y * S.tilt).toFixed(3) + "deg)";
        el.style.willChange = "transform";
      } else if (el.style.transform) {
        el.style.transform = ""; el.style.willChange = "";
      }
    }
    /* 量化 48 档：同时喂倾斜、影随动、鼠标光源。档数不够影子转动会出现肉眼台阶 */
    var qx = Math.round(tilt.x * 48) / 48, qy = Math.round(tilt.y * 48) / 48;
    if (qx !== tilt.qx || qy !== tilt.qy) { tilt.qx = qx; tilt.qy = qy; }
    schedule();   /* 只重画影层：camKey 与网格参数都没变 */
  }

  function tiltTick() {
    if (!motionOK()) { hardResetTilt(); return; }   /* 动画中途被禁用（弹层打开等）→ 立即归零 */
    var dx = tilt.tx - tilt.x, dy = tilt.ty - tilt.y;
    if (Math.abs(dx) < .0016 && Math.abs(dy) < .0016) {
      tilt.x = tilt.tx; tilt.y = tilt.ty;
      tiltApply();
      tilt.raf = 0;          /* 追上了——循环停掉（静止零开销） */
      tilt.back = false;
      return;
    }
    /* 回弹用独立、更小的缓动：跟随 tiltEase 0.16（~0.6s 跟手）/ 回弹 tiltBack 0.06（~1.7s 缓归） */
    var e = tilt.back ? S.tiltBack : S.tiltEase;
    tilt.x += dx * e; tilt.y += dy * e;
    tiltApply();
    tilt.raf = window.requestAnimationFrame(tiltTick);
  }

  function setTilt(px, py) {
    /* IMPL-89⑥/⑧：全局 pointermove 60-120Hz 高频路径——motionOK() 含
       querySelector(MOTION_BLOCKED_SEL)，逐事件全页扫描成本高且结果在帧内不变；
       此处只做常量级检查，弹层/隐藏的完整把关仍在 tiltTick（rAF 内逐帧）执行 */
    if (!TILT_OK || !S.motion || document.hidden) return;
    tilt.tx = Math.max(-1, Math.min(1, px || 0));
    tilt.ty = Math.max(-1, Math.min(1, py || 0));
    tilt.back = false;
    if (!tilt.raf) tilt.raf = window.requestAnimationFrame(tiltTick);
  }
  /* 指针离开 / 失焦 / 页签隐藏：目标归零，换回弹缓动慢慢回去（不是「戳一下弹回」） */
  function releaseTilt() {
    if (!TILT_OK) return;
    tilt.tx = 0; tilt.ty = 0;
    tilt.back = true;
    if (!tilt.raf && (tilt.x !== 0 || tilt.y !== 0)) tilt.raf = window.requestAnimationFrame(tiltTick);
  }
  /* 硬复位：动效被禁用（总开关关 / reduced-motion / 弹层打开）时立即静止 */
  function hardResetTilt() {
    if (tilt.raf && window.cancelAnimationFrame) window.cancelAnimationFrame(tilt.raf);
    tilt.raf = 0;
    tilt.x = tilt.y = tilt.tx = tilt.ty = tilt.qx = tilt.qy = 0;
    tilt.back = false;
    if (tiltEl && tiltEl.style.transform) { tiltEl.style.transform = ""; tiltEl.style.willChange = ""; }
    schedule();
  }

  /* ---------- 参数写入（79-b 设置面板走这里；config 活引用直写 + sync() 亦可） ---------- */
  function setParams(patch) {
    var touched = false;
    for (var kk in patch) {
      if (Object.prototype.hasOwnProperty.call(patch, kk) && Object.prototype.hasOwnProperty.call(DEFAULTS, kk)) {
        S[kk] = patch[kk];
        touched = true;
      }
    }
    if (!touched) return S;
    if (!S.motion) hardResetTilt();   /* 总开关关 → 立即静止 */
    else tiltApply();                 /* 倾斜角/缓动/回弹/光源摆幅 改了要立刻生效 */
    schedule();
    return S;
  }

  /* ---------- 启动与监听（V1 壳 + 动效挂载） ---------- */
  function onMedia() { lastSh = null; tiltRect = null; schedule(); }
  function boot() {
    if (booted) return;
    booted = true;
    sync(true);
    if (window.ResizeObserver && list) {
      ro = new ResizeObserver(function () { sync(false); });
      try { ro.observe(list); } catch (e) {}
    }
    list.addEventListener("load", onMedia, true);
    list.addEventListener("loadedmetadata", onMedia, true);
    try {
      moTheme = new MutationObserver(function () { sync(true); });
      moTheme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    } catch (e) {}
    window.addEventListener("resize", function () { sync(false); }, { passive: true });
    /* 内容滚动（IMPL-81）：网格锚固定=背景语义不随内容滚动，落影经 rectOf 实时贴卡。
       IMPL-89③：scroll 事件内同步 applyHole()（仅写 4 个 CSS 变量，成本极低）——
       mask/描边环与滚动内容同帧更新，消除「rAF 晚一帧」的描边滞后错位；
       影层重画仍由 schedule() 合帧 */
    var scroller = scrollerOf(list);
    if (scroller) scroller.addEventListener("scroll", function () { applyHole(); schedule(); }, { passive: true });

    /* 动效挂载：IMPL-89⑥ 全页鼠标追踪——document 级 pointermove + 视口归一化
       （此前仅 #resultList 内追踪，鼠标在参数区/空白区时动效僵死）。
       setTilt 内只做 TILT_OK+S.motion 便宜检查（querySelector 全检移入 tiltTick 的
       rAF 路径，60-120Hz 事件流零 DOM 查询）；触摸/无 hover/reduced-motion 不挂 */
    if (TILT_OK) {
      document.addEventListener("pointermove", function (e) {
        if (e.pointerType === "touch") return;
        var vw = window.innerWidth || 1, vh = window.innerHeight || 1;
        setTilt((e.clientX / vw) * 2 - 1, (e.clientY / vh) * 2 - 1);
      }, { passive: true });
      document.documentElement.addEventListener("mouseleave", releaseTilt);
      window.addEventListener("blur", releaseTilt);
      document.addEventListener("visibilitychange", function () { if (document.hidden) releaseTilt(); });
      try {
        if (RMQ) {
          var onRmq = function () { if (RMQ.matches) hardResetTilt(); };
          if (typeof RMQ.addEventListener === "function") RMQ.addEventListener("change", onRmq);
          else if (typeof RMQ.addListener === "function") RMQ.addListener(onRmq);
        }
      } catch (e) {}
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function () { sync(false); });
  /* IMPL-90⑩：桌面↔移动跨断点切换 → 清签名强制重渲染（影层开关即时生效/恢复） */
  try {
    if (MOB_Q) {
      var onMobQ = function () { lastG = lastSh = null; tiltRect = null; sync(true); };
      if (typeof MOB_Q.addEventListener === "function") MOB_Q.addEventListener("change", onMobQ);
      else if (typeof MOB_Q.addListener === "function") MOB_Q.addListener(onMobQ);
    }
  } catch (e) {}

  /* ---------- 对外 API：原有三键 { sync, redraw, config } 不变 ----------
     config = S 活引用（设置面板直写后调 SvFloor.sync() 即重画；签名键覆盖全部参数）。
     79-b 增补：set(patch) 批量写参（会联动动效立即生效）；defaults 只读默认值表。 */
  window.SvFloor = {
    sync: sync,
    redraw: function () { lastG = lastSh = null; tiltRect = null; sync(true); },
    config: S,
    set: setParams,
    defaults: DEFAULTS
  };
})();

/* ============================================================
   SvFloorPanel —— 透视网格/落影参数面板（79-b）
   ------------------------------------------------------------
   - 常驻层 #svFloorLayer（result-body 直挂，不进 #resultList，免 innerHTML 重建）
   - 滑杆/chips → SvFloor.config 活引用写值 + rAF 防抖 redraw()（签名缓存重置强制重画）
   - localStorage（sc_sv_floor，JSON 全量 S）持久化：启动恢复逐键 clamp 到滑杆范围，
     键缺失（保持默认）/多余键（忽略）容错；重置 = 恢复默认并清档
   - S 键名以用户优化版引擎（modeling-grid-shadow.html L305+ DEFAULTS）为准；
     兼容桥：config 若存在旧键 blur 则镜像 shadowBlur（当前引擎即时生效，79-a 合并后自然失效）
   ============================================================ */
(function () {
  "use strict";
  if (window.SvFloorPanel) return;
  var LS_KEY = (typeof CONFIG !== "undefined" && CONFIG.STORAGE_KEYS && CONFIG.STORAGE_KEYS.SV_FLOOR) || "sc_sv_floor_v2";
  /* 滑杆 id 后缀 → S 键（与用户引擎键名一一对应，见 worklog 79-b 映射表） */
  var MAP = {
    vpx: "vpX", horizon: "horizon", lens: "lens", step: "step", fade: "fadeSpan",
    weight: "weight", alpha: "alpha", gain: "gain",
    lift: "lift", elev: "elev", az: "azimuth", facek: "faceK", sop: "shadowOpacity", sblur: "shadowBlur",
    tilt: "tilt", tiltease: "tiltEase", tiltback: "tiltBack", follow: "shadowFollow",
    lightaz: "lightAz", lightel: "lightEl",
    /* IMPL-82/92③：结果图片大小（非引擎参数：applySuf 分流写 CSS 变量；dump/restore 走同名键）；
       imgh 随「图片高度」设置移除（存档残留键 restore 忽略无害），高度改由双栏带高推导 */
    imgw: "imgW"
  };
  /* 徽标小数位（对齐用户 demo 面板 toFixed 位数） */
  var DEC = { vpx: 0, horizon: 0, lens: 0, step: 2, fade: 1, weight: 2, alpha: 3, gain: 1, lift: 2, elev: 0, az: 0, facek: 2, sop: 2, sblur: 0, tilt: 1, tiltease: 2, tiltback: 3, follow: 0, lightaz: 0, lightel: 0, imgw: 0 };
  /* [容器id, 数据属性, S键, 数值化] */
  var CHIPS = [ ["sfx-major", "data-major", "major", "int"], ["sfx-axis", "data-axis", "axis", "str"] ]; /* IMPL-86：ink/base chips 移除——主题预设全权接管（dump/restore 仍直读写活配置） */
  var layer = document.getElementById("svFloorLayer"), panel = document.getElementById("svFloorPanel"),
      gear = document.getElementById("svFloorGear"), list = document.getElementById("resultList");
  if (!layer || !panel || !gear) return;
  /* IMPL-86：桌面齿轮重挂到 .col-results 直下（对齐缩略图条中线+避开 result-body overflow:hidden 裁剪）；
     移动端回挂 layer 贴浮动条上方原位（IMPL-85 已验证）。面板开合的外点关闭判断同步含 gear */
  var hostPanel = layer.closest(".col-results");
  function placeGear() {
    var mob = window.matchMedia && window.matchMedia("(max-width:768px)").matches;
    if (!mob && hostPanel && gear.parentNode !== hostPanel) hostPanel.appendChild(gear);
    else if (mob && gear.parentNode !== layer) layer.appendChild(gear);
  }
  placeGear();
  /* IMPL-88：齿轮与「图片菜单悬浮栏」（.sv-docklayer .sv-floatbar）同一高度——
     读浮动条视口矩形，齿轮 bottom=面板底−浮动条中线−半径（40px 齿轮取 20）；
     浮动条不存在（非单图/空态）时清除内联值回退 CSS bottom:49px（缩略图条中线）。
     docklayer 子树任何变动（浮动条/对比条渲染、class 切换）→ rAF 合帧重对齐；
     引擎 render() 帧内也随动（滚动/resize 场景） */
  var dockLayerEl = document.getElementById("svDockLayer"), gearRaf = 0;
  function alignGear() {
    if (gear.parentNode !== hostPanel) return;   /* 移动端（齿轮在 layer 内）不参与 */
    var fb = dockLayerEl ? dockLayerEl.querySelector(".sv-floatbar") : null;
    if (!fb || !fb.offsetHeight) { if (gear.style.bottom) gear.style.bottom = ""; return; }
    var pr = hostPanel.getBoundingClientRect(), fr = fb.getBoundingClientRect();
    if (pr.height < 40 || fr.height < 8) return;
    var b = Math.round(pr.bottom - fr.top - fr.height / 2) - 20;
    if (b < 8) b = 8;
    var s = b + "px";
    if (gear.style.bottom !== s) gear.style.bottom = s;
  }
  function alignGearSoon() { if (!gearRaf) gearRaf = requestAnimationFrame(function () { gearRaf = 0; alignGear(); }); }
  /* IMPL-88b：布局稳定校验——data URI 图同步解码会错过 load、字体/首帧排版震荡无统一事件，
     启动期 6 次×200ms 快速对齐 + 常驻 1s 低频校验兜底（偏差>1px 才写 style，零抖动零开销） */
  (function gearWatch(n) { alignGear(); measureBand(); if (n > 0) setTimeout(function () { gearWatch(n - 1); }, 200); })(5);
  setInterval(function () {
    measureBand();
    var fb = dockLayerEl ? dockLayerEl.querySelector(".sv-floatbar") : null;
    if (!fb || !fb.offsetHeight) return;
    var pr = hostPanel.getBoundingClientRect(), fr = fb.getBoundingClientRect();
    if (pr.height < 40 || fr.height < 8) return;
    var want = Math.max(8, Math.round(pr.bottom - fr.top - fr.height / 2) - 20);
    var cur = gear.style.bottom ? parseFloat(gear.style.bottom) : NaN;
    if (!isFinite(cur) || Math.abs(cur - want) > 1) gear.style.bottom = want + "px";
  }, 1000);
  window.addEventListener("resize", function () { placeGear(); alignGearSoon(); measureBandSoon(); });
  if (dockLayerEl && window.MutationObserver) new MutationObserver(alignGearSoon).observe(dockLayerEl, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
  /* IMPL-92③：双栏带高测量——图片居中于上下悬浮栏之间的几何基础（「图片高度」设置已移除）。
     实测 .sv-caplayer 信息条底缘 / .sv-docklayer 浮动栏（或对比条）顶缘相对 .result-body 的
     让位量，写根节点 --sv-pt/--sv-pb（.result-scroll 上下 padding，仅 :has(single-view) 生效）
     与 --sv-band（带高=scroll 高−让位）、--sv-availw（可用宽=列表内容宽）供 height 公式
     min(带高×缩放, 可用宽×ar⁻¹×缩放) 使用（IMPL-109⑤：100% 基准横竖分流——竖图填满带高、横图填满可用宽）；
     任何写入后 svSyncSoon()（applyHole 镂空窗与落影锚随图片新位置重算）。
     让位量只依赖两栏几何（absolute，不受 scroll padding 影响）→ 无测量↔布局抖动环；
     偏差>0.5px 才写 style。触发：resize/docklayer+caplayer 子树变动（换图渲染即触发）/
     启动 watch×6/常驻 1s 校验 */
  var capLayerEl = document.getElementById("svCapLayer"), bandRaf = 0;
  function measureBand() {
    var listEl = document.getElementById("resultList");
    var bodyEl = hostPanel ? hostPanel.querySelector(".result-body") : null;
    var scrollEl = hostPanel ? hostPanel.querySelector(".result-scroll") : null;
    if (!listEl || !bodyEl || !scrollEl || !listEl.classList.contains("single-view")) return;
    var cap = capLayerEl ? (capLayerEl.querySelector(".sv-caption") || capLayerEl.firstElementChild) : null;
    var fb = dockLayerEl ? dockLayerEl.querySelector(".sv-floatbar") : null;/* IMPL-138③：compare-bar fallback 已移除 */
    var br = bodyEl.getBoundingClientRect(), sr = scrollEl.getBoundingClientRect();
    if (br.height < 120 || sr.height < 80) return;
    var pt = 12, pb = 12;
    if (cap && cap.offsetHeight) pt = cap.getBoundingClientRect().bottom - br.top + 14;
    if (fb && fb.offsetHeight) pb = br.bottom - fb.getBoundingClientRect().top + 14;
    if (pt < 8) pt = 8;
    if (pb < 8) pb = 8;
    var band = sr.height - pt - pb;
    if (band < 120) band = 120;
    var rs = document.documentElement.style;
    var ptS = Math.round(pt) + "px", pbS = Math.round(pb) + "px", bandS = Math.round(band) + "px";
    /* IMPL-109⑤：可用宽=列表内容宽（scroll 内容盒）——横图 100% 基准，双栏布局下
       不再被 92vw 视口钳制放大到远超面板 */
    var awS = Math.round(listEl.clientWidth) + "px";
    if (rs.getPropertyValue("--sv-pt") !== ptS) rs.setProperty("--sv-pt", ptS);
    if (rs.getPropertyValue("--sv-pb") !== pbS) rs.setProperty("--sv-pb", pbS);
    if (rs.getPropertyValue("--sv-band") !== bandS) rs.setProperty("--sv-band", bandS);
    if (rs.getPropertyValue("--sv-availw") !== awS) rs.setProperty("--sv-availw", awS);
    svSyncSoon();
  }
  function measureBandSoon() { if (!bandRaf) bandRaf = requestAnimationFrame(function () { bandRaf = 0; measureBand(); }); }
  if (dockLayerEl && window.MutationObserver) new MutationObserver(measureBandSoon).observe(dockLayerEl, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
  if (capLayerEl && window.MutationObserver) new MutationObserver(measureBandSoon).observe(capLayerEl, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
  var sliders = {}, badges = {}, meta = {}, defVal = {}, chipDef = {};
  var open = false, raf = 0, saveT = 0;

  Array.prototype.forEach.call(panel.querySelectorAll("input[type=range]"), function (el) {
    if (el.id.indexOf("sfx-") !== 0) return;
    var suf = el.id.slice(4);
    sliders[suf] = el;
    badges[suf] = document.getElementById("sfxv-" + suf);
    meta[suf] = { min: parseFloat(el.min), max: parseFloat(el.max) };
    defVal[suf] = el.getAttribute("value");
  });
  CHIPS.forEach(function (c) {
    var box = document.getElementById(c[0]);
    var d = box ? box.querySelector("button.on") : null;
    if (d) chipDef[c[0]] = d.getAttribute(c[1]);
  });

  function floorObj() { return (window.SvFloor && window.SvFloor.config) ? window.SvFloor.config : null; }
  function clamp(v, suf) { return Math.min(meta[suf].max, Math.max(meta[suf].min, v)); }
  var svSyncRaf = 0;
  /* IMPL-89⑤：rAF 合帧的 sync(false)——签名缓存自动判定重画范围，杜绝逐事件全量重绘 */
  function svSyncSoon() {
    if (svSyncRaf) return;
    svSyncRaf = requestAnimationFrame(function () {
      svSyncRaf = 0;
      var FF = window.SvFloor;
      if (FF && FF.sync) FF.sync(false);
    });
  }
  function scheduleRedraw() {
    var F = window.SvFloor;
    if (!F || !F.sync || raf) return;
    /* IMPL-89⑤：redraw() 强制清缓存双 canvas 全量重画 → sync(false) 签名比对，
       参数变化照样重画（键覆盖全部参数），但跳过无谓的重复全量帧 */
    raf = requestAnimationFrame(function () { raf = 0; F.sync(false); });
  }
  function applySuf(suf, v) {
    /* IMPL-82/86/92③：结果图片组不走引擎参数，直接写根节点 CSS 变量；
       回到默认值时移除变量，让回落值生效（--sv-img-z 回落 1=100% 基准）。
       IMPL-92③：imgh 分支移除——高度改由「双栏带高 --sv-band」推导，见 measureBand */
    if (suf === "imgw") {
      /* IMPL-90②/92③：imgw 写等比缩放（--sv-img-z，v/100 比例值）；图片恒居中，缩放只改大小 */
      var rs = document.documentElement.style;
      var prop = "--sv-img-z";
      if (parseFloat(defVal[suf]) === v) rs.removeProperty(prop);
      else rs.setProperty(prop, String(v / 100));
      /* IMPL-85/89⑤：媒体尺寸变化引擎无感知 → 主动 sync；IMPL-89⑤：rAF 合帧 +
         sync(false) 走签名缓存（图框变→只重画落影，网格不重绘），拖动不再逐事件
         全量双 canvas 强制重画=卡顿根因 */
      svSyncSoon();
      return;
    }
    var F = floorObj(), key = MAP[suf];
    if (!F || !key) return;
    F[key] = v;
    if (key === "shadowBlur" && ("blur" in F)) F.blur = v; /* 兼容桥：当前引擎旧键名 */
    scheduleRedraw();
  }
  /* IMPL-82：带单位徽标（结果图片组：% / vh） */
  var UNITS = { imgw: "%" }; /* IMPL-90②：imgw 语义=等比缩放百分比；imgh 随设置移除（IMPL-92③） */
  function setBadge(suf) {
    var b = badges[suf], sl = sliders[suf];
    if (!sl) return;
    if (b) b.textContent = parseFloat(sl.value).toFixed(DEC[suf] != null ? DEC[suf] : 0) + (UNITS[suf] || "");
    /* IMPL-92①：无拇指圆角条——填充断点=纯值百分比（旧 17px 拇指的 8.5/17 半程修正项随
       拇指移除；保留修正会在 pct=0 处露出 8.5px 假填充） */
    var mn = parseFloat(sl.min), mx = parseFloat(sl.max);
    if (isFinite(mn) && isFinite(mx) && mx > mn) {
      var pct = (parseFloat(sl.value) - mn) / (mx - mn);
      sl.style.setProperty("--fill", (pct * 100).toFixed(2) + "%");
    }
  }
  function setChipOn(cid, attr, val) {
    var box = document.getElementById(cid);
    if (!box) return;
    Array.prototype.forEach.call(box.children, function (b) {
      b.classList.toggle("on", b.getAttribute(attr) === String(val));
    });
  }
  function chipValOf(cid, attr, numeric) {
    var on = document.getElementById(cid) && document.getElementById(cid).querySelector("button.on");
    if (!on) return null;
    var raw = on.getAttribute(attr);
    return numeric ? parseInt(raw, 10) : raw;
  }
  function saveSoon() {
    if (saveT) return;
    saveT = setTimeout(function () {
      saveT = 0;
      try {
        var dump = {};
        for (var suf in sliders) dump[MAP[suf]] = parseFloat(sliders[suf].value);
        CHIPS.forEach(function (c) { var v = chipValOf(c[0], c[1], c[3] === "int"); if (v !== null) dump[c[2]] = v; });
        /* IMPL-85：线色/底色直读活配置——主题预设值（未必命中 5 色 chips）也持久化 */
        var FC = floorObj();
        if (FC) { dump.ink = FC.ink; dump.base = FC.base; }
        dump._v = 2; /* IMPL-90②：imgw 语义 v2 标记（新档 40-160 缩放%），旧档（≤90 无标记）启动时一次性迁移 */
        dump._inkv = 2; /* IMPL-109⑥：主题默认迁移标记（防旧默认对被反复迁移、覆盖用户显式选择） */
        localStorage.setItem(LS_KEY, JSON.stringify(dump));
      } catch (e) {}
    }, 240);
  }
  /* 滑杆输入 → 徽标 + config + 重画 + 持久化；IMPL-89⑦：双击=回默认（快捷精确复位） */
  Object.keys(sliders).forEach(function (suf) {
    var onInput = function () {
      var v = parseFloat(sliders[suf].value);
      if (!isFinite(v)) return;
      v = clamp(v, suf);
      setBadge(suf);
      applySuf(suf, v);
      saveSoon();
    };
    sliders[suf].addEventListener("input", onInput);
    sliders[suf].addEventListener("dblclick", function () {
      sliders[suf].value = defVal[suf];
      onInput();
    });
  });
  /* chips → config + 重画 + 持久化 */
  CHIPS.forEach(function (c) {
    var box = document.getElementById(c[0]);
    if (!box) return;
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      Array.prototype.forEach.call(box.children, function (x) { x.classList.toggle("on", x === b); });
      var F = floorObj();
      if (F) {
        F[c[2]] = c[3] === "int" ? parseInt(b.getAttribute(c[1]), 10) : b.getAttribute(c[1]);
        scheduleRedraw();
        if (window.__wbSyncThemeColor) window.__wbSyncThemeColor();/* IMPL-115④：线色/底色单芯片直改也即时同步沉浸底色（theme-color+body 背景） */
      }
      saveSoon();
    });
  });
  /* IMPL-85：主题预设——一键成对切换 线色+底色（独立色块 chips 仍可微调） */
  var themeBox = document.getElementById("sfx-theme");
  if (themeBox) themeBox.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    Array.prototype.forEach.call(themeBox.children, function (x) { x.classList.toggle("on", x === b); });
    var ink = b.getAttribute("data-ink"), base = b.getAttribute("data-base");
    var F = floorObj();
    if (F) { F.ink = ink; F.base = base; scheduleRedraw(); }
    saveSoon();
    if (window.__wbSyncThemeColor) window.__wbSyncThemeColor();/* IMPL-114②：主题换色即时同步状态栏底色（手机菜单条主题循环钮同链路） */
  });
  /* 分组折叠（沿用用户 demo 的 grp/h 结构语义） */
  /* IMPL-110②：手机菜单条主题循环钮——每次点按切到下一枚网格主题（循环），复用预设 chips 点击链路（ink/base/redraw/save/on 态联动） */
  var themeCycleBtn = document.getElementById("themeCycleBtn");
  if (themeCycleBtn) themeCycleBtn.addEventListener("click", function () {
    var box = document.getElementById("sfx-theme");
    if (!box || !box.children.length) return;
    var chips = Array.prototype.slice.call(box.children);
    var cur = box.querySelector(".sw.on");
    var idx = cur ? chips.indexOf(cur) : -1;
    var next = chips[(idx + 1) % chips.length];
    if (next) next.click();
  });

  panel.addEventListener("click", function (e) {
    var h = e.target.closest(".fh");
    if (h && h.parentElement) h.parentElement.classList.toggle("open");
  });
  /* 重置：恢复默认 + 清档 */
  var resetBtn = document.getElementById("sfx-reset");
  if (resetBtn) resetBtn.addEventListener("click", function () {
    Object.keys(sliders).forEach(function (suf) {
      sliders[suf].value = defVal[suf];
      setBadge(suf);
      applySuf(suf, parseFloat(defVal[suf]));
    });
    CHIPS.forEach(function (c) {
      if (!(c[0] in chipDef)) return;
      setChipOn(c[0], c[1], chipDef[c[0]]);
      var F = floorObj();
      if (F) F[c[2]] = c[3] === "int" ? parseInt(chipDef[c[0]], 10) : chipDef[c[0]];
    });
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    /* IMPL-86/109⑥：重置=出厂默认（石墨主题 ink 122,130,144 / base #1b1e24，IMPL-109⑥ 改）——
       主题按值回点，不再依赖 chips DOM 的初始 .on 位置 */
    var FC2 = floorObj();
    if (FC2) { FC2.ink = "122,130,144"; FC2.base = "#1b1e24"; }
    var themeBox2 = document.getElementById("sfx-theme");
    if (themeBox2) Array.prototype.forEach.call(themeBox2.children, function (x) {
      x.classList.toggle("on", x.getAttribute("data-ink") === "122,130,144" && x.getAttribute("data-base") === "#1b1e24");
    });
    scheduleRedraw();
    if (window.__wbSyncThemeColor) window.__wbSyncThemeColor();/* IMPL-114②：重置回石墨即同步状态栏底色 */
  });
  /* IMPL-85：复制参数——导出当前网格/落影/图片参数 JSON 到剪贴板（含 execCommand 兜底） */
  var copyBtn = document.getElementById("sfx-copy");
  if (copyBtn) copyBtn.addEventListener("click", function () {
    var dump = {};
    Object.keys(sliders).forEach(function (suf) { dump[MAP[suf]] = parseFloat(sliders[suf].value); });
    CHIPS.forEach(function (c) { var v = chipValOf(c[0], c[1], c[3] === "int"); if (v !== null) dump[c[2]] = v; });
    var FC = floorObj();
    if (FC) { dump.ink = FC.ink; dump.base = FC.base; }
    var text = JSON.stringify(dump);
    var ok = function () { if (window.Toast && Toast.success) Toast.success("已复制网格参数"); };
    var bad = function () { if (window.Toast && Toast.error) Toast.error("复制失败，请手动重试"); };
    var legacy = function () {
      try {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.cssText = "position:fixed;opacity:0;left:-999px";
        document.body.appendChild(ta); ta.select();
        var done = document.execCommand("copy");
        document.body.removeChild(ta);
        return done;
      } catch (e) { return false; }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, function () { (legacy() ? ok : bad)(); });
    else (legacy() ? ok : bad)();
  });
  /* 开合（aria-expanded + .open 类；reduced-motion 下 CSS 已禁过渡） */
  function setOpen(v) {
    open = v;
    layer.classList.toggle("open", v);
    gear.setAttribute("aria-expanded", v ? "true" : "false");
    /* 79-b 移动端：面板重挂 body 成底部抽屉——.result-body overflow:hidden + .col-results
       backdrop-filter(包含块) 会把层内 absolute 面板钳在矮 resultBody 里（390px 视口仅 ~68px 视窗）；
       body 直挂后 fixed 退化为视口包含块（appendChild 移动节点不丢监听）。桌面不动。 */
    /* IMPL-88：面板全端挂 body fixed——桌面停靠网页右侧空白区（视口右缘，不挡结果区
       预览），移动端维持底部抽屉（.col-results backdrop-filter 是 fixed 包含块，
       层内无法逃逸）。打开即挂 body+强制 reflow 保证过渡从初始态播放；关闭等 300ms
       收起动画播完再回挂 layer（回挂前再确认仍处于关闭态，避免竞态） */
    if (open) {
      if (panel._backT) { clearTimeout(panel._backT); panel._backT = 0; }
      if (panel.parentNode !== document.body) {
        document.body.appendChild(panel);
        void panel.offsetWidth;
      }
    } else if (panel.parentNode !== layer) {
      if (panel._backT) clearTimeout(panel._backT);
      panel._backT = setTimeout(function () {
        panel._backT = 0;
        if (!open && panel.parentNode !== layer) layer.appendChild(panel); /* IMPL-88：gear 已重挂 col-results（不在 layer 内），insertBefore(·,gear) 会抛 NotFoundError 致回挂失败 */
      }, 300);
    }
    document.body.classList.toggle("svf-open", open);
    if (v) syncFromConfig();
  }
  function syncFromConfig() {
    var F = floorObj();
    if (!F) return;
    Object.keys(sliders).forEach(function (suf) {
      var key = MAP[suf];
      if (key in F) {
        var v = parseFloat(F[key]);
        if (isFinite(v)) sliders[suf].value = clamp(v, suf);
      }
      setBadge(suf);
    });
    CHIPS.forEach(function (c) { if (c[2] in F) setChipOn(c[0], c[1], F[c[2]]); });
  }
  gear.addEventListener("click", function (e) {
    e.stopPropagation();
    setOpen(!open);
  });
  /* IMPL-90⑤：面板头关闭钮（stopPropagation 防触发 document 外点 capture 的重复关闭） */
  var fclose = document.getElementById("svfClose");
  if (fclose) fclose.addEventListener("click", function (e) { e.stopPropagation(); setOpen(false); });
  /* 外点关闭（capture 捕获一切点击起点；IMPL-86：齿轮已重挂出 layer，点击齿轮不得误判为外点） */
  document.addEventListener("pointerdown", function (e) {
    if (open && !layer.contains(e.target) && !gear.contains(e.target) && !panel.contains(e.target)) setOpen(false); /* IMPL-88：+panel.contains——面板挂 body 后点击面板内（滑杆等）不得误判外点关闭 */
  }, true);
  /* Esc 关闭（与全站 popover 语义一致） */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && open) setOpen(false);
  });
  /* 齿轮显隐：单图视图且有内容（.sv-wrap 在场）才显示；空态/销毁时收回面板 */
  function syncVis() {
    var has = !!(list && list.querySelector(".sv-wrap"));
    gear.hidden = !has;
    if (!has && open) setOpen(false);
  }
  if (list && window.MutationObserver) new MutationObserver(syncVis).observe(list, { childList: true });
  /* IMPL-88：媒体加载完成 → 齿轮同高+窗/影随动——img/video load 不冒泡，capture 捕获；
     否则图片撑高媒体区后浮动菜单栏上移，齿轮停留在加载前的过期位置（实测 dy=11px） */
  /* IMPL-90②：媒体元信息 → 根节点 --sv-img-ar-inv（nh/nw）——尺寸公式用它在「92vw 宽度
     钳制」下折算等比高度上限（超宽横图不变形不变形留白）；img=load、video=loadedmetadata，
     均 capture 捕获（不冒泡）；closest(".sv-media") 守卫非媒体 load */
  function syncArInv(e) {
    var t = e && e.target;
    if (!t || t.nodeType !== 1) return;
    var w = t.naturalWidth || t.videoWidth || 0, h = t.naturalHeight || t.videoHeight || 0;
    if (!w || !h || !t.closest || !t.closest(".sv-media")) return;
    document.documentElement.style.setProperty("--sv-img-ar-inv", (h / w).toFixed(6));
  }
  if (list) list.addEventListener("load", function (e) { syncArInv(e); alignGearSoon(); if (window.SvFloor && SvFloor.sync) SvFloor.sync(); }, true); /* IMPL-108②：去 force——load 强制全网重绘无意义（gridKey 未变=同像素白耗重画，换卡网格闪动；落影经 shadowKey 矩形变化自动重画，齿轮由同链 alignGearSoon 负责） */ /* IMPL-88：跨 IIFE 用公开 API——图片加载后齿轮同高+落影锚随动（schedule 在引擎域不可见）；IMPL-90②：+ar-inv 同步 */
  if (list) list.addEventListener("loadedmetadata", syncArInv, true); /* IMPL-90②：video 尺寸同步 */
  window.addEventListener("load", syncVis);
  syncVis();
  /* 启动恢复：逐键 clamp，键缺失保持默认、多余键忽略 */
  (function restore() {
    var raw = null;
    try { raw = localStorage.getItem(LS_KEY); } catch (e) { return; }
    if (!raw) return;
    var data = null;
    try { data = JSON.parse(raw); } catch (e) { return; }
    if (!data || typeof data !== "object") return;
    /* IMPL-109⑥：默认主题素白→石墨一次性迁移——旧档恰好是旧默认对（从未自定义过主题）
       时改写为石墨并落 _inkv 标记；标记存在后用户显式选回素白不会被再次迁移 */
    if (data._inkv !== 2 && data.ink === "182,188,198" && data.base === "#ffffff") {
      data.ink = "122,130,144"; data.base = "#1b1e24"; data._inkv = 2;
      try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) {}
    }
    Object.keys(sliders).forEach(function (suf) {
      var key = MAP[suf];
      if (!(key in data)) return;
      var v = parseFloat(data[key]);
      if (!isFinite(v)) return;
      /* IMPL-90②：imgw 语义升级一次性迁移——旧档（vh 宽度上限 30-90，无 _v:2 标记）
         回 100% 基准并重写存档；新档带 _v:2 不再触发 */
      if (suf === "imgw" && data._v !== 2 && v <= 90) {
        v = 100;
        try { data.imgW = 100; data._v = 2; localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) {}
      }
      sliders[suf].value = clamp(v, suf);
      setBadge(suf);
      applySuf(suf, clamp(v, suf));
    });
    CHIPS.forEach(function (c) {
      var box = document.getElementById(c[0]);
      if (!box || !(c[2] in data)) return;
      var val = c[3] === "int" ? parseInt(data[c[2]], 10) : data[c[2]];
      var hit = Array.prototype.filter.call(box.children, function (b) { return b.getAttribute(c[1]) === String(val); });
      if (!hit.length) return; /* 非法值忽略 */
      setChipOn(c[0], c[1], val);
      var F = floorObj();
      if (F) F[c[2]] = val;
    });
    /* IMPL-85：主题预设恢复（ink/base 直读存档；主题 chips .on 按成对值回点） */
    var Fr = floorObj();
    if (Fr) {
      if (typeof data.ink === "string" && data.ink) Fr.ink = data.ink;
      if (typeof data.base === "string" && data.base) Fr.base = data.base;
    }
    var tbox = document.getElementById("sfx-theme");
    if (tbox) Array.prototype.forEach.call(tbox.children, function (b) {
      b.classList.toggle("on", b.getAttribute("data-ink") === data.ink && b.getAttribute("data-base") === data.base);
    });
  })();
  window.SvFloorPanel = { setOpen: setOpen, syncVis: syncVis, syncFromConfig: syncFromConfig };
})();

/* == BrandSpin：品牌徽标永续旋转回归（IMPL-48）——
   相比旧版 CSS 16s 定速旋转的四项优化：
   ① WAAPI transform 动画跑在合成器线程，主线程忙（出图/渲染列表）时也永不清帧；
   ② 悬停通过 updatePlaybackRate 无缝变速（旧版改 animation-duration 会跳角度）；
   ③ 标签页隐藏时 anim.pause() 停转省电，回前台无角度跳变继续；
   ④ prefers-reduced-motion 自动静止（无障碍），.brand-mark 悬停轻浮 scale 呼应 */
(function () {
  var img = document.querySelector(".brand-logo");
  if (!img || typeof img.animate !== "function") return;
  var mark = img.closest(".brand-mark") || img;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var DUR = 20000, HOVER_RATE = 3.2, anim = null;
  function start() {
    if (anim) return;
    anim = img.animate([
      { transform: "rotate(0deg)" },
      { transform: "rotate(360deg)" }
    ], { duration: DUR, iterations: Infinity, easing: "linear" });
  }
  function stop() { if (anim) { anim.cancel(); anim = null; } }
  function setRate(r) {
    if (!anim) return;
    if (typeof anim.updatePlaybackRate === "function") anim.updatePlaybackRate(r);
    else anim.playbackRate = r;
  }
  mark.addEventListener("pointerenter", function () { setRate(HOVER_RATE); });
  mark.addEventListener("pointerleave", function () { setRate(1); });
  document.addEventListener("visibilitychange", function () {
    if (!anim) return;
    if (document.hidden) anim.pause(); else anim.play();
  });
  function applyMotion() { reduced.matches ? stop() : start(); }
  if (typeof reduced.addEventListener === "function") reduced.addEventListener("change", applyMotion);
  else if (typeof reduced.addListener === "function") reduced.addListener(applyMotion);
  applyMotion();
})();

/* ══════ R44 · 宿主能力表（由 _r44_host_caps.js 拼入；视频链路的跨 script 契约）══════ */
/** ★★★ R44（2026-10-05）· 宿主能力表 —— 独立源文件，由 `_gen-host-apiyi.mjs`
 *  读入拼进产物**最后一个 `<script>`** 的开头（在视频适配器/桥之前）。
 *
 *  ══════ 为什么需要它（一次真机事故换来的）══════
 *  标题：**跨 `<script>` 边界裸调宿主内部函数 = 定时炸弹**。
 *
 *  宿主有大量助手定义在 `window.StudioEditor = (function(){ … })()` **这个 IIFE 内部**
 *  （产物 script 块 17404–18471）：`apiyiTimeoutOf` · `wyUploadDataUrl` ·
 *  `wyCompressDataUrl` · `dataUrlToFile`；
 *  而我们的视频适配器/桥被拼进**另一个** `<script>`（18472+）——
 *  在那里裸写 `apiyiTimeoutOf(...)` 得到的是 **ReferenceError**，不是"稍后就有"。
 *
 *  真机后果（`验收/_probe_r44_models.py` 实测）：
 *   · APIYI 三档（Seedance/VEO/Wan）**请求一条都发不出去** ——
 *     报 `apiyiTimeoutOf is not defined`；而 R40 的探针只读了 `[W5-route]` **日志行**，
 *     那条 `console.info` 恰好打在 `Api._directReq(..., {timeout: apiyiTimeoutOf(...)})`
 *     **之前** ⇒ **日志显示"参数全部送达"，请求从未发出**（铁规矩 28 由此而立）。
 *   · 速创 6 档：纯文生可用，**一挂参考素材就挂**（`wyUploadDataUrl` 不可见）；
 *   · VEO 参考图：被 `try{}catch{}` **静默吞掉**（日志 `refs:0`），而官方
 *     `input_reference` 是**必填** ⇒ 连文生都会被上游拒。
 *
 *  ══════ 约定 ══════
 *  `_gen-host-apiyi.mjs` 的 R44 sub 在 StudioEditor IIFE 的收尾处（所有助手都已定义）
 *  插入一行把它们挂到 `window.__w5Host`；本文件只做**取用 + 守卫**。
 *  · `w5Host()`  —— 取能力表（可能为空对象，永不抛）
 *  · `w5Need(name, hint)` —— 取一个**必须存在**的函数；缺失时抛**明确**原因（R17：不静默失败）
 *
 *  ⚠ 为什么不用 `typeof x !== "function"` 就地判断 + 兜底实现：兜底 = 第二份实现
 *    （宿主改了这边不知道，铁规矩 23 的"抄成两份必然漂移"）。宁可**明确报错**，
 *    也不静默用另一份可能过时的逻辑 —— 尤其 `apiyiTimeoutOf` 关系到"客户端超时**不会**
 *    取消上游、照常计费"，猜一个偏短的超时 = 花了钱拿不到东西。
 */
function w5Host() {
  return (typeof window !== "undefined" && window.__w5Host) ? window.__w5Host : {};
}

/** 取一个必须存在的宿主能力函数；缺失就抛明确错误（带上"怎么办"的指引）。 */
function w5Need(name, hint) {
  const h = w5Host();
  const f = h[name];
  if (typeof f !== "function") {
    throw new Error(
      "宿主能力缺失：" + name + "（宿主与编辑器版本不匹配——请刷新页面；若仍报此错，说明宿主件未更新）"
      + (hint ? " · " + hint : "")
    );
  }
  return f;
}

/** APIYI 请求超时：宿主给足（图片 300/600s，视频同族）。缺失时**明确报错**，不猜数。 */
function w5TimeoutOf(modelId, def, size) {
  return w5Need("apiyiTimeoutOf", "该函数决定客户端等待时长；猜短了会「断开不取消上游、照常计费」")(
    modelId, def, size
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   R44 自检（静态判据读这些字面量：check_r44_video_wiring.py）
     · 能力表取值口：w5Host / w5Need / w5TimeoutOf
     · 明确报错文案：宿主能力缺失
   ══════════════════════════════════════════════════════════════════════════════ */

/* ══════ R44 · 宿主能力表 end ══════ */

/* ══════ R34 · APIYI 视频适配器 V2（三家分流· 由 _r34_video_adapter.js 拼入）══════ */
/** ★★ R34 · APIYI 视频生成适配器 V2 —— 独立源文件，由生成器读入拼进产物。
 *
 *  ══════ 为什么 V2：R32 把三个模型全塞进 /v1/videos，官方文档明文禁止 ══════
 *  证据（docs.apiyi.com 免鉴权文档中心，2026-10-04 核实）：
 *   · wan/overview：「**绝对不要用 `/v1/videos`** —— 那条路会把 `media` 字段丢掉，
 *     上游报 `[InvalidParameter] Field required: input.media`」
 *   · seedance2/video-generation：「路径前缀是 `/seedance/api/v3`，**不要漏掉 `/api`**，
 *     也不要用 `/v1/videos`」
 *   · skill.md：「Video models do **not** use a single unified path. Each vendor family
 *     has its own submit-and-poll paths.」
 *  ⇒ 三家各自一套 submit/poll，本文件按家分流。
 *
 *  ── 分流表（官方 OpenAPI 确证；★ R40 订正 Wan 行）────────────────────────
 *   | 模型 | create路径 | 轮询路径 | 请求体 | 参考素材 |
 *   |---|---|---|---|---|
 *   | Seedance 2.5 | /seedance/api/v3/contents/generations/tasks | 同路径/{id} | JSON | content[] + role（✅首尾帧/参考图/参考视频/参考音频）|
 *   | VEO 3.1 官转| /v1/videos | /v1/videos/{id} | FormData | 仅 1 张图 `input_reference`（✅首帧；尾帧/多图/扩展官方未开放）|
 *   | Wan 3.0| /wan/api/v1/.../video-synthesis | /v1/tasks/{id} | **JSON 嵌套** | media[] 对齐宿主 _dsVideo（见 Wan 段） |
 *
 *  ── VEO 四个官方坑（我们 V1 全踩）───────────────────────────────────────
 *   1. 时长字段是 **`seconds`** 且必须是**字符串** `"8"`；写 `duration` 会被**静默忽略**回落4s，
 *      传数字报 `parse_request_failed: cannot unmarshal number into Go struct field`。
 *   2. **绝不能传 `generateAudio`** —— 上游回 `INVALID_ARGUMENT`。音频意图写进 prompt。
 *   3. 1080p / 4k 时 `seconds` 必须 `"8"`。
 *   4. 无 `video_url`，只能 GET /v1/videos/{id}/content 拉流（**V2 不引入**，同R32 理由：
 *      视频几十 MB，blob 与账本都吃不下；永久化留给 V3 的 R2 转存）。
 *
 *  ── 取片口径 = **URL**（照 DashScope _dsVideo 与图片通道一致做法）────────
 *  失败语义：路径 / 任务 / 耗时全进 [W5-route]，**不静默回退**到图片通道（R17 铁规矩）。
 */
async function apiyiVideo(prompt, def, ex, refs) {
  const t0 = Date.now();
  const e = ex || {};
  const mid = String(def.modelId || def.id || "");
  const idl = String(def.id || "");
  const opt = e.__opts || {};                 /* 参考素材统一入口（见 _r33 桥） */

  const isSeedance = /seedance/i.test(mid) || /seedance/i.test(idl);
  const isWan = /wan/i.test(mid) || /wan/i.test(idl);
  const isVeo = /veo/i.test(mid) || /veo/i.test(idl);
  const route = isSeedance ? "seedance" : isWan ? "wan" : isVeo ? "veo" : "generic";

  /* ══════════ ① Seedance 2.5：JSON + content[] + role ══════════
   * 官方示例（docs.apiyi.com seedance2）：
   *   {"model":"doubao-seedance-2-5-260628",
   *    "content":[{"type":"text","text":"..."},
   *                {"type":"image_url","image_url":{"url":"..."},"role":"first_frame"}],
   *    "resolution":"720p","ratio":"adaptive","duration":5,"generate_audio":true}
   * ★ 注意是 **JSON**，不是 FormData；参考素材靠 role 区分首帧/尾帧/参考图/参考视频/参考音频。
   * ★ ratio 默认 **adaptive**（官方强制值），不是 16:9。
   * ★ 2.5 的 duration缺省是 **-1**（模型自选），我们显式传，避免"不传就自动变时长"。
   *
   * ★★ 这里是 R34 最重要的一个设计：官方明确 `image_url.url` **支持公网 URL / Base64**，
   *   所以**不需要 dataUrlToFile 转文件**（它只吃 dataURL 的 base64，见产物函数体）。
   *   编辑器给的 blob: URL 直接传是行不通的，但编辑器可以给 **dataURL**（我们已有
   *   `urlToDataUrl` 通道），官方也收 ⇒ **图片侧通道打通，无需 R2 中转**。
   *   视频/音频同理：官方 `video_url.url` / `audio_url.url` 也收 URL 或 Base64。
   */
  if (route === "seedance") {
    const content = [{ type: "text", text: String(prompt || "") }];
    let refOk = 0;
    const push = function (type, url, role) {
      const u = String(url || "").trim();
      if (!u) return;
      /* 官方 asset:// 素材库 ID 也走同一个字段；这里不校验（那是 icover.ai 的另一把 key）。*/
      content.push({ type: type, role: role, [type]: { url: u } });
      refOk++;
    };
    if (opt.firstFrameUrl) push("image_url", opt.firstFrameUrl, "first_frame");
    if (opt.lastFrameUrl) push("image_url", opt.lastFrameUrl, "last_frame");
    (Array.isArray(opt.imageUrls) ? opt.imageUrls : []).forEach(function (u) { push("image_url", u, "reference_image"); });
    (Array.isArray(opt.videoUrls) ? opt.videoUrls : []).forEach(function (u) { push("video_url", u, "reference_video"); });
    (Array.isArray(opt.audioUrls) ? opt.audioUrls : []).forEach(function (u) { push("audio_url", u, "reference_audio"); });

    const body = {
      model: mid,
      content: content,
      resolution: String(e.resolution || "720p"),
      ratio: String(e.ratio || "adaptive"),
      duration: Number(e.duration) > 0 ? Number(e.duration) : -1,
      /* ★ R40：面板值是字符串 "true"/"false" —— `!!"false" === true` 的布尔坑会把
         "关音频"也发成 true ⇒ 改字符串收口（缺省 true，只有显式 "false" 才关）。 */
      generate_audio: e.generate_audio === undefined ? true : String(e.generate_audio) !== "false",
    };
    if (e.watermark !== undefined) body.watermark = String(e.watermark) === "true";
    if (e.seed !== undefined && String(e.seed).trim() !== "") body.seed = Number(e.seed);
    if (opt.taskType) body.omni_reference_task_type = String(opt.taskType); /* edit / extend（2.5 独有） */
    /* ★★ R40：官方硬约束（docs.apiyi.com seedance2 · 「任务类型硬约束」表逐字）：
         「首帧 / 首尾帧生视频 → ratio **必须 adaptive**；视频编辑 → ratio 必须 adaptive + duration 必须 -1」
       违反返回 `InvalidParameter.TaskTypeConstraint`（不扣费）。旧实现只对 taskType edit/extend 强制，
       **首帧场景漏了** —— 用户在面板选 16:9 + 首帧 = 必 400。本批补：只要带首帧/尾帧就强制 adaptive
       （adaptive 本就是官方强制值，且带首帧时具体比例会被官方忽略 ⇒ 强制不损失任何东西）。 */
    if (opt.firstFrameUrl || opt.lastFrameUrl) body.ratio = "adaptive";
    if (opt.taskType === "edit" || opt.taskType === "extend") {
      body.ratio = "adaptive";
      if (opt.taskType === "edit") body.duration = -1;
    }
    const path = "/seedance/api/v3/contents/generations/tasks";
    console.info("[W5-route]", JSON.stringify({ phase: "apiyi-video-submit", route: route, model: mid, path: path, duration: body.duration, resolution: body.resolution, ratio: body.ratio, refs: refOk, ts: Date.now() }));

    const sub = await Api._directReq("POST", path, body, { apiyi: true, timeout: w5TimeoutOf(mid, def, e.resolution) });
    if (!sub || sub.error) {
      const em = (sub && sub.error && (sub.error.message || sub.error)) || "";
      throw new Error("APIYI Seedance 提交失败" + (em ? "：" + String(em) : "") + " · " + JSON.stringify(sub || {}).slice(0, 200));
    }
    const taskId = sub.id || sub.task_id || (sub.data && (sub.data.id || sub.data.task_id)) || "";
    if (!taskId) throw new Error("APIYI Seedance 提交未返回任务 id（响应结构不符）· " + JSON.stringify(sub).slice(0, 200));
    /*官方：首轮等 20-30s，间隔 10-20s；成功态是 **succeeded**（不是 completed）。 */
    const last = await pollVideoTask(path + "/" + encodeURIComponent(taskId), taskId, mid, t0, { firstWait: 20000, pollMs: 12000, deadlineMs: 9e5 });
    const raw = ((last || {}).content || {}).video_url || ((last || {}).data || {}).content && ((last.data || {}).content.video_url) || "";
    const vurl = Array.isArray(raw) ? (raw[0] || "") : String(raw || "");
    if (!vurl) throw new Error("APIYI Seedance 完成但未返回 content.video_url（响应结构不符，任务 " + taskId + "）· " + JSON.stringify(last).slice(0, 220));
    console.info("[W5-route]", JSON.stringify({ phase: "apiyi-video-done", route: route, model: mid, taskId: taskId, secs: Math.round((Date.now() - t0) / 1000), usage: !!last.usage, ts: Date.now() }));
    return { assetUrl: vurl, candidates: [vurl], usage: (last && last.usage) || null };
  }

  /* ══════════ ② Wan 3.0：DashScope 透传（JSON 嵌套 + 异步任务）══════════
   * ★★ R40（修 2026-10-04「你能确定模型和功能都能对的上吗」）——**整段重写**。
   *   旧实现三重错（R32 时的错误认知，从未真发过）：
   *     ① 请求体写成 FormData 平铺 + `image` 字段 —— 官方文档原文：
   *        「body 是 DashScope 的嵌套结构 `{ model, input: { prompt, media[] }, parameters: {...} }`，
   *          **不是扁平的**」；media 类型为 first_frame / last_frame / reference_image /
   *          reference_video / reference_audio（**没有 `image` 这个字段名**）。
   *     ② 当"同步返回"解析 video_url —— 官方是**异步**：提交返回 output.task_id，
   *        轮询 GET /v1/tasks/{task_id}（文档原文「每 5–10 秒一次，不要 < 3 秒」），
   *        完成后取 result_url（OSS 签名直链，24h 过期）。
   *     ③ 参数（duration/resolution/ratio）平铺在顶层 —— 应在 `parameters` 对象里（resolution 大写档）。
   *   形态真值 = **宿主 `_dsVideo`（同为百炼族、已在运行的实现）**，payload 结构逐字对齐：
   *     只把 base 换成 APIYI 透传路径（/wan/api/...）、轮询换成 APIYI 的 /v1/tasks/。
   *   ⚠ `media[].url` 官方要求「公网可直接 GET 的 https 链接」；编辑器给的是 dataURL（本地素材）——
   *     本实现**照发不丢弃**，上游若拒会如实报错（R17）。素材上传通道 = 后续批（已记待办）。
   *   ⚠ 轮询复用 pollVideoTask（状态词已兜 completed / succeeded 多形态）。 */
  if (route === "wan") {
    const input = { prompt: String(prompt || "") };
    const media = [];
    if (opt.firstFrameUrl) media.push({ type: "first_frame", url: opt.firstFrameUrl });
    if (opt.lastFrameUrl) media.push({ type: "last_frame", url: opt.lastFrameUrl });
    (Array.isArray(opt.imageUrls) ? opt.imageUrls : []).forEach(function (u) { media.push({ type: "reference_image", url: u }); });
    (Array.isArray(opt.videoUrls) ? opt.videoUrls : []).forEach(function (u) { media.push({ type: "reference_video", url: u }); });
    (Array.isArray(opt.audioUrls) ? opt.audioUrls : []).forEach(function (u) { media.push({ type: "reference_audio", url: u }); });
    if (media.length) input.media = media;
    const params = {};
    params.resolution = String(e.resolution || "1080P");
    if (e.ratio) params.ratio = String(e.ratio);
    if (e.duration !== undefined && e.duration !== null && String(e.duration) !== "") {
      const dn = Number(e.duration);
      if (isFinite(dn)) params.duration = Math.round(dn); /* 官方：整数（传字符串报 cannot unmarshal） */
    }
    if (e.audio !== undefined) params.audio = String(e.audio) === "true";
    if (e.prompt_extend !== undefined) params.prompt_extend = String(e.prompt_extend) === "true";
    if (e.watermark !== undefined) params.watermark = String(e.watermark) === "true";
    if (e.seed !== undefined && String(e.seed).trim() !== "") {
      const sd = parseInt(e.seed, 10);
      if (isFinite(sd) && sd >= 0) params.seed = sd;
    }
    const payload = { model: mid, input: input, parameters: params };
    const path = "/wan/api/v1/services/aigc/video-generation/video-synthesis";
    console.info("[W5-route]", JSON.stringify({ phase: "apiyi-video-submit", route: route, model: mid, path: path, duration: params.duration != null ? params.duration : null, resolution: params.resolution, ratio: params.ratio || null, refs: media.length, ts: Date.now() }));

    /*★ `X-DashScope-Async: enable` 必带（官方异步开关；缺了报「current user api does not
       support synchronous calls」）。自定义头走 `opts.headers`（真值：Api.request 里
       `...opts.headers || {}`）。 */
    const sub = await Api._directReq("POST", path, payload, {
      apiyi: true,
      timeout: w5TimeoutOf(mid, def, e.resolution),
      headers: { "X-DashScope-Async": "enable" },
    });
    if (!sub || sub.error) {
      const em = (sub && sub.error && (sub.error.message || sub.error)) || "";
      throw new Error("APIYI Wan 提交失败" + (em ? "：" + String(em) : "") + " · " + JSON.stringify(sub || {}).slice(0, 200));
    }
    const taskId = (sub.output && (sub.output.task_id || sub.output.id)) || sub.task_id || "";
    if (!taskId) throw new Error("APIYI Wan 提交未返回任务 id（响应结构不符）· " + JSON.stringify(sub).slice(0, 200));
    /* 轮询 GET /v1/tasks/{id}（查询不带头 X-DashScope-Async）。完成后地址双位置兜：
       宿主 _dsVideo 读 output.video_url；APIYI 文档示例为顶层 result_url。 */
    const last = await pollVideoTask("/v1/tasks/" + encodeURIComponent(taskId), taskId, mid, t0, { firstWait: 5000, pollMs: 8000, deadlineMs: 9e5 });
    const o1 = (last && last.output) || {};
    const raw = last && (last.result_url || o1.video_url || o1.videoUrl || o1.url);
    const vurl = Array.isArray(raw) ? (raw[0] || "") : String(raw || "");
    if (!vurl) throw new Error("APIYI Wan 完成但未返回视频地址（result_url / output.video_url 均空，任务 " + taskId + "）· " + JSON.stringify(last).slice(0, 220));
    console.info("[W5-route]", JSON.stringify({ phase: "apiyi-video-done", route: route, model: mid, taskId: taskId, secs: Math.round((Date.now() - t0) / 1000), ts: Date.now() }));
    return { assetUrl: vurl, candidates: [vurl], usage: (last && last.usage) || (sub && sub.usage) || null };
  }

  /* ══════════ ③ VEO 3.1 官转：/v1/videos（只有这家用这个端点）══════════
   * 时长 = **seconds（字符串）**；分辨率/比例走 metadata；参考图字段名固定 `input_reference`（单数、只1 张）。
   * ★ 绝不发 generateAudio（官方明说回 INVALID_ARGUMENT）；音频意图写进 prompt。
   * ★ 1080p / 4k 强制 seconds="8"（我们自动收敛，不让用户选到非法组合）。*/
  if (route === "veo") {
    const fd = new FormData();
    fd.append("model", mid);
    fd.append("prompt", String(prompt || "") + (e.wantAudio ? "（含环境音与音效）" : ""));
    const res = String(e.resolution || "720p");
    /* 官方识别优先级：metadata.durationSeconds > seconds > 8 */
    let secs = String(e.duration || 8);
    if (res === "1080p" || res === "4k") secs = "8"; /* 官方硬约束 */
    fd.append("seconds", secs);
    fd.append("size", res === "4k" ? "3840x2160" : res === "1080p" ? "1920x1080" : "1280x720");
    fd.append("resolution", res);
    if (e.ratio || e.aspectRatio) fd.append("aspectRatio", String(e.ratio || e.aspectRatio));
    let refOk = 0;
    const oneRef = opt.firstFrameUrl || (Array.isArray(opt.imageUrls) && opt.imageUrls[0]) || "";
    if (oneRef) {
      /* ★★ R44（2026-10-05）：`input_reference` 是官方 **必填**（OpenAPI required 三件之一）
         ⇒ 转换失败必须**抛出来**。R34 这里写的是 `try{…}catch(err){}` —— 实测后果：
         `dataUrlToFile` 跨 script 不可见（ReferenceError）被静默吞掉 ⇒ 日志 `refs:0`、
         带着参考图却一张都没发，而官方缺必填直接拒 ⇒ **用户什么都看不到**。
         `dataUrlToFile` 现在经宿主能力表取（缺失时抛明确原因，见 _r44_host_caps.js）。 */
      const toFile = w5Need("dataUrlToFile", "VEO 的 input_reference 必须文件形态（官方不收远程 URL）");
      fd.append("input_reference", toFile(oneRef, "ref.png"), "ref.png");
      refOk++;
    }
    console.info("[W5-route]", JSON.stringify({ phase: "apiyi-video-submit", route: route, model: mid, path: "/v1/videos", seconds: secs, resolution: res, refs: refOk, note: "VEO 官方仅支持 1 张参考图", ts: Date.now() }));

    const sub = await Api._directReq("POST", "/v1/videos", fd, { apiyi: true, timeout: w5TimeoutOf(mid, def, res) });
    if (!sub || sub.error) {
      const em = (sub && sub.error && (sub.error.message || sub.error)) || "";
      throw new Error("APIYI VEO 提交失败" + (em ? "：" + String(em) : "") + " · " + JSON.stringify(sub || {}).slice(0, 200));
    }
    const taskId = sub.id || sub.task_id || (sub.data && (sub.data.id || sub.data.task_id)) || "";
    if (!taskId) throw new Error("APIYI VEO 提交未返回任务 id（响应结构不符）· " + JSON.stringify(sub).slice(0, 200));
    const last = await pollVideoTask("/v1/videos/" + encodeURIComponent(taskId), taskId, mid, t0, { firstWait: 5000, pollMs: 8000, deadlineMs: 9e5 });
    const out = (last && last.output) || last || {};
    const raw = out.video_url || out.videoUrl || out.url || (Array.isArray(out.content) && out.content[0] && out.content[0].url) || "";
    let vurl = Array.isArray(raw) ? (raw[0] || "") : String(raw || "");
    /* ★★ R44（2026-10-05）：VEO **必须自己拉流** —— 官方文档「响应字段陷阱」逐字：
         「**没有直接的 `video_url` 字段**，视频从 `GET /v1/videos/{task_id}/content` 下载」
       旧实现到这里就抛「本批未接流式下载」⇒ **片子生成了、用户拿不到**（还照扣费）。
       现在：查不到 URL ⇒ 走 /content 拉二进制 → Blob → objectURL。 */
    let via = "url";
    if (!vurl) {
      const bin = await fetchVeoContent(taskId);
      vurl = bin.blobUrl;
      via = "content";
      console.info("[W5-route]", JSON.stringify({ phase: "apiyi-video-content", route: route, model: mid, taskId: taskId, bytes: bin.bytes, type: bin.type, ts: Date.now() }));
    }
    console.info("[W5-route]", JSON.stringify({ phase: "apiyi-video-done", route: route, model: mid, taskId: taskId, via: via, secs: Math.round((Date.now() - t0) / 1000), ts: Date.now() }));
    return { assetUrl: vurl, candidates: [vurl], usage: (last && last.usage) || null };
  }

  /* ══════════ 兜底：未知模型 —— 沿用 /v1/videos（= V1 行为，不新增风险）══════════ */
  const fd = new FormData();
  fd.append("model", mid);
  fd.append("prompt", prompt || "");
  if (e.duration) fd.append("duration", String(e.duration));
  if (e.resolution) fd.append("resolution", String(e.resolution));
  console.info("[W5-route]", JSON.stringify({ phase: "apiyi-video-submit", route: "generic", model: mid, path: "/v1/videos", ts: Date.now() }));
  const sub = await Api._directReq("POST", "/v1/videos", fd, { apiyi: true, timeout: w5TimeoutOf(mid, def, e.resolution) });
  if (!sub || sub.error) throw new Error("APIYI 视频提交失败 · " + JSON.stringify(sub || {}).slice(0, 200));
  const taskId = sub.id || sub.task_id || "";
  if (!taskId) throw new Error("APIYI 视频提交未返回任务 id · " + JSON.stringify(sub).slice(0, 200));
  const last = await pollVideoTask("/v1/videos/" + encodeURIComponent(taskId), taskId, mid, t0, { firstWait: 5000, pollMs: 8000, deadlineMs: 9e5 });
  const out = (last && last.output) || last || {};
  const raw = out.video_url || out.url || "";
  const vurl = Array.isArray(raw) ? (raw[0] || "") : String(raw || "");
  if (!vurl) throw new Error("APIYI 视频完成但未返回 video_url · " + JSON.stringify(last).slice(0, 200));
  return { assetUrl: vurl, candidates: [vurl], usage: (last && last.usage) || null };
}

/* ══════════ VEO 取流（R44 新增）══════════
 * 官方原文（docs.apiyi.com · veo-3-1-official/image-to-video ·「响应字段陷阱」）：
 *   「**没有直接的 `video_url` 字段**，视频从 `GET /v1/videos/{task_id}/content` 下载」
 *   「`/content` 端点必须带 `Authorization` 请求头——直接在浏览器地址栏打开会返回 401」
 *   「`/content` 端点在 `status` 刚翻 `completed` 后偶发 400，等 4 秒重试即可（CDN 同步延迟）」
 * ⇒ 走**同一条 Worker 代理**（Authorization 由 Worker 注入），拿到 Blob 造 objectURL。
 *
 * ★ 口径与 APIYI **图片通道**一致（修 2026-10-01 拍板：「平时走 blob URL，导出时才转」）——
 *   视频同源处理，**不预上传 R2**（省一次往返）。代价如实记：blob: 只在**本页面会话**内有效。
 *   视频 URL 永久化（R2 转存）仍是待办，不在本批。
 */
async function fetchVeoContent(taskId) {
  const w = ((typeof Store !== "undefined" && Store.getR2WorkerUrl && Store.getR2WorkerUrl()) || "").trim().replace(/\/$/, "");
  if (!w) throw new Error("no_worker_url: 未配置 R2 Worker 地址（VEO 取片走同一条代理通道）");
  const token = (typeof Store !== "undefined" && Store.getR2AuthToken && Store.getR2AuthToken()) || "";
  const url = w + "/media/apiyi/v1/videos/" + encodeURIComponent(taskId) + "/content?token=" + encodeURIComponent(token);
  let lastErr = "";
  for (let i = 0; i < 4; i++) {
    if (i) await new Promise(function (r) { setTimeout(r, 4000); });   /* 官方：等 4 秒重试 */
    let res = null;
    try {
      res = await fetch(url);
    } catch (e) {
      /* 网络层直接抛（离线 / 被拦 / CORS）—— 记原因后按"可重试"处理，别把裸 TypeError 抛给用户 */
      lastErr = String((e && e.message) || e);
      continue;
    }
    if (res.ok) {
      const blob = await res.blob();
      if (blob && blob.size) {
        return { blobUrl: URL.createObjectURL(blob), bytes: blob.size, type: blob.type || "" };
      }
      lastErr = "空响应";
      continue;
    }
    lastErr = "HTTP " + res.status;
    /* 只对"刚完成"的抖动重试（官方说 400；404 一并兜）；其余（401/403/500）立刻报，别耗 16 秒 */
    if (res.status !== 400 && res.status !== 404) break;
  }
  throw new Error("APIYI VEO 取片失败（" + lastErr + "）· 任务 " + taskId
    + " 已生成成功，可稍后在 APIYI 后台查看（不重试以免重复计费）");
}

/* ══════════轮询器（抽出来共用，三家只是路径与节奏不同）══════════
 * 官方状态词：Seedance 成功态是 **succeeded**；VEO 是 **completed**；Wan 不用（同步）。
 * 状态字段位置也不统一（有的在 output.status、有的在顶层 status）⇒ 一并兜住。*/
async function pollVideoTask(pollPath, taskId, modelId, t0, opt) {
  const o = opt || {};
  const pollMs = o.pollMs || 6000;
  const deadlineMs = o.deadlineMs || 9e5;
  const OK_ST = ["completed", "succeeded", "success", "done", "finished"];
  const BAD_ST = ["failed", "error", "cancelled", "canceled", "rejected", "expired"];
  console.info("[W5-route]", JSON.stringify({ phase: "apiyi-video-task", model: modelId, taskId: taskId, pollPath: pollPath, pollMs: pollMs, deadlineMs: deadlineMs, ts: Date.now() }));

  let last = null;
  for (let i = 0; ; i++) {
    await new Promise(function (res) { setTimeout(res, i === 0 ? (o.firstWait || 5000) : pollMs); });
    if (Date.now() - t0 > deadlineMs) {
      throw new Error("APIYI 视频轮询超时（>" + Math.round(deadlineMs / 1000) + "s，任务 " + taskId + "）· 任务可能仍在跑，可稍后重试查看");
    }
    last = await Api._directReq("GET", pollPath, null, { apiyi: true, timeout: 6e4 });
    if (last && last.error) {
      throw new Error("APIYI 视频轮询出错（任务 " + taskId + "）：" + String(last.error.message || last.error).slice(0, 180));
    }
    const out = (last && last.output) || (last && last.data) || {};
    const st = String(out.status || out.task_status || (last && (last.status || last.state)) || "");
    const low = st.toLowerCase();
    if (!st) {
      /* 有时状态在 progress 里（VEO 只有 queued/in_progress/completed/failed），空就继续等。*/
      if (last && last.error === undefined && last && (last.progress === 100)) break;
      continue;
    }
    if (OK_ST.indexOf(low) >= 0) break;
    if (BAD_ST.indexOf(low) >= 0) {
      throw new Error("APIYI 视频生成失败（任务 " + taskId + "，状态 " + st + "）："
        + String(out.message || out.code || (last && last.message) || "").slice(0, 180));
    }
  }
  return last;
}
/* ══════ R34 · 视频适配器 V2 end ══════ */

/* ══════ R42 · 速创视频适配器（由 _r42_video_wy_adapter.js 拼入）══════ */
/** ★★ R42（2026-10-05）· 宿主侧：**速创通道视频生成** —— 独立源文件，
 *  由 `_gen-host-apiyi.mjs` 读入拼进产物最后一个 `<script>` 内（铁规矩 ⑳）。
 *
 *  ══════ 为什么需要这一条：编辑器此前只接得上 APIYI 的 3 档 ══════
 *  修：「只有 apiyi 的三个视频模型吗  真是啥都做不好」→ 收窄后的口径：
 *    **给「真·视频生成类」9 档**（APIYI 3 + 速创 6）：Wan3.0 / MiniMax H3 / veo3.1 Fast /
 *    可灵 Omni / Google Omni / Vidu Q3；
 *    **不给非生成类/包装类**：Package 1.0（模板成片）· Digital Humans（数字人）·
 *    Video Upscaling（超分）· Wan3.0-Video（直连重复档）。
 *
 *  ══════ 实现口径：**照宿主的现成链路走**，不自己发明 ══════
 *  宿主自己的「生成」按钮对速创档就是这么走的（读码确证）：
 *    ① `_collectParamsAsync()` 按 `model.params` 逐键组 body；
 *       参考素材走 `_collectRef*Async()` —— **只收公网 URL**（`/^https?:\/\//` 过滤）
 *    ② `Api.submit(model, body)` → POST `model.endpoint`（`/api/async/video_*`）→ `{id}`
 *    ③ `PollManager` → `Api.queryDetail(id)`（GET `/api/async/detail?id=`）
 *       成功 = `status===2` 或 `succeeded/success/completed`；失败 = `3 | failed | error`
 *    ④ 取片 = `Api.extractUrl(detail)`
 *  本文件把 ①②③④ 原样接起来，**只补一件宿主页面不需要做的事**：
 *    素材在编辑器里是**本地数据**（dataURL），得先经 `wyUploadDataUrl` 转公网 URL —— 见下。
 *
 *  ══════ ★ R44（2026-10-05）：组 body 抽成 `wyBuildBody()`，核验与提交**共用同一份** ══════
 *  修：「增加一个核验的功能 就是提交的请求是否符合规范 符合规范的方能提交 不符合的就弹出提醒」。
 *  核验要在**点发送时**跑（素材还都是本地 dataURL、也没上传），所以 `wyBuildBody` 加一个
 *  `publicize:false` 模式：素材换成**占位公网 URL**（`https://pending-upload.invalid/…`），
 *  这样宿主校验器的「不能使用本地文件地址」那条不会误报，而**结构类规则**
 *  （必填 / 各档互斥 / 尾帧配首帧 / 数量上限）照样生效。
 *  ⇒ **绝不抄第二份 body 组装逻辑**（抄两份必漂移，铁规矩 23）。
 *
 *  ══════ ★ 素材上传（顺手解决 Wan 的老问题）══════
 *  `wyUploadDataUrl(dataUrl, name, dir)` 是宿主既有的「dataURL → R2 公网 URL」通道
 *  （IMPL-151 Z18 定稿；位图通道早就在用）。速创**只吃公网 URL**，而宿主校验
 *  `normalizeAndValidateApiBody` 还会**直接拒** `blob:` / `data:` / `file:`
 *  （「不能使用本地文件地址，请先上传」）⇒ 不传就是必挂。
 *  ★ R44 订正：该函数在 `window.StudioEditor` 的 IIFE 内、与本文件**不同 script**
 *    ⇒ 经 `w5Need("wyUploadDataUrl")` 取（实测裸调 = ReferenceError）。
 *
 *  ⚠ 三条铁规矩：
 *    · **不静默失败**（R17）：上传不了、提交失败、轮询失败、取不到片，全部抛**带原因**的错误。
 *    · **不编数**（R16）：不猜时长/宽高，交回 URL 让播放器自己读。
 *    · **不重复实现请求逻辑**：提交/轮询/取片全走宿主的 `Api`，本文件只做形状转换。
 */

/* ── 素材公网化（dataURL / blob → R2 公网 URL；已是 http(s) 原样放行）──────────
 *   ⚠ 上传不了就**抛清楚原因**（R17）—— 绝不把 dataURL 当公网 URL 蒙过去：
 *     上游要么取不到、要么被宿主校验拒掉（「不能使用本地文件地址，请先上传」）。*/
async function _wyToPublic(u, name) {
  const s = String(u == null ? "" : u).trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  const up = w5Need("wyUploadDataUrl", "速创只收公网 URL，本地素材必须先转存");
  if (/^data:/i.test(s)) return await up(s, name, "tmp");
  /* blob: / 其它 ⇒ 先读成 dataURL 再上传（编辑器正常会直接交 dataURL，这里是兜底） */
  const resp = await fetch(s);
  const blob = await resp.blob();
  const dataUrl = await new Promise(function (ok, no) {
    const fr = new FileReader();
    fr.onload = function () { ok(String(fr.result || "")); };
    fr.onerror = function () { no(new Error("参考素材读取失败：" + name)); };
    fr.readAsDataURL(blob);
  });
  return await up(dataUrl, name, "tmp");
}

/** 组 body —— **唯一一份**（核验与提交共用）。
 *  body 组装口径：**逐键照 model.params**（与宿主 `_collectParamsAsync` 同一口径）
 *    参考类：值来自 byKey[key]（编辑器按宿主 param key 原样交上来的 dataURL 数组）
 *            形态照 p.output：csv → 逗号串 / array → 数组 / 其它（含缺省）→ 单值
 *            ★ 缺省是 single —— 与 `_collectRefImageAsync` 的收尾 `return urls[0] || ""` 一致。
 *    文本类：prompt / textarea ⇒ 用提示词正文（面板上方那个框）
 *    其余  ：e[key]（面板当前值）优先，其次 p.default；空值不下发（与 _pruneEmptyRefs 同向）
 *  @param opts.publicize 缺省 true（真上传）；false ⇒ 素材用占位公网 URL，**不出网**（核验用）
 *  @returns { body, refCount, localCount }
 */
async function wyBuildBody(prompt, def, ex, opts) {
  const o = opts || {};
  const publicize = o.publicize !== false;
  const e = ex || {};
  const opt = e.__opts || {};
  const params = Array.isArray(def && def.params) ? def.params : [];
  const byKey = (opt && opt.byKey) || {};

  const body = {};
  let refCount = 0;      /* 真进了 body 的素材数 */
  let localCount = 0;    /* 其中"本地数据、还需上传"的个数（核验时用来说明） */

  for (let i = 0; i < params.length; i++) {
    const p = params[i] || {};
    const key = String(p.key || "");
    if (!key) continue;
    const t = String(p.type || "");

    if (t === "ref-image" || t === "ref-video" || t === "ref-audio") {
      const arr = Array.isArray(byKey[key]) ? byKey[key].filter(Boolean) : [];
      if (!arr.length) continue;
      const urls = [];
      for (let k = 0; k < arr.length; k++) {
        const nm = key + "-" + (k + 1) + (t === "ref-video" ? ".mp4" : ".png");
        const raw = arr[k];
        const isRemote = /^https?:\/\//i.test(String(raw || ""));
        if (!isRemote) localCount++;
        urls.push(publicize ? await _wyToPublic(raw, nm) : (isRemote ? String(raw) : "https://pending-upload.invalid/" + nm));
      }
      const out = String(p.output || "");
      body[key] = out === "csv" ? urls.join(",") : (out === "array" ? urls : (urls[0] || ""));
      refCount += urls.length;
      continue;
    }

    if (t === "textarea" || t === "prompt" || key === "prompt") {
      body[key] = String(prompt || "");
      continue;
    }

    const raw = (e[key] !== undefined && e[key] !== null && e[key] !== "") ? e[key] : p.default;
    if (raw === undefined || raw === null || raw === "") continue;
    body[key] = raw;
  }
  return { body: body, refCount: refCount, localCount: localCount };
}

async function wyVideo(prompt, def, ex) {
  const t0 = Date.now();
  const opt = (ex && ex.__opts) || {};

  const built = await wyBuildBody(prompt, def, ex);
  const body = built.body;
  const refCount = built.refCount;

  if (!String(body.prompt || "").trim() && !refCount) {
    throw new Error("请先写一句描述（或挂一张参考素材）再生成视频");
  }

  console.info("[W5-route]", JSON.stringify({
    phase: "wy-video-submit", channel: "wy", model: String(def && def.id || ""),
    endpoint: String(def && def.endpoint || ""), refs: refCount,
    keys: Object.keys(body), ts: Date.now(),
  }));

  /* 提交：内部会跑宿主的 `normalizeAndValidateApiBody`（必填 / 各档互斥 / 本地地址三道校验）
     ⇒ 校验不过直接抛原文（如「首帧/尾帧与参考图/视频/音频不能同时使用」），**不吞**。 */
  const sub = await Api.submit(def, body);
  const taskId = String((sub && sub.id) || "");
  if (!taskId) throw new Error("速创未返回任务 ID · " + JSON.stringify(sub || {}).slice(0, 200));

  const detail = await pollWyTask(taskId, def, t0);
  const url = Api.extractUrl(detail) || "";
  if (!url) {
    throw new Error("速创任务完成但没有可播放的地址（任务 " + taskId + "）· "
      + JSON.stringify(detail || {}).slice(0, 220));
  }
  console.info("[W5-route]", JSON.stringify({
    phase: "wy-video-done", channel: "wy", model: String(def && def.id || ""),
    taskId: taskId, secs: Math.round((Date.now() - t0) / 1000), ts: Date.now(),
  }));
  return { assetUrl: url, candidates: [url], usage: (detail && detail.usage) || null };
}

/* ══════════ 轮询器：节奏与状态语义**逐字照 PollManager**（不另立一套）══════════
 *  · 节奏：CONFIG.POLL_PHASES（排队中 3s → 生成中 1.5s → 收尾中 2s），上限 CONFIG.POLL_TIMEOUT（30min）
 *  · 成功：`Number(status) === 2` 或 succeeded / success / completed
 *  · 失败：`Number(status) === 3` 或 failed / error
 *  ⚠ 超时**不撒谎**：如实说"任务可能仍在跑，稍后可在任务详情查看"（与宿主文案同向）。 */
async function pollWyTask(taskId, def, t0) {
  const timeoutMs = (typeof CONFIG !== "undefined" && CONFIG.POLL_TIMEOUT) || 18e5;
  const phases = (typeof CONFIG !== "undefined" && Array.isArray(CONFIG.POLL_PHASES) && CONFIG.POLL_PHASES.length)
    ? CONFIG.POLL_PHASES
    : [{ until: 3e4, interval: 3e3 }, { until: 18e4, interval: 1500 }, { until: 6e5, interval: 2e3 }];
  const intervalOf = function (elapsed) {
    for (let i = 0; i < phases.length; i++) if (elapsed < phases[i].until) return phases[i].interval;
    return phases[phases.length - 1].interval;
  };

  let last = null;
  for (let i = 0; ; i++) {
    const elapsed = Date.now() - t0;
    if (elapsed > timeoutMs) {
      throw new Error("速创视频轮询超时（>" + Math.round(timeoutMs / 1000) + "s，任务 " + taskId
        + "）—— 任务可能仍在跑，稍后可在任务详情查看");
    }
    await new Promise(function (r) { setTimeout(r, i === 0 ? 3000 : intervalOf(elapsed)); });
    last = await Api.queryDetail(taskId);
    const num = Number(last && last.status);
    const st = String((last && last.status) || "").toLowerCase();
    if (num === 2 || st === "succeeded" || st === "success" || st === "completed") return last;
    if (num === 3 || st === "failed" || st === "error") {
      throw new Error("速创视频生成失败（任务 " + taskId + "，模型 " + String(def && def.id || "") + "）："
        + String((last && (last.message || last.error || last.msg)) || "").slice(0, 200));
    }
  }
}

/* ══════ R42 · 速创视频适配器 end ══════ */

/* ══════ R34 · 视频桥（V2 · 由 _r34_video_host_bridge.js 拼入）══════ */
/** ★★ R34（2026-10-04）· 宿主侧：把视频链路暴露给编辑器 —— 独立源文件，
 *  由 `_gen-host-apiyi.mjs` 读入拼进产物最后一个 `<script>` 内。
 *
 *  ★★ R44（2026-10-05）三件事：
 *   ① **作用域闸**：`wyUploadDataUrl` 改经 `w5Need()` 取（它定义在 StudioEditor 的 IIFE 内，
 *      与本文不同一块 `<script>`；R42 裸调 = ReferenceError ⇒ 速创一挂参考素材就挂）。
 *   ② **折叠抽成 `_w5vShape()`**：核验与提交共用同一份形状转换（铁规矩 23：不抄两份）。
 *   ③ **新增 `validateVideoRequest(req)`**（修：「符合规范的方能提交 不符合的就弹出提醒」）：
 *      纯本地、**不出网**、不烧积分；编辑器点发送前先问它，不通过就不提交并列出原因。
 *
 *  ══════ 核验的两道闸（各管一段，不重复）══════
 *   第 1 道｜**提交前预检**（本文的 `validateVideoRequest`，编辑器可见、拦住提交）
 *      · 通用层（编辑器数据驱动）：必填缺 / 素材数超 `p.max` / 无任何输入
 *      · 速创层：**直接调宿主既有** `normalizeAndValidateApiBody`（IMPL-119/IMPL-152 那套
 *        互斥网 · 尾帧配首帧 · 本地地址拒收）——**素材换占位公网 URL**，因为此刻还没上传
 *      · APIYI 层：只放官方明文约束（VEO `input_reference` 单数 ⇒ 最多 1 张）
 *   第 2 道｜**桥的最后闸**（已转换后，防旁路）
 *      速创的 `Api.submit` 内部本就会再跑一次宿主校验器（拿到的是**已公网化**的 body）✓
 *
 *  ══════ 为什么核验不自己写一套规则 ══════
 *   宿主的 `normalizeAndValidateApiBody` 是**已经在运行的**真值（宿主自己的生成页就在用），
 *   而且**全局可见**（实测 `typeof === "function"`）。再写一份必然漂移 —— 尤其速创各档的
 *   互斥规则（可灵"用参考视频时声音必须 off"、Vidu 主体/图像/视频三者互斥、Google"图 vs 视频"）
 *   细节很多，抄不全就是下一个坑。
 *
 *  ══════ 形状（编辑器 → 适配器）══════
 *   · `apiyiVideo` / `wyVideo` 的签名是**宿主内部口径**（def = 模型定义、ex = 扩展参数）。
 *   · 编辑器契约是 `generate({modelId, model, prompt, refMode, extra, refs…})`
 *     （与位图动作的 bitmapHandlers 同构：编辑器不碰网络、只透传参数）。
 *   · 两者不同构 ⇒ 这里做一层**纯形状转换**，**不碰任何请求逻辑**。
 *
 *  ⚠ 铁规矩：不静默失败（R17）。宿主没接视频能力时抛**明确**错误，
 *    让编辑器把原因显示在面板上，而不是弹个 toast 让人以为还在生成。
 */

/* 小工具：**带 _w5v 前缀**防污染宿主全局（产物里可能有同名）。 */
const _w5vStr = function (v) { return typeof v === "string" ? v.trim() : ""; };
const _w5vArr = function (v) { return Array.isArray(v) ? v.filter(function (x) { return typeof x === "string" && x.trim(); }) : []; };

/* 素材公网化（dataURL / blob → R2 公网 URL；已是 http(s) 原样放行）。
   ⚠ 上传不了就**抛清楚原因**（R17）—— 绝不把 dataURL 当公网 URL 蒙过去。 */
const _w5vToPublic = async function (u, name) {
  const s = _w5vStr(u);
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  const up = w5Need("wyUploadDataUrl", "速创 / APIYI Wan 的参考素材要求公网 URL，本地素材必须先转存");
  if (/^data:/i.test(s)) return await up(s, name, "tmp");
  const resp = await fetch(s);
  const blob = await resp.blob();
  const dataUrl = await new Promise(function (ok, no) {
    const fr = new FileReader();
    fr.onload = function () { ok(String(fr.result || "")); };
    fr.onerror = function () { no(new Error("参考素材读取失败：" + name)); };
    fr.readAsDataURL(blob);
  });
  return await up(dataUrl, name, "tmp");
};
const _w5vMapPublic = async function (arr, prefix) {
  const out = [];
  const list = Array.isArray(arr) ? arr : [];
  for (let i = 0; i < list.length; i++) out.push(await _w5vToPublic(list[i], prefix + "-" + (i + 1) + ".png"));
  return out.filter(Boolean);
};

/** ★ 形状转换（**唯一一份**）：把编辑器请求折成适配器要的 def / ex / prompt
 *  + 语义桶 + byKey（**本地形态，未上传**）+ 校验用的现场信息。
 *  纯同步、不碰网络 —— 上传在 generate 里做（见 hostVideoGenerate），核验则完全不传。 */
function _w5vShape(req) {
  const q = req || {};
  const model = q.model || {};
  const modelId = String(q.modelId || model.id || "");
  const endpoint = String(model.endpoint || "");
  /* 通道判定：**endpoint 前缀是唯一真值**（不是名字、不是 channel 字段有没有写对） */
  const isWy = String(model.channel || "") === "wy" || endpoint.indexOf("/api/async/") === 0;
  /* 模型定义对象：适配器要的是 {id, modelId, label, params, endpoint} 这套形状。
     编辑器传下来的 `model` 是 catalog 条目（name/price/channel/params/endpoint…），
     这里只补 id/modelId/label，其余原样带过去（适配器要读 params / endpoint / billing）。 */
  const def = Object.assign({}, model, {
    id: modelId,
    modelId: String(model.modelId || modelId),
    label: model.label || model.name || modelId,
    endpoint: endpoint,
  });
  const paramsOf = Array.isArray(def.params) ? def.params : [];
  const typeOf = {};
  for (let i = 0; i < paramsOf.length; i++) typeOf[String(paramsOf[i].key)] = String(paramsOf[i].type || "");

  /* ── 参考素材：byKey（宿主 param key 原样）→ 语义桶 ──────────────────────
   * 语义桶供 APIYI 三家适配器用（它们的签名是 firstFrameUrl/imageUrls/… 这套）；
   * byKey 原样透传给速创适配器（它照 model.params 逐键组 body）。 */
  const refs = q.refs || {};
  const byKeyIn = (refs.byKey && typeof refs.byKey === "object" && !Array.isArray(refs.byKey)) ? refs.byKey : null;

  let firstFrameUrl = _w5vStr(refs.firstFrameDataUrl);
  let lastFrameUrl = _w5vStr(refs.lastFrameDataUrl);
  let imageUrls = _w5vArr(refs.imageDataUrls);
  let videoUrls = _w5vArr(refs.videoUrls);
  let audioUrls = _w5vArr(refs.audioUrls);
  const byKeyLocal = {};

  if (byKeyIn) {
    const cls = { first: [], last: [], image: [], video: [], audio: [] };
    Object.keys(byKeyIn).forEach(function (k) {
      const list = _w5vArr(byKeyIn[k]);
      if (!list.length) return;
      byKeyLocal[k] = list;
      const t = typeOf[k] || "";
      if (t === "ref-video") cls.video = cls.video.concat(list);
      else if (t === "ref-audio") cls.audio = cls.audio.concat(list);
      else if (/^(first|start)/i.test(k)) cls.first = cls.first.concat(list);
      else if (/^(last|end)/i.test(k)) cls.last = cls.last.concat(list);
      else cls.image = cls.image.concat(list);
    });
    if (cls.first.length) firstFrameUrl = cls.first[0];
    if (cls.last.length) lastFrameUrl = cls.last[0];
    imageUrls = cls.image;
    videoUrls = cls.video;
    audioUrls = cls.audio;
  }

  /* 兼容老调用方：只给 sourceNodeId / srcDataUrl（R33 形态） */
  if (!firstFrameUrl && !lastFrameUrl && !imageUrls.length && typeof q.srcDataUrl === "string") {
    firstFrameUrl = _w5vStr(q.srcDataUrl);
  }
  if (!imageUrls.length && Array.isArray(q.refDataUrls)) imageUrls = _w5vArr(q.refDataUrls);

  /* ── 扩展参数：取值序 = **顶层**（旧调用兼容）→ **extra**（编辑器面板参数，R40 补上）。
     ★★ R40（修「你能确定模型和功能都能的对的上吗」）——编辑器 submit 把面板参数装在
       `extra` 里，而 R34 起本桥只读顶层 q.duration/q.ratio/… ⇒ **参数整包丢失**（真机取证：
       面板选 1080p，适配器实收 720p；Seedance duration 恒 -1）。
     ★ R42：速创档的参数名与 APIYI 完全不同（`sound` / `bgm` / `watermark` / `size` /
       `prompt_extend` …）⇒ 顶层/extra **逐个键都取出来**，不再只挑固定的几个。*/
  const exq = (q.extra && typeof q.extra === "object" && !Array.isArray(q.extra)) ? q.extra : {};
  const pick = function () {
    for (let i = 0; i < arguments.length; i++) {
      const v = arguments[i];
      if (v !== undefined && v !== null && v !== "") return v;
    }
    return undefined;
  };
  const ex = {};
  Object.keys(exq).forEach(function (k) { ex[k] = exq[k]; });
  /* 顶层字段覆盖（旧调用方）+ VEO 的 seconds → duration 并轨（官方字段名不同） */
  const durRaw = pick(q.duration, ex.duration, ex.seconds);
  const durNum = Number(durRaw);
  if (durRaw !== undefined && isFinite(durNum)) ex.duration = durNum;
  if (ex.seconds === undefined && durRaw !== undefined && isFinite(durNum)) ex.seconds = durRaw;
  ["ratio", "resolution", "generate_audio", "audio", "prompt_extend", "watermark", "seed"].forEach(function (k) {
    const v = pick(q[k], ex[k]);
    if (v !== undefined) ex[k] = v;
  });
  ex.wantAudio = !!pick(q.wantAudio, ex.wantAudio);

  const prompt = String(q.prompt || "");
  const materialCount = (firstFrameUrl ? 1 : 0) + (lastFrameUrl ? 1 : 0)
    + imageUrls.length + videoUrls.length + audioUrls.length;

  return {
    q: q, refs: refs, def: def, modelId: modelId, endpoint: endpoint, isWy: isWy,
    paramsOf: paramsOf, typeOf: typeOf, prompt: prompt, ex: ex, exq: exq,
    buckets: { firstFrameUrl: firstFrameUrl, lastFrameUrl: lastFrameUrl, imageUrls: imageUrls, videoUrls: videoUrls, audioUrls: audioUrls },
    byKeyLocal: byKeyLocal, materialCount: materialCount,
  };
}

/* ══════════════════════════════════════════════════════════════════════════════
   ★★ R44 · 提交前核验（纯本地 / 不出网 / 不烧积分）
   ──────────────────────────────────────────────────────────────────────────────
   规则来源（**都不自造**）：
     · 通用层：编辑器 catalog 里的 `params[].required` / `params[].max` / `output`
     · 速创层：宿主既有 `normalizeAndValidateApiBody`（互斥 · 尾帧配首帧 · 上限 · 本地地址）
     · APIYI 层：官方文档明文（VEO `input_reference` 单数且仅 1 张）
   返回：{ ok, errors: [{ level: "error"|"warn"|"auto", message, key, label }] }
     · error → 拦住提交并弹提醒；warn → 只提醒；auto → 已被我们自动收敛（提示用）
   ══════════════════════════════════════════════════════════════════════════════ */
/* ★ R68（2026-10-06 P0 热修）：视频块的两个函数也要给主块用 ——
   apiyiVideo（三家 submit-and-poll 全流程）/ _w5vShape（参考素材语义桶，纯同步不出网）。
   与块 ② 同理：跨 script 块裸调 = ReferenceError。 */
window.__w5Host = Object.assign(window.__w5Host || {}, {
  apiyiVideo: apiyiVideo,
  w5vShape: _w5vShape,
});
async function validateVideoRequest(req) {
  const errors = [];
  const add = function (level, message, key, label) {
    errors.push({ level: level, message: String(message), key: String(key || ""), label: String(label || "") });
  };

  let F;
  try {
    F = _w5vShape(req);
  } catch (e) {
    return { ok: false, errors: [{ level: "error", message: "请求形状不合法：" + String((e && e.message) || e), key: "", label: "" }] };
  }

  if (!F.modelId) add("error", "没有指定视频模型", "", "");

  /* ① 通用：一个输入都没有（提示词空 + 素材空） */
  if (!F.prompt.trim() && !F.materialCount) {
    add("error", "先写一句描述（或挂一张参考素材）再生成", "", "");
  }

  /* ② 通用：必填参数（宿主 catalog 的 required 标记，不是我们猜的） */
  for (let i = 0; i < F.paramsOf.length; i++) {
    const p = F.paramsOf[i] || {};
    if (!p.required) continue;
    const key = String(p.key || "");
    const t = String(p.type || "");
    const isRef = (t === "ref-image" || t === "ref-video" || t === "ref-audio");
    let has = false;
    if (isRef) has = Array.isArray(F.byKeyLocal[key]) && F.byKeyLocal[key].length > 0;
    else if (t === "textarea" || t === "prompt" || key === "prompt") has = !!F.prompt.trim();
    else has = (F.ex[key] !== undefined && F.ex[key] !== null && F.ex[key] !== "");
    if (!has) add("error", "缺少必填：" + (p.label || key), key, p.label || key);
  }

  /* ③ 通用：参考素材数量上限（`p.max`；`output:"single"` 缺省按 1 张算） */
  for (let i = 0; i < F.paramsOf.length; i++) {
    const p = F.paramsOf[i] || {};
    const t = String(p.type || "");
    if (!(t === "ref-image" || t === "ref-video" || t === "ref-audio")) continue;
    const key = String(p.key || "");
    const arr = Array.isArray(F.byKeyLocal[key]) ? F.byKeyLocal[key] : [];
    const cap = Number(p.max) > 0 ? Number(p.max) : (String(p.output || "") === "single" ? 1 : 0);
    if (cap > 0 && arr.length > cap) {
      add("error", (p.label || key) + "最多 " + cap + " 个（当前 " + arr.length + " 个）", key, p.label || key);
    }
  }

  /* ④ 速创档：交给宿主既有校验器 —— 它的规则最全（互斥网 / 尾帧配对 / 上限 / 本地地址）。
     ⚠ 素材此刻还是本地数据 ⇒ `publicize:false` 让 wyBuildBody 用**占位公网 URL**，
       这样"本地地址拒收"那条不会误报，而结构类规则照样生效。**不上传、不出网**。 */
  if (F.isWy) {
    try {
      /* ⚠★ 必须把 byKey 经 `__opts` 交给 wyBuildBody —— 它按 `e.__opts.byKey` 取素材
         （`_w5vShape` 只把它放在自己的字段里，没塞进 ex）。首版漏了这步 ⇒ 组出来的 body
         是空的 ⇒ 宿主校验器"看不到任何素材" ⇒ **互斥规则全部形同虚设**
         （实测：wan3 首帧+参考图同给、尾帧缺首帧、vidu 三者互斥…全部 ok=true 放行）。
         这正是"核验功能必须真机跑"的价值 —— 静态看一眼是看不出来的。 */
      const exForCheck = Object.assign({}, F.ex, {
        __opts: { byKey: F.byKeyLocal, taskType: F.refs.taskType || "" },
      });
      const built = await wyBuildBody(F.prompt, F.def, exForCheck, { publicize: false });
      const nv = normalizeAndValidateApiBody(F.def, built.body);
      if (!nv || !nv.ok) add("error", String((nv && nv.error) || "不符合该模型的提交规范"), "", "");
    } catch (e) {
      add("error", "速创规范校验失败：" + String((e && e.message) || e), "", "");
    }
  }

  /* ⑤ APIYI：只放**官方文档明文**的约束（没依据的不自造，避免误拦） */
  const isVeo = !F.isWy && /veo/i.test(F.modelId);
  if (isVeo) {
    if (F.materialCount > 1) {
      add("error", "VEO 官方 `input_reference` 是**单数**、只能 1 张参考图（当前 " + F.materialCount + " 张）", "first_frame", "参考图");
    }
    if (F.materialCount === 0) {
      add("warn", "VEO 官方图生视频文档把 `input_reference` 列为**必填** —— 没给参考图可能被上游拒", "", "");
    }
  }

  const hasError = errors.some(function (e) { return e.level === "error"; });
  return { ok: !hasError, errors: errors };
}

/** 生成器（编辑器 `videoHandlers.generate` 用它）。 */
function makeVideoHandler() {
  return async function hostVideoGenerate(req) {
    const F = _w5vShape(req);
    if (!F.modelId) throw new Error("没有指定视频模型");
    if (F.isWy) {
      if (typeof wyVideo !== "function") {
        throw new Error("宿主未加载速创视频适配器（wyVideo 未定义）—— 请刷新页面重试");
      }
    } else if (typeof apiyiVideo !== "function") {
      throw new Error("宿主未加载视频适配器（apiyiVideo 未定义）—— 请刷新页面重试");
    }

    let firstFrameUrl = F.buckets.firstFrameUrl;
    let lastFrameUrl = F.buckets.lastFrameUrl;
    let imageUrls = F.buckets.imageUrls;
    let videoUrls = F.buckets.videoUrls;
    let audioUrls = F.buckets.audioUrls;
    let byKey = F.byKeyLocal;

    /* ── 素材公网化（四档策略）─────────────────────────────────────────────
     *  · 速创全档：上游只收 URL，且宿主校验直接拒 `blob:/data:` ⇒ 适配器自己传（按 param key，语义最准）
     *  · APIYI Wan：官方 `media[].url` 要求「公网可直接 GET 的 https」⇒ 全量传
     *  · APIYI Seedance：**图片保持 dataURL**（官方明确收 Base64，省一次往返）；
     *    视频/音频传（官方未明确支持内联，且原文警告大素材内联会拖慢/超时）
     *  · APIYI VEO：**一律不传**（官方只收文件/Base64、**不收远程 URL**，走 dataUrlToFile） */
    const isApiyiWan = !F.isWy && /wan/i.test(F.modelId);
    const isVeo = !F.isWy && /veo/i.test(F.modelId);
    try {
      if (F.isWy) {
        /* 速创：适配器自己传 ⇒ 桥不重复上传（byKey 原样带下去）。 */
      } else if (isApiyiWan) {
        firstFrameUrl = firstFrameUrl ? await _w5vToPublic(firstFrameUrl, "first-frame") : "";
        lastFrameUrl = lastFrameUrl ? await _w5vToPublic(lastFrameUrl, "last-frame") : "";
        imageUrls = await _w5vMapPublic(imageUrls, "ref-image");
        videoUrls = await _w5vMapPublic(videoUrls, "ref-video");
        audioUrls = await _w5vMapPublic(audioUrls, "ref-audio");
        byKey = {};   /* Wan 分支不读 byKey ⇒ 避免带着未上传的本地数据往下走（防误用） */
      } else if (!isVeo) {
        videoUrls = await _w5vMapPublic(videoUrls, "ref-video");
        audioUrls = await _w5vMapPublic(audioUrls, "ref-audio");
      }
    } catch (err) {
      throw new Error("参考素材上传失败：" + String((err && err.message) || err));
    }

    const opt = {
      firstFrameUrl: firstFrameUrl,
      lastFrameUrl: lastFrameUrl,
      imageUrls: imageUrls,
      videoUrls: videoUrls,
      audioUrls: audioUrls,
      taskType: F.refs.taskType || "",
      byKey: byKey,                       /* ★ R42：速创适配器按宿主 param key 组 body */
    };
    const ex = Object.assign({}, F.ex);
    ex.__opts = opt;

    const r = F.isWy
      ? await wyVideo(F.prompt, F.def, ex)
      : await apiyiVideo(F.prompt, F.def, ex);
    const url = (r && (r.assetUrl || (r.candidates && r.candidates[0]))) || "";
    if (!url) throw new Error("视频生成完成但没有可播放的地址");
    /* 返回编辑器要的形状。**不编造** durationMs / 宽高 ——
       编辑器拿不到就留 0，由播放器读到 loadedmetadata 后自行修正。 */
    return {
      url: String(url),
      posterUrl: (r && r.posterUrl) || "",
      durationMs: Number((r && r.durationMs) || 0) || 0,
      width: 0,
      height: 0,
      naturalWidth: 0,
      naturalHeight: 0,
      name: F.def.label,
    };
  };
}

/* ══════ R34 · 视频桥 end ══════ */
