import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

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
      <body className="min-h-screen bg-background font-sans antialiased">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              SuratWelfare
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/deposit"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Deposit
              </Link>
              <Link
                href="/help"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Request Help
              </Link>
              <div className="relative group">
                <button className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                  Admin
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-popover border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <Link
                      href="/admin/members"
                      className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div className="font-medium">Paid Members</div>
                      <div className="text-xs text-muted-foreground">View all members who have paid their annual fee</div>
                    </Link>
                    <Link
                      href="/admin/help-requests"
                      className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div className="font-medium">Help Requests</div>
                      <div className="text-xs text-muted-foreground">Manage and review financial assistance requests</div>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            <div className="flex items-center space-x-2">
              <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
                <Link href="/login">User Login</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
                <Link href="/admin">Admin Panel</Link>
              </Button>

              {/* Mobile menu button - you can implement a mobile drawer here */}
              <Button variant="ghost" size="sm" className="md:hidden">
                Menu
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t py-12 md:py-16">
          <div className="container max-w-screen-2xl px-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Surat District Court Advocate Welfare Fund. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
