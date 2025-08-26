import { BaseOpenGraphGenerator } from './base-opengraph';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface SlackOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
}

/**
 * Slack generator for website sharing unfurls
 * Slack uses standard OpenGraph images (1200x630) for link unfurls
 */
export class SlackGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate Slack OpenGraph image for website sharing
   */
  async generate(options: SlackOptions = {}): Promise<void> {
    const { title, description, template = 'basic' } = options;

    // Generate single OpenGraph image that appears when websites are shared on Slack
    await super.generate({
      title,
      description,
      template,
      filename: 'slack.png'
    });
  }

  /**
   * Get HTML meta tags for Slack
   */
  getMetaTags(): string[] {
    return super.getMetaTags('slack.png');
  }

  /**
   * Get Next.js metadata configuration for Slack
   */
  getNextMetadata() {
    return super.getNextMetadata('slack.png');
  }
}
