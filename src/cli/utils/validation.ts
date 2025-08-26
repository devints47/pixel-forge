import path from 'path';
import { SUPPORTED_INPUT_FORMATS } from '../../core/image-processor';

/**
 * Check if the file is a supported image format
 */
export function isValidImageFormat(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return SUPPORTED_INPUT_FORMATS.includes(ext);
}

/**
 * Validate source image file
 */
export function validateSourceImage(sourcePath: string): void {
  if (!isValidImageFormat(sourcePath)) {
    const supportedFormats = SUPPORTED_INPUT_FORMATS.join(', ');
    throw new Error(
      `Unsupported image format: ${path.extname(sourcePath)}. ` +
      `Please use one of the following: ${supportedFormats}`
    );
  }
}
