'use client';

import React, { useRef, useEffect } from 'react';
import DiffLine from './DiffLine';

interface LineDiffDisplayProps {
  text1: string;
  text2: string;
  diffMode: 'lines' | 'chars' | 'words' | 'sentences';
  ignoreCase: boolean;
  ignoreWhitespace: boolean;
  format: string;
  diffRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
}

export default function LineDiffDisplay({
  text1,
  text2,
  diffMode,
  ignoreCase,
  ignoreWhitespace,
  diffRefs
}: LineDiffDisplayProps) {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const maxLines = Math.max(lines1.length, lines2.length);
  
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Clear previous refs
    diffRefs.current.clear();
    let diffIndex = 0;

    // Check each line pair for differences
    for (let i = 0; i < maxLines; i++) {
      const leftLine = lines1[i] || '';
      const rightLine = lines2[i] || '';
      const hasDiff = leftLine !== rightLine;
      
      if (hasDiff) {
        // Add both left and right refs if they differ
        if (leftRefs.current[i]) {
          diffRefs.current.set(diffIndex++, leftRefs.current[i]!);
        }
      }
    }
  }, [text1, text2, diffRefs, lines1, lines2, maxLines]);

  return (
    <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-3 min-h-0 overflow-hidden">
      {/* Left Panel */}
      <div className="glass-morphism dark:glass-morphism-dark rounded-2xl p-3 overflow-auto custom-scrollbar min-w-0">
        <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-200">Original</h3>
        <div className="font-mono text-sm overflow-x-hidden">
          {Array.from({ length: maxLines }).map((_, index) => {
            const line = lines1[index] || '';
            const opposingLine = lines2[index] || '';
            const hasDiff = line !== opposingLine;
            const isEmpty = !line && opposingLine;
            
            return (
              <div
                key={index}
                ref={el => {
                  leftRefs.current[index] = el;
                }}
                className={`px-3 py-1 flex items-start ${
                  hasDiff && !isEmpty ? 'diff-line-removed' : ''
                }`}
              >
                <span className="text-gray-500 text-xs mr-3 select-none flex-shrink-0 inline-block w-12 text-right">
                  {index + 1}
                </span>
                <div className="flex-1 line-content">
                  {isEmpty ? (
                    <span className="text-gray-400">&nbsp;</span>
                  ) : (
                    <DiffLine
                      leftLine={line}
                      rightLine={opposingLine}
                      mode={diffMode}
                      side="left"
                      ignoreCase={ignoreCase}
                      ignoreWhitespace={ignoreWhitespace}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel */}
      <div className="glass-morphism dark:glass-morphism-dark rounded-2xl p-3 overflow-auto custom-scrollbar min-w-0">
        <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-200">Modified</h3>
        <div className="font-mono text-sm overflow-x-hidden">
          {Array.from({ length: maxLines }).map((_, index) => {
            const line = lines2[index] || '';
            const opposingLine = lines1[index] || '';
            const hasDiff = line !== opposingLine;
            const isEmpty = !line && opposingLine;
            
            return (
              <div
                key={index}
                ref={el => {
                  rightRefs.current[index] = el;
                }}
                className={`px-3 py-1 flex items-start ${
                  hasDiff && !isEmpty ? 'diff-line-added' : ''
                }`}
              >
                <span className="text-gray-500 text-xs mr-3 select-none flex-shrink-0 inline-block w-12 text-right">
                  {index + 1}
                </span>
                <div className="flex-1 line-content">
                  {isEmpty ? (
                    <span className="text-gray-400">&nbsp;</span>
                  ) : (
                    <DiffLine
                      leftLine={opposingLine}
                      rightLine={line}
                      mode={diffMode}
                      side="right"
                      ignoreCase={ignoreCase}
                      ignoreWhitespace={ignoreWhitespace}
                    />
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