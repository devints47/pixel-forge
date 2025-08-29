import path from 'path';
import { ImageProcessor, ImageSizes } from '../../core/image-processor';
import { MetadataGenerator } from '../../core/metadata-utils';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface WebSEOOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  includeOpenGraph?: boolean;
  includeTwitter?: boolean;
  includeGeneric?: boolean;
  outputFormat?: 'png' | 'jpeg' | 'both';
}

export class WebSEOGenerator {
  private config: PixelForgeConfig;
  private sourceImage: string;
  private outputFormat: 'png' | 'jpeg' | 'both' = 'both';

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.config = config;
    this.sourceImage = sourceImage;
  }

  /**
   * Generate essential SEO images for web applications
   */
  async generate(options: WebSEOOptions = {}): Promise<void> {
    const {
      // Only use title/description if explicitly provided - don't use config defaults for clean brand images
      title = options.title, // undefined unless explicitly set
      description = options.description, // undefined unless explicitly set
      template = this.config.socialPreview?.template || 'basic',
      includeOpenGraph = true,
      includeTwitter = true,
      includeGeneric = true,
      outputFormat = 'both'
    } = options;

    // Store the format used for accurate file counting
    this.outputFormat = outputFormat;

    // Generate generic OpenGraph image (works everywhere)
    if (includeGeneric) {
      await this.generateGenericOpenGraph({ title, description, template, outputFormat });
    }

    // Generate specific OpenGraph image
    if (includeOpenGraph) {
      await this.generateOpenGraphImage({ title, description, template, outputFormat });
    }

    // Generate Twitter card image
    if (includeTwitter) {
      await this.generateTwitterCardImage({ title, description, template, outputFormat });
    }
  }

  /**
   * Generate generic og-image that works across all platforms
   */
  private async generateGenericOpenGraph(options: {
    title?: string;
    description?: string;
    template: string;
    outputFormat: string;
  }): Promise<void> {
    const { title, description, template, outputFormat } = options;
    const { width, height } = ImageSizes.social.standard;

    const processor = new ImageProcessor(this.sourceImage);
    
    // Create social preview with template
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title,
      description,
      template: template as 'basic' | 'gradient' | 'custom',
      background: this.config.backgroundColor
    });

    // Save in requested format(s)
    if (outputFormat === 'png' || outputFormat === 'both') {
      const outputPath = path.join(this.config.output.path, 'og-image.png');
      const final1 = new ImageProcessor(socialFile);
      await final1.save(outputPath, { format: 'png', quality: this.config.output.quality });
    }

    if (outputFormat === 'jpeg' || outputFormat === 'both') {
      const outputPath = path.join(this.config.output.path, 'og-image.jpg');
      const final2 = new ImageProcessor(socialFile);
      await final2.save(outputPath, { format: 'jpeg', quality: this.config.output.quality });
    }
    await processor.cleanup();
  }

  /**
   * Generate OpenGraph-specific image
   */
  private async generateOpenGraphImage(options: {
    title?: string;
    description?: string;
    template: string;
    outputFormat: string;
  }): Promise<void> {
    const { title, description, template, outputFormat } = options;
    const { width, height } = ImageSizes.social.facebook; // Use Facebook dimensions for OpenGraph

    const processor = new ImageProcessor(this.sourceImage);
    
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title,
      description,
      template: template as 'basic' | 'gradient' | 'custom',
      background: this.config.backgroundColor
    });

    const processors: ImageProcessor[] = [processor];

    try {
      // Save in requested format(s)
      if (outputFormat === 'png' || outputFormat === 'both') {
        const outputPath = path.join(this.config.output.path, 'opengraph.png');
        const final1 = new ImageProcessor(socialFile);
        processors.push(final1);
        await final1.save(outputPath, { format: 'png', quality: this.config.output.quality });
      }

      if (outputFormat === 'jpeg' || outputFormat === 'both') {
        const outputPath = path.join(this.config.output.path, 'opengraph.jpg');
        const final2 = new ImageProcessor(socialFile);
        processors.push(final2);
        await final2.save(outputPath, { format: 'jpeg', quality: this.config.output.quality });
      }
    } finally {
      // Clean up all processors
      await Promise.all(processors.map(p => p.cleanup()));
    }
  }

  /**
   * Generate Twitter card image
   */
  private async generateTwitterCardImage(options: {
    title?: string;
    description?: string;
    template: string;
    outputFormat: string;
  }): Promise<void> {
    const { title, description, template, outputFormat } = options;
    const { width, height } = ImageSizes.social.twitter;

    const processor = new ImageProcessor(this.sourceImage);
    
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title,
      description,
      template: template as 'basic' | 'gradient' | 'custom',
      background: this.config.backgroundColor
    });

    // Save in requested format(s)
    if (outputFormat === 'png' || outputFormat === 'both') {
      const outputPath = path.join(this.config.output.path, 'twitter-image.png');
      const final1 = new ImageProcessor(socialFile);
      await final1.save(outputPath, { format: 'png', quality: this.config.output.quality });
    }

    if (outputFormat === 'jpeg' || outputFormat === 'both') {
      const outputPath = path.join(this.config.output.path, 'twitter-image.jpg');
      const final2 = new ImageProcessor(socialFile);
      await final2.save(outputPath, { format: 'jpeg', quality: this.config.output.quality });
    }
    await processor.cleanup();
  }

  /**
   * Get HTML meta tags for SEO images
   */
  getMetaTags(options: { format?: 'png' | 'jpeg' } = {}): string[] {
    const { format = 'png' } = options;
    const { prefix = '/' } = this.config.output;
    const extension = format === 'jpeg' ? 'jpg' : 'png';
    
    const metadataGenerator = new MetadataGenerator(this.config);
    
    // Get essential meta tags and web-specific social tags
    const essentialTags = metadataGenerator.getEssentialMetaTags({
      title: this.config.appName,
      description: this.config.description
    });
    
    const socialTags = metadataGenerator.getSocialMetaTags({
      title: this.config.appName,
      description: this.config.description,
      image: `${prefix}og-image.${extension}`
    });
    
    const performanceTags = metadataGenerator.getSecurityPerformanceMetaTags();
    
    return [
      ...essentialTags,
      ...socialTags,
      ...performanceTags,
      
      // Web-specific OpenGraph images  
      `<meta property="og:image" content="${prefix}og-image.${extension}" />`,
      `<meta property="og:image:width" content="${ImageSizes.social.standard.width}" />`,
      `<meta property="og:image:height" content="${ImageSizes.social.standard.height}" />`,
      `<meta property="og:image:type" content="image/${format === 'jpeg' ? 'jpeg' : 'png'}" />`,
      
      // Twitter Card specific
      `<meta name="twitter:image" content="${prefix}twitter-image.${extension}" />`
    ];
  }

  /**
   * Get Next.js metadata configuration
   */
  getNextMetadata(options: { format?: 'png' | 'jpeg' } = {}) {
    const { format = 'png' } = options;
    const { prefix = '/' } = this.config.output;
    const extension = format === 'jpeg' ? 'jpg' : 'png';

    return {
      title: this.config.appName,
      description: this.config.description,
      openGraph: {
        title: this.config.appName,
        description: this.config.description,
        type: 'website',
        images: [
          {
            url: `${prefix}og-image.${extension}`,
            width: ImageSizes.social.standard.width,
            height: ImageSizes.social.standard.height,
            alt: this.config.appName,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: this.config.appName,
        description: this.config.description,
        images: [`${prefix}twitter-image.${extension}`],
      },
    };
  }

  /**
   * Get list of generated files based on the format used during generation
   */
  getGeneratedFiles(): string[] {
    const files: string[] = [];

    if (this.outputFormat === 'png' || this.outputFormat === 'both') {
      files.push('og-image.png', 'opengraph.png', 'twitter-image.png');
    }

    if (this.outputFormat === 'jpeg' || this.outputFormat === 'both') {
      files.push('og-image.jpg', 'opengraph.jpg', 'twitter-image.jpg');
    }

    return files;
  }
}