'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import * as Diff from 'diff';
import DiffLine from './DiffLine';

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

interface LineInfo {
  content: string;
  type: 'added' | 'removed' | 'unchanged' | 'empty';
  originalLineNumber?: number;
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
  
  // Use Diff.diffLines to get proper line-level diff
  const { leftLines, rightLines } = useMemo(() => {
    const left: LineInfo[] = [];
    const right: LineInfo[] = [];
    
    // Split texts into lines for processing
    const originalLines1 = text1.split('\n');
    const originalLines2 = text2.split('\n');
    
    // Apply preprocessing if needed
    let processedText1 = text1;
    let processedText2 = text2;
    
    if (ignoreCase) {
      processedText1 = processedText1.toLowerCase();
      processedText2 = processedText2.toLowerCase();
    }
    
    if (ignoreWhitespace) {
      processedText1 = processedText1.replace(/\s+/g, ' ').trim();
      processedText2 = processedText2.replace(/\s+/g, ' ').trim();
    }
    
    // Get line diff
    const changes = Diff.diffLines(processedText1, processedText2);
    let leftLineNumber = 1;
    let rightLineNumber = 1;
    let changeIndex = 0;
    
    // Process changes and try to pair removed/added lines
    while (changeIndex < changes.length) {
      const change = changes[changeIndex];
      const lines = change.value.split('\n').filter((line, index, arr) => 
        index < arr.length - 1 || line !== ''
      );
      
      if (change.removed) {
        // Check if next change is added (potential modification)
        const nextChange = changes[changeIndex + 1];
        if (nextChange && nextChange.added) {
          const addedLines = nextChange.value.split('\n').filter((line, index, arr) => 
            index < arr.length - 1 || line !== ''
          );
          
          // Pair up removed and added lines
          const maxLines = Math.max(lines.length, addedLines.length);
          for (let i = 0; i < maxLines; i++) {
            if (i < lines.length) {
              left.push({ 
                content: originalLines1[leftLineNumber - 1] || '', 
                type: 'removed',
                originalLineNumber: leftLineNumber++
              });
            } else {
              left.push({ content: '', type: 'empty' });
            }
            
            if (i < addedLines.length) {
              right.push({ 
                content: originalLines2[rightLineNumber - 1] || '', 
                type: 'added',
                originalLineNumber: rightLineNumber++
              });
            } else {
              right.push({ content: '', type: 'empty' });
            }
          }
          
          // Skip the next change since we've processed it
          changeIndex += 2;
          continue;
        } else {
          // Lines only in left side
          lines.forEach(() => {
            left.push({ 
              content: originalLines1[leftLineNumber - 1] || '', 
              type: 'removed',
              originalLineNumber: leftLineNumber++
            });
            right.push({ content: '', type: 'empty' });
          });
        }
      } else if (change.added) {
        // Lines only in right side (not paired with removed)
        lines.forEach(() => {
          left.push({ content: '', type: 'empty' });
          right.push({ 
            content: originalLines2[rightLineNumber - 1] || '', 
            type: 'added',
            originalLineNumber: rightLineNumber++
          });
        });
      } else {
        // Unchanged lines
        lines.forEach(() => {
          const originalLeftLine = originalLines1[leftLineNumber - 1] || '';
          const originalRightLine = originalLines2[rightLineNumber - 1] || '';
          
          left.push({ 
            content: originalLeftLine, 
            type: 'unchanged',
            originalLineNumber: leftLineNumber++
          });
          right.push({ 
            content: originalRightLine, 
            type: 'unchanged',
            originalLineNumber: rightLineNumber++
          });
        });
      }
      
      changeIndex++;
    }
    
    return { leftLines: left, rightLines: right };
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
      <div className="glass-morphism dark:glass-morphism-dark rounded-2xl p-3 overflow-auto custom-scrollbar min-w-0">
        <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-200">Original</h3>
        <div className="font-mono text-sm overflow-x-hidden">
          {leftLines.map((lineInfo, index) => {
            const rightLineInfo = rightLines[index];
            const showInlineDiff = diffMode !== 'lines' && 
                                 lineInfo.type === 'unchanged' && 
                                 rightLineInfo?.type === 'unchanged' &&
                                 lineInfo.content !== rightLineInfo.content;
            
            return (
              <div
                key={index}
                ref={el => {
                  leftRefs.current[index] = el;
                }}
                className={`px-3 py-1 flex items-start ${
                  lineInfo.type === 'removed' ? 'diff-line-removed' : ''
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
                      lineInfo.type === 'removed' ? 'diff-content-removed whitespace-pre' : 'whitespace-pre'
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
      <div className="glass-morphism dark:glass-morphism-dark rounded-2xl p-3 overflow-auto custom-scrollbar min-w-0">
        <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-200">Modified</h3>
        <div className="font-mono text-sm overflow-x-hidden">
          {rightLines.map((lineInfo, index) => {
            const leftLineInfo = leftLines[index];
            const showInlineDiff = diffMode !== 'lines' && 
                                 lineInfo.type === 'unchanged' && 
                                 leftLineInfo?.type === 'unchanged' &&
                                 lineInfo.content !== leftLineInfo.content;
            
            return (
              <div
                key={index}
                ref={el => {
                  rightRefs.current[index] = el;
                }}
                className={`px-3 py-1 flex items-start ${
                  lineInfo.type === 'added' ? 'diff-line-added' : ''
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
                      lineInfo.type === 'added' ? 'diff-content-added whitespace-pre' : 'whitespace-pre'
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