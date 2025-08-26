#!/usr/bin/env node

import { program } from 'commander';
import path from 'path';
import { promises as fs } from 'fs';
import chalk from 'chalk';
import { ComprehensiveSocialGenerator } from '../generators/social/comprehensive';
import { FacebookGenerator } from '../generators/social/facebook';
import { TwitterGenerator } from '../generators/social/twitter';
import { LinkedInGenerator } from '../generators/social/linkedin';
import { TikTokGenerator } from '../generators/social/tiktok';
import { WhatsAppGenerator } from '../generators/social/whatsapp';
import { InstagramGenerator } from '../generators/social/instagram';
import { FaviconGenerator } from '../generators/favicon/favicon';
import { PWAGenerator } from '../generators/pwa/pwa';
import { WebSEOGenerator } from '../generators/web/seo';
import { type PixelForgeConfig } from '../core/config-validator';
import { SUPPORTED_INPUT_FORMATS, ImageProcessor } from '../core/image-processor';
import readline from 'readline';

// Import package.json as a module instead of using require
import packageJson from '../../package.json';

/**
 * Check if ImageMagick is available and show helpful error if not
 */
async function checkImageMagickAvailability(): Promise<void> {
  const isAvailable = await ImageProcessor.checkImageMagick();
  if (!isAvailable) {
    // Offer fallback to Jimp with a warning, or guide to install ImageMagick
    console.log(chalk.yellow('\n⚠️  ImageMagick not found.'));
    console.log(chalk.gray('For best quality and full format support, install ImageMagick:'));
    console.log(chalk.cyan('  macOS:'), '        brew install imagemagick');
    console.log(chalk.cyan('  Ubuntu/Debian:'), ' sudo apt-get install imagemagick');
    console.log(chalk.cyan('  Windows:'), '      choco install imagemagick');
    console.log(chalk.cyan('  Download:'), '     https://imagemagick.org/script/download.php\n');

    // Interactive prompt only when running in a TTY; otherwise default to Jimp fallback
    const shouldPrompt = process.stdin.isTTY && process.stdout.isTTY;
    if (!shouldPrompt) {
      console.log(chalk.yellow('Continuing with Jimp fallback (reduced quality/feature set).'));
      ImageProcessor.setEngine('jimp');
      return;
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer: string = await new Promise((resolve) => {
      rl.question(
        chalk.yellow('Proceed with fallback engine (Jimp) now? [Y/n] '),
        (res) => resolve(res.trim().toLowerCase())
      );
    });
    rl.close();

    if (answer === 'n' || answer === 'no') {
      console.log(chalk.red('Exiting. Please install ImageMagick and re-run the command.'));
      process.exit(1);
    }

    console.log(chalk.yellow('Using Jimp fallback engine. Note: some formats/features may be limited.'));
    ImageProcessor.setEngine('jimp');
  } else {
    ImageProcessor.setEngine('magick');
  }
}

interface CLIOptions {
  output?: string;
  config?: string;
  quality?: string;
  prefix?: string;
  format?: string;
  all?: boolean;
  social?: boolean;
  facebook?: boolean;
  twitter?: boolean;
  linkedin?: boolean;
  instagram?: boolean;
  tiktok?: boolean;
  whatsapp?: boolean;
  youtube?: boolean;
  pinterest?: boolean;
  imessage?: boolean;
  discord?: boolean;
  telegram?: boolean;
  signal?: boolean;
  slack?: boolean;
  androidrcs?: boolean;
  snapchat?: boolean;
  threads?: boolean;
  bluesky?: boolean;
  mastodon?: boolean;
  messaging?: boolean;
  platforms?: boolean;
  favicon?: boolean;
  pwa?: boolean;
  seo?: boolean;
  web?: boolean;
  title?: string;
  description?: string;
  themeColor?: string;
  backgroundColor?: string;
  template?: string;
  verbose?: boolean;
}

/**
 * Check if the file is a supported image format
 */
function isValidImageFormat(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return SUPPORTED_INPUT_FORMATS.includes(ext);
}

/**
 * Load configuration from file or use defaults
 */
async function loadConfig(configPath?: string, options: CLIOptions = {}): Promise<PixelForgeConfig> {
  let config: Partial<PixelForgeConfig> = {};

  // Load config file if specified
  if (configPath) {
    try {
      const configContent = await fs.readFile(configPath, 'utf-8');
      // Fix unsafe assignment by using a type assertion
      config = JSON.parse(configContent) as Partial<PixelForgeConfig>;
    } catch (_error) {
      console.warn(`Warning: Could not load config file ${configPath}. Using defaults.`);
    }
  }

  // Override with CLI options
  const finalConfig: PixelForgeConfig = {
    appName: config.appName || options.title || 'My App',
    description: config.description || options.description || 'Generated with Social Forge',
    themeColor: config.themeColor || options.themeColor || '#000000',
    backgroundColor: config.backgroundColor || options.backgroundColor || '#ffffff',
    
    socialPreview: {
      title: options.title || config.socialPreview?.title || config.appName || 'My App',
      description: options.description || config.socialPreview?.description || config.description || '',
      template: (options.template as 'basic' | 'gradient' | 'custom') || config.socialPreview?.template || 'basic'
    },

    platforms: {
      social: options.social || config.platforms?.social !== false,
      favicon: options.favicon || config.platforms?.favicon !== false,
      pwa: options.pwa || config.platforms?.pwa !== false
    },

    output: {
      path: options.output || config.output?.path || './public/images',
      prefix: options.prefix || config.output?.prefix || '/images/',
      quality: parseInt(options.quality || '90') || config.output?.quality || 90
    }
  };

  // Return the final configuration
  return finalConfig;
}

/**
 * Generate all assets
 */
async function generateAll(sourceImage: string, config: PixelForgeConfig, options: CLIOptions) {
  console.log('🚀 Generating all assets...\n');

  const generator = new ComprehensiveSocialGenerator(sourceImage, config);
  
  await generator.generate({
    includeStandard: true,
    includeInstagram: true,
    includeMessaging: true,
    includePlatforms: true
  });

  // Generate favicon
  const faviconGenerator = new FaviconGenerator(sourceImage, config);
  await faviconGenerator.generate();

  // Generate PWA assets
  const pwaGenerator = new PWAGenerator(sourceImage, config);
  await pwaGenerator.generate();

  // Generate SEO assets
  const seoGenerator = new WebSEOGenerator(sourceImage, config);
  await seoGenerator.generate({ 
    outputFormat: (options.format as 'png' | 'jpeg' | 'both') || 'png' 
  });

  const files = [
    ...await generator.getGeneratedFiles(),
    ...faviconGenerator.getGeneratedFiles(),
    ...pwaGenerator.getGeneratedFiles(),
    ...seoGenerator.getGeneratedFiles()
  ];

  console.log(`✅ Generated ${files.length} files in ${config.output.path}`);
  
  if (options.verbose) {
    console.log('\nGenerated files:');
    files.forEach(file => console.log(`  📄 ${file}`));
  }
}

/**
 * Generate specific platform assets
 */
async function generateSpecific(sourceImage: string, config: PixelForgeConfig, options: CLIOptions) {
  interface GeneratorInfo {
    name: string;
    generator: FacebookGenerator | TwitterGenerator | LinkedInGenerator | InstagramGenerator | TikTokGenerator | WhatsAppGenerator | ComprehensiveSocialGenerator | FaviconGenerator | PWAGenerator | WebSEOGenerator;
    files: string[];
  }
  
  const generators: GeneratorInfo[] = [];

  // Social media platforms
  if (options.social) {
    // Generate comprehensive social media assets (Facebook, Twitter, LinkedIn, Instagram, TikTok, Snapchat)
    const facebookGenerator = new FacebookGenerator(sourceImage, config);
    await facebookGenerator.generate({ includeStandard: true, includeSquare: true });
    generators.push({ name: 'Facebook', generator: facebookGenerator, files: facebookGenerator.getGeneratedFiles() });

    const twitterGenerator = new TwitterGenerator(sourceImage, config);
    await twitterGenerator.generate({ includeStandard: true, includeSquare: true });
    generators.push({ name: 'Twitter', generator: twitterGenerator, files: twitterGenerator.getGeneratedFiles() });

    const linkedinGenerator = new LinkedInGenerator(sourceImage, config);
    await linkedinGenerator.generate({ includeStandard: true, includeCompany: true });
    generators.push({ name: 'LinkedIn', generator: linkedinGenerator, files: linkedinGenerator.getGeneratedFiles() });

    const instagramGenerator = new InstagramGenerator(sourceImage, config);
    await instagramGenerator.generate({ includeStories: true, includeReels: true });
    generators.push({ name: 'Instagram', generator: instagramGenerator, files: instagramGenerator.getGeneratedFiles() });

    const tiktokGenerator = new TikTokGenerator(sourceImage, config);
    await tiktokGenerator.generate({ includeVertical: true, includeProfile: true });
    generators.push({ name: 'TikTok', generator: tiktokGenerator, files: tiktokGenerator.getGeneratedFiles() });

    // Add Snapchat via PlatformGenerator
    const platformGenerator = new ComprehensiveSocialGenerator(sourceImage, config);
    await platformGenerator.generate({ 
      includeStandard: false, 
      includeInstagram: false, 
      includeMessaging: false, 
      includePlatforms: true,
      platforms: { snapchat: true, tiktok: false, youtube: false, pinterest: false, threads: false, bluesky: false, mastodon: false }
    });
    generators.push({ name: 'Snapchat', generator: platformGenerator, files: ['snapchat.png'] });
  }

  if (options.facebook) {
    const generator = new FacebookGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'Facebook', generator, files: generator.getGeneratedFiles() });
  }

  if (options.twitter) {
    const generator = new TwitterGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'Twitter', generator, files: generator.getGeneratedFiles() });
  }

  if (options.linkedin) {
    const generator = new LinkedInGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'LinkedIn', generator, files: generator.getGeneratedFiles() });
  }

  if (options.instagram) {
    const generator = new InstagramGenerator(sourceImage, config);
    await generator.generate({ includeStories: true, includeReels: true });
    generators.push({ name: 'Instagram', generator, files: generator.getGeneratedFiles() });
  }

  if (options.snapchat) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({ 
      includeStandard: false, 
      includeInstagram: false, 
      includeMessaging: false, 
      includePlatforms: true,
      platforms: { snapchat: true, tiktok: false, youtube: false, pinterest: false, threads: false, bluesky: false, mastodon: false }
    });
    generators.push({ name: 'Snapchat', generator, files: ['snapchat.png'] });
  }

  if (options.tiktok) {
    const generator = new TikTokGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'TikTok', generator, files: generator.getGeneratedFiles() });
  }

  if (options.whatsapp) {
    const generator = new WhatsAppGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'WhatsApp', generator, files: generator.getGeneratedFiles() });
  }

  if (options.youtube) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({
      includeStandard: false,
      includeInstagram: false,
      includeMessaging: false,
      includePlatforms: true,
      platforms: {
        youtube: true,
        tiktok: false,
        pinterest: false
      }
    });
    generators.push({ name: 'YouTube', generator, files: ['youtube-thumbnail.png', 'youtube-shorts.png'] });
  }

  if (options.pinterest) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({
      includeStandard: false,
      includeInstagram: false,
      includeMessaging: false,
      includePlatforms: true,
      platforms: {
        youtube: false,
        tiktok: false,
        pinterest: true
      }
    });
    generators.push({ name: 'Pinterest', generator, files: ['pinterest-pin.png', 'pinterest-board.png'] });
  }

  // Messaging platforms
  if (options.imessage) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({
      includeStandard: false,
      includeInstagram: false,
      includeMessaging: true,
      includePlatforms: false,
      platforms: {
        imessage: true,
        whatsapp: false,
        discord: false,
        telegram: false,
        signal: false,
        slack: false
      }
    });
    generators.push({ name: 'iMessage', generator, files: ['imessage.png'] });
  }

  if (options.discord) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({
      includeStandard: false,
      includeInstagram: false,
      includeMessaging: true,
      includePlatforms: false,
      platforms: {
        imessage: false,
        whatsapp: false,
        discord: true,
        telegram: false,
        signal: false,
        slack: false
      }
    });
    generators.push({ name: 'Discord', generator, files: ['discord.png'] });
  }

  if (options.telegram) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({
      includeStandard: false,
      includeInstagram: false,
      includeMessaging: true,
      includePlatforms: false,
      platforms: {
        imessage: false,
        whatsapp: false,
        discord: false,
        telegram: true,
        signal: false,
        slack: false
      }
    });
    generators.push({ name: 'Telegram', generator, files: ['telegram.png'] });
  }

  if (options.signal) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({
      includeStandard: false,
      includeInstagram: false,
      includeMessaging: true,
      includePlatforms: false,
      platforms: {
        imessage: false,
        whatsapp: false,
        discord: false,
        telegram: false,
        signal: true,
        slack: false
      }
    });
    generators.push({ name: 'Signal', generator, files: ['signal.png'] });
  }

  if (options.slack) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({
      includeStandard: false,
      includeInstagram: false,
      includeMessaging: true,
      includePlatforms: false,
      platforms: {
        imessage: false,
        whatsapp: false,
        discord: false,
        telegram: false,
        signal: false,
        slack: true
      }
    });
    generators.push({ name: 'Slack', generator, files: ['slack.png'] });
  }

  if (options.androidrcs) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({
      includeStandard: false,
      includeInstagram: false,
      includeMessaging: true,
      includePlatforms: false,
      platforms: {
        androidRCS: true,
        whatsapp: false,
        discord: false,
        telegram: false,
        signal: false,
        slack: false,
        imessage: false
      }
    });
    generators.push({ name: 'Android RCS', generator, files: ['android-rcs.png'] });
  }

  if (options.threads) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({
      includeStandard: false,
      includeInstagram: false,
      includeMessaging: false,
      includePlatforms: true,
      platforms: {
        threads: true,
        youtube: false,
        tiktok: false,
        pinterest: false,
        bluesky: false,
        mastodon: false
      }
    });
    generators.push({ name: 'Threads', generator, files: ['threads.png'] });
  }

  if (options.bluesky) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({
      includeStandard: false,
      includeInstagram: false,
      includeMessaging: false,
      includePlatforms: true,
      platforms: {
        threads: false,
        youtube: false,
        tiktok: false,
        pinterest: false,
        bluesky: true,
        mastodon: false
      }
    });
    generators.push({ name: 'Bluesky', generator, files: ['bluesky.png'] });
  }

  if (options.mastodon) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({
      includeStandard: false,
      includeInstagram: false,
      includeMessaging: false,
      includePlatforms: true,
      platforms: {
        threads: false,
        youtube: false,
        tiktok: false,
        pinterest: false,
        bluesky: false,
        mastodon: true
      }
    });
    generators.push({ name: 'Mastodon', generator, files: ['mastodon.png'] });
  }

  // Category generators


  if (options.messaging) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({ includeStandard: false, includeInstagram: false, includeMessaging: true, includePlatforms: false });
    generators.push({ name: 'Messaging Apps', generator, files: await generator.getGeneratedFiles() });
  }

  if (options.platforms) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({ includeStandard: false, includeInstagram: false, includeMessaging: false, includePlatforms: true });
    generators.push({ name: 'Video Platforms', generator, files: await generator.getGeneratedFiles() });
  }

  if (options.favicon) {
    const generator = new FaviconGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'Favicons', generator, files: generator.getGeneratedFiles() });
  }

  if (options.pwa) {
    const generator = new PWAGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'PWA Assets', generator, files: generator.getGeneratedFiles() });
  }

  if (options.seo) {
    const generator = new WebSEOGenerator(sourceImage, config);
    await generator.generate({ 
      outputFormat: (options.format as 'png' | 'jpeg' | 'both') || 'png' 
    });
    generators.push({ name: 'SEO Assets', generator, files: generator.getGeneratedFiles() });
  }

  if (options.web) {
    // Generate complete web development package
    const faviconGenerator = new FaviconGenerator(sourceImage, config);
    await faviconGenerator.generate();
    
    const pwaGenerator = new PWAGenerator(sourceImage, config);
    await pwaGenerator.generate();
    
    const seoGenerator = new WebSEOGenerator(sourceImage, config);
    await seoGenerator.generate({ 
      outputFormat: (options.format as 'png' | 'jpeg' | 'both') || 'png' 
    });
    
    generators.push({ 
      name: 'Web Development Package', 
      generator: seoGenerator, 
      files: [
        ...faviconGenerator.getGeneratedFiles(),
        ...pwaGenerator.getGeneratedFiles(),
        ...seoGenerator.getGeneratedFiles()
      ] 
    });
  }

  // Summary
  console.log('✅ Generation complete!\n');
  generators.forEach(({ name, files }) => {
    console.log(`📂 ${name}: ${files.length} files`);
    if (options.verbose) {
      files.slice(0, 5).forEach(file => console.log(`  📄 ${file}`));
      if (files.length > 5) {
        console.log(`  ... and ${files.length - 5} more`);
      }
    }
  });

  const totalFiles = generators.reduce((sum, { files }) => sum + files.length, 0);
  console.log(`\n🎉 Total: ${totalFiles} files generated in ${config.output.path}`);
}

