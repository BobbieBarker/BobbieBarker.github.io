import * as React from 'react';

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Semantic tone — sets the accent bar color, marker and default label. */
  tone?: 'note' | 'tip' | 'warning' | 'danger';
  /** Override the uppercase label (defaults to the tone name). */
  title?: string | null;
  children?: React.ReactNode;
}

/** Aside box for notes/tips/warnings inside article prose. */
export function Callout(props: CalloutProps): JSX.Element;
