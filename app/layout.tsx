import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Surat District Welfare Portal',
  description: 'Welfare portal for Surat District Court advocates',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="header container">
          <Link href="/" className="logo">SuratWelfare</Link>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/deposit">Deposit</Link>
            <Link href="/help">Request Help</Link>
            <Link href="/admin/members">Paid Members</Link>
            <Link href="/admin/help-requests">Help Requests</Link>
            <Link href="/admin" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Admin</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="container" style={{ padding: '4rem 1rem', borderTop: '1px solid var(--border)', marginTop: '4rem', textAlign: 'center', opacity: 0.7 }}>
          <p>&copy; {new Date().getFullYear()} Surat District Court Advocate Welfare Fund. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
