import { type RatioBarProps } from '@/types';

export const RatioBar: React.FC<RatioBarProps> = ({ value }) => {
	if (value === -1) {
		return (
			<div className='rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-xs tracking-[0.3em] text-white/70 uppercase'>
				Genderless species
			</div>
		);
	}

	const femalePercent = Math.round((value / 8) * 100);
	const malePercent = Math.max(0, 100 - femalePercent);

	return (
		<div className='space-y-2'>
			<div className='flex justify-between text-[11px] tracking-[0.3em] text-white/55 uppercase'>
				<span>Female {femalePercent}%</span>
				<span>Male {malePercent}%</span>
			</div>

			<div className='flex h-3 w-full overflow-hidden rounded-full border border-white/15 bg-white/10'>
				<div
					className='h-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500'
					style={{ width: `${femalePercent}%` }}
				/>
				<div
					className='h-full bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500'
					style={{ width: `${malePercent}%` }}
				/>
			</div>
		</div>
	);
};
