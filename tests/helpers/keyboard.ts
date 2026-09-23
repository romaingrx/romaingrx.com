import process from 'node:process';

export function tabKey(browserName: string, reverse = false): string {
  const option = browserName === 'webkit' && process.platform === 'darwin';
  return `${option ? 'Alt+' : ''}${reverse ? 'Shift+' : ''}Tab`;
}
