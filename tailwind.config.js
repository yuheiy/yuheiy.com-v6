import containerQueries from '@tailwindcss/container-queries'
import colors from "tailwindcss/colors.js"
import { container, dynamicColors, kerning } from "./tailwind-plugins.js";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		fontSize: {
			// https://w3c.github.io/jlreq/#id343
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
				DEFAULT: "rgb(var(--dynamic-color-borderColor-DEFAULT) / <alpha-value>)",
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
		containerQueries,
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
					DEFAULT: colors.zinc["900"],
					variant: colors.zinc["950"],
				},
				borderColor: {
					DEFAULT: colors.zinc["700"],
				},
				ringColor: {
					DEFAULT: colors.zinc["700"],
				},
				textColor: {
					DEFAULT: colors.zinc["50"],
					muted: colors.zinc["400"],
				},
				textDecorationColor: {
					DEFAULT: colors.zinc["400"],
				},
			},
		}),
		kerning,
	],
}
