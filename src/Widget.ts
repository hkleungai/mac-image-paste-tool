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

  // NO caching here, since template will be re-built upon change in `main_menu_template`
  static get main_menu() {
    return Menu.buildFromTemplate(this.main_menu_template);
  }

  static #main_menu_template: MenuItemConstructorOptions[];
  static get main_menu_template() {
    if (this.#main_menu_template) {
      return this.#main_menu_template;
    }

    const sticker_folders = fs.readdirSync(FileSystem.sticker);

    this.#main_menu_template = sticker_folders.map<MenuItemConstructorOptions>(folder => {
      const absolute_folder = path.resolve(FileSystem.sticker, folder);
      const png_files = fs.readdirSync(absolute_folder).filter(file => /\.png/.test(file));

      const last_png_file = path.resolve(absolute_folder, png_files.slice(-1)[0]);
      const icon = Operation.create_image(last_png_file, 100);

      const submenu = png_files.map(png_file => ({
        id: png_file,
        label: ' ',
        icon: Operation.create_image(path.resolve(absolute_folder, png_file), 100),
        click: () => {
          this.success_copy_banner.show();
          const gif_file = path.resolve(absolute_folder, png_file.replace(/\.png/, '.gif'));
          Operation.copy_gif(gif_file);
          this.#swap_recent_pick_to_menu_top(folder, png_file);
          setTimeout(() => this.success_copy_banner.close(), 2000);
        },
      }));

      return {
        id: folder,
        label: ' ',
        icon,
        submenu
      }
    });

    return this.#main_menu_template;
  };

  static #swap_recent_pick_to_menu_top(folder_id: string, png_file_id: string) {
    const folder_index = this.main_menu_template.findIndex(({ id }) => id === folder_id);
    const folder = this.main_menu_template[folder_index];
    const submenu = folder.submenu as MenuItemConstructorOptions[];

    const png_file_index = submenu.findIndex(({ id }) => id === png_file_id);
    const png_file = submenu[png_file_index];

    submenu.splice(png_file_index, 1);
    submenu.unshift(png_file);

    this.main_menu_template.splice(folder_index, 1);
    this.main_menu_template.unshift(folder);

    this.tray_icon.setContextMenu(this.main_menu);
  }
}

export default Widget;
