"use client";

import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, PerspectiveCamera, Stats, OrthographicCamera, Html, Environment, MeshReflectorMaterial, Float, Sphere, Stars,ContactShadows } from '@react-three/drei';
import { themes } from 'prism-react-renderer';
import * as fabric from 'fabric';
import { DepthOfField, Pixelation, Noise, Vignette, EffectComposer, Bloom, ChromaticAberration, Scanline,SMAA,BrightnessContrast  } from '@react-three/postprocessing'

// OpenLayers imports
import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import Feature from 'ol/Feature';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
import * as proj from 'ol/proj';
import * as geom from 'ol/geom';
import * as style from 'ol/style';
import * as interaction from 'ol/interaction';
import * as format from 'ol/format';
import * as sphere from 'ol/sphere';
import 'ol/ol.css';

// Cesium imports
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Configure Cesium Base URL for CDN access
if (typeof window !== 'undefined') {
  (window as any).CESIUM_BASE_URL = 'https://unpkg.com/cesium@latest/Build/Cesium/';
}

// Construct the ol namespace object
const ol = {
  Map,
  View,
  Overlay,
  Feature,
  layer,
  source,
  proj,
  geom,
  style,
  interaction,
  format,
  sphere
};

// Define the scope available to the code
const scope = {
  React,
  // Explicitly expose common hooks
  useState: React.useState,
  useRef: React.useRef,
  useEffect: React.useEffect,
  useMemo: React.useMemo,
  useCallback: React.useCallback,
  useLayoutEffect: React.useLayoutEffect,
  Canvas,
  useFrame,
  useThree,
  THREE,
  OrbitControls,
  PerspectiveCamera,
  OrthographicCamera,
  Html,
  Environment,
  ContactShadows,
  EffectComposer,
  Bloom,
  Stats,
  fabric,
  ol,
  Cesium,
  DepthOfField,
  Pixelation, Noise, Vignette, ChromaticAberration, Scanline,SMAA,BrightnessContrast ,
  MeshReflectorMaterial, Float, Sphere,Stars
};

interface CodePenDemoProps {
  children?: React.ReactNode;
  code?: string;
  title?: string;
  height?: string;
}

// Custom theme using CSS variables from code-highlight.css
const codeHighlightTheme = {
  plain: {
    color: 'var(--hljs-fg)',
    backgroundColor: 'transparent',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: 'var(--hljs-comment)' },
    },
    {
      types: ['punctuation'],
      style: { color: 'var(--hljs-operator)' },
    },
    {
      types: ['namespace'],
      style: { opacity: 0.7 },
    },
    {
      types: ['tag', 'operator', 'number'],
      style: { color: 'var(--hljs-number)' },
    },
    {
      types: ['property', 'function'],
      style: { color: 'var(--hljs-function)' },
    },
    {
      types: ['tag-id', 'selector', 'atrule-id'],
      style: { color: 'var(--hljs-symbol)' },
    },
    {
      types: ['attr-name'],
      style: { color: 'var(--hljs-attribute)' },
    },
    {
      types: ['boolean', 'string', 'entity', 'url', 'attr-value', 'keyword', 'control', 'directive', 'unit', 'statement', 'regex', 'at-rule', 'placeholder', 'variable'],
      style: { color: 'var(--hljs-keyword)' },
    },
    {
      types: ['tag'],
      style: { color: 'var(--hljs-tag)' }
    },
    {
      types: ['attr-value'],
      style: { color: 'var(--hljs-string)' }
    }
  ],
};

export default function CodePenDemo({ children, code, title = "Live Demo", height = "400px" }: CodePenDemoProps) {
  const [activeTab, setActiveTab] = React.useState<'preview' | 'code'>('preview');


  const codeString = React.useMemo(() => {
    if (code) return code.trim();

    if (children) {
      const extractText = (node: any): string => {
        if (!node) return "";
        // 如果是纯文本
        if (typeof node === "string") return node;
        if (typeof node === "number") return String(node);

        // 如果是数组（MDX 常将代码块分成多行 span）
        if (Array.isArray(node)) {
          return node.map(extractText).join("");
        }

        // 如果是 React 元素 (如 <pre>, <code>, <span>)
        if (React.isValidElement(node)) {
          const props = node.props as any;
          // 排除掉可能存在的语言标签文本（如 "jsx"）
          if (props.className?.includes('language-')) {
            // 有些解析器会把 "jsx" 作为第一个子元素，这里视情况处理
          }
          return extractText(props.children);
        }
        return "";
      };

      const text = extractText(children);

      // 清理 Markdown 代码块残留的符号
      return text
        .replace(/^```[a-z]*\n/i, "") // 移除开头的 ```jsx
        .replace(/\n```$/g, "")      // 移除结尾的 ```
        .trim();
    }
    return "";
  }, [children, code]);

  return (
    <div
      className="my-8 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm flex flex-col"
      style={{ height }}
    >
      <LiveProvider
        code={codeString}
        scope={scope}
        theme={codeHighlightTheme as any}
        language="jsx"
        noInline={true}
        transformCode={(code) => {
          // Remove imports as they are not supported in react-live
          return code.replace(/import\s+.*?from\s+['"].*?['"];?/g, '');
        }}
      >
        {/* Header / Tabs */}
        <div className="flex items-center border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <div className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider opacity-70 flex items-center">
            {title}
          </div>
          <div className="flex-1" />
          <div className="flex">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-xs font-medium transition-colors border-l border-neutral-200 dark:border-neutral-700 ${activeTab === 'preview'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50'
                }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 text-xs font-medium transition-colors border-l border-neutral-200 dark:border-neutral-700 ${activeTab === 'code'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50'
                }`}
            >
              Code
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Preview Tab */}
          <div
            className={`absolute inset-0 flex flex-col bg-neutral-100 dark:bg-neutral-900 overflow-hidden transition-opacity duration-200 ${activeTab === 'preview' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
          >
            <div className="flex-1 relative w-full h-full overflow-auto flex items-center justify-center p-4">
              <LivePreview className="flex justify-center items-center w-full h-full" />
            </div>
            {/* Error overlay at bottom */}
            <LiveError className="absolute bottom-0 left-0 right-0 max-h-[200px] overflow-auto bg-red-900/90 text-red-100 p-3 text-xs font-mono backdrop-blur-sm border-t border-red-700" />
          </div>

          {/* Editor Tab */}
          <div
            className={`absolute inset-0 flex flex-col bg-white dark:bg-neutral-900 transition-opacity duration-200 ${activeTab === 'code' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            style={{ backgroundColor: 'var(--hljs-bg)', color: 'var(--hljs-fg)' }}
          >
            <div className="flex-1 overflow-auto relative font-mono text-sm code-pen-editor">
              <LiveEditor
                className="min-h-full"
                style={{
                  fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                  fontSize: 14,
                  backgroundColor: 'transparent',
                }}
              />
            </div>
            {/* Show error in editor too if needed, but LiveError component handles it, maybe confusing to have duplicates. 
                 react-live LiveError only renders if there is an error.
             */}
            <LiveError className="shrink-0 max-h-[100px] overflow-auto bg-red-900/90 text-red-100 p-2 text-xs font-mono border-t border-red-700" />
          </div>
        </div>
      </LiveProvider>
    </div>
  );
}
