import path from 'path';
import { ImageProcessor, ImageSizes } from '../../core/image-processor';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface TwitterOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  cardType?: 'summary_large_image' | 'summary';
  includeStandard?: boolean;
  includeSquare?: boolean;
}

export class TwitterGenerator {
  private config: PixelForgeConfig;
  private sourceImage: string;
  private generatedFiles: string[] = [];

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.config = config;
    this.sourceImage = sourceImage;
  }

  /**
   * Generate Twitter-optimized images
   */
  async generate(options: TwitterOptions = {}): Promise<void> {
    const { 
      includeStandard = true, 
      includeSquare = false,
      title,
      description,
      template = 'basic'
    } = options;

    // Reset generated files list
    this.generatedFiles = [];

    if (includeStandard) {
      await this.generateStandardImage(title, description, template);
      this.generatedFiles.push('twitter-card.png');
    }

    if (includeSquare) {
      await this.generateSquareImage(title, description, template);
      this.generatedFiles.push('twitter-square.png');
    }
  }

  /**
   * Generate standard Twitter image (1200x675)
   */
  private async generateStandardImage(title?: string, description?: string, template?: 'basic' | 'gradient' | 'custom'): Promise<void> {
    const processor = new ImageProcessor(this.sourceImage);
    const outputPath = path.join(this.config.output.path, 'twitter-card.png');

    const socialFile = await processor.createSocialPreview({
      width: ImageSizes.social.twitter.width,
      height: ImageSizes.social.twitter.height,
      title,
      description,
      template,
      background: this.config.backgroundColor
    });
    
    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath);
    await processor.cleanup();
  }

  /**
   * Generate square Twitter image (1200x1200)
   */
  private async generateSquareImage(title?: string, description?: string, template?: 'basic' | 'gradient' | 'custom'): Promise<void> {
    const processor = new ImageProcessor(this.sourceImage);
    const outputPath = path.join(this.config.output.path, 'twitter-square.png');

    const socialFile = await processor.createSocialPreview({
      width: ImageSizes.social.twitterSquare.width,
      height: ImageSizes.social.twitterSquare.height,
      title,
      description,
      template,
      background: this.config.backgroundColor
    });
    
    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath);
    await processor.cleanup();
  }

  /**
   * Get HTML meta tags for Twitter
   */
  getMetaTags(cardType: 'summary_large_image' | 'summary' = 'summary_large_image'): string[] {
    const prefix = this.config.output.prefix || '/';
    const image = cardType === 'summary' ? 'twitter-square.png' : 'twitter.png';
    const size = cardType === 'summary' ? ImageSizes.social.twitterSquare : ImageSizes.social.twitter;
    
    return [
      `<meta name="twitter:card" content="${cardType}">`,
      `<meta name="twitter:image" content="${prefix}${image}">`,
      `<meta name="twitter:image:width" content="${size.width}">`,
      `<meta name="twitter:image:height" content="${size.height}">`,
      `<meta name="twitter:title" content="${this.config.appName}">`,
      `<meta name="twitter:description" content="${this.config.description || ''}">`,
      `<meta name="twitter:site" content="">`, // Can be configured later
      `<meta name="twitter:creator" content="">`, // Can be configured later
    ];
  }

  /**
   * Get Next.js metadata configuration for Twitter
   */
  getNextMetadata(cardType: 'summary_large_image' | 'summary' = 'summary_large_image') {
    const prefix = this.config.output.prefix || '/';
    const image = cardType === 'summary' ? 'twitter-square.png' : 'twitter.png';
    const size = cardType === 'summary' ? ImageSizes.social.twitterSquare : ImageSizes.social.twitter;
    
    return {
      twitter: {
        card: cardType,
        title: this.config.appName,
        description: this.config.description,
        images: [
          {
            url: `${prefix}${image}`,
            width: size.width,
            height: size.height,
            alt: this.config.appName,
          }
        ],
      },
    };
  }

  /**
   * Get list of generated files
   */
  getGeneratedFiles(): string[] {
    return [...this.generatedFiles];
  }
} 