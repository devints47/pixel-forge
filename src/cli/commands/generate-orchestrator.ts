import { generateAll } from './generate-all';
import { generateWebPackage, generateFaviconOnly, generatePWAOnly, generateSEOOnly } from './generate-web';
import { generateComprehensiveSocial } from './generate-social';
import type { PixelForgeConfig } from '../../core/config-validator';
import { getProgressTracker, resetProgressTracker } from '../utils/progress-tracker';
import { SmartMetadataGenerator } from '../../core/smart-metadata-generator';
import { makeBackgroundTransparent } from '../../core/transparent-background';
import path from 'path';
import { promises as fs } from 'fs';

export interface GenerateOptions {
  all?: boolean;
  social?: boolean;
  favicon?: boolean;
  pwa?: boolean;
  seo?: boolean;
  web?: boolean;
  transparent?: boolean;
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
    // Post-process transparency for all generated raster images if requested
    if (options.transparent) {
      const imageExts = ['.png', '.jpg', '.jpeg', '.webp', '.avif'];
      const files = await fs.readdir(config.output.path);
      const targets = files
        .filter(f => imageExts.some(ext => f.toLowerCase().endsWith(ext)))
        .map(f => path.join(config.output.path, f));
      for (const filePath of targets) {
        const tmp = `${filePath}.tmp`;
        await makeBackgroundTransparent(filePath, tmp);
        await fs.rename(tmp, filePath);
      }
    }
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

    // Handle transparency flag
    if (options.transparent) {
      if (results.length > 0) {
        // Apply transparency to all generated raster images in-place
        const imageExts = ['.png', '.jpg', '.jpeg', '.webp', '.avif'];
        const filesToProcess = Array.from(new Set(results.flatMap(r => r.files)))
          .filter(name => imageExts.some(ext => name.toLowerCase().endsWith(ext)))
          .map(name => path.join(config.output.path, name));

        for (const filePath of filesToProcess) {
          const tmp = `${filePath}.tmp`;
          await makeBackgroundTransparent(filePath, tmp);
          await fs.rename(tmp, filePath);
        }
      } else {
        // No other generators selected: create a single transparent image
        const outName = 'transparent.png';
        const outPath = path.join(config.output.path, outName);
        await makeBackgroundTransparent(sourceImage, outPath);
        results.push({ name: 'Transparent Background', files: [outName] });
      }
    }

    // If no specific options provided, default to social
    if (results.length === 0) {
      const socialResults = await generateComprehensiveSocial(sourceImage, config);
      results.push(...socialResults);
    }

    // Always generate meta tags for generated files
    const allGeneratedFiles = results.flatMap(({ files }) => files);
    const metadataGenerator = new SmartMetadataGenerator(config, {
      generatedFiles: allGeneratedFiles,
      outputDir: config.output.path,
      urlPrefix: config.output.prefix || '/images/'
    });

    await metadataGenerator.saveToFile(config.output.path);

    // Complete progress tracking (event-driven count already includes all files)
    await progressTracker.complete();

    // Display summary
    console.log('✅ Generation complete!\n');
    const imageExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'];
    results.forEach(({ name, files }) => {
      const imageFiles = files.filter(f => imageExts.some(ext => f.toLowerCase().endsWith(ext)));
      const nonImageFiles = files.filter(f => !imageExts.some(ext => f.toLowerCase().endsWith(ext)));
      console.log(`📂 ${name}: ${imageFiles.length} files`);
      if (options.verbose) {
        imageFiles.slice(0, 5).forEach(file => console.log(`  📄 ${file}`));
        if (imageFiles.length > 5) {
          console.log(`  ... and ${imageFiles.length - 5} more`);
        }
      }
      // Mention special non-image files in context of the section
      if (nonImageFiles.includes('manifest.json')) {
        console.log('🧾 Generated manifest.json');
      }
      if (nonImageFiles.includes('meta-tags.html')) {
        console.log('📝 Created meta-tags.html');
      }
    });

    // Mention special non-image files if present
    // Also print special files if they weren't associated with a section
    const manifestPath = path.join(config.output.path, 'manifest.json');
    try { await fs.access(manifestPath); console.log('🧾 Generated manifest.json'); } catch {}
    console.log('📝 Created meta-tags.html');

    const { current: actualCreated } = progressTracker.getProgress();
    console.log(`\n🎉 Total: ${actualCreated} files generated in ${config.output.path}`);
  } catch (error) {
    progressTracker.stop();
    throw error;
  }
}
