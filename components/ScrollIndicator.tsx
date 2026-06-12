'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface DiffPosition {
  top: number;
  type: 'added' | 'removed';
}

interface ScrollIndicatorProps {
  diffRefs: Map<number, HTMLDivElement>;
  totalHeight: number;
  isVisible: boolean;
}

export default function ScrollIndicator({
  diffRefs,
  totalHeight,
  isVisible
}: ScrollIndicatorProps) {
  const diffPositions = useMemo(() => {
    const positions: DiffPosition[] = [];
    if (!totalHeight) return positions;

    diffRefs.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const absoluteTop = window.pageYOffset + rect.top;
      const percentage = (absoluteTop / totalHeight) * 100;

      // Each tracked element is the first row of a diff block; rows carry
      // their type in a data attribute. A block starting with a removed row
      // is a deletion/modification, one starting with a filler row marks a
      // pure addition.
      const type = element.dataset.diffType === 'removed' ? 'removed' : 'added';
      positions.push({ top: percentage, type });
    });

    return positions;
  }, [diffRefs, totalHeight]);

  if (!isVisible || diffPositions.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-12 right-2 top-12 z-30 hidden w-[3px] rounded-full sm:block"
      style={{ background: 'var(--hairline)' }}
    >
      {diffPositions.map((pos, index) => (
        <motion.div
          key={index}
          className="absolute -left-[2.5px] h-2 w-2 rounded-full"
          style={{
            top: `${pos.top}%`,
            background: pos.type === 'added' ? 'var(--added)' : 'var(--removed)',
            boxShadow: '0 0 0 2px var(--sheet)'
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ delay: Math.min(index * 0.03, 0.5) }}
        />
      ))}
    </div>
  );
}
