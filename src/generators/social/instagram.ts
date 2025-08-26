import { BaseOpenGraphGenerator } from './base-opengraph';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface InstagramOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
}

export class InstagramGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate Instagram OpenGraph image for website sharing
   */
  async generate(options: InstagramOptions = {}): Promise<void> {
    const { title, description, template = 'basic' } = options;

    // Generate single OpenGraph image that appears when websites are shared on Instagram
    await super.generate({
      title,
      description,
      template,
      filename: 'instagram.png'
    });
  }

  /**
   * Get HTML meta tags for Instagram
   */
  getMetaTags(): string[] {
    return super.getMetaTags('instagram.png');
  }

  /**
   * Get Next.js metadata configuration for Instagram
   */
  getNextMetadata() {
    return super.getNextMetadata('instagram.png');
  }
}