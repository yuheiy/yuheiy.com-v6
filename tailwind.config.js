import containerQueries from '@tailwindcss/container-queries';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';

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
      none: '1',
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
  plugins: [containerQueries, cssFiles],
};
