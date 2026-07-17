'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

type ExprEntry = {
  expr: string;
  color: string;
  visible?: boolean;
};

type FunctionPlotterProps = {
  expressions?: ExprEntry[];
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  height?: number;
  editable?: boolean;
  showTime?: boolean;
  paramExpr?: string;
  paramMin?: number;
  paramMax?: number;
  paramStep?: number;
  paramDefault?: number;
};

const COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c084fc', '#f97316', '#22d3ee', '#f472b6'];

const MATH_FUNCS: Record<string, (...args: number[]) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  asin: Math.asin, acos: Math.acos, atan: Math.atan, atan2: Math.atan2,
  abs: Math.abs, sqrt: Math.sqrt, cbrt: Math.cbrt,
  exp: Math.exp, log: Math.log, log2: Math.log2, log10: Math.log10,
  floor: Math.floor, ceil: Math.ceil, round: Math.round,
  sign: Math.sign,
  pow: Math.pow, min: Math.min, max: Math.max,
  fract: (x) => x - Math.floor(x),
  mod: (x, y) => ((x % y) + y) % y,
  step: (edge, x) => x >= edge ? 1 : 0,
  smoothstep: (edge0, edge1, x) => {
    var t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  },
  mix: (a, b, t) => a * (1 - t) + b * t,
  lerp: (a, b, t) => a * (1 - t) + b * t,
  saturate: (x) => Math.max(0, Math.min(1, x)),
  clamp: (x, lo, hi) => Math.max(lo, Math.min(hi, x)),
  rsqrt: (x) => 1 / Math.sqrt(x),
  exp2: (x) => Math.pow(2, x),
  length: Math.hypot,
  distance: (a, b) => Math.abs(a - b),
  normalize: (x) => x === 0 ? 0 : Math.sign(x),
  reflect: (I, N) => I - 2 * N * (I * N),
  over: (x, y) => x / (1 - (1 - x) * y),
};

const CONSTS: Record<string, number> = {
  PI: Math.PI, pi: Math.PI,
  E: Math.E, e: Math.E,
  PHI: (1 + Math.sqrt(5)) / 2, phi: (1 + Math.sqrt(5)) / 2,
  TAU: 2 * Math.PI, tau: 2 * Math.PI,
  LN2: Math.LN2, LN10: Math.LN10,
  SQRT2: Math.SQRT2,
};

