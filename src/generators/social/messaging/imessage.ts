import { BaseOpenGraphGenerator, type BaseOpenGraphOptions } from '../base-opengraph';
import { ImageSizes } from '../../../core/image-processor';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface iMessageOptions extends Omit<BaseOpenGraphOptions, 'filename'> {}

/**
 * iMessage generator for iOS sharing
 * Generates standard OpenGraph format for iMessage link previews
 */
export class iMessageGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate iMessage-optimized image
   */
  async generate(options: iMessageOptions = {}): Promise<void> {
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
      filename: 'imessage.png',
      width: ImageSizes.messaging.imessage.width,   // 1200
      height: ImageSizes.messaging.imessage.height  // 630
    });
  }

  /**
   * Get HTML meta tags for iMessage
   */
  getMetaTags(): string[] {
    return super.getMetaTags('imessage.png', 
      ImageSizes.messaging.imessage.width, 
      ImageSizes.messaging.imessage.height);
  }

  /**
   * Get Next.js metadata configuration for iMessage
   */
  getNextMetadata() {
    return super.getNextMetadata('imessage.png',
      ImageSizes.messaging.imessage.width,
      ImageSizes.messaging.imessage.height);
  }
}
