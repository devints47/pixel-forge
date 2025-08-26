// Platform-specific social media generators
// These generators handle platforms that have unique dimensions or special requirements

export { FacebookGenerator, type FacebookOptions } from './facebook';
export { TwitterGenerator, type TwitterOptions } from './twitter';
export { LinkedInGenerator, type LinkedInOptions } from './linkedin';
export { InstagramGenerator, type InstagramOptions } from './instagram';
export { TikTokGenerator, type TikTokOptions } from './tiktok';
export { YouTubeGenerator, type YouTubeOptions } from './youtube';
export { PinterestGenerator, type PinterestOptions } from './pinterest';
export { SnapchatGenerator, type SnapchatOptions } from './snapchat';
export { ThreadsGenerator, type ThreadsOptions } from './threads';
export { BlueskyGenerator, type BlueskyOptions } from './bluesky';
export { MastodonGenerator, type MastodonOptions } from './mastodon';
export { WhatsAppGenerator, type WhatsAppOptions } from './whatsapp';

import type { PixelForgeConfig } from '../../../core/config-validator';
import { FacebookGenerator } from './facebook';
import { TwitterGenerator } from './twitter';
import { LinkedInGenerator } from './linkedin';
import { InstagramGenerator } from './instagram';
import { TikTokGenerator } from './tiktok';
import { YouTubeGenerator } from './youtube';
import { PinterestGenerator } from './pinterest';
import { SnapchatGenerator } from './snapchat';
import { ThreadsGenerator } from './threads';
import { BlueskyGenerator } from './bluesky';
import { MastodonGenerator } from './mastodon';
import { WhatsAppGenerator } from './whatsapp';

export interface GeneratorInfo {
  name: string;
  generator: any;
  files: string[];
}

export interface PlatformOptions {
  facebook?: boolean;
  twitter?: boolean;
  linkedin?: boolean;
  instagram?: boolean;
  tiktok?: boolean;
  youtube?: boolean;
  pinterest?: boolean;
  snapchat?: boolean;
  threads?: boolean;
  bluesky?: boolean;
  mastodon?: boolean;
  whatsapp?: boolean;
}

/**
 * Factory function to generate platform-specific social media assets
 * Eliminates repetitive if-statement logic from CLI
 */
export async function generatePlatforms(
  sourceImage: string,
  config: PixelForgeConfig,
  options: PlatformOptions
): Promise<GeneratorInfo[]> {
  const generators: GeneratorInfo[] = [];

  if (options.facebook) {
    const generator = new FacebookGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'Facebook', generator, files: generator.getGeneratedFiles() });
  }

  if (options.twitter) {
    const generator = new TwitterGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'Twitter', generator, files: generator.getGeneratedFiles() });
  }

  if (options.linkedin) {
    const generator = new LinkedInGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'LinkedIn', generator, files: generator.getGeneratedFiles() });
  }

  if (options.instagram) {
    const generator = new InstagramGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'Instagram', generator, files: generator.getGeneratedFiles() });
  }

  if (options.tiktok) {
    const generator = new TikTokGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'TikTok', generator, files: generator.getGeneratedFiles() });
  }

  if (options.youtube) {
    const generator = new YouTubeGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'YouTube', generator, files: generator.getGeneratedFiles() });
  }

  if (options.pinterest) {
    const generator = new PinterestGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'Pinterest', generator, files: generator.getGeneratedFiles() });
  }

  if (options.snapchat) {
    const generator = new SnapchatGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'Snapchat', generator, files: generator.getGeneratedFiles() });
  }

  if (options.threads) {
    const generator = new ThreadsGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'Threads', generator, files: generator.getGeneratedFiles() });
  }

  if (options.bluesky) {
    const generator = new BlueskyGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'Bluesky', generator, files: generator.getGeneratedFiles() });
  }

  if (options.mastodon) {
    const generator = new MastodonGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'Mastodon', generator, files: generator.getGeneratedFiles() });
  }

  if (options.whatsapp) {
    const generator = new WhatsAppGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'WhatsApp', generator, files: generator.getGeneratedFiles() });
  }

  return generators;
}
