"use client";

import React, { useState } from 'react';
import { ChevronRight, File, Folder, FolderOpen } from 'lucide-react';

interface FileTreeItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileTreeItem[];
  comment?: string;
}

interface FileTreeProps {
  tree: FileTreeItem[];
}

function FolderItem({ item, depth = 0 }: { item: FileTreeItem; depth?: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className="flex items-center gap-1.5 w-full py-[3px] px-1.5 rounded text-left hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors group"
        style={{ paddingLeft: `${depth * 16 + 6}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronRight
          className={`w-3 h-3 text-neutral-400 dark:text-neutral-500 transition-transform duration-150 shrink-0 ${isOpen ? 'rotate-90' : ''}`}
        />
        {isOpen ? (
          <FolderOpen className="w-3.5 h-3.5 text-[#ea580c]/70 shrink-0" />
        ) : (
          <Folder className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
        )}
        <span className="text-[0.8125rem] font-mono text-neutral-700 dark:text-neutral-300">{item.name}</span>
        {item.comment && (
          <span className="ml-2 text-[0.75rem] font-sans text-neutral-400 dark:text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">
            — {item.comment}
          </span>
        )}
      </button>
      {isOpen && item.children && (
        <div>
          {item.children.map((child, i) =>
            child.type === 'folder' ? (
              <FolderItem key={i} item={child} depth={depth + 1} />
            ) : (
              <FileItem key={i} item={child} depth={depth + 1} />
            )
          )}
        </div>
      )}
    </div>
  );
}

function FileItem({ item, depth }: { item: FileTreeItem; depth: number }) {
  return (
    <div
      className="flex items-center gap-1.5 py-[3px] group"
      style={{ paddingLeft: `${depth * 16 + 6}px` }}
    >
      <span className="w-3 shrink-0" />
      <File className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
      <span className="text-[0.8125rem] font-mono text-neutral-600 dark:text-neutral-400">{item.name}</span>
      {item.comment && (
        <span className="ml-2 text-[0.75rem] font-sans text-neutral-400 dark:text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">
          — {item.comment}
        </span>
      )}
    </div>
  );
}

export default function FileTree({ tree }: FileTreeProps) {
  return (
    <div className="my-6 rounded-xl border border-neutral-200/80 dark:border-neutral-700/60 overflow-hidden bg-white dark:bg-neutral-900/50">
      <div className="px-3 py-3">
        {tree.map((item, i) =>
          item.type === 'folder' ? (
            <FolderItem key={i} item={item} depth={0} />
          ) : (
            <FileItem key={i} item={item} depth={0} />
          )
        )}
      </div>
    </div>
  );
}
