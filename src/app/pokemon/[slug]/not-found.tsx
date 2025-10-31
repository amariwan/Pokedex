import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function PokemonNotFound() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-center text-white'>
			<h1 className='text-4xl font-semibold sm:text-5xl'>Pokémon not found</h1>
			<p className='text-sm text-white/70 sm:text-base'>
				We couldn&apos;t locate that Pokémon in the Pokédex. Double-check the name or head back to
				the collection.
			</p>
			<Link href='/' prefetch className='inline-flex'>
				<Button size='lg' className='rounded-full px-6'>
					Return to collection
				</Button>
			</Link>
		</main>
	);
}
