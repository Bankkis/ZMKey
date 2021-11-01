import { defineConfig } from 'vite';
import { posthtmlPlugin } from 'vite-plugin-posthtml';
import include from 'posthtml-include';
import { PostHTMLFeather } from './plugins/posthtml-feather';

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
  },
  plugins: [
    posthtmlPlugin({
      plugins: [include({ encoding: 'utf8', root: './src' }), PostHTMLFeather]
    }),
  ],
});
