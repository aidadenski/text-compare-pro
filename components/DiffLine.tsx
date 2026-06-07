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
    return <span className="whitespace-pre">{side === 'left' ? leftLine : rightLine}</span>;
  }

  // For other modes, compute inline diff
  // Ensure we're comparing single lines without newlines
  const cleanLeft = leftLine.replace(/\n/g, '');
  const cleanRight = rightLine.replace(/\n/g, '');
  
  let processedLeft = cleanLeft;
  let processedRight = cleanRight;

  if (ignoreCase) {
    processedLeft = processedLeft.toLowerCase();
    processedRight = processedRight.toLowerCase();
  }

  if (ignoreWhitespace) {
    processedLeft = processedLeft.replace(/\s+/g, ' ').trim();
    processedRight = processedRight.replace(/\s+/g, ' ').trim();
  }

  let changes: Diff.Change[] = [];
  
  switch (mode) {
    case 'chars':
      changes = Diff.diffChars(processedLeft, processedRight);
      break;
    case 'words':
      changes = Diff.diffWords(processedLeft, processedRight);
      break;
    case 'sentences':
      changes = Diff.diffSentences(processedLeft, processedRight);
      break;
  }

  // Keep placeholders for the opposite side's inline-only edits. Because the
  // compare view uses a monospace font, invisible placeholders preserve the
  // horizontal column positions after an insertion/deletion and prevent the two
  // panes from looking offset on the same line.
  if (side === 'left') {
    return (
      <>
        {changes.map((change, index) => {
          const className = change.added
            ? 'invisible whitespace-pre'
            : change.removed
              ? 'diff-content-removed whitespace-pre'
              : 'whitespace-pre';

          return (
            <span key={index} className={className}>
              {change.value}
            </span>
          );
        })}
      </>
    );
  }

  return (
    <>
      {changes.map((change, index) => {
        const className = change.removed
          ? 'invisible whitespace-pre'
          : change.added
            ? 'diff-content-added whitespace-pre'
            : 'whitespace-pre';

        return (
          <span key={index} className={className}>
            {change.value}
          </span>
        );
      })}
    </>
  );
}