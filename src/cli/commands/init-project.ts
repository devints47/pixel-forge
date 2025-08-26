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
    appName: 'My App',
    description: 'My awesome application',
    themeColor: '#000000',
    backgroundColor: '#ffffff',
    
    socialPreview: {
      title: 'My App',
      description: 'My awesome application',
      template: 'basic'
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
  console.log('  1. Edit pixel-forge.config.json with your app details');
  console.log('  2. Run: npx pixel-forge generate ./logo.png --all');
  console.log('  3. Add the generated meta tags to your HTML');
}
