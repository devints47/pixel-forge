// Simplified factory function for messaging platforms
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface GeneratorInfo {
  name: string;
  generator: any;
  files: string[];
}

export interface MessagingOptions {
  discord?: boolean;
  telegram?: boolean;
  signal?: boolean;
  slack?: boolean;
  imessage?: boolean;
  androidrcs?: boolean;
}

/**
 * Simplified factory function to generate messaging app assets
 * Uses individual generators for now to avoid StandardOpenGraphGenerator complexity
 */
export async function generateMessaging(
  sourceImage: string,
  config: PixelForgeConfig,
  options: MessagingOptions
): Promise<GeneratorInfo[]> {
  const generators: GeneratorInfo[] = [];

  try {
    // Import generators dynamically to avoid compilation issues
    const { DiscordGenerator } = await import('./discord');
    const { TelegramGenerator } = await import('./telegram');
    const { SignalGenerator } = await import('./signal');
    const { SlackGenerator } = await import('./slack');
    const { iMessageGenerator } = await import('./imessage');
    const { AndroidRCSGenerator } = await import('./android-rcs');

    if (options.discord) {
      const generator = new DiscordGenerator(sourceImage, config);
      await generator.generate();
      generators.push({ name: 'Discord', generator, files: generator.getGeneratedFiles() });
    }

    if (options.telegram) {
      const generator = new TelegramGenerator(sourceImage, config);
      await generator.generate();
      generators.push({ name: 'Telegram', generator, files: generator.getGeneratedFiles() });
    }

    if (options.signal) {
      const generator = new SignalGenerator(sourceImage, config);
      await generator.generate();
      generators.push({ name: 'Signal', generator, files: generator.getGeneratedFiles() });
    }

    if (options.slack) {
      const generator = new SlackGenerator(sourceImage, config);
      await generator.generate();
      generators.push({ name: 'Slack', generator, files: generator.getGeneratedFiles() });
    }

    if (options.imessage) {
      const generator = new iMessageGenerator(sourceImage, config);
      await generator.generate();
      generators.push({ name: 'iMessage', generator, files: generator.getGeneratedFiles() });
    }

    if (options.androidrcs) {
      const generator = new AndroidRCSGenerator(sourceImage, config);
      await generator.generate();
      generators.push({ name: 'Android RCS', generator, files: generator.getGeneratedFiles() });
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
