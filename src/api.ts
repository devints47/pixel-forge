import { FaviconGenerator } from './generators/favicon';
import { PWAGenerator } from './generators/pwa';
import { WebSEOGenerator } from './generators/web';
import { generateComprehensiveSocial, generateSpecificSocial } from './cli/commands/generate-social';
import { generatePlatforms } from './generators/social/platforms/factory';
import { generateMessaging } from './generators/social/messaging/factory';
import type { PixelForgeConfig } from './core/config-validator';

/**
 * Modern API that mirrors CLI flags with plug-and-play metadata generation
 * Designed for maximum ease of use and SEO best practices
 */

export interface PixelForgeOptions {
  // Basic settings
  outputDir?: string;
  
  // Main generators (mirrors CLI flags)
  all?: boolean;
  social?: boolean;
  favicon?: boolean;
  pwa?: boolean;
  web?: boolean;
  seo?: boolean;
  
  // Social platform specifics
  platforms?: boolean;
  messaging?: boolean;
  
  // Individual platforms (like CLI flags)
  facebook?: boolean;
  twitter?: boolean;
  linkedin?: boolean;
  instagram?: boolean;
  tiktok?: boolean;
  snapchat?: boolean;
  threads?: boolean;
  whatsapp?: boolean;
  youtube?: boolean;
  pinterest?: boolean;
  bluesky?: boolean;
  mastodon?: boolean;
  
  // Messaging apps
  discord?: boolean;
  telegram?: boolean;
  signal?: boolean;
  slack?: boolean;
  imessage?: boolean;
  androidrcs?: boolean;
  
  // Metadata generation
  generateMetadata?: boolean; // Returns plug-and-play HTML meta tags
  
  // Output options
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
  verbose?: boolean;
}

export interface PixelForgeResult {
  files: {
    favicon?: string[];
    pwa?: string[];
    social?: string[];
    web?: string[];
    seo?: string[];
  };
  metadata?: {
    html: string;           // Ready-to-use HTML meta tags
    favicon: string[];      // Favicon-specific meta tags
    pwa: string[];          // PWA manifest and meta tags
    social: string[];       // OpenGraph and Twitter Card meta tags
    apple: string[];        // Apple-specific meta tags
    android: string[];      // Android-specific meta tags
    windows: string[];      // Windows/Microsoft meta tags
  };
  summary: {
    totalFiles: number;
    generatedAssets: string[];
    outputDirectory: string;
  };
}

/**
 * Creates a config from the modern options
 */
function createConfig(imagePath: string, options: PixelForgeOptions = {}): PixelForgeConfig {
  const {
    outputDir = './assets',
    format = 'png',
    quality = 90
  } = options;

  return {
    appName: 'Generated Asset',  // Simple placeholder for metadata
    description: 'Boilerplate image assets for web applications',  // Simple placeholder
    themeColor: '#007bff',  // Hardcoded sensible default
    backgroundColor: '#ffffff',  // Hardcoded sensible default
    output: {
      path: outputDir,
      quality,
      format
    },
    socialPreview: {
      template: 'basic'
      // No title/description to avoid text overlays on images
    },
    platforms: {
      social: true,
      favicon: true,
      pwa: true,
      apple: true,
      android: true,
      windows: true
    }
  };
}

/**
 * Generates HTML meta tags for all generated assets
 */
