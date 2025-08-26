import { BaseOpenGraphGenerator } from '../base-opengraph';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface DiscordOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
}

/**
 * Discord generator for website sharing embeds
 * Discord uses standard OpenGraph images (1200x630) for link embeds
 */
export class DiscordGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate Discord OpenGraph image for website sharing
   */
  async generate(options: DiscordOptions = {}): Promise<void> {
    const { title, description, template = 'basic' } = options;

    // Generate single OpenGraph image that appears when websites are shared on Discord
    await super.generate({
      title,
      description,
      template,
      filename: 'discord.png'
    });
  }

  /**
   * Get HTML meta tags for Discord
   */
  getMetaTags(): string[] {
    return super.getMetaTags('discord.png');
  }

  /**
   * Get Next.js metadata configuration for Discord
   */
  getNextMetadata() {
    return super.getNextMetadata('discord.png');
  }
}
