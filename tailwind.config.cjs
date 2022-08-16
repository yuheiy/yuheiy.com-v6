const extend = require("just-extend");
const set = require("just-safe-set");
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");
const { parseColor } = require("tailwindcss/lib/util/color");

const dynamicTheme = plugin.withOptions(
	function (options) {
		const styles = {
			":root": {
				...generateDeclarations(options.light),
				"@media (prefers-color-scheme: dark)": {
					...generateDeclarations(options.dark),
				},
			},
		};

		return function ({ addBase }) {
			addBase(styles);
		};
	},
	function (options) {
		return {
			theme: {
				extend: generateTheme(extend(true, {}, options.light, options.dark)),
			},
		};
	}
);

function generateDeclarations(settings) {
	const declarations = {};
	walk(settings, []);
	return declarations;

	function walk(object, path) {
		const parsedColor = parseColor(object);
		if (parsedColor) {
			const variableName = `--dynamic-${path.join("-")}`;
			declarations[variableName] = parsedColor.color.join(" ");
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
		if (typeof object === "string") {
			const variableName = `--dynamic-${path.join("-")}`;
			set(
				theme,
				[path[0], "dynamic", ...path.slice(1)].join("."),
				`rgb(var(${variableName}) / <alpha-value>)`
			);
			return;
		}

		for (const [key, value] of Object.entries(object)) {
			walk(value, [...path, key]);
		}
	}
}

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
			ringColor: {
				DEFAULT: "rgb(var(--dynamic-ringColor-DEFAULT))",
			},
			ringOpacity: {
				DEFAULT: 1,
			},
			borderColor: {
				DEFAULT: "rgb(var(--dynamic-borderColor-DEFAULT) / <alpha-value>)",
			},
			fontFamily: {
				sans: ["sans-serif"],
			},
		},
	},
	corePlugins: {
		container: false,
	},
	plugins: [
		dynamicTheme({
			light: {
				backgroundColor: {
					DEFAULT: colors.white,
					variant: colors.slate["100"],
				},
				borderColor: {
					DEFAULT: colors.gray["200"],
				},
				ringColor: {
					DEFAULT: colors.gray["200"],
				},
				textColor: {
					DEFAULT: colors.gray["800"],
					muted: colors.gray["500"],
				},
				textDecorationColor: {
					DEFAULT: colors.gray["400"],
				},
			},
			dark: {
				backgroundColor: {
					DEFAULT: colors.neutral["900"],
					variant: colors.neutral["800"],
				},
				borderColor: {
					DEFAULT: colors.neutral["700"],
				},
				ringColor: {
					DEFAULT: colors.neutral["700"],
				},
				textColor: {
					DEFAULT: colors.gray["50"],
					muted: colors.gray["400"],
				},
				textDecorationColor: {
					DEFAULT: colors.gray["400"],
				},
			},
		}),
		container,
		kerning,
	],
};