function compileExpr(expr: string, pValue: number, paramName?: string): ((x: number, t: number) => number) | null {
  try {
    var processed = expr
      .replace(/(\d)([a-zA-Z_])/g, '$1*$2')
      .replace(/(\))(\()/g, '$1*$2')
      .replace(/(\d)(\()/g, '$1*$2')
      .replace(/(\))([a-zA-Z_])/g, '$1*$2')
      .replace(/\bpi\b/gi, '(' + Math.PI + ')')
      .replace(/\btau\b/gi, '(' + (2 * Math.PI) + ')')
      .replace(/\bphi\b/gi, '(' + ((1 + Math.sqrt(5)) / 2) + ')')
      .replace(/\be\b/g, '(' + Math.E + ')')
      .replace(/\^/g, '**');

    var funcNames = Object.keys(MATH_FUNCS).sort((a, b) => b.length - a.length).join('|');
    var re = new RegExp('\\b(' + funcNames + ')\\b', 'g');
    processed = processed.replace(re, 'M.$1');

    if (paramName && paramName !== 'p') {
      var pnr = new RegExp('\\b' + paramName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
      processed = processed.replace(pnr, 'p');
    }

    var code = 'var M=$m,p=$p;return(' + processed + ')';
    var fn = new Function('$m', '$p', 'x', 't', code);
    var bound = fn.bind(null, MATH_FUNCS, pValue);
    bound(0, 0);
    return bound;
  } catch (e) {
    return null;
  }
}

function niceStep(range: number, targetTicks: number): number {
  var rawStep = range / targetTicks;
  var mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  var norm = rawStep / mag;
  if (norm < 1.5) return mag;
  if (norm < 3.5) return 2 * mag;
  if (norm < 7.5) return 5 * mag;
  return 10 * mag;
}

function formatNum(v: number): string {
  if (Math.abs(v) < 1e-10) return '0';
  if (Math.abs(v) >= 1e4 || (Math.abs(v) < 0.01 && v !== 0)) return v.toExponential(1);
  var s = v.toPrecision(4);
  return s.replace(/\.?0+$/, '');
}

export default function FunctionPlotter({
  expressions: initialExprs = [],
  xMin: initXMin = -1,
  xMax: initXMax = 2,
  yMin: initYMin = -1,
  yMax: initYMax = 2,
  height = 340,
  editable: initialEditable = true,
  showTime = false,
  paramExpr,
  paramMin = 0,
  paramMax = 5,
  paramStep = 0.1,
  paramDefault = 2,
}: FunctionPlotterProps) {
  var canvasRef = useRef<HTMLCanvasElement>(null);
  var containerRef = useRef<HTMLDivElement>(null);
  var animRef = useRef<number>(0);
  var timeRef = useRef(0);
  var dirtyRef = useRef(true);

  var [view, setView] = useState({ xMin: initXMin, xMax: initXMax, yMin: initYMin, yMax: initYMax });
  var [mousePos, setMousePos] = useState<{ cx: number; cy: number } | null>(null);
  var [drag, setDrag] = useState<{ sx: number; sy: number; xMin: number; xMax: number; yMin: number; yMax: number } | null>(null);
  var [exprs, setExprs] = useState<ExprEntry[]>(() => {
    if (initialExprs.length === 0) return [{ expr: 'x', color: COLORS[0], visible: true }];
    return initialExprs.map((e, i) => ({ ...e, color: e.color || COLORS[i % COLORS.length], visible: e.visible !== false }));
  });
  var [param, setParam] = useState(paramDefault);
  var [time, setTime] = useState(0);
  var [playing, setPlaying] = useState(false);
  var [editable] = useState(initialEditable);
  var [errors, setErrors] = useState<Record<number, string>>({});
  var touchRef = useRef<{ id: number; sx: number; sy: number; xMin: number; xMax: number; yMin: number; yMax: number } | null>(null);
  var pinchRef = useRef<{ dist: number; xMin: number; xMax: number; yMin: number; yMax: number } | null>(null);

  var dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  var compiled = useMemo(() => {
    var result: { fn: ((x: number, t: number) => number) | null; color: string; label: string; visible: boolean }[] = [];
    var newErrors: Record<number, string> = {};
    exprs.forEach((e, i) => {
      if (!e.expr.trim()) { result.push({ fn: null, color: e.color, label: '', visible: !!e.visible }); return; }
      var fn = compileExpr(e.expr, param, paramExpr);
      if (fn) {
        result.push({ fn, color: e.color, label: e.expr, visible: !!e.visible });
      } else {
        newErrors[i] = 'Syntax error';
        result.push({ fn: null, color: e.color, label: e.expr, visible: !!e.visible });
      }
    });
    setErrors(newErrors);
    return result;
  }, [exprs, param]);

  var draw = useCallback(() => {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var container = containerRef.current;
    if (!container) return;
    var w = container.clientWidth;
    var h = height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var ctx0 = canvas.getContext('2d');
    if (!ctx0) return;
    var ctx = ctx0;
    ctx.scale(dpr, dpr);

    var { xMin, xMax, yMin, yMax } = view;
    var pad = { left: 44, right: 16, top: 12, bottom: 28 };
    var pw = w - pad.left - pad.right;
    var ph = h - pad.top - pad.bottom;

    function toX(x: number) { return pad.left + ((x - xMin) / (xMax - xMin)) * pw; }
    function toY(y: number) { return pad.top + ph - ((y - yMin) / (yMax - yMin)) * ph; }
    function fromX(sx: number) { return xMin + ((sx - pad.left) / pw) * (xMax - xMin); }
    function fromY(sy: number) { return yMax - ((sy - pad.top) / ph) * (yMax - yMin); }

    ctx.fillStyle = '#0f0f1a';
    ctx.fillRect(0, 0, w, h);

    var xStep = niceStep(xMax - xMin, Math.floor(pw / 60));
    var yStep = niceStep(yMax - yMin, Math.floor(ph / 40));

    ctx.strokeStyle = '#1e1e3a';
    ctx.lineWidth = 1;
    for (var xv = Math.ceil(xMin / xStep) * xStep; xv <= xMax; xv += xStep) {
      var sx = toX(xv);
      ctx.beginPath(); ctx.moveTo(sx, pad.top); ctx.lineTo(sx, pad.top + ph); ctx.stroke();
    }
    for (var yv = Math.ceil(yMin / yStep) * yStep; yv <= yMax; yv += yStep) {
      var sy = toY(yv);
      ctx.beginPath(); ctx.moveTo(pad.left, sy); ctx.lineTo(pad.left + pw, sy); ctx.stroke();
    }

    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    if (xMin <= 0 && xMax >= 0) { var ox = toX(0); ctx.beginPath(); ctx.moveTo(ox, pad.top); ctx.lineTo(ox, pad.top + ph); ctx.stroke(); }
    if (yMin <= 0 && yMax >= 0) { var oy = toY(0); ctx.beginPath(); ctx.moveTo(pad.left, oy); ctx.lineTo(pad.left + pw, oy); ctx.stroke(); }

    ctx.fillStyle = '#666';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    for (var xv2 = Math.ceil(xMin / xStep) * xStep; xv2 <= xMax; xv2 += xStep) {
      var sx2 = toX(xv2);
      ctx.fillText(formatNum(xv2), sx2, pad.top + ph + 16);
    }
    ctx.textAlign = 'right';
    for (var yv2 = Math.ceil(yMin / yStep) * yStep; yv2 <= yMax; yv2 += yStep) {
      var sy2 = toY(yv2);
      ctx.fillText(formatNum(yv2), pad.left - 6, sy2 + 3);
    }

    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('x', pad.left + pw - 4, pad.top + ph + 24);
    ctx.textAlign = 'left';
    ctx.fillText('y', pad.left + 4, pad.top + 10);

    var t = timeRef.current;
    compiled.forEach((c) => {
      if (!c.fn || !c.visible) return;
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      var started = false;
      var labelX = pad.left + pw - 4;
      var labelYFound = false;
      var labelY = 0;
      for (var px = 0; px <= pw; px++) {
        var x = fromX(pad.left + px);
        try {
          var y = c.fn(x, t);
          if (!isFinite(y) || isNaN(y)) { started = false; continue; }
          var sy3 = toY(y);
          if (sy3 < pad.top - ph || sy3 > pad.top + ph * 2) { started = false; continue; }
          if (!started) { ctx.moveTo(pad.left + px, sy3); started = true; }
          else { ctx.lineTo(pad.left + px, sy3); }
          if (pad.left + px >= labelX - 2 && !labelYFound && sy3 >= pad.top && sy3 <= pad.top + ph) {
            labelY = sy3;
            labelYFound = true;
          }
        } catch (e) { started = false; }
      }
      ctx.stroke();
      if (labelYFound && c.label) {
        ctx.fillStyle = c.color;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'right';
        var labelText = c.label.length > 18 ? c.label.slice(0, 16) + '..' : c.label;
        var tw = ctx.measureText(labelText).width;
        ctx.fillStyle = 'rgba(15,15,26,0.85)';
        ctx.fillRect(labelX - tw - 6, labelY - 10, tw + 8, 14);
        ctx.fillStyle = c.color;
        ctx.fillText(labelText, labelX - 4, labelY);
      }
    });

    if (mousePos) {
      var mx = mousePos.cx;
      var my = mousePos.cy;
      if (mx >= pad.left && mx <= pad.left + pw && my >= pad.top && my <= pad.top + ph) {
        var mvalX = fromX(mx);
        var mvalY = fromY(my);
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(mx, pad.top); ctx.lineTo(mx, pad.top + ph); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pad.left, my); ctx.lineTo(pad.left + pw, my); ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = '11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('(' + mvalX.toFixed(3) + ', ' + mvalY.toFixed(3) + ')', Math.min(mx + 8, w - 120), Math.max(my - 8, 14));

        compiled.forEach((c) => {
          if (!c.fn || !c.visible) return;
          try {
            var fy = c.fn(mvalX, t);
            if (isFinite(fy)) {
              var dotY = toY(fy);
              ctx.fillStyle = c.color;
              ctx.beginPath(); ctx.arc(mx, dotY, 4, 0, Math.PI * 2); ctx.fill();
            }
          } catch (e) {}
        });
      }
    }
  }, [view, compiled, mousePos, height, dpr]);

  useEffect(() => {
    dirtyRef.current = true;
  }, [view, compiled, mousePos, time, param]);

  useEffect(() => {
    var running = true;
    var lastT = performance.now();
    function loop(now: number) {
      if (!running) return;
      if (playing) {
        var dt = (now - lastT) / 1000;
        timeRef.current += dt;
        if (showTime) setTime(timeRef.current);
      }
      lastT = now;
      if (dirtyRef.current || playing) {
        draw();
        dirtyRef.current = false;
      }
      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [draw, playing, showTime]);

  useEffect(() => { dirtyRef.current = true; }, [draw]);

  var handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setDrag({ sx: e.clientX, sy: e.clientY, xMin: view.xMin, xMax: view.xMax, yMin: view.yMin, yMax: view.yMax });
  }, [view]);

  var handleMouseMove = useCallback((e: React.MouseEvent) => {
    var rect = containerRef.current?.getBoundingClientRect();
    if (rect) setMousePos({ cx: e.clientX - rect.left, cy: e.clientY - rect.top });
    if (!drag) return;
    var container = containerRef.current;
    if (!container) return;
    var w = container.clientWidth;
    var h = height;
    var pw = w - 44 - 16;
    var ph = h - 12 - 28;
    var dx = e.clientX - drag.sx;
    var dy = e.clientY - drag.sy;
    var xRange = drag.xMax - drag.xMin;
    var yRange = drag.yMax - drag.yMin;
    var shiftX = -(dx / pw) * xRange;
    var shiftY = (dy / ph) * yRange;
    setView({ xMin: drag.xMin + shiftX, xMax: drag.xMax + shiftX, yMin: drag.yMin + shiftY, yMax: drag.yMax + shiftY });
  }, [drag, height]);

  var handleMouseUp = useCallback(() => { setDrag(null); }, []);
  var handleMouseLeave = useCallback(() => { setMousePos(null); setDrag(null); }, []);

  var handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    var factor = e.deltaY > 0 ? 1.08 : 1 / 1.08;
    var rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    var w = containerRef.current!.clientWidth;
    var h = height;
    var pad = { left: 44, right: 16, top: 12, bottom: 28 };
    var pw = w - pad.left - pad.right;
    var ph = h - pad.top - pad.bottom;
    var mxFrac = (mx - pad.left) / pw;
    var myFrac = 1 - (my - pad.top) / ph;
    var { xMin, xMax, yMin, yMax } = view;
    var xRange = xMax - xMin;
    var yRange = yMax - yMin;
    var newXRange = xRange * factor;
    var newYRange = yRange * factor;
    setView({
      xMin: xMin + mxFrac * (xRange - newXRange),
      xMax: xMax - (1 - mxFrac) * (xRange - newXRange),
      yMin: yMin + myFrac * (yRange - newYRange),
      yMax: yMax - (1 - myFrac) * (yRange - newYRange),
    });
  }, [view, height]);

  var resetView = useCallback(() => setView({ xMin: initXMin, xMax: initXMax, yMin: initYMin, yMax: initYMax }), [initXMin, initXMax, initYMin, initYMax]);

  var handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      var t0 = e.touches[0];
      touchRef.current = { id: t0.identifier, sx: t0.clientX, sy: t0.clientY, xMin: view.xMin, xMax: view.xMax, yMin: view.yMin, yMax: view.yMax };
      pinchRef.current = null;
    } else if (e.touches.length === 2) {
      var t1 = e.touches[0], t2 = e.touches[1];
      var dx = t1.clientX - t2.clientX, dy = t1.clientY - t2.clientY;
      pinchRef.current = { dist: Math.sqrt(dx * dx + dy * dy), xMin: view.xMin, xMax: view.xMax, yMin: view.yMin, yMax: view.yMax };
      touchRef.current = null;
    }
  }, [view]);

  var handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && touchRef.current) {
      var t0 = e.touches[0];
      if (t0.identifier !== touchRef.current.id) return;
      var container = containerRef.current;
      if (!container) return;
      var w = container.clientWidth;
      var h = height;
      var pw = w - 44 - 16;
      var ph = h - 12 - 28;
      var dx = t0.clientX - touchRef.current.sx;
      var dy = t0.clientY - touchRef.current.sy;
      var xRange = touchRef.current.xMax - touchRef.current.xMin;
      var yRange = touchRef.current.yMax - touchRef.current.yMin;
      setView({
        xMin: touchRef.current.xMin - (dx / pw) * xRange,
        xMax: touchRef.current.xMax - (dx / pw) * xRange,
        yMin: touchRef.current.yMin + (dy / ph) * yRange,
        yMax: touchRef.current.yMax + (dy / ph) * yRange,
      });
    } else if (e.touches.length === 2 && pinchRef.current) {
      var t1 = e.touches[0], t2 = e.touches[1];
      var pdx = t1.clientX - t2.clientX, pdy = t1.clientY - t2.clientY;
      var newDist = Math.sqrt(pdx * pdx + pdy * pdy);
      if (newDist < 1) return;
      var factor = pinchRef.current.dist / newDist;
      var { xMin, xMax, yMin, yMax } = pinchRef.current;
      var cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2;
      var xRange = (xMax - xMin) * factor / 2;
      var yRange = (yMax - yMin) * factor / 2;
      setView({ xMin: cx - xRange, xMax: cx + xRange, yMin: cy - yRange, yMax: cy + yRange });
    }
  }, [height]);

  var handleTouchEnd = useCallback(() => {
    touchRef.current = null;
    pinchRef.current = null;
  }, []);

  var handleDoubleClick = useCallback(() => {
    resetView();
  }, [resetView]);

  var updateExpr = useCallback((i: number, val: string) => {
    setExprs(prev => prev.map((e, idx) => idx === i ? { ...e, expr: val } : e));
  }, []);

  var toggleVisible = useCallback((i: number) => {
    setExprs(prev => prev.map((e, idx) => idx === i ? { ...e, visible: !e.visible } : e));
  }, []);

  var addExpr = useCallback(() => {
    setExprs(prev => [...prev, { expr: '', color: COLORS[prev.length % COLORS.length], visible: true }]);
  }, []);

  var removeExpr = useCallback((i: number) => {
    setExprs(prev => prev.filter((_, idx) => idx !== i));
  }, []);

  return (
    <div className="my-4 rounded-lg border border-neutral-800 bg-[#0f0f1a] overflow-hidden">
      <div
        ref={containerRef}
        style={{ cursor: drag ? 'grabbing' : 'crosshair', userSelect: 'none', touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
      >
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
      </div>

      <div className="border-t border-neutral-700 px-4 py-3 bg-[#141425]">
        {editable && (
          <div className="space-y-1.5 mb-3">
            {exprs.map((e, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => toggleVisible(i)}
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: e.visible ? e.color : '#333', border: '1.5px solid ' + (e.visible ? e.color : '#555') }}
                  title={e.visible ? 'Hide' : 'Show'}
                />
                <span className="text-neutral-300 font-mono text-sm w-7 text-right flex-shrink-0">f{i + 1}</span>
                <input
                  type="text"
                  value={e.expr}
                  onChange={(ev) => updateExpr(i, ev.target.value)}
                  className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2.5 py-1 text-sm font-mono text-neutral-100 focus:border-amber-400 focus:outline-none"
                  placeholder="e.g. sin(x), x^2, smoothstep(0,1,x)"
                  spellCheck={false}
                  autoComplete="off"
                />
                {errors[i] && <span className="text-red-400 text-sm flex-shrink-0">!</span>}
                {exprs.length > 1 && (
                  <button onClick={() => removeExpr(i)} className="text-neutral-400 hover:text-red-400 text-sm flex-shrink-0 px-1">✕</button>
                )}
              </div>
            ))}
            {exprs.length < 8 && (
              <button onClick={addExpr} className="text-sm text-neutral-400 hover:text-amber-400 transition-colors">+ add curve</button>
            )}
          </div>
        )}

        {editable && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {['sin(x)', 'cos(x)', 'tan(x)', 'abs(x)', 'sqrt(x)', 'x^2', 'x^3', 'exp(x)', 'log(x)', '1/x', 'floor(x)', 'step(0,x)'].map((fn) => (
              <button key={fn} onClick={() => {
                var lastEmpty = exprs.findIndex((e) => !e.expr.trim());
                if (lastEmpty >= 0) {
                  updateExpr(lastEmpty, fn);
                } else if (exprs.length < 8) {
                  setExprs(prev => [...prev, { expr: fn, color: COLORS[prev.length % COLORS.length], visible: true }]);
                }
              }} className="px-2 py-0.5 text-xs font-mono rounded border border-neutral-500 text-neutral-100 hover:border-amber-400 hover:text-amber-300 transition-colors bg-neutral-700">
                {fn}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 flex-wrap text-sm text-neutral-300">
          {paramExpr && (
            <div className="flex items-center gap-2">
              <span className="text-neutral-200 font-medium">{paramExpr}</span>
              <span className="text-amber-400 font-mono font-bold">{param.toFixed(2)}</span>
              <input type="range" min={paramMin} max={paramMax} step={paramStep} value={param}
                onChange={(e) => { setParam(parseFloat(e.target.value)); dirtyRef.current = true; }}
                className="w-24 accent-amber-500"
              />
            </div>
          )}
          {showTime && (
            <div className="flex items-center gap-2">
              <button onClick={() => setPlaying(!playing)} className="text-neutral-200 hover:text-white text-lg">
                {playing ? '⏸' : '▶'}
              </button>
              <span className="font-mono">t = {time.toFixed(2)}</span>
            </div>
          )}
          <button onClick={resetView} className="px-2 py-0.5 rounded border border-neutral-500 text-neutral-100 bg-neutral-700 hover:border-neutral-400 hover:text-white transition-colors">
            Reset
          </button>
          <span className="text-neutral-400">Drag: pan | Scroll/pinch: zoom | Dbl-click: reset</span>
        </div>
      </div>
    </div>
  );
}
