import { promises as fs } from 'fs';
import { generateComprehensiveSocial } from './generate-social';
import { FaviconGenerator } from '../../generators/favicon';
import { PWAGenerator } from '../../generators/pwa';
import { WebSEOGenerator } from '../../generators/web';
import type { PixelForgeConfig } from '../../core/config-validator';
import { getProgressTracker, resetProgressTracker } from '../utils/progress-tracker';
import { SmartMetadataGenerator } from '../../core/smart-metadata-generator';

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
      file.endsWith('.xml') ||
      file.endsWith('.html')
    );

    // Always generate meta tags for all generated files
    const metadataGenerator = new SmartMetadataGenerator(config, {
      generatedFiles: assetFiles,
      outputDir: config.output.path,
      urlPrefix: config.output.prefix || '/images/'
    });

    await metadataGenerator.saveToFile(config.output.path);

    // Complete progress tracking (event-driven already counted all)
    await progressTracker.complete();
    const { current: actualCreated } = progressTracker.getProgress();

    // Section summaries
    const imageExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'];
    const imageCount = assetFiles.filter(f => imageExts.some(ext => f.toLowerCase().endsWith(ext))).length;
    const nonImage = assetFiles.filter(f => !imageExts.some(ext => f.toLowerCase().endsWith(ext)));
    console.log(`📂 All Assets: ${imageCount} files`);

    if (nonImage.includes('manifest.json')) {
      console.log('🧾 Generated manifest.json');
    }
    console.log('📝 Created meta-tags.html');

    console.log(`\n✅ Generated ${actualCreated} files in ${config.output.path}`);
    
    if (options.verbose) {
      console.log('\nGenerated files:');
      assetFiles.forEach(file => console.log(`  📄 ${file}`));
      console.log('  📄 meta-tags.html');
    }
  } catch (error) {
    progressTracker.stop();
    throw error;
  }
}
