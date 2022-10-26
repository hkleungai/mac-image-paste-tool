import path from 'path';

class FileSystem {
  static get assets() {
    return path.resolve(__dirname, 'assets');
  }

  static get tray() {
    return path.resolve(this.assets, 'tray.png');
  }

  static get sticker() {
    return path.resolve(this.assets, 'stickers');
  }
}

export default FileSystem;
