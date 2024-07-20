// Ensure this component runs on the client side
'use client';

import { useState, useEffect } from 'react';

// Helper function to manage local storage
const getSavedTheme = (): 'light' | 'dark' => {
	const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
	return savedTheme || 'dark'; // Default to "dark" if no saved theme is found
};

export const ThemeToggle = () => {
	const [theme, setTheme] = useState<'light' | 'dark'>(getSavedTheme);

	useEffect(() => {
		// Update the document class and local storage whenever the theme changes
		document.documentElement.classList.toggle('dark', theme === 'dark');
		localStorage.setItem('theme', theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
	};

	return <button onClick={toggleTheme}>{theme === 'dark' ? '🌞' : '🌙'}</button>;
};
