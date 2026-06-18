import * as React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLElement> {
  /** Optional count shown after the label, e.g. post count on an archive. */
  count?: number | null;
  /** Selected/filtering state — orange border + wash. */
  active?: boolean;
  size?: 'sm' | 'md';
  /** `a`/`button` make it interactive (filter links). */
  as?: 'span' | 'a' | 'button';
  children?: React.ReactNode;
}

/** Uppercase bordered topic label used for article tags and filters. */
export function Tag(props: TagProps): JSX.Element;
