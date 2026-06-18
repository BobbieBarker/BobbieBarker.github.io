import * as React from 'react';

export interface ThemeToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Element to set `[data-theme]` on. Defaults to `document.documentElement`. */
  target?: HTMLElement | null;
  /** Initial selected theme. */
  initial?: 'dark' | 'light';
  /** Fired with the new theme on toggle. */
  onChange?: ((theme: 'dark' | 'light') => void) | null;
}

/** Segmented dark/light switch that sets `[data-theme]` on the page. */
export function ThemeToggle(props: ThemeToggleProps): JSX.Element;
