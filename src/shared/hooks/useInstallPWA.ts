import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPWA() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
	const [isInstalled, setIsInstalled] = useState(false);

	useEffect(() => {
		const isStandalone =
			window.matchMedia('(display-mode: standalone)').matches ||
			(navigator as Navigator & { standalone?: boolean }).standalone === true;

		if (isStandalone) {
			setIsInstalled(true);
			return;
		}

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

	return { canInstall: !!deferredPrompt && !isInstalled, isInstalled, install };
}
