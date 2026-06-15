'use client';

import TextCompare from '@/components/TextCompare';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { faqItems, features, steps } from './content';

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
