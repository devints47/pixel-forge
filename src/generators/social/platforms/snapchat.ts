import { GenericPlatformGenerator, type GenericPlatformOptions, createPlatformGenerator } from './generic-platform';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface SnapchatOptions extends GenericPlatformOptions {}

/**
 * Snapchat generator using the improved generic platform approach
 * Leverages BaseOpenGraphGenerator through GenericPlatformGenerator for better code reuse
 */
export class SnapchatGenerator {
  private genericGenerator: GenericPlatformGenerator;

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.genericGenerator = createPlatformGenerator(sourceImage, config, 'snapchat');
  }

  /**
   * Generate Snapchat OpenGraph image for website sharing
   */
  async generate(options: SnapchatOptions = {}): Promise<void> {
    await this.genericGenerator.generate(options);
  }

  /**
   * Get generated files
   */
  getGeneratedFiles(): string[] {
    return this.genericGenerator.getGeneratedFiles();
  }

  /**
   * Get HTML meta tags for Snapchat
   */
  getMetaTags(): string[] {
    return this.genericGenerator.getMetaTags();
  }

  /**
   * Get Next.js metadata configuration for Snapchat
   */
  getNextMetadata() {
    return this.genericGenerator.getNextMetadata();
  }
}