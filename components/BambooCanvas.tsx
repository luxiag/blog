'use client';

import { useEffect, useRef } from 'react';

interface Segment {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  maxWidth: number;
  maxHeight: number;
  growthProgress: number;
  swayOffset: number;
}

interface Leaf {
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  growthProgress: number;
  opacity: number;
  color: string;
}

interface Branch {
  segments: Segment[];
  leaves: Leaf[];
  x: number;
  maxHeight: number;
  completed: boolean;
  swayPhase: number;
  side: 'left' | 'right';
}

export default function BambooCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const branchesRef = useRef<Branch[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      initBranches();
    };

    const initBranches = () => {
      branchesRef.current = [];
      
      // 左侧竹子
      const leftCount = 4 + Math.floor(Math.random() * 2);
      for (let i = 0; i < leftCount; i++) {
        branchesRef.current.push({
          segments: [],
          leaves: [],
          x: 30 + Math.random() * 50,
          maxHeight: 180 + Math.random() * 280,
          completed: false,
          swayPhase: Math.random() * Math.PI * 2,
          side: 'left',
        });
      }
      
      // 右侧竹子
      const rightCount = 4 + Math.floor(Math.random() * 2);
      for (let i = 0; i < rightCount; i++) {
        branchesRef.current.push({
          segments: [],
          leaves: [],
          x: window.innerWidth - (30 + Math.random() * 50),
          maxHeight: 180 + Math.random() * 280,
          completed: false,
          swayPhase: Math.random() * Math.PI * 2,
          side: 'right',
        });
      }
    };

    const drawInkStroke = (
      ctx: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      width: number,
      opacity: number
    ) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      ctx.save();
      ctx.translate(x1, y1);
      ctx.rotate(angle);

      const segments = 5 + Math.floor(Math.random() * 3);
      for (let i = 0; i < segments; i++) {
        const t = i / segments;
        const tNext = (i + 1) / segments;
        const xStart = t * length + (Math.random() - 0.5) * width * 0.2;
        const xEnd = tNext * length + (Math.random() - 0.5) * width * 0.2;
        const w = width * (1 - t * 0.3) * (0.8 + Math.random() * 0.4);

        const gradient = ctx.createLinearGradient(xStart, 0, xEnd, 0);
        gradient.addColorStop(0, `rgba(20, 20, 20, ${opacity * (0.3 + Math.random() * 0.2)})`);
        gradient.addColorStop(0.5, `rgba(40, 40, 40, ${opacity * (0.5 + Math.random() * 0.2)})`);
        gradient.addColorStop(1, `rgba(60, 60, 60, ${opacity * (0.2 + Math.random() * 0.2)})`);

        ctx.beginPath();
        ctx.moveTo(xStart, -w / 2);
        ctx.quadraticCurveTo(
          (xStart + xEnd) / 2 + (Math.random() - 0.5) * w * 0.3,
          0,
          xEnd,
          -w * 0.4 * (1 - tNext)
        );
        ctx.lineTo(xEnd, w * 0.4 * (1 - tNext));
        ctx.quadraticCurveTo(
          (xStart + xEnd) / 2 + (Math.random() - 0.5) * w * 0.3,
          0,
          xStart,
          w / 2
        );
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      ctx.restore();
    };

    const drawLeaf = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      angle: number,
      length: number,
      width: number,
      opacity: number,
      color: string
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      const leafGradient = ctx.createLinearGradient(0, 0, length, 0);
      leafGradient.addColorStop(0, color.replace(')', `, ${opacity})`).replace('rgb', 'rgba'));
      leafGradient.addColorStop(0.6, color.replace(')', `, ${opacity * 0.7})`).replace('rgb', 'rgba'));
      leafGradient.addColorStop(1, color.replace(')', `, 0)`).replace('rgb', 'rgba'));

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(length * 0.3, -width * 0.3, length * 0.7, -width * 0.5);
      ctx.quadraticCurveTo(length * 0.9, -width * 0.2, length, 0);
      ctx.quadraticCurveTo(length * 0.9, width * 0.2, length * 0.7, width * 0.5);
      ctx.quadraticCurveTo(length * 0.3, width * 0.3, 0, 0);
      ctx.fillStyle = leafGradient;
      ctx.fill();

      ctx.restore();
    };

    const updateBranch = (branch: Branch, deltaTime: number) => {
      if (branch.completed) return;

      const lastSegment = branch.segments[branch.segments.length - 1];

      if (!lastSegment || branch.segments.length < 18) {
        const startY = branch.segments.length === 0
          ? window.innerHeight
          : lastSegment.y;

        if (startY - branch.maxHeight > window.innerHeight - branch.maxHeight) {
          const newSegment: Segment = {
            x: branch.x + (Math.random() - 0.5) * 8,
            y: startY,
            width: lastSegment ? lastSegment.width * 0.93 : 6 + Math.random() * 3,
            height: 12 + Math.random() * 8,
            opacity: 0,
            maxWidth: lastSegment ? lastSegment.width * 0.93 : 6 + Math.random() * 3,
            maxHeight: 12 + Math.random() * 8,
            growthProgress: 0,
            swayOffset: Math.random() * Math.PI * 2,
          };
          branch.segments.push(newSegment);
        } else {
          branch.completed = true;
          addLeaves(branch);
        }
      } else {
        branch.completed = true;
        addLeaves(branch);
      }

      branch.segments.forEach((segment) => {
        if (segment.growthProgress < 1) {
          segment.growthProgress += deltaTime * 0.25 * (0.5 + Math.random() * 0.5);
          segment.growthProgress = Math.min(segment.growthProgress, 1);
          segment.opacity = segment.growthProgress;
        }
      });

      branch.leaves.forEach((leaf) => {
        if (leaf.growthProgress < 1) {
          leaf.growthProgress += deltaTime * 0.35;
          leaf.growthProgress = Math.min(leaf.growthProgress, 1);
          leaf.opacity = leaf.growthProgress * 0.75;
        }
      });
    };

    const addLeaves = (branch: Branch) => {
      const leafCount = 2 + Math.floor(Math.random() * 3);
      const segmentCount = branch.segments.length;

      for (let i = 0; i < leafCount; i++) {
        const segmentIndex = Math.floor(Math.random() * segmentCount);
        const segment = branch.segments[segmentIndex];
        if (!segment) continue;

        const side = branch.side === 'left' ? 1 : -1;
        const leaf: Leaf = {
          x: segment.x + side * segment.width / 2,
          y: segment.y + Math.random() * segment.height,
          angle: side * (0.3 + Math.random() * 0.4),
          length: 15 + Math.random() * 25,
          width: 2 + Math.random() * 3,
          growthProgress: 0,
          opacity: 0,
          color: `rgb(${25 + Math.floor(Math.random() * 20)}, ${45 + Math.floor(Math.random() * 25)}, ${25 + Math.floor(Math.random() * 20)})`,
        };
        branch.leaves.push(leaf);
      }
    };

    const draw = (timestamp: number) => {
      const deltaTime = (timestamp - timeRef.current) / 1000;
      timeRef.current = timestamp;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      branchesRef.current.forEach((branch) => {
        updateBranch(branch, deltaTime);
      });

      branchesRef.current.forEach((branch) => {
        const sway = Math.sin(timestamp * 0.0008 + branch.swayPhase) * 2;

        branch.segments.forEach((segment, index) => {
          const prevSegment = branch.segments[index - 1];
          const targetWidth = segment.maxWidth * (1 - index / branch.segments.length * 0.5);
          const swayOffset = sway * (1 - index / branch.segments.length);

          if (index === 0) {
            drawInkStroke(
              ctx,
              segment.x + swayOffset,
              segment.y,
              segment.x + swayOffset,
              segment.y - segment.maxHeight * segment.growthProgress,
              segment.maxWidth * segment.growthProgress,
              segment.opacity * 0.85
            );
          } else {
            drawInkStroke(
              ctx,
              prevSegment.x + sway * (1 - (index - 1) / branch.segments.length),
              prevSegment.y,
              segment.x + swayOffset,
              segment.y - segment.maxHeight * segment.growthProgress,
              targetWidth * segment.growthProgress,
              segment.opacity * 0.85
            );
          }
        });

        branch.leaves.forEach((leaf) => {
          drawLeaf(
            ctx,
            leaf.x,
            leaf.y,
            leaf.angle,
            leaf.length * leaf.growthProgress,
            leaf.width * leaf.growthProgress,
            leaf.opacity,
            leaf.color
          );
        });
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}
