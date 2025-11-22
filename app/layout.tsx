import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Secret Santa Generator',
  description: 'Generate random Secret Santa gift exchange assignments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

