const colors = require("tailwindcss/colors");
const { dynamicColors, container, kerning } = require("./tailwind-plugins.cjs");

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
			borderColor: {
				DEFAULT: "rgb(var(--dynamicColor-borderColor-DEFAULT) / <alpha-value>)",
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
		container,
		dynamicColors({
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
		kerning,
	],
};
