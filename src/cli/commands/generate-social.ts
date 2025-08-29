import type { PixelForgeConfig } from '../../core/config-validator';

export interface SocialGeneratorResult {
  name: string;
  files: string[];
}

// Social options are simplified - only essential social generation now

/**
 * Generate essential social media assets only (2024 optimized)
 * Focuses on the most important formats without over-generation
 */
export async function generateComprehensiveSocial(
  sourceImage: string,
  config: PixelForgeConfig
): Promise<SocialGeneratorResult[]> {
  const results: SocialGeneratorResult[] = [];

  // Generate ONLY essential social images that cover 90% of use cases
  const { BaseOpenGraphGenerator } = await import('../../generators/social/base-opengraph');
  
  // 1. General OpenGraph (1200x630) - covers Facebook, Twitter, LinkedIn, most platforms
  const generalGenerator = new BaseOpenGraphGenerator(sourceImage, config);
  await generalGenerator.generate({
    filename: 'social-media-general.png',
    width: 1200,
    height: 630
  });
  
  // 2. Instagram Square (1080x1080) - covers Instagram, Threads, profile images
  const instagramGenerator = new BaseOpenGraphGenerator(sourceImage, config);
  await instagramGenerator.generate({
    filename: 'instagram-square.png',
    width: 1080,
    height: 1080
  });
  
  // 3. Vertical Mobile (1080x1920) - covers TikTok, Instagram Stories, Snapchat
  const verticalGenerator = new BaseOpenGraphGenerator(sourceImage, config);
  await verticalGenerator.generate({
    filename: 'social-vertical.png',
    width: 1080,
    height: 1920
  });

  results.push({
    name: 'Essential Social Media',
    files: ['social-media-general.png', 'instagram-square.png', 'social-vertical.png']
  });

  return results;
}

// Note: Specific social platform generation removed - only essential social generation available
