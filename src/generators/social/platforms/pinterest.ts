import { BaseOpenGraphGenerator, type BaseOpenGraphOptions } from '../base-opengraph';
import { ImageSizes } from '../../../core/image-processor';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface PinterestOptions extends Omit<BaseOpenGraphOptions, 'filename'> {
  includePin?: boolean;
  includeSquare?: boolean;
}

/**
 * Pinterest generator for pin and board sharing
 * Generates pin format (portrait) and square format images
 */
export class PinterestGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate Pinterest-optimized images
   */
  async generate(options: PinterestOptions = {}): Promise<void> {
    const { 
      includePin = true,
      includeSquare = true,
      title,
      description,
      template = 'basic'
    } = options;

    // Reset generated files list
    this.generatedFiles = [];

    if (includePin) {
      await super.generate({
        title,
        description,
        template,
        filename: 'pinterest-pin.png',
        width: ImageSizes.social.pinterestPin.width,   // 1000
        height: ImageSizes.social.pinterestPin.height  // 1500
      });
    }

    if (includeSquare) {
      await super.generate({
        title,
        description,
        template,
        filename: 'pinterest-square.png',
        width: ImageSizes.social.pinterestSquare.width,   // 1000
        height: ImageSizes.social.pinterestSquare.height  // 1000
      });
    }
  }

  /**
   * Get HTML meta tags for Pinterest
   */
  getMetaTags(): string[] {
    const tags: string[] = [];
    
    if (this.generatedFiles.includes('pinterest-pin.png')) {
      tags.push(...super.getMetaTags('pinterest-pin.png', 
        ImageSizes.social.pinterestPin.width, 
        ImageSizes.social.pinterestPin.height));
    }
    
    return tags;
  }

  /**
   * Get Next.js metadata configuration for Pinterest
   */
  getNextMetadata() {
    if (this.generatedFiles.includes('pinterest-pin.png')) {
      return super.getNextMetadata('pinterest-pin.png',
        ImageSizes.social.pinterestPin.width,
        ImageSizes.social.pinterestPin.height);
    }
    
    // Return standard OpenGraph format as fallback
    return super.getNextMetadata('pinterest-pin.png',
      ImageSizes.social.pinterestPin.width,
      ImageSizes.social.pinterestPin.height);
  }
}
