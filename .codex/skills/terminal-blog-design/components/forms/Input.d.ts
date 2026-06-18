import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Uppercase mono label above the field. */
  label?: string | null;
  /** Static mono prefix inside the field, e.g. `$` or `~/`. */
  prefix?: string | null;
  /** Helper text below the field. */
  hint?: string | null;
  /** Error message — turns the field red and replaces the hint. */
  error?: string | null;
  /** Style for the outer wrapper (the input itself takes `style`). */
  containerStyle?: React.CSSProperties;
}

/** Square text input with uppercase label, optional prefix, orange focus ring. */
export function Input(props: InputProps): JSX.Element;
