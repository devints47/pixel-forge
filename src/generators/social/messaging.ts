import path from 'path';
import { ImageProcessor, ImageSizes } from '../../core/image-processor';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface MessagingOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  includeWhatsApp?: boolean;
  includeDiscord?: boolean;
  includeTelegram?: boolean;
  includeSignal?: boolean;
  includeSlack?: boolean;
  includeWeChat?: boolean;
  includeiMessage?: boolean;
  includeAndroidRCS?: boolean;
}

export class MessagingGenerator {
  private config: PixelForgeConfig;
  private sourceImage: string;

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.config = config;
    this.sourceImage = sourceImage;
  }

  /**
   * Generate all messaging app assets
   */
  async generate(options: MessagingOptions = {}): Promise<void> {
    const {
      includeWhatsApp = true,
      includeDiscord = true,
      includeTelegram = true,
      includeSignal = true,
      includeSlack = true,
      includeWeChat = false,
      includeiMessage = true,
      includeAndroidRCS = true
    } = options;

    // Standard messaging preview (1200x630) for most apps
    await this.generateStandardPreview(options);

    // WhatsApp specific sizes
    if (includeWhatsApp) {
      await this.generateWhatsApp(options);
    }

    // WeChat specific size
    if (includeWeChat) {
      await this.generateWeChat(options);
    }

    // Generate for other platforms that use standard size
    if (includeDiscord) {
      await this.generateDiscord(options);
    }

    if (includeTelegram) {
      await this.generateTelegram(options);
    }

    if (includeSignal) {
      await this.generateSignal(options);
    }

    if (includeSlack) {
      await this.generateSlack(options);
    }

    if (includeiMessage) {
      await this.generateiMessage(options);
    }

    if (includeAndroidRCS) {
      await this.generateAndroidRCS(options);
    }
  }

  /**
   * Generate standard messaging preview (1200x630)
   * Used by most messaging apps
   */
  private async generateStandardPreview(options: MessagingOptions): Promise<void> {
    const { width, height } = ImageSizes.messaging.standard;
    const outputPath = path.join(this.config.output.path, 'messaging-standard.png');

    const processor = new ImageProcessor(this.sourceImage);
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title: options.title, // Only add text if explicitly provided
      description: options.description, // Only add text if explicitly provided
      template: options.template,
      background: this.config.backgroundColor
    });

    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
    await processor.cleanup();
    await finalProcessor.cleanup();
    await finalProcessor.cleanup();
  }

  /**
   * Generate WhatsApp preview (400x400 for profile + 1200x630 for links)
   */
  private async generateWhatsApp(options: MessagingOptions): Promise<void> {
    // Square format for WhatsApp profile/status
    const { width: squareWidth, height: squareHeight } = ImageSizes.messaging.whatsapp;
    const squareOutputPath = path.join(this.config.output.path, 'whatsapp-square.png');

    const squareProcessor = new ImageProcessor(this.sourceImage);
    const squareFile = await squareProcessor.createSocialPreview({
      width: squareWidth,
      height: squareHeight,
      title: options.title, // Only add text if explicitly provided
      description: options.description, // Only add text if explicitly provided
      template: options.template || 'basic',
      background: this.config.backgroundColor
    });

    const squareFinal = new ImageProcessor(squareFile);
    await squareFinal.save(squareOutputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
    await squareProcessor.cleanup();
    await squareFinal.cleanup();

    // Link preview format
    const { width: linkWidth, height: linkHeight } = ImageSizes.messaging.whatsappLink;
    const linkOutputPath = path.join(this.config.output.path, 'whatsapp-link.png');

    const linkProcessor = new ImageProcessor(this.sourceImage);
    const linkFile = await linkProcessor.createSocialPreview({
      width: linkWidth,
      height: linkHeight,
      title: options.title, // Only add text if explicitly provided
      description: options.description, // Only add text if explicitly provided
      template: options.template,
      background: this.config.backgroundColor
    });

    const linkFinal = new ImageProcessor(linkFile);
    await linkFinal.save(linkOutputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
    await linkProcessor.cleanup();
    await linkFinal.cleanup();
  }

  /**
   * Generate WeChat preview (500x400)
   */
  private async generateWeChat(options: MessagingOptions): Promise<void> {
    const { width, height } = ImageSizes.messaging.wechat;
    const outputPath = path.join(this.config.output.path, 'wechat.png');

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
    await finalProcessor.cleanup();
  }

  /**
   * Generate Discord preview (1200x630)
   */
  private async generateDiscord(options: MessagingOptions): Promise<void> {
    const { width, height } = ImageSizes.messaging.discord;
    const outputPath = path.join(this.config.output.path, 'discord.png');

    const processor = new ImageProcessor(this.sourceImage);
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title: options.title, // Only add text if explicitly provided
      description: options.description, // Only add text if explicitly provided
      template: options.template,
      background: this.config.backgroundColor
    });

    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
    await processor.cleanup();
    await finalProcessor.cleanup();
  }

  /**
   * Generate Telegram preview (1200x630)
   */
  private async generateTelegram(options: MessagingOptions): Promise<void> {
    const { width, height } = ImageSizes.messaging.telegram;
    const outputPath = path.join(this.config.output.path, 'telegram.png');

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
    await finalProcessor.cleanup();
  }

  /**
   * Generate Signal preview (1200x630)
   */
  private async generateSignal(options: MessagingOptions): Promise<void> {
    const { width, height } = ImageSizes.messaging.signal;
    const outputPath = path.join(this.config.output.path, 'signal.png');

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
    await finalProcessor.cleanup();
  }

  /**
   * Generate Slack preview (1200x630)
   */
  private async generateSlack(options: MessagingOptions): Promise<void> {
    const { width, height } = ImageSizes.messaging.slack;
    const outputPath = path.join(this.config.output.path, 'slack.png');

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
    await finalProcessor.cleanup();
  }

  /**
   * Generate iMessage preview (1200x630)
   */
  private async generateiMessage(options: MessagingOptions): Promise<void> {
    const { width, height } = ImageSizes.messaging.imessage;
    const outputPath = path.join(this.config.output.path, 'imessage.png');

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
    await finalProcessor.cleanup();
  }

  /**
   * Generate Android RCS preview (1200x630)
   */
  private async generateAndroidRCS(options: MessagingOptions): Promise<void> {
    const { width, height } = ImageSizes.messaging.androidRcs;
    const outputPath = path.join(this.config.output.path, 'android-rcs.png');

    const processor = new ImageProcessor(this.sourceImage);
    const socialFile = await processor.createSocialPreview({
      width,
      height,
      title: options.title, // Only add text if explicitly provided
      description: options.description, // Only add text if explicitly provided
      template: options.template,
      background: this.config.backgroundColor
    });
    const finalProcessor = new ImageProcessor(socialFile);
    await finalProcessor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
    await processor.cleanup();
    await finalProcessor.cleanup();
  }

  /**
   * Get HTML meta tags for messaging apps
   */
  getMetaTags(): string[] {
    const { prefix = '/' } = this.config.output;
    return [
      // Standard OpenGraph for most messaging apps
      `<meta property="og:image" content="${prefix}messaging-standard.png" />`,
      `<meta property="og:image:width" content="${ImageSizes.messaging.standard.width}" />`,
      `<meta property="og:image:height" content="${ImageSizes.messaging.standard.height}" />`,
      
      // WhatsApp specific
      `<meta property="og:image:alt" content="WhatsApp preview" />`,
      
      // iMessage/Apple
      `<meta property="apple-mobile-web-app-capable" content="yes" />`,
      `<meta property="apple-mobile-web-app-status-bar-style" content="default" />`,
      
      // Discord
      `<meta name="theme-color" content="${this.config.backgroundColor}" />`,
      
      // Telegram
      `<meta property="telegram:channel" content="${this.config.appName}" />`
    ];
  }

  /**
   * Get Next.js metadata configuration for messaging
   */
  getNextMetadata() {
    const { prefix = '/' } = this.config.output;
    return {
      openGraph: {
        images: [
          {
            url: `${prefix}messaging-standard.png`,
            width: ImageSizes.messaging.standard.width,
            height: ImageSizes.messaging.standard.height
          },
          {
            url: `${prefix}whatsapp-link.png`,
            width: ImageSizes.messaging.whatsappLink.width,
            height: ImageSizes.messaging.whatsappLink.height
          }
        ]
      },
      other: {
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default'
      }
    };
  }
} 