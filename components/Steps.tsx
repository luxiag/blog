"use client";

import React from 'react';

interface StepsProps {
  children: React.ReactNode;
}

function getHeadingInfo(child: React.ReactNode): { level: number; text: string } | null {
  if (!React.isValidElement(child)) return null;

  const type = child.type;
  const typeStr = typeof type === 'string' ? type : (type as any).displayName || (type as any).name || '';

  const match = typeStr.match(/^h([2-6])$/i);
  if (!match) return null;

  let text = '';
  const extract = (node: React.ReactNode): void => {
    if (typeof node === 'string') text += node;
    else if (typeof node === 'number') text += String(node);
    else if (Array.isArray(node)) node.forEach(extract);
    else if (React.isValidElement(node) && (node.props as Record<string, unknown>)?.children) extract((node.props as Record<string, unknown>).children as React.ReactNode);
  };
  extract((child.props as any)?.children);

  return { level: parseInt(match[1]), text };
}

interface StepBlock {
  index: number;
  heading: React.ReactElement;
  headingInfo: { level: number; text: string };
  content: React.ReactNode[];
}

export default function Steps({ children }: StepsProps) {
  const childArray = React.Children.toArray(children);

  const steps: StepBlock[] = [];
  let currentStep: StepBlock | null = null;

  childArray.forEach((child, i) => {
    const headingInfo = getHeadingInfo(child);
    if (headingInfo) {
      currentStep = {
        index: steps.length + 1,
        heading: child as React.ReactElement,
        headingInfo,
        content: [],
      };
      steps.push(currentStep);
    } else if (currentStep) {
      currentStep.content.push(child);
    }
  });

  return (
    <div className="my-8 space-y-4">
      {steps.map((step) => (
        <div
          key={step.index}
          className="relative rounded-xl border border-neutral-200/80 dark:border-neutral-700/60 overflow-hidden bg-white dark:bg-neutral-900/50"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50/80 dark:bg-neutral-800/40 border-b border-neutral-200/60 dark:border-neutral-700/40">
            <span className="shrink-0 w-7 h-7 rounded-full bg-[#ea580c] text-white flex items-center justify-center text-[0.6875rem] font-mono font-bold">
              {step.index}
            </span>
            <span className="text-[0.9375rem] font-semibold text-neutral-800 dark:text-neutral-200 font-sans">
              {(step.heading.props as Record<string, unknown>).children as React.ReactNode}
            </span>
          </div>
          {step.content.length > 0 && (
            <div className="px-5 py-4 [&_pre]:my-0 font-sans text-neutral-800 dark:text-neutral-300 steps-content">
              {step.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
