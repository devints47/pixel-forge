import { generateAssets as cliGenerateAssets, type GenerateOptions } from './cli/commands/generate-orchestrator';
import { generateAll as cliGenerateAll } from './cli/commands/generate-all';
import type { PixelForgeConfig } from './core/config-validator';
import { SmartMetadataGenerator } from './core/smart-metadata-generator';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Modern API that mirrors CLI functionality with automatic meta tag generation
 */

export interface PixelForgeOptions {
  // Basic settings
  outputDir?: string;
  urlPrefix?: string;
  
  // Main generators (mirrors CLI flags)
  all?: boolean;
  social?: boolean;
  favicon?: boolean;
  pwa?: boolean;
  web?: boolean;
  seo?: boolean;
  
  // Note: Individual platform options removed - only essential social generation available
  
  // Output options
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
  verbose?: boolean;
}

export interface PixelForgeResult {
  // All generated image files
  images: string[];
  
  // Generated asset files organized by type  
  files: {
    favicon?: string[];
    pwa?: string[];
    social?: string[];
    web?: string[];
    seo?: string[];
  };
  
  // Meta tags (always generated)
  metaTags: {
    html: string;                    // Complete HTML content from meta-tags.html
    filePath: string;                // Path to meta-tags.html file
    tags: string[];                  // Array of individual meta tag strings
  };
  
  // Special files
  manifest?: string;               // Path to manifest.json if generated
  
  // Summary information
  summary: {
    totalFiles: number;            // Total files generated (including meta-tags.html)
    totalImages: number;           // Total image files generated
    outputDirectory: string;       // Where files were saved
    generatedAssets: string[];     // All generated file names
  };
}

/**
 * Creates a PixelForge config from API options
 */
function createConfig(imagePath: string, options: PixelForgeOptions = {}): PixelForgeConfig {
  const outputDir = options.outputDir || './assets';
  
  return {
    appName: 'Generated Asset',
    description: 'Boilerplate image assets for web applications',
    themeColor: '#007bff',
    backgroundColor: '#ffffff',
    output: {
      path: outputDir,
      prefix: options.urlPrefix || '/images/',
      quality: options.quality || 90
    },
    socialPreview: {
      template: 'basic'
    }
  };
}

/**
 * Reads meta-tags.html and parses it into structured format
 */
async function parseMetaTagsFile(filePath: string): Promise<{ html: string; tags: string[] }> {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // Extract just the meta tags from the HTML
    const metaTagMatches = content.match(/<(?:meta|link)[^>]*>/g) || [];
    const tags = metaTagMatches.filter(tag => 
      !tag.includes('<!-- ') && tag.trim().length > 0
    );
    
    return {
      html: content,
      tags
    };
  } catch (error) {
    return {
      html: '',
      tags: []
    };
  }
}

/**
 * 🚀 Main API function that mirrors CLI functionality
 * This is the primary function you should use - it supports all CLI flags and options
 * Meta tags are ALWAYS generated automatically
 */
export async function generateAssets(imagePath: string, options: PixelForgeOptions = {}): Promise<PixelForgeResult> {
  const config = createConfig(imagePath, options);
  
  // Convert API options to CLI options
  const cliOptions: GenerateOptions = {
    all: options.all,
    social: options.social,
    favicon: options.favicon,
    pwa: options.pwa,
    web: options.web,
    seo: options.seo,
    format: options.format as any,
    verbose: options.verbose
  };

  // Use the CLI generate functions (they automatically generate meta tags)
  if (options.all) {
    await cliGenerateAll(imagePath, config, {
      format: options.format as any,
      verbose: options.verbose
    });
  } else {
    await cliGenerateAssets(imagePath, config, cliOptions);
  }

  // Read generated files
  const allFiles = await fs.readdir(config.output.path);
  const imageFiles = allFiles.filter(file => 
    /\.(png|jpg|jpeg|webp|svg)$/i.test(file)
  );
  const iconFile = allFiles.find(file => file.endsWith('.ico'));
  if (iconFile) imageFiles.push(iconFile);
  
  // Parse meta tags file
  const metaTagsPath = path.join(config.output.path, 'meta-tags.html');
  const metaTags = await parseMetaTagsFile(metaTagsPath);
  
  // Check for manifest
  const manifestPath = allFiles.find(file => file === 'manifest.json');
  
  // Organize files by type (basic categorization)
  const files: PixelForgeResult['files'] = {};
  
  if (options.favicon || options.web || options.all) {
    files.favicon = imageFiles.filter(file => 
      file.includes('favicon') || file.includes('apple-touch') || file.includes('safari')
    );
  }
  
  if (options.pwa || options.web || options.all) {
    files.pwa = allFiles.filter(file => 
      file.includes('pwa-') || file.includes('splash-') || file === 'manifest.json'
    );
  }
  
  if (options.social || options.seo || options.web || options.all) {
    files.social = imageFiles.filter(file => 
      file.includes('social-') || file.includes('og-') || file.includes('twitter-') || 
      file.includes('instagram-') || file.includes('opengraph')
    );
  }

  const result: PixelForgeResult = {
    images: imageFiles,
    files,
    metaTags: {
      html: metaTags.html,
      filePath: metaTagsPath,
      tags: metaTags.tags
    },
    manifest: manifestPath ? path.join(config.output.path, manifestPath) : undefined,
    summary: {
      totalFiles: allFiles.length,
      totalImages: imageFiles.length,
      outputDirectory: config.output.path,
      generatedAssets: allFiles
    }
  };

  return result;
}

// Convenience functions that mirror CLI behavior
export async function generateAll(imagePath: string, options: Omit<PixelForgeOptions, 'all'> = {}) {
  return generateAssets(imagePath, { ...options, all: true });
}

export async function generateFavicons(imagePath: string, outputDir: string = './assets') {
  const result = await generateAssets(imagePath, { favicon: true, outputDir });
  return {
    files: result.files.favicon || [],
    metaTags: result.metaTags,
    summary: result.summary
  };
}

export async function generatePWA(imagePath: string, outputDir: string = './assets') {
  const result = await generateAssets(imagePath, { pwa: true, outputDir });
  return {
    files: result.files.pwa || [],
    manifest: result.manifest,
    metaTags: result.metaTags,
    summary: result.summary
  };
}

export async function generateSocial(imagePath: string, outputDir: string = './assets') {
  const result = await generateAssets(imagePath, { social: true, outputDir });
  return {
    files: result.files.social || [],
    metaTags: result.metaTags,
    summary: result.summary
  };
}

export async function generateWeb(imagePath: string, outputDir: string = './assets') {
  const result = await generateAssets(imagePath, { web: true, outputDir });
  return {
    files: {
      favicon: result.files.favicon || [],
      pwa: result.files.pwa || [],
      social: result.files.social || []
    },
    metaTags: result.metaTags,
    manifest: result.manifest,
    summary: result.summary
  };
}

// Export the main function as default
export default generateAssets;
