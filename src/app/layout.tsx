import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DriveMate AI | Sri Lankan Driving School Virtual Assistant',
  description: 'AI-powered bilingual assistant for driving lessons, RMV license procedures, NTMI medicals, and course booking in Sri Lanka.',
  keywords: 'driving school sri lanka, rmv trial test, driving license sri lanka, werahera dmt, ntmi medical, sinhala driving school chatbot'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
