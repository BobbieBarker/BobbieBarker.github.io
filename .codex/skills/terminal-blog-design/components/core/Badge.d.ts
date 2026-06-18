import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic color of the dot + text. */
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  /** Show the leading glowing status dot. */
  dot?: boolean;
  children?: React.ReactNode;
}

/** Small pill status indicator with a glowing leading dot. */
export function Badge(props: BadgeProps): JSX.Element;
