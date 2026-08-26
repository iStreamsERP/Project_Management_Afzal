/**
 * FlowState palette — mirrors `tailwind.config.js` / `index.css` for SVG,
 * Recharts, and react-hot-toast, where Tailwind classes aren't available.
 *
 * Structural colors resolve through CSS custom properties (`rgb(var(--color-x))`)
 * so they stay in sync with the light/dark theme (see theme-provider.tsx and
 * index.css) without needing a React re-render — the browser re-resolves the
 * var() the moment the `.dark` class toggles on <html>. Accent colors are the
 * same hex in both themes, so they're passed through as plain values.
 */
export const THEME = {
  background: 'rgb(var(--color-background))',
  surface: 'rgb(var(--color-surface))',
  surface2: 'rgb(var(--color-surface2))',
  card: 'rgb(var(--color-card))',
  accent1: '#6C63FF',
  accent2: '#00D4AA',
  accent3: '#FF6B9D',
  accent4: '#FFB84C',
  accent5: '#4FC3F7',
  border: 'rgb(var(--color-border))',
  borderStrong: 'rgb(var(--color-border-strong))',
  textPrimary: 'rgb(var(--color-text-primary))',
  textMuted: 'rgb(var(--color-text-muted))',
} as const
