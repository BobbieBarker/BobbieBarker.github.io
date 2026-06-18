import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` is the orange fill with the hard shadow. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Control height/padding. */
  size?: 'sm' | 'md' | 'lg';
  /** Render as a different element, e.g. `a` for a link button. */
  as?: 'button' | 'a';
  /** Element rendered before the label (an icon). */
  iconLeft?: React.ReactNode;
  /** Element rendered after the label (an icon). */
  iconRight?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * The primary action control. Square corners, uppercase mono label.
 * @startingPoint section="Core" subtitle="Buttons — primary, secondary, ghost, danger" viewport="700x200"
 */
export function Button(props: ButtonProps): JSX.Element;
