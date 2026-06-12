'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Check,
  FileCode2,
  Maximize2,
  Minimize2,
  RotateCcw,
  ArrowLeftRight,
  CheckCircle2,
  GitCompare,
  ArrowUp
} from 'lucide-react';
import { computeDiff, formatText, DiffOptions, DiffMode } from '@/utils/diff';
import LineDiffDisplay from './LineDiffDisplay';
import ScrollIndicator from './ScrollIndicator';

const formatOptions = [
  { value: 'plain', label: 'Plain Text' },
  { value: 'json', label: 'JSON' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'sql', label: 'SQL' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
];

const diffModes: { value: DiffMode; label: string }[] = [
  { value: 'lines', label: 'Lines' },
  { value: 'words', label: 'Words' },
  { value: 'sentences', label: 'Sentences' },
  { value: 'chars', label: 'Characters' },
];

interface TextCompareProps {
  onDiffToggle?: (showDiff: boolean) => void;
}

export default function TextCompare({ onDiffToggle }: TextCompareProps = {}) {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffOptions, setDiffOptions] = useState<DiffOptions>({
    mode: 'lines',
    ignoreCase: false,
    ignoreWhitespace: false,
    contextSize: 3,
  });
  const [format, setFormat] = useState('plain');
  const [showDiff, setShowDiff] = useState(false);
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const [currentDiffIndex, setCurrentDiffIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [documentHeight, setDocumentHeight] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const diffRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const statsBarRef = useRef<HTMLDivElement>(null);
  const isNavigating = useRef(false);

  const formattedText1 = useMemo(() => formatText(text1, format), [text1, format]);
  const formattedText2 = useMemo(() => formatText(text2, format), [text2, format]);

  const diffResult = useMemo(() => {
    if (!showDiff) return null;
    return computeDiff(formattedText1, formattedText2, diffOptions);
  }, [formattedText1, formattedText2, diffOptions, showDiff]);

  // The diff itself recomputes automatically through the memo above; when the
  // options or format change we only need to re-anchor the navigation state.
  useEffect(() => {
    setCurrentDiffIndex(-1);
    diffRefs.current.clear();
  }, [diffOptions, format]);

  const diffCount = useMemo(() => {
    if (!diffResult) return 0;
    return diffResult.stats.total;
  }, [diffResult]);

  const handleCompare = useCallback(() => {
    setShowDiff(true);
    setCurrentDiffIndex(-1);
    diffRefs.current.clear();
    onDiffToggle?.(true);
  }, [onDiffToggle]);

  const handleSwap = useCallback(() => {
    setText1(text2);
    setText2(text1);
  }, [text1, text2]);

  const handleReset = useCallback(() => {
    setText1('');
    setText2('');
    setShowDiff(false);
    onDiffToggle?.(false);
  }, [onDiffToggle]);

  const handleCopy = useCallback(async (text: string, side: 1 | 2) => {
    await navigator.clipboard.writeText(text);
    if (side === 1) {
      setCopied1(true);
      setTimeout(() => setCopied1(false), 2000);
    } else {
      setCopied2(true);
      setTimeout(() => setCopied2(false), 2000);
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToDiff = useCallback((direction: 'prev' | 'next') => {
    if (!diffResult || diffCount === 0) return;

    // Mark that navigation is code-driven so the scroll listener stays quiet
    isNavigating.current = true;

    let targetDiffIndex;
    if (direction === 'next') {
      if (currentDiffIndex === -1) {
        targetDiffIndex = 0;
      } else {
        targetDiffIndex = (currentDiffIndex + 1) % diffCount;
      }
    } else {
      if (currentDiffIndex === -1) {
        targetDiffIndex = diffCount - 1;
      } else {
        targetDiffIndex = (currentDiffIndex - 1 + diffCount) % diffCount;
      }
    }

    setCurrentDiffIndex(targetDiffIndex);

    const diffElements = Array.from(diffRefs.current.values());
    if (targetDiffIndex < diffElements.length) {
      diffElements[targetDiffIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Release the flag once the smooth scroll has settled so manual
    // scrolling updates the index again.
    setTimeout(() => {
      isNavigating.current = false;
    }, 700);
  }, [currentDiffIndex, diffCount, diffResult]);

  // Notify parent when showDiff changes
  useEffect(() => {
    onDiffToggle?.(showDiff);
  }, [showDiff, onDiffToggle]);

  // Monitor scroll position and document height
  useEffect(() => {
    const handleScroll = () => {
      if (isNavigating.current) {
        return;
      }

      if (statsBarRef.current) {
        const rect = statsBarRef.current.getBoundingClientRect();
        setIsScrolled(rect.bottom < 0);
      }

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollToTop(scrollTop > 200);

      // Update current diff index based on scroll position
      if (diffRefs.current.size > 0 && diffCount > 0) {
        const diffElements = Array.from(diffRefs.current.values());
        const viewportCenter = window.innerHeight / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        diffElements.forEach((element, index) => {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - viewportCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        if (currentDiffIndex === -1) {
          const firstElement = diffElements[0];
          if (firstElement) {
            const rect = firstElement.getBoundingClientRect();
            if (Math.abs(rect.top - viewportCenter) < 100) {
              setCurrentDiffIndex(0);
            }
          }
        } else {
          const firstElement = diffElements[0];
          if (firstElement) {
            const rect = firstElement.getBoundingClientRect();
            if (rect.top > viewportCenter + 100) {
              setCurrentDiffIndex(-1);
              return;
            }
          }

          if (closestIndex !== currentDiffIndex && closestIndex >= 0 && closestIndex < diffCount) {
            setCurrentDiffIndex(closestIndex);
          }
        }
      }
    };

    const updateDocumentHeight = () => {
      setDocumentHeight(document.documentElement.scrollHeight);
    };

    handleScroll();
    updateDocumentHeight();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateDocumentHeight);

    const observer = new ResizeObserver(updateDocumentHeight);
    if (document.body) {
      observer.observe(document.body);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateDocumentHeight);
      observer.disconnect();
    };
  }, [showDiff, currentDiffIndex, diffCount]);

  const renderEditor = (side: 1 | 2) => {
    const isOriginal = side === 1;
    const value = isOriginal ? text1 : text2;
    const setValue = isOriginal ? setText1 : setText2;
    const copied = isOriginal ? copied1 : copied2;
    const lineCount = value ? value.split('\n').length : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isOriginal ? 0.15 : 0.2 }}
        className="min-w-0"
      >
        <div className="card editor-card flex h-64 flex-col overflow-hidden rounded-2xl md:h-72">
          <div className="flex shrink-0 items-center justify-between border-b border-hairline px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2 w-2 rounded-full ${isOriginal ? 'bg-removed' : 'bg-added'}`}
              />
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                {isOriginal ? 'Original' : 'Modified'}
              </label>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-[11px] tabular-nums text-muted sm:inline">
                {lineCount} ln · {value.length} ch
              </span>
              <button
                onClick={() => handleCopy(value, side)}
                className="text-muted transition-colors hover:text-ink"
                title="Copy to clipboard"
              >
                {copied ? <Check size={14} className="text-added" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={
              isOriginal
                ? 'Paste or type your original text here...'
                : 'Paste or type your modified text here...'
            }
            spellCheck={false}
            className="custom-scrollbar w-full flex-1 resize-none bg-transparent px-4 py-3 font-mono text-[13px] leading-6 text-foreground outline-none"
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className={`${
        isFullscreen ? 'fixed inset-0 z-40 overflow-y-auto bg-background pt-6' : ''
      } flex h-full flex-col`}
    >
      {/* Header */}
      {!isFullscreen && (
        <header className="px-5 pb-8 pt-12 text-center sm:pb-10 sm:pt-14 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <span className="eyebrow">Side-by-side diff · Private by design</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mx-auto mt-5 max-w-3xl font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl md:text-[4.25rem] md:leading-[1.05]"
          >
            Text Compare <em className="italic">Pro</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:mt-5 sm:text-base md:text-lg"
          >
            The editorial-grade diff for prose and code. Find every{' '}
            <del className="demo-del">chnage</del>{' '}
            <ins className="demo-ins">change</ins> in seconds — beautifully
            highlighted, entirely in your browser.
          </motion.p>
        </header>
      )}

      {/* Input Section */}
      <div className="mb-4 px-3 sm:px-4 lg:px-6">
        <div className="relative grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {renderEditor(1)}

          {/* Swap texts — sits between the editors: horizontally on desktop,
              vertically when they stack on mobile */}
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleSwap}
              title="Swap texts"
              className="card flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
            >
              <span className="block rotate-90 transition-transform md:rotate-0">
                <ArrowLeftRight size={15} />
              </span>
            </motion.button>
          </div>

          {renderEditor(2)}
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-5 w-full"
        >
          <div className="card rounded-2xl px-3 py-3 sm:px-4 md:px-5 md:py-3.5">
            <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
              {/* Format Selector */}
              <label className="field" title="Source format">
                <FileCode2 size={14} className="shrink-0 text-muted" />
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  aria-label="Source format"
                >
                  {formatOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* Diff Mode */}
              <div className="seg" role="group" aria-label="Diff mode">
                {diffModes.map(mode => (
                  <button
                    key={mode.value}
                    type="button"
                    data-active={diffOptions.mode === mode.value}
                    onClick={() => setDiffOptions({ ...diffOptions, mode: mode.value })}
                    className="seg-item"
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Options */}
              <label className="field cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={diffOptions.ignoreCase}
                  onChange={(e) => setDiffOptions({ ...diffOptions, ignoreCase: e.target.checked })}
                />
                Ignore case
              </label>

              <label className="field cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={diffOptions.ignoreWhitespace}
                  onChange={(e) => setDiffOptions({ ...diffOptions, ignoreWhitespace: e.target.checked })}
                />
                Ignore whitespace
              </label>

              <div className="flex w-full items-center gap-2 md:ml-auto md:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="btn-icon"
                  title="Reset"
                >
                  <RotateCcw size={15} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="btn-icon"
                  title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCompare}
                  className="btn-primary flex-1 md:flex-initial"
                >
                  <GitCompare size={15} />
                  Compare
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating navigator - shows when the stats bar scrolls away */}
      {showDiff && diffResult && isScrolled && (
        <div className="fixed right-2 top-1/2 z-50 -translate-y-1/2 sm:right-5">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            className="card flex flex-col items-center gap-2.5 rounded-full px-3 py-4"
          >
            {diffResult.stats.total === 0 ? (
              <CheckCircle2 size={16} className="text-added" />
            ) : (
              <>
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold tabular-nums text-added">
                  <span className="h-1.5 w-1.5 rounded-full bg-added" />
                  {diffResult.stats.additions}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold tabular-nums text-removed">
                  <span className="h-1.5 w-1.5 rounded-full bg-removed" />
                  {diffResult.stats.deletions}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold tabular-nums text-modified">
                  <span className="h-1.5 w-1.5 rounded-full bg-modified" />
                  {diffResult.stats.modifications}
                </span>
              </>
            )}

            {diffCount > 0 && (
              <>
                <div className="h-px w-6 bg-hairline" />
                <span className="font-mono text-[10px] tabular-nums text-muted">
                  {currentDiffIndex === -1 ? 0 : currentDiffIndex + 1}/{diffCount}
                </span>
                <button
                  onClick={() => navigateToDiff('prev')}
                  className="btn-icon !h-8 !w-8"
                  title="Previous change"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => navigateToDiff('next')}
                  className="btn-icon !h-8 !w-8"
                  title="Next change"
                >
                  <ChevronDown size={14} />
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Diff Results */}
      <AnimatePresence>
        {showDiff && diffResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="min-h-0 flex-1 px-3 pb-4 sm:px-4 md:pb-6 lg:px-6"
          >
            <div className="flex h-full w-full flex-col">
              {/* Stats Bar */}
              <div ref={statsBarRef} className="card mb-4 shrink-0 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {diffResult.stats.total === 0 ? (
                      <span className="stat-chip stat-chip-added">
                        <CheckCircle2 size={13} />
                        Documents are identical
                      </span>
                    ) : (
                      <>
                        <span className="stat-chip stat-chip-added">
                          <span className="stat-dot" />
                          {diffResult.stats.additions}
                          <span className="stat-label">added</span>
                        </span>
                        <span className="stat-chip stat-chip-removed">
                          <span className="stat-dot" />
                          {diffResult.stats.deletions}
                          <span className="stat-label">removed</span>
                        </span>
                        <span className="stat-chip stat-chip-modified">
                          <span className="stat-dot" />
                          {diffResult.stats.modifications}
                          <span className="stat-label">modified</span>
                        </span>
                        <span className="stat-chip">
                          <span className="stat-dot" />
                          {diffResult.stats.total}
                          <span className="stat-label">changes</span>
                        </span>
                      </>
                    )}
                  </div>

                  {diffCount > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs tabular-nums text-muted">
                        {currentDiffIndex === -1 ? 0 : currentDiffIndex + 1}
                        <span className="mx-1 opacity-60">/</span>
                        {diffCount}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => navigateToDiff('prev')}
                          className="btn-icon !h-8 !w-8"
                          title="Previous change"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={() => navigateToDiff('next')}
                          className="btn-icon !h-8 !w-8"
                          title="Next change"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Diff Display */}
              <LineDiffDisplay
                text1={formattedText1}
                text2={formattedText2}
                diffMode={diffOptions.mode}
                ignoreCase={diffOptions.ignoreCase}
                ignoreWhitespace={diffOptions.ignoreWhitespace}
                format={format}
                diffRefs={diffRefs}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Indicator */}
      <ScrollIndicator
        diffRefs={diffRefs.current}
        totalHeight={documentHeight}
        isVisible={showDiff && diffResult !== null && diffResult.stats.total > 0}
      />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="btn-primary fixed bottom-5 right-5 z-40 !h-11 !w-11 !p-0 sm:bottom-8 sm:right-8 sm:!h-12 sm:!w-12"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            title="Back to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