function generateMetaTags(
  faviconGenerator: FaviconGenerator | undefined,
  pwaGenerator: PWAGenerator | undefined,
  webGenerator: WebSEOGenerator | undefined,
  socialFiles: string[],
  config: PixelForgeConfig
): PixelForgeResult['metadata'] {
  const favicon = faviconGenerator?.getMetaTags() || [];
  const pwa = pwaGenerator?.getMetaTags() || [];
  const web = webGenerator?.getMetaTags() || [];
  
  // Generate social media meta tags
  const social: string[] = [];
  const baseUrl = ''; // Users can replace this with their domain
  
  // Basic OpenGraph tags (placeholder values - users should customize)
  social.push(`<meta property="og:title" content="Your App Name" />`);
  social.push(`<meta property="og:description" content="Your app description" />`);
  social.push(`<meta property="og:type" content="website" />`);
  
  // Add social media images
  if (socialFiles.includes('social-media-general.png')) {
    social.push(`<meta property="og:image" content="${baseUrl}/social-media-general.png" />`);
    social.push(`<meta property="og:image:width" content="1200" />`);
    social.push(`<meta property="og:image:height" content="630" />`);
  }
  
  // Twitter Card tags (placeholder values - users should customize)
  social.push(`<meta name="twitter:card" content="summary_large_image" />`);
  social.push(`<meta name="twitter:title" content="Your App Name" />`);
  social.push(`<meta name="twitter:description" content="Your app description" />`);
  if (socialFiles.includes('twitter-image.png')) {
    social.push(`<meta name="twitter:image" content="${baseUrl}/twitter-image.png" />`);
  }
  
  // Apple-specific meta tags (placeholder values - users should customize)
  const apple: string[] = [];
  apple.push(`<meta name="apple-mobile-web-app-title" content="Your App Name" />`);
  apple.push(`<meta name="apple-mobile-web-app-capable" content="yes" />`);
  apple.push(`<meta name="apple-mobile-web-app-status-bar-style" content="default" />`);
  if (favicon.some(tag => tag.includes('apple-touch-icon'))) {
    apple.push(`<link rel="apple-touch-icon" href="${baseUrl}/apple-touch-icon.png" />`);
  }
  
  // Android-specific meta tags
  const android: string[] = [];
  android.push(`<meta name="mobile-web-app-capable" content="yes" />`);
  android.push(`<meta name="theme-color" content="#007bff" />`);
  
  // Windows-specific meta tags
  const windows: string[] = [];
  windows.push(`<meta name="msapplication-TileColor" content="#007bff" />`);
  windows.push(`<meta name="msapplication-config" content="${baseUrl}/browserconfig.xml" />`);
  
  // Combine all meta tags into a single HTML string
  const allTags = [...favicon, ...pwa, ...web, ...social, ...apple, ...android, ...windows];
  const html = allTags.join('\n');
  
  return {
    html,
    favicon,
    pwa,
    social,
    apple,
    android,
    windows
  };
}

/**
 * 🚀 Main API function that mirrors CLI functionality
 * This is the primary function you should use - it supports all CLI flags and options
 */
