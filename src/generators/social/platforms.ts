import path from 'path';
import { ImageProcessor, ImageSizes } from '../../core/image-processor';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface PlatformOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  includeTikTok?: boolean;
  includeYouTube?: boolean;
  includePinterest?: boolean;
  includeSnapchat?: boolean;
  includeThreads?: boolean;
  includeBluesky?: boolean;
  includeMastodon?: boolean;
}

export class PlatformGenerator {
  private config: PixelForgeConfig;
  private sourceImage: string;

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.config = config;
    this.sourceImage = sourceImage;
  }

  /**
   * Generate all platform assets
   */
  async generate(options: PlatformOptions = {}): Promise<void> {
    const {
      includeTikTok = true,
      includeYouTube = true,
      includePinterest = true,
      includeSnapchat = true,
      includeThreads = true,
      includeBluesky = true,
      includeMastodon = true
    } = options;

    // TikTok vertical format
    if (includeTikTok) {
      await this.generateTikTok(options);
    }

    // YouTube thumbnail format
    if (includeYouTube) {
      await this.generateYouTube(options);
      await this.generateYouTubeShorts(options);
    }

    // Pinterest formats
    if (includePinterest) {
      await this.generatePinterest(options);
      await this.generatePinterestSquare(options);
    }

    // Snapchat vertical format
    if (includeSnapchat) {
      await this.generateSnapchat(options);
    }

    // Emerging platforms
    if (includeThreads) {
      await this.generateThreads(options);
    }

    if (includeBluesky) {
      await this.generateBluesky(options);
    }

    if (includeMastodon) {
      await this.generateMastodon(options);
    }
  }

  /**
   * Generate TikTok format (1080x1920)
   */
  private async generateTikTok(options: PlatformOptions): Promise<void> {
    const { width, height } = ImageSizes.social.tiktok;
    const outputPath = path.join(this.config.output.path, 'tiktok.png');

    const processor = new ImageProcessor(this.sourceImage);
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template || 'gradient',
      background: this.config.backgroundColor
    });
    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
    await processor.cleanup();
  }

  /**
   * Generate YouTube thumbnail (1280x720)
   */
  private async generateYouTube(options: PlatformOptions): Promise<void> {
    const { width, height } = ImageSizes.social.youtubeThumbnail;
    const outputPath = path.join(this.config.output.path, 'youtube-thumbnail.png');

    const processor = new ImageProcessor(this.sourceImage);
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template,
      background: this.config.backgroundColor
    });
    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
    await processor.cleanup();
  }

  /**
   * Generate YouTube Shorts (1080x1920)
   */
  private async generateYouTubeShorts(options: PlatformOptions): Promise<void> {
    const { width, height } = ImageSizes.social.youtubeShorts;
    const outputPath = path.join(this.config.output.path, 'youtube-shorts.png');

    const processor = new ImageProcessor(this.sourceImage);
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template || 'gradient',
      background: this.config.backgroundColor
    });
    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
    await processor.cleanup();
  }

  /**
   * Generate Pinterest Pin (1000x1500)
   */
  private async generatePinterest(options: PlatformOptions): Promise<void> {
    const { width, height } = ImageSizes.social.pinterestPin;
    const outputPath = path.join(this.config.output.path, 'pinterest-pin.png');

    const processor = new ImageProcessor(this.sourceImage);
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template || 'gradient',
      background: this.config.backgroundColor
    });
    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
    await processor.cleanup();
  }

  /**
   * Generate Pinterest Square (1000x1000)
   */
  private async generatePinterestSquare(options: PlatformOptions): Promise<void> {
    const { width, height } = ImageSizes.social.pinterestSquare;
    const outputPath = path.join(this.config.output.path, 'pinterest-square.png');

    const processor = new ImageProcessor(this.sourceImage);
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template,
      background: this.config.backgroundColor
    });
    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
    await processor.cleanup();
  }

  /**
   * Generate Snapchat format (1080x1920)
   */
  private async generateSnapchat(options: PlatformOptions): Promise<void> {
    const { width, height } = ImageSizes.social.snapchat;
    const outputPath = path.join(this.config.output.path, 'snapchat.png');

    const processor = new ImageProcessor(this.sourceImage);
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title: options.title, // Only add text if explicitly provided
      description: options.description, // Only add text if explicitly provided
      template: options.template || 'gradient',
      background: this.config.backgroundColor
    });
    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
    await processor.cleanup();
  }

  /**
   * Generate Threads format (1080x1080)
   */
  private async generateThreads(options: PlatformOptions): Promise<void> {
    const { width, height } = ImageSizes.social.threads;
    const outputPath = path.join(this.config.output.path, 'threads.png');

    const processor = new ImageProcessor(this.sourceImage);
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template,
      background: this.config.backgroundColor
    });
    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
    await processor.cleanup();
  }

  /**
   * Generate Bluesky format (1200x630)
   */
  private async generateBluesky(options: PlatformOptions): Promise<void> {
    const { width, height } = ImageSizes.social.bluesky;
    const outputPath = path.join(this.config.output.path, 'bluesky.png');

    const processor = new ImageProcessor(this.sourceImage);
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template,
      background: this.config.backgroundColor
    });
    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
    await processor.cleanup();
  }

  /**
   * Generate Mastodon format (1200x630)
   */
  private async generateMastodon(options: PlatformOptions): Promise<void> {
    const { width, height } = ImageSizes.social.mastodon;
    const outputPath = path.join(this.config.output.path, 'mastodon.png');

    const processor = new ImageProcessor(this.sourceImage);
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template,
      background: this.config.backgroundColor
    });
    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
    await processor.cleanup();
  }

  /**
   * Get HTML meta tags for additional platforms
   */
  getMetaTags(): string[] {
    const { prefix = '/' } = this.config.output;
    return [
      // TikTok
      `<meta property="og:image" content="${prefix}tiktok.png" />`,
      `<meta property="og:image:width" content="${ImageSizes.social.tiktok.width}" />`,
      `<meta property="og:image:height" content="${ImageSizes.social.tiktok.height}" />`,
      
      // YouTube
      `<meta property="og:video:tag" content="${this.config.appName}" />`,
      `<meta property="og:video:duration" content="0" />`,
      
      // Pinterest
      `<meta property="og:image" content="${prefix}pinterest-pin.png" />`,
      `<meta property="pinterest:description" content="${this.config.description}" />`,
      
      // Threads (Meta)
      `<meta property="fb:app_id" content="your-app-id" />`,
      
      // Bluesky
      `<meta property="bluesky:handle" content="${this.config.appName}" />`,
      
      // Mastodon
      `<meta property="fediverse:creator" content="${this.config.appName}" />`
    ];
  }

  /**
   * Get Next.js metadata configuration for additional platforms
   */
  getNextMetadata() {
    const { prefix = '/' } = this.config.output;
    return {
      openGraph: {
        images: [
          {
            url: `${prefix}tiktok.png`,
            width: ImageSizes.social.tiktok.width,
            height: ImageSizes.social.tiktok.height
          },
          {
            url: `${prefix}youtube-thumbnail.png`,
            width: ImageSizes.social.youtubeThumbnail.width,
            height: ImageSizes.social.youtubeThumbnail.height
          },
          {
            url: `${prefix}pinterest-pin.png`,
            width: ImageSizes.social.pinterestPin.width,
            height: ImageSizes.social.pinterestPin.height
          }
        ]
      },
      other: {
        'pinterest:description': this.config.description,
        'bluesky:handle': this.config.appName,
        'fediverse:creator': this.config.appName
      }
    };
  }
} 