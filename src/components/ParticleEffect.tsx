'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface ParticleEffectProps {
	type: 'fire' | 'water' | 'electric' | 'grass' | 'psychic' | 'ice' | 'dragon';
	className?: string;
}

const particleConfigs = {
	fire: { color: '#ff6b35', count: 20, speed: 2 },
	water: { color: '#4ecdc4', count: 15, speed: 1.5 },
	electric: { color: '#f7dc6f', count: 25, speed: 3 },
	grass: { color: '#52c41a', count: 18, speed: 1 },
	psychic: { color: '#c678dd', count: 22, speed: 2.5 },
	ice: { color: '#73c6df', count: 20, speed: 1.8 },
	dragon: { color: '#7747bf', count: 30, speed: 2.2 },
};

export const ParticleEffect: React.FC<ParticleEffectProps> = ({ type, className }) => {
	const config = particleConfigs[type];

	const particles = Array.from({ length: config.count }, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: Math.random() * 6 + 2,
		delay: Math.random() * 2,
	}));

	return (
		<div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
			<AnimatePresence>
				{particles.map((particle) => (
					<motion.div
						key={particle.id}
						className="absolute rounded-full opacity-70"
						style={{
							left: `${particle.x}%`,
							top: `${particle.y}%`,
							width: particle.size,
							height: particle.size,
							backgroundColor: config.color,
						}}
						initial={{ opacity: 0, scale: 0 }}
						animate={{
							opacity: [0, 0.8, 0],
							scale: [0, 1, 0],
							y: [0, -50, -100],
						}}
						transition={{
							duration: config.speed,
							delay: particle.delay,
							repeat: Infinity,
							ease: 'easeOut',
						}}
					/>
				))}
			</AnimatePresence>
		</div>
	);
};
