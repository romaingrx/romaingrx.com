export function enableBackdropDismissal(dialog: HTMLDialogElement): void {
  let pointerStartedOnBackdrop = false;
  let pointerEndedOnBackdrop = false;

  dialog.addEventListener('pointerdown', (event) => {
    pointerStartedOnBackdrop = event.target === dialog;
    pointerEndedOnBackdrop = false;
  });
  dialog.addEventListener('pointerup', (event) => {
    pointerEndedOnBackdrop = event.target === dialog;
  });
  dialog.addEventListener('pointercancel', () => {
    pointerStartedOnBackdrop = false;
    pointerEndedOnBackdrop = false;
  });
  dialog.addEventListener('click', (event) => {
    const clickedBackdrop =
      pointerStartedOnBackdrop && pointerEndedOnBackdrop && event.target === dialog;
    pointerStartedOnBackdrop = false;
    pointerEndedOnBackdrop = false;

    if (clickedBackdrop && dialog.open) dialog.close();
  });
}

export function showModal(dialog: HTMLDialogElement, opener: HTMLElement): void {
  if (dialog.open) return;

  opener.focus({ preventScroll: true });
  dialog.showModal();
}
