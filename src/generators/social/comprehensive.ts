import { OpenGraphGenerator } from './opengraph';
import { InstagramGenerator } from './instagram';
import { MessagingGenerator } from './messaging';
import { PlatformGenerator } from './platforms';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface ComprehensiveOptions {
  // Base content
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  
  // Platform categories
  includeStandard?: boolean; // Facebook, Twitter, LinkedIn
  includeInstagram?: boolean;
  includeMessaging?: boolean;
  includePlatforms?: boolean; // TikTok, YouTube, Pinterest, etc.
  
  // Specific platform toggles
  platforms?: {
    // Standard social
    facebook?: boolean;
    twitter?: boolean;
    linkedin?: boolean;
    
    // Instagram variations
    instagramStories?: boolean;
    instagramReels?: boolean;
    
    // Messaging apps
    whatsapp?: boolean;
    discord?: boolean;
    telegram?: boolean;
    signal?: boolean;
    slack?: boolean;
    imessage?: boolean;
    androidRCS?: boolean;
    wechat?: boolean;
    
    // Video/Visual platforms
    tiktok?: boolean;
    youtube?: boolean;
    pinterest?: boolean;
    snapchat?: boolean;
    
    // Emerging platforms
    threads?: boolean;
    bluesky?: boolean;
    mastodon?: boolean;
  };
}

export class ComprehensiveSocialGenerator {
  private config: PixelForgeConfig;
  private sourceImage: string;

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.config = config;
    this.sourceImage = sourceImage;
  }

  /**
   * Generate assets for all platforms
   */
  async generate(options: ComprehensiveOptions = {}): Promise<void> {
    const {
      includeStandard = true,
      includeInstagram = true,
      includeMessaging = true,
      includePlatforms = true
    } = options;

    // Generate standard social media formats (Facebook, Twitter, LinkedIn)
    if (includeStandard) {
      // OpenGraphGenerator uses config.socialPreview instead of options
      await this.generateStandardSocial();
    }

    // Generate Instagram specific formats
    if (includeInstagram) {
      await this.generateInstagram(options);
    }

    // Generate messaging app formats
    if (includeMessaging) {
      await this.generateMessaging(options);
    }

    // Generate other platform formats
    if (includePlatforms) {
      await this.generatePlatforms(options);
    }
  }

  /**
   * Generate standard social media formats
   * 
   * Note: OpenGraphGenerator doesn't use the options directly,
   * it uses config.socialPreview instead
   */
  private async generateStandardSocial(): Promise<void> {
    const generator = new OpenGraphGenerator(this.sourceImage, this.config);
    await generator.generate();
  }

  /**
   * Generate Instagram formats
   */
  private async generateInstagram(options: ComprehensiveOptions): Promise<void> {
    const generator = new InstagramGenerator(this.sourceImage, this.config);
    
    await generator.generate({
      title: options.title,
      description: options.description,
      template: options.template
    });
  }

  /**
   * Generate messaging app formats
   */
  private async generateMessaging(options: ComprehensiveOptions): Promise<void> {
    const generator = new MessagingGenerator(this.sourceImage, this.config);
    
    await generator.generate({
      title: options.title,
      description: options.description,
      template: options.template,
      includeWhatsApp: options.platforms?.whatsapp !== false,
      includeDiscord: options.platforms?.discord !== false,
      includeTelegram: options.platforms?.telegram !== false,
      includeSignal: options.platforms?.signal !== false,
      includeSlack: options.platforms?.slack !== false,
      includeiMessage: options.platforms?.imessage !== false,
      includeAndroidRCS: options.platforms?.androidRCS !== false,
      includeWeChat: options.platforms?.wechat === true
    });
  }

  /**
   * Generate other platform formats
   */
  private async generatePlatforms(options: ComprehensiveOptions): Promise<void> {
    const generator = new PlatformGenerator(this.sourceImage, this.config);
    
    await generator.generate({
      title: options.title,
      description: options.description,
      template: options.template,
      includeTikTok: options.platforms?.tiktok !== false,
      includeYouTube: options.platforms?.youtube !== false,
      includePinterest: options.platforms?.pinterest !== false,
      includeSnapchat: options.platforms?.snapchat !== false,
      includeThreads: options.platforms?.threads !== false,
      includeBluesky: options.platforms?.bluesky !== false,
      includeMastodon: options.platforms?.mastodon !== false
    });
  }

  /**
   * Get comprehensive HTML meta tags
   */
  getMetaTags(): string[] {
    const standardGenerator = new OpenGraphGenerator(this.sourceImage, this.config);
    const instagramGenerator = new InstagramGenerator(this.sourceImage, this.config);
    const messagingGenerator = new MessagingGenerator(this.sourceImage, this.config);
    const platformGenerator = new PlatformGenerator(this.sourceImage, this.config);

    return [
      ...standardGenerator.getMetaTags(),
      ...instagramGenerator.getMetaTags(),
      ...messagingGenerator.getMetaTags(),
      ...platformGenerator.getMetaTags()
    ];
  }

  /**
   * Get comprehensive Next.js metadata configuration
   */
  getNextMetadata() {
    const standardGenerator = new OpenGraphGenerator(this.sourceImage, this.config);
    const instagramGenerator = new InstagramGenerator(this.sourceImage, this.config);
    const messagingGenerator = new MessagingGenerator(this.sourceImage, this.config);
    const platformGenerator = new PlatformGenerator(this.sourceImage, this.config);

    const standardMeta = standardGenerator.getNextMetadata();
    const instagramMeta = instagramGenerator.getNextMetadata();
    const messagingMeta = messagingGenerator.getNextMetadata();
    const platformMeta = platformGenerator.getNextMetadata();

    return {
      openGraph: {
        ...standardMeta.openGraph,
        images: [
          ...standardMeta.openGraph?.images || [],
          ...instagramMeta.openGraph?.images || [],
          ...messagingMeta.openGraph?.images || [],
          ...platformMeta.openGraph?.images || []
        ]
      },
      twitter: {
        ...standardMeta.twitter
      },
      other: {
        ...messagingMeta.other,
        ...platformMeta.other
      }
    };
  }

  /**
   * Get generated file summary by scanning the actual output directory
   */
  async getGeneratedFiles(): Promise<string[]> {
    try {
      const fs = await import('fs/promises');
      const files = await fs.readdir(this.config.output.path);
      // Filter for image files that were actually generated
      return files.filter(file => 
        file.endsWith('.png') || 
        file.endsWith('.jpg') || 
        file.endsWith('.jpeg') || 
        file.endsWith('.webp') ||
        file.endsWith('.svg')
      );
    } catch (error) {
      // If directory doesn't exist or can't be read, return empty array
      return [];
    }
  }
} 