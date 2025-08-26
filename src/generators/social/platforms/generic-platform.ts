import { BaseOpenGraphGenerator, type BaseOpenGraphOptions } from '../base-opengraph';
import { ImageSizes } from '../../../core/image-processor';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface GenericPlatformOptions extends Omit<BaseOpenGraphOptions, 'filename'> {}

export interface PlatformConfig {
  filename: string;
  width?: number;
  height?: number;
}

/**
 * Generic platform generator that properly leverages BaseOpenGraphGenerator
 * This eliminates code duplication for simple platforms that just need
 * a single OpenGraph image with a specific filename and optional dimensions
 */
export class GenericPlatformGenerator extends BaseOpenGraphGenerator {
  private platformConfig: PlatformConfig;

  constructor(sourceImage: string, config: PixelForgeConfig, platformConfig: PlatformConfig) {
    super(sourceImage, config);
    this.platformConfig = platformConfig;
  }

  /**
   * Generate platform-optimized image
   */
  async generate(options: GenericPlatformOptions = {}): Promise<void> {
    const { 
      title,
      description,
      template = 'basic'
    } = options;

    // Reset generated files list for clean state
    this.generatedFiles = [];

    await super.generate({
      title,
      description,
      template,
      filename: this.platformConfig.filename,
      width: this.platformConfig.width || ImageSizes.social.standard.width,   // Default 1200
      height: this.platformConfig.height || ImageSizes.social.standard.height  // Default 630
    });
  }

  /**
   * Get HTML meta tags for this platform
   */
  getMetaTags(): string[] {
    return super.getMetaTags(
      this.platformConfig.filename, 
      this.platformConfig.width || ImageSizes.social.standard.width,
      this.platformConfig.height || ImageSizes.social.standard.height
    );
  }

  /**
   * Get Next.js metadata configuration for this platform
   */
  getNextMetadata() {
    return super.getNextMetadata(
      this.platformConfig.filename,
      this.platformConfig.width || ImageSizes.social.standard.width,
      this.platformConfig.height || ImageSizes.social.standard.height
    );
  }
}

/**
 * Factory function to create platform generators with proper configuration
 */
export function createPlatformGenerator(
  sourceImage: string,
  config: PixelForgeConfig,
  platformName: string
): GenericPlatformGenerator {
  
  // Platform configurations with their specific filenames and dimensions
  const platformConfigs: Record<string, PlatformConfig> = {
    instagram: {
      filename: 'instagram.png',
      width: ImageSizes.social.standard.width,     // 1200 (standard OpenGraph)
      height: ImageSizes.social.standard.height    // 630
    },
    snapchat: {
      filename: 'snapchat.png',
      width: ImageSizes.social.snapchat.width,     // Use existing snapchat dimensions
      height: ImageSizes.social.snapchat.height
    },
    tiktok: {
      filename: 'tiktok.png',
      width: ImageSizes.social.tiktok.width,       // 1080x1920
      height: ImageSizes.social.tiktok.height      
    },
    threads: {
      filename: 'threads.png',
      width: ImageSizes.social.threads.width,      // Use existing threads dimensions
      height: ImageSizes.social.threads.height     
    },
    bluesky: {
      filename: 'bluesky.png',
      width: ImageSizes.social.bluesky.width,      // 1200
      height: ImageSizes.social.bluesky.height     // 630
    },
    mastodon: {
      filename: 'mastodon.png',
      width: ImageSizes.social.mastodon.width,     // 1200
      height: ImageSizes.social.mastodon.height    // 630
    },
    facebook: {
      filename: 'facebook-og.png',
      width: ImageSizes.social.facebook.width,     // 1200
      height: ImageSizes.social.facebook.height    // 630
    }
  };

  const platformConfig = platformConfigs[platformName.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`Unknown platform: ${platformName}`);
  }

  return new GenericPlatformGenerator(sourceImage, config, platformConfig);
}
