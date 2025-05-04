import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'oklch(var(--border))',
				input: 'oklch(var(--input))',
				ring: 'oklch(var(--ring))',
				background: 'oklch(var(--background))',
				foreground: 'oklch(var(--foreground))',
				primary: {
					DEFAULT: 'oklch(var(--primary))',
					foreground: 'oklch(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'oklch(var(--secondary))',
					foreground: 'oklch(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'oklch(var(--destructive))',
					foreground: 'oklch(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'oklch(var(--muted))',
					foreground: 'oklch(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'oklch(var(--accent))',
					foreground: 'oklch(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'oklch(var(--popover))',
					foreground: 'oklch(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'oklch(var(--card))',
					foreground: 'oklch(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'oklch(var(--sidebar))',
					foreground: 'oklch(var(--sidebar-foreground))',
					primary: 'oklch(var(--sidebar-primary))',
					'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
					accent: 'oklch(var(--sidebar-accent))',
					'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
					border: 'oklch(var(--sidebar-border))',
					ring: 'oklch(var(--sidebar-ring))'
				},
				// Chart colors
				chart: {
					'1': 'oklch(var(--chart-1))',
					'2': 'oklch(var(--chart-2))',
					'3': 'oklch(var(--chart-3))',
					'4': 'oklch(var(--chart-4))',
					'5': 'oklch(var(--chart-5))',
				},
				// Custom ATS colors - keep these for backward compatibility
				ats: {
					blue: {
						DEFAULT: '#0F52BA',
						light: '#39A2DB',
						dark: '#08366E',
					},
					accent: {
						orange: '#FF8C42',
						green: '#4CAF50',
						red: '#F44336',
						yellow: '#FFEB3B',
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-subtle': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				},
				'slide-in': {
					'0%': {
						transform: 'translateX(-100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
				'slide-in': 'slide-in 0.3s ease-out'
			},
			fontFamily: {
				sans: ['Inter var', 'sans-serif'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
