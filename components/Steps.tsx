"use client";

import React, { useEffect } from 'react';

interface StepsProps {
  children: React.ReactNode;
}

type HeadingElement = React.ReactElement<{
  children?: React.ReactNode;
  className?: string;
}>;

interface StepBlock {
  heading: HeadingElement;
  content: React.ReactNode[];
}

function flattenTransparentChildren(children: React.ReactNode): React.ReactNode[] {
  const result: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (child === null || child === undefined || typeof child === 'boolean') return;

    if (React.isValidElement(child) && child.type === React.Fragment) {
      const fragmentProps = child.props as { children?: React.ReactNode };
      result.push(...flattenTransparentChildren(fragmentProps.children));
    } else {
      result.push(child);
    }
  });

  return result;
}

function getHeadingLevel(child: React.ReactNode): number | null {
  if (!React.isValidElement(child)) return null;
  if (typeof child.type === 'string') {
    const match = child.type.match(/^h([2-6])$/i);
    return match ? Number(match[1]) : null;
  }

  const component = child.type as {
    displayName?: string;
    name?: string;
    mdxHeadingLevel?: number;
  };
  if (component.mdxHeadingLevel) return component.mdxHeadingLevel;

  const match = (component.displayName || component.name || '').match(/^h([2-6])$/i);
  return match ? Number(match[1]) : null;
}

function hasVisibleContent(nodes: React.ReactNode[]): boolean {
  return nodes.some((node) => typeof node !== 'string' || node.trim() !== '');
}

export default function Steps({ children }: StepsProps) {
  const childArray = flattenTransparentChildren(children);
  const firstHeading = childArray
    .map((child) => ({ child, level: getHeadingLevel(child) }))
    .find(({ level }) => level !== null);
  const stepLevel = firstHeading?.level ?? null;
  const introduction: React.ReactNode[] = [];
  const steps: StepBlock[] = [];
  let currentStep: StepBlock | null = null;

  for (const child of childArray) {
    const headingLevel = getHeadingLevel(child);
    if (stepLevel !== null && headingLevel === stepLevel) {
      currentStep = {
        heading: child as HeadingElement,
        content: [],
      };
      steps.push(currentStep);
    } else if (currentStep) {
      currentStep.content.push(child);
    } else {
      introduction.push(child);
    }
  }

  const hasIntroduction = hasVisibleContent(introduction);
  const emptyStepCount = steps.filter((step) => !hasVisibleContent(step.content)).length;

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (childArray.length > 0 && stepLevel === null) {
      console.warn('Steps 未找到步骤标题，将原样显示内容。请使用直接同级的 Markdown 标题。');
    }
    if (hasIntroduction) {
      console.warn('Steps 的第一个步骤标题前存在内容，该内容将作为步骤说明显示。');
    }
    if (emptyStepCount > 0) {
      console.warn(`Steps 包含 ${emptyStepCount} 个没有正文内容的步骤。`);
    }
  }, [childArray.length, emptyStepCount, hasIntroduction, stepLevel]);

  if (childArray.length === 0) return null;
  if (stepLevel === null) {
    return <div className="steps-fallback my-8">{childArray}</div>;
  }

  return (
    <div className="steps-timeline-wrap my-8">
      {hasIntroduction && <div className="steps-intro">{introduction}</div>}
      <ol className="steps-timeline" role="list">
        {steps.map((step, index) => {
          const originalClassName = step.heading.props.className;
          const heading = React.cloneElement(step.heading, {
            className: [originalClassName, 'steps-heading'].filter(Boolean).join(' '),
          });

          return (
            <li className="steps-item" key={step.heading.key ?? index}>
              <span className="steps-marker" aria-hidden="true">
                {index + 1}
              </span>
              <div className="steps-main">
                <span className="sr-only">步骤 {index + 1}，共 {steps.length} 步。</span>
                {heading}
                {hasVisibleContent(step.content) && (
                  <div className="steps-body">{step.content}</div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
