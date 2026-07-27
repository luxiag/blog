'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

const categories = [
  { id: 'all', name: 'ALL_TOOLS', icon: 'grid' },
  { id: 'dev', name: 'DEV', icon: 'code' },
  { id: 'design', name: 'DESIGN', icon: 'palette' },
  { id: 'productivity', name: 'EFFICIENCY', icon: 'zap' },
  { id: 'other', name: 'OTHER', icon: 'more' },
];

const tools: Tool[] = [
  { id: 'pdf-viewer', name: 'PDF Viewer', description: '在线预览 PDF，支持目录与阅读记忆', icon: 'eye', category: 'productivity' },
  { id: '3d-viewer', name: '3D Viewer', description: '在线预览 GLB/GLTF 3D 模型', icon: 'box', category: 'design' },
  { id: 'sql-simulator', name: 'SQL Simulator', description: '在线练习 SQL 查询语句', icon: 'database', category: 'dev' },
  { id: 'code-runner', name: 'Code Runner', description: '在线运行 JS/TS/Python 代码片段', icon: 'play', category: 'dev' },
  { id: 'markdown-editor', name: 'Markdown Editor', description: '实时预览的 Markdown 编辑器', icon: 'file-text', category: 'dev' },
  { id: 'json-formatter', name: 'JSON Formatter', description: '格式化、验证、压缩 JSON 数据', icon: 'braces', category: 'dev' },
  { id: 'pdf-to-md', name: 'PDF → Markdown', description: '将 PDF 文档转换为 Markdown 格式', icon: 'file-type', category: 'dev' },
  { id: 'diff-checker', name: 'Diff Checker', description: '对比两个文本的差异', icon: 'git-compare', category: 'dev' },
  { id: 'base64', name: 'Base64 Converter', description: 'Base64 编码解码工具', icon: 'binary', category: 'productivity' },
  { id: 'image-editor', name: 'Image Editor', description: '在线图片编辑、滤镜与标注', icon: 'image', category: 'design' },
  { id: 'shader-toy', name: 'Shader Preview', description: '在线编写和预览 GLSL Shader', icon: 'cube', category: 'design' },
  { id: 'qrcode', name: 'QR Code Generator', description: '生成自定义二维码', icon: 'qr-code', category: 'other' },
  { id: 'xmind-viewer', name: 'XMind Viewer', description: '在线预览 XMind 思维导图文件', icon: 'mindmap', category: 'productivity' },
];

const toolIcons: Record<string, React.ReactElement> = {
  database: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>,
  play: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>,
  'file-text': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  braces: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" /><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" /></svg>,
  binary: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="2" /><line x1="6" y1="10" x2="6" y2="14" /><line x1="10" y1="10" x2="10" y2="14" /><line x1="14" y1="10" x2="14" y2="14" /><line x1="18" y1="10" x2="18" y2="14" /></svg>,
  image: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>,
  'qr-code': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="3" height="3" /><rect x="18" y="14" width="3" height="3" /><rect x="14" y="18" width="3" height="3" /><rect x="18" y="18" width="3" height="3" /></svg>,
  'git-compare': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 21V9a9 9 0 0 0 9 9" /></svg>,
  'file-type': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 15l2 2 4-4" /></svg>,
  box: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
  eye: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
  cube: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
  mindmap: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M12 2v4m0 12v4M2 12h4m12 0h4" /><path d="M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83m0-17.17l-2.83 2.83m-8.48 8.48l-2.83 2.83" /></svg>,
};

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const filteredTools = selectedCategory === 'all'
    ? tools
    : tools.filter(tool => tool.category === selectedCategory);

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 16px' }}>
        <div style={{ marginBottom: '48px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--foreground)',
              opacity: 0.5,
              textDecoration: 'none',
              marginBottom: '32px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5m7-7-7 7 7 7" />
            </svg>
            Back
          </Link>

          <h1 style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 900,
            fontSize: '64px',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: 'var(--foreground)',
            margin: '0 0 12px 0',
            background: 'repeating-linear-gradient(0deg, var(--foreground) 0px, var(--foreground) 4px, transparent 4px, transparent 8px)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            TOOLS
          </h1>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--foreground)',
            opacity: 0.4,
            margin: 0,
            lineHeight: 1.6,
          }}>
            browser-based utilities for developers &mdash; no install required
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '32px',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '4px',
          background: 'white',
          overflowX: 'auto',
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                background: selectedCategory === cat.id ? 'var(--foreground)' : 'transparent',
                color: selectedCategory === cat.id ? 'white' : 'var(--foreground)',
                fontSize: '11px',
                fontWeight: 500,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {filteredTools.map(tool => {
            const isHovered = hoveredTool === tool.id;
            return (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                style={{
                  display: 'block',
                  background: 'white',
                  border: `1px solid ${isHovered ? '#ea580c' : 'var(--border-color)'}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderBottom: '1px solid var(--border-color)',
                  background: '#f5f5f5',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--foreground)',
                    opacity: 0.4,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>
                    {tool.category}
                  </span>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    border: `1px solid ${isHovered ? '#ea580c' : 'var(--border-color)'}`,
                    background: isHovered ? '#ea580c' : 'white',
                    transition: 'all 0.2s',
                  }} />
                </div>

                <div style={{ padding: '20px 24px 24px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: `1px dashed ${isHovered ? '#ea580c' : 'var(--border-color)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'white',
                    position: 'relative',
                    marginBottom: '16px',
                    transition: 'border-color 0.2s',
                  }}>
                    <div style={{
                      position: 'absolute',
                      width: '75%',
                      height: '75%',
                      borderRadius: '50%',
                      border: `1px solid ${isHovered ? '#ea580c40' : 'var(--border-color)'}`,
                      background: 'white',
                      transition: 'border-color 0.2s',
                    }} />
                    <span style={{ position: 'relative', zIndex: 1, color: isHovered ? '#ea580c' : 'var(--foreground)', transition: 'color 0.2s' }}>
                      {toolIcons[tool.icon]}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    margin: '0 0 6px 0',
                  }}>
                    {tool.name}
                  </h3>

                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--foreground)',
                    opacity: 0.4,
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                    {tool.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div style={{
          marginTop: '48px',
          padding: '24px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--foreground)',
            opacity: 0.3,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {filteredTools.length} tools available
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--foreground)',
            opacity: 0.3,
          }}>
            ◆
          </span>
        </div>
      </div>
    </div>
  );
}
