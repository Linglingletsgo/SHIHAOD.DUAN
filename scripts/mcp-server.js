#!/usr/bin/env node

/**
 * MCP Server for Next.js Development
 * Provides tools and context for AI-assisted Next.js development
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

class NextJSMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'nextjs-dev-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_component',
            description: 'Create a new React component with TypeScript and Tailwind CSS',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Component name (e.g., Button, UserCard)',
                },
                type: {
                  type: 'string',
                  enum: ['client', 'server'],
                  description: 'Component type - client or server component',
                },
                props: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      type: { type: 'string' },
                      required: { type: 'boolean' },
                    },
                  },
                  description: 'Component props definition',
                },
              },
              required: ['name', 'type'],
            },
          },
          {
            name: 'create_page',
            description: 'Create a new Next.js page with proper routing',
            inputSchema: {
              type: 'object',
              properties: {
                route: {
                  type: 'string',
                  description: 'Route path (e.g., /dashboard, /users/[id])',
                },
                type: {
                  type: 'string',
                  enum: ['page', 'layout', 'loading', 'error'],
                  description: 'Page type',
                },
              },
              required: ['route', 'type'],
            },
          },
          {
            name: 'create_api_route',
            description: 'Create a new API route handler',
            inputSchema: {
              type: 'object',
              properties: {
                route: {
                  type: 'string',
                  description: 'API route path (e.g., /api/users, /api/auth/login)',
                },
                method: {
                  type: 'string',
                  enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                  description: 'HTTP method',
                },
              },
              required: ['route', 'method'],
            },
          },
          {
            name: 'analyze_performance',
            description: 'Analyze Next.js app performance and suggest optimizations',
            inputSchema: {
              type: 'object',
              properties: {
                component: {
                  type: 'string',
                  description: 'Component path to analyze (optional)',
                },
              },
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'create_component':
          return await this.createComponent(args);
        case 'create_page':
          return await this.createPage(args);
        case 'create_api_route':
          return await this.createApiRoute(args);
        case 'analyze_performance':
          return await this.analyzePerformance(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async createComponent(args) {
    const { name, type, props = [] } = args;
    
    const componentCode = this.generateComponentCode(name, type, props);
    
    return {
      content: [
        {
          type: 'text',
          text: `Created ${type} component: ${name}\n\n${componentCode}`,
        },
      ],
    };
  }

  async createPage(args) {
    const { route, type } = args;
    
    const pageCode = this.generatePageCode(route, type);
    
    return {
      content: [
        {
          type: 'text',
          text: `Created ${type} page for route: ${route}\n\n${pageCode}`,
        },
      ],
    };
  }

  async createApiRoute(args) {
    const { route, method } = args;
    
    const apiCode = this.generateApiCode(route, method);
    
    return {
      content: [
        {
          type: 'text',
          text: `Created ${method} API route: ${route}\n\n${apiCode}`,
        },
      ],
    };
  }

  async analyzePerformance(args) {
    const { component } = args;
    
    const analysis = this.generatePerformanceAnalysis(component);
    
    return {
      content: [
        {
          type: 'text',
          text: analysis,
        },
      ],
    };
  }

  generateComponentCode(name, type, props) {
    const propsInterface = props.length > 0 
      ? `interface ${name}Props {\n${props.map(p => `  ${p.name}${p.required ? '' : '?'}: ${p.type};`).join('\n')}\n}\n\n`
      : '';

    const propsParam = props.length > 0 ? `{ ${props.map(p => p.name).join(', ')} }: ${name}Props` : '';

    if (type === 'client') {
      return `${propsInterface}'use client';\n\nimport React from 'react';\n\nexport default function ${name}(${propsParam}) {\n  return (\n    <div className="p-4">\n      <h2>${name} Component</h2>\n      {/* Add your component content here */}\n    </div>\n  );\n}`;
    } else {
      return `${propsInterface}import React from 'react';\n\nexport default function ${name}(${propsParam}) {\n  return (\n    <div className="p-4">\n      <h2>${name} Component</h2>\n      {/* Add your component content here */}\n    </div>\n  );\n}`;
    }
  }

  generatePageCode(route, type) {
    const fileName = type === 'page' ? 'page.tsx' : `${type}.tsx`;
    
    return `import React from 'react';\n\nexport default function ${type.charAt(0).toUpperCase() + type.slice(1)}() {\n  return (\n    <div className="container mx-auto p-4">\n      <h1>${route} ${type}</h1>\n      {/* Add your page content here */}\n    </div>\n  );\n}`;
  }

  generateApiCode(route, method) {
    return `import { NextRequest, NextResponse } from 'next/server';\n\nexport async function ${method}(request: NextRequest) {\n  try {\n    // Add your ${method} logic here\n    return NextResponse.json({ message: '${method} request successful' });\n  } catch (error) {\n    return NextResponse.json(\n      { error: 'Internal Server Error' },\n      { status: 500 }\n    );\n  }\n}`;
  }

  generatePerformanceAnalysis(component) {
    return `Performance Analysis for ${component || 'Next.js App'}:

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

💡 Next Steps:
- Run 'npm run build' to see bundle analysis
- Use React DevTools Profiler
- Test with Lighthouse`;
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Next.js MCP Server running on stdio');
  }
}

const server = new NextJSMCPServer();
server.run().catch(console.error);