import path from 'path';
import { ImageProcessor, ImageSizes } from '../../core/image-processor';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface LinkedInOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  includeStandard?: boolean;
  includeCompany?: boolean;
}

export class LinkedInGenerator {
  private config: PixelForgeConfig;
  private sourceImage: string;

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.config = config;
    this.sourceImage = sourceImage;
  }

  /**
   * Generate LinkedIn-optimized images
   */
  async generate(options: LinkedInOptions = {}): Promise<void> {
    const { 
      includeStandard = true, 
      includeCompany = false,
      title,
      description,
      template = 'basic'
    } = options;

    if (includeStandard) {
      await this.generateStandardImage(title, description, template);
    }

    if (includeCompany) {
      await this.generateCompanyImage(title, description, template);
    }
  }

  /**
   * Generate standard LinkedIn image (1200x627)
   */
  private async generateStandardImage(title?: string, description?: string, template?: 'basic' | 'gradient' | 'custom'): Promise<void> {
    const processor = new ImageProcessor(this.sourceImage);
    const outputPath = path.join(this.config.output.path, 'linkedin.png');

    await processor
      .createSocialPreview({
        width: ImageSizes.social.linkedin.width,
        height: ImageSizes.social.linkedin.height,
        title,
        description,
        template,
        background: this.config.backgroundColor
      })
      .save(outputPath);
  }

  /**
   * Generate LinkedIn company page image (1104x736)
   */
  private async generateCompanyImage(title?: string, description?: string, template?: 'basic' | 'gradient' | 'custom'): Promise<void> {
    const processor = new ImageProcessor(this.sourceImage);
    const outputPath = path.join(this.config.output.path, 'linkedin-company.png');

    await processor
      .createSocialPreview({
        width: ImageSizes.social.linkedinCompany.width,
        height: ImageSizes.social.linkedinCompany.height,
        title,
        description,
        template,
        background: this.config.backgroundColor
      })
      .save(outputPath);
  }

  /**
   * Get HTML meta tags for LinkedIn
   */
  getMetaTags(): string[] {
    const prefix = this.config.output.prefix || '/';
    return [
      `<meta property="og:image" content="${prefix}linkedin.png">`,
      `<meta property="og:image:width" content="${ImageSizes.social.linkedin.width}">`,
      `<meta property="og:image:height" content="${ImageSizes.social.linkedin.height}">`,
      `<meta property="og:image:type" content="image/png">`,
      `<meta property="og:title" content="${this.config.appName}">`,
      `<meta property="og:description" content="${this.config.description || ''}">`,
      `<meta property="og:type" content="article">`,
      // LinkedIn-specific meta tags
      `<meta property="article:author" content="">`, // Can be configured later
      `<meta property="og:site_name" content="${this.config.appName}">`,
    ];
  }

  /**
   * Get Next.js metadata configuration for LinkedIn
   */
  getNextMetadata() {
    const prefix = this.config.output.prefix || '/';
    return {
      openGraph: {
        title: this.config.appName,
        description: this.config.description,
        images: [
          {
            url: `${prefix}linkedin.png`,
            width: ImageSizes.social.linkedin.width,
            height: ImageSizes.social.linkedin.height,
            alt: this.config.appName,
          }
        ],
        type: 'article',
        siteName: this.config.appName,
      },
    };
  }

  /**
   * Get list of generated files
   */
  getGeneratedFiles(): string[] {
    return ['linkedin.png', 'linkedin-company.png'];
  }
} 