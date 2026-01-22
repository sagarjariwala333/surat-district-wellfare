import Link from 'next/link';
import './home.css';

export default function Home() {
  return (
    <div className="home-container">
      <header className="hero">
        <div className="hero-content">
          <h1>Surat District Court Advocate Welfare Fund</h1>
          <p>Ensuring financial security and support for our legal community. Deposit your annual fee or request emergency assistance.</p>
          <div className="hero-actions">
            <Link href="/deposit" className="btn btn-primary">Deposit ₹2,000 Fee</Link>
            <Link href="/help" className="btn btn-secondary">Request Financial Help</Link>
          </div>
        </div>
      </header>

      <section className="features container">
        <div className="feature-card card">
          <h3>Annual Welfare Fee</h3>
          <p>Advocates contribute ₹2,000 per year to maintain their membership in the financial security fund.</p>
        </div>
        <div className="feature-card card">
          <h3>Emergency Assistance</h3>
          <p>Get up to ₹5 Lakh in financial support for medical emergencies and other critical needs.</p>
        </div>
        <div className="feature-card card">
          <h3>Admin Transparency</h3>
          <p>Our digital portal ensures complete transparency in fee collection and help request processing.</p>
        </div>
      </section>
    </div>
  );
}
