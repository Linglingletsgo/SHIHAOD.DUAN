# SKILLS 内容设计规格

## 1. 目标

在个人网站新增独立路由 `/skills`，顶部导航新增 `技能 SKILLS`。页面是一套公开的中英双语个人能力数据库，同时服务创意合作方、机构、专业团队和普通观众。

数据库只保存并展示愿意公开的内容，不设置隐藏数据、熟练度评级、Status、Time 或 Application Context。能力可信度由案例和具体角色说明支撑。

## 2. 内容原则

- 以可在真实情境中独立应用的能力单元作为 Skill 粒度。
- 不把宽泛身份、人格评价、短暂接触或单个操作步骤当作 Skill。
- 不使用星级、百分比或 Expert 等公开评级。
- 案例描述使用“背景 → 具体行动或角色 → 可观察成果”。
- 优先关联作品集、音乐页、GitHub 等案例组；只有特别有代表性的项目单独列出。
- 健康与药理内容只表述为基础健康信息素养，不暗示诊断、处方或医疗专业资格。
- 资源检索只描述合法的调研、发现、评估和验证，不涉及不合规来源或用途。
- DJ 目前只作为 Knowledge，不作为 DJ Performance Skill。
- 中英文均为正式内容，语义对应但不逐词硬译；通过语言按键切换显示。

## 3. 数据模型

内容拆分为四类对象，分别维护并通过稳定 ID 关联：

### Skill

- `id`
- `domainId`
- `subdomainId`
- `name.zh` / `name.en`
- `definition.zh` / `definition.en`
- `knowledgeIds`
- `toolIds`
- `experienceIds`
- `prerequisiteSkillIds`
- `relatedSkillIds`
- `combinedPracticeIds`
- `mode`
- `transferability`
- `evidenceType`
- `language`（仅适用时）

### Knowledge

- `id`
- `name.zh` / `name.en`
- `definition.zh` / `definition.en`
- `relatedSkillIds`

### Tool

- `id`
- `name`
- `type`：software / hardware / protocol / platform / equipment
- `relatedSkillIds`

首版只收录用户已明确提供的工具，不主动推断或扩展。Veo 3.1 不作为 Tool；仅在 Digital Alchemy 的案例说明中记录为作品所处的生成式视频技术阶段。

### Experience

- `id`
- `name.zh` / `name.en`
- `description.zh` / `description.en`
- `href`（可选）
- `relatedSkillIds`
- `evidenceType`

没有链接的案例允许显示名称和简述。

## 4. 固定领域

顶层领域保持稳定，子领域可按内容扩展：

1. **Cognitive**：研究、分析、推理、判断、学习和知识整合。
2. **Creative**：想象、设计、表达、叙事和审美决策。
3. **Technical**：软件、硬件、系统、协议和工程实践。
4. **Physical**：身体控制、运动、手工和设备操作。
5. **Interpersonal**：沟通、教学、协作、支持和跨专业配合。
6. **Organizational**：规划、流程、资源、项目和数字资产管理。
7. **Personal**：自主学习、适应、反思、恢复和持续发展。
8. **Practical Life**：生活、出行、照护、维护和现实事务。

每项 Skill 只选择一个主领域；跨领域意义通过 Related 与 Combined Practice 表达。

## 5. 首版内容范围

### Cognitive

- 跨来源调研、资料检索、资源发现与验证
- 前沿技术和行业信息追踪
- 数据收集、清理、分析和可视化
- 第一性原理思考、推理与概念建构
- 哲学概念向设计方法转化
- 民族文化、宗教学和未来研究
- 文学文本分析与评论
- 基础经济与金融分析
- 基础营养、生理和药物信息研究

### Creative

- 服装设计、平裁、立裁、打版、Fitting、缝纫和完整成衣开发
- 针织、手摇横机、草木染、纱线再造、面料改造和折纸服装结构
- 轻黏土、混合材料绘画、皮具和银黏土首饰制作
- 摄影、电影摄影、导演、编剧、台词写作和表演
- 时尚拍摄导演、Reference Research、勘景、妆造与调色指导
- 素材整理、剪辑、调色、特效、配音和影视声音
- 作词、作曲、编曲、音乐制作、混音和声音设计
- 3D 设计、建模、扫描、雕刻、场景、材质、动画和渲染
- Creative Coding、实时视觉、交互媒体和艺术装置
- UI/UX、网页、杂志、印刷和装订设计
- Speculative Design、Provocative Design 和跨学科设计

### Technical

- AI Agent、MCP、个人知识库和 AI 学术研究工作流
- AIGC 文生图、图生视频、文生视频、首尾帧、提示词、连续性控制和后期整合
- LLM API 接入 Unity 与网站
- Web 开发、开源项目调研、代码阅读、定制、小工具和自动化部署
- TouchDesigner、Processing、Three.js 和代码可视化艺术
- Unity 与 TouchDesigner 之间的 OSC/MIDI 通信
- macOS 虚拟 MIDI、多软件控制和多输出播放工作流
- Serial/UART、Arduino、ESP32、STM32、传感器和灯光交互
- COMSOL 多物理场模拟
- 3D 打印准备、材料选择与成本测算
- PC/ITX 配件选型、组装、升级、理线、系统安装、故障诊断和数据保护
- Linux、VPS、NAS、软路由、家庭服务器、虚拟机和安全远程访问
- 本地/远程媒体库、自动化媒体管理、备份、文件系统和接口协议
- 小型电器维修、电池更换、电子焊接和机械键盘组装
- 全屋智能与 HomeKit 基础设计和执行原理
- 录音系统、麦克风配置、音频信号链和基础声学处理

