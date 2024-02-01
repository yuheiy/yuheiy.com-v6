const fs = require('node:fs');
const path = require('node:path');
const extend = require('just-extend');
const set = require('just-safe-set');
const postcss = require('postcss');
const colors = require('tailwindcss/colors');
const { parseColor } = require('tailwindcss/lib/util/color');
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

const dynamicColors = (() => {
  function generateDeclarations(settings) {
    const declarations = {};
    walk(settings, []);
    return declarations;

    function walk(object, path) {
      const parsedColor = parseColor(object);
      if (parsedColor) {
        const variableName = `--dc-${path.join('-')}`;
        declarations[variableName] = parsedColor.color.join(' ');
        return;
      }

      for (const [key, value] of Object.entries(object)) {
        walk(value, [...path, key]);
      }
    }
  }

  function generateTheme(settings) {
    const theme = {};
    walk(settings, []);
    return theme;

    function walk(object, path) {
      if (typeof object === 'string') {
        const variableName = `--dc-${path.join('-')}`;
        set(
          theme,
          [path[0], 'dynamic', ...path.slice(1)],
          `rgb(var(${variableName}) / <alpha-value>)`,
        );
        return;
      }

      for (const [key, value] of Object.entries(object)) {
        walk(value, [...path, key]);
      }
    }
  }

  return plugin.withOptions(
    function (options) {
      const styles = {
        ':root': {
          ...generateDeclarations(options.light),
          '@media (prefers-color-scheme: dark)': {
            ...generateDeclarations(options.dark),
          },
        },
      };

      return function ({ addBase }) {
        addBase(styles);
      };
    },
    function (options) {
      const settings = extend(true, {}, options.light, options.dark);
      return {
        theme: {
          extend: generateTheme(settings),
        },
      };
    },
  );
})();

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
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
      borderColor: {
        DEFAULT: 'rgb(var(--dc-borderColor-DEFAULT) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    cssFiles,
    dynamicColors({
      light: {
        backgroundColor: {
          DEFAULT: colors.white,
          subtle: colors.slate['100'],
        },
        borderColor: {
          DEFAULT: colors.gray['200'],
        },
        ringColor: {
          DEFAULT: colors.gray['200'],
        },
        textColor: {
          DEFAULT: colors.gray['800'],
          muted: colors.gray['500'],
        },
        textDecorationColor: {
          DEFAULT: colors.gray['400'],
        },
      },
      dark: {
        backgroundColor: {
          DEFAULT: colors.zinc['900'],
          subtle: colors.zinc['800'],
        },
        borderColor: {
          DEFAULT: colors.zinc['700'],
        },
        ringColor: {
          DEFAULT: colors.zinc['700'],
        },
        textColor: {
          DEFAULT: colors.zinc['50'],
          muted: colors.zinc['400'],
        },
        textDecorationColor: {
          DEFAULT: colors.zinc['400'],
        },
      },
    }),
  ],
};
