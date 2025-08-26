import { BaseOpenGraphGenerator } from '../base-opengraph';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface TelegramOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
}

/**
 * Telegram generator for website sharing previews
 * Telegram uses standard OpenGraph images (1200x630) for link previews
 */
export class TelegramGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate Telegram OpenGraph image for website sharing
   */
  async generate(options: TelegramOptions = {}): Promise<void> {
    const { title, description, template = 'basic' } = options;

    // Generate single OpenGraph image that appears when websites are shared on Telegram
    await super.generate({
      title,
      description,
      template,
      filename: 'telegram.png'
    });
  }

  /**
   * Get HTML meta tags for Telegram
   */
  getMetaTags(): string[] {
    return super.getMetaTags('telegram.png');
  }

  /**
   * Get Next.js metadata configuration for Telegram
   */
  getNextMetadata() {
    return super.getNextMetadata('telegram.png');
  }
}
