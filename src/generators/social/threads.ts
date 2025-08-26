import { SquareOpenGraphGenerator } from './square-opengraph';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface ThreadsOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
}

/**
 * Threads generator for website sharing previews
 * Threads (Meta's Twitter alternative) prefers square format (1200x1200) for previews
 */
export class ThreadsGenerator extends SquareOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate Threads OpenGraph image for website sharing
   */
  async generate(options: ThreadsOptions = {}): Promise<void> {
    const { title, description, template = 'basic' } = options;

    // Generate square OpenGraph image that appears when websites are shared on Threads
    await super.generate({
      title,
      description,
      template,
      filename: 'threads.png'
    });
  }

  /**
   * Get HTML meta tags for Threads
   */
  getMetaTags(): string[] {
    return super.getMetaTags('threads.png');
  }

  /**
   * Get Next.js metadata configuration for Threads
   */
  getNextMetadata() {
    return super.getNextMetadata('threads.png');
  }
}
