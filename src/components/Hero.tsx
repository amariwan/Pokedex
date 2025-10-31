import Image from 'next/image';
import Link from 'next/link';

const FEATURED_POKEMON = {
	name: 'Charizard',
	id: 6,
	image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
	type: 'Fire / Flying',
};

export default function Hero() {
	return (
		<section className='relative overflow-hidden bg-slate-950 text-white'>
			<div className='absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-600/30 to-slate-900' />
			<div className='absolute inset-0 bg-grid-pattern opacity-60 mask-radial-fade' />
			<div className='relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 py-20 md:flex-row md:items-stretch lg:px-10'>
				<div className='flex w-full flex-col justify-center space-y-8 md:max-w-xl'>
					<span className='inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70'>
						Pokédex 2.0
					</span>
					<h1 className='text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl'>
						Discover & curate your dream Pokédex.
					</h1>
					<p className='text-base text-white/70 sm:text-lg'>
						Search hundreds of Pokémon with official artwork, detailed stats, and effortless favoriting. Built for speed, powered by PokéAPI.
					</p>
					<div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
						<Link
							href='#collection'
							className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:ring-4 focus-visible:ring-white/20 sm:w-auto'
						>
							Browse Collection
						</Link>
						<Link
							href='/pokemon/pikachu'
							className='inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-transform duration-200 hover:scale-105 hover:border-white/60 focus-visible:ring-4 focus-visible:ring-white/10 sm:w-auto'
						>
							Surprise Me
						</Link>
					</div>
					<dl className='grid grid-cols-2 gap-6 pt-8 text-white/60 sm:grid-cols-3'>
						<div>
							<dt className='text-xs uppercase tracking-wide'>Pokémon Indexed</dt>
							<dd className='text-2xl font-semibold text-white'>900+</dd>
						</div>
						<div>
							<dt className='text-xs uppercase tracking-wide'>Favorite Sync</dt>
							<dd className='text-2xl font-semibold text-white'>Offline ready</dd>
						</div>
						<div>
							<dt className='text-xs uppercase tracking-wide'>Live data</dt>
							<dd className='text-2xl font-semibold text-white'>PokéAPI</dd>
						</div>
					</dl>
				</div>

				<div className='relative mx-auto flex w-full max-w-sm flex-1 justify-center md:max-w-lg'>
					<div className='absolute inset-0 -translate-x-1/3 blur-3xl opacity-40 sm:-translate-x-1/4'>
						<div className='h-full w-full rounded-full bg-purple-500/40' />
					</div>
					<div className='relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/10 px-10 pb-10 pt-16 shadow-[0_40px_80px_-50px_rgba(59,130,246,0.8)] backdrop-blur-xl'>
						<div className='absolute -top-24 -right-14 h-36 w-36 rounded-full bg-pink-400/40 blur-3xl' />
						<div className='absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-indigo-500/40 blur-3xl' />
						<div className='relative flex h-full flex-col items-center justify-between'>
					<div className='relative flex aspect-square w-full max-w-xs items-center justify-center'>
						<Image
							src={FEATURED_POKEMON.image}
							alt={FEATURED_POKEMON.name}
							fill
							sizes='(min-width: 1024px) 350px, (min-width: 768px) 280px, 70vw'
							className='object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)]'
							priority
						/>
					</div>
							<div className='mt-10 w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80 backdrop-blur'>
								<div className='flex items-center justify-between'>
									<span className='font-semibold text-white'>{FEATURED_POKEMON.name}</span>
									<span className='rounded-full border border-white/20 px-3 py-1 text-xs font-medium tracking-widest text-white/70'>
										#{FEATURED_POKEMON.id.toString().padStart(3, '0')}
									</span>
								</div>
								<p className='mt-2 text-xs uppercase tracking-[0.3em]'>{FEATURED_POKEMON.type}</p>
								<p className='mt-4 text-xs text-white/60'>
									A flying inferno with a fierce competitive spirit and one of the most beloved starters of all time.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
