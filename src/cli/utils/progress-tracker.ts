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
   * Estimate total files based on generation options (2024 optimized counts)
   */
  static estimateFileCount(options: GenerateOptions): number {
    let totalFiles = 0;

    // Favicon generation (essential files with multiple sizes)
    if (options.favicon) {
      totalFiles += 6; // favicon.ico, favicon-16x16.png, favicon-32x32.png, favicon-48x48.png, apple-touch-icon.png, safari-pinned-tab.svg
    }

    // PWA generation (essential files only)
    if (options.pwa) {
      totalFiles += 7; // pwa icons (4) + splash screens (2) + manifest.json (1)
    }

    // Social media generation (optimized essential files only)
    if (options.social) {
      totalFiles += 3; // social-media-general.png, instagram-square.png, social-vertical.png
    }

    // SEO/Web generation
    if (options.seo || options.web) {
      totalFiles += 3; // og-image.png, opengraph.png, twitter-image.png
    }

    // Transparent background generation (single output)
    if ((options as any).transparent) {
      totalFiles += 1; // one transparent image
    }

    // If --all flag, include everything (optimized count)
    if (options.all) {
      totalFiles = 20; // 6 favicon + 7 PWA + 3 social + 3 SEO + 1 meta-tags.html = 20 files
    }

    // If no specific options, default to social
    if (totalFiles === 0) {
      totalFiles = 3; // Default social generation (3 essential images)
    }

    // Always add 1 for meta-tags.html (automatically generated)
    if (!options.all) {
      totalFiles += 1;
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
