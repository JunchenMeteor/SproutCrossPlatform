# SproutCrossPlatform 仓库根引导

模板来源：Codex/EnglishCheckInPlanning/RepositoryGuides/CrossPlatform/AGENTS.md（模板1.0），
已按 README 的 docs 映射重写阅读链接。本仓库是 uni-app x 跨端客户端本地 Git 仓库，
固定 uni-app x / UTS / uvue 覆盖微信小程序、Web、Android、原生 HarmonyOS NEXT；
Windows 开发，不换 Taro。SwiftUI 与 Python+FastAPI+LangGraph 在各自独立仓库。
版本/HBuilderX/编译模式未实测，不能假定任意 JS 库四端可用，也不能拿 Android APK 代表纯鸿蒙。

## 阅读顺序与权威

1. [项目事实](./docs/planning/ProjectFacts.md)。
2. [项目工程规范](./docs/standards/ProjectEngineeringStandard.md)。
3. [通用工程规范](./docs/standards/GeneralEngineeringStandard.md)。
4. [产品需求](./docs/planning/ProductRequirements.md)。
5. [技术设计与 EC-API-0.1](./docs/planning/TechnicalDesign.md)。
   配套接口附录：[客户端上下文与追踪](./docs/planning/ClientContext.md)，平台 adapter
   提供来源，RequestClient 统一注入，验证 Web CORS；命名以项目规范为准。
   开发前核对[文档审阅与待冻结项](./docs/planning/DocumentationAudit.md)。
6. [目录、快照与验证状态导航](./README.md)；文档版本/哈希见
   [docs/DOCUMENT-SNAPSHOTS.md](./docs/DOCUMENT-SNAPSHOTS.md)。

项目规范覆盖旧架构/主题冲突，技术设计第5节是当前接口唯一来源，事实文件区分用户决定/
官方资料/工具输出。不要在此复制规范正文或制造另一契约。

## 执行边界

页面仅组合业务状态与共用组件，录音/文件/权限/login/主题存储按 platform adapter 隔离，
条件指令不散到 pages。Web 独立录音，内置 RecorderManager 不支持 Web。
样式固定版本后验证共同 Flex/绝对定位子集，不将 DOM、任意 CSS、Vue Transition 或任意
npm 库当四端能力；App.uvue/pages.json/manifest.json/uni_modules 框架名称保留。
共享语义 tokens/素材/行为/API，不共 SwiftUI 源码；十主题完整角色与弹层同步按规范，
偏好按设备保存，无新增 server API。后端权威规则，不各端重写打卡奖励。
接口仍 EC-API-0.1，后端 canonical schema 同版本/哈希下发；契约缺口（技术设计第5.6节）
冻结前不自行定义远端接口，先推进界面、录音、播放、本地存储与离线流程。

## 目录结构

```text
App.uvue pages.json manifest.json main.uts   # 框架固定名称
pages/ components/ features/                 # 页面、共用组件、业务状态与用例
platform/                                    # Web/小程序/Android/Harmony adapter
theme/ storage/ services/                    # tokens映射/草稿队列/契约API调用
uni_modules/ tests/ docs/                    # 插件、验证、随库文档与进度
```

## 验证与进度记录

四端分别记录编译模式/版本、录音权限/文件/login/离线/主题/布局验证；mock 与数学配色
不代替设备或服务实测。实施进度、真实验证证据、未完成项与断点续跑记录持续维护在
[docs/progress/ImplementationProgress.md](./docs/progress/ImplementationProgress.md)；
未验证的平台必须标为未验证，不得以编译或单端 mock 通过冒充四端验收。

## 工作边界

只修改本仓库；不创建 GitHub 远程仓库、不部署、不付费调用/充值、不创建其他聊天。
工作区治理规则见 G:/开发测试/AGENTS.md；日志/截图等任务材料放 Codex 任务目录，
密钥/儿童音频不进 Git。文本统一 UTF-8 无 BOM/LF；UTS/uvue/CSS/JSON 缩进 2 空格；
命名 lowerCamelCase 成员、UpperCamelCase 类型/组件文件；行数/空行/注释门禁见两份规范，
检查工具未实现时如实标注为待实现。
