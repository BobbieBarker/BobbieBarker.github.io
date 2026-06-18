import * as React from 'react';

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The source to render. Use a template literal for multi-line. */
  code: string;
  /** Language label shown in the header (and used loosely for highlighting). */
  language?: string;
  /** Filename shown next to the terminal dots, e.g. `lib/worker.ex`. */
  filename?: string | null;
  showLineNumbers?: boolean;
  /** 1-based line numbers to emphasize with an orange wash + bar. */
  highlightLines?: number[];
}

/**
 * The signature element: a dark terminal code surface with header,
 * line numbers, copy button and built-in Elixir/JS/shell highlighting.
 * @startingPoint section="Content" subtitle="Syntax-highlighted terminal code block" viewport="700x320"
 */
export function CodeBlock(props: CodeBlockProps): JSX.Element;
