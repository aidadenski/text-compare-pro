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
  
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Clear previous refs
    diffRefs.current.clear();
    let diffGroupIndex = 0;
    let inDiffBlock = false;

    // Group consecutive diff lines into diff blocks
    leftLines.forEach((lineInfo, index) => {
      if (lineInfo.type !== 'unchanged') {
        if (!inDiffBlock && leftRefs.current[index]) {
          // Start of a new diff block
          diffRefs.current.set(diffGroupIndex++, leftRefs.current[index]!);
          inDiffBlock = true;
        }
      } else {
        // End of diff block
        inDiffBlock = false;
      }
    });
    
    // Notify parent component about the actual diff count
    if (onDiffCountChange) {
      onDiffCountChange(diffGroupIndex);
    }
  }, [leftLines, diffRefs, onDiffCountChange]);

  return (
    <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-3 min-h-0 overflow-hidden">
      {/* Left Panel */}
      <div className="glass-morphism dark:glass-morphism-dark border-rose rounded-2xl p-3 overflow-auto custom-scrollbar min-w-0">
        <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-200">Original</h3>
        <div className="font-mono text-sm overflow-x-hidden">
          {leftLines.map((lineInfo, index) => {
            const rightLineInfo = rightLines[index];
            // Show inline diff for non-line modes when:
            // 1. Both lines exist and are marked as unchanged but content differs (ignoreCase/ignoreWhitespace)
            // 2. Both lines exist and one is removed/added (for character/word level diff)
            const showInlineDiff = diffMode !== 'lines' && (
              (lineInfo.type === 'unchanged' && 
               rightLineInfo?.type === 'unchanged' &&
               lineInfo.content !== rightLineInfo.content) ||
              (lineInfo.type === 'removed' && rightLineInfo?.type === 'added' &&
               lineInfo.content && rightLineInfo.content)
            );
            
            // Check if this is a complete line deletion (no corresponding line on right)
            const isCompleteDeletion = lineInfo.type === 'removed' && rightLineInfo?.type === 'empty';
            
            return (
              <div
                key={index}
                ref={el => {
                  leftRefs.current[index] = el;
                }}
                className={`px-3 py-1 flex items-start ${
                  lineInfo.type === 'removed' && (!showInlineDiff || isCompleteDeletion) ? 'diff-line-removed' : 
                  lineInfo.type === 'removed' && showInlineDiff && !isCompleteDeletion ? 'diff-line-removed-light' : 
                  showInlineDiff && lineInfo.type === 'unchanged' && lineInfo.content !== rightLineInfo?.content ? 'diff-line-removed-light' : ''
                }`}
              >
                <span className="text-gray-500 text-xs mr-3 select-none flex-shrink-0 inline-block w-12 text-right">
                  {lineInfo.originalLineNumber || ''}
                </span>
                <div className="flex-1 line-content">
                  {lineInfo.type === 'empty' ? (
                    <span className="text-gray-400">&nbsp;</span>
                  ) : showInlineDiff ? (
                    <DiffLine
                      leftLine={lineInfo.content}
                      rightLine={rightLineInfo.content}
                      mode={diffMode}
                      side="left"
                      ignoreCase={ignoreCase}
                      ignoreWhitespace={ignoreWhitespace}
                    />
                  ) : (
                    <span className={
                      lineInfo.type === 'removed' && (diffMode === 'lines' || isCompleteDeletion) ? 'diff-content-removed whitespace-pre' : 'whitespace-pre'
                    }>
                      {lineInfo.content}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel */}
      <div className="glass-morphism dark:glass-morphism-dark border-cyan rounded-2xl p-3 overflow-auto custom-scrollbar min-w-0">
        <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-200">Modified</h3>
        <div className="font-mono text-sm overflow-x-hidden">
          {rightLines.map((lineInfo, index) => {
            const leftLineInfo = leftLines[index];
            // Show inline diff for non-line modes when:
            // 1. Both lines exist and are marked as unchanged but content differs (ignoreCase/ignoreWhitespace)
            // 2. Both lines exist and one is added/removed (for character/word level diff)
            const showInlineDiff = diffMode !== 'lines' && (
              (lineInfo.type === 'unchanged' && 
               leftLineInfo?.type === 'unchanged' &&
               lineInfo.content !== leftLineInfo.content) ||
              (lineInfo.type === 'added' && leftLineInfo?.type === 'removed' &&
               lineInfo.content && leftLineInfo.content)
            );
            
            // Check if this is a complete line addition (no corresponding line on left)
            const isCompleteAddition = lineInfo.type === 'added' && leftLineInfo?.type === 'empty';
            
            return (
              <div
                key={index}
                ref={el => {
                  rightRefs.current[index] = el;
                }}
                className={`px-3 py-1 flex items-start ${
                  lineInfo.type === 'added' && (!showInlineDiff || isCompleteAddition) ? 'diff-line-added' : 
                  lineInfo.type === 'added' && showInlineDiff && !isCompleteAddition ? 'diff-line-added-light' : 
                  showInlineDiff && lineInfo.type === 'unchanged' && lineInfo.content !== leftLineInfo?.content ? 'diff-line-added-light' : ''
                }`}
              >
                <span className="text-gray-500 text-xs mr-3 select-none flex-shrink-0 inline-block w-12 text-right">
                  {lineInfo.originalLineNumber || ''}
                </span>
                <div className="flex-1 line-content">
                  {lineInfo.type === 'empty' ? (
                    <span className="text-gray-400">&nbsp;</span>
                  ) : showInlineDiff ? (
                    <DiffLine
                      leftLine={leftLineInfo.content}
                      rightLine={lineInfo.content}
                      mode={diffMode}
                      side="right"
                      ignoreCase={ignoreCase}
                      ignoreWhitespace={ignoreWhitespace}
                    />
                  ) : (
                    <span className={
                      lineInfo.type === 'added' && (diffMode === 'lines' || isCompleteAddition) ? 'diff-content-added whitespace-pre' : 'whitespace-pre'
                    }>
                      {lineInfo.content}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}