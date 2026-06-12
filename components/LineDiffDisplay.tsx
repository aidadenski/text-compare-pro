'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import DiffLine from './DiffLine';
import { computeAlignedLineDiff } from '@/utils/diff';

interface LineDiffDisplayProps {
  text1: string;
  text2: string;
  diffMode: 'lines' | 'chars' | 'words' | 'sentences';
  ignoreCase: boolean;
  ignoreWhitespace: boolean;
  format: string;
  diffRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
  onDiffCountChange?: (count: number) => void;
}

export default function LineDiffDisplay({
  text1,
  text2,
  diffMode,
  ignoreCase,
  ignoreWhitespace,
  diffRefs,
  onDiffCountChange
}: LineDiffDisplayProps) {

  // Use the diff library's native line comparison options so the diff tokens
  // keep their original line boundaries. Collapsing whitespace before line
  // diffing can turn multi-line text into one token and desynchronize the
  // displayed line numbers.
  const { leftLines, rightLines } = useMemo(() => {
    return computeAlignedLineDiff(text1, text2, { ignoreCase, ignoreWhitespace });
  }, [text1, text2, ignoreCase, ignoreWhitespace]);

  const leftRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leftPaneRef = useRef<HTMLDivElement | null>(null);
  const rightPaneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Clear previous refs and group consecutive changed lines into blocks
    diffRefs.current.clear();
    let diffGroupIndex = 0;
    let inDiffBlock = false;

    leftLines.forEach((lineInfo, index) => {
      if (lineInfo.type !== 'unchanged') {
        const el = leftRowRefs.current[index];
        if (!inDiffBlock && el) {
          diffRefs.current.set(diffGroupIndex++, el);
          inDiffBlock = true;
        }
      } else {
        inDiffBlock = false;
      }
    });

    onDiffCountChange?.(diffGroupIndex);
  }, [leftLines, diffRefs, onDiffCountChange]);

  // Mirror scrolling between the two panes so rows stay visually aligned
  // whether the panes scroll vertically (fullscreen) or horizontally (long
  // lines). Assigning an unchanged scroll position fires no event, so the
  // ping-pong settles immediately.
  const syncScroll =
    (from: 'left' | 'right') => (event: React.UIEvent<HTMLDivElement>) => {
      const source = event.currentTarget;
      const target = from === 'left' ? rightPaneRef.current : leftPaneRef.current;
      if (!target) return;
      if (target.scrollTop !== source.scrollTop) {
        target.scrollTop = source.scrollTop;
      }
      if (target.scrollLeft !== source.scrollLeft) {
        target.scrollLeft = source.scrollLeft;
      }
    };

  // Full literal class names so Tailwind's content scanner keeps the rules
  // defined in globals.css (template strings would get tree-shaken away).
  const rowClasses = {
    removed: { full: 'diff-row-removed', soft: 'diff-row-removed-soft' },
    added: { full: 'diff-row-added', soft: 'diff-row-added-soft' },
  } as const;

  const renderRows = (side: 'left' | 'right') => {
    const lines = side === 'left' ? leftLines : rightLines;
    const counterpart = side === 'left' ? rightLines : leftLines;
    const changedType = side === 'left' ? 'removed' : 'added';
    const counterpartChangedType = side === 'left' ? 'added' : 'removed';

    return lines.map((lineInfo, index) => {
      const other = counterpart[index];
      // Show inline (word/char/sentence) diff when:
      // 1. Both lines are "unchanged" but their raw content differs
      //    (ignoreCase / ignoreWhitespace comparisons), or
      // 2. The pair is a modification: removed on the left, added on the
      //    right, both with content.
      const showInlineDiff =
        diffMode !== 'lines' &&
        !!other &&
        ((lineInfo.type === 'unchanged' &&
          other.type === 'unchanged' &&
          lineInfo.content !== other.content) ||
          (lineInfo.type === changedType &&
            other.type === counterpartChangedType &&
            !!lineInfo.content &&
            !!other.content));

      let rowClass = '';
      if (lineInfo.type === 'empty') {
        rowClass = 'diff-row-filler';
      } else if (lineInfo.type === changedType) {
        rowClass = showInlineDiff
          ? rowClasses[changedType].soft
          : rowClasses[changedType].full;
      } else if (showInlineDiff) {
        rowClass = rowClasses[changedType].soft;
      }

      const sign =
        lineInfo.type === 'removed' ? '−' : lineInfo.type === 'added' ? '+' : '';

      return (
        <div
          key={index}
          ref={
            side === 'left'
              ? (el) => {
                  leftRowRefs.current[index] = el;
                }
              : undefined
          }
          data-diff-type={lineInfo.type}
          className={`diff-row ${rowClass}`}
        >
          <span className="diff-gutter">
            <span className="diff-num">{lineInfo.originalLineNumber ?? ''}</span>
            <span className="diff-sign">{sign}</span>
          </span>
          <span className="diff-code">
            {lineInfo.type === 'empty' ? (
              ''
            ) : showInlineDiff && other ? (
              <DiffLine
                leftLine={side === 'left' ? lineInfo.content : other.content}
                rightLine={side === 'left' ? other.content : lineInfo.content}
                mode={diffMode}
                side={side}
                ignoreCase={ignoreCase}
                ignoreWhitespace={ignoreWhitespace}
              />
            ) : (
              lineInfo.content
            )}
          </span>
        </div>
      );
    });
  };

  const renderPanel = (side: 'left' | 'right') => {
    const isLeft = side === 'left';
    const lines = isLeft ? leftLines : rightLines;
    const lineCount = lines.filter((line) => line.type !== 'empty').length;

    return (
      <section className="card flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl">
        <header className="flex shrink-0 items-center justify-between border-b border-hairline px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <span
              className={`h-2 w-2 rounded-full ${isLeft ? 'bg-removed' : 'bg-added'}`}
            />
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              {isLeft ? 'Original' : 'Modified'}
            </h3>
          </div>
          <span className="font-mono text-[11px] tabular-nums text-muted">
            {lineCount} lines
          </span>
        </header>
        <div
          ref={isLeft ? leftPaneRef : rightPaneRef}
          onScroll={syncScroll(side)}
          className="diff-sheet custom-scrollbar min-h-0 flex-1 overflow-auto"
        >
          <div className="w-max min-w-full py-1.5 font-mono text-[12.5px] leading-6 text-foreground">
            {renderRows(side)}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
      {renderPanel('left')}
      {renderPanel('right')}
    </div>
  );
}
