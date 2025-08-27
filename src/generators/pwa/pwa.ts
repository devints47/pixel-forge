import path from 'path';
import { promises as fs } from 'fs';
import { ImageProcessor } from '../../core/image-processor';
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
      includeAppleIcons = true,
      includeAndroidIcons = true,
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
    const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
    
    for (const size of iconSizes) {
      const processor = new ImageProcessor(this.sourceImage);
      const outputPath = path.join(this.config.output.path, `pwa-${size}x${size}.png`);

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
    const splashSizes = [
      // iPhone sizes
      { width: 1125, height: 2436, name: 'iphone-x' },
      { width: 1242, height: 2688, name: 'iphone-xs-max' },
      { width: 828, height: 1792, name: 'iphone-xr' },
      { width: 1170, height: 2532, name: 'iphone-12' },
      { width: 1284, height: 2778, name: 'iphone-12-pro-max' },
      
      // iPad sizes
      { width: 1536, height: 2048, name: 'ipad' },
      { width: 1620, height: 2160, name: 'ipad-air' },
      { width: 2048, height: 2732, name: 'ipad-pro' },
      
      // Android/Generic sizes
      { width: 1080, height: 1920, name: 'android-portrait' },
      { width: 1920, height: 1080, name: 'android-landscape' },
    ];

    for (const splash of splashSizes) {
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
        // Standard icons
        {
          src: `${prefix}pwa-192x192.png`,
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: `${prefix}pwa-512x512.png`,
          sizes: '512x512',
          type: 'image/png'
        },
        // Maskable icons
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
        },
        // Any purpose icons
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
    const prefix = this.config.output.prefix || '/';
    
    return [
      // PWA manifest
      `<link rel="manifest" href="${prefix}manifest.json">`,
      
      // Theme colors
      `<meta name="theme-color" content="${this.config.themeColor}">`,
      `<meta name="msapplication-navbutton-color" content="${this.config.themeColor}">`,
      `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`,
      
      // PWA capabilities
      `<meta name="apple-mobile-web-app-capable" content="yes">`,
      `<meta name="apple-mobile-web-app-title" content="${this.config.appName}">`,
      `<meta name="mobile-web-app-capable" content="yes">`,
      `<meta name="application-name" content="${this.config.appName}">`,
      
      // Apple icons
      `<link rel="apple-touch-icon" sizes="180x180" href="${prefix}apple-icon-180x180.png">`,
      `<link rel="apple-touch-icon" sizes="152x152" href="${prefix}apple-icon-152x152.png">`,
      `<link rel="apple-touch-icon" sizes="144x144" href="${prefix}apple-icon-144x144.png">`,
      `<link rel="apple-touch-icon" sizes="120x120" href="${prefix}apple-icon-120x120.png">`,
      `<link rel="apple-touch-icon" sizes="114x114" href="${prefix}apple-icon-114x114.png">`,
      `<link rel="apple-touch-icon" sizes="76x76" href="${prefix}apple-icon-76x76.png">`,
      `<link rel="apple-touch-icon" sizes="72x72" href="${prefix}apple-icon-72x72.png">`,
      `<link rel="apple-touch-icon" sizes="60x60" href="${prefix}apple-icon-60x60.png">`,
      `<link rel="apple-touch-icon" sizes="57x57" href="${prefix}apple-icon-57x57.png">`,
      
      // Splash screens
      `<link rel="apple-touch-startup-image" href="${prefix}splash-iphone-x-1125x2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)">`,
      `<link rel="apple-touch-startup-image" href="${prefix}splash-iphone-xs-max-1242x2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)">`,
      `<link rel="apple-touch-startup-image" href="${prefix}splash-iphone-xr-828x1792.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)">`,
      
      // Android icons
      `<link rel="icon" type="image/png" sizes="192x192" href="${prefix}android-icon-192x192.png">`,
      `<link rel="icon" type="image/png" sizes="144x144" href="${prefix}android-icon-144x144.png">`,
      `<link rel="icon" type="image/png" sizes="96x96" href="${prefix}android-icon-96x96.png">`,
      `<link rel="icon" type="image/png" sizes="72x72" href="${prefix}android-icon-72x72.png">`,
      `<link rel="icon" type="image/png" sizes="48x48" href="${prefix}android-icon-48x48.png">`,
      `<link rel="icon" type="image/png" sizes="36x36" href="${prefix}android-icon-36x36.png">`,
    ];
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
      // PWA icons
      'pwa-72x72.png',
      'pwa-96x96.png',
      'pwa-128x128.png',
      'pwa-144x144.png',
      'pwa-152x152.png',
      'pwa-192x192.png',
      'pwa-384x384.png',
      'pwa-512x512.png',
      
      // Maskable icons
      'pwa-maskable-192x192.png',
      'pwa-maskable-512x512.png',
      
      // Apple icons
      'apple-icon-57x57.png',
      'apple-icon-60x60.png',
      'apple-icon-72x72.png',
      'apple-icon-76x76.png',
      'apple-icon-114x114.png',
      'apple-icon-120x120.png',
      'apple-icon-144x144.png',
      'apple-icon-152x152.png',
      'apple-icon-180x180.png',
      
      // Android icons
      'android-icon-36x36.png',
      'android-icon-48x48.png',
      'android-icon-72x72.png',
      'android-icon-96x96.png',
      'android-icon-144x144.png',
      'android-icon-192x192.png',
      'android-icon-256x256.png',
      'android-icon-384x384.png',
      'android-icon-512x512.png',
      
      // Splash screens
      'splash-iphone-x-1125x2436.png',
      'splash-iphone-xs-max-1242x2688.png',
      'splash-iphone-xr-828x1792.png',
      'splash-iphone-12-1170x2532.png',
      'splash-iphone-12-pro-max-1284x2778.png',
      'splash-ipad-1536x2048.png',
      'splash-ipad-air-1620x2160.png',
      'splash-ipad-pro-2048x2732.png',
      'splash-android-portrait-1080x1920.png',
      'splash-android-landscape-1920x1080.png',
      
      // Manifest
      'manifest.json',
    ];
  }
} 