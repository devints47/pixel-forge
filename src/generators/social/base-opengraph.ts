import path from 'path';
import { ImageProcessor, ImageSizes } from '../../core/image-processor';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface BaseOpenGraphOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  filename: string; // Required: each platform specifies its own filename
  width?: number;   // Optional: allow dimension override
  height?: number;  // Optional: allow dimension override
}

/**
 * Base OpenGraph generator that handles the core logic for generating
 * OpenGraph images. Other platform generators can extend or use this
 * to maintain consistency while having platform-specific filenames.
 */
export class BaseOpenGraphGenerator {
  protected config: PixelForgeConfig;
  protected sourceImage: string;
  protected generatedFiles: string[] = [];

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.config = config;
    this.sourceImage = sourceImage;
  }

  /**
   * Generate OpenGraph image with specified options
   */
  async generate(options: BaseOpenGraphOptions): Promise<void> {
    const { 
      title,
      description,
      template = 'basic',
      filename,
      width = ImageSizes.social.standard.width,   // Default 1200
      height = ImageSizes.social.standard.height  // Default 630
    } = options;

    // Reset generated files list
    this.generatedFiles = [];

    await this.generateOpenGraphImage(title, description, template, filename, width, height);
    this.generatedFiles.push(filename);
  }

  /**
   * Core OpenGraph image generation logic
   */
  protected async generateOpenGraphImage(
    title?: string, 
    description?: string, 
    template?: 'basic' | 'gradient' | 'custom',
    filename?: string,
    width?: number,
    height?: number
  ): Promise<void> {
    if (!filename) {
      throw new Error('Filename is required for OpenGraph generation');
    }

    const outputPath = path.join(this.config.output.path, filename);

    const processor = new ImageProcessor(this.sourceImage);
    const socialFile = await processor.createSocialPreview({
      width: width || ImageSizes.social.standard.width,
      height: height || ImageSizes.social.standard.height,
      title, // Only add text if explicitly provided
      description, // Only add text if explicitly provided
      template,
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
   * Get HTML meta tags for OpenGraph
   */
  getMetaTags(filename: string, width?: number, height?: number): string[] {
    const prefix = this.config.output.prefix || '/';
    const imageWidth = width || ImageSizes.social.standard.width;
    const imageHeight = height || ImageSizes.social.standard.height;
    
    return [
      `<meta property="og:image" content="${prefix}${filename}">`,
      `<meta property="og:image:width" content="${imageWidth}">`,
      `<meta property="og:image:height" content="${imageHeight}">`,
      `<meta property="og:image:alt" content="${this.config.appName}">`,
      `<meta property="og:image:type" content="image/png">`
    ];
  }

  /**
   * Get Next.js metadata configuration for OpenGraph
   */
  getNextMetadata(filename: string, width?: number, height?: number) {
    const prefix = this.config.output.prefix || '/';
    const imageWidth = width || ImageSizes.social.standard.width;
    const imageHeight = height || ImageSizes.social.standard.height;
    
    return {
      openGraph: {
        title: this.config.appName,
        description: this.config.description,
        images: [
          {
            url: `${prefix}${filename}`,
            width: imageWidth,
            height: imageHeight,
            alt: this.config.appName,
          }
        ],
      }
    };
  }

  /**
   * Get list of generated files
   */
  getGeneratedFiles(): string[] {
    return [...this.generatedFiles];
  }
}
