import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base:
    command === 'build'
      ? process.env.BASE_URL ||
        (process.env.GITHUB_REPOSITORY
          ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
          : '/fake-el-player/')
      : '/',
  plugins: [
    checker({
      typescript: true,
    }),
    vue(),
  ],
}));

