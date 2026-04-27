import { WorkspaceAvatar } from "workspace-avatars";
// import "workspace-avatars/styles.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router";

export function meta() {
  return [
    { title: "workspace-avatars — Beautiful Deterministic Avatars" },
    {
      name: "description",
      content:
        "Production-ready avatar component with deterministic patterns and seamless theming. Built for modern React applications.",
    },
  ];
}

// Hero background wall - expanded for full bleed coverage
const HERO_WALL = [
  "atlas",
  "mariner",
  "thistle",
  "obsidian",
  "linen",
  "saffron",
  "graphite",
  "harbor",
  "fern",
  "vellum",
  "tobacco",
  "iron",
  "sebastian",
  "nora",
  "wren",
  "kazimir",
  "hattie",
  "ezra",
  "junko",
  "cosima",
  "thaddeus",
  "ines",
  "asher",
  "miloslav",
  "petra",
  "rashid",
  "yuki",
  "frida",
  "leonid",
  "gretta",
  "darius",
  "amalia",
  "boaz",
  "chiara",
  "dmitri",
  "elin",
  "fionn",
  "geneva",
  "halford",
  "ilse",
  "javier",
  "klara",
  "magnus",
  "ophelia",
  "silas",
  "vera",
  "wolfgang",
  "zara",
  "caspian",
  "elodie",
  "felix",
  "gemma",
  "hugo",
  "isadora",
  "jasper",
  "luna",
  "milo",
  "nova",
  "orion",
  "penelope",
  "quinn",
  "river",
  "stella",
  "theo",
  "una",
  "victor",
  "willow",
  "xander",
  "yvonne",
  "zephyr",
  "aurora",
  "blake",
  "cleo",
  "dash",
  "ember",
  "finn",
  "grace",
  "hayes",
  "ivy",
  "jude",
  "kai",
  "lyra",
  "max",
  "nina",
  "oliver",
  "piper",
  "rowan",
  "sage",
  "talia",
  "ursula",
  "vaughn",
  "winter",
  "xavier",
  "yasmin",
  "zane",
  "alice",
  "bruno",
  "clara",
  "diego",
  "ella",
  "frank",
  "gina",
  "henry",
  "iris",
  "jacob",
  "kira",
  "leo",
  "maya",
  "nick",
  "owen",
  "paul",
  "rose",
  "sam",
  "tess",
  "uriah",
  "val",
  "wade",
  "xena",
  "yale",
  "zoe",
  "adam",
  "beth",
  "carl",
  "dana",
  "erik",
  "faye",
  "glen",
  "hope",
  "ivan",
  "jade",
  "kyle",
  "lena",
  "mark",
  "nell",
  "otto",
  "phil",
  "ruth",
  "seth",
  "tina",
  "ulric",
  "vera",
  "walt",
  "xara",
  "york",
];

