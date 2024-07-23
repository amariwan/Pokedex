import { useState } from 'react';
import { useGetSpeciesInfo } from '@/hooks/use-pokeapi';
import { capitalize } from '@/lib/utils';
import { SpeciesInfoProps, FlavorTextEntry, LanguageOption, SpeciesInfoX } from '@/types';
import { RatioBar } from '@/components/ratio-bar';
import { Separator } from '@radix-ui/react-separator';
import Loading from '@/components/loading';

export default function SpeciesInfo({ pokemonData }: SpeciesInfoProps) {
	const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
	const { data: speciesInfo, isLoading } = useGetSpeciesInfo(pokemonData.species.url);

	if (isLoading) {
		return <Loading />;
	}

	const { flavor_text_entries = [], color = null, egg_groups = [], gender_rate = 0, capture_rate = 0 }: SpeciesInfoX = speciesInfo as SpeciesInfoX;

	const languageOptions: LanguageOption[] = Array.from(new Set(flavor_text_entries.map((text: FlavorTextEntry) => text.language.name))).map((lang) => ({
		value: lang,
		label: lang.toUpperCase(),
	}));

	const flavorTextMap = new Map(flavor_text_entries.map((text: FlavorTextEntry) => [text.language.name, text.flavor_text]));

	const getFlavorText = (language: string) => flavorTextMap.get(language) || 'No description available';

	const catchRate = Math.round((100 / 255) * capture_rate);

	return (
		<section className='p-6'>
			<div className='container mx-auto'>
				<div className='flex justify-end mb-4'>
					<select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className='p-2 border rounded'>
						{languageOptions.map((lang) => (
							<option key={lang.value} value={lang.value}>
								{lang.label}
							</option>
						))}
					</select>
				</div>

				<div className='flex flex-col gap-6'>
					<h3 className='text-2xl font-bold mb-2'>Description</h3>
					<p className='text-gray-600'>{getFlavorText(selectedLanguage)}</p>

					<h3 className='text-2xl font-bold mb-2'>Abilities</h3>
					<ul className='list-disc list-inside'>
						{pokemonData.abilities.map((ability, index) => (
							<li key={index} className='text-gray-600'>
								{capitalize(ability.ability.name)}
							</li>
						))}
					</ul>

					<h3 className='text-2xl font-bold mb-2'>Gender Ratio</h3>
					<RatioBar value={gender_rate} />

					<div className='flex flex-col md:flex-row gap-6'>
						<div>
							<h3 className='text-2xl font-bold mb-2'>Egg Group</h3>
							<ul className='list-disc list-inside'>
								{egg_groups.map((group, index) => (
									<li key={index} className='text-gray-600'>
										{capitalize(group.name)}
									</li>
								))}
							</ul>
						</div>
						<Separator orientation='vertical' className='bg-gray-300' />
						<div>
							<h3 className='text-2xl font-bold mb-2'>Catch Rate</h3>
							<p className='text-gray-600'>{catchRate}%</p>
						</div>
						<Separator orientation='vertical' className='bg-gray-300' />
						<div>
							<h3 className='text-2xl font-bold mb-2'>Color</h3>
							<p className='text-gray-600'>{capitalize(color?.name ?? 'Unknown')}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
