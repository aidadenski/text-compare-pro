# 花叔（X: @AlchainHust / GitHub: alchaincyf）最近开源了什么 Skill

> 调研时间：2026-10-07（UTC） · 调研方式：GitHub API 全仓库扫描 + 他的 X 时间线（Nitter RSS）+ 公众号原文 + 第三方仓库/PR 交叉验证

---

## 0. 一句话结论

截至 2026-10-07，X 博主 **花叔（@AlchainHust，65.7k 粉丝；GitHub: alchaincyf）最近开源的是 `huashu-art-motion`（艺术动画 skill）** —— 2026-10-06 首次公开发布（v1.0.0），MIT 协议，**发布一天多就 ~1,472 stars / 174 forks**，当天冲上 GitHub 趋势榜（October 07, 2026 日榜第 7 位）。

它让 Claude Code / Codex / Cursor 这类 coding agent **用代码把画"动"起来**：35 种艺术风格 + 9 种解说动画语法，把口播做成白板 / Vox / 3b1b / Kurzgesagt 式的解说动画。

在此之前的 1 个月里，他还连续开源了 `huashu-flash`（闪电.skill）、`huashu-chrome`、`huashu-slide-doubao`/`huashu-slide-codex`、`huashu-report`、`huashu-excel`、`huashu-mac-use`、`darwin-skill` 等（详见第 3 节）。

---

## 1. 最新开源：huashu-art-motion（艺术动画 skill）

| 项目 | 内容 |
|---|---|
| 仓库 | https://github.com/alchaincyf/huashu-art-motion |
| 中文名 | 艺术动画 skill |
| 一句话简介 | 35 种艺术风格、9 种解说语法，用代码让画动起来 |
| 首次公开 | **2026-10-06 04:48 UTC**（首次提交 *Initial public release*）；仓库创建 04:49 UTC |
| Release | **v1.0.0**，2026-10-06 05:38 UTC（附 35 风格无声样片 MP4） |
| 许可 | **MIT**（代码与文档；字体为 SIL OFL 1.1，捆绑笔顺数据保留 Arphic Public License，花叔角色素材仅限演示使用） |
| Stars / Forks | **★1,472 / 174 forks**（2026-10-07 17:00 UTC 抓取） |
| 规模 | 396 个文件；12 篇方法文档 + 35 张风格配方卡 + 9 张解说语法卡 + 完整动画引擎 |
| 适用 agent | Claude Code / Codex / Cursor 等任何支持 `SKILL.md` 的 agent |
| 安装 | `npx skills add alchaincyf/huashu-art-motion` |
| 依赖 | uv、ffmpeg、Playwright Chromium |
| 语言 | skill 内容为中文（README 有英文版） |

### 1.1 它能做什么

| 你说 | 它做 |
|---|---|
| 「复刻这个动画」「拆一下这段」 | 先跑拆解脚本量出转场、节拍网格、每段运动热图，再按机制用代码复刻 |
| 「做个梵高／莫奈／包豪斯那种的动画」 | 先设计一帧，再让它动起来；35 张风格配方卡当起点 |
| 「用我的口播做一段艺术动画」 | 镜头表 → 定风格 → 世界画布加镜头 → 输出画面轨 |
| 「做一个人穿过一幅幅名画的片子」 | 长卷骨架：每个世界一个段文件，主角一路往右走，跨边界换画风，镜头只进不退 |
| 「做解说视频的动画段」 | 按口播选语法，喂一份 JSON，出时长精确到帧的片段（横竖屏、可透明底 ProRes 4444） |
| 「画面里要有人」 | 人交给生图模型出帧（作者用 gpt-image / Codex ImageGen），代码负责合成、换帧、材质 |
| 「配个乐、卡节奏」 | BPM 网格、动机换乐器、结尾音效序列，纯代码合成（无采样） |

### 1.2 里面有什么（硬指标）

