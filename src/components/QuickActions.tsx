'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Icons } from './icons';

interface QuickActionsProps {
	onCompare: () => void;
	onFilter: () => void;
	onRandomPokemon: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
	onCompare,
	onFilter,
	onRandomPokemon,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const actions = [
		{ icon: Icons.arrowRight, label: 'Compare', onClick: onCompare, color: 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/30' },
		{ icon: Icons.settings, label: 'Filter', onClick: onFilter, color: 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-400/30' },
		{ icon: Icons.arrowRight, label: 'Random', onClick: onRandomPokemon, color: 'bg-green-500/20 hover:bg-green-500/30 border-green-400/30' },
	];

	return (
		<div className="fixed bottom-8 right-8 z-50">
			<motion.div
				className="relative"
				initial={false}
				animate={isOpen ? 'open' : 'closed'}
			>
				{/* Action Buttons */}
				<div className="mb-4 flex flex-col gap-3">
					{actions.map((action, index) => (
						<motion.button
							key={action.label}
							onClick={() => {
								action.onClick();
								setIsOpen(false);
							}}
							className={cn(
								'flex items-center gap-3 rounded-full border px-6 py-3 text-white backdrop-blur-xl transition-all',
								action.color
							)}
							variants={{
								open: {
									opacity: 1,
									y: 0,
									transition: { delay: index * 0.1 },
								},
								closed: {
									opacity: 0,
									y: 20,
									transition: { delay: (actions.length - index - 1) * 0.05 },
								},
							}}
							style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
						>
							<action.icon className="h-5 w-5" />
							<span className="font-medium">{action.label}</span>
						</motion.button>
					))}
				</div>

				{/* Main Button */}
				<motion.button
					onClick={() => setIsOpen(!isOpen)}
					className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-blue-500/80 to-purple-600/80 shadow-2xl backdrop-blur-xl transition-all hover:scale-110"
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
				>
					<motion.div
						animate={{ rotate: isOpen ? 45 : 0 }}
						transition={{ duration: 0.2 }}
					>
						<Icons.close className="h-8 w-8 text-white" />
					</motion.div>
				</motion.button>
			</motion.div>
		</div>
	);
};
