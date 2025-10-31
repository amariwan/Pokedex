'use client';

import { Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSound } from '@/hooks/use-sound';

export function ToggleSound() {
	const { state, toggleMute } = useSound();

	return (
		<Button variant='outline' size='icon' onClick={() => toggleMute()}>
			<Volume2
				className={`h-[1.2rem] w-[1.2rem] ${state.isMuted ? 'scale-0' : 'scale-100'} transition-all`}
			/>
			<VolumeX
				className={`absolute h-[1.2rem] w-[1.2rem] ${state.isMuted ? 'scale-100' : 'scale-0'} transition-all`}
			/>
			<span className='sr-only'>Toggle sound</span>
		</Button>
	);
}
