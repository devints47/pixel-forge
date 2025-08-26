import readline from 'readline';
import chalk from 'chalk';
import { ImageProcessor } from '../../core/image-processor';

/**
 * Check if ImageMagick is available and show helpful error if not
 * Offers fallback to Jimp with user confirmation in interactive mode
 */
export async function checkImageMagickAvailability(): Promise<void> {
  const isAvailable = await ImageProcessor.checkImageMagick();
  
  if (!isAvailable) {
    // Show installation instructions
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

    // Ask user if they want to proceed with Jimp fallback
    const rl = readline.createInterface({ 
      input: process.stdin, 
      output: process.stdout 
    });
    
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
