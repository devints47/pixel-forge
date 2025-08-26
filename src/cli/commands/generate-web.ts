import { FaviconGenerator } from '../../generators/favicon';
import { PWAGenerator } from '../../generators/pwa';
import { WebSEOGenerator } from '../../generators/web';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface GenerateWebOptions {
  format?: 'png' | 'jpeg' | 'both';
  verbose?: boolean;
}

export interface WebGeneratorResult {
  name: string;
  files: string[];
}

/**
 * Generate complete web development package
 * Includes favicons, PWA assets, and SEO/OpenGraph images
 */
export async function generateWebPackage(
  sourceImage: string,
  config: PixelForgeConfig,
  options: GenerateWebOptions = {}
): Promise<WebGeneratorResult> {
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
  
  const allFiles = [
    ...faviconGenerator.getGeneratedFiles(),
    ...pwaGenerator.getGeneratedFiles(),
    ...seoGenerator.getGeneratedFiles()
  ];

  return {
    name: 'Web Development Package',
    files: allFiles
  };
}

/**
 * Generate individual web components
 */
export async function generateFaviconOnly(
  sourceImage: string,
  config: PixelForgeConfig
): Promise<WebGeneratorResult> {
  const generator = new FaviconGenerator(sourceImage, config);
  await generator.generate();
  
  return {
    name: 'Favicons',
    files: generator.getGeneratedFiles()
  };
}

export async function generatePWAOnly(
  sourceImage: string,
  config: PixelForgeConfig
): Promise<WebGeneratorResult> {
  const generator = new PWAGenerator(sourceImage, config);
  await generator.generate();
  
  return {
    name: 'PWA Assets',
    files: generator.getGeneratedFiles()
  };
}

export async function generateSEOOnly(
  sourceImage: string,
  config: PixelForgeConfig,
  options: GenerateWebOptions = {}
): Promise<WebGeneratorResult> {
  const generator = new WebSEOGenerator(sourceImage, config);
  await generator.generate({ 
    outputFormat: options.format || 'png' 
  });
  
  return {
    name: 'SEO Assets',
    files: generator.getGeneratedFiles()
  };
}
