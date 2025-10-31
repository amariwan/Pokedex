'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface SoundPlaybackOptions {
	volume?: number;
	playbackRate?: number;
	loop?: boolean;
	muted?: boolean;
	forceRestart?: boolean;
}

interface ToneOptions {
	frequency?: number;
	type?: OscillatorType;
	duration?: number;
	volume?: number;
	attack?: number;
	release?: number;
}

interface SoundState {
	volume: number;
	isMuted: boolean;
	playbackRate: number;
	loop: boolean;
}

interface PlaybackStatus {
	isPlaying: boolean;
	currentSource: string | null;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const clampPlaybackRate = (value: number) => Math.min(4, Math.max(0.25, value));
const normalizeSoundState = (value: SoundState): SoundState => ({
	volume: clamp(value.volume),
	isMuted: value.isMuted,
	playbackRate: clampPlaybackRate(value.playbackRate),
	loop: value.loop,
});

export const useSound = (initialVolume = 0.3) => {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const isMountedRef = useRef(true);

	const settingsRef = useRef<SoundState>(
		normalizeSoundState({
			volume: clamp(initialVolume),
			isMuted: false,
			playbackRate: 1,
			loop: false,
		})
	);
	const [settings, setSettings] = useState<SoundState>(settingsRef.current);
	const [status, setStatus] = useState<PlaybackStatus>({ isPlaying: false, currentSource: null });
	const [vibrationEnabled, setVibrationEnabled] = useState(true);

	const applyExplicitSettings = useCallback((audio: HTMLAudioElement, next: SoundState) => {
		const normalized = normalizeSoundState(next);
		audio.volume = normalized.volume;
		audio.muted = normalized.isMuted;
		audio.playbackRate = normalized.playbackRate;
		audio.loop = normalized.loop;
	}, []);

	const applySettings = useCallback(
		(audio: HTMLAudioElement, overrides?: Partial<SoundState>) => {
			const merged = overrides ? { ...settingsRef.current, ...overrides } : settingsRef.current;
			applyExplicitSettings(audio, merged);
		},
		[applyExplicitSettings]
	);

	const setSettingsAndSync = useCallback(
		(updater: Partial<SoundState> | ((prev: SoundState) => SoundState)) => {
			setSettings((prev) => {
				const next =
					typeof updater === 'function'
						? (updater as (value: SoundState) => SoundState)(prev)
						: { ...prev, ...updater };

					const normalized = normalizeSoundState(next);

					settingsRef.current = normalized;

					if (audioRef.current) {
						applyExplicitSettings(audioRef.current, normalized);
					}

					return normalized;
				});
			},
			[applyExplicitSettings]
		);

	const safeSetStatus = useCallback((updater: PlaybackStatus | ((prev: PlaybackStatus) => PlaybackStatus)) => {
		if (!isMountedRef.current) return;
		setStatus(updater);
	}, []);

	const ensureAudioElement = useCallback(() => {
		if (audioRef.current) {
			return audioRef.current;
		}

		const audio = new Audio();
		audio.crossOrigin = 'anonymous';
		applySettings(audio);
		audioRef.current = audio;
		return audio;
	}, [applySettings]);

	const ensureAudioContext = useCallback(async () => {
		let context = audioContextRef.current;

		if (!context || context.state === 'closed') {
			context = new AudioContext();
			audioContextRef.current = context;
		}

		if (context.state === 'suspended') {
			try {
				await context.resume();
			} catch {
				// Ignore resume failures
			}
		}

		return context;
	}, []);

	const playSound = useCallback(
		async (url: string, options: SoundPlaybackOptions = {}) => {
			if (!url) return;

			try {
				const audio = ensureAudioElement();
				const { forceRestart = true, volume, playbackRate, loop, muted } = options;

				if (forceRestart || audio.src !== url) {
					audio.pause();
					audio.currentTime = 0;
					audio.src = url;
				}

				const overrides: Partial<SoundState> = {};

				if (typeof volume === 'number') overrides.volume = clamp(volume);
				if (typeof playbackRate === 'number') overrides.playbackRate = playbackRate;
				if (typeof loop === 'boolean') overrides.loop = loop;
				if (typeof muted === 'boolean') overrides.isMuted = muted;

				applySettings(audio, overrides);

				audio.onended = () => safeSetStatus({ currentSource: null, isPlaying: false });
				audio.onpause = () =>
					safeSetStatus((prev) => ({ ...prev, isPlaying: false, currentSource: prev.currentSource }));
				audio.onplay = () => safeSetStatus({ currentSource: url, isPlaying: true });

				await audio.play();

				safeSetStatus({ currentSource: url, isPlaying: true });
			} catch {
				// Silently ignore playback errors
			}
		},
		[applySettings, ensureAudioElement, safeSetStatus]
	);

	const playPokemonCry = useCallback(
		async (pokemonId: number, options?: SoundPlaybackOptions) => {
			const url = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;
			await playSound(url, { forceRestart: true, ...options });
		},
		[playSound]
	);

	const playHoverSound = useCallback(
		async (options: ToneOptions = {}) => {
			try {
				const context = await ensureAudioContext();
				const {
					frequency = 800,
					type = 'sine',
					duration = 0.12,
					volume = 0.05,
					attack = 0.01,
					release = 0.08,
				} = options;

				const oscillator = context.createOscillator();
				const gainNode = context.createGain();

				oscillator.type = type;
				oscillator.frequency.value = frequency;
				gainNode.gain.setValueAtTime(0, context.currentTime);

				oscillator.connect(gainNode);
				gainNode.connect(context.destination);

				const start = context.currentTime;
				const end = start + Math.max(duration, attack + release);

				gainNode.gain.cancelScheduledValues(start);
				gainNode.gain.linearRampToValueAtTime(volume, start + attack);
				gainNode.gain.linearRampToValueAtTime(volume, end - release);
				gainNode.gain.linearRampToValueAtTime(0, end);

				oscillator.start(start);
				oscillator.stop(end);
				oscillator.onended = () => {
					oscillator.disconnect();
					gainNode.disconnect();
				};
			} catch {
				// Silently fail if tone cannot be produced
			}
		},
		[ensureAudioContext]
	);

	const pause = useCallback(() => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.pause();
	}, []);

