# 实施进度、验证证据与断点续跑记录

版本：0.1；起始日期：2026-10-11；维护方式：每个工作阶段结束后更新本文件，
记录真实状态、可复核证据、未完成项和下次续跑入口。mock/编译成功不等于平台验收通过；
未验证项一律如实标注。

## 1. 当前状态总览

| 领域 | 状态 | 证据/说明 |
| --- | --- | --- |
| 仓库初始化 | 已完成 | 本地 Git 仓库 G:/开发测试/Projects/SproutCrossPlatform，main 分支；2026-10-11 按用户命名规则由 EnglishCheckInCrossPlatform 改名（后端为 SproutApi） |
| 文档分发 | 已完成 | docs/planning 5 份 + docs/standards 2 份，链接已重写；版本/哈希见 docs/DOCUMENT-SNAPSHOTS.md |
| 根 README/AGENTS | 已完成 | AGENTS.md 由跨端模板1.0映射，行数 <200 |
| uni-app x 工程骨架 | 已建立（未编译） | manifest.json/pages.json/main.uts/App.uvue + 8 个页面骨架；HBuilderX 缺失，编译未验证 |
| 主题系统（十套） | 源码完成（未编译） | theme/ThemeTypes.uts + ThemeTokens.uts + ThemeStore.uts；99 个色值字面量与项目规范第6节逐一核对一致（脚本比对，无多出/缺失）；UI 实际渲染未验证 |
| 共用组件 | 源码完成（未编译） | components/ 十类：AppButton/AppCard/AppDialog/AppToast/AppInput/AppList/RecorderPanel/FeedbackCard/CalendarGrid/RewardCard；全部经 theme props 消费 ResolvedTheme，无硬编码颜色 |
| 网络层 | 骨架完成（未联调） | services/：ClientContextProvider（X-Client-* headers、uniAppX/平台枚举、契约版本）、RequestClient（统一注入、幂等键、非 JSON 降级、预签名下载不带凭据）；不定义业务端点，待契约冻结 |
| 本地存储与离线 | 源码完成（未运行） | storage/：SyncQueue（按账号隔离、稳定 UUID、重试不新建条目）、DraftStore（草稿 + 服务端已确认 Plan 离线缓存，无缓存不承诺离线打卡） |
| 平台 adapter | 源码完成（未编译） | platform/：RecorderAdapter 契约+工厂、UniRecorderAdapter（小程序/Android/鸿蒙）、WebRecorderAdapter（MediaRecorder 单独实现）、PermissionAdapter、FileAdapter（临时录音转存）、AudioPlayerAdapter；均标注逐端实测要求 |
| 业务用例 features/ | 源码完成（未运行） | PracticeSession（计划加载/逐题录音/草稿/完成入队，评测不是打卡前提）、SyncEngine（仅调 EC-API-0.1 已定义端点，未联调）、DemoFixtures（原创演示小样，明确标注不冒充课本） |
| 页面组合 | 8 页全部接线（未运行） | 今日三入口（新课须家长确认）、练习页全流程、完成页离线暂存提示、主题设置完整功能；日历（本机待确认事实+今天标识，连续链留给服务端）、收藏馆（演示层级展示）、家长管理（待接入项如实标注）、记录详情（本机草稿枚举+回放，删除说明） |
| 四端验证 | 未开始 | 见第3节平台矩阵 |

## 2. 工具链现状与限制

| 工具 | 实测结果（2026-10-11） | 影响与补救 |
| --- | --- | --- |
| Node.js | v24.18.0 可用（C:\Program Files\nodejs） | 可用于脚本与依赖管理 |
| Git | 2.46.0.windows.1 可用 | 本地仓库正常 |
| HBuilderX | ✅ 5.26.2026091802 便携版（Tools/HBuilderX），cli.exe 可用；运行配置已写入 DevEco/微信开发者工具路径 | uni-app x 无独立 CLI 脚手架；鸿蒙编译需 ASCII 工程路径（镜像到 G:\HarmonyBuilds\SproutCrossPlatform） |
| 微信开发者工具 | ✅ 2.01.2510260 已安装（Tools/WechatDevtools/app），游客模式，服务端口 50530 已开 | 真机预览/发布需注册小程序 AppID（manifest mp-weixin.appid 待填） |
| DevEco Studio | ✅ 26.0.0.851 已装至 G:\DevEcoStudio（安装器拒中文路径，工作区外 ASCII 为例外） | 鸿蒙运行需模拟器/真机与签名证书 |
| 微信开发者工具 | 未核对 | 小程序预览/真机验证需要 |
| Android SDK / 鸿蒙 DevEco | 未核对 | Android 与原生 HarmonyOS NEXT 验证需要；鸿蒙须独立验证，APK 不作证据 |

工具链缺失期间继续推进可验证部分：工程结构、主题 tokens、组件与 adapter 源码、
离线/存储流程的静态实现与可运行的纯逻辑测试（Node 环境）。

## 3. 四端验证矩阵

