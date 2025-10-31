'use client';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { PokemonSearchData } from '@/lib/data/pokemon-search';
import { capitalize, cn } from '@/lib/utils';
import { DialogProps } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

// Lightweight client-side fuzzy search using Fuse.js (dynamic import)

export function CommandSearch({ ...props }: DialogProps) {
	const pokemonSearch = PokemonSearchData.results;
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	// results are objects with item + optional matches from Fuse
	const [results, setResults] = useState<Array<{ item: typeof pokemonSearch[number]; matches?: any[] }>>(pokemonSearch.slice(0, 50).map((p) => ({ item: p })));

	const fuseRef = useRef<any | null>(null);

	// Build a small in-memory Fuse index on mount (client only)
	useEffect(() => {
		let mounted = true;
		import('fuse.js').then((mod) => {
			const Fuse = (mod as any).default ?? (mod as any);
			fuseRef.current = new Fuse(pokemonSearch, {
				keys: ['name'],
				threshold: 0.32,
				ignoreLocation: true,
				includeMatches: true,
			});

			if (mounted && !query.trim()) {
				setResults(pokemonSearch.slice(0, 50).map((p) => ({ item: p })));
			}
		});

		return () => {
			mounted = false;
			fuseRef.current = null;
		};
	}, [pokemonSearch]);

	useEffect(() => {
		let active = true;
		if (!query.trim()) {
			setResults(pokemonSearch.slice(0, 50).map((p) => ({ item: p })));
			return;
		}

		if (fuseRef.current) {
			const found = fuseRef.current.search(query, { limit: 50 });
			const mapped = found.map((r: any) => ({ item: r.item as typeof pokemonSearch[number], matches: r.matches }));
			if (active) setResults(mapped);
			return;
		}

		// fallback if fuse isn't ready yet
		import('fuse.js').then((mod) => {
			const Fuse = (mod as any).default ?? (mod as any);
			const fuse = new Fuse(pokemonSearch, { keys: ['name'], threshold: 0.32, ignoreLocation: true, includeMatches: true });
			const found = fuse.search(query, { limit: 50 });
			const mapped = found.map((r: any) => ({ item: r.item as typeof pokemonSearch[number], matches: r.matches }));
			if (active) setResults(mapped);
		});

		return () => {
			active = false;
		};
	}, [query, pokemonSearch]);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	const runCommand = useCallback((command: () => unknown) => {
		setOpen(false);
		command();
	}, []);

	return (
		<>
			<Button variant='outline' className={cn('relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64')} onClick={() => setOpen(true)} {...props}>
				<span className='hidden lg:inline-flex'>Search Pokemon...</span>
				<span className='inline-flex lg:hidden'>Search...</span>
				<kbd className='pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex'>
					<span className='text-xs'>⌘</span>K
				</kbd>
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandInput placeholder='Type a pokemon to search...' value={query} onInput={(e: any) => setQuery(e.currentTarget.value)} />
				<CommandList>
					<CommandGroup heading='Pokemon'>
						{results.map(({ item, matches }, index) => (
							<CommandItem
								key={index}
								onSelect={() => {
									runCommand(() => router.push(`/pokemon/${item.name}`));
								}}
							>
								{/* Highlight matched substrings if available */}
								{renderHighlighted(item.name, matches)}
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}

// Helper to render highlighted text from Fuse matches
function renderHighlighted(name: string, matches?: any[]) {
	if (!matches || matches.length === 0) return <>{capitalize(name)}</>;

	// find the match entry for the 'name' key (Fuse may include key)
	const nameMatch = matches.find((m: any) => m.key === 'name' || m.key === undefined) ?? matches[0];
	const indices: Array<[number, number]> = nameMatch?.indices ?? [];
	if (!indices || indices.length === 0) return <>{capitalize(name)}</>;

	const parts: Array<React.ReactNode> = [];
	let last = 0;
	indices.forEach(([s, e], i) => {
		if (s > last) {
			parts.push(<span key={`t-${i}`}>{capitalize(name.slice(last, s))}</span>);
		}
		parts.push(
			<span key={`m-${i}`} className='font-semibold text-white'>
				{capitalize(name.slice(s, e + 1))}
			</span>,
		);
		last = e + 1;
	});
	if (last < name.length) {
		parts.push(<span key='t-last'>{capitalize(name.slice(last))}</span>);
	}

	return <>{parts}</>;
}
