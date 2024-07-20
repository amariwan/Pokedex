import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export const Header = () => {
	return (
		<header className='bg-white dark:bg-gray-800 shadow-md'>
			<nav className='container mx-auto flex justify-between items-center py-4 px-6'>
				<Link href='/' aria-label='Home'>
					<h1 className='text-4xl font-extrabold text-gray-900 dark:text-gray-100 hover:underline'>Pokédex</h1>
				</Link>
				<div className='flex items-center space-x-4'>
					<ThemeToggle />
				</div>
			</nav>
		</header>
	);
};