| 平台 | 编译 | 运行/录音 | 权限/文件 | 登录 | 离线/主题/布局 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| 微信小程序 | ✅ 编译通过（HBuilderX 5.26，8页面+10组件，样式隔离2.0） | ✅ 模拟器运行已验：今日/练习页渲染、tabBar、路由、跳过流程（moveNext 生效）；页面 theme 需 data 初始化（onShow 过晚已修复） | 录音点击无状态变化：模拟器无麦克风授权弹窗，疑模拟器限制；真机待验 | N/A | 未验 | 微信开发者工具 2.01.2510260 游客模式；证据 mp-*.png；录音错误已补呈现（不再静默回 idle） |
| Web | ✅ 编译通过（HBuilderX 5.26.2026091802，uni-app x VDOM） | ✅ 运行已验：8 页渲染、路由、tabBar、主题即时切换与设备持久化（晴空蓝/午夜晴空两态截图）、MediaRecorder 录音启动+真实计时+recording.active 明/暗配色、离线队列真实入队（草稿 demo-repeat-1 queued 在记录详情可见） | 浏览器麦克风授权成功 | N/A（登录未定） | 主题切换/离线队列已验 | 截图 docs/progress/evidence/web-*.png；录音激活时自动化点击派发超时（工具限制，页面 JS 正常），停止/回放/提交待人工复验 |
| Android | ✅ Kotlin 编译通过（HBuilderX 5.26，VDOM，compile-only） | 未验证（无设备/模拟器） | 未验证 | 未验证 | 未验证 | 编译期修复9处真实跨端问题（UTS类型/API差异）；运行需 Android 设备 |
| HarmonyOS NEXT（原生） | ✅ 原生鸿蒙编译链通过（2026-10-12）：uni-app x 编译→鸿蒙工程生成→依赖安装→entry-default-unsigned.hap（15.8MB）制作成功，DevEco 26.0.0.851 | 未验证（无鸿蒙设备/模拟器） | 未验证 | 未验证 | 未验证 | 中文路径限制：鸿蒙工具链不接受中文工程路径，经 G:\HarmonyBuilds ASCII 镜像编译（证据 harmony-compile-3.log）；运行需鸿蒙模拟器/真机+签名 |

## 4. 契约与接口边界

- 唯一接口定义：docs/planning/TechnicalDesign.md 第5节 EC-API-0.1；冻结缺口见第5.6节
  与 DocumentationAudit.md 第3节。冻结前不实现依赖未定接口的远端调用，网络层只做
  RequestClient 骨架与 headers 注入（X-Client-Type/Platform、X-App-Version/Build、
  X-Contract-Version、Idempotency-Key 等），baseUrl 由配置注入。
- 前端先行范围：界面、录音、回放、本地存储、草稿与待同步离线流程；使用明确标注的
  本地假数据/fixture，不冒充服务端响应。

## 4.1 可重复验证证据（Node 环境）

| 验证 | 命令 | 最近结果（2026-10-11） |
| --- | --- | --- |
| 主题色值与规范第6节一致性 + WCAG 对比度 | node tests/verify-theme-tokens.mjs | PASS：10 套主题、310 项对比度断言、实现 66 色 = 规范 66 色（无多出/缺失） |
| 手写文本编码/空白规范 | node tests/verify-text-hygiene.mjs | PASS：全部手写文件 UTF-8 无 BOM / LF / 无 tab / 无行尾空格 / 末尾单换行 |

说明：以上为文本/数学核验，不代替四端编译、UI、读屏或设备验收。

## 5. 未完成项清单

1. HBuilderX/CLI 安装与固定版本、编译模式核对。
2. 四端逐一编译与运行验证（第3节矩阵）。
3. 主题十套在真实界面逐端核对（弹层同步、动态字号、减少动态效果）；Web 已验晴空蓝/午夜晴空切换。
4. 微信开发者工具安装后做小程序运行/录音/权限验证；Android 设备或模拟器做运行验证；DevEco Studio + 鸿蒙设备做原生鸿蒙验证。
5. Web 录音停止/回放/提交复验：自动化工具在 MediaRecorder 激活时点击派发超时（工具限制，页面 JS 正常），需人工或驱动级工具复验。
6. 编码门禁流水线（formatter→空行归一→custom checker→lint/测试）未实现，当前为人工遵守。
7. 后端联调（依赖 EC-API-0.1 冻结与后端仓库）。

## 6. 断点续跑

- 上次完成：features 业务用例层与核心页面接线（今日/练习/完成/主题设置），
  演示 fixture 全流程可走通（未编译运行）。
- 下次入口：安装 HBuilderX 固定版本后逐端编译验证（第3节矩阵）；随后补
  日历/收藏馆/家长/记录详情页与后端联调（依赖契约冻结）。
- 续跑前先读 AGENTS.md 阅读顺序与本文件第5节未完成项。
- 待核对：manifest.json 平台段键名（app/app-harmony/h5）需对照所装 HBuilderX 版本
  校验；pages.json tabBar 为静态默认 SkyLight 配色，运行时主题只覆盖页面内容，
  小程序 tabBar 动态换肤能力需在验证阶段确认。
