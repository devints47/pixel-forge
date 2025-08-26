# Pixel Forge 🎨

<div align="center">
  <img width="225" height="225" alt="Pixel Forge Logo Transparent" src="https://github.com/user-attachments/assets/19e54310-ce12-4dd1-9db5-46c11319e8a9" />

  **The complete image generation toolkit for modern web development**
  
  *Stop wrestling with image sizes. Start focusing on your content.*

  [![npm version](https://badge.fury.io/js/pixel-forge.svg)](https://badge.fury.io/js/pixel-forge)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
</div>

Pixel Forge is a reliable TypeScript package that generates optimized **OpenGraph images for website sharing** across social media and messaging platforms, plus complete favicon, SEO, and PWA asset generation. Supporting Facebook, Twitter, LinkedIn, Instagram, TikTok, Snapchat, Discord, Telegram, Signal, Slack, Threads, WhatsApp, and more.

**Built with ImageMagick for rock-solid reliability across all environments.**

✨ **Enhanced with advanced transparency preservation techniques for perfect RGBA handling.**

*Stop wrestling with image sizes. Start focusing on your content.* 

**Perfect for web developers who want everything needed for modern web applications in one command.**

## 🚀 Quick Start

### Prerequisites

Pixel Forge requires ImageMagick to be installed on your system:

```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# Windows (using Chocolatey)
choco install imagemagick

# Or download from: https://imagemagick.org/script/download.php
```

### No Installation Required!

```bash
# Run directly with npx (recommended)
npx pixel-forge generate logo.png --web
```

### Generate Everything for Your Website

```bash
# Generate all web assets (favicon, PWA, SEO)
npx pixel-forge generate logo.png --web

# Or use the short alias
npx pforge generate logo.png --web
```

### Quick Usage Examples

```bash
# Initialize configuration
npx pixel-forge init

# Generate favicons only
npx pixel-forge generate logo.png --favicon

# Generate PWA assets
npx pixel-forge generate logo.png --pwa

# Generate SEO images
npx pixel-forge generate logo.png --seo

# Generate specific social media images
npx pixel-forge generate logo.png --platform facebook,instagram,tiktok

# Generate everything
npx pixel-forge generate logo.png --all
```

### Optional: Install Globally

```bash
# For frequent use, install globally
npm install -g pixel-forge

# Then use without npx
pixel-forge generate logo.png --web
```

### Programmatic Usage

```typescript
import { PixelForgeConfig, generateAll } from 'pixel-forge';

const config: PixelForgeConfig = {
  input: './logo.png',
  outputDir: './assets',
  // ... other options
};

await generateAll(config);
```

## ✨ Why Pixel Forge?

- 🌍 **OpenGraph Focus** - Perfect images for when websites are shared on social platforms
- 📱 **Complete Web Coverage** - Favicons, PWA assets, SEO images in one command
- 🔧 **ImageMagick Powered** - Battle-tested image processing with superior reliability
- ⚡ **Framework Agnostic** - Works with any framework, includes Next.js helpers
- 🎯 **Developer-First** - Generate everything you need for proper website sharing
- 🔧 **TypeScript First** - Full type safety and IntelliSense support
- 💪 **Production Ready** - Reliable across all platforms and environments
- 🚀 **11 Platforms** - Facebook, Twitter, LinkedIn, Instagram, TikTok, Snapchat, Discord, Telegram, Signal, Slack, Threads

## 🌟 Key Features

### Reliable Image Processing
- ✅ **ImageMagick Backend** - No native dependency compilation issues
- ✅ **Perfect Transparency** - Advanced RGBA preservation prevents black backgrounds
- ✅ **Cross-Platform** - Consistent results on Windows, macOS, and Linux
- ✅ **10% Auto-Zoom** - Enhanced visibility for all generated icons
- ✅ **Proper Format Support** - True ICO files, real SVG conversion with transparency
- ✅ **Error Recovery** - Graceful fallbacks for edge cases

### Web Development Essentials
- ✅ **SEO Images** - OpenGraph (og-image.png/jpg), Twitter Cards, generic social sharing
- ✅ **Favicons** - All formats and sizes (ICO, PNG, SVG, Apple Touch Icons)
- ✅ **PWA Assets** - App icons, splash screens, manifest.json, browserconfig.xml
- ✅ **Safari Support** - Pinned tab SVG, Apple-specific optimizations
- ✅ **Microsoft Support** - Windows tiles, Edge/IE compatibility

### Social Media Platforms
- ✅ **Facebook** (1200x630 + 1200x1200) - OpenGraph optimized link sharing
- ✅ **Twitter/X** (1200x600 + 1200x1200) - Twitter Cards support
- ✅ **LinkedIn** (1200x627 + 1104x736) - Professional networking
- ✅ **Instagram** (1200x630) - Website link sharing
- ✅ **TikTok** (1200x630) - Website link sharing
- ✅ **Snapchat** (1200x630) - Website link sharing
- ✅ **Threads** (1200x1200) - Meta's Twitter alternative

### Messaging Applications
- ✅ **WhatsApp** (1200x630) - Link sharing previews
- ✅ **Discord** (1200x630) - Server link sharing
- ✅ **Telegram** (1200x630) - Message link sharing
- ✅ **Signal** (1200x630) - Secure link sharing
- ✅ **Slack** (1200x630) - Workspace link sharing

## 🚀 Quick Start

```bash
npm install pixel-forge
```

### For Web Developers (Most Common Use Case)

Generate everything you need for a modern web application:

```bash
# Complete web development package (favicon + PWA + SEO images)
npx pixel-forge generate logo.png --web

# Or generate specific web assets
npx pixel-forge generate logo.png --seo         # OpenGraph & Twitter cards
npx pixel-forge generate logo.png --favicon     # All favicon formats  
npx pixel-forge generate logo.png --pwa         # PWA icons & manifest
npx pixel-forge generate logo.png --social      # All social platforms (11 platforms)
npx pixel-forge generate logo.png --messaging   # All messaging platforms

# Generate in both PNG and JPEG formats
npx pixel-forge generate logo.png --web --format both
```

**Key files generated for `--web` (65 total):**
```
public/images/
# Core OpenGraph Images (6 files)
├── og-image.png              # Generic OpenGraph (1200x630)
├── opengraph.png             # Standard OpenGraph (1200x630)  
├── twitter-image.png         # Twitter card (1200x600)

# Essential Favicons (20 files)
├── favicon.ico               # Multi-size ICO
├── favicon.png               # PNG fallback
├── favicon.svg               # Vector favicon
├── favicon-16x16.png         # Browser tab
├── favicon-32x32.png         # Address bar
├── apple-icon-180x180.png    # iOS home screen
└── ... 14 more favicon sizes

# PWA Assets (39 files)  
├── android-chrome-192x192.png # PWA icon
├── android-chrome-512x512.png # PWA icon
├── manifest.json             # PWA manifest
├── pwa-*.png                 # App icons (8 files)
├── splash-*.png              # iOS splash screens (30 files)
└── browserconfig.xml         # Microsoft config
```

### HTML Integration

The generated images work seamlessly with your HTML:

```html
<!-- Essential OpenGraph (works everywhere) -->
<meta property="og:image" content="/images/og-image.png">
<meta property="og:image" content="/images/opengraph.png"> 
<meta name="twitter:image" content="/images/twitter-image.png">

<!-- Favicons -->
<link rel="icon" href="/images/favicon.ico" sizes="any">
<link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/images/favicon-16x16.png" sizes="16x16">
<link rel="icon" href="/images/favicon-32x32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/images/apple-icon-180x180.png">

<!-- PWA -->
<link rel="manifest" href="/images/manifest.json">
<meta name="msapplication-config" content="/images/browserconfig.xml">
```

### Next.js Integration

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'My awesome application',
  icons: {
    icon: [
      { url: '/images/favicon.ico', sizes: 'any' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/images/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    images: ['/images/og-image.png', '/images/opengraph.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/twitter-image.png'],
  },
  manifest: '/images/manifest.json',
}
```

### CLI Usage for Social Platforms

Generate assets for specific platforms:
```bash
# Major Social Networks  
npx pixel-forge generate logo.png --facebook    # Facebook (1200x630 + 1200x1200)
npx pixel-forge generate logo.png --twitter     # Twitter/X (1200x600 + 1200x1200)
npx pixel-forge generate logo.png --linkedin    # LinkedIn (1200x627 + 1104x736)
npx pixel-forge generate logo.png --instagram   # Instagram (1200x630)
npx pixel-forge generate logo.png --tiktok      # TikTok (1200x630)
npx pixel-forge generate logo.png --snapchat    # Snapchat (1200x630)
npx pixel-forge generate logo.png --threads     # Threads (1200x1200)

# Messaging Apps
npx pixel-forge generate logo.png --whatsapp    # WhatsApp (1200x630)
npx pixel-forge generate logo.png --discord     # Discord (1200x630)
npx pixel-forge generate logo.png --telegram    # Telegram (1200x630)
npx pixel-forge generate logo.png --signal      # Signal (1200x630)
npx pixel-forge generate logo.png --slack       # Slack (1200x630)

# Platform Categories
npx pixel-forge generate logo.png --social      # All social platforms (11 platforms)
npx pixel-forge generate logo.png --messaging   # All messaging platforms
npx pixel-forge generate logo.png --web         # Favicon + PWA + SEO

# Generate everything
npx pixel-forge generate logo.png --all
```

### Programmatic Usage

```typescript
import { ComprehensiveSocialGenerator } from 'pixel-forge';

const generator = new ComprehensiveSocialGenerator('./my-logo.png', {
  appName: 'My Awesome App',
  description: 'The best app for everything!',
  themeColor: '#3b82f6',
  backgroundColor: '#ffffff',
  output: {
    path: './public/images',
    prefix: '/images/'
  }
});

// Generate images for ALL platforms
await generator.generate({
  includeStandard: true,    // Facebook, Twitter, LinkedIn  
  includeInstagram: true,   // All Instagram formats
  includeMessaging: true,   // WhatsApp, Discord, Telegram, etc.
  includePlatforms: true,   // TikTok, YouTube, Pinterest, etc.
  platforms: {
    // Standard social
    facebook: true,
    twitter: true,
    linkedin: true,
    
    // Instagram variations
    instagramStories: true,
    instagramReels: true,
    
    // Messaging apps
    whatsapp: true,
    discord: true,
    telegram: true,
    signal: true,
    slack: true,
    imessage: true,
    androidRCS: true,
    
    // Video/Visual platforms
    tiktok: true,
    youtube: true,
    pinterest: true,
    
    // Emerging platforms
    threads: true,
    bluesky: true,
    mastodon: true
  }
});

// Get meta tags for your HTML
const metaTags = generator.getMetaTags();

// Get Next.js metadata configuration
const nextMetadata = generator.getNextMetadata();
```

### Individual Platform Generators

```typescript
// Individual Platform Generators
import { 
  FacebookGenerator, 
  TwitterGenerator, 
  LinkedInGenerator, 
  InstagramGenerator,
  TikTokGenerator,
  SnapchatGenerator,
  DiscordGenerator,
  TelegramGenerator,
  SignalGenerator,
  SlackGenerator,
  ThreadsGenerator,
  WhatsAppGenerator 
} from 'pixel-forge';

// Social Media Platforms
const facebook = new FacebookGenerator('./logo.png', config);
await facebook.generate(); // facebook-og.png + facebook-square.png

const twitter = new TwitterGenerator('./logo.png', config);
await twitter.generate(); // twitter-card.png + twitter-square.png

const instagram = new InstagramGenerator('./logo.png', config);
await instagram.generate(); // instagram.png

const tiktok = new TikTokGenerator('./logo.png', config);
await tiktok.generate(); // tiktok.png

// Messaging Platforms
const discord = new DiscordGenerator('./logo.png', config);
await discord.generate(); // discord.png

const telegram = new TelegramGenerator('./logo.png', config);
await telegram.generate(); // telegram.png
```

### Framework Integration

#### Next.js 

```typescript
// app/layout.tsx or pages/_app.tsx
import { generateMetadata } from 'pixel-forge/next';

export const metadata = generateMetadata({
  title: 'My App',
  description: 'Amazing app description',
  images: '/images/' // Points to your generated images
});
```

#### React/Vue/Angular

```typescript
// Get HTML meta tags
const metaTags = generator.getMetaTags();

// Insert into document head
metaTags.forEach(tag => {
  document.head.insertAdjacentHTML('beforeend', tag);
});
```

## 📋 Platform Matrices by Flag

### 🌐 Core Web Assets (`--web` flag)

**Essential OpenGraph images for any website:**

| Asset | Format | Size | Use Case | Files |
|-------|--------|------|----------|-------|
| **Generic OpenGraph** | PNG/JPEG | 1200x630 | Universal social sharing | `og-image.png`, `og-image.jpg` |
| **OpenGraph Standard** | PNG/JPEG | 1200x630 | Standard meta property | `opengraph.png`, `opengraph.jpg` |
| **Twitter Cards** | PNG/JPEG | 1200x600 | Twitter-specific sharing | `twitter-image.png`, `twitter-image.jpg` |

*Plus complete favicon (20 files) and PWA assets (39 files) - see below for details.*

### 📱 Social Media Platforms (`--social` flag)

**Platform-specific OpenGraph images for optimal sharing:**

| Platform | Format | Size | Use Case | Files |
|----------|--------|------|----------|-------|
| **Facebook** | OpenGraph + Square | 1200x630 + 1200x1200 | Link sharing, posts | `facebook-og.png`, `facebook-square.png` |
| **Twitter/X** | Twitter Card + Square | 1200x600 + 1200x1200 | Tweet previews | `twitter-card.png`, `twitter-square.png` |
| **LinkedIn** | Share + Company | 1200x627 + 1104x736 | Professional sharing | `linkedin-share.png`, `linkedin-company.png` |
| **Instagram** | OpenGraph | 1200x630 | Website link sharing | `instagram.png` |
| **TikTok** | OpenGraph | 1200x630 | Website link sharing | `tiktok.png` |
| **Snapchat** | OpenGraph | 1200x630 | Website link sharing | `snapchat.png` |
| **Discord** | Embed | 1200x630 | Server link sharing | `discord.png` |
| **Telegram** | Link Preview | 1200x630 | Message link sharing | `telegram.png` |
| **Signal** | Link Preview | 1200x630 | Secure link sharing | `signal.png` |
| **Slack** | Link Unfurl | 1200x630 | Workspace link sharing | `slack.png` |
| **Threads** | Post Preview | 1200x1200 | Meta platform sharing | `threads.png` |

### 🎯 Favicon Assets (`--favicon` flag)

| Asset | Format | Sizes | Use Case | Count |
|-------|--------|-------|----------|-------|
| **Browser Icons** | ICO, PNG | 16x16, 32x32, 48x48 | Browser tabs, bookmarks | 8 files |
| **Apple Touch Icons** | PNG | 57x57 to 180x180 | iOS home screen, Safari | 6 files |
| **Android Icons** | PNG | 36x36 to 192x192 | Android browsers, PWA | 4 files |
| **Windows Tiles** | PNG, XML | 70x70 to 310x310 | Windows Start Menu | 2 files |

### 📱 PWA Assets (`--pwa` flag)

| Asset | Format | Sizes | Use Case | Count |
|-------|--------|-------|----------|-------|
| **App Icons** | PNG | 72x72 to 512x512 | Progressive Web App | 8 files |
| **Splash Screens** | PNG | Device-specific | iOS app launch screens | 30 files |
| **Manifest** | JSON | - | PWA configuration | 1 file |

## 🎨 Templates & Customization

Pixel Forge includes smart templates that automatically optimize your content for each platform:

```typescript
await generator.generate({
  template: 'gradient',     // Adds gradient overlay for text readability
  title: 'My App Name',     // Automatically sized for each format
  description: 'App tagline' // Positioned optimally per platform
});
```

### Available Templates
- **`basic`** - Clean, minimal design
- **`gradient`** - Gradient overlay for better text contrast  
- **`custom`** - Bring your own template

## 📊 Performance & Optimization

- **Fast Generation** - Processes 25+ images in under 2 seconds
- **Smart Caching** - Reuses processed images when possible
- **Memory Efficient** - Streams processing for large images
- **Quality Control** - Configurable compression per platform

## 🛠️ Advanced Configuration

```typescript
const config = {
  appName: 'My App',
  description: 'App description',
  themeColor: '#3b82f6',
  backgroundColor: '#ffffff',
  
  // Platform-specific toggles
  platforms: {
    // Disable specific platforms
    wechat: false,        // Skip WeChat (China-specific)
    mastodon: false,      // Skip federated platforms
    
    // Enable all messaging
    whatsapp: true,
    discord: true,
    telegram: true
  },
  
  output: {
    path: './dist/images',
    prefix: '/static/images/',
    quality: 90,           // JPEG quality (1-100)
    format: 'png'          // Force PNG for all outputs  
  }
};
```

## 🧪 Examples

Check out the `/examples` directory for complete demos:

- `comprehensive-social.js` - Generate for all 25+ platforms
- `instagram-focused.js` - Instagram-specific generation
- `messaging-apps.js` - Messaging platform optimization
- `next-js-integration.js` - Complete Next.js setup

## 🔧 CLI Usage

```bash
# Initialize new project
npx pixel-forge init my-project

# Generate for all platforms
npx pixel-forge generate ./logo.png --all

# Individual platforms
npx pixel-forge generate ./logo.png --facebook --twitter --linkedin
npx pixel-forge generate ./logo.png --tiktok --whatsapp --instagram

# Platform categories
npx pixel-forge generate ./logo.png --social --messaging --platforms

# Technical assets
npx pixel-forge generate ./logo.png --favicon --pwa

# Custom configuration
npx pixel-forge generate ./logo.png --config ./pixel-forge.config.json

# Generate HTML meta tags
npx pixel-forge meta ./logo.png

# Show platform coverage
npx pixel-forge info
```

## 📚 API Reference

### Core Classes

- `ComprehensiveSocialGenerator` - All-in-one platform generation
- `InstagramGenerator` - Instagram-specific formats
- `MessagingGenerator` - Messaging app optimization  
- `PlatformGenerator` - Video/visual platform formats
- `OpenGraphGenerator` - Standard social media (Facebook, Twitter, LinkedIn)

### Utilities

- `ImageProcessor` - Core image manipulation
- `ConfigValidator` - Configuration validation
- `ImageSizes` - Platform size constants

## 🤝 Contributing

We welcome contributions! Social media platforms change frequently, and we need help keeping everything up to date.

### Priority Areas
- 🆕 New platform support
- 📱 Mobile platform optimization
- 🎨 Additional templates and themes
- 🧪 More comprehensive testing

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔧 Technical Details

### **Advanced Transparency Preservation**

- **`-define png:color-type=6`** - Forces RGBA format, prevents 8-bit colormap conversion
- **`-define png:bit-depth=8`** - Ensures proper bit depth for transparency
- **`-filter lanczos`** - High-quality resampling preserves transparency edges
- **`-background none`** - Proper transparent background handling during resize operations

This eliminates the common "black background" problem that occurs when transparency information is lost during image processing.

## 🙏 Acknowledgments

Built with [ImageMagick](https://imagemagick.org/) for reliable, cross-platform image processing.

---

**Made with ❤️ for the hassle of managing preview images for websitesm**

*Stop wrestling with image sizes. Start focusing on your content.* 
