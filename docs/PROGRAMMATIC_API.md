# 🚀 Pixel Forge Programmatic API

**The modern, CLI-mirrored API for pixel-forge that makes asset generation and metadata handling a breeze.**

## Installation

```bash
npm install pixel-forge
```

## Quick Start

```typescript
import { generate } from 'pixel-forge';

// Generate everything with metadata (no app details needed!)
const result = await generate('./logo.png', {
  all: true,
  generateMetadata: true,
  outputDir: './public/assets'
});

// Copy the HTML meta tags directly into your <head> (customize the placeholders)
console.log(result.metadata?.html);
```

## 🎯 Main API Function

The `generate()` function mirrors all CLI flags and options:

### Basic Usage

```typescript
import { generate, type PixelForgeOptions } from 'pixel-forge';

const options: PixelForgeOptions = {
  // Simple configuration
  outputDir: './public/assets',
  
  // Generator flags (just like CLI)
  favicon: true,
  pwa: true,
  social: true,
  
  // Get ready-to-use HTML meta tags (with placeholders)
  generateMetadata: true
};

const result = await generate('./logo.png', options);
```

### CLI Flag Equivalents

| CLI Flag | API Option | Description |
|----------|------------|-------------|
| `--all` | `all: true` | Generate everything |
| `--social` | `social: true` | Generate social media assets |
| `--favicon` | `favicon: true` | Generate favicons |
| `--pwa` | `pwa: true` | Generate PWA assets |
| `--web` | `web: true` | Generate web/SEO assets |
| `--platforms` | `platforms: true` | Generate all platform-specific images |
| `--messaging` | `messaging: true` | Generate all messaging app images |
| `--facebook` | `facebook: true` | Generate Facebook images |
| `--twitter` | `twitter: true` | Generate Twitter images |
| `--linkedin` | `linkedin: true` | Generate LinkedIn images |
| `--discord` | `discord: true` | Generate Discord images |
| ... | ... | All platform flags supported |

## 🎨 Real-World Examples

### 1. Complete Web App Setup

```typescript
import { generate } from 'pixel-forge';

const result = await generate('./logo.png', {
  all: true,
  generateMetadata: true,
  appName: 'My SaaS App',
  description: 'The best SaaS platform for productivity',
  themeColor: '#3b82f6',
  backgroundColor: '#ffffff',
  outputDir: './public/assets'
});

// Files generated
console.log('Generated files:', result.summary.totalFiles);
console.log('Favicon files:', result.files.favicon);
console.log('PWA files:', result.files.pwa);
console.log('Social files:', result.files.social);

// Ready-to-use HTML
document.head.insertAdjacentHTML('beforeend', result.metadata.html);
```

### 2. Next.js Integration

```typescript
// pages/api/generate-assets.ts
import { generate } from 'pixel-forge';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await generate('./public/logo.png', {
      all: true,
      generateMetadata: true,
      appName: process.env.NEXT_PUBLIC_APP_NAME || 'My App',
      outputDir: './public/assets'
    });
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 3. Specific Platform Generation

```typescript
// Just social media for a blog post
const socialResult = await generate('./post-image.png', {
  facebook: true,
  twitter: true,
  linkedin: true,
  generateMetadata: true,
  appName: 'My Blog Post',
  description: 'An insightful article about...'
});

// Just messaging apps for team communication
const messagingResult = await generate('./team-logo.png', {
  messaging: true,
  outputDir: './assets/team'
});
```

### 4. React Hook

```typescript
import { useState, useCallback } from 'react';
import { generate, type PixelForgeOptions } from 'pixel-forge';

export function useAssetGeneration() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generateAssets = useCallback(async (
    imagePath: string, 
    options: PixelForgeOptions
  ) => {
    setLoading(true);
    try {
      const generationResult = await generate(imagePath, {
        ...options,
        generateMetadata: true
      });
      setResult(generationResult);
      return generationResult;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateAssets, loading, result };
}

// Usage in component
function AssetGenerator() {
  const { generateAssets, loading, result } = useAssetGeneration();

  const handleGenerate = () => {
    generateAssets('./logo.png', {
      all: true,
      appName: 'My App',
      outputDir: './public/assets'
    });
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Assets'}
      </button>
      
      {result && (
        <div>
          <p>Generated {result.summary.totalFiles} files!</p>
          <details>
            <summary>Meta Tags</summary>
            <pre>{result.metadata?.html}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
```

## 📊 Result Structure

```typescript
interface PixelForgeResult {
  files: {
    favicon?: string[];      // ['favicon.ico', 'favicon-16x16.png', ...]
    pwa?: string[];          // ['manifest.json', 'icon-192x192.png', ...]
    social?: string[];       // ['social-media-general.png', 'twitter-image.png', ...]
    web?: string[];          // ['opengraph-image.png', ...]
    seo?: string[];          // Same as web
  };
  metadata?: {
    html: string;            // Complete HTML ready for <head>
    favicon: string[];       // Favicon-specific meta tags
    pwa: string[];           // PWA manifest and meta tags
    social: string[];        // OpenGraph and Twitter Card meta tags
    apple: string[];         // Apple-specific meta tags
    android: string[];       // Android-specific meta tags
    windows: string[];       // Windows/Microsoft meta tags
  };
  summary: {
    totalFiles: number;      // Total files generated
    generatedAssets: string[]; // All file names
    outputDirectory: string; // Where files were saved
  };
}
```

## 🏷️ Metadata Features

### Plug-and-Play HTML

The `generateMetadata: true` option creates production-ready HTML meta tags:

```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">

<!-- Apple -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="apple-mobile-web-app-title" content="My App">
<meta name="apple-mobile-web-app-capable" content="yes">

<!-- OpenGraph -->
<meta property="og:title" content="My App">
<meta property="og:description" content="My awesome app">
<meta property="og:image" content="/social-media-general.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="My App">
<meta name="twitter:image" content="/twitter-image.png">

<!-- PWA -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#007bff">

<!-- And much more... -->
```

### Granular Meta Tags

Access specific meta tag groups:

```typescript
const result = await generate('./logo.png', {
  all: true,
  generateMetadata: true
});

// Use specific groups
const faviconTags = result.metadata.favicon;
const socialTags = result.metadata.social;
const appleTags = result.metadata.apple;
```

## 🔄 Legacy Compatibility

The old simple functions still work:

```typescript
import { 
  generateQuick,     // Everything in one call
  generateFavicons,  // Just favicons
  generatePWA,       // Just PWA
  generateSocial,    // Just social
  generateWeb        // Just web/SEO
} from 'pixel-forge';

// Old way still works
await generateQuick('./logo.png', './assets', 'My App');
```

## 🎯 Best Practices

1. **Always use `generateMetadata: true`** for web apps
2. **Specify `appName` and `description`** for better SEO
3. **Use `all: true`** for complete coverage
4. **Set proper `themeColor`** to match your brand
5. **Place generated files in your public directory**

## 🚀 Migration from Old API

**Before:**
```typescript
const config = {
  appName: 'My App',
  themeColor: '#007bff',
  backgroundColor: '#ffffff',
  output: { path: './assets' }
};
const gen = new FaviconGenerator('./logo.png', config);
await gen.generate();
```

**After:**
```typescript
const result = await generate('./logo.png', {
  favicon: true,
  appName: 'My App',
  themeColor: '#007bff',
  outputDir: './assets',
  generateMetadata: true
});
```

The new API is **much simpler**, mirrors the CLI exactly, and provides plug-and-play metadata for optimal SEO!
