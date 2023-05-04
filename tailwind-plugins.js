import extend from "just-extend";
import set from "just-safe-set";
import plugin from "tailwindcss/plugin.js";
import Color from "tailwindcss/lib/util/color.js";

export const container = plugin(function ({ addBase, addComponents }) {
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

export const dynamicColors = plugin.withOptions(
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
		const settings = extend(true, {}, options.light, options.dark);
		return {
			theme: {
				extend: generateTheme(settings),
			},
		};
	}
);

function generateDeclarations(settings) {
	const declarations = {};
	walk(settings, []);
	return declarations;

	function walk(object, path) {
		const parsedColor = Color.parseColor(object);
		if (parsedColor) {
			const variableName = `--dynamic-color-${path.join("-")}`;
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
			const variableName = `--dynamic-color-${path.join("-")}`;
			set(
				theme,
				[path[0], "dynamic", ...path.slice(1)],
				`rgb(var(${variableName}) / <alpha-value>)`
			);
			return;
		}

		for (const [key, value] of Object.entries(object)) {
			walk(value, [...path, key]);
		}
	}
}

// https://github.com/w3c/csswg-drafts/issues/6723#issuecomment-1411487571
export const kerning = plugin(function ({ addUtilities }) {
	addUtilities({
		".kerning-none": {
			fontKerning: "none",
			fontFeatureSettings: "normal",
		},
		".kerning-normal": {
			fontKerning: "normal",
			fontFeatureSettings: "normal",
		},
		".kerning-all": {
			fontKerning: "normal",
			fontFeatureSettings: "'palt'",
		},
	});
});