- **35 种艺术风格配方卡 + 35 个可运行场景代码**：从公元前 40000 年岩洞壁画 → 古埃及 → 希腊/罗马 → 哥特 → 文艺复兴 → 印象派 → 后印象派(梵高) → 新艺术 → 立体主义 → 包豪斯 → 波普 → 8-bit → 光线追踪 → 2026，以及水墨、克里姆特、蒙克、敦煌、草间弥生、构成主义、达利、霍珀、吉卜力、蒸汽波、漫威 Kirby、莫奈、修拉、马蒂斯、哈林、伦勃朗、橡皮管卡通、皮影、新海诚、毕加索蓝色时期。每张卡写明参数、母题动作、签名转场与**当前短板**。
- **9 种解说动画语法**（8 种带可运行示范片 + 参数化片段）：Kurzgesagt、Vox、白板(whiteboard)、storytime、动态文字、3Blue1Brown、发布会 UI、财经图表，第 9 种为讲解员式财经/科普。
- **17 个绘画与动画库**：笔刷、渲染器、后期、骨架、镜头、图表、排版等（`scripts/engine/lib/`）。
- **12 篇方法文档**（`references/01`–`12`）：拆解、五层机制、一帧先行四条路线、纯代码绘制、节奏与配乐、口播驱动、正面经验、风格作者规范、视频动画语法、角色、长卷穿越片、口播整片与经验回流。
- **工具链**：`breakdown.py` 把参考动画拆成"能写代码的地图"；`qa.py` 一键验收（稳定性/效率/动感/流畅度/文字框景）；`audio/` 纯代码合成配乐模板；`font_subset.py`、绿幕抠图等。
- **确定性**：所有随机用种子，同一时刻渲两次逐像素一致；交付前还有一个"没参与制作的 agent 只看成片挑问题"的独立审片环节。

### 1.3 安装

```bash
npx skills add alchaincyf/huashu-art-motion
# 或
git clone https://github.com/alchaincyf/huashu-art-motion.git ~/.claude/skills/huashu-art-motion
# 首次渲染前
uv run --with playwright playwright install chromium
```

### 1.4 由来（skill 里写的"背后的故事"）

2026 年 10 月初，他在 X 上看到 **Tak（@cherry_mx_reds）** 的 15 秒动画《Art History Speedrun》（少女＋猫穿越 4 万年艺术史，即所谓 "Fable 5.5" 一波里的爆款）。他让 Claude 复刻，第一版"图片之间做转场"被自己否掉，改成**先拆解（量转场、拟合节拍网格、看每段哪里在动）→ 再用代码一层层把画画出来并让它动**。做的时候他跟模型说"我们不只是为了复刻，我需要你积累经验"，于是沉淀下来的不只是代码，还有有效做法、每种风格的坑与短板。之后又派了 4 组只读 skill 的 agent 去做没见过的新风格、把轮子收成统一库，再加 8 种 YouTube 解说语法，接进他自己的口播视频管线。

---


### 1.5 传播与反响（证据）

- **X**：发布帖为一条 X Article，2026-10-06 05:50 UTC 发出，当天起他连发十多条演示（艺术穿越、超级玛丽、白板/Vox/讲解员版 SpaceX、达利/霍珀/马格利特、中英双语）。他自述该帖 **27 万+ 浏览、1000+ 赞、2300+ 收藏**（见其 10-07 公众号文章）。
- **公众号**：「huashu-art-motion发布！可能是最有审美的动画skill。」→ 次日《第一批用上huashu-art-motion的人，已经开始拿到结果了！》，**2.8 万+ 阅读、3700+ 分享**。
- **他自己的实战**：用该 skill 做的《1 分钟搞懂诺奖中微子研究》发抖音，**5 小时 10 万+ 播放**（当天晚些时候 17 万+），他称之为"短视频起号绝了"。
- **GitHub**：发布 12 小时 500★ → 1 天 1000+★ → 10-07 傍晚 1,472★，进入当日趋势榜（daily-trending-repo #573 列第 7 位）。
- **第三方装机/收录**（10-07 当天）：`sudosubin/agents.nix` 打包为 `agent-skills.github.alchaincyf.huashu-art-motion: init at 1.0.0`（pin 到 v1.0.0）；`indie-builder/agent-plugins#27` 收录；`litianyuan90-jack/awesome-claude-code#1` 跟踪；`ProSkillsMD/proskills#7751` 候选收录；第三方实测仓库 `Wyaofox/huashu-art-motion-test`。
- **用户作业 / 二次传播**：X 用户 @linke1427832 反馈"微调了一下，发了 1 个视频涨了快 50 个粉丝"；有转评称"好久没看到如此细腻温馨的画风了"。
- **第三方评价（X 搜索时间线，10-07）**：
  - 英文圈：「a coding-agent skill is trending hard: huashu-art-motion, 1.4k stars in about a day」。
  - 中文圈：「花叔又出新 Skill 了…10 月 6 日才建仓，已经 700 星」；「花叔最🐂🍺的 Skill 没有之一」——有人**全程本地模型**做了 60 秒视频：Qwen3.8-Flash-Next 125B 写 Canvas 动画代码 + CosyVoice2 克隆音色 + faster-whisper，有效总耗时 1 小时 35 分；也有「今日新鲜 Skills 精选 🆕 ⭐707 ｜增速 707/day」的榜单。
  - 日文圈：「10分で作った短い動画が3.14万再生」——有人专门写了用法总结（把口播原稿和时长交给它，让它配出对应动画）。
