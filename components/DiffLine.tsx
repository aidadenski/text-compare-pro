'use client';

import React from 'react';
import * as Diff from 'diff';

interface DiffLineProps {
  leftLine: string;
  rightLine: string;
  mode: 'lines' | 'chars' | 'words' | 'sentences';
  side: 'left' | 'right';
  ignoreCase?: boolean;
  ignoreWhitespace?: boolean;
}

export default function DiffLine({
  leftLine,
  rightLine,
  mode,
  side,
  ignoreCase = false,
  ignoreWhitespace = false
}: DiffLineProps) {
  // For line mode, this component should not be used
  if (mode === 'lines') {
    return <span>{side === 'left' ? leftLine : rightLine}</span>;
  }

  // Ensure we're comparing single lines without newlines
  let left = leftLine.replace(/\n/g, '');
  let right = rightLine.replace(/\n/g, '');

  // diffWords already treats whitespace as insignificant; chars/sentences
  // need the runs collapsed manually when the option is enabled. Case is
  // handled by the library's ignoreCase option so the original casing is
  // preserved in the rendered output.
  if (ignoreWhitespace && mode !== 'words') {
    left = left.replace(/\s+/g, ' ').trim();
    right = right.replace(/\s+/g, ' ').trim();
  }

  let changes: Diff.Change[];
  switch (mode) {
    case 'chars':
      changes = Diff.diffChars(left, right, { ignoreCase });
      break;
    case 'sentences':
      changes = Diff.diffSentences(left, right, { ignoreCase });
      break;
    default:
      changes = Diff.diffWords(left, right, { ignoreCase });
      break;
  }

  // The left pane renders removed + unchanged parts, the right pane renders
  // added + unchanged parts. Highlights add no horizontal padding so the
  // character columns stay aligned across both panes.
  const highlightClass =
    side === 'left' ? 'diff-content-removed' : 'diff-content-added';

  return (
    <>
      {changes.map((change, index) => {
        if (side === 'left' ? change.added : change.removed) return null;
        const isHighlighted = side === 'left' ? change.removed : change.added;
        return (
          <span key={index} className={isHighlighted ? highlightClass : undefined}>
            {change.value}
          </span>
        );
      })}
    </>
  );
}