/**
 * Show meta tags for generated assets
 */
async function showMetaTags(sourceImage: string, config: PixelForgeConfig, _options: CLIOptions) {
  console.log('🏷️  HTML Meta Tags:\n');

  const generators = [
    new ComprehensiveSocialGenerator(sourceImage, config),
    new FaviconGenerator(sourceImage, config),
    new PWAGenerator(sourceImage, config)
  ];

  const allTags: string[] = [];
  
  // Add an await to fix the require-await warning
  await Promise.all(generators.map(generator => {
    const tags = generator.getMetaTags();
    allTags.push(...tags);
    return Promise.resolve(); // Return a resolved promise for Promise.all
  }));

  // Remove duplicates and sort
  const uniqueTags = [...new Set(allTags)].sort();

  uniqueTags.forEach(tag => {
    console.log(tag);
  });

  console.log(`\n📊 Total: ${uniqueTags.length} meta tags`);
}

/**
 * Initialize a new project
 */
async function initProject(directory: string = '.') {
  console.log('🎬 Initializing Social Forge project...\n');

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
  .option('--social', 'Generate standard social media assets (Facebook, Twitter, LinkedIn, Instagram, TikTok, Snapchat)')
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

      // Check if the file format is supported
      if (!isValidImageFormat(sourcePath)) {
        const supportedFormats = SUPPORTED_INPUT_FORMATS.join(', ');
        throw new Error(`Unsupported image format: ${path.extname(sourcePath)}. Please use one of the following: ${supportedFormats}`);
      }

      console.log(`📷 Source image: ${sourcePath}`);
      
      // Load configuration
      const config = await loadConfig(options.config, options);
      
      // Ensure output directory exists
      await fs.mkdir(config.output.path, { recursive: true });
      
      console.log(`📁 Output directory: ${config.output.path}`);
      console.log(`🎨 Theme: ${config.themeColor} | Background: ${config.backgroundColor}\n`);

      // Generate assets based on options
      if (options.all) {
        await generateAll(sourcePath, config, options);
      } else if (options.facebook || options.twitter || options.linkedin || options.instagram || 
                 options.tiktok || options.whatsapp || options.youtube || options.pinterest ||
                 options.imessage || options.discord || options.telegram || options.signal ||
                 options.slack || options.androidrcs || options.snapchat || options.threads || options.bluesky ||
                 options.mastodon || options.social || options.messaging || 
                 options.platforms || options.favicon || options.pwa || options.seo || options.web) {
        await generateSpecific(sourcePath, config, options);
      } else {
        // Default: generate standard social media assets
        await generateSpecific(sourcePath, config, { ...options, social: true });
      }

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
      await showMetaTags(sourcePath, config, options);

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