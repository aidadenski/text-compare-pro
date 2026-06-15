import {
  Code,
  Eye,
  Feather,
  GitCompare,
  Shield,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Single source of truth for the landing page marketing copy.
 * Shared between the rendered page (app/page.tsx) and the structured
 * data emitted for search engines (components/StructuredData.tsx) so the
 * visible content and the JSON-LD can never drift apart.
 */

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: GitCompare,
    title: 'Multiple Diff Algorithms',
    description: 'Compare by lines, words, characters, or sentences with intelligent diff algorithms',
  },
  {
    icon: Code,
    title: 'Format Aware',
    description: 'Work with JSON, JavaScript, Python, SQL and more — with automatic JSON and SQL formatting',
  },
  {
    icon: Eye,
    title: 'Real-time Comparison',
    description: 'Instant visual feedback with side-by-side comparison, synchronized scrolling, and diff navigation',
  },
  {
    icon: Feather,
    title: 'Editorial Design',
    description: 'A calm ink-and-paper interface that keeps your eyes on the text, in light and dark mode',
  },
  {
    icon: Zap,
    title: 'High Performance',
    description: 'Optimized for large texts with precise line alignment and efficient diff computation',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'All comparisons happen locally in your browser - no data sent to servers',
  },
];

export interface Step {
  number: string;
  title: string;
  description: string;
}

export const steps: Step[] = [
  {
    number: '01',
    title: 'Paste Your Texts',
    description: 'Simply paste or type your original and modified texts into the input areas',
  },
  {
    number: '02',
    title: 'Choose Options',
    description: 'Select diff mode, formatting, and comparison options like ignore case',
  },
  {
    number: '03',
    title: 'View Results',
    description: 'See highlighted differences with statistics and navigate through changes',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: 'What makes Text Compare Pro different from other diff tools?',
    answer: 'Text Compare Pro offers advanced features like multiple diff algorithms, support for 10+ formats, real-time formatting, and performance optimization for large texts. Its calm, editorial interface keeps the focus on your text.',
  },
  {
    question: 'Is my text data secure?',
    answer: 'Absolutely! All text comparison happens locally in your browser. We never send your data to any servers, ensuring complete privacy and security.',
  },
  {
    question: 'What file formats are supported?',
    answer: 'Text Compare Pro supports plain text, JSON, JavaScript, TypeScript, Python, SQL, Java, C#, HTML, CSS, and more. You can paste any text content and apply appropriate formatting.',
  },
  {
    question: 'Can I compare large files?',
    answer: 'Yes! Our tool is optimized for performance with features like context folding and efficient diff algorithms that handle large texts smoothly.',
  },
  {
    question: 'How do the different diff modes work?',
    answer: 'Lines mode compares line by line (best for code), Words mode highlights word changes (great for documents), Characters mode shows every character change, and Sentences mode is ideal for prose.',
  },
  {
    question: 'Can I ignore case or whitespace differences?',
    answer: 'Yes, you can toggle options to ignore case sensitivity and whitespace differences, making it easier to focus on meaningful changes.',
  },
];
