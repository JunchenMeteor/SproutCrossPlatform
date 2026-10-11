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
| HBuilderX | ✅ 5.26.2026091802 便携版已部署于 Tools/HBuilderX（官方 release.json 校验，89.56MB zip 字节数一致）；cli.exe 可用 | uni-app x 无独立 CLI 脚手架（官方问答 2026-09 确认仅 HBuilderX）；已通过 cli project open 导入本仓库 |
| 微信开发者工具 | 未核对 | 小程序预览/真机验证需要 |
| Android SDK / 鸿蒙 DevEco | 未核对 | Android 与原生 HarmonyOS NEXT 验证需要；鸿蒙须独立验证，APK 不作证据 |

工具链缺失期间继续推进可验证部分：工程结构、主题 tokens、组件与 adapter 源码、
离线/存储流程的静态实现与可运行的纯逻辑测试（Node 环境）。

## 3. 四端验证矩阵

| 平台 | 编译 | 运行/录音 | 权限/文件 | 登录 | 离线/主题/布局 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| 微信小程序 | 未验证 | 未验证 | 未验证 | 未验证 | 未验证 | HBuilderX 5.26 已就绪，待编译 |
| Web | ✅ 编译通过（HBuilderX 5.26.2026091802，uni-app x VDOM） | ✅ 运行+录音开始已验：页面渲染、路由、tabBar、主题即时切换（晴空蓝→午夜晴空）、MediaRecorder 录音启动与真实计时、recording.active 配色生效 | 浏览器麦克风授权成功 | N/A（登录未定） | 主题切换/离线切换已验 | 截图证据 docs/progress/evidence/web-*.png；录音激活后自动化点击超时（工具限制），停止/回放/提交待人工或他法复验 |
| Android | 未验证 | 未验证 | 未验证 | 未验证 | 未验证 | 工具链缺失 |
| HarmonyOS NEXT（原生） | 未验证 | 未验证 | 未验证 | 未验证 | 未验证 | 工具链缺失；不得以 Android APK 代替 |

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
3. 主题十套在真实界面逐端核对（弹层同步、动态字号、减少动态效果）。
4. Web 录音独立实现与浏览器权限/quota 验证。
5. 原生 HarmonyOS NEXT 独立安装/运行验收。
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
