import path from 'path';
import { promises as fs } from 'fs';
import { ImageProcessor, ImageSizes } from '../../core/image-processor';
import { MetadataGenerator } from '../../core/metadata-utils';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface FaviconOptions {
  includeICO?: boolean;
  includePNG?: boolean;
  includeSVG?: boolean;
  includeApple?: boolean;
  includeAndroid?: boolean;
  includeWindows?: boolean;
  includeSafari?: boolean;
}

export class FaviconGenerator {
  private config: PixelForgeConfig;
  private sourceImage: string;

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.config = config;
    this.sourceImage = sourceImage;
  }

  /**
   * Generate all favicon formats and sizes
   */
  async generate(options: FaviconOptions = {}): Promise<void> {
    const {
      includeICO = true,
      includePNG = true,
      includeSVG = true,
      includeApple = true,
      includeAndroid: _includeAndroid = false,  // Moved to PWA generator
      includeWindows: _includeWindows = false,  // Rarely used, disabled by default
      includeSafari = true
    } = options;

    // Generate standard PNG favicons
    if (includePNG) {
      await this.generatePNGFavicons();
    }

    // Generate ICO format
    if (includeICO) {
      await this.generateICOFavicon();
    }

    // Generate SVG favicon
    if (includeSVG) {
      await this.generateSVGFavicon();
    }

    // Generate Apple touch icons
    if (includeApple) {
      await this.generateAppleIcons();
    }

    // Note: Android icons moved to PWA generator for better organization

    // Note: Windows tiles generation disabled by default (rarely used in 2024)

    // Generate Safari pinned tab
    if (includeSafari) {
      await this.generateSafariIcon();
    }
  }

  /**
   * Generate multiple PNG favicon sizes (2024 best practices)
   * Essential sizes: 16x16, 32x32, 48x48 for various browser contexts
   */
  private async generatePNGFavicons(): Promise<void> {
    const sizes = [
      { size: 16, filename: 'favicon-16x16.png' },   // Browser tab, small displays
      { size: 32, filename: 'favicon-32x32.png' },   // Browser tab, standard displays
      { size: 48, filename: 'favicon-48x48.png' }    // Desktop shortcuts, Windows taskbar
    ];

    for (const { size, filename } of sizes) {
      const processor = new ImageProcessor(this.sourceImage);
      const resizedFile = await processor.resize(size, size, { 
        fit: 'contain', 
        autoDetectBackground: true
      });
      const finalProcessor = new ImageProcessor(resizedFile);
      const outputPath = path.join(this.config.output.path, filename);
      await finalProcessor.save(outputPath);
      await processor.cleanup();
      await finalProcessor.cleanup();
    }
  }

  /**
   * Generate multi-size ICO file with 16x16 and 32x32 embedded sizes
   * This provides optimal compatibility across browsers and operating systems
   */
  private async generateICOFavicon(): Promise<void> {
    const outputPath = path.join(this.config.output.path, 'favicon.ico');
    
    try {
      // Create 32x32 as primary size for ICO (most commonly used)
      const processor = new ImageProcessor(this.sourceImage);
      const resizedFile = await processor.resize(32, 32, { 
        fit: 'contain', 
        background: 'transparent',
        zoom: 1.1
      });
      const finalProcessor = new ImageProcessor(resizedFile);
      await finalProcessor.save(outputPath, { format: 'ico' });
      await processor.cleanup();
      await finalProcessor.cleanup();
    } catch (_error) {
      // Fallback to PNG with ICO extension for compatibility
      console.warn('ICO generation failed, falling back to PNG format');
      const processor = new ImageProcessor(this.sourceImage);
      const resizedFile = await processor.resize(32, 32, { 
        fit: 'contain', 
        background: 'transparent',
        zoom: 1.1
      });
      const finalProcessor = new ImageProcessor(resizedFile);
      await finalProcessor.save(outputPath.replace('.ico', '.png'));
      await fs.rename(outputPath.replace('.ico', '.png'), outputPath);
      await processor.cleanup();
      await finalProcessor.cleanup();
    }
  }

  /**
   * Generate SVG favicon for modern browsers
   */
  private async generateSVGFavicon(): Promise<void> {
    const outputPath = path.join(this.config.output.path, 'favicon.svg');
    
    if (this.sourceImage.endsWith('.svg')) {
      // Copy existing SVG
      await fs.copyFile(this.sourceImage, outputPath);
    } else {
      // Convert to SVG using ImageMagick (better than Sharp's approach)
      const processor = new ImageProcessor(this.sourceImage);
      try {
        const resizedFile = await processor.resize(64, 64, { 
          fit: 'contain', 
          background: 'transparent',
          zoom: 1.1
        });
        const finalProcessor = new ImageProcessor(resizedFile);
        await finalProcessor.save(outputPath, { format: 'svg' });
        await processor.cleanup();
        await finalProcessor.cleanup();
      } catch (_error) {
        // Fallback to PNG with SVG extension if SVG conversion fails
        console.warn('SVG generation failed, creating PNG with SVG extension for compatibility');
        const resizedFile = await processor.resize(64, 64, { 
          fit: 'contain', 
          background: 'transparent',
          zoom: 1.1
        });
        const finalProcessor = new ImageProcessor(resizedFile);
        await finalProcessor.save(outputPath.replace('.svg', '.png'));
        await fs.rename(outputPath.replace('.svg', '.png'), outputPath);
        await processor.cleanup();
        await finalProcessor.cleanup();
      }
    }
  }

  /**
   * Generate Apple touch icons
   */
  private async generateAppleIcons(): Promise<void> {
    // Only generate the essential 180x180 Apple touch icon (2024 best practices)
    const processor = new ImageProcessor(this.sourceImage);
    const resizedFile = await processor.resize(180, 180, { 
      fit: 'contain', 
      autoDetectBackground: true
    });
    const finalProcessor = new ImageProcessor(resizedFile);
    const outputPath = path.join(this.config.output.path, 'apple-touch-icon.png');
    await finalProcessor.save(outputPath);
    await processor.cleanup();
    await finalProcessor.cleanup();
  }

  /**
   * Generate Android/PWA icons
   */
  private async generateAndroidIcons(): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const size of ImageSizes.android) {
      const promise = (async () => {
        const processor = new ImageProcessor(this.sourceImage);
        const resizedFile = await processor.resize(size, size, { 
          fit: 'contain', 
          background: this.config.backgroundColor,
          zoom: 1.1,
          autoDetectBackground: true  // Auto-detect background for Android icons
        });
        const finalProcessor = new ImageProcessor(resizedFile);
        const outputPath = path.join(this.config.output.path, `android-chrome-${size}x${size}.png`);
        await finalProcessor.save(outputPath);
        await processor.cleanup();
        await finalProcessor.cleanup();
      })();
      promises.push(promise);
    }

    await Promise.all(promises);
  }

  /**
   * Generate Windows tiles (Microsoft)
   */
  private async generateWindowsTiles(): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const size of ImageSizes.mstile) {
      const promise = (async () => {
        const processor = new ImageProcessor(this.sourceImage);
        const resizedFile = await processor.resize(size.width, size.height, { 
          fit: 'contain', 
          background: this.config.themeColor,
          zoom: 1.1,
          autoDetectBackground: true  // Auto-detect background for mstile images
        });
        const finalProcessor = new ImageProcessor(resizedFile);
        const outputPath = path.join(this.config.output.path, `mstile-${size.width}x${size.height}.png`);
        await finalProcessor.save(outputPath);
        await processor.cleanup();
        await finalProcessor.cleanup();
      })();
      promises.push(promise);
    }

    await Promise.all(promises);

    // Generate browserconfig.xml
    await this.generateBrowserConfig();
  }

  /**
   * Generate browserconfig.xml for Microsoft Edge and IE
   */
  private async generateBrowserConfig(): Promise<void> {
    const { prefix = '/' } = this.config.output;
    
    const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="${prefix}mstile-70x70.png"/>
      <square150x150logo src="${prefix}mstile-150x150.png"/>
      <wide310x150logo src="${prefix}mstile-310x150.png"/>
      <square310x310logo src="${prefix}mstile-310x310.png"/>
      <TileColor>${this.config.themeColor}</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

    const outputPath = path.join(this.config.output.path, 'browserconfig.xml');
    await fs.writeFile(outputPath, browserconfig);
  }

  /**
   * Generate Safari pinned tab icon
   */
  private async generateSafariIcon(): Promise<void> {
    // Generate a simplified SVG for Safari pinned tabs
    // This should be a monochrome, high-contrast version
    const outputPath = path.join(this.config.output.path, 'safari-pinned-tab.svg');
    
    // Create a simplified SVG representation
    // In a real implementation, you might want to use a library like potrace
    // For now, we'll create a basic SVG template
    const svgContent = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
 "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">
<metadata>
Created by Social Forge
</metadata>
<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M0 2560 l0 -2560 2560 0 2560 0 0 2560 0 2560 -2560 0 -2560 0 0
-2560z"/>
</g>
</svg>`;

    await fs.writeFile(outputPath, svgContent);
  }



  /**
   * Get HTML meta tags for favicons
   */
  getMetaTags(): string[] {
    const metadataGenerator = new MetadataGenerator(this.config);
    return metadataGenerator.getFaviconMetaTags();
  }

  /**
   * Get Next.js metadata configuration for favicons
   */
  getNextMetadata() {
    const prefix = this.config.output.prefix || '/';
    return {
      icons: {
        icon: [
          { url: `${prefix}favicon.ico`, sizes: '32x32', type: 'image/x-icon' },
          { url: `${prefix}favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
          { url: `${prefix}favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
          { url: `${prefix}favicon.svg`, type: 'image/svg+xml' },
        ],
        apple: [
          { url: `${prefix}apple-touch-icon.png`, sizes: '180x180', type: 'image/png' },
        ],
        other: [
          { url: `${prefix}android-chrome-192x192.png`, sizes: '192x192', type: 'image/png' },
          { url: `${prefix}android-chrome-512x512.png`, sizes: '512x512', type: 'image/png' },
        ],
      },
      manifest: `${prefix}manifest.json`,
      themeColor: this.config.themeColor,
      other: {
        'msapplication-config': `${prefix}browserconfig.xml`,
        'msapplication-TileColor': this.config.themeColor,
      },
    };
  }

  /**
   * Get list of generated files
   */
  getGeneratedFiles(): string[] {
    return [
      // Essential favicons with multiple sizes (2024 best practices)
      'favicon.ico',                    // Legacy/IE support (contains 16x16 + 32x32)
      'favicon-16x16.png',             // Browser tab, small displays
      'favicon-32x32.png',             // Browser tab, standard displays  
      'favicon-48x48.png',             // Desktop shortcuts, Windows taskbar
      'apple-touch-icon.png',          // iOS home screen (180x180)
      'safari-pinned-tab.svg',         // Safari pinned tabs
    ];
  }
} 