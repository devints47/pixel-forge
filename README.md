# Pixel Forge

<div align="center">
  <img width="225" height="225" alt="Pixel Forge Logo Transparent" src="https://github.com/user-attachments/assets/19e54310-ce12-4dd1-9db5-46c11319e8a9" />

  **Drop in your logo, get essential website assets.**
  
  *Stop wrestling with image sizes. Start focusing on your content.*

  [![npm version](https://badge.fury.io/js/pixel-forge.svg)](https://badge.fury.io/js/pixel-forge)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
</div>

**Pixel Forge** generates **only the essential assets** your website needs for modern web sharing. Optimized for 2025 SEO best practices - no bloat, no over-generation.

✨ **Auto-detects background colors** for perfect image extension  
🚀 **Zero configuration** - just provide your logo  
📱 **Essential files only** - 5 favicons, 7 PWA assets, smart meta tags  
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

This creates **20 essential assets** in the `./generated` folder:
- 🌍 **Social media images** (3 essential formats: landscape, square, vertical)
- 🏠 **Favicons** (6 essential files: ICO, multiple PNG sizes, SVG, Apple Touch, Safari)
- 📱 **PWA assets** (7 essential files: manifest + core icons)
- 🔍 **SEO assets** for complete web coverage

### Automatic Meta Tags

```bash
# Meta tags are ALWAYS generated automatically
npx pixel-forge generate logo.png --favicon
```

**Every generation automatically creates** a `meta-tags.html` file with copy-paste ready HTML tags that reference only the files you generated.

## 📂 What Gets Generated

### `--favicon` (6 essential files)
```
favicon.ico              # Legacy browsers, IE (contains 16x16 + 32x32)
favicon-16x16.png        # Browser tab, small displays
favicon-32x32.png        # Browser tab, standard displays
favicon-48x48.png        # Desktop shortcuts, Windows taskbar
favicon.svg              # Scalable vector icon
apple-touch-icon.png     # iOS home screen (180x180)
safari-pinned-tab.svg    # Safari pinned tabs
```

### `--pwa` (7 essential files)
```
manifest.json                           # PWA configuration
pwa-192x192.png                         # Required PWA icon
pwa-512x512.png                         # Required PWA icon
pwa-maskable-192x192.png                # Android adaptive icon
pwa-maskable-512x512.png                # Android adaptive icon
splash-android-portrait-1080x1920.png   # Generic mobile splash
splash-android-landscape-1920x1080.png  # Generic mobile splash
```

### `--social` (3 essential files)
```
social-media-general.png    # 1200x630 - Facebook, Twitter, LinkedIn, messaging
instagram-square.png        # 1080x1080 - Instagram, Threads, profile images  
social-vertical.png         # 1080x1920 - TikTok, Stories, Snapchat
```

### `--seo` (3-6 files)
```
og-image.png           # OpenGraph social sharing
opengraph.png          # Facebook/LinkedIn
twitter-image.png      # Twitter Cards
```

### Always Generated
```
meta-tags.html         # Copy-paste ready HTML tags (ALWAYS created)
```

## 🛠️ Usage Examples

### Specific Generations

```bash
# Just favicons
npx pixel-forge generate logo.png --favicon

# PWA assets only
npx pixel-forge generate logo.png --pwa

# Social sharing images
npx pixel-forge generate logo.png --seo

# Complete web package (favicon + PWA + SEO)
npx pixel-forge generate logo.png --web
```

### Output Options

```bash
# Custom output directory
npx pixel-forge generate logo.png --all --output ./assets

# Custom URL prefix for meta tags
npx pixel-forge generate logo.png --favicon --prefix "/assets/"
```

## 🧩 Programmatic API

```typescript
import { generateAssets } from 'pixel-forge';

// Generate favicon assets (meta tags always included)
const result = await generateAssets('logo.png', {
  favicon: true,
  outputDir: './generated'
});

// Access the structured result
console.log(result.files.favicon);    // Array of favicon file paths
console.log(result.metaTags.html);    // Complete HTML from meta-tags.html
console.log(result.metaTags.tags);    // Array of individual meta tags
console.log(result.summary);          // Generation summary
```

## 🎯 Why Pixel Forge?

### Before: Bloated & Complex
- ❌ 40+ unnecessary files
- ❌ Complex configuration  
- ❌ References to non-existent files
- ❌ Platform-specific variations you don't need

### After: Essential & Clean
- ✅ **5 favicon files** (down from 20+)
- ✅ **7 PWA files** (down from 38+)
- ✅ **Smart meta tags** that reference only generated files
- ✅ **2024 SEO best practices** compliance

## 📋 CLI Reference

```bash
# Basic usage (both commands work identically)
npx pixel-forge generate <image> [options]
pf generate <image> [options]  # Short alias

# Asset type flags
--all           # Generate all essential assets (20 files including meta-tags.html)
--social        # Generate essential social media assets (3 core images + meta-tags.html)
--favicon       # Generate favicon assets (6 files + meta-tags.html)
--pwa          # Generate PWA assets (7 files + meta-tags.html) 
--seo          # Generate SEO/social images (3-6 files + meta-tags.html)
--web          # Generate web package (favicon + PWA + SEO + meta-tags.html)

# Output options
--output <dir> # Output directory (default: ./generated)
--prefix <url> # URL prefix for meta tags (default: /images/)
--verbose      # Show detailed output
```

## 🔧 Advanced Features

### Auto Background Detection
Pixel Forge automatically detects your image's background color and uses it to fill extended areas, preventing ugly white bars or cropping.

### Smart Meta Tags (Always Generated)
Every generation automatically creates `meta-tags.html` with:
- ✅ **Only tags for generated files** (no 404s)  
- ✅ **2025 SEO best practices** compliance
- ✅ **Copy-paste ready** HTML format
- ✅ **Security headers** included

### Format Support
Supports all modern image formats:
- PNG, JPEG, WebP, AVIF, TIFF, GIF, SVG, BMP

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
