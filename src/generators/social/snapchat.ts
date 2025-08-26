import { BaseOpenGraphGenerator } from './base-opengraph';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface SnapchatOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
}

export class SnapchatGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate Snapchat OpenGraph image for website sharing
   */
  async generate(options: SnapchatOptions = {}): Promise<void> {
    const { title, description, template = 'basic' } = options;

    // Generate single OpenGraph image that appears when websites are shared on Snapchat
    await super.generate({
      title,
      description,
      template,
      filename: 'snapchat.png'
    });
  }

  /**
   * Get HTML meta tags for Snapchat
   */
  getMetaTags(): string[] {
    return super.getMetaTags('snapchat.png');
  }

  /**
   * Get Next.js metadata configuration for Snapchat
   */
  getNextMetadata() {
    return super.getNextMetadata('snapchat.png');
  }
}