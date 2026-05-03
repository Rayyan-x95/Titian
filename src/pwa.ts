import { trackEvent } from '@/utils/telemetry';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;

export function canPromptInstall() {
  return deferredInstallPrompt !== null;
}

export async function promptInstall() {
  if (!deferredInstallPrompt) {
    return false;
  }

  await deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  trackEvent('PWA', `Installation prompt choice: ${choice.outcome}`);
  deferredInstallPrompt = null;

  window.dispatchEvent(new CustomEvent('titan:pwa-install-availability', { detail: false }));

  return choice.outcome === 'accepted';
}

export function registerPWA() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event as BeforeInstallPromptEvent;
    trackEvent('PWA', 'Install prompt available');
    window.dispatchEvent(new CustomEvent('titan:pwa-install-availability', { detail: true }));
  });

  window.addEventListener('appinstalled', () => {
    trackEvent('PWA', 'Application installed successfully');
    deferredInstallPrompt = null;
    window.dispatchEvent(new CustomEvent('titan:pwa-install-availability', { detail: false }));
  });
}
