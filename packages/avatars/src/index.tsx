import { useMemo } from "react";
import "./styles.css";

const SIZE_PX: Record<string, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
  "2xl": 128,
  "3xl": 240,
};

function getAvatarClassName(size: AvatarSize, extraClassName?: string): string {
  const baseClass = "workspace-avatar";
  const sizeClass = `workspace-avatar-${size}`;
  return [baseClass, sizeClass, extraClassName].filter(Boolean).join(" ");
}

function getInitialsClassName(size: AvatarSize): string {
  return `workspace-avatar-initials workspace-avatar-initials-${size}`;
}

// ─── Types ───────────────────────────────────────────────────────
type Variant = "pattern" | "initials";
type Style = "pixel" | "block" | "quilt";

interface WorkspaceAvatarProps {
  variant?: Variant;
  config?: PatternConfig;
  className?: string;
  style?: React.CSSProperties;
  seed: string;
}

// ─── Palettes ────────────────────────────────────────────────────
interface PaletteDef {
  lbg: string;
  lfg: string;
  lm: string;
  dbg: string;
  dfg: string;
  dm: string;
}

const PALETTES: PaletteDef[] = [
  // Warm beige/tan
  {
    lbg: "#f5f3f0",
    lfg: "#8b7d6b",
    lm: "#b5a89a",
    dbg: "#1c1a17",
    dfg: "#a89b88",
    dm: "#6b5f4f",
  },
  // Cool gray
  {
    lbg: "#f3f4f5",
    lfg: "#6d7580",
    lm: "#9ba3ab",
    dbg: "#181a1c",
    dfg: "#8d99a5",
    dm: "#556068",
  },
  // Blue-gray/slate
  {
    lbg: "#f2f4f7",
    lfg: "#6b7e8f",
    lm: "#95a5b3",
    dbg: "#171a1d",
    dfg: "#8899ab",
    dm: "#556270",
  },
  // Sage green
  {
    lbg: "#f3f5f4",
    lfg: "#6d8075",
    lm: "#95a89e",
    dbg: "#171a18",
    dfg: "#859388",
    dm: "#556358",
  },
  // Teal/cyan gray
  {
    lbg: "#f3f5f5",
    lfg: "#6d807f",
    lm: "#95a8a7",
    dbg: "#171a1a",
    dfg: "#859393",
    dm: "#556363",
  },
  // Lavender/purple
  {
    lbg: "#f4f3f6",
    lfg: "#7d7688",
    lm: "#a39dae",
    dbg: "#191819",
    dfg: "#968fa5",
    dm: "#625c6f",
  },
  // Warm brown
  {
    lbg: "#f6f4f2",
    lfg: "#8d7e70",
    lm: "#b3a599",
    dbg: "#1c1a17",
    dfg: "#a6978a",
    dm: "#6d6055",
  },
  // Steel gray
  {
    lbg: "#f4f5f6",
    lfg: "#73797f",
    lm: "#9ea3a8",
    dbg: "#191a1c",
    dfg: "#929ba3",
    dm: "#5a6168",
  },
];

// ─── Hash & PRNG ─────────────────────────────────────────────────
function hash(s: string): number {
  let h = 5535;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function prng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ─── Cross-stitch pattern generators (4-way symmetric) ───────────
interface Pattern {
  grid: boolean[][];
  size: number;
}

function generatePixel(rng: () => number, density: number): Pattern {
  const N = 8,
    half = N / 2;
  const quad: boolean[][] = [];
  for (let y = 0; y < half; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < half; x++) row.push(rng() < density);
    quad.push(row);
  }
  const grid = Array.from({ length: N }, () => Array(N).fill(false));
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const qy = y < half ? y : N - 1 - y;
      const qx = x < half ? x : N - 1 - x;
      grid[y][x] = quad[qy][qx];
    }
  return { grid, size: N };
}

function generateBlock(rng: () => number, density: number): Pattern {
  const N = 10;
  const grid = Array.from({ length: N }, () => Array(N).fill(false));
  const frameStyle = Math.floor(rng() * 4);
  for (let y = 0; y < 2; y++)
    for (let x = 0; x < 2; x++) {
      const on =
        frameStyle === 0
          ? (x + y) % 2 === 0
          : frameStyle === 1
          ? x === 0 || y === 0
          : frameStyle === 2
          ? x === y
          : true;
      if (on) {
        grid[y][x] =
          grid[y][N - 1 - x] =
          grid[N - 1 - y][x] =
          grid[N - 1 - y][N - 1 - x] =
            true;
      }
    }
  if (rng() < 0.55) {
    for (let i = 3; i < N - 3; i++) {
      grid[0][i] = grid[N - 1][i] = true;
      grid[i][0] = grid[i][N - 1] = true;
    }
  }
  for (let y = 2; y < 5; y++)
    for (let x = 2; x < 5; x++)
      if (rng() < density) {
        grid[y][x] =
          grid[y][N - 1 - x] =
          grid[N - 1 - y][x] =
          grid[N - 1 - y][N - 1 - x] =
            true;
      }
  return { grid, size: N };
}

function generateQuilt(rng: () => number, density: number): Pattern {
  const N = 9,
    half = Math.ceil(N / 2);
  const quad: boolean[][] = [];
  for (let y = 0; y < half; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < half; x++) row.push(rng() < density);
    quad.push(row);
  }
  const grid = Array.from({ length: N }, () => Array(N).fill(false));
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const qy = y < half ? y : N - 1 - y;
      const qx = x < half ? x : N - 1 - x;
      grid[y][x] = quad[qy][qx];
    }
  return { grid, size: N };
}

