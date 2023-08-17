import './globals.css'
import type { Metadata } from 'next'
import localFont from "next/font/local";

// "Wise Sans", "Inter", sans - serif;
// Import the font weights you need
const font = localFont({
  src: "../assets/fonts/WorldwiseSans.woff2",
  display: "swap",
});



export const metadata: Metadata = {
  title: 'romaingrx',
  description: 'romaingrx\'s personal website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
