'use client';

import { useEffect, useRef } from 'react';

// --- Types ---

interface Leaf {
  relX: number; // 0..1 along branch
  relY: number; // Offset perpendicular to branch
  angle: number;
  length: number;
  width: number;
  growthProgress: number;
  opacity: number;
  color: string;
  targetLength: number;
  swaySpeed: number;
  swayPhase: number;
}

interface Branch {
  // Attached to a specific segment
  attachLevel: number; // 0..1 height of segment
  angle: number;
  length: number;
  targetLength: number;
  width: number;
  growthProgress: number;
  leaves: Leaf[];
  curve: number;
  side: -1 | 1;
}

interface Segment {
  id: number;
  yBottomRel: number; // Relative to bamboo base Y (negative usually, growing up)
  height: number;
  width: number;
  opacity: number;
  growthProgress: number;
  colorStops: { pos: number; color: string }[];
  branches: Branch[];
  
  // Node style
  nodeType: 'thick' | 'double' | 'simple';
  nodeWidthScale: number; // Multiplier for width at node
}

interface Bamboo {
  x: number;
  yBase: number; // Screen Y coordinate of base
  targetHeight: number;
  segments: Segment[];
  completed: boolean;
  
  // Growth & Shape
  growthSpeed: number;
  leanAngle: number; // Overall lean angle (radians)
  curveStrength: number; // How much it bends as it grows
  
  // Sway
  swayPhase: number;
  swaySpeed: number;
  
  side: 'left' | 'right';
  depth: number; // 0..1, 1 is front, 0 is back (affects scale/color)
}

