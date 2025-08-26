import { generateAll } from './generate-all';
import { generateWebPackage, generateFaviconOnly, generatePWAOnly, generateSEOOnly } from './generate-web';
import { generateComprehensiveSocial, generateSpecificSocial, type SocialOptions } from './generate-social';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface GenerateOptions extends SocialOptions {
  all?: boolean;
  social?: boolean;
  favicon?: boolean;
  pwa?: boolean;
  seo?: boolean;
  web?: boolean;
  format?: 'png' | 'jpeg' | 'both';
  verbose?: boolean;
}

export interface GeneratorResult {
  name: string;
  files: string[];
}

/**
 * Main orchestrator for generation commands
 * Routes to appropriate specialized generators based on options
 */
export async function generateAssets(
  sourceImage: string,
  config: PixelForgeConfig,
  options: GenerateOptions
): Promise<void> {
  // Handle --all flag
  if (options.all) {
    await generateAll(sourceImage, config, {
      format: options.format,
      verbose: options.verbose
    });
    return;
  }

  // Collect all results
  const results: GeneratorResult[] = [];

  // Handle --social flag (comprehensive social media generation)
  if (options.social) {
    const socialResults = await generateComprehensiveSocial(sourceImage, config);
    results.push(...socialResults);
  }

  // Handle specific social media platforms
  const hasSpecificSocialOptions = options.facebook || options.twitter || options.linkedin || 
    options.instagram || options.tiktok || options.whatsapp || options.youtube || 
    options.pinterest || options.imessage || options.discord || options.telegram || 
    options.signal || options.slack || options.androidrcs || options.snapchat || 
    options.threads || options.bluesky || options.mastodon || options.messaging || 
    options.platforms;

  if (hasSpecificSocialOptions) {
    const socialResults = await generateSpecificSocial(sourceImage, config, options);
    results.push(...socialResults);
  }

  // Handle web development packages
  if (options.web) {
    const webResult = await generateWebPackage(sourceImage, config, {
      format: options.format,
      verbose: options.verbose
    });
    results.push(webResult);
  }

  // Handle individual web components
  if (options.favicon) {
    const faviconResult = await generateFaviconOnly(sourceImage, config);
    results.push(faviconResult);
  }

  if (options.pwa) {
    const pwaResult = await generatePWAOnly(sourceImage, config);
    results.push(pwaResult);
  }

  if (options.seo) {
    const seoResult = await generateSEOOnly(sourceImage, config, {
      format: options.format,
      verbose: options.verbose
    });
    results.push(seoResult);
  }

  // If no specific options provided, default to social
  if (results.length === 0) {
    const socialResults = await generateComprehensiveSocial(sourceImage, config);
    results.push(...socialResults);
  }

  // Display summary
  console.log('✅ Generation complete!\n');
  results.forEach(({ name, files }) => {
    console.log(`📂 ${name}: ${files.length} files`);
    if (options.verbose) {
      files.slice(0, 5).forEach(file => console.log(`  📄 ${file}`));
      if (files.length > 5) {
        console.log(`  ... and ${files.length - 5} more`);
      }
    }
  });

  const totalFiles = results.reduce((sum, { files }) => sum + files.length, 0);
  console.log(`\n🎉 Total: ${totalFiles} files generated in ${config.output.path}`);
}
