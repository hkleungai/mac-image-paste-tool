import { Menu, MenuItemConstructorOptions, Notification, Tray } from 'electron';
import fs from 'fs';
import path from 'path';

import FileSystem from './FileSystem';
import Message from './Message';
import Operation from './Operation';

class Widget {
  static #success_copy_banner: Notification;
  static get success_copy_banner() {
    if (this.#success_copy_banner) {
      return this.#success_copy_banner;
    }
    const title = Message.success_title;
    const body = Message.success_body
    this.#success_copy_banner = new Notification({ title, body });
    return this.#success_copy_banner;
  }

  static #tray_icon: Tray;
  static get tray_icon() {
    if (this.#tray_icon) {
      return this.#tray_icon;
    }
    const icon = Operation.create_image(FileSystem.tray, 16);
    this.#tray_icon = new Tray(icon);
    return this.#tray_icon;
  }

  static #main_menu: Menu;
  static get main_menu() {
    if (this.#main_menu) {
      return this.#main_menu;
    }

    const sticker_folders = fs.readdirSync(FileSystem.sticker);

    const contextMenuTemplate = sticker_folders.map<MenuItemConstructorOptions>(folder => {
      const absolute_folder = path.resolve(FileSystem.sticker, folder);
      const png_files = fs.readdirSync(absolute_folder).filter(file => /\.png/.test(file));

      const last_png_file = path.resolve(absolute_folder, png_files.slice(-1)[0]);
      const icon = Operation.create_image(last_png_file, 100);

      const submenu = png_files.map(png_file => ({
        label: ' ',
        icon: Operation.create_image(path.resolve(absolute_folder, png_file), 100),
        click: () => {
          this.success_copy_banner.show();
          const gif_file = path.resolve(absolute_folder, png_file.replace(/\.png/, '.gif'));
          Operation.copy_gif(gif_file);
          setTimeout(() => this.success_copy_banner.close(), 2000);
        },
      }));

      return { label: ' ', icon, submenu }
    });

    this.#main_menu = Menu.buildFromTemplate(contextMenuTemplate);

    return this.#main_menu;
  }
}

export default Widget;
