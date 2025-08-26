import { BaseOpenGraphGenerator, type BaseOpenGraphOptions } from './base-opengraph';
import { ImageSizes } from '../../core/image-processor';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface LinkedInShareOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
}

/**
 * LinkedIn Share generator that creates images optimized for LinkedIn's
 * specific OpenGraph requirements (1200x627)
 */
export class LinkedInShareGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate LinkedIn Share image
   */
  async generate(options: LinkedInShareOptions = {}): Promise<void> {
    const { title, description, template = 'basic' } = options;

    const baseOptions: BaseOpenGraphOptions = {
      title,
      description,
      template,
      filename: 'linkedin.png',
      width: ImageSizes.social.linkedin.width,   // 1200
      height: ImageSizes.social.linkedin.height  // 627
    };

    await super.generate(baseOptions);
  }

  /**
   * Get HTML meta tags for LinkedIn
   */
  getMetaTags(): string[] {
    const { width, height } = ImageSizes.social.linkedin;
    return super.getMetaTags('linkedin.png', width, height);
  }

  /**
   * Get Next.js metadata configuration for LinkedIn
   */
  getNextMetadata() {
    const { width, height } = ImageSizes.social.linkedin;
    return super.getNextMetadata('linkedin.png', width, height);
  }
}
