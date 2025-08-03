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

export function computeDiff(
  text1: string,
  text2: string,
  options: DiffOptions
): DiffResult {
  let processedText1 = text1;
  let processedText2 = text2;

  if (options.ignoreCase) {
    processedText1 = processedText1.toLowerCase();
    processedText2 = processedText2.toLowerCase();
  }

  if (options.ignoreWhitespace) {
    processedText1 = processedText1.replace(/\s+/g, ' ').trim();
    processedText2 = processedText2.replace(/\s+/g, ' ').trim();
  }

  // Always use line diff for statistics
  const changes = Diff.diffLines(processedText1, processedText2);

  let addedLines = 0;
  let removedLines = 0;
  let identicalLines = 0;
  let modifiedLines = 0;

  changes.forEach((change) => {
    const lines = change.value.split('\n').filter((line, index, arr) => 
      index < arr.length - 1 || line !== ''
    );
    
    if (change.added) {
      addedLines += lines.length;
    } else if (change.removed) {
      removedLines += lines.length;
    } else {
      identicalLines += lines.length;
    }
  });

  // Count modifications as the minimum of added and removed lines
  // This represents lines that were changed (not purely added or removed)
  modifiedLines = Math.min(addedLines, removedLines);
  
  // Total represents unique diff locations
  const total = addedLines + removedLines - modifiedLines;

  const stats = {
    additions: addedLines,
    deletions: removedLines,
    modifications: modifiedLines,
    total: total,
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