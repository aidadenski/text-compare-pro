import { faqItems, features } from '@/app/content';

const SITE_URL = 'https://textcompare.pro';
const SITE_NAME = 'Text Compare Pro';
const SITE_DESCRIPTION =
  'Professional text comparison tool with multiple diff algorithms, syntax highlighting, and advanced features. Compare text, code, JSON, SQL with ease.';

/**
 * JSON-LD structured data for rich search results.
 *
 * Rendered from a Server Component so the markup is present in the initial
 * HTML for crawlers. Emits:
 *  - WebApplication: describes the free, browser-based diff tool
 *  - WebSite: site-level identity
 *  - FAQPage: enables FAQ rich results, sourced from the same data the
 *    page renders so the two never diverge.
 */
export default function StructuredData() {
  const webApplication = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: features.map((feature) => feature.title),
  };

  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
