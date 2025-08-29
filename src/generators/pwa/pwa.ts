import path from 'path';
import { promises as fs } from 'fs';
import { ImageProcessor } from '../../core/image-processor';
import { MetadataGenerator } from '../../core/metadata-utils';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface PWAOptions {
  includeManifest?: boolean;
  includeIcons?: boolean;
  includeSplashScreens?: boolean;
  includeAppleIcons?: boolean;
  includeAndroidIcons?: boolean;
  includeShortcuts?: boolean;
}

export interface PWAManifestShortcut {
  name: string;
  short_name?: string;
  description?: string;
  url: string;
  icons?: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
}

export class PWAGenerator {
  private config: PixelForgeConfig;
  private sourceImage: string;

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.config = config;
    this.sourceImage = sourceImage;
  }

  /**
   * Generate all PWA assets
   */
  async generate(options: PWAOptions = {}): Promise<void> {
    const {
      includeManifest = true,
      includeIcons = true,
      includeSplashScreens = true,
      includeAppleIcons = false,  // Redundant with favicon apple-touch-icon
      includeAndroidIcons = false,  // Redundant with PWA icons
      includeShortcuts = false
    } = options;

    if (includeIcons) {
      if (includeAppleIcons) {
        await this.generateAppleIcons();
      }
      if (includeAndroidIcons) {
        await this.generateAndroidIcons();
      }
      await this.generatePWAIcons();
    }

    if (includeSplashScreens) {
      await this.generateSplashScreens();
    }

    if (includeManifest) {
      await this.generateManifest(includeShortcuts);
    }
  }

  /**
   * Generate PWA icons in standard sizes
   */
  private async generatePWAIcons(): Promise<void> {
    // Only essential PWA sizes required by spec (2024 best practices)
    const essentialSizes = [192, 512];
    
    for (const size of essentialSizes) {
      const processor = new ImageProcessor(this.sourceImage);
      const outputPath = path.join(this.config.output.path, `pwa-${size}x${size}.png`);

      const resizedFile = await processor.resize(size, size, { 
        fit: 'contain', 
        autoDetectBackground: true
      });
      
      const finalProcessor = new ImageProcessor(resizedFile);
      await finalProcessor.save(outputPath);
      await processor.cleanup();
      await finalProcessor.cleanup();
    }

    // Generate maskable icons (with safe area)
    await this.generateMaskableIcons();
  }

  /**
   * Generate maskable icons for adaptive icons
   */
  private async generateMaskableIcons(): Promise<void> {
    const maskableSizes = [192, 512];
    
    for (const size of maskableSizes) {
      const processor = new ImageProcessor(this.sourceImage);
      const outputPath = path.join(this.config.output.path, `pwa-maskable-${size}x${size}.png`);

      // For maskable icons, we would typically need to ensure the icon fits within a safe area
      // But since we're using 'contain' fit, the icon will be properly centered and sized
      // const safeSize = Math.round(size * 0.6);
      // const padding = Math.round((size - safeSize) / 2);

      const resizedFile = await processor.resize(size, size, { 
        fit: 'contain', 
        background: this.config.backgroundColor,
        autoDetectBackground: true  // Auto-detect background for PWA icons
      });
      
      const finalProcessor = new ImageProcessor(resizedFile);
      await finalProcessor.save(outputPath);
      await processor.cleanup();
      await finalProcessor.cleanup();
    }
  }

  /**
   * Generate Apple-specific icons
   */
  private async generateAppleIcons(): Promise<void> {
    const appleSizes = [57, 60, 72, 76, 114, 120, 144, 152, 180];
    
    for (const size of appleSizes) {
      const processor = new ImageProcessor(this.sourceImage);
      const outputPath = path.join(this.config.output.path, `apple-icon-${size}x${size}.png`);

      const resizedFile = await processor.resize(size, size, { 
        fit: 'contain', 
        background: this.config.backgroundColor,
        autoDetectBackground: true  // Auto-detect background for PWA icons
      });
      
      const finalProcessor = new ImageProcessor(resizedFile);
      await finalProcessor.save(outputPath);
      await processor.cleanup();
      await finalProcessor.cleanup();
    }
  }

  /**
   * Generate Android-specific icons
   */
  private async generateAndroidIcons(): Promise<void> {
    const androidSizes = [36, 48, 72, 96, 144, 192, 256, 384, 512];
    
    for (const size of androidSizes) {
      const processor = new ImageProcessor(this.sourceImage);
      const outputPath = path.join(this.config.output.path, `android-icon-${size}x${size}.png`);

      const resizedFile = await processor.resize(size, size, { 
        fit: 'contain', 
        background: this.config.backgroundColor,
        autoDetectBackground: true  // Auto-detect background for PWA icons
      });
      
      const finalProcessor = new ImageProcessor(resizedFile);
      await finalProcessor.save(outputPath);
      await processor.cleanup();
      await finalProcessor.cleanup();
    }
  }

  /**
   * Generate splash screens for various devices
   */
  private async generateSplashScreens(): Promise<void> {
    // Only essential generic splash screens (2024 best practices)
    const essentialSplashSizes = [
      // Generic mobile orientations only
      { width: 1080, height: 1920, name: 'android-portrait' },
      { width: 1920, height: 1080, name: 'android-landscape' },
    ];

    for (const splash of essentialSplashSizes) {
      await this.generateSplashScreen(splash.width, splash.height, splash.name);
    }
  }

  /**
   * Generate individual splash screen
   */
  private async generateSplashScreen(width: number, height: number, name: string): Promise<void> {
    const processor = new ImageProcessor(this.sourceImage);
    const outputPath = path.join(this.config.output.path, `splash-${name}-${width}x${height}.png`);

    // For splash screens, we would typically calculate logo size
    // but since we're using 'contain' fit, the image will be properly sized
    // const logoSize = Math.min(width, height) * 0.3; // Logo is 30% of smallest dimension

    const resizedFile = await processor.resize(width, height, { 
      fit: 'contain', 
      background: this.config.backgroundColor,
      autoDetectBackground: true  // Auto-detect background for splash screens
    });
    
    const finalProcessor = new ImageProcessor(resizedFile);
    await finalProcessor.save(outputPath);
    await processor.cleanup();
  }

  /**
   * Generate PWA manifest.json
   */
  private async generateManifest(includeShortcuts: boolean = false): Promise<void> {
    const prefix = this.config.output.prefix || '/';
    
    interface PWAManifest {
      name: string;
      short_name: string;
      description: string;
      theme_color: string;
      background_color: string;
      display: string;
      orientation: string;
      scope: string;
      start_url: string;
      id: string;
      icons: Array<{
        src: string;
        sizes: string;
        type: string;
        purpose?: string;
      }>;
      screenshots: Array<{
        src: string;
        sizes: string;
        type: string;
        form_factor: string;
      }>;
      categories: string[];
      lang: string;
      dir: string;
      shortcuts?: PWAManifestShortcut[];
    }
    
    const manifest: PWAManifest = {
      name: this.config.appName,
      short_name: this.config.appName,
      description: this.config.description || '',
      theme_color: this.config.themeColor,
      background_color: this.config.backgroundColor,
      display: 'standalone',
      orientation: 'portrait-primary',
      scope: '/',
      start_url: '/',
      id: '/',
      
      icons: [
        // Essential PWA icons only (2024 best practices)
        {
          src: `${prefix}pwa-192x192.png`,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: `${prefix}pwa-512x512.png`,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        
        // Maskable versions for Android adaptive icons
        {
          src: `${prefix}pwa-maskable-192x192.png`,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: `${prefix}pwa-maskable-512x512.png`,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],

      // Screenshots for app stores
      screenshots: [
        {
          src: `${prefix}splash-android-portrait-1080x1920.png`,
          sizes: '1080x1920',
          type: 'image/png',
          form_factor: 'narrow'
        },
        {
          src: `${prefix}splash-android-landscape-1920x1080.png`,
          sizes: '1920x1080',
          type: 'image/png',
          form_factor: 'wide'
        }
      ],

      // Categories
      categories: ['productivity', 'business'],
      
      // Language
      lang: 'en',
      dir: 'ltr'
    };

    // Add shortcuts if requested
    if (includeShortcuts) {
      manifest.shortcuts = this.getDefaultShortcuts();
    }

    const manifestPath = path.join(this.config.output.path, 'manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    try {
      const { emitProgress } = await import('../../core/progress-events');
      emitProgress(manifestPath);
    } catch (_err) {
      // Ignore progress emission failures
    }
  }

  /**
   * Get default app shortcuts
   */
  private getDefaultShortcuts(): PWAManifestShortcut[] {
    const prefix = this.config.output.prefix || '/';
    
    return [
      {
        name: 'Home',
        short_name: 'Home',
        description: 'Go to home page',
        url: '/',
        icons: [
          {
            src: `${prefix}pwa-192x192.png`,
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    ];
  }

  /**
   * Get HTML meta tags for PWA
   */
  getMetaTags(): string[] {
    const metadataGenerator = new MetadataGenerator(this.config);
    return metadataGenerator.getPWAMetaTags({
      title: this.config.appName,
      description: this.config.description
    });
  }

  /**
   * Get Next.js metadata configuration for PWA
   */
  getNextMetadata() {
    const prefix = this.config.output.prefix || '/';
    
    return {
      manifest: `${prefix}manifest.json`,
      themeColor: this.config.themeColor,
      applicationName: this.config.appName,
      appleWebApp: {
        capable: true,
        title: this.config.appName,
        statusBarStyle: 'black-translucent',
        startupImage: [
          {
            url: `${prefix}splash-iphone-x-1125x2436.png`,
            media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)'
          },
          {
            url: `${prefix}splash-iphone-xs-max-1242x2688.png`,
            media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)'
          }
        ]
      },
      icons: {
        apple: [
          { url: `${prefix}apple-icon-180x180.png`, sizes: '180x180', type: 'image/png' },
          { url: `${prefix}apple-icon-152x152.png`, sizes: '152x152', type: 'image/png' },
          { url: `${prefix}apple-icon-144x144.png`, sizes: '144x144', type: 'image/png' },
        ],
        other: [
          { url: `${prefix}pwa-192x192.png`, sizes: '192x192', type: 'image/png' },
          { url: `${prefix}pwa-512x512.png`, sizes: '512x512', type: 'image/png' },
          { url: `${prefix}pwa-maskable-192x192.png`, sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { url: `${prefix}pwa-maskable-512x512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ]
      }
    };
  }

  /**
   * Get list of generated files
   */
  getGeneratedFiles(): string[] {
    return [
      // Essential PWA icons only (2024 best practices)
      'pwa-192x192.png',                // Required by PWA spec
      'pwa-512x512.png',                // Required by PWA spec
      'pwa-maskable-192x192.png',       // Android adaptive icons
      'pwa-maskable-512x512.png',       // Android adaptive icons
      
      // Essential splash screens (generic only)
      'splash-android-portrait-1080x1920.png',   // Generic mobile portrait
      'splash-android-landscape-1920x1080.png',  // Generic mobile landscape
      
      // PWA configuration
      'manifest.json',
    ];
  }
} 