import { renderOgImage } from '@/components/og-template';

export const alt = 'Text Compare Pro — the editorial-grade diff for prose and code';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage();
}
