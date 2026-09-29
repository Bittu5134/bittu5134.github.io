import typography from '@tailwindcss/typography';
import baseConfig from './tailwind.config.js';

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  // Only scan blog-relevant templates for this CSS build
  content: [
    "./src/_includes/layouts/post.njk",
    "./src/_includes/layouts/base.njk",
    "./src/blog-archive.njk",
    "./src/blogs/**/*.{md,njk}",
  ],
  plugins: [typography],
};
