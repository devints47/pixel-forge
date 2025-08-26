// Simplified factory function for testing
import type { PixelForgeConfig } from '../../../core/config-validator';

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
  snapchat?: boolean;
  tiktok?: boolean;
  whatsapp?: boolean;
  youtube?: boolean;
  pinterest?: boolean;
  threads?: boolean;
  bluesky?: boolean;
  mastodon?: boolean;
}

/**
 * Simplified factory function to generate platform-specific social media assets
 * This version imports generators dynamically to avoid compilation issues
 * Includes proper cleanup to prevent temp file accumulation
 */
export async function generatePlatforms(
  sourceImage: string,
  config: PixelForgeConfig,
  options: PlatformOptions
): Promise<GeneratorInfo[]> {
  const generators: GeneratorInfo[] = [];

  try {
    // Import generators dynamically to avoid circular dependencies and compilation issues
    const { FacebookGenerator } = await import('./facebook');
    const { TwitterGenerator } = await import('./twitter');
    const { LinkedInGenerator } = await import('./linkedin');
    const { InstagramGenerator } = await import('./instagram');
    const { SnapchatGenerator } = await import('./snapchat');
    const { TikTokGenerator } = await import('./tiktok');
    const { WhatsAppGenerator } = await import('./whatsapp');
    const { YouTubeGenerator } = await import('./youtube');
    const { PinterestGenerator } = await import('./pinterest');
    const { ThreadsGenerator } = await import('./threads');
    const { BlueskyGenerator } = await import('./bluesky');
    const { MastodonGenerator } = await import('./mastodon');

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

    if (options.snapchat) {
      const generator = new SnapchatGenerator(sourceImage, config);
      await generator.generate();
      generators.push({ name: 'Snapchat', generator, files: generator.getGeneratedFiles() });
    }

    if (options.tiktok) {
      const generator = new TikTokGenerator(sourceImage, config);
      await generator.generate();
      generators.push({ name: 'TikTok', generator, files: generator.getGeneratedFiles() });
    }

    if (options.whatsapp) {
      const generator = new WhatsAppGenerator(sourceImage, config);
      await generator.generate();
      generators.push({ name: 'WhatsApp', generator, files: generator.getGeneratedFiles() });
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

    return generators;
  } finally {
    // Force cleanup of any temporary files that might have been created by ImageMagick
    // These appear as temp-* files in the root directory during batch processing
    try {
      const { promises: fs } = await import('fs');
      
      // Clean up temp files that match ImageMagick's pattern
      const files = await fs.readdir(process.cwd());
      const tempFiles = files.filter(file => file.startsWith('temp-'));
      const cleanupPromises = tempFiles.map(file => 
        fs.unlink(file).catch(() => {}) // Ignore errors
      );
      await Promise.allSettled(cleanupPromises);
    } catch (error) {
      // Ignore cleanup errors to prevent breaking the main functionality
    }
  }
}
