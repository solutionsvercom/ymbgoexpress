import React from 'react'
import Navbar from './components/Navbar.jsx'
import HeroSection from './components/HeroSection.jsx'
import StatsStrip from './components/StatsStrip.jsx'
import RoutesSection from './components/RoutesSection.jsx'
import BusFleetSection from './components/BusFleetSection.jsx'
import SeatSelectionSection from './components/SeatSelectionSection.jsx'
import LiveTrackingSection from './components/LiveTrackingSection.jsx'
import ScheduleSection from './components/ScheduleSection.jsx'
import FeaturesSection from './components/FeaturesSection.jsx'
import DealsSection from './components/DealsSection.jsx'
import ReviewsSection from './components/ReviewsSection.jsx'
import AboutSection from './components/AboutSection.jsx'
import ContactSection from './components/ContactSection.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />
      <section id="home"><HeroSection /></section>
      <section id="stats"><StatsStrip /></section>
      <section id="routes"><RoutesSection /></section>
      <section id="fleet"><BusFleetSection /></section>
      <section id="booking"><SeatSelectionSection /></section>
      <section id="tracking"><LiveTrackingSection /></section>
      <section id="schedule"><ScheduleSection /></section>
      <section id="features"><FeaturesSection /></section>
      <section id="deals"><DealsSection /></section>
      <section id="reviews"><ReviewsSection /></section>
      <section id="about"><AboutSection /></section>
      <section id="contact"><ContactSection /></section>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
