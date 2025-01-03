import containerQueries from '@tailwindcss/container-queries';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import colors from 'tailwindcss/colors.js';
import plugin from 'tailwindcss/plugin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads CSS files through Tailwind’s plugin system to enable IntelliSense support.
 *
 * This plugin scans CSS files from `src/styles/{base,components,utilities}` and appends them to
 * their respective layers.
 */
const cssFiles = plugin(({ addBase, addComponents, addUtilities }) => {
  const layers = ['base', 'components', 'utilities'];
  const stylesDirectoryPath = path.join(__dirname, 'src/styles');
  const addStylesMap = {
    base: addBase,
    components: addComponents,
    utilities: addUtilities,
  };

  for (const layer of layers) {
    const layerDirectoryPath = path.join(stylesDirectoryPath, layer);
    const fileNames = fs.readdirSync(layerDirectoryPath);
    const addStyles = addStylesMap[layer];

    for (const fileName of fileNames) {
      if (path.extname(fileName) === '.css') {
        const filePath = path.join(layerDirectoryPath, fileName);
        const content = fs.readFileSync(filePath, 'utf8');
        const styles = postcss.parse(content);
        addStyles(styles.nodes);
      }
    }
  }
});

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  safelist: ['astro-code'],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.375rem',
      '2xl': '1.625rem',
    },
    lineHeight: {
      none: '1',
      tight: '1.5',
      normal: '1.8',
    },
    extend: {
      spacing: {
        0.5: '0.0625rlh',
        1: '0.125rlh',
        1.5: '0.1875rlh',
        2: '0.25rlh',
        2.5: '0.3125rlh',
        3: '0.375rlh',
        3.5: '0.4375rlh',
        4: '0.5rlh',
        5: '0.625rlh',
        6: '0.75rlh',
        7: '0.875rlh',
        8: '1rlh',
        9: '1.125rlh',
        10: '1.25rlh',
        11: '1.375rlh',
        12: '1.5rlh',
        14: '1.75rlh',
        16: '2rlh',
        20: '2.5rlh',
        24: '3rlh',
        28: '3.5rlh',
        32: '4rlh',
        36: '4.5rlh',
        40: '5rlh',
        44: '5.5rlh',
        48: '6rlh',
        52: '6.5rlh',
        56: '7rlh',
        60: '7.5rlh',
        64: '8rlh',
        72: '9rlh',
        80: '10rlh',
        96: '12rlh',
        rect: 'calc(1rlh + (1rlh - 1rem) / 2)',
        rect2: 'calc(1rlh + 1rlh - 1rem)',
      },
      fontFamily: {
        sans: ['sans-serif'],
      },
      backgroundColor: {
        dynamic: {
          DEFAULT: `light-dark(${colors.white}, ${colors.zinc['900']})`,
          inset: `light-dark(${[
            `color-mix(in srgb, ${colors.white}, ${colors.slate['100']})`,
            `color-mix(in srgb, ${colors.zinc['800']}, ${colors.zinc['900']})`,
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
  plugins: [containerQueries, cssFiles],
};
