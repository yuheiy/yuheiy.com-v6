const plugin = require("tailwindcss/plugin");

const semanticColors = plugin.withOptions(
	function (options) {
		return function ({ addBase, theme }) {
			const forLight = Object.entries(options.light).reduce((previousValue, [key, value]) => {
				previousValue[`--color-${key}`] = theme(`colors.${value}`);
				return previousValue;
			}, {});
			const forDark = Object.entries(options.dark).reduce((previousValue, [key, value]) => {
				previousValue[`--color-${key}`] = theme(`colors.${value}`);
				return previousValue;
			}, {});

			addBase({
				":root": {
					...forLight,
					"@media (prefers-color-scheme: dark)": forDark,
				},
			});
		};
	},
	function (options) {
		const colors = Object.keys(options.light).reduce((previousValue, key) => {
			previousValue[key] = `var(--color-${key})`;
			return previousValue;
		}, {});

		return {
			theme: {
				extend: {
					colors,
				},
			},
		};
	}
);

const container = plugin(function ({ addBase, addComponents }) {
	addBase({
		":root": {
			"--container-margin-left": "calc(env(safe-area-inset-left) + max(5vw, 1.25rem))",
			"--container-margin-right": "calc(env(safe-area-inset-right) + max(5vw, 1.25rem))",
		},
	});

	addComponents({
		".container": {
			boxSizing: "content-box",
			maxWidth: "48rem",
			display: "grid",
			gridTemplateColumns: "repeat(auto-fill, 1rem)",
			justifyContent: "center",
			paddingLeft: "var(--container-margin-left)",
			paddingRight: "var(--container-margin-right)",
			"> *": {
				gridColumn: "1 / -1",
			},
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
			borderColor: () => ({
				DEFAULT: "var(--color-outline)",
			}),
		},
	},
	corePlugins: {
		container: false,
	},
	plugins: [
		semanticColors({
			light: {
				background: "white",
				"background-variant": "slate.100",
				"on-background": "gray.800",
				"on-background-muted": "gray.500",
				underline: "gray.300",
				outline: "gray.200",
			},
			dark: {
				background: "neutral.900",
				"background-variant": "neutral.800",
				"on-background": "gray.50",
				"on-background-muted": "gray.400",
				underline: "gray.500",
				outline: "neutral.700",
			},
		}),
		container,
	],
};
