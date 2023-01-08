const extend = require("just-extend");
const set = require("just-safe-set");
const plugin = require("tailwindcss/plugin");
const { parseColor } = require("tailwindcss/lib/util/color");

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

const dynamicColors = plugin.withOptions(
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
		const parsedColor = parseColor(object);
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

// https://bugs.chromium.org/p/chromium/issues/detail?id=1378462
const kerning = plugin(function ({ addUtilities }) {
	addUtilities({
		".kerning": {
			fontKerning: "normal",
			fontFeatureSettings: "'palt'",
		},
		".not-kerning": {
			fontKerning: "none",
			fontFeatureSettings: "normal",
		},
	});
});

module.exports = {
	container,
	dynamicColors,
	kerning,
};
