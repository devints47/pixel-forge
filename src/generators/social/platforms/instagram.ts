import { GenericPlatformGenerator, type GenericPlatformOptions, createPlatformGenerator } from './generic-platform';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface InstagramOptions extends GenericPlatformOptions {}

/**
 * Instagram generator using the improved generic platform approach
 * Leverages BaseOpenGraphGenerator through GenericPlatformGenerator for better code reuse
 */
export class InstagramGenerator {
  private genericGenerator: GenericPlatformGenerator;

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.genericGenerator = createPlatformGenerator(sourceImage, config, 'instagram');
  }

  /**
   * Generate Instagram OpenGraph image for website sharing
   */
  async generate(options: InstagramOptions = {}): Promise<void> {
    await this.genericGenerator.generate(options);
  }

  /**
   * Get generated files
   */
  getGeneratedFiles(): string[] {
    return this.genericGenerator.getGeneratedFiles();
  }

  /**
   * Get HTML meta tags for Instagram
   */
  getMetaTags(): string[] {
    return this.genericGenerator.getMetaTags();
  }

  /**
   * Get Next.js metadata configuration for Instagram
   */
  getNextMetadata() {
    return this.genericGenerator.getNextMetadata();
  }
}