'use client';

import { useEffect, useRef, useId } from 'react';

interface Props {
  text: string;
  fontSize?: number;
  fontWeight?: string;
  letterSpacing?: string;
  color?: string;
  baseVelocity?: number;
  curveAmount?: number;
  direction?: 1 | -1;
}

export default function CurvedLoopText({
  text,
  fontSize = 160,
  fontWeight = '600',
  letterSpacing = '-2px',
  color = '#ffffff',
  baseVelocity = 80,
  curveAmount = 0,
  direction = -1,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/:/g, 'p');
  const pathId = `clp-${uid}`;
  const rafRef = useRef<number>(0);
  const prevTimeRef = useRef<number>(0);
  const dragVelocity = useRef(0);
  const isDragging = useRef(false);
  const lastDragX = useRef(0);
  const positions = useRef<number[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const textEl = svg.querySelector<SVGTextElement>('text.cltext');
    if (!textEl) return;

    textEl.innerHTML = '';
    const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    textPath.setAttribute('href', `#${pathId}`);
    textPath.setAttribute('startOffset', '0');
    textEl.appendChild(textPath);

    // Visible path: x = -100 to 1540 = 1640 units
    // Path visible range: x = -100 to 1540 = 1640 SVG units.
    // spacing = one repetition width. Must be < 1640 so consecutive tspans overlap
    // the visible window — no gap possible if spacing < visible_range.
    // charW tuned down; separator is 3 spaces in content not extra gap.
    const charW = fontSize * 0.48;
    const spacing = text.length * charW; // ~1006 at fontSize=160 — well under 1640

    // Fill path + 2 extra tspans on each side so wrap is invisible
    const pathStart = -spacing * 2;
    const count = Math.ceil((1640 + spacing * 4) / spacing);

    const pos: number[] = [];
    for (let i = 0; i < count; i++) {
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.textContent = text + '   ';
      const x = pathStart + i * spacing;
      tspan.setAttribute('x', String(Math.round(x)));
      tspan.setAttribute('dy', '0em');
      textPath.appendChild(tspan);
      pos.push(x);
    }

    positions.current = pos;
    const tspans = Array.from(textPath.querySelectorAll<SVGTSpanElement>('tspan'));
    // Total band = count * spacing; each tspan wraps within this band individually
    const totalSpan = count * spacing;

    function frame(time: number) {
      const delta = prevTimeRef.current ? time - prevTimeRef.current : 16;
      prevTimeRef.current = time;

      if (Math.abs(dragVelocity.current) > 0.01) {
        dragVelocity.current *= isDragging.current ? 0.9 : 0.96;
      } else {
        dragVelocity.current = 0;
      }

      const move = direction * baseVelocity * (delta / 1000) + dragVelocity.current;

      for (let i = 0; i < tspans.length; i++) {
        positions.current[i] += move;

        // Wrap within [pathStart, pathStart + totalSpan)
        if (positions.current[i] < pathStart) {
          positions.current[i] += totalSpan;
        } else if (positions.current[i] >= pathStart + totalSpan) {
          positions.current[i] -= totalSpan;
        }

        tspans[i].setAttribute('x', String(Math.round(positions.current[i])));
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, fontSize, baseVelocity, direction, pathId]);

  const getVBScale = () => {
    const svg = svgRef.current;
    return svg ? svg.getBoundingClientRect().width / 1440 : 1;
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    isDragging.current = true;
    lastDragX.current = e.clientX;
    (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging.current) return;
    const deltaX = (e.clientX - lastDragX.current) / getVBScale();
    dragVelocity.current = deltaX * 0.3;
    lastDragX.current = e.clientX;
  };

  const onPointerUp = () => { isDragging.current = false; };

  const arcY = 160 + curveAmount;
  const pathD = `M-100,${arcY} Q720,${arcY} 1540,${arcY}`;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMid meet"
      className="w-full pointer-events-auto select-none"
      style={{ display: 'block', overflow: 'visible', cursor: 'grab' }}
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <defs>
        <path id={pathId} d={pathD} />
      </defs>
      <text x="-9999" y="-9999" aria-label={text} style={{ fontSize: 1 }}>
        {text}
      </text>
      <text
        className="cltext"
        fontFamily="var(--font-playfair), Georgia, serif"
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontStyle="italic"
        fill={color}
        letterSpacing={letterSpacing}
      >
        {/* textPath + tspans injected by useEffect */}
      </text>
    </svg>
  );
}
