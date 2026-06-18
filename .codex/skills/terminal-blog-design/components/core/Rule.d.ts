import * as React from 'react';

export interface RuleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional uppercase label set into the rule. */
  label?: string | null;
  /** `solid` hairline, `dashed`, or `ascii` box-drawing dashes. */
  variant?: 'solid' | 'dashed' | 'ascii';
  /** With a label: center it between two lines, or push it to the start. */
  align?: 'center' | 'start';
}

/** Horizontal divider — hairline, dashed, or ASCII, with optional label. */
export function Rule(props: RuleProps): JSX.Element;
