# Pixel Forge 🎨

<div align="center">
  <img width="180" height="180" alt="Pixel Forge Logo" src="https://github.com/user-attachments/assets/eefff801-e525-4d7f-8d22-dbcb748059fa" />
  
  **The complete image generation toolkit for modern web development**
  
  *Stop wrestling with image sizes. Start focusing on your content.*

  [![npm version](https://badge.fury.io/js/pixel-forge.svg)](https://badge.fury.io/js/pixel-forge)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
</div>

Pixel Forge is a reliable TypeScript package that generates optimized images for social media previews, favicons, SEO metadata, and PWA assets across **all major platforms** - from Facebook and Instagram to TikTok, WhatsApp, Discord, to iMessage, SMS, RCS, and more.

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

- 🌍 **Complete Web Coverage** - Generates everything from favicons to social sharing images
- 📱 **Modern Standards** - Supports PWA, OpenGraph, Twitter Cards, Apple Touch Icons, and more
- 🔧 **ImageMagick Powered** - Battle-tested image processing with superior reliability
- ⚡ **Framework Agnostic** - Works with any framework, includes Next.js helpers
- 🎯 **Developer-First** - One command generates everything you need for SEO and social sharing
- 🔧 **TypeScript First** - Full type safety and IntelliSense support
- 💪 **Production Ready** - Reliable across all platforms and environments

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

### Major Social Networks
- ✅ **Facebook** (1200x630) - OpenGraph optimized
- ✅ **Twitter/X** (1200x600) - Twitter Cards support
- ✅ **LinkedIn** (1200x627) - Professional networking
- ✅ **Instagram** - Multiple formats:
  - Square (1080x1080) - Standard posts
  - Portrait (1080x1350) - Vertical posts
  - Stories (1080x1920) - 24hr stories
  - Reels (1080x1920) - Video content
- ✅ **TikTok** (1080x1920) - Vertical video format
- ✅ **YouTube**:
  - Thumbnails (1280x720) - Video previews
  - Shorts (1080x1920) - Short content
- ✅ **Pinterest**:
  - Pin (1000x1500) - Pin boards
  - Square (1000x1000) - Square pins

### Messaging Applications
- ✅ **WhatsApp**:
  - Profile (400x400) - Profile images
  - Link Preview (1200x630) - Link sharing
- ✅ **Discord** (1200x630) - Server sharing
- ✅ **Telegram** (1200x630) - Message sharing
- ✅ **Signal** (1200x630) - Secure sharing
- ✅ **Slack** (1200x630) - Workspace sharing
- ✅ **iMessage** (1200x630) - iOS sharing
- ✅ **Android RCS** (1200x630) - Android sharing

### Emerging Platforms
- ✅ **Threads** (1080x1080) - Meta's Twitter alternative
- ✅ **Bluesky** (1200x630) - Decentralized social network
- ✅ **Mastodon** (1200x630) - Federated social media

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
npx pixel-forge generate logo.png --seo      # OpenGraph & Twitter cards
npx pixel-forge generate logo.png --favicon  # All favicon formats  
npx pixel-forge generate logo.png --pwa      # PWA icons & manifest

# Generate in both PNG and JPEG formats
npx pixel-forge generate logo.png --web --format both
```

**Files generated for `--web`:**
```
public/images/
├── og-image.png              # Generic OpenGraph (1200x630)
├── twitter-image.png         # Twitter card (1200x600)
├── favicon.ico               # Multi-size ICO
├── favicon-16x16.png         # Browser favicons
├── favicon-32x32.png
├── apple-touch-icon.png      # iOS home screen (180x180)
├── android-chrome-192x192.png # PWA icons
├── android-chrome-512x512.png
├── safari-pinned-tab.svg     # Safari pinned tabs
├── manifest.json             # PWA manifest
└── browserconfig.xml         # Microsoft Edge/IE
```

### HTML Integration

The generated images work seamlessly with your HTML:

```html
<!-- Favicons -->
<link rel="icon" href="/images/favicon.ico" sizes="any">
<link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
<link rel="manifest" href="/images/manifest.json">

<!-- SEO & Social Sharing -->
<meta property="og:image" content="/images/og-image.png">
<meta name="twitter:image" content="/images/twitter-image.png">

<!-- Safari & Microsoft -->
<link rel="mask-icon" href="/images/safari-pinned-tab.svg" color="#000000">
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
      { url: '/images/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    images: ['/images/og-image.png'],
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
npx pixel-forge generate logo.png --facebook    # Facebook (1200x630)
npx pixel-forge generate logo.png --twitter     # Twitter/X (1200x600)
npx pixel-forge generate logo.png --linkedin    # LinkedIn (1200x627)
npx pixel-forge generate logo.png --instagram   # Instagram (all formats)
npx pixel-forge generate logo.png --tiktok      # TikTok (1080x1920)
npx pixel-forge generate logo.png --youtube     # YouTube (thumbnail + shorts)
npx pixel-forge generate logo.png --pinterest   # Pinterest (pin + square)

# Messaging Apps
npx pixel-forge generate logo.png --whatsapp    # WhatsApp (profile + preview)
npx pixel-forge generate logo.png --discord     # Discord (1200x630)
npx pixel-forge generate logo.png --telegram    # Telegram (1200x630)
npx pixel-forge generate logo.png --signal      # Signal (1200x630)
npx pixel-forge generate logo.png --slack       # Slack (1200x630)
npx pixel-forge generate logo.png --imessage    # iMessage (1200x630)
npx pixel-forge generate logo.png --androidrcs  # Android RCS (1200x630)

# Emerging Platforms
npx pixel-forge generate logo.png --threads     # Threads (1080x1080)
npx pixel-forge generate logo.png --bluesky     # Bluesky (1200x630)
npx pixel-forge generate logo.png --mastodon    # Mastodon (1200x630)

# Platform Categories
npx pixel-forge generate logo.png --social      # Standard social (FB, Twitter, LinkedIn)
npx pixel-forge generate logo.png --messaging   # All messaging platforms
npx pixel-forge generate logo.png --platforms   # All video/visual platforms

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
  WhatsAppGenerator 
} from 'pixel-forge';

// Facebook only
const facebook = new FacebookGenerator('./logo.png', config);
await facebook.generate();

// Twitter only
const twitter = new TwitterGenerator('./logo.png', config);
await twitter.generate();

// LinkedIn only
const linkedin = new LinkedInGenerator('./logo.png', config);
await linkedin.generate();

// Instagram only
const instagram = new InstagramGenerator('./logo.png', config);
await instagram.generate({ includeStories: true, includeReels: true });

// TikTok only
const tiktok = new TikTokGenerator('./logo.png', config);
await tiktok.generate();

// WhatsApp only
const whatsapp = new WhatsAppGenerator('./logo.png', config);
await whatsapp.generate();
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

## 📋 Complete Platform Matrix

| Platform | Format | Size | Use Case |
|----------|--------|------|----------|
| **Facebook** | OpenGraph | 1200x630 | Link sharing, posts |
| **Twitter/X** | Twitter Card | 1200x600 | Tweet attachments |
| **LinkedIn** | Business | 1200x627 | Professional sharing |
| **Instagram Square** | Feed Post | 1080x1080 | Standard posts |
| **Instagram Portrait** | Feed Post | 1080x1350 | Vertical posts |
| **Instagram Stories** | Stories | 1080x1920 | 24hr stories |
| **Instagram Reels** | Short Video | 1080x1920 | Video content |
| **TikTok** | Vertical | 1080x1920 | Short videos |
| **YouTube Thumbnail** | Video | 1280x720 | Video previews |
| **YouTube Shorts** | Vertical | 1080x1920 | Short content |
| **Pinterest Pin** | Vertical | 1000x1500 | Pin boards |
| **Pinterest Square** | Square | 1000x1000 | Square pins |
| **WhatsApp Profile** | Square | 400x400 | Profile images |
| **WhatsApp Link** | Preview | 1200x630 | Link sharing |
| **Discord** | Embed | 1200x630 | Server sharing |
| **Telegram** | Link Preview | 1200x630 | Message sharing |
| **Signal** | Preview | 1200x630 | Secure sharing |
| **Slack** | Unfurl | 1200x630 | Workspace sharing |
| **iMessage** | Rich Link | 1200x630 | iOS sharing |
| **Android RCS** | Rich Message | 1200x630 | Android sharing |
| **Threads** | Post | 1080x1080 | Meta platform |
| **Bluesky** | Post | 1200x630 | Decentralized |
| **Mastodon** | Toot | 1200x630 | Federated |

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