	const resume = useCallback(async () => {
		const audio = audioRef.current;
		if (!audio) return;
		try {
			await audio.play();
		} catch {
			// Ignore resume errors
		}
	}, []);

	const stop = useCallback(() => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.pause();
		audio.currentTime = 0;
		safeSetStatus({ currentSource: null, isPlaying: false });
	}, [safeSetStatus]);

	const seek = useCallback((time: number) => {
		const audio = audioRef.current;
		if (!audio) return;
		const target = clamp(time, 0, audio.duration || time);
		audio.currentTime = target;
	}, []);

	const setVolume = useCallback(
		(value: number) => {
			const clamped = clamp(value);
			setSettingsAndSync((prev) => ({ ...prev, volume: clamped }));
		},
		[setSettingsAndSync]
	);

	const toggleMute = useCallback(
		(value?: boolean) => {
			setSettingsAndSync((prev) => ({
				...prev,
				isMuted: typeof value === 'boolean' ? value : !prev.isMuted,
			}));
		},
		[setSettingsAndSync]
	);

	const setPlaybackRate = useCallback(
		(rate: number) => {
			setSettingsAndSync((prev) => ({ ...prev, playbackRate: rate }));
		},
		[setSettingsAndSync]
	);

	const setLoop = useCallback(
		(loop: boolean) => {
			setSettingsAndSync((prev) => ({ ...prev, loop }));
		},
		[setSettingsAndSync]
	);

	const toggleLoop = useCallback(() => {
		setSettingsAndSync((prev) => ({ ...prev, loop: !prev.loop }));
	}, [setSettingsAndSync]);

	const vibrate = useCallback(
		(pattern: number | number[] = 50) => {
			if (!vibrationEnabled) return;
			if ('vibrate' in navigator) {
				navigator.vibrate(pattern);
			}
		},
		[vibrationEnabled]
	);

	const toggleVibration = useCallback((value?: boolean) => {
		setVibrationEnabled((prev) => (typeof value === 'boolean' ? value : !prev));
	}, []);

	const controllerState = useMemo(
		() => ({
			volume: settings.volume,
			isMuted: settings.isMuted,
			playbackRate: settings.playbackRate,
			loop: settings.loop,
			isPlaying: status.isPlaying,
			currentSource: status.currentSource,
		}),
		[settings, status]
	);

	const getAudioElement = useCallback(() => audioRef.current, []);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;

			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.src = '';
			}

			if (audioContextRef.current) {
				audioContextRef.current.close().catch(() => {
					// Ignore close errors
				});
			}
		};
	}, []);

	return {
		playPokemonCry,
		playHoverSound,
		playSound,
		pause,
		resume,
		stop,
		seek,
		setVolume,
		toggleMute,
		setMuted: toggleMute,
		setPlaybackRate,
		setLoop,
		toggleLoop,
		state: controllerState,
		getAudioElement,
		vibrate,
		vibrationEnabled,
		toggleVibration,
	};
};
