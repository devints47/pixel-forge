import { promises as fs } from 'fs';
import { generateComprehensiveSocial } from './generate-social';
import { FaviconGenerator } from '../../generators/favicon';
import { PWAGenerator } from '../../generators/pwa';
import { WebSEOGenerator } from '../../generators/web';
import type { PixelForgeConfig } from '../../core/config-validator';
import { getProgressTracker, resetProgressTracker } from '../utils/progress-tracker';

export interface GenerateAllOptions {
  format?: 'png' | 'jpeg' | 'both';
  verbose?: boolean;
}

/**
 * Generate all assets for comprehensive coverage
 * This command creates everything: social media, favicons, PWA, and SEO assets
 */
export async function generateAll(
  sourceImage: string, 
  config: PixelForgeConfig, 
  options: GenerateAllOptions = {}
): Promise<void> {
  console.log('🚀 Generating all assets...\n');
  
  // Initialize progress tracker for --all flag
  resetProgressTracker();
  const progressTracker = getProgressTracker();
  
  try {
    // Start progress tracking with --all options
    await progressTracker.start({ all: true }, config.output.path);

    // Generate comprehensive social media assets using modern factory functions
    const socialResults = await generateComprehensiveSocial(sourceImage, config);

  // Generate favicon assets
  const faviconGenerator = new FaviconGenerator(sourceImage, config);
  await faviconGenerator.generate();

  // Generate PWA assets
  const pwaGenerator = new PWAGenerator(sourceImage, config);
  await pwaGenerator.generate();

  // Generate SEO assets
  const seoGenerator = new WebSEOGenerator(sourceImage, config);
  await seoGenerator.generate({ 
    outputFormat: options.format || 'png' 
  });

    // Count actual generated files to avoid double-counting
    const files = await fs.readdir(config.output.path);
    const assetFiles = files.filter(file => 
      file.endsWith('.png') || 
      file.endsWith('.jpg') || 
      file.endsWith('.jpeg') || 
      file.endsWith('.webp') ||
      file.endsWith('.svg') ||
      file.endsWith('.ico') ||
      file.endsWith('.json') ||
      file.endsWith('.xml')
    );

    // Complete progress tracking
    await progressTracker.complete(assetFiles.length);

    console.log(`✅ Generated ${assetFiles.length} files in ${config.output.path}`);
    
    if (options.verbose) {
      console.log('\nGenerated files:');
      assetFiles.forEach(file => console.log(`  📄 ${file}`));
    }
  } catch (error) {
    progressTracker.stop();
    throw error;
  }
}
