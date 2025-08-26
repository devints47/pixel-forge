#!/usr/bin/env node

import { program } from 'commander';
import path from 'path';
import { promises as fs } from 'fs';
import {
  generateAssets,
  generateMetaTags,
  initProject,
  loadConfig,
  checkImageMagickAvailability,
  validateSourceImage,
  type GenerateOptions,
  type CLIOptions
} from './commands';
import packageJson from '../../package.json';








// CLI Program setup
program
  .name('pixel-forge')
  .description('Generate comprehensive social media assets, favicons, and PWA icons')
  .version(packageJson.version);

// Generate command
program
  .command('generate <source>')
  .description('Generate images from source file (supports PNG, JPEG, WebP, AVIF, TIFF, GIF, SVG, BMP)')
  .option('-o, --output <path>', 'Output directory', './public/images')
  .option('-c, --config <path>', 'Config file path')
  .option('-q, --quality <number>', 'Image quality (1-100)', '90')
  .option('-p, --prefix <path>', 'URL prefix for generated files', '/images/')
  .option('-f, --format <format>', 'Output format (png|jpeg|webp|avif|tiff|gif)', 'png')
  .option('--all', 'Generate all asset types')
  .option('--social', 'Generate comprehensive social media assets for ALL supported platforms (includes general OpenGraph image plus platform-specific images)')
  .option('--facebook', 'Generate Facebook assets only')
  .option('--twitter', 'Generate Twitter assets only')
  .option('--linkedin', 'Generate LinkedIn assets only')
  .option('--instagram', 'Generate Instagram assets only')
  .option('--tiktok', 'Generate TikTok assets only')
  .option('--whatsapp', 'Generate WhatsApp assets only')
  .option('--youtube', 'Generate YouTube assets only')
  .option('--pinterest', 'Generate Pinterest assets only')
  .option('--imessage', 'Generate iMessage assets only')
  .option('--discord', 'Generate Discord assets only')
  .option('--telegram', 'Generate Telegram assets only')
  .option('--signal', 'Generate Signal assets only')
  .option('--slack', 'Generate Slack assets only')
  .option('--androidrcs', 'Generate Android RCS assets only')
  .option('--snapchat', 'Generate Snapchat assets only')
  .option('--threads', 'Generate Threads assets only')
  .option('--bluesky', 'Generate Bluesky assets only')
  .option('--mastodon', 'Generate Mastodon assets only')
  .option('--messaging', 'Generate messaging app assets')
  .option('--platforms', 'Generate video/visual platform assets')
  .option('--favicon', 'Generate favicon assets only')
  .option('--pwa', 'Generate PWA assets only')
  .option('--seo', 'Generate SEO/OpenGraph assets only')
  .option('--web', 'Generate complete web development package (favicon + PWA + SEO)')
  .option('-t, --title <text>', 'App title')
  .option('-d, --description <text>', 'App description')
  .option('--theme-color <color>', 'Theme color (hex)', '#000000')
  .option('--background-color <color>', 'Background color (hex)', '#ffffff')
  .option('--template <type>', 'Template type (basic|gradient|custom)', 'basic')
  .option('-v, --verbose', 'Verbose output')
  .action(async (source: string, options: CLIOptions) => {
    try {
      // Check ImageMagick availability first
      await checkImageMagickAvailability();
      
      // Validate source file
      const sourcePath = path.resolve(source);
      await fs.access(sourcePath);
      validateSourceImage(sourcePath);

      console.log(`📷 Source image: ${sourcePath}`);
      
      // Load configuration
      const config = await loadConfig(options.config, options);
      
      // Ensure output directory exists
      await fs.mkdir(config.output.path, { recursive: true });
      
      console.log(`📁 Output directory: ${config.output.path}`);
      console.log(`🎨 Theme: ${config.themeColor} | Background: ${config.backgroundColor}\n`);

      // Generate assets using the new orchestrator
      await generateAssets(sourcePath, config, options as GenerateOptions);

    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Meta tags command
program
  .command('meta <source>')
  .description('Generate HTML meta tags for the assets')
  .option('-c, --config <path>', 'Config file path')
  .option('-p, --prefix <path>', 'URL prefix for generated files', '/images/')
  .action(async (source: string, options: CLIOptions) => {
    try {
      const sourcePath = path.resolve(source);
      await fs.access(sourcePath);

      const config = await loadConfig(options.config, options);
      await generateMetaTags(sourcePath, config);

    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Init command
program
  .command('init [directory]')
  .description('Initialize a new Social Forge project')
  .action(async (directory?: string) => {
    try {
      await initProject(directory);
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Info command
program
  .command('info')
  .description('Show platform coverage and capabilities')
  .action(() => {
    console.log('🌍 Pixel Forge - Complete Web Development Toolkit\n');
    
    console.log('🚀 Quick Start for Web Developers:');
    console.log('  npx pixel-forge generate logo.png --web     # Complete web package');
    console.log('  npx pixel-forge generate logo.png --seo     # SEO & social sharing');
    console.log('  npx pixel-forge generate logo.png --favicon # All favicon formats');
    console.log('  npx pixel-forge generate logo.png --pwa     # PWA assets');
    
    console.log('\n🔧 Web Development Assets:');
    console.log('  ✅ SEO Images - OpenGraph (og-image.png), Twitter Cards');
    console.log('  ✅ Favicons - ICO, PNG, SVG, Apple Touch Icons');
    console.log('  ✅ PWA Assets - App icons, manifest.json, splash screens');
    console.log('  ✅ Safari Support - Pinned tab SVG, Apple optimizations');
    console.log('  ✅ Microsoft Support - Windows tiles, browserconfig.xml');
    
    console.log('\n📱 Major Social Networks:');
    console.log('  ✅ Facebook (1200x630) - OpenGraph optimized');
    console.log('  ✅ Twitter/X (1200x600) - Twitter Cards support');
    console.log('  ✅ LinkedIn (1200x627) - Professional networking');
    console.log('  ✅ Instagram (Multiple) - Square, Portrait, Stories, Reels');
    console.log('  ✅ TikTok (1080x1920) - Vertical video format');
    console.log('  ✅ YouTube (1280x720) - Thumbnails and Shorts');
    console.log('  ✅ Pinterest (1000x1500) - Pin and board optimized');
    
    console.log('\n💬 Messaging Applications:');
    console.log('  ✅ WhatsApp (400x400 + Preview) - Profile and sharing');
    console.log('  ✅ iMessage (1200x630) - iOS sharing');
    console.log('  ✅ Discord (1200x630) - Server sharing');
    console.log('  ✅ Telegram (1200x630) - Message sharing');
    console.log('  ✅ Signal (1200x630) - Privacy-focused');
    console.log('  ✅ Slack (1200x630) - Workplace communication');
    console.log('  ✅ Android RCS (1200x630) - Rich messaging');
    
    console.log('\n🌟 Emerging Platforms:');
    console.log('  ✅ Threads (1080x1080) - Meta\'s Twitter alternative');
    console.log('  ✅ Bluesky (1200x630) - Decentralized social network');
    console.log('  ✅ Mastodon (1200x630) - Federated social media');
    
    console.log('\n📊 Statistics:');
    console.log('  • 25+ platform formats supported');
    console.log('  • Complete web development coverage');
    console.log('  • Zero external dependencies (uses Sharp)');
    console.log('  • Framework-agnostic with Next.js helpers');
    console.log('  • TypeScript-first with full type safety');
    
    console.log('\n🖼️ Supported Image Formats:');
    console.log('  • Input: PNG, JPEG, WebP, AVIF, TIFF, GIF, SVG, BMP');
    console.log('  • Output: PNG, JPEG, WebP, AVIF, TIFF, GIF, HEIF');
    console.log('  • Auto-conversion between formats');
    
    console.log('\n🎯 Platform-Specific Generation:');
    console.log('  npx pixel-forge generate logo.png --facebook --twitter    # Multiple platforms');
    console.log('  npx pixel-forge generate logo.png --messaging             # All messaging apps');
    console.log('  npx pixel-forge generate logo.png --platforms             # Video platforms');
    console.log('  npx pixel-forge generate logo.png --all                   # Everything');
    
    console.log('\n💡 Perfect for:');
    console.log('  • Next.js, React, Vue, Angular applications');
    console.log('  • Static sites (Gatsby, Nuxt, SvelteKit)');
    console.log('  • Progressive Web Apps (PWAs)');
    console.log('  • E-commerce and marketing sites');
    console.log('  • Any web application needing social sharing');
  });

// Parse CLI arguments
program.parse();

export { program }; 