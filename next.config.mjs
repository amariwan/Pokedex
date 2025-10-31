/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
 		// serverActions must be an object in Next.js v16+ (not a boolean)
 		serverActions: {},
		optimizePackageImports: [
			'@tabler/icons-react',
			'lucide-react',
			'@radix-ui/react-dialog',
			'@radix-ui/react-dropdown-menu',
			'@radix-ui/react-progress',
			'@radix-ui/react-select',
		],
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'raw.githubusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'github.com',
			},
			{
				protocol: 'https',
				hostname: 'img.pokemondb.net',
			},
		],
	},
	// enable cacheComponents to opt-in to the merged Partial Prerendering behavior
	cacheComponents: true,

	// typedRoutes is no longer under `experimental` in Next.js 16
	typedRoutes: true,
};

export default nextConfig;