const GENERATORS: Record<
  Style,
  (rng: () => number, density: number) => Pattern
> = {
  pixel: generatePixel,
  block: generateBlock,
  quilt: generateQuilt,
};

function generateDepth(seed: number, N: number, density = 0.3): boolean[][] {
  const rand = prng(seed + 7777);
  const half = Math.ceil(N / 2);
  const quad: boolean[][] = [];
  for (let y = 0; y < half; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < half; x++) row.push(rand() < density);
    quad.push(row);
  }
  const grid = Array.from({ length: N }, () => Array(N).fill(false));
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const qy = y < half ? y : N - 1 - y;
      const qx = x < half ? x : N - 1 - x;
      grid[y][x] = quad[qy][qx];
    }
  return grid;
}

// ─── Pattern config ──────────────────────────────────────────────
type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface PatternConfig {
  style?: Style;
  stitchShape?: "rounded" | "square";
  cellRadius?: number;
  padding?: number;
  gap?: number;
  density?: number;
  depth?: number;
  size?: AvatarSize;
  border?: boolean;
  containerRadius?: number;
}

const DEFAULT_CONFIG: Required<PatternConfig> = {
  style: "quilt",
  stitchShape: "rounded",
  cellRadius: 15,
  padding: 0,
  gap: 10,
  density: 56,
  depth: 30,
  size: "md",
  border: false,
  containerRadius: 0,
};

// ─── Helpers ─────────────────────────────────────────────────────
function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/[\s._@\-]+/)
    .filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts[0]?.length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0] || "?").toUpperCase();
}

function getPalette(seed: string): PaletteDef {
  return PALETTES[hash(seed) % PALETTES.length];
}

// ─── Cross-stitch SVG ────────────────────────────────────────────
function CrossStitchSVG({
  seed,
  size,
  config,
}: {
  seed: string;
  size: number;
  config: Required<PatternConfig>;
}) {
  const h = hash(seed);

  const variantSalt = { pixel: 0, block: 13371337, quilt: 24682468 }[
    config.style
  ];
  const pRng = prng(h + variantSalt);
  const pattern = GENERATORS[config.style](pRng, config.density / 100);
  const depth = generateDepth(h, pattern.size, config.depth / 100);

  const N = pattern.size;
  const basePadding = (size * config.padding) / 100;
  const extraPadding = size * 0.06;
  const padPx = basePadding + extraPadding;
  const inner = size - padPx * 2;
  const cell = inner / N;
  const gapPx = Math.max(0.5, (cell * config.gap) / 100);
  const stitch = cell - gapPx;
  const stitchRx = (stitch * config.cellRadius) / 100;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", height: "100%" }}>
      <rect width={size} height={size} fill="var(--avatar-bg)" />
      {pattern.grid.map((row, y) =>
        row.map((on, x) =>
          on ? (
            <rect
              key={`${x}-${y}`}
              x={padPx + x * cell + gapPx / 2}
              y={padPx + y * cell + gapPx / 2}
              width={stitch}
              height={stitch}
              rx={stitchRx}
              ry={stitchRx}
              fill={depth[y][x] ? "var(--avatar-mid)" : "var(--avatar-fg)"}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────
export function WorkspaceAvatar({
  variant = "pattern",
  config,
  className,
  style,
  seed,
}: WorkspaceAvatarProps) {
  const mergedConfig = useMemo<Required<PatternConfig>>(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config],
  );

  const size = mergedConfig.size;
  const border = mergedConfig.border;
  const containerRadius = mergedConfig.containerRadius;

  const px = SIZE_PX[size ?? "md"];
  const pal = useMemo(() => getPalette(seed), [seed]);
  const palIndex = useMemo(() => hash(seed) % PALETTES.length, [seed]);

  // Inline custom props with CSS variable fallbacks for theming.
  // Users can override via --avatar-palette-{0-15}-{bg,fg,mid} in :root and .dark.
  // Falls back to hardcoded palette colors if CSS vars aren't defined.
  // The `dark:` utilities on avatarVariants pick which set the SVG sees.
  const paletteVars = {
    "--avatar-bg-light": `var(--avatar-palette-${palIndex}-bg, ${pal.lbg})`,
    "--avatar-fg-light": `var(--avatar-palette-${palIndex}-fg, ${pal.lfg})`,
    "--avatar-mid-light": `var(--avatar-palette-${palIndex}-mid, ${pal.lm})`,
    "--avatar-bg-dark": `var(--avatar-palette-${palIndex}-bg, ${pal.dbg})`,
    "--avatar-fg-dark": `var(--avatar-palette-${palIndex}-fg, ${pal.dfg})`,
    "--avatar-mid-dark": `var(--avatar-palette-${palIndex}-mid, ${pal.dm})`,
  } as React.CSSProperties;

  return (
    <div
      className={getAvatarClassName(size, className)}
      style={{
        ...paletteVars,
        background: variant === "initials" ? "var(--avatar-bg)" : undefined,
        border: border
          ? "1px solid color-mix(in srgb, var(--avatar-fg) 20%, transparent)"
          : undefined,
        borderRadius:
          containerRadius !== undefined ? `${containerRadius}%` : undefined,
        ...style,
      }}
    >
      {variant === "initials" ? (
        <span
          className={getInitialsClassName(size)}
          style={{ color: "var(--avatar-fg)" }}
        >
          {getInitials(seed)}
        </span>
      ) : (
        <CrossStitchSVG seed={seed} size={px} config={mergedConfig} />
      )}
    </div>
  );
}

export type { WorkspaceAvatarProps, PatternConfig, Style, Variant, AvatarSize };
