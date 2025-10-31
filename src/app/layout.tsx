import { Footer } from '@/components/Footer';
import PwaRegister from '@/components/pwa-register';
import QueryProvider from '@/components/query-provider';
import SiteHeader from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';
import '@/styles/globals.css';
import React, { Suspense } from 'react';

export const metadata = {
	title: 'Pokédex App',
	description: 'Explore over 800 Pokémon with detailed information in our beautifully designed Pokédex app.',
	keywords: 'Pokémon, Pokédex, Pokémon API, Next.js, Tailwind CSS, TypeScript',
	image: 'https://pokedex.alandmariwan.vercel.app/og-image.png',
	url: 'https://pokedex.alandmariwan.vercel.app/',
	type: 'website',
	siteName: 'Pokédex App',
	locale: 'en_US',
	twitterCardType: 'summary_large_image',
	twitterTitle: 'Pokédex App',
	twitterDescription: 'Explore over 800 Pokémon with detailed information in our beautifully designed Pokédex app.',
	twitterImage: 'https://pokedex.alandmariwan.vercel.app/og-image.png',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className='bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300'>
				<ThemeProvider attribute='class' defaultTheme='dark'>
					<a href='#main' className='sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 z-50 bg-white dark:bg-gray-800 px-3 py-2 rounded'>Skip to content</a>
					<SiteHeader />
					<PwaRegister />
					<QueryProvider>
						<main id='main'>
							{children}
						</main>
					</QueryProvider>
					<Suspense fallback={<div className='text-center py-6 text-sm text-white/60'>Loading footer…</div>}>
						<Footer />
					</Suspense>
				</ThemeProvider>
			</body>
		</html>
	);
}
