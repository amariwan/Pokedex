'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import Tooltip from '@/components/Tooltip';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { useGetPokemon } from '@/hooks/use-pokeapi';
import { useSound } from '@/hooks/use-sound';
import { useTiltEffect } from '@/hooks/use-tilt-effect';
import { formatMetric } from '@/lib/formatters';
import { getPokemonArtworkUrl } from '@/lib/pokemon-images';
import { TYPE_BADGE_COLORS, typeGradient } from '@/lib/pokemon-theme';
import { capitalize, cn } from '@/lib/utils';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { type PokemonCardProps } from '@/types';

import { Icons } from './icons';

export const PokemonCard = ({ name, initialData, priority, className }: PokemonCardProps) => {
	const [imageLoaded, setImageLoaded] = useState(false);
	const isFavorite = useFavoritesStore((state) => state.isFavorite(name));
	const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

	// New modern features
	const { playPokemonCry, playHoverSound, vibrate } = useSound();
	const {
		ref: tiltRef,
		handleMouseMove,
		handleMouseLeave,
		handleMouseEnter,
	} = useTiltEffect({
		max: 8,
		scale: 1.03,
		glare: true,
		maxGlare: 0.3,
	});
	const [intersectionRef, isVisible] = useIntersectionObserver({
		threshold: 0.1,
		freezeOnceVisible: true,
	});

	const { data: pokemonObject, isLoading } = useGetPokemon(name, {
		initialData: initialData ?? undefined,
	});

	const primaryType = pokemonObject?.types?.[0]?.type.name ?? 'default';

	const cardGradient = typeGradient(primaryType);

	const imageSrc = useMemo(() => {
		if (!pokemonObject) {
			return null;
		}

		return (
			pokemonObject.sprites.other['official-artwork'].front_default ??
			getPokemonArtworkUrl(pokemonObject.id)
		);
	}, [pokemonObject]);

	useEffect(() => {
		setImageLoaded(false);
	}, [imageSrc]);

	if (isLoading || !pokemonObject) {
		return (
			<div className='w-full overflow-hidden rounded-3xl border border-white/5 bg-slate-900/70 p-6 shadow-lg'>
				<div className='flex animate-pulse flex-col items-center gap-6'>
					<div className='h-28 w-28 rounded-2xl bg-slate-800/80' />
					<div className='h-4 w-32 rounded-full bg-slate-800/80' />
					<div className='flex w-full flex-col gap-3'>
						<div className='h-3 w-full rounded-full bg-slate-800/80' />
						<div className='h-3 w-3/4 rounded-full bg-slate-800/60' />
					</div>
				</div>
			</div>
		);
	}

	const { id, height, weight, types } = pokemonObject;
	const heightMetric = formatMetric(height, 10, ' m');
	const weightMetric = formatMetric(weight, 10, ' kg');

	const handleCardClick = () => {
		if (pokemonObject?.id) {
			vibrate(30);
		}
	};

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		toggleFavorite(name);
		vibrate([50, 100, 50]);
		playHoverSound();
	};

	const handleCardHover = () => {
		if (pokemonObject?.id) {
			playPokemonCry(pokemonObject.id);
		}
	};

	return (
		<article
			ref={(node) => {
				// Combine refs for tilt and intersection observer
				if (tiltRef && 'current' in tiltRef) {
					(tiltRef.current as HTMLElement | null) = node;
				}
				if (intersectionRef && 'current' in intersectionRef) {
					(intersectionRef.current as HTMLElement | null) = node;
				}
			}}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			onMouseEnter={() => {
				handleMouseEnter();
				handleCardHover();
			}}
			style={{
				opacity: isVisible ? 1 : 0,
				transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
				transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
			}}
			className={cn(
				'relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg transition duration-300 hover:shadow-2xl',
				'bg-gradient-to-br backdrop-blur-xl',
				cardGradient,
				className,
			)}
		>
			{/* Tilt glare effect */}
			<div className='tilt-glare pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100' />

			<div className='pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-white/10 blur-3xl' />
			<div className='pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/5 blur-3xl' />

			<button
				onClick={handleFavoriteClick}
				aria-pressed={isFavorite}
				aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
				className='absolute top-4 right-4 z-10 rounded-full border border-white/20 bg-white/10 p-2 text-white transition-all duration-200 hover:scale-110 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none'
			>
				<Tooltip text={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
					{isFavorite ? (
						<Icons.heartFilled className='h-5 w-5' />
					) : (
						<Icons.heart className='h-5 w-5' />
					)}
				</Tooltip>
			</button>

			<Link
				href={`/pokemon/${name}`}
				onClick={handleCardClick}
				className='relative flex h-full flex-1 flex-col items-center justify-between text-center'
				aria-label={`View ${name} details`}
			>
				<span className='mb-3 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium tracking-[0.4em] text-white/70 uppercase'>
					#{id.toString().padStart(3, '0')}
				</span>
				<div className='relative mb-4 flex h-32 w-32 items-center justify-center drop-shadow-[0_20px_35px_rgba(15,23,42,0.45)]'>
					{!imageLoaded && (
						<div className='absolute inset-0 animate-pulse rounded-2xl bg-white/20 backdrop-blur' />
					)}
					{imageSrc ? (
						<Image
							src={imageSrc}
							alt={pokemonObject?.name || 'Pokémon'}
							width={160}
							height={160}
							className={cn(
								'object-contain transition-opacity duration-500',
								imageLoaded ? 'opacity-100' : 'opacity-0',
							)}
							priority={!!priority}
							loading={priority ? 'eager' : 'lazy'}
							decoding='async'
							onLoad={() => setImageLoaded(true)}
						/>
					) : (
						<div className='flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-white/20 text-xs text-white/60'>
							No image
						</div>
					)}
				</div>

				<h2 className='text-lg font-semibold text-white'>{capitalize(name)}</h2>

				<div className='mt-3 flex flex-wrap justify-center gap-2'>
					{types.map((type) => {
						const style = TYPE_BADGE_COLORS[type.type.name] ?? TYPE_BADGE_COLORS.default;
						return (
							<span
								key={type.type.name}
								className={cn(
									'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase backdrop-blur',
									style,
								)}
							>
								{capitalize(type.type.name)}
							</span>
						);
					})}
				</div>

				<div className='mt-6 grid w-full grid-cols-2 gap-3 text-left text-sm text-white/80'>
					<div className='rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur'>
						<span className='block text-[10px] tracking-widest text-white/60 uppercase'>
							Height
						</span>
						<span className='text-sm font-semibold text-white'>{heightMetric}</span>
					</div>
					<div className='rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur'>
						<span className='block text-[10px] tracking-widest text-white/60 uppercase'>
							Weight
						</span>
						<span className='text-sm font-semibold text-white'>{weightMetric}</span>
					</div>
				</div>
			</Link>
		</article>
	);
};
