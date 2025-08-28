import { promises as fs } from 'fs';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface CLIOptions {
  output?: string;
  config?: string;
  quality?: string;
  prefix?: string;
  format?: string;
  verbose?: boolean;
}

/**
 * Load configuration from file or use defaults, with CLI option overrides
 */
export async function loadConfig(
  configPath?: string, 
  options: CLIOptions = {}
): Promise<PixelForgeConfig> {
  let config: Partial<PixelForgeConfig> = {};

  // Load config file if specified
  if (configPath) {
    try {
      const configContent = await fs.readFile(configPath, 'utf-8');
      config = JSON.parse(configContent) as Partial<PixelForgeConfig>;
    } catch (_error) {
      console.warn(`Warning: Could not load config file ${configPath}. Using defaults.`);
    }
  }

  // Create final configuration with sensible hardcoded defaults
  const finalConfig: PixelForgeConfig = {
    appName: config.appName || 'Generated Asset', // Simple placeholder for metadata
    description: config.description || 'Boilerplate image assets for web applications', // Simple placeholder
    themeColor: config.themeColor || '#007bff', // Hardcoded sensible default
    backgroundColor: config.backgroundColor || '#ffffff', // Hardcoded sensible default
    
    socialPreview: {
      template: config.socialPreview?.template || 'basic'
      // No title/description to avoid text overlays on images
    },

    platforms: {
      social: config.platforms?.social !== false,
      favicon: config.platforms?.favicon !== false,
      pwa: config.platforms?.pwa !== false
    },

    output: {
      path: options.output || config.output?.path || './public/images',
      prefix: options.prefix || config.output?.prefix || '/images/',
      quality: parseInt(options.quality || '90') || config.output?.quality || 90
    }
  };

  return finalConfig;
}
