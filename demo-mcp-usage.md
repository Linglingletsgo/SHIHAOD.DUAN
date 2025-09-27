# MCP Next.js 使用演示

## 演示场景

假设你要创建一个用户管理系统的Next.js应用，以下是使用MCP工具的完整流程：

## 1. 创建用户组件

**请求**: "创建一个UserCard组件，显示用户信息"

**MCP工具**: `create_component`
**参数**:
```json
{
  "name": "UserCard",
  "type": "client",
  "props": [
    {"name": "user", "type": "User", "required": true},
    {"name": "onEdit", "type": "() => void", "required": false}
  ]
}
```

**生成的代码**:
```typescript
interface UserCardProps {
  user: User;
  onEdit?: () => void;
}

'use client';

import React from 'react';

export default function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="p-4">
      <h2>UserCard Component</h2>
      {/* Add your component content here */}
    </div>
  );
}
```

## 2. 创建用户页面

**请求**: "为用户列表创建页面"

**MCP工具**: `create_page`
**参数**:
```json
{
  "route": "/users",
  "type": "page"
}
```

**生成的代码**:
```typescript
import React from 'react';

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <h1>/users page</h1>
      {/* Add your page content here */}
    </div>
  );
}
```

## 3. 创建用户API

**请求**: "创建获取用户列表的API"

**MCP工具**: `create_api_route`
**参数**:
```json
{
  "route": "/api/users",
  "method": "GET"
}
```

**生成的代码**:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Add your GET logic here
    return NextResponse.json({ message: 'GET request successful' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

## 4. 性能分析

**请求**: "分析应用性能"

**MCP工具**: `analyze_performance`

**分析结果**:
```
Performance Analysis for Next.js App:

🔍 Key Areas to Optimize:

1. **Image Optimization**
   - Use next/image for automatic optimization
   - Implement proper sizing and lazy loading

2. **Code Splitting**
   - Use dynamic imports for large components
   - Implement route-based code splitting

3. **Bundle Analysis**
   - Run 'npm run build' to analyze bundle size
   - Remove unused dependencies

4. **Server Components**
   - Use Server Components when possible
   - Minimize client-side JavaScript

5. **Caching Strategy**
   - Implement proper caching headers
   - Use Next.js built-in caching

6. **Core Web Vitals**
   - Monitor LCP, FID, CLS metrics
   - Optimize for mobile performance
```

## 实际使用步骤

### 1. 启动MCP环境
```bash
cd /Users/dominicduan/my-nextjs-app
./scripts/dev-with-mcp.sh
```

### 2. 在Cursor中使用
1. 打开Cursor编辑器
2. 确保MCP服务器正在运行
3. 在聊天中使用自然语言描述需求
4. AI会自动调用相应的MCP工具

### 3. 示例对话

**你**: "我需要创建一个登录页面"

**AI**: 我会为你创建一个登录页面组件和对应的API路由。

**AI**: 使用MCP工具创建登录页面...

**AI**: 已创建以下文件：
- `src/app/login/page.tsx` - 登录页面
- `src/app/api/auth/login/route.ts` - 登录API
- `src/components/LoginForm.tsx` - 登录表单组件

### 4. 持续开发
- 使用MCP工具快速生成基础代码
- 手动调整和优化生成的代码
- 定期运行性能分析
- 使用TypeScript确保类型安全

## 优势

1. **快速原型**: MCP工具可以快速生成基础代码结构
2. **一致性**: 所有生成的代码都遵循项目规范
3. **类型安全**: 自动生成TypeScript类型定义
4. **最佳实践**: 遵循Next.js 15和React 19的最佳实践
5. **性能优化**: 内置性能分析和优化建议

## 注意事项

1. 生成的代码是基础模板，需要根据具体需求调整
2. 始终检查生成的代码是否符合项目要求
3. 定期更新MCP工具以支持新的功能
4. 保持代码质量和测试覆盖