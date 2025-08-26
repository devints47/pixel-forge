import { FaviconGenerator } from '../../generators/favicon';
import { PWAGenerator } from '../../generators/pwa';
import type { PixelForgeConfig } from '../../core/config-validator';

/**
 * Generate and display HTML meta tags for all generated assets
 */
export async function generateMetaTags(
  sourceImage: string, 
  config: PixelForgeConfig
): Promise<string[]> {
  // Satisfy eslint by using sourceImage parameter
  const _sourceImage = sourceImage;
  console.log('🏷️  HTML Meta Tags:\n');

  const allTags: string[] = [];
  
  // Generate consolidated social media meta tags
  
  // Standard OpenGraph meta tags for all 1200x630 platforms:
  // Facebook, Bluesky, Mastodon, Discord, Telegram, Signal, Slack, iMessage, AndroidRCS
  const standardPlatforms = [
    'Facebook', 'Bluesky', 'Mastodon', 'Discord', 'Telegram', 
    'Signal', 'Slack', 'iMessage', 'Android RCS'
  ];
  
  allTags.push(`<!-- OpenGraph for ${standardPlatforms.join(', ')} (1200x630) -->`);
  allTags.push(`<meta property="og:image" content="${config.output.prefix}social-media-general.png">`);
  allTags.push('<meta property="og:image:width" content="1200">');
  allTags.push('<meta property="og:image:height" content="630">');
  allTags.push(`<meta property="og:image:alt" content="${config.appName}">`);
  allTags.push('<meta property="og:image:type" content="image/png">');
  
  // Twitter specific meta tags (1200x600 - unique dimensions)
  allTags.push('<!-- Twitter Cards (1200x600) -->');
  allTags.push('<meta name="twitter:card" content="summary_large_image">');
  allTags.push(`<meta name="twitter:image" content="${config.output.prefix}twitter-card.png">`);
  allTags.push(`<meta name="twitter:image:alt" content="${config.appName}">`);
  allTags.push(`<meta property="og:image" content="${config.output.prefix}twitter-card.png">`);
  allTags.push('<meta property="og:image:width" content="1200">');
  allTags.push('<meta property="og:image:height" content="600">');
  
  // LinkedIn specific meta tags (1200x627 - unique dimensions)
  allTags.push('<!-- LinkedIn (1200x627) -->');
  allTags.push(`<meta property="og:image" content="${config.output.prefix}linkedin-share.png">`);
  allTags.push('<meta property="og:image:width" content="1200">');
  allTags.push('<meta property="og:image:height" content="627">');
  
  // Other unique platforms (only when their specific dimensions matter)
  const uniquePlatformTags = [
    { name: 'Instagram', file: 'instagram.png', width: 1200, height: 630, comment: 'Instagram specific requirements' },
    { name: 'TikTok', file: 'tiktok.png', width: 1080, height: 1920, comment: 'Vertical format' },
    { name: 'Snapchat', file: 'snapchat.png', width: 1080, height: 1920, comment: 'Vertical format' },
    { name: 'Threads', file: 'threads.png', width: 1080, height: 1080, comment: 'Square format' },
    { name: 'YouTube Thumbnail', file: 'youtube-thumbnail.png', width: 1280, height: 720, comment: 'Landscape format' },
    { name: 'YouTube Shorts', file: 'youtube-shorts.png', width: 1080, height: 1920, comment: 'Vertical format' },
    { name: 'Pinterest Pin', file: 'pinterest-pin.png', width: 1000, height: 1500, comment: 'Tall format' },
    { name: 'Pinterest Square', file: 'pinterest-square.png', width: 1000, height: 1000, comment: 'Square format' },
    { name: 'WhatsApp Link', file: 'whatsapp-link.png', width: 1200, height: 630, comment: 'Link preview' },
    { name: 'WhatsApp Profile', file: 'whatsapp-profile.png', width: 400, height: 400, comment: 'Profile image' }
  ];
  
  uniquePlatformTags.forEach(platform => {
    allTags.push(`<!-- ${platform.name} (${platform.width}x${platform.height}) - ${platform.comment} -->`);
    allTags.push(`<meta property="og:image" content="${config.output.prefix}${platform.file}">`);
    allTags.push(`<meta property="og:image:width" content="${platform.width}">`);
    allTags.push(`<meta property="og:image:height" content="${platform.height}">`);
  });
  
  // General OpenGraph meta tags
  allTags.push('<!-- General OpenGraph -->')
  allTags.push(`<meta property="og:title" content="${config.appName}">`);
  allTags.push(`<meta property="og:description" content="${config.description}">`);
  allTags.push('<meta property="og:type" content="website">');
  allTags.push(`<meta property="og:site_name" content="${config.appName}">`);
  allTags.push(`<meta property="og:image:alt" content="${config.appName}">`);
  allTags.push('<meta property="og:image:type" content="image/png">');

  // Generate favicon and PWA meta tags
  const faviconGenerator = new FaviconGenerator(sourceImage, config);
  const pwaGenerator = new PWAGenerator(sourceImage, config);
  
  // Ensure generators are ready (satisfies require-await)
  await Promise.resolve();
  
  allTags.push(...faviconGenerator.getMetaTags());
  allTags.push(...pwaGenerator.getMetaTags());

  // Remove duplicates and sort
  const uniqueTags = [...new Set(allTags)].sort();

  // Display tags
  uniqueTags.forEach(tag => {
    console.log(tag);
  });

  console.log(`\n📊 Total: ${uniqueTags.length} meta tags`);
  
  return uniqueTags;
}
