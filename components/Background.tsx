import React from 'react';

export default function Background() {
  return (
    <div className="fixed inset-0 z-0">
      <div className="h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-75 dark:from-black dark:to-black" />
    </div>
  );
}
