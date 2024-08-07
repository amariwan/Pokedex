import React from 'react';
import MainNav from '@/components/main-nav';
import { CommandSearch } from './command-search';
import { Icons } from './icons';
import { ModeToggle } from '@/components/ThemeToggle';
type Props = {};

export default function SiteHeader({}: Props) {
	return (
		<header className='supports-backdrop-blur:bg-background/60 fixed top-0 z-40 w-full border-b bg-background/95 shadow-sm backdrop-blur'>
			<div className='flex h-14 px-5'>
				<MainNav />
				<div className='flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end'>
					<div className='w-full flex-1 md:w-auto md:flex-none'>
						<CommandSearch />
					</div>
					<ModeToggle />
					<a href={'https://github.com/amariwan'} target='_blank' rel='noreferrer' aria-label='github link' className='font-medium underline underline-offset-4 hover:opacity-30'>
						<Icons.gitHub className=' h-6 w-6 md:inline-block' />
					</a>
				</div>
			</div>
		</header>
	);
}
