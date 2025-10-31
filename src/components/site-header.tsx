import MainNav from '@/components/main-nav';
import { ToggleSound } from '@/components/ToggleSound';

import { CommandSearch } from './command-search';
import { Icons } from './icons';
type Props = {};

export default function SiteHeader({}: Props) {
	return (
		<header className='supports-backdrop-blur:bg-background/60 bg-background/95 fixed top-0 z-40 w-full border-b shadow-sm backdrop-blur'>
			<div className='flex h-14 px-5'>
				<MainNav />
				<div className='flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end'>
					<div className='w-full flex-1 md:w-auto md:flex-none'>
						<CommandSearch />
					</div>
					<ToggleSound />
					<a
						href={'https://github.com/amariwan'}
						target='_blank'
						rel='noreferrer'
						aria-label='github link'
						className='font-medium underline underline-offset-4 hover:opacity-30'
					>
						<Icons.gitHub className='h-6 w-6 md:inline-block' />
					</a>
				</div>
			</div>
		</header>
	);
}
