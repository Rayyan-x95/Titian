import { Workbox } from 'workbox-window';

let wb: Workbox | null = null;
let updateDetected = false;

export interface PwaUpdateController {
  isUpdateAvailable: () => boolean;
  applyUpdate: () => Promise<void>;
  subscribe: (listener: (available: boolean) => void) => () => void;
}

export function createPwaUpdateController(): PwaUpdateController {
  const listeners = new Set<(available: boolean) => void>();

  const notify = (available: boolean) => {
    for (const listener of listeners) {
      listener(available);
    }
  };

  const ensureRegistered = async () => {
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

  void ensureRegistered();

  return {
    isUpdateAvailable: () => updateDetected,
    subscribe: (listener) => {
      listeners.add(listener);
      listener(updateDetected);
      return () => listeners.delete(listener);
    },
    applyUpdate: async () => {
      await ensureRegistered();
      if (!wb) {
        window.location.reload();
        return;
      }

      const controlling = navigator.serviceWorker.controller;
      if (!controlling) {
        window.location.reload();
        return;
      }

      controlling.postMessage({ type: 'SKIP_WAITING' });

      await new Promise<void>((resolve) => {
        const onControllerChange = () => {
          navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
          resolve();
        };
        navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
      });

      window.location.reload();
    },
  };
}

