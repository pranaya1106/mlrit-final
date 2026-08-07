export type IntakeYear = { year: string; students: number };

// Fixed hue order, validated for adjacent-pair contrast/CVD separation
// (see dataviz palette validator) — every bar also carries a direct
// count + year label, so identity never rests on color alone.
const BAR_COLORS = [
  '#e85d04', // orange (brand primary)
  '#1864ab', // blue
  '#c2255c', // rose
  '#a67c00', // gold
  '#6741d9', // violet
  '#01741f', // green (brand secondary)
  '#c92a2a', // red
  '#0092a8', // teal
];

const VB_W = 1040;
const VB_H = 460;
const LEFT = 44;
const RIGHT = 44;
const GAP = 14;
const BASELINE = 372;
const MIN_H = 92;
const MAX_H = 250;
const SLANT = 16;

function buildRibbonPoints(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  thickness: number,
  headLen: number,
  headWidth: number
) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const halfT = thickness / 2;
  const shaftEndX = x1 - ux * headLen;
  const shaftEndY = y1 - uy * headLen;
  const pts: [number, number][] = [
    [x0 + px * halfT, y0 + py * halfT],
    [shaftEndX + px * halfT, shaftEndY + py * halfT],
    [shaftEndX + px * (headWidth / 2), shaftEndY + py * (headWidth / 2)],
    [x1, y1],
    [shaftEndX - px * (headWidth / 2), shaftEndY - py * (headWidth / 2)],
    [shaftEndX - px * halfT, shaftEndY - py * halfT],
    [x0 - px * halfT, y0 - py * halfT],
  ];
  return pts.map((p) => `${p[0]},${p[1]}`).join(' ');
}

export default function DeptIntakeChart({
  data,
  tagline = 'Growing Stronger Every Year',
}: {
  data: IntakeYear[];
  tagline?: string;
}) {
  if (!data.length) return null;

  const n = data.length;
  const barW = (VB_W - LEFT - RIGHT - GAP * (n - 1)) / n;
  const maxVal = Math.max(...data.map((d) => d.students));
  const minVal = Math.min(...data.map((d) => d.students));
  const range = maxVal - minVal || 1;

  const barGeom = data.map((d, i) => {
    const x0 = LEFT + i * (barW + GAP);
    const x1 = x0 + barW;
    const h = MIN_H + ((d.students - minVal) / range) * (MAX_H - MIN_H);
    return { x0, x1, topY: BASELINE - h, h };
  });

  const bars = data.map((d, i) => {
    const { x0, x1, topY, h } = barGeom[i];
    const color = BAR_COLORS[i % BAR_COLORS.length];
    const points = `${x0},${BASELINE} ${x1},${BASELINE} ${x1},${topY - SLANT / 2} ${x0},${topY + SLANT / 2}`;
    const label = `${d.students} STUDENTS`;
    const fontSize = Math.max(9, Math.min(barW * 0.46, (h - 20) / (label.length * 0.62)));
    return { color, points, label, fontSize, cx: (x0 + x1) / 2, cy: BASELINE - h / 2, year: d.year };
  });

  // Trend line through the first and last bar CENTERS, offset up by a fixed
  // clearance, then extended past both ends along that exact same direction.
  // Using the same reference (bar center) at both ends — instead of mixing
  // left/right edges — means every bar in between (which sits on the same
  // straight trend for a linear series) keeps identical clearance too,
  // instead of the ribbon's slope drifting from the bars' real slope and
  // letting later bars poke through it.
  const RIBBON_CLEARANCE = 26;
  const TAIL_OVERHANG = 40;
  const HEAD_OVERHANG = 34;
  const firstBar = barGeom[0];
  const lastBar = barGeom[barGeom.length - 1];
  const firstCx = (firstBar.x0 + firstBar.x1) / 2;
  const lastCx = (lastBar.x0 + lastBar.x1) / 2;
  const trendAx = firstCx;
  const trendAy = firstBar.topY - RIBBON_CLEARANCE;
  const trendBx = lastCx;
  const trendBy = lastBar.topY - RIBBON_CLEARANCE;
  const trendDx = trendBx - trendAx;
  const trendDy = trendBy - trendAy;
  const trendLen = Math.hypot(trendDx, trendDy) || 1;
  const trendUx = trendDx / trendLen;
  const trendUy = trendDy / trendLen;
  const ribbonX0 = trendAx - trendUx * TAIL_OVERHANG;
  const ribbonY0 = trendAy - trendUy * TAIL_OVERHANG;
  const ribbonX1 = trendBx + trendUx * HEAD_OVERHANG;
  const ribbonY1 = trendBy + trendUy * HEAD_OVERHANG;
  const ribbonPoints = buildRibbonPoints(ribbonX0, ribbonY0, ribbonX1, ribbonY1, 24, 26, 54);
  // Rounded to avoid a server/client floating-point hydration mismatch on the transform string.
  const ribbonAngle = Number((((Math.atan2(ribbonY1 - ribbonY0, ribbonX1 - ribbonX0) * 180) / Math.PI)).toFixed(2));
  const ribbonMidX = (ribbonX0 + ribbonX1) / 2;
  const ribbonMidY = (ribbonY0 + ribbonY1) / 2;

  return (
    <div className="mt-5 rounded-2xl bg-white shadow-card-soft border border-border/60 p-5 md:p-7">
      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-[640px]">
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto" role="img" aria-label="Year-wise student intake chart">
            <text
              x={LEFT - 6}
              y={30}
              fontWeight={800}
              fontSize={16}
              letterSpacing="0.12em"
              fill="var(--muted)"
              className="font-mono uppercase"
            >
              Year-Wise Student Intake
            </text>

            <polygon points={ribbonPoints} fill="#ecdec1" stroke="#d4c5a8" strokeWidth={1.5} />
            <text
              x={ribbonMidX}
              y={ribbonMidY}
              transform={`rotate(${ribbonAngle} ${ribbonMidX} ${ribbonMidY})`}
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight={800}
              fontSize={14}
              letterSpacing="0.08em"
              fill="#5c4a1f"
              className="font-sans uppercase"
            >
              {tagline}
            </text>

            {bars.map((bar, i) => (
              <g key={i}>
                <polygon points={bar.points} fill={bar.color} />
                <text
                  x={bar.cx}
                  y={bar.cy}
                  transform={`rotate(-90 ${bar.cx} ${bar.cy})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ffffff"
                  fontWeight={800}
                  fontSize={bar.fontSize}
                  letterSpacing="0.03em"
                  className="font-sans"
                >
                  {bar.label}
                </text>
                <text
                  x={bar.cx}
                  y={BASELINE + 30}
                  textAnchor="middle"
                  fill="var(--foreground)"
                  fontWeight={800}
                  fontSize={16}
                  className="font-sans"
                >
                  {bar.year}
                </text>
                <rect x={bar.cx - barW * 0.28} y={BASELINE + 40} width={barW * 0.56} height={3} rx={1.5} fill={bar.color} />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
