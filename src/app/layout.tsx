import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SpendWise – Expense Tracker',
  description: 'Track and manage your personal finances with ease',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
