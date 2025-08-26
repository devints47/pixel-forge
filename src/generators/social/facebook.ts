import path from 'path';
import { ImageProcessor, ImageSizes } from '../../core/image-processor';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface FacebookOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  includeStandard?: boolean;
  includeSquare?: boolean;
}

export class FacebookGenerator {
  private config: PixelForgeConfig;
  private sourceImage: string;
  private generatedFiles: string[] = [];

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.config = config;
    this.sourceImage = sourceImage;
  }

  /**
   * Generate Facebook-optimized images
   */
  async generate(options: FacebookOptions = {}): Promise<void> {
    const { 
      includeStandard = true, 
      includeSquare = false,
      title,
      description,
      template = 'basic'
    } = options;

    // Reset generated files list
    this.generatedFiles = [];

    if (includeStandard) {
      await this.generateStandardImage(title, description, template);
      this.generatedFiles.push('facebook-og.png');
    }

    if (includeSquare) {
      await this.generateSquareImage(title, description, template);
      this.generatedFiles.push('facebook-square.png');
    }
  }

  /**
   * Generate standard Facebook image (1200x630)
   */
  private async generateStandardImage(title?: string, description?: string, template?: 'basic' | 'gradient' | 'custom'): Promise<void> {
    const processor = new ImageProcessor(this.sourceImage);
    const outputPath = path.join(this.config.output.path, 'facebook-og.png');

    const socialFile = await processor.createSocialPreview({
      width: ImageSizes.social.facebook.width,
      height: ImageSizes.social.facebook.height,
      title,
      description,
      template,
      background: this.config.backgroundColor
    });
    
    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath);
    await processor.cleanup();
  }

  /**
   * Generate square Facebook image (1200x1200)
   */
  private async generateSquareImage(title?: string, description?: string, template?: 'basic' | 'gradient' | 'custom'): Promise<void> {
    const processor = new ImageProcessor(this.sourceImage);
    const outputPath = path.join(this.config.output.path, 'facebook-square.png');

    const socialFile = await processor.createSocialPreview({
      width: ImageSizes.social.facebookSquare.width,
      height: ImageSizes.social.facebookSquare.height,
      title,
      description,
      template,
      background: this.config.backgroundColor
    });
    
    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath);
    await processor.cleanup();
  }

  /**
   * Get HTML meta tags for Facebook
   */
  getMetaTags(): string[] {
    const prefix = this.config.output.prefix || '/';
    return [
      `<meta property="og:image" content="${prefix}facebook.png">`,
      `<meta property="og:image:width" content="${ImageSizes.social.facebook.width}">`,
      `<meta property="og:image:height" content="${ImageSizes.social.facebook.height}">`,
      `<meta property="og:image:type" content="image/png">`,
      `<meta property="og:title" content="${this.config.appName}">`,
      `<meta property="og:description" content="${this.config.description || ''}">`,
      `<meta property="og:type" content="website">`,
      `<meta property="fb:app_id" content="">`, // Can be configured later
    ];
  }

  /**
   * Get Next.js metadata configuration for Facebook
   */
  getNextMetadata() {
    const prefix = this.config.output.prefix || '/';
    return {
      openGraph: {
        title: this.config.appName,
        description: this.config.description,
        images: [
          {
            url: `${prefix}facebook.png`,
            width: ImageSizes.social.facebook.width,
            height: ImageSizes.social.facebook.height,
            alt: this.config.appName,
          }
        ],
        type: 'website',
      },
    };
  }

  /**
   * Get list of generated files
   */
  getGeneratedFiles(): string[] {
    return [...this.generatedFiles];
  }
} 