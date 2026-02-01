import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 md:py-32">
        <div className="container max-w-screen-xl px-4 mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Surat District Court Advocate Welfare Fund
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Ensuring financial security and support for our legal community. Deposit your annual fee or request emergency assistance.
            </p>
            <div className="flex justify-center pt-4">
              <Button asChild size="xl" className="text-base">
                <Link href="/deposit">Deposit ₹2,000 Fee</Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button asChild variant="secondary" size="lg" className="text-base">
                <Link href="/login">User Login</Link>
              </Button>
              {/* <Button asChild variant="ghost" size="lg" className="text-base text-white/80 hover:text-white hover:bg-white/10">
                <Link href="/register">Create Account</Link>
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-screen-xl px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Annual Welfare Fee</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Advocates contribute ₹2,000 per year to maintain their membership in the financial security fund.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Member Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Registered members get access to financial assistance requests and account management features.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Admin Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Our digital portal ensures complete transparency in fee collection and help request processing.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
