import { BaseOpenGraphGenerator, type BaseOpenGraphOptions } from './base-opengraph';
import { ImageSizes } from '../../core/image-processor';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface SquareOpenGraphOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  filename?: string; // Allow custom filename for different platforms
}

/**
 * Square OpenGraph generator that creates square images (1200x1200)
 * for platforms that prefer square format previews like Threads
 */
export class SquareOpenGraphGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate Square OpenGraph image
   */
  async generate(options: SquareOpenGraphOptions = {}): Promise<void> {
    const { title, description, template = 'basic', filename = 'square-opengraph.png' } = options;

    const baseOptions: BaseOpenGraphOptions = {
      title,
      description,
      template,
      filename,
      width: ImageSizes.social.threads.width,   // 1080 -> let's update to 1200
      height: ImageSizes.social.threads.height  // 1080 -> let's update to 1200
    };

    // Override with 1200x1200 for better quality
    baseOptions.width = 1200;
    baseOptions.height = 1200;

    await super.generate(baseOptions);
  }

  /**
   * Get HTML meta tags for Square OpenGraph
   */
  getMetaTags(filename: string = 'square-opengraph.png'): string[] {
    return super.getMetaTags(filename, 1200, 1200);
  }

  /**
   * Get Next.js metadata configuration for Square OpenGraph
   */
  getNextMetadata(filename: string = 'square-opengraph.png') {
    return super.getNextMetadata(filename, 1200, 1200);
  }
}
