// Messaging app generators
// Note: Most messaging apps use standard OpenGraph dimensions (1200x630)
// and can be generated using StandardOpenGraphGenerator for efficiency

export { DiscordGenerator, type DiscordOptions } from './discord';
export { TelegramGenerator, type TelegramOptions } from './telegram';
export { SignalGenerator, type SignalOptions } from './signal';
export { SlackGenerator, type SlackOptions } from './slack';
export { iMessageGenerator, type iMessageOptions } from './imessage';
export { AndroidRCSGenerator, type AndroidRCSOptions } from './android-rcs';

import { StandardOpenGraphGenerator } from '../standard-opengraph';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface GeneratorInfo {
  name: string;
  generator: any;
  files: string[];
}

export interface MessagingOptions {
  discord?: boolean;
  telegram?: boolean;
  signal?: boolean;
  slack?: boolean;
  imessage?: boolean;
  androidrcs?: boolean;
}

/**
 * Factory function to generate messaging app assets
 * Uses StandardOpenGraphGenerator for efficiency since all messaging apps
 * use the same 1200x630 OpenGraph dimensions
 */
export async function generateMessaging(
  sourceImage: string,
  config: PixelForgeConfig,
  options: MessagingOptions
): Promise<GeneratorInfo[]> {
  const generators: GeneratorInfo[] = [];

  // Check if any messaging platforms are requested
  const hasMessagingPlatforms = Object.values(options).some(Boolean);
  if (!hasMessagingPlatforms) {
    return generators;
  }

  // Use StandardOpenGraphGenerator for efficiency
  const standardGenerator = new StandardOpenGraphGenerator(sourceImage, config);
  await standardGenerator.generate({
    includeFacebook: false, // Only generate messaging platforms
    includeBluesky: false,
    includeMastodon: false,
    includeiMessage: options.imessage || false,
    includeDiscord: options.discord || false,
    includeTelegram: options.telegram || false,
    includeSignal: options.signal || false,
    includeSlack: options.slack || false,
    includeAndroidRCS: options.androidrcs || false
  });

  // Create individual generator info objects for CLI compatibility
  const generatedFiles = standardGenerator.getGeneratedFiles();
  
  if (options.discord && generatedFiles.includes('discord.png')) {
    generators.push({ 
      name: 'Discord', 
      generator: standardGenerator, 
      files: ['discord.png'] 
    });
  }
  
  if (options.telegram && generatedFiles.includes('telegram.png')) {
    generators.push({ 
      name: 'Telegram', 
      generator: standardGenerator, 
      files: ['telegram.png'] 
    });
  }
  
  if (options.signal && generatedFiles.includes('signal.png')) {
    generators.push({ 
      name: 'Signal', 
      generator: standardGenerator, 
      files: ['signal.png'] 
    });
  }
  
  if (options.slack && generatedFiles.includes('slack.png')) {
    generators.push({ 
      name: 'Slack', 
      generator: standardGenerator, 
      files: ['slack.png'] 
    });
  }
  
  if (options.imessage && generatedFiles.includes('imessage.png')) {
    generators.push({ 
      name: 'iMessage', 
      generator: standardGenerator, 
      files: ['imessage.png'] 
    });
  }
  
  if (options.androidrcs && generatedFiles.includes('android-rcs.png')) {
    generators.push({ 
      name: 'Android RCS', 
      generator: standardGenerator, 
      files: ['android-rcs.png'] 
    });
  }

  return generators;
}
