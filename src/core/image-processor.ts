import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { promises as fs } from 'fs';
import { emitProgress } from './progress-events';
// Minimal Jimp typing to avoid unsafe any while supporting ESM dynamic import
type JimpImage = {
  bitmap: { width: number; height: number; data: Buffer };
  scale: (factor: number) => JimpImage;
  resize: (w: number, h: number, mode: number) => JimpImage;
  crop: (x: number, y: number, w: number, h: number) => JimpImage;
  composite: (src: JimpImage, x: number, y: number) => JimpImage;
  writeAsync: (path: string) => Promise<void>;
  print: (font: unknown, x: number, y: number, text: string) => JimpImage;
  scan: (x: number, y: number, w: number, h: number, cb: (x: number, y: number, idx: number) => void) => void;
  quality: (q: number) => JimpImage;
};

type JimpConstructor = {
  new (w: number, h: number, bg: number): JimpImage;
  read: (path: string) => Promise<JimpImage>;
  loadFont: (font: string) => Promise<unknown>;
  measureText: (font: unknown, text: string) => number;
  measureTextHeight: (font: unknown, text: string, maxWidth: number) => number;
  RESIZE_BICUBIC: number;
  FONT_SANS_8_WHITE: string; FONT_SANS_8_BLACK: string;
  FONT_SANS_16_WHITE: string; FONT_SANS_16_BLACK: string;
  FONT_SANS_32_WHITE: string; FONT_SANS_32_BLACK: string;
  FONT_SANS_64_WHITE: string; FONT_SANS_64_BLACK: string;
  FONT_SANS_128_WHITE: string; FONT_SANS_128_BLACK: string;
};

// Dynamic import for Jimp (ESM-only) to avoid CJS runtime issues
let _jimpModule: JimpConstructor | null = null;
async function getJimp(): Promise<JimpConstructor> {
  if (_jimpModule) return _jimpModule;
  const mod = await import('jimp');
  const resolved = (mod as { default?: unknown }).default ?? (mod as unknown);
  _jimpModule = resolved as JimpConstructor;
  return _jimpModule;
}

const execFileAsync = promisify(execFile);

// Global flag to enable mock mode for testing
let MOCK_MODE = false;

// Enable mock mode for testing
export function enableMockMode(): void {
  MOCK_MODE = true;
}

// Disable mock mode
export function disableMockMode(): void {
  MOCK_MODE = false;
}

export interface ImageProcessorOptions {
  quality?: number;
  format?: 'png' | 'jpeg' | 'jpg' | 'webp' | 'avif' | 'tiff' | 'tif' | 'gif' | 'heif' | 'svg' | 'ico';
  background?: string;
  fit?: 'cover' | 'contain' | 'fill';
  zoom?: number; // Zoom factor (e.g., 1.1 for 10% zoom)
  autoDetectBackground?: boolean; // Auto-detect background color from image borders
}

export interface TextOptions {
  text: string;
  font?: string;
  fontSize?: number;
  color?: string;
  position?: 'center' | 'top' | 'bottom';
  offset?: { x: number; y: number };
}

type RGBA = { r: number; g: number; b: number; alpha: number };

interface BackgroundDetectionOptions {
  sampleSize?: number; // longest side for analysis
  borderFrac?: number; // 0.03 - 0.08 is good
  alphaThreshold?: number; // 0..255; below this is "transparent"
  quantBits?: number; // 3..5 (4 is a good balance)
  transparentBorderRatio?: number; // ratio to treat bg as transparent
}

function parseHexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16) || 0;
  const g = parseInt(cleaned.substring(2, 4), 16) || 0;
  const b = parseInt(cleaned.substring(4, 6), 16) || 0;
  return { r, g, b };
}

function chooseNearestFontSize(target: number): 8 | 16 | 32 | 64 | 128 { // Jimp bundled fonts
  if (target <= 12) return 8;
  if (target <= 24) return 16;
  if (target <= 48) return 32;
  if (target <= 96) return 64;
  return 128;
}