export async function generate(imagePath: string, options: PixelForgeOptions = {}): Promise<PixelForgeResult> {
  const config = createConfig(imagePath, options);
  const result: PixelForgeResult = {
    files: {},
    summary: {
      totalFiles: 0,
      generatedAssets: [],
      outputDirectory: config.output.path
    }
  };

  let faviconGenerator: FaviconGenerator | undefined;
  let pwaGenerator: PWAGenerator | undefined;
  let webGenerator: WebSEOGenerator | undefined;
  const allSocialFiles: string[] = [];

  // Handle --all flag
  if (options.all) {
    // Generate everything
    faviconGenerator = new FaviconGenerator(imagePath, config);
    await faviconGenerator.generate();
    result.files.favicon = faviconGenerator.getGeneratedFiles();

    pwaGenerator = new PWAGenerator(imagePath, config);
    await pwaGenerator.generate();
    result.files.pwa = pwaGenerator.getGeneratedFiles();

    webGenerator = new WebSEOGenerator(imagePath, config);
    await webGenerator.generate();
    result.files.web = webGenerator.getGeneratedFiles();

    const socialResults = await generateComprehensiveSocial(imagePath, config);
    result.files.social = socialResults.flatMap((r: any) => r.files);
    allSocialFiles.push(...(result.files.social || []));
  } else {
    // Handle individual flags

    // Favicon generation
    if (options.favicon) {
      faviconGenerator = new FaviconGenerator(imagePath, config);
      await faviconGenerator.generate();
      result.files.favicon = faviconGenerator.getGeneratedFiles();
    }

    // PWA generation
    if (options.pwa) {
      pwaGenerator = new PWAGenerator(imagePath, config);
      await pwaGenerator.generate();
      result.files.pwa = pwaGenerator.getGeneratedFiles();
    }

    // Web/SEO generation
    if (options.web || options.seo) {
      webGenerator = new WebSEOGenerator(imagePath, config);
      await webGenerator.generate();
      result.files.web = webGenerator.getGeneratedFiles();
    }

    // Social media generation
    if (options.social) {
      const socialResults = await generateComprehensiveSocial(imagePath, config);
      result.files.social = socialResults.flatMap((r: any) => r.files);
      allSocialFiles.push(...(result.files.social || []));
    }

    // Individual platform generation
    const hasSpecificPlatforms = options.facebook || options.twitter || options.linkedin || 
      options.instagram || options.tiktok || options.snapchat || options.threads || 
      options.whatsapp || options.youtube || options.pinterest || options.bluesky || 
      options.mastodon || options.discord || options.telegram || options.signal || 
      options.slack || options.imessage || options.androidrcs;

    if (hasSpecificPlatforms) {
      const socialResults = await generateSpecificSocial(imagePath, config, options);
      const socialFiles = socialResults.flatMap((r: any) => r.files);
      result.files.social = [...(result.files.social || []), ...socialFiles];
      allSocialFiles.push(...socialFiles);
    }

    // Platform groups
    if (options.platforms) {
      const platformResults = await generatePlatforms(imagePath, config, {
        facebook: true,
        twitter: true,
        linkedin: true,
        instagram: true,
        tiktok: true,
        snapchat: true,
        threads: true,
        youtube: true,
        pinterest: true,
        bluesky: true,
        mastodon: true
      });
      const platformFiles = platformResults.flatMap((r: any) => r.files);
      result.files.social = [...(result.files.social || []), ...platformFiles];
      allSocialFiles.push(...platformFiles);
    }

    if (options.messaging) {
      const messagingResults = await generateMessaging(imagePath, config, {
        discord: true,
        telegram: true,
        signal: true,
        slack: true,
        imessage: true,
        androidrcs: true
      });
      const messagingFiles = messagingResults.flatMap((r: any) => r.files);
      result.files.social = [...(result.files.social || []), ...messagingFiles];
      allSocialFiles.push(...messagingFiles);
    }
  }

  // Generate metadata if requested
  if (options.generateMetadata) {
    result.metadata = generateMetaTags(
      faviconGenerator,
      pwaGenerator,
      webGenerator,
      allSocialFiles,
      config
    );
  }

  // Calculate summary
  const allFiles = Object.values(result.files).flat();
  result.summary.totalFiles = allFiles.length;
  result.summary.generatedAssets = allFiles;

  return result;
}

// Legacy functions for backwards compatibility
export async function generateAll(imagePath: string, options: PixelForgeOptions = {}) {
  return generate(imagePath, { ...options, all: true });
}

export async function generateFavicons(imagePath: string, outputDir: string = './assets') {
  const result = await generate(imagePath, { favicon: true, outputDir });
  return result.files.favicon || [];
}

export async function generatePWA(imagePath: string, outputDir: string = './assets') {
  const result = await generate(imagePath, { 
    pwa: true, 
    outputDir,
    generateMetadata: true 
  });
  return {
    files: result.files.pwa || [],
    manifest: result.metadata?.pwa || []
  };
}

export async function generateSocial(imagePath: string, outputDir: string = './assets') {
  const result = await generate(imagePath, { 
    social: true, 
    outputDir
  });
  return result.files.social || [];
}

export async function generateWeb(imagePath: string, outputDir: string = './assets') {
  const result = await generate(imagePath, { web: true, outputDir });
  return result.files.web || [];
}

export async function generateQuick(imagePath: string, outputDir: string = './assets') {
  return generate(imagePath, { 
    all: true, 
    outputDir,
    generateMetadata: true 
  });
}
