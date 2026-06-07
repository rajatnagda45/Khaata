
import React from 'react';
import '../landing.css';
import SmoothScroll from '../components/landing/SmoothScroll';
import HeroReveal from '../components/landing/animations/HeroReveal';
import FadeUp from '../components/landing/animations/FadeUp';
import StaggerContainer from '../components/landing/animations/StaggerContainer';
import CounterAnimation from '../components/landing/animations/CounterAnimation';
import Spotlight from '../components/landing/animations/Spotlight';
import ScrollZoom from '../components/landing/animations/ScrollZoom';

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="landing-wrapper bg-white dark:bg-black text-black dark:text-white transition-colors duration-500">
        

  {/*  NAV  */}
  <nav id="nav">
    <div className="container nav-inner">
      <a href="#" className="nav-logo">
        <div className="nav-logo-icon">₹</div>
        <div className="nav-logo-text">Khaata</div>
      </a>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How it works</a>
        <a href="#faq">FAQ</a>
      </div>
      <div className="nav-actions">
        <a href="/invoices" className="btn-login">Log in</a>
        <a href="/invoices" className="nav-btn-primary">Get started &rarr;</a>
      </div>
      <div className="hamburger">☰</div>
    </div>
  </nav>

  {/*  HERO  */}
  <sec
        </div>
      </div>
      <div className="faq-item"  >
        <div className="faq-question" >
          How do I import my existing invoices?
          <div className="faq-icon">+</div>
        </div>
        <div className="faq-answer">
          You can use our provided seed script to load historical data in bulk, or use our simple CSV importer from the settings menu.
        </div>
      </div>
      <div className="faq-item"  >
        <div className="faq-question" >
          Can I manage multiple customers at once?
          <div className="faq-icon">+</div>
        </div>
        <div className="faq-answer">
          Yes, the Customer Directory gives you a unified view of every client, showing complete invoice history and outstanding balances.
        </div>
      </div>
      <div className="faq-item"  >
        <div className="faq-question" >
          Is the data stored securely?
          <div className="faq-icon">+</div>
        </div>
        <div className="faq-answer">
          We use bank-grade encryption for all data at rest and in transit. Your financial data is private and never shared.
        </div>
      </div>
      <div className="faq-item"  >
        <div className="faq-question" >
          What happens if an invoice goes overdue?
          <div className="faq-icon">+</div>
        </div>
        <div className="faq-answer">
          Overdue invoices are automatically highlighted with red warning badges across the dashboard, so you never miss following up on late payments.
        </div>
      </div>
    </div>
  </section

import React from 'react';
import '../landing.css';
import SmoothScroll from '../components/landing/SmoothScroll';
import HeroReveal from '../components/landing/animations/HeroReveal';
import FadeUp from '../components/landing/animations/FadeUp';
import StaggerContainer from '../components/landing/animations/StaggerContainer';
import CounterAnimation from '../components/landing/animations/CounterAnimation';
import Spotlight from '../components/landing/animations/Spotlight';
import ScrollZoom from '../components/landing/animations/ScrollZoom';

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="landing-wrapper bg-white dark:bg-black text-black dark:text-white transition-colors duration-500">
        

  {/*  NAV  */}
  <nav id="nav">
    <div className="container nav-inner">
      <a href="#" className="nav-logo">
        <div className="nav-logo-icon">₹</div>
        <div className="nav-logo-text">Khaata</div>
      </a>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How it works</a>
        <a href="#faq">FAQ</a>
      </div>
      <div className="nav-actions">
        <a href="/invoices" className="btn-login">Log in</a>
        <a href="/invoices" className="nav-btn-primary">Get started &rarr;</a>
      </div>
      <div className="hamburger">☰</div>
    </div>
  </nav>

  {/*  HERO  */}
  <sec
      <div className="faq-item"  >
        <div className="faq-question" >
          Does it support all GST tax rates in India?
          <div className="faq-icon">+</div>
        </div>
        <div className="faq-answer">
          Absolutely. Khaata comes pre-configured with standard Indian GST slabs: 0%, 3%, 5%, 18%, and 28%. Taxes are computed instantly as you create invoices.
        </div>
      </div>
      <div className="faq-item"  >
        <div className="faq-question" >
          How do I import my existing invoices?
          <div className="faq-icon">+</div>
        </div>
        <div className="faq-answer">
          You can use our provided seed script to load historical data in bulk, or use our simple CSV importer from the settings menu.
        </div>
      </div>
      <div className="faq-item"  >
        <div className="faq-question" >
          Can I manage multiple customers at once?
          <div className="faq-icon">+</div>
        </div>
        <div className="faq-answer">
          Yes, the Customer Directory gives you a unified view of every client, showing complete invoice history and outstanding balances.
        </div>
      </div>
      <div className="faq-item"  >
        <div className="faq-question" >
          Is the data stored securely?
          <div className="faq-icon">+</div>
        </div>
        <div className="faq-answer">
          We use bank-grade encryption for all data at rest and in transit. Your financial data is private and never shared.
        </div>
      </div>
      <div className="faq-item"  >
        <div className="faq-question" >
          What happens if an invoice goes overdue?
          <di