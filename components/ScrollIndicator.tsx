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

export default function ScrollIndicator({ diffRefs, totalHeight, isVisible }: ScrollIndicatorProps) {
  // const [scrollPercentage, setScrollPercentage] = useState(0);
  // const [viewportHeight, setViewportHeight] = useState(0);

  const diffPositions = useMemo(() => {
    const positions: DiffPosition[] = [];
    diffRefs.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const absoluteTop = window.pageYOffset + rect.top;
      const percentage = (absoluteTop / totalHeight) * 100;
      
      // Determine type based on element classes
      const isAdded = element.classList.contains('diff-line-added') || 
                      element.classList.contains('diff-line-added-light');
      const isRemoved = element.classList.contains('diff-line-removed') || 
                        element.classList.contains('diff-line-removed-light');
      
      if (isAdded || isRemoved) {
        positions.push({
          top: percentage,
          type: isAdded ? 'added' : 'removed'
        });
      }
    });
    return positions;
  }, [diffRefs, totalHeight]);

  // useEffect(() => {
  //   const updateScrollInfo = () => {
  //     const scrollTop = window.pageYOffset;
  //     const docHeight = document.documentElement.scrollHeight;
  //     const winHeight = window.innerHeight;
      
  //     setScrollPercentage((scrollTop / (docHeight - winHeight)) * 100);
  //     setViewportHeight((winHeight / docHeight) * 100);
  //   };

  //   updateScrollInfo();
  //   window.addEventListener('scroll', updateScrollInfo);
  //   window.addEventListener('resize', updateScrollInfo);

  //   return () => {
  //     window.removeEventListener('scroll', updateScrollInfo);
  //     window.removeEventListener('resize', updateScrollInfo);
  //   };
  // }, []);

  if (!isVisible || diffPositions.length === 0) return null;

  return (
    <div className="fixed right-4 top-0 h-full w-2 bg-gradient-to-b from-purple-200 via-blue-200 to-pink-200 dark:from-purple-800 dark:via-blue-800 dark:to-pink-800 rounded-full opacity-50 z-30 pointer-events-none">
      {/* Diff markers */}
      {diffPositions.map((pos, index) => (
        <motion.div
          key={index}
          className={`absolute left-0 w-full h-2 rounded-full ${
            pos.type === 'added' 
              ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-lg shadow-emerald-300/50' 
              : 'bg-gradient-to-r from-rose-400 to-pink-400 shadow-lg shadow-rose-300/50'
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