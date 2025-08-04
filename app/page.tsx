'use client';

import TextCompare from '@/components/TextCompare';
import { useState } from 'react';
import { 
  CheckCircle, 
  Zap, 
  Code, 
  Shield, 
  GitCompare,
  Eye,
  Palette,
  Globe
} from 'lucide-react';

const features = [
  {
    icon: GitCompare,
    title: 'Multiple Diff Algorithms',
    description: 'Compare by lines, words, characters, or sentences with intelligent diff algorithms',
  },
  {
    icon: Code,
    title: 'Syntax Highlighting',
    description: 'Support for 10+ languages including JavaScript, Python, SQL, and more',
  },
  {
    icon: Eye,
    title: 'Real-time Comparison',
    description: 'Instant visual feedback with side-by-side comparison and diff navigation',
  },
  {
    icon: Palette,
    title: 'Beautiful UI',
    description: 'Modern glass-morphism design with dark mode support',
  },
  {
    icon: Zap,
    title: 'High Performance',
    description: 'Optimized for large texts with smart context folding and virtual scrolling',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'All comparisons happen locally in your browser - no data sent to servers',
  },
];

const faqItems = [
  {
    question: 'What makes Text Compare Pro different from other diff tools?',
    answer: 'Text Compare Pro offers advanced features like multiple diff algorithms, syntax highlighting for 10+ languages, real-time formatting, and performance optimization for large texts. Our modern UI with glass-morphism effects provides a premium experience.',
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
      <section className="min-h-screen flex flex-col">
        <div className="flex-1">
          <TextCompare onDiffToggle={setShowDiff} />
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-10 px-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-all duration-300 ${showDiff ? 'mt-0' : '-mt-32'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Professional Text Comparison Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the most advanced text comparison tool with features designed for developers, writers, and professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-morphism dark:glass-morphism-dark rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
              >
                <feature.icon className="w-10 h-10 mb-3 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Text Compare Pro Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Simple, powerful, and intuitive text comparison in three steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Paste Your Texts</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Simply paste or type your original and modified texts into the input areas
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Options</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Select diff mode, formatting, and comparison options like ignore case
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">View Results</h3>
              <p className="text-gray-600 dark:text-gray-300">
                See highlighted differences with statistics and navigate through changes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about Text Compare Pro
            </p>
          </div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="glass-morphism dark:glass-morphism-dark rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold mb-3 flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  {item.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 ml-9">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Text Compare Pro
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              The professional text comparison tool for developers and writers
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Globe className="w-4 h-4" />
            <span>Privacy-first • No data collection • 100% client-side</span>
          </div>
          
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            © 2024 Text Compare Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}