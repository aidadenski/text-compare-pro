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
  // For line mode, just return the whole line with appropriate styling
  if (mode === 'lines') {
    const isDifferent = leftLine !== rightLine;
    if (!isDifferent) {
      return <span className="whitespace-pre">{side === 'left' ? leftLine : rightLine}</span>;
    }
    
    if (side === 'left' && leftLine && !rightLine) {
      return <span className="diff-content-removed whitespace-pre">{leftLine}</span>;
    }
    if (side === 'right' && rightLine && !leftLine) {
      return <span className="diff-content-added whitespace-pre">{rightLine}</span>;
    }
    if (leftLine !== rightLine) {
      return (
        <span className={side === 'left' ? 'diff-content-removed' : 'diff-content-added'}>
          <span className="whitespace-pre">{side === 'left' ? leftLine : rightLine}</span>
        </span>
      );
    }
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

  // If showing left side, show removed and unchanged parts
  if (side === 'left') {
    return (
      <>
        {changes.map((change, index) => {
          if (change.added) return null;
          return (
            <span
              key={index}
              className={change.removed ? 'diff-content-removed whitespace-pre' : 'whitespace-pre'}
            >
              {change.value}
            </span>
          );
        })}
      </>
    );
  }

  // If showing right side, show added and unchanged parts
  return (
    <>
      {changes.map((change, index) => {
        if (change.removed) return null;
        return (
          <span
            key={index}
            className={change.added ? 'diff-content-added whitespace-pre' : 'whitespace-pre'}
          >
            {change.value}
          </span>
        );
      })}
    </>
  );
}