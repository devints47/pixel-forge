import { BaseOpenGraphGenerator, type BaseOpenGraphOptions } from './base-opengraph';
import { ImageSizes } from '../../core/image-processor';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface StandardOpenGraphOptions extends Omit<BaseOpenGraphOptions, 'filename'> {
  // Platform selection options - all enabled by default
  includeFacebook?: boolean;
  includeBluesky?: boolean;
  includeMastodon?: boolean;
  includeiMessage?: boolean;
  includeDiscord?: boolean;
  includeTelegram?: boolean;
  includeSignal?: boolean;
  includeSlack?: boolean;
  includeAndroidRCS?: boolean;
}

/**
 * Standard OpenGraph generator for platforms that use the standard 1200x630 dimensions.
 * This consolidates 9 individual generators that all produce identical dimensions
 * but with different filenames for platform-specific sharing.
 * 
 * Platforms supported:
 * - Facebook (standard format)
 * - Bluesky  
 * - Mastodon
 * - iMessage
 * - Discord
 * - Telegram
 * - Signal
 * - Slack
 * - Android RCS
 */
export class StandardOpenGraphGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate standard OpenGraph images for multiple platforms
   */
  async generate(options: StandardOpenGraphOptions = {}): Promise<void> {
    const { 
      title,
      description,
      template = 'basic',
      includeFacebook = true,
      includeBluesky = true,
      includeMastodon = true,
      includeiMessage = true,
      includeDiscord = true,
      includeTelegram = true,
      includeSignal = true,
      includeSlack = true,
      includeAndroidRCS = true
    } = options;

    // Reset generated files list
    this.generatedFiles = [];

    // Standard OpenGraph dimensions (1200x630)
    const width = ImageSizes.social.standard.width;
    const height = ImageSizes.social.standard.height;

    // Generate for each selected platform
    if (includeFacebook) {
      await super.generate({
        title,
        description,
        template,
        filename: 'facebook-og.png',
        width,
        height
      });
    }

    if (includeBluesky) {
      await super.generate({
        title,
        description,
        template,
        filename: 'bluesky.png',
        width,
        height
      });
    }

    if (includeMastodon) {
      await super.generate({
        title,
        description,
        template,
        filename: 'mastodon.png',
        width,
        height
      });
    }

    if (includeiMessage) {
      await super.generate({
        title,
        description,
        template,
        filename: 'imessage.png',
        width,
        height
      });
    }

    if (includeDiscord) {
      await super.generate({
        title,
        description,
        template,
        filename: 'discord.png',
        width,
        height
      });
    }

    if (includeTelegram) {
      await super.generate({
        title,
        description,
        template,
        filename: 'telegram.png',
        width,
        height
      });
    }

    if (includeSignal) {
      await super.generate({
        title,
        description,
        template,
        filename: 'signal.png',
        width,
        height
      });
    }

    if (includeSlack) {
      await super.generate({
        title,
        description,
        template,
        filename: 'slack.png',
        width,
        height
      });
    }

    if (includeAndroidRCS) {
      await super.generate({
        title,
        description,
        template,
        filename: 'android-rcs.png',
        width,
        height
      });
    }
  }

  /**
   * Get HTML meta tags for all generated platforms
   */
  getMetaTags(): string[] {
    const allTags: string[] = [];
    
    // Add meta tags for each generated file
    this.generatedFiles.forEach(filename => {
      allTags.push(...super.getMetaTags(filename, 
        ImageSizes.social.standard.width, 
        ImageSizes.social.standard.height));
    });
    
    return allTags;
  }

  /**
   * Get Next.js metadata configuration (uses first generated file as primary)
   */
  getNextMetadata() {
    const primaryFilename = this.generatedFiles[0] || 'og-image.png';
    return super.getNextMetadata(primaryFilename,
      ImageSizes.social.standard.width,
      ImageSizes.social.standard.height);
  }

  /**
   * Generate a single platform file (utility method for individual platform flags)
   */
  async generateSingle(platform: string, options: Omit<StandardOpenGraphOptions, keyof {[K in keyof StandardOpenGraphOptions]: K extends `include${string}` ? K : never}> = {}): Promise<void> {
    const platformConfig = {
      includeFacebook: platform === 'facebook',
      includeBluesky: platform === 'bluesky',
      includeMastodon: platform === 'mastodon',
      includeiMessage: platform === 'imessage',
      includeDiscord: platform === 'discord',
      includeTelegram: platform === 'telegram',
      includeSignal: platform === 'signal',
      includeSlack: platform === 'slack',
      includeAndroidRCS: platform === 'android-rcs'
    };

    await this.generate({
      ...options,
      ...platformConfig
    });
  }
}