- **作者的后续承诺**：X 上说他到 **5000+ stars 时会大幅更新**——增加视觉风格，并让 GPT / 国产模型也能做出类似效果。

### 1.6 注意事项 / 边界

- 仓库**不含**原片（Tak 视频）的帧、截图或音频；配乐脚本为原创示例乐谱；真人/本人形象需自备角色图或给 agent 接生图能力。
- 第 9 种「讲解员式」语法只有语法卡 + 需自备角色的整片代码快照；口播整片示例是代码快照，不是开箱即渲的工程。
- 他自己的结论：目前效果 **Opus 5.5 明显最好**（他试过的包括 GPT-6 Astra），画风审美与运动自然度差距明显；因此该 skill 也成了他后续测新模型的主要场景之一。

---

## 2. 关键时间线（2026-10-06 → 10-07）

| 时间 (UTC) | 事件 |
|---|---|
| 10-06 04:48–04:49 | 仓库创建，首次提交 `Initial public release` |
| 10-06 05:38 | Release **v1.0.0** 发布（附 35 风格样片 MP4） |
| 10-06 05:50 | X 发布长文《huashu-art-motion发布！可能是最有审美的动画skill。》 |
| 10-06 06:00 | 中文帖：「把昨天提到的动画skill开源发布了…能做 80 分的商业级视频了」 |
| 10-06 08:03 | 「用我刚刚开源的 huashu-art-motion skill 做了个打超级玛丽的视频」 |
| 10-06 08:14–14:14 | 陆续放出讲解员版 SpaceX、敦煌→水墨→哥特、达利/霍珀/波普/马格利特、白板解说等演示 |
| 10-06 15:58–15:59 | 「为什么我敢说已经到商业级 80 分水平」+ 抖音 10 万+ 播放 + 开源地址 |
| 10-06 17:12 | 「发布 12 小时后已经 500 stars」 |
| 10-07 07:19 | 登上 GitHub 当日趋势榜（899★） |
| 10-07 08:34–09:06 | 「怎么还有人问我开源地址」→「发布一天，已经 1000+ ★」 |
| 10-07 08:58 | 第二篇 X Article / 公众号《第一批用上…已经开始拿到结果了！》 |
| 10-07 12:57 | 又用它做了诺奖化学奖介绍视频；提及额度受限，GPT-6 Astra 只能到 80% 效果 |
| 10-07 17:00 | ★1,472 / 174 forks（本次抓取） |

---

## 3. 往前看：他"最近"（近一个月）还开源了哪些 skill

按仓库创建时间倒序（stars 为 2026-10-07 抓取值）：

| 开源日期 | Skill | ★ | 干什么的 |
|---|---|---|---|
| **2026-10-06** | **huashu-art-motion** 艺术动画 | 1,472 | 35 艺术风格 + 9 解说语法，用代码让画动起来 |
| 2026-09-24 | huashu-flash 闪电.skill | 95 | 照 Anthropic"两周把 claude.ai 提速 3 倍"的方法给你的网站提速：先量、再证、后爬，棘轮锁住只许变好 |
| 2026-08-26（9-26 更新） | huashu-chrome | 265 | 让任何 agent 操控你自己的 Chrome（带全部登录态），MCP + Chrome 扩展，22 个工具 |
| 2026-09-22 | huashu-slide-doubao / huashu-slide-codex | 14 / 23 | 豆包 / Codex 环境专用视觉物料生产（slides + 公众号封面 + 视频封面，走内置 image_gen 零 API 费用） |
| 2026-09-18 | darwin-skill 达尔文.skill | 6,197 | 让 skill 无限进化：评估→改进→测试→保留或回滚（棘轮机制，git 留痕） |
| 2026-09-18 | huashu-gpt-image | 20 | GPT-image 的 prompt 工程方法论 |
| 2026-09-15 | huashu-excel | 429 | 数据分析与 Excel 全流程：体检脏表→清洗→对齐需求→分析→对账→交付 |
| 2026-09-13 | 3d-vibe-coding-handbook | 273 | 《3D Vibe Coding 手册》配套仓库（非 skill） |
| 2026-09-06 | huashu-mac-use | 296 | 让 agent 操控 Mac 上没有 API 的原生 app，读后台、写不打扰、每步留取证 |
| 2026-08-31 | huashu-report | 441 | 机构级研究报告：42 份顶级机构报告反推规范 + 六种报告原型 + 8 种图表模式 |

