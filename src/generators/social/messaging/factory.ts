import { MessagingGenerator } from '../messaging';
import type { PixelForgeConfig } from '../../../core/config-validator';

export interface SocialGeneratorResult {
  name: string;
  files: string[];
}

export interface MessagingFactoryOptions {
  discord?: boolean;
  telegram?: boolean;
  signal?: boolean;
  slack?: boolean;
  imessage?: boolean;
  androidrcs?: boolean;
  whatsapp?: boolean;
  wechat?: boolean;
}

/**
 * Factory function for generating messaging app assets
 */
export async function generateMessaging(
  sourceImage: string,
  config: PixelForgeConfig,
  options: MessagingFactoryOptions
): Promise<SocialGeneratorResult[]> {
  const results: SocialGeneratorResult[] = [];
  const generator = new MessagingGenerator(sourceImage, config);

  // Most messaging apps use standard 1200x630 dimensions
  await generator.generate({
    includeWhatsApp: options.whatsapp,
    includeDiscord: options.discord,
    includeTelegram: options.telegram,
    includeSignal: options.signal,
    includeSlack: options.slack,
    includeWeChat: options.wechat,
    includeiMessage: options.imessage,
    includeAndroidRCS: options.androidrcs
  });

  if (options.discord) {
    results.push({
      name: 'Discord',
      files: ['discord.png']
    });
  }

  if (options.telegram) {
    results.push({
      name: 'Telegram',
      files: ['telegram.png']
    });
  }

  if (options.signal) {
    results.push({
      name: 'Signal',
      files: ['signal.png']
    });
  }

  if (options.slack) {
    results.push({
      name: 'Slack',
      files: ['slack.png']
    });
  }

  if (options.imessage) {
    results.push({
      name: 'iMessage',
      files: ['imessage.png']
    });
  }

  if (options.androidrcs) {
    results.push({
      name: 'Android RCS',
      files: ['android-rcs.png']
    });
  }

  if (options.whatsapp) {
    results.push({
      name: 'WhatsApp',
      files: ['whatsapp-square.png', 'whatsapp-link.png']
    });
  }

  if (options.wechat) {
    results.push({
      name: 'WeChat',
      files: ['wechat.png']
    });
  }

  return results;
}
