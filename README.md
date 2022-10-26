# mac-image-paste-tool

A small tool for copy gif to MacOS clipboard. 
It is primiarily used for daily Teams chat.

This project works with a bunch of images in `src/assets/stickers/*/*.(png|gif)`.
Most of them are [sticker collections from LIHKG](https://lihkg.com/stickers).

Many thanks to [this stackoverflow post](https://stackoverflow.com/questions/21809592/how-to-copy-a-gif-to-clipboard-in-mac-using-python), 
which teaches me how to do copy-gif in MacOS.

Unfortunately the application is not 100% perfect
due to [an unsolved issue](https://github.com/electron/electron/issues/5078) involving ElectronJs's handling on GIF file.

Don't know if I want to extend it or fix it further :)
