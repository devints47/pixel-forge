import { BaseOpenGraphGenerator } from '../base-opengraph';
import { ImageSizes } from '../../../core/image-processor';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface TwitterOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  cardType?: 'summary_large_image' | 'summary';
  includeStandard?: boolean;
  includeSquare?: boolean;
}

export class TwitterGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
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
      await super.generate({
        title,
        description,
        template,
        filename: 'twitter-card.png',
        width: ImageSizes.social.twitter.width,   // 1200
        height: ImageSizes.social.twitter.height  // 600
      });
    }

    if (includeSquare) {
      await super.generate({
        title,
        description,
        template,
        filename: 'twitter-square.png',
        width: 1200,
        height: 1200
      });
    }
  }





  /**
   * Get HTML meta tags for Twitter
   */
  getMetaTags(): string[] {
    const prefix = this.config.output.prefix || '/';
    
    return [
      ...super.getMetaTags('twitter-card.png', ImageSizes.social.twitter.width, ImageSizes.social.twitter.height),
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:image" content="${prefix}twitter-card.png">`,
      `<meta name="twitter:image:alt" content="${this.config.appName}">`
    ];
  }

  /**
   * Get Next.js metadata configuration for Twitter
   */
  getNextMetadata() {
    const prefix = this.config.output.prefix || '/';
    
    return {
      ...super.getNextMetadata('twitter-card.png', ImageSizes.social.twitter.width, ImageSizes.social.twitter.height),
      twitter: {
        card: 'summary_large_image',
        images: [`${prefix}twitter-card.png`],
      }
    };
  }
} 