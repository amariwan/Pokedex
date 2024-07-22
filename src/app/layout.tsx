import '@/styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Footer } from '@/components/Footer';
import SiteHeader from '@/components/site-header';
import QueryProvider from '@/components/query-provider';

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
					<SiteHeader />
					<QueryProvider>{children}</QueryProvider>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
