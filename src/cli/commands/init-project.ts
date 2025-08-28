import { promises as fs } from 'fs';
import path from 'path';
import type { PixelForgeConfig } from '../../core/config-validator';

/**
 * Initialize a new Pixel Forge project with default configuration
 */
export async function initProject(directory: string = '.'): Promise<void> {
  console.log('🎬 Initializing Pixel Forge project...\n');

  // Create directory if it doesn't exist
  await fs.mkdir(directory, { recursive: true });

  const configPath = path.join(directory, 'pixel-forge.config.json');
  const defaultConfig: PixelForgeConfig = {
    appName: 'Generated Asset',
    description: 'Boilerplate image assets for web applications',
    themeColor: '#007bff',  // Hardcoded sensible default
    backgroundColor: '#ffffff',  // Hardcoded sensible default
    
    socialPreview: {
      template: 'basic'
      // No title/description to generate clean images without text overlays
    },

    platforms: {
      social: true,
      favicon: true,
      pwa: true
    },

    output: {
      path: './public/images',
      prefix: '/images/',
      quality: 90
    }
  };

  await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
  console.log(`✅ Created configuration file: ${configPath}`);
  
  console.log('\n📋 Next steps:');
  console.log('  1. Run: npx pixel-forge generate ./logo.png --all');
  console.log('  2. Customize the generated meta tags with your app details');
  console.log('  3. Add the meta tags to your HTML <head> section');
}
