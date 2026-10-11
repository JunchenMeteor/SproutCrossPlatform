# SproutCrossPlatform

英语练习打卡 uni-app x 跨端客户端仓库（Sprout 系列：后端 SproutApi），
覆盖微信小程序、Web、Android、原生 HarmonyOS NEXT。
技术方向固定 uni-app x / UTS / uvue，不使用 Taro、React Native 或其他框架替代。

状态：仓库初始化阶段，工具链与四端编译尚未验证。真实进度、验证证据、未完成项与断点续跑
记录见 [docs/progress/ImplementationProgress.md](./docs/progress/ImplementationProgress.md)，
不以本文件概述冒充验证结果。

## 文档地图

| 文档 | 用途 |
| --- | --- |
| [docs/planning/ProjectFacts.md](./docs/planning/ProjectFacts.md) | 事实基线：用户决定/官方资料/工具输出/建议/未决项 |
| [docs/standards/ProjectEngineeringStandard.md](./docs/standards/ProjectEngineeringStandard.md) | 项目工程权威：架构、编码、十套主题 tokens、验收 |
| [docs/standards/GeneralEngineeringStandard.md](./docs/standards/GeneralEngineeringStandard.md) | 通用编码/模块/组件/状态/门禁基线 |
| [docs/planning/ProductRequirements.md](./docs/planning/ProductRequirements.md) | 业务需求与流程 |
| [docs/planning/TechnicalDesign.md](./docs/planning/TechnicalDesign.md) | 技术设计与 EC-API-0.1 唯一接口定义（第5节） |
| [docs/planning/ClientContext.md](./docs/planning/ClientContext.md) | 统一 headers、请求/任务追踪、统计与 Web CORS 附录 |
| [docs/planning/DocumentationAudit.md](./docs/planning/DocumentationAudit.md) | 开发前待冻结契约缺口与验证限制 |
| [docs/DOCUMENT-SNAPSHOTS.md](./docs/DOCUMENT-SNAPSHOTS.md) | 随库文档版本/哈希快照与更新流程 |
| [AGENTS.md](./AGENTS.md) | 仓库根引导：阅读顺序、执行边界 |

## 目录结构

```text
App.uvue pages.json manifest.json main.uts   # uni-app x 框架固定名称
pages/                                       # 页面，仅组合业务状态与共用组件
components/                                  # 共用组件：button/dialog/toast/form/list/card/recorder/feedback/calendar/reward
features/                                    # 练习/日历/收藏/家长业务状态与用例
platform/                                    # Web/小程序/Android/HarmonyOS 平台 adapter
theme/                                       # 十套主题语义 tokens 映射与设备偏好存储
services/                                    # EC-API-0.1 契约 API 调用（RequestClient）
storage/                                     # 草稿、录音引用、待同步队列
uni_modules/                                 # 框架插件结构，逐端验证后使用
tests/                                       # 真实必要规则/恢复验证
docs/                                        # 随库文档快照与进度记录
```

## 工具链与验证状态

- uni-app x 需要 HBuilderX（或官方 CLI）编译；本机当前**未安装 HBuilderX**，具体限制与
  补救步骤记录在进度文档中，不虚构 build/test 命令已通过。
- 四端（微信小程序、Web、Android、原生 HarmonyOS NEXT）分别验证；Web 录音单独适配，
  Android APK 不作为原生鸿蒙验收证据。未验证的平台在进度文档中明确标为未验证。
- 接口契约固定 EC-API-0.1；契约缺口冻结前（TechnicalDesign.md 第5.6节），优先推进
  界面、录音、播放、本地存储与离线流程，不自行定义远端接口。

## 工程约定摘要

- 文本统一 UTF-8 无 BOM、LF、末尾单换行、无尾随空格、无 tab；UTS/uvue/CSS/JSON 缩进 2 空格。
- 命名：变量/函数/常量 lowerCamelCase；类型与组件文件基名 UpperCamelCase（如 PracticeCard.uvue）。
- 文件/函数/类型行数门禁、声明空行、注释与模块边界规则见两份规范；门禁工具未实现时如实标注。
- 页面只组合业务用例与共用组件；平台条件集中在 platform/ adapter，不散落到页面。
- 主题十套完整 tokens 唯一来源为项目规范第6节；页面不硬编码颜色，偏好按设备本地保存。
