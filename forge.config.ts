import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    // Add any specific packager configuration here
  },
  rebuildConfig: {
    // Add any specific rebuild configuration here
  },
  makers: [
    new MakerSquirrel({
      // Add any specific configuration for Windows installer
    }),
    new MakerZIP({}, ['darwin']), // ZIP for macOS
    new MakerRpm({
      // Add any specific configuration for RPM
    }),
    new MakerDeb({
      // Add any specific configuration for DEB
    }),
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/renderer/index.html', // Ensure this path is correct
            js: './src/renderer/index.ts',     // Ensure this path is correct
            name: 'main_window',
            preload: {
              js: './src/preload/index.ts',    // Ensure this path is correct
            },
          },
        ],
      },
    }),
  ],
};

export default config;
