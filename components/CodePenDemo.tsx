"use client";

import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { themes } from 'prism-react-renderer';

// Define the scope available to the code
const scope = {
  React,
  ...React, // useState, useRef, etc.
  Canvas,
  useFrame,
  useThree,
  THREE,
  OrbitControls,
  PerspectiveCamera,
};

interface CodePenDemoProps {
  code: string;
  title?: string;
  height?: string;
}

export default function CodePenDemo({ code, title = "Live Demo", height = "400px" }: CodePenDemoProps) {
  return (
    <div className="my-8 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm flex flex-col md:flex-row h-[600px] md:h-[500px]">
      <LiveProvider code={code} scope={scope} theme={themes.vsDark} noInline={true}>
        {/* Left/Top: Editor */}
        <div className="flex-1 flex flex-col min-h-[50%] md:min-h-0 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-700 bg-[#1e1e1e]">
          <div className="px-4 py-2 bg-[#252526] border-b border-[#333] flex justify-between items-center">
            <span className="text-xs font-mono text-neutral-400 font-bold uppercase tracking-wider">{title} - Editor</span>
            <div className="text-[10px] text-neutral-500">Editable</div>
          </div>
          <div className="flex-1 overflow-auto relative font-mono text-sm">
             <LiveEditor 
                style={{
                  fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                  fontSize: 14,
                  minHeight: '100%',
                }}
             />
          </div>
          <LiveError className="bg-red-900/80 text-red-200 p-4 text-xs font-mono overflow-auto max-h-[100px]" />
        </div>

        {/* Right/Bottom: Preview */}
        <div className="flex-1 flex flex-col bg-neutral-50 dark:bg-black relative">
           <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black/50 text-white/70 text-[10px] rounded backdrop-blur-sm pointer-events-none">
              Live Preview
           </div>
           <div className="flex-1 relative">
             <LivePreview className="w-full h-full" />
           </div>
        </div>
      </LiveProvider>
    </div>
  );
}
