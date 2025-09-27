# MCP Next.js 开发指南

## 什么是MCP？

MCP (Model Context Protocol) 是一个标准化协议，让AI助手能够更好地理解和控制开发环境。通过MCP，AI可以：

- 自动生成Next.js组件
- 创建API路由
- 分析性能问题
- 提供开发建议

## 项目配置

### 1. MCP服务器配置
- `mcp-config.json` - MCP服务器配置
- `scripts/mcp-server.js` - MCP服务器实现
- `.cursor/mcp-settings.json` - Cursor集成配置

### 2. 开发规则
- `.cursorrules` - AI助手行为规则
- 定义了Next.js 15 + TypeScript + Tailwind CSS的最佳实践

## 使用方法

### 启动开发环境

```bash
# 方法1: 使用脚本启动（推荐）
./scripts/dev-with-mcp.sh

# 方法2: 分别启动
npm run dev          # Next.js开发服务器
npm run mcp:server   # MCP服务器

# 方法3: 同时启动
npm run mcp:dev
```

### MCP工具使用

在Cursor中，你可以使用以下MCP工具：

#### 1. 创建组件
```
创建一个名为Button的客户端组件，包含onClick和children属性
```

#### 2. 创建页面
```
为/dashboard路由创建一个页面组件
```

#### 3. 创建API路由
```
创建一个POST /api/users的API路由
```

#### 4. 性能分析
```
分析当前应用的性能问题并提供优化建议
```

## 可用命令

```bash
# 开发
npm run dev              # 启动Next.js开发服务器
npm run mcp:server       # 启动MCP服务器
npm run mcp:dev          # 同时启动两个服务器

# 构建和分析
npm run build            # 构建生产版本
npm run analyze          # 分析bundle大小
npm run type-check       # TypeScript类型检查

# 代码质量
npm run lint             # ESLint检查
```

## MCP工具功能

### 1. create_component
- 自动生成TypeScript组件
- 支持客户端/服务器组件
- 包含Tailwind CSS样式
- 自动生成Props接口

### 2. create_page
- 创建Next.js页面组件
- 支持不同页面类型（page, layout, loading, error）
- 自动配置路由

### 3. create_api_route
- 生成API路由处理器
- 支持所有HTTP方法
- 包含错误处理
- TypeScript类型安全

### 4. analyze_performance
- 分析应用性能
- 提供优化建议
- 检查Core Web Vitals
- Bundle大小分析

## 最佳实践

### 1. 组件开发
- 优先使用Server Components
- 合理使用Client Components
- 遵循TypeScript最佳实践
- 使用Tailwind CSS进行样式设计

### 2. 性能优化
- 使用`next/image`优化图片
- 实现代码分割
- 合理使用缓存
- 监控Core Web Vitals

### 3. 开发流程
- 使用MCP工具快速生成代码
- 定期运行性能分析
- 保持代码质量检查
- 使用TypeScript严格模式

## 故障排除

### MCP服务器无法启动
```bash
# 检查依赖
npm install

# 检查Node.js版本
node --version  # 需要 >= 18.0.0
```

### Cursor无法连接MCP
1. 检查`.cursor/mcp-settings.json`配置
2. 确保MCP服务器正在运行
3. 重启Cursor编辑器

### 性能问题
```bash
# 分析bundle
npm run analyze

# 检查类型错误
npm run type-check

# 运行linting
npm run lint
```

## 扩展MCP功能

你可以通过修改`scripts/mcp-server.js`来添加更多工具：

1. 添加新的工具定义
2. 实现工具处理逻辑
3. 更新配置文件
4. 重启MCP服务器

## 更多资源

- [Next.js 15 文档](https://nextjs.org/docs)
- [MCP 协议规范](https://modelcontextprotocol.io/)
- [TypeScript 最佳实践](https://typescript-eslint.io/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)