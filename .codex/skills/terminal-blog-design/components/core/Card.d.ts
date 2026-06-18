import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** `flat` hairline box (default), `raised` adds the hard shadow, `interactive` lifts toward an orange shadow on hover. */
  variant?: 'flat' | 'raised' | 'interactive';
  as?: 'div' | 'article' | 'a' | 'section';
  children?: React.ReactNode;
}

/** Bordered surface container. Square corners, hairline border. */
export function Card(props: CardProps): JSX.Element;
