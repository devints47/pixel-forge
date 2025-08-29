import { generateAll } from './generate-all';
import { generateWebPackage, generateFaviconOnly, generatePWAOnly, generateSEOOnly } from './generate-web';
import { generateComprehensiveSocial } from './generate-social';
import type { PixelForgeConfig } from '../../core/config-validator';
import { getProgressTracker, resetProgressTracker } from '../utils/progress-tracker';
import { SmartMetadataGenerator } from '../../core/smart-metadata-generator';

export interface GenerateOptions {
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
  // Handle --all flag separately (it manages its own progress tracking)
  if (options.all) {
    await generateAll(sourceImage, config, {
      format: options.format,
      verbose: options.verbose
    });
    return;
  }

  // Initialize and start progress tracker for non-all commands
  resetProgressTracker();
  const progressTracker = getProgressTracker();
  
  try {
    await progressTracker.start(options, config.output.path);

    // Collect all results
    const results: GeneratorResult[] = [];

    // Handle --social flag (comprehensive social media generation)
    if (options.social) {
      const socialResults = await generateComprehensiveSocial(sourceImage, config);
      results.push(...socialResults);
    }

    // Note: Individual platform options removed - only essential social generation available

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

    // Complete progress tracking
    const totalFiles = results.reduce((sum, { files }) => sum + files.length, 0);
    await progressTracker.complete(totalFiles);

    // Always generate meta tags for generated files
    const allGeneratedFiles = results.flatMap(({ files }) => files);
    const metadataGenerator = new SmartMetadataGenerator(config, {
      generatedFiles: allGeneratedFiles,
      outputDir: config.output.path,
      urlPrefix: config.output.prefix || '/images/'
    });

    await metadataGenerator.saveToFile(config.output.path);

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

    console.log(`\n🎉 Total: ${totalFiles} files generated in ${config.output.path}`);
  } catch (error) {
    progressTracker.stop();
    throw error;
  }
}
