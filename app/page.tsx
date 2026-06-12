'use client';

import TextCompare from '@/components/TextCompare';
import { useState } from 'react';
import {
  CheckCircle2,
  Zap,
  Code,
  Shield,
  GitCompare,
  Eye,
  Feather,
} from 'lucide-react';

const features = [
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

const steps = [
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

const faqItems = [
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

export default function Home() {
  const [showDiff, setShowDiff] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Text Compare Tool */}
      <section className="flex min-h-screen flex-col">
        <div className="flex-1">
          <TextCompare onDiffToggle={setShowDiff} />
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`border-t border-hairline px-5 py-16 transition-all duration-300 md:px-6 md:py-24 ${
          showDiff ? 'mt-0' : '-mt-32'
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="eyebrow">Why Text Compare Pro</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl tracking-tight text-ink sm:text-4xl md:text-[2.75rem]">
              Built for careful reading
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
              The most considered text comparison tool, with features designed
              for developers, writers, and professionals
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card group rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-hairline bg-sheet text-ink">
                  <feature.icon className="h-[18px] w-[18px]" />
                </div>
                <h3 className="mb-2 text-[15px] font-semibold text-ink">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-hairline px-5 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="eyebrow">How it works</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl tracking-tight text-ink sm:text-4xl md:text-[2.75rem]">
              Three steps to clarity
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
              Simple, powerful, and intuitive text comparison
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="border-t border-hairline pt-8">
                <div className="font-serif text-[3.5rem] italic leading-none text-ink opacity-20">
                  {step.number}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-hairline px-5 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <span className="eyebrow">Questions &amp; answers</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl tracking-tight text-ink sm:text-4xl md:text-[2.75rem]">
              Frequently asked questions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
              Everything you need to know about Text Compare Pro
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="card rounded-2xl p-6">
                <h3 className="flex items-start gap-3 text-[15px] font-semibold text-ink">
                  <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-added" />
                  {item.question}
                </h3>
                <p className="ml-[30px] mt-2.5 text-sm leading-relaxed text-muted">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline px-5 py-12 md:px-6 md:py-14">
        <div className="mx-auto max-w-7xl text-center">
          <h3 className="font-serif text-2xl italic text-ink">Text Compare Pro</h3>
          <p className="mt-2 text-sm text-muted">
            The professional text comparison tool for developers and writers
          </p>

          <p className="mt-7 flex flex-wrap items-center justify-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="h-1 w-1 rounded-full bg-removed" />
            Privacy-first · No data collection · 100% client-side
            <span className="h-1 w-1 rounded-full bg-added" />
          </p>

          <p className="mt-7 text-xs text-muted">
            © {new Date().getFullYear()} Text Compare Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
