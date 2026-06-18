import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import TryIt from '../components/TryIt'
import ServicesDashboard from '../components/ServicesDashboard'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <TryIt />
        <ServicesDashboard />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
