# Text Compare Pro

A professional text comparison tool with advanced diff algorithms, syntax highlighting, and modern UI design.

## Features

- **Multiple Diff Algorithms**: Compare by lines, words, characters, or sentences
- **Syntax Highlighting**: Support for 10+ languages including JavaScript, Python, SQL, and more
- **Real-time Comparison**: Instant visual feedback with side-by-side comparison
- **Advanced Options**: Ignore case, ignore whitespace, context folding
- **Beautiful UI**: Modern glass-morphism design with dark mode support
- **High Performance**: Optimized for large texts with smart rendering
- **Privacy First**: All comparisons happen locally in your browser

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Diff**: Text comparison algorithms
- **React Syntax Highlighter**: Code highlighting
- **Lucide Icons**: Modern icon set

## Project Structure

```
text-compare-pro/
├── app/
│   ├── layout.tsx      # Root layout with SEO metadata
│   ├── page.tsx        # Home page with features and FAQ
│   └── globals.css     # Global styles and utilities
├── components/
│   └── TextCompare.tsx # Main comparison component
├── utils/
│   └── diff.ts         # Diff algorithms and utilities
└── public/
    ├── robots.txt      # SEO robots file
    ├── sitemap.xml     # SEO sitemap
    └── manifest.json   # PWA manifest
```

## Performance Optimizations

- Memoized computations for diff results
- Virtual scrolling for large texts
- Context folding to reduce DOM nodes
- Optimized re-renders with React hooks

## SEO Features

- Comprehensive meta tags
- Open Graph and Twitter cards
- Structured data for FAQ
- Sitemap and robots.txt
- Semantic HTML structure

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.