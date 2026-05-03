import { Workbox } from 'workbox-window';

export interface PwaUpdateController {
  isUpdateAvailable: () => boolean;
  applyUpdate: () => Promise<void>;
  subscribe: (listener: (available: boolean) => void) => () => void;
}

export function createPwaUpdateController(): PwaUpdateController {
  const listeners = new Set<(available: boolean) => void>();
  let wb: Workbox | null = null;
  let updateDetected = false;

  const notify = (available: boolean) => {
    for (const listener of listeners) {
      listener(available);
    }
  };

  const ensureRegistered = () => {
    if (import.meta.env.DEV) return;
    if (!('serviceWorker' in navigator)) return;
    if (wb) return;

    wb = new Workbox('/service-worker.js');

    wb.addEventListener('waiting', () => {
      updateDetected = true;
      notify(true);
    });

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        updateDetected = true;
        notify(true);
      }
    });

    void wb.register();
  };

  ensureRegistered();

  return {
    isUpdateAvailable: () => updateDetected,
    subscribe: (listener) => {
      listeners.add(listener);
      listener(updateDetected);
      return () => listeners.delete(listener);
    },
    applyUpdate: async () => {
      ensureRegistered();
      if (!wb) {
        window.location.reload();
        return;
      }

      if (!navigator.serviceWorker.controller) {
        window.location.reload();
        return;
      }

      const controllerChangePromise = new Promise<void>((resolve) => {
        const timeoutId = window.setTimeout(() => {
          navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
          resolve();
        }, 8000);

        const onControllerChange = () => {
          if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
          }
          navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
          resolve();
        };

        navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
      });

      if (wb) {
        void wb.messageSkipWaiting();
      }

      await controllerChangePromise;
      window.location.reload();
    },
  };
}
