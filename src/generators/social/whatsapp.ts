import path from 'path';
import { ImageProcessor, ImageSizes } from '../../core/image-processor';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface WhatsAppOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  includeProfile?: boolean;
  includeLinkPreview?: boolean;
}

export class WhatsAppGenerator {
  private config: PixelForgeConfig;
  private sourceImage: string;

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.config = config;
    this.sourceImage = sourceImage;
  }

  /**
   * Generate WhatsApp-optimized images
   */
  async generate(options: WhatsAppOptions = {}): Promise<void> {
    const { 
      includeProfile = true, 
      includeLinkPreview = true,
      title,
      description,
      template = 'basic'
    } = options;

    if (includeProfile) {
      await this.generateProfileImage(title, description, template);
    }

    if (includeLinkPreview) {
      await this.generateLinkPreviewImage(title, description, template);
    }
  }

  /**
   * Generate WhatsApp profile image (400x400)
   */
  private async generateProfileImage(title?: string, description?: string, template?: 'basic' | 'gradient' | 'custom'): Promise<void> {
    const processor = new ImageProcessor(this.sourceImage);
    const outputPath = path.join(this.config.output.path, 'whatsapp-profile.png');

    const socialFile = await processor.createSocialPreview({
      width: ImageSizes.messaging.whatsapp.width,
      height: ImageSizes.messaging.whatsapp.height,
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
   * Generate WhatsApp link preview image (1200x630)
   */
  private async generateLinkPreviewImage(title?: string, description?: string, template?: 'basic' | 'gradient' | 'custom'): Promise<void> {
    const processor = new ImageProcessor(this.sourceImage);
    let finalProcessor: ImageProcessor | undefined;
    
    try {
      const outputPath = path.join(this.config.output.path, 'whatsapp-link.png');

      const socialFile = await processor.createSocialPreview({
        width: ImageSizes.messaging.whatsappLink.width,
        height: ImageSizes.messaging.whatsappLink.height,
        title,
        description,
        template,
        background: this.config.backgroundColor
      });
      
      finalProcessor = new ImageProcessor(socialFile);
      await finalProcessor.save(outputPath);
    } finally {
      await processor.cleanup();
      if (finalProcessor) {
        await finalProcessor.cleanup();
      }
    }
  }

  /**
   * Generate standard WhatsApp sharing image (1200x630)
   */
  private async generateStandardImage(title?: string, description?: string, template?: 'basic' | 'gradient' | 'custom'): Promise<void> {
    const processor = new ImageProcessor(this.sourceImage);
    let finalProcessor: ImageProcessor | undefined;
    
    try {
      const outputPath = path.join(this.config.output.path, 'whatsapp-share.png');

      const socialFile = await processor.createSocialPreview({
        width: ImageSizes.messaging.whatsappLink.width,
        height: ImageSizes.messaging.whatsappLink.height,
        title,
        description,
        template,
        background: this.config.backgroundColor
      });
      
      finalProcessor = new ImageProcessor(socialFile);
      await finalProcessor.save(outputPath);
    } finally {
      await processor.cleanup();
      if (finalProcessor) {
        await finalProcessor.cleanup();
      }
    }
  }

  /**
   * Generate square WhatsApp image (1200x1200)
   */
  private async generateSquareImage(title?: string, description?: string, template?: 'basic' | 'gradient' | 'custom'): Promise<void> {
    const processor = new ImageProcessor(this.sourceImage);
    let finalProcessor: ImageProcessor | undefined;
    
    try {
      const outputPath = path.join(this.config.output.path, 'whatsapp-square.png');

      const socialFile = await processor.createSocialPreview({
        width: 1200,
        height: 1200,
        title,
        description,
        template,
        background: this.config.backgroundColor
      });
      
      finalProcessor = new ImageProcessor(socialFile);
      await finalProcessor.save(outputPath);
    } finally {
      await processor.cleanup();
      if (finalProcessor) {
        await finalProcessor.cleanup();
      }
    }
  }

  /**
   * Get HTML meta tags for WhatsApp
   */
  getMetaTags(): string[] {
    const prefix = this.config.output.prefix || '/';
    return [
      `<meta property="og:image" content="${prefix}whatsapp-link.png">`,
      `<meta property="og:image:width" content="${ImageSizes.messaging.whatsappLink.width}">`,
      `<meta property="og:image:height" content="${ImageSizes.messaging.whatsappLink.height}">`,
      `<meta property="og:image:type" content="image/png">`,
      `<meta property="og:title" content="${this.config.appName}">`,
      `<meta property="og:description" content="${this.config.description || ''}">`,
      `<meta property="og:type" content="website">`,
      // WhatsApp-specific optimizations
      `<meta name="format-detection" content="telephone=no">`,
      `<meta name="apple-mobile-web-app-capable" content="yes">`,
      `<meta name="mobile-web-app-capable" content="yes">`,
    ];
  }

  /**
   * Get Next.js metadata configuration for WhatsApp
   */
  getNextMetadata() {
    const prefix = this.config.output.prefix || '/';
    return {
      openGraph: {
        title: this.config.appName,
        description: this.config.description,
        images: [
          {
            url: `${prefix}whatsapp-link.png`,
            width: ImageSizes.messaging.whatsappLink.width,
            height: ImageSizes.messaging.whatsappLink.height,
            alt: this.config.appName,
          }
        ],
        type: 'website',
      },
      other: {
        'format-detection': 'telephone=no',
        'apple-mobile-web-app-capable': 'yes',
        'mobile-web-app-capable': 'yes',
      },
    };
  }

  /**
   * Get list of generated files
   */
  getGeneratedFiles(): string[] {
    return ['whatsapp-profile.png', 'whatsapp-link.png'];
  }
} 