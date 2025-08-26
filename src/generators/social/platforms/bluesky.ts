import { BaseOpenGraphGenerator, type BaseOpenGraphOptions } from '../base-opengraph';
import { ImageSizes } from '../../../core/image-processor';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface BlueskyOptions extends Omit<BaseOpenGraphOptions, 'filename'> {}

/**
 * Bluesky generator for decentralized social network sharing
 * Generates standard OpenGraph format for Bluesky link previews
 */
export class BlueskyGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate Bluesky-optimized image
   */
  async generate(options: BlueskyOptions = {}): Promise<void> {
    const { 
      title,
      description,
      template = 'basic'
    } = options;

    // Reset generated files list
    this.generatedFiles = [];

    await super.generate({
      title,
      description,
      template,
      filename: 'bluesky.png',
      width: ImageSizes.social.bluesky.width,   // 1200
      height: ImageSizes.social.bluesky.height  // 630
    });
  }

  /**
   * Get HTML meta tags for Bluesky
   */
  getMetaTags(): string[] {
    return super.getMetaTags('bluesky.png', 
      ImageSizes.social.bluesky.width, 
      ImageSizes.social.bluesky.height);
  }

  /**
   * Get Next.js metadata configuration for Bluesky
   */
  getNextMetadata() {
    return super.getNextMetadata('bluesky.png',
      ImageSizes.social.bluesky.width,
      ImageSizes.social.bluesky.height);
  }
}
