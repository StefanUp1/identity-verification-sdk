import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Tell Vue compiler these tags are native custom elements, not Vue components.
          isCustomElement: (tag) => tag.startsWith("idsdk-"),
        },
      },
    }),
  ],
});
