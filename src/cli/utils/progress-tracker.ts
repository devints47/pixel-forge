import * as cliProgress from 'cli-progress';
import { promises as fs } from 'fs';
import { GenerateOptions } from '../commands/generate-orchestrator';

export interface ProgressConfig {
  total: number;
  format?: string;
}

/**
 * Progress tracker for image generation with ASCII loading bar
 * Uses directory polling to track files as they're actually created
 */
export class ProgressTracker {
  private bar: cliProgress.SingleBar | null = null;
  private currentProgress = 0;
  private totalFiles = 0;
  private initialFileCount = 0;
  private outputDirectory = '';
  private pollingInterval: NodeJS.Timeout | null = null;
  private isPolling = false;

  // File extensions we consider as generated assets
  private readonly assetExtensions = [
    '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico',
    '.json', '.xml'
  ];

  /**
   * Estimate total files based on generation options
   */
  static estimateFileCount(options: GenerateOptions): number {
    let totalFiles = 0;

    // Favicon generation (various sizes and formats)
    if (options.favicon) {
      totalFiles += 20; // ~20 favicon files (16x16, 32x32, etc., ico, png, svg)
    }

    // PWA generation (icons + splash screens + manifest)
    if (options.pwa) {
      totalFiles += 39; // ~39 PWA files (icons + splash screens + manifest)
    }

    // Social media generation
    if (options.social || options.platforms || options.messaging) {
      // Base social media general file
      totalFiles += 1;
      
      // Platform-specific files (if individual platforms specified)
      const platformCount = [
        options.facebook, options.twitter, options.linkedin, options.instagram,
        options.tiktok, options.snapchat, options.threads, options.whatsapp,
        options.youtube, options.pinterest, options.bluesky, options.mastodon
      ].filter(Boolean).length;
      
      // Most platforms generate 1-2 files, some like YouTube/Pinterest generate more
      totalFiles += platformCount * 2;
      
      // Messaging platforms (usually 1 file each)
      const messagingCount = [
        options.discord, options.telegram, options.signal, options.slack,
        options.imessage, options.androidrcs
      ].filter(Boolean).length;
      
      totalFiles += messagingCount;
      
      // If using comprehensive social (--social), estimate based on all platforms
      if (options.social && !platformCount && !messagingCount) {
        totalFiles += 12; // Comprehensive social generates ~13 files
      }
    }

    // SEO/Web generation
    if (options.seo || options.web) {
      totalFiles += 3; // OpenGraph images and meta files
    }

    // If --all flag, include everything
    if (options.all) {
      totalFiles = 75; // Comprehensive estimate for all assets
    }

    // If no specific options, default to social
    if (totalFiles === 0) {
      totalFiles = 13; // Default social generation
    }

    return Math.max(totalFiles, 1); // Ensure at least 1 for progress bar
  }

  /**
   * Count files in directory that match our asset patterns
   */
  private async countAssetFiles(directory: string): Promise<number> {
    try {
      const files = await fs.readdir(directory);
      return files.filter(file => 
        this.assetExtensions.some(ext => file.toLowerCase().endsWith(ext))
      ).length;
    } catch (error) {
      // Directory might not exist yet
      return 0;
    }
  }

  /**
   * Start polling the directory for file changes
   */
  private async startPolling(): Promise<void> {
    if (this.isPolling || !this.outputDirectory || !this.bar) return;
    
    this.isPolling = true;
    
    this.pollingInterval = setInterval(async () => {
      try {
        const currentFileCount = await this.countAssetFiles(this.outputDirectory);
        const newFiles = currentFileCount - this.initialFileCount;
        
        // Update progress based on actual file count
        if (newFiles !== this.currentProgress) {
          this.currentProgress = Math.min(newFiles, this.totalFiles);
          this.bar?.update(this.currentProgress);
        }
      } catch (error) {
        // Ignore polling errors to prevent breaking the main functionality
      }
    }, 150); // Poll every 150ms for smooth updates
  }

  /**
   * Stop polling the directory
   */
  private stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
  }

  /**
   * Start the progress bar with directory monitoring
   */
  async start(options: GenerateOptions, outputDirectory: string): Promise<void> {
    this.totalFiles = ProgressTracker.estimateFileCount(options);
    this.outputDirectory = outputDirectory;
    this.currentProgress = 0;

    // Count existing files to use as baseline
    this.initialFileCount = await this.countAssetFiles(outputDirectory);

    // Create progress bar with custom format
    this.bar = new cliProgress.SingleBar({
      format: 'Generating |{bar}| {percentage}% | {value}/{total} files',
      barCompleteChar: '█',
      barIncompleteChar: '░',
      hideCursor: true,
      barsize: 30,
      stopOnComplete: true,
      clearOnComplete: false
    }, cliProgress.Presets.shades_classic);

    this.bar.start(this.totalFiles, 0);
    
    // Start monitoring the directory for file changes
    await this.startPolling();
  }

  /**
   * Complete the progress bar and show final count
   */
  async complete(actualFileCount?: number): Promise<void> {
    // Stop polling first
    this.stopPolling();
    
    if (!this.bar) return;

    // Get final file count from directory if not provided
    if (!actualFileCount && this.outputDirectory) {
      const finalCount = await this.countAssetFiles(this.outputDirectory);
      actualFileCount = finalCount - this.initialFileCount;
    }

    // If actual count is provided and different from estimate, adjust
    if (actualFileCount && actualFileCount !== this.totalFiles) {
      this.bar.setTotal(actualFileCount);
      this.bar.update(actualFileCount);
    } else {
      this.bar.update(this.totalFiles);
    }

    this.bar.stop();
    console.log(''); // Add line break after progress bar
  }

  /**
   * Stop the progress bar (in case of error)
   */
  stop(): void {
    this.stopPolling();
    
    if (this.bar) {
      this.bar.stop();
      console.log(''); // Add line break
    }
  }

  // Deprecated methods - kept for compatibility but no longer needed
  increment(amount: number = 1): void {
    // No-op - progress is now tracked by file polling
  }

  update(value: number): void {
    // No-op - progress is now tracked by file polling
  }

  addFiles(fileCount: number): void {
    // No-op - progress is now tracked by file polling
  }

  /**
   * Get current progress info
   */
  getProgress(): { current: number; total: number; percentage: number } {
    return {
      current: this.currentProgress,
      total: this.totalFiles,
      percentage: Math.round((this.currentProgress / this.totalFiles) * 100)
    };
  }
}

// Global progress tracker instance
let globalProgressTracker: ProgressTracker | null = null;

/**
 * Get or create global progress tracker
 */
export function getProgressTracker(): ProgressTracker {
  if (!globalProgressTracker) {
    globalProgressTracker = new ProgressTracker();
  }
  return globalProgressTracker;
}

/**
 * Reset global progress tracker
 */
export function resetProgressTracker(): void {
  globalProgressTracker = null;
}
