import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function detectIOS() {
	return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function detectStandalone() {
	return (
		window.matchMedia('(display-mode: standalone)').matches ||
		(navigator as Navigator & { standalone?: boolean }).standalone === true
	);
}

export function useInstallPWA() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
	const [isInstalled, setIsInstalled] = useState(false);
	const [isIOS, setIsIOS] = useState(false);

	useEffect(() => {
		if (detectStandalone()) {
			setIsInstalled(true);
			return;
		}

		setIsIOS(detectIOS());

		const handler = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		};

		window.addEventListener('beforeinstallprompt', handler);
		window.addEventListener('appinstalled', () => {
			setIsInstalled(true);
			setDeferredPrompt(null);
		});

		return () => window.removeEventListener('beforeinstallprompt', handler);
	}, []);

	const install = async () => {
		if (!deferredPrompt) return;
		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === 'accepted') setIsInstalled(true);
		setDeferredPrompt(null);
	};

	return {
		canInstall: !!deferredPrompt && !isInstalled,
		isIOS: isIOS && !isInstalled,
		isInstalled,
		install,
	};
}