function chooseFontConstant(Jimp: JimpConstructor, size: 8 | 16 | 32 | 64 | 128, color: string): string {
  const isWhite = (color || '').toLowerCase() === '#ffffff' || (color || '').toLowerCase() === 'white';
  switch (size) {
    case 8: return isWhite ? Jimp.FONT_SANS_8_WHITE : Jimp.FONT_SANS_8_BLACK;
    case 16: return isWhite ? Jimp.FONT_SANS_16_WHITE : Jimp.FONT_SANS_16_BLACK;
    case 32: return isWhite ? Jimp.FONT_SANS_32_WHITE : Jimp.FONT_SANS_32_BLACK;
    case 64: return isWhite ? Jimp.FONT_SANS_64_WHITE : Jimp.FONT_SANS_64_BLACK;
    case 128: return isWhite ? Jimp.FONT_SANS_128_WHITE : Jimp.FONT_SANS_128_BLACK;
  }
}

// List of supported input formats
export const SUPPORTED_INPUT_FORMATS = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.tiff', '.tif', '.gif', '.svg', '.bmp'];

export class ImageProcessor {
  private source: string;
  private tempFiles: string[] = [];
  private static engine: 'magick' | 'jimp' = 'magick';

  constructor(source: string) {
    this.source = source;
  }

  /**
   * Select image processing engine. Defaults to 'magick'.
   */
  static setEngine(engine: 'magick' | 'jimp'): void {
    ImageProcessor.engine = engine;
  }

  static getEngine(): 'magick' | 'jimp' {
    return ImageProcessor.engine;
  }

  /**
   * Check if ImageMagick is available
   */
  static async checkImageMagick(): Promise<boolean> {
    if (MOCK_MODE) {
      return true; // Always return true in mock mode
    }
    
    try {
      // Prefer explicit path if provided
      const explicitMagick = process.env.MAGICK_PATH;
      if (explicitMagick) {
        await execFileAsync(explicitMagick, ['-version']);
        return true;
      }
      await execFileAsync('magick', ['-version']);
      return true;
    } catch (_error) {
      try {
        // Fallback to legacy 'convert' command
        await execFileAsync('convert', ['-version']);
        return true;
      } catch (_fallbackError) {
        // Try executing from known bundled location
        const baseDir = process.env.MAGICK_DEFAULT_DIR || '/var/task/bin/imagemagick';
        const candidate = path.join(baseDir, 'bin', 'magick');
        try {
          await execFileAsync(candidate, ['-version']);
          // Cache explicit path for subsequent calls
          process.env.MAGICK_PATH = candidate;
          return true;
        } catch {
          return false;
        }
      }
    }
  }

  /**
   * Get the appropriate ImageMagick command
   */
  private static async getMagickCommand(): Promise<string> {
    if (MOCK_MODE) {
      return 'mock-magick'; // Return dummy command in mock mode
    }
    
    try {
      // Use explicit path first if set
      const explicitMagick = process.env.MAGICK_PATH;
      if (explicitMagick) {
        await execFileAsync(explicitMagick, ['-version']);
        return explicitMagick;
      }
      await execFileAsync('magick', ['-version']);
      return 'magick';
    } catch (_error) {
      // Try bundled location
      const baseDir = process.env.MAGICK_DEFAULT_DIR || '/var/task/bin/imagemagick';
      const candidate = path.join(baseDir, 'bin', 'magick');
      try {
        await execFileAsync(candidate, ['-version']);
        return candidate;
      } catch {
        // Fallback to legacy 'convert' command
        return 'convert';
      }
    }
  }

  /**
   * Create a mock output file for testing
   */
  private async createMockOutputFile(outputPath?: string): Promise<string> {
    // Create a temp path if none provided
    const tempOutput = outputPath || path.join(
      path.dirname(this.source), 
      `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`
    );
    
    // In mock mode, just copy the source file to the output path
    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(tempOutput), { recursive: true });
      
      // Copy source to output in mock mode
      await fs.copyFile(this.source, tempOutput);
      
      if (!outputPath) {
        this.tempFiles.push(tempOutput);
      }
      
