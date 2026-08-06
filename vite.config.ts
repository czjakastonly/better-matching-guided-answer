import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig(({ mode }) => ({
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
    'process.env': '{}',
  },
  plugins: [
    react({ jsxRuntime: 'classic' }),
    svgr({ include: '**/*.svg' }),
  ],
  resolve: {
    alias: [
      { find: '@ui', replacement: path.resolve(__dirname, 'src/ui') },
      { find: '@editorCommon', replacement: path.resolve(__dirname, 'src/editorCommon') },
      { find: '@stonlyCommons', replacement: path.resolve(__dirname, 'src/shims/stonlyCommons') },
      { find: 'stonly-editor', replacement: path.resolve(__dirname, 'src/stonly-editor') },
      { find: 'helpers', replacement: path.resolve(__dirname, 'src/shims/stonlyCommons/helpers') },
      { find: 'resources/icons', replacement: path.resolve(__dirname, 'src/commonsIcons') },
      { find: 'resources', replacement: path.resolve(__dirname, 'src/commonsResources') },
      { find: 'icons', replacement: path.resolve(__dirname, 'src/commonsIcons') },
      { find: 'global', replacement: path.resolve(__dirname, 'src/shims/stonlyCommons/global') },
    ],
  },
}));
