'use client';

import { useState, useCallback, type ReactElement } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

const categories = [
  { id: 'all', name: '全部工具', icon: 'grid' },
  { id: 'dev', name: '开发工具', icon: 'code' },
  { id: 'design', name: '设计工具', icon: 'palette' },
  { id: 'productivity', name: '效率工具', icon: 'zap' },
  { id: 'ai', name: 'AI 工具', icon: 'cpu' },
  { id: 'other', name: '其他工具', icon: 'more' },
];

const tools: Tool[] = [
  { id: 'pdf-viewer', name: 'PDF 预览器', description: '在线预览 PDF 文档，支持目录和阅读记忆', icon: 'eye', category: 'productivity' },
  { id: '3d-viewer', name: '3D 模型预览', description: '在线预览 GLB/GLTF 3D 模型', icon: 'box', category: 'design' },
  { id: 'sql-simulator', name: 'SQL 模拟器', description: '在线练习 SQL 查询语句', icon: 'database', category: 'dev' },
  { id: 'code-runner', name: '代码运行器', description: '在线运行各种代码片段', icon: 'play', category: 'dev' },
  { id: 'markdown-editor', name: 'Markdown 编辑器', description: '实时预览的 Markdown 编辑器', icon: 'file-text', category: 'dev' },
  { id: 'json-formatter', name: 'JSON 格式化', description: '格式化、验证 JSON 数据', icon: 'braces', category: 'dev' },
  { id: 'pdf-to-md', name: 'PDF 转 Markdown', description: '将 PDF 文档转换为 Markdown 格式', icon: 'file-type', category: 'dev' },
  { id: 'diff-checker', name: '文本对比', description: '对比两个文本的差异', icon: 'git-compare', category: 'dev' },
  // { id: 'color-picker', name: '颜色提取器', description: '从图片提取颜色主题', icon: 'pipette', category: 'design' },
  // { id: 'icon-finder', name: '图标查找器', description: '搜索和下载各类图标', icon: 'search', category: 'design' },
  // { id: 'url-encoder', name: 'URL 编码解码', description: 'URL 编码/解码工具', icon: 'link', category: 'productivity' },
  { id: 'base64', name: 'Base64 转换', description: 'Base64 编码解码工具', icon: 'binary', category: 'productivity' },
  { id: 'chatgpt', name: 'AI 对话', description: '与 AI 进行对话交流', icon: 'message-square', category: 'ai' },
  { id: 'image-editor', name: '图片编辑器', description: '在线图片编辑、滤镜与标注', icon: 'image', category: 'design' },
  { id: 'shader-toy', name: 'Shader 预览', description: '在线编写和预览 GLSL Shader 效果', icon: 'cube', category: 'design' },
  { id: 'qrcode', name: '二维码生成', description: '生成自定义二维码', icon: 'qr-code', category: 'other' },
];

const categoryIcons: Record<string, React.ReactElement> = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  code: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  palette: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="13.5" cy="6.5" r=".5" />
      <circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" />
      <circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  zap: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  cpu: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  more: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  ),
};

const toolIcons: Record<string, React.ReactElement> = {
  database: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  play: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  'file-text': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  braces: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" />
      <path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
    </svg>
  ),
  pipette: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m2 22 1-1h3l9-9" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4" />
      <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
    </svg>
  ),
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  key: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
  link: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  binary: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <line x1="6" y1="10" x2="6" y2="14" />
      <line x1="10" y1="10" x2="10" y2="14" />
      <line x1="14" y1="10" x2="14" y2="14" />
      <line x1="18" y1="10" x2="18" y2="14" />
    </svg>
  ),
  'message-square': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  image: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  'qr-code': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="3" height="3" />
      <rect x="18" y="14" width="3" height="3" />
      <rect x="14" y="18" width="3" height="3" />
      <rect x="18" y="18" width="3" height="3" />
    </svg>
  ),
  clock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  'git-compare': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 21V9a9 9 0 0 0 9 9" />
    </svg>
  ),
  'file-type': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  ),
  box: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  eye: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  cube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
};

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setIsLoading(true);
    setSelectedCategory(categoryId);
    setTimeout(() => setIsLoading(false), 150);
  }, []);

  const filteredTools = selectedCategory === 'all'
    ? tools
    : tools.filter(tool => tool.category === selectedCategory);

  return (
    <>
      <PageTitle title="工具箱" />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 sm:py-12">
          <h1 className="text-2xl sm:text-3xl md:text-5xl mb-6 sm:mb-12" style={{
            fontWeight: 900,
            fontFamily: 'var(--font-sans)',
            color: 'var(--foreground)'
          }}>
            工具箱
          </h1>

          {/* 移动端分类选择器 */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg"
              style={{
                background: 'white',
                border: '1px solid var(--border-color)',
                color: 'var(--foreground)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <span className="flex items-center gap-2">
                {categories.find(c => c.id === selectedCategory)?.name || '全部工具'}
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            
            {isMobileMenuOpen && (
              <div className="mt-2 p-2 rounded-lg" style={{
                background: 'white',
                border: '1px solid var(--border-color)',
              }}>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      handleCategoryChange(cat.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors"
                    style={{
                      background: selectedCategory === cat.id ? 'var(--foreground)' : 'transparent',
                      color: selectedCategory === cat.id ? 'white' : 'var(--foreground)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {categoryIcons[cat.icon]}
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
            {/* 左侧分类导航 - 桌面端 */}
            <div className="hidden md:block" style={{ width: '200px', flexShrink: 0 }}>
              <div style={{
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px'
              }}>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background: selectedCategory === cat.id ? 'var(--foreground)' : 'transparent',
                        color: selectedCategory === cat.id ? 'white' : 'var(--foreground)',
                        fontSize: '13px',
                        fontWeight: 500,
                        fontFamily: 'var(--font-sans)',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                      }}
                    >
                      {categoryIcons[cat.icon]}
                      {cat.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* 中间工具列表 */}
            <div style={{ flex: 1 }}>
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-neutral-200 border-t-orange-600 rounded-full animate-spin" />
                    <div className="text-xs font-mono text-neutral-400 tracking-widest uppercase">
                      Loading...
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredTools.map(tool => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      className="block p-3 sm:p-5 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'white',
                        border: '1px solid var(--border-color)',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-orange-800)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'var(--color-neutral-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '10px',
                        color: 'var(--foreground)',
                      }}>
                        {toolIcons[tool.icon]}
                      </div>
                      <h3 style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-sans)',
                        color: 'var(--foreground)',
                        margin: '0 0 4px 0',
                      }}>
                        {tool.name}
                      </h3>
                      <p style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--color-neutral-500)',
                        margin: 0,
                        lineHeight: '1.4',
                      }}>
                        {tool.description}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
