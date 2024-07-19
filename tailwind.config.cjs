/* eslint-disable */
const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

/**
 * Loads CSS files through Tailwind’s plugin system to enable IntelliSense support.
 *
 * This plugin scans CSS files from `src/styles/{base,components,utilities}` and appends them to
 * their respective layers.
 */
const cssFiles = plugin(({ addBase, addComponents, addUtilities }) => {
  const layers = ['base', 'components', 'utilities'];
  const stylesDir = path.join(__dirname, 'src/styles');
  const addStylesMap = {
    base: addBase,
    components: addComponents,
    utilities: addUtilities,
  };

  for (const layer of layers) {
    const layerDir = path.join(stylesDir, layer);
    const files = fs.readdirSync(layerDir);
    const addStyles = addStylesMap[layer];

    for (const file of files) {
      if (path.extname(file) === '.css') {
        const filePath = path.join(layerDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const styles = postcss.parse(content);
        addStyles(styles.nodes);
      }
    }
  }
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  safelist: ['astro-code'],
  theme: {
    fontSize: {
      // https://w3c.github.io/jlreq/#id343
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.75rem',
      '4xl': '2rem',
      '5xl': '2.25rem',
      '6xl': '2.5rem',
    },
    lineHeight: {
      tight: '1.5',
      normal: '1.8',
    },
    extend: {
      fontFamily: {
        sans: ['sans-serif'],
      },
      backgroundColor: {
        dynamic: {
          DEFAULT: `light-dark(${colors.white}, ${colors.zinc['900']})`,
          inset: `light-dark(${colors.slate['100']}, ${colors.zinc['800']})`,
          muted: `light-dark(${[
            `color-mix(in srgb, ${colors.white}, ${colors.slate['100']})`,
            `color-mix(in srgb, ${colors.zinc['800']} 25%, ${colors.zinc['900']})`,
          ].join(', ')})`,
        },
      },
      borderColor: {
        DEFAULT: `light-dark(${colors.gray['200']}, ${colors.zinc['700']})`,
      },
      ringColor: {
        dynamic: {
          DEFAULT: `light-dark(${colors.gray['200']}, ${colors.zinc['700']})`,
        },
      },
      textColor: {
        dynamic: {
          DEFAULT: `light-dark(${colors.gray['800']}, ${colors.zinc['50']})`,
          muted: `light-dark(${colors.gray['500']}, ${colors.zinc['400']})`,
        },
      },
      textDecorationColor: {
        dynamic: {
          DEFAULT: `light-dark(${colors.gray['400']}, ${colors.zinc['400']})`,
        },
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries'), cssFiles],
};
