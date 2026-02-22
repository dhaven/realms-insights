import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Star Realms Game Log Analyzer',
  description: 'Upload and analyze Star Realms game logs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
