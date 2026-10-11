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
| 共用组件 | 未开始 | button/dialog/toast/form/list/card/recorder/feedback/calendar/reward |
| 网络层 | 骨架完成（未联调） | services/：ClientContextProvider（X-Client-* headers、uniAppX/平台枚举、契约版本）、RequestClient（统一注入、幂等键、非 JSON 降级、预签名下载不带凭据）；不定义业务端点，待契约冻结 |
| 本地存储与离线 | 源码完成（未运行） | storage/：SyncQueue（按账号隔离、稳定 UUID、重试不新建条目）、DraftStore（草稿 + 服务端已确认 Plan 离线缓存，无缓存不承诺离线打卡） |
| 平台 adapter | 源码完成（未编译） | platform/：RecorderAdapter 契约+工厂、UniRecorderAdapter（小程序/Android/鸿蒙）、WebRecorderAdapter（MediaRecorder 单独实现）、PermissionAdapter、FileAdapter（临时录音转存）、AudioPlayerAdapter；均标注逐端实测要求 |
| 四端验证 | 未开始 | 见第3节平台矩阵 |

## 2. 工具链现状与限制

| 工具 | 实测结果（2026-10-11） | 影响与补救 |
| --- | --- | --- |
| Node.js | v24.18.0 可用（C:\Program Files\nodejs） | 可用于脚本与依赖管理 |
| Git | 2.46.0.windows.1 可用 | 本地仓库正常 |
| HBuilderX | 未安装（Program Files、AppData、Tools 均未发现） | uni-app x 官方主编译入口缺失，四端编译/运行验证受阻；需用户安装 HBuilderX 后打开本仓库目录验证，或使用官方 CLI（可用性待核对官方文档） |
| 微信开发者工具 | 未核对 | 小程序预览/真机验证需要 |
| Android SDK / 鸿蒙 DevEco | 未核对 | Android 与原生 HarmonyOS NEXT 验证需要；鸿蒙须独立验证，APK 不作证据 |

工具链缺失期间继续推进可验证部分：工程结构、主题 tokens、组件与 adapter 源码、
离线/存储流程的静态实现与可运行的纯逻辑测试（Node 环境）。

## 3. 四端验证矩阵

| 平台 | 编译 | 运行/录音 | 权限/文件 | 登录 | 离线/主题/布局 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| 微信小程序 | 未验证 | 未验证 | 未验证 | 未验证 | 未验证 | 工具链缺失 |
| Web | 未验证 | 未验证（录音须单独适配） | 未验证 | 未验证 | 未验证 | 工具链缺失 |
| Android | 未验证 | 未验证 | 未验证 | 未验证 | 未验证 | 工具链缺失 |
| HarmonyOS NEXT（原生） | 未验证 | 未验证 | 未验证 | 未验证 | 未验证 | 工具链缺失；不得以 Android APK 代替 |

## 4. 契约与接口边界

- 唯一接口定义：docs/planning/TechnicalDesign.md 第5节 EC-API-0.1；冻结缺口见第5.6节
  与 DocumentationAudit.md 第3节。冻结前不实现依赖未定接口的远端调用，网络层只做
  RequestClient 骨架与 headers 注入（X-Client-Type/Platform、X-App-Version/Build、
  X-Contract-Version、Idempotency-Key 等），baseUrl 由配置注入。
- 前端先行范围：界面、录音、回放、本地存储、草稿与待同步离线流程；使用明确标注的
  本地假数据/fixture，不冒充服务端响应。

## 5. 未完成项清单

1. HBuilderX/CLI 安装与固定版本、编译模式核对。
2. 四端逐一编译与运行验证（第3节矩阵）。
3. 主题十套在真实界面逐端核对（弹层同步、动态字号、减少动态效果）。
4. Web 录音独立实现与浏览器权限/quota 验证。
5. 原生 HarmonyOS NEXT 独立安装/运行验收。
6. 编码门禁流水线（formatter→空行归一→custom checker→lint/测试）未实现，当前为人工遵守。
7. 后端联调（依赖 EC-API-0.1 冻结与后端仓库）。

## 6. 断点续跑

- 上次完成：uni-app x 工程骨架（manifest/pages.json/main.uts/App.uvue/8 页面骨架）、
  主题系统源码（ThemeTypes/ThemeTokens/ThemeStore + ThemeEnvAdapter），色值核对通过。
- 下次入口：platform/ 录音/播放/文件/权限 adapter → components/ 共用组件 →
  storage/ 草稿与待同步队列 → services/ RequestClient 骨架 → 页面业务组合。
- 续跑前先读 AGENTS.md 阅读顺序与本文件第5节未完成项。
- 待核对：manifest.json 平台段键名（app/app-harmony/h5）需对照所装 HBuilderX 版本
  校验；pages.json tabBar 为静态默认 SkyLight 配色，运行时主题只覆盖页面内容，
  小程序 tabBar 动态换肤能力需在验证阶段确认。
