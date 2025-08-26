import path from 'path';
import { ImageProcessor, ImageSizes } from '../../core/image-processor';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface WebSEOOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  includeOpenGraph?: boolean;
  includeTwitter?: boolean;
  includeGeneric?: boolean;
  outputFormat?: 'png' | 'jpeg' | 'both';
}

export class WebSEOGenerator {
  private config: PixelForgeConfig;
  private sourceImage: string;

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.config = config;
    this.sourceImage = sourceImage;
  }

  /**
   * Generate essential SEO images for web applications
   */
  async generate(options: WebSEOOptions = {}): Promise<void> {
    const {
      title = this.config.socialPreview?.title || this.config.appName,
      description = this.config.socialPreview?.description || this.config.description || '',
      template = this.config.socialPreview?.template || 'basic',
      includeOpenGraph = true,
      includeTwitter = true,
      includeGeneric = true,
      outputFormat = 'both'
    } = options;

    // Generate generic OpenGraph image (works everywhere)
    if (includeGeneric) {
      await this.generateGenericOpenGraph({ title, description, template, outputFormat });
    }

    // Generate specific OpenGraph image
    if (includeOpenGraph) {
      await this.generateOpenGraphImage({ title, description, template, outputFormat });
    }

    // Generate Twitter card image
    if (includeTwitter) {
      await this.generateTwitterCardImage({ title, description, template, outputFormat });
    }
  }

  /**
   * Generate generic og-image that works across all platforms
   */
  private async generateGenericOpenGraph(options: {
    title: string;
    description: string;
    template: string;
    outputFormat: string;
  }): Promise<void> {
    const { title, description, template, outputFormat } = options;
    const { width, height } = ImageSizes.social.standard;

    const processor = new ImageProcessor(this.sourceImage);
    
    // Create social preview with template
    await processor.createSocialPreview({
      width,
      height,
      title,
      description,
      template: template as 'basic' | 'gradient' | 'custom',
      background: this.config.backgroundColor
    });

    // Save in requested format(s)
    if (outputFormat === 'png' || outputFormat === 'both') {
      const outputPath = path.join(this.config.output.path, 'og-image.png');
      await processor.save(outputPath, { format: 'png', quality: this.config.output.quality });
    }

    if (outputFormat === 'jpeg' || outputFormat === 'both') {
      const outputPath = path.join(this.config.output.path, 'og-image.jpg');
      await processor.save(outputPath, { format: 'jpeg', quality: this.config.output.quality });
    }
  }

  /**
   * Generate OpenGraph-specific image
   */
  private async generateOpenGraphImage(options: {
    title: string;
    description: string;
    template: string;
    outputFormat: string;
  }): Promise<void> {
    const { title, description, template, outputFormat } = options;
    const { width, height } = ImageSizes.social.facebook; // Use Facebook dimensions for OpenGraph

    const processor = new ImageProcessor(this.sourceImage);
    
    await processor.createSocialPreview({
      width,
      height,
      title,
      description,
      template: template as 'basic' | 'gradient' | 'custom',
      background: this.config.backgroundColor
    });

    // Save in requested format(s)
    if (outputFormat === 'png' || outputFormat === 'both') {
      const outputPath = path.join(this.config.output.path, 'opengraph.png');
      await processor.save(outputPath, { format: 'png', quality: this.config.output.quality });
    }

    if (outputFormat === 'jpeg' || outputFormat === 'both') {
      const outputPath = path.join(this.config.output.path, 'opengraph.jpg');
      await processor.save(outputPath, { format: 'jpeg', quality: this.config.output.quality });
    }
  }

  /**
   * Generate Twitter card image
   */
  private async generateTwitterCardImage(options: {
    title: string;
    description: string;
    template: string;
    outputFormat: string;
  }): Promise<void> {
    const { title, description, template, outputFormat } = options;
    const { width, height } = ImageSizes.social.twitter;

    const processor = new ImageProcessor(this.sourceImage);
    
    await processor.createSocialPreview({
      width,
      height,
      title,
      description,
      template: template as 'basic' | 'gradient' | 'custom',
      background: this.config.backgroundColor
    });

    // Save in requested format(s)
    if (outputFormat === 'png' || outputFormat === 'both') {
      const outputPath = path.join(this.config.output.path, 'twitter-image.png');
      await processor.save(outputPath, { format: 'png', quality: this.config.output.quality });
    }

    if (outputFormat === 'jpeg' || outputFormat === 'both') {
      const outputPath = path.join(this.config.output.path, 'twitter-image.jpg');
      await processor.save(outputPath, { format: 'jpeg', quality: this.config.output.quality });
    }
  }

  /**
   * Get HTML meta tags for SEO images
   */
  getMetaTags(options: { format?: 'png' | 'jpeg' } = {}): string[] {
    const { format = 'png' } = options;
    const { prefix = '/' } = this.config.output;
    const extension = format === 'jpeg' ? 'jpg' : 'png';

    return [
      // Generic OpenGraph (works for Facebook, LinkedIn, most platforms)
      `<meta property="og:image" content="${prefix}og-image.${extension}" />`,
      `<meta property="og:image:width" content="${ImageSizes.social.standard.width}" />`,
      `<meta property="og:image:height" content="${ImageSizes.social.standard.height}" />`,
      `<meta property="og:image:type" content="image/${format === 'jpeg' ? 'jpeg' : 'png'}" />`,
      `<meta property="og:title" content="${this.config.appName}" />`,
      `<meta property="og:description" content="${this.config.description || ''}" />`,
      `<meta property="og:type" content="website" />`,
      
      // Twitter Card
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:image" content="${prefix}twitter-image.${extension}" />`,
      `<meta name="twitter:title" content="${this.config.appName}" />`,
      `<meta name="twitter:description" content="${this.config.description || ''}" />`,
      
      // Additional SEO
      `<meta name="description" content="${this.config.description || ''}" />`,
      `<meta name="keywords" content="${this.config.appName}" />`,
      `<meta name="author" content="${this.config.appName}" />`,
    ];
  }

  /**
   * Get Next.js metadata configuration
   */
  getNextMetadata(options: { format?: 'png' | 'jpeg' } = {}) {
    const { format = 'png' } = options;
    const { prefix = '/' } = this.config.output;
    const extension = format === 'jpeg' ? 'jpg' : 'png';

    return {
      title: this.config.appName,
      description: this.config.description,
      openGraph: {
        title: this.config.appName,
        description: this.config.description,
        type: 'website',
        images: [
          {
            url: `${prefix}og-image.${extension}`,
            width: ImageSizes.social.standard.width,
            height: ImageSizes.social.standard.height,
            alt: this.config.appName,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: this.config.appName,
        description: this.config.description,
        images: [`${prefix}twitter-image.${extension}`],
      },
    };
  }

  /**
   * Get list of generated files
   */
  getGeneratedFiles(options: { format?: 'png' | 'jpeg' | 'both' } = {}): string[] {
    const { format = 'both' } = options;
    const files: string[] = [];

    if (format === 'png' || format === 'both') {
      files.push('og-image.png', 'opengraph.png', 'twitter-image.png');
    }

    if (format === 'jpeg' || format === 'both') {
      files.push('og-image.jpg', 'opengraph.jpg', 'twitter-image.jpg');
    }

    return files;
  }
} 