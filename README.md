# Pixel Forge 🎨

<div align="center">
  <img width="225" height="225" alt="Pixel Forge Logo Transparent" src="https://github.com/user-attachments/assets/19e54310-ce12-4dd1-9db5-46c11319e8a9" />

  **Drop your logo, get professional website assets.**
  
  *Stop wrestling with image sizes. Start focusing on your content.*

  [![npm version](https://badge.fury.io/js/pixel-forge.svg)](https://badge.fury.io/js/pixel-forge)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
</div>

**Pixel Forge** generates everything your website needs for modern web sharing: favicons, PWA icons, OpenGraph images, and SEO assets. One image in, professional boilerplate assets out.

✨ **Auto-detects background colors** for perfect image extension  
🚀 **Zero configuration** - just provide your logo  
📱 **Complete coverage** - works everywhere your site gets shared  
⚡ **Built with ImageMagick** for rock-solid reliability  

## 🚀 Quick Start

### Prerequisites

Install ImageMagick on your system:

```bash
# macOS
brew install imagemagick

# Ubuntu/Debian  
sudo apt-get install imagemagick

# Windows (Chocolatey)
choco install imagemagick
```

### Generate Everything (Recommended)

```bash
# One command, everything you need
npx pixel-forge generate logo.png --all
```

This creates **48 professional assets** in the `./public/images` folder:
- 🌍 **OpenGraph images** for Facebook, Twitter, LinkedIn, and general sharing
- 🏠 **Favicons** in all sizes and formats (ICO, PNG, SVG, Apple Touch)
- 📱 **PWA assets** including manifest.json and splash screens
- 🔍 **SEO assets** for complete web coverage

## 📦 What Gets Generated

| Flag | Description | Files |
|------|-------------|-------|
| `--all` | Everything your website needs | 48 total files |
| `--favicon` | Browser icons and favicons | 20 files |
| `--pwa` | Progressive web app assets | 39 files |
| `--social` | Social media OpenGraph images | 12 files |
| `--web` | Complete package (favicon + PWA + social) | 65 files |

### Quick Examples

```bash
# Just favicons
npx pixel-forge generate logo.png --favicon

# Just social media images  
npx pixel-forge generate logo.png --social

# PWA-ready assets
npx pixel-forge generate logo.png --pwa

# Complete web package
npx pixel-forge generate logo.png --web

# Everything + metadata
npx pixel-forge generate logo.png --all
npx pixel-forge meta logo.png > meta-tags.html
```

## 🌍 Social Media Coverage

**Works everywhere your website gets shared:**

| Platform | Image Size | Generated File |
|----------|------------|----------------|
| **Facebook** | 1200×630 | `social-media-general.png` |
| **Twitter/X** | 1200×600 | `twitter-image.png` |
| **LinkedIn** | 1200×627 | `linkedin-share.png` + `linkedin-company.png` |
| **Instagram** | 1200×630 | `social-media-general.png` |
| **Discord** | 1200×630 | `social-media-general.png` |
| **WhatsApp** | 1200×630 | `social-media-general.png` |
| **Telegram** | 1200×630 | `social-media-general.png` |
| **TikTok** | 1200×630 | `tiktok.png` |
| **Snapchat** | 1200×630 | `snapchat.png` |
| **YouTube** | Multiple sizes | `youtube-thumbnail.png` + `youtube-shorts.png` |
| **Pinterest** | Multiple sizes | `pinterest-pin.png` + `pinterest-square.png` |

*Plus Threads, Bluesky, Mastodon, Signal, Slack, iMessage, and Android RCS*

## 🔧 Programmatic Usage

```typescript
import { generate } from 'pixel-forge';

// Generate everything with metadata
const result = await generate('./logo.png', {
  all: true,
  generateMetadata: true,
  outputDir: './public/assets'
});

// Get ready-to-use HTML meta tags
console.log(result.metadata?.html);
// Outputs: <meta property="og:image" content="/social-media-general.png" />
//          <meta name="twitter:image" content="/twitter-image.png" />
//          <link rel="icon" href="/favicon.ico" />
//          ... and 20+ more essential tags
```

### Individual Generators

```typescript
// Just favicons
const faviconResult = await generate('./logo.png', { favicon: true });

// Just social media
const socialResult = await generate('./logo.png', { social: true });

// Just PWA assets
const pwaResult = await generate('./logo.png', { pwa: true });
```

## 🎯 Why Pixel Forge?

### ✅ **Zero Configuration**
- No colors to configure (auto-detected from your image)
- No app names or descriptions required (generates boilerplate)
- No complex setup - just provide your logo

### ✅ **Professional Results**
- Clean images without text overlays
- Proper transparency handling
- Perfect dimensions for each platform
- SEO-optimized file names

### ✅ **Complete Coverage**
- Every favicon size you'll ever need
- PWA-ready with manifest.json
- OpenGraph images for 15+ platforms
- Ready for modern web deployment

### ✅ **Developer-Friendly**
- TypeScript support
- Framework agnostic
- Ready-to-use HTML meta tags
- Next.js helpers included

## 📝 HTML Integration

Copy the generated meta tags directly into your HTML:

```html
<!-- Essential meta tags (customize the content values) -->
<meta property="og:title" content="Your App Name" />
<meta property="og:description" content="Your app description" />
<meta property="og:image" content="/images/social-media-general.png" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="/images/twitter-image.png" />

<!-- Favicons -->
<link rel="icon" href="/images/favicon.ico" sizes="any">
<link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">

<!-- PWA -->
<link rel="manifest" href="/images/manifest.json">
```

## 📱 Next.js Integration

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'Your app description',
  icons: {
    icon: [
      { url: '/images/favicon.ico', sizes: 'any' },
      { url: '/images/favicon-32x32.png', sizes: '32x32' },
    ],
    apple: [{ url: '/images/apple-touch-icon.png' }],
  },
  openGraph: {
    images: ['/images/social-media-general.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/twitter-image.png'],
  },
  manifest: '/images/manifest.json',
}
```

## 🛠️ Installation Options

```bash
# Use directly (recommended)
npx pixel-forge generate logo.png --all

# Install globally
npm install -g pixel-forge
pixel-forge generate logo.png --all

# Install locally
npm install pixel-forge
```

## 📋 CLI Reference

```bash
# Generate specific asset types
pixel-forge generate logo.png --favicon     # Browser icons
pixel-forge generate logo.png --pwa         # PWA assets  
pixel-forge generate logo.png --social      # Social media
pixel-forge generate logo.png --web         # Everything

# Individual platforms
pixel-forge generate logo.png --facebook --twitter
pixel-forge generate logo.png --messaging   # WhatsApp, Discord, etc.
pixel-forge generate logo.png --platforms   # TikTok, YouTube, etc.

# Utilities
pixel-forge meta logo.png                   # Generate HTML meta tags
pixel-forge init                             # Create config file
pixel-forge info                             # Show platform coverage
```

## 🎨 Perfect for Modern Web Development

Pixel Forge is designed for developers who want:
- **Quick deployment** - Generate everything in one command
- **SEO optimization** - Proper OpenGraph tags for all platforms  
- **PWA readiness** - Complete progressive web app setup
- **Professional results** - Clean, properly-sized assets
- **Zero maintenance** - Works with any framework, no dependencies

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for developers who want their websites to look professional everywhere**

*Drop your logo. Get professional website assets.*