type Style = "pixel" | "block" | "quilt" | "initials";
type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [highlightedCells, setHighlightedCells] = useState<Set<number>>(
    new Set(),
  );
  const avatarRef = useRef<HTMLDivElement>(null);

  // Get non-slider values from URL search params with defaults
  const seed = searchParams.get("seed") || "workspace-avatars";
  const size: Size = "3xl";
  const style = (searchParams.get("style") || "quilt") as Style;
  const border = searchParams.get("border") === "true";

  // Local state for sliders (instant updates)
  const [cellRadius, setCellRadius] = useState(
    Number(searchParams.get("cellRadius") || "15"),
  );
  const [density, setDensity] = useState(
    Number(searchParams.get("density") || "56"),
  );
  const [gap, setGap] = useState(Number(searchParams.get("gap") || "10"));
  const [padding, setPadding] = useState(
    Number(searchParams.get("padding") || "0"),
  );
  const [depth, setDepth] = useState(Number(searchParams.get("depth") || "30"));
  const [containerRadius, setContainerRadius] = useState(
    Number(searchParams.get("containerRadius") || "0"),
  );
  const [borderWidth, setBorderWidth] = useState(
    Number(searchParams.get("borderWidth") || "1"),
  );

  // Sync local state when URL params change (e.g., back/forward navigation)
  useEffect(() => {
    const urlCellRadius = Number(searchParams.get("cellRadius") || "15");
    const urlDensity = Number(searchParams.get("density") || "56");
    const urlGap = Number(searchParams.get("gap") || "10");
    const urlPadding = Number(searchParams.get("padding") || "0");
    const urlDepth = Number(searchParams.get("depth") || "30");
    const urlContainerRadius = Number(
      searchParams.get("containerRadius") || "0",
    );
    const urlBorderWidth = Number(searchParams.get("borderWidth") || "1");

    setCellRadius(urlCellRadius);
    setDensity(urlDensity);
    setGap(urlGap);
    setPadding(urlPadding);
    setDepth(urlDepth);
    setContainerRadius(urlContainerRadius);
    setBorderWidth(urlBorderWidth);
  }, [searchParams]);

  // Update URL search params
  const updateParam = useCallback(
    (key: string, value: string | number | boolean) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set(key, String(value));
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  // Debounced update for sliders - updates local state immediately, URL after delay
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const updateSlider = useCallback(
    (
      key: string,
      value: number,
      setter: (value: number) => void,
      delay = 300,
    ) => {
      // Update local state immediately for instant UI feedback
      setter(value);

      // Debounce URL update
      if (debounceTimers.current[key]) {
        clearTimeout(debounceTimers.current[key]);
      }
      debounceTimers.current[key] = setTimeout(() => {
        updateParam(key, value);
      }, delay);
    },
    [updateParam],
  );

  // Reset all controls to defaults
  const resetControls = useCallback(() => {
    // Clear all pending debounce timers
    Object.values(debounceTimers.current).forEach(clearTimeout);
    debounceTimers.current = {};

    // Reset local state
    setCellRadius(15);
    setDensity(56);
    setGap(10);
    setPadding(0);
    setDepth(30);
    setContainerRadius(0);
    setBorderWidth(1);

    // Clear all URL params
    setSearchParams({}, { replace: true, preventScrollReset: true });
  }, [setSearchParams]);

  // Download avatar as PNG
  const downloadAvatar = useCallback(async () => {
    if (!avatarRef.current) return;

    const svg = avatarRef.current.querySelector("svg");
    if (!svg) return;

    // Clone SVG to avoid modifying the original
    const svgClone = svg.cloneNode(true) as SVGElement;

    // Get all rect elements and resolve their computed fill colors
    const originalRects = svg.querySelectorAll("rect[fill]");
    const clonedRects = svgClone.querySelectorAll("rect[fill]");

    originalRects.forEach((originalRect, index) => {
      const computedFill = getComputedStyle(originalRect).fill;
      if (clonedRects[index] && computedFill) {
        clonedRects[index].setAttribute("fill", computedFill);
      }
    });

    // Set explicit width/height on the SVG
    svgClone.setAttribute("width", "512");
    svgClone.setAttribute("height", "512");

    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const size = 512;
    canvas.width = size;
    canvas.height = size;

    // Convert SVG to data URL with proper encoding
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      svgData,
    )}`;

    // Load and draw image
    const img = new Image();
    img.onerror = (e) => {
      console.error("Image load error:", e);
    };
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);

      // Download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `${seed}-avatar.png`;
        a.click();
        URL.revokeObjectURL(downloadUrl);
      });
    };
    img.src = svgDataUrl;
  }, [seed]);

  // Theme toggle function
  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");

    if (isDark) {
      // Switch to light mode
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      // Switch to dark mode
      html.classList.remove("light");
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    // Continuously twinkle random cells
    const twinkle = () => {
      const cellIndex = Math.floor(Math.random() * HERO_WALL.length);
      setHighlightedCells((prev) => new Set(prev).add(cellIndex));

      // Remove highlight after 1.5-2.5 seconds
      setTimeout(() => {
        setHighlightedCells((prev) => {
          const next = new Set(prev);
          next.delete(cellIndex);
          return next;
        });
      }, 1500 + Math.random() * 1000);
    };

    // Start twinkling with staggered intervals
    const intervals = [
      setInterval(twinkle, 2000),
      setInterval(twinkle, 2300),
      setInterval(twinkle, 2600),
      setInterval(twinkle, 2900),
      setInterval(twinkle, 3200),
    ];

    // Trigger initial twinkles immediately
    twinkle();
    setTimeout(twinkle, 400);
    setTimeout(twinkle, 800);
    setTimeout(twinkle, 1200);

    return () => intervals.forEach(clearInterval);
  }, []);

  const codeSnippet = `import { WorkspaceAvatar } from "workspace-avatars";

const config = {
  style: "${style}",
  size: "${size}",
  cellRadius: ${cellRadius},
  density: ${density},
  gap: ${gap},
  padding: ${padding},
  depth: ${depth},${border ? `\n  border: true,\n  borderWidth: ${borderWidth},` : ""}${
    containerRadius > 0 ? `\n  containerRadius: ${containerRadius},` : ""
  }
};

export function MyComponent() {
  return (
    <WorkspaceAvatar
      seed="${seed}"
      config={config}
    />
  );
}`;

  return (
    <>
      {/* Sticky Controls Sidebar */}
      <aside className="fixed left-6 top-6 z-40 hidden w-80 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl border border-border bg-surface/95 p-6 shadow-xl backdrop-blur-sm xl:block">
        <div className="flex items-center gap-3">
          <WorkspaceAvatar
            seed="workspace-avatars"
            className="rounded-lg"
            config={{ style: "quilt", size: "lg" }}
          />
          <div>
            <h2 className="font-display text-xl leading-none tracking-tight text-text">
              Workspace
            </h2>
            <p className="mt-1 text-sm text-soft">Avatars v1.0.0</p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <Field label="Seed">
            <input
              value={seed}
              onChange={(e) => updateParam("seed", e.target.value)}
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 font-mono text-sm text-text focus:border-sage focus:outline-none"
            />
          </Field>

          <SliderField
            label="Cell radius"
            value={cellRadius}
            onChange={(v) => updateSlider("cellRadius", v, setCellRadius)}
            min={0}
            max={50}
          />

          <SliderField
            label="Container radius"
            value={containerRadius}
            onChange={(v) =>
              updateSlider("containerRadius", v, setContainerRadius)
            }
            min={0}
            max={50}
          />

          <SegField
            label="Style"
            value={style}
            options={["pixel", "block", "quilt", "initials"]}
            onChange={(v) => updateParam("style", v)}
          />

          <SliderField
            label="Density"
            value={density}
            onChange={(v) => updateSlider("density", v, setDensity)}
            min={0}
            max={100}
          />

          <SliderField
            label="Gap"
            value={gap}
            onChange={(v) => updateSlider("gap", v, setGap)}
            min={0}
            max={50}
          />

          <SliderField
            label="Padding"
            value={padding}
            onChange={(v) => updateSlider("padding", v, setPadding)}
            min={0}
            max={30}
          />

          <SliderField
            label="Depth"
            value={depth}
            onChange={(v) => updateSlider("depth", v, setDepth)}
            min={0}
            max={100}
          />

          <Field label="Border">
            <button
              onClick={() => updateParam("border", !border)}
              className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                border
                  ? "border-text bg-text text-bg"
                  : "border-border text-soft hover:bg-border"
              }`}
            >
              {border ? "On" : "Off"}
            </button>
          </Field>

          {border && (
            <SliderField
              label="Border width"
              value={borderWidth}
              onChange={(v) => updateSlider("borderWidth", v, setBorderWidth)}
              min={1}
              max={10}
            />
          )}

          <Field label="Theme">
            <button
              onClick={toggleTheme}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-border"
            >
              Toggle
            </button>
          </Field>

          <div className="border-t border-border pt-4">
            <button
              onClick={resetControls}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-border text-soft"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Hero Section with Avatar Wall ─── */}
      <section className="relative min-h-screen overflow-hidden border-b border-border">
        {/* Avatar Wall Background - Full Bleed Grid */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gridAutoRows: "100px",
          }}
        >
          {HERO_WALL.map((seed, i) => {
            const isHighlighted = highlightedCells.has(i);
            return (
              <div
                key={`${seed}-${i}`}
                className="size-full opacity-20 transition-all hover:opacity-100"
                style={{
                  opacity: mounted ? (isHighlighted ? 0.9 : 0.2) : 0,
                  transform: mounted ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: mounted ? `${i * 15}ms` : "0ms",
                  transitionDuration: isHighlighted ? "800ms" : "1200ms",
                }}
              >
                <WorkspaceAvatar
                  seed={seed}
                  className="size-full"
                  config={{
                    style,
                    cellRadius,
                    density,
                    gap,
                    padding,
                    depth,
                    border,
                    borderWidth,
                    containerRadius,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 z-10 flex items-center px-6 py-20 md:px-10 xl:pl-100">
          <div className="w-full max-w-3xl">
            <h1 className="font-display text-6xl leading-none tracking-tight md:text-7xl lg:text-8xl">
              <span className="text-text">Beautiful </span>
              <span className="bg-linear-to-r from-sage via-violet to-coral bg-clip-text text-transparent">
                Deterministic
              </span>
              <span className="text-text"> Avatars.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-soft md:text-xl font-medium">
              Generate unique, consistent avatar patterns from any seed.
              Production-ready for modern React applications.
            </p>
            <div className="mt-10 inline-flex items-center gap-3 rounded-lg border border-border bg-surface/95 px-6 py-3 font-mono text-sm shadow-lg backdrop-blur-sm">
              <span className="text-soft">$</span>
              <span className="text-text">npm install workspace-avatars</span>
              <CopyButton text="npm install workspace-avatars" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Playground Section ─── */}
      <section className="border-b border-border py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-10 xl:pl-100">
          <div className="grid gap-8 lg:grid-cols-[400px_1fr] xl:grid-cols-1">
            {/* Controls - Mobile Only */}
            <div className="space-y-6 rounded-2xl border border-border bg-surface p-6 xl:hidden">
              <div className="flex items-center gap-3">
                <WorkspaceAvatar
                  seed="workspace-avatars"
                  className="rounded-lg"
                  config={{ style: "quilt", size: "lg" }}
                />
                <div>
                  <h2 className="font-display text-xl leading-none tracking-tight text-text">
                    Workspace
                  </h2>
                  <p className="mt-1 text-sm text-soft">Avatars</p>
                </div>
              </div>

              <Field label="Seed">
                <input
                  value={seed}
                  onChange={(e) => updateParam("seed", e.target.value)}
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 font-mono text-sm text-text focus:border-sage focus:outline-none"
                />
              </Field>

              <SliderField
                label="Cell radius"
                value={cellRadius}
                onChange={(v) => updateSlider("cellRadius", v, setCellRadius)}
                min={0}
                max={50}
              />

              <SliderField
                label="Container radius"
                value={containerRadius}
                onChange={(v) =>
                  updateSlider("containerRadius", v, setContainerRadius)
                }
                min={0}
                max={50}
              />

              <SegField
                label="Style"
                value={style}
                options={["pixel", "block", "quilt", "initials"]}
                onChange={(v) => updateParam("style", v)}
              />

              <SliderField
                label="Density"
                value={density}
                onChange={(v) => updateSlider("density", v, setDensity)}
                min={0}
                max={100}
              />

              <SliderField
                label="Gap"
                value={gap}
                onChange={(v) => updateSlider("gap", v, setGap)}
                min={0}
                max={50}
              />

              <SliderField
                label="Padding"
                value={padding}
                onChange={(v) => updateSlider("padding", v, setPadding)}
                min={0}
                max={30}
              />

              <SliderField
                label="Depth"
                value={depth}
                onChange={(v) => updateSlider("depth", v, setDepth)}
                min={0}
                max={100}
              />

              <Field label="Border">
                <button
                  onClick={() => updateParam("border", !border)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    border
                      ? "border-text bg-text text-bg"
                      : "border-border text-soft hover:bg-border"
                  }`}
                >
                  {border ? "On" : "Off"}
                </button>
              </Field>

              {border && (
                <SliderField
                  label="Border width"
                  value={borderWidth}
                  onChange={(v) => updateSlider("borderWidth", v, setBorderWidth)}
                  min={1}
                  max={10}
                />
              )}

              <Field label="Theme">
                <button
                  onClick={toggleTheme}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-border"
                >
                  Toggle
                </button>
              </Field>

              <div className="border-t border-border pt-4">
                <button
                  onClick={resetControls}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-border text-soft"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>

            {/* Preview & Code */}
            <div className="space-y-6">
              {/* Preview */}
              <div className="space-y-4">
                {/* Main Avatar */}
                <div className="relative group">
                  <div className="flex items-center justify-center rounded-2xl border border-border bg-surface p-8">
                    <div ref={avatarRef}>
                      <WorkspaceAvatar
                        seed={seed}
                        config={{
                          style,
                          size,
                          cellRadius,
                          density,
                          gap,
                          padding,
                          depth,
                          border,
                          borderWidth,
                          containerRadius,
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={downloadAvatar}
                    className="absolute top-4 right-4 rounded-lg bg-text px-3 py-2 text-xs font-medium text-bg opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-90"
                  >
                    Download PNG
                  </button>
                </div>

                {/* Example Avatars Grid */}
                <div className="grid grid-cols-6 gap-4 rounded-2xl border border-border bg-surface p-6">
                  {[
                    "alice",
                    "bruno",
                    "cosima",
                    "dmitri",
                    "elodie",
                    "felix",
                  ].map((exampleSeed) => (
                    <div
                      key={exampleSeed}
                      className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <WorkspaceAvatar
                        seed={exampleSeed}
                        config={{
                          style,
                          size: "lg",
                          cellRadius,
                          density,
                          gap,
                          padding,
                          depth,
                          border,
                          borderWidth,
                          containerRadius,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Code */}
              <div className="relative rounded-2xl border border-border bg-surface">
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                  <span className="font-mono text-xs text-soft">
                    Usage Example
                  </span>
                  <CopyButton text={codeSnippet} />
                </div>
                <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
                  <code className="text-text">{codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Helper Components
function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg bg-text px-3 py-1.5 text-xs font-medium text-bg transition-all hover:opacity-90"
    >
      {copied ? (
        <>
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          {label || "Copy"}
        </>
      )}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.15em] text-soft">
        {label}
      </label>
      {children}
    </div>
  );
}

function SegField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-1 rounded-lg border border-border p-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs transition-colors ${
              value === opt
                ? "bg-border text-bg hover:bg-border"
                : "text-soft hover:bg-border"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </Field>
  );
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <Field label={`${label} · ${value}`}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-sage"
      />
    </Field>
  );
}