export default function BambooRuler({ children }: { children: React.ReactNode }) {
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const leftBamboosRef = useRef<Bamboo[]>([]);
  const rightBamboosRef = useRef<Bamboo[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    // --- Utils ---
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    
    // Ink color generation
    const getInkColor = (opacity: number, depth: number, type: 'wet' | 'dry' = 'wet') => {
      // Depth 1 (front) = darker/richer. Depth 0 (back) = lighter/faded.
      const depthFactor = 0.5 + depth * 0.5;
      const baseV = rand(10, 40); // Dark base
      
      // Tint
      const r = baseV + rand(-5, 5);
      const g = baseV + rand(-5, 5);
      const b = baseV + rand(-5, 5);
      
      // Calculate alpha
      let a = opacity * depthFactor;
      if (type === 'dry') a *= 0.8;
      
      // Background bamboos are lighter/mistier
      if (depth < 0.5) {
         return `rgba(${Math.floor(r + 80)}, ${Math.floor(g + 90)}, ${Math.floor(b + 80)}, ${a * 0.6})`;
      }
      
      return `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${a})`;
    };

    // --- Drawing ---

    const drawLeaf = (ctx: CanvasRenderingContext2D, leaf: Leaf, x: number, y: number, angle: number) => {
      if (leaf.growthProgress <= 0.01) return;
      
      const len = leaf.targetLength * leaf.growthProgress;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(len * 0.3, -leaf.width, len, 0);
      ctx.quadraticCurveTo(len * 0.4, leaf.width, 0, 0);
      ctx.fillStyle = leaf.color;
      ctx.fill();
      ctx.restore();
    };

    const drawBranch = (
      ctx: CanvasRenderingContext2D, 
      branch: Branch, 
      startX: number, 
      startY: number, 
      parentAngle: number,
      globalSway: number
    ) => {
      if (branch.growthProgress <= 0.01) return;
      
      const len = branch.targetLength * branch.growthProgress;
      const w = branch.width * (1 - branch.growthProgress * 0.3); // Taper
      
      // Branch angle relative to parent bamboo angle
      const absAngle = parentAngle + branch.angle + (globalSway * 0.5); 
      
      const endX = startX + Math.cos(absAngle) * len;
      const endY = startY + Math.sin(absAngle) * len + (branch.curve * len * 0.2); // Gravity curve
      
      // Draw Stem
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      // Control point for quadratic curve
      const cpX = (startX + endX) / 2;
      const cpY = (startY + endY) / 2 - (branch.curve * 10);
      
      ctx.quadraticCurveTo(cpX, cpY, endX, endY);
      ctx.strokeStyle = `rgba(20, 25, 20, ${0.85 * branch.growthProgress})`;
      ctx.lineWidth = w;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Draw Leaves
      // Calculate points along the curve for leaves
      branch.leaves.forEach(leaf => {
          const t = leaf.relX;
          // Point on quadratic bezier
          const mt = 1-t;
          const lx = mt*mt*startX + 2*mt*t*cpX + t*t*endX;
          const ly = mt*mt*startY + 2*mt*t*cpY + t*t*endY;
          
          // Leaf angle follows branch tangent roughly + random
          // Tangent approx:
          const tx = 2*(1-t)*(cpX-startX) + 2*t*(endX-cpX);
          const ty = 2*(1-t)*(cpY-startY) + 2*t*(endY-cpY);
          const tangentAngle = Math.atan2(ty, tx);
          
          const leafSway = Math.sin(Date.now() * 0.002 * leaf.swaySpeed + leaf.swayPhase) * 0.15;
          
          drawLeaf(ctx, leaf, lx, ly, tangentAngle + leaf.angle + leafSway);
      });
    };

    const drawBamboo = (ctx: CanvasRenderingContext2D, b: Bamboo, ts: number) => {
      // Base Sway
      const swayBase = Math.sin(ts * 0.001 * b.swaySpeed + b.swayPhase) * (b.targetHeight * 0.005);
      
      let curX = b.x;
      let curY = b.yBase;
      let curAngle = -Math.PI / 2 + b.leanAngle; // Upwards + lean

      // Iterate segments from bottom to top
      for (let i = 0; i < b.segments.length; i++) {
        const seg = b.segments[i];
        if (seg.growthProgress <= 0.001) break;
        
        const drawH = seg.height * seg.growthProgress;
        
        // Apply curve strength to angle as we go up
        // Some curve left, some right
        curAngle += b.curveStrength * 0.02 * (i / (b.targetHeight / 50)); 
        
        // Sway adds to angle
        const swayAngle = Math.cos(ts * 0.0015 + b.swayPhase + i * 0.2) * 0.02 * (i / 5);
        const finalAngle = curAngle + swayAngle;

        // Calculate Top position
        const topX = curX + Math.cos(finalAngle) * drawH;
        const topY = curY + Math.sin(finalAngle) * drawH;
        
        // Draw Segment
        ctx.save();
        
        // Translate to base of segment and rotate
        ctx.translate(curX, curY);
        ctx.rotate(finalAngle + Math.PI/2); // Rotate so drawing up is 0deg relative
        
        // Draw Rect-ish body
        // We draw from (0,0) up to (0, -drawH)
        const w = seg.width;
        
        const grad = ctx.createLinearGradient(-w/2, 0, w/2, 0);
        seg.colorStops.forEach(s => grad.addColorStop(s.pos, s.color));
        ctx.fillStyle = grad;
        ctx.fillRect(-w/2, -drawH, w, drawH);
        
        ctx.restore();
        
        // Draw Node/Joint at the TOP of this segment
        // Ink style: darker, wider
        if (seg.growthProgress > 0.9) {
           ctx.save();
           ctx.translate(topX, topY);
           ctx.rotate(finalAngle + Math.PI/2);
           
           ctx.fillStyle = `rgba(10, 15, 10, ${seg.opacity * 0.9})`;
           const nodeW = w * seg.nodeWidthScale;
           const nodeH = 3 + w * 0.15;
           
           // Varied node shapes
           if (seg.nodeType === 'double') {
             // Two lines
             ctx.fillRect(-nodeW/2, -nodeH/2 - 1, nodeW, 1.5);
             ctx.fillRect(-nodeW/2, -nodeH/2 + 1, nodeW, 1.5);
           } else if (seg.nodeType === 'thick') {
             // One thick bulging line
             ctx.beginPath();
             ctx.ellipse(0, 0, nodeW/2, nodeH/2, 0, 0, Math.PI*2);
             ctx.fill();
           } else {
             // Simple line
             ctx.fillRect(-nodeW/2, -1, nodeW, 2);
           }
           
           ctx.restore();
        }

        // Draw Branches attached to this segment (usually near top)
        if (seg.growthProgress > 0.8) {
           seg.branches.forEach(br => {
             // Attach point
             const attachDist = drawH * br.attachLevel; // distance from bottom of seg
             // Need absolute coords for attach point
             // Re-calculate or approximate
             const ax = curX + Math.cos(finalAngle) * attachDist;
             const ay = curY + Math.sin(finalAngle) * attachDist;
             
             drawBranch(ctx, br, ax, ay, finalAngle, swayAngle);
           });
        }
        
        // Advance cursor
        curX = topX;
        curY = topY;
        
        // Gap
        const GAP = 2;
        curX += Math.cos(finalAngle) * GAP;
        curY += Math.sin(finalAngle) * GAP;
      }
    };

    // --- Logic ---

    const createBamboo = (x: number, yBase: number, targetH: number, side: 'left' | 'right', depth: number): Bamboo => {
      const isFront = depth > 0.7;
      
      // Lean: Front ones lean more? Or random.
      // Usually lean away from center or random.
      const lean = rand(-0.15, 0.15); 
      const curve = rand(-0.5, 0.5); // Bending left or right
      
      return {
        x,
        yBase,
        targetHeight: targetH,
        segments: [],
        completed: false,
        growthSpeed: rand(0.5, 1.2),
        leanAngle: lean,
        curveStrength: curve,
        swayPhase: rand(0, Math.PI * 2),
        swaySpeed: rand(0.8, 1.5),
        side,
        depth
      };
    };

    const updateBamboo = (b: Bamboo, dt: number) => {
      if (b.completed && Math.random() > 0.01) return;
      
      // Total current height check
      let currentH = 0;
      b.segments.forEach(s => currentH += s.height);
      
      const lastSeg = b.segments[b.segments.length - 1];
      
      // Add Segment Logic
      let shouldAdd = false;
      if (!lastSeg) {
        shouldAdd = true;
      } else if (lastSeg.growthProgress > 0.9 && currentH < b.targetHeight) {
        shouldAdd = true;
      }
      
      if (shouldAdd) {
        const segH = rand(40, 70); // Long segments
        // Width depends on depth and position in stalk (tapers up)
        const baseWidth = b.depth * 10 + 4; // 4 to 14
        const taper = 1 - (currentH / b.targetHeight) * 0.6;
        const w = baseWidth * taper;
        
        // Gradient
        const stops = [
          { pos: 0, color: getInkColor(0.9, b.depth, 'wet') },
          { pos: 0.3, color: getInkColor(0.6, b.depth, 'dry') },
          { pos: 0.7, color: getInkColor(0.6, b.depth, 'dry') },
          { pos: 1, color: getInkColor(0.9, b.depth, 'wet') },
        ];
        
        // Branches
        const branches: Branch[] = [];
        // Only top 60% has branches
        if (currentH > b.targetHeight * 0.3) {
           const numBranches = rand(0, 1) > 0.3 ? (rand(0,1) > 0.6 ? 3 : 2) : 1;
           for(let k=0; k<numBranches; k++) {
             const side = rand(0, 1) > 0.5 ? 1 : -1;
             const angle = side === 1 ? rand(-1.2, -0.4) : rand(0.4, 1.2); // Relative to stalk (0 is UP)
             
             // Leaves
             const leaves: Leaf[] = [];
             const numLeaves = Math.floor(rand(5, 12));
             for(let l=0; l<numLeaves; l++) {
               leaves.push({
                 relX: rand(0.2, 1.0),
                 relY: rand(-2, 2),
                 angle: rand(-0.8, 0.8),
                 length: 0,
                 targetLength: rand(15, 35) * b.depth, // Scale with depth
                 width: rand(2, 4) * b.depth,
                 growthProgress: 0,
                 opacity: 0,
                 color: getInkColor(0.85, b.depth, 'wet'),
                 swaySpeed: rand(0.8, 1.5),
                 swayPhase: rand(0, Math.PI*2)
               });
             }
             
             branches.push({
               attachLevel: rand(0.85, 0.98), // Near top
               angle: angle,
               length: 0,
               targetLength: rand(40, 100) * b.depth, // Long branches
               width: rand(1, 2.5) * b.depth,
               growthProgress: 0,
               leaves,
               curve: rand(0.2, 0.8), // Gravity droop
               side
             });
           }
        }
        
        b.segments.push({
          id: Date.now() + Math.random(),
          yBottomRel: currentH,
          height: segH,
          width: w,
          opacity: 0,
          growthProgress: 0,
          colorStops: stops,
          branches,
          nodeType: rand(0,1) > 0.7 ? 'double' : (rand(0,1)>0.5 ? 'thick' : 'simple'),
          nodeWidthScale: rand(1.1, 1.3)
        });
      }
      
      // Grow
      b.segments.forEach(s => {
        if (s.growthProgress < 1) {
          s.growthProgress += dt * b.growthSpeed * 1.5;
          if (s.growthProgress > 1) s.growthProgress = 1;
          s.opacity = s.growthProgress;
        }
        
        if (s.growthProgress > 0.7) {
          s.branches.forEach(br => {
             if (br.growthProgress < 1) {
               br.growthProgress += dt * b.growthSpeed * 1.2;
               if (br.growthProgress > 1) br.growthProgress = 1;
             }
             if (br.growthProgress > 0.3) {
               br.leaves.forEach(lf => {
                 if (lf.growthProgress < 1) {
                   lf.growthProgress += dt * b.growthSpeed * 2;
                   if (lf.growthProgress > 1) lf.growthProgress = 1;
                 }
               });
             }
          });
        }
      });
      
      if (lastSeg && lastSeg.growthProgress >= 1 && currentH >= b.targetHeight) {
         // Check branches
         const allDone = b.segments.every(s => s.branches.every(br => br.growthProgress >= 1));
         if(allDone) b.completed = true;
      }
    };

    // --- Init ---
    
    const initBamboos = (w: number, h: number, side: 'left' | 'right') => {
       const list: Bamboo[] = [];
       // Density: High
       // We want overlap.
       // Layer 1: Background (small, light, dense)
       // Layer 2: Mid
       // Layer 3: Front (large, dark, sparse)
       
       const layers = 3;
       for(let l=0; l<layers; l++) {
          const depth = (l + 1) / layers; // 0.33, 0.66, 1.0
          // More items in back? Or just fill space.
          const count = Math.floor(w / (25 * depth)); // Back is denser
          
          for(let i=0; i<count; i++) {
             const x = rand(0, w);
             // Variation in base Y for depth effect?
             // Not really, all grow from ground. But ground might be uneven.
             const yBase = h + rand(-20, 50); // Start slightly below or above
             
             const targetH = h * rand(0.6, 1.2);
             
             list.push(createBamboo(x, yBase, targetH, side, depth));
          }
       }
       // Sort by depth so back draws first
       return list.sort((a, b) => a.depth - b.depth);
    };

    const animate = (ts: number) => {
      if (!timeRef.current) timeRef.current = ts;
      const dt = (ts - timeRef.current) / 1000;
      timeRef.current = ts;
      
      const dpr = window.devicePixelRatio || 1;
      
      const render = (ref: React.RefObject<HTMLCanvasElement>, list: Bamboo[]) => {
        if (!ref.current) return;
        const cvs = ref.current;
        const ctx = cvs.getContext('2d');
        if (!ctx) return;
        
        // Clear
        ctx.clearRect(0, 0, cvs.width / dpr, cvs.height / dpr);
        
        list.forEach(b => {
           updateBamboo(b, dt);
           drawBamboo(ctx, b, ts);
        });
      };
      
      render(leftCanvasRef, leftBamboosRef.current);
      render(rightCanvasRef, rightBamboosRef.current);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const setup = () => {
       const dpr = window.devicePixelRatio || 1;
       const configCanvas = (ref: React.RefObject<HTMLCanvasElement>, side: 'left' | 'right') => {
         if (!ref.current) return [];
         const r = ref.current.getBoundingClientRect();
         ref.current.width = r.width * dpr;
         ref.current.height = r.height * dpr;
         const ctx = ref.current.getContext('2d');
         ctx?.scale(dpr, dpr);
         return initBamboos(r.width, r.height, side);
       };
       
       leftBamboosRef.current = configCanvas(leftCanvasRef, 'left');
       rightBamboosRef.current = configCanvas(rightCanvasRef, 'right');
       
       timeRef.current = 0;
       cancelAnimationFrame(animationRef.current);
       animationRef.current = requestAnimationFrame(animate);
    };

    let tm: NodeJS.Timeout;
    const onResize = () => {
       clearTimeout(tm);
       tm = setTimeout(setup, 200);
    };
    
    window.addEventListener('resize', onResize);
    setTimeout(setup, 100);
    
    return () => {
       window.removeEventListener('resize', onResize);
       cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen w-full" style={{ position: 'relative' }}>
      <div className="flex w-full min-h-screen" style={{ position: 'relative' }}>
        <div className="hidden lg:block flex-1 h-screen relative" style={{ zIndex: 0 }}>
          <canvas ref={leftCanvasRef} className="absolute inset-0 w-full h-full" />
        </div>
        <div className="w-full max-w-[1400px] mx-auto min-h-screen lg:border-x border-solid border-neutral-900 dark:border-neutral-100" style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </div>
        <div className="hidden lg:block flex-1 h-screen relative" style={{ zIndex: 0 }}>
          <canvas ref={rightCanvasRef} className="absolute inset-0 w-full h-full" />
        </div>
      </div>
    </div>
  );
}
