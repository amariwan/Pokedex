import { Icons } from './icons';

const Loading = () => (
	<main className='flex h-full w-full grow items-center justify-center pt-14'>
		<div className='flex flex-row gap-2 animate-bounce'>
			<Icons.logo />
			<h1>Loading</h1>
		</div>
	</main>
);

export default Loading;
