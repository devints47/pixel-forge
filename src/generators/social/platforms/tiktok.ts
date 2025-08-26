import { GenericPlatformGenerator, type GenericPlatformOptions, createPlatformGenerator } from './generic-platform';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface TikTokOptions extends GenericPlatformOptions {}

/**
 * TikTok generator using the improved generic platform approach
 * Leverages BaseOpenGraphGenerator through GenericPlatformGenerator for better code reuse
 */
export class TikTokGenerator {
  private genericGenerator: GenericPlatformGenerator;

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.genericGenerator = createPlatformGenerator(sourceImage, config, 'tiktok');
  }

  /**
   * Generate TikTok OpenGraph image for website sharing
   */
  async generate(options: TikTokOptions = {}): Promise<void> {
    await this.genericGenerator.generate(options);
  }

  /**
   * Get generated files
   */
  getGeneratedFiles(): string[] {
    return this.genericGenerator.getGeneratedFiles();
  }

  /**
   * Get HTML meta tags for TikTok
   */
  getMetaTags(): string[] {
    return this.genericGenerator.getMetaTags();
  }

  /**
   * Get Next.js metadata configuration for TikTok
   */
  getNextMetadata() {
    return this.genericGenerator.getNextMetadata();
  }
}