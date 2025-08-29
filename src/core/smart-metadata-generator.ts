import path from 'path';
import { promises as fs } from 'fs';
import type { PixelForgeConfig } from './config-validator';

export interface SmartMetadataOptions {
  generatedFiles: string[];
  outputDir: string;
  urlPrefix: string;
}

/**
 * Smart metadata generator that creates meta tags only for files that were actually generated
 */
export class SmartMetadataGenerator {
  private config: PixelForgeConfig;
  private generatedFiles: Set<string>;
  private urlPrefix: string;

  constructor(config: PixelForgeConfig, options: SmartMetadataOptions) {
    this.config = config;
    this.generatedFiles = new Set(options.generatedFiles);
    this.urlPrefix = options.urlPrefix.endsWith('/') ? options.urlPrefix : `${options.urlPrefix}/`;
  }

  /**
   * Check if a file was actually generated
   */
  private hasFile(filename: string): boolean {
    return this.generatedFiles.has(filename);
  }

  /**
   * Generate essential meta tags for the generated files
   */
  generateMetaTags(): string[] {
    const tags: string[] = [];

    // Essential meta tags (always included)
    tags.push(
      '<!-- Essential Meta Tags -->',
      '<meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      `<meta name="description" content="${this.config.description}">`,
      `<meta name="application-name" content="${this.config.appName}">`,
      `<meta name="generator" content="Pixel Forge">`,
      `<meta name="theme-color" content="${this.config.themeColor}">`,
      ''
    );

    // Favicon meta tags (only for generated favicon files)
    const faviconTags = this.getFaviconMetaTags();
    if (faviconTags.length > 0) {
      tags.push(...faviconTags, '');
    }

    // PWA meta tags (only if manifest exists)
    const pwaTags = this.getPWAMetaTags();
    if (pwaTags.length > 0) {
      tags.push(...pwaTags, '');
    }

    // Social/SEO meta tags (only for generated social images)
    const socialTags = this.getSocialMetaTags();
    if (socialTags.length > 0) {
      tags.push(...socialTags, '');
    }

    // Security and performance meta tags
    tags.push(
      ...this.getSecurityMetaTags(),
      ''
    );

    return tags;
  }

  /**
   * Get favicon meta tags for generated favicon files only
   */
  private getFaviconMetaTags(): string[] {
    const tags: string[] = [];

    if (this.hasFile('favicon.ico') || this.hasFile('favicon-16x16.png') || this.hasFile('favicon-32x32.png') || this.hasFile('favicon-48x48.png') || this.hasFile('favicon.svg') || this.hasFile('apple-touch-icon.png') || this.hasFile('safari-pinned-tab.svg')) {
      tags.push('<!-- Favicon Meta Tags -->');

      if (this.hasFile('favicon.ico')) {
        tags.push(`<link rel="icon" type="image/x-icon" href="${this.urlPrefix}favicon.ico">`);
      }

      if (this.hasFile('favicon-16x16.png')) {
        tags.push(`<link rel="icon" type="image/png" sizes="16x16" href="${this.urlPrefix}favicon-16x16.png">`);
      }

      if (this.hasFile('favicon-32x32.png')) {
        tags.push(`<link rel="icon" type="image/png" sizes="32x32" href="${this.urlPrefix}favicon-32x32.png">`);
      }

      if (this.hasFile('favicon-48x48.png')) {
        tags.push(`<link rel="icon" type="image/png" sizes="48x48" href="${this.urlPrefix}favicon-48x48.png">`);
      }

      if (this.hasFile('favicon.svg')) {
        tags.push(`<link rel="icon" type="image/svg+xml" href="${this.urlPrefix}favicon.svg">`);
      }

      if (this.hasFile('apple-touch-icon.png')) {
        tags.push(`<link rel="apple-touch-icon" sizes="180x180" href="${this.urlPrefix}apple-touch-icon.png">`);
      }

      if (this.hasFile('safari-pinned-tab.svg')) {
        tags.push(`<link rel="mask-icon" href="${this.urlPrefix}safari-pinned-tab.svg" color="${this.config.themeColor}">`);
      }
    }

    return tags;
  }

  /**
   * Get PWA meta tags only if manifest.json was generated
   */
  private getPWAMetaTags(): string[] {
    const tags: string[] = [];

    if (this.hasFile('manifest.json')) {
      tags.push(
        '<!-- PWA Meta Tags -->',
        `<link rel="manifest" href="${this.urlPrefix}manifest.json">`,
        `<meta name="mobile-web-app-capable" content="yes">`,
        `<meta name="apple-mobile-web-app-capable" content="yes">`,
        `<meta name="apple-mobile-web-app-status-bar-style" content="default">`,
        `<meta name="apple-mobile-web-app-title" content="${this.config.appName}">`
      );
    }

    return tags;
  }

  /**
   * Get social/SEO meta tags for generated social images
   */
  private getSocialMetaTags(): string[] {
    const tags: string[] = [];

    // Find the best social image available
    let socialImage = '';
    const socialImageCandidates = [
      'social-media-general.png',
      'og-image.png',
      'opengraph.png',
      'twitter-image.png'
    ];

    for (const candidate of socialImageCandidates) {
      if (this.hasFile(candidate)) {
        socialImage = `${this.urlPrefix}${candidate}`;
        break;
      }
    }

    if (socialImage) {
      tags.push(
        '<!-- Social/SEO Meta Tags -->',
        `<meta property="og:title" content="${this.config.appName}">`,
        `<meta property="og:description" content="${this.config.description}">`,
        `<meta property="og:image" content="${socialImage}">`,
        `<meta property="og:type" content="website">`,
        `<meta property="og:locale" content="en_US">`,
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:title" content="${this.config.appName}">`,
        `<meta name="twitter:description" content="${this.config.description}">`,
        `<meta name="twitter:image" content="${socialImage}">`,
        `<meta name="twitter:image:alt" content="${this.config.appName}">`
      );
    }

    return tags;
  }

  /**
   * Get security and performance meta tags
   */
  private getSecurityMetaTags(): string[] {
    return [
      '<!-- Security & Performance Meta Tags -->',
      '<meta http-equiv="X-Content-Type-Options" content="nosniff">',
      '<meta http-equiv="X-Frame-Options" content="DENY">',
      '<meta http-equiv="X-XSS-Protection" content="1; mode=block">',
      '<meta name="referrer" content="no-referrer-when-downgrade">',
      '<meta name="format-detection" content="telephone=no">',
      '<link rel="dns-prefetch" href="//fonts.googleapis.com">',
      '<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>'
    ];
  }

  /**
   * Save meta tags to an HTML file
   */
  async saveToFile(outputDir: string, filename: string = 'meta-tags.html'): Promise<void> {
    const metaTags = this.generateMetaTags();
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
${metaTags.map(tag => tag.startsWith('<!--') || tag === '' ? tag : `  ${tag}`).join('\n')}
</head>
<body>
  <!-- Copy the meta tags above into your HTML head section -->
</body>
</html>`;

    const filePath = path.join(outputDir, filename);
    await fs.writeFile(filePath, htmlContent, 'utf8');
    try {
      // Dynamically import to avoid circular deps in core
      const { emitProgress } = await import('./progress-events');
      emitProgress(filePath);
    } catch {
      // Best-effort emit
    }
  }
}
