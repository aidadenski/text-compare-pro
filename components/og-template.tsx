import { ImageResponse } from 'next/og';

/**
 * Shared renderer for the Open Graph and Twitter share images.
 *
 * Generated on demand by Next.js (app/opengraph-image.tsx and
 * app/twitter-image.tsx) so social previews never depend on a hand-made
 * binary asset that can go missing. Uses the "ink & paper" palette and the
 * built-in font shipped with next/og — no external font fetch required.
 */

const SIZE = { width: 1200, height: 630 };

const INK = '#1c1917';
const INK_SOFT = '#57534e';
const PAPER = '#f6f3ec';
const ADDED = '#0f766e';
const REMOVED = '#be123c';
const HAIRLINE = 'rgba(33, 30, 25, 0.18)';

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: PAPER,
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: INK_SOFT,
          }}
        >
          Side-by-side diff · Private by design
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 96,
              fontWeight: 700,
              color: INK,
              letterSpacing: -2,
            }}
          >
            Text Compare Pro
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 24,
              fontSize: 36,
              color: INK_SOFT,
              maxWidth: 920,
            }}
          >
            The editorial-grade diff for prose and code — beautifully highlighted, entirely in your browser.
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 44,
              fontSize: 44,
              alignItems: 'center',
            }}
          >
            <span style={{ color: REMOVED, textDecoration: 'line-through' }}>chnage</span>
            <span style={{ color: INK_SOFT, margin: '0 22px' }}>→</span>
            <span style={{ color: ADDED, textDecoration: 'underline' }}>change</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `2px solid ${HAIRLINE}`,
            paddingTop: 28,
            fontSize: 26,
            color: INK_SOFT,
          }}
        >
          <span>textcompare.pro</span>
          <span>Privacy-first · 100% client-side</span>
        </div>
      </div>
    ),
    { ...SIZE },
  );
}
