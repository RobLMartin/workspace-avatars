import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  //   setIsDark(document.documentElement.classList.contains("dark"));
  // }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="ml-2 inline-flex size-9 items-center justify-center rounded-full border border-rule text-ink-soft transition-colors hover:bg-paper-deep hover:text-muted-foreground"
    >
      {/* Render a stable placeholder until mount to avoid SSR mismatch */}
      <span aria-hidden className="text-base leading-none">
        {!mounted ? "○" : isDark ? "☾" : "☀"}
      </span>
    </button>
  );
}
