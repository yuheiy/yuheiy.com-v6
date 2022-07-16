const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

const semanticColors = plugin.withOptions(
	function (options) {
		options = {
			DEFAULT: {},
			light: {},
			dark: {},
			...options,
		};

		return function ({ addBase }) {
			const [forDefault, forLight, forDark] = [options.DEFAULT, options.light, options.dark].map(
				(colors) => {
					const result = {};

					for (const [key, value] of Object.entries(colors)) {
						result[`--color-${key}`] = value;
					}

					return result;
				}
			);

			const result = {
				...forDefault,
			};

			for (const [type, colors] of [
				["light", forLight],
				["dark", forDark],
			]) {
				if (Object.keys(colors).length) {
					result[`@media (prefers-color-scheme: ${type})`] = colors;
				}
			}

			addBase({
				":root": result,
			});
		};
	},
	function (options) {
		options = {
			DEFAULT: {},
			light: {},
			dark: {},
			...options,
		};

		const keys = new Set();
		for (const colors of [options.DEFAULT, options.light, options.dark]) {
			for (const key of Object.keys(colors)) {
				keys.add(key);
			}
		}

		const result = {};
		for (const key of keys) {
			result[key] = `var(--color-${key})`;
		}

		return {
			theme: {
				extend: {
					colors: result,
				},
			},
		};
	}
);

const container = plugin(function ({ addBase, addComponents }) {
	addBase({
		":root": {
			"--container-width": "46rem",
			"--_container-margin": "clamp(1rem, max((100% - var(--container-width)) / 2, 5vw), 6rem)",
			"--container-margin-left": "calc(env(safe-area-inset-left) + var(--_container-margin))",
			"--container-margin-right": "calc(env(safe-area-inset-right) + var(--_container-margin))",
		},
	});

	addComponents({
		".container": {
			display: "grid",
			gridTemplateColumns: "repeat(auto-fill, 1rem)",
			justifyContent: "center",
			maxWidth: "var(--container-width)",
			marginLeft: "var(--container-margin-left)",
			marginRight: "var(--container-margin-right)",
			"> *": {
				gridColumn: "1 / -1",
			},
		},
	});
});

const kerning = plugin(function ({ addUtilities }) {
	addUtilities({
		".kerning": {
			fontKerning: "auto",
			fontFeatureSettings: "'palt'",
		},
		".not-kerning": {
			fontKerning: "none",
			fontFeatureSettings: "normal",
		},
	});
});

/** @type {import('tailwindcss/types').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,md,js,jsx,svelte,ts,tsx,vue}"],
	theme: {
		// https://w3c.github.io/jlreq/#id343
		fontSize: {
			xs: "0.75rem",
			sm: "0.875rem",
			base: "1rem",
			lg: "1.125rem",
			xl: "1.25rem",
			"2xl": "1.5rem",
			"3xl": "1.75rem",
			"4xl": "2rem",
			"5xl": "2.25rem",
			"6xl": "2.5rem",
		},
		lineHeight: {
			tight: "1.5",
			normal: "1.8",
		},
		extend: {
			fontFamily: {
				sans: ["sans-serif"],
			},
			borderColor: ({ theme }) => ({
				DEFAULT: theme("colors.outline"),
			}),
		},
	},
	corePlugins: {
		container: false,
	},
	plugins: [
		semanticColors({
			DEFAULT: {
				background: colors.white,
				"background-variant": colors.slate["100"],
				"on-background": colors.gray["800"],
				"on-background-muted": colors.gray["500"],
				underline: colors.gray["400"],
				outline: colors.gray["200"],
			},
			dark: {
				background: colors.neutral["900"],
				"background-variant": colors.neutral["800"],
				"on-background": colors.gray["50"],
				"on-background-muted": colors.gray["400"],
				underline: colors.gray["400"],
				outline: colors.neutral["700"],
			},
		}),
		container,
		kerning,
	],
};
