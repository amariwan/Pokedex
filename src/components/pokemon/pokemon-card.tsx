import { Suspense } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalize } from '@/lib/utils';
import Link from 'next/link';
import PokemonImageWithShiny from './PokemonImageWithShiny';

type Props = {
	pokemonName: string;
	pokemonImgUrl?: string;
};

export default function PokemonCard({ pokemonName, pokemonImgUrl }: Props) {
	return (
		<Link href={`/pokemon/${pokemonName}`}>
			<Card>
				<CardHeader>
					<CardTitle>{capitalize(pokemonName)}</CardTitle>
				</CardHeader>
				<CardContent className='self-center justify-center flex'>
					<Suspense fallback={<div>Loading...</div>}>
						<PokemonImageWithShiny name={pokemonName} imageUrl={pokemonImgUrl} />
					</Suspense>
				</CardContent>
			</Card>
		</Link>
	);
}
