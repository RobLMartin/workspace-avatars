# workspace-avatars

Deterministic, theme-aware avatars with cross-stitch patterns. Same seed → same pattern, every time. Light/dark via pure CSS variables — no `useDarkMode` hook, no `MutationObserver`, no re-renders on theme change.

```bash
npm i workspace-avatars
```

## Usage

```tsx
import { WorkspaceAvatar } from "workspace-avatars";

<WorkspaceAvatar seed="acme-corp" />
<WorkspaceAvatar seed="jane@example.com" variant="initials" size="lg" />
<WorkspaceAvatar seed="project-x" config={{ style: "block", containerRadius: 20 }} />
```

## Tailwind setup

The component renders Tailwind utility classes. Make sure your Tailwind config scans the package's dist output:

**Tailwind v4** (in your CSS):

```css
@import "tailwindcss";
@source "../node_modules/workspace-avatars/dist";
```

**Tailwind v3** (in `tailwind.config.{js,ts}`):

```js
content: [
  "./src/**/*.{ts,tsx}",
  "./node_modules/workspace-avatars/dist/**/*.{js,cjs}",
],
```

## Dark mode

Theme reactivity uses Tailwind's `dark:` variant. By default that triggers when `.dark` is on a parent. If your app supports OS-preference fallback (a `.system` class plus `prefers-color-scheme: dark`), extend the variant:

```css
/* Tailwind v4 */
@custom-variant dark (
  &:where(.dark, .dark *),
  &:where(.system, .system *) and (prefers-color-scheme: dark)
);
```

## Customizing colors

The component uses 8 deterministic color palettes. To customize any palette, define CSS variables in your global stylesheet:

```css
:root {
  /* Override palette 0 for light mode */
  --avatar-palette-0-bg: #f5f3f0;
  --avatar-palette-0-fg: #8b7d6b;
  --avatar-palette-0-mid: #b5a89a;
}

.dark {
  /* Override palette 0 for dark mode */
  --avatar-palette-0-bg: #1c1a17;
  --avatar-palette-0-fg: #a89b88;
  --avatar-palette-0-mid: #6b5f4f;
}
```

Palettes are numbered 0–7. Each palette has 3 colors:

- `bg` — background fill
- `fg` — primary pattern color
- `mid` — secondary depth/shading color

The component automatically selects a palette by hashing the seed, but you can override any palette's colors via CSS variables. If not defined, the component uses hardcoded default colors.

## Props

| Prop        | Type                                                     | Default     | Description                                   |
| ----------- | -------------------------------------------------------- | ----------- | --------------------------------------------- |
| `seed`      | `string`                                                 | required    | Any string — hash drives palette and pattern. |
| `variant`   | `"pattern" \| "initials"`                                | `"pattern"` | SVG cross-stitch or text initials.            |
| `size`      | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl"` | `"md"`      | 24px → 240px.                                 |
| `config`    | `PatternConfig`                                          | —           | Override style, density, gap, padding, etc.   |
| `className` | `string`                                                 | —           | Forwarded to outer wrapper.                   |
| `style`     | `React.CSSProperties`                                    | —           | Inline styles forwarded to outer wrapper.     |

### PatternConfig

| Field             | Type                            | Default     | Notes                                            |
| ----------------- | ------------------------------- | ----------- | ------------------------------------------------ |
| `style`           | `"pixel" \| "block" \| "quilt"` | `"quilt"`   | 8×8 / 10×10 / 9×9 grid.                          |
| `cellRadius`      | `0–100`                         | `15`        | Cell corner radius (% of cell size).             |
| `containerRadius` | `0–100`                         | `0`         | Avatar container border-radius (% of size).      |
| `padding`         | `0–100`                         | `0`         | Outer padding (% of avatar size).                |
| `gap`             | `0–100`                         | `10`        | Gap between stitches (% of cell).                |
| `density`         | `0–100`                         | `56`        | Pattern fill density.                            |
| `depth`           | `0–100`                         | `30`        | Density of secondary mid-tone "depth" thread.    |
| `size`            | `"xs" \| "sm" \| "md" \| ...`   | `"md"`      | Can be set in config or as component prop.       |
| `border`          | `boolean`                       | `false`     | Can be set in config or as component prop.       |
| `stitchShape`     | `"rounded" \| "square"`         | `"rounded"` | Deprecated—use `cellRadius` instead (no effect). |

## License

MIT
