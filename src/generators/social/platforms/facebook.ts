import { BaseOpenGraphGenerator } from '../base-opengraph';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface FacebookOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  includeStandard?: boolean;
  includeSquare?: boolean;
}

export class FacebookGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate Facebook-optimized images
   */
  async generate(options: FacebookOptions = {}): Promise<void> {
    const { 
      includeStandard = true, 
      includeSquare = false,
      title,
      description,
      template = 'basic'
    } = options;

    // Reset generated files list
    this.generatedFiles = [];

    if (includeStandard) {
      await super.generate({
        title,
        description,
        template,
        filename: 'facebook-og.png'
      });
    }

    if (includeSquare) {
      await super.generate({
        title,
        description,
        template,
        filename: 'facebook-square.png',
        width: 1200,
        height: 1200
      });
    }
  }



  /**
   * Get HTML meta tags for Facebook
   */
  getMetaTags(): string[] {
    return super.getMetaTags('facebook-og.png');
  }

  /**
   * Get Next.js metadata configuration for Facebook
   */
  getNextMetadata() {
    return super.getNextMetadata('facebook-og.png');
  }
} 