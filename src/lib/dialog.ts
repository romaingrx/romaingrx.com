export function enableBackdropDismissal(dialog: HTMLDialogElement, signal?: AbortSignal): void {
  let pointerStartedOnBackdrop = false;
  let pointerEndedOnBackdrop = false;
  const options = signal ? { signal } : undefined;

  dialog.addEventListener(
    'pointerdown',
    (event) => {
      pointerStartedOnBackdrop = event.target === dialog;
      pointerEndedOnBackdrop = false;
    },
    options,
  );
  dialog.addEventListener(
    'pointerup',
    (event) => {
      pointerEndedOnBackdrop = event.target === dialog;
    },
    options,
  );
  dialog.addEventListener(
    'pointercancel',
    () => {
      pointerStartedOnBackdrop = false;
      pointerEndedOnBackdrop = false;
    },
    options,
  );
  dialog.addEventListener(
    'click',
    (event) => {
      const clickedBackdrop =
        pointerStartedOnBackdrop && pointerEndedOnBackdrop && event.target === dialog;
      pointerStartedOnBackdrop = false;
      pointerEndedOnBackdrop = false;

      if (clickedBackdrop && dialog.open) dialog.close();
    },
    options,
  );
}

export function showModal(dialog: HTMLDialogElement, opener: HTMLElement): void {
  if (dialog.open) return;

  opener.focus({ preventScroll: true });
  dialog.showModal();
}
