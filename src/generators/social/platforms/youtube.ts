import { BaseOpenGraphGenerator, type BaseOpenGraphOptions } from '../base-opengraph';
import { ImageSizes } from '../../../core/image-processor';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface YouTubeOptions extends Omit<BaseOpenGraphOptions, 'filename'> {
  includeThumbnail?: boolean;
  includeShorts?: boolean;
}

/**
 * YouTube generator for video platform sharing
 * Generates thumbnail and shorts format images
 */
export class YouTubeGenerator extends BaseOpenGraphGenerator {
  constructor(sourceImage: string, config: PixelForgeConfig) {
    super(sourceImage, config);
  }

  /**
   * Generate YouTube-optimized images
   */
  async generate(options: YouTubeOptions = {}): Promise<void> {
    const { 
      includeThumbnail = true,
      includeShorts = true,
      title,
      description,
      template = 'basic'
    } = options;

    // Reset generated files list
    this.generatedFiles = [];

    if (includeThumbnail) {
      await super.generate({
        title,
        description,
        template,
        filename: 'youtube-thumbnail.png',
        width: ImageSizes.social.youtubeThumbnail.width,   // 1280
        height: ImageSizes.social.youtubeThumbnail.height  // 720
      });
    }

    if (includeShorts) {
      await super.generate({
        title,
        description,
        template,
        filename: 'youtube-shorts.png',
        width: ImageSizes.social.youtubeShorts.width,   // 1080
        height: ImageSizes.social.youtubeShorts.height  // 1920
      });
    }
  }

  /**
   * Get HTML meta tags for YouTube
   */
  getMetaTags(): string[] {
    const tags: string[] = [];
    
    if (this.generatedFiles.includes('youtube-thumbnail.png')) {
      tags.push(...super.getMetaTags('youtube-thumbnail.png', 
        ImageSizes.social.youtubeThumbnail.width, 
        ImageSizes.social.youtubeThumbnail.height));
    }
    
    return tags;
  }

  /**
   * Get Next.js metadata configuration for YouTube
   */
  getNextMetadata() {
    if (this.generatedFiles.includes('youtube-thumbnail.png')) {
      return super.getNextMetadata('youtube-thumbnail.png',
        ImageSizes.social.youtubeThumbnail.width,
        ImageSizes.social.youtubeThumbnail.height);
    }
    
    // Return standard OpenGraph format as fallback
    return super.getNextMetadata('youtube-thumbnail.png',
      ImageSizes.social.youtubeThumbnail.width,
      ImageSizes.social.youtubeThumbnail.height);
  }
}
