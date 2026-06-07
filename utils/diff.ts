import * as Diff from 'diff';

export type DiffMode = 'lines' | 'chars' | 'words' | 'sentences';

export interface DiffOptions {
  mode: DiffMode;
  ignoreCase: boolean;
  ignoreWhitespace: boolean;
  contextSize: number;
}

export interface DiffResult {
  changes: Diff.Change[];
  stats: {
    additions: number;
    deletions: number;
    modifications: number;
    total: number;
    identical: number;
  };
}

export interface DiffLineInfo {
  content: string;
  type: 'added' | 'removed' | 'unchanged' | 'empty';
  originalLineNumber?: number;
}

function splitComparableLines(value: string): string[] {
  return value.split('\n').filter((line, index, arr) =>
    index < arr.length - 1 || line !== ''
  );
}

function getDiffOptions(options: Pick<DiffOptions, 'ignoreCase' | 'ignoreWhitespace'>) {
  return {
    ignoreCase: options.ignoreCase,
    ignoreWhitespace: options.ignoreWhitespace,
  };
}

export function computeLineChanges(
  text1: string,
  text2: string,
  options: Pick<DiffOptions, 'ignoreCase' | 'ignoreWhitespace'>
): Diff.Change[] {
  return Diff.diffLines(text1, text2, getDiffOptions(options));
}

export function computeAlignedLineDiff(
  text1: string,
  text2: string,
  options: Pick<DiffOptions, 'ignoreCase' | 'ignoreWhitespace'>
): { leftLines: DiffLineInfo[]; rightLines: DiffLineInfo[] } {
  const left: DiffLineInfo[] = [];
  const right: DiffLineInfo[] = [];
  const originalLines1 = text1.split('\n');
  const originalLines2 = text2.split('\n');
  const changes = computeLineChanges(text1, text2, options);

  let leftLineNumber = 1;
  let rightLineNumber = 1;
  let changeIndex = 0;

  while (changeIndex < changes.length) {
    const change = changes[changeIndex];
    const lines = splitComparableLines(change.value);

    if (change.removed) {
      const nextChange = changes[changeIndex + 1];
      if (nextChange?.added) {
        const addedLines = splitComparableLines(nextChange.value);
        const maxLines = Math.max(lines.length, addedLines.length);

        for (let i = 0; i < maxLines; i++) {
          if (i < lines.length) {
            left.push({
              content: originalLines1[leftLineNumber - 1] ?? '',
              type: 'removed',
              originalLineNumber: leftLineNumber++,
            });
          } else {
            left.push({ content: '', type: 'empty' });
          }

          if (i < addedLines.length) {
            right.push({
              content: originalLines2[rightLineNumber - 1] ?? '',
              type: 'added',
              originalLineNumber: rightLineNumber++,
            });
          } else {
            right.push({ content: '', type: 'empty' });
          }
        }

        changeIndex += 2;
        continue;
      }

      lines.forEach(() => {
        left.push({
          content: originalLines1[leftLineNumber - 1] ?? '',
          type: 'removed',
          originalLineNumber: leftLineNumber++,
        });
        right.push({ content: '', type: 'empty' });
      });
    } else if (change.added) {
      lines.forEach(() => {
        left.push({ content: '', type: 'empty' });
        right.push({
          content: originalLines2[rightLineNumber - 1] ?? '',
          type: 'added',
          originalLineNumber: rightLineNumber++,
        });
      });
    } else {
      lines.forEach(() => {
        left.push({
          content: originalLines1[leftLineNumber - 1] ?? '',
          type: 'unchanged',
          originalLineNumber: leftLineNumber++,
        });
        right.push({
          content: originalLines2[rightLineNumber - 1] ?? '',
          type: 'unchanged',
          originalLineNumber: rightLineNumber++,
        });
      });
    }

    changeIndex++;
  }

  return { leftLines: left, rightLines: right };
}

export function computeDiff(
  text1: string,
  text2: string,
  options: DiffOptions
): DiffResult {
  const diffOptions = getDiffOptions(options);

  let changes: Diff.Change[];
  switch (options.mode) {
    case 'chars':
      changes = Diff.diffChars(text1, text2, { ignoreCase: options.ignoreCase });
      break;
    case 'words':
      changes = Diff.diffWords(text1, text2, diffOptions);
      break;
    case 'sentences':
      changes = Diff.diffSentences(text1, text2, { ignoreCase: options.ignoreCase });
      break;
    default:
      changes = computeLineChanges(text1, text2, options);
  }

  const lineChanges = computeLineChanges(text1, text2, options);

  let addedLines = 0;
  let removedLines = 0;
  let identicalLines = 0;

  lineChanges.forEach((change) => {
    const lines = splitComparableLines(change.value);

    if (change.added) {
      addedLines += lines.length;
    } else if (change.removed) {
      removedLines += lines.length;
    } else {
      identicalLines += lines.length;
    }
  });

  const modifiedLines = Math.min(addedLines, removedLines);
  const total = addedLines + removedLines - modifiedLines;

  const stats = {
    additions: addedLines,
    deletions: removedLines,
    modifications: modifiedLines,
    total,
    identical: identicalLines,
  };

  return { changes, stats };
}

export function formatText(text: string, format: string): string {
  try {
    switch (format) {
      case 'json':
        return JSON.stringify(JSON.parse(text), null, 2);
      case 'sql':
        return formatSQL(text);
      case 'javascript':
      case 'typescript':
      case 'python':
      case 'java':
      case 'csharp':
      case 'php':
      case 'ruby':
      case 'go':
      case 'rust':
        return text; // Syntax highlighting will be handled by Prism
      default:
        return text;
    }
  } catch (error) {
    return text; // Return original text if formatting fails
  }
}

function formatSQL(sql: string): string {
  // Basic SQL formatting
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
    'ON', 'AND', 'OR', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
    'ALTER TABLE', 'DROP TABLE', 'CREATE INDEX', 'DROP INDEX'
  ];

  let formatted = sql;
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    formatted = formatted.replace(regex, `\n${keyword}`);
  });

  return formatted.trim();
}
