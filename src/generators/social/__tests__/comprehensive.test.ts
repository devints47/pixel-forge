import { describe, expect, it, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';
import { InstagramGenerator } from '../platforms/instagram';
import { generatePlatforms } from '../platforms/factory';
import { generateMessaging } from '../messaging/factory';
import { enableMockMode, disableMockMode } from '../../../core/image-processor';
import type { PixelForgeConfig } from '../../../core/config-validator';

describe('Comprehensive Social Media Generators', () => {
  const testConfig: PixelForgeConfig = {
    appName: 'Test App',
    description: 'Test Description',
    themeColor: '#ffffff',
    backgroundColor: '#ffffff',
    output: {
      path: './test-output',
      prefix: '/',
      quality: 90
    }
  };

  beforeAll(async () => {
    // Enable mock mode for testing without ImageMagick
    enableMockMode();
    
    // Create a test image if it doesn't exist
    const testImageDir = path.join(__dirname, 'fixtures');
    const testImagePath = path.join(testImageDir, 'test-image.png');
    
    try {
      await fs.mkdir(testImageDir, { recursive: true });
      // Check if test image exists, if not create a simple one
      try {
        await fs.access(testImagePath);
      } catch {
        // Create a small empty file as a placeholder
        await fs.writeFile(testImagePath, Buffer.from([
          0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 
          0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 
          0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 
          0x0A, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0x60, 0x00, 0x00, 0x00, 
          0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33, 0x00, 0x00, 0x00, 0x00, 0x49, 
          0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]));
      }
    } catch (error) {
      console.error('Error setting up test image:', error);
    }
  });

  afterAll(() => {
    // Disable mock mode
    disableMockMode();
  });

  beforeEach(async () => {
    // Create output directory
    await fs.mkdir(testConfig.output.path, { recursive: true });
  });

  afterEach(async () => {
    // Clean up output directory
    await fs.rm(testConfig.output.path, { recursive: true, force: true });
  });

  describe('InstagramGenerator', () => {
    it('should generate Instagram OpenGraph format', async () => {
      const generator = new InstagramGenerator(
        path.join(__dirname, 'fixtures', 'test-image.png'),
        testConfig
      );

      await generator.generate();

      const files = await fs.readdir(testConfig.output.path);
      expect(files).toContain('instagram.png');
    });

    it('should generate correct meta tags', () => {
      const generator = new InstagramGenerator(
        path.join(__dirname, 'fixtures', 'test-image.png'),
        testConfig
      );

      const metaTags = generator.getMetaTags();
      expect(metaTags).toEqual(
        expect.arrayContaining([
          expect.stringContaining('instagram.png')
        ])
      );
    });

    it('should generate Next.js metadata', () => {
      const generator = new InstagramGenerator(
        path.join(__dirname, 'fixtures', 'test-image.png'),
        testConfig
      );

      const metadata = generator.getNextMetadata();
      expect(metadata.openGraph?.images).toBeDefined();
      // Instagram generator no longer generates Twitter metadata
    });
  });

  describe('Messaging Factory', () => {
    it('should generate messaging app formats', async () => {
      const results = await generateMessaging(
        path.join(__dirname, 'fixtures', 'test-image.png'),
        testConfig,
        {
          discord: true,   // Enable one to test
          telegram: false,
          signal: false,
          slack: false,
          imessage: false,
          androidrcs: false
        }
      );

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].files.length).toBeGreaterThan(0);
    });

    it('should return empty array when no options selected', async () => {
      const results = await generateMessaging(
        path.join(__dirname, 'fixtures', 'test-image.png'),
        testConfig,
        {
          discord: false,
          telegram: false,
          signal: false,
          slack: false,
          imessage: false,
          androidrcs: false
        }
      );

      expect(results.length).toBe(0);
    });
  });

  describe('Platform Factory', () => {
    it('should generate platform-specific formats', async () => {
      const results = await generatePlatforms(
        path.join(__dirname, 'fixtures', 'test-image.png'),
        testConfig,
        {
          facebook: false,
          twitter: false,
          linkedin: false,
          instagram: true,     // Keep one simple test
          tiktok: false,       // Skip to avoid text overlay
          snapchat: false,
          threads: false,
          whatsapp: false,
          youtube: false,      // Skip to avoid text overlay
          pinterest: false,    // Skip to avoid text overlay
          bluesky: false,
          mastodon: false
        }
      );

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].files.length).toBeGreaterThan(0);
    });
  });

  describe('Factory Integration', () => {
    it('should generate social media formats via factory functions', async () => {
      // Test that our factory functions work together
      const platformResults = await generatePlatforms(
        path.join(__dirname, 'fixtures', 'test-image.png'),
        testConfig,
        {
          facebook: true,
          twitter: false,
          linkedin: false,
          instagram: false,
          tiktok: false,
          snapchat: false,
          threads: false,
          whatsapp: false,
          youtube: false,
          pinterest: false,
          bluesky: false,
          mastodon: false
        }
      );

      expect(platformResults.length).toBeGreaterThan(0);
      expect(platformResults[0].files.length).toBeGreaterThan(0);
    });

    it('should generate messaging formats via factory functions', async () => {
      const messagingResults = await generateMessaging(
        path.join(__dirname, 'fixtures', 'test-image.png'),
        testConfig,
        {
          discord: true,   // Enable one to get results
          telegram: false,
          signal: false,
          slack: false,
          imessage: false,
          androidrcs: false
        }
      );

      expect(messagingResults.length).toBeGreaterThan(0);
      expect(messagingResults[0].files.length).toBeGreaterThan(0);
    });
  });
}); 