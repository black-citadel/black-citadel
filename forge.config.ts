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
    name: 'Black Citadel',
    executableName: 'black-citadel'
  },
  makers: [
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './icons/linux/icon.png'
        }
      }
    }

    // {
    //   name: '@electron-forge/maker-dmg',
    //   config: {
    //     format: 'ULFO'
    //   }
    // }

  ],
  // publishers: [
  //   {
  //     name: '@electron-forge/publisher-s3',
  //     config: {
  //       bucket: 'my-bucket',
  //       public: true
  //     }
  //   }
  // ],
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
      port: 7463,
      loggerPort: 9001,  // Changed from default 9000 to avoid conflict
    }),
  ],
};

export default config;
