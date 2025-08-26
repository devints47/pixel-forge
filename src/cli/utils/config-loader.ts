import { promises as fs } from 'fs';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface CLIOptions {
  output?: string;
  config?: string;
  quality?: string;
  prefix?: string;
  format?: string;
  title?: string;
  description?: string;
  themeColor?: string;
  backgroundColor?: string;
  template?: string;
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

  // Create final configuration with CLI option overrides
  const finalConfig: PixelForgeConfig = {
    appName: config.appName || options.title || 'My App',
    description: config.description || options.description || 'Generated with Pixel Forge',
    themeColor: config.themeColor || options.themeColor || '#000000',
    backgroundColor: config.backgroundColor || options.backgroundColor || '#ffffff',
    
    socialPreview: {
      title: options.title || config.socialPreview?.title || config.appName || 'My App',
      description: options.description || config.socialPreview?.description || config.description || '',
      template: (options.template as 'basic' | 'gradient' | 'custom') || config.socialPreview?.template || 'basic'
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
