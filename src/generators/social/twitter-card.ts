import { BaseOpenGraphGenerator, type BaseOpenGraphOptions } from './base-opengraph';
import { ImageSizes } from '../../core/image-processor';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface TwitterCardOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
}

/**
 * Twitter Card generator that creates images optimized for Twitter's
 * specific OpenGraph requirements (1200x600)
 */
export class TwitterCardGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate Twitter Card image
   */
  async generate(options: TwitterCardOptions = {}): Promise<void> {
    const { title, description, template = 'basic' } = options;

    const baseOptions: BaseOpenGraphOptions = {
      title,
      description,
      template,
      filename: 'twitter.png',
      width: ImageSizes.social.twitter.width,   // 1200
      height: ImageSizes.social.twitter.height  // 600
    };

    await super.generate(baseOptions);
  }

  /**
   * Get HTML meta tags for Twitter Card
   */
  getMetaTags(): string[] {
    const prefix = this.config.output.prefix || '/';
    const { width, height } = ImageSizes.social.twitter;
    
    return [
      ...super.getMetaTags('twitter.png', width, height),
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:image" content="${prefix}twitter.png">`,
      `<meta name="twitter:image:alt" content="${this.config.appName}">`
    ];
  }

  /**
   * Get Next.js metadata configuration for Twitter
   */
  getNextMetadata() {
    const prefix = this.config.output.prefix || '/';
    const { width, height } = ImageSizes.social.twitter;
    
    return {
      ...super.getNextMetadata('twitter.png', width, height),
      twitter: {
        card: 'summary_large_image',
        images: [`${prefix}twitter.png`],
      }
    };
  }
}