      return tempOutput;
    } catch (_error) {
      // If copy fails (e.g., source doesn't exist), create an empty file
      await fs.writeFile(tempOutput, '');
      
      if (!outputPath) {
        this.tempFiles.push(tempOutput);
      }
      
      return tempOutput;
    }
  }

  /**
   * Resize image to specific dimensions using ImageMagick
   */
  async resize(width: number, height: number, options: ImageProcessorOptions = {}): Promise<string> {
    const {
      fit = 'cover',
      background = 'transparent',
      zoom = 1.0,
      autoDetectBackground = false
    } = options;

    // Auto-detect background color if requested and using 'contain' fit
    let finalBackground = background;
    if (autoDetectBackground && fit === 'contain') {
      try {
        const { bg, isTransparentBg } = await this.inferBackgroundColor();
        finalBackground = this.rgbaToColorString(bg, isTransparentBg);
      } catch (error) {
        console.warn('Background color detection failed, using provided background:', error);
        finalBackground = background;
      }
    }

    // Use mock implementation in test mode
    if (MOCK_MODE) {
      return this.createMockOutputFile();
    }

    // Jimp fallback engine
    if (ImageProcessor.getEngine() === 'jimp') {
      const Jimp = await getJimp();
      const tempOutput = path.join(path.dirname(this.source), `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`);
      this.tempFiles.push(tempOutput);
      const img = await Jimp.read(this.source);

      if (zoom !== 1.0) {
        img.scale(zoom);
      }

      const srcW = img.bitmap.width;
      const srcH = img.bitmap.height;

      const computeScale = (mode: 'cover' | 'contain' | 'fill'): number => {
        if (mode === 'fill') {
          return Math.min(width / srcW, height / srcH);
        }
        if (mode === 'cover') {
          return Math.max(width / srcW, height / srcH);
        }
        // contain
        return Math.min(width / srcW, height / srcH);
      };

      const scale = computeScale(fit);
      img.resize(
        Math.max(1, Math.ceil(srcW * scale)),
        Math.max(1, Math.ceil(srcH * scale)),
        Jimp.RESIZE_BICUBIC
      );

      if (fit === 'cover') {
        const x = Math.max(0, Math.floor((img.bitmap.width - width) / 2));
        const y = Math.max(0, Math.floor((img.bitmap.height - height) / 2));
        img.crop(x, y, Math.min(width, img.bitmap.width), Math.min(height, img.bitmap.height));
      } else if (fit === 'contain') {
        const { r: br, g: bg, b: bb } = parseHexToRgb(finalBackground);
        const bgColor = finalBackground === 'transparent' ? 0x00000000 : ((br & 0xff) << 24) + ((bg & 0xff) << 16) + ((bb & 0xff) << 8) + 0xff;
        const canvas = new Jimp(width, height, bgColor);
        const x = Math.floor((width - img.bitmap.width) / 2);
        const y = Math.floor((height - img.bitmap.height) / 2);
        canvas.composite(img, x, y);
        await canvas.writeAsync(tempOutput);
        return tempOutput;
      } else {
        // fill already resized to target ratio; enforce target dimensions exactly
        img.resize(width, height, Jimp.RESIZE_BICUBIC);
      }

      await img.writeAsync(tempOutput);
      return tempOutput;
    }

    const tempOutput = path.join(path.dirname(this.source), `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`);
    this.tempFiles.push(tempOutput);

    const magickCmd = await ImageProcessor.getMagickCommand();
    const args: string[] = [];

    // Input file
    args.push(this.source);

    // Apply high-quality filtering for better transparency handling
    args.push('-filter', 'lanczos');

    // Apply zoom if specified (with transparency preservation)
    if (zoom !== 1.0) {
      const zoomPercent = Math.round(zoom * 100);
      args.push('-resize', `${zoomPercent}%`);
    }

    // Handle different fit modes with transparency preservation
    if (fit === 'contain') {
      args.push('-resize', `${width}x${height}`);
      args.push('-gravity', 'center');
      // Preserve transparency during extent operation
      if (finalBackground === 'transparent') {
        args.push('-background', 'none');
      } else {
        args.push('-background', finalBackground);
      }
      args.push('-extent', `${width}x${height}`);
    } else if (fit === 'cover') {
      args.push('-resize', `${width}x${height}^`);
      args.push('-gravity', 'center');
      args.push('-extent', `${width}x${height}`);
    } else {
      // fill mode
      args.push('-resize', `${width}x${height}!`);
    }

    // Output file
    args.push(tempOutput);

    try {
      await execFileAsync(magickCmd, args);
      return tempOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`ImageMagick resize failed: ${errorMessage}`);
    }
  }

  /**
   * Add text overlay to image using ImageMagick
   */
  async addText(inputFile: string, options: TextOptions): Promise<string> {
    const {
      text,
      fontSize = 32,
      color = '#ffffff',
      position = 'center',
      offset = { x: 0, y: 0 }
    } = options;

    // Use mock implementation in test mode
    if (MOCK_MODE) {
      return this.createMockOutputFile();
    }

    // Jimp fallback engine
    if (ImageProcessor.getEngine() === 'jimp') {
      const Jimp = await getJimp();
      const tempOutput = path.join(path.dirname(this.source), `temp-text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`);
      this.tempFiles.push(tempOutput);
      const img = await Jimp.read(inputFile);

      const selectedSize = chooseNearestFontSize(options.fontSize ?? 32);
      const fontConst = chooseFontConstant(Jimp, selectedSize, options.color ?? '#ffffff');
      const font = await Jimp.loadFont(fontConst);

      const text = options.text;
      const textWidth = Jimp.measureText(font, text);
      const textHeight = Jimp.measureTextHeight(font, text, textWidth);

      let x = Math.floor((img.bitmap.width - textWidth) / 2);
      let y = Math.floor((img.bitmap.height - textHeight) / 2);
      if (options.position === 'top') {
        y = Math.floor(img.bitmap.height * 0.15) - Math.floor(textHeight / 2);
      } else if (options.position === 'bottom') {
        y = Math.floor(img.bitmap.height * 0.85) - Math.floor(textHeight / 2);
      }
      if (options.offset) {
        x += options.offset.x;
        y += options.offset.y;
      }

      img.print(font, x, y, text);
      await img.writeAsync(tempOutput);
      return tempOutput;
    }

    const tempOutput = path.join(path.dirname(this.source), `temp-text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`);
    this.tempFiles.push(tempOutput);

    const magickCmd = await ImageProcessor.getMagickCommand();
    const args: string[] = [];

    args.push(inputFile);
    args.push('-fill', color);
    args.push('-pointsize', fontSize.toString());
    args.push('-gravity', position === 'center' ? 'center' : position === 'top' ? 'north' : 'south');

    // Add offset if specified
    if (offset.x !== 0 || offset.y !== 0) {
      args.push('-geometry', `+${offset.x}+${offset.y}`);
    }

    args.push('-annotate', '0', text);
    args.push(tempOutput);

    try {
      await execFileAsync(magickCmd, args);
      return tempOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`ImageMagick text overlay failed: ${errorMessage}`);
    }
  }

  /**
   * Apply color overlay or tint using ImageMagick
   */
  async applyColor(inputFile: string, color: string, opacity: number = 0.5): Promise<string> {
    // Use mock implementation in test mode
    if (MOCK_MODE) {
      return this.createMockOutputFile();
    }

    // Jimp fallback engine
    if (ImageProcessor.getEngine() === 'jimp') {
      const Jimp = await getJimp();
      const tempOutput = path.join(path.dirname(this.source), `temp-color-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`);
      this.tempFiles.push(tempOutput);
      const img = await Jimp.read(inputFile);
      const { r, g, b } = parseHexToRgb(color);
      const overlay = new Jimp(img.bitmap.width, img.bitmap.height, 0x00000000);
      overlay.scan(0, 0, overlay.bitmap.width, overlay.bitmap.height, (x: number, y: number, idx: number) => {
        overlay.bitmap.data[idx + 0] = r;
        overlay.bitmap.data[idx + 1] = g;
        overlay.bitmap.data[idx + 2] = b;
        overlay.bitmap.data[idx + 3] = Math.round(255 * opacity);
      });
      img.composite(overlay, 0, 0);
      await img.writeAsync(tempOutput);
      return tempOutput;
    }

    const tempOutput = path.join(path.dirname(this.source), `temp-color-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`);
    this.tempFiles.push(tempOutput);

    const magickCmd = await ImageProcessor.getMagickCommand();
    const args = [
      inputFile,
      '-fill', color,
      '-colorize', `${Math.round(opacity * 100)}%`,
      tempOutput
    ];

    try {
      await execFileAsync(magickCmd, args);
      return tempOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`ImageMagick color overlay failed: ${errorMessage}`);
    }
  }

  /**
   * Save image to file with format conversion and transparency preservation
   */
  async save(outputPath: string, options: ImageProcessorOptions = {}): Promise<void> {
    // Use mock implementation in test mode
    if (MOCK_MODE) {
      await this.createMockOutputFile(outputPath);
      return;
    }
    
    // Jimp fallback engine
    if (ImageProcessor.getEngine() === 'jimp') {
      const Jimp = await getJimp();
      // Only basic formats supported in fallback
      let format = path.extname(outputPath).slice(1).toLowerCase();
      if (options.format) format = options.format;
      if (format === 'jpg') format = 'jpeg';
      if (!['png', 'jpeg', 'webp'].includes(format)) {
        throw new Error('Jimp fallback supports only png, jpeg, and webp outputs. Please install ImageMagick for advanced formats.');
      }
      const quality = options.quality || 90;
      const img = await Jimp.read(this.source);
      if (format === 'jpeg') {
        img.quality(quality);
      }
      if (format === 'webp') {
        // Jimp uses quality for webp as well
        img.quality(quality);
      }
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await img.writeAsync(outputPath);
      emitProgress(outputPath);
      return;
    }
    
    // Get format from output path or options
    let format = path.extname(outputPath).slice(1).toLowerCase();
    if (options.format) {
      format = options.format;
    }
    
    // Normalize format names
    if (format === 'jpg') format = 'jpeg';
    if (format === 'tif') format = 'tiff';
    
    const quality = options.quality || 90;

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const magickCmd = await ImageProcessor.getMagickCommand();
    const args: string[] = [];

    args.push(this.source);

    // PNG-specific transparency preservation (critical fix from debugging)
    if (format === 'png') {
      // Force RGBA transparency preservation - prevents 8-bit colormap conversion
      args.push('-define', 'png:color-type=6');
      
      // Ensure proper bit depth for transparency
      args.push('-define', 'png:bit-depth=8');
      
      // Optimize PNG compression
      if (quality < 95) {
        // Use adaptive filtering for better compression
        args.push('-define', 'png:compression-filter=5');
        args.push('-define', 'png:compression-level=9');
      }
      
      // Ensure full range for web images
      args.push('-define', 'png:format=png32');
    }

    // Set quality for lossy formats
    if (['jpeg', 'webp', 'avif'].includes(format)) {
      args.push('-quality', quality.toString());
    }

    // ICO format requires special handling
    if (format === 'ico') {
      // Create proper ICO file with multiple sizes
      args.push('-define', 'icon:auto-resize=256,128,64,48,32,16');
      args.push('-compress', 'zip');
    }

    // WebP format optimization
    if (format === 'webp') {
      args.push('-define', 'webp:alpha-quality=100');
      if (options.background === 'transparent') {
        args.push('-define', 'webp:alpha-compression=1');
      }
    }

    // Set output format with proper specification
    args.push(`${format.toUpperCase()}:${outputPath}`);

    try {
      await execFileAsync(magickCmd, args);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`ImageMagick save failed: ${errorMessage}`);
    }
    emitProgress(outputPath);
  }

  /**
   * Generate multiple sizes of the same image
   */
  async generateSizes(sizes: Array<{ width: number; height: number; name: string }>, outputDir: string, options: ImageProcessorOptions = {}): Promise<void> {
    // In mock mode, skip ImageMagick check
    if (!MOCK_MODE && ImageProcessor.getEngine() === 'magick') {
      // Check ImageMagick availability first
      const isAvailable = await ImageProcessor.checkImageMagick();
      if (!isAvailable) {
        throw new Error(
          'ImageMagick is not installed or not found in PATH. ' +
          'Please install ImageMagick:\n' +
          '- macOS: brew install imagemagick\n' +
          '- Ubuntu/Debian: apt-get install imagemagick\n' +
          '- Windows: choco install imagemagick or download from https://imagemagick.org'
        );
      }
    }

    const results: Promise<void>[] = [];

    for (const size of sizes) {
      const promise = (async () => {
        try {
          const resizedFile = await this.resize(size.width, size.height, options);
          const processor = new ImageProcessor(resizedFile);
          await processor.save(path.join(outputDir, size.name), options);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`Failed to generate size ${size.width}x${size.height}: ${errorMessage}`);
        }
      })();
      
      results.push(promise);
    }

    try {
      await Promise.all(results);
    } finally {
      // Clean up temporary files
      await this.cleanup();
    }
  }

  /**
   * Create a social media preview with template
   */
  async createSocialPreview(options: {
    width: number;
    height: number;
    title?: string;
    description?: string;
    logo?: string;
    template?: 'basic' | 'gradient' | 'custom';
    background?: string;
  }): Promise<string> {
    const {
      width,
      height,
      title,
      description,
      template = 'basic',
      background = '#000000'
    } = options;

    // Use mock implementation in test mode
    if (MOCK_MODE) {
      return this.createMockOutputFile();
    }

    // Start with resized base image using 'contain' to prevent cropping
    let currentFile = await this.resize(width, height, {
      fit: 'contain',  // Prevent cropping like mstile generation
      background,
      autoDetectBackground: true  // Auto-detect background for better results
    });

    // Add gradient overlay if template is gradient
    if (template === 'gradient') {
      currentFile = await this.applyColor(currentFile, 'black', 0.4);
    }

    // Add title if provided
    if (title) {
      currentFile = await this.addText(currentFile, {
        text: title,
        fontSize: Math.floor(height / 10),
        position: 'center',
        offset: { x: 0, y: description ? -height / 8 : 0 }
      });
    }

    // Add description if provided
    if (description) {
      currentFile = await this.addText(currentFile, {
        text: description,
        fontSize: Math.floor(height / 20),
        position: 'center',
        offset: { x: 0, y: height / 8 }
      });
    }

    return currentFile;
  }

  /**
   * Infer background color from image using sophisticated border analysis
   * Adapted from the downsampling.ts approach for robust color detection
   */
  async inferBackgroundColor(options: BackgroundDetectionOptions = {}): Promise<{ bg: RGBA; isTransparentBg: boolean }> {
    const opts = {
      sampleSize: 256,
      borderFrac: 0.05,
      alphaThreshold: 10,
      quantBits: 4,
      transparentBorderRatio: 0.8,
      ...options
    };

    // Use mock implementation in test mode
    if (MOCK_MODE) {
      return { bg: { r: 255, g: 255, b: 255, alpha: 1 }, isTransparentBg: false };
    }

    if (ImageProcessor.getEngine() === 'magick') {
      return this.inferBackgroundColorImageMagick(opts);
    } else {
      return this.inferBackgroundColorJimp(opts);
    }
  }

  /**
   * ImageMagick-based background color detection
   */
  private async inferBackgroundColorImageMagick(opts: Required<BackgroundDetectionOptions>): Promise<{ bg: RGBA; isTransparentBg: boolean }> {
    const magickCmd = await ImageProcessor.getMagickCommand();
    
    // 1) Get size after resize to sample size
    const { stdout: sizeOut } = await execFileAsync(magickCmd, [
      this.source,
      '-auto-orient',
      '-resize',
      `${opts.sampleSize}x${opts.sampleSize}>`,
      '-format',
      '%w %h',
      'info:'
    ]);
    
    const sizeParts = sizeOut.toString().trim().split(/\s+/);
    const wStr = sizeParts[0] ?? "0";
    const hStr = sizeParts[1] ?? "0";
    const width = Number.parseInt(wStr, 10);
    const height = Number.parseInt(hStr, 10);

    // 2) Get raw RGBA for the resized image
    const { stdout } = await execFileAsync(magickCmd, [
      this.source,
      '-auto-orient',
      '-resize',
      `${opts.sampleSize}x${opts.sampleSize}>`,
      '-alpha',
      'on',
      '-depth',
      '8',
      'rgba:-'
    ], { encoding: 'buffer', maxBuffer: 1024 * 1024 * 50 });

    return this.inferBgFromRGBA(stdout as unknown as Buffer, width, height, opts);
  }

  /**
   * Jimp-based background color detection
   */
  private async inferBackgroundColorJimp(opts: Required<BackgroundDetectionOptions>): Promise<{ bg: RGBA; isTransparentBg: boolean }> {
    const Jimp = await getJimp();
    let img = await Jimp.read(this.source);
    
    // Resize to sample size if needed
    const maxDim = Math.max(img.bitmap.width, img.bitmap.height);
    if (maxDim > opts.sampleSize) {
      const scale = opts.sampleSize / maxDim;
      img = img.resize(Math.round(img.bitmap.width * scale), Math.round(img.bitmap.height * scale), Jimp.RESIZE_BICUBIC);
    }

    const { width, height, data } = img.bitmap;
    return this.inferBgFromRGBA(Buffer.from(data), width, height, opts);
  }

  /**
   * Core background inference logic using histogram analysis
   */
  private inferBgFromRGBA(data: Buffer, width: number, height: number, opts: Required<BackgroundDetectionOptions>): { bg: RGBA; isTransparentBg: boolean } {
    const { borderFrac, alphaThreshold, quantBits, transparentBorderRatio } = opts;

    const border = Math.max(2, Math.round(Math.min(width, height) * borderFrac));
    const c = 4; // RGBA
    const shift = 8 - quantBits;

    const hist = new Map<number, { count: number; sumR: number; sumG: number; sumB: number }>();

    let totalBorder = 0;
    let transparentCount = 0;
    let sumRAll = 0;
    let sumGAll = 0;
    let sumBAll = 0;
    let countAll = 0;

    const pushPixel = (r: number, g: number, b: number) => {
      const rq = r >> shift;
      const gq = g >> shift;
      const bq = b >> shift;
      const key = (rq << (quantBits * 2)) | (gq << quantBits) | bq;
      const bin = hist.get(key);
      if (bin) {
        bin.count++;
        bin.sumR += r;
        bin.sumG += g;
        bin.sumB += b;
      } else {
        hist.set(key, { count: 1, sumR: r, sumG: g, sumB: b });
      }
      sumRAll += r;
      sumGAll += g;
      sumBAll += b;
      countAll++;
    };

    // Sample border pixels
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const onBorder = x < border || x >= width - border || y < border || y >= height - border;
        if (!onBorder) continue;
        
        const idx = (y * width + x) * c;
        // Guard against out-of-bounds access when sampling edge pixels
        if (idx + 3 >= data.length) {
          continue;
        }
        // Provide safe defaults to satisfy noUncheckedIndexedAccess
        const r = data[idx] ?? 0;
        const g = data[idx + 1] ?? 0;
        const b = data[idx + 2] ?? 0;
        const a = data[idx + 3] ?? 0;

        totalBorder++;
        if (a < alphaThreshold) {
          transparentCount++;
          continue;
        }
        pushPixel(r, g, b);
      }
    }

    const transparentRatio = totalBorder > 0 ? transparentCount / totalBorder : 0;

    if (transparentRatio >= transparentBorderRatio) {
      return { bg: { r: 0, g: 0, b: 0, alpha: 0 }, isTransparentBg: true };
    }

    if (countAll < 16) {
      return { bg: { r: 255, g: 255, b: 255, alpha: 1 }, isTransparentBg: false };
    }

    let best = { count: 0, sumR: 0, sumG: 0, sumB: 0 };
    for (const [, bin] of hist.entries()) {
      if (bin.count > best.count) {
        best = bin;
      }
    }

    const dominantShare = best.count / countAll;
    const useGlobalMean = dominantShare < 0.4;

    const r = useGlobalMean
      ? Math.round(sumRAll / countAll)
      : Math.round(best.sumR / best.count);
    const g = useGlobalMean
      ? Math.round(sumGAll / countAll)
      : Math.round(best.sumG / best.count);
    const b = useGlobalMean
      ? Math.round(sumBAll / countAll)
      : Math.round(best.sumB / best.count);

    return { bg: { r, g, b, alpha: 1 }, isTransparentBg: false };
  }

  /**
   * Convert RGBA to ImageMagick color string
   */
  private rgbaToColorString(bg: RGBA, isTransparent: boolean): string {
    if (isTransparent || bg.alpha === 0) return 'transparent';
    return `rgb(${bg.r},${bg.g},${bg.b})`;
  }

  /**
   * Clean up temporary files
   */
  async cleanup(): Promise<void> {
    const cleanupPromises = this.tempFiles.map(async (file) => {
      try {
        await fs.unlink(file);
      } catch (_error) {
        // Ignore cleanup errors
      }
    });

    await Promise.allSettled(cleanupPromises);
    this.tempFiles = [];
  }
}

