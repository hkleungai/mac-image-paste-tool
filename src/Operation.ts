import { execSync } from 'child_process';
import { nativeImage } from 'electron';

class Operation {
  static create_image(image_path: string, size: number) {
    return (
      nativeImage
        .createFromPath(image_path)
        .resize({ width: size, height: size })
    );
  }

  // A possible to-do:
  //  Extend this function to other operating system
  static copy_gif(image_path: string) {
    execSync(`osascript -e 'set the clipboard to (POSIX file "${image_path}")'`);
  }
}

export default Operation;
