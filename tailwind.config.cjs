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

		let keys = [];
		for (const colors of [options.DEFAULT, options.light, options.dark]) {
			keys.push(...Object.keys(colors));
		}
		keys = new Set(keys);

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
			"--gutter-left": "calc(env(safe-area-inset-left) + max(5vw, 1rem))",
			"--gutter-right": "calc(env(safe-area-inset-right) + max(5vw, 1rem))",
		},
	});

	addComponents({
		".container": {
			boxSizing: "content-box",
			maxWidth: "48rem",
			display: "grid",
			gridTemplateColumns: "repeat(auto-fill, 1rem)",
			justifyContent: "center",
			paddingLeft: "var(--gutter-left)",
			paddingRight: "var(--gutter-right)",
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

module.exports = {
	content: ["./src/**/*.{astro,html,md,js,jsx,svelte,ts,tsx,vue}"],
	theme: {
		fontSize: {
			xs: "0.75rem",
			sm: "0.875rem",
			base: "1rem",
			lg: "1.125rem",
			xl: "1.25rem",
			"2xl": "1.5rem",
			"3xl": "1.875rem",
			"4xl": "2.25rem",
			"5xl": "3rem",
			"6xl": "3.75rem",
			"7xl": "4.5rem",
			"8xl": "6rem",
			"9xl": "8rem",
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
				underline: "#b8bdc6",
				outline: colors.gray["200"],
			},
			dark: {
				background: colors.neutral["900"],
				"background-variant": colors.neutral["800"],
				"on-background": colors.gray["50"],
				"on-background-muted": colors.gray["400"],
				underline: colors.gray["500"],
				outline: colors.neutral["700"],
			},
		}),
		container,
		kerning,
	],
};
