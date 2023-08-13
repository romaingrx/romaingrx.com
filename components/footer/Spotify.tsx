"use client"
import React from 'react';
import { SpotifyApiContext } from 'react-spotify-api';

export default function SpotifyContext({
  token,
  children,
}: {
  token: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <>
      <SpotifyApiContext.Provider value={token}>
        {children}
      </SpotifyApiContext.Provider>
    </>
  );
}
