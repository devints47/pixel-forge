import { BaseOpenGraphGenerator } from './base-opengraph';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface TikTokOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
}

export class TikTokGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate TikTok OpenGraph image for website sharing
   */
  async generate(options: TikTokOptions = {}): Promise<void> {
    const { title, description, template = 'basic' } = options;

    // Generate single OpenGraph image that appears when websites are shared on TikTok
    await super.generate({
      title,
      description,
      template,
      filename: 'tiktok.png'
    });
  }

  /**
   * Get HTML meta tags for TikTok
   */
  getMetaTags(): string[] {
    return super.getMetaTags('tiktok.png');
  }

  /**
   * Get Next.js metadata configuration for TikTok
   */
  getNextMetadata() {
    return super.getNextMetadata('tiktok.png');
  }
}