// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        shoppingList: 'shopping-list.html'
      },
    },
  },
});