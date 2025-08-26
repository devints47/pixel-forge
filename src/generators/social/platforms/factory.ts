import { PlatformGenerator } from '../platforms';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface SocialGeneratorResult {
  name: string;
  files: string[];
}

export interface PlatformFactoryOptions {
  facebook?: boolean;
  twitter?: boolean;
  linkedin?: boolean;
  instagram?: boolean;
  tiktok?: boolean;
  snapchat?: boolean;
  threads?: boolean;
  whatsapp?: boolean;
  youtube?: boolean;
  pinterest?: boolean;
  bluesky?: boolean;
  mastodon?: boolean;
}

/**
 * Factory function for generating platform-specific social media assets
 */
export async function generatePlatforms(
  sourceImage: string,
  config: PixelForgeConfig,
  options: PlatformFactoryOptions
): Promise<SocialGeneratorResult[]> {
  const results: SocialGeneratorResult[] = [];

  // Only generate for platforms that have unique dimensions
  const generator = new PlatformGenerator(sourceImage, config);

  if (options.twitter) {
    await generator.generate({
      includeTikTok: false,
      includeYouTube: false,
      includePinterest: false,
      includeSnapchat: false,
      includeThreads: false,
      includeBluesky: false,
      includeMastodon: false
    });
    results.push({
      name: 'Twitter',
      files: ['twitter-card.png']
    });
  }

  if (options.linkedin) {
    await generator.generate({
      includeTikTok: false,
      includeYouTube: false,
      includePinterest: false,
      includeSnapchat: false,
      includeThreads: false,
      includeBluesky: false,
      includeMastodon: false
    });
    results.push({
      name: 'LinkedIn',
      files: ['linkedin-share.png']
    });
  }

  if (options.instagram) {
    await generator.generate({
      includeTikTok: false,
      includeYouTube: false,
      includePinterest: false,
      includeSnapchat: false,
      includeThreads: false,
      includeBluesky: false,
      includeMastodon: false
    });
    results.push({
      name: 'Instagram',
      files: ['instagram-square.png', 'instagram-portrait.png']
    });
  }

  if (options.tiktok) {
    await generator.generate({
      includeTikTok: true,
      includeYouTube: false,
      includePinterest: false,
      includeSnapchat: false,
      includeThreads: false,
      includeBluesky: false,
      includeMastodon: false
    });
    results.push({
      name: 'TikTok',
      files: ['tiktok.png']
    });
  }

  if (options.snapchat) {
    await generator.generate({
      includeTikTok: false,
      includeYouTube: false,
      includePinterest: false,
      includeSnapchat: true,
      includeThreads: false,
      includeBluesky: false,
      includeMastodon: false
    });
    results.push({
      name: 'Snapchat',
      files: ['snapchat.png']
    });
  }

  if (options.threads) {
    await generator.generate({
      includeTikTok: false,
      includeYouTube: false,
      includePinterest: false,
      includeSnapchat: false,
      includeThreads: true,
      includeBluesky: false,
      includeMastodon: false
    });
    results.push({
      name: 'Threads',
      files: ['threads.png']
    });
  }

  if (options.youtube) {
    await generator.generate({
      includeTikTok: false,
      includeYouTube: true,
      includePinterest: false,
      includeSnapchat: false,
      includeThreads: false,
      includeBluesky: false,
      includeMastodon: false
    });
    results.push({
      name: 'YouTube',
      files: ['youtube-thumbnail.png', 'youtube-shorts.png']
    });
  }

  if (options.pinterest) {
    await generator.generate({
      includeTikTok: false,
      includeYouTube: false,
      includePinterest: true,
      includeSnapchat: false,
      includeThreads: false,
      includeBluesky: false,
      includeMastodon: false
    });
    results.push({
      name: 'Pinterest',
      files: ['pinterest-pin.png', 'pinterest-square.png']
    });
  }

  if (options.whatsapp) {
    await generator.generate({
      includeTikTok: false,
      includeYouTube: false,
      includePinterest: false,
      includeSnapchat: false,
      includeThreads: false,
      includeBluesky: false,
      includeMastodon: false
    });
    results.push({
      name: 'WhatsApp',
      files: ['whatsapp-profile.png', 'whatsapp-link.png']
    });
  }

  return results;
}
