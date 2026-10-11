# 随库文档快照记录

版本：1.0；日期：2026-10-11；用途：记录本仓库 docs/ 下权威文档快照的来源、版本与 SHA-256，
保证三仓库消费同版文档，不各自演变。哈希为分发时**源文件**的 SHA-256；本仓库副本仅重写了
相对链接，正文内容与源文件一致。

## 分发清单

| 仓库内路径 | 源文件 | 文档版本 | 源文件 SHA-256 |
| --- | --- | --- | --- |
| docs/planning/ProductRequirements.md | Codex/EnglishCheckInPlanning/ProductRequirements.md | v0.4 | 8cf1cf1edb11253b677368aa1195bde98b1d26bb0ea992ad03ec5b26418069d9 |
| docs/planning/TechnicalDesign.md | Codex/EnglishCheckInPlanning/TechnicalDesign.md | 设计 v0.4 / EC-API-0.1 | ce0dfd31a587be20b224d1831c19f0adfae94d304e706e10cf18e1486ae25449 |
| docs/planning/ClientContext.md | Codex/EnglishCheckInPlanning/ClientContext.md | 1.1 | 621539b89fc47aa0eb88ccf26f413f5c96bfa14f19637f209f111cd57fb7665c |
| docs/planning/ProjectFacts.md | Codex/EnglishCheckInPlanning/ProjectFacts.md | 1.3 | 89655d6bd8fecd2d0af1cc9028db0f1b4fe241ab6dcc37d844b150956c051943 |
| docs/planning/DocumentationAudit.md | Codex/EnglishCheckInPlanning/DocumentationAudit.md | 1.0 | 6e1fd3b84b8cb07f086f58d591fccc019c2d68aae7660606b2357002fe0c6b72 |
| docs/standards/ProjectEngineeringStandard.md | Codex/EnglishCheckInPlanning/ProjectEngineeringStandard.md | 1.1 | 87873681bea01c98bc9ef5fd7f3f5f55c324274e0346716f1613136d0e475bf1 |
| docs/standards/GeneralEngineeringStandard.md | Codex/EngineeringStandards/GeneralEngineeringStandard.md | 1.1 | 54f45d3db06a04fb5747a81642bbdc9325f855106ca54fa96ec96eba6ca48ca8 |

## 链接重写规则

- `../EngineeringStandards/GeneralEngineeringStandard.md` → `../standards/GeneralEngineeringStandard.md`
  （planning 内）或 `./GeneralEngineeringStandard.md`（standards 内）。
- `./ProjectEngineeringStandard.md`（planning 内）→ `../standards/ProjectEngineeringStandard.md`。
- standards 内 `./ProjectFacts.md` / `./TechnicalDesign.md` → `../planning/...`。
- 规划目录的 `RepositoryGuides/` 模板不随库分发；本仓库根 AGENTS.md 已由跨端模板映射生成。

## 更新流程

源材料在 Codex/EnglishCheckInPlanning 统一更新后，重新复制、重写链接、更新本表版本与哈希，
并核对全部相对链接可解析。接口契约 EC-API-0.1 的 canonical schema 未来由后端仓库
contracts/ 维护并向客户端分发同版本/哈希；本仓库不自行定义或修改远端接口。
