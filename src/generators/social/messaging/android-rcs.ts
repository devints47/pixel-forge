import { BaseOpenGraphGenerator, type BaseOpenGraphOptions } from '../base-opengraph';
import { ImageSizes } from '../../../core/image-processor';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface AndroidRCSOptions extends Omit<BaseOpenGraphOptions, 'filename'> {}

/**
 * Android RCS generator for rich messaging
 * Generates standard OpenGraph format for Android RCS message previews
 */
export class AndroidRCSGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate Android RCS-optimized image
   */
  async generate(options: AndroidRCSOptions = {}): Promise<void> {
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
      filename: 'android-rcs.png',
      width: ImageSizes.messaging.androidRcs.width,   // 1200
      height: ImageSizes.messaging.androidRcs.height  // 630
    });
  }

  /**
   * Get HTML meta tags for Android RCS
   */
  getMetaTags(): string[] {
    return super.getMetaTags('android-rcs.png', 
      ImageSizes.messaging.androidRcs.width, 
      ImageSizes.messaging.androidRcs.height);
  }

  /**
   * Get Next.js metadata configuration for Android RCS
   */
  getNextMetadata() {
    return super.getNextMetadata('android-rcs.png',
      ImageSizes.messaging.androidRcs.width,
      ImageSizes.messaging.androidRcs.height);
  }
}
