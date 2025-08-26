import { BaseOpenGraphGenerator, type BaseOpenGraphOptions } from '../base-opengraph';
import { ImageSizes } from '../../../core/image-processor';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface MastodonOptions extends Omit<BaseOpenGraphOptions, 'filename'> {}

/**
 * Mastodon generator for federated social media sharing
 * Generates standard OpenGraph format for Mastodon link previews
 */
export class MastodonGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate Mastodon-optimized image
   */
  async generate(options: MastodonOptions = {}): Promise<void> {
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
      filename: 'mastodon.png',
      width: ImageSizes.social.mastodon.width,   // 1200
      height: ImageSizes.social.mastodon.height  // 630
    });
  }

  /**
   * Get HTML meta tags for Mastodon
   */
  getMetaTags(): string[] {
    return super.getMetaTags('mastodon.png', 
      ImageSizes.social.mastodon.width, 
      ImageSizes.social.mastodon.height);
  }

  /**
   * Get Next.js metadata configuration for Mastodon
   */
  getNextMetadata() {
    return super.getNextMetadata('mastodon.png',
      ImageSizes.social.mastodon.width,
      ImageSizes.social.mastodon.height);
  }
}