再往前的代表作（长期霸榜）：`huashu-design`（HTML 原生设计 skill，★24,649）、`zhangxuefeng-skill`（张雪峰.skill，★10,408）、`nuwa-skill`（女娲.skill，蒸馏任何人思维方式）、`x-mentor-skill`（X 导师，★1,243）。

---

## 4. 他的 Skill 全景：总目录仓库

- 仓库：https://github.com/alchaincyf/huashu-skills （★1,671，**最后更新 2026-09-22**）
- 定位：花叔全部开源 Agent Skills 总目录，三层共 **52–53 个**：18 个旗舰 skill（独立仓库）+ 14 个人物视角 skill（女娲蒸馏）+ 22 个内置轻量 skill
- 亮点：机器可读目录 `skills.json`、给 AI agent 的安装协议、`huashu-skill-updater` 更新检查机制（30 天自检、`.huashu-skill-meta.json` 留痕）
- ⚠️ **注意：该总目录尚未收录 10-06 发布的 huashu-art-motion**（其最后 push 早于发布日），所以"从总目录里找最新 skill"会漏掉它。
- 三个"不是 skill"的仓库：`huashu-doubao-search`（MCP server）、`fanbox`（桌面 App）、橙皮书系列（免费电子书）。

---

## 5. 主要证据来源

- GitHub API：`/users/alchaincyf/repos?sort=created|pushed`、`/repos/alchaincyf/huashu-art-motion`（+ `/commits`、`/releases`、`/git/trees/main?recursive=1`）、`/repos/alchaincyf/huashu-skills`
- X 时间线（Nitter RSS 镜像 `nitter.kareem.one/AlchainHust/rss` 与 `search/rss`），发布帖 ID `2107347834668224687` 等；互动数交叉核对 `cdn.syndication.twimg.com/tweet-result`
- 公众号原文：https://mp.weixin.qq.com/s/iViOvBLlH0gfxE2z_GoiCQ （《huashu-art-motion发布！可能是最有审美的动画skill。》）
- 其官网作品页 https://www.huasheng.ai/ 与 GitHub Profile README（github.com/alchaincyf）
- 第三方交叉证据：`szwnba/affweb#812`（转载其 10-07 公众号文章，含"27 万浏览/1000+ 赞/2300+ 收藏""800 star/110 fork"等原文数据）、`marc-ko/daily-trending-repo#573`、`gtdbook/self-ops#2`、`sudosubin/agents.nix#43060`、`indie-builder/agent-plugins#27`、`Wyaofox/huashu-art-motion-test`

## 6. 独立复核（对抗性验证）

另起一个独立 agent 做了"尽力证伪"的复核（2026-10-07 ~17:00 UTC），结论：**未发现任何比 huashu-art-motion 更新的花叔开源 skill，主结论 CONFIRMED**。

- 全量枚举其 88 个公开仓库（按创建、按 push 双向排序）：最新创建 = huashu-art-motion（2026-10-06T04:49:37Z）。
- 其最后一次 push 之后唯一有动静的仓库是 `alchaincyf/alchaincyf`（Profile README，10-07 13:17 仅是徽章刷新），非 skill。
- `huashu-skills` 总目录：README 无 art-motion 匹配；`skills.json` 的 `updated` 停在 2026-09-06（54 条），仓库最后 push 2026-09-22 —— **连 9-24 的 huashu-flash 也没收录**，属于已知滞后。
- 发布时间的三种独立验证：仓库创建 10-06 04:49:37Z / 首次提交 `Initial public release` 04:48:47Z / Release v1.0.0 05:38:30Z / 首条预告推文 05:50–06:07Z。
- 第三方在 10-07 的证据齐备：10 条相关 issue/PR、GitHub 当日趋势榜、第三方实测仓库。
- 遗留缺口（低风险）：gist 列表接口被权限挡住（无法 100% 排除"某个 skill 只发了 gist"）；X 检索每次最多 20 条，10-07 14:03 UTC 之后若有新推未覆盖，但 GitHub 侧无任何新动作迹象。

原始抓取证据保存在 `research/raw/`（Nitter RSS 时间线 XML、gists 页面 HTML）。

## 7. 尚存不确定项

1. **X 帖原始互动数**（27 万浏览 / 1000+ 赞 / 2300+ 收藏）来自他本人在公众号里的自述，未能从 X 官方接口独立复核（沙箱内 x.com 不可直接抓取，仅能通过 RSS/镜像间接验证发布时间与文案）。
2. GitHub stars 仍在快速上涨，本报告数字为 **2026-10-07 17:00 UTC** 快照，每小时都在变。
3. `huashu-skills` 总目录、`huashu-skills/skills.json` 与个人 Profile README 都还没更新到 art-motion（预计后续会补）。
