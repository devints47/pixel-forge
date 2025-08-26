import { BaseOpenGraphGenerator } from '../base-opengraph';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface SignalOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
}

/**
 * Signal generator for website sharing previews
 * Signal uses standard OpenGraph images (1200x630) for link previews
 */
export class SignalGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate Signal OpenGraph image for website sharing
   */
  async generate(options: SignalOptions = {}): Promise<void> {
    const { title, description, template = 'basic' } = options;

    // Generate single OpenGraph image that appears when websites are shared on Signal
    await super.generate({
      title,
      description,
      template,
      filename: 'signal.png'
    });
  }

  /**
   * Get HTML meta tags for Signal
   */
  getMetaTags(): string[] {
    return super.getMetaTags('signal.png');
  }

  /**
   * Get Next.js metadata configuration for Signal
   */
  getNextMetadata() {
    return super.getNextMetadata('signal.png');
  }
}