// Export comprehensive image sizes and formats
export const ImageSizes = {
  // Standard favicon sizes
  favicon: [16, 32, 48, 64, 128, 256],
  apple: [180],
  android: [192, 512],
  mstile: [
    { width: 70, height: 70 },
    { width: 150, height: 150 },
    { width: 310, height: 150 },
    { width: 310, height: 310 }
  ],
  
  // Social Media Platforms
  social: {
    // Standard OpenGraph (1200x630) - Most widely supported
    standard: { width: 1200, height: 630 },
    
    // Facebook variants
    facebook: { width: 1200, height: 630 },
    facebookSquare: { width: 1200, height: 1200 },
    
    // Twitter variants
    twitter: { width: 1200, height: 600 },
    twitterSquare: { width: 1200, height: 1200 },
    
    // LinkedIn
    linkedin: { width: 1200, height: 627 },
    linkedinCompany: { width: 1104, height: 736 },
    
    // Instagram
    instagramSquare: { width: 1080, height: 1080 },
    instagramPortrait: { width: 1080, height: 1350 },
    instagramLandscape: { width: 1080, height: 566 },
    instagramStories: { width: 1080, height: 1920 },
    
    // TikTok
    tiktok: { width: 1080, height: 1920 },
    
    // YouTube
    youtubeThumbnail: { width: 1280, height: 720 },
    youtubeShorts: { width: 1080, height: 1920 },
    
    // Pinterest
    pinterestPin: { width: 1000, height: 1500 },
    pinterestSquare: { width: 1000, height: 1000 },
    
    // Snapchat
    snapchat: { width: 1080, height: 1920 },
    
    // Emerging platforms
    threads: { width: 1080, height: 1080 },
    bluesky: { width: 1200, height: 630 },
    mastodon: { width: 1200, height: 630 }
  },
  
  // Messaging Apps
  messaging: {
    // Standard messaging preview
    standard: { width: 1200, height: 630 },
    
    // WhatsApp
    whatsapp: { width: 400, height: 400 },
    whatsappLink: { width: 1200, height: 630 },
    
    // iMessage (uses OpenGraph)
    imessage: { width: 1200, height: 630 },
    
    // Discord
    discord: { width: 1200, height: 630 },
    
    // Telegram
    telegram: { width: 1200, height: 630 },
    
    // Signal
    signal: { width: 1200, height: 630 },
    
    // Slack
    slack: { width: 1200, height: 630 },
    
    // WeChat
    wechat: { width: 500, height: 400 },
    
    // Line
    line: { width: 1200, height: 630 },
    
    // Android RCS
    androidRcs: { width: 1200, height: 630 },
    
    // Apple Business Chat
    appleBusinessChat: { width: 1200, height: 630 }
  },
  
  // Video thumbnail formats
  video: {
    youtube: { width: 1280, height: 720 },
    vimeo: { width: 1280, height: 720 },
    wistia: { width: 1280, height: 720 }
  },
  
  // Email formats
  email: {
    header: { width: 600, height: 200 },
    featured: { width: 600, height: 400 }
  }
}; 