const BASE_URL = 'https://pokeapi.co/api/v2';

type FetchMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface FetchOptions {
	init?: RequestInit;
	method?: FetchMethod;
	signal?: AbortSignal;
}

interface NextFetchRequestConfig {
	revalidate?: number | false;
	tags?: string[];
}

interface ExtendedRequestInit extends RequestInit {
	next?: NextFetchRequestConfig;
}

const normalizeEndpoint = (endpoint: string): string =>
	endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

const buildUrl = (endpoint: string): string =>
	endpoint.startsWith('http') ? endpoint : `${BASE_URL}${normalizeEndpoint(endpoint)}`;

/**
 * Type-safe wrapper for fetching from PokeAPI with Next.js caching.
 * @param endpoint - API endpoint or full URL
 * @param options - Fetch configuration options
 * @returns Typed response data
 * @throws Error if fetch fails
 */
export async function fetchFromPokeApi<T>(
	endpoint: string,
	options: FetchOptions = {},
): Promise<T> {
	const { init, method = 'GET', signal } = options;

	// Default to a cached fetch to avoid uncached access warning with
	// Next.js `cacheComponents` enabled. Callers can override via `init`.
	const mergedInit: ExtendedRequestInit = {
		// prefer provided init values but default to force-cache
		cache: init?.cache ?? 'force-cache',
		...(init ?? {}),
		// provide a default revalidate so Next treats this as cached content
		next: {
			...(init as ExtendedRequestInit)?.next,
			revalidate: (init as ExtendedRequestInit)?.next?.revalidate ?? 60 * 30,
		},
	};

	const response = await fetch(buildUrl(endpoint), {
		method,
		signal,
		headers: {
			'Content-Type': 'application/json',
			...(init?.headers ?? {}),
		},
		...mergedInit,
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`);
	}

	return (await response.json()) as T;
}
