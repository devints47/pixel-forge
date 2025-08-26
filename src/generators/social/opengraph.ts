import path from 'path';
import { ImageProcessor, ImageSizes } from '../../core/image-processor';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface OpenGraphOptions {
  title?: string;
  description?: string;
  imageText?: string;
  template?: 'basic' | 'gradient' | 'custom';
  font?: string;
}

export class OpenGraphGenerator {
  private config: PixelForgeConfig;
  private processor: ImageProcessor;

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.config = config;
    this.processor = new ImageProcessor(sourceImage);
  }

  /**
   * Generate OpenGraph images for various platforms
   */
  async generate(): Promise<void> {
    try {
      const { socialPreview } = this.config;
      const options = socialPreview || {};

      // Generate Facebook/Default OpenGraph Image
      await this.generateFacebookImage(options);

      // Generate LinkedIn Image
      await this.generateLinkedInImage(options);

      // Generate Twitter Card Image
      await this.generateTwitterImage(options);
    } finally {
      // Clean up all temporary files
      await this.processor.cleanup();
    }
  }

  /**
   * Generate Facebook OpenGraph Image
   */
  private async generateFacebookImage(options: OpenGraphOptions): Promise<void> {
    const { width, height } = ImageSizes.social.facebook;
    const outputPath = path.join(this.config.output.path, 'og-facebook.png');

    await this.processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template,
      background: this.config.backgroundColor
    });

    await this.processor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
  }

  /**
   * Generate LinkedIn Image
   */
  private async generateLinkedInImage(options: OpenGraphOptions): Promise<void> {
    const { width, height } = ImageSizes.social.linkedin;
    const outputPath = path.join(this.config.output.path, 'og-linkedin.png');

    await this.processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template,
      background: this.config.backgroundColor
    });

    await this.processor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
  }

  /**
   * Generate Twitter Card Image
   */
  private async generateTwitterImage(options: OpenGraphOptions): Promise<void> {
    const { width, height } = ImageSizes.social.twitter;
    const outputPath = path.join(this.config.output.path, 'twitter-card.png');

    await this.processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template,
      background: this.config.backgroundColor
    });

    await this.processor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
  }

  /**
   * Get HTML meta tags for OpenGraph images
   */
  getMetaTags(): string[] {
    const { prefix = '/' } = this.config.output;
    const tags = [
      // Facebook
      `<meta property="og:image" content="${prefix}og-facebook.png" />`,
      `<meta property="og:image:width" content="${ImageSizes.social.facebook.width}" />`,
      `<meta property="og:image:height" content="${ImageSizes.social.facebook.height}" />`,
      
      // LinkedIn
      `<meta property="og:image" content="${prefix}og-linkedin.png" />`,
      `<meta property="og:image:width" content="${ImageSizes.social.linkedin.width}" />`,
      `<meta property="og:image:height" content="${ImageSizes.social.linkedin.height}" />`,
      
      // Twitter
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:image" content="${prefix}twitter-card.png" />`
    ];

    return tags;
  }

  /**
   * Get Next.js metadata configuration
   */
  getNextMetadata() {
    const { prefix = '/' } = this.config.output;
    return {
      openGraph: {
        images: [
          {
            url: `${prefix}og-facebook.png`,
            width: ImageSizes.social.facebook.width,
            height: ImageSizes.social.facebook.height
          },
          {
            url: `${prefix}og-linkedin.png`,
            width: ImageSizes.social.linkedin.width,
            height: ImageSizes.social.linkedin.height
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        images: [`${prefix}twitter-card.png`]
      }
    };
  }
} 