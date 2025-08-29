import { promisify } from 'util';
import { execFile as execFileAsync } from 'child_process';
import path from 'path';
import { promises as fs } from 'fs';
import { ImageProcessor } from './image-processor';

export interface TransparentOptions {
  fuzzPercent?: number; // tolerance for chroma-key, e.g., 12 means 12%
  outputFormat?: 'png' | 'webp' | 'avif' | 'jpeg';
}

/**
 * Make the background color transparent for an input image.
 * - Detects the dominant border/background color using our robust algorithm
 * - Uses ImageMagick to chroma-key that color to full transparency
 * - Preserves original dimensions
 */
export async function makeBackgroundTransparent(
  inputPath: string,
  outputPath: string,
  options: TransparentOptions = {}
): Promise<void> {
  const { fuzzPercent = 12 } = options;

  // Detect background color
  const detector = new ImageProcessor(inputPath);
  const { bg } = await detector.inferBackgroundColor();
  await detector.cleanup();
  const bgHex = `#${Math.round(bg.r).toString(16).padStart(2, '0')}${Math.round(bg.g).toString(16).padStart(2, '0')}${Math.round(bg.b).toString(16).padStart(2, '0')}`;

  const execFile = promisify(execFileAsync);

  // Ensure output directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  // Chroma-key the detected background color to transparency
  await execFile('magick', [
    inputPath,
    '-alpha', 'set',
    '-fuzz', `${fuzzPercent}%`,
    '-transparent', bgHex,
    outputPath
  ]);
}


