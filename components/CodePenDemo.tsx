"use client";

import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, PerspectiveCamera, OrthographicCamera, Html, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { themes } from 'prism-react-renderer';
import { Stats } from '@react-three/drei';
import * as fabric from 'fabric';

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
  ol
};

interface CodePenDemoProps {
  code: string;
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

export default function CodePenDemo({ code, title = "Live Demo", height = "400px" }: CodePenDemoProps) {
  // Ensure code is a string
  const codeString = typeof code === 'string' ? code : '';

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm flex flex-col md:flex-row h-[600px] md:h-[500px]">
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
        {/* Left/Top: Editor */}
        <div className="flex-1 flex flex-col min-h-[50%] md:min-h-0 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-700" style={{ backgroundColor: 'var(--hljs-bg)', color: 'var(--hljs-fg)' }}>
          <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
            <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-70">{title} - Editor</span>
            <div className="text-[10px] opacity-50">Editable</div>
          </div>
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
          <LiveError className="bg-red-900/80 text-red-200 p-4 text-xs font-mono overflow-auto max-h-[100px]" />
        </div>

        {/* Right/Bottom: Preview */}
        <div className="flex-1 flex flex-col bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden">
          <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black/50 text-white/70 text-[10px] rounded backdrop-blur-sm pointer-events-none">
            Live Preview
          </div>
          {/* Center the content */}
          <div className="flex-1 relative w-full h-full overflow-auto flex items-center justify-center p-4">
            <LivePreview className="flex justify-center items-center w-full" />
          </div>
        </div>
      </LiveProvider>
    </div>
  );
}
