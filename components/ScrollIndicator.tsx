'use client';

import React, { useEffect, useState, useMemo } from 'react';
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

export default function ScrollIndicator({ diffRefs, totalHeight, isVisible }: ScrollIndicatorProps) {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  const diffPositions = useMemo(() => {
    const positions: DiffPosition[] = [];
    diffRefs.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const absoluteTop = window.pageYOffset + rect.top;
      const percentage = (absoluteTop / totalHeight) * 100;
      
      // Determine type based on element classes
      const isAdded = element.classList.contains('diff-line-added');
      const isRemoved = element.classList.contains('diff-line-removed');
      
      if (isAdded || isRemoved) {
        positions.push({
          top: percentage,
          type: isAdded ? 'added' : 'removed'
        });
      }
    });
    return positions;
  }, [diffRefs, totalHeight]);

  useEffect(() => {
    const updateScrollInfo = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      
      setScrollPercentage((scrollTop / (docHeight - winHeight)) * 100);
      setViewportHeight((winHeight / docHeight) * 100);
    };

    updateScrollInfo();
    window.addEventListener('scroll', updateScrollInfo);
    window.addEventListener('resize', updateScrollInfo);

    return () => {
      window.removeEventListener('scroll', updateScrollInfo);
      window.removeEventListener('resize', updateScrollInfo);
    };
  }, []);

  if (!isVisible || diffPositions.length === 0) return null;

  return (
    <div className="fixed right-4 top-0 h-full w-2 bg-gray-200 dark:bg-gray-700 z-30 pointer-events-none">
      {/* Diff markers */}
      {diffPositions.map((pos, index) => (
        <motion.div
          key={index}
          className={`absolute left-0 w-full h-2 ${
            pos.type === 'added' 
              ? 'bg-green-500' 
              : 'bg-red-500'
          }`}
          style={{ top: `${pos.top}%` }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 0.8, scaleX: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ opacity: 1, scaleX: 1.5 }}
        />
      ))}
    </div>
  );
}