### Physical

- 服装制作、针织、染色、首饰、皮具、焊接和精细装配
- 驾驶、长距离骑行、跑步、有氧训练和乒乓球
- 咖啡冲煮及相关器具操作

### Interpersonal

- CLO3D 基础教学
- 跨专业创意协作
- 影视、音乐和表演团队协作
- 技术方案解释、电脑装机和维护支持

### Organizational

- 独立项目和端到端影视制作
- DaVinci Resolve Project Server 局域网后期协作
- 素材、数字资产和多端备份管理
- AI 个人知识与学术研究系统
- 独立旅行、签证资料和家庭数字基础设施管理

### Personal

- 自主学习、跨领域迁移、持续技术追踪和独立问题解决
- 长期健身、有氧训练、睡眠和恢复管理
- 围棋策略；业余三段作为客观证据

### Practical Life

- 海外驾驶与自驾
- 多类型烹饪
- 咖啡、茶、酒和食品风味鉴赏
- 独立旅行和长期独立生活
- 英国、申根和美国签证资料准备
- 植物养护与虫害处理
- 家具拆装、家庭设备维护和灭火器使用
- 中文母语；IELTS 7.0、Listening 8.5 作为英语证据

## 6. Combined Practice

- **Interactive Wearables**：服装 × 嵌入式硬件 × 灯光
- **Audio-reactive 3D Systems**：声音 × TouchDesigner × 3D
- **Real-time Interactive Pipeline**：Unity × OSC/MIDI × TouchDesigner
- **Interactive Stage Systems**：声音 × 灯光 × 视觉 × 表演
- **Speculative Design Practice**：哲学 × 未来研究 × 设计
- **Hybrid Visual Production**：Blender × AIGC × 后期
- **Automated Web Archive**：SurveyJS × AI API × GitHub × Vercel
- **AI-assisted Academic Research System**：wiki-agent × MCP × Zotero × 本地 Wiki
- **Structural Fashion Development**：折纸 × 廓形 × 样版
- **Digital Fabrication Planning**：3D × 材料 × 成本测算

## 7. 案例入口

- **Fashion Lab Portfolio**：综合案例组。
  - 《墙》《灵》《根》：由用户独立完成，证明从概念、效果图、平裁/立裁、样版、样衣、Fitting、修版到最终成衣的完整流程。
  - 《幻》：3D 设计、建模、场景、材质、动画和渲染全流程案例。
- **GLITCH IN THE HIVE**：端到端影视案例，覆盖导演、编剧、DP、表演、素材管理、剪辑、调色、特效、配音和声音设计。
- **SonySIE Project**：TouchDesigner、声音与 3D 参数交互、实时视听和跨学科交互设计。
- **Music Portfolio**：链接 `/music`，证明作词、作曲、编曲、制作、混音和声音实践。
- **GitHub**：链接 `https://github.com/Linglingletsgo`，证明 Web、开源研究、工具开发、Creative Coding 和自动化实践。
- **Obfuscation Identity Archive**：Three.js、问卷、AI API、GitHub 数据归档、Vercel 部署和自动化系统。
- **Digital Alchemy**：AIGC 视频案例；Veo 3.1 只作为创作所处技术时代的背景，不作为 Tool 或长期技能标签。
- **Education & Research**：浙江理工大学服装设计与工程；伦敦时装学院 Fashion Futures；中国服装产业出口隐含碳数据分析与可视化研究。
- **Practical Experiences**：挪威与扎金索斯自驾、杭州至南京五日骑行、ITX/多台电脑组装、家庭服务器、STM32 自动浇水、Arduino 服装灯光和独立签证申请。

## 8. 已确认工具

首版工具包括用户明确提到的：Blender、Geometry Nodes、CLO3D、COMSOL Multiphysics、TouchDesigner、Processing、Three.js、Unity、DaVinci Resolve、DaVinci Resolve Project Server、SurveyJS、Arduino、ESP32、STM32、OSC、MIDI、Serial/UART、GitHub、Vercel、Zotero、wiki-agent、MCP、Linux、VPS、NAS、HomeKit、3D Scanner、3D Printer、手摇横机、DJ Deck、咖啡冲煮设备和银黏土加工设备。

不继续追问或推断其他工具；后续按普通内容更新追加。

## 9. 实施边界

- 新增 `/skills` 和顶部 `技能 SKILLS` 导航入口。
- 内容数据按 Skills、Knowledge、Tools、Experiences 分文件维护。
- 页面支持中文/英文按键切换。
- 首版不需要 CMS、登录、数据库服务、评级系统或隐藏内容。
- 不改变既有页面、作品、链接和视觉含义。
- React/Next.js 实现遵循 Vercel React best practices：数据尽量保持为服务端可读取的静态模块，只把语言切换等必要交互放入小型 Client Component，避免把完整页面和全部静态数据无谓地客户端化。

## 10. 验证标准

- `/skills` 可直接访问，顶部导航入口正确。
- 中英文内容切换完整，无混合语言或缺失字段。
- 所有内部和外部案例链接有效。
- 数据关系引用的 ID 均存在，无孤立或重复 ID。
- 页面在桌面和移动视口保持现有网站布局意图。
- 通过 `npm run type-check`、`npm run lint` 和相关页面运行检查。
- 尝试 `npm run build`；若仍出现项目既有的 build hang，记录实际状态，不伪称通过。
