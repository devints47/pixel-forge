import { generatePlatforms } from '../../generators/social/platforms/factory';
import { generateMessaging } from '../../generators/social/messaging/factory';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface SocialGeneratorResult {
  name: string;
  files: string[];
}

export interface SocialOptions {
  facebook?: boolean;
  twitter?: boolean;
  linkedin?: boolean;
  instagram?: boolean;
  tiktok?: boolean;
  snapchat?: boolean;
  threads?: boolean;
  whatsapp?: boolean;
  youtube?: boolean;
  pinterest?: boolean;
  bluesky?: boolean;
  mastodon?: boolean;
  discord?: boolean;
  telegram?: boolean;
  signal?: boolean;
  slack?: boolean;
  imessage?: boolean;
  androidrcs?: boolean;
  messaging?: boolean;
  platforms?: boolean;
}

/**
 * Generate comprehensive social media assets for ALL supported platforms
 * Includes a general OpenGraph image plus platform-specific optimizations
 */
export async function generateComprehensiveSocial(
  sourceImage: string,
  config: PixelForgeConfig
): Promise<SocialGeneratorResult[]> {
  const results: SocialGeneratorResult[] = [];

  // Generate a general OpenGraph image for standard social sharing
  const { BaseOpenGraphGenerator } = await import('../../generators/social/base-opengraph');
  const generalGenerator = new BaseOpenGraphGenerator(sourceImage, config);
  await generalGenerator.generate({
    title: config.socialPreview?.title || config.appName,
    description: config.socialPreview?.description || config.description,
    template: config.socialPreview?.template || 'basic',
    filename: 'social-media-general.png',
    width: 1200,
    height: 630
  });
  
  results.push({
    name: 'General Social Media',
    files: ['social-media-general.png']
  });

  // Generate platforms with UNIQUE dimensions only (not 1200x630 standard)
  // Note: Facebook, Bluesky, Mastodon use the general social-media-general.png
  const platformResults = await generatePlatforms(sourceImage, config, {
    facebook: false,     // Uses social-media-general.png (1200x630)
    twitter: true,       // 1200x600 - unique height
    linkedin: true,      // 1200x627 - unique height  
    instagram: true,     // 1080x1080, 1080x1350 - unique dimensions
    tiktok: true,        // 1080x1920 - vertical
    snapchat: true,      // 1080x1920 - vertical
    threads: true,       // 1080x1080 - square
    whatsapp: true,      // 400x400 + 1200x630 - two files
    youtube: true,       // 1280x720, 1080x1920 - unique dimensions
    pinterest: true,     // 1000x1500, 1000x1000 - unique dimensions
    bluesky: false,      // Uses social-media-general.png (1200x630)
    mastodon: false      // Uses social-media-general.png (1200x630)
  });
  results.push(...platformResults);

  // Skip messaging platforms - they all use 1200x630 and should reference social-media-general.png
  // Note: Discord, Telegram, Signal, Slack, iMessage, AndroidRCS all use social-media-general.png

  return results;
}

/**
 * Generate specific social media platforms based on options
 */
export async function generateSpecificSocial(
  sourceImage: string,
  config: PixelForgeConfig,
  options: SocialOptions
): Promise<SocialGeneratorResult[]> {
  const results: SocialGeneratorResult[] = [];

  // Generate platform-specific assets for UNIQUE dimensions only
  // Note: Standard 1200x630 platforms should use social-media-general.png
  const platformResults = await generatePlatforms(sourceImage, config, {
    facebook: false,                    // Always use social-media-general.png
    twitter: options.twitter,           // 1200x600 - unique
    linkedin: options.linkedin,         // 1200x627 - unique
    instagram: options.instagram,       // Multiple unique dimensions
    snapchat: options.snapchat,         // 1080x1920 - unique
    tiktok: options.tiktok,            // 1080x1920 - unique
    whatsapp: options.whatsapp,        // 400x400 + link preview - unique
    youtube: options.youtube,          // Multiple unique dimensions
    pinterest: options.pinterest,      // Multiple unique dimensions
    threads: options.threads,          // 1080x1080 - unique
    bluesky: false,                    // Always use social-media-general.png
    mastodon: false                    // Always use social-media-general.png
  });
  results.push(...platformResults);

  // Skip messaging apps - they all use standard 1200x630 dimensions
  // Users should use social-media-general.png for: Discord, Telegram, Signal, Slack, iMessage, AndroidRCS
  
  // Generate a general social media image if any standard platforms are requested
  if (options.facebook || options.bluesky || options.mastodon || 
      options.discord || options.telegram || options.signal || 
      options.slack || options.imessage || options.androidrcs) {
    
    const { BaseOpenGraphGenerator } = await import('../../generators/social/base-opengraph');
    const generalGenerator = new BaseOpenGraphGenerator(sourceImage, config);
    await generalGenerator.generate({
      title: config.socialPreview?.title || config.appName,
      description: config.socialPreview?.description || config.description,
      template: config.socialPreview?.template || 'basic',
      filename: 'social-media-general.png',
      width: 1200,
      height: 630
    });
    
    results.push({
      name: 'Standard Social Media (Facebook, Bluesky, Mastodon, Messaging)',
      files: ['social-media-general.png']
    });
  }

  // Handle category options using modern factory functions
  if (options.messaging) {
    // All messaging apps use 1200x630 dimensions - just generate social-media-general.png
    const { BaseOpenGraphGenerator } = await import('../../generators/social/base-opengraph');
    const generalGenerator = new BaseOpenGraphGenerator(sourceImage, config);
    await generalGenerator.generate({
      title: config.socialPreview?.title || config.appName,
      description: config.socialPreview?.description || config.description,
      template: config.socialPreview?.template || 'basic',
      filename: 'social-media-general.png',
      width: 1200,
      height: 630
    });
    
    results.push({ 
      name: 'Messaging Apps (Discord, Telegram, Signal, Slack, iMessage, AndroidRCS)', 
      files: ['social-media-general.png'] 
    });
  }

  if (options.platforms) {
    // Generate video/visual platforms with unique dimensions
    const platformResults = await generatePlatforms(sourceImage, config, {
      facebook: false,        // Standard 1200x630 - not a "platform"
      twitter: false,         // Standard social, not a "platform"
      linkedin: false,        // Standard social, not a "platform"
      instagram: true,        // Visual platform
      snapchat: true,         // Video platform
      tiktok: true,          // Video platform
      whatsapp: false,       // Messaging, not a "platform"
      youtube: true,         // Video platform
      pinterest: true,       // Visual platform
      threads: true,         // Visual platform
      bluesky: false,        // Standard social, not a "platform"
      mastodon: false        // Standard social, not a "platform"
    });
    
    results.push(...platformResults.map(result => ({
      ...result,
      name: `${result.name} (Visual/Video Platform)`
    })));
  }

  return results;
}
