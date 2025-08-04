'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Check,
  Settings,
  FileText,
  Code,
  Database,
  Braces,
  Hash,
  Type,
  Maximize2,
  Minimize2,
  RotateCcw,
  FileCode2,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle2,
  GitCompare
} from 'lucide-react';
import { computeDiff, formatText, DiffOptions, DiffMode } from '@/utils/diff';
import LineDiffDisplay from './LineDiffDisplay';
import ScrollIndicator from './ScrollIndicator';

const formatOptions = [
  { value: 'plain', label: 'Plain Text', icon: FileText },
  { value: 'json', label: 'JSON', icon: Braces },
  { value: 'javascript', label: 'JavaScript', icon: Code },
  { value: 'typescript', label: 'TypeScript', icon: Code },
  { value: 'python', label: 'Python', icon: Code },
  { value: 'sql', label: 'SQL', icon: Database },
  { value: 'java', label: 'Java', icon: Code },
  { value: 'csharp', label: 'C#', icon: Hash },
  { value: 'html', label: 'HTML', icon: Code },
  { value: 'css', label: 'CSS', icon: Type },
];

const diffModes: { value: DiffMode; label: string }[] = [
  { value: 'lines', label: 'Lines' },
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
  
  const diffRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const statsBarRef = useRef<HTMLDivElement>(null);
  const isNavigating = useRef(false);

  const formattedText1 = useMemo(() => formatText(text1, format), [text1, format]);
  const formattedText2 = useMemo(() => formatText(text2, format), [text2, format]);

  const diffResult = useMemo(() => {
    if (!showDiff) return null;
    return computeDiff(formattedText1, formattedText2, diffOptions);
  }, [formattedText1, formattedText2, diffOptions, showDiff]);

  // 保存上一次的选项值，用于检测变化
  const prevOptionsRef = useRef({ diffOptions, format });
  
  // 当 diffOptions 或 format 改变时，重新执行比较
  useEffect(() => {
    // 检查是否真的有变化
    const optionsChanged = 
      prevOptionsRef.current.diffOptions !== diffOptions || 
      prevOptionsRef.current.format !== format;
    
    if (showDiff && optionsChanged && (text1 || text2)) {
      // 更新 ref
      prevOptionsRef.current = { diffOptions, format };
      
      // 执行重置逻辑
      setShowDiff(false);
      setCurrentDiffIndex(-1);
      diffRefs.current.clear();
      
      // 使用 setTimeout 确保状态更新完成后再重新比较
      setTimeout(() => {
        // 重新执行比较
        setShowDiff(true);
        setCurrentDiffIndex(-1);
        diffRefs.current.clear();
        onDiffToggle?.(true);
      }, 50);
    }
  }, [diffOptions, format, showDiff, text1, text2, onDiffToggle]);

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

  const navigateToDiff = useCallback((direction: 'prev' | 'next') => {
    if (!diffResult || diffCount === 0) return;

    // 1. 设置一个标记，表示我们正在通过代码主动导航
    isNavigating.current = true;

    let targetDiffIndex;
    if (direction === 'next') {
      // 如果当前是 -1（未开始），则跳到第一个（0）
      if (currentDiffIndex === -1) {
        targetDiffIndex = 0;
      } else {
        targetDiffIndex = (currentDiffIndex + 1) % diffCount;
      }
    } else {
      // 如果当前是 -1（未开始），则跳到最后一个
      if (currentDiffIndex === -1) {
        targetDiffIndex = diffCount - 1;
      } else {
        targetDiffIndex = (currentDiffIndex - 1 + diffCount) % diffCount;
      }
    }

    // 2. 立即更新 currentDiffIndex
    setCurrentDiffIndex(targetDiffIndex);
    
    // 3. 滚动到目标元素
    const diffElements = Array.from(diffRefs.current.values());
    if (targetDiffIndex < diffElements.length) {
      // 现在 diffRefs 中存储的是每个差异组的第一个元素
      // 所以可以直接使用 targetDiffIndex
      diffElements[targetDiffIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 4. 设置一个定时器，在滚动动画结束后清除标记。
    //    这样用户自己手动滚动时，滚动监听又能正常工作了。
    //    700ms 通常足够完成一个平滑滚动动画。
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
      // 如果是代码触发的导航滚动，则忽略本次滚动事件，防止冲突
      if (isNavigating.current) {
        return;
      }

      if (statsBarRef.current) {
        const rect = statsBarRef.current.getBoundingClientRect();
        setIsScrolled(rect.bottom < 0);
      }
      
      // Update current diff index based on scroll position
      if (diffRefs.current.size > 0 && diffCount > 0) {
        const diffElements = Array.from(diffRefs.current.values());
        const viewportCenter = window.innerHeight / 2;
        
        // 找到最接近视口中心的差异组
        let closestIndex = 0;
        let closestDistance = Infinity;
        
        diffElements.forEach((element, index) => {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top;
          const distance = Math.abs(elementTop - viewportCenter);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });
        
        // 只有在用户已经开始导航或滚动后才更新索引
        // 如果当前是 -1 且最接近的是第 0 个，只有当它真正进入视口中心区域才更新
        if (currentDiffIndex === -1) {
          const firstElement = diffElements[0];
          if (firstElement) {
            const rect = firstElement.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            // 只有当第一个差异真正接近视口中心时才更新到 0
            if (Math.abs(rect.top - viewportCenter) < 100) {
              setCurrentDiffIndex(0);
            }
          }
        } else if (currentDiffIndex !== -1) {
          // 检查是否应该重置为 -1（用户滚动到顶部）
          const firstElement = diffElements[0];
          if (firstElement) {
            const rect = firstElement.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            // 如果第一个差异在视口中心下方很远，说明用户在顶部
            if (rect.top > viewportCenter + 100) {
              setCurrentDiffIndex(-1);
              return;
            }
          }
          
          // 否则更新为最接近的索引
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
    
    // Update height when diff results change
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


  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-40 bg-background' : ''} flex flex-col h-full`}>
      {/* Header */}
      <header className="px-6 py-4 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
        >
          Text Compare Pro
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
        >
          Professional text comparison with advanced diff algorithms, syntax highlighting, and real-time analysis
        </motion.p>
      </header>

      {/* Input Section */}
      <div className="px-6 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left Input */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="glass-morphism dark:glass-morphism-dark rounded-2xl p-6 h-64 transition-all duration-300 hover:shadow-2xl">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Original Text
                </label>
                <button
                  onClick={() => handleCopy(text1, 1)}
                  className="p-2 rounded-lg hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all"
                >
                  {copied1 ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Paste or type your original text here..."
                className="w-full h-40 bg-transparent resize-none outline-none placeholder-gray-400 custom-scrollbar"
              />
            </div>
          </motion.div>

          {/* Right Input */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="glass-morphism dark:glass-morphism-dark rounded-2xl p-6 h-64 transition-all duration-300 hover:shadow-2xl">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Modified Text
                </label>
                <button
                  onClick={() => handleCopy(text2, 2)}
                  className="p-2 rounded-lg hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all"
                >
                  {copied2 ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Paste or type your modified text here..."
                className="w-full h-40 bg-transparent resize-none outline-none placeholder-gray-400 custom-scrollbar"
              />
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-7xl mx-auto mt-4"
        >
          <div className="glass-morphism dark:glass-morphism-dark border-indigo rounded-2xl p-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Format Selector */}
              <div className="flex items-center gap-2 bg-white/30 dark:bg-gray-800/30 rounded-lg px-3 py-1.5 border border-blue-200/50 dark:border-purple-700/50">
                <Settings size={16} className="text-blue-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Format:</span>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="bg-transparent border-0 outline-none focus:ring-0 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer min-w-[120px]"
                >
                  {formatOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-white dark:bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Diff Mode */}
              <div className="flex items-center gap-2 bg-white/30 dark:bg-gray-800/30 rounded-lg px-3 py-1.5 border border-purple-200/50 dark:border-blue-700/50">
                <GitCompare size={16} className="text-purple-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Mode:</span>
                <select
                  value={diffOptions.mode}
                  onChange={(e) => setDiffOptions({ ...diffOptions, mode: e.target.value as DiffMode })}
                  className="bg-transparent border-0 outline-none focus:ring-0 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer min-w-[100px]"
                >
                  {diffModes.map(mode => (
                    <option key={mode.value} value={mode.value} className="bg-white dark:bg-gray-800">
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Options */}
              <label className="flex items-center gap-2 cursor-pointer bg-white/30 dark:bg-gray-800/30 rounded-lg px-3 py-1.5 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors">
                <input
                  type="checkbox"
                  checked={diffOptions.ignoreCase}
                  onChange={(e) => setDiffOptions({ ...diffOptions, ignoreCase: e.target.checked })}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Ignore Case</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-white/30 dark:bg-gray-800/30 rounded-lg px-3 py-1.5 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors">
                <input
                  type="checkbox"
                  checked={diffOptions.ignoreWhitespace}
                  onChange={(e) => setDiffOptions({ ...diffOptions, ignoreWhitespace: e.target.checked })}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Ignore Whitespace</span>
              </label>

              {/* Compare Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCompare}
                className="ml-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                Compare
              </motion.button>

              {/* Reset Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setText1('');
                  setText2('');
                  setShowDiff(false);
                  onDiffToggle?.(false);
                }}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <RotateCcw size={18} />
              </motion.button>

              {/* Fullscreen Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Stats Bar - Shows when scrolled */}
      {showDiff && diffResult && isScrolled && (
        <div className="fixed top-1/2 -translate-y-1/2 right-8 z-50">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-morphism dark:glass-morphism-dark rounded-2xl p-4 backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 shadow-xl border border-white/10"
          >
            <div className="flex flex-col gap-3">
              {diffResult.stats.total === 0 ? (
                <div className="flex flex-col items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-xs text-green-700 dark:text-green-400 font-semibold">Identical</span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-1 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800">
                    <Plus className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">{diffResult.stats.additions}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                    <Minus className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-700 dark:text-red-400">{diffResult.stats.deletions}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{diffResult.stats.modifications}</span>
                  </div>
                </>
              )}
              
              {diffCount > 0 && (
                <>
                  <div className="h-px bg-gray-300 dark:bg-gray-600" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                      {currentDiffIndex === -1 ? 0 : currentDiffIndex + 1} / {diffCount}
                    </div>
                    <div className="flex flex-col gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigateToDiff('prev')}
                        className="p-1.5 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md transition-all"
                      >
                        <ChevronUp size={16} className="text-gray-700 dark:text-gray-300" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigateToDiff('next')}
                        className="p-1.5 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md transition-all"
                      >
                        <ChevronDown size={16} className="text-gray-700 dark:text-gray-300" />
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </div>
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
            className="flex-1 px-6 pb-6"
          >
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              {/* Stats Bar - Normal Position */}
              <div ref={statsBarRef} className="glass-morphism dark:glass-morphism-dark border-emerald rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {diffResult.stats.total === 0 ? (
                      <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 dark:text-green-400 font-semibold">Files are identical</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 px-4 py-2 rounded-lg border border-green-200 dark:border-green-800">
                          <Plus className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-700 dark:text-green-400">{diffResult.stats.additions}</span>
                          <span className="text-xs text-green-600 dark:text-green-500">additions</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800">
                          <Minus className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-semibold text-red-700 dark:text-red-400">{diffResult.stats.deletions}</span>
                          <span className="text-xs text-red-600 dark:text-red-500">deletions</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{diffResult.stats.modifications}</span>
                          <span className="text-xs text-amber-600 dark:text-amber-500">modified</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
                          <FileCode2 className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">{diffResult.stats.total}</span>
                          <span className="text-xs text-blue-600 dark:text-blue-500">changes</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {diffCount > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Change 0 / {diffCount}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigateToDiff('prev')}
                          className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md transition-all"
                        >
                          <ChevronUp size={18} className="text-gray-700 dark:text-gray-300" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigateToDiff('next')}
                          className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md transition-all"
                        >
                          <ChevronDown size={18} className="text-gray-700 dark:text-gray-300" />
                        </motion.button>
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
                onDiffCountChange={(count) => {
                  // 这个回调会在 LineDiffDisplay 重新计算 diff 后被调用
                  // 确保 diffRefs 被正确填充
                }}
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
    </div>
  );
}